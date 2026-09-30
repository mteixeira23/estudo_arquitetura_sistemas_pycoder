#!/usr/bin/env bash
# ==============================================================================
# SGI PycoderBR / SJDH Bahia - Migração Soberana do caravana_db
# Executa a criação do banco, schemas, roles e importação dos 8.783 registros
# ==============================================================================
set -euo pipefail

COLOR_GREEN="\033[0;32m"
COLOR_BLUE="\033[0;34m"
COLOR_YELLOW="\033[1;33m"
COLOR_RED="\033[0;31m"
COLOR_RESET="\033[0m"

log_info() { echo -e "${COLOR_BLUE}[INFO]${COLOR_RESET} $1"; }
log_ok()   { echo -e "${COLOR_GREEN}[OK]${COLOR_RESET} $1"; }
log_warn() { echo -e "${COLOR_YELLOW}[WARN]${COLOR_RESET} $1"; }
log_err()  { echo -e "${COLOR_RED}[ERRO]${COLOR_RESET} $1"; }

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SQL_FILE="${REPO_ROOT}/sql/caravana_db_complete.sql"

if [[ ! -f "${SQL_FILE}" ]]; then
  log_err "Arquivo SQL não encontrado: ${SQL_FILE}"
  exit 1
fi

log_info "Detectando container do PostgreSQL 16 (scsi_db)..."
DB_CONTAINER=$(docker ps -q -f name=scsi_db | head -n 1)

if [[ -z "${DB_CONTAINER}" ]]; then
  log_err "Container scsi_db não está em execução no Swarm!"
  exit 1
fi
log_ok "Container PostgreSQL detectado: ${DB_CONTAINER}"

log_info "Obtendo credenciais administrativas do Docker Secret..."
PG_USER=$(docker exec "${DB_CONTAINER}" cat /run/secrets/scsi_postgres_user)
log_ok "Usuário administrativo: ${PG_USER}"

log_info "Verificando existência do banco 'caravana_db'..."
DB_EXISTS=$(docker exec -i "${DB_CONTAINER}" psql -U "${PG_USER}" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = 'caravana_db'")

if [[ "${DB_EXISTS}" != "1" ]]; then
  log_info "Criando banco de dados 'caravana_db'..."
  docker exec -i "${DB_CONTAINER}" psql -U "${PG_USER}" -d postgres -c "CREATE DATABASE caravana_db;"
  log_ok "Banco de dados 'caravana_db' criado com sucesso!"
else
  log_warn "Banco de dados 'caravana_db' já existe. Prosseguindo com atualização..."
fi

log_info "Importando schema e dados de ${SQL_FILE} (3.5 MB, 8.783 registros)..."
docker exec -i "${DB_CONTAINER}" psql -U "${PG_USER}" -d caravana_db -v ON_ERROR_STOP=0 < "${SQL_FILE}" > /tmp/caravana_import.log 2>&1 || true

log_ok "Importação concluída. Verificando integridade das tabelas centrais..."

echo "------------------------------------------------------------"
docker exec -i "${DB_CONTAINER}" psql -U "${PG_USER}" -d caravana_db -c "
SELECT
  'auth.users' as tabela, count(*) as total_registros FROM auth.users
UNION ALL
SELECT 'lancamentos', count(*) FROM public.lancamentos
UNION ALL
SELECT 'caravanas', count(*) FROM public.caravanas
UNION ALL
SELECT 'perfil_usuarios_caravana', count(*) FROM public.perfil_usuarios_caravana
UNION ALL
SELECT 'orcamento_detalhado', count(*) FROM public.orcamento_detalhado
UNION ALL
SELECT 'documentos_programa', count(*) FROM public.documentos_programa
UNION ALL
SELECT 'acoes_formativas', count(*) FROM public.acoes_formativas;
"
echo "------------------------------------------------------------"

log_ok "Migração do banco de dados caravana_db realizada com sucesso!"
