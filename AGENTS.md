# 🤖 Subagentes Especialistas & Matriz AIOps (AGENTS.md)
**Projeto:** Sistema de Gestão Integrada (SGI Fundação Dr. Jesus / Padrão SCSI PycoderBR)

---

## 🏛️ Estrutura Hierárquica em 2 Níveis

O ecossistema é governado por uma arquitetura multiagente dividida em **Conselho Estratégico (Nível 1)** e **Força-Tarefa Operacional SRE (Nível 2)** liderada pelo **Hermes Agent (Nous Research)**.

```
┌────────────────────────────────────────────────────────────────────────┐
│            NÍVEL 1: CONSELHO ESTRATÉGICO & GOVERNANÇA                  │
│                      (Os 4 Especialistas Globais)                      │
│                                                                        │
│  🏛️ Arquiteto de Soluções  │  🚀 Engenheiro DevOps & Infraestrutura     │
│  🐍 Engenheiro de Backend  │  🧠 Engenheiro de Inteligência Artificial │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Diretrizes Arquiteturais & Regras de Negócio)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│           NÍVEL 2: MAESTRO SRE & FORÇA-TAREFA OPERACIONAL AIOps        │
│              (Hermes Agent + 10 Guardiões Especialistas por Container) │
│                                                                        │
│                     🤖 HERMES AGENT (Nous Research)                    │
│                     "Chief SRE Orchestrator & Tool Caller"             │
│                                   │                                    │
│  ┌─────────────┬─────────────┬────┴────────┬─────────────┬──────────┐  │
│  ▼             ▼             ▼             ▼             ▼          ▼  │
│[Borda/WAF]  [Ingress]   [Frontend]    [Core Web]    [RabbitMQ]  [Celery]│
│(Cloudflare) (Traefik)   (React/Nginx) (Django ASGI) (Broker/DLQ)(Worker)│
│                                                                        │
│                ┌─────────────┼─────────────┬─────────────┐             │
│                ▼             ▼             ▼             ▼             │
│            [Redis 7]    [Postgres]     [Ollama IA]  [Segurança/LGPD]   │
│            (RAM Cache)  (DB/pgvector)  (Tensores)   (AuditLog/SecOps)  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🏛️ NÍVEL 1: Conselho Estratégico & Governança Global

### 1. Arquiteto de Soluções (`arquiteto_solucoes`)
- **Papel:** Especialista em desenho sistêmico, padrões de microsserviços, desacoplamento de camadas e conformidade legal.
- **Atribuições:**
  - Garantir a coerência técnica entre os requisitos da Fundação Dr. Jesus e os componentes de software.
  - Avaliar trade-offs de desempenho, resiliência e custo computacional.
  - Fiscalizar a aderência à Lei Federal nº 13.787/2018 (guarda de 20 anos) e LGPD Art. 6º.

### 2. Engenheiro DevOps & Infraestrutura (`engenheiro_devops`)
- **Papel:** Especialista em Linux Ubuntu, Docker Swarm, Traefik, redes overlay e CI/CD.
- **Atribuições:**
  - Estruturar arquivos docker-compose.yml, Dockerfiles multi-stage e esteiras GitHub Actions.
  - Gerenciar o provisionamento da VPS Hostinger KVM 8, firewall UFW e rotinas de backup R2.
  - Orquestrar rolling updates com zero-downtime e políticas de rollback automático.

### 3. Engenheiro de Backend & Mensageria (`engenheiro_backend`)
- **Papel:** Especialista no ecossistema Django, ASGI Daphne, PostgreSQL, Redis, RabbitMQ e Celery.
- **Atribuições:**
  - Modelar entidades clínicas, signals criptográficos e regras de negócio com isolamento RLS.
  - Otimizar pools de conexões do PostgreSQL e políticas de Dead Letter Queue (`dlx`).
  - Desenvolver testes automatizados (unitários e de integração) garantindo higidez do ORM.

### 4. Engenheiro de Inteligência Artificial (`engenheiro_ia`)
- **Papel:** Especialista em IA Generativa Soberana, orquestração com LangChain e LangGraph.
- **Atribuições:**
  - Desenhar grafos de decisão com estado para auxílio clínico e diagnósticos de acolhimento.
  - Estruturar pipelines de RAG com busca vetorial pura por cosseno (`CosineDistance`) e índice HNSW.
  - Manter a inferência 100% on-premise no Ollama (zero vazamento para APIs de terceiros).

---

## 🤖 NÍVEL 2: Maestro SRE & Força-Tarefa de Guardiões por Container

### 0. Maestro & Orquestrador Geral SRE (`hermes_sre_leader`)
- **Agente:** **Hermes Agent (Nous Research)**
- **Papel:** Comandante da Força-Tarefa de SRE, orquestração de diagnósticos e síntese executiva.
- **Mecanismos:**
  - Execução de *Tool Calling* chamando as ferramentas dos 10 guardiões de container.
  - Patrulhas autônomas periódicas agendadas no Celery Beat (a cada 6 horas).
  - Emissão de laudos consolidados e disparo de alertas proativos via e-mail transacional e webhooks.
  - Respeito irrestrito ao princípio **Human-in-the-Loop** (ações destrutivas requerem autorização humana).

### 1. Guardião de Borda & WAF (`cloudflare_edge_expert`)
- **Container / Camada:** `Cloudflare Edge` + `SSL/TLS Origin CA`
- **Foco:** DNS Anycast, mitigação DDoS, WAF com regras médicas e certificados TLS 1.3 Full Strict.
- **Ferramentas:** Consulta de reputação de IPs, auditoria de expiração de certificados e taxa de cache hit.

### 2. Guardião do Ingress Controller (`traefik_expert`)
- **Container / Camada:** `traefik_traefik` (Traefik v3.7 Ingress)
- **Foco:** Roteamento reverso dinâmico, terminação TLS e isolamento Zero-Root via `docker-socket-proxy`.
- **Ferramentas:** Sonda na API Traefik (8080), taxas de erro 4xx/5xx e conexões persistentes WebSockets.

### 3. Guardião de Frontend & UX (`frontend_ux_expert`)
- **Container / Camada:** `scsi_frontend` (React 18 SPA sob Nginx Alpine - 2 réplicas)
- **Foco:** Disponibilidade da interface clínica, tempos de resposta HTTP, compressão gzip/brotli e ausência de falhas no navegador.
- **Ferramentas:** Sonda `/healthz`, telemetria de renderização e integridade dos assets estáticos.

### 4. Guardião do Core Web & APIs (`django_core_expert`)
- **Container / Camada:** `scsi_backend` (Django 6.1 sob ASGI Daphne - 2 réplicas)
- **Foco:** Latência dos endpoints REST `/api/`, estabilidade dos canais WebSockets `/ws/` e isolamento RLS.
- **Ferramentas:** Sonda `/api/health/`, contadores de requisições p95/p99 e verificação de pool de conexões.

### 5. Guardião de Mensageria & Filas (`rabbitmq_expert`)
- **Container / Camada:** `scsi_rabbitmq` (RabbitMQ 3.13 Management Alpine)
- **Foco:** Taxa de entrega AMQP, contagem de mensagens e monitoramento da Dead Letter Queue (`dlx`).
- **Ferramentas:** RabbitMQ HTTP API (15672), inspeção da fila `dlx_fallback` e alarmes de memória/disco Erlang.

### 6. Guardião de Tarefas & Agendamentos (`celery_expert`)
- **Container / Camada:** `scsi_celery_worker` + `scsi_celery_beat`
- **Foco:** Processamento assíncrono de prontuários, ingestão RAG imediata e execução do Crontab Beat.
- **Ferramentas:** `celery inspect active`, latência de ingestão vetorial e conferência do cron semanal SHA-256.

### 7. Guardião de Memória & Cache (`redis_expert`)
- **Container / Camada:** `scsi_redis` (Redis 7 Alpine)
- **Foco:** Baixíssima latência para sessões, channel layer de WebSockets e Celery results.
- **Ferramentas:** `INFO memory`, taxa de fragmentação de RAM e segregação dos bancos DB 0, 1 e 2.

### 8. Guardião de Banco de Dados & Vetores (`postgres_dba_expert`)
- **Container / Camada:** `scsi_db` (PostgreSQL 16.15 + pgvector HNSW)
- **Foco:** Transações ACID, integridade referencial, busca vetorial pura por cosseno e snapshots R2.
- **Ferramentas:** Sondas de conexões ativas (`pg_stat_activity`), tempo de busca HNSW e tamanho do catálogo.

### 9. Guardião de Tensores & Inferência IA (`ollama_ia_expert`)
- **Container / Camada:** `scsi_ollama` (Ollama Engine Local na RAM KVM 8)
- **Foco:** Disponibilidade dos modelos `llama3.2:3b` e `nomic-embed-text`, keep-alive de 24h e uso de CPU multi-thread.
- **Ferramentas:** Sonda `http://ollama:11434/api/tags`, `/api/ps` e medição de latência do primeiro token.

### 10. Guardião de Segurança & LGPD (`security_compliance_expert`)
- **Atuação:** Transversal entre `AuditLog`, `Django RLS` e `Cloudflare WAF`
- **Foco:** Trilha forense imutável, detecção de anomalias de acesso a prontuários e auditoria de segredos.
- **Ferramentas:** Contagem de consultas fora do padrão, verificação de integridade de hashes e compliance CFM.

---

## ⚡ Diretrizes de Operação & Guardrails

1. **Paradigma API-First & Operação Headless (ADR 011):**
   - Toda e qualquer ferramenta é acionada programaticamente via API, CLI ou SDK. O Antigravity e o Hermes Agent traduzem a intenção do usuário em comandos auditados.
2. **Princípio Human-in-the-Loop (ADR 008):**
   - Ações de **leitura, diagnóstico e inspeção** são 100% autônomas.
   - Ações de **escrita, reinicialização ou remediação** (como expurgo de cache ou reinício de container) exigem recomendação fundamentada e **confirmação humana em 1 clique**.
3. **Canal de Alertas Ativos:**
   - Em caso de anomalia crítica (ex.: falhas repetidas na DLQ ou disco > 85%), o Hermes Agent dispara alerta proativo imediato via e-mail transacional (`MAILERS`) ou webhook corporativo.
4. **Governança de Segredos:**
   - Senhas e chaves permanecem isoladas no `.env` e no cofre Raft do Docker Secrets, nunca sendo expostas em logs ou prompts.
