#!/usr/bin/env bash
set -euo pipefail

echo "=== Configurando Acesso Direto do Antigravity & Deploy SGI ==="

# 1. Chave SSH Ed25519 do Antigravity
mkdir -p /root/.ssh && chmod 700 /root/.ssh
PUBKEY="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGgQYBdcnw5YYVul0iJr7lewZzp805iR59arqeBek7ZI antigravity@singulariconsult"
if ! grep -q "antigravity@singulariconsult" /root/.ssh/authorized_keys 2>/dev/null; then
    echo "$PUBKEY" >> /root/.ssh/authorized_keys
    echo "[OK] Chave do Antigravity adicionada ao authorized_keys."
fi
chmod 600 /root/.ssh/authorized_keys

# 2. Portas alternativas no SSH (22, 2222, 22444 e 8443) para furar firewalls corporativos
mkdir -p /etc/systemd/system/ssh.socket.d
cat << 'EOF' > /etc/systemd/system/ssh.socket.d/listen.conf
[Socket]
ListenStream=
ListenStream=22
ListenStream=2222
ListenStream=22444
ListenStream=8443
EOF
systemctl daemon-reload
systemctl restart ssh.socket 2>/dev/null || true
systemctl restart ssh 2>/dev/null || true
echo "[OK] Portas SSH configuradas (22, 2222, 22444, 8443)."

# 3. Permissões de execução no backend e compilação
cd /opt/sgi-dr-jesus
chmod +x backend-dr-jesus/entrypoint.sh scripts/*.sh
echo "[OK] Permissoes +x aplicadas."

docker build -t scsi/backend:latest ./backend-dr-jesus
docker stack deploy -c docker-compose.traefik.yml traefik
docker stack deploy -c docker-compose.yml sgi

echo "=== SUCESSO TOTAL: ANTIGRAVITY PRONTO PARA ASSUMIR O CONTROLE ==="
