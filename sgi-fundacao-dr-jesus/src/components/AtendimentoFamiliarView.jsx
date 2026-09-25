import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  CheckCircle2, 
  Printer, 
  X, 
  Plus, 
  Heart, 
  UserCheck, 
  Phone, 
  Send,
  ShieldCheck,
  FileText,
  Video,
  Car,
  Star,
  Search,
  Pencil,
  Trash2
} from 'lucide-react';

// Lista de Técnicos e Assistentes Sociais Cadastrados
const equipeTecnicaCadastrada = [
  'Assistente Social Valéria (CRESS 4910)',
  'Assistente Social Rita de Cássia (CRESS 5214)',
  'Psicóloga Dra. Fernanda Oliveira (CRP 03/12450)',
  'Psicólogo Dr. Marcos Vinicius (CRP 03/14820)',
  'Coordenador Técnico Multidisciplinar',
  'Enfermeira Chefe Juliana (COREN-BA 214500)'
];

export default function AtendimentoFamiliarView({ acolhidos, activeSubTab, setActiveSubTab }) {
  const [selectedAcolhidoId, setSelectedAcolhidoId] = useState(acolhidos[0]?.id || '');
  const selectedAcolhido = acolhidos.find(a => a.id === selectedAcolhidoId) || acolhidos[0];

  const [searchTermAcolhido, setSearchTermAcolhido] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAcolhidos = acolhidos.filter(a => 
    a.nome.toLowerCase().includes(searchTermAcolhido.toLowerCase()) ||
    (a.id && a.id.toLowerCase().includes(searchTermAcolhido.toLowerCase())) ||
    (a.cpf && a.cpf.includes(searchTermAcolhido))
  );

  const [showVisitaModal, setShowVisitaModal] = useState(false);
  const [showBoletimModal, setShowBoletimModal] = useState(false);
  const [showPasseModal, setShowPasseModal] = useState(false);
  const [showRelatoModal, setShowRelatoModal] = useState(false);
  const [showPrintRelatoModal, setShowPrintRelatoModal] = useState(false);
  const [selectedRelatoPrint, setSelectedRelatoPrint] = useState(null);

  const [newRelato, setNewRelato] = useState({
    data: new Date().toISOString().split('T')[0],
    familiar: '',
    profissional: equipeTecnicaCadastrada[0],
    relato: '',
    parecer: 'Acolhido demonstrando forte vínculo familiar e evolução positiva no Plano Terapêutico Singular.',
    percepcao: '⭐ Muito Positiva'
  });

  // Sample Visitation Schedule
  const [visitas, setVisitas] = useState([
    {
      id: 'VIS-2026-01',
      data: '2026-08-16 (Domingo)',
      acolhidoNome: 'Antonio Carlos da Silva Filho',
      visitanteNome: 'Maria das Graças dos Santos',
      parentesco: 'Mãe',
      telefone: '(71) 98842-1044',
      status: 'Agendado & Autorizado',
      tipo: 'Presencial Sede Candeias',
      observacao: 'Visita presencial de fim de semana autorizada pelo Serviço Social.'
    },
    {
      id: 'VIS-2026-02',
      data: '2026-08-16 (Domingo)',
      acolhidoNome: 'Marcos Vinicius Santos Santana',
      visitanteNome: 'Carla dos Santos Santana',
      parentesco: 'Esposa',
      telefone: '(71) 99104-5820',
      status: 'Agendado & Autorizado',
      tipo: 'Videochamada Assistida (Feira de Santana)',
      observacao: 'Família residente no interior da Bahia (Videochamada com Psicologia).'
    }
  ]);

  // Passes (Licenças Terapêuticas) Full CRUD State
  const [passes, setPasses] = useState([
    {
      id: 'PAS-2026-01',
      acolhidoId: acolhidos[0]?.id || '',
      acolhidoNome: 'Antonio Carlos da Silva Filho',
      saida: '2026-08-15 09:00',
      retornoPrevisto: '2026-08-16 17:00',
      responsavel: 'Maria das Graças (Mãe)',
      fasePTI: 'Fase 3: Reinserção Familiar & Social',
      status: 'Autorizado Serviço Social'
    }
  ]);

  const [showPasseFormModal, setShowPasseFormModal] = useState(false);
  const [showPassePrintModal, setShowPassePrintModal] = useState(false);
  const [editingPasseId, setEditingPasseId] = useState(null);
  const [selectedPasseForPrint, setSelectedPasseForPrint] = useState(null);

  const [passeForm, setPasseForm] = useState({
    acolhidoId: acolhidos[0]?.id || '',
    saidaData: '2026-08-29',
    saidaHora: '09:00',
    retornoData: '2026-08-30',
    retornoHora: '17:00',
    responsavel: '',
    fasePTI: 'Fase 3: Reinserção Familiar & Social',
    status: 'Autorizado Serviço Social'
  });

  const handleOpenNewPasse = () => {
    setEditingPasseId(null);
    setPasseForm({
      acolhidoId: selectedAcolhido.id,
      saidaData: new Date().toISOString().split('T')[0],
      saidaHora: '09:00',
      retornoData: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      retornoHora: '17:00',
      responsavel: selectedAcolhido.contatoFamilia || 'Familiar Cadastrado',
      fasePTI: 'Fase 3: Reinserção Familiar & Social',
      status: 'Autorizado Serviço Social'
    });
    setShowPasseFormModal(true);
  };

  const handleEditPasse = (p) => {
    setEditingPasseId(p.id);
    const targetAcolhido = acolhidos.find(a => a.nome === p.acolhidoNome);

    const sParts = p.saida.split(' ');
    const sData = sParts[0] && sParts[0].includes('-') ? sParts[0] : new Date().toISOString().split('T')[0];
    const sHora = sParts[1] || '09:00';

    const rParts = p.retornoPrevisto.split(' ');
    const rData = rParts[0] && rParts[0].includes('-') ? rParts[0] : new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const rHora = rParts[1] || '17:00';

    setPasseForm({
      acolhidoId: targetAcolhido ? targetAcolhido.id : selectedAcolhido.id,
      saidaData: sData,
      saidaHora: sHora,
      retornoData: rData,
      retornoHora: rHora,
      responsavel: p.responsavel,
      fasePTI: p.fasePTI || 'Fase 3: Reinserção Familiar & Social',
      status: p.status || 'Autorizado Serviço Social'
    });
    setShowPasseFormModal(true);
  };

  const handleSavePasse = (e) => {
    e.preventDefault();

    // Validate that Return Date/Time is after Departure Date/Time
    const dtSaida = new Date(`${passeForm.saidaData}T${passeForm.saidaHora || '00:00'}`);
    const dtRetorno = new Date(`${passeForm.retornoData}T${passeForm.retornoHora || '00:00'}`);

    if (dtRetorno < dtSaida) {
      alert('⚠️ Erro de Validação: A data e horário de retorno previsto não podem ser anteriores à data de saída!');
      return;
    }

    const ac = acolhidos.find(a => a.id === passeForm.acolhidoId) || selectedAcolhido;

    const saidaFormatada = `${passeForm.saidaData} ${passeForm.saidaHora}`;
    const retornoFormatado = `${passeForm.retornoData} ${passeForm.retornoHora}`;

    if (editingPasseId) {
      setPasses(passes.map(p => p.id === editingPasseId ? {
        ...p,
        acolhidoId: ac.id,
        acolhidoNome: ac.nome,
        saida: saidaFormatada,
        retornoPrevisto: retornoFormatado,
        responsavel: passeForm.responsavel,
        fasePTI: passeForm.fasePTI,
        status: passeForm.status
      } : p));
    } else {
      const newPasse = {
        id: `PAS-2026-0${passes.length + 1}`,
        acolhidoId: ac.id,
        acolhidoNome: ac.nome,
        saida: saidaFormatada,
        retornoPrevisto: retornoFormatado,
        responsavel: passeForm.responsavel,
        fasePTI: passeForm.fasePTI,
        status: passeForm.status
      };
      setPasses([newPasse, ...passes]);
    }
    setShowPasseFormModal(false);
  };

  const handleDeletePasse = (id) => {
    if (window.confirm('Tem certeza que deseja cancelar e remover este Passe Terapêutico?')) {
      setPasses(passes.filter(p => p.id !== id));
    }
  };

  const handlePrintPasse = (p) => {
    setSelectedPasseForPrint(p);
    setShowPassePrintModal(true);
  };

  const getFamiliaresCadastrados = (ac) => {
    if (!ac) return ['Silvia Trates (Irmão / Irmã) - (71) 54545-4598'];
    const list = [];
    if (ac.contatoFamilia) {
      list.push(ac.contatoFamilia);
    }
    visitas.filter(v => v.acolhidoNome === ac.nome).forEach(v => {
      const formatted = `${v.visitanteNome} (${v.parentesco}) - ${v.telefone || ''}`;
      if (!list.some(item => item.includes(v.visitanteNome))) {
        list.push(formatted);
      }
    });
    if (list.length === 0) {
      list.push('Silvia Trates (Irmão / Irmã) - (71) 54545-4598');
    }
    return list;
  };

  // Sample Family Service Notes
  const [atendimentosFamilia, setAtendimentosFamilia] = useState([
    {
      id: 1,
      data: '2026-08-10 14:00',
      profissional: 'Assistente Social Valéria (CRESS 4910)',
      familiar: 'Maria das Graças (Mãe)',
      resumo: 'Atendimento telefônico de orientação familiar. Mãe relatou grande alívio com a recuperação do filho. Orientada sobre o cronograma de visitas do próximo domingo.'
    }
  ]);

  const [newVisita, setNewVisita] = useState({
    dataData: new Date().toISOString().split('T')[0],
    horaHora: '09:00',
    retornoData: new Date().toISOString().split('T')[0],
    retornoHora: '17:00',
    visitanteNome: '',
    parentesco: 'Mãe',
    telefone: '(71) 98842-1044',
    tipo: 'Presencial Sede Candeias',
    observacao: 'Visita presencial regulamentar.'
  });

  const handleAddRelato = (e) => {
    e.preventDefault();
    if (!newRelato.relato) return;

    const entry = {
      id: Date.now(),
      data: `${newRelato.data} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      profissional: newRelato.profissional,
      familiar: newRelato.familiar || selectedAcolhido.contatoFamilia || 'Familiar Cadastrado',
      resumo: newRelato.relato,
      parecer: newRelato.parecer,
      percepcao: newRelato.percepcao
    };

    setAtendimentosFamilia([entry, ...atendimentosFamilia]);
    setSelectedRelatoPrint(entry);
    setShowRelatoModal(false);
    setNewRelato({
      data: new Date().toISOString().split('T')[0],
      familiar: '',
      profissional: equipeTecnicaCadastrada[0],
      relato: '',
      parecer: 'Acolhido demonstrando forte vínculo familiar e evolução positiva no Plano Terapêutico Singular.',
      percepcao: '⭐ Muito Positiva'
    });
  };

  const handleAddVisita = (e) => {
    e.preventDefault();
    if (!newVisita.visitanteNome) return;

    // Validate return date/time
    const dtSaida = new Date(`${newVisita.dataData}T${newVisita.horaHora || '00:00'}`);
    const dtRetorno = new Date(`${newVisita.retornoData}T${newVisita.retornoHora || '00:00'}`);

    if (dtRetorno < dtSaida) {
      alert('⚠️ Erro de Validação: A data e horário de retorno previsto não podem ser anteriores à data de início/saída!');
      return;
    }

    const dataFormatada = `${newVisita.dataData.split('-').reverse().join('/')} ${newVisita.horaHora} até ${newVisita.retornoData.split('-').reverse().join('/')} ${newVisita.retornoHora}`;

    const newEntry = {
      id: `VIS-2026-0${Math.floor(10 + Math.random() * 89)}`,
      data: dataFormatada,
      acolhidoNome: selectedAcolhido.nome,
      visitanteNome: newVisita.visitanteNome,
      parentesco: newVisita.parentesco,
      telefone: newVisita.telefone,
      status: 'Agendado & Autorizado',
      tipo: newVisita.tipo,
      observacao: newVisita.observacao
    };

    setVisitas([newEntry, ...visitas]);
    setShowVisitaModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner Header */}
      <div className="card">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">Módulo 7</span>
            <span className="badge badge-success">Rede Familiar • Passe Terapêutico • Videochamadas</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>
            Atendimento Familiar, Passe Terapêutico & Videochamadas
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Fortalecimento de vínculos, licenças de fim de semana (Fase 3), videochamadas com o interior e envio de boletins.
          </p>
        </div>
      </div>

      {/* Resident Info Bar */}
      <div className="card" style={{ background: 'var(--bg-card)', border: '2px solid var(--primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <img 
            src={selectedAcolhido.foto} 
            alt={selectedAcolhido.nome} 
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} 
          />

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', fontWeight: 900 }}>{selectedAcolhido.nome}</h3>
              <span className="badge badge-success">{selectedAcolhido.status}</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Familiar de Apoio Cadastrado: <strong>{selectedAcolhido.contatoFamilia || 'Mãe cadastrada'}</strong>
            </p>
          </div>

          {/* Campo de Pesquisa Autocomplete de Acolhidos */}
          <div ref={searchContainerRef} style={{ position: 'relative', width: '340px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--bg-main)',
              border: '2px solid var(--primary)',
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}>
              <Search size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="🔍 Pesquisar por nome ou código..."
                value={searchTermAcolhido}
                onChange={(e) => {
                  setSearchTermAcolhido(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  width: '100%',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-main)'
                }}
              />
              {searchTermAcolhido && (
                <button 
                  type="button"
                  onClick={() => { setSearchTermAcolhido(''); setIsDropdownOpen(false); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Dropdown de Resultados da Pesquisa */}
            {isDropdownOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  right: 0,
                  left: 0,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  maxHeight: '280px',
                  overflowY: 'auto',
                  zIndex: 999,
                  padding: '0.4rem'
                }}
              >
                {filteredAcolhidos.length > 0 ? (
                  filteredAcolhidos.map(a => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setSelectedAcolhidoId(a.id);
                        setSearchTermAcolhido('');
                        setIsDropdownOpen(false);
                      }}
                      style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: a.id === selectedAcolhidoId ? 'rgba(2, 132, 199, 0.1)' : 'transparent',
                        marginBottom: '2px',
                        borderLeft: a.id === selectedAcolhidoId ? '3px solid var(--primary)' : '3px solid transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img src={a.foto} alt={a.nome} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{a.nome}</div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{a.id} • CPF: {a.cpf || 'N/A'}</div>
                        </div>
                      </div>
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{a.status}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Nenhum acolhido encontrado para "<strong>{searchTermAcolhido}</strong>"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Family Feedback Rating Card */}
      <div className="card" style={{ background: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={20} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
              Pesquisa de Percepção & Satisfação da Família (Mapeamento de Transformação)
            </h3>
          </div>
          <span className="badge badge-warning">⭐ 98.4% de Percepção Positiva</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Famílias relatam recuperação expressiva da saúde física, equilíbrio emocional e renovação de laços de carinho.
        </p>
      </div>

      {/* NOVO: ALTERNÂNCIA DINÂMICA DE TELAS CONFORME A SUB-ABA DO SIDEBAR */}
      {activeSubTab === 'video' ? (
        <div className="card" style={{ borderLeft: '4px solid #a855f7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
            <div>
              <span className="badge badge-primary">Módulo 3: Rede Familiar</span>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: '0.25rem 0 0 0', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Video size={24} style={{ color: '#a855f7' }} /> Painel de Videochamadas Assistidas (Famílias do Interior)
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Agendamento e mediação de videochamadas via psicólogo para familiares de fora de Candeias.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => {
              setNewVisita(prev => ({ ...prev, tipo: 'Videochamada Assistida (Interior/Outro Estado)' }));
              setShowVisitaModal(true);
            }}>
              <Plus size={16} /> Agendar Nova Videochamada
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Acolhido</th>
                  <th>Familiar Responsável</th>
                  <th>Cidade / Telefone</th>
                  <th>Data & Horário</th>
                  <th>Status & Link</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {visitas.filter(v => v.tipo.includes('Videochamada')).map((v) => (
                  <tr key={v.id}>
                    <td><strong>{v.acolhidoNome}</strong></td>
                    <td>{v.visitanteNome} ({v.parentesco})</td>
                    <td>{v.telefone}</td>
                    <td>{v.data} - 15:00h</td>
                    <td><span className="badge badge-success">🟢 Agendado (Sala Google Meet)</span></td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => alert(`Conectando sala virtual com ${v.visitanteNome}...`)}>
                        <Video size={14} /> Iniciar Videochamada
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeSubTab === 'passe' ? (
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
            <div>
              <span className="badge badge-success">Fase 3: Reinserção Familiar</span>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: '0.25rem 0 0 0', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Car size={24} style={{ color: '#10b981' }} /> Gestão de Passes Terapêuticos (Licença Fim de Semana)
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Emissão de guias de autorização para visita à família nos fins de semana regulamentares.
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleOpenNewPasse}>
              <Plus size={16} /> Emitir Passe Terapêutico
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Passe №</th>
                  <th>Acolhido Residente</th>
                  <th>Saída Prevista</th>
                  <th>Retorno Previsto</th>
                  <th>Familiar Responsável</th>
                  <th>Status & Autorização</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {passes.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Nenhum passe terapêutico emitido até o momento. Clique em "+ Emitir Passe Terapêutico" acima.
                    </td>
                  </tr>
                ) : (
                  passes.map((p) => (
                    <tr key={p.id}>
                      <td><strong style={{ color: 'var(--primary)' }}>{p.id}</strong></td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{p.acolhidoNome}</td>
                      <td style={{ fontSize: '0.8rem' }}>{p.saida}</td>
                      <td style={{ fontSize: '0.8rem' }}>{p.retornoPrevisto}</td>
                      <td style={{ fontSize: '0.8rem' }}>{p.responsavel}</td>
                      <td><span className="badge badge-success" style={{ fontSize: '0.725rem' }}>{p.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          <button className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem' }} onClick={() => handlePrintPasse(p)}>
                            <Printer size={13} /> Imprimir
                          </button>
                          <button className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem' }} onClick={() => handleEditPasse(p)}>
                            <Pencil size={13} /> Editar
                          </button>
                          <button className="btn btn-danger btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem', background: '#ef4444', borderColor: '#ef4444', color: '#fff' }} onClick={() => handleDeletePasse(p.id)}>
                            <Trash2 size={13} /> Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeSubTab === 'boletim' ? (
        <div className="card" style={{ borderLeft: '4px solid #25D366' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
            <div>
              <span className="badge badge-success">Comunicação Oficial WhatsApp</span>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: '0.25rem 0 0 0', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={24} style={{ color: '#25D366' }} /> Envio de Boletins Informativos para Famílias
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Envio automatizado do relatório de evolução física, psicológica e comunitária.
              </p>
            </div>
            <button className="btn btn-primary" style={{ background: '#25D366', borderColor: '#25D366' }} onClick={() => setShowBoletimModal(true)}>
              <Send size={16} /> Disparar Boletim via WhatsApp
            </button>
          </div>

          <div style={{ background: 'rgba(37, 211, 102, 0.08)', border: '1px solid rgba(37, 211, 102, 0.3)', padding: '1.25rem', borderRadius: '8px' }}>
            <h4 style={{ color: '#25D366', margin: '0 0 0.5rem 0', fontWeight: 800 }}>Modelo de Boletim Enviado para {selectedAcolhido.contatoFamilia}</h4>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', color: 'var(--text-main)', background: 'var(--bg-main)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
{`Olá Sra. ${selectedAcolhido.contatoFamilia.split(' (')[0]}! 

Paz e Graça da Fundação Doutor Jesus.

Gostaríamos de informar que o acolhido *${selectedAcolhido.nome}* passa muito bem! 
• *Saúde Física:* Alimentação regular, acompanhado pela enfermagem.
• *Espiritualidade & Oficinas:* Ativo nas reuniões de louvor e laborterapia.
• *Previsão de Visita Presencial:* Próximo domingo a partir das 08:30h.

Qualquer dúvida, estamos à disposição no Serviço Social.`}
            </pre>
          </div>
        </div>
      ) : (
        /* Visitas Presenciais Domingo (Visão Geral) */
        <div className="grid-2">
          {/* Visitation Schedule Table Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Visitações Presenciais Domingo</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-primary">Sede Candeias</span>
                <button className="btn btn-primary btn-sm" onClick={() => {
                  setNewVisita(prev => ({ ...prev, tipo: 'Presencial Sede Candeias' }));
                  setShowVisitaModal(true);
                }}>
                  <Plus size={14} /> Agendar Visita
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Visitante / Parentesco</th>
                    <th>Modalidade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visitas.map(v => (
                    <tr key={v.id}>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.data}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{v.visitanteNome}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--primary)' }}>{v.parentesco} • {v.telefone}</div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: v.tipo.includes('Videochamada') ? '#3b82f6' : 'var(--text-main)' }}>
                        {v.tipo}
                      </td>
                      <td><span className="badge badge-success">{v.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Family Service Timeline Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Heart size={20} style={{ color: 'var(--accent)' }} />
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Atendimentos & Mediação Familiar</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" style={{ background: '#0284c7', borderColor: '#0284c7' }} onClick={() => setShowRelatoModal(true)}>
                  <Star size={14} /> Avaliação / Relato
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => {
                  setSelectedRelatoPrint(atendimentosFamilia[0]);
                  setShowPrintRelatoModal(true);
                }}>
                  <Printer size={14} /> Ficha
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {atendimentosFamilia.map(at => (
                <div key={at.id} style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{at.profissional}</span>
                    <span style={{ color: 'var(--text-dim)' }}>{at.data}</span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    Familiar: <strong>{at.familiar}</strong> — {at.resumo}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Visitation Entry */}
      {showVisitaModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, fontWeight: 900 }}>
                  {activeSubTab === 'video' ? '📱 Agendar Videochamada Assistida (Famílias do Interior)' : '👨‍👩‍👧‍👦 Agendar Visita Presencial (Domingo)'}
                </h3>
              </div>
              <button onClick={() => setShowVisitaModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddVisita}>
              {/* Data e Hora de Início / Saída */}
              <div className="grid-2" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">📅 Data de Início / Visita *</label>
                  <input 
                    type="date" 
                    required 
                    className="form-input" 
                    value={newVisita.dataData}
                    onChange={(e) => {
                      const newSaida = e.target.value;
                      const currentRetorno = newVisita.retornoData;
                      const nextRetorno = currentRetorno < newSaida ? newSaida : currentRetorno;
                      setNewVisita({ ...newVisita, dataData: newSaida, retornoData: nextRetorno });
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">⏰ Horário de Início *</label>
                  <input 
                    type="time" 
                    required 
                    className="form-input" 
                    value={newVisita.horaHora}
                    onChange={(e) => setNewVisita({ ...newVisita, horaHora: e.target.value })}
                  />
                </div>
              </div>

              {/* Data e Hora de Volta / Retorno */}
              <div className="grid-2" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">📅 Data de Volta / Retorno Previsto *</label>
                  <input 
                    type="date" 
                    required 
                    min={newVisita.dataData}
                    className="form-input" 
                    value={newVisita.retornoData}
                    onChange={(e) => setNewVisita({ ...newVisita, retornoData: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">⏰ Horário de Volta / Retorno *</label>
                  <input 
                    type="time" 
                    required 
                    className="form-input" 
                    value={newVisita.retornoHora}
                    onChange={(e) => setNewVisita({ ...newVisita, retornoHora: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nome do Familiar Visitante *</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="Ex: Maria das Graças dos Santos"
                  value={newVisita.visitanteNome}
                  onChange={(e) => setNewVisita({ ...newVisita, visitanteNome: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Modalidade de Atendimento</label>
                  {activeSubTab === 'video' ? (
                    <select 
                      className="form-select"
                      value="Videochamada Assistida (Interior/Outro Estado)"
                      onChange={(e) => setNewVisita({ ...newVisita, tipo: e.target.value })}
                    >
                      <option value="Videochamada Assistida (Interior/Outro Estado)">📱 Videochamada Assistida (Interior/Outro Estado)</option>
                    </select>
                  ) : (
                    <select 
                      className="form-select"
                      value="Presencial Sede Candeias"
                      onChange={(e) => setNewVisita({ ...newVisita, tipo: e.target.value })}
                    >
                      <option value="Presencial Sede Candeias">👨‍👩‍👧‍👦 Presencial Sede Candeias (Domingo)</option>
                    </select>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Grau de Parentesco</label>
                  <select 
                    className="form-select"
                    value={newVisita.parentesco}
                    onChange={(e) => setNewVisita({ ...newVisita, parentesco: e.target.value })}
                  >
                    <option value="Mãe">Mãe</option>
                    <option value="Pai">Pai</option>
                    <option value="Esposa / Cônjuge">Esposa / Cônjuge</option>
                    <option value="Irmão / Irmã">Irmão / Irmã</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Telefone WhatsApp *</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="(71) 98842-1044"
                  value={newVisita.telefone}
                  onChange={(e) => setNewVisita({ ...newVisita, telefone: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowVisitaModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={18} /> Autorizar & Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 1: Form para Criar / Editar Passe Terapêutico */}
      {showPasseFormModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Car size={22} style={{ color: '#10b981' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, fontWeight: 900 }}>
                  {editingPasseId ? `Editar Passe Terapêutico (${editingPasseId})` : 'Emitir Novo Passe Terapêutico (Licença Fim de Semana)'}
                </h3>
              </div>
              <button onClick={() => setShowPasseFormModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePasse}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">1. Selecionar Acolhido Residente *</label>
                <select 
                  className="form-select"
                  value={passeForm.acolhidoId}
                  onChange={(e) => {
                    const selId = e.target.value;
                    const matched = acolhidos.find(a => a.id === selId);
                    setPasseForm({
                      ...passeForm,
                      acolhidoId: selId,
                      responsavel: matched ? matched.contatoFamilia : passeForm.responsavel
                    });
                  }}
                  required
                >
                  {acolhidos
                    .filter(a => a.status !== 'Alta Terapêutica')
                    .map(a => (
                      <option key={a.id} value={a.id}>
                        {a.nome} ({a.id}) — {a.alojamento}
                      </option>
                    ))
                  }
                </select>
              </div>

              {/* Saída: Data + Hora */}
              <div className="grid-2" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">📅 Data de Saída *</label>
                  <input 
                    type="date" 
                    required 
                    className="form-input" 
                    value={passeForm.saidaData}
                    onChange={(e) => {
                      const newSaida = e.target.value;
                      const currentRetorno = passeForm.retornoData;
                      const nextRetorno = currentRetorno < newSaida ? newSaida : currentRetorno;
                      setPasseForm({ ...passeForm, saidaData: newSaida, retornoData: nextRetorno });
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">⏰ Horário de Saída *</label>
                  <input 
                    type="time" 
                    required 
                    className="form-input" 
                    value={passeForm.saidaHora}
                    onChange={(e) => setPasseForm({ ...passeForm, saidaHora: e.target.value })}
                  />
                </div>
              </div>

              {/* Retorno Previsto: Data + Hora */}
              <div className="grid-2" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">📅 Data de Retorno Previsto *</label>
                  <input 
                    type="date" 
                    required 
                    min={passeForm.saidaData}
                    className="form-input" 
                    value={passeForm.retornoData}
                    onChange={(e) => setPasseForm({ ...passeForm, retornoData: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">⏰ Horário de Retorno Previsto *</label>
                  <input 
                    type="time" 
                    required 
                    className="form-input" 
                    value={passeForm.retornoHora}
                    onChange={(e) => setPasseForm({ ...passeForm, retornoHora: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">4. Familiar Responsável pela Guarda (Cadastro do Acolhido) *</label>
                <select 
                  className="form-select"
                  value={passeForm.responsavel}
                  onChange={(e) => setPasseForm({ ...passeForm, responsavel: e.target.value })}
                  required
                >
                  {getFamiliaresCadastrados(acolhidos.find(a => a.id === passeForm.acolhidoId) || selectedAcolhido).map((fam, idx) => (
                    <option key={idx} value={fam}>
                      👤 {fam}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">5. Estágio / Fase PTI</label>
                  <select 
                    className="form-select"
                    value={passeForm.fasePTI}
                    onChange={(e) => setPasseForm({ ...passeForm, fasePTI: e.target.value })}
                  >
                    <option value="Fase 3: Reinserção Familiar & Social">Fase 3: Reinserção Familiar & Social</option>
                    <option value="Fase 4: Autonomia & Empregabilidade">Fase 4: Autonomia & Empregabilidade</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">6. Status da Autorização</label>
                  <select 
                    className="form-select"
                    value={passeForm.status}
                    onChange={(e) => setPasseForm({ ...passeForm, status: e.target.value })}
                  >
                    <option value="Autorizado Serviço Social">🟢 Autorizado Serviço Social</option>
                    <option value="Em Análise Multidisciplinar">🟡 Em Análise Multidisciplinar</option>
                    <option value="Concluído / Retornou ao Centro">🔵 Concluído / Retornou ao Centro</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPasseFormModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={18} /> {editingPasseId ? 'Salvar Alterações' : 'Emitir & Registrar Passe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Termo Impresso Oficial do Passe Terapêutico */}
      {showPassePrintModal && selectedPasseForPrint && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-warning">Termo de Licença Familiar de Fim de Semana (Passe Terapêutico)</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={16} /> Imprimir Termo de Passe
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowPassePrintModal(false)}>
                  <X size={16} /> Fechar
                </button>
              </div>
            </div>

            <div className="printable-document">
              <div className="printable-header">
                <h2>FUNDAÇÃO DOUTOR JESUS</h2>
                <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                  TERMO DE LICENÇA FAMILIAR TEMPORÁRIA E PASSE TERAPÊUTICO ({selectedPasseForPrint.fasePTI})
                </p>
                <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Serviço Social & Corpo Multidisciplinar — Candeias / BA | Guia № {selectedPasseForPrint.id}
                </p>
              </div>

              <div style={{ border: '1px solid #cbd5e1', padding: '0.85rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <p>• Acolhido Autorizado: <strong>{selectedPasseForPrint.acolhidoNome}</strong></p>
                <p>• Estágio no Tratamento: <strong>{selectedPasseForPrint.fasePTI}</strong></p>
                <p>• Data e Hora de Saída: <strong>{selectedPasseForPrint.saida}</strong> | Retorno Obrigatório: <strong>{selectedPasseForPrint.retornoPrevisto}</strong></p>
                <p>• Familiar Responsável pela Guarda: <strong>{selectedPasseForPrint.responsavel}</strong></p>
                <p>• Status do Documento: <strong>{selectedPasseForPrint.status}</strong></p>
              </div>

              <p style={{ textIndent: '2rem', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'justify' }}>
                A equipe multidisciplinar da Fundação Doutor Jesus autoriza o afastamento temporário do acolhido acima nomeado para vivência de final de semana com seus familiares de referência, devendo o mesmo retornar impreterivelmente no horário pactuado em perfeitas condições de sobriedade.
              </p>

              <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '0.85rem' }}>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem' }}>
                    <strong>{selectedPasseForPrint.acolhidoNome}</strong><br />
                    Assinatura do Acolhido
                  </div>
                </div>

                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem' }}>
                    <strong>Serviço Social / Psicologia FDJ</strong><br />
                    Autorização Concedida
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Printable WhatsApp Family Progress Report */}
      {showBoletimModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-success">Boletim de Evolução Psicossocial para a Família</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-primary btn-sm" 
                  onClick={() => {
                    const msg = encodeURIComponent(`Olá! Este é o Boletim Informativo de Saúde e Evolução de ${selectedAcolhido.nome} na Fundação Doutor Jesus (Candeias/BA).\nStatus: Estável em leito\nLaborterapia: Padaria/Cozinha\nEvolução Psicossocial: Excelente adesão ao tratamento.`);
                    window.open(`https://api.whatsapp.com/send?phone=5571988421044&text=${msg}`, '_blank');
                  }}
                >
                  <Send size={16} /> Enviar via WhatsApp
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowBoletimModal(false)}>
                  <X size={16} /> Fechar
                </button>
              </div>
            </div>

            <div className="printable-document">
              <div className="printable-header">
                <h2>FUNDAÇÃO DOUTOR JESUS</h2>
                <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                  BOLETIM REGULAMENTAR DE EVOLUÇÃO E INFORMATIVO DA FAMÍLIA
                </p>
                <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Serviço Social & Psicologia — Candeias / BA
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <p>• Acolhido: <strong>{selectedAcolhido.nome}</strong></p>
                <p>• Alojamento / Leito: <strong>{selectedAcolhido.alojamento} ({selectedAcolhido.leito})</strong></p>
                <p>• Familiar de Referência: <strong>{selectedAcolhido.contatoFamilia || 'Maria das Graças (Mãe)'}</strong></p>
              </div>

              <h4 style={{ textTransform: 'uppercase', fontSize: '0.95rem', marginBottom: '0.5rem', color: '#0f172a' }}>
                RESUMO DA EVOLUÇÃO INSTITUCIONAL
              </h4>
              <p style={{ textIndent: '1.5rem', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'justify' }}>
                O acolhido encontra-se com ótimo estado geral de saúde, adaptado à rotina comunitária, participando regularmente das atividades de espiritualidade e laborterapia. Sinais vitais estáveis e boa convivência comunitária.
              </p>

              <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '0.85rem' }}>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem' }}>
                    <strong>Serviço Social / Psicologia</strong><br />
                    Fundação Doutor Jesus
                  </div>
                </div>

                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem' }}>
                    <strong>Familiar Responsável</strong><br />
                    Visto de Recebimento
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    
      {/* Modal: Registrar Relato da Família */}
      {showRelatoModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, fontWeight: 900 }}>
                  Registrar Relato & Depoimento da Família
                </h3>
              </div>
              <button onClick={() => setShowRelatoModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddRelato}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Acolhido Vinculado:</label>
                <input type="text" className="form-input" value={`${selectedAcolhido.nome} (${selectedAcolhido.id})`} disabled style={{ fontWeight: 700, background: 'var(--bg-main)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Familiar Entrevistado / Declaração de:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Maria das Graças (Mãe)" 
                    value={newRelato.familiar}
                    onChange={(e) => setNewRelato({ ...newRelato, familiar: e.target.value })}
                    style={{ width: '100%', height: '42px', fontSize: '0.9rem' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Técnico / Assistente Social Cadastrado:</label>
                  <select 
                    className="form-select" 
                    value={newRelato.profissional}
                    onChange={(e) => setNewRelato({ ...newRelato, profissional: e.target.value })}
                    style={{ width: '100%', height: '42px', fontSize: '0.875rem' }}
                    required
                  >
                    <option value="">-- Selecione o Técnico Cadastrado --</option>
                    {equipeTecnicaCadastrada.map(tecnico => (
                      <option key={tecnico} value={tecnico}>
                        {tecnico}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Relato Completo & Depoimento da Família sobre a Visita:</label>
                <textarea 
                  className="form-textarea" 
                  rows={4}
                  placeholder="Descreva o que a família relatou durante a visita ou atendimento telefônico (ex: percepção de mudança, estado emocional, comportamento, expectativas para reinserção...)"
                  value={newRelato.relato}
                  onChange={(e) => setNewRelato({ ...newRelato, relato: e.target.value })}
                  style={{ width: '100%', minHeight: '110px', padding: '0.75rem', fontSize: '0.9rem', lineHeight: 1.5, resize: 'vertical' }}
                  required
                ></textarea>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Parecer Técnico do Serviço Social:</label>
                <textarea 
                  className="form-textarea" 
                  rows={3}
                  value={newRelato.parecer}
                  onChange={(e) => setNewRelato({ ...newRelato, parecer: e.target.value })}
                  style={{ width: '100%', minHeight: '75px', padding: '0.75rem', fontSize: '0.9rem', lineHeight: 1.5, resize: 'vertical' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowRelatoModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Salvar Relato & Gerar Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Impressão: Ficha de Relato & Acompanhamento Familiar */}
      {showPrintRelatoModal && selectedRelatoPrint && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '800px', width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }} className="no-print">
              <span className="badge badge-success">Pronto para Impressão</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={16} /> Imprimir Relato Oficial
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowPrintRelatoModal(false)}>
                  <X size={16} /> Fechar
                </button>
              </div>
            </div>

            <div className="printable-document">
              <div className="printable-header">
                <h2>FUNDAÇÃO DOUTOR JESUS</h2>
                <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                  SERVIÇO SOCIAL & REDE FAMILIAR — REGISTRO DE RELATO E PARECER TÉCNICO
                </p>
                <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Candeias / BA | Data do Registro: {selectedRelatoPrint.data}
                </p>
              </div>

              {/* Resident Header Box */}
              <div style={{ display: 'flex', gap: '1rem', background: '#f8fafc', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '1.25rem', alignItems: 'center' }}>
                <img 
                  src={selectedAcolhido.foto} 
                  alt={selectedAcolhido.nome} 
                  style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0284c7' }} 
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{selectedAcolhido.nome}</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#475569' }}>
                    <strong>CPF:</strong> {selectedAcolhido.cpf} | <strong>Alojamento:</strong> {selectedAcolhido.alojamento} ({selectedAcolhido.leito})
                  </p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>
                    Convênio MROSC: {selectedAcolhido.termoMROSC}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.35rem', margin: '0 0 0.5rem 0' }}>
                  1. IDENTIFICAÇÃO DO FAMILIAR ENTREVISTADO
                </h4>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                  • <strong>Familiar Responsável:</strong> {selectedRelatoPrint.familiar}<br />
                  • <strong>Técnico Entrevistador:</strong> {selectedRelatoPrint.profissional}
                </p>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.35rem', margin: '0 0 0.5rem 0' }}>
                  2. DEPOIMENTO E RELATO ÍNTEGRA DA FAMÍLIA
                </h4>
                <div style={{ background: '#ffffff', padding: '1rem', border: '1px dashed #94a3b8', borderRadius: '6px', fontSize: '0.85rem', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "{selectedRelatoPrint.resumo}"
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.35rem', margin: '0 0 0.5rem 0' }}>
                  3. PARECER TÉCNICO E ENCAMINHAMENTOS DO SERVIÇO SOCIAL
                </h4>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {selectedRelatoPrint.parecer || 'Atendimento realizado conforme protocolos do Serviço Social com manutenção do acompanhamento familiar.'}
                </p>
              </div>

              <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '0.85rem' }}>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem' }}>
                    <strong>{selectedRelatoPrint.profissional}</strong><br />
                    Serviço Social — CRESS
                  </div>
                </div>

                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem' }}>
                    <strong>{selectedRelatoPrint.familiar}</strong><br />
                    Assinatura do Familiar Entrevistado
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
