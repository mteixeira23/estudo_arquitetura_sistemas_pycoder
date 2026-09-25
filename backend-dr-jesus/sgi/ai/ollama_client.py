import os
import logging
from typing import List
from langchain_ollama import ChatOllama, OllamaEmbeddings

logger = logging.getLogger(__name__)

OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_LLM_MODEL = os.environ.get("OLLAMA_LLM_MODEL", "llama3.2")
OLLAMA_EMBED_MODEL = os.environ.get("OLLAMA_EMBED_MODEL", "nomic-embed-text")

def get_llm(temperature: float = 0.2, streaming: bool = False) -> ChatOllama:
    """
    Retorna uma instância configurada do ChatOllama (Llama 3.2).
    """
    return ChatOllama(
        model=OLLAMA_LLM_MODEL,
        base_url=OLLAMA_BASE_URL,
        temperature=temperature,
        streaming=streaming,
    )

def get_embeddings_client() -> OllamaEmbeddings:
    """
    Retorna o cliente de embeddings Ollama com o modelo nomic-embed-text (768 dimensões).
    """
    return OllamaEmbeddings(
        model=OLLAMA_EMBED_MODEL,
        base_url=OLLAMA_BASE_URL,
    )

def gerar_embedding_texto(texto: str, is_query: bool = False) -> List[float]:
    """
    Gera o vetor de 768 dimensões para o texto fornecido usando nomic-embed-text.
    Aplica as melhores práticas do modelo com prefixos assimétricos:
    - 'search_query: ' para consultas de busca
    - 'search_document: ' para indexação de documentos
    Possui fallback gracioso para ambiente de desenvolvimento caso o Ollama esteja offline.
    """
    if not texto or not texto.strip():
        return [0.0] * 768

    prefixo = "search_query: " if is_query else "search_document: "
    texto_com_prefixo = texto if texto.startswith(("search_query:", "search_document:")) else f"{prefixo}{texto}"

    try:
        client = get_embeddings_client()
        vetor = client.embed_query(texto_com_prefixo)
        if len(vetor) == 768:
            return vetor
        logger.warning(f"[Ollama] Vetor retornado com dimensão diferente de 768 ({len(vetor)}). Normalizando.")
        return vetor[:768] if len(vetor) > 768 else vetor + [0.0] * (768 - len(vetor))
    except Exception as exc:
        logger.info(f"[Ollama] Daemon local offline ou indisponível ({exc}). Gerando vetor simulado para dev.")
        # Fallback determinístico de 768 dimensões baseado no hash do texto para testes locais
        import hashlib
        h = hashlib.sha256(texto_com_prefixo.encode('utf-8')).digest()
        # Preenche os 768 floats de forma determinística
        pseudo_vetor = [(b / 255.0 - 0.5) for b in (h * 24)[:768]]
        return pseudo_vetor

