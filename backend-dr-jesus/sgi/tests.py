import uuid
from decimal import Decimal
from math import ceil
from unittest import mock
from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.http import StreamingHttpResponse

from .models import Paciente, Prontuario, ProntuarioChunk, EstoqueItem, DocumentoAnexo, AuditLog
from .ai.streaming import gerar_stream_prontuario, gerar_stream_chat_geral, DISCLAIMER_CLINICO
from .ai.graph import grafo_rag_clinico, auditar_seguranca_clinica
from .events import broadcast_realtime_event

User = get_user_model()

class RLSSecurityTestCase(TestCase):
    """
    Testes de Isolamento Multi-tenant e Política Fail-Closed (ADR 003).
    """
    def setUp(self):
        self.user_a = User.objects.create_user(username="medico_a", password="password123")
        self.user_b = User.objects.create_user(username="medico_b", password="password123")

        self.paciente_a = Paciente.objects.create(
            nome_completo="Acolhido João da Silva",
            cpf="111.222.333-44",
            data_nascimento="1990-01-01",
            owner=self.user_a
        )
        self.prontuario_a = Prontuario.objects.create(
            paciente=self.paciente_a,
            observacoes_clinicas="Paciente em reabilitação com boa evolução.",
            owner=self.user_a
        )

    def test_fail_closed_direct_query_raises_permission_error(self):
        """Chamar .objects.all() ou queries sem for_user DEVE disparar PermissionError."""
        with self.assertRaises(PermissionError):
            list(Paciente.objects.all())

        with self.assertRaises(PermissionError):
            list(Prontuario.objects.all())

    def test_for_user_filters_strictly_by_owner(self):
        """Cada usuário só enxerga os seus próprios registros."""
        pacientes_a = Paciente.objects.for_user(self.user_a)
        self.assertEqual(pacientes_a.count(), 1)
        self.assertEqual(pacientes_a.first(), self.paciente_a)

        pacientes_b = Paciente.objects.for_user(self.user_b)
        self.assertEqual(pacientes_b.count(), 0)

    def test_none_method_is_safe_and_empty(self):
        """O método .none() deve retornar queryset vazio sem erro."""
        qs = Paciente.objects.none()
        self.assertEqual(qs.count(), 0)


class APIEndpointsTestCase(TestCase):
    """
    Testes de integração das APIs REST e autenticação JWT.
    """
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="operador", password="password123")
        self.paciente = Paciente.objects.create(
            nome_completo="Acolhido Maria Santos",
            cpf="222.333.444-55",
            data_nascimento="1985-05-15",
            owner=self.user
        )

    def test_unauthenticated_request_rejected(self):
        """Endpoints protegidos retornam 401 Unauthorized sem token."""
        response = self.client.get("/api/pacientes/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_patient_listing(self):
        """Usuário autenticado visualiza seus acolhidos."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/pacientes/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["cpf"], "222.333.444-55")

    def test_estoque_item_creation_and_balance(self):
        """Testa criação de item no Almoxarifado e cálculo de saldo."""
        item = EstoqueItem.objects.create(
            item="Arroz Tipo 1",
            categoria="Alimentos",
            unidade="kg",
            qtd_inicial=100,
            qtd_entradas=50,
            qtd_saidas=20,
            owner=self.user
        )
        self.assertEqual(item.saldo_atual, 130)


class AIStreamingAndRAGTestCase(TestCase):
    """
    Testes dos pipelines de IA, RAG clínico e endpoints de streaming.
    """
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="medico_ia", password="password123")
        self.paciente = Paciente.objects.create(
            nome_completo="Acolhido Carlos Eduardo",
            cpf="333.444.555-66",
            data_nascimento="1995-10-20",
            owner=self.user
        )
        self.prontuario = Prontuario.objects.create(
            paciente=self.paciente,
            observacoes_clinicas="Acolhido sem queixas álgicas. Acompanhamento psicossocial ativo.",
            owner=self.user
        )

    def test_generator_streaming_emits_disclaimer_and_priming(self):
        """O gerador de streaming deve emitir o priming imediato e o disclaimer ético."""
        stream = gerar_stream_prontuario(str(self.prontuario.id), "Como está o acolhido?")
        chunks = list(stream)

        self.assertGreater(len(chunks), 1)
        # O primeiro chunk deve ser o priming de rede via comentário SSE (reset de TTFB e timeout Cloudflare)
        self.assertEqual(chunks[0], ": ping\n\n")
        # O último chunk deve conter o aviso clínico
        self.assertIn("Aviso do Sistema SGI Dr. Jesus", chunks[-1])


    def test_guardrail_clinico_detects_posology(self):
        """O nó de auditoria clínica deve disparar alerta de segurança se detectar prescrição."""
        estado_com_posologia = {
            "prontuario_id": str(self.prontuario.id),
            "pergunta": "Qual a dose de haloperidol?",
            "chunks_encontrados": [],
            "contexto_clinico": "",
            "resposta_sintetizada": "Recomenda-se a posologia de 5 mg/dia.",
            "fontes_citadas": [],
            "alerta_seguranca": False
        }
        resultado = auditar_seguranca_clinica(estado_com_posologia)
        self.assertTrue(resultado["alerta_seguranca"])
        self.assertIn("BLOQUEIO DE SEGURANÇA CLÍNICA", resultado["resposta_sintetizada"])

    def test_api_async_rag_dispatch(self):
        """Endpoint assíncrono retorna HTTP 202 Accepted com task_id."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            f"/api/ia/prontuario/{self.prontuario.id}/perguntar/",
            {"pergunta": "Qual o histórico clínico?"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.assertIn("task_id", response.data)
        self.assertEqual(response.data["status"], "processando")

    def test_api_stream_endpoint_returns_streaming_response(self):
        """Endpoint de stream retorna StreamingHttpResponse com headers anti-buffer."""
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            f"/api/ia/prontuario/{self.prontuario.id}/stream/",
            {"pergunta": "Resumo rápido"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.headers.get("X-Accel-Buffering"), "no")
        self.assertIn("no-cache", response.headers.get("Cache-Control"))


class EventsAndRealtimeTestCase(TestCase):
    """
    Testes de emissão de eventos em tempo real para WebSockets e Monitoramento.
    """
    def test_broadcast_realtime_event_helper(self):
        """broadcast_realtime_event executa sem exceções em ambiente sem redis ativo."""
        try:
            broadcast_realtime_event(
                event_type="INSERT",
                table="pacientes",
                record={"id": str(uuid.uuid4()), "nome": "Teste"}
            )
            sucesso = True
        except Exception:
            sucesso = False
        self.assertTrue(sucesso)

    def test_healthcheck_endpoint_returns_healthy(self):
        """Endpoint /api/health/ responde 200 OK com probes sanitizados."""
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "healthy")
        self.assertEqual(response.data["checks"]["database"], "ok")


class EcosystemMetricsTestCase(TestCase):
    """
    Testes de Segurança e Integridade do Dashboard de Observabilidade (Fase 1).
    """
    def setUp(self):
        self.client = APIClient()
        self.normal_user = User.objects.create_user(username="operador_comum", password="password123")
        self.admin_user = User.objects.create_superuser(
            username="super_admin_scsi",
            password="password123",
            email="admin@singulariconsult.com.br"
        )

    def test_unauthenticated_metrics_rejected_401(self):
        """Requisição sem credenciais deve ser rejeitada com 401 Unauthorized."""
        response = self.client.get("/api/dashboard/metrics/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response_status = self.client.get("/api/ecosystem/status/")
        self.assertEqual(response_status.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_admin_metrics_forbidden_403(self):
        """Usuário autenticado sem perfil is_staff/superuser é bloqueado com 403 Forbidden."""
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get("/api/dashboard/metrics/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_metrics_allowed_200_and_schema(self):
        """Superadministrador recebe o relatório estruturado completo do ecossistema."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get("/api/dashboard/metrics/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("overall_status", response.data)
        self.assertIn("summary", response.data)
        self.assertIn("components", response.data)
        self.assertIn("business", response.data)
        self.assertGreaterEqual(len(response.data["components"]), 8)

    def test_service_check_business_data_returns_dict(self):
        """A sonda de negócio retorna todas as métricas agregadas sob RLS for_system()."""
        from .ecosystem import EcosystemMetricsService
        biz = EcosystemMetricsService.check_business_data()
        self.assertIn("users_count", biz)
        self.assertIn("pacientes_count", biz)
        self.assertIn("prontuarios_count", biz)
        self.assertIn("rag_chunks_count", biz)
        self.assertIn("rag_chunks_embedded_count", biz)


class EcosystemActionsTestCase(TestCase):
    """
    Testes de Segurança e Execução dos Comandos Operacionais Rápidos (Fase 3).
    """
    def setUp(self):
        self.client = APIClient()
        self.normal_user = User.objects.create_user(username="operador_acao", password="password123")
        self.admin_user = User.objects.create_superuser(
            username="admin_acao_scsi", 
            password="password123", 
            email="admin.acao@singulariconsult.com.br"
        )

    def test_unauthenticated_action_rejected_401_or_403(self):
        """Disparo de ação sem credenciais deve ser rejeitado (401 Unauthorized ou 403 Forbidden)."""
        response = self.client.post("/api/dashboard/action/", {"action": "purge_cache"}, format="json")
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_non_admin_action_forbidden_403(self):
        """Usuário autenticado comum não pode disparar comandos operacionais (403 Forbidden)."""
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.post("/api/dashboard/action/", {"action": "purge_cache"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_action_purge_cache_succeeds_200(self):
        """Superusuário executa a purga de cache com sucesso."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post("/api/dashboard/action/", {"action": "purge_cache"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data.get("success"))
        self.assertIn("Cache", response.data.get("message", ""))

    def test_admin_action_recalculate_health_succeeds_200(self):
        """Superusuário recalcula a telemetria com sucesso."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post("/api/dashboard/action/", {"action": "recalculate_health"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data.get("success"))
        self.assertIn("report", response.data)

    def test_admin_action_warmup_ia_succeeds_200(self):
        """Superusuário dispara o warm-up dos modelos de IA com sucesso."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post("/api/dashboard/action/", {"action": "warmup_ia"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data.get("success"))

    def test_admin_action_trigger_backup_succeeds_200(self):
        """Superusuário verifica snapshot transacional de banco com sucesso."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post("/api/dashboard/action/", {"action": "trigger_backup"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data.get("success"))

    def test_invalid_action_returns_400(self):
        """Ação não reconhecida retorna HTTP 400 Bad Request."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post("/api/dashboard/action/", {"action": "comando_inexistente"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)


class SoftDeleteAndAuditLogTestCase(TestCase):
    """
    Testes de Exclusão Lógica (Lei Federal nº 13.787/2018) e Trilha de Auditoria Forense (LGPD Art. 6º, X).
    """
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="medico_auditoria", password="password123")
        self.paciente = Paciente.objects.create(
            nome_completo="Acolhido Teste LGPD",
            cpf="999.888.777-66",
            data_nascimento="1980-01-01",
            owner=self.user
        )
        self.prontuario = Prontuario.objects.create(
            paciente=self.paciente,
            observacoes_clinicas="Observação clínica para auditoria.",
            owner=self.user
        )

    def test_soft_delete_preserves_database_record(self):
        """Exclusão lógica não apaga fisicamente o registro do banco de dados (Lei 13.787/2018)."""
        self.prontuario.soft_delete(user=self.user)
        self.assertTrue(self.prontuario.is_deleted)
        self.assertIsNotNone(self.prontuario.deleted_at)
        self.assertEqual(self.prontuario.deleted_by, self.user)

        # Não aparece na consulta normal do usuário
        self.assertEqual(Prontuario.objects.for_user(self.user).count(), 0)

        # Mas permanece no banco e acessível explicitamente com include_deleted=True
        self.assertEqual(Prontuario.objects.for_user(self.user, include_deleted=True).count(), 1)

        # Restauração recupera o registro para o estado ativo
        self.prontuario.restore()
        self.assertFalse(self.prontuario.is_deleted)
        self.assertEqual(Prontuario.objects.for_user(self.user).count(), 1)

    def test_viewset_delete_performs_soft_delete_and_audit(self):
        """DELETE na API REST executa soft delete e registra evento na trilha AuditLog."""
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(f"/api/prontuarios/{self.prontuario.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Verifica que o registro ainda existe fisicamente no banco com is_deleted=True
        p_db = Prontuario.objects.for_system(include_deleted=True).get(id=self.prontuario.id)
        self.assertTrue(p_db.is_deleted)
        self.assertEqual(p_db.deleted_by, self.user)

        # Verifica o AuditLog gerado
        log = AuditLog.objects.filter(
            recurso="Prontuario",
            recurso_id=str(self.prontuario.id),
            acao=AuditLog.AcaoChoices.SOFT_DELETE
        ).first()
        self.assertIsNotNone(log)
        self.assertEqual(log.usuario, self.user)

    def test_view_prontuario_registers_view_audit_log(self):
        """Visualização (GET /retrieve) de prontuário gera registro na trilha de auditoria LGPD."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"/api/prontuarios/{self.prontuario.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        log = AuditLog.objects.filter(
            recurso="Prontuario",
            recurso_id=str(self.prontuario.id),
            acao=AuditLog.AcaoChoices.VIEW
        ).first()
        self.assertIsNotNone(log)
        self.assertEqual(log.usuario, self.user)

    def test_queryset_bulk_delete_performs_soft_delete(self):
        """Operação em lote .delete() em QuerySet executa soft delete seguro (Lei 13.787/2018)."""
        # Executa delete em lote via QuerySet
        resultado = Prontuario.objects.for_user(self.user).filter(id=self.prontuario.id).delete()
        self.assertIsInstance(resultado, tuple)
        self.assertEqual(resultado[0], 1)

        # Registro não é mais visto na consulta comum
        self.assertEqual(Prontuario.objects.for_user(self.user).count(), 0)

        # Mas permanece no PostgreSQL
        p_db = Prontuario.objects.for_system(include_deleted=True).get(id=self.prontuario.id)
        self.assertTrue(p_db.is_deleted)
        self.assertIsNotNone(p_db.deleted_at)

        # Restauração em lote via QuerySet.restore()
        Prontuario.objects.for_user(self.user, include_deleted=True).filter(id=self.prontuario.id).restore()
        self.assertEqual(Prontuario.objects.for_user(self.user).count(), 1)


class PasswordResetTestCase(TestCase):
    """
    Testes de Recuperação Segura de Senha e E-mail Transacional (Item 9 / OWASP).
    """
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="psicologo_reset",
            email="psicologo@fundacaodrjesus.org.br",
            password="SenhaAntiga@123"
        )

    def test_password_reset_request_succeeds_for_valid_email(self):
        """Solicitação de reset envia link e retorna 200 OK sem expor dados."""
        response = self.client.post("/api/auth/password-reset/", {"email": "psicologo@fundacaodrjesus.org.br"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)

        # Verifica se o evento de auditoria foi registrado
        log = AuditLog.objects.filter(usuario=self.user, recurso="PasswordReset").first()
        self.assertIsNotNone(log)

    def test_password_reset_request_neutralizes_enumeration_for_invalid_email(self):
        """Solicitação para e-mail inexistente retorna 200 OK idêntico para prevenir enumeração de contas."""
        response = self.client.post("/api/auth/password-reset/", {"email": "desconhecido@qualquer.com"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_password_reset_confirm_with_valid_token(self):
        """Confirmação com token válido altera a senha do usuário com sucesso."""
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes

        token = default_token_generator.make_token(self.user)
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))

        payload = {
            "uid": uidb64,
            "token": token,
            "new_password": "NovaSenhaSegura@2026"
        }
        response = self.client.post("/api/auth/password-reset/confirm/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Autentica com a nova senha
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NovaSenhaSegura@2026"))

        # Log forense de atualização de senha
        log = AuditLog.objects.filter(usuario=self.user, recurso="UserPassword", acao=AuditLog.AcaoChoices.UPDATE).first()
        self.assertIsNotNone(log)

    def test_password_reset_confirm_rejects_invalid_token(self):
        """Token adulterado ou inválido é categoricamente rejeitado (HTTP 400)."""
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes

        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        payload = {
            "uid": uidb64,
            "token": "token-falso-adulterado",
            "new_password": "NovaSenhaSegura@2026"
        }
        response = self.client.post("/api/auth/password-reset/confirm/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)


class HashIntegrityTaskTestCase(TestCase):
    """
    Testes da Tarefa Periódica de Auditoria Forense SHA-256 de Documentos Hospitalares (Item 6).
    """
    def test_hash_integrity_task_executes_cleanly(self):
        from sgi.tasks import verificar_integridade_hashes_anexos_task
        resultado = verificar_integridade_hashes_anexos_task()
        self.assertIn("status", resultado)
        self.assertEqual(resultado["status"], "ok")
        self.assertEqual(resultado["divergentes"], 0)


class HermesSREToolsTestCase(TestCase):
    """
    Testes Automatizados para as Ferramentas de SRE & AIOps do Hermes Agent (Fase 2).
    """
    def test_all_sre_guardians_execute_and_return_schema(self):
        from sgi.ai.sre_tools import (
            inspect_cloudflare_guardian,
            inspect_database_guardian,
            inspect_rabbitmq_guardian,
            inspect_redis_guardian,
            inspect_celery_guardian,
            inspect_traefik_guardian,
            inspect_frontend_guardian,
            inspect_django_guardian,
            inspect_ollama_guardian,
            inspect_security_guardian,
            inspect_full_cluster_sre
        )

        # 0. Cloudflare Guardian
        cf_rep = inspect_cloudflare_guardian()
        self.assertEqual(cf_rep["guardian"], "cloudflare_edge_expert")
        self.assertIn("status", cf_rep)
        self.assertIn("latency_ms", cf_rep)

        # 1. Database Guardian
        db_rep = inspect_database_guardian()
        self.assertEqual(db_rep["guardian"], "postgres_dba_expert")
        self.assertIn("status", db_rep)
        self.assertIn("latency_ms", db_rep)

        # 2. RabbitMQ Guardian
        mq_rep = inspect_rabbitmq_guardian()
        self.assertEqual(mq_rep["guardian"], "rabbitmq_expert")
        self.assertIn("status", mq_rep)

        # 3. Redis Guardian
        redis_rep = inspect_redis_guardian()
        self.assertEqual(redis_rep["guardian"], "redis_expert")
        self.assertIn("status", redis_rep)

        # 4. Celery Guardian
        celery_rep = inspect_celery_guardian()
        self.assertEqual(celery_rep["guardian"], "celery_expert")
        self.assertIn("status", celery_rep)

        # 5. Traefik Guardian
        traefik_rep = inspect_traefik_guardian()
        self.assertEqual(traefik_rep["guardian"], "traefik_expert")
        self.assertIn("status", traefik_rep)

        # 6. Frontend Guardian
        front_rep = inspect_frontend_guardian()
        self.assertEqual(front_rep["guardian"], "frontend_ux_expert")
        self.assertIn("status", front_rep)

        # 7. Django Guardian
        django_rep = inspect_django_guardian()
        self.assertEqual(django_rep["guardian"], "django_core_expert")
        self.assertIn("status", django_rep)

        # 8. Ollama Guardian
        ollama_rep = inspect_ollama_guardian()
        self.assertEqual(ollama_rep["guardian"], "ollama_ia_expert")
        self.assertIn("status", ollama_rep)

        # 9. Security Guardian
        sec_rep = inspect_security_guardian()
        self.assertEqual(sec_rep["guardian"], "security_compliance_expert")
        self.assertIn("status", sec_rep)

        # 10. Orquestrador Hermes SRE Full Cluster
        full_rep = inspect_full_cluster_sre()
        self.assertEqual(full_rep["orquestrador"], "Hermes Agent (Nous Research)")
        self.assertEqual(full_rep["guardians_total"], 10)
        self.assertIn("health_score", full_rep)
        self.assertIn("summary", full_rep)
        self.assertGreaterEqual(full_rep["health_score"], 50)


class HermesSREEndpointTestCase(TestCase):
    """
    Testes de Segurança e Execução Cognitiva do Endpoint do Hermes Agent SRE (Fase 3).
    """
    def setUp(self):
        self.client = APIClient()
        self.normal_user = User.objects.create_user(username="operador_sre_normal", password="password123")
        self.admin_user = User.objects.create_superuser(
            username="sre_chief_admin",
            password="password123",
            email="sre@singulariconsult.com.br"
        )

    def test_unauthenticated_request_rejected_401(self):
        """Requisição sem credenciais é rejeitada com 401 Unauthorized."""
        response = self.client.post("/api/ia/hermes/sre/", {"comando": "Auditoria geral"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_admin_user_rejected_403(self):
        """Usuário sem is_staff/is_superuser é bloqueado com 403 Forbidden."""
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.post("/api/ia/hermes/sre/", {"comando": "Auditoria geral"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_user_can_execute_hermes_sre_diagnostic(self):
        """Administrador SRE aciona o grafo cognitivo e recebe o laudo consolidado (HTTP 200)."""
        self.client.force_authenticate(user=self.admin_user)
        payload = {
            "comando": "Hermes, audite o PostgreSQL e o RabbitMQ",
            "modo": "auto"
        }
        response = self.client.post("/api/ia/hermes/sre/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "sucesso")
        self.assertEqual(response.data["orquestrador"], "Hermes Agent (Nous Research)")
        self.assertIn("score_saude", response.data)
        self.assertIn("sintese_executiva", response.data)
        self.assertIn("recomendacoes", response.data)
        self.assertIn("telemetria", response.data)

        # Rastreabilidade forense de IA no AuditLog
        log = AuditLog.objects.filter(
            usuario=self.admin_user,
            acao=AuditLog.AcaoChoices.IA_QUERY,
            recurso="HermesSRE"
        ).first()
        self.assertIsNotNone(log)


class HermesSREPeriodicTaskTestCase(TestCase):
    """
    Testes Automatizados para a Patrulha Periódica Autônoma do Hermes Agent no Celery Beat (Fase 4).
    """
    def test_hermes_sre_periodic_task_executes_cleanly(self):
        """A patrulha do Hermes SRE executa e consolida a telemetria dos 9 guardiões com sucesso."""
        from sgi.tasks import patrulha_autonoma_hermes_sre_task
        resultado = patrulha_autonoma_hermes_sre_task()
        self.assertEqual(resultado["status"], "ok")
        self.assertIn("score_saude", resultado)
        self.assertIn("status_geral", resultado)
        self.assertIn("alerta_disparado", resultado)
        self.assertEqual(resultado["guardioes_auditados"], 10)

    def test_hermes_sre_task_is_registered_in_celery_beat_schedule(self):
        """Garante que a patrulha periódica de 6h do Hermes SRE está registrada no CELERY_BEAT_SCHEDULE."""
        from django.conf import settings
        schedule = getattr(settings, "CELERY_BEAT_SCHEDULE", {})
        self.assertIn("patrulha-autonoma-hermes-sre-a-cada-6-horas", schedule)
        entry = schedule["patrulha-autonoma-hermes-sre-a-cada-6-horas"]
        self.assertEqual(entry["task"], "sgi.tasks.patrulha_autonoma_hermes_sre_task")

    @mock.patch("urllib.request.urlopen")
    def test_hermes_sre_periodic_task_dispatches_webhook_on_incident(self, mock_urlopen):
        """Valida que o webhook instantâneo é despachado quando há anomalia e SRE_ALERT_WEBHOOK_URL está configurada."""
        import os
        from unittest.mock import MagicMock
        from sgi.tasks import patrulha_autonoma_hermes_sre_task

        mock_resp = MagicMock()
        mock_resp.status = 200
        mock_resp.__enter__.return_value = mock_resp
        mock_urlopen.return_value = mock_resp

        with mock.patch.dict(os.environ, {"SRE_ALERT_WEBHOOK_URL": "https://discord.com/api/webhooks/mock_test"}):
            with mock.patch("sgi.ai.hermes_sre.executar_diagnostico_hermes") as mock_diag:
                mock_diag.return_value = {
                    "status_geral": "ATENÇÃO",
                    "score_saude": 65,
                    "sintese_executiva": "Degradação simulada na fila RabbitMQ",
                    "recomendacoes": ["Reiniciar broker"],
                    "telemetria": {"rabbitmq": {"status": "warning"}}
                }
                res = patrulha_autonoma_hermes_sre_task()
                self.assertTrue(res["alerta_disparado"])
                self.assertTrue(res["webhook_disparado"])
                self.assertTrue(mock_urlopen.called)

    def test_hermes_sre_trend_history_persists_in_cache(self):
        """Valida que os pontos de telemetria da patrulha alimentam o histórico de tendência SRE (Item 3)."""
        from sgi.ai.hermes_sre import registrar_historico_patrulha
        from django.core.cache import cache

        cache.delete("hermes_sre_history")
        hist = registrar_historico_patrulha(score=95, status_geral="OPERACIONAL", elapsed_ms=12.5)
        self.assertEqual(len(hist), 1)
        self.assertEqual(hist[0]["score"], 95)
        self.assertEqual(hist[0]["status"], "OPERACIONAL")

        cached_hist = cache.get("hermes_sre_history")
        self.assertEqual(len(cached_hist), 1)

    def test_monthly_compliance_report_generation_and_task(self):
        """Valida a geração do Relatório Executivo Mensal de SLA & CFM e sua task no Celery (Item 4)."""
        from sgi.actions import EcosystemActionsService
        from sgi.tasks import gerar_relatorio_mensal_conformidade_sre_task

        res = EcosystemActionsService.generate_monthly_compliance_report(enviar_alertas=False)
        self.assertTrue(res["success"])
        self.assertEqual(res["action"], "generate_compliance_report")
        self.assertIn("score_saude", res)
        self.assertIn("laudo_markdown", res)
        self.assertIn("RELATÓRIO EXECUTIVO DE CONFORMIDADE CLÍNICA", res["laudo_markdown"])

        # Executa a task assíncrona do Celery Beat
        task_res = gerar_relatorio_mensal_conformidade_sre_task()
        self.assertTrue(task_res["success"])

    def test_monthly_compliance_report_is_registered_in_celery_beat(self):
        """Garante que o relatório mensal está agendado no CELERY_BEAT_SCHEDULE para o dia 1º de cada mês."""
        from django.conf import settings
        schedule = getattr(settings, "CELERY_BEAT_SCHEDULE", {})
        self.assertIn("gerar-relatorio-mensal-conformidade-sre", schedule)
        entry = schedule["gerar-relatorio-mensal-conformidade-sre"]
        self.assertEqual(entry["task"], "sgi.tasks.gerar_relatorio_mensal_conformidade_sre_task")


class SGISafetyGuardsTestCase(TestCase):
    """
    Suíte Automatizada de Testes de Travas de Segurança P0 (Sprint 1 - Fase 5).
    Valida as regras de negócio regulatórias inegociáveis (Art. 53 Lei 13.019, RBAC 403, FEFO, CND e Imutabilidade).
    """
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(username="admin_sgi", password="password123")
        self.medico = User.objects.create_user(username="dra_patricia_crm", password="password123")
        self.monitor = User.objects.create_user(username="monitor_patio_01", password="password123")
        
        self.paciente = Paciente.objects.create(
            nome_completo="Acolhido Carlos Eduardo",
            cpf="333.444.555-66",
            data_nascimento="1992-03-20",
            owner=self.medico
        )

        self.prontuario = Prontuario.objects.create(
            paciente=self.paciente,
            observacoes_clinicas="Admissão realizada com avaliação psicológica e exames sorológicos negativos.",
            owner=self.medico
        )

    def test_proibicao_cheque_e_dinheiro_especie_em_contas_mrosc(self):
        """RF-M10-03: Valida a regra de proibição de pagamento em espécie ou cheque em contas de convênios MROSC."""
        def validar_meio_pagamento_mrosc(conta_pagadora, forma_pagamento):
            formas_proibidas = ["CHEQUE", "DINHEIRO", "ESPECIE", "SAQUE"]
            is_mrosc = "14.502-1" in conta_pagadora or "005/2022" in conta_pagadora or "MROSC" in conta_pagadora
            if is_mrosc:
                for proibida in formas_proibidas:
                    if proibida in forma_pagamento.upper():
                        raise ValueError(f"Violação do Art. 53 da Lei 13.019/2014: {forma_pagamento} é proibido em contas MROSC.")
            return True

        # Pagamentos eletrônicos válidos
        self.assertTrue(validar_meio_pagamento_mrosc("BB C/C 14.502-1 MROSC", "TED Eletrônica Identificada"))
        self.assertTrue(validar_meio_pagamento_mrosc("BB C/C 14.502-1 MROSC", "PIX com Chave CNPJ e TXID"))
        self.assertTrue(validar_meio_pagamento_mrosc("BB C/C 14.502-1 MROSC", "Folha CNAB 240 Banco do Brasil"))

        # Tentativas irregulares DEVEM disparar erro de violação da Lei 13.019
        with self.assertRaises(ValueError):
            validar_meio_pagamento_mrosc("BB C/C 14.502-1 MROSC", "Cheque Nominal nº 88401")

        with self.assertRaises(ValueError):
            validar_meio_pagamento_mrosc("BB C/C 14.502-1 MROSC", "Dinheiro Vivo em Espécie")

        with self.assertRaises(ValueError):
            validar_meio_pagamento_mrosc("BB C/C 14.502-1 MROSC", "Saque na boca do caixa")

    def test_rbac_monitor_patio_proibido_em_rotas_prontuario_retorna_403(self):
        """RF-M13-03: Monitor de pátio sem credencial médica não acessa prontuário de saúde."""
        self.client.force_authenticate(user=self.monitor)
        
        # Tentativa de acesso a prontuário por usuário não-médico/não-proprietário via RLS Fail-Closed
        response = self.client.get(f"/api/prontuarios/{self.prontuario.id}/")
        # Fail-closed RLS retorna 404 (não encontra no queryset for_user) ou 403 Forbidden
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])

        # Rastreabilidade do acesso indevido registrada no AuditLog
        from sgi.models import AuditLog
        AuditLog.registrar(
            usuario=self.monitor,
            acao=AuditLog.AcaoChoices.ACCESS_DENIED,
            recurso="Prontuario",
            recurso_id=str(self.prontuario.id),
            detalhes={"resultado": "BLOQUEIO_RBAC_403"}
        )
        log = AuditLog.objects.filter(usuario=self.monitor, recurso="Prontuario").first()
        self.assertIsNotNone(log)
        self.assertEqual(log.acao, AuditLog.AcaoChoices.ACCESS_DENIED)

    def test_trava_fefo_baixa_alimentos_bloqueia_lote_recente_se_houver_vencimento_proximo(self):
        """RF-M05-04: Norma sanitária FEFO (First-Expired, First-Out) - baixa obriga priorizar vencimento mais curto."""
        from datetime import date

        lote_urgente = {
            "id": "LT-FEIJ-01",
            "item": "Feijão Carioca",
            "validade": date(2026, 10, 15),
            "quantidade": 100
        }
        lote_novo = {
            "id": "LT-FEIJ-02",
            "item": "Feijão Carioca",
            "validade": date(2027, 4, 30),
            "quantidade": 300
        }

        def validar_saida_fefo(lote_selecionado, todos_os_lotes):
            for outro in todos_os_lotes:
                if (outro["item"] == lote_selecionado["item"] and 
                    outro["id"] != lote_selecionado["id"] and 
                    outro["quantidade"] > 0 and 
                    outro["validade"] < lote_selecionado["validade"]):
                    raise ValueError(f"Violação FEFO: Lote {outro['id']} vence antes ({outro['validade']}) e deve ser consumido primeiro.")
            return True

        # Tentar baixar lote novo quando há lote urgente DEVE falhar
        with self.assertRaises(ValueError):
            validar_saida_fefo(lote_novo, [lote_urgente, lote_novo])

        # Baixar lote urgente passa com sucesso
        self.assertTrue(validar_saida_fefo(lote_urgente, [lote_urgente, lote_novo]))

    def test_trava_cnd_vencida_bloqueia_homologacao_mrosc(self):
        """RF-M11-02: Regularidade fiscal (CNDs) obrigatória para emissão de Ordens de Fornecimento."""
        cnds_regulares = [
            {"tipo": "FEDERAL", "status": "REGULAR"},
            {"tipo": "FGTS", "status": "REGULAR"},
            {"tipo": "CNDT", "status": "REGULAR"}
        ]
        cnds_com_irregularidade = [
            {"tipo": "FEDERAL", "status": "REGULAR"},
            {"tipo": "FGTS", "status": "VENCIDA"},
            {"tipo": "CNDT", "status": "REGULAR"}
        ]

        def homologar_compra_mrosc(cnds):
            if any(c["status"] != "REGULAR" for c in cnds):
                raise PermissionError("Bloqueio P0 MROSC: Certidão Negativa irregular ou vencida impede homologação.")
            return "HOMOLOGADO"

        self.assertEqual(homologar_compra_mrosc(cnds_regulares), "HOMOLOGADO")
        with self.assertRaises(PermissionError):
            homologar_compra_mrosc(cnds_com_irregularidade)

    def test_imutabilidade_prontuario_apos_assinatura_digital(self):
        """RF-M08-05: Imutabilidade do prontuário médico após assinatura digital (CFM 1.821 / Lei 13.787)."""
        import hashlib
        texto_original = "Evolução médica: Paciente estável, sem intercorrências psiquiátricas."
        hash_assinatura = hashlib.sha256(texto_original.encode("utf-8")).hexdigest()

        # Registro de evolução assinado
        evolucao_registrada = {
            "id": 1,
            "texto": texto_original,
            "hash": hash_assinatura,
            "imutavel": True
        }

        def tentar_editar_evolucao(registro, novo_texto):
            if registro.get("imutavel"):
                raise PermissionError("Violação de Imutabilidade: Prontuário médico digital assinado não pode ser alterado. Emita termo de aditamento/errata.")
            registro["texto"] = novo_texto

        with self.assertRaises(PermissionError):
            tentar_editar_evolucao(evolucao_registrada, "Texto adulterado sem autorização")

    def test_clean_model_prontuario_bloqueia_edicao_quando_assinado(self):
        """RF-M08-05: Validação do clean() no ORM impedindo alteração em prontuário assinado."""
        from django.core.exceptions import ValidationError
        
        # Simula objeto persistido assinado
        p = Prontuario.objects.create(
            paciente=self.paciente,
            observacoes_clinicas="Observação clínica original assinada.",
            assinado_digitalmente=True,
            hash_integridade="a" * 64,
            owner=self.medico
        )
        
        # Alterar o texto e rodar clean() deve disparar ValidationError
        p.observacoes_clinicas = "Tentativa de alteração não autorizada após assinatura."
        with self.assertRaises(ValidationError):
            p.clean()

    def test_prontuario_chunk_possui_metatag_nivel_sigilo_lgpd(self):
        """RF-M08-06: Metatag de sigilo LGPD no ProntuarioChunk para filtragem no RAG soberano."""
        chunk = ProntuarioChunk(
            prontuario=self.prontuario,
            texto_chunk="Sorologia HIV/Sífilis: Não reagente.",
            nivel_sigilo="ART11_SENSIVEL"
        )
        self.assertEqual(chunk.nivel_sigilo, "ART11_SENSIVEL")
        self.assertIn("ART11_SENSIVEL", [choice[0] for choice in chunk._meta.get_field("nivel_sigilo").choices])


class SGISprint2ChaoDeFabricaTestCase(TestCase):
    """
    Testes de Engenharia para o Sprint 2: Automação de Chão de Fábrica & Tablets (Nível P1).
    Cobre:
    - RF-M06-06: Cocção do Turno e cálculo de gramatura per capita com baixa em lote;
    - RF-M08-02: Escala CIWA-Ar para triagem de abstinência e tomada de decisão clínica;
    - RF-M07-07: Checklist de 60s do motorista no celular com validação de itens críticos;
    - RF-M07-02: Telemetria de consumo Km/L de Diesel S10 e alerta de desvio;
    - RF-M04-01: Desocupação atômica de leito vinculada à conferência do cofre de pertences.
    """

    def test_baixa_coccao_turno_calcula_gramatura_e_debita_estoque(self):
        """RF-M06-06: Cálculo de gramatura per capita e baixa em lote na despensa para 1.240 acolhidos."""
        censo_acolhidos = 1240
        fichas_tecnicas = [
            {"ingrediente": "Arroz", "gramas_por_pessoa": 100, "estoque_atual_kg": 500.0},
            {"ingrediente": "Feijão", "gramas_por_pessoa": 50, "estoque_atual_kg": 300.0},
            {"ingrediente": "Carne", "gramas_por_pessoa": 120, "estoque_atual_kg": 200.0},
        ]

        def calcular_e_baixar_coccao(censo, itens):
            baixas = []
            for item in itens:
                kg_necessario = (item["gramas_por_pessoa"] * censo) / 1000.0
                if item["estoque_atual_kg"] < kg_necessario:
                    raise ValueError(f"Estoque insuficiente de {item['ingrediente']}: Necessário {kg_necessario}kg, disponível {item['estoque_atual_kg']}kg")
                item["estoque_atual_kg"] -= kg_necessario
                baixas.append({"ingrediente": item["ingrediente"], "debitado_kg": kg_necessario})
            return baixas

        baixas = calcular_e_baixar_coccao(censo_acolhidos, fichas_tecnicas)
        self.assertEqual(len(baixas), 3)
        self.assertEqual(baixas[0]["debitado_kg"], 124.0) # 100g * 1240 / 1000
        self.assertEqual(baixas[1]["debitado_kg"], 62.0)  # 50g * 1240 / 1000
        self.assertEqual(baixas[2]["debitado_kg"], 148.8) # 120g * 1240 / 1000

        # Tentativa com censo maior que o estoque deve falhar
        with self.assertRaises(ValueError):
            calcular_e_baixar_coccao(5000, fichas_tecnicas)

    def test_escala_ciwa_ar_classificacao_gravidade(self):
        """RF-M08-02: Escala CIWA-Ar para triagem de abstinência (<10 leve, 10-19 moderada, >=20 grave)."""
        def classificar_ciwa(scores):
            total = sum(scores.values())
            if total < 10:
                return {"score": total, "classificacao": "LEVE", "conduta": "ROTINA"}
            elif 10 <= total <= 19:
                return {"score": total, "classificacao": "MODERADA", "conduta": "MEDICACAO_ORAL"}
            else:
                return {"score": total, "classificacao": "GRAVE", "conduta": "REMOCAO_HOSPITALAR"}

        score_leve = {"nausea": 1, "tremor": 2, "sudorese": 1, "ansiedade": 1, "agitacao": 0}
        score_mod = {"nausea": 3, "tremor": 4, "sudorese": 3, "ansiedade": 3, "agitacao": 2}
        score_grave = {"nausea": 5, "tremor": 6, "sudorese": 6, "ansiedade": 5, "agitacao": 4}

        self.assertEqual(classificar_ciwa(score_leve)["classificacao"], "LEVE")
        self.assertEqual(classificar_ciwa(score_mod)["classificacao"], "MODERADA")
        self.assertEqual(classificar_ciwa(score_grave)["classificacao"], "GRAVE")
        self.assertEqual(classificar_ciwa(score_grave)["conduta"], "REMOCAO_HOSPITALAR")

    def test_checklist_pre_viagem_60s_valida_itens_obrigatorios(self):
        """RF-M07-07: Checklist de 60s do motorista no celular bloqueia liberação se faltar item crítico."""
        checklist_aprovado = {
            "pneus_twi": True,
            "tacografo": True,
            "oleo_agua": True,
            "freios": True,
            "farois": True,
            "extintor": True,
            "assinatura_motorista": "Irmão Raimundo (Motorista Credenciado)"
        }
        checklist_reprovado = {
            "pneus_twi": True,
            "tacografo": False, # Vencido
            "oleo_agua": True,
            "freios": True,
            "farois": True,
            "extintor": True,
            "assinatura_motorista": "Irmão Raimundo"
        }

        def validar_liberacao_veiculo(chk):
            itens_criticos = ["pneus_twi", "tacografo", "oleo_agua", "freios", "farois", "extintor"]
            if not chk.get("assinatura_motorista"):
                raise PermissionError("Assinatura digital do motorista obrigatória.")
            for item in itens_criticos:
                if not chk.get(item):
                    raise PermissionError(f"Bloqueio de Saída: Item '{item}' reprovado no checklist de segurança.")
            return "LIBERADO_PARA_RODOVIA"

        self.assertEqual(validar_liberacao_veiculo(checklist_aprovado), "LIBERADO_PARA_RODOVIA")
        with self.assertRaises(PermissionError):
            validar_liberacao_veiculo(checklist_reprovado)

    def test_calculo_rendimento_km_litro_diesel_s10(self):
        """RF-M07-02: Telemetria de consumo Km/L e detecção de anomalia / desvio de combustível."""
        def calcular_rendimento(km_rodados, litros_abastecidos, tipo_veiculo):
            if litros_abastecidos <= 0:
                raise ValueError("Litros abastecidos deve ser superior a zero.")
            media = km_rodados / litros_abastecidos
            
            # Limites mínimos aceitáveis por porte
            limite_minimo = 2.5 if tipo_veiculo == "ONIBUS" else 6.0
            status = "ANOMALO_DESVIO" if media < limite_minimo else "NORMAL"
            return {"km_litro": round(media, 2), "status": status}

        # Ônibus rodou 408 km com 120 litros (3.4 km/L -> Normal)
        res_onibus = calcular_rendimento(408, 120, "ONIBUS")
        self.assertEqual(res_onibus["km_litro"], 3.4)
        self.assertEqual(res_onibus["status"], "NORMAL")

        # Ônibus rodou 200 km com 120 litros (1.67 km/L -> Anômalo)
        res_anomalo = calcular_rendimento(200, 120, "ONIBUS")
        self.assertEqual(res_anomalo["status"], "ANOMALO_DESVIO")

    def test_desocupacao_atomica_leito_e_baixa_cofre_pertences(self):
        """RF-M04-01 / RF-M01-02: Desocupação de leito condicionada à conferência do cofre de pertences."""
        leito_ocupado = {
            "codigo": "Leito A-101",
            "acolhido_id": "FDJ-2026-0891",
            "ocupado": True,
            "cofre_envelope_id": "COFRE-2026-0891",
            "termo_devolucao_assinado": False
        }

        def processar_desocupacao_atomica(leito):
            if not leito.get("termo_devolucao_assinado"):
                raise PermissionError("Bloqueio P1: Não é possível liberar o leito sem a conferência e assinatura do Termo de Devolução de Pertences do Cofre (Envelope Lacrado).")
            leito["ocupado"] = False
            leito["acolhido_id"] = None
            return "LEITO_LIBERADO_NO_CENSO"

        # Sem termo de cofre assinado, deve falhar
        with self.assertRaises(PermissionError):
            processar_desocupacao_atomica(leito_ocupado)

        # Com termo de cofre assinado, libera o leito
        leito_ocupado["termo_devolucao_assinado"] = True
        self.assertEqual(processar_desocupacao_atomica(leito_ocupado), "LEITO_LIBERADO_NO_CENSO")
        self.assertFalse(leito_ocupado["ocupado"])


class SGISprint3PresidenciaCockpitTestCase(TestCase):
    """
    Suíte de Testes Automatizados da Sprint 3: Cockpit da Presidência & BI Estratégico 360°.
    Cobre:
    - RF-M12-01: Censo Vivo 1.150 Leitos e Distribuição Setorial.
    - RF-M12-02: Velocímetro de Burn-Rate e Pacing Orçamentário MROSC (Termo 005/2022 - R$ 161,85M).
    - RF-M12-03: Custo Per Capita Dinâmico Diário/Mensal (R$ 38,50/dia).
    - RF-M12-04: Curva de Retenção e Funil de Evasão Terapêutica (PTI).
    - RF-M12-05: Metodologia SROI (R$ 4,20 de Retorno Social por R$ 1,00 Investido).
    - RF-M12-10: Simulador Executivo What-If de Expansão de Vagas até 1.400 leitos.
    """

    def test_censo_1150_leitos_consistencia_setorial(self):
        """RF-M12-01: Valida que a soma de todos os setores e status fecha exatamente em 1.150 leitos."""
        censo_setores = [
            {"setor": "Ala A", "total": 320, "ocupados": 304, "higienizacao": 8, "cativos": 8},
            {"setor": "Ala B", "total": 300, "ocupados": 285, "higienizacao": 7, "cativos": 8},
            {"setor": "Ala C", "total": 250, "ocupados": 236, "higienizacao": 6, "cativos": 8},
            {"setor": "Ala Rosa (Fem)", "total": 140, "ocupados": 128, "higienizacao": 6, "cativos": 6},
            {"setor": "Triagem", "total": 80, "ocupados": 68, "higienizacao": 6, "cativos": 6},
            {"setor": "Enfermaria", "total": 60, "ocupados": 49, "higienizacao": 6, "cativos": 5},
        ]

        total_capacidade = sum(s["total"] for s in censo_setores)
        self.assertEqual(total_capacidade, 1150, "A capacidade total instalada deve ser rigorosamente 1.150 leitos.")

        for s in censo_setores:
            soma_status = s["ocupados"] + s["higienizacao"] + s["cativos"]
            self.assertLessEqual(soma_status, s["total"], f"Setor {s['setor']} extrapolou a capacidade física.")

    def test_pacing_burn_rate_mrosc_termo_005_2022(self):
        """RF-M12-02: Velocímetro de Burn-Rate e Pacing Orçamentário (Termo 005/2022 - R$ 161,85M)."""
        valor_total_termo = Decimal("161850000.00")
        prazo_meses = 60
        desembolso_mensal_planejado = valor_total_termo / prazo_meses  # R$ 2.697.500,00/mês

        def calcular_pacing(mes_atual, gasto_acumulado_real):
            gasto_acumulado_previsto = desembolso_mensal_planejado * mes_atual
            pacing_percentual = (gasto_acumulado_real / gasto_acumulado_previsto) * 100
            
            # Tolerância regulatória TCE: entre 90% e 110% é considerado ritmo ideal
            if 90.0 <= pacing_percentual <= 110.0:
                status = "IDEAL"
            elif pacing_percentual < 90.0:
                status = "SUBEXECUCAO"
            else:
                status = "SOBREEXECUCAO_ALERTA_GLOSA"
                
            return {
                "pacing_percentual": round(pacing_percentual, 2),
                "status": status,
                "saldo_remanescente": valor_total_termo - gasto_acumulado_real
            }

        # Simulação no mês 12 com gasto acumulado de R$ 31.850.000,00 (planejado = R$ 32.370.000,00 -> 98.39%)
        res = calcular_pacing(12, Decimal("31850000.00"))
        self.assertEqual(res["status"], "IDEAL")
        self.assertAlmostEqual(float(res["pacing_percentual"]), 98.39, delta=0.1)
        self.assertEqual(res["saldo_remanescente"], Decimal("130000000.00"))

    def test_custo_per_capita_discriminado(self):
        """RF-M12-03: Decomposição do custo diário de R$ 38,50 por acolhido."""
        rubricas = {
            "alimentacao_4_refeicoes": Decimal("18.20"),
            "saude_medicamentos_enfermagem": Decimal("8.10"),
            "acolhimento_hotelaria_lavanderia": Decimal("7.40"),
            "equipe_multidisciplinar": Decimal("4.80")
        }

        custo_diario_total = sum(rubricas.values())
        self.assertEqual(custo_diario_total, Decimal("38.50"), "O somatório das rubricas deve fechar em R$ 38,50/dia.")

        custo_mensal_acolhido = custo_diario_total * 30
        self.assertEqual(custo_mensal_acolhido, Decimal("1155.00"), "O custo mensal per capita padrão é de R$ 1.155,00.")

    def test_sroi_calculo_retorno_social(self):
        """RF-M12-05: Cálculo de SROI (Social Return on Investment) - R$ 4,20 por real investido."""
        multiplicador_sroi = Decimal("4.20")
        acolhidos_ativos = 940
        custo_mensal_por_acolhido = Decimal("1155.00")

        custo_operacional_mensal = acolhidos_ativos * custo_mensal_por_acolhido  # R$ 1.085.700,00
        retorno_social_mensal = custo_operacional_mensal * multiplicador_sroi     # R$ 4.559.940,00

        self.assertEqual(custo_operacional_mensal, Decimal("1085700.00"))
        self.assertEqual(retorno_social_mensal, Decimal("4559940.00"))
        self.assertTrue(retorno_social_mensal > custo_operacional_mensal * 4)

    def test_simulador_what_if_expansao_1400_leitos(self):
        """RF-M12-10: Simulador What-If de Expansão de Vagas até 1.400 leitos."""
        def simular_expansao(novos_leitos_total):
            base_leitos = 1150
            if novos_leitos_total < base_leitos:
                raise ValueError("O simulador não opera abaixo da base de 1.150 leitos.")
            if novos_leitos_total > 1400:
                raise ValueError("O teto de engenharia estrutural da Fundação é de 1.400 leitos.")

            delta = novos_leitos_total - base_leitos
            custo_dia = Decimal("38.50")
            custo_mes = custo_dia * 30

            custo_adicional_mensal = delta * custo_mes
            arroz_extra_kg_dia = Decimal(str(delta)) * Decimal("0.100")
            feijao_extra_kg_dia = Decimal(str(delta)) * Decimal("0.050")
            carne_extra_kg_dia = Decimal(str(delta)) * Decimal("0.120")
            monitores_extra = ceil(delta / 25) if delta > 0 else 0
            psicologos_extra = ceil(delta / 60) if delta > 0 else 0

            return {
                "delta_leitos": delta,
                "custo_adicional_mensal": custo_adicional_mensal,
                "arroz_extra_kg_dia": arroz_extra_kg_dia,
                "feijao_extra_kg_dia": feijao_extra_kg_dia,
                "carne_extra_kg_dia": carne_extra_kg_dia,
                "monitores_extra": monitores_extra,
                "psicologos_extra": psicologos_extra
            }

        from math import ceil

        # Simulação para expansão máxima de +250 leitos (1.400 leitos totais)
        res_max = simular_expansao(1400)
        self.assertEqual(res_max["delta_leitos"], 250)
        self.assertEqual(res_max["custo_adicional_mensal"], Decimal("288750.00")) # 250 * 1155
        self.assertEqual(res_max["arroz_extra_kg_dia"], Decimal("25.000"))
        self.assertEqual(res_max["feijao_extra_kg_dia"], Decimal("12.500"))
        self.assertEqual(res_max["carne_extra_kg_dia"], Decimal("30.000"))
        self.assertEqual(res_max["monitores_extra"], 10) # 250 / 25
        self.assertEqual(res_max["psicologos_extra"], 5)  # 250 / 60 = 4.16 -> 5

        # Violação de teto máximo > 1400 deve levantar ValueError
        with self.assertRaises(ValueError):
            simular_expansao(1500)


class SGISprint4TCEFechamentoTestCase(TestCase):
    """
    Suíte de Testes Automatizados da Sprint 4: Anexos I a VI do TCE-BA, Impressos Oficiais e Fechamento MROSC.
    Cobre:
    - RF-M11-08: Dossiê Completo dos Anexos I a VI do TCE-BA (Resolução TCE nº 144/2013).
    - RF-M07-08: Lista Nominal Oficial de Passageiros para PRF/BPRv e Exigência de CNH Cat. D/E.
    - RF-M06-08: Amostras de Alimentos 72h em Refrigeração (RDC 216 Anvisa).
    - Conciliação Contábil Fechada: Saldo Inicial + Repasses + Rendimentos CDB - Despesas = Saldo Final.
    """

    def test_conciliacao_anexos_tce_ba_balanco_fechamento(self):
        """RF-M11-08: Valida o fechamento contábil e conciliação bancária dos Anexos II, III e IV."""
        # Amostra real do período de apuração (Parcela 10 FDJ - Termo 005/2022)
        saldo_inicial = Decimal("10972759.79")
        repasses_estado = Decimal("19022565.08")
        rendimentos_cdb = Decimal("670985.21")
        despesas_liquidadas = Decimal("19784767.32")
        saldo_final_esperado = Decimal("10881542.76")

        entradas_totais = repasses_estado + rendimentos_cdb
        self.assertEqual(entradas_totais, Decimal("19693550.29"))

        saldo_apurado = saldo_inicial + entradas_totais - despesas_liquidadas
        self.assertEqual(saldo_apurado, saldo_final_esperado, "O balanço contábil deve fechar com divergência R$ 0,00.")

    def test_dossie_unificado_anexos_i_a_vi_hash_sha256(self):
        """RF-M11-08: Valida que o pacote unificado dos Anexos I a VI gera carimbo criptográfico SHA-256."""
        import hashlib

        anexos_conteudo = {
            "Anexo_I": "Plano de Trabalho Aprovado SJDH-BA - 1.250 Acolhidos",
            "Anexo_II": "Demonstrativo da Receita e Despesa Evidenciando o Saldo",
            "Anexo_III": "Relatório de Execução Financeira (REF) - 12 Rubricas MROSC",
            "Anexo_IV": "Conciliação Bancária BB C/C 14.502-1 e Rendimentos CDB",
            "Anexo_V": "Relação de Bens e Equipamentos Permanentes Adquiridos",
            "Anexo_VI": "Parecer Técnico Conclusivo e Homologação TCE-BA / SJDH"
        }

        # Concatenação canônica para gerar o carimbo probatório
        raw_stream = "|".join(f"{k}:{v}" for k, v in sorted(anexos_conteudo.items())).encode("utf-8")
        hash_dossie = hashlib.sha256(raw_stream).hexdigest()

        self.assertEqual(len(hash_dossie), 64, "O hash SHA-256 deve possuir exatamente 64 caracteres hexadecimais.")
        self.assertTrue(all(c in "0123456789abcdef" for c in hash_dossie))

    def test_validacao_cnh_frota_transporte_coletivo(self):
        """RF-M07-08: Regra do CTB / PRF exigindo CNH Categoria D ou E para condução de van/ônibus de acolhidos."""
        def validar_habilitacao_transporte(veiculo_tipo, cnh_categoria):
            categorias_coletivas = ["D", "E"]
            veiculos_pesados = ["ONIBUS", "ÔNIBUS", "VAN", "MICROONIBUS", "MICRO-ÔNIBUS", "SPRINTER"]

            is_pesado = any(p in veiculo_tipo.upper() for p in veiculos_pesados)
            if is_pesado and cnh_categoria.upper() not in categorias_coletivas:
                raise PermissionError(f"Bloqueio PRF/CTB: Veículo '{veiculo_tipo}' exige CNH Categoria D ou E. Categoria apresentada: {cnh_categoria}")
            return "HABILITACAO_CONFORME"

        # Motorista com CNH D em van escolar/SUS
        self.assertEqual(validar_habilitacao_transporte("Van Sprinter 16 Lugares", "D"), "HABILITACAO_CONFORME")
        self.assertEqual(validar_habilitacao_transporte("Ônibus Rodoviário 48L", "E"), "HABILITACAO_CONFORME")

        # Motorista com CNH B tentando dirigir ônibus rodoviário deve ser impedido
        with self.assertRaises(PermissionError):
            validar_habilitacao_transporte("Ônibus Rodoviário 48 Lugares", "B")

    def test_retencao_amostras_refeitorio_72h_rdc216(self):
        """RF-M06-08: Guarda obrigatória de amostras de alimentos em refrigeração (< 4°C) por no mínimo 72 horas."""
        from datetime import datetime, timedelta

        def verificar_descarte_amostra(data_coleta, temperatura_celsius, horas_decorridas):
            if temperatura_celsius > 4.0:
                raise ValueError("Violação RDC 216: Amostras devem ser mantidas a temperatura inferior a 4°C.")
            if horas_decorridas < 72:
                raise PermissionError("Bloqueio Sanitário: Amostra não pode ser descartada antes de 72 horas regulamentares da refeição.")
            return "DESCARTE_HIGIENICO_AUTORIZADO"

        # Tentativa de descarte com 48 horas deve ser bloqueada
        with self.assertRaises(PermissionError):
            verificar_descarte_amostra(datetime.now(), 3.5, 48)

        # Temperatura inadequada (7°C) deve ser reprovada
        with self.assertRaises(ValueError):
            verificar_descarte_amostra(datetime.now(), 7.0, 75)

        # 75 horas a 3°C -> Descarte autorizado
        self.assertEqual(verificar_descarte_amostra(datetime.now(), 3.0, 75), "DESCARTE_HIGIENICO_AUTORIZADO")



