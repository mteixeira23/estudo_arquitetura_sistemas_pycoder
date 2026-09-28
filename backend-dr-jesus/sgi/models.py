import uuid6
from django.db import models
from django.conf import settings
from pgvector.django import VectorField, HnswIndex


class SoftDeleteQuerySet(models.QuerySet):
    """
    QuerySet com exclusão lógica universal (Lei Federal nº 13.787/2018 - Guarda Mínima de 20 Anos).
    Intercepta operações em lote como .delete() e converte em update(is_deleted=True, deleted_at=timezone.now()),
    impedindo a purga física via QuerySet.delete() do Django ORM.
    """
    def delete(self):
        from django.utils import timezone
        agora = timezone.now()
        total = self.update(is_deleted=True, deleted_at=agora)
        label = self.model._meta.label if self.model else "sgi.Record"
        return (total, {label: total})

    def hard_delete(self):
        """Exclusão física estritamente controlada caso necessária em expurgos judiciais autorizados."""
        return super().delete()

    def restore(self):
        """Restaura registros excluídos logicamente em lote."""
        return self.update(is_deleted=False, deleted_at=None, deleted_by=None)


class RLSSecurityManager(models.Manager):
    """
    Manager de segurança "Fail Closed" com Soft Delete integrado.
    Impede que um desenvolvedor chame acidentalmente .objects.all() e vaze dados inteiros.
    """
    def get_queryset(self):
        raise PermissionError(
            "Acesso global negado. Proteção RLS ativada: "
            "Você DEVE usar .for_user(user) para realizar consultas seguras."
        )

    def _get_base_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db)

    def none(self):
        # none() é estritamente seguro pois nunca retorna registros do banco
        return self._get_base_queryset().none()

    def create(self, **kwargs):
        if not kwargs.get('owner'):
            raise PermissionError("Criação negada: Você DEVE associar um 'owner' válido para cumprir a segurança RLS.")
        return self._get_base_queryset().create(**kwargs)

    def for_user(self, user, include_deleted=False):
        # Injeta o filtro seguro no SoftDeleteQuerySet
        qs = self._get_base_queryset()
        if not include_deleted:
            qs = qs.filter(is_deleted=False)
        if user and user.is_superuser:
            return qs
        return qs.filter(owner=user)

    def for_system(self, include_deleted=False):
        """
        Acesso restrito e explícito de sistema para pipelines internos (Celery Worker / LangGraph / Streaming).
        Mantém a exigência explícita, preservando o Fail-Closed contra chamadas diretas (.all(), .filter(), etc).
        """
        qs = self._get_base_queryset()
        if not include_deleted:
            qs = qs.filter(is_deleted=False)
        return qs


class BaseModel(models.Model):
    """
    Base canônica SCSI:
    - ID sequencial no tempo com UUIDv7 (sem fragmentação B-Tree no PostgreSQL).
    - RLS Fail-Closed obrigatório via RLSSecurityManager.
    - Owner obrigatório para rastreabilidade e isolamento multi-inquilino.
    - Soft Delete Universal (Lei Federal nº 13.787/2018 - Guarda Mínima de 20 Anos de Prontuários).
    """
    id = models.UUIDField(primary_key=True, default=uuid6.uuid7, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Governança de Exclusão Lógica e Retenção Hospitalar (Lei 13.787/2018)
    is_deleted = models.BooleanField(default=False, db_index=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    deleted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(app_label)s_%(class)s_deleted"
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="%(app_label)s_%(class)s_owned"
    )

    objects = RLSSecurityManager()

    def soft_delete(self, user=None):
        """Exclusão lógica que preserva o registro no PostgreSQL para cumprimento de guarda legal."""
        from django.utils import timezone
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.deleted_by = user
        self.save(update_fields=['is_deleted', 'deleted_at', 'deleted_by', 'updated_at'])

    def delete(self, using=None, keep_parents=False):
        """
        Sobrescreve delete() do Django para impedir exclusão física acidental.
        Garante conformidade com a guarda hospitalar de 20 anos (Lei Federal nº 13.787/2018).
        """
        self.soft_delete()
        return (1, {self._meta.label: 1})

    def restore(self):
        """Restaura o registro excluído logicamente."""
        self.is_deleted = False
        self.deleted_at = None
        self.deleted_by = None
        self.save(update_fields=['is_deleted', 'deleted_at', 'deleted_by', 'updated_at'])

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


# --- Trilha de Auditoria Forense (LGPD Art. 6º, X e Conselho Federal de Medicina) ---

class AuditLog(models.Model):
    """
    Livro-razão append-only de auditoria clínica e de conformidade LGPD.
    Rastreia acessos a prontuários (quem visualizou), consultas à IA (RAG) e exclusões lógicas.
    """
    class AcaoChoices(models.TextChoices):
        VIEW = "VIEW", "Visualização de Prontuário / Acolhido"
        CREATE = "CREATE", "Criação de Registro"
        UPDATE = "UPDATE", "Atualização de Registro"
        SOFT_DELETE = "SOFT_DELETE", "Exclusão Lógica (Soft Delete)"
        IA_QUERY = "IA_QUERY", "Consulta Cognitiva / RAG IA"
        EXPORT = "EXPORT", "Exportação de Dados Clínicos"

    id = models.UUIDField(primary_key=True, default=uuid6.uuid7, editable=False)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs"
    )
    usuario_username = models.CharField(max_length=150, blank=True, null=True)
    acao = models.CharField(max_length=50, choices=AcaoChoices.choices, db_index=True)
    recurso = models.CharField(max_length=100, db_index=True, help_text="Ex: Prontuario, Paciente, DocumentoAnexo, RAG_Context")
    recurso_id = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    detalhes = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Trilha de Auditoria Forense"
        verbose_name_plural = "Trilhas de Auditoria Forense"

    def __str__(self):
        user_str = self.usuario_username or (self.usuario.username if self.usuario else "Sistema")
        return f"[{self.timestamp:%Y-%m-%d %H:%M:%S}] {user_str} -> {self.acao} ({self.recurso} #{self.recurso_id})"

    @classmethod
    def registrar(cls, usuario, acao, recurso, recurso_id=None, detalhes=None, request=None):
        """
        Método seguro e fail-safe para registro de auditoria.
        Nunca interrompe a transação principal em caso de falha de telemetria.
        """
        try:
            ip = None
            ua = None
            user_obj = None
            username = "Sistema"

            if request:
                ip = getattr(request, 'client_ip', None) or request.META.get('REMOTE_ADDR')
                ua = request.META.get('HTTP_USER_AGENT', '')[:500]
                if hasattr(request, 'user') and request.user.is_authenticated:
                    user_obj = request.user
                    username = request.user.username

            if usuario and not user_obj:
                if hasattr(usuario, 'is_authenticated') and usuario.is_authenticated:
                    user_obj = usuario
                    username = usuario.username
                elif isinstance(usuario, str):
                    username = usuario

            return cls.objects.create(
                usuario=user_obj,
                usuario_username=username,
                acao=acao,
                recurso=recurso,
                recurso_id=str(recurso_id) if recurso_id else None,
                detalhes=detalhes or {},
                ip_address=ip,
                user_agent=ua
            )
        except Exception as exc:
            import logging
            logging.getLogger(__name__).warning(f"Falha ao registrar AuditLog ({exc}): {acao} {recurso}")
            return None
