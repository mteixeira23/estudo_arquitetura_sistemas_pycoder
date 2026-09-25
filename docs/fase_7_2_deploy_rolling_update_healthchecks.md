# 🚀 Fase 7.2: Deploy em Produção com Zero-Downtime Rolling Updates & Healthchecks

**Projeto:** Sistema de Gestão Inteligente — Fundação Dr. Jesus  
**Padrão:** SCSI / PycoderBR (Arquitetura Soberana com Defesa em Profundidade)  
**Data:** 25/09/2026  
**Status:** Implementado e Auditado  

---

## 1. Visão Geral da Sub-etapa 7.2

A **Sub-etapa 7.2** conclui a automação de implantação da aplicação em ambiente de produção no Docker Swarm, implementando:
1. **Monitoramento Ativo de Saúde (`healthcheck:`):** Probes de verificação periódica de integridade em todos os 7 serviços da stack.
2. **Atualização Contínua Sem Indisponibilidade (`update_config: order: start-first`):** Em atualizações de versão, novas réplicas de contêineres são iniciadas e só começam a receber tráfego após confirmarem status saudável (`healthy`), mantendo as réplicas antigas ativas durante o processo.
3. **Rollback Automático Instantâneo (`failure_action: rollback` e `rollback_config:`):** Se uma nova versão falhar nos testes de saúde dentro da janela de monitoramento, o Swarm aborta a atualização e restabelece a versão anterior sem intervenção humana.
4. **Script de Orquestração Headless (`scripts/deploy_stack_producao.sh`):** Automação em Bash idempotente aderente à ADR 011, com checagem de pré-requisitos, build de imagens, despacho de stacks e acompanhamento ativo de convergência de réplicas.

---

## 2. Matriz de Probes de Saúde (Healthchecks)

Cada serviço do ecossistema possui uma sonda de integridade calibrada especificamente para sua natureza funcional:

| Serviço | Mecanismo de Sonda (Healthcheck Probe) | Intervalo / Timeout | Retentativas | Start Period |
| :--- | :--- | :---: | :---: | :---: |
| **frontend** | `wget -qO- http://127.0.0.1:80/healthz` | 15s / 5s | 3 | 10s |
| **backend** | `python -c '...urlopen("http://127.0.0.1:8000/api/health/")'` | 15s / 5s | 3 | 25s |
| **db (Postgres)** | `pg_isready -U $(cat user) -d $(cat db)` | 10s / 5s | 5 | 15s |
| **redis** | `redis-cli -a $(cat password) ping \| grep PONG` | 10s / 5s | 3 | 10s |
| **rabbitmq** | `rabbitmq-diagnostics -q ping` | 15s / 10s | 3 | 30s |
| **celery_worker** | `celery -A core inspect ping -d celery@$HOSTNAME` | 30s / 10s | 3 | 30s |
| **ollama** | `ollama list` | 30s / 10s | 3 | 30s |

### Detalhe do Endpoint de Saúde do Backend (`/api/health/`):
Implementado via `HealthCheckView` em `backend-dr-jesus/sgi/views.py`:
- `AllowAny`: dispensado de token JWT para consultas de infraestrutura.
- Checagem atômica do PostgreSQL: `SELECT 1;`
- Checagem do Cache / Redis: gravação e leitura de chave volátil com TTL curto.
- Resposta padronizada em JSON com código HTTP 200 (ou 503 em falha de dependência crítica).

### Detalhe do Endpoint de Saúde do Frontend (`/healthz`):
Configurado diretamente no Nginx Alpine (`sgi-fundacao-dr-jesus/nginx.conf`):
- `location /healthz { access_log off; default_type text/plain; return 200 "healthy\n"; }`
- Resposta instantânea em memória sem sobrecarregar logs de acesso.

---

## 3. Estratégia de Atualização Contínua e Rollback Automático

Para os serviços de borda e API (`frontend` e `backend`), foram configuradas as seguintes diretivas no `docker-compose.yml`:

```yaml
deploy:
  mode: replicated
  replicas: 2
  update_config:
    parallelism: 1
    delay: 15s
    order: start-first          # 1. Sobe a nova réplica
    failure_action: rollback    # 2. Em caso de erro, reverte
    monitor: 25s                # 3. Monitora probes por 25 segundos
    max_failure_ratio: 0.2
  rollback_config:
    parallelism: 1
    delay: 5s
    order: stop-first
    failure_action: pause
    monitor: 10s
```

### Ciclo de Vida do Rolling Update Zero-Downtime:
1. O Docker Swarm inicia a **Réplica 1 da Nova Versão** mantendo as **2 Réplicas da Versão Antiga** ativas no Traefik Ingress.
2. A nova réplica entra na fase `start_period`. O Traefik aguarda a sinalização de `healthy` emitida pelo healthcheck.
3. Assim que a nova réplica atinge `healthy` e passa pela janela `monitor`, o Traefik passa a rotear tráfego para ela.
4. O Swarm encerra graciosamente uma réplica antiga e repete o processo para a Réplica 2.
5. Em caso de falha de inicialização (crash, timeout, erro de banco), o Swarm cancela a transição e executa o **rollback imediato**.

---

## 4. Auditoria Automatizada da Sub-etapa 7.2

Execução do script [`scripts/verificar_deploy_producao.py`](file:///c:/Users/marcos.teixeira/.gemini/antigravity/scratch/estudo_arquitetura_sistemas_pycoder/scripts/verificar_deploy_producao.py):

```
==================================================================
   AUDITORIA TÉCNICA: SUB-ETAPA 7.2 (ROLLING UPDATE & HEALTH)     
==================================================================

[1/5] Verificação de Formatação Unix LF (ADR 007)...
  [PASS] deploy_stack_producao.sh: 100% puro Unix LF (0 bytes CR).
  [PASS] docker-compose.yml: 100% puro Unix LF (0 bytes CR).
  [PASS] views.py: 100% puro Unix LF (0 bytes CR).
  [PASS] urls.py: 100% puro Unix LF (0 bytes CR).
  [PASS] nginx.conf: 100% puro Unix LF (0 bytes CR).

[2/5] Auditoria de Cobertura de Healthchecks no docker-compose.yml...
  [PASS] Serviço 'frontend': Healthcheck configurado com probe 'wget -qO- http://127.0.0.1:80/...'.
  [PASS] Serviço 'backend': Healthcheck configurado com probe 'http://127.0.0.1:8000/api/heal...'.
  [PASS] Serviço 'db': Healthcheck configurado com probe 'pg_isready...'.
  [PASS] Serviço 'redis': Healthcheck configurado com probe 'redis-cli...'.
  [PASS] Serviço 'rabbitmq': Healthcheck configurado com probe 'rabbitmq-diagnostics -q ping...'.
  [PASS] Serviço 'celery_worker': Healthcheck configurado com probe 'celery -A core inspect ping...'.
  [PASS] Serviço 'ollama': Healthcheck configurado com probe 'ollama list...'.

[3/5] Auditoria de Rolling Updates (order: start-first / failure_action: rollback)...
  [PASS] 'order: start-first' aplicado aos serviços web (frontend e backend: 2 ocorrências).
  [PASS] 'failure_action: rollback' configurado em todos os 7 serviços (7 ocorrências).
  [PASS] Bloco 'rollback_config' declarado em todos os 7 serviços (7 ocorrências).

[4/5] Auditoria dos Endpoints de Healthcheck no Código da Aplicação...
  [PASS] Django: 'HealthCheckView' implementada com probes de PostgreSQL e Cache.
  [PASS] Django: Rota '/api/health/' registrada em sgi/urls.py.
  [PASS] Frontend Nginx: Bloco 'location /healthz' ativo com retorno 200.

[5/5] Auditoria de Integridade do Script Bash de Deploy...
  [PASS] Comando de deploy de stacks no Swarm verificado no script de deploy.
  [PASS] Monitoramento de convergência de réplicas verificado no script de deploy.
  [PASS] Validação de rede overlay pré-requisito verificado no script de deploy.
  [PASS] Validação de segredos obrigatórios verificado no script de deploy.
  [PASS] Controle de timeout com fail-safe verificado no script de deploy.

------------------------------------------------------------------
✅ AUDITORIA CONCLUÍDA COM 100% DE SUCESSO! (0 erros)
Sub-etapa 7.2 pronta para homologação pela banca técnica.
```
