import React, { useState } from 'react';
import { 
  Hammer, 
  Utensils, 
  Sprout, 
  Wrench, 
  Sparkles, 
  CheckCircle2,
  Users,
  Award,
  Printer,
  X,
  Plus,
  Calendar,
  ChefHat,
  Apple,
  FileCheck,
  CheckSquare,
  RefreshCw,
  Star,
  ShoppingBag,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { INITIAL_CARGOS_LABORTERAPIA } from '../mockData';

export default function LaborterapiaView({ acolhidos = [], cargosLaborterapia = [], activeSubTab, setActiveSubTab }) {
  const [selectedSetorModal, setSelectedSetorModal] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedAcolhidoCert, setSelectedAcolhidoCert] = useState(acolhidos[0] || null);

  // Modal Search & Filter States
  const [modalSearch, setModalSearch] = useState('');
  const [modalTurnoFilter, setModalTurnoFilter] = useState('Todos');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // New Member Form State
  const [newMemberData, setNewMemberData] = useState({
    nome: '',
    leito: 'Bloco A - Leito A-101',
    funcao: 'Auxiliar Operacional',
    turno: 'Manhã (07h às 11h)'
  });

  // Sample Agricultural Harvest Log (Horta Sustentável)
  const [colheitas, setColheitas] = useState([
    { id: 1, item: 'Alface, Couve e Hortaliças Orgânicas', quantidade: '450 kg', data: '2026-08-12', destino: 'Cozinha Industrial FDJ', valorEquivalente: 'R$ 3.800,00' },
    { id: 2, item: 'Banana da Terra e Macaxeira', quantidade: '280 kg', data: '2026-08-08', destino: 'Cozinha Industrial FDJ', valorEquivalente: 'R$ 1.950,00' },
    { id: 3, item: 'Abóbora e Tomate Orgânico', quantidade: '190 kg', data: '2026-08-02', destino: 'Cozinha Industrial FDJ', valorEquivalente: 'R$ 1.400,00' }
  ]);

  // Initial Full Nominal Roster Lists for All 5 Sectors
  const initialSetores = [
    { 
      id: 'S1', 
      nome: 'Padaria Comunidade', 
      icone: ChefHat, 
      responsavel: 'Irmão Carlos Padaria (Mestre Padeiro)', 
      descricao: 'Produção diária de 2.200 pães para café e lanche da comunidade terapêutica.',
      proximoRodizio: '01/10/2026 (Rotação para Manutenção)',
      membros: [
        { id: 'M-01', nome: 'Antonio Carlos da Silva Filho', leito: 'Bloco A - Leito A-102', funcao: 'Padeiro Aprendiz', turno: 'Manhã', status: 'Presente', nota: '5.0' },
        { id: 'M-02', nome: 'Marcos Vinicius Santos Santana', leito: 'Bloco A - Leito A-105', funcao: 'Forneiro / Forno Industrial', turno: 'Manhã', status: 'Presente', nota: '4.9' },
        { id: 'M-03', nome: 'Luciano Pereira Ramos', leito: 'Bloco B - Leito B-201', funcao: 'Masseiro / Misturador', turno: 'Manhã', status: 'Presente', nota: '4.8' },
        { id: 'M-04', nome: 'Fabio Junior Lima', leito: 'Bloco B - Leito B-204', funcao: 'Modelagem & Modelador', turno: 'Tarde', status: 'Presente', nota: '5.0' },
        { id: 'M-05', nome: 'Gerson Silva de Jesus', leito: 'Bloco C - Leito C-301', funcao: 'Embalagem & Distribuição', turno: 'Tarde', status: 'Presente', nota: '4.7' },
        { id: 'M-06', nome: 'Carlos Alberto Ferreira', leito: 'Bloco A - Leito A-108', funcao: 'Higienização das Assadeiras', turno: 'Manhã', status: 'Presente', nota: '4.8' },
        { id: 'M-07', nome: 'Reginaldo de Oliveira', leito: 'Bloco C - Leito C-302', funcao: 'Cilindrista de Massa', turno: 'Tarde', status: 'Presente', nota: '4.9' },
        { id: 'M-08', nome: 'Marcelo Souza Santos', leito: 'Bloco D - Leito D-405', funcao: 'Forneiro Auxiliar', turno: 'Manhã', status: 'Ausente (Justificado)', nota: '4.6' },
        { id: 'M-09', nome: 'Rodrigo Alves da Silva', leito: 'Bloco A - Leito A-110', funcao: 'Auxiliar de Padeiro', turno: 'Manhã', status: 'Presente', nota: '4.8' },
        { id: 'M-10', nome: 'Fernando Henrique Rocha', leito: 'Bloco B - Leito B-210', funcao: 'Padeiro Aprendiz', turno: 'Tarde', status: 'Presente', nota: '4.9' },
        { id: 'M-11', nome: 'Lucas Gabriel Matos', leito: 'Bloco C - Leito C-312', funcao: 'Controle de Estoque Trigo', turno: 'Manhã', status: 'Presente', nota: '5.0' },
        { id: 'M-12', nome: 'Mateus Oliveira Costa', leito: 'Bloco D - Leito D-412', funcao: 'Ajudante Geral de Fornaria', turno: 'Tarde', status: 'Presente', nota: '4.7' },
        { id: 'M-13', nome: 'Thiago dos Santos Lima', leito: 'Bloco A - Leito A-115', funcao: 'Pesagem de Ingredientes', turno: 'Manhã', status: 'Presente', nota: '4.8' },
        { id: 'M-14', nome: 'Bruno Cesar Santana', leito: 'Bloco B - Leito B-215', funcao: 'Auxiliar de Confeitaria', turno: 'Tarde', status: 'Presente', nota: '4.9' },
        { id: 'M-15', nome: 'Paulo Roberto Viana', leito: 'Bloco C - Leito C-318', funcao: 'Padeiro Aprendiz', turno: 'Manhã', status: 'Presente', nota: '5.0' },
        { id: 'M-16', nome: 'Gabriel Barbosa Filho', leito: 'Bloco D - Leito D-418', funcao: 'Higienização de Bacias', turno: 'Tarde', status: 'Presente', nota: '4.6' },
        { id: 'M-17', nome: 'Rafael Nogueira Silva', leito: 'Bloco A - Leito A-120', funcao: 'Modelagem de Pães', turno: 'Manhã', status: 'Presente', nota: '4.8' },
        { id: 'M-18', nome: 'Diego Armando Souza', leito: 'Bloco B - Leito B-220', funcao: 'Ajudante de Forno', turno: 'Tarde', status: 'Presente', nota: '4.9' },
        { id: 'M-19', nome: 'Leandro Castro Xavier', leito: 'Bloco C - Leito C-322', funcao: 'Organização de Bandejas', turno: 'Manhã', status: 'Presente', nota: '4.7' },
        { id: 'M-20', nome: 'Guilherme Augusto Reis', leito: 'Bloco D - Leito D-422', funcao: 'Cilindrista Auxiliar', turno: 'Tarde', status: 'Presente', nota: '4.8' },
        { id: 'M-21', nome: 'Robson de Jesus Mendes', leito: 'Bloco A - Leito A-125', funcao: 'Embalador de Pães', turno: 'Manhã', status: 'Presente', nota: '5.0' },
        { id: 'M-22', nome: 'Edivaldo Paixão Ramos', leito: 'Bloco B - Leito B-225', funcao: 'Auxiliar de Fornaria', turno: 'Tarde', status: 'Presente', nota: '4.9' },
        { id: 'M-23', nome: 'Claudio Roberto Farias', leito: 'Bloco C - Leito C-325', funcao: 'Padeiro Aprendiz', turno: 'Manhã', status: 'Presente', nota: '4.8' },
        { id: 'M-24', nome: 'Valdir Antonio Souza', leito: 'Bloco D - Leito D-425', funcao: 'Limpeza e Varrição', turno: 'Tarde', status: 'Presente', nota: '4.7' }
      ]
    },
    { 
      id: 'S2', 
      nome: 'Cozinha Industrial', 
      icone: Utensils, 
      responsavel: 'Chefe Valdeci (Chef de Cozinha)', 
      descricao: 'Preparo das 4.000 refeições diárias (Café, Almoço, Lanche da Tarde e Jantar).',
      proximoRodizio: '01/10/2026 (Rotação para Horta)',
      membros: [
        { id: 'CM-01', nome: 'Luciano Pereira Ramos', leito: 'Bloco B - Leito B-201', funcao: 'Auxiliar de Cozinha / Preparo', turno: 'Manhã', status: 'Presente', nota: '5.0' },
        { id: 'CM-02', nome: 'Fabio Junior Lima', leito: 'Bloco B - Leito B-204', funcao: 'Higienização de Caldeirões', turno: 'Tarde', status: 'Presente', nota: '4.9' },
        { id: 'CM-03', nome: 'Gilberto Alves Souza', leito: 'Bloco A - Leito A-104', funcao: 'Cozinheiro Auxiliar / Corte', turno: 'Manhã', status: 'Presente', nota: '4.8' },
        { id: 'CM-04', nome: 'Valter Ribeiro Matos', leito: 'Bloco C - Leito C-305', funcao: 'Porcionamento de Marmitas', turno: 'Almoço', status: 'Presente', nota: '5.0' },
        { id: 'CM-05', nome: 'Adriano Cesar Paixão', leito: 'Bloco D - Leito D-408', funcao: 'Higienização de Talheres', turno: 'Jantar', status: 'Presente', nota: '4.7' }
      ]
    },
    { 
      id: 'S3', 
      nome: 'Horta & Agroecologia Sustentável', 
      icone: Sprout, 
      responsavel: 'Agrônomo Moacir (Engenheiro Agrônomo)', 
      descricao: 'Cultivo de hortaliças, legumes e verduras orgânicas para autoconsumo na Fundação.',
      proximoRodizio: '01/10/2026 (Rotação para Padaria)',
      membros: [
        { id: 'HM-01', nome: 'Reginaldo de Oliveira', leito: 'Bloco C - Leito C-302', funcao: 'Manejo do Solo & Irrigação', turno: 'Manhã', status: 'Presente', nota: '5.0' },
        { id: 'HM-02', nome: 'Joaquim Barbosa Santos', leito: 'Bloco A - Leito A-112', funcao: 'Plantio de Hortaliças', turno: 'Manhã', status: 'Presente', nota: '4.9' },
        { id: 'HM-03', nome: 'Vanderlei da Cruz', leito: 'Bloco B - Leito B-214', funcao: 'Compostagem Orgânica', turno: 'Tarde', status: 'Presente', nota: '4.8' }
      ]
    },
    { 
      id: 'S4', 
      nome: 'Manutenção Geral & Pintura', 
      icone: Wrench, 
      responsavel: 'Mestre Josué (Mestre de Obras)', 
      descricao: 'Reparos hidráulicos, elétricos, pintura e marcenaria dos 4 blocos de alojamentos.',
      proximoRodizio: '01/10/2026 (Rotação para Cozinha)',
      membros: [
        { id: 'MM-01', nome: 'Gerson Silva de Jesus', leito: 'Bloco D - Leito D-401', funcao: 'Pintor Residencial', turno: 'Manhã', status: 'Presente', nota: '4.9' },
        { id: 'MM-02', nome: 'Renato Farias Nogueira', leito: 'Bloco A - Leito A-118', funcao: 'Auxiliar de Encanador', turno: 'Tarde', status: 'Presente', nota: '4.8' }
      ]
    },
    { 
      id: 'S5', 
      nome: 'Limpeza & Higienização Alojamentos', 
      icone: Sparkles, 
      responsavel: 'Monitores de Pátio Central', 
      descricao: 'Zelo, lavagem e higienização diária das áreas comuns, refeitório e dormitórios.',
      proximoRodizio: '01/10/2026 (Rotação Geral)',
      membros: [
        { id: 'LM-01', nome: 'Carlos Alberto Ferreira', leito: 'Bloco A - Leito A-108', funcao: 'Limpeza de Pátio Central', turno: 'Manhã', status: 'Presente', nota: '4.8' },
        { id: 'LM-02', nome: 'Wellington de Souza', leito: 'Bloco B - Leito B-222', funcao: 'Higienização de Sanitários', turno: 'Manhã', status: 'Presente', nota: '4.7' }
      ]
    }
  ];

  const [setores, setSetores] = useState(initialSetores);

  // Handler to toggle member presence status
  const handleTogglePresence = (setorId, memberId) => {
    setSetores(setores.map(s => {
      if (s.id !== setorId) return s;
      const updatedMembros = s.membros.map(m => {
        if (m.id !== memberId) return m;
        const nextStatus = m.status === 'Presente' ? 'Ausente (Justificado)' : m.status === 'Ausente (Justificado)' ? 'Posto Médico' : 'Presente';
        return { ...m, status: nextStatus };
      });
      return { ...s, membros: updatedMembros };
    }));

    // Keep active modal updated
    if (selectedSetorModal && selectedSetorModal.id === setorId) {
      setSelectedSetorModal(prev => ({
        ...prev,
        membros: prev.membros.map(m => {
          if (m.id !== memberId) return m;
          const nextStatus = m.status === 'Presente' ? 'Ausente (Justificado)' : m.status === 'Ausente (Justificado)' ? 'Posto Médico' : 'Presente';
          return { ...m, status: nextStatus };
        })
      }));
    }
  };

  // Handler to remove a member from roster
  const handleRemoveMember = (setorId, memberId) => {
    if (window.confirm('Deseja remover este acolhido da escala nominal do setor?')) {
      setSetores(setores.map(s => {
        if (s.id !== setorId) return s;
        return { ...s, membros: s.membros.filter(m => m.id !== memberId) };
      }));

      if (selectedSetorModal && selectedSetorModal.id === setorId) {
        setSelectedSetorModal(prev => ({
          ...prev,
          membros: prev.membros.filter(m => m.id !== memberId)
        }));
      }
    }
  };

  // Handler to add a new member to sector roster
  const handleSaveNewMember = (e) => {
    e.preventDefault();
    if (!newMemberData.nome) return;
    const newM = {
      id: `M-${Date.now().toString().slice(-4)}`,
      nome: newMemberData.nome,
      leito: newMemberData.leito,
      funcao: newMemberData.funcao,
      turno: newMemberData.turno.includes('Manhã') ? 'Manhã' : 'Tarde',
      status: 'Presente',
      nota: '5.0'
    };

    const targetSetorId = selectedSetorModal.id;
    setSetores(setores.map(s => {
      if (s.id !== targetSetorId) return s;
      return { ...s, membros: [newM, ...s.membros] };
    }));

    setSelectedSetorModal(prev => ({
      ...prev,
      membros: [newM, ...prev.membros]
    }));

    setShowAddMemberModal(false);
    setNewMemberData({ nome: '', leito: 'Bloco A - Leito A-101', funcao: 'Auxiliar Operacional', turno: 'Manhã (07h às 11h)' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">Macromódulo 9</span>
            <span className="badge badge-success">Gestão de Escalas Nominais • Laborterapia • RDC 29</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>
            Escala de Laborterapia, Cozinha Industrial & Produção Agrícola
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Trabalho formativo comunitário, rotina da cozinha industrial, colheita da horta orgânica e certidão profissional.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setShowCertificateModal(true)}>
            <Award size={18} /> Emitir Certificado de Capacitação
          </button>
        </div>
      </div>

      {/* RENDERIZAÇÃO DINÂMICA CONFORME A SUB-ABA SELECIONADA */}
      {activeSubTab === 'cozinha' ? (
        /* Tela 3: Cozinha Industrial & Cardápio */
        <div className="card" style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ChefHat size={24} style={{ color: 'var(--accent)' }} />
              <div>
                <span className="badge badge-warning">Produção Diária de Refeições</span>
                <h3 style={{ fontSize: '1.3rem', color: '#0f172a', fontWeight: 900, margin: '4px 0 0 0' }}>
                  Cozinha Industrial & Cardápio da Comunidade (4.000 Refeições/Dia)
                </h3>
              </div>
            </div>
            <span className="badge badge-warning" style={{ fontSize: '0.85rem' }}>Sexta-feira (Hoje)</span>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Acolhidos Escalados na Cozinha Industrial</h4>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nome do Acolhido</th>
                    <th>Alojamento / Leito</th>
                    <th>Função na Cozinha</th>
                    <th>Turno</th>
                    <th>Status da Escala</th>
                  </tr>
                </thead>
                <tbody>
                  {setores.find(s => s.id === 'S2')?.membros.map((m) => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 700 }}>{m.nome}</td>
                      <td>{m.leito}</td>
                      <td><span className="badge badge-info">{m.funcao}</span></td>
                      <td>{m.turno}</td>
                      <td><span className="badge badge-success">🟢 Presente na Cozinha</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeSubTab === 'horta' ? (
        /* Tela 4: Horta & Agricultura Orgânica */
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sprout size={24} style={{ color: '#10b981' }} />
              <div>
                <span className="badge badge-success">Autossustentabilidade Alimentar</span>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', fontWeight: 900, margin: '4px 0 0 0' }}>
                  Gestão da Colheita Agrícola (Horta Orgânica FDJ)
                </h3>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => alert('Registrando nova colheita agrícola...')}>
              <Plus size={16} /> Registrar Nova Colheita
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data da Colheita</th>
                  <th>Insumo / Hortaliça Colhida</th>
                  <th>Volume Total Colhido</th>
                  <th>Destino Interno</th>
                  <th>Economia Estimada (R$)</th>
                </tr>
              </thead>
              <tbody>
                {colheitas.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.data}</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{c.item}</td>
                    <td style={{ fontWeight: 700, color: 'var(--status-success)' }}>{c.quantidade}</td>
                    <td style={{ fontSize: '0.825rem' }}>{c.destino}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{c.valorEquivalente}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeSubTab === 'padaria' ? (
        /* Tela 2: Padaria Comunidade */
        <div className="card" style={{ borderLeft: '4px solid #d97706' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ChefHat size={24} style={{ color: '#d97706' }} />
              <div>
                <span className="badge badge-warning">Produção Própria FDJ</span>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', fontWeight: 900, margin: '4px 0 0 0' }}>
                  Padaria Comunidade (2.200 Pães/Dia)
                </h3>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => setSelectedSetorModal(setores.find(s => s.id === 'S1'))}>
              <Users size={16} /> Ver Escala Nominal Completa
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Padeiro / Forneiro</th>
                  <th>Alojamento / Leito</th>
                  <th>Função Específica</th>
                  <th>Desempenho</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {setores.find(s => s.id === 'S1')?.membros.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{m.nome}</td>
                    <td>{m.leito}</td>
                    <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{m.funcao}</td>
                    <td><span className="badge badge-success">⭐ {m.nota} Excelente</span></td>
                    <td><span className="badge badge-success">🟢 {m.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeSubTab === 'certificado' ? (
        /* Tela 5: Certificado Formativo (240h) */
        <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
            <div>
              <span className="badge badge-primary">Capacitação Formativa 240 Horas</span>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: '0.25rem 0 0 0', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={24} style={{ color: '#2563eb' }} /> Emissão de Certificados Formativos de Laborterapia
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Comprovação de carga horária e qualificação técnica para reinserção no mercado de trabalho via SineBahia.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowCertificateModal(true)}>
              <Award size={16} /> Emitir Novo Certificado (240h)
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Acolhido Formando</th>
                  <th>CPF</th>
                  <th>Setor de Capacitação</th>
                  <th>Carga Horária</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {acolhidos.slice(0, 5).map(ac => (
                  <tr key={ac.id}>
                    <td style={{ fontWeight: 700 }}>{ac.nome}</td>
                    <td style={{ fontSize: '0.8rem' }}>{ac.cpf}</td>
                    <td><span className="badge badge-info">{ac.laborterapiaSector || 'Padaria Comunidade'}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>240 Horas Práticas</td>
                    <td><span className="badge badge-success">✓ Apto para Certificação</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => {
                        setSelectedAcolhidoCert(ac);
                        setShowCertificateModal(true);
                      }}>
                        <Printer size={14} /> Imprimir Certificado
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Tela 1: Escalas dos 5 Setores (Visão Geral Padrão) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Setores de Laborterapia Grid */}
          <div className="grid-2">
            {setores.map((setor) => {
              const Icon = setor.icone;
              return (
                <div key={setor.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)' }}>
                          <Icon size={20} />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{setor.nome}</h3>
                      </div>
                      <span className="badge badge-primary" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                        {setor.membros.length} Alocados
                      </span>
                    </div>

                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                      {setor.descricao}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.35rem' }}>
                      <span>Instrutor: <strong>{setor.responsavel.split('(')[0]}</strong></span>
                      <span style={{ color: 'var(--accent)' }}>🔄 Rodízio: {setor.proximoRodizio}</span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--status-success)', fontWeight: 700 }}>
                      <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      {setor.membros.filter(m => m.status === 'Presente').length} Presentes Hoje
                    </span>
                    <button className="btn btn-primary btn-sm" onClick={() => setSelectedSetorModal(setor)}>
                      <Users size={14} /> Ver Escala Nominal ({setor.membros.length})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Interativa: Escala Nominal Completa do Setor */}
      {selectedSetorModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '900px', width: '95%' }}>
            {/* Header Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)' }}>
                  <Users size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: 0, fontWeight: 900 }}>
                    Escala Nominal — {selectedSetorModal.nome}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                    Instrutor Responsável: <strong>{selectedSetorModal.responsavel}</strong> • Previsão de Rotação: <strong>{selectedSetorModal.proximoRodizio}</strong>
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedSetorModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                <X size={22} />
              </button>
            </div>

            {/* Modal KPI Header Cards */}
            <div className="grid-3" style={{ gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Total Alocados no Setor</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>{selectedSetorModal.membros.length} Acolhidos</div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#047857', fontWeight: 700 }}>Presença Confirmada Hoje</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#047857' }}>
                  {selectedSetorModal.membros.filter(m => m.status === 'Presente').length} Presentes ({selectedSetorModal.membros.length > 0 ? Math.round((selectedSetorModal.membros.filter(m => m.status === 'Presente').length / selectedSetorModal.membros.length) * 100) : 100}%)
                </div>
              </div>

              <div style={{ background: 'rgba(234, 179, 8, 0.08)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#b45309', fontWeight: 700 }}>Avaliação Média do Instrutor</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#b45309' }}>⭐ 4.9 / 5.0 Excelente</div>
              </div>
            </div>

            {/* Modal Controls Bar (Search & Actions) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Pesquisar por nome do acolhido, leito ou função na escala..."
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAddMemberModal(true)}>
                  <Plus size={15} /> + Alocar Acolhido neste Setor
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                  <Printer size={15} /> Imprimir Escala (PDF)
                </button>
              </div>
            </div>

            {/* Interactive Roster Table */}
            <div className="table-container" style={{ maxHeight: '380px', overflowY: 'auto', marginBottom: '1.25rem' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nome do Acolhido</th>
                    <th>Alojamento / Leito</th>
                    <th>Função no Setor</th>
                    <th>Turno</th>
                    <th>Avaliação</th>
                    <th>Status da Frequência Hoje</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSetorModal.membros
                    .filter(m => {
                      const search = modalSearch.toLowerCase();
                      return m.nome.toLowerCase().includes(search) || m.leito.toLowerCase().includes(search) || m.funcao.toLowerCase().includes(search);
                    })
                    .map((m) => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>{m.nome}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>{m.leito}</td>
                      <td><span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{m.funcao}</span></td>
                      <td style={{ fontSize: '0.8rem' }}>{m.turno}</td>
                      <td><span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>⭐ {m.nota || '5.0'}</span></td>
                      <td>
                        <button
                          onClick={() => handleTogglePresence(selectedSetorModal.id, m.id)}
                          className={`btn btn-sm ${m.status === 'Presente' ? 'btn-success' : m.status === 'Posto Médico' ? 'btn-primary' : 'btn-outline'}`}
                          style={{ fontSize: '0.725rem', padding: '0.25rem 0.6rem' }}
                          title="Clique para alternar o status de frequência"
                        >
                          {m.status === 'Presente' ? '✓ Presente' : m.status === 'Posto Médico' ? '🏥 Posto Médico' : '⚠️ Ausente (Justificado)'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveMember(selectedSetorModal.id, m.id)}
                          title="Remover da Escala"
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Exibindo <strong>{selectedSetorModal.membros.length}</strong> acolhidos alocados nesta oficina de laborterapia.
              </span>
              <button className="btn btn-secondary" onClick={() => setSelectedSetorModal(null)}>
                Fechar Escala
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Alocar Novo Acolhido no Setor */}
      {showAddMemberModal && selectedSetorModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-primary">Alocar Acolhido em {selectedSetorModal.nome}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAddMemberModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSaveNewMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Selecione o Acolhido (Cadastrados na Instituição)</label>
                <select 
                  required
                  className="form-select"
                  value={newMemberData.nome}
                  onChange={(e) => {
                    const selName = e.target.value;
                    const foundA = acolhidos.find(a => a.nome === selName);
                    const bedLoc = foundA ? `${foundA.alojamento || 'Bloco A'} — ${foundA.leito || 'Leito A-101'}` : 'Bloco A - Leito A-101';
                    setNewMemberData({ 
                      ...newMemberData, 
                      nome: selName,
                      leito: bedLoc
                    });
                  }}
                >
                  <option value="">Selecione um acolhido ativo...</option>
                  {acolhidos.map(a => (
                    <option key={a.id} value={a.nome}>
                      {a.nome} — {a.alojamento} ({a.leito})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Função Específica Cadastrada ({selectedSetorModal.nome})</label>
                <select 
                  required 
                  className="form-select"
                  value={newMemberData.funcao}
                  onChange={(e) => setNewMemberData({ ...newMemberData, funcao: e.target.value })}
                >
                  <option value="">Selecione a função pré-cadastrada...</option>
                  {(cargosLaborterapia && cargosLaborterapia.length > 0 ? cargosLaborterapia : INITIAL_CARGOS_LABORTERAPIA)
                    .filter(c => !c.setor || c.setor === selectedSetorModal.nome || c.setor.toLowerCase().includes(selectedSetorModal.nome.split(' ')[0].toLowerCase()))
                    .map(c => (
                      <option key={c.id} value={c.nome}>
                        {c.nome} ({c.descricao})
                      </option>
                    ))}
                  {(cargosLaborterapia && cargosLaborterapia.length > 0 ? cargosLaborterapia : INITIAL_CARGOS_LABORTERAPIA)
                    .filter(c => c.setor && c.setor !== selectedSetorModal.nome && !c.setor.toLowerCase().includes(selectedSetorModal.nome.split(' ')[0].toLowerCase()))
                    .map(c => (
                      <option key={c.id} value={c.nome}>
                        {c.nome} (Outro Setor: {c.setor})
                      </option>
                    ))}
                  <option value="Outra Função (Digitar)">+ Outra Função (Digitar)...</option>
                </select>
              </div>
              {newMemberData.funcao === 'Outra Função (Digitar)' && (
                <div>
                  <label className="form-label">Especifique a Função Customizada</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    placeholder="Digite o nome da função..."
                    value={newMemberData.customFuncao || ''}
                    onChange={(e) => setNewMemberData({ ...newMemberData, customFuncao: e.target.value })}
                  />
                </div>
              )}

              <div className="grid-2">
                <div>
                  <label className="form-label">Turno da Escala</label>
                  <select 
                    className="form-select"
                    value={newMemberData.turno}
                    onChange={(e) => setNewMemberData({ ...newMemberData, turno: e.target.value })}
                  >
                    <option value="Manhã (07h às 11h)">Manhã (07h às 11h)</option>
                    <option value="Tarde (13h às 17h)">Tarde (13h às 17h)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Alojamento / Leito Registrado</label>
                  <input 
                    type="text" 
                    readOnly
                    className="form-input"
                    style={{ background: '#f1f5f9', color: '#334155', fontWeight: 700, cursor: 'not-allowed' }}
                    value={newMemberData.leito || 'Auto-preenchido'}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.725rem', marginTop: '2px', display: 'block' }}>
                    🔒 Vinculado à Gestão de Acolhidos & Leitos (Módulo 1)
                  </small>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddMemberModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Confirmar Alocação</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Printable Certificate of Practical Training */}
      {showCertificateModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-warning">Certificação Profissionalizante Institucional</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={16} /> Imprimir Certificado
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowCertificateModal(false)}>
                  <X size={16} /> Fechar
                </button>
              </div>
            </div>

            {/* Certificate Printable Layout */}
            <div className="printable-document" style={{ border: '4px double #0d9488', padding: '2.5rem', textAlign: 'center' }}>
              <div className="printable-header" style={{ borderBottom: '2px solid #0d9488', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.6rem', color: '#0d9488', letterSpacing: '0.05em' }}>FUNDAÇÃO DOUTOR JESUS</h2>
                <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontStyle: 'italic', color: '#475569' }}>
                  Centro de Capacitação Profissional & Laborterapia Terapêutica — Candeias / BA
                </p>
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '1.5rem 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                CERTIFICADO DE CAPACITAÇÃO PRÁTICA PROFISSIONALIZANTE
              </h3>

              <p style={{ fontSize: '1rem', lineHeight: 1.8, color: '#1e293b', textAlign: 'justify', textIndent: '2rem', marginBottom: '2rem' }}>
                Certificamos que o acolhido <strong>{selectedAcolhidoCert.nome}</strong>, inscrito no CPF sob o nº <strong>{selectedAcolhidoCert.cpf}</strong>, cumpriu com aproveitamento a carga horária prática de <strong>240 horas</strong> de Laborterapia e Formação Profissionalizante no setor de <strong>Panificação & Cozinha Industrial</strong> da Fundação Doutor Jesus, demonstrando aptidão técnica, disciplina e capacidade de trabalho em equipe para a reinserção no mercado de trabalho.
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
                    <strong>Instrutor Responsável da Oficina</strong><br />
                    Irmão Carlos (Mestre Padeiro)
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
