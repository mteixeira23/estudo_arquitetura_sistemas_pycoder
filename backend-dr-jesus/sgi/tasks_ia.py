import logging
from celery import shared_task
from django.utils import timezone
from .models import DocumentoAnexo, ProntuarioChunk
from .events import broadcast_realtime_event

logger = logging.getLogger(__name__)

@shared_task(
    name="sgi.tasks_ia.processar_documento_anexo_task", 
    bind=True, 
    max_retries=3,
    acks_late=True,
    reject_on_worker_lost=True
)
def processar_documento_anexo_task(self, documento_id: str):
    """
    Task de IA assíncrona (Fila 'ia_tasks'):
    1. Marca o DocumentoAnexo como PROCESSANDO e notifica o frontend via WebSocket.
    2. Extrai o texto do documento (OCR / Parser de PDF).
    3. Se vinculado a um prontuário, gera o ProntuarioChunk para busca vetorial RAG.
    4. Marca como CONCLUIDO e despacha evento de conclusão em tempo real.
    """
    logger.info(f"[Celery IA] Iniciando processamento do documento: {documento_id}")

    try:
        doc = DocumentoAnexo.objects.get(id=documento_id)
        
        # 1. Atualiza status para PROCESSANDO
        doc.status_processamento_ia = DocumentoAnexo.StatusProcessamentoIA.PROCESSANDO
        doc.save(update_fields=['status_processamento_ia', 'updated_at'])

        broadcast_realtime_event(
            event_type="UPDATE",
            table="documentos",
            record={
                "id": str(doc.id),
                "status_processamento_ia": doc.status_processamento_ia,
                "titulo": doc.titulo
            },
            topic="documentos"
        )

        # 2. Extração de texto (Base para o LangGraph/Ollama na Fase 4.2)
        # Mock de extração resiliente inicial para validar a esteira assíncrona
        nome_arquivo = doc.arquivo.name if doc.arquivo else "desconhecido"
        texto_extraido = (
            f"[Texto Extraído do Anexo '{doc.titulo}']\n"
            f"Arquivo: {nome_arquivo} | Tipo: {doc.tipo_documento}\n"
            f"Data de Ingestão: {timezone.now().isoformat()}\n"
            f"Conteúdo clínico estruturado para análise do acolhimento."
        )

        doc.texto_extraido = texto_extraido
        doc.status_processamento_ia = DocumentoAnexo.StatusProcessamentoIA.CONCLUIDO
        doc.processado_em = timezone.now()
        doc.save(update_fields=['texto_extraido', 'status_processamento_ia', 'processado_em', 'updated_at'])

        # 3. Se vinculado a um prontuário, cria o chunk inicial para busca semântica
        if doc.prontuario:
            ProntuarioChunk.objects.create(
                owner=doc.owner,
                prontuario=doc.prontuario,
                documento_anexo=doc,
                texto_chunk=texto_extraido[:500]  # Primeiro chunk representativo
            )

        # 4. Emite evento de conclusão em tempo real para o frontend
        broadcast_realtime_event(
            event_type="UPDATE",
            table="documentos",
            record={
                "id": str(doc.id),
                "status_processamento_ia": doc.status_processamento_ia,
                "processado_em": doc.processado_em.isoformat()
            },
            topic="documentos"
        )

        logger.info(f"[Celery IA] Documento {documento_id} processado com sucesso.")
        return {"status": "concluido", "documento_id": str(documento_id)}

    except DocumentoAnexo.DoesNotExist:
        logger.error(f"[Celery IA] Documento {documento_id} não encontrado.")
        return {"status": "erro", "motivo": "nao_encontrado"}
    except Exception as exc:
        logger.exception(f"[Celery IA] Erro ao processar documento {documento_id}: {exc}")
        try:
            doc = DocumentoAnexo.objects.get(id=documento_id)
            doc.status_processamento_ia = DocumentoAnexo.StatusProcessamentoIA.ERRO
            doc.erro_processamento = str(exc)
            doc.save(update_fields=['status_processamento_ia', 'erro_processamento', 'updated_at'])
            
            broadcast_realtime_event(
                event_type="UPDATE",
                table="documentos",
                record={
                    "id": str(doc.id),
                    "status_processamento_ia": doc.status_processamento_ia,
                    "erro": str(exc)
                },
                topic="documentos"
            )
        except Exception:
            pass
        raise self.retry(exc=exc, countdown=10)

@shared_task(
    name="sgi.tasks_ia.executar_rag_prontuario_task",
    bind=True,
    max_retries=2,
    acks_late=True,
    reject_on_worker_lost=True
)
def executar_rag_prontuario_task(self, prontuario_id: str, pergunta: str):
    """
    Task de IA assíncrona (Fila 'ia_tasks'):
    Executa o StateGraph compilado do LangGraph com RAG sobre o histórico do acolhido.
    """
    logger.info(f"[Celery IA] Executando LangGraph RAG para Prontuário {prontuario_id} - Pergunta: '{pergunta}'")

    # Notifica o início do processamento cognitivo via WebSocket
    broadcast_realtime_event(
        event_type="IA_STATUS",
        table="prontuarios",
        record={
            "prontuario_id": prontuario_id,
            "status": "PROCESSANDO_RAG",
            "mensagem": "Recuperando contexto clínico e sintetizando resposta..."
        },
        topic="prontuarios"
    )

    try:
        from .ai.graph import grafo_rag_clinico

        estado_inicial = {
            "prontuario_id": prontuario_id,
            "pergunta": pergunta,
            "chunks_encontrados": [],
            "contexto_clinico": "",
            "resposta_sintetizada": "",
            "fontes_citadas": [],
            "alerta_seguranca": False
        }

        # Invoca o grafo cognitivo
        resultado = grafo_rag_clinico.invoke(estado_inicial)

        resposta_final = resultado.get("resposta_sintetizada", "")
        fontes = resultado.get("fontes_citadas", [])

        # Notifica o término com a resposta pronta via WebSocket
        broadcast_realtime_event(
            event_type="IA_RESPOSTA",
            table="prontuarios",
            record={
                "prontuario_id": prontuario_id,
                "status": "CONCLUIDO",
                "resposta": resposta_final,
                "fontes": fontes
            },
            topic="prontuarios"
        )

        return {
            "status": "concluido",
            "prontuario_id": prontuario_id,
            "resposta": resposta_final,
            "fontes": fontes
        }

    except Exception as exc:
        logger.exception(f"[Celery IA] Erro ao executar LangGraph: {exc}")
        broadcast_realtime_event(
            event_type="IA_STATUS",
            table="prontuarios",
            record={
                "prontuario_id": prontuario_id,
                "status": "ERRO",
                "mensagem": f"Falha na inferência de IA: {str(exc)}"
            },
            topic="prontuarios"
        )
        raise self.retry(exc=exc, countdown=15)

