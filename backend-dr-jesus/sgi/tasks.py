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
