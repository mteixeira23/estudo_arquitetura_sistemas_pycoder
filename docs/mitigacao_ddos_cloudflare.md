# 🛡️ Mitigação Volumétrica DDoS & Modo "Under Attack" — Cloudflare / SCSI
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 3 — Borda, Domínio & Criptografia (Passo 3: Cloudflare)  
**Sub-etapa:** 3.2.3 — Proteção DDoS Multi-Camadas (L3/L4/L7) e Modo Emergencial "Under Attack"  
**Data de Emissão:** 21/09/2026  
**Status:** **Homologado para Engenharia de Produção**

---

## 1. Topologia de Defesa contra Ataques de Negação de Serviço (DDoS)

Um ataque distribuído de negação de serviço (*Distributed Denial of Service - DDoS*) visa esgotar recursos de rede, capacidade de banda ou ciclos de processamento de servidores web. Na arquitetura corporativa **SCSI (PycoderBR)**, a VPS Hostinger (com 1 Gbps de uplink típico) sucumbiria rapidamente a ataques volumétricos comuns na internet (que frequentemente excedem de 10 Gbps a centenas de Gbps).

A blindagem perimétrica da Cloudflare neutraliza essa ameaça através de sua rede Anycast global (com mais de **330 Tbps** de capacidade agregada de absorção), distribuída em mais de 330 cidades globais.

```mermaid
flowchart TD
    subgraph BOTNET["Botnet Global Distribuída (Centenas de Milhares de Hosts Zumbis)"]
        AttackL3["Ataque Volumétrico L3/L4\n(SYN Flood / UDP Amplification / ICMP)"]
        AttackL7["Ataque de Aplicação L7\n(HTTP/2 Rapid Reset / Slowloris / POST Flood)"]
    end

    subgraph CLOUDFLARE_EDGE["Borda Anycast Global da Cloudflare (330+ Tbps)"]
        EdgeScrubbing["Anycast Scrubbing Centers\n(Filtros de Tráfego Automático em Hardware)"]
        WAF_L7["L7 DDoS Ruleset Engine\n(Inspeção Comportamental Heurística)"]
        IUAM_Gate["Under Attack Mode (IUAM)\n(Desafio JavaScript/Turnstile Criptográfico)"]
    end

    subgraph HOSTINGER_VPS["VPS Hostinger (Origem)"]
        Traefik["Traefik Ingress Controller\n(Recebe apenas pacotes legítimos e completos)"]
        DjangoApp["Django + Gunicorn + Celery + IA"]
    end

    AttackL3 -->|Absorvido e Descartado no Anycast| EdgeScrubbing
    EdgeScrubbing -.->|DROP L3/L4| DropL3["Descarte em Borda (Impacto Zero na VPS)"]

    AttackL7 -->|Inspecionado por Heurística| WAF_L7
    WAF_L7 -->|Sob Ataque Extremo| IUAM_Gate
    IUAM_Gate -->|Bot sem JS Engine| DropL7["DROP HTTP 403 / Falha no Desafio"]

    IUAM_Gate ===>|Visitante Humano Autenticado (TLS 1.3)| Traefik --> DjangoApp
```

---

## 2. Proteção em Camadas: L3, L4 e L7

### 2.1. Camada de Rede (L3) e Transporte (L4)
- **Vetores Mitigados:**
  - *SYN Floods / ACK Floods:* Tentativas de esgotar a tabela de conexões TCP do servidor.
  - *UDP Reflection / Amplification:* Ataques volumétricos baseados em DNS, NTP, Memcached e SNMP.
  - *ICMP / Ping of Death:* Inundação de pacotes de controle.
- **Mecanismo de Defesa na Cloudflare:**
  - **BGP Anycast Routing:** O tráfego do ataque é diluído geograficamente entre os mais de 330 datacenters da Cloudflare. Um ataque de 500 Gbps é fragmentado em rajadas de menos de 2 Gbps por centro de dados regional.
  - **Filtros de Borda Não-Baseados em Estado (Stateless Mitigation):** Roteadores de borda e aceleradores de hardware descartam pacotes malformados antes de subirem para a pilha de software.
  - **Ocultação do IP Real (ADR 010 / ADR 011):** O atacante não conhece o IP da VPS Hostinger, impossibilitando mirar pacotes UDP/SYN diretamente contra a infraestrutura física.

---

### 2.2. Camada de Aplicação (L7)
- **Vetores Mitigados:**
  - *HTTP/HTTPS Floods:* Envio massivo de requisições `GET` ou `POST` direcionadas a páginas dinâmicas ou endpoints caros de IA.
  - *Slowloris & RUDY (R-U-Dead-Yet):* Manutenção de centenas de conexões HTTP abertas enviando bytes em velocidade extremamente lenta (1 byte a cada 10s), com o objetivo de esgotar o pool de conexões do Traefik e Gunicorn.
  - *HTTP/2 Rapid Reset (CVE-2023-44487):* Envio de fluxos seguidos imediatamente por `RST_STREAM` para saturar a CPU do servidor web.
- **Mecanismo de Defesa na Cloudflare:**
  - **Proxy Reverso Completo (Full Reverse Proxy):** A Cloudflare finaliza e gerencia a conexão TCP/TLS com o cliente. O Traefik na VPS Hostinger **só recebe a requisição quando o payload HTTP estiver integralmente recebido e validado**. O ataque Slowloris é 100% neutralizado na borda.
  - **Proteção Automática contra HTTP/2 Rapid Reset:** Os nós da Cloudflare mitigam rajadas de resets de fluxo na camada de transporte TLS sem repassar requisições fantasmas para o backend.

---

## 3. Modo Emergencial "Under Attack Mode" (IUAM)

O **Under Attack Mode** (*I'm Under Attack Mode*) é um recurso de contingência de segurança extrema projetado para ser ativado quando o sistema sofre um ataque volumétrico L7 agressivo e sofisticado, capaz de simular o comportamento de usuários normais.

### 3.1. Comportamento Operacional
- **Desafio Criptográfico Automático:** Todo visitante que tenta acessar qualquer subdomínio do ecossistema (`scsi.pycoder.com.br`, `api.`, `app.`) recebe uma página de checagem intersticial da Cloudflare.
- **Execução do Cloudflare Turnstile:** O navegador precisa resolver um desafio criptográfico em segundo plano via JavaScript para comprovar que é um navegador real (não um bot headless como curl, python-requests ou script malicioso).
- **Validade do Desafio (Pass Clearance):** Usuários legítimos resolvem o teste de forma transparente em aproximadamente 1 a 2 segundos; após a aprovação, um cookie seguro (`cf_clearance`) é emitido, liberando o acesso sem atrito subsequente.
- **Zero Impacto na VPS Hostinger:** Centenas de milhares de requisições maliciosas são retidas na página de desafio da Cloudflare, com **consumo de 0% de CPU na VPS**.

---

## 4. Automação Declarativa Headless via Cloudflare API v4 (ADR 011)

Em estrita consonância com a **ADR 011 (Paradigma API-First & Operação Headless)**, o operador não precisa abrir o painel web da Cloudflare para alternar níveis de segurança ou mitigar crises. O Antigravity comanda o estado de segurança via API oficial:

### 4.1. Endpoint de Nível de Segurança da Zona
`PATCH https://api.cloudflare.com/client/v4/zones/{zone_id}/settings/security_level`

### 4.2. Matriz de Níveis de Segurança (`security_level`)
- `"essentially_off"`: Quase desativado (não recomendado).
- `"low"`: Desafia apenas visitantes altamente suspeitos.
- `"medium"`: **Modo Padrão de Produção do SCSI.**
- `"high"`: Desafia todo tráfego com histórico de comportamento malicioso nos últimos 14 dias.
- `"under_attack"`: **Modo Emergencial.** Aplica desafio em 100% das novas conexões.

---

### 4.3. Scripts de Emergência Headless (PowerShell / Python)

#### A. Ativar Modo "Under Attack" Instantaneamente:
```powershell
# Invocação direta via API oficial Cloudflare (ADR 011)
$headers = @{
    "Authorization" = "Bearer $env:CLOUDFLARE_API_TOKEN"
    "Content-Type"  = "application/json"
}
$body = @{ value = "under_attack" } | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/settings/security_level" `
    -Method Patch -Headers $headers -Body $body
```

#### B. Normalizar para Modo Produção Padrão (`medium`):
```powershell
$body = @{ value = "medium" } | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/$ZoneId/settings/security_level" `
    -Method Patch -Headers $headers -Body $body
```

---

## 5. Resumo da Política de Mitigação DDoS do SCSI

| Vetor de Ataque | Camada | Impacto Sem Cloudflare | Comportamento com Borda SCSI | Custo na VPS Hostinger |
| :--- | :---: | :--- | :--- | :---: |
| **SYN Flood / UDP Amplification** | L3/L4 | VPS Hostinger fica offline; uplink de 1 Gbps satura. | Absorvido e descartado nos centros Anycast da Cloudflare. | **Zero** |
| **Slowloris / RUDY** | L7 | Traefik e Gunicorn travam por exaustão de conexões. | Cloudflare absorve conexões parciais; só entrega pacotes 100% prontos. | **Zero** |
| **HTTP/2 Rapid Reset** | L7 | CPU do servidor atinge 100% processando resets de streams. | Descartado no terminador TLS da Cloudflare. | **Zero** |
| **HTTP Flood Massivo** | L7 | Esgotamento de workers Gunicorn e crash do PostgreSQL. | WAF + Rate Limiting + "Under Attack Mode" (Turnstile). | **Zero** |

---

## 6. Parecer de Engenharia da Sub-etapa 3.2.3

- **Engenheiro DevOps:** A blindagem Anycast elimina qualquer dependência de appliances caros de mitigação física de DDoS na Hostinger. A gestão headless do `security_level` confere agilidade cirúrgica para lidar com crises de tráfego.
- **Arquiteto de Soluções:** Homologa a arquitetura multi-camadas (L3/L4 absorvido por Anycast, L7 filtrado por proxy reverso completo e IUAM como salvaguarda extrema).
