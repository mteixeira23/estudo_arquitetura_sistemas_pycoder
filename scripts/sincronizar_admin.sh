#!/usr/bin/env bash
set -euo pipefail

DB_CONTAINER=$(docker ps -q -f name=scsi_db | head -n 1)
PG_USER=$(docker exec "${DB_CONTAINER}" cat /run/secrets/scsi_postgres_user)

docker exec -i "${DB_CONTAINER}" psql -U "${PG_USER}" -d caravana_db << 'EOF'
-- 1. Sincronizar role e senha para admcaravana3@gmail.com
UPDATE auth.users 
SET aud = 'authenticated',
    role = 'authenticated',
    encrypted_password = (SELECT encrypted_password FROM auth.users WHERE email = 'test@caravana.com')
WHERE email = 'admcaravana3@gmail.com';

-- 2. Garantir auth.identities
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
EOF

echo "Atualizando stack Swarm com JWT role ativo..."
docker stack deploy -c docker-compose.yml --resolve-image never scsi

echo "GoTrue atualizado com papel 'authenticated'!"
