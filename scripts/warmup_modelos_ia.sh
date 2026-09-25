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

OLLAMA_HOST="${OLLAMA_HOST:-http://localhost:11434}"
MODELO_LLM="llama3.2:3b"
MODELO_EMBED="nomic-embed-text"

log_info "Iniciando protocolo de aquecimento (Warm-up) de IA Soberana..."
log_info "Endpoint Ollama alvo: ${OLLAMA_HOST}"

# 1. Checagem de conectividade com o daemon do Ollama
if ! curl -sf "${OLLAMA_HOST}/api/tags" >/dev/null 2>&1; then
  log_error "Daemon Ollama inacessível em ${OLLAMA_HOST}."
  exit 1
fi
log_ok "Daemon Ollama online e respondendo a requisições de controle."

# 2. Garantia de Presença dos Modelos
verificar_ou_baixar_modelo() {
  local modelo="$1"
  log_info "Verificando integridade local do modelo '${modelo}'..."
  if curl -sf "${OLLAMA_HOST}/api/tags" | grep -q "\"name\":\"${modelo}\""; then
    log_ok "Modelo '${modelo}' já presente no volume persistente dr_jesus_ollama_data."
  else
    log_warn "Modelo '${modelo}' ausente. Iniciando download dos tensores GGUF..."
    curl -sf -X POST "${OLLAMA_HOST}/api/pull" -d "{\"name\": \"${modelo}\"}" >/dev/null
    log_ok "Modelo '${modelo}' baixado com sucesso."
  fi
}

verificar_ou_baixar_modelo "${MODELO_EMBED}"
verificar_ou_baixar_modelo "${MODELO_LLM}"

# 3. Pré-alocação dos Tensores em Memória RAM (Warm-up de Inferência)
log_info "Executando warm-up da matriz de embeddings ('${MODELO_EMBED}')..."
EMBED_START=$(date +%s%N)
curl -sf -X POST "${OLLAMA_HOST}/api/embeddings" \
  -H "Content-Type: application/json" \
  -d "{\"model\": \"${MODELO_EMBED}\", \"prompt\": \"Fundação Dr. Jesus Arquitetura Soberana SCSI\"}" >/dev/null
EMBED_END=$(date +%s%N)
EMBED_MS=$(( (EMBED_END - EMBED_START) / 1000000 ))
log_ok "Embeddings aquecidos e mapeados em RAM em ${EMBED_MS}ms."

log_info "Executando warm-up do modelo de raciocínio clínico ('${MODELO_LLM}')..."
LLM_START=$(date +%s%N)
curl -sf -X POST "${OLLAMA_HOST}/api/generate" \
  -H "Content-Type: application/json" \
  -d "{\"model\": \"${MODELO_LLM}\", \"prompt\": \"ping\", \"stream\": false}" >/dev/null
LLM_END=$(date +%s%N)
LLM_MS=$(( (LLM_END - LLM_START) / 1000000 ))
log_ok "LLM clínico aquecido e mapeado em RAM em ${LLM_MS}ms."

log_ok "Warm-up concluído com 100% de sucesso! Motor cognitivo pronto para atender o SGI Dr. Jesus com latência mínima."
