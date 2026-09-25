#!/bin/bash
# Script de Backup Corporativo - SGI Dr. Jesus (Substituto do Supabase PITR)
# Recomendado rodar via CRON a cada 6h na VPS Hostinger para reduzir RPO.

# 1. Caminhos absolutos garantem que o Cron não falhe
BACKUP_DIR="/var/backups/dr_jesus_db"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
FILE_NAME="dr_jesus_db_backup_$DATE.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "Iniciando backup do PostgreSQL (dr_jesus_db)..."

# 2. Removida a flag "-t" (impedia execução em background via Cron)
# O path absoluto do docker (ex: /usr/bin/docker) pode ser necessário dependendo do SO.
docker exec dr_jesus_db pg_dump -U drjesus_admin -d dr_jesus_db -F p | gzip > "$BACKUP_DIR/$FILE_NAME"

echo "Backup local concluído: $BACKUP_DIR/$FILE_NAME"

# 3. Off-site Storage (Mitigação de Desastres)
# É mandatório enviar para AWS S3, Cloudflare R2 ou Backblaze. 
# Descomente a linha abaixo e configure o aws-cli/rclone:
# aws s3 cp "$BACKUP_DIR/$FILE_NAME" s3://meu-bucket-seguro/backups-drjesus/

# 4. Reter apenas os últimos 7 dias (limpeza automática do disco local)
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -exec rm {} \;
echo "Backups antigos (+7 dias) removidos do disco local."
