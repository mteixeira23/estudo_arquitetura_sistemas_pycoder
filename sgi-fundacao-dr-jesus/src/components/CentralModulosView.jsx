import React from 'react';
import { 
  Landmark, 
  Users, 
  Stethoscope, 
  LayoutDashboard, 
  Package, 
  ChevronRight, 
  FileText, 
  TrendingUp, 
  BedDouble, 
  UserPlus, 
  LogOut, 
  Truck, 
  Hammer,
  UserCheck,
  Building2,
  ShieldAlert,
  Printer,
  UtensilsCrossed,
  Sprout,
  Pill,
  Award,
  Calendar,
  KeyRound,
  ShieldCheck,
  Clock
} from 'lucide-react';

export default function CentralModulosView({ userName = "Usuário", onSelectModule }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.25rem',
      width: '100%',
      maxWidth: '1600px',
      margin: '0 auto'
    }}>
      
      {/* CABEÇALHO EXCLUSIVO DE IMPRESSÃO (PDF / A4 LANDSCAPE) */}
      <div className="print-only" style={{ 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid #2563eb'
      }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0, textTransform: 'uppercase' }}>
          Fundação Doutor Jesus • Sistema de Gestão Integrada (SGI)
        </h1>
        <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, marginTop: '2px' }}>
          ORGANOGRAMA OFICIAL DOS 6 MACROMÓDULOS E 13 MÓDULOS SISTÊMICOS
        </div>
        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
          Parceria SJDH-BA / MROSC Lei 13.019/2014 • Emissão: {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>
      
      {/* HEADER BANNER (SCREEN ONLY) */}
      <div className="card no-print" style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderLeft: '4px solid var(--primary)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">Fundação Doutor Jesus • SGI MROSC Bahia</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0, fontWeight: 900 }}>
            Bem-vindo, <span style={{ color: 'var(--primary)' }}>{userName}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Selecione a área do sistema que deseja acessar ou imprima o relatório completo dos 6 macromódulos.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => window.print()}
            style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Printer size={15} /> Imprimir Organograma (PDF)
          </button>
        </div>
      </div>

      {/* LINHA 1: 4 MACROMÓDULOS DE ROTINA OPERACIONAL (ACOLHIDOS -> ADMINISTRATIVO -> SAÚDE -> PRESTAÇÃO DE CONTAS) */}
      <div className="grid-linha-1" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '0.85rem',
        width: '100%',
        alignItems: 'stretch'
      }}>
        
        {/* MACROMÓDULO 1: GESTÃO DOS ACOLHIDOS */}
        <div className="card" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          borderTop: '4px solid #dc2626',
          borderRadius: '12px',
          background: 'var(--bg-card)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
          padding: '0.75rem 0.65rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
            <div style={{ background: 'rgba(220, 38, 38, 0.12)', color: '#ef4444', padding: '0.4rem', borderRadius: '8px' }}>
              <Users size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                1. Gestão dos Acolhidos
              </h3>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Triagem, leitos e altas</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {/* DASHBOARD - NO TOPO ACIMA DO MÓDULO 1 */}
            <div onClick={() => onSelectModule('dash_acolhidos')} className="submodule-item-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px', background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.25)' }}>
              <LayoutDashboard size={14} style={{ color: '#dc2626', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '0.75rem', color: '#dc2626', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>📊 Dashboard & Indicadores</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Gráficos da Gestão dos Acolhidos</div>
              </div>
              <ChevronRight size={13} style={{ color: '#dc2626' }} />
            </div>

            <div onClick={() => onSelectModule('triagem')} className="submodule-item-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px' }}>
              <UserPlus size={14} style={{ color: '#dc2626', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Módulo 1: Triagem</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admissão e cofre</div>
              </div>
              <ChevronRight size={13} style={{ color: '#dc2626' }} />
            </div>

            <div onClick={() => onSelectModule('leitos')} className="submodule-item-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px' }}>
              <BedDouble size={14} style={{ color: '#dc2626', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Módulo 2: Leitos</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>4 Blocos e chamada</div>
              </div>
              <ChevronRight size={13} style={{ color: '#dc2626' }} />
            </div>

            <div onClick={() => onSelectModule('familia')} className="submodule-item-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px' }}>
              <Users size={14} style={{ color: '#dc2626', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Módulo 3: Rede Familiar</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Visitas e Passe</div>
              </div>
              <ChevronRight size={13} style={{ color: '#dc2626' }} />
            </div>

            <div onClick={() => onSelectModule('desligamento')} className="submodule-item-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px' }}>
              <LogOut size={14} style={{ color: '#dc2626', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Módulo 4: Desligamentos</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Altas e SineBahia</div>
              </div>
              <ChevronRight size={13} style={{ color: '#dc2626' }} />
            </div>

            <div onClick={() => onSelectModule('cad_acolhidos', 'leitos_cad')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px', background: 'rgba(220, 38, 38, 0.05)', border: '1px dashed #ef4444' }}>
              <UserCheck size={14} style={{ color: '#b91c1c', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.725rem', color: '#991b1b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Cadastros Acolhidos</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Tabelas de leitos e visitantes</div>
              </div>
              <ChevronRight size={13} style={{ color: '#b91c1c' }} />
            </div>
          </div>
        </div>

        {/* MACROMÓDULO 2: ADMINISTRATIVO */}
        <div className="card" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          borderTop: '4px solid #059669',
          borderRadius: '12px',
          background: 'var(--bg-card)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
          padding: '0.75rem 0.65rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
            <div style={{ background: 'rgba(5, 150, 105, 0.12)', color: '#10b981', padding: '0.4rem', borderRadius: '8px' }}>
              <Package size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                2. Administrativo
              </h3>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Almoxarifado, despensa e frota</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {/* DASHBOARD - NO TOPO ACIMA DO MÓDULO 5 */}
            <div onClick={() => onSelectModule('dash_admin')} className="submodule-item-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px', background: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.25)' }}>
              <LayoutDashboard size={14} style={{ color: '#059669', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '0.75rem', color: '#059669', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>📊 Dashboard & Indicadores</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Gráficos do Almoxarifado & Frota</div>
              </div>
              <ChevronRight size={13} style={{ color: '#059669' }} />
            </div>

            <div onClick={() => onSelectModule('doacoes')} className="submodule-item-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px' }}>
              <Package size={14} style={{ color: '#059669', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Módulo 5: Almoxarifado</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Estoque FEFO</div>
              </div>
              <ChevronRight size={13} style={{ color: '#059669' }} />
            </div>

            <div onClick={() => onSelectModule('despensa')} className="submodule-item-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px' }}>
              <UtensilsCrossed size={14} style={{ color: '#10b981', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Módulo 6: Despensa & Nutrição</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Entrada/Saída de alimentos</div>
              </div>
              <ChevronRight size={13} style={{ color: '#10b981' }} />
            </div>

            <div onClick={() => onSelectModule('frota')} className="submodule-item-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px' }}>
              <Truck size={14} style={{ color: '#059669', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Módulo 7: Frota</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Ônibus, diesel S10 e OS</div>
              </div>
              <ChevronRight size={13} style={{ color: '#059669' }} />
            </div>

            <div onClick={() => onSelectModule('cad_admin', 'fornecedores_cad')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px', background: 'rgba(5, 150, 105, 0.05)', border: '1px dashed #059669' }}>
              <UserCheck size={14} style={{ color: '#047857', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.725rem', color: '#065f46', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Cadastros Administrativo</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Fornecedores e frotas</div>
              </div>
              <ChevronRight size={13} style={{ color: '#047857' }} />
            </div>
          </div>
        </div>

        {/* MACROMÓDULO 3: SAÚDE & EQUIPE MULTIDISCIPLINAR */}
        <div className="card" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          borderTop: '4px solid #0284c7',
          borderRadius: '12px',
          background: 'var(--bg-card)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
          padding: '0.75rem 0.65rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
            <div style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7', padding: '0.4rem', borderRadius: '8px' }}>
              <Stethoscope size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                3. Saúde & Equipe Multidisciplinar
              </h3>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Prontuários (RDC 29) e laborterapia</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {/* DASHBOARD - NO TOPO ACIMA DO MÓDULO 8 */}
            <div onClick={() => onSelectModule('dash_saude')} className="submodule-item-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px', background: 'rgba(2, 132, 199, 0.08)', border: '1px solid rgba(2, 132, 199, 0.25)' }}>
              <LayoutDashboard size={14} style={{ color: '#0284c7', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '0.75rem', color: '#0284c7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>📊 Dashboard & Indicadores</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Gráficos do Corpo Clínico & SUS</div>
              </div>
              <ChevronRight size={13} style={{ color: '#0284c7' }} />
            </div>

            <div onClick={() => onSelectModule('saude')} className="submodule-item-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px' }}>
              <Stethoscope size={14} style={{ color: '#0284c7', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Módulo 8: Prontuário</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>PTI e RDC 29 ANVISA</div>
              </div>
              <ChevronRight size={13} style={{ color: '#0284c7' }} />
            </div>

            <div onClick={() => onSelectModule('laborterapia')} className="submodule-item-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px' }}>
              <Hammer size={14} style={{ color: '#0284c7', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Módulo 9: Laborterapia</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Rotina e certificado 240h</div>
              </div>
              <ChevronRight size={13} style={{ color: '#0284c7' }} />
            </div>

            <div onClick={() => onSelectModule('cad_saude', 'profissionais_cad')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px', background: 'rgba(2, 132, 199, 0.05)', border: '1px dashed #0284c7' }}>
              <UserCheck size={14} style={{ color: '#0369a1', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.725rem', color: '#075985', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Cadastros Saúde & Multidisciplinar</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Equipe CRM/CRP e farmácia</div>
              </div>
              <ChevronRight size={13} style={{ color: '#0369a1' }} />
            </div>
          </div>
        </div>

        {/* MACROMÓDULO 4: PRESTAÇÃO DE CONTAS */}
        <div className="card" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          borderTop: '4px solid #1d4ed8',
          borderRadius: '12px',
          background: 'var(--bg-card)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
          padding: '0.75rem 0.65rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
            <div style={{ background: 'rgba(29, 78, 216, 0.12)', color: '#3b82f6', padding: '0.4rem', borderRadius: '8px' }}>
              <Landmark size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                4. Prestação de Contas
              </h3>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Financeiro e MROSC</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {/* DASHBOARD - NO TOPO ACIMA DO MÓDULO 10 */}
            <div onClick={() => onSelectModule('dash_prestacao')} className="submodule-item-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px', background: 'rgba(29, 78, 216, 0.08)', border: '1px solid rgba(29, 78, 216, 0.25)' }}>
              <LayoutDashboard size={14} style={{ color: '#2563eb', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '0.75rem', color: '#2563eb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>📊 Dashboard & Indicadores</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Gráficos Financeiros & Rubricas</div>
              </div>
              <ChevronRight size={13} style={{ color: '#2563eb' }} />
            </div>

            <div onClick={() => onSelectModule('financeiro')} className="submodule-item-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px' }}>
              <TrendingUp size={14} style={{ color: '#2563eb', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Módulo 10: Financeiro</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Contas segregadas</div>
              </div>
              <ChevronRight size={13} style={{ color: '#2563eb' }} />
            </div>

            <div onClick={() => onSelectModule('mrosc')} className="submodule-item-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px' }}>
              <FileText size={14} style={{ color: '#2563eb', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Módulo 11: Parcerias</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>MROSC (Lei 13.019)</div>
              </div>
              <ChevronRight size={13} style={{ color: '#2563eb' }} />
            </div>

            <div onClick={() => onSelectModule('cad_prestacao', 'contas_cad')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px', background: 'rgba(29, 78, 216, 0.05)', border: '1px dashed #2563eb' }}>
              <UserCheck size={14} style={{ color: '#1d4ed8', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.725rem', color: '#1e40af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Cadastros & Ponto Focal</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Prestação de contas</div>
              </div>
              <ChevronRight size={13} style={{ color: '#1d4ed8' }} />
            </div>
          </div>
        </div>

      </div>

      {/* VISUAL SEPARATOR WITH GAP */}
      <div style={{ margin: '0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'var(--bg-main)', padding: '0 0.5rem' }}>
          📊 Governança Executiva & Infraestrutura de TI
        </span>
        <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }} />
      </div>

      {/* LINHA 2: 2 MACROMÓDULOS (DIRETORIA E ADMINISTRAÇÃO DO SISTEMA) */}
      <div className="grid-linha-2" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '0.85rem',
        width: '100%',
        alignItems: 'stretch'
      }}>

        {/* MACROMÓDULO 5: DIRETORIA & BI EXECUTIVO */}
        <div className="card" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          borderTop: '4px solid #d97706',
          borderRadius: '12px',
          background: 'var(--bg-card)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
          padding: '0.75rem 0.65rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
            <div style={{ background: 'rgba(217, 119, 6, 0.12)', color: '#d97706', padding: '0.4rem', borderRadius: '8px' }}>
              <LayoutDashboard size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                5. Diretoria & BI Executivo
              </h3>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Indicadores e cadastros estratégicos</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div onClick={() => onSelectModule('dashboard')} className="submodule-item-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px', background: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.25)' }}>
              <LayoutDashboard size={14} style={{ color: '#d97706', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '0.75rem', color: '#d97706', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Módulo 12: Painel BI 360°</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Indicadores globais de ocupação</div>
              </div>
              <ChevronRight size={13} style={{ color: '#d97706' }} />
            </div>

            <div onClick={() => onSelectModule('focais', 'focais_matriz')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px', background: 'rgba(217, 119, 6, 0.05)', border: '1px dashed #d97706' }}>
              <UserCheck size={14} style={{ color: '#b45309', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.725rem', color: '#78350f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Matriz Pessoas Focais</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Delegação global</div>
              </div>
              <ChevronRight size={13} style={{ color: '#b45309' }} />
            </div>
          </div>
        </div>

        {/* MACROMÓDULO 6: ADMINISTRAÇÃO & TI */}
        <div className="card" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          borderTop: '4px solid #0f172a',
          borderRadius: '12px',
          background: 'var(--bg-card)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
          padding: '0.75rem 0.65rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.12)', color: '#0f172a', padding: '0.4rem', borderRadius: '8px' }}>
              <KeyRound size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                6. Administração & TI
              </h3>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Infraestrutura e backups</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div onClick={() => onSelectModule('adminSistema')} className="submodule-item-card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px' }}>
              <Clock size={14} style={{ color: '#0f172a', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Módulo 13: Infra & TI</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Uptime 99.99%, logs e backups</div>
              </div>
              <ChevronRight size={13} style={{ color: '#0f172a' }} />
            </div>

            <div onClick={() => onSelectModule('usuarios', 'usuarios_permissao')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.45rem 0.55rem', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.05)', border: '1px dashed #0f172a' }}>
              <UserCheck size={14} style={{ color: '#0f172a', shrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.725rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Cadastros & Ponto Focal (TI)</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pessoas focais e suporte TI</div>
              </div>
              <ChevronRight size={13} style={{ color: '#0f172a' }} />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
