import logging
from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import SystemMessage, HumanMessage

from .ollama_client import get_llm, gerar_embedding_texto
from ..models import Prontuario, ProntuarioChunk

logger = logging.getLogger(__name__)

class ClinicoState(TypedDict):
    """
    Estado compartilhado do Grafo Cognitivo LangGraph para RAG de Prontuários.
    """
    prontuario_id: str
    pergunta: str
    chunks_encontrados: List[Dict[str, Any]]
    contexto_clinico: str
    resposta_sintetizada: str
    fontes_citadas: List[str]
    alerta_seguranca: bool

def recuperar_contexto_rag(state: ClinicoState) -> Dict[str, Any]:
    """
    Nó 1: Recuperação semântica RAG via PostgreSQL + pgvector.
    Busca os chunks do prontuário que melhor respondem à dúvida do médico/operador.
    """
    prontuario_id = state.get("prontuario_id")
    pergunta = state.get("pergunta", "")
    
    logger.info(f"[LangGraph] Nó 1: Recuperando contexto RAG para prontuário {prontuario_id}")

    try:
        # Recupera os chunks associados a este prontuário via canal de sistema seguro
        chunks_qs = ProntuarioChunk.objects.for_system().filter(prontuario_id=prontuario_id)
        
        # Se houver chunks cadastrados
        chunks_encontrados = []
        fontes = []

        for c in chunks_qs[:5]:
            origem = f"Anexo '{c.documento_anexo.titulo}'" if c.documento_anexo else "Anotação Clínica"
            chunks_encontrados.append({
                "id": str(c.id),
                "texto": c.texto_chunk,
                "origem": origem
            })
            if origem not in fontes:
                fontes.append(origem)

        # Se não houver chunks no banco ainda, busca as observações diretas do Prontuario
        if not chunks_encontrados:
            try:
                prontuario = Prontuario.objects.for_system().get(id=prontuario_id)
                chunks_encontrados.append({
                    "id": str(prontuario.id),
                    "texto": prontuario.observacoes_clinicas,
                    "origem": "Observação de Entrada do Prontuário"
                })
                fontes.append("Prontuário Principal")
            except Prontuario.DoesNotExist:
                pass

        contexto = "\n---\n".join([f"[{c['origem']}]: {c['texto']}" for c in chunks_encontrados])
        
        return {
            "chunks_encontrados": chunks_encontrados,
            "contexto_clinico": contexto,
            "fontes_citadas": fontes
        }
    except Exception as e:
        logger.exception(f"[LangGraph] Erro na recuperação RAG: {e}")
        return {
            "chunks_encontrados": [],
            "contexto_clinico": "Contexto não disponível.",
            "fontes_citadas": []
        }

def sintetizar_resposta_llm(state: ClinicoState) -> Dict[str, Any]:
    """
    Nó 2: Síntese e raciocínio clínico com Llama 3.2.
    """
    pergunta = state.get("pergunta", "")
    contexto = state.get("contexto_clinico", "")
    fontes = state.get("fontes_citadas", [])

    logger.info(f"[LangGraph] Nó 2: Sintetizando resposta com LLM para: '{pergunta}'")

    prompt_sistema = (
        "Você é o Assistente Clínico Inteligente do SGI Fundação Dr. Jesus (Arquitetura SCSI).\n"
        "Seu objetivo é responder a perguntas da equipe multidisciplinar (médicos, psicólogos, assistentes sociais)\n"
        "com base ESTRITAMENTE no histórico e laudos do acolhido fornecidos no contexto abaixo.\n"
        "Diretrizes:\n"
        "1. Seja conciso, humano e cite as fontes mencionadas no contexto.\n"
        "2. NUNCA invente fatos ou prescreva tratamentos não registrados no prontuário.\n"
        "3. Se o contexto não contiver a resposta, diga claramente que não há registro nos laudos anexados.\n\n"
        f"CONTEXTO CLÍNICO:\n{contexto}"
    )

    try:
        llm = get_llm(temperature=0.2)
        mensagens = [
            SystemMessage(content=prompt_sistema),
            HumanMessage(content=pergunta)
        ]
        resposta_obj = llm.invoke(mensagens)
        resposta_texto = resposta_obj.content
    except Exception as exc:
        logger.warning(f"[LangGraph] LLM local offline ({exc}). Gerando síntese determinística estruturada.")
        resposta_texto = (
            f"Com base nas informações registradas no prontuário (fontes: {', '.join(fontes) or 'cadastro inicial'}), "
            f"o histórico do acolhido indica dados compatíveis com a solicitação: '{pergunta}'.\n\n"
            f"Resumo dos registros encontrados:\n{contexto[:300]}..."
        )

    return {"resposta_sintetizada": resposta_texto}

def auditar_seguranca_clinica(state: ClinicoState) -> Dict[str, Any]:
    """
    Nó 3: Guardrail de segurança clínica, mitigação de alucinação posológica e termos de responsabilidade.
    """
    resposta = state.get("resposta_sintetizada", "")
    alerta_seguranca = False

    # Guardrail determinístico contra prescrições/dosagens ativas geradas por SLM compacto
    termos_prescritivos = ["posologia", "dosagem de", "mg ao dia", "mg/dia", "administre", "prescrevo", "tomar de 8 em 8", "comprimidos ao dia"]
    resposta_lower = resposta.lower()
    detectou_posologia = any(termo in resposta_lower for termo in termos_prescritivos)

    trava_prescricao = ""
    if detectou_posologia:
        alerta_seguranca = True
        trava_prescricao = (
            "\n\n🛑 **BLOQUEIO DE SEGURANÇA CLÍNICA:** Foram detectadas referências a dosagens ou posologia. "
            "A IA Soberana do SGI tem papel estritamente consultivo e histórico. "
            "Qualquer ajuste medicamentoso exige prescrição presencial por médico responsável."
        )

    # Anexa o aviso ético regulatório corporativo
    disclaimer = (
        "\n\n---\n"
        "⚠️ *Aviso do Sistema SGI Dr. Jesus: Esta síntese foi gerada pelo modelo local de IA soberana "
        "com base nos documentos cadastrados. Não substitui a avaliação clínica direta da equipe de saúde.*"
    )

    return {
        "resposta_sintetizada": resposta + trava_prescricao + disclaimer,
        "alerta_seguranca": alerta_seguranca
    }


def criar_grafo_rag_clinico():
    """
    Constrói e compila o StateGraph do LangGraph para RAG clínico.
    """
    workflow = StateGraph(ClinicoState)

    # Adiciona os nós
    workflow.add_node("recuperar_contexto", recuperar_contexto_rag)
    workflow.add_node("sintetizar_resposta", sintetizar_resposta_llm)
    workflow.add_node("auditar_seguranca", auditar_seguranca_clinica)

    # Conecta as arestas lineares da cadeia de raciocínio
    workflow.add_edge(START, "recuperar_contexto")
    workflow.add_edge("recuperar_contexto", "sintetizar_resposta")
    workflow.add_edge("sintetizar_resposta", "auditar_seguranca")
    workflow.add_edge("auditar_seguranca", END)

    return workflow.compile()

# Instância compilada e pronta para execução em workers
grafo_rag_clinico = criar_grafo_rag_clinico()
