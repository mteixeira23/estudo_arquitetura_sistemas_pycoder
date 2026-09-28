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
