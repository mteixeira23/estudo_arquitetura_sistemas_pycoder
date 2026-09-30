#!/usr/bin/env bash
# ==============================================================================
# Script de Confirmação de E-mail e Sincronização de Senha GoTrue
# ==============================================================================
set -euo pipefail

COLOR_GREEN="\033[0;32m"
COLOR_BLUE="\033[0;34m"
COLOR_RESET="\033[0m"

log_info() { echo -e "${COLOR_BLUE}[INFO]${COLOR_RESET} $1"; }
log_ok()   { echo -e "${COLOR_GREEN}[OK]${COLOR_RESET} $1"; }

DB_CONTAINER=$(docker ps -q -f name=scsi_db | head -n 1)
PG_USER=$(docker exec "${DB_CONTAINER}" cat /run/secrets/scsi_postgres_user)

log_info "Confirmando e-mails e aplicando hash oficial de senha aos usuários..."

docker exec -i "${DB_CONTAINER}" psql -U "${PG_USER}" -d caravana_db << 'EOF'
-- 1. Confirmar todos os e-mails para liberar login imediato
UPDATE auth.users 
SET email_confirmed_at = now(), 
    confirmed_at = now(),
    aud = 'authenticated',
    role = 'authenticated';

-- 2. Se admin@caravana.com existe, replicar o hash criptográfico para admcaravana3@gmail.com
UPDATE auth.users
SET encrypted_password = (SELECT encrypted_password FROM auth.users WHERE email = 'admin@caravana.com')
WHERE email = 'admcaravana3@gmail.com' AND EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@caravana.com');

-- 3. Vincular role de coordenador para os administradores
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'coordenador_campo'
FROM auth.users
WHERE email IN ('admin@caravana.com', 'admcaravana3@gmail.com')
ON CONFLICT DO NOTHING;
EOF

log_ok "E-mails confirmados e senhas sincronizadas!"

log_info "Atualizando stack Swarm com autoconfirmação ativada..."
docker stack deploy -c docker-compose.yml --resolve-image never scsi

sleep 4
log_ok "Tudo pronto e liberado para login!"
