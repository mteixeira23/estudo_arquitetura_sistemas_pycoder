import os
import mimetypes
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from .models import (
    Paciente, 
    Prontuario, 
    EstoqueItem, 
    MovimentacaoEstoque, 
    Doacao, 
    DocumentoAnexo
)
from .serializers import (
    PacienteSerializer, 
    ProntuarioSerializer, 
    EstoqueItemSerializer, 
    MovimentacaoEstoqueSerializer, 
    DoacaoSerializer, 
    DocumentoAnexoSerializer
)
from .events import broadcast_realtime_event

# --- Auth View com Cookies HttpOnly ---

class CookieTokenRefreshView(TokenRefreshView):
    """
    View customizada para ler o Refresh Token de um Cookie HttpOnly
    e injetá-lo no payload esperado pelo SimpleJWT.
    """
    def post(self, request, *args, **kwargs):
        data = request.data.copy() if hasattr(request.data, 'copy') else {}
        refresh_token = request.COOKIES.get('refresh_token')
        
        if refresh_token:
            data['refresh'] = refresh_token

        serializer = self.get_serializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

# --- ViewSet Base RLS (Segurança e Realtime Automatizados) ---

class BaseRLSModelViewSet(viewsets.ModelViewSet):
    """
    ViewSet base corporativo SCSI:
    1. RLS Fail-Closed: filtra o queryset chamando .for_user(request.user).
    2. Injeção de Owner: preenche owner=request.user na criação.
    3. Broadcast Realtime: notifica canais WebSocket (INSERT, UPDATE, DELETE)
       de forma assíncrona e segura via transaction.on_commit.
    """
    permission_classes = [permissions.IsAuthenticated]
    realtime_table_name = None
    realtime_topic = None

    def get_queryset(self):
        # Acesso seguro via manager do modelo
        return self.queryset.model.objects.for_user(self.request.user)

    def perform_create(self, serializer):
        instance = serializer.save(owner=self.request.user)
        if self.realtime_table_name:
            broadcast_realtime_event(
                event_type="INSERT",
                table=self.realtime_table_name,
                record=serializer.data,
                topic=self.realtime_topic
            )

    def perform_update(self, serializer):
        instance = serializer.save()
        if self.realtime_table_name:
            broadcast_realtime_event(
                event_type="UPDATE",
                table=self.realtime_table_name,
                record=serializer.data,
                topic=self.realtime_topic
            )

    def perform_destroy(self, instance):
        instance_id = str(instance.id)
        instance.delete()
        if self.realtime_table_name:
            broadcast_realtime_event(
                event_type="DELETE",
                table=self.realtime_table_name,
                record={"id": instance_id},
                topic=self.realtime_topic
            )

# --- Módulos Cadastrais / Clínicos ---

class PacienteViewSet(BaseRLSModelViewSet):
    queryset = Paciente.objects.none()  # Placeholder; get_queryset usa .for_user
    serializer_class = PacienteSerializer
    realtime_table_name = "pacientes"
    realtime_topic = "pacientes"

    def get_queryset(self):
        return Paciente.objects.for_user(self.request.user)

class ProntuarioViewSet(BaseRLSModelViewSet):
    queryset = Prontuario.objects.none()
    serializer_class = ProntuarioSerializer
    realtime_table_name = "prontuarios"
    realtime_topic = "prontuarios"

    def get_queryset(self):
        return Prontuario.objects.for_user(self.request.user)

# --- Módulos Almoxarifado / Estoque / Doações ---

class EstoqueItemViewSet(BaseRLSModelViewSet):
    queryset = EstoqueItem.objects.none()
    serializer_class = EstoqueItemSerializer
    realtime_table_name = "estoque"
    realtime_topic = "almoxarifado"

    def get_queryset(self):
        return EstoqueItem.objects.for_user(self.request.user)

class MovimentacaoEstoqueViewSet(BaseRLSModelViewSet):
    queryset = MovimentacaoEstoque.objects.none()
    serializer_class = MovimentacaoEstoqueSerializer
    realtime_table_name = "movimentacoes"
    realtime_topic = "almoxarifado"

    def get_queryset(self):
        return MovimentacaoEstoque.objects.for_user(self.request.user)

class DoacaoViewSet(BaseRLSModelViewSet):
    queryset = Doacao.objects.none()
    serializer_class = DoacaoSerializer
    realtime_table_name = "doacoes"
    realtime_topic = "almoxarifado"

    def get_queryset(self):
        return Doacao.objects.for_user(self.request.user)

# --- Storage Soberano de Arquivos ---

class DocumentoAnexoViewSet(BaseRLSModelViewSet):
    """
    Substituto Soberano do Supabase Storage.
    Suporta upload de arquivos multipart com validação de extensão e MIME type.
    """
    queryset = DocumentoAnexo.objects.none()
    serializer_class = DocumentoAnexoSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    realtime_table_name = "documentos"
    realtime_topic = "documentos"

    def get_queryset(self):
        return DocumentoAnexo.objects.for_user(self.request.user)

    def perform_create(self, serializer):
        import hashlib
        arquivo = self.request.FILES.get('arquivo')
        tamanho = arquivo.size if arquivo else 0
        mime = None
        sha256_hash = None

        if arquivo:
            mime, _ = mimetypes.guess_type(arquivo.name)
            # Calcula SHA-256 para rastreabilidade e evitar reprocessamento em IA
            hasher = hashlib.sha256()
            for chunk in arquivo.chunks():
                hasher.update(chunk)
            sha256_hash = hasher.hexdigest()

        instance = serializer.save(
            owner=self.request.user,
            tamanho_bytes=tamanho,
            mime_type=mime or "application/octet-stream",
            hash_sha256=sha256_hash
        )

        # Dispara processamento cognitivo assíncrono via Celery (Fila ia_tasks) pós-commit
        from django.db import transaction
        from .tasks_ia import processar_documento_anexo_task
        doc_id = str(instance.id)
        transaction.on_commit(lambda: processar_documento_anexo_task.delay(doc_id))

# --- Módulos de Inteligência Artificial Soberana (LangGraph + Ollama + Streaming) ---
from .views_ia import (
    PerguntarProntuarioIAView,
    ProntuarioStreamIAView,
    ChatGeralStreamIAView
)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import connection
from django.core.cache import cache
import time
import logging
logger = logging.getLogger(__name__)


class HealthCheckView(APIView):
    """
    Endpoint de monitoramento de saúde do cluster Docker Swarm e Traefik.
    Retorna 200 OK quando o Django e suas dependências vitais estão saudáveis.
    Sanitizado contra Information Disclosure (Veredicto Arquiteto SCSI).
    """
    permission_classes = [AllowAny]

    def get(self, request):
        status_data = {
            "status": "healthy",
            "service": "backend-dr-jesus",
            "timestamp": time.time(),
            "checks": {}
        }
        all_ok = True

        # 1. Checagem do Banco de Dados PostgreSQL
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1;")
                cursor.fetchone()
            status_data["checks"]["database"] = "ok"
        except Exception as e:
            logger.error("Falha no healthcheck do banco de dados: %s", e)
            status_data["checks"]["database"] = "unhealthy"
            all_ok = False

        # 2. Checagem do Cache / Redis (Degradação graciosa fail-soft)
        try:
            cache.set("health_check_probe", "1", timeout=5)
            if cache.get("health_check_probe") == "1":
                status_data["checks"]["cache"] = "ok"
            else:
                status_data["checks"]["cache"] = "degraded"
        except Exception as e:
            logger.warning("Falha transitória no healthcheck do cache: %s", e)
            status_data["checks"]["cache"] = "degraded"

        status_code = 200 if all_ok else 503
        if not all_ok:
            status_data["status"] = "unhealthy"

        return Response(status_data, status=status_code)



