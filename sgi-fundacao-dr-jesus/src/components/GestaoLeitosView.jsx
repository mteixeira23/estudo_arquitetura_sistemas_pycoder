import React, { useState, useEffect } from 'react';
import {
  MapPin, 
  BedDouble, 
  CheckSquare, 
  Building2, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  ArrowRightLeft,
  Printer,
  X,
  ShieldCheck,
  Search,
  UserCheck,
  Building,
  FileText,
  Accessibility,
  HeartPulse,
  AlertTriangle,
  Siren,
  User
} from 'lucide-react';

// Lista de Responsáveis e Coordenadores Cadastrados para Autorização de Remanejamento
const equipeCadastradaAutorizacao = [
  'Monitor Jorge Lima (Bloco A - Restauração)',
  'Monitor Pastor Cláudio (Bloco B - Renovação)',
  'Monitor Valdir Bahia (Bloco C - Esperança)',
  'Monitor Irmão Reinaldo (Bloco D - Graça)',
  'Enfermeira Chefe Juliana (Apoio Saúde & Enfermaria)',
  'Assistente Social Valéria (Triagem & Admissão)',
  'Pastor Coordenador Geral'
];

export default function GestaoLeitosView({ blocos, acolhidos, presencas, activeSubTab, setActiveSubTab }) {
  const [selectedBloco, setSelectedBloco] = useState('BL-A');
  // Synchronize selectedBloco based on Sidebar activeSubTab
  useEffect(() => {
    if (activeSubTab === 'blocoA') setSelectedBloco('BL-A');
    else if (activeSubTab === 'blocoB') setSelectedBloco('BL-B');
    else if (activeSubTab === 'blocoC') setSelectedBloco('BL-C');
    else if (activeSubTab === 'blocoD') setSelectedBloco('BL-D');
    else if (activeSubTab === 'enfermaria') setSelectedBloco('BL-ENF');
    else if (activeSubTab === 'blocos') setSelectedBloco('BL-A');
    else if (activeSubTab === 'pernoite') {
      const pernoiteElem = document.getElementById('secao-pernoite');
      if (pernoiteElem) pernoiteElem.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSubTab]);

  const handleSelectBlocoCard = (blocoId) => {
    setSelectedBloco(blocoId);
    if (setActiveSubTab) {
      if (blocoId === 'BL-A') setActiveSubTab('blocoA');
      else if (blocoId === 'BL-B') setActiveSubTab('blocoB');
      else if (blocoId === 'BL-C') setActiveSubTab('blocoC');
      else if (blocoId === 'BL-D') setActiveSubTab('blocoD');
      else if (blocoId === 'BL-ENF') setActiveSubTab('enfermaria');
    }
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAcessivelOnly, setFilterAcessivelOnly] = useState(false);
  const [selectedBedInfo, setSelectedBedInfo] = useState(null);
  const [searchTermLista, setSearchTermLista] = useState('');
  const [filterBlocoLista, setFilterBlocoLista] = useState('TODOS');
  
  // Extended Blocks list including Support Infirmary
  const todosBlocos = [
    ...blocos,
    {
      id: "BL-ENF",
      nome: "Bloco de Apoio Saúde & Enfermaria",
      capacidade: 50,
      dormitorios: 5,
      coordenador: "Enfermeira Chefe Juliana",
      cor: "#ef4444",
      isEnfermaria: true
    }
  ];

  // Chamada State por Data
  const [dataChamada, setDataChamada] = useState(() => new Date().toISOString().split('T')[0]);
  const [chamadaFeita, setChamadaFeita] = useState({});
  const [ausenciaSemJustificativa, setAusenciaSemJustificativa] = useState([
    { id: 'AUS-01', nome: 'Luan Barbosa dos Santos', leito: 'Leito C-302', turno: 'Pernoite (21:30)', status: 'Alerta de Checagem em Pátio' }
  ]);

  const handleTogglePresenca = (acolhidoId, isPresente) => {
    const key = `${dataChamada}_${acolhidoId}`;
    setChamadaFeita(prev => ({
      ...prev,
      [key]: isPresente ? 'presente' : 'ausente'
    }));
  };

  const getStatusPresenca = (acolhidoId) => {
    const key = `${dataChamada}_${acolhidoId}`;
    if (chamadaFeita[key]) return chamadaFeita[key];

    // Default to 'ausente' if there is an unexcused absence alert for this acolhido
    const acolhido = acolhidos.find(a => a.id === acolhidoId);
    if (acolhido && ausenciaSemJustificativa.some(a => a.nome === acolhido.nome || a.id.includes(acolhido.id))) {
      return 'ausente';
    }

    return 'presente';
  };

  // Modal State for Bed Transfer
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferData, setTransferData] = useState({
    acolhidoId: acolhidos[0]?.id || '',
    blocoOrigem: 'Bloco A - Restauração',
    leitoOrigem: 'Leito A-104',
    blocoDestino: 'Bloco B - Renovação',
    leitoDestino: 'Leito B-202',
    motivo: 'Reorganização de Turma de Laborterapia',
    autorizadoPor: equipeCadastradaAutorizacao[0]
  });

  // Modal State for Printable Block Night Roster
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  // List of Bed Movements History
  const [historicoMovimentacoes, setHistoricoMovimentacoes] = useState([]);

  const currentBlocoObj = todosBlocos.find(b => b.id === selectedBloco) || todosBlocos[0];
  const blocoNomeSimplificado = currentBlocoObj.nome.split(' - ')[0];

  // Exact real registered acolhidos for this block from Module 1
  const acolhidosReaisNoBloco = acolhidos.filter(a => 
    (a.alojamento.includes(blocoNomeSimplificado) || (currentBlocoObj.isEnfermaria && a.status === 'Em Triagem')) &&
    a.status !== 'Alta Terapêutica'
  );

  // Determine starting bed number for each block
  let bedStart = 101;
  let bedPrefix = 'A';
  if (selectedBloco === 'BL-B') { bedStart = 201; bedPrefix = 'B'; }
  else if (selectedBloco === 'BL-C') { bedStart = 301; bedPrefix = 'C'; }
  else if (selectedBloco === 'BL-D') { bedStart = 401; bedPrefix = 'D'; }
  else if (selectedBloco === 'BL-ENF') { bedStart = 501; bedPrefix = 'ENF'; }

  // Helper function to calculate free available beds in any chosen destination block
  const getLeitosLivresPorBloco = (nomeBloco) => {
    let prefix = 'A';
    let start = 101;
    if (nomeBloco.includes('Bloco B')) { prefix = 'B'; start = 201; }
    else if (nomeBloco.includes('Bloco C')) { prefix = 'C'; start = 301; }
    else if (nomeBloco.includes('Bloco D')) { prefix = 'D'; start = 401; }
    else if (nomeBloco.includes('Saúde') || nomeBloco.includes('Enfermaria')) { prefix = 'ENF'; start = 501; }

    const livres = [];
    for (let i = 0; i < 300; i++) {
      const bedCode = `Leito ${prefix}-${start + i}`;
      const isOccupied = acolhidos.some(a => a.leito === bedCode && a.status !== 'Alta Terapêutica');
      if (!isOccupied) {
        livres.push(bedCode);
      }
    }
    return livres;
  };

  const leitosLivresDestino = getLeitosLivresPorBloco(transferData.blocoDestino);

  const handleConfirmTransfer = (e) => {
    e.preventDefault();
    const acolhido = acolhidos.find(a => a.id === transferData.acolhidoId);

    const newMov = {
      id: `MOV-${Math.floor(103 + Math.random() * 100)}`,
      data: new Date().toLocaleString('pt-BR'),
      acolhidoNome: acolhido ? acolhido.nome : 'Acolhido',
      origem: `${transferData.blocoOrigem} (${transferData.leitoOrigem})`,
      destino: `${transferData.blocoDestino} (${transferData.leitoDestino})`,
      motivo: transferData.motivo,
      autorizadoPor: transferData.autorizadoPor
    };

    // Update resident's bed in state
    if (acolhido) {
      acolhido.alojamento = transferData.blocoDestino;
      acolhido.leito = transferData.leitoDestino;
    }

    setHistoricoMovimentacoes([newMov, ...historicoMovimentacoes]);
    setShowTransferModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Module Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">Módulo 2</span>
            <span className="badge badge-success">Seleção de Leitos por Lista Dropdown</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>
            Gestão de Alojamentos, Enfermaria & Alertas de Presença
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Transferências de leitos com seleção automatizada da lista de leitos LIVRES disponíveis no bloco escolhido.
          </p>
        </div>
      </div>



      {/* NOVO: VISTA DEDICADA DE CHAMADA & PERNOITE */}
      {/* NOVO: TELA DEDICADA - LISTA DE ACOLHIDOS POR BLOCO COM BUSCA E FILTROS */}
      {activeSubTab === 'listaAcolhidos' ? (
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-primary">Módulo 2: Alojamentos</span>
                <span className="badge badge-success">Consulta Rápida de Leitos</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: 0, fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={24} style={{ color: 'var(--primary)' }} /> Lista & Localização de Acolhidos por Bloco
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Busca unificada de todos os acolhidos residentes registrados nos 4 blocos e apoio saúde.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}>
                {acolhidos.filter(a => a.status !== 'Alta Terapêutica').length} Acolhidos Ativos
              </span>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                className="input-field"
                placeholder="🔍 Buscar por nome, CPF, leito (ex: D-415) ou município de origem..."
                value={searchTermLista}
                onChange={(e) => setSearchTermLista(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>

            <div style={{ minWidth: '200px' }}>
              <select 
                className="input-field"
                value={filterBlocoLista}
                onChange={(e) => setFilterBlocoLista(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="TODOS">Todos os Blocos & Enfermaria</option>
                <option value="Bloco A">Bloco A - Restauração</option>
                <option value="Bloco B">Bloco B - Renovação</option>
                <option value="Bloco C">Bloco C - Esperança</option>
                <option value="Bloco D">Bloco D - Graça</option>
                <option value="Saúde">Apoio Saúde & Enfermaria</option>
              </select>
            </div>
          </div>

          {/* Table of Residents */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Acolhido</th>
                  <th>Alojamento & Leito</th>
                  <th>Origem / Documento</th>
                  <th>Convênio MROSC</th>
                  <th>Laborterapia Sector</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {acolhidos
                  .filter(a => a.status !== 'Alta Terapêutica')
                  .filter(a => {
                    const matchesSearch = 
                      a.nome.toLowerCase().includes(searchTermLista.toLowerCase()) ||
                      a.cpf.includes(searchTermLista) ||
                      a.leito.toLowerCase().includes(searchTermLista.toLowerCase()) ||
                      a.municipioOrigem.toLowerCase().includes(searchTermLista.toLowerCase());

                    const matchesBloco = 
                      filterBlocoLista === 'TODOS' ||
                      (filterBlocoLista === 'Saúde' ? (a.alojamento.includes('Saúde') || a.alojamento.includes('Enfermaria') || a.status === 'Em Triagem') : a.alojamento.includes(filterBlocoLista));

                    return matchesSearch && matchesBloco;
                  })
                  .map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img 
                            src={item.foto} 
                            alt={item.nome} 
                            style={{ 
                              width: '46px', 
                              height: '46px', 
                              borderRadius: '50%', 
                              objectFit: 'cover', 
                              border: '2px solid var(--primary)' 
                            }} 
                          />
                          <div>
                            <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>{item.nome}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.id} • {item.idade} anos</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>{item.alojamento}</div>
                        <span className="badge badge-primary" style={{ fontSize: '0.7rem', marginTop: '2px' }}>{item.leito}</span>
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>
                        <div><strong>CPF:</strong> {item.cpf}</div>
                        <div style={{ color: 'var(--text-muted)' }}>{item.municipioOrigem}</div>
                      </td>
                      <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                        {item.termoMROSC}
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>
                        {item.laborterapiaSector}
                      </td>
                      <td>
                        <span className={`badge ${item.status === 'Ativo' ? 'badge-success' : 'badge-warning'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.725rem', padding: '0.3rem 0.6rem' }}
                          onClick={() => {
                            // Find matching block
                            let bId = 'BL-A';
                            if (item.alojamento.includes('Bloco B')) bId = 'BL-B';
                            else if (item.alojamento.includes('Bloco C')) bId = 'BL-C';
                            else if (item.alojamento.includes('Bloco D')) bId = 'BL-D';
                            else if (item.alojamento.includes('Saúde') || item.alojamento.includes('Enfermaria')) bId = 'BL-ENF';
                            
                            setSelectedBloco(bId);
                            if (setActiveSubTab) setActiveSubTab(bId === 'BL-A' ? 'blocoA' : bId === 'BL-B' ? 'blocoB' : bId === 'BL-C' ? 'blocoC' : bId === 'BL-D' ? 'blocoD' : 'enfermaria');
                          }}
                        >
                          <MapPin size={14} /> Ver no Mapa
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeSubTab === 'transferencia' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Card 1: Formulário Integrado de Transferência de Leito */}
          <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="badge badge-primary">Remanejamento Institucional</span>
                  <span className="badge badge-success">Módulo 2: Alojamentos & Leitos</span>
                </div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: 0, fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ArrowRightLeft size={24} style={{ color: '#2563eb' }} /> Transferência & Remanejamento de Acolhidos
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                  Selecione o acolhido residente e aloque-o em um leito vago no bloco de destino com registro de justificativa.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                  <Printer size={16} /> Imprimir Formulário
                </button>
              </div>
            </div>

            <form onSubmit={handleConfirmTransfer}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                {/* Acolhido Seleção */}
                <div style={{ gridColumn: 'span 1' }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>1. Selecionar Acolhido Residente *</label>
                  <select 
                    className="form-input" 
                    style={{ width: '100%', fontSize: '0.85rem' }}
                    value={transferData.acolhidoId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedObj = acolhidos.find(a => a.id === selectedId);
                      if (selectedObj) {
                        setTransferData({
                          ...transferData,
                          acolhidoId: selectedId,
                          blocoOrigem: selectedObj.alojamento,
                          leitoOrigem: selectedObj.leito
                        });
                      }
                    }}
                    required
                  >
                    <option value="">-- Selecione um Acolhido --</option>
                    {acolhidos
                      .filter(a => a.status !== 'Alta Terapêutica')
                      .map(a => (
                        <option key={a.id} value={a.id}>
                          {a.nome} ({a.id}) — {a.alojamento} ({a.leito})
                        </option>
                      ))
                    }
                  </select>
                </div>

                {/* Bloco de Destino */}
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>2. Bloco de Destino *</label>
                  <select 
                    className="form-input" 
                    value={transferData.blocoDestino}
                    onChange={(e) => {
                      const novoBloco = e.target.value;
                      const novosLivres = getLeitosLivresPorBloco(novoBloco);
                      setTransferData({
                        ...transferData,
                        blocoDestino: novoBloco,
                        leitoDestino: novosLivres[0] || ''
                      });
                    }}
                    required
                  >
                    <option value="Bloco A - Restauração">Bloco A - Restauração</option>
                    <option value="Bloco B - Renovação">Bloco B - Renovação</option>
                    <option value="Bloco C - Esperança">Bloco C - Esperança</option>
                    <option value="Bloco D - Graça">Bloco D - Graça</option>
                    <option value="Bloco de Apoio Saúde & Enfermaria">Apoio Saúde & Enfermaria</option>
                  </select>
                </div>

                {/* Leito Livre Destino */}
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>3. Leito Disponível no Destino *</label>
                  <select 
                    className="form-input" 
                    value={transferData.leitoDestino}
                    onChange={(e) => setTransferData({ ...transferData, leitoDestino: e.target.value })}
                    required
                  >
                    {leitosLivresDestino.length > 0 ? (
                      leitosLivresDestino.map(l => (
                        <option key={l} value={l}>🟢 {l} (LIVRE)</option>
                      ))
                    ) : (
                      <option value="">🔴 Nenhum leito livre neste bloco</option>
                    )}
                  </select>
                </div>

                {/* Motivo */}
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>4. Motivo / Justificativa *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Reorganização de dormitório, apoio de enfermagem, laborterapia..."
                    value={transferData.motivo}
                    onChange={(e) => setTransferData({ ...transferData, motivo: e.target.value })}
                    required
                  />
                </div>

                {/* Autorizado Por - DROPDOWN COM EQUIPE CADASTADA */}
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>5. Autorizado Por (Equipe Cadastrada) *</label>
                  <select 
                    className="form-input" 
                    value={transferData.autorizadoPor}
                    onChange={(e) => setTransferData({ ...transferData, autorizadoPor: e.target.value })}
                    required
                  >
                    <option value="">-- Selecione o Autorizador Cadastrado --</option>
                    {equipeCadastradaAutorizacao.map(membro => (
                      <option key={membro} value={membro}>
                        {membro}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontWeight: 800 }}>
                  <CheckCircle2 size={18} /> Confirmar & Executar Transferência
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Lista de Auditoria de Remanejamento embutida abaixo */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="badge badge-primary">Auditoria de Leitos</span>
                  <span className="badge badge-success">Rastreabilidade Completa</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={22} style={{ color: 'var(--primary)' }} /> Lista de Auditoria de Remanejamentos
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                  Histórico cronológico de todas as movimentações e trocas de leito efetuadas no sistema.
                </p>
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => setShowAuditModal(true)}>
                <Printer size={14} /> Imprimir Auditoria / PDF
              </button>
            </div>

            {historicoMovimentacoes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                <FileText size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', opacity: 0.6 }} />
                <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: '0 0 0.25rem 0', fontWeight: 800 }}>Nenhum remanejamento registrado até o momento</h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                  As transferências de leito realizadas no formulário acima serão registradas e arquivadas automaticamente nesta lista de auditoria.
                </p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table" style={{ fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      <th>Código / Data & Hora</th>
                      <th>Acolhido Residente</th>
                      <th>Leito de Origem</th>
                      <th>Leito de Destino</th>
                      <th>Motivo do Remanejamento</th>
                      <th>Autorizado Por</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicoMovimentacoes.map((mov) => (
                      <tr key={mov.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{mov.id}</div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{mov.data}</div>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{mov.acolhidoNome}</td>
                        <td><span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>{mov.origem}</span></td>
                        <td><span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>{mov.destino}</span></td>
                        <td style={{ fontSize: '0.8rem' }}>{mov.motivo}</td>
                        <td style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8rem' }}>{mov.autorizadoPor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : activeSubTab === 'pernoite' ? (
        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-primary">Turno Ativo: Pernoite (21:30h)</span>
                <span className="badge badge-success">Controle de Frequência Noturna</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: 0, fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={24} style={{ color: '#0284c7' }} /> Chamada Noturna & Pernoite de Acolhidos
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Controle de presença obrigatória nos dormitórios às 21:30h com registro de faltas e alertas de pátio.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <label style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  📅 Data da Chamada:
                </label>
                <input 
                  type="date" 
                  value={dataChamada}
                  onChange={(e) => setDataChamada(e.target.value)}
                  className="form-input"
                  style={{ padding: '0.2rem 0.5rem', height: '34px', fontSize: '0.85rem', fontWeight: 800, background: '#ffffff', border: '1px solid #94a3b8', borderRadius: '6px', cursor: 'pointer' }}
                />
              </div>

              <button className="btn btn-primary" onClick={() => setShowPrintModal(true)}>
                <Printer size={16} /> Imprimir Relação do Turno
              </button>
            </div>
          </div>

          {/* Chamada Status Counters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <Users size={24} style={{ color: '#0284c7', marginBottom: '0.25rem' }} />
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>{acolhidos.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Acolhidos no Pernoite</div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <CheckCircle2 size={24} style={{ color: '#10b981', marginBottom: '0.25rem' }} />
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981' }}>{acolhidos.filter(a => getStatusPresenca(a.id) === 'presente').length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Presenças Confirmadas ({dataChamada.split('-').reverse().join('/')})</div>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <AlertCircle size={24} style={{ color: '#ef4444', marginBottom: '0.25rem' }} />
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ef4444' }}>{acolhidos.filter(a => getStatusPresenca(a.id) === 'ausente').length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ausências Registradas ({dataChamada.split('-').reverse().join('/')})</div>
            </div>
          </div>

          {/* Interactive Chamada Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Acolhido</th>
                  <th>Alojamento / Leito</th>
                  <th>Responsável pelo Bloco</th>
                  <th>Status do Pernoite (21:30h)</th>
                  <th>Ações de Frequência</th>
                </tr>
              </thead>
              <tbody>
                {acolhidos.map((item) => {
                  const statusAtual = getStatusPresenca(item.id);
                  const isAusente = statusAtual === 'ausente';
                  return (
                    <tr key={item.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img 
                            src={item.foto} 
                            alt={item.nome} 
                            style={{ 
                              width: '42px', 
                              height: '42px', 
                              borderRadius: '50%', 
                              objectFit: 'cover', 
                              border: '2px solid var(--primary)' 
                            }} 
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.nome}</div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{item.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{item.alojamento}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.leito}</div>
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>Monitor Supervisor do Bloco</td>
                      <td>
                        {isAusente ? (
                          <span className="badge badge-danger">🔴 Ausência Registrada em {dataChamada.split('-').reverse().join('/')}</span>
                        ) : (
                          <span className="badge badge-success">🟢 Presente no Leito ({dataChamada.split('-').reverse().join('/')})</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button 
                            className={`btn btn-sm ${!isAusente ? 'btn-success' : 'btn-secondary'}`}
                            style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem', fontWeight: 800 }}
                            onClick={() => handleTogglePresenca(item.id, true)}
                          >
                            <CheckCircle2 size={12} /> Presente
                          </button>
                          <button 
                            className={`btn btn-sm ${isAusente ? 'btn-danger' : 'btn-secondary'}`}
                            style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem', fontWeight: 800 }}
                            onClick={() => handleTogglePresenca(item.id, false)}
                          >
                            <AlertCircle size={12} /> Ausente
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
      ) : (
        <>
          {/* Block Selection Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {todosBlocos.map((bloco) => {
          const isSelected = selectedBloco === bloco.id;
          const blocoNomeSimpl = bloco.nome.split(' - ')[0];

          // Count REAL active residents assigned to this block
          const countRealOcupados = acolhidos.filter(a => 
            (a.alojamento.includes(blocoNomeSimpl) || (bloco.isEnfermaria && a.status === 'Em Triagem')) &&
            a.status !== 'Alta Terapêutica'
          ).length;

          const pctFloat = ((countRealOcupados / bloco.capacidade) * 100).toFixed(1);

          return (
            <div 
              key={bloco.id}
              onClick={() => handleSelectBlocoCard(bloco.id)}
              className="card"
              style={{
                cursor: 'pointer',
                border: isSelected ? `2px solid ${bloco.cor}` : '1px solid var(--border-color)',
                background: isSelected ? 'rgba(20, 184, 166, 0.08)' : bloco.isEnfermaria ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-card)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                {bloco.isEnfermaria ? <HeartPulse size={20} style={{ color: bloco.cor }} /> : <Building2 size={20} style={{ color: bloco.cor }} />}
                <span className={`badge ${bloco.isEnfermaria ? 'badge-danger' : 'badge-primary'}`} style={{ fontSize: '0.7rem', fontWeight: 800 }}>
                  {bloco.capacidade} Leitos
                </span>
              </div>
              <h3 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.25rem', lineHeight: 1.2 }}>
                {bloco.nome}
              </h3>
              <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Resp: {bloco.coordenador}
              </p>

              {/* Enhanced Progress Bar & Percentage */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Ocupação:</span>
                <span style={{ 
                  fontWeight: 900, 
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  background: Number(pctFloat) > 85 ? '#fee2e2' : Number(pctFloat) > 50 ? '#fef3c7' : '#dcfce7',
                  color: Number(pctFloat) > 85 ? '#dc2626' : Number(pctFloat) > 50 ? '#d97706' : '#15803d'
                }}>
                  {Number(pctFloat) > 85 ? '🔴' : Number(pctFloat) > 50 ? '🟡' : '🟢'} {pctFloat}% Lotação ({countRealOcupados}/{bloco.capacidade})
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${Math.max(Number(pctFloat), countRealOcupados > 0 ? 4 : 0)}%`, 
                  height: '100%', 
                  background: Number(pctFloat) > 85 ? '#ef4444' : Number(pctFloat) > 50 ? '#f59e0b' : '#10b981', 
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Bed Grid Card - FULL WIDTH */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BedDouble size={22} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, fontWeight: 900 }}>
              Mapa Completo de Leitos - {currentBlocoObj.nome}
            </h3>
            <span className="badge badge-success" style={{ marginLeft: '0.5rem' }}>
              {acolhidosReaisNoBloco.length} Ocupados de {currentBlocoObj.capacidade} Leitos
            </span>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--primary)', fontWeight: 700 }}>
            <input 
              type="checkbox" 
              checked={filterAcessivelOnly}
              onChange={(e) => setFilterAcessivelOnly(e.target.checked)}
            />
            <Accessibility size={16} /> Somente Leitos Acessíveis (PCD / Idosos)
          </label>
        </div>

        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          {currentBlocoObj.isEnfermaria 
            ? 'Visualização inteira de todos os 50 leitos de enfermaria e observação médica.' 
            : `Exibindo a grade inteira de todos os ${currentBlocoObj.capacidade} leitos individuais deste bloco. Clique em qualquer leito ocupado para ver o prontuário completo.`}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '0.75rem',
          maxHeight: '540px',
          overflowY: 'auto',
          paddingRight: '0.35rem'
        }}>
            {Array.from({ length: currentBlocoObj.capacidade }).map((_, index) => {
              const bedNum = bedStart + index;
              const bedCode = `Leito ${bedPrefix}-${bedNum}`;
              
              // Check if a real resident from Module 1 is assigned to this exact bed code
              const matchedResident = acolhidos.find(a => a.leito === bedCode && a.status !== 'Alta Terapêutica');
              const isOccupied = Boolean(matchedResident);
              const isAccessible = index % 2 === 0;

              if (filterAcessivelOnly && !isAccessible) return null;

              return (
                <div 
                  key={index}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isOccupied ? 'rgba(20, 184, 166, 0.14)' : 'rgba(255, 255, 255, 0.02)',
                    border: isOccupied ? '1.5px solid var(--primary)' : '1px dashed var(--border-color)',
                    textAlign: 'center',
                    cursor: isOccupied ? 'pointer' : 'default',
                    position: 'relative',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => {
                    if (matchedResident) {
                      setSelectedBedInfo({ bedCode, resident: matchedResident });
                    }
                  }}
                >
                  {isAccessible && (
                    <span style={{ position: 'absolute', top: '3px', right: '4px', color: 'var(--primary)' }} title="Leito Acessível / Beliche Térreo (PCD)">
                      <Accessibility size={12} />
                    </span>
                  )}
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {bedPrefix}-{bedNum}
                  </div>

                  {matchedResident ? (
                    <div style={{ marginTop: '4px' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {matchedResident.nome.split(' ')[0]} {matchedResident.nome.split(' ')[1] || ''}
                      </div>
                      <span className="badge badge-success" style={{ fontSize: '0.55rem', padding: '0.1rem 0.3rem', marginTop: '2px' }}>
                        {matchedResident.status}
                      </span>
                    </div>
                  ) : (
                    <div style={{
                      fontSize: '0.65rem',
                      color: 'var(--text-dim)',
                      fontWeight: 500,
                      marginTop: '4px'
                    }}>
                      Livre
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
        </>
      )}

      {/* Modal: Bed Details Tooltip */}
      {selectedBedInfo && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-success">Detalhes do Leito Ocupado</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedBedInfo(null)}>
                <X size={16} /> Fechar
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <img 
                src={selectedBedInfo.resident.foto} 
                alt={selectedBedInfo.resident.nome}
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} 
              />
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>
                  {selectedBedInfo.resident.nome}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--primary)', margin: 0, fontWeight: 600 }}>
                  {selectedBedInfo.bedCode} • {selectedBedInfo.resident.alojamento}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  CPF: {selectedBedInfo.resident.cpf} | Idade: {selectedBedInfo.resident.idade} anos
                </p>
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', padding: '0.85rem', borderRadius: '6px', fontSize: '0.8rem', lineHeight: 1.6 }}>
              <p>• <strong>Município de Origem:</strong> {selectedBedInfo.resident.municipioOrigem}</p>
              <p>• <strong>Substância Principal:</strong> {selectedBedInfo.resident.substanciaPrincipal} ({selectedBedInfo.resident.tempoUso})</p>
              <p>• <strong>Convênio MROSC:</strong> {selectedBedInfo.resident.termoMROSC}</p>
              <p>• <strong>Laborterapia Alocada:</strong> {selectedBedInfo.resident.laborterapiaSector}</p>
              <p>• <strong>Contato Familiar:</strong> {selectedBedInfo.resident.contatoFamilia}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Bed Transfer */}
      {showTransferModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span className="badge badge-primary">Transferência de Leito</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowTransferModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Selecione o Acolhido</label>
                <select 
                  className="form-select" 
                  value={transferData.acolhidoId}
                  onChange={(e) => {
                    const sel = acolhidos.find(a => a.id === e.target.value);
                    const blocoOrigem = sel ? sel.alojamento : transferData.blocoOrigem;
                    const leitoOrigem = sel ? sel.leito : transferData.leitoOrigem;
                    
                    // Auto select first free bed in destination block
                    const freeBeds = getLeitosLivresPorBloco(transferData.blocoDestino);
                    
                    setTransferData({
                      ...transferData,
                      acolhidoId: e.target.value,
                      blocoOrigem,
                      leitoOrigem,
                      leitoDestino: freeBeds[0] || 'Leito Livre'
                    });
                  }}
                >
                  {acolhidos.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.nome} ({a.alojamento} - {a.leito})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Bloco de Destino</label>
                  <select 
                    className="form-select" 
                    value={transferData.blocoDestino}
                    onChange={(e) => {
                      const novoBlocoDestino = e.target.value;
                      const freeBeds = getLeitosLivresPorBloco(novoBlocoDestino);
                      setTransferData({ 
                        ...transferData, 
                        blocoDestino: novoBlocoDestino,
                        leitoDestino: freeBeds[0] || ''
                      });
                    }}
                  >
                    {todosBlocos.map(b => (
                      <option key={b.id} value={b.nome}>{b.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Leito de Destino (Somente Leitos Livres)</label>
                  <select 
                    className="form-select" 
                    value={transferData.leitoDestino}
                    onChange={(e) => setTransferData({ ...transferData, leitoDestino: e.target.value })}
                  >
                    {leitosLivresDestino.length > 0 ? (
                      leitosLivresDestino.map(lCode => (
                        <option key={lCode} value={lCode}>
                          {lCode} (Livre)
                        </option>
                      ))
                    ) : (
                      <option value="">Sem leitos livres neste bloco</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Motivo da Transferência</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={transferData.motivo}
                  onChange={(e) => setTransferData({ ...transferData, motivo: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label">Autorizado Por (Equipe Cadastrada)</label>
                <select 
                  className="form-select" 
                  value={transferData.autorizadoPor}
                  onChange={(e) => setTransferData({ ...transferData, autorizadoPor: e.target.value })}
                  required
                >
                  <option value="">-- Selecione o Autorizador Cadastrado --</option>
                  {equipeCadastradaAutorizacao.map(membro => (
                    <option key={membro} value={membro}>
                      {membro}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowTransferModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={18} /> Confirmar Transferência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Printable Block Night Roster */}
      {showPrintModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-primary">Relação Oficial de Pernoite Sincronizada</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={16} /> Imprimir Relação de Pernoite
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowPrintModal(false)}>
                  <X size={16} /> Fechar
                </button>
              </div>
            </div>

            <div className="printable-document">
              <div className="printable-header">
                <h2>FUNDAÇÃO DOUTOR JESUS</h2>
                <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                  RELAÇÃO OFICIAL DE PERNOITE E CHAMADA DE DORMITÓRIO
                </p>
                <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                  {currentBlocoObj.nome} — Candeias / BA | Data da Chamada: {dataChamada.split('-').reverse().join('/')}
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <p>• Coordenador do Bloco: <strong>{currentBlocoObj.coordenador}</strong></p>
                <p>• Total de Leitos Ocupados: <strong>{acolhidosReaisNoBloco.length} de {currentBlocoObj.capacidade}</strong></p>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                <thead>
                  <tr style={{ background: '#e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Leito</th>
                    <th style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Nome do Acolhido</th>
                    <th style={{ padding: '6px', border: '1px solid #cbd5e1' }}>CPF</th>
                    <th style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Origem</th>
                    <th style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Visto Pernoite</th>
                  </tr>
                </thead>
                <tbody>
                  {acolhidosReaisNoBloco.map((item) => {
                    const st = getStatusPresenca(item.id);
                    return (
                      <tr key={item.id}>
                        <td style={{ padding: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold' }}>{item.leito}</td>
                        <td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>{item.nome}</td>
                        <td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>{item.cpf}</td>
                        <td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>{item.municipioOrigem}</td>
                        <td style={{ padding: '6px', border: '1px solid #cbd5e1' }}>
                          {st === 'ausente' ? (
                            <span style={{ color: '#dc2626', fontWeight: 800 }}>❌ [ X ] AUSENTE (Falta Registrada)</span>
                          ) : (
                            <span style={{ color: '#059669', fontWeight: 800 }}>✅ [ ✔ ] PRESENTE NO LEITO</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '0.85rem' }}>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem' }}>
                    <strong>{currentBlocoObj.coordenador}</strong><br />
                    Coordenador do Bloco
                  </div>
                </div>

                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem' }}>
                    <strong>Monitor de Pátio de Plantão</strong><br />
                    Fundação Doutor Jesus
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Painel de Auditoria de Movimentações de Leito */}
      {showAuditModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '920px', padding: '1.5rem' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, fontWeight: 900 }}>
                  Auditoria de Movimentações & Remanejamento de Leitos
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={14} /> Imprimir Relatório / PDF
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowAuditModal(false)}>
                  <X size={16} /> Fechar
                </button>
              </div>
            </div>

            <div className="printable-document">
              <div className="printable-header">
                <h2>FUNDAÇÃO DOUTOR JESUS</h2>
                <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                  RELATÓRIO OFICIAL DE AUDITORIA E HISTÓRICO DE REMANEJAMENTO DE LEITOS
                </p>
                <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Gestão de Alojamentos e Dormitórios | Emissão: {new Date().toLocaleString('pt-BR')}
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <p style={{ margin: '0 0 4px 0' }}>• Total de Remanejamentos Registrados: <strong>{historicoMovimentacoes.length} movimentação(ões)</strong></p>
                <p style={{ margin: 0 }}>• Finalidade: Rastreabilidade para fiscalização MROSC / SJDH-BA e controle de passagem de turno dos monitores.</p>
              </div>

              {historicoMovimentacoes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                  <FileText size={40} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', opacity: 0.6 }} />
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: '0 0 0.25rem 0', fontWeight: 800 }}>Nenhum remanejamento registrado até o momento</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                    As transferências de leito realizadas pelos monitores no botão "Transferir Acolhido" serão registradas e arquivadas automaticamente nesta auditoria.
                  </p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table" style={{ fontSize: '0.8rem' }}>
                    <thead>
                      <tr>
                        <th>Código / Data & Hora</th>
                        <th>Acolhido</th>
                        <th>Leito de Origem</th>
                        <th>Leito de Destino</th>
                        <th>Motivo do Remanejamento</th>
                        <th>Autorizado Por</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historicoMovimentacoes.map((mov) => (
                        <tr key={mov.id}>
                          <td>
                            <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{mov.id}</div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{mov.data}</div>
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{mov.acolhidoNome}</td>
                          <td><span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{mov.origem}</span></td>
                          <td><span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{mov.destino}</span></td>
                          <td style={{ fontSize: '0.775rem' }}>{mov.motivo}</td>
                          <td style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.775rem' }}>{mov.autorizadoPor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
