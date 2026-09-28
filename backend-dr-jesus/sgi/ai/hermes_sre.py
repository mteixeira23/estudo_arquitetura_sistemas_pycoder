"""
Orquestrador de SRE & AIOps do Hermes Agent (hermes_sre.py)
Padrão SCSI PycoderBR — SGI Fundação Dr. Jesus

Implementa o grafo de decisão cognitiva no LangGraph liderado pelo
Hermes Agent (Nous Research) com Tool Calling para os 10 guardiões de container.
"""

import logging
import time
from typing import TypedDict, List, Dict, Any, Optional
from datetime import datetime, timezone

from langgraph.graph import StateGraph, START, END
from langchain_core.messages import SystemMessage, HumanMessage

from .ollama_client import get_llm
from .sre_tools import (
    inspect_database_guardian,
    inspect_rabbitmq_guardian,
    inspect_redis_guardian,
    inspect_celery_guardian,
    inspect_traefik_guardian,
    inspect_frontend_guardian,
    inspect_django_guardian,
    inspect_ollama_guardian,
    inspect_security_guardian,
    inspect_full_cluster_sre
)

logger = logging.getLogger(__name__)


# ==============================================================================
# ESTADO DO GRAFO COGNITIVO SRE (LangGraph)
# ==============================================================================
class HermesSREState(TypedDict):
    """
    Estado compartilhado do Grafo SRE conduzido pelo Hermes Agent.
    """
    comando: str
    modo: str
    guardioes_selecionados: List[str]
    dados_coletados: Dict[str, Any]
    score_saude: int
    status_geral: str
    sintese_executiva: str
    recomendacoes: List[str]


# ==============================================================================
# NÓS DO GRAFO DE DECISÃO SRE
# ==============================================================================
def planejar_inspecoes_node(state: HermesSREState) -> Dict[str, Any]:
    """
    Nó 1: Análise de intenção e seleção de quais guardiões de container acionar.
    """
    cmd = (state.get("comando") or "").lower().strip()
    modo = state.get("modo", "auto")

    # Mapeamento semântico de palavras-chave para guardiões
    selected = []
    if "banco" in cmd or "postgres" in cmd or "sql" in cmd or "hnsw" in cmd:
        selected.append("database")
    if "fila" in cmd or "rabbitmq" in cmd or "amqp" in cmd or "dlq" in cmd:
        selected.append("rabbitmq")
    if "cache" in cmd or "redis" in cmd or "memoria" in cmd or "ram" in cmd:
        selected.append("redis")
    if "celery" in cmd or "tarefa" in cmd or "beat" in cmd or "crontab" in cmd:
        selected.append("celery")
    if "traefik" in cmd or "ingress" in cmd or "proxy" in cmd or "ssl" in cmd:
        selected.append("traefik")
    if "front" in cmd or "react" in cmd or "nginx" in cmd or "ui" in cmd:
        selected.append("frontend")
    if "django" in cmd or "api" in cmd or "backend" in cmd or "daphne" in cmd:
        selected.append("django")
    if "ia" in cmd or "ollama" in cmd or "tensor" in cmd or "llm" in cmd:
        selected.append("ollama")
    if "seguran" in cmd or "audit" in cmd or "lgpd" in cmd or "forense" in cmd:
        selected.append("security")

    # Se nenhum for específico ou se modo for 'full'/'geral', ativa o cluster completo
    if modo == "full" or not selected or "geral" in cmd or "completo" in cmd or "cluster" in cmd:
        selected = [
            "database", "rabbitmq", "redis", "celery",
            "traefik", "frontend", "django", "ollama", "security"
        ]

    logger.info(f"[Hermes SRE] Planejamento concluído. Guardiões ativados: {selected}")
    return {"guardioes_selecionados": selected}


def executar_guardioes_node(state: HermesSREState) -> Dict[str, Any]:
    """
    Nó 2: Tool Calling — Execução das ferramentas de inspeção dos guardiões selecionados.
    """
    selected = state.get("guardioes_selecionados", [])
    collected: Dict[str, Any] = {}

    tools_map = {
        "database": inspect_database_guardian,
        "rabbitmq": inspect_rabbitmq_guardian,
        "redis": inspect_redis_guardian,
        "celery": inspect_celery_guardian,
        "traefik": inspect_traefik_guardian,
        "frontend": inspect_frontend_guardian,
        "django": inspect_django_guardian,
        "ollama": inspect_ollama_guardian,
        "security": inspect_security_guardian,
    }

    healthy_count = 0
    warning_count = 0
    critical_count = 0

    for key in selected:
        fn = tools_map.get(key)
        if fn:
            report = fn()
            collected[key] = report
            st = report.get("status", "healthy")
            if st == "healthy":
                healthy_count += 1
            elif st == "warning":
                warning_count += 1
            else:
                critical_count += 1

    total = len(collected) if collected else 1
    score = int(round((healthy_count + (warning_count * 0.5)) / total * 100))
    status_geral = "OPERACIONAL" if critical_count == 0 else "ATENÇÃO"

    logger.info(f"[Hermes SRE] Coleta concluída. Score: {score}%, Status: {status_geral}")
    return {
        "dados_coletados": collected,
        "score_saude": score,
        "status_geral": status_geral
    }


def sintetizar_laudo_node(state: HermesSREState) -> Dict[str, Any]:
    """
    Nó 3: Síntese executiva do laudo técnico gerada pelo Hermes Agent.
    Usa o modelo local no Ollama se disponível, ou fallback estruturado determinístico de alta fidelidade.
    """
    score = state.get("score_saude", 100)
    status_geral = state.get("status_geral", "OPERACIONAL")
    collected = state.get("dados_coletados", {})
    comando = state.get("comando", "Auditoria Geral")

    # Gera recomendações automáticas com base nos diagnósticos
    recs = []
    for g_key, g_data in collected.items():
        st = g_data.get("status")
        if st in ("warning", "critical"):
            recs.append(f"[{g_data.get('guardian', g_key).upper()}] {g_data.get('diagnosis')}")

    if not recs:
        recs.append("Todos os containers e subsistemas operam dentro das tolerâncias ideais de SLA/SLO.")

    # Constrói o resumo factual
    sumario_linhas = [
        f"🛡️ LAUDO EXECUTIVO HERMES AGENT (Nous Research) — SRE AIOps",
        f"• Status Geral: {status_geral} | Score de Saúde: {score}%",
        f"• Comando Auditado: \"{comando}\"",
        f"• Timestamp: {datetime.now(timezone.utc).strftime('%d/%m/%Y %H:%M:%S UTC')}",
        "",
        "📊 Telemetria dos Guardiões por Container:"
    ]

    for key, data in collected.items():
        g_name = data.get("guardian", key)
        g_status = data.get("status", "ok").upper()
        g_lat = data.get("latency_ms", 0.0)
        g_diag = data.get("diagnosis", "")
        sumario_linhas.append(f"  [{g_status}] {g_name} ({g_lat}ms): {g_diag}")

    sumario_linhas.append("")
    sumario_linhas.append("💡 Recomendações Técnicas (Human-in-the-Loop):")
    for r in recs:
        sumario_linhas.append(f"  - {r}")

    sintese_final = "\n".join(sumario_linhas)

    # Tenta enriquecer a síntese com a LLM local se acessível
    try:
        llm = get_llm(model="llama3.2:3b", temperature=0.2)
        prompt_sys = SystemMessage(
            content=(
                "Você é o Hermes Agent (Nous Research), Chief SRE Leader do ecossistema SGI Fundação Dr. Jesus. "
                "Com base no relatório factual de telemetria dos guardiões de container abaixo, gere um laudo executivo "
                "técnico, preciso, em português, destacando a higidez dos serviços e recomendações pontuais."
            )
        )
        prompt_human = HumanMessage(content=sintese_final)
        resp = llm.invoke([prompt_sys, prompt_human])
        if resp and resp.content:
            sintese_final = resp.content.strip()
    except Exception as exc:
        logger.info(f"[Hermes SRE] LLM local em standby/fallback ({exc}). Retornando laudo determinístico estruturado.")

    return {
        "sintese_executiva": sintese_final,
        "recomendacoes": recs
    }


# ==============================================================================
# COMPILAÇÃO DO GRAFO LANGGRAPH
# ==============================================================================
def build_hermes_sre_graph():
    graph = StateGraph(HermesSREState)
    graph.add_node("planejar", planejar_inspecoes_node)
    graph.add_node("executar", executar_guardioes_node)
    graph.add_node("sintetizar", sintetizar_laudo_node)

    graph.add_edge(START, "planejar")
    graph.add_edge("planejar", "executar")
    graph.add_edge("executar", "sintetizar")
    graph.add_edge("sintetizar", END)

    return graph.compile()


_HERMES_GRAPH = None

def get_hermes_sre_graph():
    global _HERMES_GRAPH
    if _HERMES_GRAPH is None:
        _HERMES_GRAPH = build_hermes_sre_graph()
    return _HERMES_GRAPH


# ==============================================================================
# ENTRADA DE EXECUÇÃO PÚBLICA
# ==============================================================================
def executar_diagnostico_hermes(comando: str = "Auditoria geral do ecossistema", modo: str = "auto", user=None, request=None) -> Dict[str, Any]:
    """
    Ponto de entrada público para invocar o Hermes Agent SRE.
    Registra trilha no AuditLog para rastreabilidade e compliance.
    """
    t0 = time.perf_counter()
    graph = get_hermes_sre_graph()

    initial_state: HermesSREState = {
        "comando": comando,
        "modo": modo,
        "guardioes_selecionados": [],
        "dados_coletados": {},
        "score_saude": 0,
        "status_geral": "OPERACIONAL",
        "sintese_executiva": "",
        "recomendacoes": []
    }

    final_state = graph.invoke(initial_state)
    elapsed = round((time.perf_counter() - t0) * 1000, 2)

    # Rastreabilidade forense LGPD / CFM
    if user and user.is_authenticated:
        try:
            from sgi.models import AuditLog
            AuditLog.registrar(
                usuario=user,
                acao=AuditLog.AcaoChoices.IA_QUERY,
                recurso="HermesSRE",
                recurso_id="sre-patrol",
                detalhes={
                    "comando": comando[:200],
                    "score": final_state.get("score_saude"),
                    "status": final_state.get("status_geral"),
                    "guardioes_count": len(final_state.get("dados_coletados", {}))
                },
                request=request
            )
        except Exception as exc:
            logger.warning(f"[Hermes SRE] Falha ao registrar AuditLog: {exc}")

    return {
        "status": "sucesso",
        "orquestrador": "Hermes Agent (Nous Research)",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "elapsed_ms": elapsed,
        "score_saude": final_state.get("score_saude"),
        "status_geral": final_state.get("status_geral"),
        "guardioes_acionados": final_state.get("guardioes_selecionados", []),
        "sintese_executiva": final_state.get("sintese_executiva"),
        "recomendacoes": final_state.get("recomendacoes"),
        "telemetria": final_state.get("dados_coletados")
    }
