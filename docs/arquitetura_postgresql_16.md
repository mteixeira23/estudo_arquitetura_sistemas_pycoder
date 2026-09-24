# 🐘 Arquitetura de Persistência Relacional: PostgreSQL 16 + pgvector
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 6 — Core da Aplicação & Camada de Persistência  
**Sub-etapa:** 6.1 — Banco de Dados Relacional e Vetorial  
**Data de Emissão:** 24/09/2026  

---

## 1. Imagem Base: Preparando o Terreno para IA

Apesar de o Django suportar PostgreSQL puro, nossa Fase 7 envolverá **Inteligência Artificial (RAG - Retrieval-Augmented Generation)**. Para que os agentes LLM consigam buscar documentos corporativos semanticamente, o banco de dados precisará armazenar e calcular distâncias de *Embeddings Vetoriais*.

- **Decisão:** Não usaremos a imagem genérica `postgres:16`. Adotaremos a imagem oficial `pgvector/pgvector:pg16`. Ela contém o motor do PostgreSQL 16 idêntico ao original, mas já compilado com a extensão `pgvector` em C (altíssima performance matemática).

## 2. Injeção de Segredos em Memória RAM (Compliance Fase 5)

Em conformidade com a nossa política de segurança (Zero `.env`), o container do Postgres precisará importar as senhas criptografadas montadas na memória.
O PostgreSQL nativamente suporta o sufixo `_FILE` em suas variáveis de ambiente:
- `POSTGRES_PASSWORD_FILE=/run/secrets/scsi_postgres_password`
- `POSTGRES_USER_FILE=/run/secrets/scsi_postgres_user`
- `POSTGRES_DB_FILE=/run/secrets/scsi_postgres_db`

## 3. Topologia de Rede e Persistência

- **Rede:** O container será anexado EXCLUSIVAMENTE à rede `scsi_data`. O Traefik e a internet pública jamais terão acesso direto à porta `5432`. Apenas a API (Django) enxerga o Banco.
- **Armazenamento:** Os dados físicos repousarão em um Volume Nomeado (`scsi_pgdata`) montado no caminho `/var/lib/postgresql/data`. O volume será isolado no nó físico para garantir alto throughput de I/O em disco SSD.

## 4. Blueprint Declarativo Inicial

O serviço integrará a *stack* de dados do Swarm:

```yaml
services:
  postgres:
    image: pgvector/pgvector:pg16
    networks:
      - scsi_data
    environment:
      - POSTGRES_DB_FILE=/run/secrets/scsi_postgres_db
      - POSTGRES_USER_FILE=/run/secrets/scsi_postgres_user
      - POSTGRES_PASSWORD_FILE=/run/secrets/scsi_postgres_password
    volumes:
      - scsi_pgdata:/var/lib/postgresql/data
    deploy:
      placement:
        constraints: [node.labels.db_node == "true"] # Pinado ao nó exato para não perder o volume local (Fix DevOps)
      resources:
        limits:
          cpus: '2.0'
          memory: 4096M
        reservations:
          cpus: '0.5'
          memory: 2048M # Garantia mínima vital para índices HNSW de IA na RAM (Fix IA)
    secrets:
      - scsi_postgres_db
      - scsi_postgres_user
      - scsi_postgres_password

volumes:
  scsi_pgdata:
    driver: local

networks:
  scsi_data:
    external: true

secrets:
  scsi_postgres_db:
    external: true
  scsi_postgres_user:
    external: true
  scsi_postgres_password:
    external: true
```
