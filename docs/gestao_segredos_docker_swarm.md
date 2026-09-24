# 🔐 Especificação de Gestão de Segredos (Docker Secrets) — SCSI
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 5 — Orquestração de Containers (Docker Swarm)  
**Sub-etapa:** 5.2 — Protocolo de Injeção de Segredos e Variáveis  
**Data de Emissão:** 24/09/2026  

---

## 1. O Vetor de Risco e a Proibição do `.env` Comum

Na maioria dos setups básicos de Docker, variáveis sensíveis são passadas através do bloco `environment:` no *docker-compose.yml* ou carregadas de um arquivo `.env` para dentro do container.

**Por que isso é proibido na arquitetura SCSI?**
Qualquer variável injetada via `environment` pode ser lida em texto plano executando `docker inspect <container_id>`. Se um atacante conseguir acesso mínimo de leitura ao host ou se o log do sistema vazar, todas as chaves (Bancos de Dados, OpenAI, AWS) estarão comprometidas.

---

## 2. O Padrão Adotado: Docker Swarm Secrets

Para contornar essa vulnerabilidade, o projeto adotará **exclusivamente** o uso de `Docker Secrets` para qualquer dado sensível.

**Como funciona a blindagem?**
1. **Em Repouso (Criptografado):** O segredo é salvo nos *Manager Nodes* do Swarm de forma criptografada (dentro do log de consenso Raft).
2. **Em Movimento (TLS):** O segredo viaja do *Manager* para o *Worker* usando túnel TLS mútuo (mTLS).
3. **Em Execução (Memória RAM):** O segredo não é salvo no disco do container. Ele é montado como um arquivo de texto num sistema de arquivos na memória (`tmpfs`), estritamente no caminho `/run/secrets/nome_do_segredo`.

---

## 3. Matriz de Segredos SCSI

Para o setup inicial da infraestrutura, os seguintes segredos serão aprovisionados via CLI no servidor antes da implantação das *stacks*:

| Nome do Segredo (Swarm) | Componente Destino | Propósito |
| :--- | :--- | :--- |
| `scsi_origin_crt` | Traefik | Chave Pública (Certificado Cloudflare) |
| `scsi_origin_key` | Traefik | Chave Privada (Certificado Cloudflare) |
| `scsi_db_password` | PostgreSQL / Django | Senha forte do Banco de Dados Relacional |
| `scsi_django_secret` | Django API | `SECRET_KEY` criptográfica do Django |
| `scsi_openai_key` | Celery Workers | Chave de API da OpenAI para LangGraph |

**Comando de Criação (Exemplo):**
```bash
# Lendo de um arquivo seguro local
docker secret create scsi_db_password /caminho/seguro/senha_db.txt

# Passando via pipeline (evita histórico no bash)
echo "sk-proj-xxxxx..." | docker secret create scsi_openai_key -
```

---

## 4. Implementação Declarativa (Compose)

Para que os containers consumam os segredos, os arquivos `docker-compose.yml` da Fase 6 e 7 seguirão estritamente este formato de leitura por arquivo:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      # POSTGRES_PASSWORD_FILE avisa a imagem para ler a senha de dentro do arquivo
      POSTGRES_PASSWORD_FILE: /run/secrets/scsi_db_password
    secrets:
      - scsi_db_password

  django_api:
    image: scsi_django:latest
    environment:
      # O backend Python deve ser programado para buscar valores nos arquivos
      DB_PASSWORD_FILE: /run/secrets/scsi_db_password
    secrets:
      - scsi_db_password

secrets:
  # Declara que os segredos já foram criados no cluster externamente
  scsi_db_password:
    external: true
```

---

## 5. Protocolo de Rotação (Imutabilidade)

Segredos no Docker Swarm são **imutáveis**. Eles não podem ser editados após a criação.

Se uma senha do banco ou chave de API for comprometida (ou chegar o momento de rotação trimestral), a equipe de operações deve seguir o **Protocolo V-Suffix**:
1. Criar o novo segredo com um sufixo de versão (`docker secret create scsi_db_password_v2 -`).
2. Atualizar o `docker-compose.yml` para apontar o secret base para a `_v2`.
3. Executar o `docker stack deploy`. O Swarm irá reiniciar os containers um a um (Rolling Update) injetando o novo segredo na RAM, sem tempo de inatividade.
4. Remover o segredo antigo (`docker secret rm scsi_db_password_v1`).
