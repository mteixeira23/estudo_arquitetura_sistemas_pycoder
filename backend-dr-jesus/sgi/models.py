import uuid6
from django.db import models
from django.conf import settings
from pgvector.django import VectorField, HnswIndex


class RLSSecurityManager(models.Manager):
    """
    Manager de segurança "Fail Closed".
    Impede que um desenvolvedor chame acidentalmente .objects.all() e vaze dados inteiros.
    """
    def get_queryset(self):
        raise PermissionError(
            "Acesso global negado. Proteção RLS ativada: "
            "Você DEVE usar .for_user(user) para realizar consultas seguras."
        )

    def none(self):
        # none() é estritamente seguro pois nunca retorna registros do banco
        return super().get_queryset().none()

    def create(self, **kwargs):
        if not kwargs.get('owner'):
            raise PermissionError("Criação negada: Você DEVE associar um 'owner' válido para cumprir a segurança RLS.")
        return super().get_queryset().create(**kwargs)

    def for_user(self, user):
        # Contornamos nossa própria trava apenas para injetar o filtro seguro
        qs = super().get_queryset()
        if user and user.is_superuser:
            return qs
        return qs.filter(owner=user)

    def for_system(self):
        """
        Acesso restrito e explícito de sistema para pipelines internos (Celery Worker / LangGraph / Streaming).
        Mantém a exigência explícita, preservando o Fail-Closed contra chamadas diretas (.all(), .filter(), etc).
        """
        return super().get_queryset()


class BaseModel(models.Model):
    """
    Base canônica SCSI:
    - ID sequencial no tempo com UUIDv7 (sem fragmentação B-Tree no PostgreSQL).
    - RLS Fail-Closed obrigatório via RLSSecurityManager.
    - Owner obrigatório para rastreabilidade e isolamento multi-inquilino.
    """
    id = models.UUIDField(primary_key=True, default=uuid6.uuid7, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="%(app_label)s_%(class)s_owned"
    )

    objects = RLSSecurityManager()

    class Meta:
        abstract = True

# --- Módulos Cadastrais e Clínicos (Acolhidos / Prontuários) ---

class Paciente(BaseModel):
    nome_completo = models.CharField(max_length=255)
    cpf = models.CharField(max_length=14, unique=True)
    data_nascimento = models.DateField()
    telefone = models.CharField(max_length=20, blank=True, null=True)
    status_acolhimento = models.CharField(max_length=50, default="Acolhido")
    leito = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.nome_completo} ({self.cpf})"

class Prontuario(BaseModel):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name="prontuarios")
    observacoes_clinicas = models.TextField(help_text="Anotações do acolhimento/reabilitação.")
    data_entrada = models.DateField(auto_now_add=True)
    ativo = models.BooleanField(default=True)

    def __str__(self):
        return f"Prontuário de {self.paciente.nome_completo}"

class ProntuarioChunk(BaseModel):
    """
    Preparação para Fase 4 (RAG / Embeddings Ollama).
    Fatia observações clínicas para busca vetorial de alta precisão.
    """
    prontuario = models.ForeignKey(Prontuario, on_delete=models.CASCADE, related_name="chunks")
    documento_anexo = models.ForeignKey('DocumentoAnexo', on_delete=models.SET_NULL, null=True, blank=True, related_name="chunks_vetoriais")
    texto_chunk = models.TextField()
    # Fase 4.2: Embeddings semânticos gerados pelo modelo nomic-embed-text (768 dimensões)
    embedding = VectorField(dimensions=768, null=True, blank=True)

    class Meta:
        indexes = [
            HnswIndex(
                name="chunk_embed_hnsw_idx",
                fields=["embedding"],
                m=16,
                ef_construction=64,
                opclasses=["vector_cosine_ops"],
            )
        ] if 'sqlite' not in settings.DATABASES.get('default', {}).get('ENGINE', '') else []



# --- Módulos Operacionais (Almoxarifado, Estoque e Doações) ---

class EstoqueItem(BaseModel):
    item = models.CharField(max_length=255)
    categoria = models.CharField(max_length=100)
    unidade = models.CharField(max_length=20, default="kg")
    qtd_inicial = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    qtd_entradas = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    qtd_saidas = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    validade = models.DateField(null=True, blank=True)
    endereco = models.CharField(max_length=255, blank=True, null=True)

    @property
    def saldo_atual(self):
        return self.qtd_inicial + self.qtd_entradas - self.qtd_saidas

    def __str__(self):
        return f"{self.item} [{self.categoria}] - Saldo: {self.saldo_atual} {self.unidade}"

class MovimentacaoEstoque(BaseModel):
    data = models.DateTimeField(auto_now_add=True)
    tipo = models.CharField(max_length=20, choices=[("entrada", "Entrada"), ("saida", "Saída")])
    tipo_label = models.CharField(max_length=100)
    item = models.ForeignKey(EstoqueItem, on_delete=models.CASCADE, related_name="movimentacoes")
    item_nome = models.CharField(max_length=255)
    quantidade = models.DecimalField(max_digits=12, decimal_places=2)
    unidade = models.CharField(max_length=20)
    saldo_anterior = models.DecimalField(max_digits=12, decimal_places=2)
    saldo_novo = models.DecimalField(max_digits=12, decimal_places=2)
    origem_destino = models.CharField(max_length=255)
    responsavel = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.tipo.upper()}: {self.item_nome} ({self.quantidade} {self.unidade})"

class Doacao(BaseModel):
    data = models.DateTimeField(auto_now_add=True)
    doador = models.CharField(max_length=255)
    tipo_entrada = models.CharField(max_length=100, default="Doação Recebida")
    item = models.CharField(max_length=255)
    categoria = models.CharField(max_length=100)
    quantidade = models.DecimalField(max_digits=12, decimal_places=2)
    recibo_emitido = models.BooleanField(default=False)
    cnpj = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"Doação de {self.doador} - {self.item} ({self.quantidade})"

# --- Storage Soberano de Arquivos (Substituindo Supabase Storage) ---

class DocumentoAnexo(BaseModel):
    """
    Substituto Soberano do Supabase Storage.
    Persiste arquivos físicos em volume seguro e rastreia metadados no banco.
    """
    titulo = models.CharField(max_length=255)
    tipo_documento = models.CharField(
        max_length=50, 
        choices=[
            ("laudo", "Laudo Médico"),
            ("termo", "Termo de Acolhimento"),
            ("identidade", "Documento de Identidade"),
            ("receita", "Receita Médica"),
            ("foto", "Foto Cadastral"),
            ("outro", "Outro Anexo")
        ],
        default="outro"
    )
    arquivo = models.FileField(upload_to="documentos/%Y/%m/")
    tamanho_bytes = models.BigIntegerField(default=0)
    mime_type = models.CharField(max_length=100, blank=True, null=True)
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, null=True, blank=True, related_name="documentos")
    prontuario = models.ForeignKey(Prontuario, on_delete=models.CASCADE, null=True, blank=True, related_name="documentos")

    # --- Blindagens de IA (Auditoria Fase 3 / Engenheiro de IA) ---
    class StatusProcessamentoIA(models.TextChoices):
        PENDENTE = "PENDENTE", "Pendente"
        PROCESSANDO = "PROCESSANDO", "Processando"
        CONCLUIDO = "CONCLUIDO", "Concluído"
        ERRO = "ERRO", "Erro"

    status_processamento_ia = models.CharField(
        max_length=20, 
        choices=StatusProcessamentoIA.choices, 
        default=StatusProcessamentoIA.PENDENTE,
        db_index=True
    )
    texto_extraido = models.TextField(blank=True, null=True, help_text="Texto extraído via OCR / parser de PDF para indexação RAG")
    erro_processamento = models.TextField(blank=True, null=True)
    hash_sha256 = models.CharField(max_length=64, blank=True, null=True, db_index=True)
    processado_em = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.titulo} ({self.tipo_documento}) - IA: {self.status_processamento_ia}"
