#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE DEPLOY EM PRODUÇÃO NO DOCKER SWARM COM ZERO-DOWNTIME (PADRÃO SCSI)
# Diretrizes: ADR 007 (Unix LF), ADR 008 (Defesa em Profundidade), ADR 011 (API-First/Headless)
# ==============================================================================
set -euo pipefail

# Paleta de Cores ANSI
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

# Parâmetros e Configurações Padrão
DRY_RUN=false
SKIP_BUILD=false
DEPLOY_TIMEOUT=180 # segundos

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --skip-build)
      SKIP_BUILD=true
      shift
      ;;
    --timeout)
      DEPLOY_TIMEOUT="$2"
      shift 2
      ;;
    -h|--help)
      echo "Uso: $0 [--dry-run] [--skip-build] [--timeout <segundos>]"
      exit 0
      ;;
    *)
      log_error "Argumento desconhecido: $1"
      exit 1
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
if [[ -d "${BASE_DIR}/sgi-fundacao-dr-jesus" ]]; then
  FRONTEND_DIR="${BASE_DIR}/sgi-fundacao-dr-jesus"
else
  FRONTEND_DIR="${BASE_DIR}/../sgi-fundacao-dr-jesus"
fi

if [[ -d "${BASE_DIR}/backend-dr-jesus" ]]; then
  BACKEND_DIR="${BASE_DIR}/backend-dr-jesus"
else
  BACKEND_DIR="${BASE_DIR}/../backend-dr-jesus"
fi

# ------------------------------------------------------------------------------
# 1. VALIDAÇÃO DE PRÉ-REQUISITOS OPERACIONAIS
# ------------------------------------------------------------------------------
log_step "1. Validação de Pré-requisitos do Cluster Swarm"

if ! command -v docker >/dev/null 2>&1; then
  log_error "Docker Engine não encontrado no sistema."
  exit 1
fi

SWARM_STATE="$(docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null || echo 'inactive')"
if [ "$SWARM_STATE" != "active" ]; then
  log_error "Docker Swarm está inativo. Execute 'scripts/provisionar_swarm_e_secrets.sh' antes do deploy."
  exit 1
fi
log_ok "Docker Swarm ativo e pronto para receber stacks."

# Validação de Redes Overlay
for net in "scsi_public" "scsi_socket_net"; do
  if ! docker network inspect "$net" >/dev/null 2>&1; then
    log_error "Rede overlay '${net}' ausente. Execute o script de provisionamento."
    exit 1
  fi
done
log_ok "Redes overlay 'scsi_public' e 'scsi_socket_net' validadas."

# Validação dos Segredos no Raft
OBLIGATORY_SECRETS=(
  "scsi_origin_crt"
  "scsi_origin_key"
  "scsi_django_secret_key"
  "scsi_postgres_db"
  "scsi_postgres_user"
  "scsi_postgres_password"
  "scsi_redis_password"
  "scsi_rabbitmq_user"
  "scsi_rabbitmq_password"
)
for sec in "${OBLIGATORY_SECRETS[@]}"; do
  if ! docker secret inspect "$sec" >/dev/null 2>&1; then
    log_error "Secret '${sec}' ausente no cofre Raft do Swarm."
    exit 1
  fi
done
log_ok "Segredos corporativos validados no Docker Secrets."

# ------------------------------------------------------------------------------
# 2. COMPILAÇÃO DE IMAGENS DE PRODUÇÃO
# ------------------------------------------------------------------------------
log_step "2. Compilação das Imagens Docker Multi-Stage"

if [ "$SKIP_BUILD" = true ]; then
  log_warn "Etapa de compilação ignorada (--skip-build ativo)."
else
  log_info "Compilando imagem do Frontend SPA (React + Nginx Alpine)..."
  if [ "$DRY_RUN" = true ]; then
    log_info "[DRY-RUN] docker build -t scsi/frontend:latest ${FRONTEND_DIR}"
  else
    docker build -t scsi/frontend:latest "${FRONTEND_DIR}" >/dev/null
    log_ok "Imagem 'scsi/frontend:latest' compilada com sucesso."
  fi

  log_info "Compilando imagem do Backend Soberano (Django ASGI Daphne)..."
  if [ "$DRY_RUN" = true ]; then
    log_info "[DRY-RUN] docker build -t scsi/backend:latest ${BACKEND_DIR}"
  else
    docker build -t scsi/backend:latest "${BACKEND_DIR}" >/dev/null
    log_ok "Imagem 'scsi/backend:latest' compilada com sucesso."
  fi
fi

# ------------------------------------------------------------------------------
# 3. DEPLOY DA STACK TRAEFIK INGRESS
# ------------------------------------------------------------------------------
log_step "3. Deploy da Stack Traefik Ingress Controller"

TRAEFIK_COMPOSE="${BASE_DIR}/docker-compose.traefik.yml"
if [ "$DRY_RUN" = true ]; then
  log_info "[DRY-RUN] docker stack deploy -c ${TRAEFIK_COMPOSE} traefik"
else
  docker stack deploy -c "${TRAEFIK_COMPOSE}" traefik
  log_ok "Stack 'traefik' despachada para o Swarm."
fi

# ------------------------------------------------------------------------------
# 4. DEPLOY DA STACK CENTRAL DA APLICAÇÃO (SCSI)
# ------------------------------------------------------------------------------
log_step "4. Deploy da Stack Central da Aplicação (SGI Dr. Jesus)"

APP_COMPOSE="${BASE_DIR}/docker-compose.yml"
if [ "$DRY_RUN" = true ]; then
  log_info "[DRY-RUN] docker stack deploy -c ${APP_COMPOSE} scsi"
else
  docker stack deploy -c "${APP_COMPOSE}" scsi
  log_ok "Stack 'scsi' despachada com zero-downtime rolling update."
fi

# ------------------------------------------------------------------------------
# 5. MONITORAMENTO DO ROLLOUT E VALIDAÇÃO DOS HEALTHCHECKS
# ------------------------------------------------------------------------------
log_step "5. Monitoramento Ativo de Healthchecks & Rollout"

if [ "$DRY_RUN" = false ]; then
  log_info "Aguardando estabilização e convergência das réplicas (Timeout: ${DEPLOY_TIMEOUT}s)..."
  sleep 5  # Janela de respiro inicial para o Swarm instanciar as tarefas
  START_TIME=$(date +%s)
  
  while true; do
    CURRENT_TIME=$(date +%s)
    ELAPSED=$((CURRENT_TIME - START_TIME))

    if [ "$ELAPSED" -ge "$DEPLOY_TIMEOUT" ]; then
      log_error "Timeout atingido (${DEPLOY_TIMEOUT}s) antes de todos os serviços estarem saudáveis."
      echo "--- STATUS DOS SERVIÇOS NO SWARM ---"
      docker stack services scsi
      echo "------------------------------------"
      exit 1
    fi

    # Conta réplicas não convergidas e total de serviços registrados
    SERVICE_COUNT=0
    PENDING=0
    SERVICES_OUTPUT=$(docker stack services scsi --format '{{.Name}} {{.Replicas}}')
    
    while IFS= read -r line; do
      [ -z "$line" ] && continue
      SERVICE_COUNT=$((SERVICE_COUNT + 1))
      SVC_NAME=$(echo "$line" | awk '{print $1}')
      REPLICAS=$(echo "$line" | awk '{print $2}')
      DESIRED=$(echo "$REPLICAS" | cut -d'/' -f2)
      CURRENT=$(echo "$REPLICAS" | cut -d'/' -f1)

      if [ "$CURRENT" != "$DESIRED" ] || [ "$CURRENT" = "0" ]; then
        PENDING=$((PENDING + 1))
      fi
    done <<< "$SERVICES_OUTPUT"

    # Garante que os 7 serviços da stack foram instanciados e 100% das réplicas estão saudáveis
    if [ "$SERVICE_COUNT" -ge 7 ] && [ "$PENDING" -eq 0 ]; then
      log_ok "Todas as réplicas dos ${SERVICE_COUNT} serviços convergidas com sucesso em ${ELAPSED}s!"
      break
    fi

    echo -ne "  ⏳ Convergindo serviços (${PENDING} pendentes de ${SERVICE_COUNT}/7)... decorrido: ${ELAPSED}s\r"
    sleep 5
  done

  echo ""
  echo "--- RELATÓRIO DE SAÚDE DA STACK SCSI ---"
  docker stack services scsi
  echo "----------------------------------------"
fi

log_ok "Sub-etapa 7.2 concluída com sucesso! Stack em produção com probes de saúde ativos."
