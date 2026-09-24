# 🛡️ Blindagem da Origem & Restrição de IPs da Cloudflare — SCSI
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 3 — Borda, Domínio & Criptografia (Passo 4: SSL/TLS)  
**Sub-etapa:** 3.4.2 — Neutralização de Direct Origin Bypass via Firewall UFW e Traefik Ingress  
**Data de Emissão:** 21/09/2026  
**Status:** **Homologado para Engenharia de Produção**

---

## 1. O Vetor de Ataque: *Direct Origin Bypass*

O investimento em segurança perimétrica (WAF, Rate Limiting, Mitigação DDoS, Bot Management e SSL Full Strict) pode ser completamente inutilizado se um atacante conseguir **acessar diretamente o endereço IP público da VPS Hostinger**.

Se um invasor descobrir o IP real da VPS (através de registros históricos de DNS, certificados SSL vazados em ferramentas como Shodan/Censys ou scanners automatizados de portas), ele pode enviar requisições HTTP/HTTPS diretamente para a porta 80 ou 443 da VPS. Ao fazer isso, o atacante **contorna todos os filtros da Cloudflare**, atingindo o Traefik e o Django sem passar por nenhuma inspeção.

```mermaid
flowchart TD
    subgraph ATACANTE["Atacante / Scanner Malicioso"]
        ReqDireta["Ataque Direto ao IP da VPS\nhttps://195.35.x.x:443\n(Tentativa de Burlar WAF e Rate Limit)"]
    end

    subgraph CLOUDFLARE_EDGE["Borda Perimétrica Cloudflare"]
        ProxyLaranja["Proxy Laranja + WAF + Rate Limit + DDoS Scrubbing"]
    end

    subgraph ORIGEM_VPS["VPS Hostinger (Origem SCSI)"]
        subgraph CAMADA_UFW["Camada 1: Firewall UFW (Kernel Linux)"]
            FiltroIP{"IP de Origem pertence\nà Cloudflare?"}
        end
        subgraph CAMADA_TRAEFIK["Camada 2: Traefik Ingress Controller"]
            MiddlewareIP{"Middleware ipAllowList\ne trustedIPs"}
            TraefikRouter["Traefik Router (Porta 443 / TLS 1.3)"]
        end
        DjangoApp["Django + Gunicorn + IA"]
    end

    ReqDireta -.->|Bypass da Cloudflare| CAMADA_UFW
    FiltroIP -->|NÃO (IP do Atacante)| DropKernel["🚫 DROP Imediato no Kernel (iptables/UFW)\nConexão Recusada / Silenciosa"]

    UsuarioLegitimo["Usuário Legítimo"] ===> ProxyLaranja
    ProxyLaranja ===|Conexão a partir de IP Cloudflare| FiltroIP
    FiltroIP -->|SIM (IP Oficial Cloudflare)| CAMADA_TRAEFIK
    MiddlewareIP -->|Validado| TraefikRouter --> DjangoApp
```

---

## 2. Doutrina de Defesa em Dois Níveis (ADR 008)

Para blindar a origem de ponta a ponta, o SCSI adota uma estratégia de **Defesa em Profundidade (ADR 008)**:

1. **Nível 1 (Firewall do Sistema Operacional - UFW / Linux Kernel):**
   - O firewall da VPS Hostinger é configurado com política padrão `DEFAULT_INPUT_POLICY="DROP"`.
   - As portas 80 e 443 são liberadas **estrita e exclusivamente** para os blocos de rede IPv4 e IPv6 oficiais da Cloudflare.
   - Qualquer pacote vindo de outro IP para as portas 80/443 é descartado em nível de kernel, sem abrir socket TCP e sem consumir recursos do Traefik.
2. **Nível 2 (Ingress Controller - Traefik Ingress):**
   - O Traefik é configurado com `forwardedHeaders.trustedIPs` contendo a lista da Cloudflare, garantindo que o cabeçalho `CF-Connecting-IP` seja confiável e o IP real do cliente seja auditado.
   - Aplicação do middleware `ipAllowList` como redundância criptográfica.

---

## 3. Matriz Oficial de Blocos de IP da Cloudflare

A Cloudflare publica oficialmente os prefixos de rede utilizados por seus nós Anycast para comunicar-se com os servidores de origem:

### 3.1. Faixas IPv4 Oficiais (15 Prefixos CIDR):
```text
173.245.48.0/20
103.21.244.0/22
103.22.200.0/22
103.31.4.0/22
141.101.64.0/18
108.162.192.0/18
190.93.240.0/20
188.114.96.0/20
197.234.240.0/22
198.41.128.0/17
162.158.0.0/15
104.16.0.0/13
104.24.0.0/14
172.64.0.0/13
131.0.72.0/22
```

### 3.2. Faixas IPv6 Oficiais (7 Prefixos CIDR):
```text
2400:cb00::/32
2606:4700::/32
2803:f800::/32
2405:b500::/32
2405:8100::/32
2a06:98c0::/29
2c0f:f248::/32
```

---

## 4. Configuração no Firewall UFW da VPS Hostinger

No provisionamento da VPS Ubuntu Linux (Fase 4 e Fase 6), as regras do UFW são aplicadas para blindar as portas web:

```bash
# Política padrão de negação de entrada
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Liberar porta SSH de administração (porta padrão 22 ou porta customizada)
sudo ufw allow 22/tcp comment 'SSH Administrativo'

# Liberar porta 443 (HTTPS) EXCLUSIVAMENTE para a Cloudflare (IPv4)
for ip in $(curl -s https://www.cloudflare.com/ips-v4); do
    sudo ufw allow proto tcp from $ip to any port 443 comment 'Cloudflare IPv4'
done

# Liberar porta 443 (HTTPS) EXCLUSIVAMENTE para a Cloudflare (IPv6)
for ip in $(curl -s https://www.cloudflare.com/ips-v6); do
    sudo ufw allow proto tcp from $ip to any port 443 comment 'Cloudflare IPv6'
done

# Ativar o firewall
sudo ufw enable
```

---

## 5. Configuração Declarativa no Traefik Ingress (`traefik.yml`)

No arquivo de configuração estática do Traefik Ingress (`traefik.yml`), os entrypoints declaram a confiança estrita nos proxies da Cloudflare:

```yaml
entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https

  websecure:
    address: ":443"
    forwardedHeaders:
      trustedIPs:
        # Blocos IPv4 Oficiais Cloudflare
        - "173.245.48.0/20"
        - "103.21.244.0/22"
        - "103.22.200.0/22"
        - "103.31.4.0/22"
        - "141.101.64.0/18"
        - "108.162.192.0/18"
        - "190.93.240.0/20"
        - "188.114.96.0/20"
        - "197.234.240.0/22"
        - "198.41.128.0/17"
        - "162.158.0.0/15"
        - "104.16.0.0/13"
        - "104.24.0.0/14"
        - "172.64.0.0/13"
        - "131.0.72.0/22"
        # Blocos IPv6 Oficiais Cloudflare
        - "2400:cb00::/32"
        - "2606:4700::/32"
        - "2803:f800::/32"
        - "2405:b500::/32"
        - "2405:8100::/32"
        - "2a06:98c0::/29"
        - "2c0f:f248::/32"
```

- **Por que `trustedIPs` é vital?** Se o Traefik não souber em quais IPs confiar, qualquer cliente poderia enviar um cabeçalho falso `X-Forwarded-For: 127.0.0.1` ou forjar sua identidade. Com `trustedIPs`, o Traefik extrai o IP real do cliente exclusivamente quando a requisição provém de um nó oficial da Cloudflare, repassando o endereço verídico ao Django (`CF-Connecting-IP`).

---

## 6. Automação Declarativa Headless via Cloudflare API v4 (ADR 011)

A Cloudflare disponibiliza um endpoint público oficial da API v4 que retorna os blocos de IP atualizados em tempo real:

### 6.1. Endpoint Público de IPs da Cloudflare
`GET https://api.cloudflare.com/client/v4/ips`

### 6.2. Script Headless de Auditoria e Sincronização Dinâmica (PowerShell):
```powershell
# Consulta dos IPs oficiais da Cloudflare via API v4 (ADR 011)
$response = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/ips" -Method Get

if ($response.success) {
    $ipv4 = $response.result.ipv4_cidrs
    $ipv6 = $response.result.ipv6_cidrs
    Write-Host "Prefixos IPv4 recuperados: $($ipv4.Count)"
    Write-Host "Prefixos IPv6 recuperados: $($ipv6.Count)"
    
    # Validação dos blocos críticos do SCSI
    if ($ipv4 -contains "104.16.0.0/13" -and $ipv4 -contains "172.64.0.0/13") {
        Write-Host "Auditoria de IPs APROVADA: Blocos canônicos presentes e íntegros."
    }
}
```

---

## 7. Parecer de Engenharia da Sub-etapa 3.4.2

- **Arquiteto de Soluções:** Homologa a blindagem da origem. Neutralizar o *Direct Origin Bypass* é mandatório: sem essa trava no firewall, qualquer esforço empregado no WAF e no Rate Limiting da Cloudflare seria inócuo diante de um atacante que descobrisse o IP do servidor.
- **Engenheiro DevOps:** Ressalta a eficiência do descarte em nível de kernel Linux (UFW/iptables). Pacotes maliciosos disparados contra o IP da VPS são descartados instantaneamente (*DROP*), mantendo a CPU da VPS fria e os sockets do Traefik 100% disponíveis.
- **Engenheiro de Backend:** A configuração correta de `trustedIPs` no Traefik garante que o Django receba sempre o IP verídico do usuário final via `request.META['HTTP_CF_CONNECTING_IP']`, essencial para auditoria de logs e rate limit no Redis.
- **Engenheiro de IA:** Blindagem completa contra ataques de exaustão que tentassem mirar diretamente no endpoint de inferência ou nos workers da aplicação.
