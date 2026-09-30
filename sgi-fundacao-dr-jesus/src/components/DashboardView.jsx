import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BedDouble, 
  Landmark, 
  Utensils, 
  MapPin, 
  FileCheck, 
  ArrowUpRight, 
  Clock, 
  PlusCircle, 
  Download,
  AlertTriangle,
  Printer,
  X,
  PieChart,
  Activity,
  Award,
  TrendingUp,
  Building2,
  DollarSign,
  ShieldCheck,
  Tv,
  Maximize2,
  Sliders,
  Scale,
  Gavel,
  RefreshCw,
  HeartHandshake,
  CheckCircle2,
  Layers,
  Sparkles
} from 'lucide-react';

export default function DashboardView({ metrics, acolhidos, termosMROSC, onNavigate }) {
  const [showExecutiveReportModal, setShowExecutiveReportModal] = useState(false);
  const [showJudicialModal, setShowJudicialModal] = useState(false);
  const [projectionMode, setProjectionMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // RF-M12-10: Simulador Executivo What-If de Expansão de Vagas (1.150 a 1.400 leitos)
  const [simuladorLeitos, setSimuladorLeitos] = useState(1150);

  // Auto-refresh clock & telemetria
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const origens = [
    { municipio: 'Salvador (Subúrbio & Miolos)', percentual: 45, qtd: 423 },
    { municipio: 'Candeias (Sede & Distritos)', percentual: 25, qtd: 235 },
    { municipio: 'Região Metropolitana (Simões Filho, Lauro, Camaçari)', percentual: 15, qtd: 141 },
    { municipio: 'Feira de Santana & Recôncavo', percentual: 10, qtd: 94 },
    { municipio: 'Outros Municípios da Bahia', percentual: 5, qtd: 47 },
  ];

  // RF-M12-01: Distribuição dos 1.150 Leitos por Setor
  const censoLeitosSetores = [
    { setor: 'Alojamento Masculino Ala A', total: 320, ocupados: 304, higienizacao: 8, cativos: 8 },
    { setor: 'Alojamento Masculino Ala B', total: 300, ocupados: 285, higienizacao: 7, cativos: 8 },
    { setor: 'Alojamento Masculino Ala C', total: 250, ocupados: 236, higienizacao: 6, cativos: 8 },
    { setor: 'Alojamento Feminino (Ala Rosa)', total: 140, ocupados: 128, higienizacao: 6, cativos: 6 },
    { setor: 'Pavilhão Triagem & Acolhimento', total: 80, ocupados: 68, higienizacao: 6, cativos: 6 },
    { setor: 'Enfermaria Clínica & Cuidados Especiais', total: 60, ocupados: 49, higienizacao: 6, cativos: 5 },
  ];

  // RF-M12-10: Cálculos reativos do Simulador What-If
  const leitosBase = 1150;
  const deltaLeitos = Math.max(0, simuladorLeitos - leitosBase);
  const custoDiaPorAcolhido = 38.50;
  const custoMesPorAcolhido = custoDiaPorAcolhido * 30; // R$ 1.155,00
  const custoAdicionalMensal = deltaLeitos * custoMesPorAcolhido;
  const arrozExtraKgDia = (deltaLeitos * 0.100).toFixed(1);
  const feijaoExtraKgDia = (deltaLeitos * 0.050).toFixed(1);
  const carneExtraKgDia = (deltaLeitos * 0.120).toFixed(1);
  const monitoresNecessarios = Math.ceil(deltaLeitos / 25);
  const psicologosNecessarios = Math.ceil(deltaLeitos / 60);

  // RF-M12-05: SROI (Social Return on Investment)
  const totalAcolhidosAtivos = metrics.totalAcolhidos || 940;
  const orcamentoMensalTotal = totalAcolhidosAtivos * custoMesPorAcolhido;
  const retornoSocialSROI = orcamentoMensalTotal * 4.20; // R$ 4,20 por cada R$ 1,00 investido

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.5rem',
      padding: projectionMode ? '2rem' : '0',
      background: projectionMode ? '#020617' : 'transparent',
      color: projectionMode ? '#f8fafc' : 'inherit',
      minHeight: projectionMode ? '100vh' : 'auto',
      transition: 'all 0.4s ease'
    }}>
      {/* Top Banner / Welcome Header & Sala de Situação Mode */}
      <div className="card" style={{
        background: projectionMode 
          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))' 
          : 'linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(6, 182, 212, 0.05))',
        borderColor: projectionMode ? 'rgba(56, 189, 248, 0.4)' : 'var(--border-highlight)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: projectionMode ? '2rem 2.5rem' : '1.5rem 2rem',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: projectionMode ? '0 20px 40px rgba(0, 0, 0, 0.6)' : 'none'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-primary">Módulo 12</span>
            <span className="badge badge-success">Cockpit Presidência & BI Estratégico 360°</span>
            {projectionMode ? (
              <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f59e0b', color: '#000', fontWeight: 800 }}>
                <Tv size={14} /> MODO SALA DE SITUAÇÃO / TV 65" ATIVO (A 6 METROS)
              </span>
            ) : null}
            <span style={{ fontSize: '0.8rem', color: projectionMode ? '#94a3b8' : 'var(--text-muted)' }}>
              Sincronia: {currentTime.toLocaleTimeString('pt-BR')} (Auto-Refresh 5m)
            </span>
          </div>
          <h2 style={{ 
            fontSize: projectionMode ? '2.4rem' : '1.6rem', 
            color: projectionMode ? '#ffffff' : 'var(--text-main)',
            fontWeight: 800,
            letterSpacing: '-0.02em'
          }}>
            Fundação Doutor Jesus — Cockpit Executivo da Presidência
          </h2>
          <p style={{ color: projectionMode ? '#cbd5e1' : 'var(--text-muted)', fontSize: projectionMode ? '1.05rem' : '0.9rem', marginTop: '0.25rem' }}>
            Supervisão em tempo real de 1.150 Leitos, Pacing Orçamentário MROSC (Termo 005/2022 - R$ 161,85M), Retorno SROI e VEP/TJ-BA.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            className={`btn ${projectionMode ? 'btn-warning' : 'btn-secondary'}`}
            style={{ fontWeight: 700, padding: projectionMode ? '0.75rem 1.25rem' : '0.5rem 1rem' }}
            onClick={() => setProjectionMode(!projectionMode)}
          >
            <Tv size={18} /> {projectionMode ? 'Sair da Sala de Situação' : 'Sala de Situação (TV 65" / Projetor)'}
          </button>

          <button 
            className="btn btn-primary" 
            style={{ fontWeight: 700, padding: projectionMode ? '0.75rem 1.25rem' : '0.5rem 1rem' }}
            onClick={() => setShowExecutiveReportModal(true)}
          >
            <Printer size={18} /> Relatório da Presidência (TCE/MPE)
          </button>
        </div>
      </div>

      {/* RF-M12-01 & RF-M12-02 & RF-M12-03: Metric Cards Grid Superior */}
      <div className="grid-4" style={{ gap: projectionMode ? '1.5rem' : '1rem' }}>
        {/* Total Acolhidos */}
        <div className="card stat-card" style={{ background: projectionMode ? 'rgba(15, 23, 42, 0.85)' : undefined, border: projectionMode ? '1px solid rgba(56, 189, 248, 0.3)' : undefined }}>
          <div className="stat-icon-wrapper" style={{ width: projectionMode ? '54px' : undefined, height: projectionMode ? '54px' : undefined }}>
            <Users size={projectionMode ? 32 : 26} />
          </div>
          <div className="stat-info">
            <h4 style={{ fontSize: projectionMode ? '1rem' : undefined }}>Acolhidos Ativos (Censo Vivo)</h4>
            <div className="stat-value" style={{ fontSize: projectionMode ? '2.5rem' : undefined, color: '#38bdf8' }}>
              {metrics.totalAcolhidos || 940}
            </div>
            <div className="stat-subtext" style={{ color: '#10b981' }}>
              <ArrowUpRight size={14} /> 100% triagens voluntárias validadas
            </div>
          </div>
        </div>

        {/* Censo 1.150 Leitos */}
        <div className="card stat-card" style={{ background: projectionMode ? 'rgba(15, 23, 42, 0.85)' : undefined, border: projectionMode ? '1px solid rgba(245, 158, 11, 0.3)' : undefined }}>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', width: projectionMode ? '54px' : undefined, height: projectionMode ? '54px' : undefined }}>
            <BedDouble size={projectionMode ? 32 : 26} />
          </div>
          <div className="stat-info">
            <h4 style={{ fontSize: projectionMode ? '1rem' : undefined }}>Capacidade Total (1.150 Leitos)</h4>
            <div className="stat-value" style={{ fontSize: projectionMode ? '2.5rem' : undefined, color: '#f59e0b' }}>
              {((940 / 1150) * 100).toFixed(1)}%
            </div>
            <div className="stat-subtext" style={{ color: '#f59e0b' }}>
              940 ocupados • 120 livres • 45 cativas SUS
            </div>
          </div>
        </div>

        {/* Burn-Rate e Pacing MROSC Termo 005/2022 */}
        <div className="card stat-card" style={{ background: projectionMode ? 'rgba(15, 23, 42, 0.85)' : undefined, border: projectionMode ? '1px solid rgba(139, 92, 246, 0.3)' : undefined }}>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a855f7', width: projectionMode ? '54px' : undefined, height: projectionMode ? '54px' : undefined }}>
            <TrendingUp size={projectionMode ? 32 : 26} />
          </div>
          <div className="stat-info">
            <h4 style={{ fontSize: projectionMode ? '1rem' : undefined }}>Pacing Termo 005/2022 (R$ 161,85M)</h4>
            <div className="stat-value" style={{ fontSize: projectionMode ? '2.2rem' : '1.5rem', color: '#a855f7' }}>
              98.4% Pacing
            </div>
            <div className="stat-subtext" style={{ color: '#10b981' }}>
              🟢 Execução Linear Perfeita (Sem Glosas)
            </div>
          </div>
        </div>

        {/* Diária Per Capita */}
        <div className="card stat-card" style={{ background: projectionMode ? 'rgba(15, 23, 42, 0.85)' : undefined, border: projectionMode ? '1px solid rgba(16, 185, 129, 0.3)' : undefined }}>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', width: projectionMode ? '54px' : undefined, height: projectionMode ? '54px' : undefined }}>
            <DollarSign size={projectionMode ? 32 : 26} />
          </div>
          <div className="stat-info">
            <h4 style={{ fontSize: projectionMode ? '1rem' : undefined }}>Custo Diário Per Capita</h4>
            <div className="stat-value" style={{ fontSize: projectionMode ? '2.2rem' : '1.5rem', color: '#10b981' }}>
              R$ 38,50 / dia
            </div>
            <div className="stat-subtext" style={{ color: '#94a3b8' }}>
              R$ 1.155,00/mês (Alim. + Saúde + Acolhimento)
            </div>
          </div>
        </div>
      </div>

      {/* RF-M12-05: Painel SROI (Social Return on Investment) & Impacto Social */}
      <div className="card" style={{
        background: projectionMode ? 'rgba(30, 41, 59, 0.7)' : 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.08))',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        padding: '1.25rem 1.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
              <Scale size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-success">Metodologia SROI Internacional</span>
                <span className="badge badge-primary">Impacto Social Auditado</span>
              </div>
              <h3 style={{ fontSize: projectionMode ? '1.4rem' : '1.15rem', color: projectionMode ? '#fff' : 'var(--text-main)', margin: '0.2rem 0' }}>
                Social Return on Investment (SROI): R$ 4,20 Economizados por R$ 1,00 Investido
              </h3>
              <p style={{ fontSize: '0.85rem', color: projectionMode ? '#94a3b8' : 'var(--text-muted)' }}>
                Cada real investido no acolhimento da Fundação Dr. Jesus evita gastos públicos diretos no SUS (urgências e UTIs), custódia penal e segurança pública.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem', textAlign: 'right' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: projectionMode ? '#94a3b8' : 'var(--text-muted)' }}>Custo Mensal da Operação</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
                R$ {(orcamentoMensalTotal / 1000000).toFixed(2)}M / mês
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>Economia Pública Estimada (SROI)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981' }}>
                R$ {(retornoSocialSROI / 1000000).toFixed(2)}M / mês
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RF-M12-10: Simulador Executivo What-If de Expansão de Vagas */}
      <div className="card" style={{
        background: projectionMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(30, 41, 59, 0.3)',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={22} style={{ color: '#38bdf8' }} />
            <h3 style={{ fontSize: projectionMode ? '1.3rem' : '1.1rem', color: projectionMode ? '#fff' : 'var(--text-main)' }}>
              Simulador Executivo What-If — Expansão de Vagas e Planejamento de Escala
            </h3>
          </div>
          <span className="badge badge-primary">Projeção Dinâmica em Tempo Real</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: projectionMode ? '#e2e8f0' : 'var(--text-main)' }}>
                Meta de Capacidade Instalada:
              </span>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8' }}>
                {simuladorLeitos} Leitos
              </span>
            </div>
            <input 
              type="range" 
              min="1150" 
              max="1400" 
              step="25"
              value={simuladorLeitos} 
              onChange={(e) => setSimuladorLeitos(Number(e.target.value))}
              style={{ width: '100%', height: '8px', cursor: 'pointer', accentColor: '#38bdf8' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
              <span>Base Atual: 1.150 Leitos</span>
              <span>Expansão: +{deltaLeitos} Leitos</span>
              <span>Teto Máximo: 1.400 Leitos</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Impacto Financeiro</div>
              <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '1.05rem' }}>
                + R$ {(custoAdicionalMensal / 1000).toFixed(1)}k / mês
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Aditivo MROSC Diária R$ 38,50</div>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Insumos Alim. / Dia</div>
              <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: '0.95rem' }}>
                +{arrozExtraKgDia}kg Arr / +{feijaoExtraKgDia}kg Feij
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>+{carneExtraKgDia}kg Carne diária</div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Equipe Necessária</div>
              <div style={{ fontWeight: 800, color: '#10b981', fontSize: '1.05rem' }}>
                +{monitoresNecessarios} Monitores
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>+{psicologosNecessarios} Psicólogo/Assist. Social</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Central: Censo Vivo 1.150 Leitos e Cockpit Judiciário VEP / TJ-BA */}
      <div className="grid-2" style={{ gap: projectionMode ? '1.5rem' : '1rem' }}>
        {/* RF-M12-01: Censo Vivo 1.150 Leitos por Ala */}
        <div className="card" style={{ background: projectionMode ? 'rgba(15, 23, 42, 0.85)' : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={20} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: projectionMode ? '1.25rem' : '1.1rem', color: projectionMode ? '#fff' : 'var(--text-main)' }}>
                Censo Vivo de Leitos por Setor (1.150 Total)
              </h3>
            </div>
            <span className="badge badge-primary">Sincronizado</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {censoLeitosSetores.map((setor, idx) => {
              const percOcup = ((setor.ocupados / setor.total) * 100).toFixed(0);
              return (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: projectionMode ? '#f1f5f9' : 'var(--text-main)' }}>{setor.setor}</span>
                    <span style={{ color: percOcup > 95 ? '#f59e0b' : '#38bdf8', fontWeight: 700 }}>
                      {setor.ocupados} / {setor.total} ({percOcup}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${percOcup}%`,
                      height: '100%',
                      background: percOcup > 95 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                    <span>Higienização: {setor.higienizacao}</span>
                    <span>Vaga Cativa SUS/MROSC: {setor.cativos}</span>
                    <span>Disponíveis: {setor.total - setor.ocupados - setor.higienizacao - setor.cativos}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RF-M12-08: Cockpit Judiciário TJ-BA / VEP */}
        <div className="card" style={{ background: projectionMode ? 'rgba(15, 23, 42, 0.85)' : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Gavel size={20} style={{ color: '#eab308' }} />
              <h3 style={{ fontSize: projectionMode ? '1.25rem' : '1.1rem', color: projectionMode ? '#fff' : 'var(--text-main)' }}>
                Cockpit Judiciário TJ-BA / VEP (Medidas Alternativas)
              </h3>
            </div>
            <span className="badge badge-warning" style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#eab308' }}>
              Varas de Execuções Penais
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(234, 179, 8, 0.08)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Acolhidos Medidas Alt.</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#eab308' }}>78</div>
                <div style={{ fontSize: '0.65rem', color: '#10b981' }}>Em cumprimento regular</div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Frequência Atestada</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>100%</div>
                <div style={{ fontSize: '0.65rem', color: '#10b981' }}>Conferência biométrica</div>
              </div>
              <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Evasões Judiciais</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>0</div>
                <div style={{ fontSize: '0.65rem', color: '#38bdf8' }}>Últimos 180 dias</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: projectionMode ? '#fff' : 'var(--text-main)', marginBottom: '0.35rem' }}>
                Integração Digital com Comarcas da Bahia
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Relatórios mensais de assiduidade e pareceres psicossociais emitidos digitalmente para a 1ª e 2ª VEP de Salvador e Candeias com carimbo criptográfico SHA-256.
              </p>
              <button 
                className="btn btn-outline btn-sm" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setShowJudicialModal(true)}
              >
                <FileCheck size={16} /> Emitir Certidão Eletrônica de Comparecimento TJ-BA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RF-M12-04: Curva de Retenção & Funil de Evasão Terapêutica (Fases 1, 2 e 3 do PTI) */}
      <div className="card" style={{ background: projectionMode ? 'rgba(15, 23, 42, 0.85)' : undefined }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} style={{ color: '#10b981' }} />
            <h3 style={{ fontSize: projectionMode ? '1.25rem' : '1.1rem', color: projectionMode ? '#fff' : 'var(--text-main)' }}>
              Curva de Retenção e Funil Terapêutico (Plano Terapêutico Individual - PTI de 9 Meses)
            </h3>
          </div>
          <span className="badge badge-success">84.2% Taxa de Conclusão Global</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Fase 1 */}
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 700, color: '#f87171' }}>Fase 1: Desintoxicação</span>
              <span className="badge badge-danger">0 a 30 Dias</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '0.35rem 0' }}>
              92.4% Retenção
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Acolhidos em suporte intensivo, triagem médica e adaptação ao ambiente comunitário. Evasões concentradas nas primeiras 72h por abstinência.
            </p>
          </div>

          {/* Fase 2 */}
          <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 700, color: '#fbbf24' }}>Fase 2: Conscientização & Laborterapia</span>
              <span className="badge badge-warning">31 a 180 Dias</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '0.35rem 0' }}>
              86.8% Retenção
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Engajamento em oficinas vocacionais, horticultura, apoio psicológico e fortalecimento dos laços espirituais e morais.
            </p>
          </div>

          {/* Fase 3 */}
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 700, color: '#34d399' }}>Fase 3: Reinserção Social & Cidadania</span>
              <span className="badge badge-success">181 a 270 Dias</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '0.35rem 0' }}>
              94.6% Graduação
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Aproximação familiar, qualificação profissional, emissão de certidão de conclusão e encaminhamento para vagas de emprego.
            </p>
          </div>
        </div>
      </div>

      {/* Origin Distribution & MROSC Termos */}
      <div className="grid-2" style={{ gap: projectionMode ? '1.5rem' : '1rem' }}>
        {/* Geographic Distribution Card */}
        <div className="card" style={{ background: projectionMode ? 'rgba(15, 23, 42, 0.85)' : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: projectionMode ? '1.25rem' : '1.1rem', color: projectionMode ? '#fff' : 'var(--text-main)' }}>Origem Geográfica dos Acolhidos (Bahia)</h3>
            </div>
            <span className="badge badge-primary">Mapeamento Regional</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {origens.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: projectionMode ? '#e2e8f0' : 'var(--text-main)', fontWeight: 500 }}>{item.municipio}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{item.qtd} acolhidos ({item.percentual}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${item.percentual}%`,
                    height: '100%',
                    background: idx === 0 ? 'linear-gradient(90deg, #14b8a6, #06b6d4)' :
                                idx === 1 ? 'linear-gradient(90deg, #06b6d4, #3b82f6)' :
                                idx === 2 ? '#f59e0b' : '#64748b',
                    borderRadius: '4px',
                    transition: 'width 0.8s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MROSC Target Compliance Cards */}
        <div className="card" style={{ background: projectionMode ? 'rgba(15, 23, 42, 0.85)' : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={20} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: projectionMode ? '1.25rem' : '1.1rem', color: projectionMode ? '#fff' : 'var(--text-main)' }}>Cumprimento de Metas MROSC (Lei 13.019)</h3>
            </div>
            <span className="badge badge-warning">Prestação Contas</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {termosMROSC.map((termo) => (
              <div key={termo.id} style={{
                background: 'rgba(15, 23, 42, 0.4)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: projectionMode ? '#fff' : 'var(--text-main)' }}>
                    {termo.termo}
                  </span>
                  <span className={`badge ${termo.percentualCumprimento >= 100 ? 'badge-success' : 'badge-warning'}`}>
                    {termo.percentualCumprimento}% Executado
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  {termo.orgaoConcedente}
                </p>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(termo.percentualCumprimento, 100)}%`,
                    height: '100%',
                    background: termo.percentualCumprimento >= 100 ? 'var(--status-success)' : 'var(--status-warning)',
                    borderRadius: '3px'
                  }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                  <span>Meta: {termo.metaAcolhidosMes} acolhidos/mês</span>
                  <span>Executado: {termo.executadoMes} acolhidos</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Relatório Judicial TJ-BA / VEP */}
      {showJudicialModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px', background: '#0f172a', color: '#f8fafc', border: '1px solid rgba(234, 179, 8, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Gavel size={20} style={{ color: '#eab308' }} />
                <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Certidão de Cumprimento de Medidas Alternativas TJ-BA</h3>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowJudicialModal(false)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.6' }}>
              <p><strong>ÓRGÃO DESTINATÁRIO:</strong> Tribunal de Justiça do Estado da Bahia — Vara de Execuções Penais e Medidas Alternativas</p>
              <p><strong>INSTITUIÇÃO ACOLHEDORA:</strong> Fundação Doutor Jesus (CNPJ: 04.819.387/0001-05)</p>
              <p><strong>TOTAL DE ACOLHIDOS VINCULADOS:</strong> 78 reeducandos sob regime de acolhimento terapêutico voluntário</p>
              <p><strong>ASSIDUIDADE REGISTRADA:</strong> 100.0% de presença nas atividades diárias e laborterapia</p>
              <p><strong>REGISTRO FORENSE DIGITAL:</strong> SHA-256: <code>e8b49f90218763acbe5431fa765b210081cde774e129ad61a5b8</code></p>
              
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                🟢 <strong>Declaração Oficial:</strong> Atestamos para os devidos fins judiciais que não houve registros de faltas graves, indisciplina ou evasão por parte dos reeducandos acolhidos no corrente mês.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowJudicialModal(false)}>
                Fechar
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                <Printer size={16} /> Imprimir Certidão Judicial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: RF-M12-11 Printable Executive Report for Authorities */}
      {showExecutiveReportModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-primary">RF-M12-11: Relatório Executivo Consolidado para Autoridades Públicas</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={16} /> Imprimir Relatório
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowExecutiveReportModal(false)}>
                  <X size={16} /> Fechar
                </button>
              </div>
            </div>

            <div className="printable-document">
              <div className="printable-header">
                <h2>FUNDAÇÃO DOUTOR JESUS</h2>
                <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                  RELATÓRIO EXECUTIVO GLOBAL DE IMPACTO SOCIAL, CENSO E EXECUÇÃO MROSC
                </p>
                <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Apresentação à Secretaria de Assistência Social da Bahia (SADS-BA), TCE-BA, MPE-BA e TJ-BA
                </p>
              </div>

              <div style={{ border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <p>• Capacidade Instalada e Censo Operacional: <strong>1.150 Leitos (940 Vidas Acolhidas Ativas)</strong></p>
                <p>• Ocupação Média dos Alojamentos: <strong>81.7% da Capacidade Total</strong></p>
                <p>• Refeições Diárias Fornecidas Gratuitamente: <strong>3.760 Refeições/Dia (4 refeições/acolhido)</strong></p>
                <p>• Termo de Colaboração Principal: <strong>Termo nº 005/2022 — SADS/Governo da Bahia (R$ 161,85M)</strong></p>
                <p>• Custo Diário por Acolhido (Diária Social Padrão): <strong>R$ 38,50 / dia (R$ 1.155,00/mês)</strong></p>
                <p>• Retorno Social sobre o Investimento (SROI): <strong>R$ 4,20 Economizados no SUS/Segurança por R$ 1,00 Investido</strong></p>
                <p>• Retenção e Graduação do PTI (9 Meses): <strong>84.2% Conclusão com Sucesso</strong></p>
                <p>• Medidas Alternativas e Cumprimento VEP/TJ-BA: <strong>78 Acolhidos (100% Assiduidade)</strong></p>
              </div>

              <p style={{ textIndent: '2rem', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'justify' }}>
                A Fundação Doutor Jesus reafirma o compromisso constitucional e regulatório com a transparência pública, respeito aos Direitos Humanos, acolhimento integralmente voluntário e rigorosa prestação de contas dos recursos do MROSC (Lei Federal nº 13.019/2014) perante o Tribunal de Contas do Estado da Bahia e Ministério Público.
              </p>

              <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '0.85rem' }}>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem' }}>
                    <strong>Dep. Pastor Sargento Isidório</strong><br />
                    Presidente Fundador da Fundação Dr. Jesus
                  </div>
                </div>

                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem' }}>
                    <strong>Diretoria Executiva & Controladoria Geral</strong><br />
                    Fundação Doutor Jesus
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
