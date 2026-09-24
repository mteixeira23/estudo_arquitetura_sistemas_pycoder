# 🐍 Arquitetura Base: Django e Gunicorn
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 6 — Core da Aplicação & Camada de Persistência  
**Sub-etapa:** 6.3 — Estrutura Modular e Servidor de Aplicação  
**Data de Emissão:** 24/09/2026  

---

## 1. Desacoplamento da Estrutura de Diretórios

O padrão criado pelo comando `django-admin startproject` mistura regras de negócio com configurações monolíticas. Na arquitetura SCSI, adotaremos o desacoplamento físico (inspirado no modelo Cookiecutter):

```text
/src/
├── config/                 # Ponto de entrada (WSGI/ASGI e roteamento raiz)
│   ├── settings/           # Configurações Modulares
│   │   ├── base.py         # Variáveis universais (INSTALLED_APPS, MIDDLEWARE)
│   │   ├── local.py        # Debug True, SQLite (dev)
│   │   └── production.py   # Debug False, Postgres, Redis, SSL Proxied
│   ├── urls.py
│   └── wsgi.py
├── apps/                   # Nossos micro-módulos de negócio
│   ├── accounts/           # Autenticação e Usuários
│   └── chat_ai/            # Interface com o LangGraph
└── manage.py
```

## 2. Servidor de Alta Performance ASGI (Gunicorn + Uvicorn)

Jamais utilizaremos o `python manage.py runserver` em produção. Além disso, devido à natureza do projeto envolver **Inteligência Artificial (LLMs e LangGraph)**, o tráfego da API conterá *Streaming* de tokens (Server-Sent Events) e altíssimo tempo de espera (I/O Bound).

Por isso, o modelo tradicional WSGI foi descartado. O projeto será servido pelo **Gunicorn operando com Workers ASGI do Uvicorn**.
- **Comando Base:** `gunicorn config.asgi:application --bind 0.0.0.0:8000 -k uvicorn.workers.UvicornWorker --workers 4`
- **Por que ASGI?** Ele permite o uso do *Event Loop* (I/O assíncrono e não-bloqueante). Enquanto a IA "pensa", a conexão fica aberta via WebSockets ou SSE sem bloquear o worker, permitindo que a API atenda a milhares de clientes simultaneamente.

## 3. Topologia de Rede do Django

O container do Django será o **nervo central** do projeto. Ele é o único serviço da arquitetura SCSI que transita pelas 3 redes blindadas:
1. `scsi_public`: Para receber as requisições HTTP oriundas do Traefik Ingress.
2. `scsi_data`: Para realizar queries no PostgreSQL e injetar/ler sessões no Redis.
3. `scsi_internal`: Para enviar mensagens (tarefas pesadas) ao RabbitMQ.

## 4. Blueprint Declarativo (Docker Swarm)

```yaml
services:
  django_api:
    image: registry.scsi.local/django_api:latest
    command: gunicorn config.asgi:application --bind 0.0.0.0:8000 -k uvicorn.workers.UvicornWorker --workers 4
    networks:
      - scsi_public
      - scsi_data
      - scsi_internal
    environment:
      - DJANGO_SETTINGS_MODULE=config.settings.production
    volumes:
      - scsi_media:/app/media
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health/"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      replicas: 2
      update_config:
        order: start-first # Depende do Healthcheck para garantir Zero-Downtime
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.django.rule=Host(`api.scsi.pycoder.com.br`)"
        - "traefik.http.routers.django.entrypoints=websecure"
        - "traefik.http.routers.django.tls=true"
        - "traefik.http.services.django.loadbalancer.server.port=8000"
    secrets:
      - scsi_django_secret_key
      - scsi_postgres_password
      - scsi_redis_password

volumes:
  scsi_media:
    driver: local
```
