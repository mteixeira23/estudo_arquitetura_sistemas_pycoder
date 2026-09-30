import logging
from django.http import StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
import os

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

        # Rastreabilidade LGPD / CFM: auditoria forense da consulta cognitiva assíncrona
        from .models import AuditLog
        AuditLog.registrar(
            usuario=request.user,
            acao=AuditLog.AcaoChoices.IA_QUERY,
            recurso="Prontuario",
            recurso_id=str(prontuario.id),
            detalhes={"tipo": "async_task", "pergunta": pergunta.strip()[:200]},
            request=request
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

        # Rastreabilidade LGPD / CFM: auditoria forense da consulta cognitiva streaming
        from .models import AuditLog
        AuditLog.registrar(
            usuario=request.user,
            acao=AuditLog.AcaoChoices.IA_QUERY,
            recurso="Prontuario",
            recurso_id=str(prontuario.id),
            detalhes={"tipo": "streaming_sse", "pergunta": str(pergunta).strip()[:200]},
            request=request
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
        # Rastreabilidade LGPD: auditoria da consulta de chat geral
        from .models import AuditLog
        AuditLog.registrar(
            usuario=request.user,
            acao=AuditLog.AcaoChoices.IA_QUERY,
            recurso="ChatGeral",
            detalhes={"tipo": "streaming_chat_geral", "prompt": str(prompt).strip()[:200]},
            request=request
        )

        gerador = gerar_stream_chat_geral(prompt=str(prompt).strip(), usuario=request.user)

        response = StreamingHttpResponse(gerador, content_type="text/plain; charset=utf-8")
        response["Cache-Control"] = "no-cache, no-transform"
        response["X-Accel-Buffering"] = "no"
        return response


class HermesSREDiagnosticView(APIView):
    """
    Endpoint Cognitivo do Maestro SRE (Hermes Agent / Nous Research).
    Permite acionar diagnósticos em linguagem natural e receber laudos estruturados
    com base no Tool Calling dos 10 guardiões de container.
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, *args, **kwargs):
        comando = request.data.get("comando", "Auditoria geral do ecossistema")
        modo = request.data.get("modo", "auto")

        logger.info(f"[Hermes SRE API] Operador {request.user} solicitou diagnóstico: '{comando}' (modo: {modo})")

        from .ai.hermes_sre import executar_diagnostico_hermes
        resultado = executar_diagnostico_hermes(
            comando=str(comando).strip(),
            modo=modo,
            user=request.user,
            request=request
        )

        return Response(resultado, status=status.HTTP_200_OK)


class CaravanaDossieView(APIView):
    """
    Endpoint para geração e visualização do Dossiê Executivo Consolidado
    da Caravana de Direitos Humanos SJDH Bahia sob gestão do Hermes Agent.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        ano_str = request.query_params.get("ano")
        ano = int(ano_str) if ano_str and ano_str.isdigit() else None
        mes = request.query_params.get("mes")
        formato = request.query_params.get("format", "json")

        from .ai.caravana_tools import export_dossie_executivo_pdf
        resultado = export_dossie_executivo_pdf(filtro={"ano": ano, "mes": mes})

        if formato == "html":
            caminho = resultado.get("caminho_local")
            if caminho and os.path.exists(caminho):
                with open(caminho, "r", encoding="utf-8") as f:
                    from django.http import HttpResponse
                    return HttpResponse(f.read(), content_type="text/html; charset=utf-8")

        return Response(resultado, status=status.HTTP_200_OK)

