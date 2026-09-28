import os
import logging
from celery import shared_task


logger = logging.getLogger(__name__)

@shared_task(name="sgi.tasks.ping_operacional")
def ping_operacional():
    """
    Task de healthcheck operacional do Celery (Fila default).
    """
    logger.info("[Celery Operacional] Ping executado com sucesso.")
    return {"status": "ok", "service": "celery_default"}


@shared_task(name="sgi.tasks.limpar_sessoes_e_tokens_expirados_task")
def limpar_sessoes_e_tokens_expirados_task():
    """
    Higienização periódica de sessões e tokens expirados (LGPD / Segurança).
    Executada diariamente via Celery Beat.
    """
    from django.core.management import call_command
    logger.info("[Celery Beat] Iniciando limpeza de sessões órfãs e tokens expirados...")
    try:
        call_command('clearsessions')
        logger.info("[Celery Beat] clearsessions concluído com sucesso.")
    except Exception as e:
        logger.warning(f"[Celery Beat] Falha em clearsessions: {e}")

    try:
        call_command('flushexpiredtokens')
        logger.info("[Celery Beat] flushexpiredtokens concluído com sucesso.")
    except Exception as e:
        logger.warning(f"[Celery Beat] Falha em flushexpiredtokens: {e}")

    return {"status": "ok", "message": "Higienização de sessões e tokens concluída"}


@shared_task(name="sgi.tasks.verificar_validade_medicamentos_task")
def verificar_validade_medicamentos_task():
    """
    Auditoria periódica de medicamentos e itens com validade próxima (Farmácia / Estoque).
    Executada diariamente via Celery Beat.
    """
    from datetime import date, timedelta
    from sgi.models import EstoqueItem

    limite = date.today() + timedelta(days=30)
    try:
        itens_vencendo = EstoqueItem.objects.for_system().filter(validade__isnull=False, validade__lte=limite)
        total = itens_vencendo.count()
        logger.info(f"[Celery Beat] Auditoria de estoque: {total} itens com validade em até 30 dias.")
        return {"status": "ok", "itens_vencendo_count": total}
    except Exception as e:
        logger.warning(f"[Celery Beat] Falha ao verificar estoque: {e}")
        return {"status": "warning", "error": str(e)}


@shared_task(name="sgi.tasks.recalcular_metricas_ecossistema_task")
def recalcular_metricas_ecossistema_task():
    """
    Recalcula e pré-aquece o cache de telemetria do Mission Control a cada 5 minutos.
    """
    try:
        from sgi.ecosystem import EcosystemMetricsService
        report = EcosystemMetricsService.get_full_report()
        logger.info(f"[Celery Beat] Telemetria atualizada: status global={report.get('overall_status')}")
        return {"status": "ok", "overall_status": report.get("overall_status")}
    except Exception as e:
        logger.warning(f"[Celery Beat] Falha na telemetria periódica: {e}")
        return {"status": "error", "error": str(e)}


@shared_task(name="sgi.tasks.verificar_integridade_hashes_anexos_task")
def verificar_integridade_hashes_anexos_task():
    """
    Auditoria periódica de custódia e integridade criptográfica SHA-256 dos anexos hospitalares (Item 6).
    Detecta corrupção silenciosa de disco (bit-rot) ou adulteração não autorizada.
    Executada semanalmente via Celery Beat.
    """
    import hashlib
    import os
    from sgi.models import DocumentoAnexo, AuditLog

    logger.info("[Celery Beat] Iniciando auditoria de integridade criptográfica SHA-256 dos anexos...")
    anexos = DocumentoAnexo.objects.for_system().all()
    total = anexos.count()
    integros = 0
    divergentes = 0
    ausentes = 0

    for anexo in anexos:
        if not anexo.arquivo:
            continue

        try:
            caminho_arquivo = anexo.arquivo.path
            if not os.path.exists(caminho_arquivo):
                logger.warning(f"[Custódia Alerta] Anexo {anexo.id} ausente no disco: {caminho_arquivo}")
                ausentes += 1
                continue

            hasher = hashlib.sha256()
            with open(caminho_arquivo, "rb") as f:
                for chunk in iter(lambda: f.read(65536), b""):
                    hasher.update(chunk)
            hash_calculado = hasher.hexdigest()

            if anexo.hash_sha256 and hash_calculado != anexo.hash_sha256:
                divergentes += 1
                logger.critical(
                    f"[ALERTA DE VIOLAÇÃO FORENSE] Anexo {anexo.id} com hash divergente! "
                    f"Esperado: {anexo.hash_sha256} | Calculado: {hash_calculado}"
                )
                AuditLog.registrar(
                    usuario=None,
                    acao=AuditLog.AcaoChoices.EXPORT,
                    recurso="DocumentoAnexo",
                    recurso_id=str(anexo.id),
                    detalhes={
                        "alerta": "TAMPER_DETECTED_HASH_MISMATCH",
                        "hash_esperado": anexo.hash_sha256,
                        "hash_calculado": hash_calculado
                    }
                )
            else:
                integros += 1
        except Exception as e:
            logger.warning(f"[Custódia] Erro ao auditar anexo {anexo.id}: {e}")

    logger.info(
        f"[Celery Beat] Auditoria concluída: {total} total | "
        f"{integros} íntegros | {divergentes} divergentes | {ausentes} ausentes."
    )
    return {
        "status": "ok" if divergentes == 0 else "alert",
        "total_auditados": total,
        "integros": integros,
        "divergentes": divergentes,
        "ausentes": ausentes
    }


@shared_task(name="sgi.tasks.patrulha_autonoma_hermes_sre_task")
def patrulha_autonoma_hermes_sre_task():
    """
    Patrulha Periódica Autônoma do Hermes Agent (Nous Research) — Fase 4.
    Executada a cada 6 horas via Celery Beat.
    Audita todos os 10 guardiões de container e dispara alertas proativos caso
    seja detectada qualquer anomalia crítica ou degradação de SLA.
    """
    from sgi.ai.hermes_sre import executar_diagnostico_hermes
    from django.core.mail import send_mail
    from django.conf import settings
    from sgi.models import AuditLog

    logger.info("[Hermes SRE Patrol] Iniciando patrulha periódica autônoma do cluster...")
    resultado = executar_diagnostico_hermes(
        comando="Patrulha periódica autônoma de SRE",
        modo="full"
    )

    status_geral = resultado.get("status_geral", "OPERACIONAL")
    score_saude = resultado.get("score_saude", 100)
    recomendacoes = resultado.get("recomendacoes", [])
    sintese = resultado.get("sintese_executiva", "")
    alerta_disparado = False

    # Dispara alerta ativo se houver degradação de saúde ou status de atenção
    if status_geral != "OPERACIONAL" or score_saude < 80:
        alerta_disparado = True
        logger.warning(
            f"[Hermes SRE Alerta] Degradação detectada! Status: {status_geral} | Score: {score_saude}%"
        )

        destinatario = os.environ.get("ALERT_EMAIL_RECIPIENT", "admin@singulariconsult.com.br")
        assunto = f"[ALERTA HERMES SRE] Anomalia detectada no cluster ({status_geral} - Score: {score_saude}%)"
        corpo = (
            f"Prezada equipe de Engenharia e SRE,\n\n"
            f"O Hermes Agent (Nous Research) detectou uma anomalia durante a patrulha periódica:\n\n"
            f"{sintese}\n\n"
            f"Acesse o Mission Control Dashboard para aplicar as recomendações (Human-in-the-Loop):\n"
            f"https://api.singulariconsult.com.br/dashboard/\n\n"
            f"--\n"
            f"Hermes Agent SRE • SGI Fundação Dr. Jesus • Padrão SCSI PycoderBR"
        )

        try:
            send_mail(
                subject=assunto,
                message=corpo,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[destinatario],
                fail_silently=True
            )
            logger.info(f"[Hermes SRE Alerta] E-mail de incidente despachado para {destinatario}.")
        except Exception as exc:
            logger.error(f"[Hermes SRE Alerta] Falha ao despachar e-mail de alerta: {exc}")

        # 2. Despacho de Webhook Instantâneo (Telegram, Discord, Slack, n8n, etc.)
        webhook_url = os.environ.get("SRE_ALERT_WEBHOOK_URL", "").strip()
        webhook_disparado = False
        if webhook_url:
            try:
                import json
                import urllib.request

                if "discord.com" in webhook_url:
                    webhook_data = {
                        "content": f"🚨 **[ALERTA HERMES SRE]** Anomalia detectada no cluster! Status: `{status_geral}` | Score: `{score_saude}%`",
                        "embeds": [{
                            "title": f"Laudo Pericial Hermes SRE — Status: {status_geral}",
                            "description": sintese[:1800],
                            "color": 15158332 if status_geral == "CRÍTICO" else 15844367,
                            "url": "https://api.singulariconsult.com.br/dashboard/",
                            "footer": {"text": "SGI Fundação Dr. Jesus • Padrão SCSI PycoderBR"}
                        }]
                    }
                else:
                    webhook_data = {
                        "text": (
                            f"🚨 *[ALERTA HERMES SRE]* Anomalia detectada no cluster ({status_geral} - Score: {score_saude}%)\n\n"
                            f"{sintese[:800]}\n\n"
                            f"🔗 Painel de Controle: https://api.singulariconsult.com.br/dashboard/"
                        ),
                        "status": status_geral,
                        "score": score_saude,
                        "orquestrador": "Hermes Agent (Nous Research)",
                        "dashboard_url": "https://api.singulariconsult.com.br/dashboard/"
                    }

                req = urllib.request.Request(
                    webhook_url,
                    data=json.dumps(webhook_data).encode("utf-8"),
                    headers={
                        "Content-Type": "application/json",
                        "User-Agent": "SCSI-Hermes-SRE-Alert/1.0"
                    },
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=4.0) as resp:
                    if resp.status in (200, 204):
                        webhook_disparado = True
                        logger.info(f"[Hermes SRE Alerta] Webhook despachado com sucesso (HTTP {resp.status}).")
            except Exception as exc:
                logger.error(f"[Hermes SRE Alerta] Falha ao despachar webhook: {exc}")

        # Registra o incidente na trilha forense do AuditLog
        try:
            AuditLog.registrar(
                usuario=None,
                acao=AuditLog.AcaoChoices.EXPORT,
                recurso="HermesSREAlert",
                recurso_id="auto-patrol-incident",
                detalhes={
                    "alerta": "INCIDENTE_SRE_CLUSTER",
                    "score_saude": score_saude,
                    "status_geral": status_geral,
                    "recomendacoes": recomendacoes,
                    "webhook_disparado": webhook_disparado
                }
            )
        except Exception as exc:
            logger.warning(f"[Hermes SRE Alerta] Falha ao registrar log de incidente: {exc}")

    return {
        "status": "ok",
        "score_saude": score_saude,
        "status_geral": status_geral,
        "alerta_disparado": alerta_disparado,
        "webhook_disparado": webhook_disparado if alerta_disparado else False,
        "guardioes_auditados": len(resultado.get("telemetria", {}))
    }


@shared_task(name="sgi.tasks.gerar_relatorio_mensal_conformidade_sre_task")
def gerar_relatorio_mensal_conformidade_sre_task():
    """
    Gera o Relatório Executivo Mensal de SLA & Conformidade Médica (CFM / SUS / Lei 13.787).
    Executada no 1º dia de cada mês via Celery Beat às 01:00 UTC.
    """
    from .actions import EcosystemActionsService
    logger.info("[Celery Beat] Iniciando consolidação do Relatório Executivo Mensal de SLA & Conformidade...")
    res = EcosystemActionsService.generate_monthly_compliance_report(enviar_alertas=True)
    logger.info("[Celery Beat] Relatório Executivo Mensal concluído: %s", res.get("message"))
    return res

