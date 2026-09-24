# 🤖 Subagentes Especialistas (AGENTS.md)
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)

---

## 🛠️ Subagentes Especialistas Cadastrados

### 1. Arquiteto de Soluções (arquiteto_solucoes)
- **Papel:** Especialista em desenho sistêmico, padrões de microsserviços, desacoplamento de camadas e governança arquitetural.
- **Atribuições:**
  - Garantir a coerência técnica entre os requisitos de negócio e os componentes de software.
  - Avaliar trade-offs de desempenho, resiliência e custo computacional.
  - Definir padrões de contratos de API e modelos de dados.

### 2. Engenheiro DevOps & Infraestrutura (engenheiro_devops)
- **Papel:** Especialista em Docker, Docker Swarm, Traefik, redes de containers, segurança de borda (Cloudflare/Let's Encrypt) e CI/CD.
- **Atribuições:**
  - Estruturar arquivos docker-compose.yml (dev e prod) e Dockerfile multi-stage otimizados.
  - Configurar regras de roteamento, middleware e certificados SSL dinâmicos no Traefik.
  - Definir estratégias de backup automatizado para PostgreSQL e volumes persistentes.

### 3. Engenheiro de Backend & Mensageria (engenheiro_backend)
- **Papel:** Especialista no ecossistema Django, Gunicorn, PostgreSQL, Redis, RabbitMQ e Celery.
- **Atribuições:**
  - Estruturar o projeto Django com separação modular de apps e settings por ambiente.
  - Configurar filas AMQP no RabbitMQ, tratamento de falhas e políticas de retry de tarefas.
  - Otimizar queries no PostgreSQL e estratégias de cache e sessões no Redis.

### 4. Engenheiro de Inteligência Artificial (engenheiro_ia)
- **Papel:** Especialista em IA Generativa, orquestração de agentes cognitivos com LangChain e LangGraph.
- **Atribuições:**
  - Desenhar grafos de estado no LangGraph para fluxos de decisão autônomos e assistidos.
  - Integrar chamadas de LLMs aos Celery Workers para garantir execução não-bloqueante.
  - Estruturar pipelines de RAG (Retrieval-Augmented Generation) com busca vetorial.

---

## 🔄 Matriz de Atuação por Fase do Projeto

| Fase Estratégica | Especialista Líder | Especialistas de Apoio | Escopo Principal |
| :--- | :--- | :--- | :--- |
| **Fase 1: Harness & Dev Local** | `arquiteto_solucoes` | `engenheiro_devops` | Ferramental, linters, testes e guardrails |
| **Fase 2: Git & GitHub** | `engenheiro_devops` | `arquiteto_solucoes` | Repositório, versionamento semântico e CI |
| **Fase 3: Borda & Criptografia** | `engenheiro_devops` | `arquiteto_solucoes` | Cloudflare DNS, WAF e SSL/TLS Full Strict |
| **Fase 4: Infra VPS & Hardening** | `engenheiro_devops` | `arquiteto_solucoes` | Ubuntu Linux, SSH criptográfico, Firewall UFW |
| **Fase 5: Swarm & Ingress** | `engenheiro_devops` | `engenheiro_backend` | Docker Swarm, redes overlay e Traefik ACME |
| **Fase 6: Core Web & Persistência** | `engenheiro_backend` | `arquiteto_solucoes` | Django, Gunicorn, PostgreSQL 16 e Redis |
| **Fase 7: Mensageria & IA Cognitiva** | `engenheiro_ia` | `engenheiro_backend` | RabbitMQ, Celery Workers, LangGraph e RAG |

---

## ⚡ Diretriz Global de Operação: Paradigma API-First & Operação Headless (ADR 011)

- **Mandato Corporativo:** Toda e qualquer ferramenta, serviço de nuvem ou componente da stack técnica (Cloudflare, GitHub, Hostinger VPS, Traefik Ingress, PostgreSQL 16, Redis, RabbitMQ, Celery, OpenAI/LLMs, etc.) deve ser acessado, auditado, monitorado e provisionado pelo Antigravity **diretamente via API oficial, CLI ou SDK programático**, dispensando o usuário de abrir dashboards ou executar tarefas manuais em navegadores.
- **Transparência Conversacional:** O usuário comanda em linguagem natural no chat; o Antigravity traduz a intenção em chamadas de API, executa a operação e apresenta o relatório estruturado em tempo real.
- **Governança de Segredos:** Tokens de acesso e chaves de API permanecem estritamente no arquivo local `.env` (protegido pela linha 27 do `.gitignore`), garantindo soberania e segurança total das credenciais.


