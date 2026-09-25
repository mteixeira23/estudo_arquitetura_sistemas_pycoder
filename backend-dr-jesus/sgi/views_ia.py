import logging
from django.http import StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response

from .models import Prontuario
from .ai.streaming import gerar_stream_prontuario, gerar_stream_chat_geral
from .tasks_ia import executar_rag_prontuario_task

logger = logging.getLogger(__name__)

class PerguntarProntuarioIAView(APIView):
    """
    Aciona o pipeline RAG do LangGraph sobre o histórico do acolhido.
    A execução ocorre de forma 100% não-bloqueante no Celery (Fila 'ia_tasks').
    O progresso e o resultado são empurrados ao frontend via WebSocket.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, prontuario_id, *args, **kwargs):
        pergunta = request.data.get("pergunta")
        if not pergunta or not pergunta.strip():
            return Response(
                {"erro": "O campo 'pergunta' é obrigatório."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validação de segurança RLS: garante que o usuário tem permissão sobre o prontuário
        try:
            prontuario = Prontuario.objects.for_user(request.user).get(id=prontuario_id)
        except Prontuario.DoesNotExist:
            return Response(
                {"erro": "Prontuário não encontrado ou acesso não autorizado."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Agenda a tarefa no Celery pós-commit
        task = executar_rag_prontuario_task.delay(str(prontuario.id), pergunta.strip())

        return Response({
            "status": "processando",
            "task_id": task.id,
            "prontuario_id": str(prontuario.id),
            "mensagem": "Pipeline de IA iniciado em background. A resposta será enviada em tempo real via WebSocket."
        }, status=status.HTTP_202_ACCEPTED)


class ProntuarioStreamIAView(APIView):
    """
    Endpoint de Streaming em tempo real (token a token) conectado ao aiStream.js.
    Utiliza StreamingHttpResponse com content_type text/plain e cabeçalhos
    anti-buffer (X-Accel-Buffering: no) para suportar Nginx e Traefik sem latência.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, prontuario_id, *args, **kwargs):
        pergunta = request.data.get("pergunta") or request.data.get("prompt")
        if not pergunta or not str(pergunta).strip():
            return Response(
                {"erro": "O campo 'pergunta' ou 'prompt' é obrigatório."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validação RLS
        try:
            prontuario = Prontuario.objects.for_user(request.user).get(id=prontuario_id)
        except Prontuario.DoesNotExist:
            return Response(
                {"erro": "Prontuário não encontrado ou acesso não autorizado."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        logger.info(f"[IA Streaming] Usuário {request.user} iniciou stream para prontuário {prontuario.id}")
        gerador = gerar_stream_prontuario(
            prontuario_id=str(prontuario.id),
            pergunta=str(pergunta).strip(),
            usuario=request.user
        )

        response = StreamingHttpResponse(gerador, content_type="text/plain; charset=utf-8")
        # Diretivas para evitar que o Nginx/Traefik engula os chunks em buffer
        response["Cache-Control"] = "no-cache, no-transform"
        response["X-Accel-Buffering"] = "no"
        return response


class ChatGeralStreamIAView(APIView):
    """
    Endpoint de Streaming em tempo real para chat clínico geral ou dúvidas institucionais.
    Conectado ao aiStream.js do frontend.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        prompt = request.data.get("prompt") or request.data.get("mensagem")
        if not prompt or not str(prompt).strip():
            return Response(
                {"erro": "O campo 'prompt' ou 'mensagem' é obrigatório."},
                status=status.HTTP_400_BAD_REQUEST
            )

        logger.info(f"[IA Streaming] Usuário {request.user} iniciou chat geral com a IA")
        gerador = gerar_stream_chat_geral(prompt=str(prompt).strip(), usuario=request.user)

        response = StreamingHttpResponse(gerador, content_type="text/plain; charset=utf-8")
        response["Cache-Control"] = "no-cache, no-transform"
        response["X-Accel-Buffering"] = "no"
        return response
