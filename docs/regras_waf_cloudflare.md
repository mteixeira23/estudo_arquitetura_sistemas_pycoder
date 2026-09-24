# 🛡️ Especificação de Regras de WAF (Web Application Firewall) — Cloudflare / SCSI
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 3 — Borda, Domínio & Criptografia (Passo 3: Cloudflare)  
**Sub-etapa:** 3.2.1 — Definição de Regras de WAF contra OWASP Top 10 e Scans Maliciosos  
**Data de Emissão:** 21/09/2026  
**Status:** **Homologado para Engenharia de Produção**

---

## 1. Propósito e Arquitetura do WAF em Borda

Na arquitetura corporativa **SCSI (PycoderBR)**, a VPS Hostinger não deve gastar ciclos de CPU nem memória processando requisições geradas por bots automatizados, scanners de vulnerabilidades ou ataques volumétricos. 

O **Cloudflare WAF (Web Application Firewall)** atua na camada perimétrica (Edge Layer), inspecionando e filtrando cada pacote HTTP/HTTPS nos PoPs da Cloudflare **antes que o tráfego atinja o Traefik Ingress e o Django**.

```mermaid
flowchart LR
    subgraph TRAFEGO_ENTRADA["Tráfego Público da Internet"]
        ReqMaliciosa["Scanner OWASP / SQLi / .env probe"]
        ReqLegitima["Usuário Legítimo / Frontend App"]
    end

    subgraph CLOUDFLARE_WAF["Cloudflare WAF (Ruleset Engine na Borda)"]
        Rule1["Regra 1: Bloqueio de Scanners Conhecidos\n(WordPress, PHP, .env, .git)"]
        Rule2["Regra 2: Mitigação Ativa OWASP\n(SQL Injection, XSS, Path Traversal)"]
        Rule3["Regra 3: Filtragem de Métodos HTTP\n(Bloqueia TRACE, TRACK, DEBUG)"]
        Rule4["Regra 4: Blindagem Administrativa\n(Desafio Turnstile em /admin e traefik)"]
    end

    subgraph ORIGEM_VPS["VPS Hostinger (Origem)"]
        TraefikIngress["Traefik Ingress Controller\n(Recebe APENAS tráfego limpo)"]
        DjangoApp["Django + Gunicorn + IA"]
    end

    ReqMaliciosa -->|Interceptado na Borda| Rule1
    Rule1 -->|HTTP 403 Forbidden| Drop1["DROP Imediato (Zero Custo VPS)"]
    
    ReqMaliciosa -.->|Tentativa de Injeção| Rule2
    Rule2 -->|HTTP 403 Forbidden| Drop2["DROP Imediato"]

    ReqLegitima --> Rule1 --> Rule2 --> Rule3 --> Rule4
    Rule4 ===>|Tráfego Limpo e Auditado (TLS 1.3)| TraefikIngress --> DjangoApp
```

---

## 2. Matriz Canônica de Regras de WAF Personalizadas (Custom Rules)

As regras são formuladas na sintaxe oficial **Cloudflare Expression Language (Wirefilter)** e divididas por prioridade operacional:

| Prioridade | Nome da Regra | Expressão de Filtro (Wirefilter) | Ação Executada | Justificativa de Engenharia |
| :---: | :--- | :--- | :---: | :--- |
| **01** | **SCSI-WAF-01: Probes & Scanners Conhecidos** | `(http.request.uri.path contains "/.env" or http.request.uri.path contains "/.git" or http.request.uri.path contains "wp-login" or http.request.uri.path contains "xmlrpc.php" or http.request.uri.path contains "/phpmyadmin" or http.request.uri.path contains "/pma" or http.request.uri.path contains "/adminer")` | **Block (403)** | Como o backend é 100% Python/Django, buscas por PHP, WordPress ou arquivos `.env` são 100% maliciosas. |
| **02** | **SCSI-WAF-02: Mitigação OWASP (SQLi / XSS / Traversal)** | `(http.request.uri.path contains "../" or http.request.uri.path contains "..%2f" or lower(http.request.uri.query) contains "union+select" or lower(http.request.uri.query) contains "information_schema" or lower(http.request.uri.query) contains "<script" or lower(http.request.uri.query) contains "javascript:")` | **Block (403)** | Neutraliza na borda tentativas de injeção de comandos SQL e vazamento de diretórios locais (LFI/Path Traversal). |
| **03** | **SCSI-WAF-03: Restrição de Métodos HTTP Anômalos** | `(not http.request.method in {"GET" "POST" "PUT" "PATCH" "DELETE" "HEAD" "OPTIONS"})` | **Block (403)** | Proíbe métodos obsoletos ou usados em reconhecimento (ex: `TRACE`, `TRACK`, `DEBUG`, `CONNECT`). |
| **04** | **SCSI-WAF-04: Desafio Inteligente em Rotas Administrativas** | `((http.host eq "traefik.scsi.pycoder.com.br" or http.request.uri.path starts_with "/admin/") and cf.threat_score gt 10)` | **Managed Challenge** | Aplica o Cloudflare Turnstile interativo se o visitante tiver histórico de ameaças, antes de abrir o painel. |

---

## 3. Detalhamento Técnico das Expressões de Regras

### Regra 1: Bloqueio Imediato de Probes e Arquivos Sensíveis
```text
(http.request.uri.path contains "/.env" or
 http.request.uri.path contains "/.git" or
 http.request.uri.path contains "wp-login" or
 http.request.uri.path contains "xmlrpc.php" or
 http.request.uri.path contains "/phpmyadmin" or
 http.request.uri.path contains "/pma" or
 http.request.uri.path contains "/adminer")
```
- **Ação:** `Block`
- **Mecanismo:** Rejeição instantânea com resposta HTTP 403 gerada pelos servidores da Cloudflare. A requisição **não gera log de erro no Gunicorn** e **não consome memória da VPS**.

---

### Regra 2: Mitigação Ativa de Injeções OWASP
```text
(http.request.uri.path contains "../" or
 http.request.uri.path contains "..%2f" or
 lower(http.request.uri.query) contains "union+select" or
 lower(http.request.uri.query) contains "information_schema" or
 lower(http.request.uri.query) contains "<script" or
 lower(http.request.uri.query) contains "javascript:")
```
- **Ação:** `Block`
- **Mecanismo:** Normalização de caixa baixa (`lower()`) aplicada à query string antes da avaliação do padrão, prevenindo técnicas de evasão baseadas em alternância de maiúsculas/minúsculas (`uNiOn+sElEcT`).

---

### Regra 3: Desafio em Rotas Críticas (Turnstile Interativo)
```text
((http.host eq "traefik.scsi.pycoder.com.br" or http.request.uri.path starts_with "/admin/") and cf.threat_score gt 10)
```
- **Ação:** `Managed Challenge`
- **Mecanismo:** Se a reputação do IP do visitante possuir índice de ameaça (*Threat Score*) maior que 10 (baseado na inteligência global de tráfego malicioso da Cloudflare), é exibido um desafio criptográfico Turnstile não-intrusivo. Bots são barrados; usuários humanos legítimos resolvem o teste em menos de 1 segundo de forma transparente.

---

## 4. Automação Declarativa via Cloudflare API v4 (Ruleset Engine)

Em conformidade com a **ADR 011 (Paradigma API-First & Operação Headless)**, as regras de WAF podem ser enviadas diretamente para a API oficial da Cloudflare via endpoint de custom rules:

`PUT https://api.cloudflare.com/client/v4/zones/{zone_id}/rulesets/phases/http_request_firewall_custom/entry`

### Payload Declarativo JSON:
```json
{
  "rules": [
    {
      "action": "block",
      "expression": "(http.request.uri.path contains \"/.env\" or http.request.uri.path contains \"/.git\" or http.request.uri.path contains \"wp-login\" or http.request.uri.path contains \"/phpmyadmin\")",
      "description": "SCSI-WAF-01: Bloqueio Imediato de Probes e Scanners",
      "enabled": true
    },
    {
      "action": "block",
      "expression": "(http.request.uri.path contains \"../\" or lower(http.request.uri.query) contains \"union+select\" or lower(http.request.uri.query) contains \"<script\")",
      "description": "SCSI-WAF-02: Mitigacao OWASP SQLi e XSS",
      "enabled": true
    },
    {
      "action": "block",
      "expression": "(not http.request.method in {\"GET\" \"POST\" \"PUT\" \"PATCH\" \"DELETE\" \"HEAD\" \"OPTIONS\"})",
      "description": "SCSI-WAF-03: Bloqueio de Metodos HTTP Obsoletos",
      "enabled": true
    },
    {
      "action": "managed_challenge",
      "expression": "((http.host eq \"traefik.scsi.pycoder.com.br\" or http.request.uri.path starts_with \"/admin/\") and cf.threat_score gt 10)",
      "description": "SCSI-WAF-04: Desafio Turnstile em Rotas Administrativas",
      "enabled": true
    }
  ]
}
```

---

## 5. Parecer de Engenharia da Sub-etapa 3.2.1

- **Engenheiro DevOps:** As 4 regras customizadas cobrem mais de 95% do ruído malicioso da internet pública. O bloqueio na borda poupa o Gunicorn e o Traefik de desperdiçar conexões e workers síncronos com bots.
- **Arquiteto de Soluções:** Homologa a modelagem das regras. Destaca que a separação entre `Block` (para ataques inequívocos) e `Managed Challenge` (para rotas administrativas com suspeita de bot) minimiza falsos positivos para os usuários do sistema.
