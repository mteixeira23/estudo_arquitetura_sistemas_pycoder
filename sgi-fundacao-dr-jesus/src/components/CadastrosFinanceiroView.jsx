import React, { useState } from 'react';
import { Landmark, Search, Plus, FileText, Award, Building2, X, Edit2, Trash2, LayoutDashboard, DollarSign, TrendingUp, PieChart, CheckCircle2 } from 'lucide-react';

export default function CadastrosFinanceiroView({ termosMROSC = [], fornecedores = [], clientes = [], activeSubTab }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Local State
  const [contasBancarias, setContasBancarias] = useState([
    { id: 1, banco: 'Banco do Brasil (001)', agencia: '3451-9', conta: '14.502-1', projeto: 'Convênio SJDH-BA nº 001/2024', saldo: 'R$ 3.492.246,16', status: 'Ativa (MROSC)' },
    { id: 2, banco: 'Caixa Econômica (104)', agencia: '0062', conta: '003.882-9', projeto: 'Recursos Próprios & Doações Sede', saldo: 'R$ 184.200,00', status: 'Ativa' }
  ]);

  const [rubricasList, setRubricasList] = useState([
    { id: 'RUB-01', elemento: 'Alimentação & Nutrição (4.000 ref/dia)', pactuado: 'R$ 3.850.000,00', empenhado: 'R$ 3.200.000,00', saldo: 'R$ 650.000,00' },
    { id: 'RUB-02', elemento: 'Equipe Multidisciplinar & Saúde RH', pactuado: 'R$ 8.920.000,00', empenhado: 'R$ 7.100.000,00', saldo: 'R$ 1.820.000,00' }
  ]);

  // Modal States
  const [showContaModal, setShowContaModal] = useState(false);
  const [showRubricaModal, setShowRubricaModal] = useState(false);
  const [editingContaId, setEditingContaId] = useState(null);
  const [editingRubricaId, setEditingRubricaId] = useState(null);

  // Form States
  const [newConta, setNewConta] = useState({ banco: 'Banco do Brasil (001)', agencia: '', conta: '', projeto: '', saldo: 'R$ 0,00' });
  const [newRubrica, setNewRubrica] = useState({ elemento: '', pactuado: 'R$ 0,00', empenhado: 'R$ 0,00', saldo: 'R$ 0,00' });

  // Subtab filtering logic
  const showTable1 = activeSubTab === 'contas_cad' || activeSubTab === 'todos_cad' || !activeSubTab;
  const showTable2 = activeSubTab === 'rubricas_cad' || activeSubTab === 'todos_cad' || !activeSubTab;

  // Open Handlers
  const handleOpenAddConta = () => {
    setEditingContaId(null);
    setNewConta({ banco: 'Banco do Brasil (001)', agencia: '', conta: '', projeto: '', saldo: 'R$ 0,00' });
    setShowContaModal(true);
  };

  const handleOpenAddRubrica = () => {
    setEditingRubricaId(null);
    setNewRubrica({ elemento: '', pactuado: 'R$ 0,00', empenhado: 'R$ 0,00', saldo: 'R$ 0,00' });
    setShowRubricaModal(true);
  };

  const handleEditConta = (c) => {
    setEditingContaId(c.id);
    setNewConta({ banco: c.banco, agencia: c.agencia, conta: c.conta, projeto: c.projeto, saldo: c.saldo });
    setShowContaModal(true);
  };

  const handleEditRubrica = (r) => {
    setEditingRubricaId(r.id);
    setNewRubrica({ elemento: r.elemento, pactuado: r.pactuado, empenhado: r.empenhado, saldo: r.saldo });
    setShowRubricaModal(true);
  };

  const handleDeleteConta = (id) => {
    if (window.confirm('Deseja excluir esta conta bancária?')) {
      setContasBancarias(contasBancarias.filter(c => c.id !== id));
    }
  };

  const handleDeleteRubrica = (id) => {
    if (window.confirm('Deseja excluir esta rubrica SJDH?')) {
      setRubricasList(rubricasList.filter(r => r.id !== id));
    }
  };

  // Save Handlers
  const handleSaveConta = (e) => {
    e.preventDefault();
    if (!newConta.agencia || !newConta.conta) return;
    if (editingContaId) {
      setContasBancarias(contasBancarias.map(c => c.id === editingContaId ? { ...c, ...newConta } : c));
    } else {
      const item = {
        id: Date.now(),
        ...newConta,
        status: 'Ativa (MROSC)'
      };
      setContasBancarias([...contasBancarias, item]);
    }
    setShowContaModal(false);
  };

  const handleSaveRubrica = (e) => {
    e.preventDefault();
    if (!newRubrica.elemento) return;
    if (editingRubricaId) {
      setRubricasList(rubricasList.map(r => r.id === editingRubricaId ? { ...r, ...newRubrica } : r));
    } else {
      const item = {
        id: `RUB-0${rubricasList.length + 1}`,
        ...newRubrica
      };
      setRubricasList([...rubricasList, item]);
    }
    setShowRubricaModal(false);
  };

  const filteredContas = contasBancarias.filter(c => c.banco.toLowerCase().includes(searchTerm.toLowerCase()) || c.projeto.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredRubricas = rubricasList.filter(r => r.elemento.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(29, 78, 216, 0.15), rgba(30, 58, 138, 0.05))',
        border: '1px solid #2563eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
            color: '#fff',
            padding: '0.85rem 1.15rem',
            borderRadius: '10px',
            fontWeight: 800,
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(29,78,216,0.25)'
          }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Macromódulo 4</div>
            <div style={{ fontSize: '1.1rem' }}>CADASTROS FINANCEIRO</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-primary">Área Exclusiva: 4. Prestação de Contas & Financeiro</span>
              <span className="badge badge-warning">Módulos 10 e 11</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0 }}>
              Cadastros de Contas Segregadas & Plano de Contas SJDH
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: '4px 0 0 0' }}>
              Ambiente estrito para controle de contas bancárias vinculadas e rubricas.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary btn-sm" onClick={handleOpenAddConta}>
            <Plus size={16} /> Nova Conta Bancária
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleOpenAddRubrica}>
            <Plus size={16} /> Nova Rubrica SJDH
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
                placeholder="Pesquisar por banco, conta, rubrica ou termo de fomento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
          </div>

          {/* Table 1: Contas Bancárias Segregadas */}
          {showTable1 && (
            <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Landmark size={20} style={{ color: '#2563eb' }} />
                  4.1. Cadastros de Contas Bancárias Segregadas & Tesouraria MROSC ({filteredContas.length})
                </h3>
                <button className="btn btn-primary btn-sm" onClick={handleOpenAddConta}>
                  <Plus size={16} /> Nova Conta Bancária
                </button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Banco</th>
                      <th>Agência</th>
                      <th>Conta Corrente</th>
                      <th>Projeto / Convênio Vinculado</th>
                      <th>Saldo Atual</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContas.map(c => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 700 }}>{c.banco}</td>
                        <td>{c.agencia}</td>
                        <td style={{ fontFamily: 'monospace' }}>{c.conta}</td>
                        <td>{c.projeto}</td>
                        <td style={{ color: '#059669', fontWeight: 800 }}>{c.saldo}</td>
                        <td><span className="badge badge-success">{c.status}</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleEditConta(c)} title="Editar Conta">
                              <Edit2 size={13} /> Editar
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteConta(c.id)} title="Excluir Conta">
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

          {/* Table 2: Plano de Contas SJDH-BA & Rubricas */}
          {showTable2 && (
            <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={20} style={{ color: '#2563eb' }} />
                  4.2. Cadastros do Plano de Contas & Rubricas Pactuadas SJDH-BA ({filteredRubricas.length})
                </h3>
                <button className="btn btn-primary btn-sm" onClick={handleOpenAddRubrica}>
                  <Plus size={16} /> Nova Rubrica SJDH
                </button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Código Rubrica</th>
                      <th>Elemento de Despesa</th>
                      <th>Valor Pactuado Global</th>
                      <th>Empenhado / SCs</th>
                      <th>Saldo Disponível</th>
                      <th style={{ textAlign: 'right' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRubricas.map(r => (
                      <tr key={r.id}>
                        <td><span className="badge badge-primary">{r.id}</span></td>
                        <td style={{ fontWeight: 700 }}>{r.elemento}</td>
                        <td>{r.pactuado}</td>
                        <td>{r.empenhado}</td>
                        <td style={{ color: '#059669', fontWeight: 700 }}>{r.saldo}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleEditRubrica(r)} title="Editar Rubrica">
                              <Edit2 size={13} /> Editar
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRubrica(r.id)} title="Excluir Rubrica">
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
      {showContaModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Landmark size={20} style={{ color: '#2563eb' }} />
                {editingContaId ? 'Editar Conta Bancária Segregada' : 'Cadastrar Nova Conta Bancária Segregada'}
              </h3>
              <button className="btn-close" onClick={() => setShowContaModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveConta}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Instituição Financeira / Banco *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Banco do Brasil, Caixa, Bradesco..."
                    value={newConta.banco}
                    onChange={(e) => setNewConta({ ...newConta, banco: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Agência *</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="3451-9"
                      value={newConta.agencia}
                      onChange={(e) => setNewConta({ ...newConta, agencia: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Conta Corrente *</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="14.502-1"
                      value={newConta.conta}
                      onChange={(e) => setNewConta({ ...newConta, conta: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Projeto / Termo MROSC Vinculado *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Convênio SJDH-BA nº 001/2024"
                    value={newConta.projeto}
                    onChange={(e) => setNewConta({ ...newConta, projeto: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Saldo Inicial Declarado (R$)</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="R$ 0,00"
                    value={newConta.saldo}
                    onChange={(e) => setNewConta({ ...newConta, saldo: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowContaModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingContaId ? 'Salvar Alterações' : 'Salvar Conta Bancária'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRubricaModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <FileText size={20} style={{ color: '#2563eb' }} />
                {editingRubricaId ? 'Editar Rubrica SJDH-BA' : 'Cadastrar Nova Rubrica SJDH-BA'}
              </h3>
              <button className="btn-close" onClick={() => setShowRubricaModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveRubrica}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Elemento de Despesa / Objeto *</label>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Ex: Alimentação & Nutrição ou Saúde RH"
                    value={newRubrica.elemento}
                    onChange={(e) => setNewRubrica({ ...newRubrica, elemento: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Valor Pactuado Global (R$) *</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="R$ 1.000.000,00"
                      value={newRubrica.pactuado}
                      onChange={(e) => setNewRubrica({ ...newRubrica, pactuado: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Empenhado Inicial (R$)</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="R$ 0,00"
                      value={newRubrica.empenhado}
                      onChange={(e) => setNewRubrica({ ...newRubrica, empenhado: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowRubricaModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRubricaId ? 'Salvar Alterações' : 'Salvar Rubrica'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
