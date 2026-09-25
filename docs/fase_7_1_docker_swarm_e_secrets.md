# 🚀 Fase 7.1: Inicialização do Docker Swarm & Governança de Docker Secrets

**Projeto:** Sistema de Gestão Inteligente — Fundação Dr. Jesus  
**Padrão:** SCSI / PycoderBR (Arquitetura Soberana com Defesa em Profundidade)  
**Data:** 25/09/2026  
**Status:** Implementado e Auditado  

---

## 1. Visão Geral da Sub-etapa 7.1

A **Sub-etapa 7.1** estabelece a infraestrutura de orquestração em produção na VPS Hostinger através do **Docker Swarm**, implementando uma blindagem rigorosa contra vazamento de credenciais via **Docker Secrets**.

### O Problema do `.env` Comum em Produção:
Na maioria das implantações convencionais, credenciais sensíveis (senhas de banco, chaves de API, segredos JWT) são injetadas em texto plano através do bloco `environment:` do Compose ou de arquivos `.env`. Qualquer usuário ou processo com acesso a comandos de leitura (`docker inspect`, `docker exec` ou inspeção de processos do Linux) consegue extrair todas as chaves em texto puro.

### A Solução Adotada (Padrão SCSI / ADR 008):
Na arquitetura SCSI, **100% dos dados sensíveis são gerenciados via Docker Secrets**:
1. **Em Repouso:** Criptografados dentro do log Raft distribuído nos nós gestores (*Manager Nodes*).
2. **Em Trânsito:** Trafegam protegidos por mTLS mútuo com certificados temporários.
3. **Em Execução:** Montados **estritamente em memória RAM (`tmpfs`)** no caminho `/run/secrets/<nome_do_segredo>`. O segredo nunca toca o disco rígido da VPS nem é exposto em variáveis de ambiente acessíveis por `docker inspect`.

---

## 2. Matriz dos 10 Segredos Corporativos

| Nome do Segredo (Docker Secret) | Serviços Consumidores | Formato / Origem | Finalidade no SGI Dr. Jesus |
| :--- | :--- | :--- | :--- |
| `scsi_origin_crt` | Traefik | Certificado X.509 PEM | Certificado Origin CA de 15 anos da Cloudflare |
| `scsi_origin_key` | Traefik | Chave privada PEM | Chave privada criptográfica Origin CA |
| `scsi_traefik_basic_auth` | Traefik | Hash bcrypt | Autenticação do Dashboard administrativo do Traefik |
| `scsi_django_secret_key` | Backend, Celery | 50 chars alta entropia | Chave criptográfica mestra (`SECRET_KEY`) do Django |
| `scsi_postgres_db` | Backend, Celery, Postgres | String identificadora | Nome do banco relacional (`dr_jesus_db`) |
| `scsi_postgres_user` | Backend, Celery, Postgres | String identificadora | Usuário administrador do PostgreSQL (`drjesus_admin`) |
| `scsi_postgres_password` | Backend, Celery, Postgres | 32 bytes hexadecimais | Senha de autenticação do PostgreSQL 16 com pgvector |
| `scsi_redis_password` | Backend, Celery, Redis | 32 bytes hexadecimais | Senha de proteção do Redis 7 (`requirepass`) |
| `scsi_rabbitmq_user` | Backend, Celery, RabbitMQ | String identificadora | Usuário do broker AMQP (`drjesus_rabbit`) |
| `scsi_rabbitmq_password` | Backend, Celery, RabbitMQ | 32 bytes hexadecimais | Senha de autenticação do broker RabbitMQ 3.13 |

---

## 3. Topologia de Redes Overlay no Docker Swarm

O cluster opera com 3 redes overlay estritamente segregadas:
- **`scsi_public` (Overlay, attachable):** Permite a comunicação direta entre o Ingress Controller (Traefik v3.1) e os contêineres de borda web (`frontend` e `backend`).
- **`scsi_socket_net` (Overlay, internal: true):** Rede estritamente fechada para permitir que o Traefik consulte metadados de serviços no `tecnativa/docker-socket-proxy` via TCP (`tcp://socket-proxy:2375`) sem conceder permissões de escrita (`POST: 0`).
- **`scsi_internal` (Overlay):** Rede de aplicação conectando o backend aos intermediários (`redis`, `rabbitmq`, `celery_worker` e `ollama`).
- **`scsi_data` (Overlay, internal: true):** Zona de dados de segurança máxima. Não possui gateway nem saída para a internet pública. Conecta exclusivamente `backend` e `celery_worker` ao banco `db` (PostgreSQL 16 com `pgvector`).

---

## 4. Governança de Volumes e Constraints de Nó (`scsi_storage`)

Para evitar que serviços com persistência local de dados sejam alocados em nós efêmeros ou sofram perdas de dados em deploys distribuídos, todos os serviços com volumes locais (`db`, `redis`, `rabbitmq`, `celery_worker` e `ollama`) possuem a restrição declarativa:

```yaml
deploy:
  placement:
    constraints:
      - node.labels.scsi_storage == true
```

O script `scripts/provisionar_swarm_e_secrets.sh` aplica automaticamente esse rótulo ao nó manager da VPS:
```bash
docker node update --label-add scsi_storage=true <NODE_ID>
```

---

## 5. Implementação da Função `get_secret` no Backend Django

O arquivo `core/settings.py` foi refatorado para ler nativamente do sistema de arquivos em RAM (`/run/secrets/`), mantendo compatibilidade regressiva de desenvolvimento:

```python
def get_secret(name: str, default: str = None) -> str:
    """
    Recupera segredos corporativos de forma segura para Docker Swarm (ADR 011).
    Ordem de precedência:
    1. Arquivo montado em /run/secrets/{name} (Docker Secrets em RAM tmpfs)
    2. Variável de ambiente (os.environ) com o nome exato do secret
    3. Variável de ambiente sem prefixo 'scsi_' em caixa alta (ex: POSTGRES_PASSWORD)
    4. Valor default fornecido
    """
    secret_path = Path('/run/secrets') / name
    if secret_path.is_file():
        try:
            return secret_path.read_text(encoding='utf-8').strip()
        except Exception:
            pass
    val = os.environ.get(name)
    if val is not None:
        return val
    clean_name = name.removeprefix('scsi_').upper()
    val = os.environ.get(clean_name)
    if val is not None:
        return val
    return default
```

---

## 6. Resultados da Auditoria Automatizada

O script [`scripts/verificar_swarm_secrets.py`](file:///c:/Users/marcos.teixeira/.gemini/antigravity/scratch/estudo_arquitetura_sistemas_pycoder/scripts/verificar_swarm_secrets.py) foi executado com **100% de conformidade**:

```
==================================================================
   AUDITORIA TÉCNICA: SUB-ETAPA 7.1 (SWARM & DOCKER SECRETS)      
==================================================================

[1/5] Verificação de Formatação Unix LF (ADR 007)...
  [PASS] provisionar_swarm_e_secrets.sh: 100% puro Unix LF (0 bytes CR).
  [PASS] docker-compose.yml: 100% puro Unix LF (0 bytes CR).
  [PASS] docker-compose.traefik.yml: 100% puro Unix LF (0 bytes CR).
  [PASS] settings.py: 100% puro Unix LF (0 bytes CR).

[2/5] Auditoria de Estrutura do docker-compose.yml...
  [PASS] Serviço 'frontend' declarado.
  [PASS] Serviço 'backend' declarado.
  [PASS] Serviço 'db' declarado.
  [PASS] Serviço 'redis' declarado.
  [PASS] Serviço 'rabbitmq' declarado.
  [PASS] Serviço 'celery_worker' declarado.
  [PASS] Serviço 'ollama' declarado.
  [PASS] Secret raiz 'scsi_django_secret_key' declarado com external: true.
  [PASS] Secret raiz 'scsi_postgres_db' declarado com external: true.
  [PASS] Secret raiz 'scsi_postgres_user' declarado com external: true.
  [PASS] Secret raiz 'scsi_postgres_password' declarado com external: true.
  [PASS] Secret raiz 'scsi_redis_password' declarado com external: true.
  [PASS] Secret raiz 'scsi_rabbitmq_user' declarado com external: true.
  [PASS] Secret raiz 'scsi_rabbitmq_password' declarado com external: true.
  [PASS] Nenhuma senha em texto plano (POSTGRES_PASSWORD).
  [PASS] Nenhuma senha em texto plano (REDIS_PASSWORD).
  [PASS] Nenhuma senha em texto plano (RABBITMQ_DEFAULT_PASS).
  [PASS] Diretiva segura por arquivo 'POSTGRES_PASSWORD_FILE:' presente.
  [PASS] Diretiva segura por arquivo 'POSTGRES_USER_FILE:' presente.
  [PASS] Diretiva segura por arquivo 'POSTGRES_DB_FILE:' presente.
  [PASS] Diretiva segura por arquivo 'RABBITMQ_DEFAULT_PASS_FILE:' presente.
  [PASS] Constraint 'node.labels.scsi_storage == true' aplicada aos 5 serviços persistentes (5 ocorrências).

[3/5] Auditoria de Estrutura do docker-compose.traefik.yml...
  [PASS] Certificados Origin CA declarados como Docker Secrets externos no Traefik.
  [PASS] Traefik operando em mode: host (preservação de IP real da Cloudflare).

[4/5] Auditoria do Leitor de Segredos no Backend (get_secret)...
  [PASS] Função 'get_secret' implementada.
  [PASS] SECRET_KEY: Vinculado ao secret 'scsi_django_secret_key'.
  [PASS] POSTGRES_PASSWORD: Vinculado ao secret 'scsi_postgres_password'.
  [PASS] REDIS_PASSWORD: Vinculado ao secret 'scsi_redis_password'.
  [PASS] RABBITMQ_PASS: Vinculado ao secret 'scsi_rabbitmq_password'.

[5/5] Auditoria de Integridade do Script Bash de Provisionamento...
  [PASS] Inicialização de cluster Swarm verificado no script bash.
  [PASS] Rótulo de nó para persistência governada verificado no script bash.
  [PASS] Criação de rede overlay pública verificado no script bash.
  [PASS] Criação de rede overlay socket interna verificado no script bash.
  [PASS] Provisionamento de certificado Origin CA verificado no script bash.
  [PASS] Provisionamento de senha do Postgres verificado no script bash.
  [PASS] Provisionamento de senha do Redis verificado no script bash.
  [PASS] Provisionamento de senha do RabbitMQ verificado no script bash.
  [PASS] Geração de manifesto de auditoria criptográfica verificado no script bash.

------------------------------------------------------------------
✅ AUDITORIA CONCLUÍDA COM 100% DE SUCESSO! (0 erros)
Sub-etapa 7.1 pronta para homologação pela banca técnica.
```
