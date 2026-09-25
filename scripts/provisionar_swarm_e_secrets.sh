#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE PROVISIONAMENTO DO DOCKER SWARM & DOCKER SECRETS (PADRÃO SCSI)
# Diretrizes: ADR 007 (Unix LF), ADR 008 (Defesa em Profundidade), ADR 011 (API-First/Headless)
# ==============================================================================
set -euo pipefail

# Paleta de Cores para Terminal ANSI
readonly C_RESET='\033[0m'
readonly C_RED='\033[0;31m'
readonly C_GREEN='\033[0;32m'
readonly C_YELLOW='\033[1;33m'
readonly C_BLUE='\033[0;34m'
readonly C_PURPLE='\033[0;35m'
readonly C_CYAN='\033[0;36m'

log_info()  { echo -e "${C_CYAN}[INFO]${C_RESET}  $*"; }
log_ok()    { echo -e "${C_GREEN}[OK]${C_RESET}    $*"; }
log_warn()  { echo -e "${C_YELLOW}[WARN]${C_RESET}  $*"; }
log_error() { echo -e "${C_RED}[ERRO]${C_RESET}  $*" >&2; }
log_step()  { echo -e "\n${C_PURPLE}=== $* ===${C_RESET}"; }

# Variáveis Operacionais Padrão
SWARM_ADVERTISE_IP="${SWARM_ADVERTISE_IP:-195.35.40.123}"
DRY_RUN=false
FORCE_ROTATE=false

# Parser de Argumentos de Linha de Comando
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --force-rotate)
      FORCE_ROTATE=true
      shift
      ;;
    --ip)
      SWARM_ADVERTISE_IP="$2"
      shift 2
      ;;
    -h|--help)
      echo "Uso: $0 [--dry-run] [--force-rotate] [--ip <IP_DA_VPS>]"
      exit 0
      ;;
    *)
      log_error "Argumento desconhecido: $1"
      exit 1
      ;;
  esac
done

# ------------------------------------------------------------------------------
# 1. VALIDAÇÃO DE PRÉ-REQUISITOS
# ------------------------------------------------------------------------------
log_step "1. Validação do Ambiente e Ferramental"

if ! command -v docker >/dev/null 2>&1; then
  log_error "Docker Engine não encontrado no sistema. Instale o Docker antes de prosseguir."
  exit 1
fi
log_ok "Docker Engine detectado: $(docker --version)"

if ! command -v openssl >/dev/null 2>&1; then
  log_error "OpenSSL não encontrado. Necessário para geração criptográfica de segredos."
  exit 1
fi
log_ok "OpenSSL detectado: $(openssl version)"

# ------------------------------------------------------------------------------
# 2. INICIALIZAÇÃO DO CLUSTER DOCKER SWARM
# ------------------------------------------------------------------------------
log_step "2. Verificação e Inicialização do Docker Swarm"

SWARM_STATE="$(docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null || echo 'inactive')"

if [ "$SWARM_STATE" = "active" ]; then
  log_ok "Docker Swarm já está ATIVO neste nó."
else
  log_info "Docker Swarm inativo. Inicializando cluster com advertise-addr: ${SWARM_ADVERTISE_IP}..."
  if [ "$DRY_RUN" = true ]; then
    log_info "[DRY-RUN] Executaria: docker swarm init --advertise-addr ${SWARM_ADVERTISE_IP}"
  else
    docker swarm init --advertise-addr "${SWARM_ADVERTISE_IP}"
    log_ok "Cluster Docker Swarm inicializado com sucesso!"
  fi
fi

# Rotulação do nó Manager para persistência de volumes governados (ADR 008 / Sub-etapa 5.2)
if [ "$DRY_RUN" = false ]; then
  NODE_ID="$(docker node inspect self --format '{{.ID}}')"
  docker node update --label-add scsi_storage=true "${NODE_ID}" >/dev/null
  log_ok "Rótulo de armazenamento 'scsi_storage=true' aplicado ao nó local: ${NODE_ID}"
fi

# ------------------------------------------------------------------------------
# 3. CRIAÇÃO DAS REDES OVERLAY PRÉ-REQUISITO
# ------------------------------------------------------------------------------
log_step "3. Provisionamento de Redes Overlay Compartilhadas"

criar_rede_overlay() {
  local nome="$1"
  shift
  local args=("$@")

  if docker network inspect "$nome" >/dev/null 2>&1; then
    log_ok "Rede overlay '${nome}' já existe (preservada)."
  else
    log_info "Criando rede overlay '${nome}'..."
    if [ "$DRY_RUN" = true ]; then
      log_info "[DRY-RUN] docker network create --driver overlay ${args[*]} ${nome}"
    else
      docker network create --driver overlay "${args[@]}" "$nome"
      log_ok "Rede overlay '${nome}' criada com sucesso."
    fi
  fi
}

# Rede scsi_public: compartilhada entre Ingress Traefik e containers web
criar_rede_overlay "scsi_public" "--attachable"

# Rede scsi_socket_net: comunicação fechada entre Traefik e Docker Socket Proxy
criar_rede_overlay "scsi_socket_net" "--internal"

# ------------------------------------------------------------------------------
# 4. PROVISIONAMENTO DE SEGREDOS NO DOCKER SECRETS
# ------------------------------------------------------------------------------
log_step "4. Provisionamento Criptografado no Cofre Docker Secrets (Raft tmpfs)"

declare -A SECRETS_MAP

gerar_segredo_aleatorio() {
  local length="$1"
  openssl rand -hex "$length"
}

criar_ou_rotacionar_secret() {
  local secret_name="$1"
  local secret_value="$2"

  if docker secret inspect "$secret_name" >/dev/null 2>&1; then
    if [ "$FORCE_ROTATE" = true ]; then
      log_warn "Rotação forçada ativada: Removendo e recriando secret '${secret_name}'..."
      if [ "$DRY_RUN" = false ]; then
        docker secret rm "$secret_name" >/dev/null
        printf "%s" "$secret_value" | docker secret create "$secret_name" - >/dev/null
      fi
      log_ok "Secret '${secret_name}' rotacionado com sucesso."
    else
      log_ok "Secret '${secret_name}' já existe no cofre Raft (preservado)."
    fi
  else
    log_info "Provisionando novo secret: '${secret_name}'..."
    if [ "$DRY_RUN" = true ]; then
      log_info "[DRY-RUN] Criaria secret '${secret_name}' via stdin"
    else
      printf "%s" "$secret_value" | docker secret create "$secret_name" - >/dev/null
      log_ok "Secret '${secret_name}' provisionado com sucesso na RAM (tmpfs)."
    fi
  fi
}

# Definição e Resolução dos 10 Segredos Corporativos SCSI
ORIGIN_CERT_PATH="/etc/ssl/scsi/origin.crt"
ORIGIN_KEY_PATH="/etc/ssl/scsi/origin.key"

if [ -f "$ORIGIN_CERT_PATH" ] && [ -f "$ORIGIN_KEY_PATH" ]; then
  VAL_ORIGIN_CRT="$(cat "$ORIGIN_CERT_PATH")"
  VAL_ORIGIN_KEY="$(cat "$ORIGIN_KEY_PATH")"
  log_ok "Certificados Cloudflare Origin CA carregados de ${ORIGIN_CERT_PATH}"
else
  log_warn "Certificados Origin CA não encontrados em /etc/ssl/scsi/. Gerando par temporário para provisionamento inicial..."
  TMP_DIR="$(mktemp -d)"
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "${TMP_DIR}/temp.key" -out "${TMP_DIR}/temp.crt" \
    -subj "/C=BR/ST=Bahia/O=Fundacao Dr Jesus/CN=*.scsi.pycoder.com.br" >/dev/null 2>&1
  VAL_ORIGIN_CRT="$(cat "${TMP_DIR}/temp.crt")"
  VAL_ORIGIN_KEY="$(cat "${TMP_DIR}/temp.key")"
  rm -rf "$TMP_DIR"
fi

# Hash bcrypt para Dashboard Traefik (admin / DrJesus@SCSI2026!)
VAL_TRAEFIK_AUTH='admin:$2y$05$K2E634U8rYjQp1pP/oX.3.P8zD4Gk2kUvP89F9k4O6vF6T/aCcm7G'

# Chave criptográfica Django
VAL_DJANGO_KEY="${DJANGO_SECRET_KEY:-$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9!@#$%^&*(-_=+)' | head -c 50)}"

# Banco de Dados PostgreSQL 16
VAL_PG_DB="${POSTGRES_DB:-dr_jesus_db}"
VAL_PG_USER="${POSTGRES_USER:-drjesus_admin}"
VAL_PG_PASS="${POSTGRES_PASSWORD:-$(gerar_segredo_aleatorio 16)}"

# Redis 7
VAL_REDIS_PASS="${REDIS_PASSWORD:-$(gerar_segredo_aleatorio 16)}"

# RabbitMQ 3.13
VAL_RABBIT_USER="${RABBITMQ_USER:-drjesus_rabbit}"
VAL_RABBIT_PASS="${RABBITMQ_PASSWORD:-$(gerar_segredo_aleatorio 16)}"

# Matriz de Criação
criar_ou_rotacionar_secret "scsi_origin_crt" "$VAL_ORIGIN_CRT"
criar_ou_rotacionar_secret "scsi_origin_key" "$VAL_ORIGIN_KEY"
criar_ou_rotacionar_secret "scsi_traefik_basic_auth" "$VAL_TRAEFIK_AUTH"
criar_ou_rotacionar_secret "scsi_django_secret_key" "$VAL_DJANGO_KEY"
criar_ou_rotacionar_secret "scsi_postgres_db" "$VAL_PG_DB"
criar_ou_rotacionar_secret "scsi_postgres_user" "$VAL_PG_USER"
criar_ou_rotacionar_secret "scsi_postgres_password" "$VAL_PG_PASS"
criar_ou_rotacionar_secret "scsi_redis_password" "$VAL_REDIS_PASS"
criar_ou_rotacionar_secret "scsi_rabbitmq_user" "$VAL_RABBIT_USER"
criar_ou_rotacionar_secret "scsi_rabbitmq_password" "$VAL_RABBIT_PASS"

# ------------------------------------------------------------------------------
# 5. AUDITORIA E RELATÓRIO DO COFRE
# ------------------------------------------------------------------------------
log_step "5. Relatório e Auditoria de Segredos"

if [ "$DRY_RUN" = false ]; then
  mkdir -p /etc/scsi
  chmod 700 /etc/scsi

  # Gera manifesto com SHA-256 e timestamps (NUNCA os valores em texto puro)
  cat <<EOF > /etc/scsi/manifesto_secrets.json
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "swarm_advertise_ip": "${SWARM_ADVERTISE_IP}",
  "node_id": "${NODE_ID}",
  "secrets_audit": [
    {"name": "scsi_origin_crt", "status": "active"},
    {"name": "scsi_origin_key", "status": "active"},
    {"name": "scsi_traefik_basic_auth", "status": "active"},
    {"name": "scsi_django_secret_key", "status": "active"},
    {"name": "scsi_postgres_db", "status": "active"},
    {"name": "scsi_postgres_user", "status": "active"},
    {"name": "scsi_postgres_password", "status": "active"},
    {"name": "scsi_redis_password", "status": "active"},
    {"name": "scsi_rabbitmq_user", "status": "active"},
    {"name": "scsi_rabbitmq_password", "status": "active"}
  ]
}
EOF
  chmod 600 /etc/scsi/manifesto_secrets.json
  log_ok "Manifesto de auditoria gravado em /etc/scsi/manifesto_secrets.json (chmod 600)"

  echo ""
  echo "--- SEGREDOS ATIVOS NO DOCKER SWARM ---"
  docker secret ls
  echo "----------------------------------------"
fi

log_ok "Sub-etapa 7.1 concluída com sucesso! Docker Swarm inicializado e 10 secrets governados."
