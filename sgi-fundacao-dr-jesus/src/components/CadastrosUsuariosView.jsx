import React, { useState } from 'react';
import { KeyRound, Search, Plus, UserCheck, X, Edit2, Trash2 } from 'lucide-react';

export default function CadastrosUsuariosView() {
  const [searchTerm, setSearchTerm] = useState('');

  const [usuariosSGI, setUsuariosSGI] = useState([
    { id: 'USR-001', nome: 'Marcos Vinícius Teixeira', email: 'marcos.vinicius2323@gmail.com', perfil: 'Administrador do Sistema (SuperAdmin)', setor: 'Gestão Executiva / TI', ultimoAcesso: 'Hoje às 11:02', status: 'Ativo' },
    { id: 'USR-002', nome: 'Pr. Doutor Jesus', email: 'presidencia@fundacaodrjesus.org.br', perfil: 'Diretoria Executiva', setor: 'Presidência', ultimoAcesso: 'Hoje às 09:15', status: 'Ativo' },
    { id: 'USR-003', nome: 'Dra. Patricia Lima', email: 'financeiro@fundacaodrjesus.org.br', perfil: 'Gestor Financeiro / MROSC', setor: 'Prestação de Contas', ultimoAcesso: 'Hoje às 10:40', status: 'Ativo' },
    { id: 'USR-004', nome: 'Dr. Roberto Magalhães', email: 'saude@fundacaodrjesus.org.br', perfil: 'Corpo Clínico / Saúde', setor: 'Prontuário & Enfermaria', ultimoAcesso: 'Ontem às 16:20', status: 'Ativo' }
  ]);

  // Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newUser, setNewUser] = useState({ nome: '', email: '', perfil: 'Operador de Módulo', setor: 'Gestão dos Acolhidos' });

  const handleOpenAddUser = () => {
    setEditingUserId(null);
    setNewUser({ nome: '', email: '', perfil: 'Operador de Módulo', setor: 'Gestão dos Acolhidos' });
    setShowUserModal(true);
  };

  const handleEditUser = (u) => {
    setEditingUserId(u.id);
    setNewUser({ nome: u.nome, email: u.email, perfil: u.perfil, setor: u.setor });
    setShowUserModal(true);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Deseja excluir este usuário do SGI?')) {
      setUsuariosSGI(usuariosSGI.filter(u => u.id !== id));
    }
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!newUser.nome || !newUser.email) return;

    if (editingUserId) {
      setUsuariosSGI(usuariosSGI.map(u => u.id === editingUserId ? { ...u, ...newUser } : u));
    } else {
      const item = {
        id: `USR-00${usuariosSGI.length + 1}`,
        ...newUser,
        ultimoAcesso: 'Nunca acessou',
        status: 'Ativo'
      };
      setUsuariosSGI([...usuariosSGI, item]);
    }
    setShowUserModal(false);
  };

  const filteredUsers = usuariosSGI.filter(u => u.nome.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.15), rgba(30, 41, 59, 0.05))',
        border: '1px solid #0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            color: '#fff',
            padding: '0.85rem 1.15rem',
            borderRadius: '10px',
            fontWeight: 800,
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(15,23,42,0.25)'
          }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Macromódulo 6</div>
            <div style={{ fontSize: '1.1rem' }}>CADASTROS DE USUÁRIOS SGI</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-secondary">Área Exclusiva: 6. Administração do Sistema & TI</span>
              <span className="badge badge-primary">Módulo 13</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0 }}>
              Gestão de Usuários, Credenciais e Permissões do Sistema SGI
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: '4px 0 0 0' }}>
              Gerenciamento centralizado de e-mails, perfis de acesso e credenciais de segurança da Fundação Doutor Jesus.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary btn-sm" onClick={handleOpenAddUser}>
            <Plus size={16} /> Cadastrar Novo Usuário SGI
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
            placeholder="Pesquisar usuário por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
      </div>

      {/* Table: Usuários SGI */}
      <div className="card" style={{ borderLeft: '4px solid #0f172a' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código ID</th>
                <th>Nome do Usuário</th>
                <th>E-mail Principal</th>
                <th>Perfil de Acesso</th>
                <th>Setor / Macromódulo</th>
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
                  <td><span className="badge badge-info">{u.perfil}</span></td>
                  <td>{u.setor}</td>
                  <td style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{u.ultimoAcesso}</td>
                  <td><span className="badge badge-success">{u.status}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEditUser(u)} title="Editar Usuário">
                        <Edit2 size={13} /> Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u.id)} title="Excluir Usuário">
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

      {/* MODAL: NOVO / EDITAR USUÁRIO */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <KeyRound size={20} style={{ color: '#0f172a' }} />
                {editingUserId ? 'Editar Usuário do Sistema' : 'Cadastrar Novo Usuário do Sistema SGI'}
              </h3>
              <button className="btn-close" onClick={() => setShowUserModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveUser}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Nome Completo do Usuário *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: João da Silva"
                    value={newUser.nome}
                    onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">E-mail Institucional *</label>
                  <input 
                    type="email"
                    className="form-input"
                    placeholder="usuario@fundacaodrjesus.org.br"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Perfil de Acesso *</label>
                    <select 
                      className="form-select"
                      value={newUser.perfil}
                      onChange={(e) => setNewUser({ ...newUser, perfil: e.target.value })}
                      required
                    >
                      <option value="Operador de Módulo">Operador de Módulo</option>
                      <option value="Gestor do Macromódulo">Gestor do Macromódulo</option>
                      <option value="Corpo Clínico / Saúde">Corpo Clínico / Saúde</option>
                      <option value="Auditor MROSC">Auditor MROSC</option>
                      <option value="Administrador do Sistema (SuperAdmin)">Administrador do Sistema (SuperAdmin)</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Setor / Macromódulo *</label>
                    <select 
                      className="form-select"
                      value={newUser.setor}
                      onChange={(e) => setNewUser({ ...newUser, setor: e.target.value })}
                      required
                    >
                      <option value="Gestão dos Acolhidos">Gestão dos Acolhidos</option>
                      <option value="Administrativo & Suprimentos">Administrativo & Suprimentos</option>
                      <option value="Saúde & Enfermaria">Saúde & Enfermaria</option>
                      <option value="Prestação de Contas & Financeiro">Prestação de Contas & Financeiro</option>
                      <option value="Diretoria & Governança">Diretoria & Governança</option>
                      <option value="Infraestrutura & TI">Infraestrutura & TI</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUserModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUserId ? 'Salvar Alterações' : 'Salvar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
