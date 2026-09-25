import React from 'react';
import { 
  ChevronLeft,
  ChevronRight,
  Grid,
  Scale,
  KeyRound, 
  LayoutDashboard, 
  UserPlus, 
  BedDouble, 
  Stethoscope, 
  FileText, 
  ShoppingCart,
  ShoppingBag,
  Landmark, 
  Hammer, 
  Package, 
  ArrowLeft,
  ArrowRightLeft,
  Users,
  LogOut,
  Truck,
  TrendingDown,
  TrendingUp,
  Building,
  FolderTree,
  Upload,
  Clock,
  Home,
  User,
  Target,
  Pill,
  Smile,
  Activity,
  Siren,
  Search,
  Printer,
  UtensilsCrossed,
  Sprout,
  ChefHat,
  Award,
  Calendar,
  Video,
  Car,
  Bus,
  MessageSquare,
  Heart,
  HeartPulse,
  Receipt,
  Lock,
  Briefcase,
  HeartHandshake,
  PieChart,
  Hospital,
  Fuel,
  Wrench,
  ShieldCheck,
  DollarSign,
  CheckCircle2,
  MapPin,
  Boxes,
  Calculator,
  ShieldAlert,
  FileCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, activeSubTab, setActiveSubTab, mobileOpen, setMobileOpen }) {
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    return localStorage.getItem('sgi_sidebar_collapsed') === 'true';
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sgi_sidebar_collapsed', String(next));
      return next;
    });
  };
  // Helper to handle clicks on mobile
  const handleItemClick = (action) => {
    action();
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  // Sub-items navigation configuration per module
  const MODULE_SIDEBAR_CONFIG = {
    triagem: {
      title: 'Módulo 1: Triagem & Admissão',
      icon: UserPlus,
      color: '#dc2626',
      items: [
        { id: 'novo', label: '1. 📝 Nova Anamnese & Admissão', icon: UserPlus },
        { id: 'lista', label: '2. 📋 Consulta & Lista de Acolhidos', icon: FileText },
        { id: 'cofre', label: '3. 🔒 Custódia & Cofre de Pertences', icon: Lock },
        { id: 'termos', label: '4. 📜 Termos Legais & Voluntariado', icon: ShieldCheck }
      ]
    },
    leitos: {
      title: 'Módulo 2: Alojamentos & Leitos',
      icon: BedDouble,
      color: '#0284c7',
      items: [
        { id: 'blocos', label: '1. 📊 Visão Geral dos 4 Blocos', icon: Grid },
        { id: 'blocoA', label: '2. 🏠 Bloco A - Restauração', icon: Home },
        { id: 'blocoB', label: '3. 🏠 Bloco B - Renovação', icon: Home },
        { id: 'blocoC', label: '4. 🏠 Bloco C - Esperança', icon: Home },
        { id: 'blocoD', label: '5. 🏠 Bloco D - Graça', icon: Home },
        { id: 'enfermaria', label: '6. 🏥 Apoio Saúde & Enfermaria', icon: HeartPulse },
        { id: 'listaAcolhidos', label: '7. 📋 Lista de Ocupação dos Leitos', icon: Users },
        { id: 'transferencia', label: '8. 🔄 Transferência de Leito', icon: ArrowRightLeft },
        { id: 'pernoite', label: '9. ⏱️ Chamada & Pernoite Noturno', icon: Clock }
      ]
    },
    familia: {
      title: 'Módulo 3: Rede Familiar',
      icon: Users,
      color: '#0284c7',
      items: [
        { id: 'visitas', label: '1. 👨‍👩‍👧‍👦 Visitas Presenciais (Domingo)', icon: Calendar },
        { id: 'video', label: '2. 📱 Videochamadas Assistidas', icon: Video },
        { id: 'passe', label: '3. 🚗 Passe Terapêutico Fim de Semana', icon: Car },
        { id: 'boletim', label: '4. 💬 Boletim de Saúde (WhatsApp)', icon: MessageSquare }
      ]
    },
    desligamento: {
      title: 'Módulo 4: Altas & Reinserção',
      icon: LogOut,
      color: '#0284c7',
      items: [
        { id: 'altas', label: '1. 🎓 Altas Terapêuticas Concluídas', icon: Award },
        { id: 'cofre', label: '2. 🔓 Devolução de Pertences do Cofre', icon: Lock },
        { id: 'mentores', label: '3. 🤝 Egressos Mentores & Acompanhamento', icon: HeartHandshake }
      ]
    },
    doacoes: {
      title: 'Módulo 5: Almoxarifado',
      icon: Package,
      color: '#d97706',
      items: [
        { id: 'estoque', label: '1. 📦 Controle Kardex & Endereçamento', icon: Package },
        { id: 'doacoes', label: '2. 🛍️ Entradas de Doações & Compras NFe', icon: ShoppingBag },
        { id: 'requisicoes', label: '3. 🚚 Requisições Internas (RMI)', icon: Truck },
        { id: 'inventario', label: '4. ⚖️ Inventário Físico (TCE-BA)', icon: Scale },
        { id: 'recibos', label: '5. 🧾 Recibos & Dossiês CNPJ', icon: Receipt }
      ]
    },
    despensa: {
      title: 'Módulo 6: Despensa & Nutrição',
      icon: UtensilsCrossed,
      color: '#10b981',
      items: [
        { id: 'entradas', label: '1. 📥 Entradas & Transferências RMI', icon: ShoppingBag },
        { id: 'estoque', label: '2. 🏛️ Despensa Física (Estoque Armazenado)', icon: Boxes },
        { id: 'gramatura', label: '3. 🧮 Calculadora Per Capita (Gramatura)', icon: Calculator },
        { id: 'dietas', label: '4. 🥗 Dietas Especiais (RDC 29)', icon: HeartPulse },
        { id: 'saidas', label: '5. 🍳 Saída p/ Refeições dos Acolhidos', icon: ChefHat },
        { id: 'cardapio', label: '6. 📋 Cardápio Semanal (4.000 ref/dia)', icon: UtensilsCrossed },
        { id: 'pedidos', label: '7. 🛒 Compras MROSC (Reposição)', icon: ShoppingCart },
        { id: 'comparador', label: '8. 📊 Comparador de Preços (Cotação)', icon: TrendingUp },
        { id: 'perdas', label: '9. ⚠️ Descarte & Perdas Sanitárias', icon: ShieldAlert }
      ]
    },
    frota: {
      title: 'Módulo 7: Frota & Manutenção',
      icon: Truck,
      color: '#d97706',
      items: [
        { id: 'veiculos', label: '1. 🚚 Frota de Veículos & Checklist', icon: Car },
        { id: 'transporte', label: '2. 🚑 Escala de Transporte SUS', icon: Bus },
        { id: 'combustivel', label: '3. ⛽ Abastecimentos & Diesel S10', icon: Fuel },
        { id: 'manutencao', label: '4. 🛠️ Ordens de Serviço & Oficina', icon: Wrench }
      ]
    },
    saude: {
      title: 'Módulo 8: Prontuário Saúde',
      icon: Stethoscope,
      color: '#0284c7',
      items: [
        { id: 'resumo', label: '1. 👤 Resumo do Prontuário & Ficha Clínica', icon: User },
        { id: 'pti', label: '2. 🎯 Plano Terapêutico (PTI RDC 29)', icon: Target },
        { id: 'meds', label: '3. 💊 Aprazamento de Medicamentos', icon: Pill },
        { id: 'evolucoes', label: '4. 📝 Feed de Evoluções Clínicas', icon: Activity },
        { id: 'odonto', label: '5. 🦷 Odontologia & Autoestima', icon: Smile },
        { id: 'emergencias', label: '6. 🚑 Regulação SAMU 192', icon: Siren }
      ]
    },
    laborterapia: {
      title: 'Módulo 9: Laborterapia & Rotina Terapêutica',
      icon: Hammer,
      color: '#dc2626',
      items: [
        { id: 'escalas', label: '1. 📊 Escala Geral dos 5 Setores', icon: Hammer },
        { id: 'padaria', label: '2. 🍞 Padaria da Comunidade (2.200 pães/dia)', icon: ChefHat },
        { id: 'cozinha', label: '3. 🥗 Cozinha Industrial (4.000 ref/dia)', icon: UtensilsCrossed },
        { id: 'horta', label: '4. 🌿 Horta & Agroecologia Orgânica', icon: Sprout },
        { id: 'certificado', label: '5. 🎓 Certificado Formativo (240h)', icon: Award }
      ]
    },
    financeiro: {
      title: 'Módulo 10: Gestão Financeira Segregada',
      icon: DollarSign,
      color: '#059669',
      items: [
        { id: 'dashboard', label: '1. 📊 Dashboard Executivo', icon: LayoutDashboard },
        { id: 'pagar', label: '2. 🔻 Contas a Pagar (A/P)', icon: TrendingDown },
        { id: 'receber', label: '3. 🔺 Contas a Receber (A/R)', icon: TrendingUp },
        { id: 'homologacao', label: '4. 🧾 NFe & Liquidação Segregada', icon: Receipt },
        { id: 'conciliacao', label: '5. 🏦 Conciliação OFX & Relatórios REF', icon: CheckCircle2 },
        { id: 'tesouraria', label: '6. 🏛️ Tesouraria & Extrato Bancário', icon: Landmark },
        { id: 'dre', label: '7. 📈 DRE Gerencial por Convênio', icon: PieChart },
        { id: 'bancos', label: '8. 🏢 Contas Segregadas & Tesouraria', icon: Building },
        { id: 'planocontas', label: '9. 🗂️ Plano de Contas SJDH-BA', icon: FolderTree },
        { id: 'rendimentos', label: '10. 📊 Rendimentos CDB MROSC', icon: TrendingUp }
      ]
    },
    mrosc: {
      title: 'Módulo 11: Parcerias MROSC',
      icon: FileText,
      color: '#2563eb',
      items: [
        { id: 'visao', label: '1. 📜 Visão Geral & Termos SJDH-BA', icon: Landmark },
        { id: 'solicitacoes', label: '2. 🛒 Pedido de Compras & Rubricas', icon: ShoppingCart },
        { id: 'cotacoes', label: '3. 📊 Cotações & Compliance QSA', icon: ShieldCheck },
        { id: 'anexo1', label: '4. 📑 Anexo I: Plano de Trabalho', icon: FileText },
        { id: 'anexo2', label: '5. 📊 Anexo II: Execução Objeto (REO)', icon: Activity },
        { id: 'anexo3', label: '6. 💰 Anexo III: Execução Financeira (REF)', icon: DollarSign },
        { id: 'anexo4', label: '7. 🏦 Anexo IV: Conciliação & Rendimentos', icon: CheckCircle2 },
        { id: 'anexo5', label: '8. 🛡️ Auditoria & Dossiê Compactado', icon: ShieldCheck },
        { id: 'anexo6', label: '9. 🏅 Anexo VI: Parecer TCE-BA / SJDH', icon: Award }
      ]
    },
    cad_acolhidos: {
      title: '1. Gestão dos Acolhidos — Cadastros',
      icon: Users,
      color: '#dc2626',
      items: [
        { id: 'leitos_cad', label: '1.1. Alojamentos & Leitos', icon: BedDouble },
        { id: 'visitantes_cad', label: '1.2. Visitantes Autorizados & Família', icon: Users },
        { id: 'mentores_cad', label: '1.3. Egressos Mentores & Padrinhos', icon: HeartHandshake },
        { id: 'followup_cad', label: '1.4. Registros de Follow-Up Pós-Alta', icon: CheckCircle2 },
        { id: 'substancias_cad', label: '1.5. Catálogo de Substâncias (Seletores)', icon: Pill },
        { id: 'destinos_cad', label: '1.6. Destinos de Encaminhamento (Seletores)', icon: Award },
        { id: 'todos_cad', label: 'Ver Todos os Cadastros', icon: Grid }
      ]
    },
    dash_acolhidos: {
      title: '1. Gestão dos Acolhidos — Dashboard',
      icon: LayoutDashboard,
      color: '#dc2626',
      items: [
        { id: 'visao', label: '📊 Painel Gerencial & Indicadores', icon: LayoutDashboard }
      ]
    },
    cad_admin: {
      title: '2. Módulo Administrativo — Cadastros',
      icon: Package,
      color: '#059669',
      items: [
        { id: 'almoxarifado_cad', label: '📦 Cadastros do Almoxarifado (Galpões & Setores)', icon: Package },
        { id: 'despensa_cad', label: '🥗 Cadastros da Despensa (Fornecedores & Doadoras)', icon: UtensilsCrossed },
        { id: 'frota_cad', label: '🚚 Cadastros da Frota (Veículos & Motoristas)', icon: Truck }
      ]
    },
    dash_admin: {
      title: '2. Módulo Administrativo — Dashboard',
      icon: LayoutDashboard,
      color: '#059669',
      items: [
        { id: 'visao', label: '📊 Painel Gerencial & Indicadores', icon: LayoutDashboard }
      ]
    },
    cad_saude: {
      title: '3. Saúde & Multidisciplinar — Cadastros',
      icon: Stethoscope,
      color: '#0284c7',
      items: [
        { id: 'profissionais_cad', label: '3.1. Corpo Clínico & Multidisciplinar', icon: Stethoscope },
        { id: 'procedimentos_cad', label: '3.2. Catálogo de Procedimentos Odontológicos & Clínicos', icon: FileCheck },
        { id: 'meds_cad', label: '3.3. Catálogo de Medicamentos da Farmácia', icon: Pill },
        { id: 'cargos_cad', label: '3.4. Catálogo de Cargos & Funções de Laborterapia', icon: Hammer },
        { id: 'sus_cad', label: '3.5. Unidades da Rede SUS de Referência', icon: Hospital }
      ]
    },
    dash_saude: {
      title: '3. Saúde & Multidisciplinar — Dashboard',
      icon: LayoutDashboard,
      color: '#0284c7',
      items: [
        { id: 'visao', label: '📊 Painel Gerencial & Indicadores', icon: LayoutDashboard }
      ]
    },
    cad_prestacao: {
      title: '4. Prestação de Contas — Cadastros',
      icon: Landmark,
      color: '#2563eb',
      items: [
        { id: 'contas_cad', label: '4.1. Contas Bancárias Segregadas', icon: Landmark },
        { id: 'rubricas_cad', label: '4.2. Plano de Contas SJDH & Rubricas', icon: FileText },
        { id: 'todos_cad', label: 'Ver Todos os Cadastros', icon: Grid }
      ]
    },
    dash_prestacao: {
      title: '4. Prestação de Contas — Dashboard',
      icon: LayoutDashboard,
      color: '#2563eb',
      items: [
        { id: 'visao', label: '📊 Painel Gerencial & Indicadores', icon: LayoutDashboard }
      ]
    },
    focais: {
      title: '5. Diretoria & BI Executivo',
      icon: ShieldCheck,
      color: '#d97706',
      items: [
        { id: 'focais_matriz', label: '5.1. Matriz de Pessoas Focais', icon: ShieldCheck }
      ]
    },
    usuarios: {
      title: '6. Administração & TI',
      icon: KeyRound,
      color: '#0f172a',
      items: [
        { id: 'usuarios_permissao', label: '6.1. Usuários & Permissões SGI', icon: KeyRound }
      ]
    },
    dashboard: {
      title: 'Módulo 12: BI Executivo 360°',
      icon: LayoutDashboard,
      color: '#d97706',
      items: [
        { id: 'bi', label: 'Painel BI Executivo 360°', icon: LayoutDashboard },
        { id: 'relatorios', label: 'Relatórios de Ocupação & Metas', icon: PieChart }
      ]
    },
    adminSistema: {
      title: 'Módulo 13: Administração do Sistema',
      icon: Clock,
      color: '#0f172a',
      items: [
        { id: 'audit', label: 'Logs de Auditoria (Audit Trail)', icon: Clock },
        { id: 'health', label: 'Saúde do Sistema & Vercel', icon: Building },
        { id: 'security', label: 'Segurança, Sessões & 2FA', icon: Lock },
        { id: 'backups', label: 'Backups & Exportação TCE-BA', icon: Upload }
      ]
    }
  };

  const currentModuleConfig = MODULE_SIDEBAR_CONFIG[activeTab] || {
    title: 'Módulo Ativo',
    icon: Grid,
    color: 'var(--primary)',
    items: []
  };

  const ModuleIcon = currentModuleConfig.icon;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="sidebar-mobile-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 1040
          }}
        />
      )}

      <aside className={`sidebar mobile-drawer ${mobileOpen ? 'mobile-open' : ''} ${isCollapsed ? 'collapsed' : ''}`} style={{
        width: isCollapsed ? '76px' : '280px',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: isCollapsed ? '1rem 0.5rem' : '1.25rem 1rem',
        flexShrink: 0,
        height: '100%',
        boxShadow: 'var(--shadow-sm)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease, transform 0.3s ease',
        zIndex: 1050
      }}>
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: isCollapsed ? '0' : '0.2rem' }}>
          
          {/* Botão de Toggle Recolher / Expandir Sidebar */}
          <button
            onClick={toggleCollapse}
            title={isCollapsed ? "Expandir Menu Lateral" : "Recolher Menu Lateral"}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'space-between',
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              marginBottom: '0.75rem',
              transition: 'all 0.2s ease'
            }}
          >
            {!isCollapsed && <span>Recolher Sidebar</span>}
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Current Active Module Header */}
          <div style={{ 
            background: 'var(--bg-card)', 
            padding: isCollapsed ? '0.6rem 0.4rem' : '0.75rem', 
            borderRadius: '8px', 
            borderLeft: isCollapsed ? 'none' : `4px solid ${currentModuleConfig.color}`,
            border: '1px solid var(--border-color)',
            borderTop: `3px solid ${currentModuleConfig.color}`,
            marginBottom: '0.75rem',
            textAlign: isCollapsed ? 'center' : 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: '0.5rem' }}>
              <ModuleIcon size={20} style={{ color: currentModuleConfig.color, flexShrink: 0 }} />
              {!isCollapsed && (
                <span style={{ fontWeight: 800, fontSize: '0.825rem', color: 'var(--text-main)', whiteSpace: 'normal', lineHeight: 1.2 }}>
                  {currentModuleConfig.title}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <p style={{ fontSize: '0.675rem', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
                Navegação deste módulo
              </p>
            )}
          </div>

          {/* Dedicated Internal Items of the Active Module */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {!isCollapsed && (
              <p style={{
                fontSize: '0.675rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.25rem',
                paddingLeft: '0.35rem'
              }}>
                Navegação Interna
              </p>
            )}

            {currentModuleConfig.items.map((item) => {
              const ItemIcon = item.icon;
              const isSubActive = activeSubTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(() => setActiveSubTab && setActiveSubTab(item.id))}
                  className={`btn btn-sm ${isSubActive ? 'btn-primary' : 'btn-secondary'}`}
                  title={isCollapsed ? item.label : undefined}
                  style={{
                    width: '100%',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    gap: '0.6rem',
                    padding: isCollapsed ? '0.65rem 0' : '0.65rem 0.95rem',
                    textAlign: 'left',
                    fontSize: '0.825rem',
                    fontWeight: isSubActive ? 800 : 500
                  }}
                >
                  <ItemIcon size={18} style={{ color: isSubActive ? '#ffffff' : 'var(--text-dim)', flexShrink: 0 }} />
                  {!isCollapsed && (
                    <span style={{ whiteSpace: 'normal', lineHeight: 1.25, wordBreak: 'break-word', textAlign: 'left' }}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Return Button */}
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => handleItemClick(() => setActiveTab('central'))}
            className="btn btn-secondary btn-sm"
            title={isCollapsed ? "Central de Módulos" : undefined}
            style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8rem', padding: isCollapsed ? '0.6rem 0' : '0.6rem 0.75rem' }}
          >
            <Grid size={16} />
            {!isCollapsed && <span>Central de Módulos</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
