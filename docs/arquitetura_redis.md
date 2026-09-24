# ⚡ Arquitetura de Cache e Sessões: Redis 7
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 6 — Core da Aplicação & Camada de Persistência  
**Sub-etapa:** 6.2 — Banco de Dados em Memória (Redis)  
**Data de Emissão:** 24/09/2026  

---

## 1. Imagem Base: Otimização Extrema

Adotaremos a imagem oficial `redis:7-alpine`. A escolha da variação baseada em Alpine Linux reduz drasticamente a superfície de ataque (a imagem possui apenas ~15MB) e elimina ferramentas de sistema operacional desnecessárias.

## 2. Injeção de Segredos e Prevenção de Vazamento no `ps`

Diferente do PostgreSQL, o motor oficial do Redis não possui um suporte nativo ao sufixo `_FILE`. Se simplesmente passarmos `--requirepass "$(cat /run/secrets/scsi_redis_password)"`, a senha ficaria visível em texto plano para qualquer usuário no host rodando o comando `ps aux` ou rastreando o `cmdline` do processo longo do `redis-server`.

Para mantermos a aderência à nossa regra (Zero `.env`) garantindo segurança total, o *entrypoint* do container cria dinamicamente um arquivo de configuração temporário lendo o segredo, e então inicia o servidor.

## 3. Topologia de Rede Multihoming

O Redis fará a ponte entre duas zonas de rede distintas (Zero Trust):
- `scsi_data`: Para comunicação com a API Django (resolução de Cache e Sessões HTTP).
- `scsi_internal`: Para comunicação com os Celery Workers de IA (atuando como *Result Backend*, ou seja, armazenando o resultado gerado pelo LLM para o usuário coletar depois).
- A porta 6379 **não** será exposta publicamente.

## 4. Blueprint Declarativo Inicial

```yaml
services:
  redis:
    image: redis:7-alpine
    networks:
      - scsi_data
      - scsi_internal
    command: >
      /bin/sh -c '
      echo "requirepass $$(cat /run/secrets/scsi_redis_password)" > /tmp/redis.conf &&
      redis-server /tmp/redis.conf --appendonly yes --maxmemory 1500mb --maxmemory-policy volatile-lru
      '
    volumes:
      - scsi_redis_data:/data
    deploy:
      placement:
        constraints: [node.labels.db_node == "true"]
      resources:
        limits:
          cpus: '1.0'
          memory: 2048M # Hard-limit do Docker (Cgroups)
        reservations:
          cpus: '0.25'
          memory: 512M
    secrets:
      - scsi_redis_password

volumes:
  scsi_redis_data:
    driver: local

networks:
  scsi_data:
    external: true
  scsi_internal:
    external: true

secrets:
  scsi_redis_password:
    external: true
```

*Nota sobre Persistência:* Ativamos a *flag* `--appendonly yes` (AOF) para que os dados do cache e sessões sejam periodicamente gravados no volume local. Assim, caso o serviço reinicie, os usuários não são "deslogados" em massa.
