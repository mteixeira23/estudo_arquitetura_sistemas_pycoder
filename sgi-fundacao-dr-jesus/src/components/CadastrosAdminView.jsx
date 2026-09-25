import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Building2, 
  Truck, 
  ShoppingBag, 
  X, 
  Edit2, 
  Trash2, 
  LayoutDashboard, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin,
  FolderTree,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Layers,
  ListFilter,
  Printer,
  FileText
} from 'lucide-react';
import { INITIAL_ENDERECOS_GALPAO } from '../mockData';

export default function CadastrosAdminView({ fornecedores = [], onAddFornecedor, activeSubTab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);

  // Grouping / Ungrouping State (Collapsible Sections - Default: Grouped/Recolhidas)
  const [collapsedSections, setCollapsedSections] = useState({
    fornecedores: true,
    frota: true,
    enderecos: true,
    setores: true,
    responsaveis: true
  });

  // Initial Local State
  const [fornecedoresList, setFornecedoresList] = useState(fornecedores.length > 0 ? fornecedores : [
    { id: 'FORN-001', razaoSocial: 'Atacadão S.A.', cnpj: '75.315.333/0001-09', categoria: 'Alimentação & Cozinha', dadosBancarios: 'Banco do Brasil - Ag. 3418 / C/C 12.345-0', contato: '(71) 3301-4400', status: 'Homologado MROSC' },
    { id: 'FORN-002', razaoSocial: 'EMBASA - Empresa Baiana de Águas', cnpj: '13.504.675/0001-10', categoria: 'Água & Esgoto', dadosBancarios: 'Contrato nº 098401', contato: '0800 055 5195', status: 'Concessionária Pública' },
    { id: 'FORN-003', razaoSocial: 'COELBA - Companhia de Eletricidade', cnpj: '15.135.960/0001-10', categoria: 'Energia Elétrica', dadosBancarios: 'UC-88104 Sede 40.000m²', contato: '0800 276 0116', status: 'Concessionária Pública' },
    { id: 'FORN-004', razaoSocial: 'Distribuidora Ceasa Salvador Ltda', cnpj: '12.480.112/0001-88', categoria: 'Hortifruti & Perecíveis', dadosBancarios: 'Bradesco - Ag. 0891 / C/C 44.102-9', contato: '(71) 3392-1020', status: 'Homologado MROSC' }
  ]);

  const [veiculosList, setVeiculosList] = useState([
    { id: 1, placa: 'JSO-4819', modelo: 'Mercedes-Benz OF-1721', tipo: 'Ônibus Rodoviário 48 Pass.', capacidade: '48 Lugares', combustivel: 'Diesel S10', status: 'Operacional' },
    { id: 2, placa: 'NZV-1204', modelo: 'Toyota Hilux 4x4', tipo: 'Camionete Resgate & Apoio', capacidade: '5 Lugares', combustivel: 'Diesel S10', status: 'Operacional' },
    { id: 3, placa: 'NYH-3044', modelo: 'Volkswagen Delivery 9.170', tipo: 'Caminhão Baú Carga', capacidade: '6.000 kg', combustivel: 'Diesel S10', status: 'Operacional' }
  ]);

  const [enderecosList, setEnderecosList] = useState(INITIAL_ENDERECOS_GALPAO || [
    { id: 'END-01', galpao: 'Galpão A (Alimentos)', corredor: 'Corredor 01', prateleira: 'Prateleira 01', palete: 'Palete 02', descricao: 'Galpão A — Corredor 01 — Prateleira 01 (Palete 02)', status: 'Ativo' },
    { id: 'END-02', galpao: 'Galpão A (Alimentos)', corredor: 'Corredor 02', prateleira: 'Prateleira 03', palete: 'Palete 08', descricao: 'Galpão A — Corredor 02 — Prateleira 03 (Palete 08)', status: 'Ativo' },
    { id: 'END-03', galpao: 'Galpão C (Higiene RDC 29)', corredor: 'Corredor 01', prateleira: 'Prateleira 02', palete: 'Palete 05', descricao: 'Galpão C — Corredor 01 — Prateleira 02 (Palete 05)', status: 'Ativo' }
  ]);

  const [setoresList, setSetoresList] = useState([
    { id: 'SET-01', nome: 'Cozinha Central & Refeitório', responsavel: 'Irmão Raimundo / Nutrição', ramal: '201', status: 'Ativo' },
    { id: 'SET-02', nome: 'Posto Médico & Farmácia RDC 29', responsavel: 'Dra. Ana Paula / Enfermagem', ramal: '205', status: 'Ativo' },
    { id: 'SET-03', nome: 'Oficina Predial & Serralheria', responsavel: 'Irmão Roberto / Manutenção', ramal: '210', status: 'Ativo' },
    { id: 'SET-04', nome: 'Triagem & Recepção Acolhidos', responsavel: 'Pr. Carlos Eduardo', ramal: '200', status: 'Ativo' }
  ]);

  const [responsaveisList, setResponsaveisList] = useState([
    { id: 'RESP-01', nome: 'Irmão Raimundo Santos', cargo: 'Coordenador de Logística & Frota', documento: 'CPF 401.992.885-00', autorizado: 'Sim (Total)' },
    { id: 'RESP-02', nome: 'Pr. Carlos Eduardo Oliveira', cargo: 'Diretor de Admissão & Triagem', documento: 'CPF 102.883.774-12', autorizado: 'Sim (Total)' },
    { id: 'RESP-03', nome: 'Enf. Patricia Lima', cargo: 'Responsável Técnica Farmácia', documento: 'COREN-BA 482.910', autorizado: 'Sim (Medicamentos)' }
  ]);

  // Modal States
  const [showFornModal, setShowFornModal] = useState(false);
  const [showVeiculoModal, setShowVeiculoModal] = useState(false);
  const [showEnderecoModal, setShowEnderecoModal] = useState(false);
  const [showSetorModal, setShowSetorModal] = useState(false);
  const [showRespModal, setShowRespModal] = useState(false);

  const [editingFornId, setEditingFornId] = useState(null);
  const [editingVeiculoId, setEditingVeiculoId] = useState(null);
  const [editingEnderecoId, setEditingEnderecoId] = useState(null);
  const [editingSetorId, setEditingSetorId] = useState(null);
  const [editingRespId, setEditingRespId] = useState(null);

  // Form States
  const [newForn, setNewForn] = useState({ razaoSocial: '', cnpj: '', categoria: 'Alimentação & Cozinha', dadosBancarios: '', contato: '' });
  const [newVeiculo, setNewVeiculo] = useState({ placa: '', modelo: '', tipo: 'Ônibus Rodoviário', capacidade: '48 Lugares', combustivel: 'Diesel S10' });
  const [newEndereco, setNewEndereco] = useState({ galpao: 'Galpão A (Alimentos)', corredor: 'Corredor 01', prateleira: 'Prateleira 01', palete: 'Palete 01' });
  const [newSetor, setNewSetor] = useState({ nome: '', responsavel: '', ramal: '' });
  const [newResp, setNewResp] = useState({ nome: '', cargo: '', documento: '', autorizado: 'Sim (Total)' });

  // Toggle Collapse / Expand Functions
  const toggleSection = (key) => {
    setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExpandAll = () => {
    setCollapsedSections({ fornecedores: false, frota: false, enderecos: false, setores: false, responsaveis: false });
  };

  const handleCollapseAll = () => {
    setCollapsedSections({ fornecedores: true, frota: true, enderecos: true, setores: true, responsaveis: true });
  };

  // Subtab filtering logic by domain (Almoxarifado, Despensa, Frota)
  const isAll = !activeSubTab || activeSubTab === 'todos_cad';
  const isAlmoxarifado = activeSubTab === 'almoxarifado_cad' || activeSubTab === 'enderecos_cad' || activeSubTab === 'setores_cad';
  const isDespensa = activeSubTab === 'despensa_cad' || activeSubTab === 'fornecedores_cad';
  const isFrota = activeSubTab === 'frota_cad' || activeSubTab === 'responsaveis_cad';

  const showTable1 = isAll || isDespensa; // Fornecedores & Doadoras (Despensa / Alimentação)
  const showTable2 = isAll || isFrota; // Frota de Veículos Institucionais
  const showTable3 = isAll || isAlmoxarifado; // Endereçamento Físico do Galpão (Almoxarifado)
  const showTable4 = isAll || isAlmoxarifado; // Setores & Destinos Solicitantes (Almoxarifado)
  const showTable5 = isAll || isFrota; // Responsáveis Autorizados & Motoristas Credenciados

  // Open Handlers
  const handleOpenAddForn = () => {
    setEditingFornId(null);
    setNewForn({ razaoSocial: '', cnpj: '', categoria: 'Alimentação & Cozinha', dadosBancarios: '', contato: '' });
    setShowFornModal(true);
  };

  const handleOpenAddVeiculo = () => {
    setEditingVeiculoId(null);
    setNewVeiculo({ placa: '', modelo: '', tipo: 'Ônibus Rodoviário', capacidade: '48 Lugares', combustivel: 'Diesel S10' });
    setShowVeiculoModal(true);
  };

  const handleOpenAddEndereco = () => {
    setEditingEnderecoId(null);
    setNewEndereco({ galpao: 'Galpão A (Alimentos)', corredor: 'Corredor 01', prateleira: 'Prateleira 01', palete: 'Palete 01' });
    setShowEnderecoModal(true);
  };

  const handleOpenAddSetor = () => {
    setEditingSetorId(null);
    setNewSetor({ nome: '', responsavel: '', ramal: '' });
    setShowSetorModal(true);
  };

  const handleOpenAddResp = () => {
    setEditingRespId(null);
    setNewResp({ nome: '', cargo: '', documento: '', autorizado: 'Sim (Total)' });
    setShowRespModal(true);
  };

  // Edit Handlers
  const handleEditForn = (f) => {
    setEditingFornId(f.id);
    setNewForn({ razaoSocial: f.razaoSocial || f.nome, cnpj: f.cnpj || f.cpf, categoria: f.categoria, dadosBancarios: f.dadosBancarios, contato: f.contato });
    setShowFornModal(true);
  };

  const handleEditVeiculo = (v) => {
    setEditingVeiculoId(v.id);
    setNewVeiculo({ placa: v.placa, modelo: v.modelo, tipo: v.tipo, capacidade: v.capacidade, combustivel: v.combustivel });
    setShowVeiculoModal(true);
  };

  const handleEditEndereco = (eItem) => {
    setEditingEnderecoId(eItem.id);
    setNewEndereco({ galpao: eItem.galpao, corredor: eItem.corredor, prateleira: eItem.prateleira, palete: eItem.palete });
    setShowEnderecoModal(true);
  };

  // Delete Handlers
  const handleDeleteForn = (id) => {
    if (window.confirm('Deseja excluir este fornecedor?')) {
      setFornecedoresList(fornecedoresList.filter(f => f.id !== id));
    }
  };

  const handleDeleteVeiculo = (id) => {
    if (window.confirm('Deseja excluir este veículo da frota?')) {
      setVeiculosList(veiculosList.filter(v => v.id !== id));
    }
  };

  const handleDeleteEndereco = (id) => {
    if (window.confirm('Deseja excluir este endereço de galpão?')) {
      setEnderecosList(enderecosList.filter(eItem => eItem.id !== id));
    }
  };

  // Save Handlers
  const handleSaveForn = (e) => {
    e.preventDefault();
    if (!newForn.razaoSocial || !newForn.cnpj) return;
    if (editingFornId) {
      setFornecedoresList(fornecedoresList.map(f => f.id === editingFornId ? { ...f, ...newForn } : f));
    } else {
      const item = {
        id: `FORN-00${fornecedoresList.length + 1}`,
        ...newForn,
        status: 'Homologado MROSC'
      };
      if (onAddFornecedor) onAddFornecedor(item);
      setFornecedoresList([...fornecedoresList, item]);
    }
    setShowFornModal(false);
  };

  const handleSaveVeiculo = (e) => {
    e.preventDefault();
    if (!newVeiculo.placa || !newVeiculo.modelo) return;
    if (editingVeiculoId) {
      setVeiculosList(veiculosList.map(v => v.id === editingVeiculoId ? { ...v, ...newVeiculo } : v));
    } else {
      const item = {
        id: Date.now(),
        ...newVeiculo,
        status: 'Operacional'
      };
      setVeiculosList([...veiculosList, item]);
    }
    setShowVeiculoModal(false);
  };

  const handleSaveEndereco = (e) => {
    e.preventDefault();
    if (!newEndereco.galpao || !newEndereco.corredor) return;
    const desc = `${newEndereco.galpao} — ${newEndereco.corredor} — ${newEndereco.prateleira}${newEndereco.palete && newEndereco.palete !== 'N/A' ? ' (' + newEndereco.palete + ')' : ''}`;

    if (editingEnderecoId) {
      setEnderecosList(enderecosList.map(item => item.id === editingEnderecoId ? { ...item, ...newEndereco, descricao: desc } : item));
    } else {
      const item = {
        id: `END-0${enderecosList.length + 1}`,
        ...newEndereco,
        descricao: desc,
        status: 'Ativo'
      };
      setEnderecosList([...enderecosList, item]);
    }
    setShowEnderecoModal(false);
  };

  const handleSaveSetor = (e) => {
    e.preventDefault();
    if (!newSetor.nome) return;
    const newEntry = {
      id: `SET-0${setoresList.length + 1}`,
      ...newSetor,
      status: 'Ativo'
    };
    setSetoresList([...setoresList, newEntry]);
    setShowSetorModal(false);
  };

  const handleSaveResp = (e) => {
    e.preventDefault();
    if (!newResp.nome) return;
    const newEntry = {
      id: `RESP-0${responsaveisList.length + 1}`,
      ...newResp
    };
    setResponsaveisList([...responsaveisList, newEntry]);
    setShowRespModal(false);
  };

  // Filtered lists
  const filteredForn = fornecedoresList.filter(f => (f.razaoSocial || f.nome || '').toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredVeiculos = veiculosList.filter(v => v.placa.toLowerCase().includes(searchTerm.toLowerCase()) || v.modelo.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredEnderecos = enderecosList.filter(eItem => eItem.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || eItem.galpao.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredSetores = setoresList.filter(s => s.nome.toLowerCase().includes(searchTerm.toLowerCase()) || s.responsavel.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredResponsaveis = responsaveisList.filter(r => r.nome.toLowerCase().includes(searchTerm.toLowerCase()) || r.cargo.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
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
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Módulo 2</div>
            <div style={{ fontSize: '1.1rem' }}>CADASTROS ADMINISTRATIVOS</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-success">Módulo Base Central</span>
              <span className="badge badge-primary">Integração Módulos 5, 6 e 7</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>
              Central de Cadastros do Almoxarifado, Despensa, Frota & Setores
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: '4px 0 0 0' }}>
              Manutenção de fornecedores MROSC, veículos, galpões, setores solicitantes e responsáveis autorizados.
            </p>
          </div>
        </div>

        <button 
          onClick={() => setShowManualModal(true)}
          className="btn btn-primary"
          style={{ background: 'linear-gradient(135deg, #059669, #047857)', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, padding: '0.65rem 1.25rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(5,150,105,0.25)' }}
        >
          <Printer size={16} /> Imprimir Manual Administrativo (PDF)
        </button>
      </div>

      {/* Control Bar: Search & Group/Ungroup Actions */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', padding: '0.85rem 1.25rem' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Pesquisar por fornecedor, placa, galpão, setor ou responsável..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        {/* Group / Ungroup Master Toggle Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Exibição das Tabelas:</span>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={handleExpandAll}
            style={{ fontSize: '0.775rem', fontWeight: 700, borderColor: '#059669', color: '#059669' }}
            title="Mostrar e expandir todas as tabelas no corpo do sistema"
          >
            📂 Desagrupar / Expandir Todos ({fornecedoresList.length + veiculosList.length + enderecosList.length + setoresList.length + responsaveisList.length} itens)
          </button>

          <button 
            className="btn btn-secondary btn-sm" 
            onClick={handleCollapseAll}
            style={{ fontSize: '0.775rem', fontWeight: 700, borderColor: '#d97706', color: '#b45309' }}
            title="Recolher e agrupar todas as seções"
          >
            📁 Agrupar / Recolher Todos
          </button>
        </div>
      </div>

      {/* TABLE 1: FORNECEDORES HOMOLOGADOS */}
      {showTable1 && (
        <div className="card" style={{ borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: collapsedSections.fornecedores ? 0 : '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => toggleSection('fornecedores')}>
              <Building2 size={20} style={{ color: '#059669' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>
                2.1. Cadastro de Fornecedores Homologados MROSC & Empresas Doadoras ({filteredForn.length})
              </h3>
              <span className="badge badge-success" style={{ marginLeft: '0.5rem' }}>
                {collapsedSections.fornecedores ? '📁 Agrupado' : '📂 Expandido'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="btn btn-primary btn-sm" onClick={handleOpenAddForn}>
                <Plus size={16} /> + Novo Fornecedor PJ/PF
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => toggleSection('fornecedores')} style={{ padding: '0.2rem 0.5rem' }}>
                {collapsedSections.fornecedores ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>
          </div>

          {!collapsedSections.fornecedores && (
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
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredForn.map(f => (
                    <tr key={f.id}>
                      <td><span className="badge badge-primary">{f.id}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{f.razaoSocial || f.nome}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{f.cnpj || f.cpf}</td>
                      <td><span className="badge badge-info">{f.categoria}</span></td>
                      <td style={{ fontSize: '0.775rem' }}>{f.dadosBancarios}</td>
                      <td style={{ fontSize: '0.775rem' }}>{f.contato}</td>
                      <td><span className="badge badge-success">{f.status || 'Ativo'}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleEditForn(f)} title="Editar Fornecedor">
                            <Edit2 size={13} /> Editar
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteForn(f.id)} title="Excluir Fornecedor">
                            <Trash2 size={13} /> Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TABLE 2: FROTA DE VEÍCULOS */}
      {showTable2 && (
        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: collapsedSections.frota ? 0 : '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => toggleSection('frota')}>
              <Truck size={20} style={{ color: '#0284c7' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>
                2.2. Cadastro de Veículos da Frota Institucional ({filteredVeiculos.length})
              </h3>
              <span className="badge badge-info" style={{ marginLeft: '0.5rem' }}>
                {collapsedSections.frota ? '📁 Agrupado' : '📂 Expandido'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="btn btn-primary btn-sm" onClick={handleOpenAddVeiculo}>
                <Plus size={16} /> + Cadastrar Veículo
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => toggleSection('frota')} style={{ padding: '0.2rem 0.5rem' }}>
                {collapsedSections.frota ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>
          </div>

          {!collapsedSections.frota && (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Placa</th>
                    <th>Modelo / Marca</th>
                    <th>Tipo de Veículo</th>
                    <th>Capacidade</th>
                    <th>Combustível</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVeiculos.map(v => (
                    <tr key={v.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{v.placa}</td>
                      <td>{v.modelo}</td>
                      <td>{v.tipo}</td>
                      <td>{v.capacidade}</td>
                      <td><span className="badge badge-info">{v.combustivel}</span></td>
                      <td><span className="badge badge-success">{v.status}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleEditVeiculo(v)} title="Editar Veículo">
                            <Edit2 size={13} /> Editar
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteVeiculo(v.id)} title="Excluir Veículo">
                            <Trash2 size={13} /> Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TABLE 3: ENDEREÇAMENTO FÍSICO DO GALPÃO */}
      {showTable3 && (
        <div className="card" style={{ borderLeft: '4px solid #d97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: collapsedSections.enderecos ? 0 : '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => toggleSection('enderecos')}>
              <MapPin size={20} style={{ color: '#d97706' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>
                2.3. Endereçamento Físico do Galpão & Almoxarifado ({filteredEnderecos.length})
              </h3>
              <span className="badge badge-warning" style={{ marginLeft: '0.5rem' }}>
                {collapsedSections.enderecos ? '📁 Agrupado' : '📂 Expandido'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="btn btn-primary btn-sm" onClick={handleOpenAddEndereco} style={{ background: '#d97706', borderColor: '#d97706' }}>
                <Plus size={15} /> Cadastrar Endereço Galpão
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => toggleSection('enderecos')} style={{ padding: '0.2rem 0.5rem' }}>
                {collapsedSections.enderecos ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>
          </div>

          {!collapsedSections.enderecos && (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>📍 Galpão / Setor</th>
                    <th>Corredor</th>
                    <th>Prateleira / Palete</th>
                    <th>Endereço Completo (Padronizado)</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnderecos.map(eItem => (
                    <tr key={eItem.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{eItem.id}</td>
                      <td style={{ fontWeight: 700, color: '#1e3a8a' }}>{eItem.galpao}</td>
                      <td>{eItem.corredor}</td>
                      <td>{eItem.prateleira} {eItem.palete && eItem.palete !== 'N/A' ? `(${eItem.palete})` : ''}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>📍 {eItem.descricao}</td>
                      <td><span className="badge badge-success">{eItem.status}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleEditEndereco(eItem)} title="Editar Endereço">
                            <Edit2 size={13} /> Editar
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteEndereco(eItem.id)} title="Excluir Endereço">
                            <Trash2 size={13} /> Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TABLE 4: SETORES & DESTINOS SOLICITANTES */}
      {showTable4 && (
        <div className="card" style={{ borderLeft: '4px solid #7c3aed' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: collapsedSections.setores ? 0 : '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => toggleSection('setores')}>
              <FolderTree size={20} style={{ color: '#7c3aed' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>
                2.4. Setores & Destinos Solicitantes da Sede ({filteredSetores.length})
              </h3>
              <span className="badge badge-primary" style={{ marginLeft: '0.5rem', background: '#7c3aed' }}>
                {collapsedSections.setores ? '📁 Agrupado' : '📂 Expandido'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="btn btn-primary btn-sm" onClick={handleOpenAddSetor} style={{ background: '#7c3aed', borderColor: '#7c3aed' }}>
                <Plus size={15} /> + Novo Setor Solicitante
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => toggleSection('setores')} style={{ padding: '0.2rem 0.5rem' }}>
                {collapsedSections.setores ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>
          </div>

          {!collapsedSections.setores && (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Setor Solicitante</th>
                    <th>Responsável Técnico</th>
                    <th>Ramal / Contato Interno</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSetores.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{s.id}</td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{s.nome}</td>
                      <td>{s.responsavel}</td>
                      <td>Ramal {s.ramal}</td>
                      <td><span className="badge badge-success">{s.status}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-danger btn-sm" onClick={() => setSetoresList(setoresList.filter(item => item.id !== s.id))}>
                            <Trash2 size={13} /> Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TABLE 5: RESPONSÁVEIS AUTORIZADOS */}
      {showTable5 && (
        <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: collapsedSections.responsaveis ? 0 : '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => toggleSection('responsaveis')}>
              <UserCheck size={20} style={{ color: '#2563eb' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>
                2.5. Responsáveis Autorizados para Retirada & Assinatura RMI ({filteredResponsaveis.length})
              </h3>
              <span className="badge badge-info" style={{ marginLeft: '0.5rem' }}>
                {collapsedSections.responsaveis ? '📁 Agrupado' : '📂 Expandido'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="btn btn-primary btn-sm" onClick={handleOpenAddResp}>
                <Plus size={15} /> + Novo Responsável Autorizado
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => toggleSection('responsaveis')} style={{ padding: '0.2rem 0.5rem' }}>
                {collapsedSections.responsaveis ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </button>
            </div>
          </div>

          {!collapsedSections.responsaveis && (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nome do Responsável</th>
                    <th>Função / Cargo</th>
                    <th>Documento (CPF / Registro)</th>
                    <th>Nível de Autorização</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResponsaveis.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{r.id}</td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{r.nome}</td>
                      <td>{r.cargo}</td>
                      <td style={{ fontFamily: 'monospace' }}>{r.documento}</td>
                      <td><span className="badge badge-success">{r.autorizado}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-danger btn-sm" onClick={() => setResponsaveisList(responsaveisList.filter(item => item.id !== r.id))}>
                            <Trash2 size={13} /> Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODALS */}

      {/* Modal 1: Novo Endereço */}
      {showEnderecoModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <MapPin size={20} style={{ color: '#d97706' }} />
                {editingEnderecoId ? 'Editar Endereço Físico de Galpão' : 'Cadastrar Novo Endereço Físico de Galpão'}
              </h3>
              <button className="btn-close" onClick={() => setShowEnderecoModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveEndereco}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Galpão / Setor Principal *</label>
                  <select 
                    className="form-select"
                    value={newEndereco.galpao}
                    onChange={(e) => setNewEndereco({ ...newEndereco, galpao: e.target.value })}
                    required
                  >
                    <option value="Galpão A (Alimentos)">Galpão A (Alimentos & Gêneros)</option>
                    <option value="Galpão B (Padaria)">Galpão B (Padaria Comunidade)</option>
                    <option value="Galpão C (Higiene RDC 29)">Galpão C (Higiene & Limpeza RDC 29)</option>
                    <option value="Galpão D (Mobiliário)">Galpão D (Mobiliário & Utensílios)</option>
                    <option value="Galpão E (Enfermagem)">Galpão E (Enfermagem & Saúde)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Corredor *</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Ex: Corredor 01 ou Corredor Central"
                      value={newEndereco.corredor}
                      onChange={(e) => setNewEndereco({ ...newEndereco, corredor: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Prateleira *</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Ex: Prateleira 03 ou Área Livre"
                      value={newEndereco.prateleira}
                      onChange={(e) => setNewEndereco({ ...newEndereco, prateleira: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Palete / Nível (Opcional)</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Palete 08 ou N/A"
                    value={newEndereco.palete}
                    onChange={(e) => setNewEndereco({ ...newEndereco, palete: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEnderecoModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#d97706', borderColor: '#d97706' }}>
                  Salvar Endereço de Galpão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Novo Fornecedor */}
      {showFornModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Building2 size={20} style={{ color: '#059669' }} />
                {editingFornId ? 'Editar Fornecedor Homologado MROSC' : 'Cadastrar Novo Fornecedor Homologado MROSC'}
              </h3>
              <button className="btn-close" onClick={() => setShowFornModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveForn}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Razão Social / Nome Favorecido *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Atacadão S.A. ou EMBASA"
                    value={newForn.razaoSocial}
                    onChange={(e) => setNewForn({ ...newForn, razaoSocial: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">CNPJ / CPF *</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="00.000.000/0001-00"
                      value={newForn.cnpj}
                      onChange={(e) => setNewForn({ ...newForn, cnpj: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Categoria de Despesa *</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Ex: Alimentação, Água, Energia..."
                      value={newForn.categoria}
                      onChange={(e) => setNewForn({ ...newForn, categoria: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Dados Bancários para Liquidação NFe *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Banco do Brasil - Ag. 3418 / C/C 12.345-0"
                    value={newForn.dadosBancarios}
                    onChange={(e) => setNewForn({ ...newForn, dadosBancarios: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Contato / Telefone *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="(71) 0000-0000"
                    value={newForn.contato}
                    onChange={(e) => setNewForn({ ...newForn, contato: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowFornModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingFornId ? 'Salvar Alterações' : 'Salvar Fornecedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Novo Veículo */}
      {showVeiculoModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Truck size={20} style={{ color: '#059669' }} />
                {editingVeiculoId ? 'Editar Veículo da Frota' : 'Cadastrar Novo Veículo da Frota'}
              </h3>
              <button className="btn-close" onClick={() => setShowVeiculoModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveVeiculo}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Placa do Veículo *</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="ABC-1234"
                      value={newVeiculo.placa}
                      onChange={(e) => setNewVeiculo({ ...newVeiculo, placa: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Combustível *</label>
                    <select 
                      className="form-select"
                      value={newVeiculo.combustivel}
                      onChange={(e) => setNewVeiculo({ ...newVeiculo, combustivel: e.target.value })}
                      required
                    >
                      <option value="Diesel S10">Diesel S10</option>
                      <option value="Gasolina Comum">Gasolina Comum</option>
                      <option value="Etanol">Etanol</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Modelo & Marca *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Mercedes-Benz OF-1721"
                    value={newVeiculo.modelo}
                    onChange={(e) => setNewVeiculo({ ...newVeiculo, modelo: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Tipo de Veículo *</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Ex: Ônibus Rodoviário"
                      value={newVeiculo.tipo}
                      onChange={(e) => setNewVeiculo({ ...newVeiculo, tipo: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Capacidade *</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Ex: 48 Lugares"
                      value={newVeiculo.capacidade}
                      onChange={(e) => setNewVeiculo({ ...newVeiculo, capacidade: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowVeiculoModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingVeiculoId ? 'Salvar Alterações' : 'Salvar Veículo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Novo Setor Solicitante */}
      {showSetorModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <FolderTree size={20} style={{ color: '#7c3aed' }} />
                Cadastrar Novo Setor Solicitante
              </h3>
              <button className="btn-close" onClick={() => setShowSetorModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveSetor}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Nome do Setor Solicitante *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Cozinha Central & Refeitório"
                    value={newSetor.nome}
                    onChange={(e) => setNewSetor({ ...newSetor, nome: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Responsável Técnico *</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Ex: Irmão Raimundo"
                      value={newSetor.responsavel}
                      onChange={(e) => setNewSetor({ ...newSetor, responsavel: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Ramal / Telefone Interno</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Ex: 201"
                      value={newSetor.ramal}
                      onChange={(e) => setNewSetor({ ...newSetor, ramal: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSetorModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#7c3aed', borderColor: '#7c3aed' }}>
                  Salvar Setor Solicitante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Novo Responsável Autorizado */}
      {showRespModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <UserCheck size={20} style={{ color: '#2563eb' }} />
                Cadastrar Novo Responsável Autorizado
              </h3>
              <button className="btn-close" onClick={() => setShowRespModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveResp}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Nome Completo *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Irmão Raimundo Santos"
                    value={newResp.nome}
                    onChange={(e) => setNewResp({ ...newResp, nome: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Função / Cargo *</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Ex: Coordenador de Logística"
                      value={newResp.cargo}
                      onChange={(e) => setNewResp({ ...newResp, cargo: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Documento (CPF / Registro)</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="CPF 000.000.000-00"
                      value={newResp.documento}
                      onChange={(e) => setNewResp({ ...newResp, documento: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowRespModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Responsável
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE IMPRESSÃO DO MANUAL ADMINISTRATIVO */}
      {showManualModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }}>
          <div className="modal-content" style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '950px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
            <div className="modal-header" style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: '#ecfdf5', color: '#059669', padding: '0.5rem', borderRadius: '8px' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Visualizador de Documento — Manual Administrativo</h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Macromódulo 2 • Almoxarifado, Despensa, Frota & Cadastros MROSC</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button className="btn btn-primary" onClick={() => window.print()} style={{ background: '#059669', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <Printer size={16} /> Imprimir / Salvar PDF
                </button>
                <button className="btn-close" onClick={() => setShowManualModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="modal-body printable-document" style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: '#ffffff', color: '#0f172a', fontSize: '8.5pt', lineHeight: 1.45 }}>
              {/* CAPA DOCUMENTO */}
              <div style={{ border: '3.5px solid #059669', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', marginBottom: '2rem' }}>
                <img src="/logo_fundacao_dr_jesus.png" alt="Fundação Dr. Jesus" style={{ height: '55px', objectFit: 'contain', marginBottom: '0.75rem' }} />
                <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#002b7a', margin: '0.25rem 0', textTransform: 'uppercase' }}>FUNDAÇÃO DOUTOR JESUS</h1>
                <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 800, marginBottom: '1.5rem' }}>SGI • Sistema de Gestão Integrada & MROSC Bahia</div>
                <div style={{ borderTop: '2px solid #059669', borderBottom: '2px solid #059669', padding: '1rem 0', margin: '1rem 0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Macromódulo 2 — Logística & Transportes</div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0' }}>MANUAL — GESTÃO ADMINISTRATIVA</h2>
                  <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>Guia Completo de Operações de Almoxarifado FEFO, Despensa & Nutrição (4.000 ref/dia), Gestão de Frota e Cadastros MROSC</p>
                </div>
              </div>

              {/* CONTEÚDO DO MANUAL EXAUSTIVO */}
              <h2 style={{ fontSize: '1.1rem', color: '#002b7a', borderBottom: '2px solid #002b7a', paddingBottom: '4px', marginTop: '1.5rem' }}>1. Visão Geral & Arquitetura das 17 Sub-Abas do Macromódulo 2</h2>
              <p>O <strong>Macromódulo 2: Gestão Administrativa</strong> engloba a totalidade da cadeia de suprimentos alimentares, gestão de estoque dos galpões, logística da despensa/cozinha para a confecção de refeições diárias, controle da frota veicular institucional e manutenção dos cadastros mestre.</p>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '8pt' }}>
                <thead>
                  <tr style={{ background: '#f0fdf4', color: '#065f46' }}>
                    <th style={{ border: '1px solid #cbd5e1', padding: '6px' }}>Módulo</th>
                    <th style={{ border: '1px solid #cbd5e1', padding: '6px' }}>Sub-Aba</th>
                    <th style={{ border: '1px solid #cbd5e1', padding: '6px' }}>Nome da Funcionalidade</th>
                    <th style={{ border: '1px solid #cbd5e1', padding: '6px' }}>Finalidade Operacional Primária</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}><strong>Módulo 5</strong></td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>5.1</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Controle Kardex & Endereçamento</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Saldo de alimentos em tempo real, Galpão A/B, Corredor, Palete e validação FEFO.</td></tr>
                  <tr><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}><strong>Módulo 5</strong></td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>5.2</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Entradas de Doações & Compras NFe</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Lançamento de compras/doações de alimentos com lote, validade e recibo.</td></tr>
                  <tr><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}><strong>Módulo 5</strong></td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>5.3</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Requisições Internas (RMI)</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Emissão e aprovação de RMI para transferência de insumos para a Despensa da Cozinha.</td></tr>
                  <tr><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}><strong>Módulo 5</strong></td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>5.4</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Inventário Físico (TCE-BA)</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Conciliação periódica de estoque com laudo justificativo para auditoria do TCE-BA.</td></tr>
                  <tr><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}><strong>Módulo 5</strong></td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>5.5</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Recibos & Dossiês CNPJ</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Emissão de recibos de doação de insumos com chancela jurídica da instituição.</td></tr>
                  <tr><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}><strong>Módulo 6</strong></td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>6.1</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Visão Geral Estoque Despensa</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Monitoramento dos alimentos secos e hortifrúti na despensa da cozinha central.</td></tr>
                  <tr><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}><strong>Módulo 6</strong></td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>6.2</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Refeições Diárias & 4 Turnos</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Registro da distribuição dos 4 turnos (Café, Almoço, Lanche, Jantar) para 1.100 acolhidos.</td></tr>
                  <tr><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}><strong>Módulo 6</strong></td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>6.3</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Ficha Técnica de Preparação (FTP)</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Dimensionamento gramatura/acolhido, custo ingrediente por ingrediente e porcionamento.</td></tr>
                  <tr><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}><strong>Módulo 6</strong></td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>6.4</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Registro de Perdas & Avarias</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Apuração de descartes por perecibilidade com laudo técnico para auditoria.</td></tr>
                  <tr><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}><strong>Módulo 7</strong></td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>7.1</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Painel & Cadastro de Veículos</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Gestão de frota ativa (Ônibus Rodoviários 46L, Vans Master e Pickups S10 4x4).</td></tr>
                  <tr><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}><strong>Módulo 7</strong></td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>7.2</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Saídas, Diários & Odômetro (km)</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Registro de viagens, destinos (consultas, fórum, CAPS) e km rodado.</td></tr>
                  <tr><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}><strong>Módulo 7</strong></td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>7.3</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Abastecimentos & Média km/l</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Lançamento de cupons de combustível diesel S10 e cálculo de consumo médio km/l.</td></tr>
                  <tr><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}><strong>Módulo 7</strong></td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>7.4</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Ordens de Serviço (OS) Manutenção</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Abertura de OS preventiva (óleo, freios, pneus) e corretiva com oficina credenciada.</td></tr>
                  <tr><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}><strong>Módulo 7</strong></td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>7.5</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Condutores, CNH & Escala</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Cadastro de motoristas profissionais, controle de vencimento de CNH D/E e plantão.</td></tr>
                  <tr><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}><strong>Cadastros</strong></td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>8.1</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Fornecedores Homologados MROSC</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Cadastro de empresas, CNPJ, certidões CNDs e dados bancários.</td></tr>
                  <tr><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}><strong>Cadastros</strong></td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>8.2</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Galpões, Corredores & Paletes</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Estrutura mestre de endereçamento nos depósitos de armazenagem.</td></tr>
                  <tr><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}><strong>Cadastros</strong></td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>8.3</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Setores Solicitantes & Gestores</td><td style={{ border: '1px solid #cbd5e1', padding: '5px' }}>Mapeamento de unidades requisitantes e responsáveis com alçada de assinatura.</td></tr>
                </tbody>
              </table>

              {/* RESUMO DOS MÓDULOS */}
              <div style={{ background: '#f0fdf4', borderLeft: '5px solid #059669', padding: '1rem', borderRadius: '0 8px 8px 0', margin: '1.5rem 0' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#065f46', fontSize: '0.95rem', fontWeight: 900, textTransform: 'uppercase' }}>📌 Resumo & Visão Geral dos Módulos Administrativos</h4>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#047857' }}><strong>Módulo 5 (Almoxarifado Central):</strong> Gestão do recebimento de compras NFe e doações, armazenagem paletizada por galpões (FEFO), requisições RMI e inventário mensal para o TCE-BA.</p>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#047857' }}><strong>Módulo 6 (Despensa & Nutrição):</strong> Controle do preparo de 4.000 refeições diárias distribuídas nos 4 turnos (Café, Almoço, Lanche, Jantar) para 1.100 acolhidos, Ficha Técnica (FTP) e laudo de perdas.</p>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#047857' }}><strong>Módulo 7 (Frota & Transportes):</strong> Coordenação dos 18 veículos (Ônibus, Vans, Pickups 4x4), diários de bordo, cálculo de média km/l, Ordens de Serviço (OS) e condutores CNH D/E.</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#047857' }}><strong>Módulo 8 (Dashboard Logístico):</strong> Painel unificado com indicadores de autonomia, refeições servidas, custos operacionais e regularidade fiscal MROSC.</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
