from rest_framework import serializers
from .models import (
    Paciente, 
    Prontuario, 
    EstoqueItem, 
    MovimentacaoEstoque, 
    Doacao, 
    DocumentoAnexo
)

class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = [
            'id', 'nome_completo', 'cpf', 'data_nascimento', 
            'telefone', 'status_acolhimento', 'leito', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class ProntuarioSerializer(serializers.ModelSerializer):
    paciente_nome = serializers.ReadOnlyField(source='paciente.nome_completo')

    class Meta:
        model = Prontuario
        fields = [
            'id', 'paciente', 'paciente_nome', 'observacoes_clinicas', 
            'data_entrada', 'ativo', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'data_entrada', 'created_at', 'updated_at']

class EstoqueItemSerializer(serializers.ModelSerializer):
    saldo_atual = serializers.ReadOnlyField()

    class Meta:
        model = EstoqueItem
        fields = [
            'id', 'item', 'categoria', 'unidade', 'qtd_inicial', 
            'qtd_entradas', 'qtd_saidas', 'saldo_atual', 
            'validade', 'endereco', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'saldo_atual', 'created_at', 'updated_at']

class MovimentacaoEstoqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovimentacaoEstoque
        fields = [
            'id', 'data', 'tipo', 'tipo_label', 'item', 
            'item_nome', 'quantidade', 'unidade', 'saldo_anterior', 
            'saldo_novo', 'origem_destino', 'responsavel', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'data', 'created_at', 'updated_at']

class DoacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doacao
        fields = [
            'id', 'data', 'doador', 'tipo_entrada', 'item', 
            'categoria', 'quantidade', 'recibo_emitido', 'cnpj', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'data', 'created_at', 'updated_at']

class DocumentoAnexoSerializer(serializers.ModelSerializer):
    arquivo_url = serializers.SerializerMethodField()

    class Meta:
        model = DocumentoAnexo
        fields = [
            'id', 'titulo', 'tipo_documento', 'arquivo', 'arquivo_url',
            'tamanho_bytes', 'mime_type', 'paciente', 'prontuario',
            'status_processamento_ia', 'texto_extraido', 'erro_processamento',
            'hash_sha256', 'processado_em',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'arquivo_url', 'tamanho_bytes', 'mime_type',
            'status_processamento_ia', 'texto_extraido', 'erro_processamento',
            'hash_sha256', 'processado_em', 'created_at', 'updated_at'
        ]

    def get_arquivo_url(self, obj):
        request = self.context.get('request')
        if obj.arquivo and hasattr(obj.arquivo, 'url'):
            if request:
                return request.build_absolute_uri(obj.arquivo.url)
            return obj.arquivo.url
        return None
