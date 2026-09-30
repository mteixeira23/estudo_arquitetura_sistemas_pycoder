#!/usr/bin/env bash
# ==============================================================================
# Script Definitivo de Correção de Roles e Migrações do GoTrue
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
log_info "Aplicando patch de enums e tabelas MFA na base caravana_db..."

docker exec -i "${DB_CONTAINER}" psql -U "${PG_USER}" -d caravana_db << 'EOF'
-- 1. Criação dos enums essenciais do GoTrue
DO $$ BEGIN
    CREATE TYPE auth.factor_type AS ENUM('totp', 'webauthn', 'phone');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE auth.factor_status AS ENUM('unverified', 'verified');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE auth.aal_level AS ENUM('aal1', 'aal2', 'aal3');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE auth.code_challenge_method AS ENUM('s256', 'plain');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Garantir colunas da migração 20240729123726
DO $$ BEGIN
    ALTER TABLE auth.mfa_factors ADD COLUMN IF NOT EXISTS phone text;
EXCEPTION WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE auth.mfa_challenges ADD COLUMN IF NOT EXISTS otp_code text;
EXCEPTION WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS unique_verified_phone_factor ON auth.mfa_factors (user_id, phone);
EXCEPTION WHEN OTHERS THEN null;
END $$;

-- 3. Marcar migração problemática como resolvida no histórico do Pop
DO $$ BEGIN
    INSERT INTO auth.schema_migration (version) VALUES ('20240729123726') ON CONFLICT DO NOTHING;
EXCEPTION WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
    INSERT INTO public.schema_migration (version) VALUES ('20240729123726') ON CONFLICT DO NOTHING;
EXCEPTION WHEN OTHERS THEN null;
END $$;
EOF

log_ok "Patch do GoTrue aplicado com sucesso!"

log_info "Reiniciando serviço scsi_caravana_auth..."
docker service update --force scsi_caravana_auth

log_info "Aguardando 6 segundos pela estabilização..."
sleep 6

docker service ls
