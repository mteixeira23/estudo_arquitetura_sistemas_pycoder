#!/bin/sh
set -e

echo "[SCSI Entrypoint] Iniciando verificações defensivas de prontidão..."

# Loop defensivo de resiliência agnóstica a orquestradores (Compose ou Swarm)
python - << 'EOF'
import socket
import time
import os
import sys

def wait_for_socket(host, port, service_name, max_retries=30, delay=2):
    print(f"[SCSI Entrypoint] Verificando conectividade com {service_name} ({host}:{port})...")
    for attempt in range(1, max_retries + 1):
        try:
            with socket.create_connection((host, int(port)), timeout=2):
                print(f"[SCSI Entrypoint] Conexão com {service_name} estabelecida com sucesso!")
                return True
        except (socket.timeout, ConnectionRefusedError, OSError):
            print(f"[SCSI Entrypoint] Aguardando {service_name} ({attempt}/{max_retries})...")
            time.sleep(delay)
    print(f"[SCSI Entrypoint] AVISO: Não foi possível conectar a {service_name} no tempo limite. Continuando...")
    return False

# Checagem do PostgreSQL
pg_host = os.environ.get("POSTGRES_HOST", "db")
pg_port = os.environ.get("POSTGRES_PORT", "5432")
wait_for_socket(pg_host, pg_port, "PostgreSQL")

# Checagem do RabbitMQ (se configurado)
rabbit_host = "rabbitmq"
wait_for_socket(rabbit_host, 5672, "RabbitMQ", max_retries=15)
EOF

# Executa migrações pendentes no PostgreSQL
echo "[SCSI Entrypoint] Aplicando migrações do Django..."
python manage.py migrate --noinput || echo "[SCSI Entrypoint] Migrações ignoradas ou já aplicadas."

# Coleta arquivos estáticos
echo "[SCSI Entrypoint] Coletando arquivos estáticos..."
python manage.py collectstatic --noinput || true

echo "[SCSI Entrypoint] Inicialização concluída. Disparando comando principal..."
exec "$@"
