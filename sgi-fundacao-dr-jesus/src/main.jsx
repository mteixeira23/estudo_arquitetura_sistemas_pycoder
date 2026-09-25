import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          maxWidth: '800px',
          margin: '2rem auto',
          background: '#fef2f2',
          border: '2px solid #ef4444',
          borderRadius: '12px',
          fontFamily: 'sans-serif'
        }}>
          <h2 style={{ color: '#991b1b', margin: '0 0 1rem 0' }}>⚠️ Ocorreu um erro no carregamento da aplicação</h2>
          <p style={{ color: '#7f1d1d', fontSize: '0.9rem' }}>
            {this.state.error && this.state.error.toString()}
          </p>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                if ('caches' in window) {
                  caches.keys().then((names) => {
                    names.forEach((name) => caches.delete(name));
                  });
                }
                window.location.href = window.location.origin + window.location.pathname + '?nocache=' + Date.now();
              }
            }} 
            style={{
              padding: '0.5rem 1rem',
              background: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔄 Recarregar Aplicação (Limpar Cache)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
