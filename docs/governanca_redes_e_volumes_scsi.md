# 🔒 Governança de Redes e Volumes Persistentes (Sub-etapa 5.2 — SCSI)

**Projeto:** Sistema de Gestão Inteligente — Fundação Dr. Jesus  
**Padrão:** SCSI / PycoderBR (Arquitetura Soberana com Defesa em Profundidade)  
**Data:** 25/09/2026  

---

## 1. Topologia de Redes em 3 Zonas (Zero Trust de Rede)

Para cumprir as diretrizes regulatórias da LGPD de Dados Sensíveis de Saúde e impedir movimentos laterais em caso de comprometimento da camada web, o cluster é segregado em **3 zonas lógicas estritas**:

```
[ Usuários Externos / Cloudflare WAF ]
                  │
                  ▼ (Portas 80 / 443)
┌────────────────────────────────────────────────────────┐
│  ZONA 1: scsi_public (Ingress / Borda Pública)         │
│  • frontend (Nginx SPA)                                │
│  • backend (Daphne ASGI REST/WS/SSE)                   │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼ (Apenas Backend transiciona)
┌────────────────────────────────────────────────────────┐
│  ZONA 2: scsi_internal (Aplicação, Mensageria & IA)   │
│  • backend                                             │
│  • celery_worker                                       │
│  • rabbitmq (Broker AMQP 5672)                         │
│  • redis (Channel Layer 6379)                          │
│  • ollama (Inferência Local 11434)                     │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼ (Apenas Backend e Celery Worker)
┌────────────────────────────────────────────────────────┐
│  ZONA 3: scsi_data (Alta Segurança — internal: true)   │
│  • backend (Django ORM)                                │
│  • celery_worker (Ingestão RAG)                        │
│  • db (PostgreSQL 16 + pgvector)                       │
│  🛑 SEM ACESSO À INTERNET / SEM ROTEAMENTO EXTERNO      │
└────────────────────────────────────────────────────────┘
```

---

## 2. Matriz de Pertencimento a Redes

| Serviço | `scsi_public` | `scsi_internal` | `scsi_data` (`internal: true`) | Justificativa de Segurança |
| :--- | :---: | :---: | :---: | :--- |
| **frontend** | ✅ | ❌ | ❌ | Apenas entrega assets estáticos compilados aos clientes. |
| **backend** | ✅ | ✅ | ✅ | Atua como gateway soberano, orquestrando web, filas e banco. |
| **celery_worker** | ❌ | ✅ | ✅ | Processa tarefas assíncronas; não expõe portas externas. |
| **db (Postgres)** | ❌ | ❌ | ✅ | **Blindagem total:** Nunca acessível fora da zona de dados. |
| **redis** | ❌ | ✅ | ❌ | Isolado na rede de mensageria da aplicação. |
| **rabbitmq** | ❌ | ✅ | ❌ | Isolado; dashboard de gerência restrito à rede interna. |
| **ollama** | ❌ | ✅ | ❌ | Motor cognitivo local isolado de tráfego web direto. |

---

## 3. Governança de Volumes Persistentes

Todos os volumes são declarados com `driver: local` e preparados para atrelamento com `node.labels.scsi_storage == "true"` no Docker Swarm (Fases 6 e 7):

1. **`dr_jesus_pg_data` (`/var/lib/postgresql/data`):**
   - Dados relacionais e vetoriais (HNSW) do PostgreSQL 16.
   - Rotina mandatória de backup diário com retenção de 7 dias via `pg_dump`.
2. **`dr_jesus_redis_data` (`/data`):**
   - Snapshots RDB periódicos (`--save 60 1`) e volatilidade controlada.
3. **`dr_jesus_rabbitmq_data` (`/var/lib/rabbitmq`):**
   - Persistência de metadados de filas Mnesia e mensagens duráveis.
4. **`dr_jesus_ollama_data` (`/root/.ollama`):**
   - Pesos binários GGUF de modelos de linguagem (`llama3.2:3b` e `nomic-embed-text`).
   - Evita re-downloads de gigabytes entre ciclos de vida de containers.
5. **`dr_jesus_media_data` (`/app/media`):**
   - Storage soberano de laudos, exames e documentos anexados.
   - Compartilhado estritamente entre `backend` (upload) e `celery_worker` (OCR/indexação).
6. **`dr_jesus_static_data` (`/app/staticfiles`):**
   - Arquivos estáticos coletados pelo Django (`collectstatic`).
