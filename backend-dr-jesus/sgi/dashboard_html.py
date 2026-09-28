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

    /* Toast Notifications (Fase 3) */
    .toast-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .toast {
      background: #1e293b;
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 0.75rem 1.25rem;
      color: #fff;
      font-size: 0.85rem;
      box-shadow: 0 4px 14px rgba(0,0,0,0.5);
      animation: slideIn 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .toast.success { border-color: var(--success); }
    .toast.error { border-color: var(--danger); }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    /* Architecture Blueprint Map Section */
    .arch-section {
      margin-top: 2.5rem;
      margin-bottom: 2rem;
    }
    .blueprint-card {
      background: linear-gradient(145deg, #0b1120, #0d1527);
      border: 1px solid #1e293b;
      border-radius: 16px;
      padding: 1.75rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
    }
    .blueprint-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, #f97316, #0284c7, #10b981, #8b5cf6, #ec4899);
    }
    .blueprint-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #1e293b;
    }
    .blueprint-title-wrap h2 {
      font-size: 1.35rem;
      font-weight: 700;
      color: #f8fafc;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .blueprint-title-wrap p {
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }
    .blueprint-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .bp-badge {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      border: 1px solid transparent;
      letter-spacing: 0.02em;
    }
    .bp-badge-cf { background: rgba(249, 115, 22, 0.12); color: #fb923c; border-color: rgba(249, 115, 22, 0.3); }
    .bp-badge-ssl { background: rgba(16, 185, 129, 0.12); color: #34d399; border-color: rgba(16, 185, 129, 0.3); }
    .bp-badge-swarm { background: rgba(2, 132, 199, 0.12); color: #38bdf8; border-color: rgba(2, 132, 199, 0.3); }
    .bp-badge-ia { background: rgba(139, 92, 246, 0.12); color: #a78bfa; border-color: rgba(139, 92, 246, 0.3); }
    .bp-badge-db { background: rgba(59, 130, 246, 0.12); color: #60a5fa; border-color: rgba(59, 130, 246, 0.3); }

    /* Map Layout Grid */
    .arch-grid {
      display: grid;
      grid-template-columns: 280px 1fr 300px;
      gap: 1.25rem;
      align-items: stretch;
    }
    @media (max-width: 1200px) {
      .arch-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Node Box Base */
    .node-box {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 1rem;
      position: relative;
      transition: all 0.2s ease;
    }
    .node-box:hover {
      border-color: #38bdf8;
      box-shadow: 0 4px 16px rgba(14, 165, 233, 0.15);
      transform: translateY(-2px);
    }
    .node-head {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 0.5rem;
    }
    .node-icon {
      font-size: 1.25rem;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .node-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: #f1f5f9;
    }
    .node-subtitle {
      font-size: 0.72rem;
      color: var(--text-muted);
    }
    .node-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
      margin-top: 0.6rem;
    }
    .node-tag {
      font-size: 0.68rem;
      font-family: var(--font-mono);
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      background: #1e293b;
      color: #cbd5e1;
    }

    /* Flow Connectors */
    .flow-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.35rem 0;
      color: #38bdf8;
      font-size: 0.75rem;
      font-weight: 600;
      gap: 0.1rem;
    }
    .flow-arrow-down {
      width: 2px;
      height: 18px;
      background: linear-gradient(180deg, #0284c7, #38bdf8);
      position: relative;
    }
    .flow-arrow-down::after {
      content: "";
      position: absolute;
      bottom: -4px;
      left: -3px;
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid #38bdf8;
    }

    /* Column Specifics */
    .arch-col-traffic {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .node-user { border-left: 4px solid #0284c7; }
    .node-cf { border-left: 4px solid #f97316; }
    .node-ssl { border-left: 4px solid #10b981; }
    .node-dev { border-left: 4px solid #8b5cf6; }
    .node-git { border-left: 4px solid #e2e8f0; }

    /* VPS Swarm Central Frame */
    .vps-frame {
      background: rgba(15, 23, 42, 0.65);
      border: 2px dashed #0284c7;
      border-radius: 14px;
      padding: 1.25rem;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .vps-badge-top {
      position: absolute;
      top: -12px;
      left: 1.25rem;
      background: #0284c7;
      color: #ffffff;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.2rem 0.75rem;
      border-radius: 6px;
      letter-spacing: 0.04em;
      box-shadow: 0 2px 8px rgba(2, 132, 199, 0.4);
    }
    .vps-networks {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      font-size: 0.7rem;
      font-family: var(--font-mono);
      color: #94a3b8;
    }
    .net-pill {
      background: #1e293b;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      border: 1px solid #334155;
    }

    /* Core Microservices Grid */
    .services-subgrid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.85rem;
    }
    @media (max-width: 768px) {
      .services-subgrid {
        grid-template-columns: 1fr;
      }
    }
    .node-traefik { border-top: 3px solid #0284c7; }
    .node-django { border-top: 3px solid #10b981; grid-column: 1 / -1; }
    .node-rabbitmq { border-top: 3px solid #f97316; }
    .node-celery { border-top: 3px solid #16a34a; }
    .node-beat { border-top: 3px solid #38bdf8; }
    .node-redis { border-top: 3px solid #ef4444; }
    .node-postgres { border-top: 3px solid #2563eb; grid-column: 1 / -1; }

    /* AI Sovereign Frame */
    .ai-frame {
      background: rgba(88, 28, 135, 0.08);
      border: 1px solid #7c3aed;
      border-radius: 14px;
      padding: 1.1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      position: relative;
    }
    .ai-badge-top {
      background: #7c3aed;
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      display: inline-block;
      align-self: flex-start;
      margin-bottom: 0.25rem;
    }
    .node-ollama { border-left: 4px solid #a855f7; }
    .node-model { border-left: 4px solid #c084fc; }
    .node-embed { border-left: 4px solid #818cf8; }
    .node-hermes { border-left: 4px solid #ec4899; }

    /* Bottom Panels: Legend & Benefits */
    .arch-bottom-panel {
      margin-top: 1.5rem;
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 1.25rem;
      border-top: 1px solid #1e293b;
      padding-top: 1.25rem;
    }
    @media (max-width: 900px) {
      .arch-bottom-panel {
        grid-template-columns: 1fr;
      }
    }
    .legend-box {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 1rem;
    }
    .legend-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .legend-items {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.75rem;
      color: #cbd5e1;
    }
    .legend-indicator {
      width: 12px;
      height: 12px;
      border-radius: 3px;
    }
    .ind-http { background: #0284c7; }
    .ind-amqp { background: #f97316; }
    .ind-celery { background: #10b981; }
    .ind-sql { background: #2563eb; }
    .ind-redis { background: #ef4444; }
    .ind-ia { background: #8b5cf6; }
    .ind-git { background: #94a3b8; }

    .benefits-box {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 1rem;
    }
    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
    }
    .benefit-card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 0.75rem;
      transition: all 0.2s;
    }
    .benefit-card:hover {
      border-color: #38bdf8;
      background: #131d33;
    }
    .benefit-head {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      font-weight: 700;
      color: #f8fafc;
      margin-bottom: 0.25rem;
    }
    .benefit-desc {
      font-size: 0.72rem;
      color: #94a3b8;
      line-height: 1.35;
    }

    /* Hermes SRE Section (Fase 5) */
    .hermes-section {
      margin-bottom: 2rem;
    }
    .hermes-card {
      background: linear-gradient(135deg, rgba(24, 24, 37, 0.95), rgba(15, 23, 42, 0.95));
      border: 1px solid rgba(236, 72, 153, 0.35);
      border-radius: 14px;
      padding: 1.25rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
    }
    .hermes-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .hermes-title-wrap {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .hermes-icon {
      font-size: 1.8rem;
      background: rgba(236, 72, 153, 0.15);
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      border: 1px solid rgba(236, 72, 153, 0.4);
    }
    .hermes-badge {
      background: linear-gradient(135deg, #ec4899, #be185d);
      color: #fff;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.55rem;
      border-radius: 999px;
      letter-spacing: 0.03em;
    }
    .hermes-badge-sub {
      background: rgba(14, 165, 233, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(14, 165, 233, 0.4);
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.15rem 0.55rem;
      border-radius: 999px;
    }
    .btn-hermes {
      background: linear-gradient(135deg, #ec4899, #be185d);
      color: #ffffff;
      box-shadow: 0 2px 10px rgba(236, 72, 153, 0.35);
      border: none;
    }
    .btn-hermes:hover {
      background: linear-gradient(135deg, #f472b6, #db2777);
      transform: translateY(-1px);
    }
    .hermes-controls {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 0.85rem;
    }
    .hermes-input-group {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .hermes-input {
      flex: 1;
      min-width: 260px;
      background: #090d16;
      border: 1px solid #334155;
      color: #f1f5f9;
      padding: 0.5rem 0.85rem;
      border-radius: 8px;
      font-size: 0.85rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .hermes-input:focus {
      border-color: #ec4899;
    }
    .hermes-quick-buttons {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
    }
    .btn-chip {
      background: #1e293b;
      border: 1px solid #334155;
      color: #cbd5e1;
      border-radius: 6px;
      padding: 0.25rem 0.6rem;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-chip:hover {
      background: #334155;
      color: #f8fafc;
      border-color: #0ea5e9;
    }
    .hermes-terminal {
      background: #030712;
      border: 1px solid #1f2937;
      border-radius: 10px;
      overflow: hidden;
      font-family: var(--font-mono);
      margin-top: 1rem;
    }
    .terminal-bar {
      background: #111827;
      padding: 0.5rem 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      border-bottom: 1px solid #1f2937;
    }
    .terminal-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .terminal-dot.red { background: #ef4444; }
    .terminal-dot.yellow { background: #f59e0b; }
    .terminal-dot.green { background: #10b981; }
    .terminal-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: #cbd5e1;
      margin-left: 0.5rem;
    }
    .terminal-time {
      font-size: 0.7rem;
      color: #64748b;
      margin-left: auto;
    }
    .terminal-body {
      padding: 1rem;
      font-size: 0.8rem;
      color: #e2e8f0;
      line-height: 1.6;
      white-space: pre-wrap;
      max-height: 350px;
      overflow-y: auto;
    }
    .recs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 0.6rem;
    }
    .rec-card {
      background: rgba(236, 72, 153, 0.08);
      border-left: 3px solid #ec4899;
      padding: 0.6rem 0.8rem;
      border-radius: 6px;
      font-size: 0.78rem;
      color: #f1f5f9;
    }
    .guardians-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 0.75rem;
    }
    .guardian-card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.2s;
    }
    .guardian-card:hover {
      border-color: #38bdf8;
      background: #131d33;
    }
    .guardian-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.4rem;
    }
    .guardian-name {
      font-size: 0.8rem;
      font-weight: 700;
      color: #f1f5f9;
    }
    .guardian-role {
      font-size: 0.68rem;
      color: #94a3b8;
    }
    .guardian-meta {
      font-size: 0.7rem;
      color: #cbd5e1;
      font-family: var(--font-mono);
      margin: 0.4rem 0;
    }
    .guardian-btn {
      width: 100%;
      background: #1e293b;
      border: 1px solid #334155;
      color: #cbd5e1;
      padding: 0.25rem 0.5rem;
      font-size: 0.72rem;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 0.4rem;
      transition: all 0.2s;
    }
    .guardian-btn:hover {
      background: #0284c7;
      color: #fff;
      border-color: #0284c7;
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

  <!-- Toast Notifications Container -->
  <div id="toastContainer" class="toast-container"></div>

  <!-- Quick Actions Bar (Fase 3) -->
  <section style="margin-bottom: 2rem;">
    <div class="section-title">⚡ Ações Operacionais & Comandos Rápidos (Fase 3)</div>
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
      <button class="btn btn-secondary" onclick="executeAction('recalculate_health', this)">
        <span>🔄</span> Recalcular Saúde Agora
      </button>
      <button class="btn btn-secondary" onclick="executeAction('purge_cache', this)">
        <span>🧹</span> Limpar Cache Redis
      </button>
      <button class="btn btn-secondary" onclick="executeAction('warmup_ia', this)">
        <span>🧠</span> Aquecer Tensores IA (Warm-up)
      </button>
      <button class="btn btn-secondary" onclick="executeAction('trigger_backup', this)">
        <span>📦</span> Snapshot Transacional
      </button>
      <button class="btn btn-secondary" style="border-color: #38bdf8;" onclick="executeAction('generate_compliance_report', this)">
        <span>📄</span> Relatório Mensal SLA (CFM/SUS)
      </button>
    </div>
  </section>

  <!-- Hermes SRE Orchestrator & Container Guardians (Fase 5) -->
  <section class="hermes-section">
    <div class="hermes-card">
      <div class="hermes-header">
        <div class="hermes-title-wrap">
          <div class="hermes-icon">🤖</div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
              <h2 style="font-size: 1.25rem; font-weight: 700; color: #fdf2f8;">Hermes Agent — Chief SRE Leader & AIOps</h2>
              <span class="hermes-badge">Nous Research</span>
              <span class="hermes-badge-sub">10 Guardiões Ativos</span>
            </div>
            <p style="font-size: 0.8rem; color: #cbd5e1; margin-top: 0.2rem;">
              Orquestrador cognitivo de SRE para supervisão contínua, Tool Calling cirúrgico em microsserviços e governança Human-in-the-Loop.
            </p>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
          <!-- Sparkline de Tendência SRE (Item 3) -->
          <div id="hermesSparklineWrap" style="text-align: right; margin-right: 0.5rem;">
            <div style="font-size: 0.68rem; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Tendência SRE</div>
            <div id="hermesSparkline" style="display: flex; align-items: center; justify-content: flex-end; gap: 0.2rem; min-height: 24px; min-width: 90px;"></div>
          </div>
          <div style="text-align: right; margin-right: 0.5rem;">
            <div style="font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Score da Patrulha</div>
            <div id="hermesHealthScore" style="font-size: 1.3rem; font-weight: 800; color: #38bdf8; font-family: var(--font-mono);">--%</div>
          </div>
          <button class="btn btn-hermes" id="btnHermesPatrol" onclick="executeHermesCommand('Auditoria geral de todos os containers', 'full', this)">
            <span>⚡</span> Disparar Patrulha Completa
          </button>
        </div>
      </div>

      <!-- Quick Command Bar -->
      <div class="hermes-controls">
        <div class="hermes-input-group">
          <input type="text" id="hermesCustomPrompt" class="hermes-input" placeholder="Comande o Hermes (ex: 'Verificar latência do PostgreSQL e DLQ', 'Inspecionar tensores do Ollama')..." onkeydown="if(event.key === 'Enter') triggerCustomHermes()">
          <button class="btn btn-primary" onclick="triggerCustomHermes()">
            <span>💬</span> Consultar Hermes
          </button>
        </div>
        <div class="hermes-quick-buttons">
          <button class="btn-chip" onclick="executeHermesCommand('Auditar banco de dados e pgvector', 'database', this)">🐘 Postgres 16</button>
          <button class="btn-chip" onclick="executeHermesCommand('Auditar RabbitMQ e contingência DLQ', 'rabbitmq', this)">🐰 RabbitMQ / DLQ</button>
          <button class="btn-chip" onclick="executeHermesCommand('Auditar tarefas ativas e crontab do Celery', 'celery', this)">⚙️ Celery & Beat</button>
          <button class="btn-chip" onclick="executeHermesCommand('Auditar tensores e memória do Ollama', 'ollama', this)">🧠 Ollama RAM</button>
          <button class="btn-chip" onclick="executeHermesCommand('Auditar segurança e conformidade LGPD', 'security', this)">🛡️ Segurança & LGPD</button>
        </div>
      </div>

      <!-- Hermes Output Terminal & Recommendations -->
      <div id="hermesReportContainer" style="display: none; margin-top: 1.25rem;">
        <div class="hermes-terminal">
          <div class="terminal-bar">
            <span class="terminal-dot red"></span>
            <span class="terminal-dot yellow"></span>
            <span class="terminal-dot green"></span>
            <span class="terminal-title" id="hermesTerminalTitle">Laudo Pericial — Hermes SRE Agent</span>
            <span class="terminal-time" id="hermesTerminalTime">--:--:--</span>
          </div>
          <div class="terminal-body" id="hermesTerminalBody">
            <!-- Texto e diagnóstico formatado -->
          </div>
        </div>

        <!-- Recomendações Human-in-the-Loop -->
        <div id="hermesRecsBox" style="margin-top: 1rem; display: none;">
          <div style="font-size: 0.8rem; font-weight: 700; color: #f472b6; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>💡</span> Recomendações Técnicas do Maestro SRE (Human-in-the-Loop):
          </div>
          <div id="hermesRecsList" class="recs-grid"></div>
        </div>
      </div>

      <!-- Grid dos 10 Guardiões Especialistas por Container -->
      <div style="margin-top: 1.5rem; border-top: 1px solid rgba(236, 72, 153, 0.2); padding-top: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="font-size: 0.85rem; font-weight: 700; color: #e2e8f0; display: flex; align-items: center; gap: 0.4rem;">
            <span>🛡️</span> 10 Guardiões Especialistas por Container (Força-Tarefa Nível 2)
          </div>
          <span style="font-size: 0.72rem; color: #94a3b8;">Inspeção atômica individualizada via Tool Calling</span>
        </div>
        <div class="guardians-grid" id="guardiansGrid">
          <!-- Injetado dinamicamente via JS -->
        </div>
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

  <!-- Architecture Blueprint Map Replica (Padrão SCSI / PycoderBR) -->
  <section class="arch-section">
    <div class="blueprint-card">
      <div class="blueprint-header">
        <div class="blueprint-title-wrap">
          <h2>🗺️ Arquitetura de Deploy & Topologia de Microsserviços (SCSI / SGI Dr. Jesus)</h2>
          <p>Réplica da Topologia de Produção — Tráfego de Borda, Orquestração Swarm, Mensageria AMQP, Persistência pgvector e IA Soberana</p>
        </div>
        <div class="blueprint-badges">
          <span class="bp-badge bp-badge-cf">Cloudflare Full Strict</span>
          <span class="bp-badge bp-badge-ssl">TLS 1.3 Origin CA</span>
          <span class="bp-badge bp-badge-swarm">Docker Swarm KVM 8</span>
          <span class="bp-badge bp-badge-ia">Ollama Local 100% RAM</span>
          <span class="bp-badge bp-badge-db">PostgreSQL 16 + pgvector</span>
        </div>
      </div>

      <div class="arch-grid">
        <!-- Coluna 1: Borda, Criptografia & Pipeline DevOps -->
        <div class="arch-col-traffic">
          <div class="node-box node-user">
            <div class="node-head">
              <div class="node-icon" style="background: rgba(2, 132, 199, 0.15); color: #38bdf8;">👤</div>
              <div>
                <div class="node-title">Usuários & Clientes</div>
                <div class="node-subtitle">Web Browser / Mobile / PWA</div>
              </div>
            </div>
            <div class="node-tags">
              <span class="node-tag">HTTPS: 443</span>
              <span class="node-tag">WSS: 443</span>
              <span class="node-tag">Zero Trust</span>
            </div>
          </div>

          <div class="flow-step">
            <span>HTTPS / WSS (Criptografado)</span>
            <div class="flow-arrow-down"></div>
          </div>

          <div class="node-box node-cf">
            <div class="node-head">
              <div class="node-icon" style="background: rgba(249, 115, 22, 0.15); color: #fb923c;">☁️</div>
              <div>
                <div class="node-title">Cloudflare Edge</div>
                <div class="node-subtitle">Borda Global Anycast</div>
              </div>
            </div>
            <div class="node-tags">
              <span class="node-tag">DNS Anycast</span>
              <span class="node-tag">WAF & DDoS Shield</span>
              <span class="node-tag">Edge Caching</span>
              <span class="node-tag">SSL Universal</span>
            </div>
          </div>

          <div class="flow-step">
            <span>TLS 1.3 Full Strict (Origin CA)</span>
            <div class="flow-arrow-down"></div>
          </div>

          <div class="node-box node-ssl">
            <div class="node-head">
              <div class="node-icon" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">🔒</div>
              <div>
                <div class="node-title">SSL / TLS Origin CA</div>
                <div class="node-subtitle">Let's Encrypt / Cloudflare</div>
              </div>
            </div>
            <div class="node-tags">
              <span class="node-tag">Ponta a Ponta</span>
              <span class="node-tag">HSTS Ativo</span>
              <span class="node-tag">Offloading Seguro</span>
            </div>
          </div>

          <div style="border-top: 1px dashed #334155; margin: 0.6rem 0; padding-top: 0.6rem;">
            <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em;">
              🚀 Pipeline de Engenharia & CI/CD
            </div>
            <div class="node-box node-dev" style="margin-bottom: 0.5rem;">
              <div class="node-head">
                <div class="node-icon" style="background: rgba(139, 92, 246, 0.15); color: #a78bfa;">💻</div>
                <div>
                  <div class="node-title">Ambiente Local (Dev)</div>
                  <div class="node-subtitle">VS Code / Python 3.12 / Compose</div>
                </div>
              </div>
              <div class="node-tags">
                <span class="node-tag">Harness CLI</span>
                <span class="node-tag">Pytest / Flake8</span>
              </div>
            </div>

            <div class="flow-step">
              <span>Git Push (Branch main)</span>
              <div class="flow-arrow-down"></div>
            </div>

            <div class="node-box node-git">
              <div class="node-head">
                <div class="node-icon" style="background: rgba(226, 232, 240, 0.15); color: #f8fafc;">🐙</div>
                <div>
                  <div class="node-title">GitHub Enterprise</div>
                  <div class="node-subtitle">Repositório & CI/CD Actions</div>
                </div>
              </div>
              <div class="node-tags">
                <span class="node-tag">Deploy Scripts</span>
                <span class="node-tag">Versionamento Semântico</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna 2: Núcleo do Servidor VPS Hostinger (Docker Swarm) -->
        <div class="vps-frame">
          <div class="vps-badge-top">🌐 Servidor VPS Hostinger KVM 8 (Ubuntu 24.04 LTS) — Docker Swarm Cluster</div>
          <div class="vps-networks">
            <span class="net-pill">Rede: scsi_public (Overlay)</span>
            <span class="net-pill">Rede: scsi_data (Isolada)</span>
          </div>

          <!-- Traefik Ingress -->
          <div class="node-box node-traefik">
            <div class="node-head">
              <div class="node-icon" style="background: rgba(2, 132, 199, 0.15); color: #38bdf8;">🚦</div>
              <div>
                <div class="node-title">Traefik v3 Ingress Controller (Proxy Reverso)</div>
                <div class="node-subtitle">Portas 80/443 &bull; TLS Termination &bull; Zero-Root Socket Proxy</div>
              </div>
            </div>
            <div class="node-tags">
              <span class="node-tag">Roteamento Dinâmico</span>
              <span class="node-tag">ACME Let's Encrypt</span>
              <span class="node-tag">Certificados Automáticos</span>
              <span class="node-tag">HTTP-to-HTTPS Redirect</span>
            </div>
          </div>

          <div class="flow-step">
            <span>Roteamento Interno ASGI / HTTP / WSS</span>
            <div class="flow-arrow-down"></div>
          </div>

          <!-- Django Core Web & API -->
          <div class="node-box node-django">
            <div class="node-head">
              <div class="node-icon" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">🐍</div>
              <div>
                <div class="node-title">Django 6.1 Core API & Web (ASGI Daphne)</div>
                <div class="node-subtitle">DRF RESTful APIs &bull; WebSockets &bull; Multi-Tenancy RLS &bull; Trilha Forense</div>
              </div>
            </div>
            <div class="node-tags">
              <span class="node-tag">Multi-Tenancy RLS Fail-Closed</span>
              <span class="node-tag">Soft Delete (Lei 13.787 / 20 Anos)</span>
              <span class="node-tag">Trilha AuditLog Imutável</span>
              <span class="node-tag">Pool Conexões Segregado</span>
              <span class="node-tag">Autenticação JWT / Session</span>
            </div>
          </div>

          <!-- Microserviços de Dados, Mensageria & Background -->
          <div class="services-subgrid">
            <div class="node-box node-rabbitmq">
              <div class="node-head">
                <div class="node-icon" style="background: rgba(249, 115, 22, 0.15); color: #fb923c;">🐇</div>
                <div>
                  <div class="node-title">RabbitMQ 3.13</div>
                  <div class="node-subtitle">Broker AMQP / Mensageria</div>
                </div>
              </div>
              <div class="node-tags">
                <span class="node-tag">Dead Letter Queue (dlx)</span>
                <span class="node-tag">Exchange Direct</span>
                <span class="node-tag">Contingência de Mensagens</span>
              </div>
            </div>

            <div class="node-box node-celery">
              <div class="node-head">
                <div class="node-icon" style="background: rgba(22, 163, 74, 0.15); color: #4ade80;">⚙️</div>
                <div>
                  <div class="node-title">Celery Worker</div>
                  <div class="node-subtitle">Tarefas Assíncronas</div>
                </div>
              </div>
              <div class="node-tags">
                <span class="node-tag">Ingestão Vetorial RAG</span>
                <span class="node-tag">Disparo de E-mails MAILERS</span>
                <span class="node-tag">Geração de Laudos Clínicos</span>
              </div>
            </div>

            <div class="node-box node-beat">
              <div class="node-head">
                <div class="node-icon" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">⏰</div>
                <div>
                  <div class="node-title">Celery Beat</div>
                  <div class="node-subtitle">Agendador Periódico (Crontab)</div>
                </div>
              </div>
              <div class="node-tags">
                <span class="node-tag">Auditoria Semanal SHA-256</span>
                <span class="node-tag">Expurgo de Sessões Expiradas</span>
                <span class="node-tag">Warm-up de Tensores IA</span>
              </div>
            </div>

            <div class="node-box node-redis">
              <div class="node-head">
                <div class="node-icon" style="background: rgba(239, 68, 68, 0.15); color: #f87171;">⚡</div>
                <div>
                  <div class="node-title">Redis 7</div>
                  <div class="node-subtitle">In-Memory Store & Cache</div>
                </div>
              </div>
              <div class="node-tags">
                <span class="node-tag">DB 0: Cache Geral</span>
                <span class="node-tag">DB 1: WebSockets Channels</span>
                <span class="node-tag">DB 2: Celery Results</span>
              </div>
            </div>

            <div class="node-box node-postgres">
              <div class="node-head">
                <div class="node-icon" style="background: rgba(37, 99, 235, 0.15); color: #60a5fa;">🐘</div>
                <div>
                  <div class="node-title">PostgreSQL 16 + pgvector HNSW</div>
                  <div class="node-subtitle">Persistência Relacional ACID & Busca Vetorial por Cosseno</div>
                </div>
              </div>
              <div class="node-tags">
                <span class="node-tag">CosineDistance HNSW (Index Vetorial)</span>
                <span class="node-tag">Row-Level Security (RLS)</span>
                <span class="node-tag">Trilha Forense AuditLog</span>
                <span class="node-tag">Rede Isolada scsi_data (No Public IP)</span>
                <span class="node-tag">Backups Transacionais Diários R2</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna 3: Camada Cognitiva de IA Soberana -->
        <div class="ai-frame">
          <span class="ai-badge-top">🧠 Módulo de IA Soberana (Local no Servidor)</span>
          <p style="font-size: 0.72rem; color: #cbd5e1; margin-bottom: 0.25rem;">
            Execução 100% on-premise na RAM da VPS Hostinger KVM 8. Zero custo por token e conformidade absoluta com a LGPD (sem envio de dados para terceiros).
          </p>

          <div class="node-box node-ollama">
            <div class="node-head">
              <div class="node-icon" style="background: rgba(168, 85, 247, 0.15); color: #c084fc;">🦙</div>
              <div>
                <div class="node-title">Ollama Engine Local</div>
                <div class="node-subtitle">Servidor de Inferência em RAM</div>
              </div>
            </div>
            <div class="node-tags">
              <span class="node-tag">Keep-Alive 24h</span>
              <span class="node-tag">O(1) Hot Cache</span>
              <span class="node-tag">CPU Multi-Thread Otimizado</span>
            </div>
          </div>

          <div class="node-box node-model">
            <div class="node-head">
              <div class="node-icon" style="background: rgba(192, 132, 252, 0.15); color: #d8b4fe;">💡</div>
              <div>
                <div class="node-title">Llama 3.2 3B</div>
                <div class="node-subtitle">LLM Primária de Raciocínio</div>
              </div>
            </div>
            <div class="node-tags">
              <span class="node-tag">Sumarização Clínica</span>
              <span class="node-tag">Análise de Prontuários</span>
              <span class="node-tag">Streaming SSE em Tempo Real</span>
            </div>
          </div>

          <div class="node-box node-embed">
            <div class="node-head">
              <div class="node-icon" style="background: rgba(129, 140, 248, 0.15); color: #a5b4fc;">📐</div>
              <div>
                <div class="node-title">nomic-embed-text</div>
                <div class="node-subtitle">Embeddings Semânticos (768d)</div>
              </div>
            </div>
            <div class="node-tags">
              <span class="node-tag">Vetorização de Documentos</span>
              <span class="node-tag">Ingestão Imediata Celery</span>
              <span class="node-tag">Busca Vetorial RAG</span>
            </div>
          </div>

          <div class="node-box node-hermes">
            <div class="node-head">
              <div class="node-icon" style="background: rgba(236, 72, 153, 0.15); color: #f472b6;">🤖</div>
              <div>
                <div class="node-title">Hermes Agent (Nous Research)</div>
                <div class="node-subtitle">Agente Cognitivo Desacoplado</div>
              </div>
            </div>
            <div class="node-tags">
              <span class="node-tag">LangGraph State Workflows</span>
              <span class="node-tag">Decisões Assistidas</span>
              <span class="node-tag">Fallback Local Robusto</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Rodapé do Blueprint: Legenda & Benefícios -->
      <div class="arch-bottom-panel">
        <div class="legend-box">
          <div class="legend-title">🧭 Legenda de Protocolos & Fluxos</div>
          <div class="legend-items">
            <div class="legend-item"><div class="legend-indicator ind-http"></div><span><strong>HTTP / HTTPS / WSS:</strong> Borda, API e WebSockets (443)</span></div>
            <div class="legend-item"><div class="legend-indicator ind-amqp"></div><span><strong>Mensageria AMQP:</strong> Filas RabbitMQ e contingência DLQ (5672)</span></div>
            <div class="legend-item"><div class="legend-indicator ind-celery"></div><span><strong>Tarefas & Beat:</strong> Processamento assíncrono e agendamentos</span></div>
            <div class="legend-item"><div class="legend-indicator ind-sql"></div><span><strong>PostgreSQL + pgvector:</strong> Persistência ACID e HNSW (5432)</span></div>
            <div class="legend-item"><div class="legend-indicator ind-redis"></div><span><strong>Redis Cache & State:</strong> Operações em RAM de baixa latência (6379)</span></div>
            <div class="legend-item"><div class="legend-indicator ind-ia"></div><span><strong>IA Soberana (Ollama):</strong> Inferência local na RAM KVM 8 (11434)</span></div>
            <div class="legend-item"><div class="legend-indicator ind-git"></div><span><strong>Pipeline CI/CD:</strong> Deploy automatizado Git/GitHub</span></div>
          </div>
        </div>

        <div class="benefits-box">
          <div class="legend-title">⭐ Benefícios da Arquitetura de Deploy (Padrão SCSI)</div>
          <div class="benefits-grid">
            <div class="benefit-card">
              <div class="benefit-head"><span>⚡</span> Escalabilidade Horizontal</div>
              <div class="benefit-desc">Réplicas em Docker Swarm com balanceamento de carga automático e deploy zero-downtime.</div>
            </div>
            <div class="benefit-card">
              <div class="benefit-head"><span>🛡️</span> Alta Disponibilidade & Auto-Healing</div>
              <div class="benefit-desc">Watchdog sentinela com reconvergência de containers, sondas healthcheck e monitoramento 24/7.</div>
            </div>
            <div class="benefit-card">
              <div class="benefit-head"><span>🔒</span> Soberania de Dados (LGPD Art. 6º)</div>
              <div class="benefit-desc">IA 100% on-premise no Ollama com tensores na RAM. Nenhum dado sensível de acolhidos sai da VPS.</div>
            </div>
            <div class="benefit-card">
              <div class="benefit-head"><span>📜</span> Custódia Legal de 20 Anos</div>
              <div class="benefit-desc">Soft Delete universal no Django ORM (Lei 13.787/2018) com trilha AuditLog forense imutável.</div>
            </div>
            <div class="benefit-card">
              <div class="benefit-head"><span>📦</span> Resiliência com DLQ & Backups R2</div>
              <div class="benefit-desc">Tratamento de falhas assíncronas com exchange dlx no RabbitMQ e snapshots diários no Cloudflare R2.</div>
            </div>
            <div class="benefit-card">
              <div class="benefit-head"><span>📊</span> Observabilidade Unificada</div>
              <div class="benefit-desc">Mission Control Cockpit com telemetria das 9 camadas atômicas e controle operacional em 1 clique.</div>
            </div>
          </div>
        </div>
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

      if (data.hermes_history) {
        renderSparkline(data.hermes_history);
      }

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

    function showToast(message, type = 'success') {
      const container = document.getElementById('toastContainer');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `<span>${type === 'success' ? '✓' : '⚠️'}</span><span>${message}</span>`;
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        setTimeout(() => toast.remove(), 400);
      }, 4000);
    }

    function getCsrfToken() {
      const match = document.cookie.match(/csrftoken=([^;]+)/);
      return match ? match[1] : '';
    }

    async function executeAction(actionName, btn) {
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span>⏳</span> Executando...';

      try {
        const res = await fetch('/api/dashboard/action/', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()
          },
          body: JSON.stringify({ action: actionName })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(data.message || 'Comando executado com sucesso.', 'success');
          if (actionName === 'generate_compliance_report' && data.laudo_markdown) {
            const reportContainer = document.getElementById('hermesReportContainer');
            const termTitle = document.getElementById('hermesTerminalTitle');
            const termBody = document.getElementById('hermesTerminalBody');
            if (reportContainer) reportContainer.style.display = 'block';
            if (termTitle) termTitle.innerText = `Relatório Executivo Mensal — ${data.periodo || ''} (SLA & CFM)`;
            if (termBody) termBody.innerText = data.laudo_markdown;
          }
          if (actionName === 'recalculate_health' || actionName === 'purge_cache') {
            loadMetrics();
          }
        } else {
          showToast(data.error || 'Falha ao executar comando operacional.', 'error');
        }
      } catch (err) {
        showToast('Erro de conexão: ' + err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    }

    function renderSparkline(history) {
      const container = document.getElementById("hermesSparkline");
      if (!container) return;
      if (!history || history.length === 0) {
        container.innerHTML = '<span style="font-size: 0.65rem; color: #64748b;">Sem histórico</span>';
        return;
      }
      container.innerHTML = "";
      history.slice(-12).forEach((pt, idx) => {
        const bar = document.createElement("div");
        const score = pt.score !== undefined ? pt.score : 100;
        const h = Math.max(5, Math.round((score / 100) * 20));
        const color = score >= 90 ? "#10b981" : (score >= 75 ? "#38bdf8" : (score >= 60 ? "#f59e0b" : "#ef4444"));
        const timeStr = pt.timestamp ? new Date(pt.timestamp).toLocaleTimeString() : "";
        bar.style.width = "5px";
        bar.style.height = `${h}px`;
        bar.style.background = color;
        bar.style.borderRadius = "2px";
        bar.style.cursor = "pointer";
        bar.title = `Patrulha #${idx + 1}: ${score}% (${pt.status || 'OK'}) às ${timeStr}`;
        container.appendChild(bar);
      });
    }

    // -------------------------------------------------------------------------
    // BANCA DE GUARDIÕES & HERMES AGENT SRE (Fase 5)
    // -------------------------------------------------------------------------
    const GUARDIANS_DEF = [
      { id: 'cloudflare', name: 'Borda & WAF', role: 'cloudflare_edge_expert', container: 'Cloudflare Edge / SSL', icon: '☁️' },
      { id: 'traefik', name: 'Ingress Controller', role: 'traefik_expert', container: 'traefik_traefik:8080', icon: '🚦' },
      { id: 'frontend', name: 'Frontend UX', role: 'frontend_ux_expert', container: 'scsi_frontend (2 réplicas)', icon: '💻' },
      { id: 'django', name: 'Core Web & APIs', role: 'django_core_expert', container: 'scsi_backend (2 réplicas)', icon: '🐍' },
      { id: 'rabbitmq', name: 'Mensageria & Filas', role: 'rabbitmq_expert', container: 'scsi_rabbitmq / dlx', icon: '🐰' },
      { id: 'celery', name: 'Tarefas & Crontab', role: 'celery_expert', container: 'celery_worker / beat', icon: '⚙️' },
      { id: 'redis', name: 'Memória & Cache', role: 'redis_expert', container: 'scsi_redis (DB 0/1/2)', icon: '⚡' },
      { id: 'database', name: 'Banco & Vetores', role: 'postgres_dba_expert', container: 'scsi_db (Postgres+HNSW)', icon: '🐘' },
      { id: 'ollama', name: 'Tensores & IA', role: 'ollama_ia_expert', container: 'scsi_ollama (RAM KVM 8)', icon: '🧠' },
      { id: 'security', name: 'Segurança & LGPD', role: 'security_compliance_expert', container: 'AuditLog / RLS / CFM', icon: '🛡️' }
    ];

    function initGuardiansGrid() {
      const grid = document.getElementById("guardiansGrid");
      if (!grid) return;
      grid.innerHTML = "";

      GUARDIANS_DEF.forEach(g => {
        const card = document.createElement("div");
        card.className = "guardian-card";
        card.id = `guardian-card-${g.id}`;
        card.innerHTML = `
          <div>
            <div class="guardian-head">
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <span style="font-size: 1.1rem;">${g.icon}</span>
                <div>
                  <div class="guardian-name">${g.name}</div>
                  <div class="guardian-role">${g.role}</div>
                </div>
              </div>
              <span class="badge ok" id="badge-${g.id}">Pronto</span>
            </div>
            <div class="guardian-meta" id="meta-${g.id}">
              <span>Container: ${g.container}</span>
            </div>
          </div>
          <button class="guardian-btn" onclick="executeHermesCommand('Inspecionar ${g.name}', '${g.id}', this)">
            🔍 Inspecionar
          </button>
        `;
        grid.appendChild(card);
      });
    }

    async function executeHermesCommand(comando, modo, btn) {
      const originalText = btn ? btn.innerHTML : null;
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>⏳</span> Analisando...';
      }

      showToast(`Hermes Agent acionado: "${comando}"...`, 'success');

      try {
        const fetchOptions = {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()
          },
          body: JSON.stringify({ comando, modo })
        };
        if (window.AbortSignal && AbortSignal.timeout) {
          fetchOptions.signal = AbortSignal.timeout(35000);
        }
        const res = await fetch('/api/ia/hermes/sre/', fetchOptions);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        renderHermesResult(data);
        showToast('Patrulha SRE concluída com sucesso!', 'success');
      } catch (err) {
        console.error('Falha ao acionar Hermes SRE:', err);
        showToast('Erro ao comunicar com Hermes Agent: ' + err.message, 'error');
      } finally {
        if (btn && originalText) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      }
    }

    function triggerCustomHermes() {
      const input = document.getElementById('hermesCustomPrompt');
      const val = input ? input.value.trim() : '';
      if (!val) {
        showToast('Digite uma instrução para o Hermes Agent.', 'error');
        return;
      }
      executeHermesCommand(val, 'auto', null);
      input.value = '';
    }

    function renderHermesResult(data) {
      const container = document.getElementById('hermesReportContainer');
      const scoreEl = document.getElementById('hermesHealthScore');
      const termTitle = document.getElementById('hermesTerminalTitle');
      const termTime = document.getElementById('hermesTerminalTime');
      const termBody = document.getElementById('hermesTerminalBody');
      const recsBox = document.getElementById('hermesRecsBox');
      const recsList = document.getElementById('hermesRecsList');

      if (!container) return;
      container.style.display = 'block';

      // Score
      const score = data.score_saude ?? '--';
      scoreEl.innerText = `${score}%`;
      scoreEl.style.color = score >= 90 ? '#10b981' : (score >= 75 ? '#38bdf8' : (score >= 60 ? '#f59e0b' : '#ef4444'));

      if (data.historico) {
        renderSparkline(data.historico);
      }

      // Terminal Header & Body
      termTitle.innerText = `Laudo Pericial SRE — Status: ${data.status_geral || 'OPERACIONAL'} (${data.elapsed_ms || 0}ms)`;
      termTime.innerText = data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
      termBody.innerText = data.sintese_executiva || 'Nenhuma síntese emitida.';

      // Recomendações Human-in-the-Loop com Botões de Remediação em 1 Clique (Item 2)
      const recs = data.recomendacoes || [];
      if (recs.length > 0) {
        recsBox.style.display = 'block';
        recsList.innerHTML = '';
        recs.forEach(r => {
          const recCard = document.createElement('div');
          recCard.className = 'rec-card';
          
          let actionBtnHtml = '';
          const rLower = r.toLowerCase();
          if (rLower.includes('cache') || rLower.includes('redis') || rLower.includes('evic')) {
            actionBtnHtml = `<div style="margin-top: 0.5rem;"><button class="btn btn-secondary" style="padding: 0.25rem 0.6rem; font-size: 0.72rem; border-color: #ec4899; color: #f472b6;" onclick="executeAction('purge_cache', this)"><span>🧹</span> Limpar Cache Redis (1-Clique)</button></div>`;
          } else if (rLower.includes('tensor') || rLower.includes('ollama') || rLower.includes('ia') || rLower.includes('warm')) {
            actionBtnHtml = `<div style="margin-top: 0.5rem;"><button class="btn btn-secondary" style="padding: 0.25rem 0.6rem; font-size: 0.72rem; border-color: #a855f7; color: #c084fc;" onclick="executeAction('warmup_ia', this)"><span>🧠</span> Aquecer Tensores IA (1-Clique)</button></div>`;
          } else if (rLower.includes('backup') || rLower.includes('snapshot') || rLower.includes('banco') || rLower.includes('postgres') || rLower.includes('dados')) {
            actionBtnHtml = `<div style="margin-top: 0.5rem;"><button class="btn btn-secondary" style="padding: 0.25rem 0.6rem; font-size: 0.72rem; border-color: #38bdf8; color: #38bdf8;" onclick="executeAction('trigger_backup', this)"><span>📦</span> Snapshot Transacional (1-Clique)</button></div>`;
          } else if (rLower.includes('saúde') || rLower.includes('diagnóstico') || rLower.includes('recalcular')) {
            actionBtnHtml = `<div style="margin-top: 0.5rem;"><button class="btn btn-secondary" style="padding: 0.25rem 0.6rem; font-size: 0.72rem; border-color: #10b981; color: #34d399;" onclick="executeAction('recalculate_health', this)"><span>🔄</span> Recalcular Saúde (1-Clique)</button></div>`;
          }

          recCard.innerHTML = `
            <div>
              <span>⚡</span> <span>${r}</span>
            </div>
            ${actionBtnHtml}
          `;
          recsList.appendChild(recCard);
        });
      } else {
        recsBox.style.display = 'none';
      }

      // Atualiza os cards dos guardiões com base na telemetria retornada
      const telemetria = data.telemetria || {};
      for (const [key, tdata] of Object.entries(telemetria)) {
        const badge = document.getElementById(`badge-${key}`);
        const meta = document.getElementById(`meta-${key}`);
        if (badge) {
          const st = (tdata.status || 'ok').toLowerCase();
          const badgeClass = st === 'ok' ? 'ok' : (st === 'warning' ? 'warning' : 'error');
          const badgeText = st === 'ok' ? 'Operacional' : (st === 'warning' ? 'Atenção' : 'Crítico');
          badge.className = `badge ${badgeClass}`;
          badge.innerText = badgeText;
        }
        if (meta) {
          const lat = tdata.latency_ms ? `${tdata.latency_ms}ms` : '';
          const detail = tdata.metricas ? JSON.stringify(tdata.metricas).substring(0, 45) + '...' : (tdata.versao || tdata.mensagem || '');
          meta.innerHTML = `<span>${detail}</span><br><span style="color: #38bdf8;">${lat}</span>`;
        }
      }
    }

    // Pausa auto-refresh quando aba do navegador estiver oculta e retoma ao focar
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (timerId) clearInterval(timerId);
      } else {
        loadMetrics();
        updateRefreshTimer();
      }
    });

    // Inicialização ao carregar
    loadMetrics();
    updateRefreshTimer();
    initGuardiansGrid();
  </script>
</body>
</html>
"""
