# 🧱 Especificação de Firewall (UFW) e Tratamento de Roteamento Docker — SCSI
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 4 — Infraestrutura VPS & Hardening Linux  
**Sub-etapa:** 4.3 — Configuração do Firewall (UFW) e Integração Segura com Docker  
**Data de Emissão:** 24/09/2026  

---

## 1. Doutrina de Firewall Padrão (Zero Trust)

O *Uncomplicated Firewall* (UFW) atua como a interface front-end do `iptables` / `nftables` no Ubuntu 24.04 LTS. Ele representa o Nível 1 da nossa proteção contra *Direct Origin Access*.

**Política Base:** Bloquear absolutamente todo o tráfego de entrada e permitir todo o tráfego de saída.

```bash
ufw default deny incoming
ufw default allow outgoing
```

---

## 2. Liberação de Acesso Administrativo (SSH)

Antes de habilitar o firewall, é mandatório liberar a porta customizada do SSH (definida na Sub-etapa 4.2), sob pena de bloqueio permanente (Lockout).

```bash
# Libera a porta customizada (ex: 22444) via TCP
ufw allow 22444/tcp comment "Acesso SSH Administrativo SCSI"
```

---

## 3. Lista Branca Restrita: IPs da Cloudflare (ADR 008)

Para garantir que o Traefik receba requisições **apenas** através da rede Anycast da Cloudflare, o UFW bloqueará conexões diretas ao IP da VPS nas portas 80/443 de qualquer outra origem.

```bash
# IPs Cloudflare - IPv4
for ip in 173.245.48.0/20 103.21.244.0/22 103.22.200.0/22 103.31.4.0/22 141.101.64.0/18 108.162.192.0/18 190.93.240.0/20 188.114.96.0/20 197.234.240.0/22 198.41.128.0/17 162.158.0.0/15 104.16.0.0/13 104.24.0.0/14 172.64.0.0/13 131.0.72.0/22; do
  ufw allow proto tcp from $ip to any port 80,443 comment "Cloudflare IPv4"
done

# IPs Cloudflare - IPv6
for ip in 2400:cb00::/32 2606:4700::/32 2803:f800::/32 2405:b500::/32 2405:8100::/32 2a06:98c0::/29 2c0f:f248::/32; do
  ufw allow proto tcp from $ip to any port 80,443 comment "Cloudflare IPv6"
done
```

---

## 4. RESOLUÇÃO DE CONFLITO CRÍTICO: UFW vs Docker (DOCKER-USER Chain)

⚠️ **Problema de Segurança Grave:** O Docker, por padrão, altera dinamicamente as tabelas de roteamento do `iptables` (cadeia `PREROUTING` no NAT). Isso faz com que portas publicadas no Docker ignorem sumariamente as regras do UFW. Se o Traefik expuser a porta 443, ela ficará aberta para o mundo todo, burlando o script acima.

**Solução (A Cadeira DOCKER-USER):**
Precisamos forçar o Docker a respeitar o UFW injetando um bloqueio na cadeia especial `DOCKER-USER`.

Adicione o bloco abaixo no final do arquivo `/etc/ufw/after.rules`:

```text
# BEGIN UFW AND DOCKER - SCSI INTEGRATION
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

-A DOCKER-USER -j RETURN
COMMIT
# END UFW AND DOCKER
```

Após editar, reiniciar o UFW:
```bash
ufw reload
ufw enable
```

A partir desse momento, a rede Swarm está **totalmente encapsulada** e o tráfego exposto nos nós obedecerá irrestritamente às liberações feitas no nível do UFW (Nível 1 de Defesa).
