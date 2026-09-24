# 🐳 Arquitetura do Dockerfile Multi-stage (Django)
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 6 — Core da Aplicação & Camada de Persistência  
**Sub-etapa:** 6.4 — Otimização e Construção da Imagem Docker  
**Data de Emissão:** 24/09/2026  

---

## 1. O Paradigma Multi-stage

Imagens Docker de aplicações Python (especialmente com Inteligência Artificial e Banco de Dados) costumam inflar rapidamente para +1GB devido a compiladores (`gcc`), headers C (`python3-dev`) e pacotes do sistema necessários para compilar bibliotecas como `psycopg3` (Postgres) ou pacotes matemáticos.

Para resolver isso, adotamos o padrão **Multi-stage Build**:
1. **Estágio Builder:** Uma imagem "pesada" que baixa o código-fonte C, instala os compiladores, monta o ambiente virtual (`.venv`) e gera os binários rodais.
2. **Estágio Production:** Uma imagem virgem e enxuta que apenas copia a pasta `.venv` pronta do estágio anterior, descartando todo o lixo de compilação.

## 2. Escolha da Imagem Base: Slim vs Alpine

Embora tenhamos usado Alpine para o Redis, **NÃO** usaremos Alpine para o Python. O Alpine utiliza `musl libc` em vez de `glibc`. A grande maioria das bibliotecas de IA e Machine Learning do Python (e o próprio driver do PostgreSQL) não oferecem pacotes pré-compilados (*wheels*) para `musl`. Usar Alpine forçaria o Docker a compilar tudo do zero, demorando minutos e gerando bugs bizarros de C. 
A imagem oficial escolhida é a `python:3.12-slim` (baseada no Debian).

## 3. Integração com Astral `uv` (ADR 009)

Na Fase 1, homologamos o gerenciador de pacotes `uv` (escrito em Rust). Ele substitui o `pip` e o `poetry` e é de 10 a 100 vezes mais rápido. Usaremos ele no Dockerfile para instalar dependências em fração de segundos.

## 4. Blueprint do Dockerfile Oficial

```dockerfile
# ==========================================
# ESTÁGIO 1: BUILDER (Compilação)
# ==========================================
FROM python:3.12-slim AS builder

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# 1. Instalar compiladores e headers do sistema operacional
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# 2. Instalar o gerenciador ultrarrápido uv (ADR 009)
RUN pip install uv

# 3. Copiar apenas os locks de dependência primeiro (Maximizando cache do Docker)
COPY pyproject.toml uv.lock ./

# 4. Criar o .venv e instalar pacotes (Sem instalar o projeto próprio ainda)
RUN uv sync --frozen --no-dev --no-install-project

# ==========================================
# ESTÁGIO 2: PRODUCTION (Leve e Segura)
# ==========================================
FROM python:3.12-slim AS production

# Ativar o virtual environment no PATH global
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app/.venv/bin:$PATH"

WORKDIR /app

# 1. Instalar bibliotecas de execução (Runtime) mínimas
# 'libpq5' é necessário para o psycopg3 conversar com Postgres.
# 'curl' é necessário para o healthcheck que configuramos no docker-compose.
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 2. Criar usuário não-root (Segurança) e preparar diretórios de gravação
RUN addgroup --system appgroup && adduser --system --group appuser && \
    mkdir -p /app/staticfiles /app/media && \
    chown -R appuser:appgroup /app

# 3. Copiar o .venv pronto do Estágio 1
COPY --from=builder /app/.venv /app/.venv

# 4. Copiar o código fonte do projeto
COPY --chown=appuser:appgroup src/ /app/src/
COPY --chown=appuser:appgroup manage.py /app/

# 5. Blindagem de Execução (Remover root)
USER appuser

EXPOSE 8000

# 6. Boot em modo ASGI / Uvicorn (Aprovado na Revisão da Etapa 6.3)
CMD ["gunicorn", "config.asgi:application", "--bind", "0.0.0.0:8000", "-k", "uvicorn.workers.UvicornWorker", "--workers", "4"]
```
