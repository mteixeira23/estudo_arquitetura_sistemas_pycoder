# 🌐 Topologia de Rede Anycast & Modelo de Ingress de Borda (Cloudflare / SCSI)
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 3 — Borda, Domínio & Criptografia (Passo 3: Cloudflare)  
**Sub-etapa:** 3.1.1 — Desenho do Fluxo de Tráfego Anycast & Modelo de Ingress da Borda  
**Data de Emissão:** 21/09/2026  
**Status:** **Homologado para Engenharia de Produção**

---

## 1. Visão Geral da Arquitetura de Borda Anycast

Na arquitetura corporativa **SCSI (PycoderBR)**, a infraestrutura central hospedada na VPS Hostinger opera sob o princípio de **Origem Oculta (Hidden Origin Architecture)**. Nenhum tráfego público atinge a VPS diretamente. Toda e qualquer requisição externa é obrigatoriamente interceptada, inspecionada e filtrada na rede de borda distribuída globalmente pela Cloudflare através do protocolo **BGP Anycast**.

```mermaid
flowchart TD
    subgraph CLIENT_TIER["1. Clientes Globais (Navegadores, Mobile Apps, APIs)"]
        UserBR["Usuário (Brasil / América Latina)"]
        UserEU["Usuário (Europa)"]
        UserUS["Usuário (América do Norte)"]
        Attacker["Atacante / Bot / Scanner OWASP"]
    end

    subgraph CLOUDFLARE_ANYCAST["2. Borda Anycast Global Cloudflare (200+ PoPs Globais)"]
        PoP_GRU["PoP São Paulo (GRU)\nAnycast IP: 104.21.x.x / 172.67.x.x"]
        PoP_LIS["PoP Lisboa (LIS)\nAnycast IP: 104.21.x.x / 172.67.x.x"]
        PoP_MIA["PoP Miami (MIA)\nAnycast IP: 104.21.x.x / 172.67.x.x"]
        
        WAF_ENGINE["Motor WAF & DDoS Mitigation\n- Inspeção L3/L4/L7\n- Rate Limiting Borda\n- Desafio JS / Captcha"]
        PROXY_ENGINE["Motor de Proxy Laranja (Reverse Proxy)\n- Terminação TLS 1.3 / HTTP/3\n- Injeção de Headers Confiáveis\n- Ocultação de IP de Origem"]
    end

    subgraph TRANSIT_TIER["3. Trânsito Criptografado Inter-Data Center"]
        Tunnel["Conexão TLS 1.3 Criptografada (Full Strict - ADR 010)\nOrigem Validada / Porta 443"]
    end

    subgraph ORIGIN_VPS["4. VPS Hostinger (Ubuntu Linux 24.04 LTS)"]
        Firewall["Firewall UFW & Iptables\n(Bloqueia todo tráfego 80/443 fora da Cloudflare)"]
        Traefik["Traefik Ingress Controller\n(Docker Swarm - Porta 443)\n- Terminação TLS com Origin CA\n- Roteamento Dinâmico por Host/Path"]
        
        subgraph OVERLAY_NET["Redes Overlay Criptografadas Docker Swarm"]
            Django["Core Web: Django + Gunicorn (api.scsi / app.scsi)"]
            Redis["Cache & Sessões: Redis"]
            DB["Persistência: PostgreSQL 16"]
            Celery["Processamento Assíncrono: Celery Worker / Beat"]
            RabbitMQ["Mensageria: RabbitMQ Broker"]
        end
    end

    UserBR -->|BGP Anycast mais próximo (15ms)| PoP_GRU
    UserEU -->|BGP Anycast mais próximo (10ms)| PoP_LIS
    UserUS -->|BGP Anycast mais próximo (12ms)| PoP_MIA
    Attacker -.->|Bloqueado / Desafiado na Borda| WAF_ENGINE

    PoP_GRU --> WAF_ENGINE
    PoP_LIS --> WAF_ENGINE
    PoP_MIA --> WAF_ENGINE

    WAF_ENGINE --> PROXY_ENGINE
    PROXY_ENGINE ===>|Full Strict HTTPS| Tunnel
    Tunnel --> Firewall
    Firewall --> Traefik
    Traefik --> Django
    Django --> Redis & DB & RabbitMQ
    RabbitMQ --> Celery
```

---

## 2. Funcionamento do Roteamento BGP Anycast

1. **Anúncio Global de Rota Única:**
   A Cloudflare anuncia os mesmos blocos de endereçamento IPv4 e IPv6 a partir de mais de 300 data centers em todo o planeta via **BGP (Border Gateway Protocol)**.
2. **Roteamento de Menor Distância de Rede:**
   Quando um cliente resolve o domínio canônico (ex: `scsi.pycoder.com.br`), o provedor de internet do usuário (ISP) direciona os pacotes para o ponto de presença (PoP) mais próximo em termos de saltos BGP e latência (ex: PoP São Paulo no Brasil).
3. **Absorção Local de Ataques:**
   Um ataque massivo de negação de serviço (DDoS volumétrico L3/L4) distribuído é fragmentado e absorvido regionalmente pela malha global da Cloudflare antes de se consolidar em um gargalo central.

---

## 3. Modelo de Ingress em Triplo Hop (Triple-Hop Architecture)

A passagem do pacote segue três saltos rigorosamente delimitados:

| Salto (Hop) | Segmento de Rede | Protocolo & Transporte | Criptografia & Certificado |
| :--- | :--- | :--- | :--- |
| **Hop 1: Público** | Navegador do Usuário ➔ Borda Cloudflare | HTTPS / HTTP/3 (QUIC) / HTTP/2 | Certificado Universal Edge SSL (Let's Encrypt / Google Trust Services emitido pela Cloudflare) |
| **Hop 2: Trânsito** | Borda Cloudflare ➔ VPS Hostinger | HTTPS (Porta 443 TCP) | Modo **Full Strict (ADR 010)** via **Cloudflare Origin CA Certificate** instalado no Traefik |
| **Hop 3: Interno** | Traefik Ingress ➔ Contêiner Django/Worker | HTTP/1.1 sobre Rede Overlay Docker | Rede virtual privada interna (`frontend-net` / `backend-net`), com isolamento por namespace Linux |

---

## 4. Rastreabilidade & Injeção de Headers Corporativos

Como o Traefik recebe as conexões a partir dos servidores de proxy da Cloudflare, o IP de conexão direta na porta 443 será sempre um IP da Cloudflare. Para que o Django, os logs de auditoria e os motores de detecção de fraude registrem a identidade real do cliente, a borda injeta cabeçalhos HTTP canônicos:

```http
GET /api/v1/auth/login/ HTTP/1.1
Host: api.scsi.pycoder.com.br
CF-Connecting-IP: 201.86.120.45
CF-IPCountry: BR
CF-RAY: 8c56789abcde0123-GRU
CF-Visitor: {"scheme":"https"}
X-Forwarded-For: 201.86.120.45, 172.68.10.12
X-Forwarded-Proto: https
User-Agent: Mozilla/5.0 ...
```

### Papel dos Headers na Aplicação Django:
- **`CF-Connecting-IP`:** Contém o IP público real e verificado do cliente que estabeleceu o handshake com a borda. É este valor que o backend utiliza para limitação de taxa por usuário e auditoria de segurança.
- **`CF-IPCountry`:** Código de país ISO de 2 letras (ex: `BR`), permitindo decisões geográficas instantâneas sem consumo de CPU para consultas locais de MaxMind GeoIP.
- **`CF-RAY`:** Hash alfanumérico único gerado para cada requisição. Serve como **Trace ID** universal entre o log da Cloudflare, o log de acesso do Traefik e o log de execução do Django/Gunicorn.
- **`X-Forwarded-Proto: https`:** Informa ao framework web que a requisição original utilizou transporte criptografado, garantindo o funcionamento do `SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')` no Django settings.

---

## 5. Prevenção de Ataques de Contorno (Direct Origin Bypass)

### A Vulnerabilidade:
Se um atacante descobrir o endereço IP público da VPS Hostinger (através de registros históricos de DNS antigos, certificados com vazamento de IP ou scans massivos na faixa de IPs da Hostinger), ele poderá disparar requisições diretamente contra a porta 443 da VPS, contornando todas as regras do WAF, o rate limiting e a proteção DDoS da Cloudflare.

### A Blindagem Arquitetural SCSI:
1. **Regra de Firewall na VPS (Fase 4):**
   O firewall da VPS (UFW/Iptables) será parametrizado para permitir tráfego de entrada nas portas `80` e `443` **estritamente originado dos blocos de IP oficiais da Cloudflare** (IPv4 e IPv6). Qualquer pacote com origem diferente é sumariamente descartado (*DROP* silencioso).
2. **Validação de Host Header no Traefik (Fase 5):**
   O Traefik rejeitará com erro `404 Not Found` ou fechará a conexão com qualquer requisição feita diretamente pelo IP bruto da VPS (ex: `https://195.35.x.x/`), aceitando tráfego apenas com o Server Name Indication (SNI) e Host Header correspondentes aos subdomínios autorizados (`api.scsi.pycoder.com.br`, etc.).

---

## 6. Parecer de Engenharia da Sub-etapa 3.1.1

- **Arquiteto de Soluções:** Topologia desenhada com separação estrita de responsabilidades entre borda Anycast e processamento corporativo na VPS. Elimina qualquer ponto único de falha perimétrico.
- **Engenheiro DevOps:** Rota de pacotes e modelo de triplo hop totalmente alinhados com o modo Full Strict e a integração do Traefik no Docker Swarm.
