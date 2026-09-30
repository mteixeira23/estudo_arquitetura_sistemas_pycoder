#!/usr/bin/env bash
# ==============================================================================
# Script de Correção do Usuário Admin e Identities para GoTrue
# ==============================================================================
set -euo pipefail

COLOR_GREEN="\033[0;32m"
COLOR_BLUE="\033[0;34m"
COLOR_RESET="\033[0m"

log_info() { echo -e "${COLOR_BLUE}[INFO]${COLOR_RESET} $1"; }
log_ok()   { echo -e "${COLOR_GREEN}[OK]${COLOR_RESET} $1"; }

DB_CONTAINER=$(docker ps -q -f name=scsi_db | head -n 1)
PG_USER=$(docker exec "${DB_CONTAINER}" cat /run/secrets/scsi_postgres_user)

log_info "Atualizando usuário admcaravana3@gmail.com e identities..."

docker exec -i "${DB_CONTAINER}" psql -U "${PG_USER}" -d caravana_db << 'EOF'
-- 1. Inserir ou atualizar usuário com todos os atributos GoTrue
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
    '27c10e88-1699-4278-a167-2297cd37e0e7',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admcaravana3@gmail.com',
    crypt('caravana', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"nome_completo": "Admcaravana3"}'::jsonb,
    now(),
    now()
)
ON CONFLICT (id) DO UPDATE SET
    aud = 'authenticated',
    role = 'authenticated',
    email = 'admcaravana3@gmail.com',
    encrypted_password = crypt('caravana', gen_salt('bf')),
    email_confirmed_at = coalesce(auth.users.email_confirmed_at, now()),
    raw_app_meta_data = '{"provider": "email", "providers": ["email"]}'::jsonb;

-- 2. Inserir ou atualizar identidade com provider_id correto
DO $$ BEGIN
    INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (
        '27c10e88-1699-4278-a167-2297cd37e0e7',
        '27c10e88-1699-4278-a167-2297cd37e0e7',
        '27c10e88-1699-4278-a167-2297cd37e0e7',
        '{"sub": "27c10e88-1699-4278-a167-2297cd37e0e7", "email": "admcaravana3@gmail.com"}'::jsonb,
        'email',
        now(),
        now(),
        now()
    )
    ON CONFLICT (provider, provider_id) DO NOTHING;
EXCEPTION WHEN OTHERS THEN
    BEGIN
        INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
        VALUES (
            '27c10e88-1699-4278-a167-2297cd37e0e7',
            '27c10e88-1699-4278-a167-2297cd37e0e7',
            '{"sub": "27c10e88-1699-4278-a167-2297cd37e0e7", "email": "admcaravana3@gmail.com"}'::jsonb,
            'email',
            now(),
            now(),
            now()
        )
        ON CONFLICT DO NOTHING;
    EXCEPTION WHEN OTHERS THEN null;
    END;
END $$;

-- 3. Atualizar view pública
DROP VIEW IF EXISTS public.users CASCADE;
CREATE OR REPLACE VIEW public.users AS SELECT * FROM auth.users;

GRANT ALL ON public.users TO supabase_auth_admin, authenticator, postgres, anon, authenticated, service_role;
EOF

log_ok "Usuário e identities configurados com sucesso!"
