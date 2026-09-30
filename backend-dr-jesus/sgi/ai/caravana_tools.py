"""
Módulo de Ferramentas de Auditoria Cognitiva da Caravana SJDH Bahia (caravana_tools.py)
Padrão SCSI PycoderBR — SGI Fundação Dr. Jesus & Caravana de Direitos Humanos

Implementa as 3 ferramentas de Tool Calling para o Hermes Agent (Nous Research):
1. audit_orcamento_caravana(): Cruzamento orçado vs realizado e alertas de teto por rubrica.
2. check_metas_plano_trabalho(): Auditoria de caravanas e cobertura dos 27 territórios de identidade.
3. export_dossie_executivo_pdf(): Geração autônoma de laudos e dossiês executivos consolidados.
"""

import os
import time
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from decimal import Decimal

from django.conf import settings
from django.db import connections

logger = logging.getLogger(__name__)


def _decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError


# ==============================================================================
# 1. TOOL CALLING: AUDITORIA ORÇAMENTÁRIA (Orçado vs. Realizado)
# ==============================================================================
def audit_orcamento_caravana(ano: Optional[int] = None, mes: Optional[str] = None) -> Dict[str, Any]:
    """
    Audita as rubricas orçamentárias do projeto Caravana de Direitos Humanos.
    Cruza orcamento_detalhado (planejado) com lancamentos (executado),
    calculando saldos remanescentes e sinalizando desvios acima do teto pactuado.
    """
    t0 = time.perf_counter()
    report = {
        "tool": "audit_orcamento_caravana",
        "guardian": "caravana_financial_expert",
        "status": "healthy",
        "latency_ms": 0.0,
        "ano_referencia": ano or "Todos",
        "mes_referencia": mes or "Todos",
        "metricas_globais": {
            "total_orcado": 0.0,
            "total_realizado": 0.0,
            "saldo_remanescente": 0.0,
            "percentual_execucao": 0.0,
            "total_lancamentos": 0,
        },
        "desvios_criticos": [],
        "rubricas_principais": [],
        "diagnosis": ""
    }

    try:
        conn = connections['caravana']
        with conn.cursor() as cursor:
            # 1. Total Realizado (lancamentos)
            query_realizado = """
                SELECT 
                    COALESCE(grupo_item, 'Geral') as grupo,
                    COALESCE(item, 'Não especificado') as item_nome,
                    COUNT(*) as qtd_lancamentos,
                    SUM(realizado) as valor_total
                FROM public.lancamentos
                WHERE (%s IS NULL OR ano = %s)
                  AND (%s IS NULL OR mes ILIKE %s)
                GROUP BY grupo_item, item
                ORDER BY valor_total DESC;
            """
            cursor.execute(query_realizado, [ano, ano, mes, mes])
            rows_realizado = cursor.fetchall()

            total_realizado = Decimal("0.00")
            realizado_por_grupo: Dict[str, Decimal] = {}
            for grupo, item_nome, qtd, valor in rows_realizado:
                val = Decimal(str(valor or 0))
                total_realizado += val
                realizado_por_grupo[grupo] = realizado_por_grupo.get(grupo, Decimal("0.00")) + val

            # 2. Total Orçado (orcamento_detalhado)
            query_orcado = """
                SELECT 
                    COALESCE(categoria_principal, 'Geral') as categoria,
                    item_nome,
                    SUM(COALESCE(valor_subtotal, 0)) as total_orcado
                FROM public.orcamento_detalhado
                WHERE ativo = true
                  AND (%s IS NULL OR ano = %s)
                  AND (%s IS NULL OR mes ILIKE %s)
                GROUP BY categoria_principal, item_nome
                ORDER BY total_orcado DESC;
            """
            cursor.execute(query_orcado, [ano, ano, mes, mes])
            rows_orcado = cursor.fetchall()

            total_orcado = Decimal("0.00")
            orcado_por_categoria: Dict[str, Decimal] = {}
            for cat, item_nome, valor in rows_orcado:
                val = Decimal(str(valor or 0))
                total_orcado += val
                orcado_por_categoria[cat] = orcado_por_categoria.get(cat, Decimal("0.00")) + val

            # Se orcamento_detalhado não tiver registros para o filtro, tenta orcamento_total_projeto
            if total_orcado == 0:
                try:
                    cursor.execute("SELECT COALESCE(SUM(valor_total_projeto), 0) FROM public.orcamento_total_projeto;")
                    row_t = cursor.fetchone()
                    if row_t and row_t[0]:
                        total_orcado = Decimal(str(row_t[0]))
                except Exception as exc_total:
                    logger.warning(f"Fallback orcamento_total_projeto: {exc_total}")

            # Cálculos e consolidação
            saldo = total_orcado - total_realizado
            pct_exec = float(round((total_realizado / total_orcado * 100), 2)) if total_orcado > 0 else 0.0

            cursor.execute("SELECT count(*) FROM public.lancamentos WHERE (%s IS NULL OR ano = %s);", [ano, ano])
            count_lancamentos = cursor.fetchone()[0]

            report["metricas_globais"]["total_orcado"] = float(total_orcado)
            report["metricas_globais"]["total_realizado"] = float(total_realizado)
            report["metricas_globais"]["saldo_remanescente"] = float(saldo)
            report["metricas_globais"]["percentual_execucao"] = pct_exec
            report["metricas_globais"]["total_lancamentos"] = count_lancamentos

            # Detalhamento e alertas de estouro por grupo
            desvios = []
            rubricas = []
            todos_grupos = set(list(realizado_por_grupo.keys()) + list(orcado_por_categoria.keys()))
            for g in sorted(todos_grupos):
                orc = float(orcado_por_categoria.get(g, Decimal("0.00")))
                real = float(realizado_por_grupo.get(g, Decimal("0.00")))
                sub_saldo = orc - real
                pct = round((real / orc * 100), 1) if orc > 0 else (100.0 if real > 0 else 0.0)

                item_resumo = {
                    "grupo": g,
                    "orcado": orc,
                    "realizado": real,
                    "saldo": sub_saldo,
                    "percentual": pct
                }
                rubricas.append(item_resumo)

                if pct > 100.0:
                    desvios.append({
                        "grupo": g,
                        "gravidade": "CRÍTICO",
                        "motivo": f"Execução acima do teto orçado ({pct}%). Estouro de R$ {abs(sub_saldo):,.2f}.",
                        "acao_recomendada": "Remanejamento orçamentário emergencial ou contenção de despesas."
                    })
                elif pct >= 85.0:
                    desvios.append({
                        "grupo": g,
                        "gravidade": "ALERTA",
                        "motivo": f"Consumo orçamentário elevado ({pct}%). Restam apenas R$ {sub_saldo:,.2f}.",
                        "acao_recomendada": "Supervisão direta das próximas autorizações de despesa."
                    })

            report["rubricas_principais"] = rubricas[:10]
            report["desvios_criticos"] = desvios

            if any(d["gravidade"] == "CRÍTICO" for d in desvios):
                report["status"] = "warning"
                report["diagnosis"] = (
                    f"Auditoria Orçamentária: {len(desvios)} rubricas em estado de alerta/estouro. "
                    f"Execução global de {pct_exec}% com saldo de R$ {saldo:,.2f}."
                )
            else:
                report["status"] = "healthy"
                report["diagnosis"] = (
                    f"Orçamento sob estrito controle: Execução global de {pct_exec}% "
                    f"(R$ {total_realizado:,.2f} de R$ {total_orcado:,.2f}). Saldo preservado."
                )

    except Exception as exc:
        logger.error(f"[audit_orcamento_caravana] Erro ao auditar: {exc}", exc_info=True)
        report["status"] = "critical"
        report["diagnosis"] = f"Falha na conexão com banco caravana_db: {str(exc)}"
        report["error"] = str(exc)

    report["latency_ms"] = round((time.perf_counter() - t0) * 1000, 2)
    return report


# ==============================================================================
# 2. TOOL CALLING: AUDITORIA DE METAS E TERRITÓRIOS DE IDENTIDADE
# ==============================================================================
def check_metas_plano_trabalho(ano: Optional[int] = None) -> Dict[str, Any]:
    """
    Audita o cumprimento do Plano de Trabalho do Convênio SJDH Bahia.
    Avalia a realização de caravanas nos 27 territórios de identidade da Bahia,
    total de cidadãos/participantes atendidos e conformidade de metas.
    """
    t0 = time.perf_counter()
    report = {
        "tool": "check_metas_plano_trabalho",
        "guardian": "caravana_operations_expert",
        "status": "healthy",
        "latency_ms": 0.0,
        "ano_referencia": ano or "Todos",
        "metricas_operacionais": {
            "total_caravanas_realizadas": 0,
            "total_participantes_atendidos": 0,
            "municipios_visitados": 0,
            "territorios_cobertos": 0,
            "meta_territorios_bahia": 27,
            "percentual_cobertura_territorial": 0.0
        },
        "ultimas_caravanas": [],
        "distribuicao_por_ano": {},
        "diagnosis": ""
    }

    try:
        conn = connections['caravana']
        with conn.cursor() as cursor:
            # 1. Total de Caravanas e Participantes
            query_caravanas = """
                SELECT 
                    COUNT(*) as total_caravanas,
                    COALESCE(SUM(participantes), 0) as total_participantes,
                    COUNT(DISTINCT local) as total_locais
                FROM public.caravanas
                WHERE (%s IS NULL OR ano = %s);
            """
            cursor.execute(query_caravanas, [ano, ano])
            row = cursor.fetchone()
            total_caravanas = row[0] if row else 0
            total_participantes = row[1] if row else 0
            total_locais = row[2] if row else 0

            # 2. Territórios de Identidade
            cursor.execute("SELECT count(*) FROM public.territorios_identidade;")
            row_terr = cursor.fetchone()
            total_territorios_cadastrados = row_terr[0] if row_terr else 27

            # Visitas em territórios
            territorios_visitados = min(total_locais, 27)
            try:
                cursor.execute("""
                    SELECT count(DISTINCT territorio_nome) 
                    FROM public.territorios_identidade_visitas
                    WHERE qtd_municipios_visitados > 0;
                """)
                row_vis = cursor.fetchone()
                if row_vis and row_vis[0] and row_vis[0] > 0:
                    territorios_visitados = row_vis[0]
            except Exception as exc_terr:
                logger.warning(f"Fallback territorios_visitas: {exc_terr}")

            pct_cobertura = round((territorios_visitados / 27.0) * 100, 1)

            report["metricas_operacionais"]["total_caravanas_realizadas"] = total_caravanas
            report["metricas_operacionais"]["total_participantes_atendidos"] = int(total_participantes)
            report["metricas_operacionais"]["municipios_visitados"] = total_locais
            report["metricas_operacionais"]["territorios_cobertos"] = territorios_visitados
            report["metricas_operacionais"]["percentual_cobertura_territorial"] = pct_cobertura

            # 3. Distribuição por ano
            cursor.execute("""
                SELECT ano, COUNT(*), COALESCE(SUM(participantes), 0)
                FROM public.caravanas
                GROUP BY ano
                ORDER BY ano DESC;
            """)
            dist_ano = {}
            for a, count_c, part in cursor.fetchall():
                dist_ano[str(a)] = {"caravanas": count_c, "participantes": int(part)}
            report["distribuicao_por_ano"] = dist_ano

            # 4. Últimas Caravanas
            cursor.execute("""
                SELECT nome, local, mes, ano, COALESCE(participantes, 0), data_inicio
                FROM public.caravanas
                ORDER BY data_inicio DESC NULLS LAST, created_at DESC
                LIMIT 5;
            """)
            ultimas = []
            for nome, local, mes, ano_c, part, d_ini in cursor.fetchall():
                ultimas.append({
                    "nome": nome,
                    "local": local or "Bahia",
                    "periodo": f"{mes}/{ano_c}",
                    "participantes": int(part)
                })
            report["ultimas_caravanas"] = ultimas

            report["diagnosis"] = (
                f"Plano de Trabalho em curso: {total_caravanas} caravanas realizadas em {total_locais} municípios, "
                f"alcançando {total_participantes:,} cidadãos baianos. "
                f"Cobertura territorial de {pct_cobertura}% dos 27 territórios da Bahia."
            )

    except Exception as exc:
        logger.error(f"[check_metas_plano_trabalho] Erro: {exc}", exc_info=True)
        report["status"] = "warning"
        report["diagnosis"] = f"Falha ao auditar metas operacionais: {str(exc)}"
        report["error"] = str(exc)

    report["latency_ms"] = round((time.perf_counter() - t0) * 1000, 2)
    return report


# ==============================================================================
# 3. TOOL CALLING: EXPORTAÇÃO DO DOSSIÊ EXECUTIVO CONSOLIDADO (HTML/PDF)
# ==============================================================================
def export_dossie_executivo_pdf(filtro: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Gera um Dossiê Executivo de Alta Densidade consolidando os dados
    orçamentários, metas operacionais e laudo do Hermes Agent.
    Gera arquivo HTML estilizado com especificações de impressão (CSS Paged Media).
    """
    t0 = time.perf_counter()
    ano = (filtro or {}).get("ano")
    mes = (filtro or {}).get("mes")

    # Coleta cirúrgica dos dois guardiões
    audit_financeira = audit_orcamento_caravana(ano=ano, mes=mes)
    audit_operacional = check_metas_plano_trabalho(ano=ano)

    m_fin = audit_financeira.get("metricas_globais", {})
    m_ops = audit_operacional.get("metricas_operacionais", {})
    desvios = audit_financeira.get("desvios_criticos", [])
    rubricas = audit_financeira.get("rubricas_principais", [])
    caravanas = audit_operacional.get("ultimas_caravanas", [])

    now_str = datetime.now(timezone.utc).strftime("%d/%m/%Y às %H:%M UTC")

    # Geração do HTML rico de alta fidelidade
    html_content = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Dossiê Executivo — Caravana de Direitos Humanos SJDH Bahia</title>
<style>
  @page {{
    size: A4;
    margin: 15mm 15mm 20mm 15mm;
    @bottom-right {{
      content: "Página " counter(page) " de " counter(pages);
      font-size: 8pt;
      color: #64748b;
    }}
    @bottom-left {{
      content: "Soberania de Dados • Fundação Dr. Jesus & SJDH Bahia";
      font-size: 8pt;
      color: #64748b;
    }}
  }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #0f172a;
    line-height: 1.5;
    background: #ffffff;
    margin: 0;
    padding: 20px;
  }}
  .header {{
    border-bottom: 2px solid #0284c7;
    padding-bottom: 12px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}
  .header h1 {{
    margin: 0;
    font-size: 20pt;
    color: #0f172a;
    font-weight: 800;
  }}
  .header p {{
    margin: 4px 0 0;
    font-size: 10pt;
    color: #64748b;
  }}
  .badge-hermes {{
    background: #0284c7;
    color: #ffffff;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 9pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }}
  .kpi-grid {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }}
  .kpi-card {{
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px 14px;
  }}
  .kpi-card .label {{
    font-size: 8.5pt;
    font-weight: 600;
    text-transform: uppercase;
    color: #64748b;
    letter-spacing: 0.5px;
  }}
  .kpi-card .value {{
    font-size: 16pt;
    font-weight: 800;
    color: #0f172a;
    margin-top: 4px;
  }}
  .kpi-card.highlight {{
    background: #eff6ff;
    border-color: #bfdbfe;
  }}
  .kpi-card.highlight .value {{
    color: #1d4ed8;
  }}
  h2 {{
    font-size: 13pt;
    font-weight: 700;
    color: #1e293b;
    border-left: 4px solid #0284c7;
    padding-left: 8px;
    margin: 24px 0 12px;
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 9pt;
    margin-bottom: 20px;
  }}
  th {{
    background: #f1f5f9;
    color: #475569;
    font-weight: 700;
    text-align: left;
    padding: 8px 10px;
    border-bottom: 1px solid #cbd5e1;
  }}
  td {{
    padding: 8px 10px;
    border-bottom: 1px solid #e2e8f0;
  }}
  tr:nth-child(even) td {{
    background: #f8fafc;
  }}
  .text-right {{
    text-align: right;
  }}
  .badge-status {{
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 7.5pt;
    font-weight: 700;
  }}
  .badge-ok {{ background: #dcfce7; color: #166534; }}
  .badge-warn {{ background: #fef3c7; color: #92400e; }}
  .badge-danger {{ background: #fee2e2; color: #991b1b; }}
  .callout {{
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 6px;
    padding: 12px 16px;
    font-size: 9.5pt;
    color: #166534;
    margin-bottom: 20px;
  }}
  .footer {{
    margin-top: 30px;
    padding-top: 12px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    font-size: 8pt;
    color: #94a3b8;
  }}
</style>
</head>
<body>

<div class="header">
  <div>
    <h1>Dossiê Executivo de Gestão & Governança</h1>
    <p>Projeto Caravana de Direitos Humanos • Convênio SJDH / Governo do Estado da Bahia</p>
  </div>
  <div class="badge-hermes">🤖 Hermes Agent SRE</div>
</div>

<div class="callout">
  <strong>Síntese Cognitiva Hermes:</strong> {audit_financeira.get('diagnosis', '')} {audit_operacional.get('diagnosis', '')}
</div>

<div class="kpi-grid">
  <div class="kpi-card highlight">
    <div class="label">Total Orçado</div>
    <div class="value">R$ {m_fin.get('total_orcado', 0):,.2f}</div>
  </div>
  <div class="kpi-card highlight">
    <div class="label">Total Realizado</div>
    <div class="value">R$ {m_fin.get('total_realizado', 0):,.2f}</div>
  </div>
  <div class="kpi-card">
    <div class="label">Saldo Restante</div>
    <div class="value">R$ {m_fin.get('saldo_remanescente', 0):,.2f}</div>
  </div>
  <div class="kpi-card">
    <div class="label">Execução Orçamentária</div>
    <div class="value">{m_fin.get('percentual_execucao', 0)}%</div>
  </div>
</div>

<div class="kpi-grid">
  <div class="kpi-card">
    <div class="label">Caravanas Realizadas</div>
    <div class="value">{m_ops.get('total_caravanas_realizadas', 0)}</div>
  </div>
  <div class="kpi-card">
    <div class="label">Cidadãos Atendidos</div>
    <div class="value">{m_ops.get('total_participantes_atendidos', 0):,}</div>
  </div>
  <div class="kpi-card">
    <div class="label">Municípios Visitados</div>
    <div class="value">{m_ops.get('municipios_visitados', 0)}</div>
  </div>
  <div class="kpi-card">
    <div class="label">Territórios da Bahia</div>
    <div class="value">{m_ops.get('territorios_cobertos', 0)} / 27 ({m_ops.get('percentual_cobertura_territorial', 0)}%)</div>
  </div>
</div>

<h2>📊 Execução Financeira por Rubrica Orçamentária</h2>
<table>
  <thead>
    <tr>
      <th>Grupo / Rubrica</th>
      <th class="text-right">Orçado (R$)</th>
      <th class="text-right">Realizado (R$)</th>
      <th class="text-right">Saldo (R$)</th>
      <th class="text-right">Execução (%)</th>
      <th class="text-right">Status</th>
    </tr>
  </thead>
  <tbody>
"""
    for r in rubricas:
        pct = r.get("percentual", 0)
        badge = "badge-ok" if pct < 85 else ("badge-warn" if pct <= 100 else "badge-danger")
        status_txt = "Normal" if pct < 85 else ("Atenção" if pct <= 100 else "Estouro")
        html_content += f"""
    <tr>
      <td><strong>{r.get('grupo', '')}</strong></td>
      <td class="text-right">{r.get('orcado', 0):,.2f}</td>
      <td class="text-right">{r.get('realizado', 0):,.2f}</td>
      <td class="text-right">{r.get('saldo', 0):,.2f}</td>
      <td class="text-right"><strong>{pct}%</strong></td>
      <td class="text-right"><span class="badge-status {badge}">{status_txt}</span></td>
    </tr>
"""

    html_content += """
  </tbody>
</table>

<h2>📍 Últimas Caravanas & Atendimentos Registrados</h2>
<table>
  <thead>
    <tr>
      <th>Ação / Caravana</th>
      <th>Município / Local</th>
      <th>Período</th>
      <th class="text-right">Público Atendido</th>
    </tr>
  </thead>
  <tbody>
"""
    for c in caravanas:
        html_content += f"""
    <tr>
      <td><strong>{c.get('nome', '')}</strong></td>
      <td>{c.get('local', '')}</td>
      <td>{c.get('periodo', '')}</td>
      <td class="text-right">{c.get('participantes', 0):,}</td>
    </tr>
"""

    html_content += f"""
  </tbody>
</table>

<div class="footer">
  <div>Emitido pelo Maestro SRE Hermes Agent (Nous Research) sob padrão arquitetural SCSI PycoderBR</div>
  <div>Data de Emissão: {now_str} • VPS Hostinger KVM 8</div>
</div>

</body>
</html>
"""

    # Salvamento do artefato HTML em media/dossies
    media_root = getattr(settings, "MEDIA_ROOT", "/tmp")
    out_dir = os.path.join(media_root, "dossies")
    os.makedirs(out_dir, exist_ok=True)
    out_filename = f"dossie_executivo_caravana_{int(time.time())}.html"
    out_path = os.path.join(out_dir, out_filename)

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    elapsed = round((time.perf_counter() - t0) * 1000, 2)
    return {
        "tool": "export_dossie_executivo_pdf",
        "status": "healthy",
        "arquivo_gerado": out_filename,
        "caminho_local": out_path,
        "tamanho_bytes": len(html_content.encode("utf-8")),
        "latency_ms": elapsed,
        "metricas_consolidadas": {
            "total_orcado": m_fin.get("total_orcado", 0),
            "total_realizado": m_fin.get("total_realizado", 0),
            "saldo_remanescente": m_fin.get("saldo_remanescente", 0),
            "total_caravanas": m_ops.get("total_caravanas_realizadas", 0),
            "total_participantes": m_ops.get("total_participantes_atendidos", 0)
        },
        "diagnosis": f"Dossiê Executivo gerado com sucesso em '{out_filename}' ({round(len(html_content)/1024, 1)} KB)."
    }
