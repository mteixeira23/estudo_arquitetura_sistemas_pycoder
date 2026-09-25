import React, { useState } from 'react';
import { 
  Server, 
  Activity, 
  Database, 
  Download, 
  ShieldAlert, 
  Lock, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  Cpu, 
  HardDrive, 
  Globe, 
  Terminal, 
  Wrench, 
  FileSpreadsheet,
  AlertTriangle,
  Key
} from 'lucide-react';

export default function AdminSistemaView() {
  const [activeTab, setActiveTab] = useState('health');
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);

  // Mock System / IT Logs
  const [itLogs] = useState([
    { id: 'TI-99105', timestamp: '18/08/2026 12:01:45', evento: 'Deploy em Produção (Vercel Edge Network)', servico: 'Vite / React Build', ip: '177.92.40.12', nivel: 'INFO' },
    { id: 'TI-99104', timestamp: '18/08/2026 11:45:10', evento: 'Sincronização de Banco de Dados Concluída', servico: 'PostgreSQL / Cloud DB', ip: '10.0.4.12', nivel: 'INFO' },
    { id: 'TI-99103', timestamp: '18/08/2026 11:20:00', evento: 'Verificação de SSL/TLS Concluída (Let\'s Encrypt)', servico: 'DNS / HTTPS (singulariconsult.com.br)', ip: '76.76.21.21', nivel: 'SUCCESS' },
    { id: 'TI-99102', timestamp: '18/08/2026 10:05:22', usuario: 'marcos.teixeira@fundacaodrjesus.org.br', evento: 'Autenticação 2FA bem-sucedida', servico: 'SGI Auth Guard', ip: '177.92.40.12', nivel: 'INFO' },
    { id: 'TI-99101', timestamp: '18/08/2026 03:00:00', evento: 'Backup Diário Automatizado Concluído', servico: 'AWS S3 Cold Storage', ip: 'Sistema', nivel: 'SUCCESS' }
  ]);

  // System Health Status
  const healthStatus = {
    vercelUptime: '99.99%',
    latency: '38 ms',
    databaseSize: '142.5 MB / 10 GB (1.4% utilizado)',
    activeConnections: 18,
    lastBackup: 'Hoje às 03:00 (Redundância AWS/GCP)',
    sslCertificate: 'Válido até 18/08/2027 (Let\'s Encrypt RSA 2048)',
    environment: 'Produção (Vercel Global Edge Network - iad1)',
    version: 'SGI Version 2.4.0 (Build 2026.08.18)'
  };

  const handleTriggerBackup = () => {
    setIsBackupRunning(true);
    setBackupSuccess(false);
    setTimeout(() => {
      setIsBackupRunning(false);
      setBackupSuccess(true);
    }, 2000);
  };

  const handleClearCache = () => {
    localStorage.clear();
    alert('Cache do navegador e armazenamento local reinicializados com sucesso!');
    window.location.reload();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Module Title Header Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95))',
        border: '1px solid #475569',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #334155)',
            color: '#38bdf8',
            padding: '0.85rem 1.15rem',
            borderRadius: '10px',
            fontWeight: 800,
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            border: '1px solid #475569'
          }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>MÓDULO DE TI</div>
            <div style={{ fontSize: '1.15rem' }}>ADMINISTRAÇÃO TI</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-info" style={{ background: '#0284c7', color: '#fff' }}>Infraestrutura & Redes TI</span>
              <span className="badge badge-success">Vercel Production Live</span>
              <span className="badge badge-primary">SGI v2.4.0</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', color: '#ffffff', margin: 0 }}>
              Administração de TI, Infraestrutura & Manutenção do Sistema
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.825rem', margin: '4px 0 0 0' }}>
              Painel exclusivo da equipe de Tecnologia da Informação (TI) para acompanhamento de servidores, latência, backups e logs do sistema.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={handleClearCache}
            style={{ color: '#ffffff', borderColor: '#475569' }}
          >
            Limpar Cache TI
          </button>

          <button 
            className="btn btn-primary btn-sm" 
            onClick={handleTriggerBackup}
            disabled={isBackupRunning}
            style={{ background: '#0284c7', border: 'none', gap: '0.5rem' }}
          >
            <RefreshCw size={16} className={isBackupRunning ? 'spin' : ''} />
            {isBackupRunning ? 'Executando Backup...' : 'Fazer Backup TI'}
          </button>
        </div>
      </div>

      {/* Internal Subtab Switcher (TI ONLY) */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button 
          className={`btn btn-sm ${activeTab === 'health' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('health')}
        >
          <Activity size={16} /> Saúde da Infraestrutura TI
        </button>

        <button 
          className={`btn btn-sm ${activeTab === 'backups' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('backups')}
        >
          <Database size={16} /> Backups do Banco & Restauração
        </button>

        <button 
          className={`btn btn-sm ${activeTab === 'logs' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('logs')}
        >
          <Terminal size={16} /> Logs de Eventos & IPs TI
        </button>

        <button 
          className={`btn btn-sm ${activeTab === 'security' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('security')}
        >
          <ShieldAlert size={16} /> Segurança de TI, SSL & 2FA
        </button>

        <button 
          className={`btn btn-sm ${activeTab === 'maintenance' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('maintenance')}
        >
          <Wrench size={16} /> Manutenção & Servidores
        </button>
      </div>

      {/* TAB 1: SAÚDE DA INFRAESTRUTURA TI */}
      {activeTab === 'health' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-3">
            <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Disponibilidade Vercel Edge</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', margin: '0.25rem 0' }}>{healthStatus.vercelUptime}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SLA Global Vercel Network</div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Latência Médida da API (Ping)</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3b82f6', margin: '0.25rem 0' }}>{healthStatus.latency}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Resposta de alta performance</div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #8b5cf6' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Capacidade do Banco de Dados</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#8b5cf6', margin: '0.25rem 0' }}>142.5 MB / 10 GB</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1.4% de capacidade utilizada</div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={20} style={{ color: '#0284c7' }} />
              Especificações Técnicas da Infraestrutura de TI
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ambiente de Hospedagem</div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{healthStatus.environment}</div>
              </div>
              <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Certificação de Segurança SSL/TLS</div>
                <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.95rem' }}>{healthStatus.sslCertificate}</div>
              </div>
              <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Conexões Concorrentes Ativas</div>
                <div style={{ fontWeight: 700, color: '#3b82f6', fontSize: '0.95rem' }}>{healthStatus.activeConnections} Sessões Conectadas</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BACKUPS DO BANCO & RESTAURAÇÃO */}
      {activeTab === 'backups' && (
        <div className="card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={20} style={{ color: '#8b5cf6' }} />
            Gerenciador TI de Backups & Restauração do Banco de Dados
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Backups automáticos executados diariamente às 03:00 com redundância geográfica nas regiões AWS US-East e Google Cloud.
          </p>

          {backupSuccess && (
            <div style={{ padding: '0.85rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#047857', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> Backup de TI gerado e arquivado no cofre criptografado com sucesso!
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => alert('Download do Backup SQL completo iniciado')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}
            >
              <Download size={18} /> Baixar Dump SQL Completo (.sql)
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => alert('Download do Schema JSON iniciado')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}
            >
              <FileSpreadsheet size={18} /> Baixar Schema JSON (.json)
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: LOGS DE EVENTOS & IPS TI */}
      {activeTab === 'logs' && (
        <div className="card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal size={22} style={{ color: '#0284c7' }} />
                Logs Técnicos de Sistema & Rastreamento de IPs (TI Console)
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Console de diagnóstico técnico contendo requisições da API, deploys e conexões de rede.
              </p>
            </div>
            <span className="badge badge-success">Console TI Ativo</span>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código Evento</th>
                  <th>Data & Hora</th>
                  <th>Descrição do Evento TI</th>
                  <th>Serviço / Módulo TI</th>
                  <th>Endereço IP</th>
                  <th>Nível</th>
                </tr>
              </thead>
              <tbody>
                {itLogs.map(log => (
                  <tr key={log.id}>
                    <td><span className="badge badge-primary">{log.id}</span></td>
                    <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>{log.timestamp}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.85rem' }}>{log.evento}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.servico}</td>
                    <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>{log.ip}</td>
                    <td>
                      <span className={`badge ${log.nivel === 'SUCCESS' ? 'badge-success' : 'badge-info'}`}>
                        {log.nivel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SEGURANÇA DE TI, SSL & 2FA */}
      {activeTab === 'security' && (
        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={20} style={{ color: '#ef4444' }} />
            Segurança de Infraestrutura TI, Criptografia & Firewalls
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontWeight: 700 }}>Certificação SSL / TLS HTTPS (Let's Encrypt RSA)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tráfego 100% criptografado de ponta a ponta no domínio singulariconsult.com.br</div>
              </div>
              <span className="badge badge-success">SSL Ativo</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontWeight: 700 }}>Proteção contra Ataques DDoS & WAF (Vercel Firewall)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Web Application Firewall ativo contra mitigação de ataques maliciosos</div>
              </div>
              <span className="badge badge-success">WAF Habilitado</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontWeight: 700 }}>Criptografia de Dados de Banco AES-256</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dados armazenados no banco com criptografia em repouso (Encryption at Rest)</div>
              </div>
              <span className="badge badge-success">AES-256 Ativo</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MANUTENÇÃO & SERVIDORES */}
      {activeTab === 'maintenance' && (
        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={20} style={{ color: '#f59e0b' }} />
            Janela de Manutenção TI & Informações da Aplicação
          </h3>
          <div className="grid-2">
            <div>
              <label className="form-label">Versão Atual da Aplicação SGI</label>
              <input type="text" className="form-input" readOnly value={healthStatus.version} />
            </div>
            <div>
              <label className="form-label">Servidor / Datacenter Principal</label>
              <input type="text" className="form-input" readOnly value="AWS Washington D.C. (iad1 / Vercel Edge)" />
            </div>
            <div>
              <label className="form-label">Domínio Principal Configurado</label>
              <input type="text" className="form-input" readOnly value="https://www.singulariconsult.com.br" />
            </div>
            <div>
              <label className="form-label">Status da Conexão DNS Registro.br</label>
              <input type="text" className="form-input" readOnly value="🟢 A Record (76.76.21.21) & CNAME Vinculados" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
