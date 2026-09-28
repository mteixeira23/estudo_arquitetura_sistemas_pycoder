#!/usr/bin/env bash
# ==============================================================================
# SENTINELA WATCHDOG LEAN (< 15MB RAM) — PADRÃO SCSI / SRE
# Monitora proativamente disco NVMe, RAM e saúde dos serviços Docker Swarm
# Diretrizes: ADR 007 (Unix LF), ADR 008 (Defesa em Profundidade), ADR 011 (API-First)
# ==============================================================================
set -euo pipefail

LOG_FILE="${LOG_FILE:-/var/log/scsi_watchdog.log}"
MAX_DISK_PERCENT="${MAX_DISK_PERCENT:-85}"
MAX_RAM_PERCENT="${MAX_RAM_PERCENT:-90}"

log() {
    local nivel="$1"
    shift
    local msg="$(date '+%Y-%m-%d %H:%M:%S UTC') [${nivel}] $*"
    echo "${msg}"
    echo "${msg}" >> "${LOG_FILE}" 2>/dev/null || true
}

# 1. Checagem de Armazenamento NVMe (Partição Raiz)
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')
if [ "${DISK_USAGE}" -ge "${MAX_DISK_PERCENT}" ]; then
    log "WARN" "Alerta de Armazenamento: Disco raiz em ${DISK_USAGE}% (limiar: ${MAX_DISK_PERCENT}%)"
else
    log "INFO" "Disco íntegro: ${DISK_USAGE}% utilizado."
fi

# 2. Checagem de Memória RAM (VPS KVM 8)
RAM_USAGE=$(free | awk '/Mem:/ {printf("%d", ($3/$2)*100)}')
if [ "${RAM_USAGE}" -ge "${MAX_RAM_PERCENT}" ]; then
    log "WARN" "Alerta de Memória: RAM em ${RAM_USAGE}% (limiar: ${MAX_RAM_PERCENT}%)"
else
    log "INFO" "RAM íntegra: ${RAM_USAGE}% utilizada."
fi

# 3. Checagem de Serviços do Docker Swarm
if command -v docker >/dev/null 2>&1 && docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null | grep -q 'active'; then
    FAILED_SERVICES=""
    while read -r name replicas; do
        current=$(echo "${replicas}" | cut -d'/' -f1)
        expected=$(echo "${replicas}" | cut -d'/' -f2)
        if [ "${current}" -eq 0 ] && [ "${expected}" -gt 0 ]; then
            FAILED_SERVICES="${FAILED_SERVICES} ${name}(${replicas})"
        fi
    done < <(docker service ls --format "{{.Name}} {{.Replicas}}" 2>/dev/null || true)

    if [ -n "${FAILED_SERVICES}" ]; then
        log "CRITICAL" "Serviços Swarm degradados detectados:${FAILED_SERVICES}"
    else
        log "INFO" "Todos os serviços do Docker Swarm estão saudáveis com convergência 100%."
    fi
else
    log "INFO" "Docker Swarm não ativo no nó local ou em manutenção."
fi
