# ⏱️ Orquestrador Temporal: Celery Beat
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 7 — Mensageria Assíncrona & IA Cognitiva  
**Sub-etapa:** 7.3 (Passo 14) — Orquestrador Temporal (Celery Beat)  
**Data de Emissão:** 24/09/2026  

---

## 1. O Relógio do Sistema (Função Exclusiva)

O **Celery Beat** é o nosso maestro do tempo (agendador estilo `cron`). É fundamental entender uma premissa arquitetural: **O Beat não executa tarefas**. A única função dele é olhar para o relógio e, quando der a hora certa, jogar uma mensagem na fila do RabbitMQ. Quem vai "suar a camisa" e executar a tarefa será o *Celery Worker* (Passo 13).

Usaremos o Beat para:
- Acionar a limpeza de tokens e sessões expiradas.
- Disparar manutenções programadas no `pgvector` (ex: `REINDEX` ou `VACUUM ANALYZE` forçado em janelas noturnas após processos de ingestão massiva de embeddings em lote, cobrindo as limitações do *autovacuum* nativo).
- Agendar relatórios de uso diários.

## 2. Agendamento Dinâmico via Banco de Dados (`django-celery-beat`)

Se usássemos a configuração padrão, teríamos que escrever as tarefas com seus horários chumbados (hardcoded) no código Python. Em vez disso, usaremos a biblioteca `django-celery-beat`. 

Com ela, o Celery Beat usa o **PostgreSQL** (na rede `scsi_data`) como a fonte da verdade. Isso permite que qualquer administrador acesse o painel do Django e crie ou altere a periodicidade de uma tarefa em tempo real, sem precisar reiniciar os containers do Docker Swarm.

**Ressalva Crítica de Fuso Horário:** Como apontado pela engenharia de Backend, para que os horários definidos pelo administrador no painel web batam exatamente com o relógio interno do Celery Beat, é mandatório configurar o `settings.py` alinhando os fusos:
```python
TIME_ZONE = 'America/Sao_Paulo'
USE_TZ = True
CELERY_ENABLE_UTC = False 
CELERY_TIMEZONE = TIME_ZONE
```

## 3. A Regra de Ouro: Padrão Singleton (Réplica Única)

No mundo dos microsserviços, queremos escalar tudo horizontalmente, mas o Celery Beat é a **grande exceção**. 
Ele deve rodar em regime estrito de **Réplica Única** (`replicas: 1`). Se dois containers do Celery Beat estiverem ligados ao mesmo tempo, ambos jogarão a mensagem de "limpar lixo" na fila no mesmo minuto, causando duplicação catastrófica de tarefas na arquitetura.

## 4. Blueprint Declarativo (Docker Swarm)

```yaml
services:
  celery_beat:
    image: my_django_app:latest # Reuso DRY da imagem principal
    networks:
      - scsi_internal
      - scsi_data
    environment:
      - DATABASE_URL=postgres://...
      - CELERY_BROKER_URL=amqp://...
    command: ["celery", "-A", "config", "beat", "-l", "INFO", "--scheduler", "django_celery_beat.schedulers:DatabaseScheduler"]
    deploy:
      replicas: 1 # OBRIGATORIAMENTE 1
      placement:
        constraints: [node.role == manager] # Prendemos no manager para evitar redeploy excessivo e garantir HA da agenda
      resources:
        limits:
          cpus: '0.2'
          memory: 256M
    secrets:
      - scsi_db_password
      - scsi_rabbitmq_password
```

*Nota de Segurança de Recursos:* Como a função do Beat é apenas conferir o relógio no banco e jogar uma mensagem rápida no RabbitMQ, ele consome pouquíssima CPU e RAM. Travamos o teto em `256M`, tornando-o um componente extremamente econômico na VPS.
