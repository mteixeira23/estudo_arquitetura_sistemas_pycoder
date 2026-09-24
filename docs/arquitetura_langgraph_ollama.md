# 🧠 IA Cognitiva & Soberania: Ollama + LangGraph
**Projeto:** Estudo de Arquitetura de Sistemas Inteligentes (Padrão PycoderBR / SCSI)  
**Módulo:** Fase 7 — Mensageria Assíncrona & IA Cognitiva  
**Sub-etapa:** 7.4 (Passo 15) — Inteligência Artificial Local e Orquestração  
**Data de Emissão:** 24/09/2026  

---

## 1. O Paradigma da Soberania de Dados (Zero-Leak)

Ao adotarmos o **Ollama** internamente na VPS em vez de APIs de terceiros (como OpenAI ou Anthropic), o projeto atinge o grau máximo de privacidade e soberania (Compliance/LGPD absoluto). 

**Nenhum dado sensível (PII), documento processado via RAG ou histórico de conversas sai da máquina Hostinger.** Todo o processamento semântico (cálculo de embeddings) e a geração de texto são resolvidos nativamente na CPU da própria VPS. E graças à arquitetura assíncrona (RabbitMQ + Celery), a latência do processamento via CPU não afeta a navegação e a experiência do usuário web.

## 2. O Motor de Inferência: Blueprint do Ollama no Swarm

Para abrigar o Ollama sem ameaçar a estabilidade do PostgreSQL e do Django, ele será provisionado como um serviço autônomo com rédeas curtas de memória (Memory Fencing).

```yaml
services:
  ollama:
    image: ollama/ollama:latest
    networks:
      - scsi_internal
    environment:
      - OLLAMA_KEEP_ALIVE=60s   # Força o descarregamento da RAM após 1 minuto de ócio (Vital para a VPS)
    volumes:
      - scsi_ollama_data:/root/.ollama
    deploy:
      replicas: 1
      placement:
        constraints: [node.labels.ai_node == "true"]
      resources:
        limits:
          cpus: '4.0'
          memory: 4096M     # Teto rígido de 4GB (Seguro para VPS de 8GB)
        reservations:
          cpus: '1.0'
          memory: 2048M     # Reserva mínima para rodar LLMs de 3 Bilhões de parâmetros

volumes:
  scsi_ollama_data:
    driver: local
```

*Nota de Implantação:* O volume `/root/.ollama` garante que, se o container reiniciar, os arquivos `.gguf` não precisem ser baixados novamente. **Cuidado:** Como amarramos o container à constraint `ai_node`, o operador deve obrigatoriamente rodar o comando `docker node update --label-add ai_node=true <ID_DO_NODE>` via CLI, caso contrário o Ollama ficará preso no status *Pending*. A porta 11434 não foi exposta intencionalmente.

## 3. O Orquestrador Cognitivo: LangGraph no Celery

O fluxo de pensamento da IA será modelado como um Grafo de Estado (State Graph) utilizando a biblioteca **LangGraph**. Esse grafo roda dentro da memória do nosso **Celery Worker** (Passo 13).

A topologia de requisição ocorre na seguinte ordem:
1. O Celery Worker consome o payload do RabbitMQ.
2. O Worker inicializa o grafo do LangGraph.
3. Se for necessário RAG, o LangGraph solicita a busca de similaridade (Vector Search) ao **PostgreSQL (`pgvector`)**.
4. O LangGraph empacota os documentos + histórico + prompt e faz uma chamada HTTP REST interna para o serviço `ollama:11434`.
5. O Ollama processa (via CPU), devolve a resposta final ao Celery.
6. O Celery Worker grava a resposta no Redis (Result Backend) ou no próprio PostgreSQL para exibição ao usuário final.

### Setup de Conexão (Pseudo-código Python / LangChain)
Para instruir o código a usar nosso cluster local:

```python
from langchain_community.chat_models import ChatOllama
from langchain_community.embeddings import OllamaEmbeddings

# LLM Conversacional Local
llm = ChatOllama(
    base_url="http://ollama:11434",
    model="llama3.2" # Modelo leve e hiper-otimizado (3B)
)

# Motor de Vetorização Local (Embeddings para o pgvector)
embeddings = OllamaEmbeddings(
    base_url="http://ollama:11434",
    model="nomic-embed-text"
)
```

## 4. Estratégia de Modelos (Stack Recomendada)
Para operar com ampla segurança e extrema velocidade no novo limite de 4GB de RAM da VPS, faremos o pull restrito de modelos sub-4B hiper-otimizados (Quantização 4-bit):
- **Geração de Texto (Inferência Rápida via CPU):** **`llama3.2`** (3 Bilhões de parâmetros) ou **`qwen2.5:3b`**. Eles consomem apenas ~2GB de RAM, deixando os outros 2GB do container inteiramente livres para o KV Cache (janelas de contexto longo do RAG), garantindo que o Swarm não sofra *OOM Kill*.
- **Vetorização (Embeddings):** **`nomic-embed-text`** (Modelo minúsculo de ~275MB especializado em semântica de RAG, produz matrizes perfeitas para buscas vetoriais).
