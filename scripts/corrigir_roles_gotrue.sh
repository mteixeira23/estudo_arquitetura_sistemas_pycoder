#!/usr/bin/env bash
# ==============================================================================
# Script de Correção de Roles para GoTrue e PostgREST (Soberania Caravana)
# ==============================================================================
set -euo pipefail

COLOR_GREEN="\033[0;32m"
COLOR_BLUE="\033[0;34m"
COLOR_RED="\033[0;31m"
COLOR_RESET="\033[0m"

log_info() { echo -e "${COLOR_BLUE}[INFO]${COLOR_RESET} $1"; }
log_ok()   { echo -e "${COLOR_GREEN}[OK]${COLOR_RESET} $1"; }
log_err()  { echo -e "${COLOR_RED}[ERRO]${COLOR_RESET} $1"; }

DB_CONTAINER=$(docker ps -q -f name=scsi_db | head -n 1)

if [[ -z "${DB_CONTAINER}" ]]; then
  log_err "Container scsi_db não encontrado!"
  exit 1
fi

PG_USER=$(docker exec "${DB_CONTAINER}" cat /run/secrets/scsi_postgres_user)
log_info "Executando criação das roles 'postgres' e 'supabase_auth_admin' no container ${DB_CONTAINER}..."

docker exec -i "${DB_CONTAINER}" psql -U "${PG_USER}" -d postgres << 'EOF'
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'postgres') THEN
    CREATE ROLE postgres WITH LOGIN SUPERUSER;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supabase_admin') THEN
    CREATE ROLE supabase_admin WITH LOGIN SUPERUSER;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supabase_auth_admin') THEN
    CREATE ROLE supabase_auth_admin WITH LOGIN PASSWORD 'caravana_authenticator_pass' SUPERUSER;
  ELSE
    ALTER USER supabase_auth_admin WITH SUPERUSER;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticator') THEN
    CREATE ROLE authenticator WITH LOGIN PASSWORD 'caravana_authenticator_pass' SUPERUSER;
  ELSE
    ALTER USER authenticator WITH SUPERUSER;
  END IF;
END $$;

GRANT ALL PRIVILEGES ON DATABASE caravana_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE caravana_db TO supabase_auth_admin;
GRANT ALL PRIVILEGES ON DATABASE caravana_db TO authenticator;
EOF

log_ok "Roles criadas e privilégios concedidos com sucesso!"

log_info "Reiniciando serviço scsi_caravana_auth..."
docker service update --force scsi_caravana_auth

sleep 5
docker service ls
