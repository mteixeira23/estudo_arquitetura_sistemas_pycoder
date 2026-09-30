#!/usr/bin/env bash
# ==============================================================================
# Script de Correção do Search Path, Colunas aud/role e Identities
# ==============================================================================
set -euo pipefail

COLOR_GREEN="\033[0;32m"
COLOR_BLUE="\033[0;34m"
COLOR_RESET="\033[0m"

log_info() { echo -e "${COLOR_BLUE}[INFO]${COLOR_RESET} $1"; }
log_ok()   { echo -e "${COLOR_GREEN}[OK]${COLOR_RESET} $1"; }

DB_CONTAINER=$(docker ps -q -f name=scsi_db | head -n 1)
PG_USER=$(docker exec "${DB_CONTAINER}" cat /run/secrets/scsi_postgres_user)

log_info "Ajustando colunas 'aud', 'role' e tabela 'auth.identities'..."

docker exec -i "${DB_CONTAINER}" psql -U "${PG_USER}" -d caravana_db << 'EOF'
-- 1. Colunas aud e role em auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS aud varchar(255) DEFAULT 'authenticated';
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role varchar(255) DEFAULT 'authenticated';

UPDATE auth.users SET aud = 'authenticated', role = 'authenticated' WHERE aud IS NULL OR role IS NULL;

-- 2. Garantir auth.identities para login por e-mail
CREATE TABLE IF NOT EXISTS auth.identities (
    id text NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamptz,
    created_at timestamptz,
    updated_at timestamptz,
    email text GENERATED ALWAYS AS (lower(identity_data->>'email')) STORED,
    CONSTRAINT identities_pkey PRIMARY KEY (provider, id)
);

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    '27c10e88-1699-4278-a167-2297cd37e0e7',
    '27c10e88-1699-4278-a167-2297cd37e0e7',
    '{"sub": "27c10e88-1699-4278-a167-2297cd37e0e7", "email": "admcaravana3@gmail.com"}'::jsonb,
    'email',
    now(),
    now(),
    now()
) ON CONFLICT DO NOTHING;

-- 3. Atualizar view pública com as novas colunas
DROP VIEW IF EXISTS public.users CASCADE;
CREATE OR REPLACE VIEW public.users AS SELECT * FROM auth.users;

GRANT ALL ON public.users TO supabase_auth_admin, authenticator, postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO supabase_auth_admin, authenticator, postgres, anon, authenticated, service_role;
EOF

log_ok "Schema auth e identities atualizados com sucesso!"

log_info "Reiniciando scsi_caravana_auth..."
docker service update --force scsi_caravana_auth

log_info "Aguardando inicialização..."
sleep 4

docker service ls
