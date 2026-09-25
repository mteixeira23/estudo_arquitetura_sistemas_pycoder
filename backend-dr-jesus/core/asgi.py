"""
Configuração ASGI para o projeto SGI Dr. Jesus (SCSI).
Roteia requisições HTTP normais e conexões WebSocket via Django Channels.
"""
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Inicializa o Django ASGI antes de importar roteadores e consumers
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
import sgi.routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                sgi.routing.websocket_urlpatterns
            )
        )
    ),
})
