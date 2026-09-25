import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CentralModulosView from './components/CentralModulosView';
import DashboardView from './components/DashboardView';
import TriagemAcolhimentoView from './components/TriagemAcolhimentoView';
import GestaoLeitosView from './components/GestaoLeitosView';
import ProntuarioSaudeView from './components/ProntuarioSaudeView';
import ParceriasMROSCView from './components/ParceriasMROSCView';
import FinanceiroView from './components/FinanceiroView';
import LaborterapiaView from './components/LaborterapiaView';
import AtendimentoFamiliarView from './components/AtendimentoFamiliarView';
import DoacoesAlmoxarifadoView from './components/DoacoesAlmoxarifadoView';
import DespensaAlimentosView from './components/DespensaAlimentosView';
import DesligamentoReinsercaoView from './components/DesligamentoReinsercaoView';
import FrotaManutencaoView from './components/FrotaManutencaoView';
import CadastrosBaseView from './components/CadastrosBaseView';
import CadastrosAcolhidosView from './components/CadastrosAcolhidosView';
import CadastrosAdminView from './components/CadastrosAdminView';
import CadastrosSaudeView from './components/CadastrosSaudeView';
import CadastrosFinanceiroView from './components/CadastrosFinanceiroView';
import CadastrosFocaisView from './components/CadastrosFocaisView';
import CadastrosUsuariosView from './components/CadastrosUsuariosView';
import AdminSistemaView from './components/AdminSistemaView';
import LandingPageView from './components/LandingPageView';
import LoginView from './components/LoginView';
import MacromoduloDashboardView from './components/MacromoduloDashboardView';

import { 
  INITIAL_METRICS, 
  INITIAL_ACOLHIDOS, 
  INITIAL_BLOCOS, 
  INITIAL_PARCERIAS_MROSC, 
  INITIAL_TRANSACOES_FINANCEIRAS,
  INITIAL_PRESENCA_DIARIA,
  INITIAL_PROFISSIONAIS,
  INITIAL_REDE_SUS,
  INITIAL_FORNECEDORES,
  INITIAL_CLIENTES,
  INITIAL_PROCEDIMENTOS_ODONTO,
  INITIAL_MEDICAMENTOS_CATALOGO,
  INITIAL_CARGOS_LABORTERAPIA,
  SAMPLE_ACOLHIDOS
} from './mockData';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card" style={{ borderLeft: '4px solid var(--status-danger)', padding: '1.5rem', margin: '1rem' }}>
          <h3 style={{ color: 'var(--status-danger)', margin: '0 0 0.5rem 0' }}>⚠️ Falha Temporária ao Carregar Módulo</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{this.state.error?.toString()}</p>
          <button className="btn btn-primary btn-sm" onClick={() => this.setState({ hasError: false })}>
            Tentar Recarregar Módulo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // Default screen is 'landing' (Landing Page Institucional MROSC Bahia)
  const [activeTab, setActiveTab] = useState('landing');
  const [currentProfile, setCurrentProfile] = useState('Diretoria');
  const [theme, setTheme] = useState(() => {
    localStorage.setItem('sgi_fdj_theme', 'light');
    return 'light';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Repositories State with LocalStorage Persistence
  const [acolhidos, setAcolhidos] = useState(() => {
    const resetKey = localStorage.getItem('sgi_fdj_reset_v2');
    if (!resetKey) {
      localStorage.setItem('sgi_fdj_acolhidos', JSON.stringify([]));
      localStorage.setItem('sgi_fdj_reset_v2', 'true');
      return [];
    }
    const saved = localStorage.getItem('sgi_fdj_acolhidos');
    return saved ? JSON.parse(saved) : [];
  });

  const handleResetAcolhidos = () => {
    setAcolhidos([]);
    localStorage.setItem('sgi_fdj_acolhidos', JSON.stringify([]));
  };

  const handleRestoreAcolhidos = () => {
    setAcolhidos(SAMPLE_ACOLHIDOS);
    localStorage.setItem('sgi_fdj_acolhidos', JSON.stringify(SAMPLE_ACOLHIDOS));
  };

  const [profissionais, setProfissionais] = useState(() => {
    const saved = localStorage.getItem('sgi_fdj_profissionais');
    return saved ? JSON.parse(saved) : INITIAL_PROFISSIONAIS;
  });

  const [redeSUS, setRedeSUS] = useState(() => {
    const saved = localStorage.getItem('sgi_fdj_rede_sus');
    return saved ? JSON.parse(saved) : INITIAL_REDE_SUS;
  });

  const [procedimentosOdonto, setProcedimentosOdonto] = useState(() => {
    const saved = localStorage.getItem('sgi_fdj_procedimentos_odonto');
    return saved ? JSON.parse(saved) : INITIAL_PROCEDIMENTOS_ODONTO;
  });

  const handleAddProcedimentoOdonto = (novoProc) => {
    const updated = [novoProc, ...procedimentosOdonto];
    setProcedimentosOdonto(updated);
    localStorage.setItem('sgi_fdj_procedimentos_odonto', JSON.stringify(updated));
  };

  const [medicamentosCatalogo, setMedicamentosCatalogo] = useState(() => {
    const saved = localStorage.getItem('sgi_fdj_medicamentos_catalogo');
    return saved ? JSON.parse(saved) : INITIAL_MEDICAMENTOS_CATALOGO;
  });

  const handleAddMedicamentoCatalogo = (novoMed) => {
    const updated = [novoMed, ...medicamentosCatalogo];
    setMedicamentosCatalogo(updated);
    localStorage.setItem('sgi_fdj_medicamentos_catalogo', JSON.stringify(updated));
  };

  const [cargosLaborterapia, setCargosLaborterapia] = useState(() => {
    const saved = localStorage.getItem('sgi_fdj_cargos_laborterapia');
    return saved ? JSON.parse(saved) : INITIAL_CARGOS_LABORTERAPIA;
  });

  const handleAddCargoLaborterapia = (novoCargo) => {
    const updated = [novoCargo, ...cargosLaborterapia];
    setCargosLaborterapia(updated);
    localStorage.setItem('sgi_fdj_cargos_laborterapia', JSON.stringify(updated));
  };

  const [cofreDevolucoes, setCofreDevolucoes] = useState(() => {
    const saved = localStorage.getItem('sgi_fdj_cofre_devolucoes');
    return saved ? JSON.parse(saved) : {};
  });

  const handleDevolverCofre = (acolhidoId) => {
    const dataHora = new Date().toLocaleString('pt-BR');
    const updated = {
      ...cofreDevolucoes,
      [acolhidoId]: {
        devolvida: true,
        dataHora
      }
    };
    setCofreDevolucoes(updated);
    localStorage.setItem('sgi_fdj_cofre_devolucoes', JSON.stringify(updated));
  };

  const [blocos, setBlocos] = useState(INITIAL_BLOCOS);

  const [termosMROSC, setTermosMROSC] = useState(() => {
    localStorage.setItem('sgi_fdj_termos_mrosc', JSON.stringify(INITIAL_PARCERIAS_MROSC));
    return INITIAL_PARCERIAS_MROSC;
  });

  const handleAddTermoMROSC = (novoTermo) => {
    const updated = [novoTermo, ...termosMROSC];
    setTermosMROSC(updated);
    localStorage.setItem('sgi_fdj_termos_mrosc', JSON.stringify(updated));
  };

  const [fornecedores, setFornecedores] = useState(() => {
    const saved = localStorage.getItem('sgi_fdj_fornecedores');
    return saved ? JSON.parse(saved) : INITIAL_FORNECEDORES;
  });

  const handleAddFornecedor = (novoForn) => {
    const updated = [novoForn, ...fornecedores];
    setFornecedores(updated);
    localStorage.setItem('sgi_fdj_fornecedores', JSON.stringify(updated));
  };

  const [clientes, setClientes] = useState(() => {
    const saved = localStorage.getItem('sgi_fdj_clientes');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTES;
  });

  const handleAddCliente = (novoCli) => {
    const updated = [novoCli, ...clientes];
    setClientes(updated);
    localStorage.setItem('sgi_fdj_clientes', JSON.stringify(updated));
  };

  const [transacoes, setTransacoes] = useState(() => {
    const saved = localStorage.getItem('sgi_fdj_transacoes');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACOES_FINANCEIRAS;
  });

  const [presencas, setPresencas] = useState(INITIAL_PRESENCA_DIARIA);

  const [metrics, setMetrics] = useState(() => {
    const saved = localStorage.getItem('sgi_fdj_metrics');
    return saved ? JSON.parse(saved) : INITIAL_METRICS;
  });

  // Apply Theme attribute to body/html
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('sgi_fdj_acolhidos', JSON.stringify(acolhidos));
  }, [acolhidos]);

  useEffect(() => {
    localStorage.setItem('sgi_fdj_profissionais', JSON.stringify(profissionais));
  }, [profissionais]);

  useEffect(() => {
    localStorage.setItem('sgi_fdj_rede_sus', JSON.stringify(redeSUS));
  }, [redeSUS]);

  useEffect(() => {
    localStorage.setItem('sgi_fdj_transacoes', JSON.stringify(transacoes));
  }, [transacoes]);

  useEffect(() => {
    localStorage.setItem('sgi_fdj_metrics', JSON.stringify(metrics));
  }, [metrics]);

  // Recalculate metrics on changes
  const handleAddAcolhido = (newAcolhido) => {
    setAcolhidos([newAcolhido, ...acolhidos]);
    setMetrics(prev => ({
      ...prev,
      totalAcolhidos: prev.totalAcolhidos + 1,
      leitosOcupados: prev.leitosOcupados + 1,
      capacidadeOcupacao: parseFloat((((prev.leitosOcupados + 1) / prev.leitosTotais) * 100).toFixed(1))
    }));
  };

  const handleAddTransacao = (newTx) => {
    setTransacoes([newTx, ...transacoes]);
  };

  const handleAddProfissional = (newProf) => {
    setProfissionais([newProf, ...profissionais]);
  };

  const handleAddUnidadeSUS = (newUnit) => {
    setRedeSUS([newUnit, ...redeSUS]);
  };

  const handleUpdateAcolhidoStatus = (acolhidoId, newStatus, newAlojamento = 'Desalocado (Alta Concluída)', newLeito = 'N/A') => {
    setAcolhidos(prev => prev.map(a => {
      if (a.id === acolhidoId) {
        return {
          ...a,
          status: newStatus,
          alojamento: newAlojamento,
          leito: newLeito
        };
      }
      return a;
    }));
  };

  const [activeSubTab, setActiveSubTab] = useState('visao');

  const DEFAULT_SUBTABS = {
    triagem: 'novo',
    leitos: 'blocos',
    saude: 'resumo',
    mrosc: 'visao',
    financeiro: 'pagar',
    laborterapia: 'escalas',
    familia: 'visitas',
    doacoes: 'estoque',
    despensa: 'estoque',
    desligamento: 'altas',
    dashboard: 'bi',
    cadastros: 'leitos_cad',
    cad_acolhidos: 'leitos_cad',
    cad_admin: 'fornecedores_cad',
    cad_saude: 'profissionais_cad',
    cad_prestacao: 'contas_cad',
    dash_acolhidos: 'visao',
    dash_admin: 'visao',
    dash_saude: 'visao',
    dash_prestacao: 'visao',
    focais: 'focais_matriz',
    usuarios: 'usuarios_permissao',
    frota: 'veiculos'
  };

  const handleSelectModule = (tabId, subTabId) => {
    setActiveTab(tabId);
    if (subTabId) {
      setActiveSubTab(subTabId);
    } else if (DEFAULT_SUBTABS[tabId]) {
      setActiveSubTab(DEFAULT_SUBTABS[tabId]);
    }
  };

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sgi_fdj_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [pendingTargetTab, setPendingTargetTab] = useState('central');
  const [pendingTargetSubTab, setPendingTargetSubTab] = useState(null);

  const handleEnterSystemRequest = (targetTab = 'central', subTabId = null) => {
    setPendingTargetTab(targetTab);
    setPendingTargetSubTab(subTabId);
    if (!currentUser) {
      setActiveTab('login');
    } else {
      handleSelectModule(targetTab, subTabId);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentProfile(user.perfil || 'Diretoria');
    handleSelectModule(pendingTargetTab || 'central');
  };

  const handleLogout = () => {
    localStorage.removeItem('sgi_fdj_session');
    setCurrentUser(null);
    setActiveTab('landing');
  };

  const showSidebar = activeTab !== 'central' && activeTab !== 'landing' && activeTab !== 'login';

  if (activeTab === 'landing') {
    return (
      <ErrorBoundary>
        <LandingPageView 
          onEnterSystem={() => handleEnterSystemRequest('central')}
          onSelectModule={(tabId) => handleEnterSystemRequest(tabId)}
        />
      </ErrorBoundary>
    );
  }

  if (activeTab === 'login') {
    return (
      <ErrorBoundary>
        <LoginView 
          onLoginSuccess={handleLoginSuccess}
          onBackToLanding={() => setActiveTab('landing')}
        />
      </ErrorBoundary>
    );
  }

  return (
    <div className="app-container">
      {/* Render Sidebar ONLY inside specific modules, NOT on Central de Módulos screen */}
      {showSidebar && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={handleSelectModule} 
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
        />
      )}

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <div className="no-print">
          <Header 
            currentProfile={currentProfile}
            setCurrentProfile={setCurrentProfile}
            theme={theme}
            setTheme={setTheme}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            metrics={metrics}
            currentUser={currentUser}
            onLogout={handleLogout}
            onHomeClick={() => handleSelectModule('central')}
            onLandingClick={() => setActiveTab('landing')}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            showSidebar={showSidebar}
          />
        </div>

        <main 
          className="page-content" 
          style={{ 
            maxWidth: activeTab === 'central' ? '1800px' : '1600px',
            padding: activeTab === 'central' ? '0.75rem 1rem' : '1rem 1.25rem'
          }}
        >
          <ErrorBoundary key={activeTab}>
          {activeTab === 'central' && (
            <CentralModulosView 
              metrics={metrics}
              currentUser={currentUser}
              onSelectModule={(tabId) => handleSelectModule(tabId)}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView 
              metrics={metrics}
              acolhidos={acolhidos}
              termosMROSC={termosMROSC}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'triagem' && (
            <TriagemAcolhimentoView 
              acolhidos={acolhidos}
              onAddAcolhido={handleAddAcolhido}
              onResetAcolhidos={handleResetAcolhidos}
              onRestoreAcolhidos={handleRestoreAcolhidos}
              cofreDevolucoes={cofreDevolucoes}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {activeTab === 'leitos' && (
            <GestaoLeitosView 
              blocos={blocos}
              acolhidos={acolhidos}
              presencas={presencas}
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {activeTab === 'saude' && (
            <ProntuarioSaudeView 
              acolhidos={acolhidos}
              profissionais={profissionais}
              procedimentosOdonto={procedimentosOdonto}
              medicamentosCatalogo={medicamentosCatalogo}
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {activeTab === 'mrosc' && (
            <ParceriasMROSCView 
              termosMROSC={termosMROSC}
              transacoes={transacoes}
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {activeTab === 'financeiro' && (
            <FinanceiroView 
              transacoes={transacoes}
              onAddTransacao={handleAddTransacao}
              termosMROSC={termosMROSC}
              fornecedores={fornecedores}
              onAddFornecedor={handleAddFornecedor}
              clientes={clientes}
              onAddCliente={handleAddCliente}
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {activeTab === 'laborterapia' && (
            <LaborterapiaView 
              acolhidos={acolhidos}
              cargosLaborterapia={cargosLaborterapia}
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {activeTab === 'familia' && (
            <AtendimentoFamiliarView 
              acolhidos={acolhidos}
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {activeTab === 'doacoes' && (
            <DoacoesAlmoxarifadoView activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />
          )}

          {activeTab === 'despensa' && (
            <DespensaAlimentosView 
              acolhidos={acolhidos}
              profissionais={profissionais}
              fornecedores={fornecedores}
              onAddTransacao={handleAddTransacao} 
              activeSubTab={activeSubTab} 
              setActiveSubTab={setActiveSubTab} 
            />
          )}

          {activeTab === 'desligamento' && (
            <DesligamentoReinsercaoView 
              acolhidos={acolhidos}
              cofreDevolucoes={cofreDevolucoes}
              onDevolverCofre={handleDevolverCofre}
              onUpdateAcolhidoStatus={handleUpdateAcolhidoStatus}
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {activeTab === 'frota' && (
            <FrotaManutencaoView 
              activeSubTab={activeSubTab} 
              setActiveSubTab={setActiveSubTab}
              profissionais={profissionais}
              acolhidos={acolhidos}
            />
          )}

          {activeTab === 'cad_acolhidos' && (
            <CadastrosAcolhidosView 
              blocos={blocos}
              onUpdateBlocos={setBlocos}
              acolhidos={acolhidos}
              onResetAcolhidos={handleResetAcolhidos}
              onRestoreAcolhidos={handleRestoreAcolhidos}
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {activeTab === 'cadastros' && (
            <CadastrosAcolhidosView 
              blocos={blocos}
              onUpdateBlocos={setBlocos}
              acolhidos={acolhidos}
              onResetAcolhidos={handleResetAcolhidos}
              onRestoreAcolhidos={handleRestoreAcolhidos}
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {activeTab === 'cad_admin' && (
            <CadastrosAdminView 
              fornecedores={fornecedores}
              onAddFornecedor={handleAddFornecedor}
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {activeTab === 'cad_saude' && (
            <CadastrosSaudeView 
              profissionais={profissionais}
              onAddProfissional={handleAddProfissional}
              redeSUS={redeSUS}
              onAddUnidadeSUS={handleAddUnidadeSUS}
              procedimentos={procedimentosOdonto}
              onAddProcedimento={handleAddProcedimentoOdonto}
              medicamentos={medicamentosCatalogo}
              onAddMedicamento={handleAddMedicamentoCatalogo}
              cargos={cargosLaborterapia}
              onAddCargo={handleAddCargoLaborterapia}
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {activeTab === 'cad_prestacao' && (
            <CadastrosFinanceiroView 
              termosMROSC={termosMROSC}
              fornecedores={fornecedores}
              clientes={clientes}
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {activeTab === 'focais' && (
            <CadastrosFocaisView 
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {activeTab === 'usuarios' && (
            <CadastrosUsuariosView 
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {activeTab === 'dash_acolhidos' && (
            <MacromoduloDashboardView 
              type="dash_acolhidos"
              acolhidos={acolhidos}
              blocos={blocos}
            />
          )}

          {activeTab === 'dash_admin' && (
            <MacromoduloDashboardView 
              type="dash_admin"
              fornecedores={fornecedores}
            />
          )}

          {activeTab === 'dash_saude' && (
            <MacromoduloDashboardView 
              type="dash_saude"
              profissionais={profissionais}
              redeSUS={redeSUS}
            />
          )}

          {activeTab === 'dash_prestacao' && (
            <MacromoduloDashboardView 
              type="dash_prestacao"
              termosMROSC={termosMROSC}
            />
          )}

          {activeTab === 'adminSistema' && (
            <AdminSistemaView activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />
          )}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
