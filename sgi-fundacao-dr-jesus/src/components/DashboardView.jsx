import React, { useState } from 'react';
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
  Maximize2
} from 'lucide-react';

export default function DashboardView({ metrics, acolhidos, termosMROSC, onNavigate }) {
  const [showExecutiveReportModal, setShowExecutiveReportModal] = useState(false);
  const [projectionMode, setProjectionMode] = useState(false);

  const origens = [
    { municipio: 'Salvador (Subúrbio & Miolos)', percentual: 45, qtd: 423 },
    { municipio: 'Candeias (Sede & Distritos)', percentual: 25, qtd: 235 },
    { municipio: 'Região Metropolitana (Simões Filho, Lauro, Camaçari)', percentual: 15, qtd: 141 },
    { municipio: 'Feira de Santana & Recôncavo', percentual: 10, qtd: 94 },
    { municipio: 'Outros Municípios da Bahia', percentual: 5, qtd: 47 },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.5rem',
      padding: projectionMode ? '2rem' : '0',
      background: projectionMode ? '#020617' : 'transparent',
      borderRadius: projectionMode ? '16px' : '0'
    }}>
      {/* Top Banner / Welcome Header */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(6, 182, 212, 0.05))',
        borderColor: 'var(--border-highlight)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary">Módulo 10</span>
            <span className="badge badge-success">Painel de BI & Diretoria Executiva 360°</span>
            {projectionMode && <span className="badge badge-warning">Modo Projeção Ativo</span>}
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>
            Painel Executivo da Fundação Doutor Jesus
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Monitoramento em tempo real da ocupação de leitos, origem geográfica dos acolhidos e execução de convênios MROSC.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${projectionMode ? 'btn-warning' : 'btn-secondary'}`}
            onClick={() => setProjectionMode(!projectionMode)}
          >
            <Tv size={18} /> {projectionMode ? 'Sair do Modo Projeção' : 'Modo Projeção (Reunião de Conselho)'}
          </button>

          <button className="btn btn-primary" onClick={() => setShowExecutiveReportModal(true)}>
            <Printer size={18} /> Relatório Executivo para Autoridades
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid-4">
        <div className="card stat-card">
          <div className="stat-icon-wrapper">
            <Users size={26} />
          </div>
          <div className="stat-info">
            <h4>Acolhidos Ativos</h4>
            <div className="stat-value">{metrics.totalAcolhidos}</div>
            <div className="stat-subtext">
              <ArrowUpRight size={14} /> +64 triagens este mês
            </div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <BedDouble size={26} />
          </div>
          <div className="stat-info">
            <h4>Ocupação Alojamentos</h4>
            <div className="stat-value">{metrics.capacidadeOcupacao}%</div>
            <div className="stat-subtext" style={{ color: 'var(--status-warning)' }}>
              {metrics.leitosOcupados} de {metrics.leitosTotais} leitos ocupados
            </div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Landmark size={26} />
          </div>
          <div className="stat-info">
            <h4>Recursos MROSC Vigentes</h4>
            <div className="stat-value" style={{ fontSize: '1.4rem' }}>
              R$ {(metrics.valorTotalMROSC / 1000000).toFixed(1)}M
            </div>
            <div className="stat-subtext" style={{ color: 'var(--status-info)' }}>
              3 Termos de Fomento/Colaboração
            </div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <DollarSign size={26} />
          </div>
          <div className="stat-info">
            <h4>Custo Diário / Acolhido</h4>
            <div className="stat-value" style={{ fontSize: '1.4rem', color: 'var(--status-success)' }}>
              R$ 38,50 / dia
            </div>
            <div className="stat-subtext">
              4 refeições + saúde + moradia
            </div>
          </div>
        </div>
      </div>

      {/* Risk, Compliance & Certidões Banner */}
      <div className="card" style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-highlight)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} style={{ color: 'var(--status-success)' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
              Central de Compliance Institucional & Certidões (FDJ)
            </h3>
          </div>
          <span className="badge badge-success">Certidões 100% Regulares</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CND Estadual (SEFAZ-BA)</div>
            <div style={{ fontWeight: 700, color: 'var(--status-success)', fontSize: '0.9rem' }}>🟢 Válida até 15/12/2026</div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CND Federal / INSS</div>
            <div style={{ fontWeight: 700, color: 'var(--status-success)', fontSize: '0.9rem' }}>🟢 Válida até 30/11/2026</div>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prestação TCE-BA (SADS-BA)</div>
            <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.9rem' }}>🟡 Prazo em 18 Dias</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Origin Distribution & MROSC Meters */}
      <div className="grid-2">
        {/* Geographic Distribution Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Origem Geográfica dos Acolhidos (Bahia)</h3>
            </div>
            <span className="badge badge-primary">Mapeamento Regional</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {origens.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{item.municipio}</span>
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
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={20} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Cumprimento de Metas MROSC (Lei 13.019)</h3>
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
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
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

      {/* Recent Admissions & Quick Actions */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Últimos Acolhimentos Voluntários Registrados</h3>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigate('triagem')}>
            Ver Todos ({acolhidos.length})
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código / Nome</th>
                <th>Origem</th>
                <th>Substância</th>
                <th>Alojamento / Leito</th>
                <th>Termo MROSC</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {acolhidos.slice(0, 4).map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img 
                        src={item.foto} 
                        alt={item.nome} 
                        style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.nome}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{item.id} • {item.idade} anos</div>
                      </div>
                    </div>
                  </td>
                  <td>{item.municipioOrigem}</td>
                  <td>
                    <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                      {item.substanciaPrincipal}
                    </span>
                  </td>
                  <td>{item.alojamento} ({item.leito})</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.termoMROSC}</td>
                  <td>
                    <span className={`badge ${
                      item.status === 'Ativo' ? 'badge-success' :
                      item.status === 'Em Triagem' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Printable Executive Report for Authorities */}
      {showExecutiveReportModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-primary">Relatório Executivo Consolidado para Autoridades Públicas</span>
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
                  RELATÓRIO EXECUTIVO GLOBAL DE IMPACTO SOCIAL E EXECUÇÃO MROSC
                </p>
                <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Apresentação à Secretaria de Assistência Social da Bahia (SADS-BA), Governo do Estado e Prefeituras
                </p>
              </div>

              <div style={{ border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <p>• Total de Acolhidos Atendidos em Reabilitação: <strong>940 Vidas Acolhidas</strong></p>
                <p>• Ocupação Média dos Alojamentos: <strong>94.0% dos Leitos Ocupados</strong></p>
                <p>• Total de Refeições Diárias Fornecidas Gratuitamente: <strong>3.760 Refeições/Dia</strong></p>
                <p>• Valor Total Gerido em Parcerias MROSC: <strong>R$ 8,800,000.00</strong></p>
                <p>• Custo Diário por Acolhido (Diária Social): <strong>R$ 38,50 / dia</strong></p>
                <p>• Taxa de Sobriedade e Reinserção Social Mantida: <strong>84.2%</strong></p>
              </div>

              <p style={{ textIndent: '2rem', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'justify' }}>
                A Fundação Doutor Jesus reafirma o compromisso institucional com a transparência pública, acolhimento voluntário e prestação de contas dos Termos de Colaboração e Fomento firmados com o Estado da Bahia e Municípios parceiros.
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
                    <strong>Diretoria Executiva & Controladoria</strong><br />
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
