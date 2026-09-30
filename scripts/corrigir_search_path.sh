#!/usr/bin/env bash
# ==============================================================================
# Script de Correção do Search Path e View Users para GoTrue
# ==============================================================================
set -euo pipefail

COLOR_GREEN="\033[0;32m"
COLOR_BLUE="\033[0;34m"
COLOR_RESET="\033[0m"

log_info() { echo -e "${COLOR_BLUE}[INFO]${COLOR_RESET} $1"; }
log_ok()   { echo -e "${COLOR_GREEN}[OK]${COLOR_RESET} $1"; }

DB_CONTAINER=$(docker ps -q -f name=scsi_db | head -n 1)
PG_USER=$(docker exec "${DB_CONTAINER}" cat /run/secrets/scsi_postgres_user)

log_info "Configurando search_path do GoTrue e criando View de compatibilidade..."

docker exec -i "${DB_CONTAINER}" psql -U "${PG_USER}" -d caravana_db << 'EOF'
-- 1. Definir search_path para auth no banco e nos papéis
ALTER ROLE supabase_auth_admin SET search_path = auth, public;
ALTER ROLE postgres SET search_path = auth, public;
ALTER ROLE authenticator SET search_path = public, auth;
ALTER DATABASE caravana_db SET search_path = auth, public;

-- 2. Criar view pública 'users' caso alguma query busque direto em public
CREATE OR REPLACE VIEW public.users AS SELECT * FROM auth.users;
GRANT ALL ON public.users TO supabase_auth_admin, authenticator, postgres, anon, authenticated, service_role;
EOF

log_ok "Search path configurado e view public.users criada com sucesso!"

log_info "Reiniciando scsi_caravana_auth para recarregar conexões..."
docker service update --force scsi_caravana_auth

sleep 4
log_ok "GoTrue pronto para autenticação!"
