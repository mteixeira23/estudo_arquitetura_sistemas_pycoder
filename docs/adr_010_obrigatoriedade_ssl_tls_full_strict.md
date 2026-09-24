# 📜 Decisão Arquitetural: ADR 010 — Obrigatoriedade de SSL/TLS Full (Strict) Ponta a Ponta
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 3 — Borda, Domínio & Criptografia (Passo 4: SSL/TLS)  
**Status:** **Aprovado e Homologado (Mandatório)**  
**Data da Decisão:** 21/09/2026  
**Decisores:** Arquiteto de Soluções, Engenheiro DevOps, Engenheiro de Backend, Engenheiro de IA  

---

## 1. Contexto e Problema

O **SCSI (Sistema de Gestão de Corretora de Seguros Inteligente)** opera em uma arquitetura de microsserviços distribuídos entre a malha global Anycast da Cloudflare (borda perimétrica) e uma VPS Hostinger Ubuntu Linux (núcleo da aplicação web, banco de dados e agentes de IA).

Nessa topologia de proxy reverso (*Reverse Proxy*), o tráfego divide-se em duas conexões físicas distintas:
1. **Perna 1 (Cliente -> Cloudflare Edge):** Tráfego entre o navegador do usuário e os PoPs da Cloudflare.
2. **Perna 2 (Cloudflare Edge -> VPS Hostinger):** Tráfego entre os servidores da Cloudflare e a VPS Hostinger, trafegando através da internet pública por múltiplos provedores de trânsito (ISPs) e cabos internacionais.

Historicamente, configurações incorretas da Cloudflare recorrem ao modo **Flexible**, que utiliza HTTPS na Perna 1, mas encaminha o tráfego em **HTTP em texto claro (porta 80)** na Perna 2. Isso cria uma ilusão perigosa de segurança: o navegador exibe o cadeado verde, mas todas as credenciais, tokens JWT, sessões e apólices trafegam desprotegidos na internet pública, vulneráveis a interceptação Man-in-the-Middle (MitM), além de provocar erros críticos de loop de redirecionamento infinito (`ERR_TOO_MANY_REDIRECTS`).

Por outro lado, o modo **Full** aceita qualquer certificado autoassinado na origem sem checar a identidade da autoridade, permitindo que invasores com capacidade de spoofing de DNS ou BGP interceptem a conexão sem gerar alertas.

---

## 2. Decisão Arquitetural

Fica estabelecido como **mandato corporativo inegociável** para o projeto SCSI:

1. **Proibição Expressa dos Modos Inseguros:** É estritamente proibido o uso dos modos `Off`, `Flexible` e `Full (permissivo)` em qualquer ambiente de homologação ou produção do ecossistema SCSI.
2. **Imposição Exclusiva do Modo Full (Strict):** Todo tráfego roteado pela Cloudflare para a VPS Hostinger deve operar obrigatoriamente no modo **`Full (Strict)`**, exigindo validação estrita da cadeia de confiança e do Common Name / SAN do certificado apresentado na origem.
3. **Certificados de Origem Confiáveis:** O Traefik Ingress na VPS Hostinger deve apresentar na porta 443 um certificado SSL/TLS emitido por autoridade reconhecida:
   - **Padrão Primário:** Certificado emitido pela **Cloudflare Origin CA** com validade de longo prazo (até 15 anos) e restrição de uso aos nós da Cloudflare.
   - **Padrão Secundário / Fallback:** Certificado emitido via Let's Encrypt / Traefik ACME via desafio DNS-01.
4. **Protocolos Mínimos de Cifragem:** O Traefik e a Cloudflare devem impor **TLS 1.3 como padrão prioritário** e **TLS 1.2 como versão mínima aceitável**, banindo protocolos legados e inseguros (SSLv3, TLS 1.0 e TLS 1.1).
5. **Configuração de Segurança na Aplicação (Django Core):** O Django deve impor:
   - `SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')`
   - `SESSION_COOKIE_SECURE = True`
   - `CSRF_COOKIE_SECURE = True`
   - `SECURE_SSL_REDIRECT = True`

---

## 3. Consequências e Trade-offs

### Consequências Positivas:
- **Segurança Criptográfica Real Ponta a Ponta:** Eliminação física de qualquer possibilidade de escuta ou adulteração de dados em trânsito (*Eavesdropping / MitM*) entre a Cloudflare e a VPS Hostinger.
- **Eliminação do Loop 301 (`ERR_TOO_MANY_REDIRECTS`):** Como o Traefik recebe HTTPS diretamente na porta 443 e repassa `X-Forwarded-Proto: https` ao Django, não ocorre discrepância de protocolo nem redirecionamento cíclico.
- **Conformidade com Leis de Proteção de Dados:** Plena aderência aos requisitos de criptografia em trânsito da **LGPD (Art. 46)**, **GDPR (Art. 32)** e normas de segurança financeira/bancária (PCI-DSS 4.0).
- **Viabilização de Tecnologias Modernas:** Criptografia estrita habilita o uso pleno de **HTTP/2** e **HTTP/3 (QUIC)** com multiplexação de streams e compressão de cabeçalhos HPACK/QPACK.

### Consequências Negativas & Mitigações:
- **Exigência de Certificado na Origem:** A VPS não pode operar com portas HTTP desprotegidas; precisa manter certificados instalados no Traefik.
  - *Mitigação:* Adoção de certificados Cloudflare Origin CA com validade de até 15 anos, eliminando manutenções trimestrais manuais.
- **Erro 526 (Invalid SSL Certificate) em Caso de Falha de Validação:** Se o certificado da VPS expirar ou o domínio não coincidir, a Cloudflare bloqueia a requisição com erro HTTP 526 em vez de aceitar a conexão desprotegida.
  - *Mitigação:* Monitoramento contínuo da validade do certificado via rotinas automatizadas do Antigravity (ADR 011).

---

## 4. Governança Headless & Auditoria Automatizada (ADR 011)

A conformidade com a ADR 010 é auditada diretamente via API oficial da Cloudflare pelo Antigravity:

```powershell
# Auditoria de Conformidade com a ADR 010 (ADR 011 Headless)
$headers = @{
    "Authorization" = "Bearer $env:CLOUDFLARE_API_TOKEN"
    "Content-Type"  = "application/json"
}

$sslConfig = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/settings/ssl" `
    -Method Get -Headers $headers

if ($sslConfig.result.value -ne "strict") {
    Write-Warning "VIOLAÇÃO DE GOVERNANÇA: Modo SSL está em '$($sslConfig.result.value)'. Corrigindo para 'strict'..."
    $body = @{ value = "strict" } | ConvertTo-Json
    Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/settings/ssl" `
        -Method Patch -Headers $headers -Body $body
    Write-Host "ADR 010 restabelecida com sucesso: Modo Full (Strict) ativo."
} else {
    Write-Host "ADR 010 CONFORME: Modo SSL está estritamente configurado como 'strict'."
}
```

---

## 5. Parecer de Homologação da ADR 010

- **Arquiteto de Soluções:** Homologa a ADR 010 como pilar estruturante da segurança perimétrica da plataforma SCSI.
- **Engenheiro DevOps:** Atribui conformidade imediata para a configuração do Traefik Ingress na Fase 5 e geração do Origin CA na Fase 3.4.
- **Engenheiro de Backend:** Homologa os parâmetros de cookies seguros e headers proxy no Django.
- **Engenheiro de IA:** Certifica a proteção da integridade dos pipelines do LangGraph e dados de apólices em trânsito.
