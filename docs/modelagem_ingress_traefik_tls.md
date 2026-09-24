# 🚦 Modelagem Declarativa dos Ingressos do Traefik para Roteamento TLS — SCSI
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 3 — Borda, Domínio & Criptografia (Passo 4: SSL/TLS)  
**Sub-etapa:** 3.4.3 — Configuração Declarativa de Entrypoints, Certificados Origin CA e Labels Docker Swarm (REVISADA)  
**Data de Emissão:** 24/09/2026  
**Status:** **Homologado e Otimizado para Produção**

---

## 1. O Papel do Traefik Ingress na Arquitetura SCSI

Na arquitetura de microsserviços do **SCSI (PycoderBR)**, o **Traefik v3.1** atua como a única porta de entrada pública da VPS Hostinger. Ele recebe o tráfego criptografado proveniente da Cloudflare na porta 443, realiza a terminação TLS utilizando o certificado **Cloudflare Origin CA**, inspeciona e valida os cabeçalhos de proxy e roteia dinamicamente cada requisição para os containers correspondentes através da rede interna isolada do Docker Swarm (`scsi_public`).

```mermaid
flowchart LR
    CloudflareEdge["Borda Cloudflare (PoPs Anycast)\nHTTPS TLS 1.3"] ===|Porta 443 (IPs Cloudflare)| Traefik["Traefik Ingress (v3.1)\nOrigin CA Estrito (15 anos)"]

    subgraph REDE_SWARM_INTERNA["Rede Overlay Interna: scsi_public (Zero Exposição Pública)"]
        DjangoAPI["django_gunicorn:8000\n(api.scsi.pycoder.com.br)"]
        AppFrontend["app_frontend:80\n(app.scsi.pycoder.com.br)"]
        TraefikDash["traefik_dashboard\n(traefik.scsi.pycoder.com.br)"]
        FlowerDash["celery_flower:5555\n(flower.scsi.pycoder.com.br)"]
    end

    Traefik -->|Roteador: Host(`api...`)| DjangoAPI
    Traefik -->|Roteador: Host(`app...`)| AppFrontend
    Traefik -->|Roteador + BasicAuth + IPAllow| TraefikDash
    Traefik -->|Roteador + BasicAuth + IPAllow| FlowerDash
```

---

## 2. Configuração Estática do Traefik (`traefik.yml`)

A configuração estática inicializa os entrypoints de rede, define o nível de log e conecta o Traefik ao daemon do Docker no modo Swarm:

```yaml
# ==============================================================================
# CONFIGURAÇÃO ESTÁTICA DO TRAEFIK INGRESS — SCSI (traefik.yml)
# ==============================================================================
global:
  checkNewVersion: false
  sendAnonymousUsage: false

log:
  level: INFO
  format: json

accessLog:
  format: json
  fields:
    defaultMode: keep
    headers:
      defaultMode: keep
      names:
        CF-Connecting-IP: keep
        CF-Ray: keep
        X-Forwarded-For: keep
        X-Forwarded-Proto: keep

# [IA-TUNING] Aumentado os timeouts para suportar chamadas de LLM longas e streaming LangGraph
serversTransport:
  forwardingTimeouts:
    dialTimeout: "30s"
    responseHeaderTimeout: "300s"
    idleConnTimeout: "90s"

entryPoints:
  # Entrypoint HTTP (Redirecionamento incondicional na origem caso Always Use HTTPS falhe)
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
          permanent: true
    # Por coerência com a ADR 008, validamos os IPs da borda também aqui
    forwardedHeaders:
      trustedIPs: &cloudflare_ips
        # Blocos Oficiais IPv4 Cloudflare
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
        # Blocos Oficiais IPv6 Cloudflare
        - "2400:cb00::/32"
        - "2606:4700::/32"
        - "2803:f800::/32"
        - "2405:b500::/32"
        - "2405:8100::/32"
        - "2a06:98c0::/29"
        - "2c0f:f248::/32"

  # Entrypoint Seguro HTTPS (Recepção do tráfego da Cloudflare)
  websecure:
    address: ":443"
    http:
      tls: 
        options: default # Ativação GLOBAL das cifras e sniStrict definidos no dynamic_tls.yml
    forwardedHeaders:
      trustedIPs: *cloudflare_ips

providers:
  # Provedor Dinâmico via Docker Swarm
  swarm:
    endpoint: "unix:///var/run/docker.sock" # [TODO: Substituir por docker-socket-proxy em prod para isolamento]
    exposedByDefault: false
    network: "scsi_public"

  # Provedor Dinâmico baseado em arquivos locais
  file:
    directory: "/etc/traefik/dynamic"
    watch: true

api:
  dashboard: true
  insecure: false
```

---

## 3. Configuração Dinâmica de Certificados TLS (`dynamic_tls.yml`)

O par de chaves do **Cloudflare Origin CA** (emitido na Sub-etapa 3.4.1) é injetado como provedor padrão, assegurando compatibilidade com as opções rigorosas TLS.

```yaml
# ==============================================================================
# CONFIGURAÇÃO DINÂMICA DE TLS — SCSI (/etc/traefik/dynamic/tls.yml)
# ==============================================================================
tls:
  stores:
    default:
      defaultCertificate:
        certFile: "/run/secrets/scsi_origin_crt" # Arquivos mapeados no Swarm via docker secrets
        keyFile: "/run/secrets/scsi_origin_key"

  options:
    default:
      minVersion: "VersionTLS12"
      cipherSuites:
        - "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256"
        - "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256"
        - "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384"
        - "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384"
        - "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305"
        - "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305"
        - "TLS_AES_128_GCM_SHA256"
        - "TLS_AES_256_GCM_SHA384"
        - "TLS_CHACHA20_POLY1305_SHA256"
      curvePreferences:
        - "X25519"      # Prioridade máxima (alta performance em TLS 1.3)
        - "CurveP256"
        - "CurveP384"
        - "CurveP521"
      sniStrict: true   # Obriga verificação de hostname (blindagem contra scan IP-direto)
```

---

## 4. Middlewares Corporativos do Traefik (`dynamic_middlewares.yml`)

```yaml
# ==============================================================================
# MIDDLEWARES CORPORATIVOS — SCSI (/etc/traefik/dynamic/middlewares.yml)
# ==============================================================================
http:
  middlewares:
    # 1. Compressão dinâmica de assets com exclusão para Streaming de IA
    scsi-compress:
      compress:
        excludedContentTypes:
          - "text/event-stream"  # OBRIGATÓRIO para Server-Sent Events (SSE) e LangGraph streaming
          - "application/octet-stream"

    # 2. Cabeçalhos de Segurança da Aplicação (HSTS, Headers, Forwarded)
    scsi-headers:
      headers:
        customRequestHeaders:
          X-Forwarded-Proto: "https"
        customResponseHeaders:
          Strict-Transport-Security: "max-age=31536000; includeSubDomains; preload" # TLS Full Strict mandate
          X-Frame-Options: "DENY"
          X-Content-Type-Options: "nosniff"
          Referrer-Policy: "strict-origin-when-cross-origin"
          # CSP deixado para a fase de frontend.

    # 3. Autenticação Básica para Dashboards Administrativos (Traefik e Flower)
    scsi-admin-auth:
      basicAuth:
        # Credencial com bcrypt cost 12 (Substituir placeholder na implantação)
        users:
          - "admin:$$2y$$12$$REPLACE_ME_WITH_REAL_BCRYPT_HASH"

    # 4. Restrição de IP para Dashboards Admin (Evitar brute-force)
    scsi-admin-ipallowlist:
      ipAllowList:
        sourceRange:
          - "127.0.0.1/32"
          # - "IP_DA_VPN_CORPORATIVA/32" # Ajustar em prod

    # 5. Redirecionamento Canônico de WWW para Apex Domain
    scsi-redirect-www-to-apex:
      redirectRegex:
        regex: "^https?://www\\.scsi\\.pycoder\\.com\\.br/(.*)"
        replacement: "https://scsi.pycoder.com.br/$${1}"
        permanent: true
```

---

## 5. Modelagem Declarativa de Labels no Docker Swarm (`docker-compose.yml`)

### 5.1. Serviço Django + Gunicorn (`api.scsi.pycoder.com.br`)
> ⚠️ **Atenção Backend:** O middleware enviará o `X-Forwarded-Proto`, mas o Django vai ignorá-lo se não houver `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")` e `USE_X_FORWARDED_HOST = True` no `settings.py`. Isso é crítico para CSRF e cookies seguros!

```yaml
services:
  django:
    image: scsi_django:latest
    networks:
      - scsi_public
      - scsi_internal
    deploy:
      replicas: 2
      labels:
        - "traefik.enable=true"
        - "traefik.docker.network=scsi_public"
        - "traefik.http.routers.django.rule=Host(`api.scsi.pycoder.com.br`)"
        - "traefik.http.routers.django.entrypoints=websecure"
        - "traefik.http.routers.django.middlewares=scsi-compress,scsi-headers"
        - "traefik.http.services.django.loadbalancer.server.port=8000"
```

### 5.2. Serviço Frontend SPA / Console (`app.scsi.pycoder.com.br`)
```yaml
  frontend:
    image: scsi_frontend:latest
    networks:
      - scsi_public
    deploy:
      replicas: 2
      labels:
        - "traefik.enable=true"
        - "traefik.docker.network=scsi_public"
        - "traefik.http.routers.frontend.rule=Host(`app.scsi.pycoder.com.br`)"
        - "traefik.http.routers.frontend.entrypoints=websecure"
        - "traefik.http.routers.frontend.middlewares=scsi-compress,scsi-headers,scsi-redirect-www-to-apex"
        - "traefik.http.services.frontend.loadbalancer.server.port=80"
```

### 5.3. Dashboard do Traefik (`traefik.scsi.pycoder.com.br`)
```yaml
  traefik:
    image: traefik:v3.1
    networks:
      - scsi_public
    deploy:
      labels:
        - "traefik.enable=true"
        - "traefik.docker.network=scsi_public"
        - "traefik.http.routers.dashboard.rule=Host(`traefik.scsi.pycoder.com.br`)"
        - "traefik.http.routers.dashboard.service=api@internal"
        - "traefik.http.routers.dashboard.entrypoints=websecure"
        - "traefik.http.routers.dashboard.middlewares=scsi-admin-ipallowlist,scsi-admin-auth,scsi-headers"
```

### 5.4. Dashboard do Celery Flower (`flower.scsi.pycoder.com.br`)
```yaml
  flower:
    image: mher/flower:2.0.1
    networks:
      - scsi_public
      - scsi_internal
    deploy:
      labels:
        - "traefik.enable=true"
        - "traefik.docker.network=scsi_public"
        - "traefik.http.routers.flower.rule=Host(`flower.scsi.pycoder.com.br`)"
        - "traefik.http.routers.flower.entrypoints=websecure"
        - "traefik.http.routers.flower.middlewares=scsi-admin-ipallowlist,scsi-admin-auth,scsi-headers" # Sem compressão para não quebrar WebSockets
        - "traefik.http.services.flower.loadbalancer.server.port=5555"
```
