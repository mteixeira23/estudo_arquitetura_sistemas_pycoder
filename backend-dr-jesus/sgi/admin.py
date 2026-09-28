from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Paciente, 
    Prontuario, 
    ProntuarioChunk, 
    EstoqueItem, 
    MovimentacaoEstoque, 
    Doacao, 
    DocumentoAnexo
)

# Customização do Cabeçalho e Título do Django Admin
admin.site.site_header = format_html(
    '<span>SGI Fundação Dr. Jesus &nbsp;|&nbsp; '
    '<a href="/dashboard/" style="background:#0284c7; color:#fff; padding:4px 10px; border-radius:6px; text-decoration:none; font-size:12px; font-weight:bold;">'
    '🚀 Mission Control (Cockpit)</a></span>'
)
admin.site.site_title = "SGI Dr. Jesus Admin"
admin.site.index_title = "Governança do Ecossistema & Cadastros Soberanos"


@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = ('nome_completo', 'cpf', 'data_nascimento', 'owner', 'created_at')
    search_fields = ('nome_completo', 'cpf')
    list_filter = ('created_at',)

    def get_queryset(self, request):
        if request.user.is_superuser:
            return Paciente.objects.for_system()
        return Paciente.objects.for_user(request.user)


@admin.register(Prontuario)
class ProntuarioAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'owner', 'created_at')
    search_fields = ('paciente__nome_completo', 'observacoes_clinicas')
    list_filter = ('created_at',)

    def get_queryset(self, request):
        if request.user.is_superuser:
            return Prontuario.objects.for_system()
        return Prontuario.objects.for_user(request.user)


@admin.register(ProntuarioChunk)
class ProntuarioChunkAdmin(admin.ModelAdmin):
    list_display = ('prontuario', 'chunk_index', 'tem_embedding', 'created_at')
    list_filter = ('created_at',)

    def tem_embedding(self, obj):
        return bool(obj.embedding is not None)
    tem_embedding.boolean = True
    tem_embedding.short_description = "Vetorizado (768d)"

    def get_queryset(self, request):
        return ProntuarioChunk.objects.for_system()


@admin.register(EstoqueItem)
class EstoqueItemAdmin(admin.ModelAdmin):
    list_display = ('item', 'categoria', 'saldo_atual', 'unidade', 'owner')
    list_filter = ('categoria',)
    search_fields = ('item', 'categoria')

    def get_queryset(self, request):
        if request.user.is_superuser:
            return EstoqueItem.objects.all()
        return EstoqueItem.objects.filter(owner=request.user)


@admin.register(MovimentacaoEstoque)
class MovimentacaoEstoqueAdmin(admin.ModelAdmin):
    list_display = ('data', 'tipo', 'item_nome', 'quantidade', 'unidade', 'responsavel')
    list_filter = ('tipo', 'data')
    search_fields = ('item_nome', 'responsavel')


@admin.register(Doacao)
class DoacaoAdmin(admin.ModelAdmin):
    list_display = ('doador_nome', 'tipo', 'quantidade', 'data_recebimento', 'destino')
    list_filter = ('tipo', 'data_recebimento')
    search_fields = ('doador_nome', 'item_descricao')


@admin.register(DocumentoAnexo)
class DocumentoAnexoAdmin(admin.ModelAdmin):
    list_display = ('nome_original', 'tipo_mime', 'tamanho_bytes', 'processado_ia', 'owner', 'created_at')
    list_filter = ('processado_ia', 'tipo_mime')
    search_fields = ('nome_original',)
