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
