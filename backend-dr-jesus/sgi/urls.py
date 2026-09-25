from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PacienteViewSet, 
    ProntuarioViewSet, 
    EstoqueItemViewSet, 
    MovimentacaoEstoqueViewSet, 
    DoacaoViewSet, 
    DocumentoAnexoViewSet,
    PerguntarProntuarioIAView,
    ProntuarioStreamIAView,
    ChatGeralStreamIAView,
    HealthCheckView
)

router = DefaultRouter()
router.register(r'pacientes', PacienteViewSet, basename='paciente')
router.register(r'prontuarios', ProntuarioViewSet, basename='prontuario')
router.register(r'almoxarifado/estoque', EstoqueItemViewSet, basename='estoque')
router.register(r'almoxarifado/movimentacoes', MovimentacaoEstoqueViewSet, basename='movimentacao')
router.register(r'almoxarifado/doacoes', DoacaoViewSet, basename='doacao')
router.register(r'storage/documentos', DocumentoAnexoViewSet, basename='documento')

urlpatterns = [
    # Probe de Saúde do Cluster Docker Swarm / Traefik
    path('health/', HealthCheckView.as_view(), name='health_check'),

    # Rotas dos ViewSets CRUD
    path('', include(router.urls)),

    # Endpoint da Inteligência Artificial Soberana (LangGraph + Ollama via Celery Assíncrono)
    path('ia/prontuario/<uuid:prontuario_id>/perguntar/', PerguntarProntuarioIAView.as_view(), name='ia_perguntar_prontuario'),

    # Endpoints de Streaming Cognitivo em Tempo Real (SSE / ReadableStream conectado ao aiStream.js)
    path('ia/prontuario/<uuid:prontuario_id>/stream/', ProntuarioStreamIAView.as_view(), name='ia_stream_prontuario'),
    path('ia/chat/stream/', ChatGeralStreamIAView.as_view(), name='ia_stream_chat'),
]

