import React, { useState } from 'react';
import { 
  LogOut, 
  Award, 
  CheckCircle2, 
  Printer, 
  X, 
  Plus, 
  Lock, 
  PhoneCall, 
  HeartHandshake, 
  FileText, 
  ShieldCheck, 
  UserCheck,
  TrendingUp,
  Briefcase,
  Users,
  BarChart3
} from 'lucide-react';

// Lista Cadastrada de Destinos e Encaminhamentos Pós-Alta (MROSC & TCE-BA)
const DESTINOS_CADASTRAOS_ENCAMINHAMENTO = [
  'Retorno ao Convívio Familiar & Residência de Origem',
  'Inserção no Mercado de Trabalho (SineBahia / Parcerias)',
  'Marcenaria & Oficinas Produtivas FDJ / Autônomo',
  'Cursos Profissionalizantes SENAI / Capacitação Técnica',
  'Encaminhamento para Rede de Saúde / CAPS / Hospital',
  'Acompanhamento Pós-Alta com Padrinho / Egresso Mentor',
  'Transferência para Outra Unidade / Instituição Parceira',
  'Residência Familiar (Interior / Outro Estado)',
  'Desligamento sem Destino Confirmado (Evasão / Abandono)'
];

export default function DesligamentoReinsercaoView({ acolhidos = [], cofreDevolucoes = {}, onDevolverCofre, onUpdateAcolhidoStatus, activeSubTab, setActiveSubTab }) {
  const [selectedCofreAcolhido, setSelectedCofreAcolhido] = useState(null);
  const [selectedAcolhidoId, setSelectedAcolhidoId] = useState(acolhidos[0]?.id || '');
  const selectedAcolhido = acolhidos.find(a => a.id === selectedAcolhidoId) || acolhidos[0];

  const [showDesligamentoModal, setShowDesligamentoModal] = useState(false);
  const [showAltaCertificateModal, setShowAltaCertificateModal] = useState(false);
  const [showDevolucaoCofreModal, setShowDevolucaoCofreModal] = useState(false);
  const [showImpactoMROSCModal, setShowImpactoMROSCModal] = useState(false);
  const [showNewMentorModal, setShowNewMentorModal] = useState(false);
  const [showNewFollowUpModal, setShowNewFollowUpModal] = useState(false);
  const [newMentor, setNewMentor] = useState({ nome: '', tempoSobriedade: '2 anos', profissao: '', mentorados: '1 Acolhido' });
  const [newFollowUp, setNewFollowUp] = useState({ acolhidoNome: '', contato: 'Sobriedade Mantida', status: '🟢 Sobriedade & Reinserção Confirmadas' });

  // Sample Discharges History
  const [desligamentos, setDesligamentos] = useState([
    {
      id: 'DES-2026-01',
      data: '2026-08-10',
      acolhidoNome: 'Gerson Silva de Jesus',
      motivo: 'Alta Terapêutica por Conclusão do Programa (9 Meses)',
      destino: 'Retorno ao Convívio Familiar e Emprego em Marcenaria',
      pertencesDevolvidos: 'Envelope Cofre nº 082 (RG, CPF e R$ 120,00 devolvidos)',
      status: 'Alta Concluída com Sucesso'
    },
    {
      id: 'DES-2026-02',
      data: '2026-08-04',
      acolhidoNome: 'Lucas Oliveira Barreto',
      motivo: 'Desligamento Voluntário Pedido pelo Acolhido',
      destino: 'Residência Familiar (Subúrbio de Salvador)',
      pertencesDevolvidos: 'Envelope Cofre nº 041 devolvido mediante recibo',
      status: 'Desligamento Efetuado'
    }
  ]);

  // Sample Job Opportunities (SineBahia / SENAI)
  const [vagasEmprego, setVagasEmprego] = useState([
    { id: 1, cargo: 'Auxiliar de Padeiro', empresa: 'Padaria Modelo Candeias', parceiro: 'SineBahia Candeias', vagas: 3, requisitos: 'Formando Fase 3 PTI • Certificado Laborterapia (240h)', status: 'Aberto para Formandos FDJ' },
    { id: 2, cargo: 'Operador de Logística', empresa: 'Simões Filho Transportes', parceiro: 'SENAI / FDJ', vagas: 5, requisitos: 'Formando Fase 3 PTI • Certificado Laborterapia (240h)', status: 'Aberto para Formandos FDJ' }
  ]);

  // Vagas SineBahia / SENAI State
  const [showVagaModal, setShowVagaModal] = useState(false);
  const [editingVagaId, setEditingVagaId] = useState(null);
  const [vagaForm, setVagaForm] = useState({
    cargo: '',
    empresa: '',
    parceiro: 'SineBahia Candeias',
    vagas: 2,
    requisitos: 'Formando Fase 3 PTI • Certificado Laborterapia (240h)',
    status: 'Aberto para Formandos FDJ'
  });

  const [showEncaminharModal, setShowEncaminharModal] = useState(false);
  const [selectedVagaForEncaminhamento, setSelectedVagaForEncaminhamento] = useState(null);
  const [encaminhamentoForm, setEncaminhamentoForm] = useState({
    acolhidoId: acolhidos[0]?.id || '',
    dataEncaminhamento: new Date().toISOString().split('T')[0],
    observacoes: 'Acolhido qualificado nas oficinas de laborterapia e indicado pelo Serviço Social.'
  });

  const handleOpenNewVaga = () => {
    setEditingVagaId(null);
    setVagaForm({
      cargo: '',
      empresa: '',
      parceiro: 'SineBahia Candeias',
      vagas: 2,
      requisitos: 'Formando Fase 3 PTI • Certificado Laborterapia (240h)',
      status: 'Aberto para Formandos FDJ'
    });
    setShowVagaModal(true);
  };

  const handleEditVaga = (v) => {
    setEditingVagaId(v.id);
    setVagaForm({
      cargo: v.cargo,
      empresa: v.empresa,
      parceiro: v.parceiro,
      vagas: v.vagas,
      requisitos: v.requisitos || 'Formando Fase 3 PTI • Certificado Laborterapia (240h)',
      status: v.status
    });
    setShowVagaModal(true);
  };

  const handleDeleteVaga = (vId) => {
    if (window.confirm('Tem certeza que deseja excluir esta vaga do banco de parcerias?')) {
      setVagasEmprego(vagasEmprego.filter(v => v.id !== vId));
    }
  };

  const handleSaveVaga = (e) => {
    e.preventDefault();
    if (!vagaForm.cargo || !vagaForm.empresa) return;

    if (editingVagaId) {
      setVagasEmprego(vagasEmprego.map(v => v.id === editingVagaId ? {
        ...v,
        cargo: vagaForm.cargo,
        empresa: vagaForm.empresa,
        parceiro: vagaForm.parceiro,
        vagas: parseInt(vagaForm.vagas, 10) || 1,
        requisitos: vagaForm.requisitos,
        status: vagaForm.status
      } : v));
    } else {
      const newVaga = {
        id: Date.now(),
        cargo: vagaForm.cargo,
        empresa: vagaForm.empresa,
        parceiro: vagaForm.parceiro,
        vagas: parseInt(vagaForm.vagas, 10) || 1,
        requisitos: vagaForm.requisitos,
        status: vagaForm.status
      };
      setVagasEmprego([...vagasEmprego, newVaga]);
    }

    setShowVagaModal(false);
  };

  const handleOpenEncaminharModal = (v) => {
    setSelectedVagaForEncaminhamento(v);
    setEncaminhamentoForm({
      acolhidoId: acolhidos[0]?.id || '',
      dataEncaminhamento: new Date().toISOString().split('T')[0],
      observacoes: 'Acolhido qualificado nas oficinas de laborterapia e indicado pelo Serviço Social para a vaga.'
    });
    setShowEncaminharModal(true);
  };

  const handleConfirmEncaminhamento = (e) => {
    e.preventDefault();
    const ac = acolhidos.find(a => a.id === encaminhamentoForm.acolhidoId) || acolhidos[0];
    alert(`✅ Acolhido ${ac.nome} encaminhado com sucesso para a vaga de ${selectedVagaForEncaminhamento?.cargo} na empresa ${selectedVagaForEncaminhamento?.empresa}!\nGuia de encaminhamento gerada pelo Serviço Social FDJ.`);
    setShowEncaminharModal(false);
  };

  // Sample Sobriety Sponsors (Egressos Mentores)
  const [padrinhos, setPadrinhos] = useState([
    { id: 1, nome: 'Carlos Eduardo Souza', tempoSobriedade: '2 anos e 4 meses', profissao: 'Eletricista de Manutenção', mentorados: '3 Acolhidos na Fase 1' },
    { id: 2, nome: 'Roberto Nascimento', tempoSobriedade: '4 anos', profissao: 'Gerente de Loja', mentorados: '2 Acolhidos na Fase 2' }
  ]);

  // Sample Post-Care Follow-up (Pós-Acolhimento 30, 60, 90 dias)
  const [posAcolhimento, setPosAcolhimento] = useState([
    {
      id: 1,
      acolhidoNome: 'Gerson Silva de Jesus',
      dataAlta: '2026-08-10',
      contato30Dias: 'Sobriedade Mantida • Trabalhando em Marcenaria (Contato 14/08)',
      contato60Dias: 'Agendado para 10/10/2026',
      status: '🟢 Sobriedade & Reinserção Confirmadas'
    }
  ]);

  const [editingDesligamentoId, setEditingDesligamentoId] = useState(null);

  // Discharge Form State
  const [dischargeForm, setDischargeForm] = useState({
    data: new Date().toISOString().split('T')[0],
    acolhidoId: acolhidos[0]?.id || '',
    motivo: 'Alta Terapêutica por Conclusão do Programa (9 Meses)',
    destino: DESTINOS_CADASTRAOS_ENCAMINHAMENTO[0],
    status: 'Alta Concluída com Sucesso',
    observacao: 'Acolhido cumpriu com êxito todas as 3 fases do PTI.'
  });

  const handleOpenNewDesligamento = () => {
    setEditingDesligamentoId(null);
    setDischargeForm({
      data: new Date().toISOString().split('T')[0],
      acolhidoId: selectedAcolhido.id,
      motivo: 'Alta Terapêutica por Conclusão do Programa (9 Meses)',
      destino: DESTINOS_CADASTRAOS_ENCAMINHAMENTO[0],
      status: 'Alta Concluída com Sucesso',
      observacao: 'Acolhido cumpriu com êxito todas as 3 fases do PTI.'
    });
    setShowDesligamentoModal(true);
  };

  const handleEditDesligamento = (d) => {
    setEditingDesligamentoId(d.id);
    const targetAcolhido = acolhidos.find(a => a.nome === d.acolhidoNome);
    setDischargeForm({
      data: d.data || new Date().toISOString().split('T')[0],
      acolhidoId: targetAcolhido ? targetAcolhido.id : selectedAcolhido.id,
      motivo: d.motivo,
      destino: d.destino,
      status: d.status || 'Desligamento Efetuado',
      observacao: d.pertencesDevolvidos || ''
    });
    setShowDesligamentoModal(true);
  };

  const handleDeleteDesligamento = (id) => {
    if (window.confirm('Tem certeza que deseja cancelar e excluir este registro de desligamento?')) {
      setDesligamentos(desligamentos.filter(d => d.id !== id));
    }
  };

  const handleConfirmDischarge = (e) => {
    e.preventDefault();
    const ac = acolhidos.find(a => a.id === dischargeForm.acolhidoId) || selectedAcolhido;

    if (editingDesligamentoId) {
      setDesligamentos(desligamentos.map(d => d.id === editingDesligamentoId ? {
        ...d,
        data: dischargeForm.data,
        acolhidoNome: ac.nome,
        motivo: dischargeForm.motivo,
        destino: dischargeForm.destino,
        status: dischargeForm.status
      } : d));
    } else {
      const newEntry = {
        id: `DES-2026-0${desligamentos.length + 1}`,
        data: dischargeForm.data,
        acolhidoNome: ac.nome,
        motivo: dischargeForm.motivo,
        destino: dischargeForm.destino,
        pertencesDevolvidos: `Envelope Cofre devolvido com termo assinado por ${ac.nome}`,
        status: dischargeForm.status
      };

      if (onUpdateAcolhidoStatus) {
        onUpdateAcolhidoStatus(ac.id, 'Alta Terapêutica', 'Desalocado (Alta Concluída)', 'N/A');
      }

      setDesligamentos([newEntry, ...desligamentos]);
    }

    setShowDesligamentoModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner Header */}
      <div className="card">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">Módulo 4</span>
            <span className="badge badge-success">Altas • Empregabilidade • Mentoria de Padrinhos • TCE-BA</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>
            Desligamentos, Reinserção Social & Relatórios MROSC
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Altas terapêuticas, banco de vagas SineBahia/SENAI, mentoria de egressos e dossiê de impacto para o TCE-BA.
          </p>
        </div>
      </div>

      {/* RENDERIZAÇÃO DINÂMICA DAS TELAS CONFORME A SUB-ABA SELECIONADA */}
      {activeSubTab === 'cofre' ? (
        /* Tela 2: Devolução de Pertences do Cofre */
        <div className="card" style={{ borderLeft: '4px solid #d97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
            <div>
              <span className="badge badge-warning">Gestão de Cofre no Desligamento</span>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: '0.25rem 0 0 0', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={24} style={{ color: '#d97706' }} /> Termo & Recibo de Devolução de Pertences do Cofre
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Conferência de envelope selado, devolução de documentos (RG/CPF) e restituição de valores na alta do acolhido.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowDevolucaoCofreModal(true)}>
              <Lock size={16} /> Emitir Recibo de Devolução do Cofre
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Envelope Cofre</th>
                  <th>Acolhido</th>
                  <th>Smartphones & Eletrônicos</th>
                  <th>Documentos de Identificação</th>
                  <th>Valores em Espécie (R$)</th>
                  <th>Status da Custódia</th>
                  <th>Ação / Devolução</th>
                </tr>
              </thead>
              <tbody>
                {acolhidos.map(a => {
                  const isDevolvido = cofreDevolucoes[a.id];
                  const dataHoraDev = isDevolvido ? cofreDevolucoes[a.id].dataHora : null;
                  return (
                    <tr key={a.id}>
                      <td><span className="badge badge-primary">Envelope nº 104-{a.id.replace('FDJ-', '')}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img 
                            src={a.foto} 
                            alt={a.nome} 
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} 
                          />
                          <div>
                            <strong style={{ color: 'var(--text-main)' }}>{a.nome}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CPF: {a.cpf}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.825rem' }}>{a.celularEletronico || '1 Smartphone Samsung (Guardado no Cofre)'}</td>
                      <td style={{ fontSize: '0.825rem' }}>{a.documentosCofre || 'RG e CPF Originais'}</td>
                      <td style={{ fontWeight: 800, color: '#059669' }}>R$ {a.valorDinheiro || '50,00'}</td>
                      <td>
                        {isDevolvido ? (
                          <span className="badge badge-danger" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#dc2626', fontWeight: 800 }}>
                            🔓 Restituído ({dataHoraDev})
                          </span>
                        ) : (
                          <span className="badge badge-success" style={{ fontWeight: 700 }}>
                            🔒 Lacrado no Cofre
                          </span>
                        )}
                      </td>
                      <td>
                        {isDevolvido ? (
                          <button 
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                            onClick={() => setSelectedCofreAcolhido({ ...a, dataDevolucao: dataHoraDev })}
                          >
                            <Printer size={14} /> Recibo de Quitação
                          </button>
                        ) : (
                          <button 
                            className="btn btn-warning btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem', fontWeight: 800 }}
                            onClick={() => {
                              if (onDevolverCofre) onDevolverCofre(a.id);
                              const dataNow = new Date().toLocaleString('pt-BR');
                              setSelectedCofreAcolhido({ ...a, dataDevolucao: dataNow });
                            }}
                          >
                            🔓 Dar Baixa & Emitir Recibo
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeSubTab === 'mentores' ? (
        /* Tela 4: Egressos Mentores & Acompanhamento */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Post-Care Success Metrics Banner */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(20, 184, 166, 0.05))', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <TrendingUp size={24} style={{ color: 'var(--status-success)' }} />
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>
                    Índice Institucional de Sobriedade & Empregabilidade
                  </h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Follow-up com egressos e inserção no mercado de trabalho em parceria com SineBahia e empresas locais.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--status-success)' }}>84.2%</span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Taxa de Sobriedade Mantida</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>72.5%</span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Inserção no Mercado</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid-2">
            {/* Mentors (Rede de Padrinhos Egressos) */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HeartHandshake size={20} style={{ color: 'var(--accent)' }} />
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>Rede de Padrinhos de Sobriedade</h3>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  ℹ️ Cadastros efetuados no Módulo Cadastros Base
                </span>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nome do Mentor (Egresso)</th>
                      <th>Tempo Sobriedade</th>
                      <th>Profissão / Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {padrinhos.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{p.nome}</td>
                        <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{p.tempoSobriedade}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{p.profissao}</span>
                            <button className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.725rem' }} onClick={() => setShowNewMentorModal(true)}>
                              ✏️ Editar Mentor
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Post-Care Follow up Card */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PhoneCall size={20} style={{ color: 'var(--accent)' }} />
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>Acompanhamento Pós-Acolhimento</h3>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  ℹ️ Cadastros efetuados no Módulo Cadastros Base
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {posAcolhimento.map(pa => (
                  <div key={pa.id} style={{
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{pa.acolhidoNome}</span>
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{pa.status}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Data da Alta: {pa.dataAlta} • 30 Dias: <strong>{pa.contato30Dias}</strong>
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        style={{ fontSize: '0.725rem' }} 
                        onClick={() => {
                          setNewFollowUp({ acolhidoNome: pa.acolhidoNome, contato: pa.contato30Dias, status: pa.status });
                          setShowNewFollowUpModal(true);
                        }}
                      >
                        <PhoneCall size={12} /> Editar / Registrar Contato
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tela 1: Altas Terapêuticas Concluídas (Padrão) */
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={20} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, fontWeight: 900 }}>Histórico de Desligamentos & Altas Terapêuticas Concluídas</h3>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowImpactoMROSCModal(true)}>
                <BarChart3 size={16} /> Dossiê TCE-BA
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAltaCertificateModal(true)}>
                <Award size={16} /> Certificado de Alta
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleOpenNewDesligamento}>
                <LogOut size={16} /> Registrar Desligamento
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data / Código</th>
                  <th>Acolhido</th>
                  <th>Motivo do Desligamento</th>
                  <th>Destino / Reinserção</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {desligamentos.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Nenhum desligamento registrado até o momento. Clique em "Registrar Desligamento" acima.
                    </td>
                  </tr>
                ) : (
                  desligamentos.map(d => (
                    <tr key={d.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{d.id}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{d.data}</div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{d.acolhidoNome}</td>
                      <td style={{ fontSize: '0.825rem' }}>{d.motivo}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.destino}</td>
                      <td><span className="badge badge-success" style={{ fontSize: '0.725rem' }}>{d.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          <button className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem' }} onClick={() => handleEditDesligamento(d)}>
                            ✏️ Editar
                          </button>
                          <button className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem' }} onClick={() => setShowAltaCertificateModal(true)}>
                            <Award size={13} /> Certificado
                          </button>
                          <button className="btn btn-danger btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem', background: '#ef4444', borderColor: '#ef4444', color: '#fff' }} onClick={() => handleDeleteDesligamento(d.id)}>
                            🗑️ Excluir
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
      )}

      {/* Modal: Printable MROSC / TCE-BA Impact Report */}
      {showImpactoMROSCModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-warning">Dossiê de Efetividade Terapêutica (TCE-BA / MROSC)</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={16} /> Imprimir Dossiê
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowImpactoMROSCModal(false)}>
                  <X size={16} /> Fechar
                </button>
              </div>
            </div>

            <div className="printable-document">
              <div className="printable-header">
                <h2>FUNDAÇÃO DOUTOR JESUS</h2>
                <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                  DOSSIÊ TÉCNICO DE EFETIVIDADE SOCIAL E COMPROVAÇÃO DE REINSERÇÃO (MROSC - LEI 13.019/2014)
                </p>
                <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Prestação de Contas para TCE-BA / TCM-BA e Secretaria de Assistência Social da Bahia (SADS-BA)
                </p>
              </div>

              <div style={{ border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <p>• Período de Avaliação: <strong>Exercício 2026</strong></p>
                <p>• Taxa Oficial de Sobriedade Mantida (Pós-Alta 180 dias): <strong>84.2%</strong></p>
                <p>• Taxa de Inserção no Mercado de Trabalho / Empregabilidade: <strong>72.5%</strong></p>
                <p>• Total de Atendimentos Multidisciplinares Realizados: <strong>4.820 Atendimentos</strong></p>
              </div>

              <p style={{ textIndent: '2rem', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'justify' }}>
                Atestamos para os devidos fins de instrução processual de prestação de contas que os recursos públicos repassados via Termo de Colaboração MROSC resultaram em elevados índices de recuperação, reinserção familiar e redução drástica da vulnerabilidade social e reincidência criminal.
              </p>

              <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '0.85rem' }}>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem' }}>
                    <strong>Dep. Pastor Sargento Isidório</strong><br />
                    Presidente Fundador da Fundação Dr. Jesus
                  </div>
                </div>

                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem' }}>
                    <strong>Coordenação de Psicologia & Serviço Social</strong><br />
                    Responsáveis Técnicos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Form de Registro / Edição de Desligamento */}
      {showDesligamentoModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogOut size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, fontWeight: 900 }}>
                  {editingDesligamentoId ? `Editar Registro de Desligamento (${editingDesligamentoId})` : 'Registrar Desligamento de Acolhido'}
                </h3>
              </div>
              <button onClick={() => setShowDesligamentoModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmDischarge}>
              <div className="grid-2" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">📅 Data do Desligamento *</label>
                  <input 
                    type="date" 
                    required 
                    className="form-input" 
                    value={dischargeForm.data}
                    onChange={(e) => setDischargeForm({ ...dischargeForm, data: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">👤 Selecionar Acolhido *</label>
                  <select 
                    className="form-select"
                    value={dischargeForm.acolhidoId}
                    onChange={(e) => setDischargeForm({ ...dischargeForm, acolhidoId: e.target.value })}
                    required
                  >
                    {acolhidos.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.nome} ({a.id}) - {a.alojamento}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">📜 Motivo do Desligamento *</label>
                <select 
                  className="form-select"
                  value={dischargeForm.motivo}
                  onChange={(e) => setDischargeForm({ ...dischargeForm, motivo: e.target.value })}
                >
                  <option value="Alta Terapêutica por Conclusão do Programa (9 Meses)">Alta Terapêutica por Conclusão do Programa (9 Meses)</option>
                  <option value="Desligamento Pedido pelo Acolhido (Voluntário)">Desligamento Pedido pelo Acolhido (Voluntário)</option>
                  <option value="Encaminhamento para Rede Médica / Hospitalar">Encaminhamento para Rede Médica / Hospitalar</option>
                  <option value="Evasão / Abandono de Pátio">Evasão / Abandono de Pátio</option>
                  <option value="Desligamento Administrativo / Disciplinar">Desligamento Administrativo / Disciplinar</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">🏠 Destino / Encaminhamento Pós-Alta (Cadastrado) *</label>
                <select 
                  className="form-select"
                  value={dischargeForm.destino}
                  onChange={(e) => setDischargeForm({ ...dischargeForm, destino: e.target.value })}
                  required
                >
                  {DESTINOS_CADASTRAOS_ENCAMINHAMENTO.map((dest, idx) => (
                    <option key={idx} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">🏷️ Status do Registro</label>
                <select 
                  className="form-select"
                  value={dischargeForm.status}
                  onChange={(e) => setDischargeForm({ ...dischargeForm, status: e.target.value })}
                >
                  <option value="Alta Concluída com Sucesso">🟢 Alta Concluída com Sucesso</option>
                  <option value="Desligamento Efetuado">🟡 Desligamento Efetuado</option>
                  <option value="Processo em Análise">🔵 Processo em Análise</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowDesligamentoModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={18} /> {editingDesligamentoId ? 'Salvar Alterações' : 'Confirmar Desligamento & Liberar Leito'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Printable Official Certificate of Completion (Alta Terapêutica) */}
      {showAltaCertificateModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-success">Certificado Oficial de Alta Terapêutica</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={16} /> Imprimir Certificado
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowAltaCertificateModal(false)}>
                  <X size={16} /> Fechar
                </button>
              </div>
            </div>

            <div className="printable-document" style={{ border: '4px double #10b981', padding: '2.5rem', textAlign: 'center' }}>
              <div className="printable-header" style={{ borderBottom: '2px solid #10b981', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.6rem', color: '#10b981', letterSpacing: '0.05em' }}>FUNDAÇÃO DOUTOR JESUS</h2>
                <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontStyle: 'italic', color: '#475569' }}>
                  Comunidade Terapêutica de Acolhimento Voluntário — Candeias / BA
                </p>
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '1.5rem 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                CERTIFICADO OFICIAL DE ALTA TERAPÊUTICA & REABILITAÇÃO
              </h3>

              <p style={{ fontSize: '1rem', lineHeight: 1.8, color: '#1e293b', textAlign: 'justify', textIndent: '2rem', marginBottom: '2rem' }}>
                Certificamos que o acolhido <strong>{selectedAcolhido.nome}</strong>, portador do CPF nº <strong>{selectedAcolhido.cpf}</strong>, concluiu com êxito e superação todas as 3 fases do Programa Terapêutico de Acolhimento Voluntário na Fundação Doutor Jesus, estando apto e fortalecido para a reinserção familiar, social e profissional.
              </p>

              <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '0.85rem' }}>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem' }}>
                    <strong>Dep. Pastor Sargento Isidório</strong><br />
                    Presidente Fundador da Fundação Dr. Jesus
                  </div>
                </div>

                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem' }}>
                    <strong>Equipe Multidisciplinar de Saúde</strong><br />
                    Psicologia & Serviço Social
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Printable Vault Items Return Receipt */}
      {/* Modal: Termo de Devolução Integral & Quitação do Cofre Central */}
      {showDevolucaoCofreModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '780px', padding: '1.5rem' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={20} style={{ color: '#dc2626' }} />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>Termo de Restituição & Quitação de Cofre Central</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={14} /> Imprimir Recibo / PDF
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowDevolucaoCofreModal(false)}>
                  <X size={16} /> Fechar
                </button>
              </div>
            </div>

            <div className="printable-document" style={{ background: '#ffffff', color: '#0f172a', padding: '1.75rem', fontFamily: 'Inter, sans-serif', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #dc2626', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>FUNDAÇÃO DOUTOR JESUS</h2>
                <p style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, margin: '0.2rem 0' }}>Gestão de Cofre Central & Custódia Institucional de Bens</p>
                <p style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 800, margin: 0 }}>TERMO OFICIAL DE RESTITUIÇÃO DE BENS & QUITAÇÃO DE CUSTÓDIA</p>
              </div>

              <div style={{ background: '#dc2626', color: '#ffffff', textAlign: 'center', padding: '0.5rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                RECIBO DE RESTITUIÇÃO E QUITAÇÃO DEFINITIVA DE PERTENCES
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <img 
                  src={selectedAcolhido.foto} 
                  alt={selectedAcolhido.nome} 
                  style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #dc2626' }} 
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', flex: 1 }}>
                  <div>
                    <p style={{ margin: '0.2rem 0' }}><strong>Acolhido:</strong> {selectedAcolhido.nome}</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>CPF nº:</strong> {selectedAcolhido.cpf}</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>RG nº:</strong> {selectedAcolhido.rg}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0.2rem 0' }}><strong>Protocolo FDJ:</strong> {selectedAcolhido.id}</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>Origem:</strong> {selectedAcolhido.municipioOrigem || 'Salvador'} / BA</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>Data Devolução:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#1e293b', textAlign: 'justify', marginBottom: '1.25rem' }}>
                Declaramos que no ato da saída/desligamento do acolhido <strong>{selectedAcolhido.nome}</strong> (CPF nº {selectedAcolhido.cpf}), deram baixa no Cofre Central e foram integralmente devolvidos os seguintes pertences custodiados sob o <strong>Envelope nº 104-{selectedAcolhido.id.replace('FDJ-', '')}</strong>:
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '1rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <p style={{ margin: '0.35rem 0' }}>• <strong>Eletrônicos / Aparelho Celular:</strong> {selectedAcolhido.celularEletronico || '1 Smartphone Samsung (Devolvido)'}</p>
                <p style={{ margin: '0.35rem 0' }}>• <strong>Documentos Originais:</strong> {selectedAcolhido.documentosCofre || 'RG e CPF Originais (Restituídos)'}</p>
                <p style={{ margin: '0.35rem 0' }}>• <strong>Valor em Espécie:</strong> R$ {selectedAcolhido.valorDinheiro || '50,00'} (Restituído na íntegra)</p>
                <p style={{ margin: '0.35rem 0' }}>• <strong>Bagagem / Pertences Pessoais:</strong> {selectedAcolhido.vestuarioMochilas || '1 Mochila com roupas'}</p>
              </div>

              <div style={{ border: '1px solid #0f172a', padding: '0.85rem', borderRadius: '6px', background: '#f8fafc', marginBottom: '2rem' }}>
                <p style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0', fontSize: '0.8rem', textTransform: 'uppercase' }}>DECLARAÇÃO DE QUITAÇÃO DO ACOLHIDO:</p>
                <p style={{ fontSize: '0.8rem', fontStyle: 'italic', margin: 0, color: '#334155' }}>
                  "Declaro ter conferido e recebido em perfeito estado de conservação a totalidade dos meus pertences, documentos e valores depositados sob a custódia da <strong>FUNDAÇÃO DOUTOR JESUS</strong>, dando plena, irrevogável e geral QUITAÇÃO à instituição e seus prepostos quanto aos bens custodiados, nada mais tendo a reclamar a qualquer tempo."
                </p>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#475569', marginBottom: '2.5rem' }}>
                  Candeias / BA, {new Date().toLocaleDateString('pt-BR')}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '0.85rem' }}>
                  <div style={{ width: '45%' }}>
                    <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.5rem' }}>
                      <strong>{selectedAcolhido.nome}</strong><br />
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Assinatura do Acolhido (Egresso)</span>
                    </div>
                  </div>
                  <div style={{ width: '45%' }}>
                    <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.5rem' }}>
                      <strong>Fiel Depositário / Cofre Central</strong><br />
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Fundação Doutor Jesus</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Cadastrar Novo Mentor / Padrinho Egresso */}
      {showNewMentorModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HeartHandshake size={20} style={{ color: 'var(--accent)' }} />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0 }}>Cadastrar Novo Mentor Egresso</h3>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowNewMentorModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newMentor.nome) return;
              setPadrinhos([...padrinhos, { id: Date.now(), ...newMentor }]);
              setShowNewMentorModal(false);
              setNewMentor({ nome: '', tempoSobriedade: '2 anos', profissao: '', mentorados: '1 Acolhido' });
            }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Nome do Mentor (Egresso Concluinte)</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Ex: Carlos Eduardo Souza"
                  value={newMentor.nome}
                  onChange={(e) => setNewMentor({ ...newMentor, nome: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Tempo de Sobriedade Mantida</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Ex: 3 anos e 2 meses"
                  value={newMentor.tempoSobriedade}
                  onChange={(e) => setNewMentor({ ...newMentor, tempoSobriedade: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Profissão / Ocupação Atual</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Ex: Eletricista de Manutenção / Autônomo"
                  value={newMentor.profissao}
                  onChange={(e) => setNewMentor({ ...newMentor, profissao: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewMentorModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar Mentor Egresso</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Novo Follow-Up Pós-Acolhimento */}
      {showNewFollowUpModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PhoneCall size={20} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0 }}>Registrar Acompanhamento Pós-Alta</h3>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowNewFollowUpModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newFollowUp.acolhidoNome) return;
              setPosAcolhimento([...posAcolhimento, { 
                id: Date.now(), 
                acolhidoNome: newFollowUp.acolhidoNome,
                dataAlta: new Date().toISOString().split('T')[0],
                contato30Dias: `${newFollowUp.contato} (Registrado em ${new Date().toLocaleDateString('pt-BR')})`,
                status: newFollowUp.status
              }]);
              setShowNewFollowUpModal(false);
              setNewFollowUp({ acolhidoNome: '', contato: 'Sobriedade Mantida', status: '🟢 Sobriedade & Reinserção Confirmadas' });
            }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Nome do Acolhido (Concluintes com Alta Terapêutica) *</label>
                <select 
                  className="form-control"
                  value={newFollowUp.acolhidoNome}
                  onChange={(e) => setNewFollowUp({ ...newFollowUp, acolhidoNome: e.target.value })}
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
                  ℹ️ Exibe apenas acolhidos que já atingiram o estágio de Alta Terapêutica.
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Relato do Contato / Pós-Alta (30/60/90 Dias)</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  placeholder="Descreva o status de sobriedade, emprego e convívio familiar..."
                  value={newFollowUp.contato}
                  onChange={(e) => setNewFollowUp({ ...newFollowUp, contato: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewFollowUpModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Registrar Follow-Up</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Termo de Restituição & Quitação de Cofre Central */}
      {selectedCofreAcolhido && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '780px', padding: '1.5rem' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={20} style={{ color: '#dc2626' }} />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>Termo de Restituição & Quitação de Cofre Central</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={14} /> Imprimir Recibo / PDF
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedCofreAcolhido(null)}>
                  <X size={16} /> Fechar
                </button>
              </div>
            </div>

            <div className="printable-document" style={{ background: '#ffffff', color: '#0f172a', padding: '1.75rem', fontFamily: 'Inter, sans-serif', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #dc2626', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>FUNDAÇÃO DOUTOR JESUS</h2>
                <p style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, margin: '0.2rem 0' }}>Gestão de Cofre Central & Custódia Institucional de Bens</p>
                <p style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 800, margin: 0 }}>TERMO OFICIAL DE RESTITUIÇÃO DE BENS & QUITAÇÃO DE CUSTÓDIA</p>
              </div>

              <div style={{ background: '#dc2626', color: '#ffffff', textAlign: 'center', padding: '0.5rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                RECIBO DE RESTITUIÇÃO E QUITAÇÃO DEFINITIVA DE PERTENCES
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <img 
                  src={selectedCofreAcolhido.foto} 
                  alt={selectedCofreAcolhido.nome} 
                  style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #dc2626' }} 
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', flex: 1 }}>
                  <div>
                    <p style={{ margin: '0.2rem 0' }}><strong>Acolhido:</strong> {selectedCofreAcolhido.nome}</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>CPF nº:</strong> {selectedCofreAcolhido.cpf}</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>RG nº:</strong> {selectedCofreAcolhido.rg}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0.2rem 0' }}><strong>Protocolo FDJ:</strong> {selectedCofreAcolhido.id}</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>Origem:</strong> {selectedCofreAcolhido.municipioOrigem} / BA</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>Data/Hora Devolução:</strong> {selectedCofreAcolhido.dataDevolucao}</p>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#1e293b', textAlign: 'justify', marginBottom: '1.25rem' }}>
                Declaramos que no ato da saída/desligamento do acolhido <strong>{selectedCofreAcolhido.nome}</strong> (CPF nº {selectedCofreAcolhido.cpf}), deram baixa no Cofre Central e foram integralmente devolvidos os seguintes pertences custodiados sob o <strong>Envelope nº 104-{selectedCofreAcolhido.id.replace('FDJ-', '')}</strong>:
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '1rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <p style={{ margin: '0.35rem 0' }}>• <strong>Eletrônicos / Aparelho Celular:</strong> {selectedCofreAcolhido.celularEletronico || '1 Smartphone Samsung (Devolvido)'}</p>
                <p style={{ margin: '0.35rem 0' }}>• <strong>Documentos Originais:</strong> {selectedCofreAcolhido.documentosCofre || 'RG e CPF Originais (Restituídos)'}</p>
                <p style={{ margin: '0.35rem 0' }}>• <strong>Valor em Espécie:</strong> R$ {selectedCofreAcolhido.valorDinheiro || '50,00'} (Restituído na íntegra)</p>
                <p style={{ margin: '0.35rem 0' }}>• <strong>Bagagem / Pertences Pessoais:</strong> {selectedCofreAcolhido.vestuarioMochilas || '1 Mochila com roupas'}</p>
              </div>

              <div style={{ border: '1px solid #0f172a', padding: '0.85rem', borderRadius: '6px', background: '#f8fafc', marginBottom: '2rem' }}>
                <p style={{ fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0', fontSize: '0.8rem', textTransform: 'uppercase' }}>DECLARAÇÃO DE QUITAÇÃO DO ACOLHIDO:</p>
                <p style={{ fontSize: '0.8rem', fontStyle: 'italic', margin: 0, color: '#334155' }}>
                  "Declaro ter conferido e recebido em perfeito estado de conservação a totalidade dos meus pertences, documentos e valores depositados sob a custódia da <strong>FUNDAÇÃO DOUTOR JESUS</strong>, dando plena, irrevogável e geral QUITAÇÃO à instituição e seus prepostos quanto aos bens custodiados, nada mais tendo a reclamar a qualquer tempo."
                </p>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#475569', marginBottom: '2.5rem' }}>
                  Candeias / BA, {selectedCofreAcolhido.dataDevolucao ? selectedCofreAcolhido.dataDevolucao.split(',')[0] : new Date().toLocaleDateString('pt-BR')}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '0.85rem' }}>
                  <div style={{ width: '45%' }}>
                    <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.5rem' }}>
                      <strong>{selectedCofreAcolhido.nome}</strong><br />
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Assinatura do Acolhido (Egresso)</span>
                    </div>
                  </div>
                  <div style={{ width: '45%' }}>
                    <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.5rem' }}>
                      <strong>Fiel Depositário / Cofre Central</strong><br />
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Fundação Doutor Jesus</span>
                    </div>
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
