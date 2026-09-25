import React, { useState } from 'react';
import { 
  Stethoscope, 
  Search, 
  Plus, 
  Hospital, 
  Award, 
  X, 
  Edit2, 
  Trash2, 
  LayoutDashboard, 
  Activity, 
  CheckCircle2, 
  HeartPulse,
  FileCheck,
  Smile,
  Pill
} from 'lucide-react';
import { INITIAL_PROCEDIMENTOS_ODONTO, INITIAL_MEDICAMENTOS_CATALOGO, INITIAL_CARGOS_LABORTERAPIA } from '../mockData';

export default function CadastrosSaudeView({ 
  profissionais = [], 
  onAddProfissional, 
  redeSUS = [], 
  onAddUnidadeSUS, 
  procedimentos = [],
  onAddProcedimento,
  medicamentos = [],
  onAddMedicamento,
  cargos = [],
  onAddCargo,
  activeSubTab 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Local State fallback safely aligned with mockData keys
  const [profissionaisList, setProfissionaisList] = useState(() => {
    return profissionais && profissionais.length > 0 ? profissionais : [
      { id: 'PROF-001', nome: 'Dr. Roberto Magalhães', especialidade: 'Medicina / Psiquiatria', registroProfissional: 'CRM-BA 14.892', telefone: '(71) 99872-3341', status: 'Ativo' },
      { id: 'PROF-002', nome: 'Dra. Patricia Lima', especialidade: 'Psicologia Clínica', registroProfissional: 'CRP-BA 03/11492', telefone: '(71) 98822-1049', status: 'Ativo' },
      { id: 'PROF-003', nome: 'Dra. Vanessa Santos', especialidade: 'Serviço Social', registroProfissional: 'CRESS-BA 4910', telefone: '(71) 99104-5582', status: 'Ativo' }
    ];
  });

  const [procedimentosList, setProcedimentosList] = useState(() => {
    return procedimentos && procedimentos.length > 0 ? procedimentos : INITIAL_PROCEDIMENTOS_ODONTO;
  });

  const [medicamentosList, setMedicamentosList] = useState(() => {
    return medicamentos && medicamentos.length > 0 ? medicamentos : INITIAL_MEDICAMENTOS_CATALOGO;
  });

  const [cargosList, setCargosList] = useState(() => {
    return cargos && cargos.length > 0 ? cargos : INITIAL_CARGOS_LABORTERAPIA;
  });

  const [redeSUSList, setRedeSUSList] = useState(() => {
    return redeSUS && redeSUS.length > 0 ? redeSUS : [
      { id: 'SUS-001', nomeUnidade: 'CAPS AD III Candeias', cnes: '2840192', municipio: 'Candeias/BA', tipoAtendimento: 'Saúde Mental & AD', status: 'Referência Pactuada' },
      { id: 'SUS-002', nomeUnidade: 'Hospital Geral do Estado (HGE)', cnes: '2548191', municipio: 'Salvador/BA', tipoAtendimento: 'Urgência & Trauma', status: 'Rede Estadual' }
    ];
  });

  // Modal States
  const [showProfModal, setShowProfModal] = useState(false);
  const [showProcModal, setShowProcModal] = useState(false);
  const [showMedModal, setShowMedModal] = useState(false);
  const [showSUSModal, setShowSUSModal] = useState(false);
  const [showCargoModal, setShowCargoModal] = useState(false);

  const [editingProfId, setEditingProfId] = useState(null);
  const [editingProcId, setEditingProcId] = useState(null);
  const [editingMedId, setEditingMedId] = useState(null);
  const [editingSUSId, setEditingSUSId] = useState(null);
  const [editingCargoId, setEditingCargoId] = useState(null);

  // Form States
  const [newProf, setNewProf] = useState({ nome: '', especialidade: 'Medicina / Psiquiatria', registroProfissional: '', telefone: '' });
  const [newProc, setNewProc] = useState({ nome: '', categoria: 'Dentística Restauradora', duracaoEstimada: '45 min', especialista: 'Cirurgião Dentista' });
  const [newMed, setNewMed] = useState({ nome: '', categoria: 'Antidepressivo / ISRS', controle: 'Portaria 344 (C1)', dosagemPadrao: '1 cp ao dia', viaPadrao: 'Via Oral (VO)' });
  const [newSUS, setNewSUS] = useState({ nomeUnidade: '', cnes: '', municipio: 'Candeias/BA', tipoAtendimento: 'Saúde Mental & AD' });
  const [newCargo, setNewCargo] = useState({ nome: '', setor: 'Padaria Comunidade', descricao: '' });

  // Subtab filtering logic
  const isAll = !activeSubTab || activeSubTab === 'todos_cad';
  const showTable1 = isAll || activeSubTab === 'profissionais_cad';
  const showTable2 = isAll || activeSubTab === 'procedimentos_cad';
  const showTable3 = isAll || activeSubTab === 'meds_cad';
  const showTable5 = isAll || activeSubTab === 'cargos_cad';
  const showTable4 = isAll || activeSubTab === 'sus_cad';

  // Open Handlers
  const handleOpenAddProf = () => {
    setEditingProfId(null);
    setNewProf({ nome: '', especialidade: 'Medicina / Psiquiatria', registroProfissional: '', telefone: '' });
    setShowProfModal(true);
  };

  const handleOpenAddProc = () => {
    setEditingProcId(null);
    setNewProc({ nome: '', categoria: 'Dentística Restauradora', duracaoEstimada: '45 min', especialista: 'Cirurgião Dentista' });
    setShowProcModal(true);
  };

  const handleOpenAddMed = () => {
    setEditingMedId(null);
    setNewMed({ nome: '', categoria: 'Antidepressivo / ISRS', controle: 'Portaria 344 (C1)', dosagemPadrao: '1 cp ao dia', viaPadrao: 'Via Oral (VO)' });
    setShowMedModal(true);
  };

  const handleOpenAddSUS = () => {
    setEditingSUSId(null);
    setNewSUS({ nomeUnidade: '', cnes: '', municipio: 'Candeias/BA', tipoAtendimento: 'Saúde Mental & AD' });
    setShowSUSModal(true);
  };

  const handleEditProf = (p) => {
    setEditingProfId(p.id);
    setNewProf({ nome: p.nome || '', especialidade: p.especialidade || p.cargo || '', registroProfissional: p.registroProfissional || p.registro || '', telefone: p.telefone || '' });
    setShowProfModal(true);
  };

  const handleEditProc = (pr) => {
    setEditingProcId(pr.id);
    setNewProc({ nome: pr.nome || '', categoria: pr.categoria || 'Dentística Restauradora', duracaoEstimada: pr.duracaoEstimada || '45 min', especialista: pr.especialista || 'Cirurgião Dentista' });
    setShowProcModal(true);
  };

  const handleEditMed = (m) => {
    setEditingMedId(m.id);
    setNewMed({ nome: m.nome || '', categoria: m.categoria || 'Antidepressivo / ISRS', controle: m.controle || 'Livre', dosagemPadrao: m.dosagemPadrao || '1 cp ao dia', viaPadrao: m.viaPadrao || 'Via Oral (VO)' });
    setShowMedModal(true);
  };

  const handleEditSUS = (s) => {
    setEditingSUSId(s.id);
    setNewSUS({ nomeUnidade: s.nomeUnidade || s.nome || '', cnes: s.cnes || '2840192', municipio: s.municipio || 'Candeias/BA', tipoAtendimento: s.tipoAtendimento || s.tipo || 'Saúde Mental & AD' });
    setShowSUSModal(true);
  };

  const handleDeleteProf = (id) => {
    if (window.confirm('Deseja excluir este profissional de saúde?')) {
      setProfissionaisList(profissionaisList.filter(p => p.id !== id));
    }
  };

  const handleDeleteProc = (id) => {
    if (window.confirm('Deseja excluir este procedimento odontológico/clínico?')) {
      setProcedimentosList(procedimentosList.filter(pr => pr.id !== id));
    }
  };

  const handleDeleteMed = (id) => {
    if (window.confirm('Deseja excluir este medicamento do catálogo da farmácia?')) {
      setMedicamentosList(medicamentosList.filter(m => m.id !== id));
    }
  };

  const handleDeleteSUS = (id) => {
    if (window.confirm('Deseja excluir esta unidade SUS?')) {
      setRedeSUSList(redeSUSList.filter(s => s.id !== id));
    }
  };

  // Save Handlers
  const handleSaveProf = (e) => {
    e.preventDefault();
    if (!newProf.nome || !newProf.registroProfissional) return;
    if (editingProfId) {
      setProfissionaisList(profissionaisList.map(p => p.id === editingProfId ? { ...p, ...newProf } : p));
    } else {
      const item = {
        id: `PROF-00${profissionaisList.length + 1}`,
        ...newProf,
        status: 'Ativo'
      };
      if (onAddProfissional) onAddProfissional(item);
      setProfissionaisList([...profissionaisList, item]);
    }
    setShowProfModal(false);
  };

  const handleSaveProc = (e) => {
    e.preventDefault();
    if (!newProc.nome) return;
    if (editingProcId) {
      setProcedimentosList(procedimentosList.map(pr => pr.id === editingProcId ? { ...pr, ...newProc } : pr));
    } else {
      const item = {
        id: `PROC-00${procedimentosList.length + 1}`,
        ...newProc,
        status: 'Ativo'
      };
      if (onAddProcedimento) onAddProcedimento(item);
      setProcedimentosList([...procedimentosList, item]);
    }
    setShowProcModal(false);
  };

  const handleSaveMed = (e) => {
    e.preventDefault();
    if (!newMed.nome) return;
    if (editingMedId) {
      setMedicamentosList(medicamentosList.map(m => m.id === editingMedId ? { ...m, ...newMed } : m));
    } else {
      const item = {
        id: `MED-00${medicamentosList.length + 1}`,
        ...newMed,
        status: 'Ativo'
      };
      if (onAddMedicamento) onAddMedicamento(item);
      setMedicamentosList([...medicamentosList, item]);
    }
    setShowMedModal(false);
  };

  const handleSaveSUS = (e) => {
    e.preventDefault();
    if (!newSUS.nomeUnidade) return;
    if (editingSUSId) {
      setRedeSUSList(redeSUSList.map(s => s.id === editingSUSId ? { ...s, ...newSUS } : s));
    } else {
      const item = {
        id: `SUS-00${redeSUSList.length + 1}`,
        ...newSUS,
        cnes: newSUS.cnes || '2840192',
        status: 'Referência Pactuada'
      };
      if (onAddUnidadeSUS) onAddUnidadeSUS(item);
      setRedeSUSList([...redeSUSList, item]);
    }
    setShowSUSModal(false);
  };

  // Safe Search Filter
  const safeSearch = (searchTerm || '').toLowerCase();

  const filteredProf = (profissionaisList || []).filter(p => {
    const nome = (p?.nome || '').toLowerCase();
    const reg = (p?.registroProfissional || p?.registro || '').toLowerCase();
    const esp = (p?.especialidade || p?.cargo || '').toLowerCase();
    return nome.includes(safeSearch) || reg.includes(safeSearch) || esp.includes(safeSearch);
  });

  const filteredProc = (procedimentosList || []).filter(pr => {
    const nome = (pr?.nome || '').toLowerCase();
    const cat = (pr?.categoria || '').toLowerCase();
    const esp = (pr?.especialista || '').toLowerCase();
    return nome.includes(safeSearch) || cat.includes(safeSearch) || esp.includes(safeSearch);
  });

  const filteredMeds = (medicamentosList || []).filter(m => {
    const nome = (m?.nome || '').toLowerCase();
    const cat = (m?.categoria || '').toLowerCase();
    const ctrl = (m?.controle || '').toLowerCase();
    return nome.includes(safeSearch) || cat.includes(safeSearch) || ctrl.includes(safeSearch);
  });

  const filteredSUS = (redeSUSList || []).filter(s => {
    const nome = (s?.nomeUnidade || s?.nome || '').toLowerCase();
    const cnes = (s?.cnes || '').toLowerCase();
    const mun = (s?.municipio || '').toLowerCase();
    const tipo = (s?.tipoAtendimento || s?.tipo || '').toLowerCase();
    return nome.includes(safeSearch) || cnes.includes(safeSearch) || mun.includes(safeSearch) || tipo.includes(safeSearch);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
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
            <div style={{ fontSize: '1.1rem' }}>CADASTROS DA SAÚDE</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-info">Área Exclusiva: 3. Saúde & Multidisciplinar</span>
              <span className="badge badge-primary">Módulos 8 e 9 (RDC 29)</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0 }}>
              Central de Cadastros do Corpo Clínico, Fármacos & Rede SUS
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: '4px 0 0 0' }}>
              Gestão homologada de médicos/especialistas, procedimentos, medicamentos da farmácia e pontos de apoio do SUS.
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', padding: '0.85rem 1.25rem' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Pesquisar por medicamento, procedimento, médico, dentista, registro CRM/CRP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
      </div>

      {/* Table 1: Corpo Clínico CRM/CRP/COREN */}
      {showTable1 && (
        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Stethoscope size={20} style={{ color: '#0284c7' }} />
              3.1. Cadastro do Corpo Clínico & Multidisciplinar ({filteredProf.length})
            </h3>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddProf}>
              <Plus size={16} /> + Novo Profissional de Saúde
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome do Profissional</th>
                  <th>Especialidade / Cargo</th>
                  <th>Registro Profissional</th>
                  <th>Telefone</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProf.map(p => (
                  <tr key={p.id || p.nome}>
                    <td style={{ fontWeight: 700 }}>{p.nome}</td>
                    <td><span className="badge badge-info">{p.especialidade || p.cargo || 'Saúde'}</span></td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{p.registroProfissional || p.registro || 'Habilitado'}</td>
                    <td>{p.telefone || '(71) 99000-0000'}</td>
                    <td><span className="badge badge-success">{p.status || 'Ativo'}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleEditProf(p)} title="Editar Profissional">
                          <Edit2 size={13} /> Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProf(p.id)} title="Excluir Profissional">
                          <Trash2 size={13} /> Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Table 2: Catálogo de Procedimentos Odontológicos & Clínicos */}
      {showTable2 && (
        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Smile size={20} style={{ color: '#0284c7' }} />
              3.2. Catálogo de Procedimentos Odontológicos & Clínicos Homologados ({filteredProc.length})
            </h3>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddProc}>
              <Plus size={16} /> + Novo Procedimento
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código / Nome do Procedimento</th>
                  <th>Categoria Odontológica</th>
                  <th>Duração Estimada</th>
                  <th>Especialista Exigido</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProc.map(pr => (
                  <tr key={pr.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{pr.nome}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{pr.id}</div>
                    </td>
                    <td><span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>{pr.categoria}</span></td>
                    <td style={{ fontSize: '0.8rem' }}>{pr.duracaoEstimada}</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{pr.especialista}</td>
                    <td><span className="badge badge-success">{pr.status}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleEditProc(pr)} title="Editar Procedimento">
                          <Edit2 size={13} /> Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProc(pr.id)} title="Excluir Procedimento">
                          <Trash2 size={13} /> Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Table 3: Catálogo de Medicamentos da Farmácia */}
      {showTable3 && (
        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Pill size={20} style={{ color: '#0284c7' }} />
              3.3. Catálogo de Medicamentos da Farmácia ({filteredMeds.length})
            </h3>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddMed}>
              <Plus size={16} /> + Novo Medicamento
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código / Nome do Medicamento</th>
                  <th>Categoria Terapêutica</th>
                  <th>Controle / Portaria ANVISA</th>
                  <th>Dosagem Padrão</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredMeds.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{m.nome}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{m.id}</div>
                    </td>
                    <td><span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{m.categoria}</span></td>
                    <td>
                      <span className={`badge ${m.controle?.includes('Portaria 344') ? 'badge-warning' : 'badge-outline'}`} style={{ fontSize: '0.65rem' }}>
                        {m.controle}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{m.dosagemPadrao}</td>
                    <td><span className="badge badge-success">{m.status}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleEditMed(m)} title="Editar Medicamento">
                          <Edit2 size={13} /> Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteMed(m.id)} title="Excluir Medicamento">
                          <Trash2 size={13} /> Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Table 4: Unidades da Rede SUS */}
      {showTable4 && (
        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Hospital size={20} style={{ color: '#0284c7' }} />
              3.4. Unidades da Rede SUS de Referência & Parcerias ({filteredSUS.length})
            </h3>
            <button className="btn btn-primary btn-sm" onClick={handleOpenAddSUS}>
              <Plus size={16} /> + Nova Unidade SUS
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome da Unidade</th>
                  <th>Código CNES</th>
                  <th>Município</th>
                  <th>Tipo de Atendimento</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredSUS.map(s => (
                  <tr key={s.id || s.nomeUnidade}>
                    <td style={{ fontWeight: 700 }}>{s.nomeUnidade || s.nome}</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>CNES: {s.cnes || '2840192'}</td>
                    <td>{s.municipio || 'Candeias/BA'}</td>
                    <td><span className="badge badge-warning">{s.tipoAtendimento || s.tipo || 'Saúde Mental'}</span></td>
                    <td><span className="badge badge-success">{s.status || 'Ativo'}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleEditSUS(s)} title="Editar Unidade SUS">
                          <Edit2 size={13} /> Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSUS(s.id)} title="Excluir Unidade">
                          <Trash2 size={13} /> Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Profissional */}
      {showProfModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-primary">{editingProfId ? 'Editar Profissional' : 'Novo Profissional de Saúde'}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowProfModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSaveProf} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Nome Completo do Profissional</label>
                <input type="text" required className="form-input" placeholder="Ex: Dr. Fernando Souza" value={newProf.nome} onChange={e => setNewProf({ ...newProf, nome: e.target.value })} />
              </div>
              <div className="grid-2">
                <div>
                  <label className="form-label">Especialidade / Cargo</label>
                  <select className="form-select" value={newProf.especialidade} onChange={e => setNewProf({ ...newProf, especialidade: e.target.value })}>
                    <option value="Medicina / Psiquiatria">Medicina / Psiquiatria</option>
                    <option value="Clínica Geral">Clínica Geral</option>
                    <option value="Psicologia Clínica">Psicologia Clínica</option>
                    <option value="Enfermagem Chefe">Enfermagem Chefe</option>
                    <option value="Serviço Social">Serviço Social</option>
                    <option value="Odontologia">Odontologia</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Registro Profissional (CRM/CRP/COREN/CRO)</label>
                  <input type="text" required className="form-input" placeholder="Ex: CRM-BA 14.892" value={newProf.registroProfissional} onChange={e => setNewProf({ ...newProf, registroProfissional: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="form-label">Telefone / Contato</label>
                <input type="text" className="form-input" placeholder="Ex: (71) 99872-0000" value={newProf.telefone} onChange={e => setNewProf({ ...newProf, telefone: e.target.value })} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProfModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar Profissional</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Procedimento Odontologico */}
      {showProcModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-primary">{editingProcId ? 'Editar Procedimento' : 'Novo Procedimento Odontológico / Clínico'}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowProcModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSaveProc} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Nome do Procedimento</label>
                <input type="text" required className="form-input" placeholder="Ex: Restauração Estética em Resina Composta" value={newProc.nome} onChange={e => setNewProc({ ...newProc, nome: e.target.value })} />
              </div>
              <div className="grid-2">
                <div>
                  <label className="form-label">Categoria Odontológica</label>
                  <select className="form-select" value={newProc.categoria} onChange={e => setNewProc({ ...newProc, categoria: e.target.value })}>
                    <option value="Dentística Restauradora">Dentística Restauradora</option>
                    <option value="Prótese Dental">Prótese Dental</option>
                    <option value="Periodontia & Prevenção">Periodontia & Prevenção</option>
                    <option value="Cirurgia Oral">Cirurgia Oral</option>
                    <option value="Endodontia">Endodontia</option>
                    <option value="Diagnóstico & Admissão">Diagnóstico & Admissão</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Duração Estimada</label>
                  <input type="text" className="form-input" placeholder="Ex: 45 min" value={newProc.duracaoEstimada} onChange={e => setNewProc({ ...newProc, duracaoEstimada: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="form-label">Especialista Exigido</label>
                <select className="form-select" value={newProc.especialista} onChange={e => setNewProc({ ...newProc, especialista: e.target.value })}>
                  <option value="Cirurgião Dentista">Cirurgião Dentista</option>
                  <option value="Protesista / Dentista">Protesista / Dentista</option>
                  <option value="Endodontista">Endodontista</option>
                  <option value="Dentista / Higienista">Dentista / Higienista</option>
                  <option value="Médico Clínico">Médico Clínico</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProcModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar Procedimento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Medicamento Farmácia */}
      {showMedModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-primary">{editingMedId ? 'Editar Medicamento' : 'Novo Medicamento no Catálogo'}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowMedModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSaveMed} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Nome do Medicamento & Miligramagem</label>
                <input type="text" required className="form-input" placeholder="Ex: Sertralina 50mg" value={newMed.nome} onChange={e => setNewMed({ ...newMed, nome: e.target.value })} />
              </div>
              <div className="grid-2">
                <div>
                  <label className="form-label">Categoria Terapêutica</label>
                  <select className="form-select" value={newMed.categoria} onChange={e => setNewMed({ ...newMed, categoria: e.target.value })}>
                    <option value="Antidepressivo / ISRS">Antidepressivo / ISRS</option>
                    <option value="Antipsicótico">Antipsicótico</option>
                    <option value="Benzodiazepínico">Benzodiazepínico</option>
                    <option value="Suplementação">Suplementação</option>
                    <option value="Protetor Gástrico">Protetor Gástrico</option>
                    <option value="Analgésico / Antitérmico">Analgésico / Antitérmico</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Controle / Portaria ANVISA</label>
                  <select className="form-select" value={newMed.controle} onChange={e => setNewMed({ ...newMed, controle: e.target.value })}>
                    <option value="Livre">Livre (Venda Livre)</option>
                    <option value="Portaria 344 (C1)">Portaria 344 (C1 Branca)</option>
                    <option value="Portaria 344 (B1 Preta)">Portaria 344 (B1 Preta)</option>
                    <option value="Sujeito a Retenção">Sujeito a Retenção</option>
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div>
                  <label className="form-label">Dosagem Padrão Recomendada</label>
                  <input type="text" className="form-input" placeholder="Ex: 1 cp pela manhã" value={newMed.dosagemPadrao} onChange={e => setNewMed({ ...newMed, dosagemPadrao: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Via Padrão</label>
                  <select className="form-select" value={newMed.viaPadrao} onChange={e => setNewMed({ ...newMed, viaPadrao: e.target.value })}>
                    <option value="Via Oral (VO)">Via Oral (VO)</option>
                    <option value="Sublingual (SL)">Sublingual (SL)</option>
                    <option value="Injetável / IM">Injetável / IM</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowMedModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar Medicamento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Unidade SUS */}
      {showSUSModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-primary">{editingSUSId ? 'Editar Unidade SUS' : 'Nova Unidade da Rede SUS'}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowSUSModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSaveSUS} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Nome da Unidade Hospitalar / CAPS</label>
                <input type="text" required className="form-input" placeholder="Ex: CAPS AD III Candeias" value={newSUS.nomeUnidade} onChange={e => setNewSUS({ ...newSUS, nomeUnidade: e.target.value })} />
              </div>
              <div className="grid-2">
                <div>
                  <label className="form-label">Código CNES</label>
                  <input type="text" className="form-input" placeholder="Ex: 2840192" value={newSUS.cnes} onChange={e => setNewSUS({ ...newSUS, cnes: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Município</label>
                  <input type="text" className="form-input" placeholder="Ex: Candeias/BA" value={newSUS.municipio} onChange={e => setNewSUS({ ...newSUS, municipio: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="form-label">Tipo de Atendimento</label>
                <select className="form-select" value={newSUS.tipoAtendimento} onChange={e => setNewSUS({ ...newSUS, tipoAtendimento: e.target.value })}>
                  <option value="Saúde Mental & AD">Saúde Mental & AD</option>
                  <option value="Urgência & Trauma">Urgência & Trauma</option>
                  <option value="Atendimento Geral / Policlínica">Atendimento Geral / Policlínica</option>
                  <option value="Exames & Diagnósticos">Exames & Diagnósticos</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSUSModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar Unidade</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
