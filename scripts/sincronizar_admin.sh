#!/usr/bin/env bash
set -euo pipefail

DB_CONTAINER=$(docker ps -q -f name=scsi_db | head -n 1)
PG_USER=$(docker exec "${DB_CONTAINER}" cat /run/secrets/scsi_postgres_user)

docker exec -i "${DB_CONTAINER}" psql -U "${PG_USER}" -d caravana_db << 'EOF'
UPDATE auth.users 
SET aud = '',
    role = '',
    encrypted_password = (SELECT encrypted_password FROM auth.users WHERE email = 'test@caravana.com')
WHERE email = 'admcaravana3@gmail.com';
EOF

echo "admcaravana3@gmail.com sincronizado com a senha caravana123456!"
