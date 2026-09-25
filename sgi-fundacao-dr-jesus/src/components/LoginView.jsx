import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  KeyRound,
  Building2,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    label: '👑 Presidência & Diretoria Executiva',
    nome: 'Dep. Pastor Sargento Isidório',
    email: 'diretoria@fundacaodrjesus.org.br',
    senha: 'fdj2026',
    perfil: 'Diretoria'
  },
  {
    label: '📋 Projetos MROSC / Convênio SJDH',
    nome: 'Coordenação de Projetos SJDH-BA',
    email: 'projetos@fundacaodrjesus.org.br',
    senha: 'fdj2026',
    perfil: 'Gestão MROSC'
  },
  {
    label: '🩺 Saúde & ANVISA (RDC 29)',
    nome: 'Equipe Multidisciplinar de Saúde',
    email: 'saude@fundacaodrjesus.org.br',
    senha: 'fdj2026',
    perfil: 'Saúde/Enfermagem'
  }
];

export default function LoginView({ onLoginSuccess, onBackToLanding }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    nome: 'Marcos Vinicius Bruno Teixeira',
    email: 'marcos.teixeira@fundacaodrjesus.org.br',
    senha: '',
    confirmarSenha: '',
    perfil: 'Diretoria',
    termoAceito: true
  });

  const handleSelectDemoAccount = (acc) => {
    setFormData({
      nome: acc.nome,
      email: acc.email,
      senha: acc.senha,
      confirmarSenha: acc.senha,
      perfil: acc.perfil,
      termoAceito: true
    });
    setErrorMessage('');
    setSuccessMessage(`Credenciais da ${acc.label} selecionadas! Clique em "Entrar no Sistema".`);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.email || !formData.senha) {
      setErrorMessage('Por favor, informe seu e-mail e senha para acessar.');
      return;
    }

    // Check saved user session or allow standard authentication
    const savedUserJSON = localStorage.getItem('sgi_fdj_user');
    let userToLogin = {
      nome: formData.nome || 'Usuário SGI',
      email: formData.email,
      perfil: formData.perfil
    };

    if (savedUserJSON) {
      const saved = JSON.parse(savedUserJSON);
      if (saved.email === formData.email && saved.senha && saved.senha !== formData.senha) {
        setErrorMessage('Senha incorreta. Verifique os dados digitados.');
        return;
      }
      userToLogin = { ...saved, perfil: formData.perfil };
    }

    // Save active session
    localStorage.setItem('sgi_fdj_session', JSON.stringify({
      ...userToLogin,
      loginAt: new Date().toISOString()
    }));

    setSuccessMessage('Autenticação realizada com sucesso! Redirecionando...');
    setTimeout(() => {
      onLoginSuccess(userToLogin);
    }, 600);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.nome || !formData.email || !formData.senha) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (formData.senha.length < 6) {
      setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setErrorMessage('As senhas digitadas não coincidem. Digite novamente.');
      return;
    }

    const newUserData = {
      nome: formData.nome,
      email: formData.email,
      senha: formData.senha,
      perfil: formData.perfil,
      createdAt: new Date().toISOString()
    };

    // Save registered user and active session
    localStorage.setItem('sgi_fdj_user', JSON.stringify(newUserData));
    localStorage.setItem('sgi_fdj_session', JSON.stringify({
      ...newUserData,
      loginAt: new Date().toISOString()
    }));

    setSuccessMessage('Primeiro acesso cadastrado com sucesso! Entrando no sistema...');
    setTimeout(() => {
      onLoginSuccess(newUserData);
    }, 800);
  };

  return (
    <div className="login-page-container" style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      minHeight: '100vh',
      background: "linear-gradient(180deg, rgba(248, 250, 252, 0.88) 0%, rgba(255, 255, 255, 0.94) 100%), url('/sede_fundacao_dr_jesus.jpg') center/cover no-repeat",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'between'
    }}>
      {/* HEADER OFICIAL IDÊNTICO AOS MÓDULOS */}
      <header className="header-bar" style={{
        background: '#ffffff',
        borderBottom: '1px solid #cbd5e1',
        padding: '0.65rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #002b7a 0%, #003399 50%, #dc2626 100%)' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '4px', cursor: 'pointer' }} onClick={onBackToLanding}>
          <div style={{
            height: '38px',
            padding: '0 10px',
            borderRadius: '8px',
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 43, 122, 0.12)'
          }}>
            <img src="/logo_fundacao_dr_jesus.png" alt="Fundação Dr. Jesus" style={{ height: '28px', objectFit: 'contain' }} />
          </div>
        </div>

        <button 
          onClick={onBackToLanding}
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700 }}
        >
          <ArrowLeft size={16} /> Voltar ao Site Institucional
        </button>
      </header>

      {/* CONTAINER CENTRAL DE LOGIN */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 1rem' }}>
        <div className="login-card-grid" style={{
          width: '100%',
          maxWidth: '960px',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 12px 36px rgba(0, 43, 122, 0.12)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          overflow: 'hidden'
        }}>
          
          {/* LEFT BRANDING PANEL */}
          <div className="login-left-panel" style={{
            background: 'linear-gradient(135deg, #002b7a 0%, #001f5c 100%)',
            color: '#ffffff',
            padding: '2.25rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            <div>
              <div style={{
                height: '46px',
                width: 'fit-content',
                padding: '0 14px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1.5px solid #dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                marginBottom: '1.5rem'
              }}>
                <img src="/logo_fundacao_dr_jesus.png" alt="Fundação Dr. Jesus" style={{ height: '32px', objectFit: 'contain' }} />
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, lineHeight: 1.2, margin: '0 0 0.85rem 0', color: '#ffffff' }}>
                Acesso Restrito ao Sistema SGI 360°
              </h2>

              <p style={{ fontSize: '0.875rem', color: '#bfdbfe', lineHeight: 1.6, margin: '0 0 1.75rem 0' }}>
                Administração integrada da instituição: acolhidos, prontuários de saúde, finanças segregadas & prestação de contas.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.825rem', color: '#e0f2fe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle size={16} style={{ color: '#4ade80' }} />
                  <span>Gestão de Acolhidos & 1.100 Leitos</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle size={16} style={{ color: '#4ade80' }} />
                  <span>Prontuário Clínico & Saúde ANVISA</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle size={16} style={{ color: '#4ade80' }} />
                  <span>Gestão Financeira Segregada & DRE</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle size={16} style={{ color: '#4ade80' }} />
                  <span>Prestação de Contas MROSC SJDH-BA</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '0.75rem', color: '#93c5fd' }}>
              Ambiente Autenticado • Fundação Doutor Jesus (Candeias/BA)
            </div>
          </div>

          {/* RIGHT FORM PANEL */}
          <div className="login-right-panel" style={{ padding: '2rem 1.75rem', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
              {isRegisterMode ? 'Cadastrar Primeiro Acesso' : 'Entrar no Sistema SGI'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              {isRegisterMode 
                ? 'Informe seu e-mail institucional e defina sua senha de acesso' 
                : 'Insira seu e-mail cadastrado e senha para continuar'}
            </p>
          </div>

          {/* Quick Select Test Accounts Box */}
          {!isRegisterMode && (
            <div style={{
              background: 'rgba(37, 99, 235, 0.04)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                <KeyRound size={16} style={{ color: '#2563eb' }} />
                <strong style={{ fontSize: '0.8rem', color: '#1e3a8a' }}>
                  Credenciais Oficiais de Teste (Reunião da Diretoria):
                </strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {DEMO_ACCOUNTS.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectDemoAccount(acc)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '0.5rem 0.75rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{acc.label}</div>
                      <div style={{ fontSize: '0.725rem', color: '#475569' }}>E-mail: <strong>{acc.email}</strong> | Senha: <strong style={{ color: '#2563eb' }}>{acc.senha}</strong></div>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563eb', background: '#eff6ff', padding: '3px 8px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>1-Clique</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Banners */}
          {errorMessage && (
            <div style={{
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.825rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} /> {errorMessage}
            </div>
          )}

          {successMessage && (
            <div style={{
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.825rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle size={16} /> {successMessage}
            </div>
          )}

          <form onSubmit={isRegisterMode ? handleRegister : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            
            {/* Nome Completo (Modo Cadastro) */}
            {isRegisterMode && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Nome Completo
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Pr. Sgt. Isidório"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem 0.65rem 2.5rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            )}

            {/* E-mail Institucional */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                E-mail Institucional
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="email"
                  required
                  placeholder="seu.email@fundacaodrjesus.org.br"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.5rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Senha de Acesso
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.5rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Confirmar Senha (Modo Cadastro) */}
            {isRegisterMode && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Confirmar Senha
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="password"
                    required
                    placeholder="Repita a senha digitada"
                    value={formData.confirmarSenha}
                    onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem 0.65rem 2.5rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Perfil de Acesso */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Perfil de Acesso do Sistema
              </label>
              <select 
                value={formData.perfil}
                onChange={(e) => setFormData({ ...formData, perfil: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  outline: 'none',
                  background: '#ffffff',
                  boxSizing: 'border-box'
                }}
              >
                <option value="Diretoria">Perfil: Diretoria & Presidência</option>
                <option value="Gestão MROSC">Perfil: Gestão de Convênios MROSC</option>
                <option value="Financeiro/Tesouraria">Perfil: Financeiro & Tesouraria</option>
                <option value="Recepção/Triagem">Perfil: Triagem & Admissão</option>
                <option value="Saúde/Enfermagem">Perfil: Saúde, CRP, CRESS & CRM</option>
              </select>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              style={{
                marginTop: '0.75rem',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '0.85rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              {isRegisterMode ? 'Cadastrar e Acessar o Sistema' : 'Entrar no Sistema'} <ArrowRight size={18} />
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.825rem', color: '#64748b' }}>
            {isRegisterMode ? (
              <span>
                Já possui conta cadastrada?{' '}
                <button 
                  type="button"
                  onClick={() => { setIsRegisterMode(false); setErrorMessage(''); setSuccessMessage(''); }}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  Fazer Login
                </button>
              </span>
            ) : (
              <span>
                É o seu primeiro acesso ao sistema?{' '}
                <button 
                  type="button"
                  onClick={() => { setIsRegisterMode(true); setErrorMessage(''); setSuccessMessage(''); }}
                  style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  Cadastrar E-mail e Senha
                </button>
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  </div>
);
}
