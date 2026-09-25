import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function LandingPageView({ onEnterSystem }) {
  return (
    <div style={{ 
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif", 
      color: '#1e293b', 
      background: "linear-gradient(180deg, rgba(248, 250, 252, 0.85) 0%, rgba(255, 255, 255, 0.93) 100%), url('/sede_fundacao_dr_jesus.jpg') center/cover no-repeat", 
      height: '100vh',
      width: '100vw',
      maxHeight: '100vh',
      maxWidth: '100vw',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box'
    }}>
      
      {/* 1. TOP BLUE UTILITY BAR */}
      <div className="landing-top-bar" style={{ 
        background: '#1e3a8a', 
        color: '#ffffff', 
        padding: '0.4rem 2rem', 
        fontSize: '0.775rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', gap: '1.25rem', fontWeight: 500 }}>
          <span style={{ color: '#bfdbfe' }}>Acessibilidade</span>
          <span style={{ color: '#60a5fa' }}>•</span>
          <span style={{ color: '#bfdbfe' }}>Acesso à Informação</span>
          <span style={{ color: '#60a5fa' }}>•</span>
          <span style={{ color: '#bfdbfe' }}>Política de Privacidade</span>
        </div>
        <div style={{ color: '#93c5fd', fontWeight: 600 }}>
          Em parceria com a Secretaria de Justiça e Direitos Humanos (SJDH-BA)
        </div>
      </div>

      {/* 2. MAIN HEADER NAVBAR */}
      <header className="landing-header" style={{ 
        background: '#ffffff', 
        padding: '0.85rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        flexShrink: 0
      }}>
        {/* LOGO FUNDAÇÃO DR JESUS */}
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={onEnterSystem}>
          <div style={{ height: '44px', display: 'flex', alignItems: 'center', padding: '0 12px', background: '#ffffff', borderRadius: '8px', border: '1.5px solid #cbd5e1', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <img src="/logo_fundacao_dr_jesus.png" alt="Fundação Dr. Jesus" style={{ height: '34px', objectFit: 'contain' }} />
          </div>
        </div>

        {/* PRIMARY CTA IN HEADER */}
        <button 
          onClick={onEnterSystem}
          style={{ 
            background: '#2563eb', 
            color: '#ffffff', 
            border: 'none', 
            padding: '0.65rem 1.35rem', 
            borderRadius: '8px', 
            fontWeight: 700, 
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
          }}
        >
          Acessar Sistema <ArrowRight size={16} />
        </button>
      </header>

      {/* 3. CENTER HERO CONTAINER (PROPORTIONAL, SPACIOUS & ZERO-SCROLL) */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1.5rem', 
        maxWidth: '960px', 
        margin: '0 auto', 
        width: '100%',
        boxSizing: 'border-box',
        textAlign: 'center'
      }}>
        {/* OFFICIAL BADGE */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          background: '#e0f2fe', 
          color: '#0369a1', 
          padding: '0.45rem 1.25rem', 
          borderRadius: '999px', 
          fontSize: '0.825rem', 
          fontWeight: 700,
          marginBottom: '1.5rem',
          border: '1px solid #bae6fd'
        }}>
          <span style={{ height: '8px', width: '8px', borderRadius: '50%', background: '#0284c7' }} />
          Plataforma Oficial • Gestão Integrada 360°
        </div>

        {/* MAIN HEADLINE SHOWCASING WHOLE INSTITUTION */}
        <h1 className="landing-hero-title" style={{ 
          fontSize: 'clamp(2.1rem, 3.8vw, 3.1rem)', 
          fontWeight: 900, 
          color: '#0f172a', 
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          marginBottom: '1.15rem'
        }}>
          Sistema de Gestão Global da <br />
          <span style={{ color: '#dc2626' }}>Fundação Doutor Jesus</span>
        </h1>

        {/* SUBTITLE */}
        <p style={{ 
          fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)', 
          color: '#475569', 
          lineHeight: 1.6, 
          maxWidth: '820px', 
          margin: '0 auto 1.85rem auto'
        }}>
          Plataforma tecnológica unificada para a administração completa da instituição: controle de acolhidos e leitos, prontuários de saúde multidisciplinares, gestão financeira segregada, almoxarifado/nutrição e prestação de contas.
        </p>

        {/* ONLY ONE PRIMARY CTA BUTTON */}
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={onEnterSystem}
            style={{ 
              background: 'linear-gradient(135deg, #002b7a, #1d4ed8)', 
              color: '#ffffff', 
              border: 'none', 
              padding: '0.85rem 2.5rem', 
              borderRadius: '9px', 
              fontWeight: 800, 
              fontSize: '1.05rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              boxShadow: '0 6px 20px rgba(0, 43, 122, 0.35)',
              transition: 'transform 0.15s ease'
            }}
          >
            Acessar Sistema <ArrowRight size={20} />
          </button>
        </div>

        {/* THE 4 PILLARS OF COMPLETE INSTITUTIONAL MANAGEMENT */}
        <div className="landing-metrics-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '1rem', 
          background: '#ffffff', 
          padding: '1.15rem 1.5rem', 
          borderRadius: '14px', 
          border: '1px solid #cbd5e1',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          width: '100%',
          maxWidth: '920px'
        }}>
          <div style={{ textTransform: 'left' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              👥 Acolhidos & Leitos
            </div>
            <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>Admissão RDC 29 & Reinserção</div>
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              ⚕️ Prontuário & Saúde
            </div>
            <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>Evoluções & Medicamentos</div>
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              💰 Finanças & Tesouraria
            </div>
            <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>DRE, OFX & Prestação MROSC</div>
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              📦 Nutrição & Operações
            </div>
            <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>Despensa, Almoxarifado & Frota</div>
          </div>
        </div>

      </main>

      {/* 4. BOTTOM FOOTER BAR */}
      <footer style={{ 
        padding: '0.65rem 1.5rem', 
        borderTop: '1px solid #e2e8f0',
        background: '#0f172a',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: '#94a3b8',
        flexShrink: 0
      }}>
        © 2026 Fundação Doutor Jesus • Todos os direitos reservados. Sistema de Gestão Integrada (SGI MROSC Bahia) • Singulari Consultoria | Data Structure & KPI Insights
      </footer>

    </div>
  );
}
