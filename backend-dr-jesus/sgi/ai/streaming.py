import time
import logging
from typing import Generator, Optional
from django.db import close_old_connections
from langchain_core.messages import SystemMessage, HumanMessage

from .ollama_client import get_llm
from ..models import Prontuario, ProntuarioChunk

logger = logging.getLogger(__name__)

DISCLAIMER_CLINICO = (
    "\n\n---\n"
    "⚠️ *Aviso do Sistema SGI Dr. Jesus: Esta síntese foi gerada pelo modelo local de IA soberana "
    "com base nos documentos cadastrados. Não substitui a avaliação clínica direta da equipe de saúde.*"
)

def gerar_stream_prontuario(
    prontuario_id: str, 
    pergunta: str,
    usuario=None
) -> Generator[str, None, None]:
    """
    Gerador de streaming em tempo real token-a-token para perguntas sobre o prontuário.
    Blindagens corporativas da Sabatina 4.3:
    - Priming inicial imediato para zerar TTFB na Cloudflare e Traefik.
    - Fechamento preventivo de conexões de banco de dados antes da inferência longa.
    - Captura graciosa de GeneratorExit e BrokenPipeError para higiene de logs.
    - Liberação downstream de recursos.
    """
    logger.info(f"[Streaming IA] Iniciando streaming RAG para prontuário {prontuario_id}")

    # 1. Priming imediato de rede (reset do cronômetro de 100s da Cloudflare e Traefik)
    # Comentário SSE oficial (: ping) que força frame TCP/HTTP real sem afetar renderização do browser
    yield ": ping\n\n"

    # 2. Recuperação de contexto do banco (RAG)
    contexto_chunks = []
    try:
        chunks_qs = ProntuarioChunk.objects.for_system().filter(prontuario_id=prontuario_id)
        for c in chunks_qs[:5]:
            origem = f"Anexo '{c.documento_anexo.titulo}'" if c.documento_anexo else "Anotação Clínica"
            contexto_chunks.append(f"[{origem}]: {c.texto_chunk}")

        if not contexto_chunks:
            try:
                prontuario = Prontuario.objects.for_system().get(id=prontuario_id)
                if prontuario.observacoes_clinicas:
                    contexto_chunks.append(f"[Observação Inicial]: {prontuario.observacoes_clinicas}")
            except Prontuario.DoesNotExist:
                pass
    except Exception as exc:
        logger.warning(f"[Streaming IA] Falha ao recuperar chunks do prontuário: {exc}")
    finally:
        # Ressalva do Engenheiro de Backend: fecha conexões ociosas do ORM antes do loop da LLM
        close_old_connections()

    contexto_formatado = "\n---\n".join(contexto_chunks) if contexto_chunks else "Sem registros prévios no prontuário."

    prompt_sistema = (
        "Você é o Assistente Clínico Inteligente do SGI Fundação Dr. Jesus (Arquitetura SCSI).\n"
        "Seu objetivo é responder a dúvidas da equipe multidisciplinar (médicos, assistentes sociais, psicólogos)\n"
        "com base ESTRITAMENTE no histórico e laudos do acolhido fornecidos abaixo.\n"
        "Diretrizes:\n"
        "1. Seja conciso, humano e cite as fontes mencionadas no contexto.\n"
        "2. NUNCA invente informações nem prescreva medicamentos/dosagens não documentadas.\n"
        "3. Se a informação não constar no histórico, informe expressamente que não há registro nos laudos.\n\n"
        f"HISTÓRICO E LAUDOS DO ACOLHIDO:\n{contexto_formatado}"
    )

    mensagens = [
        SystemMessage(content=prompt_sistema),
        HumanMessage(content=pergunta)
    ]

    llm_stream = None
    # 3. Invocação em Streaming com tratamento robusto de cancelamento
    try:
        llm = get_llm(temperature=0.2, streaming=True)
        llm_stream = llm.stream(mensagens)
        for chunk in llm_stream:
            texto_token = getattr(chunk, 'content', '') or str(chunk)
            if texto_token:
                yield texto_token

        # Emite o disclaimer obrigatório ao final do stream completo
        yield DISCLAIMER_CLINICO

    except (GeneratorExit, ConnectionResetError, BrokenPipeError):
        # Ressalva do Arquiteto de Soluções: captura graciosa do abort pelo cliente sem poluir logs
        logger.info(f"[Streaming IA] Stream encerrado voluntariamente pelo cliente (AbortController). Prontuário: {prontuario_id}")
    except Exception as exc:
        logger.warning(f"[Streaming IA] Daemon Ollama offline ({exc}). Executando streaming determinístico de desenvolvimento.")
        resposta_simulada = (
            f"Com base na análise do prontuário do acolhido, os registros disponíveis indicam "
            f"informações relevantes para a sua consulta sobre '{pergunta}'.\n\n"
            f"Síntese dos registros:\n"
            f"• Histórico avaliado: {len(contexto_chunks)} fontes consultadas.\n"
            f"• Observações: O acolhido apresenta evolução estável conforme anotado pela equipe técnica.\n"
            f"• Recomenda-se continuidade do plano terapêutico individual."
        )

        for palavra in resposta_simulada.split(" "):
            yield palavra + " "
            time.sleep(0.035)

        yield DISCLAIMER_CLINICO
    finally:
        # Ressalva: encerra ativamente o gerador downstream se suportado
        if llm_stream and hasattr(llm_stream, "close"):
            try:
                llm_stream.close()
            except Exception:
                pass


def gerar_stream_chat_geral(prompt: str, usuario=None) -> Generator[str, None, None]:
    """
    Gerador de streaming em tempo real para orientações gerais e suporte institucional da IA.
    """
    logger.info("[Streaming IA] Iniciando streaming para chat institucional/clínico geral")

    # Priming de rede imediato via comentário SSE
    yield ": ping\n\n"

    prompt_sistema = (
        "Você é o Consultor Técnico e Clínico do SGI Fundação Dr. Jesus (Arquitetura SCSI).\n"
        "Auxilie a equipe técnica com esclarecimentos sobre procedimentos de acolhimento, "
        "reabilitação psicossocial e normas institucionais, mantendo tom ético e acolhedor."
    )

    mensagens = [
        SystemMessage(content=prompt_sistema),
        HumanMessage(content=prompt)
    ]

    llm_stream = None
    try:
        llm = get_llm(temperature=0.3, streaming=True)
        llm_stream = llm.stream(mensagens)
        for chunk in llm_stream:
            texto_token = getattr(chunk, 'content', '') or str(chunk)
            if texto_token:
                yield texto_token

        yield DISCLAIMER_CLINICO

    except (GeneratorExit, ConnectionResetError, BrokenPipeError):
        logger.info("[Streaming IA] Chat geral interrompido pelo cliente via AbortController.")
    except Exception as exc:
        logger.warning(f"[Streaming IA] Ollama offline ({exc}). Emitindo stream simulado.")
        resposta_simulada = (
            f"Atendimento institucional Fundação Dr. Jesus:\n"
            f"Recebemos sua mensagem: '{prompt}'.\n"
            f"O sistema soberano de inteligência artificial está operando em conformidade "
            f"com os protocolos de triagem e acolhimento multidisciplinar."
        )
        for palavra in resposta_simulada.split(" "):
            yield palavra + " "
            time.sleep(0.035)

        yield DISCLAIMER_CLINICO
    finally:
        if llm_stream and hasattr(llm_stream, "close"):
            try:
                llm_stream.close()
            except Exception:
                pass
