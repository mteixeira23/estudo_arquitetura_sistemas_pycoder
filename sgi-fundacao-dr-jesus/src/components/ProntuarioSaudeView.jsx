import React, { useState } from 'react';
import { 
  Stethoscope, 
  Pill, 
  FileHeart, 
  Hospital, 
  Plus, 
  CheckCircle, 
  Clock, 
  User, 
  AlertTriangle,
  HeartPulse,
  Printer,
  X,
  Syringe,
  FileCheck,
  Calendar,
  AlertCircle,
  Activity,
  CheckCircle2,
  ShieldAlert,
  Target,
  Siren,
  Sparkles,
  UtensilsCrossed,
  Smile,
  ChevronRight,
  Edit,
  Trash2
} from 'lucide-react';
import { INITIAL_PROCEDIMENTOS_ODONTO, INITIAL_MEDICAMENTOS_CATALOGO } from '../mockData';

export default function ProntuarioSaudeView({ acolhidos, profissionais = [], procedimentosOdonto = [], medicamentosCatalogo = [], activeSubTab, setActiveSubTab }) {
  const [selectedAcolhidoId, setSelectedAcolhidoId] = useState(acolhidos[0].id);
  const selectedAcolhido = acolhidos.find(a => a.id === selectedAcolhidoId) || acolhidos[0];

  // Current Subtab logic
  const currentSubTab = activeSubTab || 'resumo';

  // Modals State
  const [showNewMedModal, setShowNewMedModal] = useState(false);
  const [showEncaminhamentoModal, setShowEncaminhamentoModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [selectedEncaminhamentoPrint, setSelectedEncaminhamentoPrint] = useState(null);

  // Dental Modal State (Subtab 5)
  const [showOdontoModal, setShowOdontoModal] = useState(false);
  const [editingOdontoId, setEditingOdontoId] = useState(null);
  const [odontoForm, setOdontoForm] = useState({
    procedimento: '',
    dentista: 'Dr. Lucas Silveira (CRO-BA 8492)',
    data: new Date().toISOString().split('T')[0],
    status: 'Agendado'
  });

  // Filter State for Evolutions Feed
  const [filterEspecialidade, setFilterEspecialidade] = useState('Todas');

  // Real Medical Repository mapped per resident
  const getMedicalRecordsForResident = (resident) => {
    if (resident.id === 'FDJ-2026-0891') {
      // Antonio Carlos da Silva Filho
      return {
        pti: {
          faseAtual: 'Fase 3: Reinserção Social & Familiar',
          progresso: 85,
          dataInicio: '2026-02-10',
          previsaoAlta: '2026-11-10',
          meta1: 'Adaptação à convivência comunitária no Bloco A (Concluída)',
          meta2: 'Liderança e capacitação na Laborterapia da Padaria (Concluída)',
          meta3: 'Passe Terapêutico de Fim de Semana com a mãe Dona Maria das Graças (Agendado)'
        },
        meds: [
          { id: 101, nome: 'Complexo B', dose: '1 cp no almoço (12:00)', prescritor: 'Dra. Patricia S. (CRM-BA 22910 - Clínica Geral)', administrado: true, horario: '12:00', frequencia: 'Diário' },
          { id: 102, nome: 'Sertralina 50mg', dose: '1 cp pela manhã (08:00)', prescritor: 'Dr. Roberto M. (CRM-BA 14820 - Psiquiatra)', administrado: true, horario: '08:00', frequencia: 'Diário' },
          { id: 103, nome: 'Clonazepam 2mg', dose: '1 cp à noite (22:00)', prescritor: 'Dr. Roberto M. (CRM-BA 14820 - Psiquiatra)', administrado: true, horario: '22:00', frequencia: 'Diário' }
        ],
        odonto: [
          { id: 1, procedimento: 'Restauração Estética Superior (Dentes 11 e 21)', data: '2026-08-10', dentista: 'Dr. Lucas Silveira (CRO-BA 8492)', status: 'Concluído' },
          { id: 2, procedimento: 'Moldagem para Prótese Parcial Removível', data: '2026-08-15', dentista: 'Dra. Camila Ramos (CRO-BA 10240)', status: 'Em Andamento' }
        ],
        evolucoes: [
          {
            id: 1,
            data: '2026-08-12 14:30',
            profissional: 'Dra. Fernanda Matos (Psicóloga - CRP 03/14820)',
            tipo: 'Psicologia',
            texto: 'Antonio Carlos apresentou excelente evolução na Fase 3 do PTI, atuando com liderança na Padaria da Fundação. Relata 6 meses de abstinência total de crack/álcool e fortalecimento dos laços com a mãe Dona Maria das Graças.'
          },
          {
            id: 2,
            data: '2026-08-08 09:15',
            profissional: 'Enf. Juliana Ramos (COREN-BA 20491)',
            tipo: 'Enfermagem',
            texto: 'Atendimento de rotina. Sinais vitais estáveis (PA 120x80 mmHg, FC 76 bpm, Glicemia 94 mg/dL). Dieta especial sem lactose mantida rigorosamente pela Cozinha Industrial.'
          },
          {
            id: 3,
            data: '2026-08-05 11:00',
            profissional: 'AS Valéria Costa (CRESS-BA 4912)',
            tipo: 'Serviço Social',
            texto: 'Entrevista social presencial com a mãe Dona Maria das Graças. Família estruturada e pronta para acolhê-lo no Passe Terapêutico de Fim de Semana.'
          }
        ],
        intercorrencias: [
          {
            id: 'EMG-101',
            data: '2026-02-12 21:00',
            tipo: 'Abstinência leve na admissão (Tremor nas mãos)',
            atendimento: 'Atendido no Posto Médico FDJ (Enfermagem)',
            remocao: 'Sem remoção externa (Tratamento no local)',
            status: 'Resolvido (Estabilizado)'
          }
        ]
      };
    } else {
      // General Fallback
      return {
        pti: {
          faseAtual: 'Fase 1: Desintoxicação & Adaptação',
          progresso: 35,
          dataInicio: resident.dataEntrada || '2026-08-14',
          previsaoAlta: '2027-05-14',
          meta1: 'Acompanhamento clínico de admissão e acolhimento voluntário (Em Andamento)',
          meta2: 'Adesão à rotina de alojamento e regras da Fundação Dr. Jesus (Agendado)',
          meta3: 'Início das atividades de suporte psicossocial e espiritualidade (Agendado)'
        },
        meds: [
          { id: 201, nome: 'Complexo B + Suplementação', dose: '1 cp no almoço (12:00)', prescritor: 'Dra. Patricia S. (Clínica Geral)', administrado: false, horario: '12:00', frequencia: 'Diário' }
        ],
        odonto: [
          { id: 1, procedimento: 'Avaliação Odontológica de Admissão', data: '2026-08-20', dentista: 'Dr. Lucas Silveira (CRO-BA 8492)', status: 'Agendado' }
        ],
        evolucoes: [
          {
            id: 1,
            data: `${resident.dataEntrada || '2026-08-14'} 10:00`,
            profissional: 'Enf. Juliana Ramos (COREN-BA 20491)',
            tipo: 'Enfermagem',
            texto: `Acolhimento de saúde registrado. Sinais vitais de entrada estáveis. Histórico de substância principal: ${resident.substanciaPrincipal}. Dieta alocada: ${resident.restricaoAlimentar || 'Geral (Sem Restrição)'}.`
          },
          {
            id: 2,
            data: `${resident.dataEntrada || '2026-08-14'} 11:30`,
            profissional: 'AS Valéria Costa (CRESS-BA 4912)',
            tipo: 'Serviço Social',
            texto: `Cadastro de admissão voluntária concluído. Pertences devidamente custodiados no cofre central e acolhido encaminhado ao ${resident.alojamento} (${resident.leito}).`
          }
        ],
        intercorrencias: []
      };
    }
  };

  const currentRecords = getMedicalRecordsForResident(selectedAcolhido);

  // Dynamic States initialized for the selected resident
  const [medsList, setMedsList] = useState(currentRecords.meds);
  const [odontoList, setOdontoList] = useState(currentRecords.odonto);
  const [evolucoesList, setEvolucoesList] = useState(currentRecords.evolucoes);
  const [intercorrenciasList, setIntercorrenciasList] = useState(currentRecords.intercorrencias);
  const [newNota, setNewNota] = useState('');
  const [newTipo, setNewTipo] = useState('Serviço Social');

  // Medication Filter & Editing States
  const [selectedHorarioFilter, setSelectedHorarioFilter] = useState('Todos');
  const [editingMedId, setEditingMedId] = useState(null);

  // Form State for Prescribing Medication
  const [newMedData, setNewMedData] = useState({
    nome: '',
    dose: '',
    horario: '08:00',
    prescritor: 'Dr. Roberto M. (CRM-BA 14820 - Psiquiatra)',
    via: 'Via Oral (VO)',
    tipo: 'Uso Contínuo'
  });

  // Form State for Emergency Registration
  const [newEmergency, setNewEmergency] = useState({
    tipo: 'Síndrome de Abstinência Aguda / Pico PA',
    atendimento: 'Atendido na Enfermaria FDJ + Acionamento SAMU 192',
    remocao: 'UPA 24h Candeias'
  });

  const [showEvaluatorModal, setShowEvaluatorModal] = useState(false);
  const [ptiState, setPtiState] = useState(currentRecords.pti);
  const [evaluatorForm, setEvaluatorForm] = useState({
    profissional: 'Dra. Fernanda Matos (Psicóloga - CRP 03/14820)',
    fase: currentRecords.pti.faseAtual,
    progresso: currentRecords.pti.progresso,
    parecer: ''
  });

  // Update lists when selected resident changes
  React.useEffect(() => {
    const recs = getMedicalRecordsForResident(selectedAcolhido);
    setMedsList(recs.meds);
    setOdontoList(recs.odonto);
    setEvolucoesList(recs.evolucoes);
    setIntercorrenciasList(recs.intercorrencias);
    setPtiState(recs.pti);
    setEvaluatorForm({
      profissional: 'Dra. Fernanda Matos (Psicóloga - CRP 03/14820)',
      fase: recs.pti.faseAtual,
      progresso: recs.pti.progresso,
      parecer: ''
    });
  }, [selectedAcolhidoId]);

  const handleToggleMed = (medId) => {
    setMedsList(prev => prev.map(m => m.id === medId ? { ...m, administrado: !m.administrado } : m));
  };

  const handleAddEvolucao = (e) => {
    e.preventDefault();
    if (!newNota) return;

    const newEntry = {
      id: Date.now(),
      data: new Date().toLocaleString('pt-BR'),
      profissional: `${newTipo} (Profissional Logado)`,
      tipo: newTipo,
      texto: newNota
    };

    setEvolucoesList([newEntry, ...evolucoesList]);
    setNewNota('');
  };

  const handleSaveOdonto = (e) => {
    e.preventDefault();
    if (!odontoForm.procedimento) return;

    if (editingOdontoId) {
      setOdontoList(odontoList.map(od => od.id === editingOdontoId ? { ...od, ...odontoForm } : od));
    } else {
      const newItem = {
        id: Date.now(),
        ...odontoForm
      };
      setOdontoList([newItem, ...odontoList]);
    }
    setShowOdontoModal(false);
  };

  const filteredEvolucoes = filterEspecialidade === 'Todas' 
    ? evolucoesList 
    : evolucoesList.filter(ev => ev.tipo === filterEspecialidade);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header Bar */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">Módulo 8</span>
            <span className="badge badge-success">PTI (RDC 29 ANVISA) • Prontuário Específico por Acolhido</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>
            Prontuário Multidisciplinar, PTI & Emergências Médicas
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Plano Terapêutico Individualizado (PTI), prescrição de medicação, acompanhamento odontológico e evoluções clínicas.
          </p>
        </div>

        {/* Resident Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(20, 184, 166, 0.1)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-highlight)' }}>
            <User size={18} style={{ color: 'var(--primary)' }} />
            <select 
              className="form-select"
              value={selectedAcolhidoId}
              onChange={(e) => setSelectedAcolhidoId(e.target.value)}
              style={{ minWidth: '280px', fontWeight: 600, fontSize: '0.85rem' }}
            >
              {acolhidos.map(a => (
                <option key={a.id} value={a.id}>
                  {a.nome} ({a.id}) - {a.leito}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Patient Main Summary Banner (Always Persistent) */}
      <div className="card" style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderLeft: '4px solid var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img 
            src={selectedAcolhido.foto} 
            alt={selectedAcolhido.nome} 
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>
                {selectedAcolhido.nome}
              </h3>
              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                {selectedAcolhido.status}
              </span>
              <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                <UtensilsCrossed size={12} /> {selectedAcolhido.restricaoAlimentar || 'Dieta Geral (Sem Restrição)'}
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0 }}>
              <strong style={{ color: '#0f172a' }}>{selectedAcolhido.id}</strong> • CPF: {selectedAcolhido.cpf} • NIS: {selectedAcolhido.numeroNIS || '128.49012.88-0'} • Alojamento: <strong style={{ color: '#0f172a' }}>{selectedAcolhido.alojamento} ({selectedAcolhido.leito})</strong>
            </p>
            <p style={{ fontSize: '0.8rem', color: '#1d4ed8', margin: '4px 0 0 0', fontWeight: 700 }}>
              Substância: {selectedAcolhido.substanciaPrincipal} ({selectedAcolhido.tempoUso}) • Origem: {selectedAcolhido.municipioOrigem}
            </p>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: Resumo do Prontuário & Ficha Clínica */}
      {(currentSubTab === 'resumo' || currentSubTab === 'todos') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-3">
            <div className="card" style={{ borderLeft: '4px solid #059669', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                PTI (RDC 29 ANVISA)
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                {ptiState.faseAtual.split(':')[0]} ({ptiState.progresso}%)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Previsão Alta: {ptiState.previsaoAlta}
              </div>
              {setActiveSubTab && (
                <button className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem', width: '100%', fontSize: '0.75rem' }} onClick={() => setActiveSubTab('pti')}>
                  Ver PTI Completo <ChevronRight size={14} />
                </button>
              )}
            </div>

            <div className="card" style={{ borderLeft: '4px solid #2563eb', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Medicamentos Prescritos
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d4ed8', marginTop: '4px' }}>
                {medsList.length} Medicamentos
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {medsList.filter(m => m.administrado).length} Dose(s) Ministrada(s) Hoje
              </div>
              {setActiveSubTab && (
                <button className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem', width: '100%', fontSize: '0.75rem' }} onClick={() => setActiveSubTab('meds')}>
                  Ver Aprazamento <ChevronRight size={14} />
                </button>
              )}
            </div>

            <div className="card" style={{ borderLeft: '4px solid #d97706', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Evoluções Multidisciplinares
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
                {evolucoesList.length} Registros
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Última evolução: {evolucoesList[0]?.data || 'Hoje'}
              </div>
              {setActiveSubTab && (
                <button className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem', width: '100%', fontSize: '0.75rem' }} onClick={() => setActiveSubTab('evolucoes')}>
                  Ver Feed de Evoluções <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Plano Terapêutico (PTI RDC 29) */}
      {(currentSubTab === 'pti') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header Card & Actions */}
          <div className="card" style={{ borderLeft: '4px solid var(--primary)', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <Target size={22} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>
                    2. Plano Terapêutico Individualizado (PTI — ANVISA RDC nº 29/2011)
                  </h3>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                  Acompanhamento contínuo da jornada de reabilitação psicossocial e transição de fases.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="badge badge-warning" style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}>
                  📅 Previsão de Alta: <strong>{ptiState.previsaoAlta}</strong>
                </span>
                <button className="btn btn-primary btn-sm" onClick={() => setShowEvaluatorModal(true)} style={{ boxShadow: '0 2px 8px rgba(5,150,105,0.3)' }}>
                  <Sparkles size={15} /> Avaliar & Evoluir Fase do PTI
                </button>
              </div>
            </div>

            {/* Overall Progress Indicator */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                <span style={{ color: 'var(--primary)' }}>Status Atual: <strong>{ptiState.faseAtual}</strong></span>
                <span style={{ color: 'var(--text-main)' }}>Progresso Geral do PTI: <strong>{ptiState.progresso}%</strong></span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#cbd5e1', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${ptiState.progresso}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #0284c7)', borderRadius: '5px', transition: 'width 0.4s ease' }}></div>
              </div>
            </div>

            {/* Visual Step Stepper Timeline (3 Phase Nodes) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', padding: '0.5rem 0.5rem 1rem 0.5rem' }}>
              {/* Horizontal Connecting Line */}
              <div style={{ position: 'absolute', top: '28px', left: '10%', right: '10%', height: '4px', background: '#e2e8f0', zIndex: 1 }}></div>

              {/* Step 1 */}
              <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
                <div style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  background: ptiState.progresso >= 33 ? '#10b981' : '#cbd5e1', 
                  color: '#fff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  boxShadow: ptiState.progresso >= 33 ? '0 0 0 4px rgba(16, 185, 129, 0.2)' : 'none'
                }}>
                  {ptiState.progresso >= 33 ? <CheckCircle2 size={24} /> : '1'}
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', marginTop: '0.6rem' }}>Etapa 1: Desintoxicação</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>0 a 3 Meses</div>
                <span className="badge badge-success" style={{ marginTop: '0.35rem', fontSize: '0.65rem' }}>✓ Concluída</span>
              </div>

              {/* Step 2 */}
              <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
                <div style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  background: ptiState.faseAtual.includes('Fase 2') || ptiState.progresso >= 66 ? '#0284c7' : '#cbd5e1', 
                  color: '#fff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  boxShadow: ptiState.faseAtual.includes('Fase 2') ? '0 0 0 4px rgba(2, 132, 199, 0.25)' : 'none'
                }}>
                  {ptiState.progresso >= 66 ? <CheckCircle2 size={24} /> : '2'}
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', marginTop: '0.6rem' }}>Etapa 2: Conscientização</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3 a 6 Meses</div>
                <span className={`badge ${ptiState.faseAtual.includes('Fase 2') ? 'badge-primary' : ptiState.progresso >= 66 ? 'badge-success' : 'badge-outline'}`} style={{ marginTop: '0.35rem', fontSize: '0.65rem' }}>
                  {ptiState.faseAtual.includes('Fase 2') ? '⏳ Em Andamento' : ptiState.progresso >= 66 ? '✓ Concluída' : 'Pendente'}
                </span>
              </div>

              {/* Step 3 */}
              <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
                <div style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  background: ptiState.faseAtual.includes('Fase 3') ? '#d97706' : '#cbd5e1', 
                  color: '#fff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  boxShadow: ptiState.faseAtual.includes('Fase 3') ? '0 0 0 4px rgba(217, 119, 6, 0.25)' : 'none'
                }}>
                  {ptiState.progresso >= 100 ? <CheckCircle2 size={24} /> : '3'}
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', marginTop: '0.6rem' }}>Etapa 3: Reinserção Social</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>6 a 9 Meses</div>
                <span className={`badge ${ptiState.faseAtual.includes('Fase 3') ? 'badge-warning' : 'badge-outline'}`} style={{ marginTop: '0.35rem', fontSize: '0.65rem' }}>
                  {ptiState.faseAtual.includes('Fase 3') ? '🚀 Fase Final' : '⌛ Agendada'}
                </span>
              </div>
            </div>
          </div>

          {/* Cards Detalhados das 3 Fases Terapêuticas */}
          <div className="grid-3">
            {/* Card Fase 1 */}
            <div className="card" style={{ borderTop: '4px solid #10b981', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#047857', margin: 0, fontWeight: 800 }}>
                  Fase 1: Desintoxicação & Adaptação
                </h4>
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Concluído</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#334155', margin: 0, lineHeight: 1.4 }}>
                <strong>Meta ANVISA:</strong> Estabilização clínica, exames de sangue/sorologia e adesão às normas de alojamento.
              </p>
              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', background: '#f0fdf4', padding: '0.5rem', borderRadius: '6px', border: '1px solid #bbf7d0', color: '#166534' }}>
                ✓ {currentRecords.pti.meta1}
              </div>
            </div>

            {/* Card Fase 2 */}
            <div className="card" style={{ borderTop: '4px solid #0284c7', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#0369a1', margin: 0, fontWeight: 800 }}>
                  Fase 2: Conscientização & Laborterapia
                </h4>
                <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Fase Atual</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#334155', margin: 0, lineHeight: 1.4 }}>
                <strong>Meta ANVISA:</strong> Participação ativa em oficinas laboratoriais (Padaria/Horta), apoio psicológico e assiduidade.
              </p>
              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', background: '#eff6ff', padding: '0.5rem', borderRadius: '6px', border: '1px solid #bfdbfe', color: '#1e40af' }}>
                ⏳ {currentRecords.pti.meta2}
              </div>
            </div>

            {/* Card Fase 3 */}
            <div className="card" style={{ borderTop: '4px solid #d97706', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#b45309', margin: 0, fontWeight: 800 }}>
                  Fase 3: Reinserção Social & Familiar
                </h4>
                <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Finalização</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#334155', margin: 0, lineHeight: 1.4 }}>
                <strong>Meta ANVISA:</strong> Vínculo com a família, aprovação de passeios terapêuticos de fim de semana e autonomia.
              </p>
              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', background: '#fffbeb', padding: '0.5rem', borderRadius: '6px', border: '1px solid #fde68a', color: '#92400e' }}>
                ⌛ {currentRecords.pti.meta3}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Aprazamento de Medicamentos (Enfermagem & Farmácia) */}
      {(currentSubTab === 'meds') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header Card with KPIs & Action Button */}
          <div className="card" style={{ borderLeft: '4px solid var(--primary)', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <Pill size={22} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>
                    3. Aprazamento de Medicamentos & Controle de Enfermagem
                  </h3>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                  Escala de administração diária de fármacos, aprazamento por horários e checagem do COREN-BA.
                </p>
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => {
                setEditingMedId(null);
                setNewMedData({ nome: '', dose: '', horario: '08:00', prescritor: 'Dr. Roberto M. (CRM-BA 14820 - Psiquiatra)', via: 'Via Oral (VO)', tipo: 'Uso Contínuo' });
                setShowNewMedModal(true);
              }} style={{ boxShadow: '0 2px 8px rgba(2,132,199,0.3)' }}>
                <Plus size={15} /> Prescrever Medicamento
              </button>
            </div>

            {/* KPI Metrics Cards */}
            <div className="grid-4" style={{ gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Total de Prescrições</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{medsList.length}</div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#047857', fontWeight: 700 }}>Doses Ministradas</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#047857' }}>
                  {medsList.filter(m => m.administrado).length} / {medsList.length}
                </div>
              </div>

              <div style={{ background: 'rgba(234, 179, 8, 0.08)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#b45309', fontWeight: 700 }}>Doses Pendentes</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#b45309' }}>
                  {medsList.filter(m => !m.administrado).length}
                </div>
              </div>

              <div style={{ background: 'rgba(2, 132, 199, 0.08)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#0369a1', fontWeight: 700 }}>Taxa de Adesão</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0369a1' }}>
                  {medsList.length > 0 ? Math.round((medsList.filter(m => m.administrado).length / medsList.length) * 100) : 100}%
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Time Filter Tabs */}
          <div className="card" style={{ padding: '0.75rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.5rem' }}>Filtrar Horário:</span>
              {['Todos', '08:00 (Manhã)', '12:00 (Almoço)', '18:00 (Noite)', '22:00 (Dormir)'].map(h => (
                <button
                  key={h}
                  onClick={() => setSelectedHorarioFilter(h.split(' ')[0])}
                  className={`btn btn-sm ${selectedHorarioFilter === h.split(' ')[0] ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Prescriptions List Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {medsList
              .filter(m => selectedHorarioFilter === 'Todos' || m.horario === selectedHorarioFilter)
              .map((m) => (
              <div 
                key={m.id}
                style={{
                  background: '#ffffff',
                  border: m.administrado ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                  borderLeft: m.administrado ? '5px solid #10b981' : '5px solid #f59e0b',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <h4 style={{ fontSize: '1rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>
                      {m.nome}
                    </h4>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>🕒 {m.horario}</span>
                    <span className={`badge ${m.tipo?.includes('Psicotrópico') ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '0.65rem' }}>
                      {m.tipo || 'Uso Contínuo'}
                    </span>
                    <span className="badge badge-outline" style={{ fontSize: '0.65rem' }}>{m.via || 'Via Oral (VO)'}</span>
                  </div>
                  
                  <div style={{ fontSize: '0.825rem', color: '#334155', margin: '4px 0 2px 0' }}>
                    <strong>Posologia:</strong> {m.dose}
                  </div>
                  
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Prescritor: <strong style={{ color: 'var(--primary)' }}>{m.prescritor}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    className={`btn btn-sm ${m.administrado ? 'btn-success' : 'btn-primary'}`}
                    onClick={() => handleToggleMed(m.id)}
                    style={{ gap: '0.35rem', fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                  >
                    <CheckCircle2 size={16} /> {m.administrado ? '✓ Ministrado (Checado)' : 'Confirmar Dose'}
                  </button>

                  <button className="btn btn-secondary btn-sm" onClick={() => {
                    setEditingMedId(m.id);
                    setNewMedData({
                      nome: m.nome,
                      dose: m.dose,
                      horario: m.horario,
                      prescritor: m.prescritor,
                      via: m.via || 'Via Oral (VO)',
                      tipo: m.tipo || 'Uso Contínuo'
                    });
                    setShowNewMedModal(true);
                  }} title="Editar Prescrição">
                    <Edit size={14} />
                  </button>

                  <button className="btn btn-danger btn-sm" onClick={() => {
                    if (window.confirm('Deseja excluir esta prescrição de medicamento?')) {
                      setMedsList(medsList.filter(x => x.id !== m.id));
                    }
                  }} title="Excluir Prescrição">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: Feed de Evoluções Clínicas */}
      {(currentSubTab === 'evolucoes') && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 800 }}>
                4. Feed de Evoluções Multidisciplinares - {selectedAcolhido.nome}
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['Todas', 'Psicologia', 'Enfermagem', 'Psiquiatria', 'Serviço Social'].map((esp) => (
                <button 
                  key={esp}
                  onClick={() => setFilterEspecialidade(esp)}
                  className={`btn btn-sm ${filterEspecialidade === esp ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem' }}
                >
                  {esp}
                </button>
              ))}
            </div>
          </div>

          {/* New Evolution Form */}
          <form onSubmit={handleAddEvolucao} style={{ marginBottom: '1.25rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <select 
                className="form-select" 
                value={newTipo}
                onChange={(e) => setNewTipo(e.target.value)}
                style={{ width: '180px', fontSize: '0.8rem' }}
              >
                <option value="Psicologia">Evolução: Psicologia</option>
                <option value="Enfermagem">Evolução: Enfermagem</option>
                <option value="Serviço Social">Evolução: Serviço Social</option>
                <option value="Psiquiatria">Evolução: Psiquiatria</option>
              </select>

              <input 
                type="text"
                className="form-input"
                placeholder="Digite o parecer técnico da evolução clínica do acolhido..."
                value={newNota}
                onChange={(e) => setNewNota(e.target.value)}
                style={{ flex: 1, fontSize: '0.85rem' }}
              />

              <button type="submit" className="btn btn-primary btn-sm">
                <Plus size={16} /> Salvar Parecer
              </button>
            </div>
          </form>

          {/* Timeline List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredEvolucoes.map((ev) => (
              <div 
                key={ev.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderLeft: '4px solid var(--primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{ev.tipo}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{ev.profissional}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{ev.data}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                  {ev.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: Odontologia & Autoestima */}
      {(currentSubTab === 'odonto') && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Smile size={20} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 800 }}>
                5. Odontologia Terapêutica & Autoestima
              </h3>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Gabinete Odontológico FDJ</span>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setEditingOdontoId(null);
                  setOdontoForm({
                    procedimento: '',
                    dentista: 'Dr. Lucas Silveira (CRO-BA 8492)',
                    data: new Date().toISOString().split('T')[0],
                    status: 'Agendado'
                  });
                  setShowOdontoModal(true);
                }}
              >
                <Plus size={14} /> + Agendar Atendimento Odontológico
              </button>
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Acompanhamento de restaurações estéticas, próteses e recuperação do sorriso para reinserção social.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {odontoList.map((od) => (
              <div 
                key={od.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: '#0f172a', margin: '0 0 0.2rem 0', fontWeight: 700 }}>
                    {od.procedimento}
                  </h4>
                  <p style={{ fontSize: '0.775rem', color: '#475569', margin: 0 }}>
                    Cirurgião: {od.dentista} • Data: {od.data}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={`badge ${od.status === 'Concluído' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                    {od.status}
                  </span>

                  <button 
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.75rem', gap: '0.25rem' }}
                    onClick={() => {
                      setEditingOdontoId(od.id);
                      setOdontoForm({
                        procedimento: od.procedimento,
                        dentista: od.dentista,
                        data: od.data,
                        status: od.status
                      });
                      setShowOdontoModal(true);
                    }}
                  >
                    <Edit size={14} /> Editar
                  </button>

                  <button 
                    className={`btn btn-sm ${od.status === 'Concluído' ? 'btn-success' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => {
                      setOdontoList(odontoList.map(item => item.id === od.id ? { ...item, status: item.status === 'Concluído' ? 'Em Andamento' : 'Concluído' } : item));
                    }}
                  >
                    {od.status === 'Concluído' ? '✓ Concluído' : 'Marcar Concluído'}
                  </button>

                  <button 
                    className="btn btn-outline btn-sm"
                    style={{ color: '#ef4444', borderColor: '#fca5a5', padding: '0.35rem 0.5rem' }}
                    onClick={() => {
                      if (window.confirm('Deseja excluir este atendimento odontológico?')) {
                        setOdontoList(odontoList.filter(item => item.id !== od.id));
                      }
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: Regulação SAMU 192 & Emergências */}
      {(currentSubTab === 'emergencias') && (
        <div className="card" style={{ borderLeft: '4px solid var(--status-danger)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Siren size={20} style={{ color: 'var(--status-danger)' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 800 }}>
                6. Regulação SAMU 192 & Intercorrências Hospitalares
              </h3>
            </div>

            <button className="btn btn-danger btn-sm" onClick={() => setShowEmergencyModal(true)}>
              <Siren size={14} /> + Registrar Ocorrência SAMU 192
            </button>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Registro de urgências médicas, chamados da Viatura 192 e remoções emergenciais para UPAs e Hospitais da Rede SUS.
          </p>

          {intercorrenciasList.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código Ocorrência</th>
                    <th>Data / Hora</th>
                    <th>Tipo de Intercorrência</th>
                    <th>Primeiros Socorros Enfermagem</th>
                    <th>Destino Remoção Externa</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {intercorrenciasList.map((emg) => (
                    <tr key={emg.id}>
                      <td style={{ fontWeight: 700, color: 'var(--status-danger)' }}>{emg.id}</td>
                      <td style={{ fontSize: '0.8rem' }}>{emg.data}</td>
                      <td style={{ fontWeight: 600 }}>{emg.tipo}</td>
                      <td style={{ fontSize: '0.8rem' }}>{emg.atendimento}</td>
                      <td>
                        <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                          <Hospital size={12} /> {emg.remocao}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>
                          {emg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px border #cbd5e1' }}>
              <CheckCircle size={32} style={{ color: '#10b981', marginBottom: '0.5rem' }} />
              <p style={{ fontWeight: 700, color: '#334155', margin: 0 }}>Nenhuma intercorrência grave ou chamado SAMU registrado para este acolhido.</p>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0' }}>Sinais vitais e estado de saúde estabilizados na Fundação.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal: Dental Procedure (Subtab 5) */}
      {showOdontoModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Smile size={20} style={{ color: 'var(--accent)' }} />
                <span className="badge badge-warning">
                  {editingOdontoId ? 'Editar Atendimento Odontológico' : 'Agendar Atendimento Odontológico'}
                </span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowOdontoModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveOdonto} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Procedimento Odontológico (Cadastro Homologado)</label>
                <select 
                  required 
                  className="form-select"
                  value={odontoForm.procedimento}
                  onChange={(e) => setOdontoForm({ ...odontoForm, procedimento: e.target.value })}
                >
                  <option value="">Selecione o procedimento pré-cadastrado...</option>
                  {(procedimentosOdonto && procedimentosOdonto.length > 0 ? procedimentosOdonto : INITIAL_PROCEDIMENTOS_ODONTO).map(p => (
                    <option key={p.id} value={p.nome}>
                      {p.nome} ({p.categoria})
                    </option>
                  ))}
                  <option value="Outro (Digitar)">+ Outro procedimento (Digitar)...</option>
                </select>
              </div>
              {odontoForm.procedimento === 'Outro (Digitar)' && (
                <div>
                  <label className="form-label">Especifique o Procedimento</label>
                  <input 
                    type="text"
                    required
                    className="form-input"
                    placeholder="Digite a especificação do procedimento..."
                    value={odontoForm.customProcedimento || ''}
                    onChange={(e) => setOdontoForm({ ...odontoForm, customProcedimento: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="form-label">Cirurgião Dentista Responsável</label>
                <select 
                  className="form-select"
                  value={odontoForm.dentista}
                  onChange={(e) => setOdontoForm({ ...odontoForm, dentista: e.target.value })}
                >
                  <option value="Dr. Lucas Silveira (CRO-BA 8492)">Dr. Lucas Silveira (CRO-BA 8492)</option>
                  <option value="Dra. Camila Ramos (CRO-BA 10240)">Dra. Camila Ramos (CRO-BA 10240)</option>
                  <option value="Dr. Fernando Souza (CRO-BA 12890)">Dr. Fernando Souza (CRO-BA 12890)</option>
                </select>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Data do Atendimento</label>
                  <input 
                    type="date" 
                    required
                    className="form-input"
                    value={odontoForm.data}
                    onChange={(e) => setOdontoForm({ ...odontoForm, data: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select"
                    value={odontoForm.status}
                    onChange={(e) => setOdontoForm({ ...odontoForm, status: e.target.value })}
                  >
                    <option value="Agendado">Agendado</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowOdontoModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary"><CheckCircle size={16} /> Salvar Atendimento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Medication Prescription */}
      {showNewMedModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-primary">
                {editingMedId ? 'Editar Prescrição Médica' : 'Nova Prescrição Médica (Aprazamento)'}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowNewMedModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newMedData.nome) return;
              if (editingMedId) {
                setMedsList(medsList.map(m => m.id === editingMedId ? { ...m, ...newMedData } : m));
              } else {
                const newM = {
                  id: Date.now(),
                  nome: newMedData.nome,
                  dose: newMedData.dose || '1 cp ao dia',
                  prescritor: newMedData.prescritor,
                  via: newMedData.via || 'Via Oral (VO)',
                  tipo: newMedData.tipo || 'Uso Contínuo',
                  administrado: false,
                  horario: newMedData.horario
                };
                setMedsList([...medsList, newM]);
              }
              setShowNewMedModal(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Medicamento Cadastrado na Farmácia</label>
                <select 
                  required 
                  className="form-select"
                  value={newMedData.nome}
                  onChange={(e) => {
                    const val = e.target.value;
                    const found = (medicamentosCatalogo && medicamentosCatalogo.length > 0 ? medicamentosCatalogo : INITIAL_MEDICAMENTOS_CATALOGO).find(m => m.nome === val);
                    if (found) {
                      setNewMedData({ 
                        ...newMedData, 
                        nome: found.nome, 
                        dose: found.dosagemPadrao || newMedData.dose, 
                        via: found.viaPadrao || newMedData.via,
                        tipo: found.controle?.includes('Portaria 344') ? '⚠️ Psicotrópico (Portaria 344)' : 'Uso Contínuo'
                      });
                    } else {
                      setNewMedData({ ...newMedData, nome: val });
                    }
                  }}
                >
                  <option value="">Selecione o medicamento pré-cadastrado...</option>
                  {(medicamentosCatalogo && medicamentosCatalogo.length > 0 ? medicamentosCatalogo : INITIAL_MEDICAMENTOS_CATALOGO).map(m => (
                    <option key={m.id} value={m.nome}>
                      {m.nome} ({m.categoria})
                    </option>
                  ))}
                  <option value="Outro (Digitar)">+ Outro medicamento (Digitar)...</option>
                </select>
              </div>
              {newMedData.nome === 'Outro (Digitar)' && (
                <div>
                  <label className="form-label">Especifique o Nome do Medicamento</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    placeholder="Digite o nome do medicamento..."
                    value={newMedData.customNome || ''}
                    onChange={(e) => setNewMedData({ ...newMedData, customNome: e.target.value })}
                  />
                </div>
              )}

              <div className="grid-2">
                <div>
                  <label className="form-label">Posologia / Instruções</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="Ex: 1 cp no almoço (12:00)"
                    value={newMedData.dose}
                    onChange={(e) => setNewMedData({ ...newMedData, dose: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Via de Administração</label>
                  <select 
                    className="form-select"
                    value={newMedData.via}
                    onChange={(e) => setNewMedData({ ...newMedData, via: e.target.value })}
                  >
                    <option value="Via Oral (VO)">Via Oral (VO)</option>
                    <option value="Sublingual (SL)">Sublingual (SL)</option>
                    <option value="Injetável / IM">Injetável / IM</option>
                    <option value="Tópico / Pomada">Tópico / Pomada</option>
                    <option value="Ocular / Colírio">Ocular / Colírio</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Horário de Aprazamento</label>
                  <select 
                    className="form-select"
                    value={newMedData.horario}
                    onChange={(e) => setNewMedData({ ...newMedData, horario: e.target.value })}
                  >
                    <option value="08:00">08:00 (Manhã)</option>
                    <option value="12:00">12:00 (Almoço)</option>
                    <option value="18:00">18:00 (Noite)</option>
                    <option value="22:00">22:00 (Dormir)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Categoria do Fármaco</label>
                  <select 
                    className="form-select"
                    value={newMedData.tipo}
                    onChange={(e) => setNewMedData({ ...newMedData, tipo: e.target.value })}
                  >
                    <option value="Uso Contínuo">Uso Contínuo</option>
                    <option value="⚠️ Psicotrópico (Portaria 344)">⚠️ Psicotrópico (Portaria 344)</option>
                    <option value="🥗 Suplementação">🥗 Suplementação</option>
                    <option value="Antibiótico / Ciclo">Antibiótico / Ciclo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Médico Prescritor (Corpo Clínico Cadastrado)</label>
                <select 
                  required
                  className="form-select"
                  value={newMedData.prescritor}
                  onChange={(e) => setNewMedData({ ...newMedData, prescritor: e.target.value })}
                >
                  <option value="">Selecione o médico prescritor...</option>
                  {(profissionais && profissionais.length > 0 ? profissionais : [
                    { id: '1', nome: 'Dr. Roberto Magalhães', especialidade: 'Medicina / Psiquiatria', registroProfissional: 'CRM-BA 14.892' },
                    { id: '2', nome: 'Dra. Patricia Lima', especialidade: 'Clínica Geral', registroProfissional: 'CRM-BA 22.910' }
                  ]).map(p => (
                    <option key={p.id} value={`${p.nome} (${p.registroProfissional || p.registro || 'CRM-BA'})`}>
                      {p.nome} — {p.registroProfissional || p.registro || p.especialidade}
                    </option>
                  ))}
                  <option value="Outro médico (Digitar)">+ Outro médico prescritor (Digitar)...</option>
                </select>
              </div>
              {newMedData.prescritor === 'Outro médico (Digitar)' && (
                <div>
                  <label className="form-label">Especifique o Médico & CRM</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    placeholder="Ex: Dr. Carlos Mendes (CRM-BA 19.840)"
                    value={newMedData.customPrescritor || ''}
                    onChange={(e) => setNewMedData({ ...newMedData, customPrescritor: e.target.value })}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewMedModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary"><CheckCircle size={16} /> Salvar Prescrição</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: SAMU 192 Emergency Registration */}
      {showEmergencyModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Siren size={20} style={{ color: 'var(--status-danger)' }} />
                <span className="badge badge-danger">Registrar Intercorrência SAMU 192</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowEmergencyModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const newEmg = {
                id: `EMG-${Date.now().toString().slice(-4)}`,
                data: new Date().toLocaleString('pt-BR'),
                tipo: newEmergency.tipo,
                atendimento: newEmergency.atendimento,
                remocao: newEmergency.remocao,
                status: 'Encaminhado / Em Atendimento'
              };
              setIntercorrenciasList([newEmg, ...intercorrenciasList]);
              setShowEmergencyModal(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Acolhido Em Atendimento</label>
                <input type="text" disabled className="form-input" value={`${selectedAcolhido.nome} (${selectedAcolhido.id})`} />
              </div>

              <div>
                <label className="form-label">Tipo de Intercorrência de Saúde</label>
                <input 
                  type="text" 
                  required 
                  className="form-input"
                  placeholder="Ex: Síndrome de Abstinência Severa, Pico de PA, Crise Ansiosa"
                  value={newEmergency.tipo}
                  onChange={(e) => setNewEmergency({ ...newEmergency, tipo: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Primeiros Socorros & Atendimento de Enfermagem</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Ex: Aferição de SSVV na enfermaria + Chamado SAMU Viatura 04"
                  value={newEmergency.atendimento}
                  onChange={(e) => setNewEmergency({ ...newEmergency, atendimento: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Destino de Remoção Externa (UPA / Hospital)</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="Ex: UPA 24h Candeias ou HGE Salvador"
                  value={newEmergency.remocao}
                  onChange={(e) => setNewEmergency({ ...newEmergency, remocao: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEmergencyModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-danger"><Siren size={16} /> Confirmar Chamado & Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Evaluation & Phase Progression (ANVISA RDC 29/2011) */}
      {showEvaluatorModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={20} style={{ color: 'var(--primary)' }} />
                <span className="badge badge-primary">Comissão Multidisciplinar de Avaliação de PTI (RDC 29)</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowEvaluatorModal(false)}>
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              De acordo com a <strong>RDC 29/2011 da ANVISA</strong> e as normas da Fundação Dr. Jesus, a avaliação do PTI é realizada pela <strong>Equipe Multidisciplinar de Saúde e Serviço Social</strong>.
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              setPtiState({
                ...ptiState,
                faseAtual: evaluatorForm.fase,
                progresso: parseInt(evaluatorForm.progresso)
              });

              if (evaluatorForm.parecer) {
                const newEntry = {
                  id: Date.now(),
                  data: new Date().toLocaleString('pt-BR'),
                  profissional: evaluatorForm.profissional,
                  tipo: evaluatorForm.profissional.includes('Psicólog') ? 'Psicologia' : evaluatorForm.profissional.includes('Social') ? 'Serviço Social' : 'Psiquiatria',
                  texto: `[AVALIAÇÃO E EVOLUÇÃO DO PTI - RDC 29 ANVISA]: Transição para ${evaluatorForm.fase} com ${evaluatorForm.progresso}% de aproveitamento. Parecer Técnico: ${evaluatorForm.parecer}`
                };
                setEvolucoesList([newEntry, ...evolucoesList]);
              }

              setShowEvaluatorModal(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label className="form-label">Profissional Técnico Avaliador</label>
                <select 
                  className="form-select"
                  value={evaluatorForm.profissional}
                  onChange={(e) => setEvaluatorForm({ ...evaluatorForm, profissional: e.target.value })}
                >
                  {profissionais && profissionais.length > 0 ? (
                    profissionais.map(p => (
                      <option key={p.id} value={`${p.nome} (${p.cargo} - ${p.registroProfissional})`}>
                        {p.nome} ({p.cargo} - {p.registroProfissional})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Dra. Fernanda Matos (Psicóloga - CRP 03/14820)">Dra. Fernanda Matos (Psicóloga - CRP 03/14820)</option>
                      <option value="AS Valéria Costa (Assistente Social - CRESS-BA 4912)">AS Valéria Costa (Assistente Social - CRESS-BA 4912)</option>
                      <option value="Dr. Roberto Medeiros (Médico Psiquiatra - CRM-BA 14820)">Dr. Roberto Medeiros (Médico Psiquiatra - CRM-BA 14820)</option>
                      <option value="Enf. Juliana Ramos (Enfermeira Chefe - COREN-BA 20491)">Enf. Juliana Ramos (Enfermeira Chefe - COREN-BA 20491)</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Fase Terapêutica Aprovada</label>
                  <select 
                    className="form-select"
                    value={evaluatorForm.fase}
                    onChange={(e) => setEvaluatorForm({ ...evaluatorForm, fase: e.target.value })}
                  >
                    <option value="Fase 1: Desintoxicação & Adaptação">Fase 1: Desintoxicação & Adaptação (0 a 3 meses)</option>
                    <option value="Fase 2: Conscientização & Laborterapia">Fase 2: Conscientização & Laborterapia (3 a 6 meses)</option>
                    <option value="Fase 3: Reinserção Social & Familiar">Fase 3: Reinserção Social & Familiar (6 a 9 meses)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">% de Progresso Geral ({evaluatorForm.progresso}%)</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5"
                    className="form-input"
                    value={evaluatorForm.progresso}
                    onChange={(e) => setEvaluatorForm({ ...evaluatorForm, progresso: e.target.value })}
                    style={{ padding: 0 }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Parecer Técnico Multidisciplinar de Transição</label>
                <textarea 
                  className="form-input"
                  rows="3"
                  placeholder="Descreva a fundamentação técnica da avaliação do acolhido (avanços comportamentais, assiduidade na laborterapia, laço familiar)..."
                  value={evaluatorForm.parecer}
                  onChange={(e) => setEvaluatorForm({ ...evaluatorForm, parecer: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEvaluatorModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary"><CheckCircle size={16} /> Gravar Avaliação no Prontuário</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
