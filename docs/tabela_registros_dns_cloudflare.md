# 📑 Tabela Declarativa de Registros DNS & Zona Autoritativa (Cloudflare / SCSI)
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 3 — Borda, Domínio & Criptografia (Passo 3: Cloudflare)  
**Sub-etapa:** 3.1.3 — Especificação da Tabela Declarativa de Registros DNS  
**Data de Emissão:** 21/09/2026  
**Status:** **Homologado para Engenharia de Produção**

---

## 1. Visão Geral da Zona DNS Autoritativa

A autoridade DNS do ecossistema corporativo **SCSI (PycoderBR)** é delegada à malha Anycast global da Cloudflare. A tabela declarativa de registros foi estruturada para garantir:
1. **Resolução de Alta Performance:** Resposta DNS com latência inferior a 5 milissegundos via Anycast.
2. **Ocultação de Topologia:** Todos os registros públicos HTTP/HTTPS operam com **Proxy Laranja Ativo (`proxied: true`)**, mascarando o IP real da VPS Hostinger.
3. **Prevenção de Phishing e Anti-Spoofing:** Implementação de políticas estritas de SPF e DMARC com `reject` total para proteger a reputação do domínio corporativo.

---

## 2. Tabela Declarativa de Registros DNS Canônicos

> [!NOTE]
> **Parâmetro de IP de Origem:**  
> Nos registros do tipo `A`, utilize o IP público dedicado provisionado na VPS Hostinger (Passo 5). No modelo canônico abaixo, utilizamos a variável de referência `195.35.40.123` (ou `<IP_PUBLICO_VPS_HOSTINGER>`).

| Tipo | Nome (Host) | Alvo / Destino | Proxy Status | TTL | Finalidade Técnica |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **A** | `@` (Apex) | `195.35.40.123` | **Proxied 🟧** | Auto | Apontamento do domínio raiz para o cluster Traefik |
| **A** | `api` | `195.35.40.123` | **Proxied 🟧** | Auto | Gateway de entrada REST / GraphQL (Django Gunicorn) |
| **CNAME** | `www` | `scsi.pycoder.com.br` | **Proxied 🟧** | Auto | Redirecionamento 301 canônico para o domínio Apex |
| **CNAME** | `app` | `scsi.pycoder.com.br` | **Proxied 🟧** | Auto | Interface Web SPA / Console interativo de usuários |
| **CNAME** | `traefik` | `scsi.pycoder.com.br` | **Proxied 🟧** | Auto | Dashboard de Ingress (protegido por BasicAuth + WAF) |
| **CNAME** | `flower` | `scsi.pycoder.com.br` | **Proxied 🟧** | Auto | Dashboard de monitoramento de tarefas Celery (Fase 7) |
| **TXT** | `@` | `"v=spf1 -all"` | **DNS Only ⬜** | Auto | **Anti-Spoofing SPF:** Proíbe envio de e-mails em nome do domínio |
| **TXT** | `_dmarc` | `"v=DMARC1; p=reject; sp=reject;"` | **DNS Only ⬜** | Auto | **Anti-Phishing DMARC:** Rejeição incondicional de e-mails forjados |

---

## 3. Arquivo de Zona BIND Canônico (RFC 1035)

Este arquivo pode ser importado diretamente no painel da Cloudflare (*DNS ➔ Records ➔ Import and Export ➔ Import DNS Records*):

```text
; ==============================================================================
; Arquivo de Zona DNS Corporativa (Padrao RFC 1035 / BIND)
; Dominio Canônico: scsi.pycoder.com.br
; Projeto: Arquitetura SCSI / PycoderBR
; ==============================================================================
$ORIGIN scsi.pycoder.com.br.
$TTL 300

; Registros Autoritativos de Enderecamento (IPv4)
@       IN  A       195.35.40.123
api     IN  A       195.35.40.123

; Registros Canonicos de Apelido (CNAME)
www     IN  CNAME   scsi.pycoder.com.br.
app     IN  CNAME   scsi.pycoder.com.br.
traefik IN  CNAME   scsi.pycoder.com.br.
flower  IN  CNAME   scsi.pycoder.com.br.

; Registros de Seguranca de Dominio (Anti-Phishing & Anti-Spoofing)
@       IN  TXT     "v=spf1 -all"
_dmarc  IN  TXT     "v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;"
```

---

## 4. Automação Declarativa via API REST da Cloudflare

Para provisionamento automatizado via script ou pipeline de CI/CD, a Cloudflare disponibiliza o endpoint v4 `POST /zones/{zone_id}/dns_records`.

### Exemplo de Payload JSON para Registro `A` com Proxy Laranja Ativo:
```json
{
  "type": "A",
  "name": "api.scsi.pycoder.com.br",
  "content": "195.35.40.123",
  "ttl": 1,
  "proxied": true,
  "comment": "SCSI Gateway de API - Provisionado via Automacao SCSI"
}
```

### Exemplo de Payload JSON para Registro `CNAME` com Proxy Laranja Ativo:
```json
{
  "type": "CNAME",
  "name": "app.scsi.pycoder.com.br",
  "content": "scsi.pycoder.com.br",
  "ttl": 1,
  "proxied": true,
  "comment": "SCSI Console SPA - Provisionado via Automacao SCSI"
}
```

---

## 5. Justificativa Técnica das Configurações de TTL e Proxy

1. **TTL = 1 (`Auto`) quando `proxied: true`:**
   - Na Cloudflare, quando o proxy está ativado, o TTL é gerido internamente pela malha Anycast da Cloudflare. Para os resolvedores públicos do mundo, a Cloudflare responde com um TTL dinâmico de 300 segundos (5 minutos), permitindo migrações rápidas em caso de incidentes.
2. **Uso de CNAMEs para Subdomínios de Aplicação:**
   - Ao apontar `app`, `traefik` e `flower` via `CNAME` para o apex (`scsi.pycoder.com.br`), caso o IP da VPS seja alterado na Hostinger no futuro, basta atualizar **um único registro `A`** (o apex `@` e `api`), propagando a mudança instantaneamente para todos os subdomínios sem retrabalho manual.
3. **Hardening de E-mail (`v=spf1 -all` e `p=reject`):**
   - Servidores de aplicação web frequentemente são alvos de técnicas de *domain spoofing*, onde criminosos usam o domínio para enviar e-mails de phishing se passando pela empresa. O SPF estrito (`-all`) e o DMARC (`p=reject`) orientam todos os provedores globais (Gmail, Outlook, Yahoo) a **bloquear e descartar** qualquer mensagem enviada usando o domínio `scsi.pycoder.com.br`.

---

## 6. Parecer de Engenharia da Sub-etapa 3.1.3

- **Engenheiro DevOps:** Tabela enxuta, eficiente e compatível com ferramentas modernas de IaC (Terraform, Cloudflare API ou importação direta no console). A estratégia de CNAME simplifica a manutenção da infraestrutura.
- **Arquiteto de Soluções:** Homologa a inclusão das políticas anti-spoofing de e-mail como parte da fundação de segurança do domínio.
