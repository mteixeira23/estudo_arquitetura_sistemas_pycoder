import React from 'react';
import { 
  HeartHandshake, 
  LogOut,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';

export default function Header({ 
  currentUser,
  onLogout,
  onHomeClick,
  mobileMenuOpen,
  setMobileMenuOpen,
  showSidebar,
  theme = 'light',
  setTheme
}) {
  const userEmail = currentUser?.email || 'singularconsultoria@outlook.com';
  const isDark = theme === 'dark';

  return (
    <header className="header-bar" style={{
      background: 'var(--bg-header)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.65rem 1rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #002b7a 0%, #003399 50%, #dc2626 100%)' }} />
      {/* Left: Mobile Toggle + Clean Branding (Fundação Doutor Jesus) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingTop: '4px' }}>
        {showSidebar && (
          <button
            onClick={() => setMobileMenuOpen && setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-toggle-btn"
            style={{
              background: isDark ? '#1e293b' : '#f1f5f9',
              border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
              borderRadius: '8px',
              padding: '0.4rem',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Abrir Menu de Navegação"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}

        <div 
          onClick={onHomeClick} 
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          title="Voltar para Central de Módulos"
        >
          <div style={{
            height: '40px',
            padding: '0 12px',
            borderRadius: '8px',
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 43, 122, 0.12)',
            flexShrink: 0
          }}>
            <img src="/logo_fundacao_dr_jesus.png" alt="Fundação Dr. Jesus" style={{ height: '30px', objectFit: 'contain' }} />
          </div>
        </div>
      </div>

      {/* Right: Theme Toggle + User E-mail & Logout Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        
        {/* DARK / LIGHT MODE TOGGLE BUTTON */}
        <button
          onClick={() => setTheme && setTheme(isDark ? 'light' : 'dark')}
          style={{
            background: isDark ? '#1e293b' : '#f1f5f9',
            border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
            borderRadius: '8px',
            padding: '0.35rem 0.65rem',
            color: isDark ? '#f59e0b' : '#0f172a',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            transition: 'all 0.2s ease'
          }}
          title={isDark ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}
        >
          {isDark ? <Sun size={15} style={{ color: '#f59e0b' }} /> : <Moon size={15} style={{ color: '#1e3a8a' }} />}
          <span className="theme-btn-text" style={{ color: 'var(--text-main)' }}>
            {isDark ? 'Modo Claro' : 'Modo Escuro'}
          </span>
        </button>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          background: isDark ? '#1e293b' : '#f1f5f9', 
          padding: '0.3rem 0.65rem', 
          borderRadius: '8px', 
          border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
          maxWidth: '100%'
        }}>
          <span 
            className="user-email-text"
            style={{ 
              fontSize: '0.775rem', 
              fontWeight: 700, 
              color: 'var(--primary)',
              maxWidth: '160px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={userEmail}
          >
            {userEmail}
          </span>
          <button 
            onClick={onLogout}
            className="btn btn-outline btn-sm"
            style={{ padding: '0.25rem 0.45rem', color: '#dc2626', borderColor: '#fca5a5', fontSize: '0.725rem', gap: '0.25rem', flexShrink: 0 }}
            title="Encerrar Sessão"
          >
            <LogOut size={12} /> <span className="logout-btn-text">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
