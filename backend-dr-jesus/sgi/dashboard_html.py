"""
HTML Template Generator para o Mission Control Dashboard (SCSI / PycoderBR).
Renderizado pelo Django em /dashboard/ para administradores autenticados.
"""

MISSION_CONTROL_HTML = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SCSI Mission Control — SGI Fundação Dr. Jesus</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛡️</text></svg>">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111827;
      --card-border: #1f2937;
      --card-hover: #1e293b;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --accent: #0ea5e9;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      padding: 1.5rem;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 2rem;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .logo-badge {
      background: linear-gradient(135deg, #0284c7, #0369a1);
      color: #fff;
      padding: 0.6rem 0.9rem;
      border-radius: 10px;
      font-weight: 800;
      letter-spacing: 0.05em;
      font-size: 1.1rem;
      box-shadow: 0 4px 14px rgba(14, 165, 233, 0.3);
    }
    .title h1 {
      font-size: 1.5rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .title p {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
      border: 1px solid transparent;
    }
    .btn-primary {
      background: #0284c7;
      color: #ffffff;
    }
    .btn-primary:hover { background: #0369a1; }
    .btn-secondary {
      background: var(--card-bg);
      color: var(--text);
      border-color: var(--card-border);
    }
    .btn-secondary:hover { background: var(--card-hover); }
    .select {
      background: var(--card-bg);
      color: var(--text);
      border: 1px solid var(--card-border);
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-size: 0.85rem;
    }

    /* Overall Health Banner */
    .health-banner {
      background: linear-gradient(135deg, #0f172a, #1e293b);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      align-items: center;
    }
    .banner-stat {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .stat-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      font-weight: 600;
    }
    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* Pulse Dots */
    .pulse-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
      position: relative;
    }
    .pulse-dot.ok {
      background-color: var(--success);
      box-shadow: 0 0 10px var(--success);
    }
    .pulse-dot.warning {
      background-color: var(--warning);
      box-shadow: 0 0 10px var(--warning);
    }
    .pulse-dot.error {
      background-color: var(--danger);
      box-shadow: 0 0 10px var(--danger);
    }

    /* KPI Highlights */
    .section-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .kpi-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 1rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .kpi-num {
      font-size: 1.75rem;
      font-weight: 800;
      color: #38bdf8;
    }

    /* Components Grid */
    .components-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .component-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: transform 0.15s, border-color 0.15s;
    }
    .component-card:hover {
      border-color: #374151;
      transform: translateY(-2px);
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-title {
      font-size: 0.95rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .badge {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      letter-spacing: 0.05em;
    }
    .badge.ok { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge.warning { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .badge.error { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }

    .card-details {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      font-size: 0.8rem;
      color: #d1d5db;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 0.75rem;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .detail-row .key { color: var(--text-muted); }
    .detail-row .val { font-family: var(--font-mono); font-weight: 500; text-align: right; }

    /* Hardware Progress Bars */
    .prog-bar-container {
      width: 100%;
      height: 8px;
      background: #1f2937;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 0.25rem;
    }
    .prog-bar {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    footer {
      text-align: center;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--card-border);
    }
  </style>
</head>
<body>

  <!-- Header -->
  <header class="header">
    <div class="brand">
      <div class="logo-badge">SCSI</div>
      <div class="title">
        <h1>🛡️ Mission Control — Ecossistema Soberano</h1>
        <p>SGI Fundação Dr. Jesus &bull; Padrão PycoderBR &bull; Produção Hostinger KVM 8</p>
      </div>
    </div>
    <div class="actions">
      <label style="font-size: 0.8rem; color: var(--text-muted);">Auto-Refresh:</label>
      <select id="refreshRate" class="select" onchange="updateRefreshTimer()">
        <option value="0">Desativado</option>
        <option value="5000" selected>A cada 5s</option>
        <option value="15000">A cada 15s</option>
        <option value="30000">A cada 30s</option>
      </select>
      <button class="btn btn-primary" onclick="loadMetrics()">
        <span id="refreshIcon">🔄</span> Atualizar Agora
      </button>
      <a href="/admin/" class="btn btn-secondary">
        ⚙️ Django Admin
      </a>
      <a href="https://www.singulariconsult.com.br" target="_blank" class="btn btn-secondary">
        🌐 Abrir Frontend
      </a>
    </div>
  </header>

  <!-- Health Summary Banner -->
  <section class="health-banner">
    <div class="banner-stat">
      <span class="stat-label">Estado Global do Ecossistema</span>
      <div class="stat-value" id="globalStatus">
        <span class="pulse-dot ok"></span> Conectando...
      </div>
    </div>
    <div class="banner-stat">
      <span class="stat-label">Score de Higidez Técnica</span>
      <div class="stat-value" id="healthScore" style="color: #38bdf8;">--%</div>
    </div>
    <div class="banner-stat">
      <span class="stat-label">Componentes Ativos</span>
      <div class="stat-value" id="componentsRatio">-- / 8</div>
    </div>
    <div class="banner-stat">
      <span class="stat-label">Última Sincronização</span>
      <div class="stat-value" id="lastSync" style="font-size: 1rem; font-family: var(--font-mono); color: var(--text-muted);">
        Aguardando sonda...
      </div>
    </div>
  </section>

  <!-- Business Highlights -->
  <section>
    <div class="section-title">📊 Métricas de Negócio & Base Vetorial (RLS Soberano)</div>
    <div class="kpi-grid">
      <div class="kpi-card">
        <span class="stat-label">Acolhidos Cadastrados</span>
        <span class="kpi-num" id="bizPacientes">--</span>
      </div>
      <div class="kpi-card">
        <span class="stat-label">Prontuários Clínicos</span>
        <span class="kpi-num" id="bizProntuarios">--</span>
      </div>
      <div class="kpi-card">
        <span class="stat-label">Chunks Vetorizados RAG</span>
        <span class="kpi-num" id="bizChunks">--</span>
      </div>
      <div class="kpi-card">
        <span class="stat-label">Operadores & Profissionais</span>
        <span class="kpi-num" id="bizUsers">--</span>
      </div>
    </div>
  </section>

  <!-- Components Grid -->
  <section>
    <div class="section-title">🧩 Sondas de Saúde dos Componentes (9 Camadas Atômicas)</div>
    <div class="components-grid" id="componentsGrid">
      <!-- Injetado dinamicamente via JS -->
      <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 3rem;">
        Carregando sondas do ecossistema...
      </div>
    </div>
  </section>

  <footer>
    <p>SGI Fundação Dr. Jesus &bull; Arquitetura Soberana SCSI &bull; Hostinger VPS KVM 8 (Ubuntu 24.04 LTS) &bull; Cloudflare Full Strict</p>
  </footer>

  <script>
    let timerId = null;

    async function loadMetrics() {
      const btnIcon = document.getElementById("refreshIcon");
      if (btnIcon) btnIcon.style.display = "inline-block";

      try {
        const res = await fetch("/api/dashboard/metrics/", { credentials: "same-origin" });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            window.location.href = "/admin/login/?next=/dashboard/";
            return;
          }
          throw new Error("HTTP " + res.status);
        }
        const data = await res.json();
        renderDashboard(data);
      } catch (err) {
        console.error("Falha ao coletar métricas:", err);
        document.getElementById("globalStatus").innerHTML = '<span class="pulse-dot error"></span> Erro de Conexão';
      }
    }

    function renderDashboard(data) {
      // 1. Resumo Global
      const summary = data.summary || {};
      const score = summary.score_percent || 0;
      document.getElementById("healthScore").innerText = score + "%";
      document.getElementById("componentsRatio").innerText = `${summary.healthy_count || 0} / ${summary.total_components || 8}`;
      
      const st = data.overall_status || "healthy";
      let statusHtml = '';
      if (st === "healthy") {
        statusHtml = '<span class="pulse-dot ok"></span> 100% Saudável';
      } else if (st === "warning") {
        statusHtml = '<span class="pulse-dot warning"></span> Alerta Operacional';
      } else {
        statusHtml = '<span class="pulse-dot error"></span> Degradação Parcial';
      }
      document.getElementById("globalStatus").innerHTML = statusHtml;

      const dateStr = data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
      document.getElementById("lastSync").innerText = dateStr;

      // 2. Dados de Negócio
      const biz = data.business || {};
      document.getElementById("bizPacientes").innerText = biz.pacientes_count ?? '--';
      document.getElementById("bizProntuarios").innerText = biz.prontuarios_count ?? '--';
      document.getElementById("bizChunks").innerText = `${biz.rag_chunks_embedded_count ?? biz.rag_chunks_count ?? '--'} / ${biz.rag_chunks_count ?? '--'}`;
      document.getElementById("bizUsers").innerText = biz.users_count ?? '--';

      // 3. Grid de Componentes
      const grid = document.getElementById("componentsGrid");
      grid.innerHTML = "";

      const components = data.components || [];
      components.forEach(comp => {
        const card = document.createElement("div");
        card.className = "component-card";

        const statusClass = comp.status === "ok" ? "ok" : (comp.status === "warning" ? "warning" : "error");
        const statusLabel = comp.status === "ok" ? "Operacional" : (comp.status === "warning" ? "Atenção" : "Falha");

        let detailsHtml = '';
        const details = comp.details || {};

        // Renderização especial para VPS (barras de progresso)
        if (comp.category === "infrastructure" && details.ram_percent !== undefined) {
          detailsHtml = `
            <div class="detail-row"><span class="key">CPU Load (1m/5m):</span><span class="val">${details.cpu_load_1m} / ${details.cpu_load_5m}</span></div>
            <div style="margin-top: 0.35rem;">
              <div class="detail-row"><span class="key">Memória RAM:</span><span class="val">${details.ram_used_gb} GB / ${details.ram_total_gb} GB (${details.ram_percent}%)</span></div>
              <div class="prog-bar-container"><div class="prog-bar" style="width: ${details.ram_percent}%; background: ${details.ram_percent > 85 ? 'var(--danger)' : '#0ea5e9'};"></div></div>
            </div>
            <div style="margin-top: 0.35rem;">
              <div class="detail-row"><span class="key">Disco NVMe:</span><span class="val">${details.disk_used_gb} GB / ${details.disk_total_gb} GB (${details.disk_percent}%)</span></div>
              <div class="prog-bar-container"><div class="prog-bar" style="width: ${details.disk_percent}%; background: ${details.disk_percent > 85 ? 'var(--danger)' : '#10b981'};"></div></div>
            </div>
          `;
        } else {
          for (const [k, v] of Object.entries(details)) {
            if (k === "installed_models" && Array.isArray(v)) {
              detailsHtml += `<div class="detail-row"><span class="key">Modelos:</span><span class="val">${v.join(", ")}</span></div>`;
            } else if (k === "workers" && Array.isArray(v)) {
              detailsHtml += `<div class="detail-row"><span class="key">Workers:</span><span class="val">${v.length} ativos</span></div>`;
            } else if (k !== "missing_models" && k !== "required_models") {
              const formattedKey = k.replace(/_/g, " ").replace(/\\b\\w/g, l => l.toUpperCase());
              detailsHtml += `<div class="detail-row"><span class="key">${formattedKey}:</span><span class="val">${v}</span></div>`;
            }
          }
        }

        const latencyHtml = comp.latency_ms ? `<span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${comp.latency_ms} ms</span>` : '';

        card.innerHTML = `
          <div class="card-top">
            <div class="card-title">
              <span class="pulse-dot ${statusClass}"></span>
              <span>${comp.name}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              ${latencyHtml}
              <span class="badge ${statusClass}">${statusLabel}</span>
            </div>
          </div>
          <div class="card-details">
            ${detailsHtml}
          </div>
        `;
        grid.appendChild(card);
      });
    }

    function updateRefreshTimer() {
      if (timerId) clearInterval(timerId);
      const val = parseInt(document.getElementById("refreshRate").value, 10);
      if (val > 0) {
        timerId = setInterval(loadMetrics, val);
      }
    }

    // Inicialização ao carregar
    loadMetrics();
    updateRefreshTimer();
  </script>
</body>
</html>
"""
