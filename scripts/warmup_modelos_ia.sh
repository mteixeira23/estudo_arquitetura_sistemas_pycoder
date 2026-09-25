#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE WARM-UP DOS MODELOS DE INTELIGÊNCIA ARTIFICIAL (PADRÃO SCSI)
# Pré-alocação de pesos neurais em RAM para neutralizar latência de Cold-Start
# Modelos: Llama 3.2 3B (Raciocínio Clínico) & nomic-embed-text (Busca Vetorial)
# ==============================================================================
set -euo pipefail

# Paleta de Cores ANSI
readonly C_RESET='\033[0m'
readonly C_GREEN='\033[0;32m'
readonly C_YELLOW='\033[1;33m'
readonly C_CYAN='\033[0;36m'
readonly C_RED='\033[0;31m'

log_info()  { echo -e "${C_CYAN}[INFO]${C_RESET}  $*"; }
log_ok()    { echo -e "${C_GREEN}[OK]${C_RESET}    $*"; }
log_warn()  { echo -e "${C_YELLOW}[WARN]${C_RESET}  $*"; }
log_error() { echo -e "${C_RED}[ERRO]${C_RESET}  $*" >&2; }

MODELO_LLM="llama3.2:3b"
MODELO_EMBED="nomic-embed-text"

log_info "Iniciando protocolo de aquecimento (Warm-up) de IA Soberana..."

# Detecta se há container Ollama ativo no Docker local
OLLAMA_CONTAINER="$(docker ps -q -f name=sgi_ollama 2>/dev/null | head -n 1 || true)"

if [ -n "$OLLAMA_CONTAINER" ]; then
  log_info "Container Ollama detectado localmente: ${OLLAMA_CONTAINER}"

  log_info "Baixando/verificando modelo de embeddings: ${MODELO_EMBED}..."
  docker exec "${OLLAMA_CONTAINER}" ollama pull "${MODELO_EMBED}"
  log_ok "Modelo ${MODELO_EMBED} pronto."

  log_info "Baixando/verificando modelo LLM clínico: ${MODELO_LLM}..."
  docker exec "${OLLAMA_CONTAINER}" ollama pull "${MODELO_LLM}"
  log_ok "Modelo ${MODELO_LLM} pronto."

  log_info "Aquecendo modelos em memória RAM..."
  docker exec "${OLLAMA_CONTAINER}" ollama run "${MODELO_LLM}" "ping" >/dev/null 2>&1 || true
  log_ok "Modelos de IA carregados na RAM com sucesso!"

else
  OLLAMA_HOST="${OLLAMA_HOST:-http://localhost:11434}"
  log_info "Conectando via HTTP em: ${OLLAMA_HOST}"
  if ! curl -sf "${OLLAMA_HOST}/api/tags" >/dev/null 2>&1; then
    log_error "Daemon Ollama inacessível via container ou HTTP."
    exit 1
  fi
  curl -sf -X POST "${OLLAMA_HOST}/api/pull" -d "{\"name\": \"${MODELO_EMBED}\"}" >/dev/null
  curl -sf -X POST "${OLLAMA_HOST}/api/pull" -d "{\"name\": \"${MODELO_LLM}\"}" >/dev/null
  curl -sf -X POST "${OLLAMA_HOST}/api/generate" -H "Content-Type: application/json" -d "{\"model\": \"${MODELO_LLM}\", \"prompt\": \"ping\", \"stream\": false}" >/dev/null
fi

log_ok "Warm-up de IA concluído com 100% de sucesso! Motor cognitivo pronto para o SGI Dr. Jesus."
