import React, { useState } from 'react';
import { 
  KeyRound, 
  Search, 
  Plus, 
  UserCheck, 
  X, 
  Edit2, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Clock, 
  FileText, 
  Smartphone, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Eye, 
  RefreshCw,
  Server
} from 'lucide-react';

export const PERFIS_RBAC = [
  { id: 'superadmin', nome: 'SuperAdmin (TI & DevOps)', setor: 'TI & Governança', nivel: 'Acesso Global Total', cor: 'badge-danger', modulosPermitidos: ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12','M13'] },
  { id: 'presidencia', nome: 'Presidência & Diretoria Executiva', setor: 'Presidência', nivel: 'Estratégico / BI 360°', cor: 'badge-primary', modulosPermitidos: ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12'] },
  { id: 'recepcao', nome: 'Recepção & Triagem (M1/M4)', setor: 'Acolhimento', nivel: 'Admissão & Desligamento', cor: 'badge-info', modulosPermitidos: ['M1','M4'] },
  { id: 'monitores', nome: 'Monitores de Alojamento (M2)', setor: 'Alojamentos', nivel: 'Censo & Leitos (Touch)', cor: 'badge-warning', modulosPermitidos: ['M2'] },
  { id: 'servico_social', nome: 'Serviço Social (M3)', setor: 'Acolhimento', nivel: 'Famílias & Visitas', cor: 'badge-secondary', modulosPermitidos: ['M1','M3','M4'] },
  { id: 'almoxarife', nome: 'Almoxarife Central (M5)', setor: 'Logística', nivel: 'Estoque FEFO & RMI', cor: 'badge-info', modulosPermitidos: ['M5'] },
  { id: 'nutricao_cozinha', nome: 'Nutrição & Cozinha (M6)', setor: 'Nutrição', nivel: 'Cocção & Dietas', cor: 'badge-success', modulosPermitidos: ['M6'] },
  { id: 'frota_trafego', nome: 'Encarregado de Frota (M7)', setor: 'Transporte', nivel: 'Veículos, Diesel & PRF', cor: 'badge-warning', modulosPermitidos: ['M7'] },
  { id: 'corpo_clinico', nome: 'Corpo Clínico & Farmácia (M8)', setor: 'Saúde', nivel: 'Prontuário RDC 29 / Port. 344', cor: 'badge-danger', modulosPermitidos: ['M8'] },
  { id: 'mestre_oficio', nome: 'Mestres de Laborterapia (M9)', setor: 'Laborterapia', nivel: 'Oficinas & Frequência 30h', cor: 'badge-secondary', modulosPermitidos: ['M9'] },
  { id: 'tesouraria', nome: 'Tesouraria & Finanças (M10)', setor: 'Financeiro', nivel: 'Contas BB & Conciliação', cor: 'badge-success', modulosPermitidos: ['M10'] },
  { id: 'gestor_mrosc', nome: 'Gestor MROSC & Compras (M11)', setor: 'Prestação de Contas', nivel: 'Cotações & Anexos TCE-BA', cor: 'badge-primary', modulosPermitidos: ['M11'] },
];

export default function CadastrosUsuariosView() {
  const [activeTab, setActiveTab] = useState('usuarios');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSentToast, setSupportSentToast] = useState(false);

  // Usuários com RBAC, 2FA e Conselho de Classe
  const [usuariosSGI, setUsuariosSGI] = useState([
    { id: 'USR-001', nome: 'Marcos Vinícius Teixeira', email: 'marcos.vinicius2323@gmail.com', perfilId: 'superadmin', perfil: 'SuperAdmin (TI & DevOps)', setor: 'TI & Governança', conselho: 'CREA-BA / TI', status2FA: 'Ativo (Autenticado)', ultimoAcesso: 'Hoje às 11:02', status: 'Ativo' },
    { id: 'USR-002', nome: 'Pr. Doutor Jesus', email: 'presidencia@fundacaodrjesus.org.br', perfilId: 'presidencia', perfil: 'Presidência & Diretoria Executiva', setor: 'Presidência', conselho: 'Diretoria Geral', status2FA: 'Ativo (Autenticado)', ultimoAcesso: 'Hoje às 09:15', status: 'Ativo' },
    { id: 'USR-003', nome: 'Dra. Patricia Lima', email: 'financeiro@fundacaodrjesus.org.br', perfilId: 'tesouraria', perfil: 'Tesouraria & Finanças (M10)', setor: 'Prestação de Contas', conselho: 'CRC-BA 41.209', status2FA: 'Ativo (Autenticado)', ultimoAcesso: 'Hoje às 10:40', status: 'Ativo' },
    { id: 'USR-004', nome: 'Dr. Roberto Magalhães', email: 'saude@fundacaodrjesus.org.br', perfilId: 'corpo_clinico', perfil: 'Corpo Clínico & Farmácia (M8)', setor: 'Prontuário & Enfermaria', conselho: 'CRM-BA 14.820', status2FA: 'Ativo (Autenticado)', ultimoAcesso: 'Ontem às 16:20', status: 'Ativo' },
    { id: 'USR-005', nome: 'Irmão Carlos Padaria', email: 'padaria@fundacaodrjesus.org.br', perfilId: 'mestre_oficio', perfil: 'Mestres de Laborterapia (M9)', setor: 'Laborterapia', conselho: 'Instrutor Técnico', status2FA: 'Pendente', ultimoAcesso: 'Hoje às 07:10', status: 'Ativo' },
    { id: 'USR-006', nome: 'Monitor Valdeci Ramos', email: 'alojamento.a@fundacaodrjesus.org.br', perfilId: 'monitores', perfil: 'Monitores de Alojamento (M2)', setor: 'Alojamentos (Bloco A)', conselho: 'Monitoria', status2FA: 'Pendente', ultimoAcesso: 'Hoje às 06:45', status: 'Ativo' },
  ]);

  // Trilha Forense Imutável de Auditoria LGPD (AuditLog)
  const [auditLogs] = useState([
    { id: 'LOG-9841', timestamp: '2026-09-30 09:42:10 BRT', usuario: 'Dr. Roberto Magalhães (CRM-BA 14820)', perfil: 'Corpo Clínico', ip: '192.168.10.45', modulo: 'M8 - Prontuário RDC 29', acao: 'CONSULTA_TESTES_RAPIDOS_HIV_SIFILIS', registroAlvo: 'Antonio Carlos da Silva Filho (FDJ-2026-0891)', status: 'AUTORIZADO_HTTP_200' },
    { id: 'LOG-9840', timestamp: '2026-09-30 09:35:22 BRT', usuario: 'Monitor Valdeci Ramos', perfil: 'Monitores de Alojamento', ip: '192.168.10.82', modulo: 'M10 - Financeiro MROSC', acao: 'TENTATIVA_ACESSO_EXTRATO_BB', registroAlvo: 'C/C 14.502-1', status: 'BLOQUEADO_HTTP_403_FORBIDDEN' },
    { id: 'LOG-9839', timestamp: '2026-09-30 09:28:14 BRT', usuario: 'Dra. Patricia Lima (CRC-BA 41209)', perfil: 'Tesouraria & Finanças', ip: '192.168.10.12', modulo: 'M10 - Financeiro MROSC', acao: 'LIQUIDACAO_TED_BB_ALIMENTOS', registroAlvo: 'NF 004892 - R$ 32.500,00', status: 'AUTORIZADO_HTTP_200' },
    { id: 'LOG-9838', timestamp: '2026-09-30 09:15:00 BRT', usuario: 'Pr. Doutor Jesus', perfil: 'Presidência & Diretoria', ip: '192.168.10.05', modulo: 'M12 - Cockpit Presidência', acao: 'CONSULTA_TELEMETRIA_CENSO_1150', registroAlvo: 'Painel Executivo', status: 'AUTORIZADO_HTTP_200' },
    { id: 'LOG-9837', timestamp: '2026-09-30 08:00:11 BRT', usuario: 'Enf. Juliana Ramos (COREN-BA 20491)', perfil: 'Corpo Clínico', ip: '192.168.10.46', modulo: 'M8 - Farmácia & Prescrição', acao: 'DISPENSACAO_PSICOTROPICO_BEIRA_LEITO', registroAlvo: 'Clonazepam 2mg - FDJ-2026-0891', status: 'AUTORIZADO_HTTP_200' }
  ]);

  // Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newUser, setNewUser] = useState({ 
    nome: '', 
    email: '', 
    perfilId: 'monitores', 
    setor: 'Alojamentos', 
    conselho: '',
    status2FA: 'Pendente' 
  });

  const handleOpenAddUser = () => {
    setEditingUserId(null);
    setNewUser({ nome: '', email: '', perfilId: 'monitores', setor: 'Alojamentos', conselho: '', status2FA: 'Pendente' });
    setShowUserModal(true);
  };

  const handleEditUser = (u) => {
    setEditingUserId(u.id);
    setNewUser({ 
      nome: u.nome, 
      email: u.email, 
      perfilId: u.perfilId, 
      setor: u.setor, 
      conselho: u.conselho,
      status2FA: u.status2FA 
    });
    setShowUserModal(true);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Deseja revogar o acesso deste usuário no SGI? Esta ação será registrada no AuditLog imutável.')) {
      setUsuariosSGI(usuariosSGI.filter(u => u.id !== id));
    }
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!newUser.nome || !newUser.email) return;

    const perfilObj = PERFIS_RBAC.find(p => p.id === newUser.perfilId) || PERFIS_RBAC[3];

    if (editingUserId) {
      setUsuariosSGI(usuariosSGI.map(u => u.id === editingUserId ? { 
        ...u, 
        ...newUser, 
        perfil: perfilObj.nome, 
        setor: perfilObj.setor 
      } : u));
    } else {
      const item = {
        id: `USR-00${usuariosSGI.length + 1}`,
        ...newUser,
        perfil: perfilObj.nome,
        setor: perfilObj.setor,
        ultimoAcesso: 'Nunca acessou',
        status: 'Ativo'
      };
      setUsuariosSGI([...usuariosSGI, item]);
    }
    setShowUserModal(false);
  };

  const handleSendSupport = (e) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportSentToast(true);
    setSupportMessage('');
    setShowSupportModal(false);
    setTimeout(() => setSupportSentToast(false), 5000);
  };

  const filteredUsers = usuariosSGI.filter(u => 
    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.perfil.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header Banner com Tabs de Governança */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
        border: '1px solid #1e293b',
        color: '#fff',
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
            boxShadow: '0 4px 12px rgba(2,132,199,0.3)'
          }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Macromódulo 6</div>
            <div style={{ fontSize: '1.1rem' }}>MÓDULO 13: GOVERNANÇA & TI</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-primary">Matriz RBAC: 12 Perfis</span>
              <span className="badge badge-success">Trilha LGPD Imutável</span>
              <span className="badge badge-warning">2FA Obrigatório</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', margin: 0 }}>
              Gestão de Identidades, Credenciais & Auditoria Forense
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.825rem', margin: '4px 0 0 0' }}>
              Controle de acesso por função (RBAC), rastreabilidade de dados médicos e segurança cibernética da Fundação Dr. Jesus.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowSupportModal(true)}>
            <HelpCircle size={15} /> Ponto Focal de TI
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleOpenAddUser}>
            <Plus size={16} /> Cadastrar Usuário com RBAC
          </button>
        </div>
      </div>

      {/* Toast de Suporte Enviado */}
      {supportSentToast && (
        <div className="card" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <strong>Chamado registrado com sucesso!</strong> O Ponto Focal de TI da Fundação Dr. Jesus recebeu sua solicitação com telemetria da tela e responderá em instantes.
        </div>
      )}

      {/* Sub-Abas de Navegação */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button 
          className={`btn btn-sm ${activeTab === 'usuarios' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('usuarios')}
        >
          <UserCheck size={15} /> Usuários & Perfis RBAC ({usuariosSGI.length})
        </button>
        <button 
          className={`btn btn-sm ${activeTab === 'auditlog' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('auditlog')}
        >
          <FileText size={15} /> Trilha Forense LGPD (AuditLog)
        </button>
        <button 
          className={`btn btn-sm ${activeTab === 'matriz' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('matriz')}
        >
          <Layers size={15} /> Matriz de Permissões (12 Perfis)
        </button>
      </div>

      {/* ABA 1: USUÁRIOS E CREDENCIAIS */}
      {activeTab === 'usuarios' && (
        <>
          {/* Barra de Pesquisa */}
          <div className="card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', padding: '0.85rem 1.25rem' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Pesquisar por nome, e-mail ou perfil funcional..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Mostrando {filteredUsers.length} usuários ativos
            </div>
          </div>

          {/* Tabela de Usuários */}
          <div className="card" style={{ borderLeft: '4px solid #0f172a' }}>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código ID</th>
                    <th>Nome do Usuário</th>
                    <th>E-mail</th>
                    <th>Perfil RBAC Estrito</th>
                    <th>Conselho de Classe</th>
                    <th>Status 2FA</th>
                    <th>Último Acesso</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td><span className="badge badge-primary">{u.id}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{u.nome}</td>
                      <td style={{ fontSize: '0.8rem' }}>{u.email}</td>
                      <td>
                        <span className="badge badge-info">
                          {u.perfil}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.775rem', fontWeight: 600 }}>{u.conselho || 'N/A'}</td>
                      <td>
                        <span className={`badge ${u.status2FA.includes('Ativo') ? 'badge-success' : 'badge-warning'}`}>
                          {u.status2FA}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{u.ultimoAcesso}</td>
                      <td><span className="badge badge-success">{u.status}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleEditUser(u)} title="Editar Permissões">
                            <Edit2 size={13} />
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u.id)} title="Revogar Acesso">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ABA 2: TRILHA FORENSE LGPD (AUDITLOG) */}
      {activeTab === 'auditlog' && (
        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} style={{ color: '#0284c7' }} /> Trilha Forense Imutável de Auditoria (Art. 6º e 11 da LGPD)
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
                Gravação síncrona em tabela append-only (somente inserção). Registros permanentemente auditáveis para fiscalização da ANPD e do Ministério Público.
              </p>
            </div>
            <span className="badge badge-success">Armazenamento Criptografado R2</span>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Data/Hora (UTC / BRT)</th>
                  <th>Operador / Usuário</th>
                  <th>IP Origem</th>
                  <th>Módulo Alvo</th>
                  <th>Ação Executada</th>
                  <th>Registro / Paciente Alvo</th>
                  <th>Resultado HTTP</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id} style={{ background: log.status.includes('BLOQUEADO') ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                    <td><code>{log.id}</code></td>
                    <td style={{ fontSize: '0.775rem' }}>{log.timestamp}</td>
                    <td style={{ fontWeight: 600 }}>{log.usuario}</td>
                    <td><code>{log.ip}</code></td>
                    <td><span className="badge badge-secondary">{log.modulo}</span></td>
                    <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>{log.acao}</td>
                    <td style={{ fontSize: '0.8rem' }}>{log.registroAlvo}</td>
                    <td>
                      <span className={`badge ${log.status.includes('200') ? 'badge-success' : 'badge-danger'}`}>
                        {log.status.includes('200') ? '200 OK' : '403 FORBIDDEN'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 3: MATRIZ DE PERMISSÕES DOS 12 PERFIS */}
      {activeTab === 'matriz' && (
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} style={{ color: '#10b981' }} /> Matriz de Isolamento Funcional (RBAC)
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0 0 1rem 0' }}>
            Delimitação estrita de acesso aos 13 módulos do SGI. Tentativas de acesso a módulos não permitidos retornam HTTP 403 Forbidden imediato.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {PERFIS_RBAC.map(perfil => (
              <div key={perfil.id} className="card" style={{ background: 'rgba(15, 23, 42, 0.03)', border: '1px solid var(--border-color)', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)' }}>{perfil.nome}</h4>
                  <span className={`badge ${perfil.cor}`}>{perfil.setor}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  <strong>Nível de Prerrogativa:</strong> {perfil.nivel}
                </div>
                <div style={{ fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.35rem' }}>Módulos Autorizados:</div>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                  {perfil.modulosPermitidos.map(m => (
                    <span key={m} className="badge badge-success" style={{ fontSize: '0.7rem' }}>{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: NOVO / EDITAR USUÁRIO */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <KeyRound size={20} style={{ color: '#0f172a' }} />
                {editingUserId ? 'Editar Credencial & Permissão RBAC' : 'Cadastrar Novo Usuário com RBAC'}
              </h3>
              <button className="btn-close" onClick={() => setShowUserModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveUser}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Nome Completo do Colaborador *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Dra. Mariana Costa"
                    value={newUser.nome}
                    onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">E-mail Institucional *</label>
                    <input 
                      type="email"
                      className="form-input"
                      placeholder="nome@fundacaodrjesus.org.br"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Registro Conselho de Classe</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="Ex: CRM-BA 14820 ou N/A"
                      value={newUser.conselho}
                      onChange={(e) => setNewUser({ ...newUser, conselho: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Perfil Funcional Estrito (Matriz RBAC) *</label>
                  <select 
                    className="form-select"
                    value={newUser.perfilId}
                    onChange={(e) => setNewUser({ ...newUser, perfilId: e.target.value })}
                    required
                  >
                    {PERFIS_RBAC.map(p => (
                      <option key={p.id} value={p.id}>{p.nome} — ({p.nivel})</option>
                    ))}
                  </select>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid #f59e0b', borderRadius: '8px', padding: '0.75rem', fontSize: '0.8rem', color: '#b45309' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    <Smartphone size={16} /> Autenticação em Dois Fatores (2FA):
                  </div>
                  Usuários com perfil de Saúde (M8), Tesouraria (M10), MROSC (M11) ou SuperAdmin devem escanear o QR Code no Google Authenticator no primeiro login para desbloqueio da sessão.
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUserModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUserId ? 'Salvar Permissões' : 'Salvar e Conceder Acesso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PONTO FOCAL DE TI / SUPORTE */}
      {showSupportModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <HelpCircle size={20} style={{ color: '#0284c7' }} /> Chamar Ponto Focal de TI / Suporte
              </h3>
              <button className="btn-close" onClick={() => setShowSupportModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSendSupport}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                  Relate sua dúvida ou dificuldade técnica. O sistema anexará automaticamente a telemetria do módulo ativo e despachará para a equipe de plantão de TI no campus.
                </p>
                <div>
                  <label className="form-label">Descrição do Problema ou Dúvida *</label>
                  <textarea 
                    className="form-input" 
                    rows={4}
                    placeholder="Ex: Estou com dificuldade para dar baixa na RMI do arroz no Galpão A..."
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    required
                  />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(15,23,42,0.04)', padding: '0.5rem', borderRadius: '6px' }}>
                  <strong>Dados Anexados Automaticamente:</strong> Módulo Ativo: M13 Governança • Resolução: {window.innerWidth}x{window.innerHeight} • Conexão: Segura TLS 1.3
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSupportModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Enviar para a TI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
