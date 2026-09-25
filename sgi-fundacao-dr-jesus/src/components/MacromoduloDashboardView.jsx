import React, { useState } from 'react';
import { 
  Users, 
  BedDouble, 
  Package, 
  Truck, 
  Stethoscope, 
  Hospital, 
  Landmark, 
  FileText, 
  Building2, 
  CheckCircle2, 
  LayoutDashboard, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag,
  HeartPulse,
  Activity,
  Printer,
  X
} from 'lucide-react';

export default function MacromoduloDashboardView({ type = 'dash_acolhidos', acolhidos = [], blocos = [], profissionais = [], redeSUS = [], fornecedores = [], termosMROSC = [] }) {
  const [showAuditReportModal, setShowAuditReportModal] = useState(false);
  
  // DASHBOARD 1: GESTÃO DOS ACOLHIDOS
  if (type === 'dash_acolhidos') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Header Banner */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(185, 28, 28, 0.05))',
          border: '1px solid #ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              color: '#fff',
              padding: '0.85rem 1.15rem',
              borderRadius: '10px',
              fontWeight: 800,
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(220,38,38,0.25)'
            }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Macromódulo 1</div>
              <div style={{ fontSize: '1.1rem' }}>DASHBOARD ACOLHIDOS</div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-danger">1. Gestão dos Acolhidos</span>
                <span className="badge badge-primary">Painel Gerencial Exclusivo</span>
              </div>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>
                📊 Painel de Indicadores Estratégicos da Gestão dos Acolhidos
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: '4px 0 0 0' }}>
                Métricas consolidadas dos 4 Módulos Operacionais: Triagem & Admissão, Leitos & Dormitórios, Rede Familiar e Altas & Follow-Up.
              </p>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setShowAuditReportModal(true)}>
            <Printer size={16} /> Relatório de Auditoria PDF
          </button>
        </div>

        {/* 1. TOPO: 4 CARDS KPIS DE ALTO IMPACTO */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div className="card" style={{ borderLeft: '4px solid #dc2626', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Acolhidos Ativos</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.25rem 0' }}>2.850 Acolhidos</div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Em acolhimento nos 4 blocos</div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #0284c7', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Taxa Geral de Ocupação</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284c7', margin: '0.25rem 0' }}>95.0%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2.850 de 3.000 Leitos Totais</div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #d97706', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Triagem & Admissões no Mês</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706', margin: '0.25rem 0' }}>48 Anamneses</div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>100% RDC 29 ANVISA</div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #059669', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Altas Terapêuticas Concluídas</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', margin: '0.25rem 0' }}>32 Acolhidos</div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>9 Meses PTI & Conclusão</div>
          </div>
        </div>

        {/* MÓDULO 1: TRIAGEM & ADMISSÃO */}
        <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Stethoscope size={18} style={{ color: '#dc2626' }} />
                Módulo 1: Indicadores de Triagem, Admissão & Cofre Central
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Análise do perfil de dependência psicoativa, origem geográfica IBGE e custódia patrimonial.</p>
            </div>
            <span className="badge badge-danger">Módulo 1</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            
            {/* GRÁFICO DONUT: PERFIL DE DEPENDÊNCIA */}
            <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                🟢 Perfil de Dependência (Substância Principal)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <svg width="120" height="120" viewBox="0 0 42 42" style={{ flexShrink: 0 }}>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="5" />
                  {/* Crack / Álcool: 42% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#dc2626" strokeWidth="5" strokeDasharray="42 58" strokeDashoffset="25" />
                  {/* Múltiplas: 28% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#0284c7" strokeWidth="5" strokeDasharray="28 72" strokeDashoffset="83" />
                  {/* Cannabis: 18% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#16a34a" strokeWidth="5" strokeDasharray="18 82" strokeDashoffset="55" />
                  {/* Outras: 12% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#d97706" strokeWidth="5" strokeDasharray="12 88" strokeDashoffset="37" />
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.775rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }}></span> Crack / Álcool</span>
                    <strong style={{ color: '#dc2626' }}>42% (1.197)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }}></span> Múltiplas Drogas</span>
                    <strong style={{ color: '#0284c7' }}>28% (798)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></span> Cannabis</span>
                    <strong style={{ color: '#16a34a' }}>18% (513)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d97706' }}></span> Outras Dependências</span>
                    <strong style={{ color: '#d97706' }}>12% (342)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* BARRAS: ORIGEM GEOGRÁFICA MUNICÍPIOS IBGE */}
            <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                📊 Top 5 Municípios de Origem (API IBGE Bahia)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {[
                  { nome: 'Salvador', pct: 45, val: '1.282 Acolhidos', color: '#dc2626' },
                  { nome: 'Candeias (Sede)', pct: 22, val: '627 Acolhidos', color: '#0284c7' },
                  { nome: 'Feira de Santana', pct: 12, val: '342 Acolhidos', color: '#d97706' },
                  { nome: 'Simões Filho', pct: 10, val: '285 Acolhidos', color: '#16a34a' },
                  { nome: 'Lauro de Freitas', pct: 6, val: '171 Acolhidos', color: '#7c3aed' }
                ].map(item => (
                  <div key={item.nome}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 600 }}>{item.nome}</span>
                      <span style={{ fontWeight: 700, color: item.color }}>{item.val} ({item.pct}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '3px' }}>
                      <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* KPI CUSTÓDIA DO COFRE CENTRAL */}
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 700 }}>
              🔒 Custódia do Cofre Central (Envelope Inviolável nº 104-XXX):
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
              <span style={{ color: '#0369a1', fontWeight: 800 }}>• 1.045 Envelopes Lacrados em Custódia</span>
              <span style={{ color: '#15803d', fontWeight: 800 }}>• 32 Termos de Restituição Emitidos</span>
            </div>
          </div>
        </div>

        {/* MÓDULO 2: GESTÃO DE LEITOS, ALOJAMENTOS & PERNOITE */}
        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BedDouble size={18} style={{ color: '#0284c7' }} />
                Módulo 2: Ocupação dos 4 Blocos Residênciais & Enfermaria Central
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Detalhamento da ocupação real dos dormitórios, cotas PCD RDC 50 e auditoria de pernoite às 21h.</p>
            </div>
            <span className="badge badge-primary">Módulo 2</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { nome: 'Bloco A - Restauração (Masculino - Fase 1)', cap: 250, ocup: 240, pcd: '10/10 Leitos PCD', color: '#dc2626' },
              { nome: 'Bloco B - Renovação (Masculino - Fase 2)', cap: 250, ocup: 245, pcd: '10/10 Leitos PCD', color: '#0284c7' },
              { nome: 'Bloco C - Esperança (Feminino - Fase 3)', cap: 300, ocup: 282, pcd: '5/5 Leitos PCD', color: '#d97706' },
              { nome: 'Bloco D - Graça (Idosos & PCD - Fase 4)', cap: 300, ocup: 285, pcd: '10/10 Leitos PCD', color: '#059669' },
              { nome: 'Apoio Saúde & Enfermaria Central', cap: 50, ocup: 40, pcd: '5/5 Leitos PCD', color: '#7c3aed' }
            ].map(b => {
              const pct = Math.round((b.ocup / b.cap) * 100);
              return (
                <div key={b.nome} style={{ background: 'var(--bg-main)', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{b.nome}</span>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#0284c7', background: '#e0f2fe', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>♿ {b.pcd}</span>
                      <span style={{ fontWeight: 800, color: b.color }}>{b.ocup} / {b.cap} Leitos ({pct}%)</span>
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: b.color, borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#15803d' }}>
            <span>⏱️ <strong>Conformidade da Chamada Noturna (21:00h):</strong> Relação de Pernoite auditada e impressa diariamente para o TCE-BA.</span>
            <span style={{ background: '#16a34a', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '0.75rem' }}>100% AUDITADO</span>
          </div>
        </div>

        {/* MÓDULO 3: REDE FAMILIAR & PASSES */}
        <div className="card" style={{ borderLeft: '4px solid #ca8a04' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} style={{ color: '#ca8a04' }} />
                Módulo 3: Indicadores da Rede Familiar, Visitações & Passes
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Credenciamento de parentesco, emissão de crachás de domingo e autorização de saídas temporárias.</p>
            </div>
            <span className="badge badge-warning" style={{ background: '#fef08a', color: '#854d0e' }}>Módulo 3</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            
            {/* BARRAS: GRAU DE PARENTESCO */}
            <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                📊 Visitantes Credenciados por Grau de Parentesco
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {[
                  { parentesco: 'Mãe / Pai', pct: 45, val: '1.854 Credenciados', color: '#dc2626' },
                  { parentesco: 'Cônjuge / Companheiro(a)', pct: 25, val: '1.030 Credenciados', color: '#0284c7' },
                  { parentesco: 'Irmãos / Irmãs', pct: 15, val: '618 Credenciados', color: '#d97706' },
                  { parentesco: 'Filhos(as)', pct: 10, val: '412 Credenciados', color: '#16a34a' },
                  { parentesco: 'Outros Parentes', pct: 5, val: '206 Credenciados', color: '#7c3aed' }
                ].map(item => (
                  <div key={item.parentesco}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 600 }}>{item.parentesco}</span>
                      <span style={{ fontWeight: 700, color: item.color }}>{item.val} ({item.pct}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '3px' }}>
                      <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* METRICAS DE ATENDIMENTO FAMILIAR & PASSES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'var(--bg-main)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Visitas Presenciais (Último Domingo)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626', margin: '0.15rem 0' }}>1.280 Visitantes</div>
                <div style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 600 }}>Crachá PVC Emitido no Acesso</div>
              </div>

              <div style={{ background: 'var(--bg-main)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Videochamadas Assistidas (Quartas)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7', margin: '0.15rem 0' }}>145 Chamadas/Mês</div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Atendimento a Famílias Distantes</div>
              </div>

              <div style={{ background: 'var(--bg-main)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Passes Terapêuticos de Fim de Semana</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706', margin: '0.15rem 0' }}>145 Passes A4</div>
                <div style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 600 }}>Acolhidos Fases 3 e 4 do PTI</div>
              </div>
            </div>

          </div>
        </div>

        {/* MÓDULO 4: ALTAS TERAPÊUTICAS, COFRE & REINSERÇÃO */}
        <div className="card" style={{ borderLeft: '4px solid #7c3aed' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} style={{ color: '#7c3aed' }} />
                Módulo 4: Indicadores de Altas Terapêuticas, Destinos & Sobriedade 90d
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Distribuição de destinos de alta, quitação do cofre e acompanhamento pós-alta por mentores egressos.</p>
            </div>
            <span className="badge badge-success" style={{ background: '#f3e8ff', color: '#6b21a8' }}>Módulo 4</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            
            {/* GRÁFICO DONUT: DESTINOS DE ALTA */}
            <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                🟢 Distribuição dos Destinos de Desligamento
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <svg width="120" height="120" viewBox="0 0 42 42" style={{ flexShrink: 0 }}>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="5" />
                  {/* Alta Terapêutica Concluída: 78% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#16a34a" strokeWidth="5" strokeDasharray="78 22" strokeDashoffset="25" />
                  {/* Transferência Rede SUS: 12% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#0284c7" strokeWidth="5" strokeDasharray="12 88" strokeDashoffset="47" />
                  {/* Desligamento Voluntário: 10% */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#d97706" strokeWidth="5" strokeDasharray="10 90" strokeDashoffset="35" />
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.775rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></span> Alta Terapêutica Concluída</span>
                    <strong style={{ color: '#16a34a' }}>78% (32)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }}></span> Transferência Rede SUS</span>
                    <strong style={{ color: '#0284c7' }}>12% (5)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d97706' }}></span> Desligamento Voluntário</span>
                    <strong style={{ color: '#d97706' }}>10% (4)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* FUNIL DE SOBRIEDADE PÓS-ALTA (30, 60 e 90 Dias) */}
            <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                📈 Retenção de Sobriedade Pós-Alta (Follow-Up 90d)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { fase: '30 Dias Pós-Alta', pct: 92, status: '92% Mantêm Sobriedade', color: '#16a34a' },
                  { fase: '60 Dias Pós-Alta', pct: 88, status: '88% Mantêm Sobriedade', color: '#0284c7' },
                  { fase: '90 Dias Pós-Alta (Conclusão)', pct: 85, status: '85% Sobriedade Definitiva', color: '#7c3aed' }
                ].map(item => (
                  <div key={item.fase}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 600 }}>{item.fase}</span>
                      <span style={{ fontWeight: 700, color: item.color }}>{item.status}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px' }}>
                      <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '4px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Modal: Relatório Técnico de Auditoria (PDF) */}
        {showAuditReportModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="modal-header no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Printer size={20} style={{ color: '#dc2626' }} />
                  Dossiê Executivo de Indicadores — Macromódulo 1
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                    🖨️ Salvar em PDF / Imprimir
                  </button>
                  <button className="btn-close" onClick={() => setShowAuditReportModal(false)}>
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="modal-body printable-document" style={{ background: '#ffffff', color: '#0f172a', padding: '1.5rem', borderRadius: '8px' }}>
                
                {/* CABEÇALHO DO DOSSIÊ */}
                <div style={{ borderBottom: '2.5px solid #dc2626', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src="/logo_fundacao_dr_jesus.png" alt="Fundação Dr. Jesus" style={{ height: '42px', objectFit: 'contain' }} />
                    <div>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>FUNDAÇÃO DOUTOR JESUS</h2>
                      <p style={{ fontSize: '0.825rem', color: '#dc2626', fontWeight: 800, margin: '2px 0 0 0' }}>SGI • Sistema de Gestão Integrada & MROSC Bahia (Lei Federal nº 13.019/2014)</p>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Comunidade Terapêutica — Candeias / BA • 1.100 Leitos Instalados</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#dc2626' }}>DOSSIÊ DE INDICADORES</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Macromódulo 1: Gestão dos Acolhidos</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Emissão: {new Date().toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>

                {/* TOPO: 4 CARDS KPIS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderLeft: '4px solid #dc2626', padding: '8px 10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '7pt', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Acolhidos Ativos</div>
                    <div style={{ fontSize: '14pt', fontWeight: 900, color: '#dc2626', margin: '2px 0' }}>2.850</div>
                    <div style={{ fontSize: '7pt', color: '#16a34a', fontWeight: 700 }}>Em acolhimento nos 4 blocos</div>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderLeft: '4px solid #0284c7', padding: '8px 10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '7pt', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Taxa Geral Ocupação</div>
                    <div style={{ fontSize: '14pt', fontWeight: 900, color: '#0284c7', margin: '2px 0' }}>95.0%</div>
                    <div style={{ fontSize: '7pt', color: '#475569', fontWeight: 700 }}>2.850 / 3.000 Leitos Totais</div>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderLeft: '4px solid #d97706', padding: '8px 10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '7pt', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Admissões no Mês</div>
                    <div style={{ fontSize: '14pt', fontWeight: 900, color: '#d97706', margin: '2px 0' }}>48</div>
                    <div style={{ fontSize: '7pt', color: '#16a34a', fontWeight: 700 }}>100% RDC 29 ANVISA</div>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderLeft: '4px solid #16a34a', padding: '8px 10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '7pt', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Altas Concluídas (9m)</div>
                    <div style={{ fontSize: '14pt', fontWeight: 900, color: '#16a34a', margin: '2px 0' }}>32</div>
                    <div style={{ fontSize: '7pt', color: '#16a34a', fontWeight: 700 }}>Reinserção & Cursos FDJ</div>
                  </div>
                </div>

                {/* MÓDULO 1: TRIAGEM & ADMISSÃO */}
                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderLeft: '5px solid #dc2626', padding: '10px 12px', borderRadius: '6px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '10pt', fontWeight: 900, color: '#1e3a8a', margin: '0 0 6px 0', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>📝 MÓDULO 1: TRIAGEM, ADMISSÃO & COFRE CENTRAL</span>
                    <span style={{ fontSize: '7pt', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '1px 6px', borderRadius: '4px' }}>SAÚDE & CUSTÓDIA</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '8pt', color: '#0f172a', marginBottom: '4px' }}>🟢 Perfil de Dependência (Substância Principal)</div>
                      <div style={{ marginBottom: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt' }}><span>Crack / Álcool</span><strong style={{ color: '#dc2626' }}>42% (1.197)</strong></div>
                        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '42%', height: '100%', background: '#dc2626', borderRadius: '3px' }}></div></div>
                      </div>
                      <div style={{ marginBottom: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt' }}><span>Múltiplas Drogas</span><strong style={{ color: '#0284c7' }}>28% (798)</strong></div>
                        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '28%', height: '100%', background: '#0284c7', borderRadius: '3px' }}></div></div>
                      </div>
                      <div style={{ marginBottom: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt' }}><span>Cannabis</span><strong style={{ color: '#16a34a' }}>18% (513)</strong></div>
                        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '18%', height: '100%', background: '#16a34a', borderRadius: '3px' }}></div></div>
                      </div>
                      <div style={{ marginBottom: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt' }}><span>Outras Dependências</span><strong style={{ color: '#d97706' }}>12% (342)</strong></div>
                        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '12%', height: '100%', background: '#d97706', borderRadius: '3px' }}></div></div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 800, fontSize: '8pt', color: '#0f172a', marginBottom: '4px' }}>📊 Origem Geográfica dos Acolhidos (IBGE Bahia)</div>
                      <div style={{ marginBottom: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt' }}><span>Salvador</span><strong style={{ color: '#dc2626' }}>45% (1.282)</strong></div>
                        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '45%', height: '100%', background: '#dc2626', borderRadius: '3px' }}></div></div>
                      </div>
                      <div style={{ marginBottom: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt' }}><span>Candeias (Sede FDJ)</span><strong style={{ color: '#0284c7' }}>22% (627)</strong></div>
                        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '22%', height: '100%', background: '#0284c7', borderRadius: '3px' }}></div></div>
                      </div>
                      <div style={{ marginBottom: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt' }}><span>Feira de Santana</span><strong style={{ color: '#d97706' }}>12% (342)</strong></div>
                        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '12%', height: '100%', background: '#d97706', borderRadius: '3px' }}></div></div>
                      </div>
                      <div style={{ marginBottom: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt' }}><span>Simões Filho</span><strong style={{ color: '#16a34a' }}>10% (285)</strong></div>
                        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '10%', height: '100%', background: '#16a34a', borderRadius: '3px' }}></div></div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '6px', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '4px', fontSize: '7.5pt', display: 'flex', justifyContent: 'space-between' }}>
                    <span>🔒 <strong>Custódia do Cofre Central (Envelope Lacrado 104-XXX):</strong> 1.045 Envelopes Lacrados Ativos</span>
                    <span style={{ color: '#15803d', fontWeight: 800 }}>32 Termos de Restituição Emitidos</span>
                  </div>
                </div>

                {/* MÓDULO 2: GESTÃO DE LEITOS & PERNOITE */}
                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderLeft: '5px solid #0284c7', padding: '10px 12px', borderRadius: '6px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '10pt', fontWeight: 900, color: '#1e3a8a', margin: '0 0 6px 0', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>🛏️ MÓDULO 2: GESTÃO DE LEITOS, ALOJAMENTOS & PERNOITE</span>
                    <span style={{ fontSize: '7pt', background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', padding: '1px 6px', borderRadius: '4px' }}>1.100 LEITOS TOTAIS</span>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7.5pt', margin: '4px 0' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9' }}>
                        <th style={{ border: '1px solid #cbd5e1', padding: '3px 6px', textAlign: 'left' }}>Bloco / Alojamento</th>
                        <th style={{ border: '1px solid #cbd5e1', padding: '3px 6px', textAlign: 'left' }}>Fase PTI</th>
                        <th style={{ border: '1px solid #cbd5e1', padding: '3px 6px', textAlign: 'left' }}>Capacidade</th>
                        <th style={{ border: '1px solid #cbd5e1', padding: '3px 6px', textAlign: 'left' }}>Ocupação Real</th>
                        <th style={{ border: '1px solid #cbd5e1', padding: '3px 6px', textAlign: 'left' }}>Taxa %</th>
                        <th style={{ border: '1px solid #cbd5e1', padding: '3px 6px', textAlign: 'left' }}>Cota PCD RDC 50</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}><strong>Bloco A — Restauração</strong></td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>Fase 1 (0-60d)</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>250 Leitos</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>240 Leitos</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}><strong style={{ color: '#dc2626' }}>96.0%</strong></td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>10 / 10 Leitos PCD</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}><strong>Bloco B — Renovação</strong></td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>Fase 2 (60-180d)</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>250 Leitos</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>245 Leitos</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}><strong style={{ color: '#0284c7' }}>98.0%</strong></td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>10 / 10 Leitos PCD</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}><strong>Bloco C — Esperança</strong></td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>Fase 3 (180-240d)</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>300 Leitos</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>282 Leitos</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}><strong style={{ color: '#d97706' }}>94.0%</strong></td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>5 / 5 Leitos PCD</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}><strong>Bloco D — Graça</strong></td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>Fase 4 (240-270d)</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>300 Leitos</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>285 Leitos</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}><strong style={{ color: '#16a34a' }}>95.0%</strong></td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>10 / 10 Leitos PCD</td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}><strong>Enfermaria Central</strong></td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>Apoio Saúde</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>50 Leitos</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>40 Leitos</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}><strong style={{ color: '#7c3aed' }}>80.0%</strong></td>
                        <td style={{ border: '1px solid #cbd5e1', padding: '3px 6px' }}>5 / 5 Leitos PCD</td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ marginTop: '4px', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '3px 6px', borderRadius: '4px', fontSize: '7.5pt', color: '#15803d', display: 'flex', justifyContent: 'space-between' }}>
                    <span>⏱️ <strong>Chamada Noturna Auditada (21:00h):</strong> Relação de Pernoite Noturno emitida e assinada diariamente.</span>
                    <span style={{ fontWeight: 800 }}>100% AUDITADO TCE-BA</span>
                  </div>
                </div>

                {/* MÓDULO 3: REDE FAMILIAR & PASSES */}
                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderLeft: '5px solid #d97706', padding: '10px 12px', borderRadius: '6px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '10pt', fontWeight: 900, color: '#1e3a8a', margin: '0 0 6px 0', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>👨‍👩‍👧‍👦 MÓDULO 3: REDE FAMILIAR, VISITAS & PASSES TERAPÊUTICOS</span>
                    <span style={{ fontSize: '7pt', background: '#fefce8', color: '#854d0e', border: '1px solid #fef08a', padding: '1px 6px', borderRadius: '4px' }}>VÍNCULO COMUNITÁRIO</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '8pt', color: '#0f172a', marginBottom: '4px' }}>📊 Visitantes Credenciados por Grau de Parentesco (Aba 1.2)</div>
                      <div style={{ marginBottom: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt' }}><span>Mãe / Pai</span><strong style={{ color: '#dc2626' }}>45% (1.854 Familiares)</strong></div>
                        <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '45%', height: '100%', background: '#dc2626', borderRadius: '3px' }}></div></div>
                      </div>
                      <div style={{ marginBottom: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt' }}><span>Cônjuge / Companheiro(a)</span><strong style={{ color: '#0284c7' }}>25% (1.030 Familiares)</strong></div>
                        <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '25%', height: '100%', background: '#0284c7', borderRadius: '3px' }}></div></div>
                      </div>
                      <div style={{ marginBottom: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt' }}><span>Irmãos / Irmãs</span><strong style={{ color: '#d97706' }}>15% (618 Familiares)</strong></div>
                        <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '15%', height: '100%', background: '#d97706', borderRadius: '3px' }}></div></div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center' }}>
                      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '5px 8px', borderRadius: '4px', fontSize: '7.5pt' }}>
                        <strong>Visitas Presenciais (Domingo):</strong> <span style={{ color: '#dc2626', fontWeight: 800 }}>1.280 Visitantes</span> (Crachá PVC Emitido)
                      </div>
                      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '5px 8px', borderRadius: '4px', fontSize: '7.5pt' }}>
                        <strong>Videochamadas Assistidas (Quartas):</strong> <span style={{ color: '#0284c7', fontWeight: 800 }}>145 Chamadas/Mês</span> (Famílias do Interior)
                      </div>
                      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '5px 8px', borderRadius: '4px', fontSize: '7.5pt' }}>
                        <strong>Passes Terapêuticos Fim de Semana:</strong> <span style={{ color: '#d97706', fontWeight: 800 }}>145 Termos A4</span> (Fases 3 e 4 do PTI)
                      </div>
                    </div>
                  </div>
                </div>

                {/* MÓDULO 4: ALTAS TERAPÊUTICAS & REINSERÇÃO */}
                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderLeft: '5px solid #7c3aed', padding: '10px 12px', borderRadius: '6px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '10pt', fontWeight: 900, color: '#1e3a8a', margin: '0 0 6px 0', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>🎓 MÓDULO 4: ALTAS TERAPÊUTICAS, REINSERÇÃO & FOLLOW-UP 90D</span>
                    <span style={{ fontSize: '7pt', background: '#faf5ff', color: '#6b21a8', border: '1px solid #f3e8ff', padding: '1px 6px', borderRadius: '4px' }}>EFETIVIDADE PTI</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '8pt', color: '#0f172a', marginBottom: '4px' }}>🟢 Distribuição dos Destinos de Desligamento (Aba 1.6)</div>
                      <div style={{ marginBottom: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt' }}><span>Alta Terapêutica Concluída (9m)</span><strong style={{ color: '#16a34a' }}>78% (32)</strong></div>
                        <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '78%', height: '100%', background: '#16a34a', borderRadius: '3px' }}></div></div>
                      </div>
                      <div style={{ marginBottom: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt' }}><span>Transferência Rede SUS</span><strong style={{ color: '#0284c7' }}>12% (5)</strong></div>
                        <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '12%', height: '100%', background: '#0284c7', borderRadius: '3px' }}></div></div>
                      </div>
                      <div style={{ marginBottom: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt' }}><span>Desligamento Voluntário</span><strong style={{ color: '#d97706' }}>10% (4)</strong></div>
                        <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '10%', height: '100%', background: '#d97706', borderRadius: '3px' }}></div></div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 800, fontSize: '8pt', color: '#0f172a', marginBottom: '4px' }}>📈 Funil de Retenção de Sobriedade (Follow-Up 90d)</div>
                      <div style={{ marginBottom: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt' }}><span>30 Dias Pós-Alta</span><strong style={{ color: '#16a34a' }}>92% Sobriedade</strong></div>
                        <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '92%', height: '100%', background: '#16a34a', borderRadius: '3px' }}></div></div>
                      </div>
                      <div style={{ marginBottom: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt' }}><span>60 Dias Pós-Alta</span><strong style={{ color: '#0284c7' }}>88% Sobriedade</strong></div>
                        <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '88%', height: '100%', background: '#0284c7', borderRadius: '3px' }}></div></div>
                      </div>
                      <div style={{ marginBottom: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5pt' }}><span>90 Dias Pós-Alta</span><strong style={{ color: '#7c3aed' }}>85% Definitiva</strong></div>
                        <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px' }}><div style={{ width: '85%', height: '100%', background: '#7c3aed', borderRadius: '3px' }}></div></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ASSINATURAS */}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '8pt' }}>
                  <div style={{ width: '45%', borderTop: '1.5px solid #0f172a', paddingTop: '4px' }}>
                    <strong>Marcos Vinicius Bruno Teixeira</strong><br />
                    Engenheiro de Sistemas & Analista Responsável
                  </div>
                  <div style={{ width: '45%', borderTop: '1.5px solid #0f172a', paddingTop: '4px' }}>
                    <strong>Fundação Doutor Jesus</strong><br />
                    Diretoria Executiva & Gestão Pedagógica
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // DASHBOARD 2: ADMINISTRATIVO
  if (type === 'dash_admin') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Header Banner */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15), rgba(4, 120, 87, 0.05))',
          border: '1px solid #10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #059669, #047857)',
              color: '#fff',
              padding: '0.85rem 1.15rem',
              borderRadius: '10px',
              fontWeight: 800,
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(5,150,105,0.25)'
            }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Macromódulo 2</div>
              <div style={{ fontSize: '1.1rem' }}>DASHBOARD ADMINISTRATIVO</div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-success">2. Módulo Administrativo</span>
                <span className="badge badge-primary">Painel Gerencial Exclusivo</span>
              </div>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>
                📊 Painel de Indicadores do Módulo Administrativo
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: '4px 0 0 0' }}>
                Visão gráfica gerencial desmembrada pelas abas do macromódulo: Fornecedores MROSC e Frota de Veículos.
              </p>
            </div>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div className="card" style={{ borderLeft: '4px solid #059669', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Fornecedores MROSC</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.25rem 0' }}>10 Entidades</div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Homologados NFe</div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #0284c7', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Veículos na Frota</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284c7', margin: '0.25rem 0' }}>2 Veículos</div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>100% Operacionais</div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #d97706', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Capacidade de Transporte</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706', margin: '0.25rem 0' }}>53 Pass.</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ônibus & Vans FDJ</div>
          </div>
        </div>

        {/* SEÇÃO 1: INDICADORES DA ABA DE FORNECEDORES */}
        <div className="card" style={{ borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} style={{ color: '#059669' }} />
                2.1. Indicadores da Aba de Fornecedores MROSC & Concessionárias
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Categorias de despesa e contas bancárias validadas para liquidação.</p>
            </div>
            <span className="badge badge-success">Aba: Fornecedores MROSC</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1rem 0' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 700 }}>Alimentação & Insumos da Cozinha Central</span>
                <span style={{ fontWeight: 700, color: '#059669' }}>50% das Compras</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'var(--border-color)', borderRadius: '5px' }}>
                <div style={{ width: '50%', height: '100%', background: '#059669', borderRadius: '5px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                <span style={{ fontWeight: 700 }}>Concessionárias Públicas (EMBASA / COELBA)</span>
                <span style={{ fontWeight: 700, color: '#0284c7' }}>50% dos Contratos</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'var(--border-color)', borderRadius: '5px' }}>
                <div style={{ width: '50%', height: '100%', background: '#0284c7', borderRadius: '5px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* LINHA DIVISÓRIA DA ABA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
          <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, transparent, #059669, transparent)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#059669', background: 'var(--card-bg)', padding: '0.25rem 0.75rem', borderRadius: '12px', border: '1px solid #059669' }}>
            Divisão por Abas do Macromódulo 2
          </span>
          <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, transparent, #059669, transparent)' }} />
        </div>

        {/* SEÇÃO 2: INDICADORES DA ABA DE FROTA */}
        <div className="card" style={{ borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={20} style={{ color: '#059669' }} />
                2.2. Indicadores da Aba de Frota de Veículos Institucionais
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Capacidade de transporte e combustível utilizado.</p>
            </div>
            <span className="badge badge-primary">Aba: Frota Institucional</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Mercedes-Benz OF-1721</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669', margin: '0.25rem 0' }}>Ônibus 48 Pass.</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Placa: JSO-4819 • Diesel S10</div>
            </div>

            <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Toyota Hilux 4x4</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0284c7', margin: '0.25rem 0' }}>Resgate & Apoio</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Placa: NZV-1204 • Diesel S10</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD 3: SAÚDE & MULTIDISCIPLINAR
  if (type === 'dash_saude') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Header Banner */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(3, 105, 161, 0.05))',
          border: '1px solid #0284c7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              color: '#fff',
              padding: '0.85rem 1.15rem',
              borderRadius: '10px',
              fontWeight: 800,
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(2,132,199,0.25)'
            }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Macromódulo 3</div>
              <div style={{ fontSize: '1.1rem' }}>DASHBOARD SAÚDE</div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-info">3. Saúde & Equipe Multidisciplinar</span>
                <span className="badge badge-primary">Painel Gerencial Exclusivo</span>
              </div>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>
                📊 Painel de Indicadores de Saúde & Equipe Multidisciplinar
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: '4px 0 0 0' }}>
                Visão gráfica gerencial desmembrada pelas abas do macromódulo: Corpo Clínico e Rede SUS.
              </p>
            </div>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div className="card" style={{ borderLeft: '4px solid #0284c7', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Profissionais Cadastrados</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.25rem 0' }}>18 Especialistas</div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Médicos, Psicólogos e Assistentes</div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #059669', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Unidades da Rede SUS</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', margin: '0.25rem 0' }}>4 Unidades</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>HGE, UPA Candeias e CAPS</div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #7c3aed', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Atendimentos Mensais</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7c3aed', margin: '0.25rem 0' }}>450 Evoluções</div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>RDC 29 ANVISA Compliance</div>
          </div>
        </div>

        {/* SEÇÃO 1: INDICADORES DA ABA DE CORPO CLÍNICO */}
        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Stethoscope size={20} style={{ color: '#0284c7' }} />
                3.1. Indicadores da Aba de Corpo Clínico & Multidisciplinar
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Distribuição de profissionais por especialidade e registro de conselho (CRM/CRP/CRESS).</p>
            </div>
            <span className="badge badge-info">Aba: Corpo Clínico</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1rem 0' }}>
            {[
              { espec: 'Psicologia Clínica & Dependência Química (CRP)', qtd: 6, pct: 33, color: '#0284c7' },
              { espec: 'Medicina Psiquiátrica & Clínica Geral (CRM)', qtd: 4, pct: 22, color: '#059669' },
              { espec: 'Serviço Social & Direitos Humanos (CRESS)', qtd: 4, pct: 22, color: '#d97706' },
              { espec: 'Enfermagem & Farmácia (COREN/CRF)', qtd: 4, pct: 23, color: '#7c3aed' }
            ].map(e => (
              <div key={e.espec}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 700 }}>{e.espec}</span>
                  <span style={{ fontWeight: 700, color: e.color }}>{e.qtd} Profissionais ({e.pct}%)</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'var(--border-color)', borderRadius: '5px' }}>
                  <div style={{ width: `${e.pct}%`, height: '100%', background: e.color, borderRadius: '5px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LINHA DIVISÓRIA DA ABA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
          <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, transparent, #0284c7, transparent)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0284c7', background: 'var(--card-bg)', padding: '0.25rem 0.75rem', borderRadius: '12px', border: '1px solid #0284c7' }}>
            Divisão por Abas do Macromódulo 3
          </span>
          <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, transparent, #0284c7, transparent)' }} />
        </div>

        {/* SEÇÃO 2: INDICADORES DA ABA DE UNIDADES SUS */}
        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Hospital size={20} style={{ color: '#0284c7' }} />
                3.2. Indicadores da Aba de Unidades da Rede SUS de Referência
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Hospitais, UPAs e CAPS parceiros regulados via SAMU 192.</p>
            </div>
            <span className="badge badge-primary">Aba: Unidades SUS</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Hospital Geral do Estado (HGE)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#dc2626', margin: '0.25rem 0' }}>Trauma & Emergência</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Salvador/BA • CNES 2598104</div>
            </div>

            <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>UPA 24h Candeias</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0284c7', margin: '0.25rem 0' }}>Pronto Atendimento</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Candeias/BA • CNES 6890124</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD 4: PRESTAÇÃO DE CONTAS & FINANCEIRO
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(29, 78, 216, 0.15), rgba(30, 58, 138, 0.05))',
        border: '1px solid #2563eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
            color: '#fff',
            padding: '0.85rem 1.15rem',
            borderRadius: '10px',
            fontWeight: 800,
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(29,78,216,0.25)'
          }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Macromódulo 4</div>
            <div style={{ fontSize: '1.1rem' }}>DASHBOARD FINANCEIRO</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-primary">4. Prestação de Contas & Financeiro</span>
              <span className="badge badge-warning">Painel Gerencial Exclusivo</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>
              📊 Painel de Indicadores de Prestação de Contas & Financeiro
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: '4px 0 0 0' }}>
              Visão gráfica gerencial desmembrada pelas abas do macromódulo: Contas Bancárias e Rubricas SJDH.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #2563eb', padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Saldo Bancário Consolidado</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', margin: '0.25rem 0' }}>R$ 3.676.446,16</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Extratos Segregados MROSC</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #059669', padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Orçamento Pactuado Global</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.25rem 0' }}>R$ 12.770.000,00</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Termo de Fomento SJDH-BA</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #d97706', padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Saldo Disponível nas Rubricas</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706', margin: '0.25rem 0' }}>R$ 2.470.000,00</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Saldo para Solicitações (SC)</div>
        </div>
      </div>

      {/* SEÇÃO 1: INDICADORES DA ABA DE CONTAS BANCÁRIAS */}
      <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Landmark size={20} style={{ color: '#2563eb' }} />
              4.1. Indicadores da Aba de Contas Bancárias Segregadas MROSC
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Comparativo de saldo disponível entre Banco do Brasil (MROSC) e Caixa (Doações).</p>
          </div>
          <span className="badge badge-primary">Aba: Contas Bancárias</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1rem 0' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
              <span style={{ fontWeight: 700 }}>Banco do Brasil (MROSC SJDH-BA) — Conta 14.502-1</span>
              <span style={{ fontWeight: 700, color: '#059669' }}>R$ 3.492.246,16 (95.0%)</span>
            </div>
            <div style={{ width: '100%', height: '12px', background: 'var(--border-color)', borderRadius: '6px' }}>
              <div style={{ width: '95%', height: '100%', background: 'linear-gradient(90deg, #059669, #10b981)', borderRadius: '6px' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
              <span style={{ fontWeight: 700 }}>Caixa Econômica (Recursos Próprios / Sede) — Conta 003.882-9</span>
              <span style={{ fontWeight: 700, color: '#0284c7' }}>R$ 184.200,00 (5.0%)</span>
            </div>
            <div style={{ width: '100%', height: '12px', background: 'var(--border-color)', borderRadius: '6px' }}>
              <div style={{ width: '5%', height: '100%', background: '#0284c7', borderRadius: '6px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* LINHA DIVISÓRIA DA ABA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
        <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, transparent, #2563eb, transparent)' }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#2563eb', background: 'var(--card-bg)', padding: '0.25rem 0.75rem', borderRadius: '12px', border: '1px solid #2563eb' }}>
          Divisão por Abas do Macromódulo 4
        </span>
        <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, transparent, #2563eb, transparent)' }} />
      </div>

      {/* SEÇÃO 2: INDICADORES DA ABA DE RUBRICAS */}
      <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} style={{ color: '#2563eb' }} />
              4.2. Indicadores da Aba de Plano de Contas SJDH-BA & Rubricas
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Comparativo entre valor pactuado global e empenho acumulado.</p>
          </div>
          <span className="badge badge-warning">Aba: Rubricas SJDH</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>RUB-01: Alimentação & Nutrição</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.25rem 0' }}>
              R$ 3,20M <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ R$ 3,85M</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>Saldo: R$ 650.000,00 (83% Empenhado)</div>
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>RUB-02: Equipe Multidisciplinar & Saúde</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.25rem 0' }}>
              R$ 7,10M <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ R$ 8,92M</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>Saldo: R$ 1.820.000,00 (79.5% Empenhado)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
