import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Stethoscope, 
  Hospital, 
  Building2, 
  FileText, 
  CheckCircle, 
  X, 
  Search,
  Award,
  Phone,
  Mail,
  ShieldCheck,
  Plus,
  KeyRound,
  Lock,
  UserCheck,
  Landmark,
  Package
} from 'lucide-react';

export default function CadastrosBaseView({ 
  profissionais = [], 
  onAddProfissional, 
  redeSUS = [], 
  onAddUnidadeSUS,
  termosMROSC = [],
  onAddTermoMROSC,
  fornecedores = [],
  onAddFornecedor,
  clientes = [],
  onAddCliente,
  activeSubTab: externalSubTab,
  setActiveSubTab: setExternalSubTab
}) {
  const [internalTab, setInternalTab] = useState('cad_acolhidos');
  
  const VALID_TABS = ['cad_acolhidos', 'cad_admin', 'cad_saude', 'cad_prestacao', 'focais', 'usuarios'];
  let currentTab = externalSubTab || internalTab;
  if (!VALID_TABS.includes(currentTab)) {
    if (['profissionais', 'sus'].includes(currentTab)) currentTab = 'cad_saude';
    else if (['planocontas', 'bancos', 'termos'].includes(currentTab)) currentTab = 'cad_prestacao';
    else if (['fornecedores', 'doacoes', 'despensa', 'frota'].includes(currentTab)) currentTab = 'cad_admin';
    else currentTab = 'cad_acolhidos';
  }
  
  const activeTab = currentTab;
  const setActiveTab = setExternalSubTab || setInternalTab;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEspecialidade, setFilterEspecialidade] = useState('Todas');

  // Modals
  const [showProfissionalModal, setShowProfissionalModal] = useState(false);
  const [showSUSModal, setShowSUSModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showTermoModal, setShowTermoModal] = useState(false);
  const [showFornModal, setShowFornModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);

  // Form State for New Cliente / Pagador
  const [newCli, setNewCli] = useState({
    razaoSocial: '',
    cnpj: '',
    tipo: 'Órgão Concedente Estadual',
    contato: '',
    email: '',
    status: 'Ativo'
  });

  // Form State for New Fornecedor
  const [newForn, setNewForn] = useState({
    razaoSocial: '',
    cnpj: '',
    categoria: '2.2.01 Alimentação & Cozinha',
    dadosBancarios: '',
    contato: '',
    status: 'Homologado MROSC'
  });

  // Form State for New Termo MROSC
  const [newTermo, setNewTermo] = useState({
    termo: '',
    orgaoConcedente: 'SJDH-BA',
    objeto: '',
    valorTotal: '',
    vigenciaInicio: new Date().toISOString().split('T')[0],
    vigenciaFim: '2026-12-31',
    contaBancaria: 'Banco do Brasil - Ag. 3418-5 / C/C 14.502-1',
    status: 'Em Execução Regular'
  });

  // Pessoas Focais por Macromódulo (Poder Delegado por Área)
  const [pessoasFocais, setPessoasFocais] = useState([
    {
      macroId: 1,
      macroNome: '1. Prestação de Contas',
      modulosContidos: 'Módulo 1 (MROSC) & Módulo 2 (Financeiro)',
      pessoaFocal: 'Marcos Vinicius Bruno Teixeira',
      emailFocal: 'marcos.teixeira@fundacaodrjesus.org.br',
      cargo: 'Gestor Financeiro & Convênios MROSC',
      poderesDelegados: 'Aprovação de SCs, Liberação Financeira e REF SJDH-BA',
      status: '🟢 Ponto Focal Ativo'
    },
    {
      macroId: 2,
      macroNome: '2. Gestão dos Acolhidos',
      modulosContidos: 'Módulo 3 (Triagem), 6 (Leitos), 7 (Família) & 8 (Altas)',
      pessoaFocal: 'Dra. Amanda Silva',
      emailFocal: 'amanda.social@fundacaodrjesus.org.br',
      cargo: 'Coordenadora Geral de Acolhimento & Serviço Social',
      poderesDelegados: 'Gestão de Admissão, Chamada de Leitos, Passe Terapêutico e Certificados',
      status: '🟢 Ponto Focal Ativo'
    },
    {
      macroId: 3,
      macroNome: '3. Painel do Gestor & Saúde',
      modulosContidos: 'Módulo 5 (Prontuário Multidisciplinar) & Módulo 4 (Laborterapia)',
      pessoaFocal: 'Dr. Roberto Medeiros (CRM 14920-BA)',
      emailFocal: 'roberto.medicos@fundacaodrjesus.org.br',
      cargo: 'Responsável Técnico de Saúde & Farmácia RDC 29',
      poderesDelegados: 'Prontuário Eletrônico, Aprazamento ANVISA e Oficinas Formativas 240h',
      status: '🟢 Ponto Focal Ativo'
    },
    {
      macroId: 4,
      macroNome: '4. Diretoria & BI Executivo',
      modulosContidos: 'Módulo 9 (Cadastros & Permissões) & Módulo 10 (BI 360°)',
      pessoaFocal: 'Pr. Sgt. Isidório (Presidência)',
      emailFocal: 'isidorio@fundacaodrjesus.org.br',
      cargo: 'Presidente Executivo & Conselho Superior',
      poderesDelegados: 'Atribuição Global de Pessoas Focais, Auditoria BI e Decisões MROSC',
      status: '🟢 Ponto Focal Ativo'
    },
    {
      macroId: 5,
      macroNome: '5. Módulo Administrativo',
      modulosContidos: 'Módulo 11 (Doações & Almoxarifado) & Módulo 12 (Frota & Manutenção)',
      pessoaFocal: 'Carlos Eduardo Mendes',
      emailFocal: 'carlos.almoxarifado@fundacaodrjesus.org.br',
      cargo: 'Gerente Geral de Almoxarifado, Doações & Frotas',
      poderesDelegados: 'Controle de Estoque FEFO, Recibos CNPJ, Combustível Diesel S10 e OS',
      status: '🟢 Ponto Focal Ativo'
    }
  ]);

  // System Users List State (Persisted in localStorage)
  const [usuariosSistema, setUsuariosSistema] = useState(() => {
    const saved = localStorage.getItem('sgi_fdj_user_list');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'USR-001', nome: 'Marcos Vinicius Bruno Teixeira', email: 'marcos.teixeira@fundacaodrjesus.org.br', perfil: 'Diretoria & Presidência', status: 'Ativo', ultimoAcesso: 'Hoje às 14:55' },
      { id: 'USR-002', nome: 'Pr. Sgt. Isidório', email: 'isidorio@fundacaodrjesus.org.br', perfil: 'Diretoria & Presidência', status: 'Ativo', ultimoAcesso: 'Hoje às 12:30' },
      { id: 'USR-003', nome: 'Dra. Amanda Silva', email: 'amanda.silva@fundacaodrjesus.org.br', perfil: 'Saúde, CRP, CRESS & CRM', status: 'Ativo', ultimoAcesso: 'Ontem às 16:40' },
      { id: 'USR-004', nome: 'Gestor Financeiro MROSC', email: 'financeiro@fundacaodrjesus.org.br', perfil: 'Gestão de Convênios MROSC', status: 'Ativo', ultimoAcesso: 'Hoje às 10:15' }
    ];
  });

  // Form State for New Professional
  const [newProf, setNewProf] = useState({
    nome: '',
    cargo: 'Psicólogo(a) Clínico(a)',
    registroProfissional: 'CRP 03/',
    especialidade: 'Psicologia',
    telefone: '(71) 9',
    email: '@fundacaodrjesus.org.br',
    status: 'Ativo'
  });

  // Form State for New SUS Unit
  const [newSUS, setNewSUS] = useState({
    nome: '',
    municipio: 'Candeias',
    tipo: 'UPA 24h',
    contato: '(71) 3'
  });

  // Form State for New System User
  const [newUser, setNewUser] = useState({
    nome: '',
    email: '@fundacaodrjesus.org.br',
    senha: '',
    perfil: 'Gestão de Convênios MROSC',
    status: 'Ativo'
  });

  const handleCreateProfissional = (e) => {
    e.preventDefault();
    if (!newProf.nome) return;

    const entry = {
      id: `PROF-00${profissionais.length + 1}`,
      ...newProf
    };

    if (onAddProfissional) onAddProfissional(entry);
    setShowProfissionalModal(false);
    setNewProf({
      nome: '',
      cargo: 'Psicólogo(a) Clínico(a)',
      registroProfissional: 'CRP 03/',
      especialidade: 'Psicologia',
      telefone: '(71) 9',
      email: '@fundacaodrjesus.org.br',
      status: 'Ativo'
    });
  };

  const handleCreateSUS = (e) => {
    e.preventDefault();
    if (!newSUS.nome) return;

    const entry = {
      id: `SUS-00${redeSUS.length + 1}`,
      ...newSUS
    };

    if (onAddUnidadeSUS) onAddUnidadeSUS(entry);
    setShowSUSModal(false);
    setNewSUS({
      nome: '',
      municipio: 'Candeias',
      tipo: 'UPA 24h',
      contato: '(71) 3'
    });
  };

  const handleCreateTermo = (e) => {
    e.preventDefault();
    if (!newTermo.termo) return;

    const entry = {
      id: `MROSC-${Math.floor(100 + Math.random() * 900)}-2026`,
      ...newTermo,
      valorTotal: parseFloat(newTermo.valorTotal) || 0,
      saldoAtual: parseFloat(newTermo.valorTotal) || 0,
      metaAcolhidosMes: 300,
      executadoMes: 300,
      percentualCumprimento: 100
    };

    if (onAddTermoMROSC) onAddTermoMROSC(entry);
    setShowTermoModal(false);
    setNewTermo({
      termo: '',
      orgaoConcedente: 'SJDH-BA',
      objeto: '',
      valorTotal: '',
      vigenciaInicio: new Date().toISOString().split('T')[0],
      vigenciaFim: '2026-12-31',
      contaBancaria: 'Banco do Brasil - Ag. 3418-5 / C/C 14.502-1',
      status: 'Em Execução Regular'
    });
  };

  const handleCreateFornecedor = (e) => {
    e.preventDefault();
    if (!newForn.razaoSocial) return;

    const entry = {
      id: `FORN-00${fornecedores.length + 1}`,
      ...newForn
    };

    if (onAddFornecedor) onAddFornecedor(entry);
    setShowFornModal(false);
    setNewForn({
      razaoSocial: '',
      cnpj: '',
      categoria: '2.2.01 Alimentação & Cozinha',
      dadosBancarios: '',
      contato: '',
      status: 'Homologado MROSC'
    });
  };

  const handleCreateCliente = (e) => {
    e.preventDefault();
    if (!newCli.razaoSocial) return;

    const entry = {
      id: `CLI-00${clientes.length + 1}`,
      ...newCli
    };

    if (onAddCliente) onAddCliente(entry);
    setShowClienteModal(false);
    setNewCli({
      razaoSocial: '',
      cnpj: '',
      tipo: 'Órgão Concedente Estadual',
      contato: '',
      email: '',
      status: 'Ativo'
    });
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.nome || !newUser.email) return;

    const entry = {
      id: `USR-00${usuariosSistema.length + 1}`,
      ...newUser,
      ultimoAcesso: 'Criado agora'
    };

    const updatedList = [entry, ...usuariosSistema];
    setUsuariosSistema(updatedList);
    localStorage.setItem('sgi_fdj_user_list', JSON.stringify(updatedList));

    // Save as valid credentials in localStorage
    localStorage.setItem('sgi_fdj_user', JSON.stringify(entry));

    setShowUserModal(false);
    setNewUser({
      nome: '',
      email: '@fundacaodrjesus.org.br',
      senha: '',
      perfil: 'Gestão de Convênios MROSC',
      status: 'Ativo'
    });
  };

  const filteredProfissionais = profissionais.filter(p => {
    const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.cargo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = filterEspecialidade === 'Todas' || p.especialidade === filterEspecialidade;
    return matchesSearch && matchesSpec;
  });

  const filteredSUS = redeSUS.filter(s => 
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.municipio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = usuariosSistema.filter(u =>
    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.perfil.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Module Title Header Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(59, 130, 246, 0.15))',
        border: '1px solid #3b82f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
            color: '#fff',
            padding: '0.85rem 1.15rem',
            borderRadius: '10px',
            fontWeight: 800,
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Módulo 11</div>
            <div style={{ fontSize: '1.2rem' }}>CADASTROS BASE</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              {activeTab === 'cad_acolhidos' && <span className="badge badge-primary">Área Exclusiva: 1. Gestão dos Acolhidos</span>}
              {activeTab === 'cad_admin' && <span className="badge badge-success">Área Exclusiva: 2. Módulo Administrativo</span>}
              {(activeTab === 'cad_saude' || activeTab === 'profissionais' || activeTab === 'sus') && <span className="badge badge-info">Área Exclusiva: 3. Saúde & Multidisciplinar</span>}
              {(activeTab === 'cad_prestacao' || activeTab === 'planocontas' || activeTab === 'bancos' || activeTab === 'fornecedores' || activeTab === 'termos') && <span className="badge badge-warning">Área Exclusiva: 4. Prestação de Contas & Financeiro</span>}
              {activeTab === 'focais' && <span className="badge badge-primary">Matriz de Pessoas Focais & Governança</span>}
              {activeTab === 'usuarios' && <span className="badge badge-info">Gestão de Usuários & Acessos SGI</span>}
            </div>

            <h2 style={{ fontSize: '1.35rem', color: '#ffffff', margin: 0 }}>
              {activeTab === 'cad_acolhidos' && 'Cadastros da Gestão dos Acolhidos (Leitos, Visitantes & Termos)'}
              {activeTab === 'cad_admin' && 'Cadastros Administrativos (Fornecedores MROSC, Insumos & Frota)'}
              {(activeTab === 'cad_saude' || activeTab === 'profissionais' || activeTab === 'sus') && 'Cadastros da Saúde (Corpo Clínico CRM/CRP/CRESS & Rede SUS)'}
              {(activeTab === 'cad_prestacao' || activeTab === 'planocontas' || activeTab === 'bancos' || activeTab === 'fornecedores' || activeTab === 'termos') && 'Cadastros Financeiros (Contas Segregadas, Rubricas SJDH & Convênios)'}
              {activeTab === 'focais' && 'Matriz de Pessoas Focais & Poderes Delegados'}
              {activeTab === 'usuarios' && 'Gestão de Usuários, Credenciais e Permissões do Sistema'}
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: '4px 0 0 0' }}>
              Visualização restrita aos cadastros específicos do macromódulo selecionado para garantir precisão e integridade dos dados.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {activeTab === 'profissionais' && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowProfissionalModal(true)}>
              <Plus size={16} /> Cadastrar Profissional
            </button>
          )}
          {activeTab === 'sus' && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowSUSModal(true)}>
              <Plus size={16} /> Cadastrar Unidade SUS
            </button>
          )}
          {activeTab === 'usuarios' && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowUserModal(true)}>
              <Plus size={16} /> Cadastrar Novo Usuário SGI
            </button>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', padding: '0.85rem 1.25rem' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Pesquisar por nome, e-mail, cargo ou especialidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        {activeTab === 'profissionais' && (
          <select 
            className="form-select" 
            value={filterEspecialidade}
            onChange={(e) => setFilterEspecialidade(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="Todas">Todas as Especialidades</option>
            <option value="Medicina">Medicina / CRM</option>
            <option value="Psicologia">Psicologia / CRP</option>
            <option value="Serviço Social">Serviço Social / CRESS</option>
            <option value="Enfermagem">Enfermagem / COREN</option>
            <option value="Odontologia">Odontologia / CRO</option>
          </select>
        )}
      </div>

      {/* TAB 0: MATRIZ DE PESSOAS FOCAIS POR MACROMÓDULO */}
      {activeTab === 'focais' && (
        <div className="card" style={{ borderLeft: '4px solid #7c3aed' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={22} style={{ color: '#7c3aed' }} />
                Matriz de Pessoas Focais & Delegação de Poderes por Macromódulo
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Defina o responsável focal de cada uma das 5 áreas estratégicas da Fundação Doutor Jesus com autoridade delegada de gestão e aprovação.
              </p>
            </div>
            <span className="badge badge-primary">5 Macromódulos Mapeados</span>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Macromódulo Estratégico</th>
                  <th>Módulos Abrangidos</th>
                  <th>Pessoa Focal Responsável</th>
                  <th>E-mail de Contato</th>
                  <th>Cargo / Função</th>
                  <th>Poderes Delegados</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pessoasFocais.map(f => (
                  <tr key={f.macroId}>
                    <td style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      {f.macroNome}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.modulosContidos}</td>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>{f.pessoaFocal}</td>
                    <td style={{ fontSize: '0.8rem' }}>{f.emailFocal}</td>
                    <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>{f.cargo}</td>
                    <td style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>{f.poderesDelegados}</td>
                    <td><span className="badge badge-success">{f.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 1: CADASTROS OPERACIONAIS - PRESTAÇÃO DE CONTAS */}
      {(activeTab === 'cad_prestacao' || activeTab === 'planocontas' || activeTab === 'bancos' || activeTab === 'fornecedores' || activeTab === 'termos') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Contas Bancárias Segregadas */}
          <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Landmark size={20} style={{ color: '#2563eb' }} />
                1.1. Cadastros de Contas Bancárias Segregadas & Tesouraria MROSC
              </h3>
              <button className="btn btn-primary btn-sm" onClick={() => alert('Modal de cadastro de nova conta bancária')}>
                <Plus size={16} /> Nova Conta Bancária
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Banco</th>
                    <th>Agência</th>
                    <th>Conta Corrente</th>
                    <th>Projeto / Convênio Vinculado</th>
                    <th>Saldo Atual</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Banco do Brasil (001)</td>
                    <td>3451-9</td>
                    <td>14.502-1</td>
                    <td>Convênio SJDH-BA nº 001/2024</td>
                    <td style={{ color: '#059669', fontWeight: 800 }}>R$ 3.492.246,16</td>
                    <td><span className="badge badge-success">Ativa (MROSC)</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Caixa Econômica (104)</td>
                    <td>0062</td>
                    <td>003.882-9</td>
                    <td>Recursos Próprios & Doações Sede</td>
                    <td style={{ color: '#059669', fontWeight: 800 }}>R$ 184.200,00</td>
                    <td><span className="badge badge-success">Ativa</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Banco do Brasil (001)</td>
                    <td>3451-9</td>
                    <td>99.102-4</td>
                    <td>Aplicação Financeira CDB MROSC</td>
                    <td style={{ color: '#059669', fontWeight: 800 }}>R$ 412.500,00</td>
                    <td><span className="badge badge-info">Rendimentos</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Plano de Contas SJDH-BA & Rubricas */}
          <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} style={{ color: '#2563eb' }} />
                1.2. Cadastros do Plano de Contas & Rubricas Pactuadas SJDH-BA
              </h3>
              <button className="btn btn-primary btn-sm" onClick={() => alert('Modal de nova rubrica')}>
                <Plus size={16} /> Nova Rubrica SJDH
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código Rubrica</th>
                    <th>Elemento de Despesa</th>
                    <th>Valor Pactuado Global</th>
                    <th>Empenhado / SCs</th>
                    <th>Saldo Disponível</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="badge badge-primary">RUB-01</span></td>
                    <td style={{ fontWeight: 700 }}>Alimentação & Nutrição (4.000 ref/dia)</td>
                    <td>R$ 3.850.000,00</td>
                    <td>R$ 3.200.000,00</td>
                    <td style={{ color: '#059669', fontWeight: 700 }}>R$ 650.000,00</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-primary">RUB-02</span></td>
                    <td style={{ fontWeight: 700 }}>Equipe Multidisciplinar & Saúde RH</td>
                    <td>R$ 8.920.000,00</td>
                    <td>R$ 7.100.000,00</td>
                    <td style={{ color: '#059669', fontWeight: 700 }}>R$ 1.820.000,00</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-primary">RUB-03</span></td>
                    <td style={{ fontWeight: 700 }}>Manutenção de Frotas & Combustível Diesel S10</td>
                    <td>R$ 2.100.000,00</td>
                    <td>R$ 1.850.000,00</td>
                    <td style={{ color: '#059669', fontWeight: 700 }}>R$ 250.000,00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Termos MROSC & Convênios Ativos */}
          <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} style={{ color: '#10b981' }} />
                1.3. Cadastros de Termos MROSC & Convênios Ativos ({termosMROSC.length})
              </h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowTermoModal(true)}>
                <Plus size={16} /> + Cadastrar Novo Termo MROSC
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código / ID</th>
                    <th>Termo MROSC / Convênio</th>
                    <th>Órgão Concedente</th>
                    <th>Objeto da Parceria</th>
                    <th>Valor Global (R$)</th>
                    <th>Vigência</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {termosMROSC.map(t => (
                    <tr key={t.id}>
                      <td><span className="badge badge-primary">{t.id}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t.termo}</td>
                      <td><span className="badge badge-info">{t.orgaoConcedente}</span></td>
                      <td style={{ fontSize: '0.8rem' }}>{t.objeto}</td>
                      <td style={{ fontWeight: 800, color: '#059669' }}>
                        R$ {t.valorTotal ? t.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                      </td>
                      <td style={{ fontSize: '0.75rem' }}>{t.vigenciaInicio} até {t.vigenciaFim}</td>
                      <td><span className="badge badge-success">{t.status || 'Ativo'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cadastro de Fornecedores & Concessionárias */}
          <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} style={{ color: '#f59e0b' }} />
                1.4. Cadastro de Fornecedores, Concessionárias & Prestadores PJ/PF ({fornecedores.length})
              </h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowFornModal(true)}>
                <Plus size={16} /> + Cadastrar Novo Fornecedor PJ/PF
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Razão Social / Nome Favorecido</th>
                    <th>CNPJ / CPF</th>
                    <th>Categoria de Despesa</th>
                    <th>Dados Bancários PJ</th>
                    <th>Contato / Telefone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(fornecedores && fornecedores.length > 0 ? fornecedores : [
                    { id: 'FORN-001', razaoSocial: 'Atacadão S.A.', cnpj: '75.315.333/0001-09', categoria: '2.2.01 Alimentação & Cozinha', dadosBancarios: 'Banco do Brasil - Ag. 3418 / C/C 12.345-0', contato: '(71) 3301-4400', status: 'Homologado MROSC' },
                    { id: 'FORN-002', razaoSocial: 'EMBASA', cnpj: '13.504.675/0001-10', categoria: '2.5.01 Água & Esgoto', dadosBancarios: 'Contrato nº 098401', contato: '0800 055 5195', status: 'Concessionária Pública' },
                    { id: 'FORN-003', razaoSocial: 'COELBA', cnpj: '15.135.960/0001-10', categoria: '2.5.01 Energia Elétrica', dadosBancarios: 'UC-88104 Sede 40.000m²', contato: '0800 276 0116', status: 'Concessionária Pública' }
                  ]).map(f => (
                    <tr key={f.id}>
                      <td><span className="badge badge-primary">{f.id}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{f.razaoSocial || f.nome}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{f.cnpj || f.cpf}</td>
                      <td><span className="badge badge-info">{f.categoria}</span></td>
                      <td style={{ fontSize: '0.775rem' }}>{f.dadosBancarios}</td>
                      <td style={{ fontSize: '0.775rem' }}>{f.contato}</td>
                      <td><span className="badge badge-success">{f.status || 'Ativo'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cadastro de Clientes, Pagadores & Órgãos Concedentes */}
          <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} style={{ color: '#10b981' }} />
                1.5. Cadastro de Clientes, Pagadores, Órgãos Concedentes & Mantenedores PJ/PF ({clientes.length})
              </h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowClienteModal(true)}>
                <Plus size={16} /> + Cadastrar Novo Cliente PJ/PF
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Razão Social / Nome Cliente ou Concedente</th>
                    <th>CNPJ / CPF</th>
                    <th>Tipo de Entidade / Vínculo</th>
                    <th>E-mail Principal</th>
                    <th>Contato / Telefone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(clientes && clientes.length > 0 ? clientes : []).map(c => (
                    <tr key={c.id}>
                      <td><span className="badge badge-primary">{c.id}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{c.razaoSocial || c.nome}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{c.cnpj || c.cpf}</td>
                      <td><span className="badge badge-info">{c.tipo}</span></td>
                      <td style={{ fontSize: '0.775rem' }}>{c.email}</td>
                      <td style={{ fontSize: '0.775rem' }}>{c.contato}</td>
                      <td><span className="badge badge-success">{c.status || 'Ativo'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CADASTROS OPERACIONAIS - GESTÃO DOS ACOLHIDOS */}
      {activeTab === 'cad_acolhidos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Alojamentos, Blocos & Leitos */}
          <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} style={{ color: '#dc2626' }} />
                2.1. Cadastro de Alojamentos, Blocos & Capacidade de Leitos
              </h3>
              <button className="btn btn-primary btn-sm" onClick={() => alert('Modal de novo leito')}>
                <Plus size={16} /> Cadastrar Leito / Quarto
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Bloco / Alojamento</th>
                    <th>Capacidade Total</th>
                    <th>Leitos Acessíveis PCD</th>
                    <th>Ocupação Atual</th>
                    <th>Vagas Livres</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Bloco A - Restauração</td>
                    <td>75 Leitos</td>
                    <td>10 Leitos PCD</td>
                    <td>72 Acolhidos</td>
                    <td style={{ color: '#059669', fontWeight: 800 }}>3 Vagas</td>
                    <td><span className="badge badge-success">Operacional</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Bloco B - Renovação</td>
                    <td>75 Leitos</td>
                    <td>5 Leitos PCD</td>
                    <td>74 Acolhidos</td>
                    <td style={{ color: '#059669', fontWeight: 800 }}>1 Vaga</td>
                    <td><span className="badge badge-success">Operacional</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Bloco C - Esperança</td>
                    <td>75 Leitos</td>
                    <td>5 Leitos PCD</td>
                    <td>71 Acolhidos</td>
                    <td style={{ color: '#059669', fontWeight: 800 }}>4 Vagas</td>
                    <td><span className="badge badge-success">Operacional</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Bloco D - Graça</td>
                    <td>75 Leitos</td>
                    <td>10 Leitos PCD</td>
                    <td>75 Acolhidos</td>
                    <td style={{ color: '#dc2626', fontWeight: 800 }}>0 Vagas (Lotado)</td>
                    <td><span className="badge badge-warning">Capacidade Máxima</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Visitantes Autorizados & Rede Familiar */}
          <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} style={{ color: '#dc2626' }} />
                2.2. Cadastro de Visitantes Autorizados & Rede Familiar
              </h3>
              <button className="btn btn-primary btn-sm" onClick={() => alert('Modal de novo visitante')}>
                <Plus size={16} /> Autorizar Visitante
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Visitante Cadastrado</th>
                    <th>CPF</th>
                    <th>Grau de Parentesco</th>
                    <th>Acolhido Vinculado</th>
                    <th>Modalidade Autorizada</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Maria das Graças Silva</td>
                    <td>123.456.789-00</td>
                    <td>Mãe</td>
                    <td>Lucas Silva Santos (Leito A-12)</td>
                    <td><span className="badge badge-success">Visita Presencial Domingo</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>José Carlos Santos</td>
                    <td>987.654.321-11</td>
                    <td>Pai</td>
                    <td>Mateus Santos Oliveira (Leito B-05)</td>
                    <td><span className="badge badge-info">Videochamada Assistida</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CADASTROS OPERACIONAIS - GESTOR & SAÚDE */}
      {activeTab === 'cad_saude' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Corpo Clínico CRM/CRP/COREN */}
          <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Stethoscope size={20} style={{ color: '#0284c7' }} />
                3.1. Cadastro do Corpo Clínico & Multidisciplinar (CRM/CRP/CRESS)
              </h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowProfissionalModal(true)}>
                <Plus size={16} /> Cadastrar Profissional de Saúde
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nome do Profissional</th>
                    <th>Especialidade</th>
                    <th>Registro Profissional</th>
                    <th>Telefone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {profissionais.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 700 }}>{p.nome}</td>
                      <td><span className="badge badge-info">{p.especialidade}</span></td>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{p.registroProfissional}</td>
                      <td>{p.telefone}</td>
                      <td><span className="badge badge-success">{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Catálogo de Medicamentos ANVISA RDC 29 */}
          <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Stethoscope size={20} style={{ color: '#0284c7' }} />
                3.2. Catálogo de Medicamentos RDC 29 ANVISA & Aprazamentos
              </h3>
              <button className="btn btn-primary btn-sm" onClick={() => alert('Modal de novo medicamento')}>
                <Plus size={16} /> Cadastrar Medicamento
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Medicamento / Princípio Ativo</th>
                    <th>Dosagem Padrão</th>
                    <th>Classe Terapêutica</th>
                    <th>Estoque de Enfermaria</th>
                    <th>Aprazamento Recomendado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Fluoxetina 20mg</td>
                    <td>1 Comprimido/dia</td>
                    <td>Ansiolítico / Antidepressivo</td>
                    <td style={{ fontWeight: 700 }}>450 Caixas</td>
                    <td>Matinal (08:00)</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Risperidona 2mg</td>
                    <td>1 Comprimido/noite</td>
                    <td>Estabilizador de Humor</td>
                    <td style={{ fontWeight: 700 }}>280 Caixas</td>
                    <td>Noturno (20:00)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CADASTROS OPERACIONAIS - DIRETORIA & BI */}
      {activeTab === 'cad_diretoria' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Usuários SGI & Credenciais */}
          <div className="card" style={{ borderLeft: '4px solid #d97706' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={20} style={{ color: '#d97706' }} />
                4.1. Cadastro de Usuários SGI, E-mails & Credenciais
              </h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowUserModal(true)}>
                <Plus size={16} /> Cadastrar Novo Usuário
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código ID</th>
                    <th>Nome do Usuário</th>
                    <th>E-mail Institucional</th>
                    <th>Perfil de Acesso</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosSistema.map(u => (
                    <tr key={u.id}>
                      <td><span className="badge badge-primary">{u.id}</span></td>
                      <td style={{ fontWeight: 700 }}>{u.nome}</td>
                      <td style={{ color: 'var(--primary)' }}>{u.email}</td>
                      <td><span className="badge badge-info">{u.perfil}</span></td>
                      <td><span className="badge badge-success">{u.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CADASTROS OPERACIONAIS - MÓDULO ADMINISTRATIVO */}
      {activeTab === 'cad_admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Catálogo de Produtos do Almoxarifado */}
          <div className="card" style={{ borderLeft: '4px solid #059669' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={20} style={{ color: '#059669' }} />
                5.1. Catálogo de Produtos do Almoxarifado & Estoque Mínimo (FEFO)
              </h3>
              <button className="btn btn-primary btn-sm" onClick={() => alert('Modal de novo item do estoque')}>
                <Plus size={16} /> Cadastrar Item de Estoque
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item / Produto</th>
                    <th>Categoria</th>
                    <th>Unidade</th>
                    <th>Estoque Mínimo</th>
                    <th>Estoque Atual</th>
                    <th>Validade FI-FO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Arroz Agulhinha Tipo 1 (50kg)</td>
                    <td>Alimentação Sede</td>
                    <td>Saco 50kg</td>
                    <td>100 Sacos</td>
                    <td style={{ color: '#059669', fontWeight: 800 }}>450 Sacos</td>
                    <td>12/2026</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Feijão Carioca (30kg)</td>
                    <td>Alimentação Sede</td>
                    <td>Fardo 30kg</td>
                    <td>80 Fardos</td>
                    <td style={{ color: '#059669', fontWeight: 800 }}>280 Fardos</td>
                    <td>10/2026</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Detergente Industrial (5L)</td>
                    <td>Higiene & Limpeza</td>
                    <td>Galão 5L</td>
                    <td>30 Galões</td>
                    <td style={{ color: '#059669', fontWeight: 800 }}>120 Galões</td>
                    <td>08/2027</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Frota de Veículos & Motoristas */}
          <div className="card" style={{ borderLeft: '4px solid #059669' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={20} style={{ color: '#059669' }} />
                5.2. Cadastro de Frota de Veículos, Ônibus & Motoristas CNH D/E
              </h3>
              <button className="btn btn-primary btn-sm" onClick={() => alert('Modal de novo veículo/motorista')}>
                <Plus size={16} /> Cadastrar Veículo / Motorista
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Placa / Modelo</th>
                    <th>Tipo de Veículo</th>
                    <th>Capacidade</th>
                    <th>Combustível</th>
                    <th>Motorista Responsável</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700 }}>OKV-8812 (Marcopolo Volare)</td>
                    <td>Ônibus Rodoviário</td>
                    <td>44 Passageiros</td>
                    <td>Diesel S10</td>
                    <td>Sr. Raimundo Nonato (CNH D)</td>
                    <td><span className="badge badge-success">Em Operação</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>JKL-4401 (Mercedes Sprinter)</td>
                    <td>Van Executiva</td>
                    <td>16 Passageiros</td>
                    <td>Diesel S10</td>
                    <td>Sr. João Carlos (CNH D)</td>
                    <td><span className="badge badge-success">Em Operação</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>PQR-9902 (Ford Cargo Baú)</td>
                    <td>Caminhão Carga</td>
                    <td>5 Toneladas</td>
                    <td>Diesel S10</td>
                    <td>Sr. Carlos Eduardo (CNH E)</td>
                    <td><span className="badge badge-info">Manutenção Preventiva</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REDE SUS */}
      {activeTab === 'sus' && (
        <div className="grid-3">
          {filteredSUS.map(s => (
            <div key={s.id} className="card" style={{ borderLeft: '4px solid var(--status-success)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-success">{s.id}</span>
                <span className="badge badge-info">{s.tipo}</span>
              </div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>{s.nome}</h4>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Município: {s.municipio}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>Contato: {s.contato}</div>
            </div>
          ))}
        </div>
      )}

      {/* Modal 1: Novo Profissional */}
      {showProfissionalModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>Cadastrar Profissional de Saúde</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowProfissionalModal(false)}><X size={16} /></button>
            </div>

            <form onSubmit={handleCreateProfissional} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Nome Completo</label>
                <input type="text" required className="form-input" placeholder="Ex: Dra. Amanda Silva" value={newProf.nome} onChange={(e) => setNewProf({ ...newProf, nome: e.target.value })} />
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Cargo / Função</label>
                  <input type="text" required className="form-input" placeholder="Ex: Psicólogo(a) Clínico(a)" value={newProf.cargo} onChange={(e) => setNewProf({ ...newProf, cargo: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Especialidade</label>
                  <select className="form-select" value={newProf.especialidade} onChange={(e) => setNewProf({ ...newProf, especialidade: e.target.value })}>
                    <option value="Psicologia">Psicologia</option>
                    <option value="Medicina">Medicina</option>
                    <option value="Serviço Social">Serviço Social</option>
                    <option value="Enfermagem">Enfermagem</option>
                    <option value="Odontologia">Odontologia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Registro Profissional (CRM/CRP/CRESS)</label>
                <input type="text" required className="form-input" placeholder="Ex: CRP 03/14920" value={newProf.registroProfissional} onChange={(e) => setNewProf({ ...newProf, registroProfissional: e.target.value })} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProfissionalModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary"><CheckCircle size={16} /> Salvar Profissional</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Novo Usuário do Sistema (E-mail & Senha) */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>Cadastrar Novo Usuário SGI</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowUserModal(false)}><X size={16} /></button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Nome Completo do Usuário</label>
                <input type="text" required className="form-input" placeholder="Ex: Pr. Sgt. Isidório" value={newUser.nome} onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })} />
              </div>

              <div>
                <label className="form-label">E-mail Institucional (Login)</label>
                <input type="email" required className="form-input" placeholder="usuario@fundacaodrjesus.org.br" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
              </div>

              <div>
                <label className="form-label">Senha Inicial de Acesso</label>
                <input type="password" required className="form-input" placeholder="••••••••" value={newUser.senha} onChange={(e) => setNewUser({ ...newUser, senha: e.target.value })} />
              </div>

              <div>
                <label className="form-label">Perfil de Acesso do Sistema</label>
                <select className="form-select" value={newUser.perfil} onChange={(e) => setNewUser({ ...newUser, perfil: e.target.value })}>
                  <option value="Diretoria & Presidência">Diretoria & Presidência</option>
                  <option value="Gestão de Convênios MROSC">Gestão de Convênios MROSC</option>
                  <option value="Financeiro & Tesouraria">Financeiro & Tesouraria</option>
                  <option value="Triagem & Admissão">Triagem & Admissão</option>
                  <option value="Saúde, CRP, CRESS & CRM">Saúde, CRP, CRESS & CRM</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUserModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary"><CheckCircle size={16} /> Cadastrar Usuário</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Nova Unidade SUS */}
      {showSUSModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>Cadastrar Unidade da Rede SUS</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowSUSModal(false)}><X size={16} /></button>
            </div>

            <form onSubmit={handleCreateSUS} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Nome da Unidade / Hospital</label>
                <input type="text" required className="form-input" placeholder="Ex: UPA 24h Candeias" value={newSUS.nome} onChange={(e) => setNewSUS({ ...newSUS, nome: e.target.value })} />
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Município</label>
                  <input type="text" required className="form-input" placeholder="Candeias" value={newSUS.municipio} onChange={(e) => setNewSUS({ ...newSUS, municipio: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Tipo de Unidade</label>
                  <select className="form-select" value={newSUS.tipo} onChange={(e) => setNewSUS({ ...newSUS, tipo: e.target.value })}>
                    <option value="UPA 24h">UPA 24h</option>
                    <option value="CAPS IA/AD">CAPS IA/AD</option>
                    <option value="Hospital Geral">Hospital Geral</option>
                    <option value="SAMU 192">SAMU 192</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSUSModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary"><CheckCircle size={16} /> Salvar Unidade</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cadastro de Novo Termo MROSC */}
      {showTermoModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={20} style={{ color: '#10b981' }} />
                Cadastrar Novo Termo MROSC / Convênio
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowTermoModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTermo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="grid-2">
                <div>
                  <label className="form-label">Nome do Termo / Número *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="Ex: Termo de Fomento nº 005/2022" 
                    value={newTermo.termo} 
                    onChange={e => setNewTermo({ ...newTermo, termo: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="form-label">Órgão Concedente *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="Ex: SJDH-BA, PMC Candeias, SENAD/MJ" 
                    value={newTermo.orgaoConcedente} 
                    onChange={e => setNewTermo({ ...newTermo, orgaoConcedente: e.target.value })} 
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Objeto da Parceria / Convênio *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="Ex: Acolhimento continuado de 300 residentes e atenção multiprofissional" 
                  value={newTermo.objeto} 
                  onChange={e => setNewTermo({ ...newTermo, objeto: e.target.value })} 
                />
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Valor Global Pactuado (R$) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-input" 
                    required 
                    placeholder="0,00" 
                    value={newTermo.valorTotal} 
                    onChange={e => setNewTermo({ ...newTermo, valorTotal: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="form-label">Conta Bancária Segregada</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Banco do Brasil - Ag. 3418-5 / C/C 14.502-1" 
                    value={newTermo.contaBancaria} 
                    onChange={e => setNewTermo({ ...newTermo, contaBancaria: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Início da Vigência</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={newTermo.vigenciaInicio} 
                    onChange={e => setNewTermo({ ...newTermo, vigenciaInicio: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="form-label">Fim da Vigência</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={newTermo.vigenciaFim} 
                    onChange={e => setNewTermo({ ...newTermo, vigenciaFim: e.target.value })} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowTermoModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">+ Salvar Termo MROSC</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cadastro de Novo Fornecedor PJ/PF */}
      {showFornModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} style={{ color: '#f59e0b' }} />
                Cadastrar Novo Fornecedor / Favorecido (PJ/PF)
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowFornModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateFornecedor} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="grid-2">
                <div>
                  <label className="form-label">Razão Social / Nome Favorecido *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="Ex: Atacadão S.A. / EMBASA / Nome" 
                    value={newForn.razaoSocial} 
                    onChange={e => setNewForn({ ...newForn, razaoSocial: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="form-label">CNPJ ou CPF *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="00.000.000/0001-00" 
                    value={newForn.cnpj} 
                    onChange={e => setNewForn({ ...newForn, cnpj: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Categoria de Despesa</label>
                  <select 
                    className="form-select" 
                    value={newForn.categoria} 
                    onChange={e => setNewForn({ ...newForn, categoria: e.target.value })}
                  >
                    <option value="2.2.01 Alimentação & Cozinha">2.2.01 Alimentação & Nutrição Comunitária</option>
                    <option value="2.1.01 Folha de Pagamento">2.1.01 Folha de Pagamento & RH</option>
                    <option value="2.3.01 Medicamentos & Saúde">2.3.01 Medicamentos & Saúde RDC 29</option>
                    <option value="2.4.01 Frota & Veículos">2.4.01 Frota, Diesel S10 & Manutenção</option>
                    <option value="2.5.01 Energia Elétrica">2.5.01 Energia Elétrica (COELBA)</option>
                    <option value="2.5.01 Água & Esgoto">2.5.01 Água & Esgoto (EMBASA)</option>
                    <option value="2.5.01 Gás de Cozinha">2.5.01 Gás de Cozinha GLP Industrial</option>
                    <option value="2.3.03 Telefone & Internet">2.3.03 Telefone & Internet Fibra</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Contato / Telefone</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="(71) 3300-0000" 
                    value={newForn.contato} 
                    onChange={e => setNewForn({ ...newForn, contato: e.target.value })} 
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Dados Bancários para PIX / TED PJ</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Banco do Brasil - Ag. 3418 / C/C 12.345-0 (PIX CNPJ)" 
                  value={newForn.dadosBancarios} 
                  onChange={e => setNewForn({ ...newForn, dadosBancarios: e.target.value })} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowFornModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">+ Salvar Fornecedor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cadastro de Novo Cliente / Órgão Concedente PJ/PF */}
      {showClienteModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} style={{ color: '#10b981' }} />
                Cadastrar Novo Cliente / Órgão Concedente (PJ/PF)
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowClienteModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCliente} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="grid-2">
                <div>
                  <label className="form-label">Razão Social / Nome do Cliente *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="Ex: SJDH-BA / PMC Candeias / Doador PJ" 
                    value={newCli.razaoSocial} 
                    onChange={e => setNewCli({ ...newCli, razaoSocial: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="form-label">CNPJ ou CPF *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="00.000.000/0001-00" 
                    value={newCli.cnpj} 
                    onChange={e => setNewCli({ ...newCli, cnpj: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Tipo de Entidade / Vínculo</label>
                  <select 
                    className="form-select" 
                    value={newCli.tipo} 
                    onChange={e => setNewCli({ ...newCli, tipo: e.target.value })}
                  >
                    <option value="Órgão Concedente Estadual">Órgão Concedente Estadual (SJDH / SADS)</option>
                    <option value="Órgão Concedente Municipal">Órgão Concedente Municipal (Prefeituras / PMC)</option>
                    <option value="Órgão Concedente Federal">Órgão Concedente Federal (SENAD / MJ)</option>
                    <option value="Doador Institucional PJ">Doador Institucional PJ / Fundação Privada</option>
                    <option value="Contribuinte Individual PF">Contribuinte Individual PF / Doador FDJ</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Contato / Telefone</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="(71) 3115-0000" 
                    value={newCli.contato} 
                    onChange={e => setNewCli({ ...newCli, contato: e.target.value })} 
                  />
                </div>
              </div>

              <div>
                <label className="form-label">E-mail Principal de Parceria</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="convenios.parceria@orgao.gov.br" 
                  value={newCli.email} 
                  onChange={e => setNewCli({ ...newCli, email: e.target.value })} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowClienteModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">+ Salvar Cliente / Concedente</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
