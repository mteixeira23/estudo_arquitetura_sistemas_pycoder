# 🏛️ Estudo de Arquitetura de Sistemas Inteligentes (PycoderBR / SCSI)

Este repositório centraliza o **estudo, documentação técnica, blueprints de infraestrutura e padrões de desenvolvimento** para a construção dos nossos sistemas corporativos e inteligentes, baseado no treinamento da **PycoderBR Treinamentos** (Arquitetura de Deploy do **SCSI — Sistema de Gestão de Corretora de Seguros Inteligente**).

---

## 🎯 Objetivo

Estabelecer uma **arquitetura de referência padronizada** em Python/Django, orquestrada em containers Docker (com suporte a Docker Swarm), com separação rigorosa entre:
1. **Camada Web Síncrona:** Django + Gunicorn com alta performance de resposta;
2. **Camada de Borda & Segurança:** Cloudflare (WAF/DDoS) + Traefik (Proxy Reverso dinâmico e SSL automático via Let\'s Encrypt);
3. **Camada de Mensageria e Background Jobs:** RabbitMQ (Broker AMQP robusto) + Celery Worker & Celery Beat;
4. **Camada de Inteligência Artificial:** Integração desacoplada de LLMs, agentes cognitivos e fluxos com **LangChain / LangGraph**;
5. **Camada de Persistência & Cache:** PostgreSQL (transacional / vetorial) + Redis (cache, sessões e retorno de tarefas).

---

## 📁 Estrutura do Diretório de Estudo

`	ext
estudo_arquitetura_sistemas_pycoder/
├── AGENTS.md                  # Definição dos subagentes especialistas no Antigravity
├── ARQUITETURA.md             # Especificação técnica aprofundada de cada container e fluxo
├── MEMORIA.md                 # Registro vivo de decisões de design, configurações e premissas
├── README.md                  # Visão geral e guia de referência rápida
├── docs/                      # Diagramas visuais e especificações complementares
│   └── arquitetura_deploy_scsi.png # Diagrama oficial da arquitetura SCSI (PycoderBR)
├── docker/                    # Templates de containers e orquestração
│   ├── celery/                # Scripts de inicialização do Celery Worker e Beat
│   ├── django/                # Dockerfile multi-stage e entrypoints da aplicação
│   └── traefik/               # Configurações estáticas e dinâmicas do Traefik
└── scripts/                   # Automações de setup, validações locais e scripts de apoio
`

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Função Principal |
| :--- | :--- | :--- |
| **Edge & DNS** | Cloudflare | DNS autoritativo, CDN, WAF, mitigação DDoS e proxy reverso global |
| **SSL/TLS** | Let\'s Encrypt | Emissão e renovação automatizada de certificados HTTPS via ACME |
| **Ingress Proxy** | Traefik | Proxy reverso dinâmico com auto-discovery por labels do Docker |
| **Backend Core** | Django + Gunicorn | Framework web, ORM, regras de negócio e servidor WSGI de produção |
| **Mensageria** | RabbitMQ | Message Broker AMQP para gerenciamento confiável de filas |
| **Workers** | Celery Worker & Beat | Processamento assíncrono e agendador de tarefas periódicas |
| **Cache & Sessions**| Redis | Armazenamento chave-valor de alta velocidade e Celery Result Backend |
| **Banco de Dados** | PostgreSQL | SGBD relacional transacional ACID (suporta pgvector para embeddings) |
| **Inteligência Artificial** | LangChain / LangGraph | Orquestração de agentes autônomos e grafos de decisão |
| **DevOps / Deploy** | Git, GitHub Actions, Docker | CI/CD automatizado para VPS Ubuntu Linux |

---

## 🚀 Como Utilizar este Espaço no Antigravity

1. **Consulta da Arquitetura:** Leia o documento ARQUITETURA.md para entender as responsabilidades e fluxos entre containers.
2. **Registro de Decisões:** Consulte e alimente a MEMORIA.md para manter registradas as escolhas do time.
3. **Agentes Especialistas:** Verifique o AGENTS.md para acionar papéis focados (DevOps, Django, Celery e IA).
