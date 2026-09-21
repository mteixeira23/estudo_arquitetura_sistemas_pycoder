# 📐 Documento de Arquitetura: Plataforma de Sistemas Inteligentes (Padrão PycoderBR / SCSI)

---

## 1. Visão Geral da Arquitetura

O sistema é concebido para rodar em arquitetura de **Microsserviços em Containers**, priorizando **baixo custo de infraestrutura**, **isolamento de responsabilidades** e **capacidade de execução de tarefas demoradas e agentes de IA sem travar a interface do usuário**.

Diagrama de referência: docs/arquitetura_deploy_scsi.png

---

## 2. Matriz de Containers e Responsabilidades

| Container / Serviço | Imagem Base Sugerida | Portas Internas | Portas Expostas | Função Primária |
| :--- | :--- | :--- | :--- | :--- |
| **Traefik** | 	raefik:v3.1 | 80, 443, 8080 | 80, 443 (HTTP/S) | Proxy Reverso dinâmico, SSL Let\'s Encrypt e roteamento |
| **Django + Gunicorn**| Custom (python:3.12-slim)| 8000 | Nenhuma (via Traefik)| Aplicação web, ORM, APIs e interface administrativa |
| **PostgreSQL** | postgres:16-alpine | 5432 | Nenhuma (rede interna)| Banco de dados relacional primário com ACID |
| **Redis** | 
edis:7-alpine | 6379 | Nenhuma (rede interna)| Cache em memória, sessões Django e Celery Results |
| **RabbitMQ** | 
abbitmq:3-management| 5672, 15672 | 15672 (opcional p/ admin)| Broker AMQP para mensageria e gestão de filas |
| **Celery Worker** | Custom (mesma do Django) | - | Nenhuma | Processamento assíncrono e execução de tarefas de IA |
| **Celery Beat** | Custom (mesma do Django) | - | Nenhuma | Agendador de tarefas periódicas (*cron* do sistema) |

---

## 3. Fluxos de Comunicação

### 3.1. Fluxo de Requisição Web (HTTP/HTTPS) - Cor Verde no Diagrama
1. O **Usuário** acessa o domínio via navegador (https://meusistema.com.br).
2. A requisição atinge a rede **Cloudflare** (resolução de DNS, WAF e proteção contra DDoS).
3. O Cloudflare encaminha o tráfego criptografado para o **Traefik** na porta 443 da VPS.
4. O Traefik valida o certificado SSL gerado pelo **Let\'s Encrypt** e roteia a requisição para o container **Django + Gunicorn** via rede Docker interna.
5. O Django consulta o **PostgreSQL** para dados persistentes e o **Redis** para dados em cache/sessão, respondendo em milissegundos.

### 3.2. Fluxo de Mensageria e Assincronia (AMQP) - Cor Roxa no Diagrama
1. O usuário solicita uma operação pesada no Django (ex.: emissão de apólice complexa, auditoria de processos ou consulta a LLM).
2. Em vez de travar o request HTTP, o Django publica uma mensagem no **RabbitMQ** através do protocolo AMQP (	ask.delay(...)) e responde imediatamente ao usuário com um ID de tarefa.
3. O **Celery Beat** também publica tarefas no RabbitMQ em horários programados (ex.: varreduras diárias ou relatórios automáticos).

### 3.3. Execução de Tarefas e Agentes de IA - Cor Laranja no Diagrama
1. O **Celery Worker** (que escuta as filas do RabbitMQ) captura a tarefa.
2. O Worker executa a lógica:
   - Se for uma tarefa de IA, invoca o pipeline construído em **LangChain / LangGraph** com chamadas à API da **OpenAI** (ou outros provedores).
   - Consulta ou grava dados diretamente no **PostgreSQL**.
   - Atualiza o status e os dados resultantes no **Redis** (*Celery Results Backend*).
3. O frontend Django (via HTMX, Polling ou WebSockets) lê o resultado da tarefa no Redis e exibe ao usuário.

---

## 4. Pilares de Segurança e Operação

1. **Nenhum banco ou broker exposto à Internet:** Apenas as portas 80 e 443 do Traefik são expostas publicamente. PostgreSQL, Redis, RabbitMQ e Celery comunicam-se exclusivamente através de redes internas seguras do Docker (ridge ou overlay).
2. **Ambiente Dev vs Produção Idênticos:** O desenvolvimento local utiliza a mesma composição de containers, mitigando surpresas em produção.
3. **Escalabilidade Horizontal de Processamento:** Quando o volume de IA ou de tarefas assíncronas cresce, basta escalar réplicas de workers (docker compose up -d --scale celery_worker=4) sem onerar a aplicação web.
