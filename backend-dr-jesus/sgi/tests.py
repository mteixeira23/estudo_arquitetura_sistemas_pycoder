import uuid
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
        self.assertEqual(full_rep["guardians_total"], 9)
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
        self.assertEqual(resultado["guardioes_auditados"], 9)

    def test_hermes_sre_task_is_registered_in_celery_beat_schedule(self):
        """Garante que a patrulha periódica de 6h do Hermes SRE está registrada no CELERY_BEAT_SCHEDULE."""
        from django.conf import settings
        schedule = getattr(settings, "CELERY_BEAT_SCHEDULE", {})
        self.assertIn("patrulha-autonoma-hermes-sre-a-cada-6-horas", schedule)
        entry = schedule["patrulha-autonoma-hermes-sre-a-cada-6-horas"]
        self.assertEqual(entry["task"], "sgi.tasks.patrulha_autonoma_hermes_sre_task")








