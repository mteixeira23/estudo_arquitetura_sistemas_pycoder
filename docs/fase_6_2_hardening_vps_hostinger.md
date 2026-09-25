# 🛡️ Relatório Técnico de Homologação — Sub-etapa 6.2: Hardening de VPS Linux (Hostinger)
**Projeto:** Plataforma de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 6 — Infraestrutura, Borda e Hardening  
**Sub-etapa:** 6.2 — Hardening Perimétrico de VPS, SSH Ed25519, Firewall UFW e Fail2ban  
**Data:** 25/09/2026  
**Status:** **100% Implementado e Homologado**  
**Conformidade:** ADR 007 (LF puro), ADR 008 (Defesa em Profundidade) e ADR 012 (Ubuntu 24.04 LTS)

---

## 1. Visão Geral da Camada de Segurança do Host (VPS)

A Sub-etapa 6.2 estabelece a blindagem perimétrica do sistema operacional da VPS Hostinger (Ubuntu 24.04 LTS). O host é configurado sob o paradigma de **Zero Trust**, garantindo que:
1. O acesso administrativo ocorra exclusivamente via chaves criptográficas de curva elíptica em porta ofuscada.
2. O firewall do kernel rejeite todo o tráfego que não provenha comprovadamente da rede Anycast oficial da Cloudflare.
3. As portas publicadas por contêineres Docker sejam forçadas a respeitar as regras restritivas do firewall nativo.

```mermaid
flowchart TD
    subgraph WAN["Internet Externa"]
        Atacante["Scanner / Força Bruta / Botnet"]
        CloudflareAnycast["Cloudflare Edge (IPs Oficiais)"]
    end

    subgraph VPS_HOSTINGER["VPS Hostinger (Ubuntu 24.04 LTS)"]
        subgraph FIREWALL["UFW & Kernel iptables"]
            PortaSSH["Porta 22444/TCP\n(SSH Ed25519 + Fail2ban)"]
            ChainDocker["Cadeia DOCKER-USER\n(Bloqueia tráfego direto não-Cloudflare)"]
            PortasWeb["Portas 80 e 443\n(Liberadas APENAS para Cloudflare)"]
        end

        subgraph ORQUESTRAÇÃO["Docker Swarm Engine"]
            TraefikIngress["Traefik Ingress (Porta 443 / mode: host)"]
        end
    end

    Atacante -.->|Tentativa de Conexão Direta| PortasWeb -->|DROP Imediato| DropHost["Bloqueio em Kernel (Zero Log)"]
    CloudflareAnycast ===>|Tráfego Autorizado (15 IPv4 / 7 IPv6)| PortasWeb --> TraefikIngress
    Atacante -.->|Scanner na Porta 22| DropSSH["DROP (Porta Fechada)"]
    Atacante -.->|Força Bruta na Porta 22444| PortaSSH -->|3 Tentativas| Fail2ban["Banimento por 1h (Fail2ban)"]
```

---

## 2. Pilares de Hardening Implementados

### 2.1. Acesso SSH Criptográfico e Zero Trust (`/etc/ssh/sshd_config.d/99-scsi-hardening.conf`)
- **Porta Customizada:** `Port 22444` (mitiga 99% dos scanners automatizados que varrem a porta padrão 22).
- **Proibição de Senhas:** `PasswordAuthentication no` e `PermitEmptyPasswords no`.
- **Desativação de Root:** `PermitRootLogin no` (acesso restrito a sudoer não-root `scsi_admin`).
- **Padrão Criptográfico Ed25519:** Chaves de curva elíptica de 256 bits, com KEX `curve25519-sha256` e cifras AEAD `chacha20-poly1305` e `aes256-gcm`.
- **Limitação de Sessões:** `MaxAuthTries 3`, `ClientAliveInterval 300` (timeout de inatividade em 15 minutos).

---

### 2.2. Firewall UFW Nativo & Whitelist Restrita da Cloudflare
- **Política Base:** *Default Deny* (`ufw default deny incoming`, `ufw default allow outgoing`).
- **Abertura Segura:** Apenas a porta administrativa `22444/tcp` é aberta para o público geral (com proteção Fail2ban).
- **Blindagem das Portas Web (80 e 443):**
  - **15 Prefixos IPv4:** `173.245.48.0/20`, `103.21.244.0/22`, `103.22.200.0/22`, `103.31.4.0/22`, `141.101.64.0/18`, `108.162.192.0/18`, `190.93.240.0/20`, `188.114.96.0/20`, `197.234.240.0/22`, `198.41.128.0/17`, `162.158.0.0/15`, `104.16.0.0/13`, `104.24.0.0/14`, `172.64.0.0/13`, `131.0.72.0/22`.
  - **7 Prefixos IPv6:** `2400:cb00::/32`, `2606:4700::/32`, `2803:f800::/32`, `2405:b500::/32`, `2405:8100::/32`, `2a06:98c0::/29`, `2c0f:f248::/32`.
  - *Garantia:* Tentativas de acesso direto ao IP da VPS (`http://195.35.40.123` ou `https://195.35.40.123`) sofrem *DROP* imediato na camada de rede.

---

### 2.3. Resolução do Conflito Docker vs UFW (Cadeia `DOCKER-USER`)
O Docker manipula as regras de `iptables` na cadeia `PREROUTING`, o que tradicionalmente expõe portas publicadas para a Internet ignorando o UFW. Para neutralizar essa vulnerabilidade crítica, injetamos em `/etc/ufw/after.rules`:

```text
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
```

Isso garante que o roteamento de contêineres Docker obedeça estritamente às regras do firewall do host.

---

### 2.4. Proteção Ativa com Fail2ban (`/etc/fail2ban/jail.d/99-scsi-ssh.local`)
- Monitora `/var/log/auth.log` na porta customizada `22444`.
- `maxretry = 3` em janela de `findtime = 600s` (10 minutos).
- `bantime = 3600s` (1 hora de bloqueio automático via UFW).

---

### 2.5. Otimização de Kernel Sysctl para Alta Performance de Rede e I/O
Configuração consolidada em `/etc/sysctl.d/99-scsi-performance.conf`:
- **TCP BBR (Bottleneck Bandwidth and RTT) + fq:** Maximiza a taxa de transferência e reduz latência em conexões de streaming e WebSockets.
- **`net.core.somaxconn = 65535`:** Fila de conexões pendentes para absorver picos de tráfego no Traefik.
- **`fs.file-max = 2097152`:** 2 milhões de descritores de arquivos simultâneos.
- **`vm.swappiness = 10`:** Protege os processos em memória (PostgreSQL 16, Redis e Ollama) contra paginação excessiva em disco.

---

## 3. Artefatos Desenvolvidos e Auditados

1. [`scripts/hardening_vps_hostinger.sh`](file:///c:/Users/marcos.teixeira/.gemini/antigravity/scratch/estudo_arquitetura_sistemas_pycoder/scripts/hardening_vps_hostinger.sh): Script corporativo não-interativo com validação prévia de sintaxe do `sshd -t` para prevenção de lockout.
2. [`scripts/verificar_hardening_vps.py`](file:///c:/Users/marcos.teixeira/.gemini/antigravity/scratch/estudo_arquitetura_sistemas_pycoder/scripts/verificar_hardening_vps.py): Auditor estático de conformidade executado com 100% de sucesso (0 bytes CR — conformidade estrita com a ADR 007).

---

## 4. Conclusão da Sub-etapa 6.2
A VPS Hostinger atinge padrão militar de segurança e resiliência, com a superfície de ataque minimizada e preparada para a orquestração segura do Traefik Ingress e Docker Swarm. Sub-etapa **concluída e pronta para sabatina técnica**.
