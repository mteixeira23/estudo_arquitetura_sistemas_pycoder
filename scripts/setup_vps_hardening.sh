#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE HARDENING & OPERAÇÃO CONTÍNUA DA VPS HOSTINGER — ITENS 10, 11 E 12
# Configura Log Rotation do Docker, Crontab com flock e Sentinela Watchdog
# Diretrizes: ADR 007 (Unix LF), ADR 008 (Defesa em Profundidade), ADR 011 (API-First)
# ==============================================================================
set -euo pipefail

readonly C_RESET='\033[0m'
readonly C_GREEN='\033[0;32m'
readonly C_CYAN='\033[0;36m'
readonly C_YELLOW='\033[1;33m'

log_info() { echo -e "${C_CYAN}[INFO]${C_RESET} $*"; }
log_ok()   { echo -e "${C_GREEN}[OK]${C_RESET}   $*"; }
log_warn() { echo -e "${C_YELLOW}[WARN]${C_RESET} $*"; }

log_info "=== Iniciando Hardening SRE na VPS Hostinger KVM 8 ==="

# 1. Configurar permissões de execução nos scripts
chmod +x /opt/sgi-dr-jesus/scripts/*.sh 2>/dev/null || true
log_ok "Permissões de execução ajustadas em /opt/sgi-dr-jesus/scripts/"

# 2. Item 10: Log Rotation Global no Docker Engine
log_info "Configurando Log Rotation em /etc/docker/daemon.json..."
mkdir -p /etc/docker
cat << 'EOF' > /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3",
    "compress": "true"
  }
}
EOF
systemctl reload docker || true
log_ok "Log Rotation configurado (max-size=50m, max-file=3, compress=true)"

# 3. Itens 11 e 12: Crontab formal com trava flock em /etc/cron.d/scsi-maintenance
log_info "Configurando agendamento crontab em /etc/cron.d/scsi-maintenance..."
cat << 'EOF' > /etc/cron.d/scsi-maintenance
# /etc/cron.d/scsi-maintenance: Manutenção preventiva e SRE SCSI
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# Item 11: Backup consistente do PostgreSQL 16 às 03:00 UTC com trava flock
0 3 * * * root /usr/bin/flock -n /var/run/scsi_backup.lock /opt/sgi-dr-jesus/scripts/backup_postgresql_r2.sh >> /var/log/scsi_backup.log 2>&1

# Item 12: Sentinela Watchdog Lean a cada 10 minutos
*/10 * * * * root /usr/bin/flock -n /var/run/scsi_watchdog.lock /opt/sgi-dr-jesus/scripts/scsi_watchdog.sh >> /var/log/scsi_watchdog.log 2>&1
EOF

chmod 0644 /etc/cron.d/scsi-maintenance
log_ok "Crontab formal instalado com sucesso em /etc/cron.d/scsi-maintenance"

log_info "Executando teste inicial do Sentinela Watchdog..."
/opt/sgi-dr-jesus/scripts/scsi_watchdog.sh
log_ok "Hardening da VPS Hostinger finalizado com êxito!"
