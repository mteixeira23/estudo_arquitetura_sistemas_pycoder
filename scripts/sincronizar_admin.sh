#!/usr/bin/env bash
set -euo pipefail

DB_CONTAINER=$(docker ps -q -f name=scsi_db | head -n 1)
PG_USER=$(docker exec "${DB_CONTAINER}" cat /run/secrets/scsi_postgres_user)

docker exec -i "${DB_CONTAINER}" psql -U "${PG_USER}" -d caravana_db << 'EOF'
-- 1. Inserir identidade para admcaravana3@gmail.com
INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    '27c10e88-1699-4278-a167-2297cd37e0e7',
    '27c10e88-1699-4278-a167-2297cd37e0e7',
    '27c10e88-1699-4278-a167-2297cd37e0e7',
    '{"sub": "27c10e88-1699-4278-a167-2297cd37e0e7", "email": "admcaravana3@gmail.com", "email_verified": true}'::jsonb,
    'email',
    now(),
    now(),
    now()
)
ON CONFLICT (provider, provider_id) DO UPDATE SET
    identity_data = '{"sub": "27c10e88-1699-4278-a167-2297cd37e0e7", "email": "admcaravana3@gmail.com", "email_verified": true}'::jsonb;

-- 2. Garantir profiles e user_roles para todos os administradores
INSERT INTO public.profiles (id, email, nome_completo)
SELECT id, email, 'Administrador' FROM auth.users WHERE email IN ('test@caravana.com', 'admcaravana3@gmail.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'coordenador_campo' FROM auth.users WHERE email IN ('test@caravana.com', 'admcaravana3@gmail.com')
ON CONFLICT DO NOTHING;
EOF

echo "Identidades, perfis e permissões vinculadas com sucesso!"
