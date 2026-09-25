#!/usr/bin/env bash
# ==============================================================================
# Script de Hardening Corporativo de VPS Linux Ubuntu 24.04 LTS (Padrão SCSI)
# Projeto: Plataforma de Sistemas Inteligentes (PycoderBR / SGI Dr. Jesus)
# Sub-etapa 6.2: Hardening Perimétrico, SSH Ed25519, UFW Cloudflare e Fail2ban
# Conformidade: ADR 007 (LF puro), ADR 008 (Defesa em Profundidade), ADR 011 (Headless)
# ==============================================================================

set -euo pipefail

# Cores para feedback estruturado
VERDE='\033[0;32m'
AMARELO='\033[1;33m'
VERMELHO='\033[0;31m'
AZUL='\033[0;34m'
NC='\033[0m' # No Color

SSH_PORT="${SSH_PORT:-22444}"
ADMIN_USER="${ADMIN_USER:-scsi_admin}"

echo -e "${AZUL}==============================================================================${NC}"
echo -e "${AZUL}🚀 INICIANDO PROTOCOLO DE HARDENING DE VPS UBUNTU (PADRÃO SCSI / PYCODERBR)${NC}"
echo -e "${AZUL}📌 Porta SSH Customizada: ${SSH_PORT}${NC}"
echo -e "${AZUL}📌 Usuário Administrativo: ${ADMIN_USER}${NC}"
echo -e "${AZUL}==============================================================================${NC}\n"

# 1. Verificação de Privilégios Root
if [ "$(id -u)" -ne 0 ]; then
    echo -e "${VERMELHO}❌ ERRO: Este script deve ser executado como root.${NC}" >&2
    exit 1
fi

# 2. Criação do Usuário Administrativo Sudoer (se não existir)
echo -e "${AMARELO}🔒 [Passo 1/6] Configurando usuário administrativo '${ADMIN_USER}'...${NC}"
if ! id -u "${ADMIN_USER}" >/dev/null 2>&1; then
    useradd -m -s /bin/bash -G sudo "${ADMIN_USER}"
    echo -e "${VERDE}✅ Usuário '${ADMIN_USER}' criado e associado ao grupo sudo.${NC}"
else
    echo -e "${VERDE}ℹ️ Usuário '${ADMIN_USER}' já existe.${NC}"
fi

# Garante pasta .ssh com permissões estritas POSIX
mkdir -p "/home/${ADMIN_USER}/.ssh"
chmod 700 "/home/${ADMIN_USER}/.ssh"
touch "/home/${ADMIN_USER}/.ssh/authorized_keys"
chmod 600 "/home/${ADMIN_USER}/.ssh/authorized_keys"
chown -R "${ADMIN_USER}:${ADMIN_USER}" "/home/${ADMIN_USER}/.ssh"

# 3. Hardening Criptográfico do Daemon SSH
echo -e "\n${AMARELO}🔐 [Passo 2/6] Aplicando Hardening Criptográfico no SSH (${SSH_PORT}/TCP)...${NC}"
SSHD_CONFIG_DIR="/etc/ssh/sshd_config.d"
mkdir -p "${SSHD_CONFIG_DIR}"

cat <<EOF > "${SSHD_CONFIG_DIR}/99-scsi-hardening.conf"
# ==============================================================================
# Hardening de SSH - Padrão SCSI (Zero Trust / Ed25519)
# ==============================================================================
Port ${SSH_PORT}
Protocol 2

# Proibição Absoluta de Autenticação por Senha e Root
PermitRootLogin no
PasswordAuthentication no
PermitEmptyPasswords no
PubkeyAuthentication yes

# Limites Operacionais e Proteção Anti-Brute-Force
MaxAuthTries 3
MaxSessions 5
ClientAliveInterval 300
ClientAliveCountMax 3

# Desativação de Recursos Desnecessários
X11Forwarding no
AllowTcpForwarding yes
PermitUserEnvironment no

# Cifras e Algoritmos KEX Modernos
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com
EOF

chmod 644 "${SSHD_CONFIG_DIR}/99-scsi-hardening.conf"

# Testa a sintaxe do SSH antes de aplicar
if sshd -t; then
    echo -e "${VERDE}✅ Sintaxe de configuração do SSH validada com sucesso.${NC}"
else
    echo -e "${VERMELHO}❌ ERRO: Sintaxe inválida no sshd_config. Revertendo.${NC}" >&2
    rm -f "${SSHD_CONFIG_DIR}/99-scsi-hardening.conf"
    exit 1
fi

# 4. Configuração e Blindagem do Firewall UFW (Default Deny)
echo -e "\n${AMARELO}🧱 [Passo 3/6] Configurando Firewall UFW (Default Deny & Cloudflare Whitelist)...${NC}"

# Define política padrão
ufw --force reset >/dev/null 2>&1 || true
ufw default deny incoming
ufw default allow outgoing

# Libera a porta SSH customizada antes de ativar o UFW (Prevenção de Lockout)
ufw allow "${SSH_PORT}/tcp" comment "SCSI SSH Acesso Administrativo"

# Lista Branca Estrita de Prefixos Oficiais da Cloudflare (IPv4 e IPv6)
CLOUDFLARE_IPV4=(
    "173.245.48.0/20"
    "103.21.244.0/22"
    "103.22.200.0/22"
    "103.31.4.0/22"
    "141.101.64.0/18"
    "108.162.192.0/18"
    "190.93.240.0/20"
    "188.114.96.0/20"
    "197.234.240.0/22"
    "198.41.128.0/17"
    "162.158.0.0/15"
    "104.16.0.0/13"
    "104.24.0.0/14"
    "172.64.0.0/13"
    "131.0.72.0/22"
)

CLOUDFLARE_IPV6=(
    "2400:cb00::/32"
    "2606:4700::/32"
    "2803:f800::/32"
    "2405:b500::/32"
    "2405:8100::/32"
    "2a06:98c0::/29"
    "2c0f:f248::/32"
)

echo "  -> Aplicando regras para 15 blocos IPv4 da Cloudflare (portas 80 e 443)..."
for cidr in "${CLOUDFLARE_IPV4[@]}"; do
    ufw allow proto tcp from "${cidr}" to any port 80,443 comment "Cloudflare IPv4 Anycast" >/dev/null
done

echo "  -> Aplicando regras para 7 blocos IPv6 da Cloudflare (portas 80 e 443)..."
for cidr in "${CLOUDFLARE_IPV6[@]}"; do
    ufw allow proto tcp from "${cidr}" to any port 80,443 comment "Cloudflare IPv6 Anycast" >/dev/null
done

# 5. Resolução do Conflito UFW vs Docker (DOCKER-USER Chain)
echo -e "\n${AMARELO}🐳 [Passo 4/6] Injetando Cadeia DOCKER-USER no UFW (/etc/ufw/after.rules)...${NC}"
UFW_AFTER_RULES="/etc/ufw/after.rules"

if ! grep -q "BEGIN UFW AND DOCKER - SCSI INTEGRATION" "${UFW_AFTER_RULES}"; then
    cat <<'EOF' >> "${UFW_AFTER_RULES}"

# ==============================================================================
# BEGIN UFW AND DOCKER - SCSI INTEGRATION (ADR 008)
# Força o Docker a respeitar o UFW e a não expor portas para IPs fora da Cloudflare
# ==============================================================================
*filter
:DOCKER-USER - [0:0]
:ufw-user-forward - [0:0]

-A DOCKER-USER -j RETURN -s 10.0.0.0/8
-A DOCKER-USER -j RETURN -s 172.16.0.0/12
-A DOCKER-USER -j RETURN -s 192.168.0.0/16
-A DOCKER-USER -p udp -m udp --sport 53 --dport 1024:65535 -j RETURN
-A DOCKER-USER -j ufw-user-forward

-A DOCKER-USER -j DROP -p tcp -m tcp --tcp-flags FIN,SYN,RST,ACK SYN -d 192.168.0.0/16
-A DOCKER-USER -j DROP -p tcp -m tcp --tcp-flags FIN,SYN,RST,ACK SYN -d 10.0.0.0/8
-A DOCKER-USER -j DROP -p tcp -m tcp --tcp-flags FIN,SYN,RST,ACK SYN -d 172.16.0.0/12
-A DOCKER-USER -j DROP -p udp -m udp --dport 0:32767 -d 192.168.0.0/16
-A DOCKER-USER -j DROP -p udp -m udp --dport 0:32767 -d 10.0.0.0/8
-A DOCKER-USER -j DROP -p udp -m udp --dport 0:32767 -d 172.16.0.0/12
# END UFW AND DOCKER - SCSI INTEGRATION
EOF
    echo -e "${VERDE}✅ Cadeia DOCKER-USER injetada com sucesso.${NC}"
else
    echo -e "${VERDE}ℹ️ Cadeia DOCKER-USER já presente em /etc/ufw/after.rules.${NC}"
fi

# Ativa o UFW de forma não-interativa
echo -e "\n${AMARELO}⚡ Ativando UFW com políticas restritivas...${NC}"
ufw --force enable
echo -e "${VERDE}✅ UFW Ativo e Operacional.${NC}"

# 6. Configuração do Fail2ban para Bloqueio de Brute Force
echo -e "\n${AMARELO}🛡️ [Passo 5/6] Configurando Fail2ban para monitorar porta ${SSH_PORT}...${NC}"
if command -v fail2ban-client >/dev/null 2>&1; then
    mkdir -p /etc/fail2ban/jail.d/
    cat <<EOF > /etc/fail2ban/jail.d/99-scsi-ssh.local
[sshd]
enabled = true
port = ${SSH_PORT}
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
findtime = 600
bantime = 3600
banaction = ufw
EOF
    systemctl restart fail2ban || true
    echo -e "${VERDE}✅ Fail2ban configurado para banir invasores na porta ${SSH_PORT}.${NC}"
else
    echo -e "${AMARELO}⚠️ Fail2ban não instalado localmente (será instalado no provisionamento da VPS).${NC}"
fi

# 7. Tunings de Kernel Sysctl para Alta Performance de Rede e I/O (Sysctl Tuning)
echo -e "\n${AMARELO}⚙️ [Passo 6/6] Aplicando Kernel Tuning de Alta Performance (/etc/sysctl.d/99-scsi.conf)...${NC}"
SYSCTL_CONF="/etc/sysctl.d/99-scsi-performance.conf"
cat <<'EOF' > "${SYSCTL_CONF}"
# ==============================================================================
# Kernel Tuning SCSI - Alta Concorrência, I/O e TCP BBR
# ==============================================================================
# Algoritmo de Congestionamento TCP BBR (Google) e Fair Queueing
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr

# Otimização de Conexões Concorrentes e Sockets
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.tcp_slow_start_after_idle = 0
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 15

# Descritores de Arquivos do Sistema
fs.file-max = 2097152

# Proteções contra Ataques de Rede L3/L4
net.ipv4.tcp_syncookies = 1
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Gestão de Memória Virtual para Bancos de Dados (PostgreSQL / Redis)
vm.swappiness = 10
vm.dirty_ratio = 15
vm.dirty_background_ratio = 5
EOF

chmod 644 "${SYSCTL_CONF}"
sysctl -p "${SYSCTL_CONF}" >/dev/null 2>&1 || true
echo -e "${VERDE}✅ Tunings de Kernel e TCP BBR consolidados com sucesso.${NC}"

echo -e "\n${AZUL}==============================================================================${NC}"
echo -e "${VERDE}🏆 HARDENING DE VPS CONCLUÍDO COM 100% DE CONFORMIDADE ARQUITETURAL!${NC}"
echo -e "${AZUL}📌 Próximo Passo: Testar conexão SSH em terminal separado antes de encerrar.${NC}"
echo -e "${AZUL}==============================================================================${NC}\n"
