import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser

logger = logging.getLogger(__name__)

class RealtimeEventsConsumer(AsyncWebsocketConsumer):
    """
    Consumer WebSocket com autenticação in-band JWT e isolamento de tópicos (LGPD).
    
    Blindagens da Sabatina 3.3:
    - Autenticação sem expor JWT na query string da URL (in-band handshake).
    - Assinatura granular de tópicos com validação de permissão.
    - Suporte a ping/pong para manter a conexão ativa contra timeouts de borda (Cloudflare 100s).
    """
    PUBLIC_GROUP = "sgi_realtime_events"

    async def connect(self):
        self.user = AnonymousUser()
        self.subscribed_topics = set()

        # Permite a conexão inicial em modo anônimo (aguarda frame de autenticação)
        await self.accept()
        logger.info(f"[Realtime WebSocket] Conexão aberta: {self.channel_name}")

        # Mensagem inicial orientando o cliente
        await self.send(text_data=json.dumps({
            "type": "connection_established",
            "message": "Conectado ao SGI Realtime. Envie o frame de autenticação para tópicos privados."
        }))

    async def disconnect(self, close_code):
        # Remove dos tópicos assinados
        for topic in self.subscribed_topics:
            await self.channel_layer.group_discard(f"sgi_{topic}", self.channel_name)
        
        await self.channel_layer.group_discard(self.PUBLIC_GROUP, self.channel_name)
        logger.info(f"[Realtime WebSocket] Desconectado: {self.channel_name} (code: {close_code})")

    async def receive(self, text_data=None, bytes_data=None):
        try:
            data = json.loads(text_data) if text_data else {}
            msg_type = data.get("type", "ping")

            # 1. Heartbeat Ping / Pong contra timeout de borda (Cloudflare)
            if msg_type == "ping":
                await self.send(text_data=json.dumps({"type": "pong"}))
                return

            # 2. Autenticação in-band com SimpleJWT (sem vazar token em logs de URL)
            elif msg_type == "authenticate":
                token = data.get("token")
                user = await self.authenticate_token(token)
                if user and user.is_authenticated:
                    self.user = user
                    await self.send(text_data=json.dumps({
                        "type": "authenticated",
                        "user": user.username
                    }))
                else:
                    await self.send(text_data=json.dumps({
                        "type": "error",
                        "message": "Token JWT inválido ou expirado."
                    }))
                return

            # 3. Assinatura de Tópicos Granulares com Controle de Acesso
            elif msg_type == "subscribe":
                topic = data.get("topic")
                if not topic:
                    return

                # Tópicos sensíveis (ex: pacientes, prontuarios) exigem autenticação
                is_sensitive = any(s in topic for s in ["paciente", "prontuario", "financeiro"])
                if is_sensitive and not self.user.is_authenticated:
                    await self.send(text_data=json.dumps({
                        "type": "error",
                        "message": f"Acesso negado ao tópico '{topic}'. Autenticação requerida."
                    }))
                    return

                await self.channel_layer.group_add(f"sgi_{topic}", self.channel_name)
                self.subscribed_topics.add(topic)
                await self.send(text_data=json.dumps({
                    "type": "subscribed",
                    "topic": topic
                }))

        except Exception as e:
            logger.error(f"[Realtime WebSocket] Erro ao processar frame: {e}")

    async def broadcast_event(self, event):
        """
        Despacha eventos de mutação para o cliente.
        """
        payload = event.get("payload", {})
        await self.send(text_data=json.dumps(payload))

    @database_sync_to_async
    def authenticate_token(self, token_str):
        if not token_str:
            return AnonymousUser()
        try:
            from rest_framework_simplejwt.tokens import AccessToken
            from django.contrib.auth import get_user_model
            User = get_user_model()
            access_token = AccessToken(token_str)
            user_id = access_token.get("user_id")
            return User.objects.get(id=user_id)
        except Exception as err:
            logger.warning("[Realtime WebSocket] Falha na validação do token JWT: %s", err)
            return AnonymousUser()
