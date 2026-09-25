# ==========================================
# Dockerfile Multi-Stage: Backend Django ASGI
# Padrão Arquitetural SCSI / PycoderBR
# ==========================================

# Estágio 1: Builder com uv para compilação rápida e hermética
FROM python:3.12-slim-bookworm AS builder

# Variáveis de ambiente de compilação
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

WORKDIR /app

# Instalação do uv de alta performance
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Dependências do sistema necessárias para compilação de binários C/C++
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copia os manifestos de dependência primeiro para cache de camada Docker
COPY pyproject.toml uv.lock ./

# Sincroniza ambiente virtual de produção
RUN uv sync --frozen --no-dev --no-install-project

# ==========================================
# Estágio 2: Imagem Final de Execução (Runner)
# ==========================================
FROM python:3.12-slim-bookworm AS runner

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app/.venv/bin:$PATH"

WORKDIR /app

# Dependências mínimas de runtime (sem compiladores de C/C++)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Criação de usuário não-root com privilégios restritos (Hardening)
RUN groupadd -g 1000 scsi && \
    useradd -u 1000 -g scsi -s /bin/bash -m scsiuser

# Copia o ambiente virtual compilado do estágio builder
COPY --from=builder --chown=scsiuser:scsi /app/.venv /app/.venv

# Copia o código-fonte da aplicação
COPY --chown=scsiuser:scsi . .

# Criação e permissão dos volumes de mídia e estáticos
RUN mkdir -p /app/media /app/staticfiles && \
    chown -R scsiuser:scsi /app/media /app/staticfiles

# Alterna para o usuário não-root
USER scsiuser

# Porta ASGI padrão
EXPOSE 8000

# Script de entrada para migrações e checagens defensivas
ENTRYPOINT ["/app/entrypoint.sh"]

# Probe de saúde nativa em Python puro (sem utilitários externos de rede)
HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/schema/').read()" || exit 1

# Comando padrão: Daphne ASGI Server para WebSockets e HTTP Streaming simultâneos
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "core.asgi:application"]

