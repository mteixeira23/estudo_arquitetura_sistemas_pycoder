#!/usr/bin/env bash
# ==============================================================================
# Script de Correção do Search Path e Migrações GoTrue
# ==============================================================================
set -euo pipefail

COLOR_GREEN="\033[0;32m"
COLOR_BLUE="\033[0;34m"
COLOR_RESET="\033[0m"

log_info() { echo -e "${COLOR_BLUE}[INFO]${COLOR_RESET} $1"; }
log_ok()   { echo -e "${COLOR_GREEN}[OK]${COLOR_RESET} $1"; }

DB_CONTAINER=$(docker ps -q -f name=scsi_db | head -n 1)
PG_USER=$(docker exec "${DB_CONTAINER}" cat /run/secrets/scsi_postgres_user)

log_info "Registrando migrações conhecidas em auth.schema_migrations..."

docker exec -i "${DB_CONTAINER}" psql -U "${PG_USER}" -d caravana_db << 'EOF'
-- Garantir tabela de migrações no plural (padrão GoTrue)
CREATE TABLE IF NOT EXISTS auth.schema_migrations (
    version varchar(255) PRIMARY KEY
);

INSERT INTO auth.schema_migrations (version) VALUES ('20221208132122') ON CONFLICT DO NOTHING;
INSERT INTO auth.schema_migrations (version) VALUES ('20240729123726') ON CONFLICT DO NOTHING;

-- Caso a tabela exista sem o schema
CREATE TABLE IF NOT EXISTS public.schema_migrations (
    version varchar(255) PRIMARY KEY
);
INSERT INTO public.schema_migrations (version) VALUES ('20221208132122') ON CONFLICT DO NOTHING;
INSERT INTO public.schema_migrations (version) VALUES ('20240729123726') ON CONFLICT DO NOTHING;
EOF

log_ok "Migrações marcadas como concluídas com sucesso!"

log_info "Reiniciando scsi_caravana_auth..."
docker service update --force scsi_caravana_auth

log_info "Aguardando 6 segundos pela inicialização..."
sleep 6

docker service ls
