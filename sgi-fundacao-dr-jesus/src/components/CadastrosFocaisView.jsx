import React, { useState } from 'react';
import { ShieldCheck, Search, Plus, Edit2, X } from 'lucide-react';

export default function CadastrosFocaisView() {
  const [searchTerm, setSearchTerm] = useState('');

  const [pessoasFocais, setPessoasFocais] = useState([
    { macroId: 1, macroNome: '1. Gestão dos Acolhidos', modulosContidos: 'Módulos 1, 2, 3 e 4 (Admissão, Leitos, Família e Altas)', pessoaFocal: 'Pastor Doutor Jesus', emailFocal: 'presidencia@fundacaodrjesus.org.br', cargo: 'Presidente / Diretor Geral', poderesDelegados: 'Aprovação Final de Admissões, Regras e Altas Terapêuticas', status: 'Ativo' },
    { macroId: 2, macroNome: '2. Módulo Administrativo', modulosContidos: 'Módulos 5, 6 e 7 (Almoxarifado, Despensa e Frota)', pessoaFocal: 'Marcos Vinícius Teixeira', emailFocal: 'marcos.teixeira@singulariconsult.com.br', cargo: 'Gestor Administrativo & Suprimentos', poderesDelegados: 'Aprovação de SCs, Liberação de Alimentos e Frotas', status: 'Ativo' },
    { macroId: 3, macroNome: '3. Saúde & Multidisciplinar', modulosContidos: 'Módulos 8 e 9 (Prontuários RDC 29 e Laborterapia)', pessoaFocal: 'Dr. Roberto Magalhães', emailFocal: 'saude@fundacaodrjesus.org.br', cargo: 'Médico Responsável Técnico (CRM-BA 14.892)', poderesDelegados: 'Assinatura Técnica de Prontuários e PTI ANVISA', status: 'Ativo' },
    { macroId: 4, macroNome: '4. Prestação de Contas', modulosContidos: 'Módulos 10 e 11 (Financeiro Segregado e MROSC)', pessoaFocal: 'Dra. Patricia Lima', emailFocal: 'financeiro@fundacaodrjesus.org.br', cargo: 'Coordenadora de Prestação de Contas', poderesDelegados: 'Emissão de REF/REO, Liquidação NFe e Conciliação', status: 'Ativo' },
    { macroId: 5, macroNome: '5. Diretoria & BI Executivo', modulosContidos: 'Módulo 12 (Painel BI 360° & Governança)', pessoaFocal: 'Conselho Deliberativo FDJ', emailFocal: 'diretoria@fundacaodrjesus.org.br', cargo: 'Conselho Executivo Singulari / FDJ', poderesDelegados: 'Visão Estratégica, Auditoria TCE-BA e Metas', status: 'Ativo' }
  ]);

  // Modal State
  const [editingFocal, setEditingFocal] = useState(null);

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setPessoasFocais(pessoasFocais.map(f => f.macroId === editingFocal.macroId ? editingFocal : f));
    setEditingFocal(null);
  };

  const filteredFocais = pessoasFocais.filter(f => f.macroNome.toLowerCase().includes(searchTerm.toLowerCase()) || f.pessoaFocal.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.15), rgba(180, 83, 9, 0.05))',
        border: '1px solid #d97706',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #d97706, #b45309)',
            color: '#fff',
            padding: '0.85rem 1.15rem',
            borderRadius: '10px',
            fontWeight: 800,
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(217,119,6,0.25)'
          }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Macromódulo 5</div>
            <div style={{ fontSize: '1.1rem' }}>PESSOAS FOCAIS & GOVERNANÇA</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-warning">Matriz Executiva: 5. Diretoria & BI</span>
              <span className="badge badge-primary">Delegação de Poderes</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0 }}>
              Matriz de Pessoas Focais & Delegação de Poderes por Macromódulo
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: '4px 0 0 0' }}>
              Mapeamento formal dos responsáveis com autoridade de gestão e assinatura em cada uma das áreas estratégicas.
            </p>
          </div>
        </div>
      </div>

      {/* Table: Pessoas Focais */}
      <div className="card" style={{ borderLeft: '4px solid #d97706' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Macromódulo Estratégico</th>
                <th>Pessoa Focal Responsável</th>
                <th>E-mail de Contato</th>
                <th>Cargo / Função</th>
                <th>Poderes Delegados</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredFocais.map(f => (
                <tr key={f.macroId}>
                  <td style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    {f.macroNome}
                  </td>
                  <td style={{ fontWeight: 700, color: '#2563eb' }}>{f.pessoaFocal}</td>
                  <td style={{ fontSize: '0.8rem' }}>{f.emailFocal}</td>
                  <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>{f.cargo}</td>
                  <td style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>{f.poderesDelegados}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingFocal(f)}>
                      <Edit2 size={14} /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingFocal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <ShieldCheck size={20} style={{ color: '#d97706' }} />
                Editar Pessoa Focal — {editingFocal.macroNome}
              </h3>
              <button className="btn-close" onClick={() => setEditingFocal(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Pessoa Focal Responsável *</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={editingFocal.pessoaFocal}
                    onChange={(e) => setEditingFocal({ ...editingFocal, pessoaFocal: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">E-mail de Contato *</label>
                    <input 
                      type="email"
                      className="form-input"
                      value={editingFocal.emailFocal}
                      onChange={(e) => setEditingFocal({ ...editingFocal, emailFocal: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Cargo / Função *</label>
                    <input 
                      type="text"
                      className="form-input"
                      value={editingFocal.cargo}
                      onChange={(e) => setEditingFocal({ ...editingFocal, cargo: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Poderes Delegados *</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={editingFocal.poderesDelegados}
                    onChange={(e) => setEditingFocal({ ...editingFocal, poderesDelegados: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingFocal(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
