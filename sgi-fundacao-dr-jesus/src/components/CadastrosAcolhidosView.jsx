import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, BedDouble, Heart, ShieldCheck, X, Edit2, Trash2, LayoutDashboard, TrendingUp, PieChart, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CadastrosAcolhidosView({ blocos = [], onUpdateBlocos, acolhidos = [], onResetAcolhidos, onRestoreAcolhidos, activeSubTab }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Initial Real Blocks sync with GestaoLeitosView datasets
  const defaultBlocos = [
    { id: 'BL-A', bloco: 'Bloco A - Restauração', capacidade: 250, pcd: 10, ocupacao: 3, status: 'Operacional' },
    { id: 'BL-B', bloco: 'Bloco B - Renovação', capacidade: 250, pcd: 5, ocupacao: 1, status: 'Operacional' },
    { id: 'BL-C', bloco: 'Bloco C - Esperança', capacidade: 300, pcd: 5, ocupacao: 1, status: 'Operacional' },
    { id: 'BL-D', bloco: 'Bloco D - Graça', capacidade: 300, pcd: 10, ocupacao: 1, status: 'Operacional' },
    { id: 'BL-ENF', bloco: 'Apoio Saúde & Enfermaria', capacidade: 50, pcd: 5, ocupacao: 1, status: 'Operacional' }
  ];

  // Dynamic state for local or synced blocks
  const [blocosList, setBlocosList] = useState(() => {
    if (blocos && blocos.length > 0) {
      return blocos.map(b => {
        const count = acolhidos ? acolhidos.filter(a => (a.alojamento || '').includes(b.nome || b.bloco) && a.status !== 'Alta Terapêutica').length : (b.ocupados || b.ocupacao || 0);
        return {
          id: b.id,
          bloco: b.nome || b.bloco,
          capacidade: b.capacidade || 250,
          pcd: b.pcd || (b.id === 'BL-A' || b.id === 'BL-D' ? 10 : 5),
          ocupacao: count > 0 ? count : (b.ocupados || 1),
          status: 'Operacional'
        };
      });
    }
    return defaultBlocos;
  });

  // Re-sync if props change
  useEffect(() => {
    if (blocos && blocos.length > 0) {
      const synced = blocos.map(b => {
        const count = acolhidos ? acolhidos.filter(a => (a.alojamento || '').includes(b.nome || b.bloco) && a.status !== 'Alta Terapêutica').length : (b.ocupados || b.ocupacao || 0);
        return {
          id: b.id,
          bloco: b.nome || b.bloco,
          capacidade: b.capacidade || 250,
          pcd: b.pcd || (b.id === 'BL-A' || b.id === 'BL-D' ? 10 : 5),
          ocupacao: count > 0 ? count : (b.ocupados || 1),
          status: 'Operacional'
        };
      });
      setBlocosList(synced);
    }
  }, [blocos, acolhidos]);

  const [visitantesList, setVisitantesList] = useState([
    { id: 1, nome: 'Maria das Graças Silva', cpf: '123.456.789-00', parentesco: 'Mãe', acolhido: 'Lucas Silva Santos (Leito A-12)', modalidade: 'Visita Presencial Domingo' },
    { id: 2, nome: 'José Carlos Santos', cpf: '987.654.321-11', parentesco: 'Pai', acolhido: 'Mateus Santos Oliveira (Leito B-05)', modalidade: 'Videochamada Assistida' },
    { id: 3, nome: 'Ana Paula Ferreira', cpf: '456.789.123-22', parentesco: 'Cônjuge', acolhido: 'Roberto Ferreira (Leito C-01)', modalidade: 'Passe Terapêutico Fim de Semana' }
  ]);

  const [padrinhosList, setPadrinhosList] = useState([
    { id: 1, nome: 'Carlos Eduardo Souza', tempoSobriedade: '2 anos e 4 meses', profissao: 'Eletricista de Manutenção', mentorados: '3 Acolhidos na Fase 1' },
    { id: 2, nome: 'Roberto Nascimento', tempoSobriedade: '4 anos', profissao: 'Gerente de Loja', mentorados: '2 Acolhidos na Fase 2' }
  ]);

  const [followUpList, setFollowUpList] = useState([
    {
      id: 1,
      acolhidoNome: 'Gerson Silva de Jesus',
      dataAlta: '2026-08-10',
      contato30Dias: 'Sobriedade Mantida • Trabalhando em Marcenaria (Contato 14/08)',
      contato60Dias: 'Agendado para 10/10/2026',
      status: '🟢 Sobriedade & Reinserção Confirmadas'
    }
  ]);

  const [origensList, setOrigensList] = useState([
    { id: 1, nome: 'Salvador (Subúrbio Ferroviário)', estado: 'BA', tipo: 'Capital / Subúrbio', prioridade: 'Alta' },
    { id: 2, nome: 'Salvador (Centro / Periferia)', estado: 'BA', tipo: 'Capital', prioridade: 'Alta' },
    { id: 3, nome: 'Candeias (Sede & Malembá)', estado: 'BA', tipo: 'Município Sede', prioridade: 'Urgente' },
    { id: 4, nome: 'Simões Filho', estado: 'BA', tipo: 'Região Metropolitana', prioridade: 'Média' },
    { id: 5, nome: 'Camaçari', estado: 'BA', tipo: 'Região Metropolitana', prioridade: 'Média' },
    { id: 6, nome: 'Feira de Santana', estado: 'BA', tipo: 'Interior', prioridade: 'Normal' },
    { id: 7, nome: 'Lauro de Freitas', estado: 'BA', tipo: 'Região Metropolitana', prioridade: 'Normal' }
  ]);

  const [substanciasList, setSubstanciasList] = useState([
    { id: 1, nome: 'Crack / Álcool', categoria: 'Múltiplas (Estimulante + Depressor)', risco: 'Crítico' },
    { id: 2, nome: 'Múltiplas (Álcool, Cocaína)', categoria: 'Polidrogadição', risco: 'Alto' },
    { id: 3, nome: 'Álcool', categoria: 'Depressor do SNC', risco: 'Alto' },
    { id: 4, nome: 'Crack', categoria: 'Estimulante do SNC', risco: 'Crítico' },
    { id: 5, nome: 'Cocaína', categoria: 'Estimulante do SNC', risco: 'Alto' },
    { id: 6, nome: 'Cannabis / Maconha', categoria: 'Perturbador do SNC', risco: 'Médio' },
    { id: 7, nome: 'Medicamentos / Controlados', categoria: 'Sintético / Psiquiatria', risco: 'Médio' }
  ]);

  const [destinosList, setDestinosList] = useState([
    { id: 1, titulo: 'Retorno ao Convívio Familiar & Residência de Origem', tipo: 'Reinserção Familiar', convenio: 'MROSC SADS-BA' },
    { id: 2, titulo: 'Inserção Profissional (Vaga SineBahia / SENAI / Empresa Parceira)', tipo: 'Empregabilidade', convenio: 'SineBahia / SETRE' },
    { id: 3, titulo: 'Encaminhamento para Rede SUS / CAPS AD III', tipo: 'Saúde Mental', convenio: 'Rede SUS / SESAB' },
    { id: 4, titulo: 'Engajamento na Rede de Egressos Mentores FDJ', tipo: 'Mentoria & Voluntariado', convenio: 'Fundação Dr. Jesus' },
    { id: 5, titulo: 'Transferência para Unidade de Apoio Social', tipo: 'Assistência Social', convenio: 'Rede SUAS' }
  ]);

  // IBGE Automatic Cities Test State
  const [selectedTestUF, setSelectedTestUF] = useState('BA');
  const [ibgeTestCidades, setIbgeTestCidades] = useState([]);

  useEffect(() => {
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedTestUF}/municipios?orderBy=nome`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setIbgeTestCidades(data.map(m => m.nome));
      })
      .catch(err => console.warn(err));
  }, [selectedTestUF]);

  // Modal States
  const [showLeitoModal, setShowLeitoModal] = useState(false);
  const [showVisitanteModal, setShowVisitanteModal] = useState(false);
  const [showMentorCadModal, setShowMentorCadModal] = useState(false);
  const [showFollowUpCadModal, setShowFollowUpCadModal] = useState(false);
  const [showOrigemModal, setShowOrigemModal] = useState(false);
  const [showSubstanciaModal, setShowSubstanciaModal] = useState(false);
  const [showDestinoModal, setShowDestinoModal] = useState(false);

  const [editingLeitoId, setEditingLeitoId] = useState(null);
  const [editingVisitanteId, setEditingVisitanteId] = useState(null);
  const [editingMentorId, setEditingMentorId] = useState(null);
  const [editingFollowUpId, setEditingFollowUpId] = useState(null);
  const [editingOrigemId, setEditingOrigemId] = useState(null);
  const [editingSubstanciaId, setEditingSubstanciaId] = useState(null);
  const [editingDestinoId, setEditingDestinoId] = useState(null);

  // Form States
  const [newLeito, setNewLeito] = useState({ bloco: '', capacidade: 250, pcd: 10, ocupacao: 0 });
  const [newVisitante, setNewVisitante] = useState({ nome: '', cpf: '', parentesco: 'Mãe', acolhido: '', modalidade: 'Visita Presencial Domingo' });
  const [newMentorForm, setNewMentorForm] = useState({ nome: '', tempoSobriedade: '2 anos', profissao: '', mentorados: '1 Acolhido' });
  const [newFollowUpForm, setNewFollowUpForm] = useState({ acolhidoNome: '', contato: 'Sobriedade Mantida', status: '🟢 Sobriedade & Reinserção Confirmadas' });
  const [newOrigemForm, setNewOrigemForm] = useState({ nome: '', estado: 'BA', tipo: 'Capital', prioridade: 'Alta' });
  const [newSubstanciaForm, setNewSubstanciaForm] = useState({ nome: '', categoria: 'Estimulante do SNC', risco: 'Alto' });
  const [newDestinoForm, setNewDestinoForm] = useState({ titulo: '', tipo: 'Reinserção Social', convenio: 'MROSC SADS-BA' });

  // Subtab filtering logic for all 6 tables
  const showTable1 = activeSubTab === 'leitos_cad' || activeSubTab === 'todos_cad' || !activeSubTab;
  const showTable2 = activeSubTab === 'visitantes_cad' || activeSubTab === 'todos_cad' || !activeSubTab;
  const showTable3 = activeSubTab === 'mentores_cad' || activeSubTab === 'todos_cad' || !activeSubTab;
  const showTable4 = activeSubTab === 'followup_cad' || activeSubTab === 'todos_cad' || !activeSubTab;
  const showTable5 = activeSubTab === 'substancias_cad' || activeSubTab === 'todos_cad' || !activeSubTab;
  const showTable6 = activeSubTab === 'destinos_cad' || activeSubTab === 'todos_cad' || !activeSubTab;

  const handleOpenAddMentor = () => {
    setEditingMentorId(null);
    setNewMentorForm({ nome: '', tempoSobriedade: '2 anos', profissao: '', mentorados: '1 Acolhido' });
    setShowMentorCadModal(true);
  };

  const handleEditMentor = (m) => {
    setEditingMentorId(m.id);
    setNewMentorForm({ nome: m.nome, tempoSobriedade: m.tempoSobriedade, profissao: m.profissao, mentorados: m.mentorados });
    setShowMentorCadModal(true);
  };

  const handleDeleteMentor = (id) => {
    if (window.confirm('Tem certeza que deseja excluir o cadastro deste mentor egresso?')) {
      setPadrinhosList(padrinhosList.filter(m => m.id !== id));
    }
  };

  const handleSaveMentor = (e) => {
    e.preventDefault();
    if (!newMentorForm.nome) return;
    if (editingMentorId) {
      setPadrinhosList(padrinhosList.map(m => m.id === editingMentorId ? { ...m, ...newMentorForm } : m));
    } else {
      setPadrinhosList([...padrinhosList, { id: Date.now(), ...newMentorForm }]);
    }
    setShowMentorCadModal(false);
  };

  const handleOpenAddFollowUp = () => {
    setEditingFollowUpId(null);
    setNewFollowUpForm({ acolhidoNome: acolhidos[0]?.nome || 'Gerson Silva de Jesus', contato: 'Sobriedade Mantida', status: '🟢 Sobriedade & Reinserção Confirmadas' });
    setShowFollowUpCadModal(true);
  };

  const handleEditFollowUp = (f) => {
    setEditingFollowUpId(f.id);
    setNewFollowUpForm({ acolhidoNome: f.acolhidoNome, contato: f.contato30Dias, status: f.status });
    setShowFollowUpCadModal(true);
  };

  const handleDeleteFollowUp = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de acompanhamento pós-alta?')) {
      setFollowUpList(followUpList.filter(f => f.id !== id));
    }
  };

  const handleSaveFollowUp = (e) => {
    e.preventDefault();
    if (!newFollowUpForm.acolhidoNome) return;
    if (editingFollowUpId) {
      setFollowUpList(followUpList.map(f => f.id === editingFollowUpId ? {
        ...f,
        acolhidoNome: newFollowUpForm.acolhidoNome,
        contato30Dias: newFollowUpForm.contato,
        status: newFollowUpForm.status
      } : f));
    } else {
      setFollowUpList([...followUpList, {
        id: Date.now(),
        acolhidoNome: newFollowUpForm.acolhidoNome,
        dataAlta: new Date().toISOString().split('T')[0],
        contato30Dias: newFollowUpForm.contato,
        contato60Dias: 'Agendado',
        status: newFollowUpForm.status
      }]);
    }
    setShowFollowUpCadModal(false);
  };

  // Open Add Modals
  const handleOpenAddLeito = () => {
    setEditingLeitoId(null);
    setNewLeito({ bloco: '', capacidade: 250, pcd: 10, ocupacao: 0 });
    setShowLeitoModal(true);
  };

  const handleOpenAddVisitante = () => {
    setEditingVisitanteId(null);
    const defaultAcolhido = acolhidos && acolhidos.length > 0 
      ? `${acolhidos[0].nome} (${acolhidos[0].alojamento || 'Bloco A - Restauração'})` 
      : 'Lucas Silva Santos (Leito A-12 - Bloco A - Restauração)';
    setNewVisitante({ nome: '', cpf: '', parentesco: 'Mãe', acolhido: defaultAcolhido, modalidade: 'Visita Presencial Domingo' });
    setShowVisitanteModal(true);
  };

  // Open Edit Modals
  const handleEditLeito = (b) => {
    setEditingLeitoId(b.id);
    setNewLeito({ bloco: b.bloco, capacidade: b.capacidade, pcd: b.pcd, ocupacao: b.ocupacao });
    setShowLeitoModal(true);
  };

  const handleEditVisitante = (v) => {
    setEditingVisitanteId(v.id);
    setNewVisitante({ nome: v.nome, cpf: v.cpf, parentesco: v.parentesco, acolhido: v.acolhido, modalidade: v.modalidade });
    setShowVisitanteModal(true);
  };

  // Delete Handlers
  const handleDeleteLeito = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este alojamento/leito?')) {
      const updated = blocosList.filter(b => b.id !== id);
      setBlocosList(updated);
      if (onUpdateBlocos) onUpdateBlocos(updated);
    }
  };

  const handleDeleteVisitante = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta autorização de visitante?')) {
      setVisitantesList(visitantesList.filter(v => v.id !== id));
    }
  };

  // Save Handlers
  const handleSaveLeito = (e) => {
    e.preventDefault();
    if (!newLeito.bloco) return;
    const cap = parseInt(newLeito.capacidade) || 250;
    // Ocupação é mantida do cadastro real de acolhidos da triagem (não editável manualmente)
    const existingBlock = blocosList.find(b => b.id === editingLeitoId);
    const countFromAcolhidos = acolhidos ? acolhidos.filter(a => (a.alojamento || '').includes(newLeito.bloco) && a.status !== 'Alta Terapêutica').length : 0;
    const ocu = existingBlock ? (existingBlock.ocupacao || countFromAcolhidos) : countFromAcolhidos;
    const vagasCalculadas = Math.max(0, cap - ocu);
    const statusCalculado = vagasCalculadas === 0 ? 'Lotado (100% Ocupado)' : 'Operacional';
    
    let updatedList;
    if (editingLeitoId) {
      updatedList = blocosList.map(b => b.id === editingLeitoId ? {
        ...b,
        bloco: newLeito.bloco,
        capacidade: cap,
        pcd: parseInt(newLeito.pcd) || 0,
        ocupacao: ocu,
        vagas: vagasCalculadas,
        status: statusCalculado
      } : b);
    } else {
      const item = {
        id: `BL-${Date.now()}`,
        bloco: newLeito.bloco,
        capacidade: cap,
        pcd: parseInt(newLeito.pcd) || 0,
        ocupacao: ocu,
        vagas: vagasCalculadas,
        status: statusCalculado
      };
      updatedList = [...blocosList, item];
    }
    setBlocosList(updatedList);
    if (onUpdateBlocos) onUpdateBlocos(updatedList);
    setShowLeitoModal(false);
  };

  const handleSaveVisitante = (e) => {
    e.preventDefault();
    if (!newVisitante.nome || !newVisitante.cpf) return;

    if (editingVisitanteId) {
      setVisitantesList(visitantesList.map(v => v.id === editingVisitanteId ? { ...v, ...newVisitante } : v));
    } else {
      const item = {
        id: Date.now(),
        ...newVisitante
      };
      setVisitantesList([...visitantesList, item]);
    }
    setShowVisitanteModal(false);
  };

  const filteredBlocos = blocosList.filter(b => b.bloco.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredVisitantes = visitantesList.filter(v => v.nome.toLowerCase().includes(searchTerm.toLowerCase()) || v.acolhido.toLowerCase().includes(searchTerm.toLowerCase()));

  // Dashboard Aggregates
  const totalCapacidade = blocosList.reduce((acc, b) => acc + (b.capacidade || 0), 0);
  const totalOcupados = blocosList.reduce((acc, b) => acc + (b.ocupacao || 0), 0);
  const totalVagas = Math.max(0, totalCapacidade - totalOcupados);
  const totalPCD = blocosList.reduce((acc, b) => acc + (b.pcd || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
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
            background: 'linear-gradient(135deg, #dc2626, #991b1b)',
            color: '#fff',
            padding: '0.85rem 1.15rem',
            borderRadius: '10px',
            fontWeight: 800,
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(220,38,38,0.25)'
          }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Macromódulo 1</div>
            <div style={{ fontSize: '1.1rem' }}>CADASTROS ACOLHIDOS</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-danger">Área Exclusiva: 1. Gestão dos Acolhidos</span>
              <span className="badge badge-primary">Módulos 1 a 4</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0 }}>
              Cadastros de Alojamentos, Visitantes e Termos
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: '4px 0 0 0' }}>
              Ambiente de gerenciamento de alojamentos, leitos e visitantes da rede familiar.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-danger btn-sm" onClick={onResetAcolhidos} title="Limpa todos os acolhidos cadastrados para iniciar do zero">
            <Trash2 size={16} /> Zerar Acolhidos (0)
          </button>
          {onRestoreAcolhidos && (
            <button className="btn btn-secondary btn-sm" onClick={onRestoreAcolhidos} title="Restaurar dados de exemplo para demonstrar o sistema">
              🔄 Carregar Exemplo
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={handleOpenAddLeito}>
            <Plus size={16} /> Cadastrar Leito / Quarto
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleOpenAddVisitante}>
            <Plus size={16} /> Autorizar Visitante
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleOpenAddMentor}>
            <Plus size={16} /> Cadastrar Mentor Egresso
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleOpenAddFollowUp}>
            <Plus size={16} /> Cadastrar Follow-Up Pós-Alta
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => { setEditingSubstanciaId(null); setNewSubstanciaForm({ nome: '', categoria: 'Estimulante do SNC', risco: 'Alto' }); setShowSubstanciaModal(true); }}>
            <Plus size={16} /> Cadastrar Substância
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => { setEditingDestinoId(null); setNewDestinoForm({ titulo: '', tipo: 'Reinserção Social', convenio: 'MROSC SADS-BA' }); setShowDestinoModal(true); }}>
            <Plus size={16} /> Cadastrar Destino de Alta
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', padding: '0.85rem 1.25rem' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Pesquisar por bloco, acolhido ou visitante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
          </div>

          {/* Table 1: Alojamentos, Blocos & Leitos */}
          {showTable1 && (
            <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BedDouble size={20} style={{ color: '#dc2626' }} />
                  1.1. Cadastro de Alojamentos, Blocos & Capacidade de Leitos ({filteredBlocos.length})
                </h3>
                <button className="btn btn-primary btn-sm" onClick={handleOpenAddLeito}>
                  <Plus size={16} /> Cadastrar Leito / Quarto
                </button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Bloco / Alojamento</th>
                      <th>Capacidade Total</th>
                      <th>Leitos PCD Acessíveis</th>
                      <th>Ocupação Atual</th>
                      <th>Vagas Disponíveis</th>
                      <th>Status da Capacidade</th>
                      <th style={{ textAlign: 'right' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlocos.map(b => {
                      const cap = b.capacidade || 250;
                      const ocu = b.ocupacao || 0;
                      const vagasLivres = Math.max(0, cap - ocu);
                      return (
                        <tr key={b.id || b.bloco}>
                          <td style={{ fontWeight: 700 }}>{b.bloco}</td>
                          <td>{cap} Leitos</td>
                          <td>{b.pcd || 5} PCD</td>
                          <td><strong>{ocu}</strong> / {cap} Acolhidos</td>
                          <td style={{ color: vagasLivres > 0 ? '#059669' : '#dc2626', fontWeight: 800 }}>
                            {vagasLivres > 0 ? `${vagasLivres} Vagas Livres` : '0 Vagas (Sem leitos)'}
                          </td>
                          <td>
                            <span className={`badge ${vagasLivres > 0 ? 'badge-success' : 'badge-danger'}`}>
                              {vagasLivres === 0 ? 'Lotado (100% Ocupado)' : 'Operacional'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                              <button className="btn btn-secondary btn-sm" onClick={() => handleEditLeito(b)} title="Editar Alojamento">
                                <Edit2 size={13} /> Editar
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteLeito(b.id)} title="Excluir Alojamento">
                                <Trash2 size={13} /> Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Table 2: Visitantes Autorizados & Rede Familiar */}
          {showTable2 && (
            <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={20} style={{ color: '#dc2626' }} />
                  1.2. Cadastro de Visitantes Autorizados & Rede Familiar ({filteredVisitantes.length})
                </h3>
                <button className="btn btn-primary btn-sm" onClick={handleOpenAddVisitante}>
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
                      <th style={{ textAlign: 'right' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisitantes.map(v => (
                      <tr key={v.id}>
                        <td style={{ fontWeight: 700 }}>{v.nome}</td>
                        <td style={{ fontFamily: 'monospace' }}>{v.cpf}</td>
                        <td>{v.parentesco}</td>
                        <td>{v.acolhido}</td>
                        <td>
                          <span className={`badge ${v.modalidade.includes('Presencial') ? 'badge-success' : 'badge-info'}`}>
                            {v.modalidade}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleEditVisitante(v)} title="Editar Visitante">
                              <Edit2 size={13} /> Editar
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteVisitante(v.id)} title="Excluir Visitante">
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

          {/* Table 3: Egressos Mentores & Padrinhos */}
          {showTable3 && (
            <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Heart size={20} style={{ color: '#dc2626' }} />
                  1.3. Cadastro de Egressos Mentores & Padrinhos de Sobriedade ({padrinhosList.length})
                </h3>
                <button className="btn btn-primary btn-sm" onClick={handleOpenAddMentor}>
                  <Plus size={16} /> Cadastrar Mentor Egresso
                </button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nome do Mentor Egresso</th>
                      <th>Tempo de Sobriedade Mantida</th>
                      <th>Profissão / Atuação Atual</th>
                      <th>Mentoria Atribuída</th>
                      <th style={{ textAlign: 'right' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {padrinhosList.map(m => (
                      <tr key={m.id}>
                        <td style={{ fontWeight: 700 }}>{m.nome}</td>
                        <td><span className="badge badge-success">{m.tempoSobriedade}</span></td>
                        <td>{m.profissao}</td>
                        <td>{m.mentorados}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleEditMentor(m)} title="Editar Mentor">
                              <Edit2 size={13} /> Editar
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteMentor(m.id)} title="Excluir Mentor">
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

          {/* Table 4: Follow-Up & Acompanhamento Pós-Alta */}
          {showTable4 && (
            <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={20} style={{ color: '#dc2626' }} />
                  1.4. Cadastro de Registros de Follow-Up Pós-Alta ({followUpList.length})
                </h3>
                <button className="btn btn-primary btn-sm" onClick={handleOpenAddFollowUp}>
                  <Plus size={16} /> Cadastrar Follow-Up Pós-Alta
                </button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Acolhido Em Pós-Alta</th>
                      <th>Data da Alta</th>
                      <th>Situação de Sobriedade & Trabalho</th>
                      <th>Status do Acompanhamento</th>
                      <th style={{ textAlign: 'right' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {followUpList.map(f => (
                      <tr key={f.id}>
                        <td style={{ fontWeight: 700 }}>{f.acolhidoNome}</td>
                        <td>{f.dataAlta}</td>
                        <td style={{ fontSize: '0.85rem' }}>{f.contato30Dias}</td>
                        <td><span className="badge badge-success">{f.status}</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleEditFollowUp(f)} title="Editar Follow-Up">
                              <Edit2 size={13} /> Editar
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteFollowUp(f.id)} title="Excluir Follow-Up">
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

          {/* Table 5: Substâncias Psicoativas / Dependências */}
          {showTable5 && (
            <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={20} style={{ color: '#dc2626' }} />
                  1.5. Catálogo de Substâncias Psicoativas (Alimenta Seletor de Triagem) ({substanciasList.length})
                </h3>
                <button className="btn btn-primary btn-sm" onClick={() => { setEditingSubstanciaId(null); setNewSubstanciaForm({ nome: '', categoria: 'Estimulante do SNC', risco: 'Alto' }); setShowSubstanciaModal(true); }}>
                  <Plus size={16} /> Cadastrar Substância
                </button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Substância / Dependência</th>
                      <th>Categoria Farmacológica</th>
                      <th>Classificação de Risco Clínico</th>
                      <th style={{ textAlign: 'right' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {substanciasList.map(s => (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 700 }}>{s.nome}</td>
                        <td>{s.categoria}</td>
                        <td>
                          <span className={`badge ${s.risco === 'Crítico' ? 'badge-danger' : s.risco === 'Alto' ? 'badge-warning' : 'badge-info'}`}>
                            {s.risco}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => { setEditingSubstanciaId(s.id); setNewSubstanciaForm({ nome: s.nome, categoria: s.categoria, risco: s.risco }); setShowSubstanciaModal(true); }}>
                              <Edit2 size={13} /> Editar
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => setSubstanciasList(substanciasList.filter(item => item.id !== s.id))}>
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

          {/* Table 6: Destinos & Encaminhamentos Pós-Alta */}
          {showTable6 && (
            <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LayoutDashboard size={20} style={{ color: '#dc2626' }} />
                  1.6. Catálogo de Destinos & Encaminhamentos Pós-Alta (Alimenta Seletor de Altas) ({destinosList.length})
                </h3>
                <button className="btn btn-primary btn-sm" onClick={() => { setEditingDestinoId(null); setNewDestinoForm({ titulo: '', tipo: 'Reinserção Social', convenio: 'MROSC SADS-BA' }); setShowDestinoModal(true); }}>
                  <Plus size={16} /> Cadastrar Destino de Alta
                </button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Descrição do Destino / Encaminhamento</th>
                      <th>Tipo de Reinserção</th>
                      <th>Convênio / Parceria Institucional</th>
                      <th style={{ textAlign: 'right' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {destinosList.map(d => (
                      <tr key={d.id}>
                        <td style={{ fontWeight: 700 }}>{d.titulo}</td>
                        <td><span className="badge badge-success">{d.tipo}</span></td>
                        <td>{d.convenio}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => { setEditingDestinoId(d.id); setNewDestinoForm({ titulo: d.titulo, tipo: d.tipo, convenio: d.convenio }); setShowDestinoModal(true); }}>
                              <Edit2 size={13} /> Editar
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => setDestinosList(destinosList.filter(item => item.id !== d.id))}>
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

      {/* MODALS */}
      {showLeitoModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <BedDouble size={20} style={{ color: '#dc2626' }} />
                {editingLeitoId ? 'Editar Alojamento / Leito' : 'Novo Cadastro de Alojamento / Leito'}
              </h3>
              <button className="btn-close" onClick={() => setShowLeitoModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveLeito}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Nome do Bloco / Alojamento *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Bloco E - Vitória, Alojamento 4 ou Enfermaria Central"
                    value={newLeito.bloco}
                    onChange={(e) => setNewLeito({ ...newLeito, bloco: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Capacidade Total de Leitos *</label>
                    <input 
                      type="number"
                      className="form-input"
                      value={newLeito.capacidade}
                      onChange={(e) => setNewLeito({ ...newLeito, capacidade: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Leitos PCD Acessíveis *</label>
                    <input 
                      type="number"
                      className="form-input"
                      value={newLeito.pcd}
                      onChange={(e) => setNewLeito({ ...newLeito, pcd: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Ocupação Atual (Preenchimento Automático via Triagem)
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    {newLeito.ocupacao || 0} Acolhidos Alocados
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#0284c7', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ℹ️ A ocupação é calculada automaticamente a partir dos cadastros e admissões do Módulo de Triagem.
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowLeitoModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingLeitoId ? 'Salvar Alterações' : 'Salvar Novo Leito'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVisitanteModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Users size={20} style={{ color: '#dc2626' }} />
                {editingVisitanteId ? 'Editar Visitante Autorizado' : 'Autorizar Novo Visitante & Rede Familiar'}
              </h3>
              <button className="btn-close" onClick={() => setShowVisitanteModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveVisitante}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Nome Completo do Visitante *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Maria das Graças Silva"
                    value={newVisitante.nome}
                    onChange={(e) => setNewVisitante({ ...newVisitante, nome: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">CPF do Visitante *</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="000.000.000-00"
                      value={newVisitante.cpf}
                      onChange={(e) => setNewVisitante({ ...newVisitante, cpf: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Grau de Parentesco *</label>
                    <select 
                      className="form-select"
                      value={newVisitante.parentesco}
                      onChange={(e) => setNewVisitante({ ...newVisitante, parentesco: e.target.value })}
                      required
                    >
                      <option value="Mãe">Mãe</option>
                      <option value="Pai">Pai</option>
                      <option value="Cônjuge">Cônjuge / Esposa(o)</option>
                      <option value="Irmão(ã)">Irmão / Irmã</option>
                      <option value="Filho(a)">Filho / Filha</option>
                      <option value="Avô(ã)">Avô / Avó</option>
                      <option value="Tio(a)">Tio / Tia</option>
                      <option value="Sogro(a)">Sogro / Sogra</option>
                      <option value="Curador Legal">Curador Legal / Tutor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Acolhido Vinculado (Alimentado da Triagem) *</label>
                  <select 
                    className="form-select"
                    value={newVisitante.acolhido}
                    onChange={(e) => setNewVisitante({ ...newVisitante, acolhido: e.target.value })}
                    required
                  >
                    {acolhidos && acolhidos.length > 0 ? (
                      acolhidos.map(a => {
                        const labelText = `${a.nome} (${a.alojamento || a.quarto || 'Bloco A - Restauração'})`;
                        return (
                          <option key={a.id || a.cpf || a.nome} value={labelText}>
                            {labelText}
                          </option>
                        );
                      })
                    ) : (
                      <>
                        <option value="Lucas Silva Santos (Leito A-12 - Bloco A - Restauração)">
                          Lucas Silva Santos (Leito A-12 - Bloco A - Restauração)
                        </option>
                        <option value="Mateus Santos Oliveira (Leito B-05 - Bloco B - Renovação)">
                          Mateus Santos Oliveira (Leito B-05 - Bloco B - Renovação)
                        </option>
                        <option value="Roberto Ferreira (Leito C-01 - Bloco C - Esperança)">
                          Roberto Ferreira (Leito C-01 - Bloco C - Esperança)
                        </option>
                        <option value="Gerson Silva de Jesus (Leito D-08 - Bloco D - Graça)">
                          Gerson Silva de Jesus (Leito D-08 - Bloco D - Graça)
                        </option>
                      </>
                    )}
                  </select>
                  <div style={{ fontSize: '0.75rem', color: '#0284c7', marginTop: '4px' }}>
                    ℹ️ Selecione na lista oficial o acolhido já triado e admitido no sistema.
                  </div>
                </div>

                <div>
                  <label className="form-label">Modalidade Autorizada *</label>
                  <select 
                    className="form-select"
                    value={newVisitante.modalidade}
                    onChange={(e) => setNewVisitante({ ...newVisitante, modalidade: e.target.value })}
                    required
                  >
                    <option value="Visita Presencial Domingo">Visita Presencial Domingo</option>
                    <option value="Videochamada Assistida">Videochamada Assistida</option>
                    <option value="Passe Terapêutico Fim de Semana">Passe Terapêutico Fim de Semana</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowVisitanteModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingVisitanteId ? 'Salvar Alterações' : 'Salvar Autorização'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cadastro / Edição de Mentor Egresso */}
      {showMentorCadModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Heart style={{ color: '#dc2626' }} size={20} />
                {editingMentorId ? 'Editar Mentor Egresso' : 'Cadastrar Novo Mentor Egresso'}
              </h3>
              <button className="btn-close" onClick={() => setShowMentorCadModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveMentor}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Nome Completo do Egresso Mentor *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Carlos Eduardo Souza"
                    value={newMentorForm.nome}
                    onChange={(e) => setNewMentorForm({ ...newMentorForm, nome: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Tempo de Sobriedade *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: 2 anos e 4 meses"
                    value={newMentorForm.tempoSobriedade}
                    onChange={(e) => setNewMentorForm({ ...newMentorForm, tempoSobriedade: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Profissão / Ocupação Atual</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Eletricista de Manutenção"
                    value={newMentorForm.profissao}
                    onChange={(e) => setNewMentorForm({ ...newMentorForm, profissao: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowMentorCadModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMentorId ? 'Salvar Alterações' : 'Cadastrar Mentor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cadastro / Edição de Follow-Up Pós-Alta */}
      {showFollowUpCadModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <CheckCircle2 style={{ color: '#dc2626' }} size={20} />
                {editingFollowUpId ? 'Editar Follow-Up Pós-Alta' : 'Registrar Novo Follow-Up Pós-Alta'}
              </h3>
              <button className="btn-close" onClick={() => setShowFollowUpCadModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveFollowUp}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Nome do Acolhido Em Pós-Alta (Concluintes com Alta Terapêutica) *</label>
                  <select 
                    className="form-select"
                    value={newFollowUpForm.acolhidoNome}
                    onChange={(e) => setNewFollowUpForm({ ...newFollowUpForm, acolhidoNome: e.target.value })}
                    required
                  >
                    {acolhidos && acolhidos.filter(a => a.status === 'Alta Terapêutica' || a.status === 'Concluinte').length > 0 ? (
                      acolhidos.filter(a => a.status === 'Alta Terapêutica' || a.status === 'Concluinte').map(a => (
                        <option key={a.id || a.cpf || a.nome} value={a.nome}>
                          {a.nome} (Alta Terapêutica — {a.destino || 'Reinserção Social'})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Gerson Silva de Jesus">Gerson Silva de Jesus (Alta Terapêutica — Retorno Familiar)</option>
                        <option value="Marcos Paulo Oliveira">Marcos Paulo Oliveira (Alta Terapêutica — Vaga SineBahia)</option>
                        <option value="Antônio Carlos Souza">Antônio Carlos Souza (Alta Terapêutica — Mentoria FDJ)</option>
                        <option value="Valdir dos Santos">Valdir dos Santos (Alta Terapêutica — CAPS AD III)</option>
                      </>
                    )}
                  </select>
                  <div style={{ fontSize: '0.75rem', color: '#0284c7', marginTop: '4px' }}>
                    ℹ️ Exibe apenas acolhidos que já concluíram o programa e atingiram o estágio de Alta Terapêutica.
                  </div>
                </div>

                <div>
                  <label className="form-label">Acompanhamento / Observações *</label>
                  <textarea 
                    className="form-textarea"
                    rows={3}
                    placeholder="Descreva a situação de sobriedade, emprego e reinserção..."
                    value={newFollowUpForm.contato}
                    onChange={(e) => setNewFollowUpForm({ ...newFollowUpForm, contato: e.target.value })}
                    required
                    style={{ width: '100%', minHeight: '80px', padding: '0.75rem', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label className="form-label">Status do Acompanhamento *</label>
                  <select 
                    className="form-select"
                    value={newFollowUpForm.status}
                    onChange={(e) => setNewFollowUpForm({ ...newFollowUpForm, status: e.target.value })}
                  >
                    <option value="🟢 Sobriedade & Reinserção Confirmadas">🟢 Sobriedade & Reinserção Confirmadas</option>
                    <option value="🟡 Em Acompanhamento Intensivo">🟡 Em Acompanhamento Intensivo</option>
                    <option value="🔴 Necessita Suporte / Visita Técnica">🔴 Necessita Suporte / Visita Técnica</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowFollowUpCadModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingFollowUpId ? 'Salvar Alterações' : 'Registrar Follow-Up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cadastro / Edição de Origem */}
      {showOrigemModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <TrendingUp style={{ color: '#dc2626' }} size={20} />
                {editingOrigemId ? 'Editar Município / Origem' : 'Cadastrar Novo Município / Origem'}
              </h3>
              <button className="btn-close" onClick={() => setShowOrigemModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newOrigemForm.nome) return;
              if (editingOrigemId) {
                setOrigensList(origensList.map(o => o.id === editingOrigemId ? { ...o, ...newOrigemForm } : o));
              } else {
                setOrigensList([...origensList, { id: Date.now(), ...newOrigemForm }]);
              }
              setShowOrigemModal(false);
            }}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Nome do Município / Região de Origem *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Salvador (Subúrbio), Feira de Santana, etc."
                    value={newOrigemForm.nome}
                    onChange={(e) => setNewOrigemForm({ ...newOrigemForm, nome: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label">Estado (UF)</label>
                    <input 
                      type="text"
                      className="form-input"
                      value={newOrigemForm.estado}
                      onChange={(e) => setNewOrigemForm({ ...newOrigemForm, estado: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Prioridade de Atendimento</label>
                    <select 
                      className="form-select"
                      value={newOrigemForm.prioridade}
                      onChange={(e) => setNewOrigemForm({ ...newOrigemForm, prioridade: e.target.value })}
                    >
                      <option value="Urgente">Urgente</option>
                      <option value="Alta">Alta</option>
                      <option value="Média">Média</option>
                      <option value="Normal">Normal</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowOrigemModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingOrigemId ? 'Salvar Alterações' : 'Salvar Origem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cadastro / Edição de Substância */}
      {showSubstanciaModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <ShieldCheck style={{ color: '#dc2626' }} size={20} />
                {editingSubstanciaId ? 'Editar Substância Psicoativa' : 'Cadastrar Nova Substância Psicoativa'}
              </h3>
              <button className="btn-close" onClick={() => setShowSubstanciaModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newSubstanciaForm.nome) return;
              if (editingSubstanciaId) {
                setSubstanciasList(substanciasList.map(s => s.id === editingSubstanciaId ? { ...s, ...newSubstanciaForm } : s));
              } else {
                setSubstanciasList([...substanciasList, { id: Date.now(), ...newSubstanciaForm }]);
              }
              setShowSubstanciaModal(false);
            }}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Nome da Substância / Dependência *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Crack / Álcool, Polidrogadição, etc."
                    value={newSubstanciaForm.nome}
                    onChange={(e) => setNewSubstanciaForm({ ...newSubstanciaForm, nome: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label">Categoria Farmacológica</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Ex: Estimulante, Depressor"
                      value={newSubstanciaForm.categoria}
                      onChange={(e) => setNewSubstanciaForm({ ...newSubstanciaForm, categoria: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Risco Clínico</label>
                    <select 
                      className="form-select"
                      value={newSubstanciaForm.risco}
                      onChange={(e) => setNewSubstanciaForm({ ...newSubstanciaForm, risco: e.target.value })}
                    >
                      <option value="Crítico">Crítico</option>
                      <option value="Alto">Alto</option>
                      <option value="Médio">Médio</option>
                      <option value="Baixo">Baixo</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSubstanciaModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSubstanciaId ? 'Salvar Alterações' : 'Salvar Substância'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cadastro / Edição de Destino de Alta */}
      {showDestinoModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <LayoutDashboard style={{ color: '#dc2626' }} size={20} />
                {editingDestinoId ? 'Editar Destino de Encaminhamento' : 'Cadastrar Novo Destino de Alta'}
              </h3>
              <button className="btn-close" onClick={() => setShowDestinoModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newDestinoForm.titulo) return;
              if (editingDestinoId) {
                setDestinosList(destinosList.map(d => d.id === editingDestinoId ? { ...d, ...newDestinoForm } : d));
              } else {
                setDestinosList([...destinosList, { id: Date.now(), ...newDestinoForm }]);
              }
              setShowDestinoModal(false);
            }}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Descrição do Destino / Encaminhamento *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Inserção Profissional (Vaga SineBahia / SENAI)"
                    value={newDestinoForm.titulo}
                    onChange={(e) => setNewDestinoForm({ ...newDestinoForm, titulo: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="form-label">Tipo de Reinserção</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Ex: Empregabilidade, Familiar"
                      value={newDestinoForm.tipo}
                      onChange={(e) => setNewDestinoForm({ ...newDestinoForm, tipo: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Convênio / Parceria</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Ex: MROSC, SETRE, SADS-BA"
                      value={newDestinoForm.convenio}
                      onChange={(e) => setNewDestinoForm({ ...newDestinoForm, convenio: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowDestinoModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDestinoId ? 'Salvar Alterações' : 'Salvar Destino'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
