import logging
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db import transaction

logger = logging.getLogger(__name__)

def broadcast_realtime_event(event_type: str, table: str, record: dict, topic: str = None, is_public: bool = False):
    """
    Despacha um evento em tempo real para os WebSockets conectados de forma resiliente.
    
    Blindagens aplicadas da Sabatina 3.3:
    1. Backend: Executado exclusivamente dentro de `transaction.on_commit` para evitar 
       condições de corrida (frontend tentar ler antes do commit no PostgreSQL ou após rollback).
    2. Backend: Protegido por try/except para que indisponibilidade do Redis não derrube a view HTTP.
    3. Arquiteto/LGPD: Dados sensíveis (prontuários, pacientes) NUNCA são jogados no canal global
       a menos que `is_public=True`. Vão estritamente para seus tópicos autorizados (`sgi_{topic}`).
    """
    def _send():
        try:
            channel_layer = get_channel_layer()
            if not channel_layer:
                logger.warning("[Realtime Events] Channel layer não configurado.")
                return

            payload = {
                "event": event_type,
                "table": table,
                "record": record,
            }

            # Envia para tópico granular específico (ex: "almoxarifado", "hospital_1")
            if topic:
                async_to_sync(channel_layer.group_send)(
                    f"sgi_{topic}",
                    {
                        "type": "broadcast_event",
                        "payload": payload,
                    }
                )

            # Canal global restrito a avisos públicos/operacionais
            if is_public:
                async_to_sync(channel_layer.group_send)(
                    "sgi_realtime_events",
                    {
                        "type": "broadcast_event",
                        "payload": payload,
                    }
                )
        except Exception as exc:
            logger.warning("[Realtime Events] Falha não-bloqueante ao emitir evento no Redis: %s", exc)

    # Agenda a emissão para após o commit no banco; se estiver fora de transação ativa, executa diretamente
    transaction.on_commit(_send)
