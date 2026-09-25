import React, { useState } from 'react';
import { 
  Truck, 
  Wrench, 
  Calendar, 
  Plus, 
  X, 
  CheckCircle2, 
  Fuel, 
  MapPin, 
  UserCheck, 
  FileText, 
  ShieldCheck, 
  AlertTriangle,
  Bus,
  Clock,
  Printer,
  DollarSign,
  ClipboardCheck,
  RotateCcw,
  Car,
  Search,
  CheckSquare,
  AlertCircle
} from 'lucide-react';

export default function FrotaManutencaoView({ activeSubTab, setActiveSubTab, profissionais = [], acolhidos = [] }) {
  const currentSubTab = activeSubTab || 'veiculos';

  // Modal States
  const [showNewVeiculoModal, setShowNewVeiculoModal] = useState(false);
  const [showEditVeiculoModal, setShowEditVeiculoModal] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState(null);

  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [checkingVeiculo, setCheckingVeiculo] = useState(null);
  const [checklistItems, setChecklistItems] = useState({
    pneus: true,
    oleoAgua: true,
    freios: true,
    documentacao: true,
    farois: true,
    extintor: true
  });

  const [showAbastecimentoModal, setShowAbastecimentoModal] = useState(false);
  const [showEditAbastecimentoModal, setShowEditAbastecimentoModal] = useState(false);
  const [editingAbastecimento, setEditingAbastecimento] = useState(null);

  const [showNewOSModal, setShowNewOSModal] = useState(false);
  const [showEditOSModal, setShowEditOSModal] = useState(false);
  const [editingOS, setEditingOS] = useState(null);

  const [showAgendarTransporteModal, setShowAgendarTransporteModal] = useState(false);
  const [showEditTransporteModal, setShowEditTransporteModal] = useState(false);
  const [editingTransporte, setEditingTransporte] = useState(null);
  const [showPrintTransporteModal, setShowPrintTransporteModal] = useState(false);
  const [printingTransporte, setPrintingTransporte] = useState(null);

  // Search Filters
  const [searchVeiculos, setSearchVeiculos] = useState('');
  const [searchAbastecimentos, setSearchAbastecimentos] = useState('');
  const [searchOS, setSearchOS] = useState('');
  const [searchTransportes, setSearchTransportes] = useState('');

  // Initial Vehicles Data
  const [veiculos, setVeiculos] = useState([
    { id: 'VEI-01', placa: 'OKU-4820', tipo: 'Ônibus Rodoviário (48 Lugares)', modelo: 'Mercedes-Benz OF-1721', km: '214.500 km', combustivel: '75%', uso: 'Linha Candeias ↔ Salvador (Triagem)', status: 'Disponível', checklist: 'Aprovado (14/08)' },
    { id: 'VEI-02', placa: 'JRS-9102', tipo: 'Van Sprinter (16 Lugares)', modelo: 'Mercedes Sprinter 415', km: '142.000 km', combustivel: '90%', uso: 'Transporte Consultas SUS / HGE', status: 'Em Viagem (Salvador)', checklist: 'Aprovado (14/08)' },
    { id: 'VEI-03', placa: 'NYH-3044', tipo: 'Caminhão Baú (Carga)', modelo: 'Volkswagen Delivery 9.170', km: '188.200 km', combustivel: '60%', uso: 'Resgate de Doações de Alimentos', status: 'Disponível', checklist: 'Aprovado (13/08)' },
    { id: 'VEI-04', placa: 'FDJ-1920', tipo: 'Ambulância de Apoio (UTI Móvel)', modelo: 'Renault Master Ambulância', km: '89.400 km', combustivel: '100%', uso: 'Emergências Médicas FDJ', status: 'Prontidão Posto Médico', checklist: 'Aprovado (14/08)' }
  ]);

  // Initial Maintenance Work Orders (OS)
  const [ordensServico, setOrdensServico] = useState([
    { id: 'OS-2026-01', data: '2026-08-14', setor: 'Manutenção Predial (Elétrica)', descricao: 'Substituição de disjuntores centrais do Bloco B (Renovação)', prioridade: 'Alta', responsavel: 'Oficina de Elétrica (Acolhido Roberto)', status: 'Em Execução' },
    { id: 'OS-2026-02', data: '2026-08-12', setor: 'Manutenção de Frota (Mecânica)', descricao: 'Troca de Óleo e Filtro de Ar do Ônibus (OKU-4820)', prioridade: 'Média', responsavel: 'Mecânica Central Candeias', status: 'Concluída' }
  ]);

  // Initial Fuel Logs Data (Abastecimentos)
  const [abastecimentos, setAbastecimentos] = useState([
    { id: 'ABS-501', data: '2026-08-14 07:45', veiculo: 'Ônibus Rodoviário (OKU-4820)', tipoCombustivel: 'Diesel S10', litros: '120.0 L', valor: 'R$ 720,00', posto: 'Posto Petrobras Candeias', cupom: 'NF-e 88.401' },
    { id: 'ABS-502', data: '2026-08-12 11:20', veiculo: 'Van Sprinter (JRS-9102)', tipoCombustivel: 'Diesel S10', litros: '65.0 L', valor: 'R$ 390,00', posto: 'Posto Shell BR-324', cupom: 'NF-e 41.209' }
  ]);

  // Initial Medical Transport Schedule
  const [transportesSUS, setTransportesSUS] = useState([
    { 
      id: 'TRS-101', 
      data: '2026-08-15 07:00', 
      veiculo: 'Van Sprinter (JRS-9102)', 
      motorista: 'Irmão Raimundo (Motorista Credenciado FDJ)', 
      destino: 'Hospital Geral de Candeias / HGE Salvador', 
      acolhidos: 'Antonio Carlos da Silva Filho, Marcos Vinicius Santos Santana, Edvaldo Oliveira Souza', 
      status: 'Agendado' 
    }
  ]);

  // Form States
  const [newVeiculo, setNewVeiculo] = useState({
    tipo: 'Ônibus Rodoviário (48 Lugares)',
    placa: '',
    modelo: '',
    km: '100.000 km',
    combustivel: '100%',
    uso: 'Transporte de Acolhidos & Atividades Externa',
    status: 'Disponível'
  });

  const [newOS, setNewOS] = useState({
    setor: 'Manutenção de Frota (Mecânica)',
    descricao: '',
    prioridade: 'Média',
    responsavel: profissionais[0]?.nome || 'Mecânica Central Candeias'
  });

  const [newFuel, setNewFuel] = useState({
    veiculo: veiculos[0]?.tipo || 'Ônibus Rodoviário (OKU-4820)',
    tipoCombustivel: 'Diesel S10',
    litros: '',
    valor: '',
    posto: 'Posto Petrobras Candeias',
    cupom: ''
  });

  const [newTransporte, setNewTransporte] = useState({
    data: new Date().toISOString().split('T')[0] + ' 07:00',
    veiculo: veiculos[1]?.tipo || 'Van Sprinter (16 Lugares)',
    motorista: profissionais[0]?.nome || 'Irmão Raimundo (Motorista Credenciado FDJ)',
    destino: 'Hospital Geral de Candeias / HGE Salvador',
    acolhidos: acolhidos.slice(0, 3).map(a => a.nome).join(', ') || 'Antonio Carlos da Silva Filho',
    status: 'Agendado'
  });

  // Handlers - Veículos
  const handleAddVeiculo = (e) => {
    e.preventDefault();
    if (!newVeiculo.placa || !newVeiculo.modelo) return;

    const newV = {
      id: `VEI-${String(veiculos.length + 1).padStart(2, '0')}`,
      ...newVeiculo,
      checklist: 'Pendente (Aguardando Inspeção)'
    };

    setVeiculos([...veiculos, newV]);
    setShowNewVeiculoModal(false);
    setNewVeiculo({
      tipo: 'Ônibus Rodoviário (48 Lugares)',
      placa: '',
      modelo: '',
      km: '100.000 km',
      combustivel: '100%',
      uso: 'Transporte de Acolhidos & Atividades Externa',
      status: 'Disponível'
    });
  };

  const handleSaveChecklist = (e) => {
    e.preventDefault();
    if (!checkingVeiculo) return;

    const allPassed = Object.values(checklistItems).every(val => val === true);
    const todayStr = new Date().toLocaleDateString('pt-BR').slice(0, 5);

    const updatedStatus = allPassed ? `Aprovado (${todayStr})` : `Atenção (Itens Pendentes ${todayStr})`;

    setVeiculos(prev => prev.map(v => v.id === checkingVeiculo.id ? { ...v, checklist: updatedStatus } : v));
    setShowChecklistModal(false);
    setCheckingVeiculo(null);
  };

  // Handlers - OS
  const handleAddOS = (e) => {
    e.preventDefault();
    if (!newOS.descricao) return;

    const newEntry = {
      id: `OS-2026-${String(ordensServico.length + 1).padStart(2, '0')}`,
      data: new Date().toISOString().split('T')[0],
      ...newOS,
      status: 'Em Aberto'
    };

    setOrdensServico([newEntry, ...ordensServico]);
    setShowNewOSModal(false);
    setNewOS({ setor: 'Manutenção de Frota (Mecânica)', descricao: '', prioridade: 'Média', responsavel: profissionais[0]?.nome || 'Mecânica Central Candeias' });
  };

  // Handlers - Abastecimento
  const handleAddFuel = (e) => {
    e.preventDefault();
    if (!newFuel.litros || !newFuel.valor) return;

    const newEntry = {
      id: `ABS-${501 + abastecimentos.length}`,
      data: new Date().toLocaleString('pt-BR').slice(0, 16),
      ...newFuel,
      litros: `${newFuel.litros} L`,
      valor: `R$ ${newFuel.valor}`
    };

    setAbastecimentos([newEntry, ...abastecimentos]);
    setShowAbastecimentoModal(false);
    setNewFuel({ veiculo: veiculos[0]?.tipo || 'Ônibus Rodoviário (OKU-4820)', tipoCombustivel: 'Diesel S10', litros: '', valor: '', posto: 'Posto Petrobras Candeias', cupom: '' });
  };

  // Handlers - Transporte
  const handleAddTransporte = (e) => {
    e.preventDefault();
    if (!newTransporte.destino) return;

    const newEntry = {
      id: `TRS-${101 + transportesSUS.length}`,
      ...newTransporte
    };

    setTransportesSUS([newEntry, ...transportesSUS]);
    setShowAgendarTransporteModal(false);
  };

  // Filtered lists
  const filteredVeiculos = veiculos.filter(v => 
    v.placa.toLowerCase().includes(searchVeiculos.toLowerCase()) ||
    v.tipo.toLowerCase().includes(searchVeiculos.toLowerCase()) ||
    v.modelo.toLowerCase().includes(searchVeiculos.toLowerCase())
  );

  const filteredAbastecimentos = abastecimentos.filter(a => 
    a.veiculo.toLowerCase().includes(searchAbastecimentos.toLowerCase()) ||
    a.posto.toLowerCase().includes(searchAbastecimentos.toLowerCase()) ||
    a.cupom.toLowerCase().includes(searchAbastecimentos.toLowerCase())
  );

  const filteredOS = ordensServico.filter(o => 
    o.id.toLowerCase().includes(searchOS.toLowerCase()) ||
    o.setor.toLowerCase().includes(searchOS.toLowerCase()) ||
    o.descricao.toLowerCase().includes(searchOS.toLowerCase()) ||
    o.responsavel.toLowerCase().includes(searchOS.toLowerCase())
  );

  const filteredTransportes = transportesSUS.filter(t => 
    t.destino.toLowerCase().includes(searchTransportes.toLowerCase()) ||
    t.motorista.toLowerCase().includes(searchTransportes.toLowerCase()) ||
    t.acolhidos.toLowerCase().includes(searchTransportes.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">Módulo 7</span>
            <span className="badge badge-warning">Frota • Abastecimentos • Manutenção • Transporte SUS</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>
            Gestão Integrada de Frota, Oficina & Transporte de Saúde
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: '4px 0 0 0' }}>
            Controle operacional dos ônibus, vans, caminhões doados, abastecimentos com cupom fiscal e viagens hospitalares SUS.
          </p>
        </div>
      </div>



      {/* TAB 1: Frota de Veículos com Checklist */}
      {(currentSubTab === 'veiculos' || currentSubTab === 'frota') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Dashboard Cards */}
          <div className="grid-3">
            <div className="card" style={{ borderLeft: '4px solid #d97706', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Frota Total Cadastrada</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
                {veiculos.length} Veículos
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Ônibus, Vans, Caminhões & Ambulância
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #10b981', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Disponíveis p/ Viagem</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#047857', marginTop: '4px' }}>
                {veiculos.filter(v => v.status.includes('Disponível') || v.status.includes('Prontidão')).length} Ativos
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Prontos para rodar no Termo de Fomento
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #2563eb', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Auditoria de Segurança</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e40af', marginTop: '4px' }}>
                100% Inspecionado
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Checklist Pré-Viagem Homologado
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🚚 Veículos & Ônibus de Transporte de Acolhidos
              </h3>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Filtrar por placa, modelo ou tipo..."
                  style={{ height: '34px', fontSize: '0.8rem', width: '230px' }}
                  value={searchVeiculos}
                  onChange={e => setSearchVeiculos(e.target.value)}
                />
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código / Veículo</th>
                    <th>Placa / Modelo</th>
                    <th>Quilometragem</th>
                    <th>Checklist Pré-Viagem</th>
                    <th>Uso / Destinação</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVeiculos.map(v => (
                    <tr key={v.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{v.tipo}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{v.id}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{v.placa}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{v.modelo}</div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{v.km}</td>
                      <td>
                        <span 
                          className={`badge ${v.checklist.includes('Aprovado') ? 'badge-success' : 'badge-warning'}`}
                          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                          onClick={() => {
                            setCheckingVeiculo(v);
                            setShowChecklistModal(true);
                          }}
                          title="Clique para realizar auditoria de checklist pré-viagem"
                        >
                          <ClipboardCheck size={12} /> {v.checklist}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.825rem' }}>{v.uso}</td>
                      <td>
                        <span className={`badge ${v.status.includes('Disponível') || v.status.includes('Prontidão') ? 'badge-success' : 'badge-warning'}`}>
                          {v.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button 
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#166534', borderColor: '#86efac' }}
                            onClick={() => {
                              setCheckingVeiculo(v);
                              setShowChecklistModal(true);
                            }}
                            title="Realizar Checklist Pré-Viagem"
                          >
                            📋 Checklist
                          </button>
                          <button 
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#2563eb', borderColor: '#93c5fd' }}
                            onClick={() => {
                              setEditingVeiculo(v);
                              setShowEditVeiculoModal(true);
                            }}
                            title="Editar Veículo"
                          >
                            ✏️
                          </button>
                          <button 
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#dc2626', borderColor: '#fca5a5' }}
                            onClick={() => {
                              if (window.confirm(`Deseja excluir o veículo ${v.placa}?`)) {
                                setVeiculos(veiculos.filter(item => item.id !== v.id));
                              }
                            }}
                            title="Excluir Veículo"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Controle de Abastecimento (Diesel / Gasolina) */}
      {(currentSubTab === 'combustivel' || currentSubTab === 'abastecimento') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Dashboard Cards */}
          <div className="grid-3">
            <div className="card" style={{ borderLeft: '4px solid #0284c7', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Litros Abastecidos</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
                185.0 L
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Diesel S10 Homologado MROSC
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #059669', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Custo Total de Combustível</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                R$ 1.110,00
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Prestação de Contas SJDH-BA
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #d97706', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Postos Homologados</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
                2 Postos
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Posto Petrobras & Shell BR-324
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                ⛽ Registro de Abastecimentos & Cupons Fiscais
              </h3>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Buscar por veículo ou posto..."
                  style={{ height: '34px', fontSize: '0.8rem', width: '230px' }}
                  value={searchAbastecimentos}
                  onChange={e => setSearchAbastecimentos(e.target.value)}
                />
                <button className="btn btn-primary btn-sm" style={{ fontWeight: 800, height: '34px' }} onClick={() => setShowAbastecimentoModal(true)}>
                  + Registrar Abastecimento
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código / Data</th>
                    <th>Veículo Abastecido</th>
                    <th>Combustível</th>
                    <th>Litros (L)</th>
                    <th>Valor Total (R$)</th>
                    <th>Posto / Cupom Fiscal</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAbastecimentos.map(ab => (
                    <tr key={ab.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{ab.id}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{ab.data}</div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{ab.veiculo}</td>
                      <td><span className="badge badge-info">{ab.tipoCombustivel}</span></td>
                      <td style={{ fontWeight: 700 }}>{ab.litros}</td>
                      <td style={{ fontWeight: 800, color: 'var(--status-success)' }}>{ab.valor}</td>
                      <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{ab.posto} • {ab.cupom}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button 
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#2563eb', borderColor: '#93c5fd' }}
                            onClick={() => {
                              setEditingAbastecimento(ab);
                              setShowEditAbastecimentoModal(true);
                            }}
                            title="Editar Abastecimento"
                          >
                            ✏️
                          </button>
                          <button 
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#dc2626', borderColor: '#fca5a5' }}
                            onClick={() => {
                              if (window.confirm(`Deseja excluir o registro ${ab.id}?`)) {
                                setAbastecimentos(abastecimentos.filter(item => item.id !== ab.id));
                              }
                            }}
                            title="Excluir Registro"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Ordens de Serviço de Manutenção */}
      {(currentSubTab === 'manutencao' || currentSubTab === 'ordens') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Dashboard Cards */}
          <div className="grid-3">
            <div className="card" style={{ borderLeft: '4px solid #dc2626', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>OS em Execução</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
                {ordensServico.filter(o => o.status !== 'Concluída').length} Ativa(s)
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Oficina Interna & Mecânica
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #10b981', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>OS Concluídas</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#047857', marginTop: '4px' }}>
                {ordensServico.filter(o => o.status === 'Concluída').length} Finalizada(s)
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Reparos Concluídos
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #2563eb', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Oficina da Fundação</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e40af', marginTop: '4px' }}>
                100% Operacional
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Equipe de Elétrica & Mecânica
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🛠️ Ordens de Serviço (OS) da Oficina & Manutenção Predial/Frota
              </h3>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Buscar OS, setor ou responsável..."
                  style={{ height: '34px', fontSize: '0.8rem', width: '230px' }}
                  value={searchOS}
                  onChange={e => setSearchOS(e.target.value)}
                />
                <button className="btn btn-warning btn-sm" style={{ fontWeight: 800, height: '34px', background: '#d97706', borderColor: '#d97706' }} onClick={() => setShowNewOSModal(true)}>
                  + Abrir OS Oficina
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>OS / Data</th>
                    <th>Setor / Veículo</th>
                    <th>Descrição do Reparo</th>
                    <th>Prioridade</th>
                    <th>Responsável Técnico</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOS.map(os => (
                    <tr key={os.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{os.id}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{os.data}</div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{os.setor}</td>
                      <td style={{ fontSize: '0.825rem' }}>{os.descricao}</td>
                      <td>
                        <span className={`badge ${os.prioridade === 'Alta' ? 'badge-danger' : 'badge-warning'}`}>
                          {os.prioridade}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{os.responsavel}</td>
                      <td>
                        <span className={`badge ${os.status === 'Concluída' ? 'badge-success' : 'badge-warning'}`}>
                          {os.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button 
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#2563eb', borderColor: '#93c5fd' }}
                            onClick={() => {
                              setEditingOS(os);
                              setShowEditOSModal(true);
                            }}
                            title="Editar Ordem de Serviço"
                          >
                            ✏️ Editar
                          </button>
                          <button 
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#dc2626', borderColor: '#fca5a5' }}
                            onClick={() => {
                              if (window.confirm(`Deseja excluir a Ordem de Serviço ${os.id}?`)) {
                                setOrdensServico(ordensServico.filter(item => item.id !== os.id));
                              }
                            }}
                            title="Excluir OS"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Escala de Transporte de Acolhidos no SUS */}
      {currentSubTab === 'transporte' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Dashboard Cards */}
          <div className="grid-3">
            <div className="card" style={{ borderLeft: '4px solid #10b981', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Transportes Agendados</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#047857', marginTop: '4px' }}>
                {transportesSUS.length} Viagens
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Consultas HGE & Unidades SUS
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #0284c7', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Veículo Escalado Principal</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7', marginTop: '6px' }}>
                Van Sprinter (JRS-9102)
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Capacidade 16 Lugares
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #d97706', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Motorista Responsável</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#b45309', marginTop: '6px' }}>
                {transportesSUS[0]?.motorista || 'Irmão Raimundo'}
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Credenciado FDJ
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🚑 Escala Oficial de Transporte Médico & Consultas SUS
              </h3>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Buscar por destino, motorista ou acolhido..."
                  style={{ height: '34px', fontSize: '0.8rem', width: '240px' }}
                  value={searchTransportes}
                  onChange={e => setSearchTransportes(e.target.value)}
                />
                <button className="btn btn-success btn-sm" style={{ fontWeight: 800, height: '34px' }} onClick={() => setShowAgendarTransporteModal(true)}>
                  + Agendar Transporte SUS
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código / Data Saída</th>
                    <th>Veículo Escalado</th>
                    <th>Motorista Responsável</th>
                    <th>Destino Hospitalar</th>
                    <th>Acolhidos Transportados</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransportes.map(t => (
                    <tr key={t.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t.id}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{t.data}</div>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{t.veiculo}</td>
                      <td style={{ fontSize: '0.85rem' }}>{t.motorista}</td>
                      <td style={{ fontSize: '0.825rem', color: '#0284c7', fontWeight: 600 }}>{t.destino}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.acolhidos}</td>
                      <td><span className="badge badge-success">{t.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button 
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#15803d', borderColor: '#86efac' }}
                            onClick={() => {
                              setPrintingTransporte(t);
                              setShowPrintTransporteModal(true);
                            }}
                            title="Imprimir Escala de Transporte"
                          >
                            🖨️ Imprimir
                          </button>
                          <button 
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#2563eb', borderColor: '#93c5fd' }}
                            onClick={() => {
                              setEditingTransporte(t);
                              setShowEditTransporteModal(true);
                            }}
                            title="Editar Transporte"
                          >
                            ✏️
                          </button>
                          <button 
                            className="btn btn-sm btn-secondary" 
                            style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#dc2626', borderColor: '#fca5a5' }}
                            onClick={() => {
                              if (window.confirm(`Deseja excluir a viagem ${t.id}?`)) {
                                setTransportesSUS(transportesSUS.filter(item => item.id !== t.id));
                              }
                            }}
                            title="Excluir Agendamento"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}

      {/* Modal 1: Novo Veículo */}
      {showNewVeiculoModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🚚 Cadastrar Novo Veículo da Frota
              </h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowNewVeiculoModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddVeiculo} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="grid-2">
                <div>
                  <label className="form-label">Placa do Veículo *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: OKU-4820" 
                    required 
                    value={newVeiculo.placa}
                    onChange={e => setNewVeiculo({ ...newVeiculo, placa: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Tipo de Veículo *</label>
                  <select 
                    className="form-select"
                    value={newVeiculo.tipo}
                    onChange={e => setNewVeiculo({ ...newVeiculo, tipo: e.target.value })}
                  >
                    <option value="Ônibus Rodoviário (48 Lugares)">Ônibus Rodoviário (48 Lugares)</option>
                    <option value="Van Sprinter (16 Lugares)">Van Sprinter (16 Lugares)</option>
                    <option value="Caminhão Baú (Carga)">Caminhão Baú (Carga)</option>
                    <option value="Ambulância de Apoio (UTI Móvel)">Ambulância de Apoio (UTI Móvel)</option>
                    <option value="Carro Passeio / Utilulário">Carro Passeio / Utilitário</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Modelo / Marca *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Mercedes-Benz OF-1721" 
                    required
                    value={newVeiculo.modelo}
                    onChange={e => setNewVeiculo({ ...newVeiculo, modelo: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Quilometragem Inicial (KM) *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: 214.500 km" 
                    required
                    value={newVeiculo.km}
                    onChange={e => setNewVeiculo({ ...newVeiculo, km: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Destinação / Uso Principal</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Linha Candeias ↔ Salvador (Triagem Acolhimento)" 
                  value={newVeiculo.uso}
                  onChange={e => setNewVeiculo({ ...newVeiculo, uso: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewVeiculoModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-warning" style={{ background: '#d97706', borderColor: '#d97706', fontWeight: 800 }}>+ Salvar Veículo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Editar Veículo */}
      {showEditVeiculoModal && editingVeiculo && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#2563eb' }}>
                ✏️ Editar Veículo: {editingVeiculo.placa} ({editingVeiculo.tipo})
              </h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowEditVeiculoModal(false)}>✕</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setVeiculos(veiculos.map(v => v.id === editingVeiculo.id ? editingVeiculo : v));
              setShowEditVeiculoModal(false);
              setEditingVeiculo(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="grid-2">
                <div>
                  <label className="form-label">Placa</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
                    value={editingVeiculo.placa}
                    onChange={e => setEditingVeiculo({ ...editingVeiculo, placa: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Quilometragem (KM)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
                    value={editingVeiculo.km}
                    onChange={e => setEditingVeiculo({ ...editingVeiculo, km: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Nível de Combustível (%)</label>
                  <select 
                    className="form-select"
                    value={editingVeiculo.combustivel}
                    onChange={e => setEditingVeiculo({ ...editingVeiculo, combustivel: e.target.value })}
                  >
                    <option value="100%">100% (Tanque Cheio)</option>
                    <option value="75%">75% (3/4 Tanque)</option>
                    <option value="50%">50% (Meio Tanque)</option>
                    <option value="25%">25% (1/4 Tanque)</option>
                    <option value="Reserva">Reserva (Crítico)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Status Operacional</label>
                  <select 
                    className="form-select"
                    value={editingVeiculo.status}
                    onChange={e => setEditingVeiculo({ ...editingVeiculo, status: e.target.value })}
                  >
                    <option value="Disponível">Disponível</option>
                    <option value="Em Viagem (Salvador)">Em Viagem (Salvador)</option>
                    <option value="Prontidão Posto Médico">Prontidão Posto Médico</option>
                    <option value="Em Manutenção Oficina">Em Manutenção Oficina</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Uso / Destinação</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingVeiculo.uso}
                  onChange={e => setEditingVeiculo({ ...editingVeiculo, uso: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditVeiculoModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">✓ Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Checklist Pré-Viagem */}
      {showChecklistModal && checkingVeiculo && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #166534', paddingBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                📋 Checklist Pré-Viagem: {checkingVeiculo.placa} ({checkingVeiculo.tipo})
              </h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowChecklistModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveChecklist} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                Inspeção obrigatória de itens de segurança antes da liberação do veículo para a rodovia.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={checklistItems.pneus} 
                    onChange={e => setChecklistItems({ ...checklistItems, pneus: e.target.checked })} 
                  />
                  🛞 Pneus, Calibragem & Estepe de Emergência
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={checklistItems.oleoAgua} 
                    onChange={e => setChecklistItems({ ...checklistItems, oleoAgua: e.target.checked })} 
                  />
                  💧 Nível do Óleo do Motor & Água do Radiador
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={checklistItems.freios} 
                    onChange={e => setChecklistItems({ ...checklistItems, freios: e.target.checked })} 
                  />
                  🛑 Fluido de Freios & Freio de Mão
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={checklistItems.farois} 
                    onChange={e => setChecklistItems({ ...checklistItems, farois: e.target.checked })} 
                  />
                  💡 Faróis, Setas & Luzes de Freio
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={checklistItems.documentacao} 
                    onChange={e => setChecklistItems({ ...checklistItems, documentacao: e.target.checked })} 
                  />
                  📄 CRLV Veicular Atualizado & CNH do Motorista
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={checklistItems.extintor} 
                    onChange={e => setChecklistItems({ ...checklistItems, extintor: e.target.checked })} 
                  />
                  🧯 Extintor de Incêndio & Kit Primeiros Socorros
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowChecklistModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-success" style={{ fontWeight: 800 }}>✓ Salvar Inspeção de Checklist</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Registrar Abastecimento */}
      {showAbastecimentoModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Fuel size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>Registrar Abastecimento de Veículo</h3>
              </div>
              <button onClick={() => setShowAbastecimentoModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddFuel} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Veículo Abastecido *</label>
                <select 
                  className="form-select"
                  value={newFuel.veiculo}
                  onChange={(e) => setNewFuel({ ...newFuel, veiculo: e.target.value })}
                >
                  {veiculos.map(v => (
                    <option key={v.id} value={`${v.tipo} (${v.placa})`}>
                      {v.tipo} ({v.placa}) — KM: {v.km}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Tipo de Combustível</label>
                  <select 
                    className="form-select"
                    value={newFuel.tipoCombustivel}
                    onChange={(e) => setNewFuel({ ...newFuel, tipoCombustivel: e.target.value })}
                  >
                    <option value="Diesel S10">Diesel S10</option>
                    <option value="Gasolina Comum">Gasolina Comum</option>
                    <option value="Etanol">Etanol</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Volume (Litros) *</label>
                  <input 
                    type="number" 
                    step="0.1"
                    required 
                    className="form-input" 
                    placeholder="Ex: 120.0"
                    value={newFuel.litros}
                    onChange={(e) => setNewFuel({ ...newFuel, litros: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Valor Total (R$) *</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input" 
                    placeholder="Ex: 720,00"
                    value={newFuel.valor}
                    onChange={(e) => setNewFuel({ ...newFuel, valor: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Posto / Cupom Fiscal (NF-e)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: NF-e 88.401 (Posto Petrobras)"
                    value={newFuel.cupom}
                    onChange={(e) => setNewFuel({ ...newFuel, cupom: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAbastecimentoModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={18} /> Salvar Abastecimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Editar Abastecimento */}
      {showEditAbastecimentoModal && editingAbastecimento && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Fuel size={22} style={{ color: '#2563eb' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>Editar Abastecimento: {editingAbastecimento.id}</h3>
              </div>
              <button onClick={() => setShowEditAbastecimentoModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setAbastecimentos(abastecimentos.map(a => a.id === editingAbastecimento.id ? editingAbastecimento : a));
              setShowEditAbastecimentoModal(false);
              setEditingAbastecimento(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Veículo Abastecido</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingAbastecimento.veiculo}
                  onChange={e => setEditingAbastecimento({ ...editingAbastecimento, veiculo: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Litros</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingAbastecimento.litros}
                    onChange={e => setEditingAbastecimento({ ...editingAbastecimento, litros: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Valor Total</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingAbastecimento.valor}
                    onChange={e => setEditingAbastecimento({ ...editingAbastecimento, valor: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditAbastecimentoModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">✓ Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 6: Nova Ordem de Serviço (OS) */}
      {showNewOSModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wrench size={22} style={{ color: '#d97706' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>Nova Ordem de Serviço de Manutenção</h3>
              </div>
              <button onClick={() => setShowNewOSModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddOS} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Setor da Sede ou Veículo *</label>
                <select 
                  className="form-select"
                  value={newOS.setor}
                  onChange={(e) => setNewOS({ ...newOS, setor: e.target.value })}
                >
                  <option value="Manutenção de Frota (Mecânica)">Manutenção de Frota (Mecânica)</option>
                  <option value="Manutenção Predial (Elétrica)">Manutenção Predial (Elétrica)</option>
                  <option value="Manutenção Predial (Hidráulica)">Manutenção Predial (Hidráulica)</option>
                  <option value="Serralheria & Marcenaria">Serralheria & Marcenaria</option>
                  <option value="Pintura & Estrutura Hangar">Pintura & Estrutura Hangar</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Descrição Detalhada do Reparo Necessário *</label>
                <textarea 
                  required 
                  className="form-input" 
                  rows="3"
                  placeholder="Ex: Substituição das pastilhas de freio e alinhamento do ônibus OKU-4820..."
                  value={newOS.descricao}
                  onChange={(e) => setNewOS({ ...newOS, descricao: e.target.value })}
                ></textarea>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Prioridade</label>
                  <select 
                    className="form-select"
                    value={newOS.prioridade}
                    onChange={(e) => setNewOS({ ...newOS, prioridade: e.target.value })}
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta (Urgência)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Responsável Técnico (Profissional Cadastrado)</label>
                  <select 
                    className="form-select"
                    value={newOS.responsavel}
                    onChange={(e) => setNewOS({ ...newOS, responsavel: e.target.value })}
                  >
                    {profissionais && profissionais.length > 0 ? (
                      profissionais.map(p => (
                        <option key={p.id} value={`${p.nome} (${p.funcao || p.cargo || 'Mecânica/Elétrica'})`}>
                          {p.nome} — {p.funcao || p.cargo}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Mecânica Central Candeias">Mecânica Central Candeias</option>
                        <option value="Oficina de Elétrica (Acolhido Roberto)">Oficina de Elétrica (Acolhido Roberto)</option>
                        <option value="Equipe de Manutenção FDJ">Equipe de Manutenção FDJ</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewOSModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-warning" style={{ background: '#d97706', borderColor: '#d97706', fontWeight: 800 }}>
                  <CheckCircle2 size={18} /> Abrir Ordem de Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 7: Editar OS */}
      {showEditOSModal && editingOS && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wrench size={22} style={{ color: '#2563eb' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>Editar OS: {editingOS.id}</h3>
              </div>
              <button onClick={() => setShowEditOSModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setOrdensServico(ordensServico.map(o => o.id === editingOS.id ? editingOS : o));
              setShowEditOSModal(false);
              setEditingOS(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Setor / Veículo</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingOS.setor}
                  onChange={e => setEditingOS({ ...editingOS, setor: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição do Reparo</label>
                <textarea 
                  className="form-input"
                  rows="2"
                  value={editingOS.descricao}
                  onChange={e => setEditingOS({ ...editingOS, descricao: e.target.value })}
                ></textarea>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Status da OS</label>
                  <select 
                    className="form-select"
                    value={editingOS.status}
                    onChange={e => setEditingOS({ ...editingOS, status: e.target.value })}
                  >
                    <option value="Em Aberto">Em Aberto</option>
                    <option value="Em Execução">Em Execução</option>
                    <option value="Concluída">Concluída (Finalizada)</option>
                    <option value="Aguardando Peças">Aguardando Peças</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Prioridade</label>
                  <select 
                    className="form-select"
                    value={editingOS.prioridade}
                    onChange={e => setEditingOS({ ...editingOS, prioridade: e.target.value })}
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditOSModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">✓ Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 8: Agendar Transporte SUS */}
      {showAgendarTransporteModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bus size={22} style={{ color: '#047857' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>Agendar Escala de Transporte Médico SUS</h3>
              </div>
              <button onClick={() => setShowAgendarTransporteModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddTransporte} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Data e Horário de Saída *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
                    value={newTransporte.data}
                    onChange={e => setNewTransporte({ ...newTransporte, data: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Veículo Escalado *</label>
                  <select 
                    className="form-select"
                    value={newTransporte.veiculo}
                    onChange={e => setNewTransporte({ ...newTransporte, veiculo: e.target.value })}
                  >
                    {veiculos.map(v => (
                      <option key={v.id} value={`${v.tipo} (${v.placa})`}>
                        {v.tipo} ({v.placa})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Motorista Credenciado FDJ *</label>
                  <select 
                    className="form-select"
                    value={newTransporte.motorista}
                    onChange={e => setNewTransporte({ ...newTransporte, motorista: e.target.value })}
                  >
                    {profissionais && profissionais.length > 0 ? (
                      profissionais.map(p => (
                        <option key={p.id} value={`${p.nome} (Motorista FDJ)`}>
                          {p.nome} — {p.funcao || p.cargo}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Irmão Raimundo (Motorista Credenciado FDJ)">Irmão Raimundo (Motorista Credenciado FDJ)</option>
                        <option value="Irmão Carlos Eduardo (Motorista FDJ)">Irmão Carlos Eduardo (Motorista FDJ)</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Destino Hospitalar / Unidade SUS *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required
                    placeholder="Ex: Hospital Geral de Candeias / HGE Salvador"
                    value={newTransporte.destino}
                    onChange={e => setNewTransporte({ ...newTransporte, destino: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Acolhidos Transportados (Cadastro Módulo 1)</label>
                <textarea 
                  className="form-input"
                  rows="2"
                  placeholder="Ex: Antonio Carlos da Silva Filho, Marcos Vinicius Santos Santana..."
                  value={newTransporte.acolhidos}
                  onChange={e => setNewTransporte({ ...newTransporte, acolhidos: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAgendarTransporteModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-success" style={{ fontWeight: 800 }}>+ Confirmar Escala SUS</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 9: Editar Transporte SUS */}
      {showEditTransporteModal && editingTransporte && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bus size={22} style={{ color: '#2563eb' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>Editar Transporte: {editingTransporte.id}</h3>
              </div>
              <button onClick={() => setShowEditTransporteModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setTransportesSUS(transportesSUS.map(t => t.id === editingTransporte.id ? editingTransporte : t));
              setShowEditTransporteModal(false);
              setEditingTransporte(null);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Data e Hora</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingTransporte.data}
                    onChange={e => setEditingTransporte({ ...editingTransporte, data: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select"
                    value={editingTransporte.status}
                    onChange={e => setEditingTransporte({ ...editingTransporte, status: e.target.value })}
                  >
                    <option value="Agendado">Agendado</option>
                    <option value="Em Trânsito">Em Trânsito</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Destino</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingTransporte.destino}
                  onChange={e => setEditingTransporte({ ...editingTransporte, destino: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Acolhidos Transportados</label>
                <textarea 
                  className="form-input" 
                  rows="2"
                  value={editingTransporte.acolhidos}
                  onChange={e => setEditingTransporte({ ...editingTransporte, acolhidos: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditTransporteModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">✓ Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 10: Imprimir Escala de Transporte SUS */}
      {(showPrintTransporteModal || printingTransporte) && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-success">Escala de Transporte de Saúde (SUS)</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={16} /> Imprimir Escala
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => {
                  setShowPrintTransporteModal(false);
                  setPrintingTransporte(null);
                }}>
                  <X size={16} /> Fechar
                </button>
              </div>
            </div>

            <div className="printable-document">
              <div className="printable-header">
                <h2>FUNDAÇÃO DOUTOR JESUS</h2>
                <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                  ESCALA OFICIAL DE TRANSPORTE DE ACOLHIDOS PARA CONSULTAS MÉDICAS EXTERNAS (SUS)
                </p>
                <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Setor de Logística & Posto Médico — Candeias / BA
                </p>
              </div>

              <div style={{ border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <p>• Código de Saída: <strong>{printingTransporte?.id || 'TRS-101'}</strong></p>
                <p>• Veículo Escalado: <strong>{printingTransporte?.veiculo || 'Van Sprinter 16 Lugares (Placa JRS-9102)'}</strong></p>
                <p>• Motorista Responsável: <strong>{printingTransporte?.motorista || 'Irmão Raimundo (Motorista Credenciado FDJ)'}</strong></p>
                <p>• Data / Horário de Saída: <strong>{printingTransporte?.data || '2026-08-15 07:00'}</strong></p>
                <p>• Destino Hospitalar: <strong>{printingTransporte?.destino || 'Hospital Geral de Candeias / HGE Salvador'}</strong></p>
              </div>

              <h4 style={{ textTransform: 'uppercase', fontSize: '0.95rem', marginBottom: '0.5rem', color: '#0f172a' }}>
                RELAÇÃO DE ACOLHIDOS TRANSPORTADOS
              </h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                {printingTransporte?.acolhidos ? (
                  printingTransporte.acolhidos.split(',').map((a, idx) => (
                    <span key={idx}>{idx + 1}. {a.trim()}<br /></span>
                  ))
                ) : (
                  'Relação de acolhidos em acompanhamento médico.'
                )}
              </p>

              <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '0.85rem' }}>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem' }}>
                    <strong>Posto Médico FDJ</strong><br />
                    Liberado pela Enfermagem
                  </div>
                </div>

                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '0.5rem' }}>
                    <strong>Setor de Logística / Motorista</strong><br />
                    Visto de Transporte
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
