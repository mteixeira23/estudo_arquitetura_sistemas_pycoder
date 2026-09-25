#!/usr/bin/env bash
# ==============================================================================
# Habilita compatibilidade de API no Docker Daemon (min-api-version: 1.24)
# Necessário para clientes e proxies com auto-negociação de API no Docker 29+
# ==============================================================================
set -euo pipefail

echo "==> Configurando min-api-version: 1.24 no /etc/docker/daemon.json..."
python3 -c '
import json, os
path = "/etc/docker/daemon.json"
data = {}
if os.path.exists(path):
    try:
        with open(path) as f:
            data = json.load(f)
    except Exception:
        data = {}
data["min-api-version"] = "1.24"
os.makedirs("/etc/docker", exist_ok=True)
with open(path, "w") as f:
    json.dump(data, f, indent=2)
print("Configuração salva em /etc/docker/daemon.json com sucesso.")
'

echo "==> Reiniciando daemon do Docker..."
systemctl restart docker
echo "==> Docker daemon reiniciado com sucesso e compatibilidade ativa!"
