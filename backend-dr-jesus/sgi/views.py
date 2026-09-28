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
    DocumentoAnexo,
    AuditLog
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
        recurso_nome = instance.__class__.__name__
        user = self.request.user if self.request.user.is_authenticated else None

        # Lei Federal nº 13.787/2018: Exclusão lógica (Soft Delete) para cumprimento de guarda de 20 anos
        if hasattr(instance, 'soft_delete'):
            instance.soft_delete(user=user)
        else:
            instance.delete()

        # Trilha de Auditoria Forense LGPD (Art. 6º, X): registra evento de exclusão
        from .models import AuditLog
        AuditLog.registrar(
            usuario=user,
            acao=AuditLog.AcaoChoices.SOFT_DELETE,
            recurso=recurso_nome,
            recurso_id=instance_id,
            request=self.request
        )

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

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        # Rastreabilidade LGPD: registra visualização dos dados cadastrais do acolhido
        from .models import AuditLog
        AuditLog.registrar(
            usuario=request.user,
            acao=AuditLog.AcaoChoices.VIEW,
            recurso="Paciente",
            recurso_id=str(instance.id),
            detalhes={"cpf": instance.cpf},
            request=request
        )
        return Response(serializer.data)

class ProntuarioViewSet(BaseRLSModelViewSet):
    queryset = Prontuario.objects.none()
    serializer_class = ProntuarioSerializer
    realtime_table_name = "prontuarios"
    realtime_topic = "prontuarios"

    def get_queryset(self):
        return Prontuario.objects.for_user(self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        # Rastreabilidade CFM e LGPD: registra visualização das anotações clínicas
        from .models import AuditLog
        AuditLog.registrar(
            usuario=request.user,
            acao=AuditLog.AcaoChoices.VIEW,
            recurso="Prontuario",
            recurso_id=str(instance.id),
            detalhes={"paciente_id": str(instance.paciente_id)},
            request=request
        )
        return Response(serializer.data)

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
    ChatGeralStreamIAView,
    HermesSREDiagnosticView
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


from sgi.ecosystem import EcosystemMetricsService
from rest_framework.permissions import IsAdminUser


class EcosystemMetricsView(APIView):
    """
    Endpoint do Mission Control / Central de Observabilidade SCSI (Fase 1).
    Retorna métricas consolidadas em tempo real de todos os 9 componentes da arquitetura.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        report = EcosystemMetricsService.get_full_report()
        return Response(report, status=200)


from django.http import HttpResponse
from django.shortcuts import redirect
from .dashboard_html import MISSION_CONTROL_HTML


from django.views import View


class MissionControlDashboardView(View):
    """
    Interface Visual 'Mission Control' (Fase 2).
    Acesso direto via navegador em /dashboard/ para administradores autenticados.
    """
    def get(self, request):
        if not request.user.is_authenticated:
            return redirect('/admin/login/?next=/dashboard/')
        if not (request.user.is_staff or request.user.is_superuser):
            return HttpResponse("<h1>403 Forbidden: Acesso restrito a administradores do ecossistema SCSI</h1>", status=403)
        return HttpResponse(MISSION_CONTROL_HTML, content_type="text/html")


from .actions import EcosystemActionsService


class EcosystemActionView(APIView):
    """
    Endpoint de Ações Rápidas do Mission Control (Fase 3).
    Permite ao operador autenticado disparar comandos de governança e manutenção.
    """
    permission_classes = [IsAdminUser]

    def post(self, request):
        action = request.data.get("action")
        if action == "purge_cache":
            result = EcosystemActionsService.purge_cache()
        elif action == "warmup_ia":
            result = EcosystemActionsService.warmup_ia()
        elif action == "recalculate_health":
            result = EcosystemActionsService.recalculate_health()
        elif action == "trigger_backup":
            result = EcosystemActionsService.trigger_backup()
        else:
            return Response(
                {"error": f"Ação desconhecida: '{action}'. Ações válidas: purge_cache, warmup_ia, recalculate_health, trigger_backup"},
                status=400
            )

        status_code = 200 if result.get("success") else 500
        return Response(result, status=status_code)


# --- SCSI: Recuperação Segura de Senhas & E-mail Transacional (Item 9) ---
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.conf import settings


class PasswordResetRequestView(APIView):
    """
    Solicitação de redefinição segura de senha com proteção contra enumeração (OWASP).
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip()
        if email:
            user = User.objects.filter(email__iexact=email).first()
            if user:
                token = default_token_generator.make_token(user)
                uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
                reset_link = f"https://singulariconsult.com.br/reset-password?uid={uidb64}&token={token}"
                
                assunto = "SGI Fundação Dr. Jesus - Recuperação de Senha"
                mensagem = (
                    f"Olá, {user.first_name or user.username}!\n\n"
                    f"Uma solicitação de redefinição de senha foi realizada para sua conta no SGI Dr. Jesus.\n"
                    f"Para criar uma nova senha de acesso, clique no link seguro abaixo:\n\n"
                    f"{reset_link}\n\n"
                    f"Se você não solicitou esta redefinição, desconsidere esta mensagem.\n"
                    f"Este link é válido por tempo limitado.\n\n"
                    f"Atenciosamente,\nEquipe de TI & Governança - Fundação Dr. Jesus"
                )
                try:
                    send_mail(
                        assunto,
                        mensagem,
                        settings.DEFAULT_FROM_EMAIL,
                        [user.email],
                        fail_silently=True
                    )
                except Exception as e:
                    import logging
                    logging.getLogger(__name__).warning(f"[SMTP Error] Falha ao enviar e-mail de reset: {e}")

                AuditLog.registrar(
                    usuario=user,
                    acao=AuditLog.AcaoChoices.EXPORT,
                    recurso="PasswordReset",
                    detalhes={"evento": "solicitacao_reset_senha"},
                    request=request
                )

        return Response(
            {"message": "Se o e-mail informado estiver cadastrado em nosso sistema, as instruções para redefinição de senha foram enviadas."},
            status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(APIView):
    """
    Confirmação criptográfica de redefinição de senha com validação de token e registro forense.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        uidb64 = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not uidb64 or not token or not new_password:
            return Response(
                {"error": "Parâmetros 'uid', 'token' e 'new_password' são obrigatórios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 8:
            return Response(
                {"error": "A nova senha deve ter no mínimo 8 caracteres."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.filter(pk=uid).first()
        except Exception:
            user = None

        if not user or not default_token_generator.check_token(user, token):
            return Response(
                {"error": "O link de redefinição de senha é inválido ou já expirou."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        AuditLog.registrar(
            usuario=user,
            acao=AuditLog.AcaoChoices.UPDATE,
            recurso="UserPassword",
            detalhes={"evento": "senha_redefinida_com_sucesso"},
            request=request
        )

        return Response(
            {"message": "Senha redefinida com sucesso. Você já pode efetuar login com suas novas credenciais."},
            status=status.HTTP_200_OK
        )







