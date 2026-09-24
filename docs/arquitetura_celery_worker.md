# ⚙️ Processamento Assíncrono: Celery Worker
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 7 — Mensageria Assíncrona & IA Cognitiva  
**Sub-etapa:** 7.2 (Passo 13) — Operários de Background (Celery Worker)  
**Data de Emissão:** 24/09/2026  

---

## 1. Reutilização de Imagem (DRY no Swarm)

Uma das maiores vantagens da arquitetura Celery é que ele compartilha **100% da base de código do Django**. Portanto, não construiremos um `Dockerfile` novo. O Celery utilizará a exata mesma imagem construída na Fase 6 (com `uv` e `debian-slim`), alterando apenas o comando de execução (o `CMD`).

Isso garante que o Celery tenha acesso aos mesmos modelos ORM do banco de dados, às mesmas configurações e à mesma lógica de negócios (incluindo o LangGraph).

## 2. Topologia de Rede e Comunicação

Ao contrário do Django (que fica espremido entre o público e o interno), o Celery Worker não recebe requisições HTTP de usuários. Sua topologia é diferente:
- **Rede `scsi_internal`:** Para pegar tarefas da fila do RabbitMQ e salvar os status no Redis (Result Backend).
- **Rede `scsi_data`:** Obrigatório. Lembra do **"Padrão de Payload Magro"** da 7.1? O Celery receberá apenas o ID do usuário. Ele precisará se conectar ao PostgreSQL (pgvector) para extrair os documentos pesados de RAG.
- **Saída para a Internet:** Nativa pelo Docker para chamar as APIs da OpenAI/Anthropic.

## 3. Estratégia de Pool para Inteligência Artificial (I/O Bound) e Roteamento

O padrão do Celery é criar processos pesados no sistema operacional (Prefork). Porém, processamento de IA via API (onde o Python só fica aguardando a resposta da rede) é uma tarefa **I/O Bound**. A engenharia de IA desaconselhou o uso de `gevent` devido a conflitos de *monkey-patching* com bibliotecas como gRPC e LangChain.
Para economizar RAM brutalmente e aumentar a vazão, usaremos *Threads* (`--pool=threads --concurrency=10`). 

**Isolamento de Fila:** Como esse worker será ultra-especializado em IA (Threads), impomos a flag `-Q ia_tasks`. Isso garante que ele não consuma tarefas comuns (ex: e-mails) ou *CPU Bound*, que deverão ser processadas por um worker clássico separado. Ajustamos também o teto de RAM para 1024M, evitando *OOM Kill* durante a desserialização de respostas muito longas do LLM.

## 4. Blueprint Declarativo (Docker Swarm)

```yaml
services:
  celery_worker_ia:
    image: my_django_app:latest # Mesma imagem do backend
    networks:
      - scsi_internal
      - scsi_data
    environment:
      # Credenciais do Banco, Redis e RabbitMQ injetadas via Secrets/Environment
      - DATABASE_URL=postgres://...
      - CELERY_BROKER_URL=amqp://...
      - CELERY_RESULT_BACKEND=redis://...
      - OPENAI_API_KEY=/run/secrets/openai_api_key
    command: ["celery", "-A", "config", "worker", "-l", "INFO", "-Q", "ia_tasks", "--pool=threads", "--concurrency=10"]
    healthcheck:
      test: ["CMD-SHELL", "celery -A config inspect ping -d celery@$$HOSTNAME || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 1024M
    secrets:
      - scsi_db_password
      - scsi_rabbitmq_password
      - openai_api_key
```

*Nota de Escalabilidade:* O `deploy.replicas: 2` foi definido como base. Como o container usará pouco CPU (apenas aguardando a API de LLM), podemos escalar horizontalmente (`docker service scale scsi_celery_worker=10`) de forma muito barata.
