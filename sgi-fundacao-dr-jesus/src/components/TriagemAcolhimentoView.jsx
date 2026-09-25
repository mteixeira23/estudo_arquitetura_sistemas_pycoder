import React, { useState, useRef, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  FileText, 
  Printer, 
  X, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck,
  Building2,
  FileCheck,
  Brain,
  Scale,
  Activity,
  ArrowRight,
  UserCheck,
  Box,
  HeartPulse,
  Lock,
  DollarSign,
  Smartphone,
  Camera,
  Upload,
  Users,
  CheckSquare,
  IdCard,
  QrCode,
  UtensilsCrossed,
  CreditCard,
  Trash2
} from 'lucide-react';


// Mapeamento Completo de Estados da Federação (UF)
const ESTADOS_FEDERACAO = [
  { sigla: 'BA', nome: 'BA - Bahia' },
  { sigla: 'SE', nome: 'SE - Sergipe' },
  { sigla: 'AL', nome: 'AL - Alagoas' },
  { sigla: 'PE', nome: 'PE - Pernambuco' },
  { sigla: 'CE', nome: 'CE - Ceará' },
  { sigla: 'PB', nome: 'PB - Paraíba' },
  { sigla: 'RN', nome: 'RN - Rio Grande do Norte' },
  { sigla: 'MA', nome: 'MA - Maranhão' },
  { sigla: 'PI', nome: 'PI - Piauí' },
  { sigla: 'ES', nome: 'ES - Espírito Santo' },
  { sigla: 'MG', nome: 'MG - Minas Gerais' },
  { sigla: 'RJ', nome: 'RJ - Rio de Janeiro' },
  { sigla: 'SP', nome: 'SP - São Paulo' },
  { sigla: 'DF', nome: 'DF - Distrito Federal' },
  { sigla: 'GO', nome: 'GO - Goiás' },
  { sigla: 'PR', nome: 'PR - Paraná' },
  { sigla: 'SC', nome: 'SC - Santa Catarina' },
  { sigla: 'RS', nome: 'RS - Rio Grande do Sul' },
  { sigla: 'PA', nome: 'PA - Pará' },
  { sigla: 'AM', nome: 'AM - Amazonas' },
  { sigla: 'MT', nome: 'MT - Mato Grosso' },
  { sigla: 'MS', nome: 'MS - Mato Grosso do Sul' },
  { sigla: 'TO', nome: 'TO - Tocantins' },
  { sigla: 'RO', nome: 'RO - Rondônia' },
  { sigla: 'AC', nome: 'AC - Acre' },
  { sigla: 'AP', nome: 'AP - Amapá' },
  { sigla: 'RR', nome: 'RR - Roraima' }
];

export default function TriagemAcolhimentoView({ acolhidos, onAddAcolhido, onResetAcolhidos, onRestoreAcolhidos, cofreDevolucoes = {}, searchTerm, setSearchTerm, activeSubTab = 'novo', setActiveSubTab }) {
  const fileInputRef = useRef(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedAcolhidoTermo, setSelectedAcolhidoTermo] = useState(null);
  const [termoTipo, setTermoTipo] = useState('voluntario');
  const [activeFormTab, setActiveFormTab] = useState('pessoais');
  const [selectedCrachaAcolhido, setSelectedCrachaAcolhido] = useState(null);
  const [selectedDossieAcolhido, setSelectedDossieAcolhido] = useState(null);
  const [filterTag, setFilterTag] = useState('todos');

  // Sample Avatar Options for Camera Capture Simulation
  const sampleAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
  ];

  // Advanced Anamnese Form State
  const [formData, setFormData] = useState({
    nome: '',
    nomeSocial: '',
    cpf: '',
    rg: '',
    rgNumero: '',
    rgOrgaoEmissor: 'SSP',
    rgUF: 'BA',
    dataNascimento: '',
    idade: '',
    escolaridade: 'Ensino Médio Incompleto',
    estadoCivil: 'Solteiro(a)',
    nomeMae: '',
    nomePai: '',
    ufOrigem: 'BA',
    municipioOrigem: 'Salvador (Subúrbio Ferroviário)',
    outroMunicipioCustom: '',
    bairro: 'Periperi',
    enderecoOrigem: '',
    foto: sampleAvatars[0],
    
    // Rede de Apoio Familiar
    nomeFamiliarResponsavel: '',
    parentescoFamiliar: 'Mãe',
    cpfFamiliar: '',
    telefoneFamiliar: '',
    autorizaVisitaFamiliar: true,
    autorizaBoletimSaude: true,

    // Triagem Social & CadÚnico / NIS
    possuiCadUnico: 'Sim',
    numeroNIS: '128.49012.88-0',
    beneficioSocial: 'Bolsa Família',
    situacaoMoradiaPrevia: 'Em Situação de Rua (Subúrbio)',
    rendaFamiliarMensal: 'R$ 600,00',

    // Restrições Alimentares & Alergias
    restricaoAlimentar: 'Diabético (Sem Açúcar)',
    alergiasConhecidas: 'Nenhuma alergia medicamentosa',

    // Anamnese de Dependência Química
    substanciaPrincipal: 'Crack / Álcool',
    substanciasSecundarias: 'Cannabis, Tabaco',
    idadePrimeiroUso: '14 anos',
    tempoUsoContinuado: '8 anos',
    frequenciaUso: 'Diário Compulsivo',
    internacoesAnteriores: '1 internação prévia em CT (2023)',
    
    // Saúde Mental & Comorbidades
    diagnosticosPrevios: 'Ansiedade Severa, Depressão',
    ideacaoSuicida: 'Não',
    usoMedicamentoControlado: 'Sim (Diazepam 10mg)',
    comorbidadesFisicas: 'Hipertensão leve',
    
    // Sinais Vitais de Entrada
    pressaoArterial: '120x80',
    frequenciaCardiaca: '76',
    glicemia: '92',
    temperatura: '36.5',
    alertaMedicoEntrada: 'Sinais Vitais Estáveis (Elegível para Leito)',
    
    // Inventário de Pertences & Custódia no Cofre
    celularEletronico: '1 Smartphone Samsung A14 (Guardado no Cofre)',
    documentosCofre: 'RG e CPF Originais (Guardados no Cofre)',
    valorDinheiro: '50.00',
    vestuarioMochilas: '1 Mochila com 5 peças de roupa',
    observacaoPertences: 'Pertences conferidos, lacrados no envelope nº 104 e depositados no cofre central.',

    // Checklist do Kit de Acolhimento Entregue
    kitHigiene: true,
    enxovalLeito: true,
    vestuarioPadrao: true,
    crachaIdentificacao: true,

    // Jurídico & Documentos
    pendenciaDocumental: 'Não',
    pendenciaJudicial: 'Não',
    cumpreMedidaAlternativa: 'Não',
    observacaoJuridica: 'Nenhuma restrição judicial. Acolhimento voluntário espontâneo.',
    
    // Encaminhamento Inicial
    alojamento: 'Bloco A - Restauração',
    leito: 'Leito A-108',
    termoMROSC: 'Termo de Fomento 014/2025 (SADS-BA)',
    contatoFamilia: ''
  });

  // Mascara Oficial de RG no Padrão Brasileiro (8 a 10 dígitos -> 00.000.000-0)
  const formatRG = (value) => {
    if (!value) return '';
    const cleaned = value.replace(/[^0-9xX]/g, '').toUpperCase().slice(0, 10);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
  };


  // Mascara Oficial de NIS / PIS / PASEP no Padrão Brasileiro (11 dígitos -> 000.00000.00-0)
  const formatNIS = (value) => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 8) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 10) return `${digits.slice(0, 3)}.${digits.slice(3, 8)}.${digits.slice(8)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 8)}.${digits.slice(8, 10)}-${digits.slice(10, 11)}`;
  };


  // Mascara Oficial de Telefone / Celular (Padrão Anatel Brasil -> (XX) 9XXXX-XXXX / (XX) XXXX-XXXX)
  const formatPhone = (value) => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  // Mascara Oficial de CPF no Padrão Brasileiro (11 dígitos -> 000.000.000-00)
  const formatCPF = (value) => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  };


  // Helper to render the complete Anamnese Form Content inline or inside Modal
  


  // Integração com API Oficial do IBGE (Carrega TODOS os 5.570 Municípios do Brasil por UF)

  // Gestão de Baixa & Devolução de Pertences do Cofre
  const [selectedDevolucaoTermo, setSelectedDevolucaoTermo] = useState(null);

  const [cidadesIBGE, setCidadesIBGE] = useState([]);
  const [loadingCidades, setLoadingCidades] = useState(false);

  useEffect(() => {
    const uf = formData.ufOrigem || 'BA';
    setLoadingCidades(true);
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const lista = data.map(m => m.nome);
          setCidadesIBGE(lista);
          setFormData(prev => ({
            ...prev,
            municipioOrigem: lista.includes(prev.municipioOrigem) ? prev.municipioOrigem : lista[0]
          }));
        }
      })
      .catch(err => {
        console.warn("Erro ao carregar cidades do IBGE:", err);
      })
      .finally(() => setLoadingCidades(false));
  }, [formData.ufOrigem]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, foto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulateCameraCapture = () => {
    const nextIdx = Math.floor(Math.random() * sampleAvatars.length);
    setFormData(prev => ({ ...prev, foto: sampleAvatars[nextIdx] }));
  };
  
  // Helper to render the complete Anamnese Form Content inline or inside Modal
  const renderAnamneseFormContent = () => (
    <form onSubmit={handleSubmitNewAdmission}>
      {/* Form Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button 
          type="button"
          className={`btn btn-sm ${activeFormTab === 'pessoais' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveFormTab('pessoais')}
        >
          1. Pessoais & Câmera
        </button>

        <button 
          type="button"
          className={`btn btn-sm ${activeFormTab === 'cadunico' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveFormTab('cadunico')}
        >
          2. CadÚnico & Social
        </button>

        <button 
          type="button"
          className={`btn btn-sm ${activeFormTab === 'familia' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveFormTab('familia')}
        >
          3. Rede Familiar
        </button>

        <button 
          type="button"
          className={`btn btn-sm ${activeFormTab === 'sinais_vitais' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveFormTab('sinais_vitais')}
        >
          4. Sinais Vitais & Dieta
        </button>

        <button 
          type="button"
          className={`btn btn-sm ${activeFormTab === 'dependencia' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveFormTab('dependencia')}
        >
          5. Dependência
        </button>

        <button 
          type="button"
          className={`btn btn-sm ${activeFormTab === 'saudemental' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveFormTab('saudemental')}
        >
          6. Saúde Mental
        </button>

        <button 
          type="button"
          className={`btn btn-sm ${activeFormTab === 'pertences' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveFormTab('pertences')}
        >
          7. Cofre & Pertences
        </button>

        <button 
          type="button"
          className={`btn btn-sm ${activeFormTab === 'kit_acolhimento' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveFormTab('kit_acolhimento')}
        >
          8. Kit Boas-Vindas
        </button>
      </div>

      {/* TAB 1: Dados Pessoais & Câmera */}
      {activeFormTab === 'pessoais' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={formData.foto} 
                  alt="Avatar" 
                  style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', boxShadow: 'var(--shadow-md)' }} 
                />
                <button 
                  type="button" 
                  onClick={handleSimulateCameraCapture}
                  style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  title="Capturar Foto com Câmera"
                >
                  <Camera size={14} />
                </button>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', margin: '0 0 0.25rem 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Camera size={16} style={{ color: 'var(--primary)' }} /> Captura de Foto em Tempo Real (Câmera de Triagem)
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0' }}>
                  Selecione ou capture a imagem oficial do acolhido para o crachá e ficha clínica.
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleImageUpload} 
                  />

                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm" 
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    style={{ fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    <Upload size={14} /> Carregar Foto do Computador
                  </button>

                  <button 
                    type="button" 
                    className="btn btn-outline btn-sm" 
                    onClick={handleSimulateCameraCapture}
                    style={{ fontSize: '0.75rem' }}
                  >
                    <Camera size={14} /> Capturar com Câmera
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Nome Completo *</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                placeholder="Ex: Carlos Alberto dos Santos"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">CPF (Padrão Oficial 11 dígitos) *</label>
              <input 
                type="text" 
                required 
                maxLength={14}
                className="form-input" 
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Data de Nascimento / Idade</label>
              <input 
                type="date" 
                className="form-input" 
                value={formData.dataNascimento}
                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nome da Mãe</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Nome da Mãe"
                value={formData.nomeMae}
                onChange={(e) => setFormData({ ...formData, nomeMae: e.target.value })}
              />
            </div>
          </div>

          {/* DEDICATED OFFICIAL BRAZILIAN RG FIELDS */}
          <div className="grid-3" style={{ gridTemplateColumns: '1.4fr 1fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">Número do RG (8 a 10 dígitos) *</label>
              <input 
                type="text" 
                maxLength={12}
                className="form-input" 
                placeholder="00.000.000-0"
                value={formData.rgNumero || ''}
                onChange={(e) => {
                  const formatted = formatRG(e.target.value);
                  setFormData({ 
                    ...formData, 
                    rgNumero: formatted, 
                    rg: `${formatted} ${formData.rgOrgaoEmissor || 'SSP'}/${formData.rgUF || 'BA'}` 
                  });
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Órgão Emissor *</label>
              <select 
                className="form-select"
                value={formData.rgOrgaoEmissor || 'SSP'}
                onChange={(e) => {
                  const newEmissor = e.target.value;
                  setFormData({ 
                    ...formData, 
                    rgOrgaoEmissor: newEmissor, 
                    rg: `${formData.rgNumero || ''} ${newEmissor}/${formData.rgUF || 'BA'}` 
                  });
                }}
              >
                <option value="SSP">SSP (Segurança Pública)</option>
                <option value="POLICIA CIVIL">Polícia Civil</option>
                <option value="DETRAN">DETRAN</option>
                <option value="IFP">IFP / Instituto Félix Pacheco</option>
                <option value="ITEP">ITEP</option>
                <option value="DPT">DPT (Perícia Técnica)</option>
                <option value="Outro">Outro Órgão Emissor</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">UF do RG *</label>
              <select 
                className="form-select"
                value={formData.rgUF || 'BA'}
                onChange={(e) => {
                  const newUF = e.target.value;
                  setFormData({ 
                    ...formData, 
                    rgUF: newUF, 
                    rg: `${formData.rgNumero || ''} ${formData.rgOrgaoEmissor || 'SSP'}/${newUF}` 
                  });
                }}
              >
                {ESTADOS_FEDERACAO.map((est) => (
                  <option key={est.sigla} value={est.sigla}>{est.sigla}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid-3" style={{ gridTemplateColumns: '1fr 1.5fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">Estado de Origem (UF) *</label>
              <select 
                className="form-select"
                value={formData.ufOrigem || 'BA'}
                onChange={(e) => {
                  const newUF = e.target.value;
                  setFormData({ ...formData, ufOrigem: newUF, outroMunicipioCustom: '' });
                }}
              >
                {ESTADOS_FEDERACAO.map((est) => (
                  <option key={est.sigla} value={est.sigla}>{est.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Município de Origem {loadingCidades ? '(Carregando IBGE...)' : `(${cidadesIBGE.length} Cidades IBGE)`} *
              </label>
              <select 
                className="form-select"
                value={formData.municipioOrigem}
                onChange={(e) => setFormData({ ...formData, municipioOrigem: e.target.value })}
                disabled={loadingCidades}
              >
                {cidadesIBGE.map((cidade, i) => (
                  <option key={i} value={cidade}>{cidade}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Nome do Pai (opcional)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Nome do Pai"
                value={formData.nomePai || ''}
                onChange={(e) => setFormData({ ...formData, nomePai: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" className="btn btn-primary" onClick={() => setActiveFormTab('cadunico')}>
              Próximo: CadÚnico & Social <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Triagem Social & CadÚnico / NIS */}
      {activeFormTab === 'cadunico' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '0.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CreditCard size={18} /> Triagem Social, NIS & Programas Sociais
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Mapeamento de vulnerabilidade socioeconômica para acompanhamento do Serviço Social da Fundação Dr. Jesus.
            </p>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Inscrição no CadÚnico?</label>
              <select 
                className="form-select"
                value={formData.possuiCadUnico}
                onChange={(e) => setFormData({ ...formData, possuiCadUnico: e.target.value })}
              >
                <option value="Sim">Sim (Possui NIS ativo)</option>
                <option value="Não">Não (Necessita de inclusão no CadÚnico)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Número do NIS (Padrão Oficial 11 dígitos)</label>
              <input 
                type="text" 
                maxLength={14}
                className="form-input" 
                placeholder="000.00000.00-0"
                value={formData.numeroNIS}
                onChange={(e) => setFormData({ ...formData, numeroNIS: formatNIS(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Benefício Social Recebido</label>
              <select 
                className="form-select"
                value={formData.beneficioSocial}
                onChange={(e) => setFormData({ ...formData, beneficioSocial: e.target.value })}
              >
                <option value="Bolsa Família">Bolsa Família</option>
                <option value="BPC (Benefício de Prestação Continuada)">BPC (Benefício de Prestação Continuada)</option>
                <option value="Nenhum">Nenhum Benefício</option>
                <option value="Outro Auxílio Estadual/Municipal">Outro Auxílio</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Situação de Moradia Prévia</label>
              <select 
                className="form-select"
                value={formData.situacaoMoradiaPrevia}
                onChange={(e) => setFormData({ ...formData, situacaoMoradiaPrevia: e.target.value })}
              >
                <option value="Em Situação de Rua (Subúrbio)">Em Situação de Rua (Subúrbio/Centro)</option>
                <option value="Residência Familiar Cedida">Residência Familiar Cedida</option>
                <option value="Aluguel Social / Próprio">Aluguel Social / Próprio</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setActiveFormTab('pessoais')}>
              Anterior
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setActiveFormTab('familia')}>
              Próximo: Rede Familiar <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Rede de Apoio Familiar */}
      {activeFormTab === 'familia' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Nome do Familiar Responsável *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: Maria das Graças dos Santos"
                value={formData.nomeFamiliarResponsavel}
                onChange={(e) => setFormData({ ...formData, nomeFamiliarResponsavel: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Grau de Parentesco</label>
              <select 
                className="form-select"
                value={formData.parentescoFamiliar}
                onChange={(e) => setFormData({ ...formData, parentescoFamiliar: e.target.value })}
              >
                <option value="Mãe">Mãe</option>
                <option value="Pai">Pai</option>
                <option value="Esposa / Cônjuge">Esposa / Cônjuge</option>
                <option value="Irmão / Irmã">Irmão / Irmã</option>
                <option value="Filho(a)">Filho(a)</option>
                <option value="Tutor / Responsável Legal">Tutor / Responsável Legal</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Telefone WhatsApp do Familiar (DDD + Número) *</label>
              <input 
                type="text" 
                maxLength={15}
                className="form-input" 
                placeholder="(71) 98842-1044"
                value={formData.telefoneFamiliar}
                onChange={(e) => setFormData({ ...formData, telefoneFamiliar: formatPhone(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">CPF do Familiar Responsável</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="000.000.000-00"
                value={formData.cpfFamiliar} maxLength={14} onChange={(e) => setFormData({ ...formData, cpfFamiliar: formatCPF(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setActiveFormTab('cadunico')}>
              Anterior
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setActiveFormTab('sinais_vitais')}>
              Próximo: Sinais Vitais & Dieta <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Sinais Vitais & Restrição Alimentar */}
      {activeFormTab === 'sinais_vitais' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Pressão Arterial (Entrada)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: 120x80 mmHg"
                value={formData.pressaoArterial}
                onChange={(e) => setFormData({ ...formData, pressaoArterial: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Glicemia de Jejum / Temperatura</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: 92 mg/dL • 36.5°C"
                value={formData.glicemia}
                onChange={(e) => setFormData({ ...formData, glicemia: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Restrição Alimentar & Dieta Especial *</label>
              <select 
                className="form-select"
                value={formData.restricaoAlimentar}
                onChange={(e) => setFormData({ ...formData, restricaoAlimentar: e.target.value })}
              >
                <option value="Sem Restrições (Dieta Geral)">Sem Restrições (Dieta Geral)</option>
                <option value="Diabético (Sem Açúcar)">Diabético (Sem Açúcar)</option>
                <option value="Hipertenso (Hipossódica / Pouco Sal)">Hipertenso (Pouco Sal)</option>
                <option value="Intolerante a Lactose">Intolerante a Lactose</option>
                <option value="Intolerante a Glúten (Céliaco)">Intolerante a Glúten</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Alergias Medicamentosas Declaradas</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: Alergia a Dipirona / Penicilina"
                value={formData.alergiasConhecidas}
                onChange={(e) => setFormData({ ...formData, alergiasConhecidas: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setActiveFormTab('familia')}>
              Anterior
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setActiveFormTab('dependencia')}>
              Próximo: Dependência Química <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: Anamnese de Dependência Química */}
      {activeFormTab === 'dependencia' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Substância Principal de Uso *</label>
              <select 
                className="form-select"
                value={formData.substanciaPrincipal}
                onChange={(e) => setFormData({ ...formData, substanciaPrincipal: e.target.value })}
              >
                <option value="Crack / Álcool">Crack / Álcool</option>
                <option value="Álcool Exclusivo">Álcool Exclusivo</option>
                <option value="Múltiplas Drogas (Crack, Cocaína, Cannabis)">Múltiplas Drogas (Crack, Cocaína, Cannabis)</option>
                <option value="Outra Substância Psychoativa">Outra Substância</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tempo de Uso Continuado & Frequência</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: 8 anos • Diário Compulsivo"
                value={formData.tempoUsoContinuado}
                onChange={(e) => setFormData({ ...formData, tempoUsoContinuado: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setActiveFormTab('sinais_vitais')}>
              Anterior
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setActiveFormTab('saudemental')}>
              Próximo: Saúde Mental <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: Saúde Mental & Comorbidades */}
      {activeFormTab === 'saudemental' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Diagnósticos Psiquiátricos Prévios</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: Ansiedade Severa, Bipolaridade, Depressão"
                value={formData.diagnosticosPrevios}
                onChange={(e) => setFormData({ ...formData, diagnosticosPrevios: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Uso de Medicamento Controlado?</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: Sim (Diazepam 10mg / Risperidona)"
                value={formData.usoMedicamentoControlado}
                onChange={(e) => setFormData({ ...formData, usoMedicamentoControlado: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setActiveFormTab('dependencia')}>
              Anterior
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setActiveFormTab('pertences')}>
              Próximo: Cofre & Pertences <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* TAB 7: Inventário de Pertences & Custódia no Cofre */}
      {activeFormTab === 'pertences' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'rgba(217, 119, 6, 0.08)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(217, 119, 6, 0.3)', marginBottom: '0.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--status-warning)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={18} /> Inventário de Custódia de Bens (Cofre Central FDJ)
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Registre aparelhos eletrônicos, valores em dinheiro e documentos lacrados sob guarda do Fiel Depositário.
            </p>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Celular / Eletrônicos Custodiados</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: 1 Smartphone Samsung A14 + Carregador"
                value={formData.celularEletronico}
                onChange={(e) => setFormData({ ...formData, celularEletronico: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Valor em Dinheiro (R$)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: 50,00"
                value={formData.valorDinheiro}
                onChange={(e) => setFormData({ ...formData, valorDinheiro: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setActiveFormTab('saudemental')}>
              Anterior
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setActiveFormTab('kit_acolhimento')}>
              Próximo: Kit Boas-Vindas <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* TAB 8: Kit Boas-Vindas & Alocação de Leito */}
      {activeFormTab === 'kit_acolhimento' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.85rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 800 }}>
              Checklist de Entrega do Kit de Acolhimento FDJ:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input type="checkbox" checked={formData.kitHigiene} onChange={(e) => setFormData({ ...formData, kitHigiene: e.target.checked })} />
                Kit de Higiene Pessoal (Sabonete, Creme Dental, Escova)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input type="checkbox" checked={formData.enxovalLeito} onChange={(e) => setFormData({ ...formData, enxovalLeito: e.target.checked })} />
                Enxoval de Leito (Lençol, Travesseiro, Fronha)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input type="checkbox" checked={formData.vestuarioPadrao} onChange={(e) => setFormData({ ...formData, vestuarioPadrao: e.target.checked })} />
                Vestuário Padrão Institucional
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input type="checkbox" checked={formData.crachaIdentificacao} onChange={(e) => setFormData({ ...formData, crachaIdentificacao: e.target.checked })} />
                Crachá de Identificação com QR Code
              </label>
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: '0.5rem' }}>
            <div className="form-group">
              <label className="form-label">Alojamento / Bloco Alocado *</label>
              <select 
                className="form-select"
                value={formData.alojamento}
                onChange={(e) => {
                  const novoBloco = e.target.value;
                  let prefix = 'A'; let start = 101;
                  if (novoBloco.includes('Bloco B')) { prefix = 'B'; start = 201; }
                  else if (novoBloco.includes('Bloco C')) { prefix = 'C'; start = 301; }
                  else if (novoBloco.includes('Bloco D')) { prefix = 'D'; start = 401; }
                  
                  const livres = [];
                  for (let i = 0; i < 25; i++) {
                    const bedCode = `Leito ${prefix}-${start + i}`;
                    const isOccupied = acolhidos.some(a => a.leito === bedCode && a.status !== 'Alta Terapêutica');
                    if (!isOccupied) livres.push(bedCode);
                  }
                  
                  setFormData({ 
                    ...formData, 
                    alojamento: novoBloco,
                    leito: livres[0] || ''
                  });
                }}
              >
                <option value="Bloco A - Restauração">Bloco A - Restauração</option>
                <option value="Bloco B - Renovação">Bloco B - Renovação</option>
                <option value="Bloco C - Esperança">Bloco C - Esperança</option>
                <option value="Bloco D - Graça">Bloco D - Graça</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Leito Alocado (Somente Leitos Livres)</label>
              <select 
                className="form-select"
                value={formData.leito}
                onChange={(e) => setFormData({ ...formData, leito: e.target.value })}
              >
                {(() => {
                  let prefix = 'A'; let start = 101;
                  if (formData.alojamento.includes('Bloco B')) { prefix = 'B'; start = 201; }
                  else if (formData.alojamento.includes('Bloco C')) { prefix = 'C'; start = 301; }
                  else if (formData.alojamento.includes('Bloco D')) { prefix = 'D'; start = 401; }
                  
                  const livres = [];
                  for (let i = 0; i < 25; i++) {
                    const bedCode = `Leito ${prefix}-${start + i}`;
                    const isOccupied = acolhidos.some(a => a.leito === bedCode && a.status !== 'Alta Terapêutica');
                    if (!isOccupied) livres.push(bedCode);
                  }
                  return livres.map(lCode => (
                    <option key={lCode} value={lCode}>{lCode} (Livre)</option>
                  ));
                })()}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setActiveFormTab('pertences')}>
              Anterior
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem', fontWeight: 800 }}>
              <CheckCircle size={18} /> Confirmar Acolhimento Completo & Alocar Leito
            </button>
          </div>
        </div>
      )}
    </form>
  );


  const handleSubmitNewAdmission = (e) => {
    e.preventDefault();
    if (!formData.nome) return;

    const newEntry = {
      id: `FDJ-2026-0${Math.floor(896 + Math.random() * 100)}`,
      ...formData,
      contatoFamilia: `${formData.nomeFamiliarResponsavel || 'Familiar'} (${formData.parentescoFamiliar}) - ${formData.telefoneFamiliar || '(71) 98842-1044'}`,
      idade: formData.idade || 32,
      dataEntrada: new Date().toISOString().split('T')[0],
      status: 'Ativo',
      statusAprovacao: 'Aprovado na Triagem & Alocado',
      laborterapiaSector: 'Aguardando Escala'
    };

    onAddAcolhido(newEntry);
    setShowFormModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      nomeSocial: '',
      cpf: '',
      rg: '',
    rgNumero: '',
    rgOrgaoEmissor: 'SSP',
    rgUF: 'BA',
      dataNascimento: '',
      idade: '',
      escolaridade: 'Ensino Médio Incompleto',
      estadoCivil: 'Solteiro(a)',
      nomeMae: '',
      nomePai: '',
      ufOrigem: 'BA',
    municipioOrigem: 'Salvador (Subúrbio Ferroviário)',
    outroMunicipioCustom: '',
      bairro: 'Periperi',
      enderecoOrigem: '',
      foto: sampleAvatars[0],
      nomeFamiliarResponsavel: '',
      parentescoFamiliar: 'Mãe',
      cpfFamiliar: '',
      telefoneFamiliar: '',
      autorizaVisitaFamiliar: true,
      autorizaBoletimSaude: true,
      possuiCadUnico: 'Sim',
      numeroNIS: '128.49012.88-0',
      beneficioSocial: 'Bolsa Família',
      situacaoMoradiaPrevia: 'Em Situação de Rua (Subúrbio)',
      rendaFamiliarMensal: 'R$ 600,00',
      restricaoAlimentar: 'Diabético (Sem Açúcar)',
      alergiasConhecidas: 'Nenhuma alergia medicamentosa',
      substanciaPrincipal: 'Crack / Álcool',
      substanciasSecundarias: 'Cannabis, Tabaco',
      idadePrimeiroUso: '14 anos',
      tempoUsoContinuado: '8 anos',
      frequenciaUso: 'Diário Compulsivo',
      internacoesAnteriores: '1 internação prévia em CT (2023)',
      diagnosticosPrevios: 'Ansiedade Severa, Depressão',
      ideacaoSuicida: 'Não',
      usoMedicamentoControlado: 'Sim (Diazepam 10mg)',
      comorbidadesFisicas: 'Hipertensão leve',
      pressaoArterial: '120x80',
      frequenciaCardiaca: '76',
      glicemia: '92',
      temperatura: '36.5',
      alertaMedicoEntrada: 'Sinais Vitais Estáveis (Elegível para Leito)',
      celularEletronico: '1 Smartphone Samsung A14 (Guardado no Cofre)',
      documentosCofre: 'RG e CPF Originais (Guardados no Cofre)',
      valorDinheiro: '50.00',
      vestuarioMochilas: '1 Mochila com 5 peças de roupa',
      observacaoPertences: 'Pertences conferidos, lacrados no envelope nº 104 e depositados no cofre central.',
      kitHigiene: true,
      enxovalLeito: true,
      vestuarioPadrao: true,
      crachaIdentificacao: true,
      pendenciaDocumental: 'Não',
      pendenciaJudicial: 'Não',
      cumpreMedidaAlternativa: 'Não',
      observacaoJuridica: 'Nenhuma restrição judicial. Acolhimento voluntário espontâneo.',
      alojamento: 'Bloco A - Restauração',
      leito: 'Leito A-108',
      termoMROSC: 'Termo de Fomento 014/2025 (SADS-BA)',
      contatoFamilia: ''
    });
    setActiveFormTab('pessoais');
  };

  const filteredAcolhidos = acolhidos.filter(item => {
    const matchesSearch = (
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cpf.includes(searchTerm) ||
      (item.municipioOrigem && item.municipioOrigem.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!matchesSearch) return false;

    if (filterTag === 'restricao') {
      return item.restricaoAlimentar && item.restricaoAlimentar !== 'Sem Restrição' && item.restricaoAlimentar !== 'Sem Restrições';
    }
    if (filterTag === 'meds') {
      return item.usoMedicamentoControlado && item.usoMedicamentoControlado.toLowerCase().includes('sim');
    }
    if (filterTag === 'fase1') {
      return !item.fasePrograma || item.fasePrograma.includes('Fase 1') || item.status === 'Em Triagem';
    }
    if (filterTag === 'fase2') {
      return item.fasePrograma && item.fasePrograma.includes('Fase 2');
    }
    if (filterTag === 'fase3') {
      return item.fasePrograma && item.fasePrograma.includes('Fase 3');
    }

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      

      
      {/* NOVO: NOVA ANAMNESE & ADMISSÃO VIEW (FORMULÁRIO EMBUTIDO DIRETO NA PÁGINA) */}
      {activeSubTab === 'novo' && (
        <>
          {/* Card de Título Independente */}
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid #ef4444' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-primary">Módulo 1 • Sub-aba 1.1</span>
                <span className="badge badge-danger">Admissão & Anamnese RDC 29</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0, fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={22} style={{ color: '#ef4444' }} /> Ficha de Anamnese Completa & Triagem Institucional
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Preencha os dados abaixo para concluir a admissão voluntária, alocação de leito e emissão de documento.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {onResetAcolhidos && (
                <button className="btn btn-danger btn-sm" onClick={onResetAcolhidos} title="Limpa todos os acolhidos cadastrados para iniciar do zero">
                  🗑️ Zerar Base ({acolhidos ? acolhidos.length : 0})
                </button>
              )}
              {onRestoreAcolhidos && (
                <button className="btn btn-secondary btn-sm" onClick={onRestoreAcolhidos} title="Restaurar dados de exemplo para demonstração">
                  🔄 Carregar Exemplo
                </button>
              )}
            </div>
          </div>

          {/* Card de Conteúdo da Tela Abaixo */}
          <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
            {renderAnamneseFormContent()}
          </div>
        </>
      )}

      {/* COFRE & PERTENCES VIEW */}
      {activeSubTab === 'cofre' && (
        <>
          {/* Card de Título Independente */}
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid #d97706' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-primary">Módulo 1 • Sub-aba 1.3</span>
                <span className="badge badge-warning">Cofre Central • Custódia de Bens</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0, fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={22} style={{ color: '#d97706' }} /> Gestão de Cofre & Pertences dos Acolhidos
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Controle rigoroso de invólucros lacrados, custódia de eletrônicos, documentos originais e valores de acolhidos.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {onResetAcolhidos && (
                <button className="btn btn-danger btn-sm" onClick={onResetAcolhidos} title="Zerar todos os acolhidos cadastrados para iniciar testes do zero">
                  🗑️ Zerar Base ({acolhidos ? acolhidos.length : 0})
                </button>
              )}
              {onRestoreAcolhidos && (
                <button className="btn btn-secondary btn-sm" onClick={onRestoreAcolhidos} title="Restaurar dados de exemplo para demonstração">
                  🔄 Carregar Exemplo
                </button>
              )}
            </div>
          </div>

          {/* Card de Conteúdo da Tela Abaixo */}
          <div className="card" style={{ borderLeft: '4px solid #d97706' }}>

          {/* BARRA DE FILTRO E BUSCA POR NOME DA GESTÃO DE COFRE */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <div style={{ position: 'relative', width: '380px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Buscar por nome do acolhido, CPF ou código FDJ..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px', paddingRight: '30px', height: '40px', fontSize: '0.85rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: '#e2e8f0', border: 'none', borderRadius: '50%', width: '20px', height: '20px', color: '#475569', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Limpar busca"
                >
                  ✕
                </button>
              )}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Exibindo <span style={{ color: '#d97706', fontWeight: 800, fontSize: '0.95rem' }}>{filteredAcolhidos.length}</span> de {acolhidos.length} Registros no Cofre
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Acolhido</th>
                  <th>Envelope Cofre</th>
                  <th>Smartphones & Eletrônicos Guardados</th>
                  <th>Documentos de Identificação</th>
                  <th>Valores em Dinheiro (R$)</th>
                  <th>Status do Lacre</th>
                </tr>
              </thead>
              <tbody>
                {filteredAcolhidos.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img 
                          src={item.foto} 
                          alt={item.nome} 
                          style={{ 
                            width: '42px', 
                            height: '42px', 
                            borderRadius: '50%', 
                            objectFit: 'cover', 
                            border: '2px solid var(--primary)',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            flexShrink: 0
                          }} 
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.nome}</div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-primary">Envelope nº 104-{item.id.replace('FDJ-', '')}</span></td>
                    <td style={{ fontSize: '0.8rem' }}>{item.celularEletronico || '1 Smartphone Samsung (Guardado no Cofre)'}</td>
                    <td style={{ fontSize: '0.8rem' }}>{item.documentosCofre || 'RG e CPF Originais'}</td>
                    <td style={{ fontWeight: 800, color: '#059669' }}>R$ {item.valorDinheiro || '50,00'}</td>
                    <td>
                      {cofreDevolucoes[item.id] ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <span className="badge badge-danger" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#dc2626', fontWeight: 800 }}>
                            🔓 Restituído no Desligamento ({cofreDevolucoes[item.id].dataHora})
                          </span>
                          <button 
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                            onClick={() => setSelectedDevolucaoTermo({ ...item, dataDevolucao: cofreDevolucoes[item.id].dataHora })}
                          >
                            <Printer size={12} /> Ver Recibo de Quitação
                          </button>
                        </div>
                      ) : (
                        <span className="badge badge-success" style={{ fontWeight: 700, padding: '0.4rem 0.75rem' }}>
                          🔒 Lacrado no Cofre Central (Custódia Ativa)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
      )}

      {/* TERMOS LEGAIS VIEW */}
      {activeSubTab === 'termos' && (
        <>
          {/* Card de Título Independente */}
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid #2563eb' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-primary">Módulo 1 • Sub-aba 1.4</span>
                <span className="badge badge-info">Documentação Jurídica & MROSC</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0, fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={22} style={{ color: '#2563eb' }} /> Termos Legais, Acolhimento Voluntário & LGPD
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Emissão e arquivamento eletrônico de declarações de voluntariado, ciência da família e termos regulamentares da SJDH-BA.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {onResetAcolhidos && (
                <button className="btn btn-danger btn-sm" onClick={onResetAcolhidos} title="Zerar todos os acolhidos cadastrados para iniciar testes do zero">
                  🗑️ Zerar Base ({acolhidos ? acolhidos.length : 0})
                </button>
              )}
              {onRestoreAcolhidos && (
                <button className="btn btn-secondary btn-sm" onClick={onRestoreAcolhidos} title="Restaurar dados de exemplo para demonstração">
                  🔄 Carregar Exemplo
                </button>
              )}
            </div>
          </div>

          {/* Card de Conteúdo da Tela Abaixo */}
          <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>

          {/* BARRA DE FILTRO E BUSCA POR NOME DOS TERMOS LEGAIS */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <div style={{ position: 'relative', width: '380px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Buscar por nome do acolhido, CPF ou código FDJ..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px', paddingRight: '30px', height: '40px', fontSize: '0.85rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: '#e2e8f0', border: 'none', borderRadius: '50%', width: '20px', height: '20px', color: '#475569', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Limpar busca"
                >
                  ✕
                </button>
              )}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Exibindo <span style={{ color: '#2563eb', fontWeight: 800, fontSize: '0.95rem' }}>{filteredAcolhidos.length}</span> de {acolhidos.length} Termos
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Acolhido</th>
                  <th>Termo de Acolhimento Voluntário</th>
                  <th>Ciência da Família & Regras Internas</th>
                  <th>Autorização Imagem & Saúde</th>
                  <th>Emissão de Vias</th>
                </tr>
              </thead>
              <tbody>
                {filteredAcolhidos.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img 
                          src={item.foto} 
                          alt={item.nome} 
                          style={{ 
                            width: '42px', 
                            height: '42px', 
                            borderRadius: '50%', 
                            objectFit: 'cover', 
                            border: '2px solid var(--primary)',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            flexShrink: 0
                          }} 
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.nome}</div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-success">Assinado Eletronicamente</span></td>
                    <td><span className="badge badge-success">Conforme RDC 29/ANVISA</span></td>
                    <td><span className="badge badge-info">Autorizado pela Família</span></td>
                    <td>
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => { setSelectedAcolhidoTermo(item); setTermoTipo('voluntario'); }}
                        style={{ fontSize: '0.725rem' }}
                      >
                        <Printer size={14} /> Imprimir Vias (PDF)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
      )}

      {(activeSubTab === 'lista' || !activeSubTab) && (
        <>
          {/* Top Header Controls */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid #059669' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="badge badge-primary">Módulo 1 • Sub-aba 1.2</span>
                <span className="badge badge-success">Consulta & Carteirinha QR Code</span>
              </div>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', margin: 0, fontWeight: 900 }}>
                Consulta de Acolhidos & Emissão de Crachá QR Code
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Gestão dos acolhidos cadastrados, triagem social (NIS/CadÚnico), alertas de dieta/saúde e impressão de carteirinhas.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {onResetAcolhidos && (
                <button className="btn btn-danger btn-sm" onClick={onResetAcolhidos} title="Zerar todos os acolhidos cadastrados para iniciar testes do zero">
                  🗑️ Zerar Base ({acolhidos ? acolhidos.length : 0})
                </button>
              )}
              {onRestoreAcolhidos && (
                <button className="btn btn-secondary btn-sm" onClick={onRestoreAcolhidos} title="Restaurar dados de exemplo para demonstração">
                  🔄 Carregar Exemplo
                </button>
              )}
            </div>
          </div>

      {/* Main Table Card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '340px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar por nome, CPF, código ou cidade..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span className="badge badge-success">
              {acolhidos.filter(a => a.status !== 'Alta Terapêutica').length} Ativos em Leito ({acolhidos.length} Cadastrados)
            </span>
            <span className="badge badge-primary">
              <IdCard size={12} /> {acolhidos.length} Crachás QR Code Gerados
            </span>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código / Acolhido</th>
                <th>Origem & CadÚnico/NIS</th>
                <th>Alerta Alimentar / Saúde</th>
                <th>Fase do Programa (PTI)</th>
                <th>Cofre & Kit</th>
                <th>Alojamento Alocado</th>
              </tr>
            </thead>
            <tbody>
              {filteredAcolhidos.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img 
                        src={item.foto} 
                        alt={item.nome} 
                        style={{ 
                          width: '42px', 
                          height: '42px', 
                          borderRadius: '50%', 
                          objectFit: 'cover', 
                          border: `2px solid ${item.status === 'Ativo' ? '#10b981' : item.status === 'Em Triagem' ? '#f59e0b' : '#ef4444'}` 
                        }} 
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.nome}</span>
                          
                          {item.status === 'Ativo' && (
                            <span className="badge badge-success" style={{ fontSize: '0.625rem', padding: '0.1rem 0.4rem', gap: '0.2rem' }}>
                              🟢 Ativo
                            </span>
                          )}

                          {item.status === 'Em Triagem' && (
                            <span className="badge badge-warning" style={{ fontSize: '0.625rem', padding: '0.1rem 0.4rem', gap: '0.2rem' }}>
                              🟡 Em Triagem
                            </span>
                          )}

                          {(item.status === 'Alta Terapêutica' || item.status === 'Desligado') && (
                            <span className="badge badge-danger" style={{ fontSize: '0.625rem', padding: '0.1rem 0.4rem', gap: '0.2rem' }}>
                              🔴 Alta Concluída
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {item.id} • CPF: {item.cpf}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{item.municipioOrigem}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--primary)', fontWeight: 500 }}>
                      <CreditCard size={12} style={{ display: 'inline', marginRight: '3px' }} />
                      NIS: {item.numeroNIS || '128.49012.88-0'} ({item.beneficioSocial || 'Bolsa Família'})
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${item.restricaoAlimentar && item.restricaoAlimentar !== 'Sem Restrição' && item.restricaoAlimentar !== 'Sem Restrições' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.7rem' }}>
                      <UtensilsCrossed size={12} /> {item.restricaoAlimentar || 'Sem Restrição'}
                    </span>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      PA: {item.pressaoArterial || '120x80'} • FC: {item.frequenciaCardiaca || '76'}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${item.fasePrograma?.includes('Fase 3') ? 'badge-success' : item.fasePrograma?.includes('Fase 2') ? 'badge-primary' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                      {item.fasePrograma || '🌱 Fase 1: Adaptação (1-3m)'}
                    </span>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {item.substanciaPrincipal || 'Dependência Química'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Lock size={12} style={{ color: 'var(--accent)' }} /> Envelope Cofre
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckSquare size={12} /> Kit Boas-Vindas Entregue
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--primary)' }}>{item.alojamento}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{item.leito}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

        </>
      )}

      {/* Modal: Advanced Anamnese & Admission Form */}
      {showFormModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '940px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>Ficha de Anamnese Completa & Triagem Institucional</h3>
              </div>
              <button onClick={() => setShowFormModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Form Navigation Tabs */}
            <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                type="button"
                className={`btn btn-sm ${activeFormTab === 'pessoais' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveFormTab('pessoais')}
              >
                1. Pessoais & Câmera
              </button>

              <button 
                type="button"
                className={`btn btn-sm ${activeFormTab === 'cadunico' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveFormTab('cadunico')}
              >
                2. CadÚnico & Social
              </button>

              <button 
                type="button"
                className={`btn btn-sm ${activeFormTab === 'familia' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveFormTab('familia')}
              >
                3. Rede Familiar
              </button>

              <button 
                type="button"
                className={`btn btn-sm ${activeFormTab === 'sinais_vitais' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveFormTab('sinais_vitais')}
              >
                4. Sinais Vitais & Dieta
              </button>

              <button 
                type="button"
                className={`btn btn-sm ${activeFormTab === 'dependencia' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveFormTab('dependencia')}
              >
                5. Dependência
              </button>

              <button 
                type="button"
                className={`btn btn-sm ${activeFormTab === 'saudemental' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveFormTab('saudemental')}
              >
                6. Saúde Mental
              </button>

              <button 
                type="button"
                className={`btn btn-sm ${activeFormTab === 'pertences' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveFormTab('pertences')}
              >
                7. Cofre & Pertences
              </button>

              <button 
                type="button"
                className={`btn btn-sm ${activeFormTab === 'kit_acolhimento' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveFormTab('kit_acolhimento')}
              >
                8. Kit Boas-Vindas
              </button>
            </div>

            <form onSubmit={handleSubmitNewAdmission}>
              {/* TAB 1: Dados Pessoais & Captura de Foto via Câmera */}
              {activeFormTab === 'pessoais' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Camera / Photo Capture Section */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-highlight)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={formData.foto} 
                        alt="Foto da Câmera" 
                        style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} 
                      />
                      <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--primary)', padding: '4px', borderRadius: '50%', color: '#fff' }}>
                        <Camera size={14} />
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Camera size={16} style={{ color: 'var(--primary)' }} /> Captura de Foto em Tempo Real (Câmera de Triagem)
                      </h4>
                      <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Selecione ou capture a imagem oficial do acolhido para o crachá e ficha clínica.
                      </p>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {sampleAvatars.map((av, idx) => (
                          <img 
                            key={idx} 
                            src={av} 
                            alt="Opção" 
                            onClick={() => setFormData({ ...formData, foto: av })}
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              border: formData.foto === av ? '2px solid var(--primary)' : '1px solid transparent',
                              opacity: formData.foto === av ? 1 : 0.6
                            }}
                          />
                        ))}
                        <input 
                          type="file" 
                          accept="image/*" 
                          ref={fileInputRef} 
                          style={{ display: 'none' }} 
                          onChange={handleImageUpload} 
                        />

                        <button 
                          type="button" 
                          className="btn btn-primary btn-sm" 
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          style={{ fontSize: '0.75rem', fontWeight: 700 }}
                        >
                          <Upload size={14} /> Carregar Foto do Computador
                        </button>

                        <button 
                          type="button" 
                          className="btn btn-outline btn-sm" 
                          onClick={handleSimulateCameraCapture}
                          style={{ fontSize: '0.75rem' }}
                        >
                          <Camera size={14} /> Capturar com Câmera
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Nome Completo *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        placeholder="Ex: Carlos Alberto dos Santos"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">CPF (Padrão Oficial 11 dígitos) *</label>
                      <input 
                        type="text" 
                        required 
                        maxLength={14}
                        className="form-input" 
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                      />
                    </div>
                  </div>

                  
                  {formData.municipioOrigem && formData.municipioOrigem.includes('Outro') && (
                    <div className="form-group" style={{ marginTop: '-0.5rem' }}>
                      <label className="form-label" style={{ color: '#2563eb', fontWeight: 700 }}>
                        Digite o Nome do Município / Cidade Personalizada:
                      </label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ex: Catu, Serrinha, Aracaju, Feira de Santana..."
                        value={formData.outroMunicipioCustom || ''}
                        onChange={(e) => setFormData({ ...formData, outroMunicipioCustom: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Data de Nascimento / Idade</label>
                      <input 
                        type="date" 
                        className="form-input" 
                        value={formData.dataNascimento}
                        onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nome da Mãe</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Nome da Mãe"
                        value={formData.nomeMae}
                        onChange={(e) => setFormData({ ...formData, nomeMae: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* DEDICATED OFFICIAL BRAZILIAN RG FIELDS */}
                  <div className="grid-3" style={{ gridTemplateColumns: '1.4fr 1fr 1fr' }}>
                    <div className="form-group">
                      <label className="form-label">Número do RG (8 a 10 dígitos) *</label>
                      <input 
                        type="text" 
                        maxLength={12}
                        className="form-input" 
                        placeholder="00.000.000-0"
                        value={formData.rgNumero || ''}
                        onChange={(e) => {
                          const formatted = formatRG(e.target.value);
                          setFormData({ 
                            ...formData, 
                            rgNumero: formatted, 
                            rg: `${formatted} ${formData.rgOrgaoEmissor || 'SSP'}/${formData.rgUF || 'BA'}` 
                          });
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Órgão Emissor *</label>
                      <select 
                        className="form-select"
                        value={formData.rgOrgaoEmissor || 'SSP'}
                        onChange={(e) => {
                          const newEmissor = e.target.value;
                          setFormData({ 
                            ...formData, 
                            rgOrgaoEmissor: newEmissor, 
                            rg: `${formData.rgNumero || ''} ${newEmissor}/${formData.rgUF || 'BA'}` 
                          });
                        }}
                      >
                        <option value="SSP">SSP (Segurança Pública)</option>
                        <option value="POLICIA CIVIL">Polícia Civil</option>
                        <option value="DETRAN">DETRAN</option>
                        <option value="IFP">IFP / Instituto Félix Pacheco</option>
                        <option value="ITEP">ITEP</option>
                        <option value="DPT">DPT (Perícia Técnica)</option>
                        <option value="Outro">Outro Órgão Emissor</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">UF do RG *</label>
                      <select 
                        className="form-select"
                        value={formData.rgUF || 'BA'}
                        onChange={(e) => {
                          const newUF = e.target.value;
                          setFormData({ 
                            ...formData, 
                            rgUF: newUF, 
                            rg: `${formData.rgNumero || ''} ${formData.rgOrgaoEmissor || 'SSP'}/${newUF}` 
                          });
                        }}
                      >
                        {ESTADOS_FEDERACAO.map((est) => (
                          <option key={est.sigla} value={est.sigla}>{est.sigla}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid-3" style={{ gridTemplateColumns: '1fr 1.5fr 1fr' }}>
                    <div className="form-group">
                      <label className="form-label">Estado de Origem (UF) *</label>
                      <select 
                        className="form-select"
                        value={formData.ufOrigem || 'BA'}
                        onChange={(e) => {
                          const newUF = e.target.value;
                          const estadoObj = ESTADOS_FEDERACAO.find(est => est.sigla === newUF);
                          const defaultCidade = estadoObj && estadoObj.cidades ? estadoObj.cidades[0] : '';
                          setFormData({ ...formData, ufOrigem: newUF, municipioOrigem: defaultCidade, outroMunicipioCustom: '' });
                        }}
                      >
                        {ESTADOS_FEDERACAO.map((est) => (
                          <option key={est.sigla} value={est.sigla}>{est.nome}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Município de Origem {loadingCidades ? '(Carregando IBGE...)' : `(${cidadesIBGE.length} Cidades IBGE)`} *
                      </label>
                      <select 
                        className="form-select"
                        value={formData.municipioOrigem}
                        onChange={(e) => setFormData({ ...formData, municipioOrigem: e.target.value })}
                        disabled={loadingCidades}
                      >
                        {cidadesIBGE.map((cidade, i) => (
                          <option key={i} value={cidade}>{cidade}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nome do Pai (opcional)</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Nome do Pai"
                        value={formData.nomePai || ''}
                        onChange={(e) => setFormData({ ...formData, nomePai: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="button" className="btn btn-primary" onClick={() => setActiveFormTab('cadunico')}>
                      Próximo: CadÚnico & Social <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Triagem Social & CadÚnico / NIS */}
              {activeFormTab === 'cadunico' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CreditCard size={18} /> Triagem Social, NIS & Programas Sociais
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Mapeamento de vulnerabilidade socioeconômica para acompanhamento do Serviço Social da Fundação Dr. Jesus.
                    </p>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Inscrição no CadÚnico?</label>
                      <select 
                        className="form-select"
                        value={formData.possuiCadUnico}
                        onChange={(e) => setFormData({ ...formData, possuiCadUnico: e.target.value })}
                      >
                        <option value="Sim">Sim (Possui NIS ativo)</option>
                        <option value="Não">Não (Necessita de inclusão no CadÚnico)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Número do NIS (Padrão Oficial 11 dígitos)</label>
                      <input 
                        type="text" 
                        maxLength={14}
                        className="form-input" 
                        placeholder="000.00000.00-0"
                        value={formData.numeroNIS}
                        onChange={(e) => setFormData({ ...formData, numeroNIS: formatNIS(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Benefício Social Recebido</label>
                      <select 
                        className="form-select"
                        value={formData.beneficioSocial}
                        onChange={(e) => setFormData({ ...formData, beneficioSocial: e.target.value })}
                      >
                        <option value="Bolsa Família">Bolsa Família</option>
                        <option value="BPC / LOAS">BPC / LOAS (Pessoa com Deficiência/Idoso)</option>
                        <option value="Auxílio Gás">Auxílio Gás</option>
                        <option value="Nenhum Benefício">Nenhum Benefício Social</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Situação de Moradia Prévia</label>
                      <select 
                        className="form-select"
                        value={formData.situacaoMoradiaPrevia}
                        onChange={(e) => setFormData({ ...formData, situacaoMoradiaPrevia: e.target.value })}
                      >
                        <option value="Em Situação de Rua (Subúrbio)">Em Situação de Rua (Subúrbio/Centro)</option>
                        <option value="Residência Familiar Cedida">Residência Familiar Cedida</option>
                        <option value="Aluguel Social / Próprio">Aluguel Social / Próprio</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setActiveFormTab('pessoais')}>
                      Anterior
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => setActiveFormTab('familia')}>
                      Próximo: Rede Familiar <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: Rede de Apoio Familiar */}
              {activeFormTab === 'familia' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Nome do Familiar Responsável *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ex: Maria das Graças dos Santos"
                        value={formData.nomeFamiliarResponsavel}
                        onChange={(e) => setFormData({ ...formData, nomeFamiliarResponsavel: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Grau de Parentesco</label>
                      <select 
                        className="form-select"
                        value={formData.parentescoFamiliar}
                        onChange={(e) => setFormData({ ...formData, parentescoFamiliar: e.target.value })}
                      >
                        <option value="Mãe">Mãe</option>
                        <option value="Pai">Pai</option>
                        <option value="Esposa / Cônjuge">Esposa / Cônjuge</option>
                        <option value="Irmão / Irmã">Irmão / Irmã</option>
                        <option value="Filho(a)">Filho(a)</option>
                        <option value="Tutor / Responsável Legal">Tutor / Responsável Legal</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Telefone WhatsApp do Familiar (DDD + Número) *</label>
                      <input 
                        type="text" 
                        maxLength={15}
                        className="form-input" 
                        placeholder="(71) 98842-1044"
                        value={formData.telefoneFamiliar}
                        onChange={(e) => setFormData({ ...formData, telefoneFamiliar: formatPhone(e.target.value) })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">CPF do Familiar Responsável</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="000.000.000-00"
                        value={formData.cpfFamiliar} maxLength={14} onChange={(e) => setFormData({ ...formData, cpfFamiliar: formatCPF(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setActiveFormTab('cadunico')}>
                      Anterior
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => setActiveFormTab('sinais_vitais')}>
                      Próximo: Sinais Vitais & Dieta <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: Sinais Vitais & Restrições Alimentares */}
              {activeFormTab === 'sinais_vitais' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: 'rgba(20, 184, 166, 0.08)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-highlight)', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <HeartPulse size={18} /> Triagem de Enfermagem & Dieta/Restrições Alimentares
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Verificação de sinais vitais e aviso direto para a Cozinha Industrial (Intolerâncias / Diabetes).
                    </p>
                  </div>

                  <div className="grid-4">
                    <div className="form-group">
                      <label className="form-label">Pressão Arterial (PA)</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="120x80 mmHg"
                        value={formData.pressaoArterial}
                        onChange={(e) => setFormData({ ...formData, pressaoArterial: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Frequência Cardíaca</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="76 bpm"
                        value={formData.frequenciaCardiaca}
                        onChange={(e) => setFormData({ ...formData, frequenciaCardiaca: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Glicemia Capilar</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="92 mg/dL"
                        value={formData.glicemia}
                        onChange={(e) => setFormData({ ...formData, glicemia: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Temperatura (°C)</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="36.5 °C"
                        value={formData.temperatura}
                        onChange={(e) => setFormData({ ...formData, temperatura: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Restrição Alimentar (Alerta Cozinha Industrial) *</label>
                      <select 
                        className="form-select"
                        value={formData.restricaoAlimentar}
                        onChange={(e) => setFormData({ ...formData, restricaoAlimentar: e.target.value })}
                      >
                        <option value="Sem Restrição (Dieta Geral)">Sem Restrição (Dieta Geral)</option>
                        <option value="Diabético (Sem Açúcar)">Diabético (Sem Açúcar)</option>
                        <option value="Intolerante a Lactose">Intolerante a Lactose</option>
                        <option value="Intolerante a Glúten (Celíaco)">Intolerante a Glúten (Celíaco)</option>
                        <option value="Hipertenso (Dieta Hipossódica)">Hipertenso (Dieta Hipossódica)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Alergias Conocidas (Alimentos ou Fármacos)</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ex: Alergia a frutos do mar, Dipirona"
                        value={formData.alergiasConhecidas}
                        onChange={(e) => setFormData({ ...formData, alergiasConhecidas: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setActiveFormTab('familia')}>
                      Anterior
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => setActiveFormTab('dependencia')}>
                      Próximo: Dependência Química <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: Anamnese de Dependência Química */}
              {activeFormTab === 'dependencia' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Substância Psicoativa Principal *</label>
                      <select 
                        className="form-select"
                        value={formData.substanciaPrincipal}
                        onChange={(e) => setFormData({ ...formData, substanciaPrincipal: e.target.value })}
                      >
                        <option value="Crack / Álcool">Crack / Álcool</option>
                        <option value="Álcool (Dependência Alcoólica)">Álcool (Dependência Alcoólica)</option>
                        <option value="Múltiplas (Álcool, Cocaína, Crack)">Múltiplas (Álcool, Cocaína, Crack)</option>
                        <option value="Cannabis / Outros">Cannabis / Outros</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tempo de Uso Continuado</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ex: 8 anos"
                        value={formData.tempoUsoContinuado}
                        onChange={(e) => setFormData({ ...formData, tempoUsoContinuado: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setActiveFormTab('sinais_vitais')}>
                      Anterior
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => setActiveFormTab('saudemental')}>
                      Próximo: Saúde Mental <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 6: Avaliação de Saúde Mental & Médica */}
              {activeFormTab === 'saudemental' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Diagnósticos Psiquiátricos / Psicológicos Prévios</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ex: Depressão, Ansiedade, Bipolaridade"
                        value={formData.diagnosticosPrevios}
                        onChange={(e) => setFormData({ ...formData, diagnosticosPrevios: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Uso de Medicamento Psiquiátrico Controlado</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ex: Sim (Diazepam 10mg / Haloperidol)"
                        value={formData.usoMedicamentoControlado}
                        onChange={(e) => setFormData({ ...formData, usoMedicamentoControlado: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setActiveFormTab('dependencia')}>
                      Anterior
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => setActiveFormTab('pertences')}>
                      Próximo: Cofre & Pertences <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 7: Inventário de Pertences & Custódia no Cofre */}
              {activeFormTab === 'pertences' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Aparelhos Eletrônicos / Smartphone</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ex: 1 Smartphone Samsung A14 com chip"
                        value={formData.celularEletronico}
                        onChange={(e) => setFormData({ ...formData, celularEletronico: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Documentos Originais Guardados no Cofre</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ex: RG, CPF e Carteira de Trabalho Originais"
                        value={formData.documentosCofre}
                        onChange={(e) => setFormData({ ...formData, documentosCofre: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setActiveFormTab('saudemental')}>
                      Anterior
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => setActiveFormTab('kit_acolhimento')}>
                      Próximo: Kit Boas-Vindas <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 8: Checklist do Kit de Acolhimento Entregue */}
              {activeFormTab === 'kit_acolhimento' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckSquare size={18} /> Checklist do Kit de Acolhimento & Boas-Vindas Entregue
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Confirmação da entrega gratuita dos insumos de uso pessoal e enxoval residencial da Fundação Dr. Jesus.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', background: 'rgba(15,23,42,0.4)', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.kitHigiene}
                        onChange={(e) => setFormData({ ...formData, kitHigiene: e.target.checked })}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Kit de Higiene Pessoal</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Sabonete, Creme Dental, Escova, Desodorante e Barbeador</div>
                      </div>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', background: 'rgba(15,23,42,0.4)', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.enxovalLeito}
                        onChange={(e) => setFormData({ ...formData, enxovalLeito: e.target.checked })}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Enxoval de Leito Residencial</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Lençol, Fronha, Travesseiro e Toalha de Banho</div>
                      </div>
                    </label>
                  </div>

                  <div className="grid-2" style={{ marginTop: '0.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Alojamento / Bloco Alocado *</label>
                      <select 
                        className="form-select"
                        value={formData.alojamento}
                        onChange={(e) => {
                          const novoBloco = e.target.value;
                          let prefix = 'A'; let start = 101;
                          if (novoBloco.includes('Bloco B')) { prefix = 'B'; start = 201; }
                          else if (novoBloco.includes('Bloco C')) { prefix = 'C'; start = 301; }
                          else if (novoBloco.includes('Bloco D')) { prefix = 'D'; start = 401; }
                          
                          const livres = [];
                          for (let i = 0; i < 25; i++) {
                            const bedCode = `Leito ${prefix}-${start + i}`;
                            const isOccupied = acolhidos.some(a => a.leito === bedCode && a.status !== 'Alta Terapêutica');
                            if (!isOccupied) livres.push(bedCode);
                          }
                          
                          setFormData({ 
                            ...formData, 
                            alojamento: novoBloco,
                            leito: livres[0] || ''
                          });
                        }}
                      >
                        <option value="Bloco A - Restauração">Bloco A - Restauração</option>
                        <option value="Bloco B - Renovação">Bloco B - Renovação</option>
                        <option value="Bloco C - Esperança">Bloco C - Esperança</option>
                        <option value="Bloco D - Graça">Bloco D - Graça</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Leito Alocado (Somente Leitos Livres)</label>
                      <select 
                        className="form-select"
                        value={formData.leito}
                        onChange={(e) => setFormData({ ...formData, leito: e.target.value })}
                      >
                        {(() => {
                          let prefix = 'A'; let start = 101;
                          if (formData.alojamento.includes('Bloco B')) { prefix = 'B'; start = 201; }
                          else if (formData.alojamento.includes('Bloco C')) { prefix = 'C'; start = 301; }
                          else if (formData.alojamento.includes('Bloco D')) { prefix = 'D'; start = 401; }
                          
                          const livres = [];
                          for (let i = 0; i < 25; i++) {
                            const bedCode = `Leito ${prefix}-${start + i}`;
                            const isOccupied = acolhidos.some(a => a.leito === bedCode && a.status !== 'Alta Terapêutica');
                            if (!isOccupied) livres.push(bedCode);
                          }
                          return livres.map(lCode => (
                            <option key={lCode} value={lCode}>{lCode} (Livre)</option>
                          ));
                        })()}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setActiveFormTab('pertences')}>
                      Anterior
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <CheckCircle size={18} /> Confirmar Acolhimento Completo & Alocar Leito
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Printable Legal Document Modals */}
      {selectedAcolhidoTermo && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '880px' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                <button 
                  className={`btn btn-sm ${termoTipo === 'cracha' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTermoTipo('cracha')}
                >
                  🪪 Crachá QR Code
                </button>

                <button 
                  className={`btn btn-sm ${termoTipo === 'voluntario' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTermoTipo('voluntario')}
                >
                  1. Termo Voluntário
                </button>

                <button 
                  className={`btn btn-sm ${termoTipo === 'regras' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTermoTipo('regras')}
                >
                  2. Regras Internas
                </button>

                <button 
                  className={`btn btn-sm ${termoTipo === 'custodia' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTermoTipo('custodia')}
                >
                  3. Recibo do Cofre
                </button>

                <button 
                  className={`btn btn-sm ${termoTipo === 'ficha_completa' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTermoTipo('ficha_completa')}
                >
                  4. Ficha Anamnese PDF
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={16} /> Imprimir / PDF
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedAcolhidoTermo(null)}>
                  <X size={16} /> Fechar
                </button>
              </div>
            </div>

            {/* DOCUMENT 0: Crachá Institucional de Identificação do Acolhido */}
            {termoTipo === 'cracha' && (
              <div className="printable-cracha-container" style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <div className="printable-cracha-card" style={{
                  width: '340px',
                  background: '#ffffff',
                  color: '#0f172a',
                  borderRadius: '16px',
                  border: '3px solid #0d9488',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {/* Badge Header */}
                  <div style={{
                    background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                    color: '#ffffff',
                    padding: '1rem 1rem 0.75rem 1rem',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                      FUNDAÇÃO DOUTOR JESUS
                    </h3>
                    <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
                      Comunidade Terapêutica • Candeias / BA
                    </p>
                    <div style={{
                      marginTop: '0.35rem',
                      display: 'inline-block',
                      background: 'rgba(255,255,255,0.2)',
                      padding: '0.15rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.65rem',
                      fontWeight: 700
                    }}>
                      CRACHÁ DE IDENTIFICAÇÃO DO ACOLHIDO
                    </div>
                  </div>

                  {/* Photo & Main Info */}
                  <div style={{ padding: '1.25rem', textAlign: 'center' }}>
                    <img 
                      src={selectedAcolhidoTermo.foto} 
                      alt={selectedAcolhidoTermo.nome} 
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '4px solid #0d9488',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        margin: '0 auto 0.75rem auto'
                      }}
                    />

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: '0.2rem' }}>
                      {selectedAcolhidoTermo.nome}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                      CPF: {selectedAcolhidoTermo.cpf}
                    </p>

                    {/* Location & Bed Tag */}
                    <div style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      margin: '0.85rem 0'
                    }}>
                      <div style={{ fontSize: '0.7rem', color: '#475569', textTransform: 'uppercase', fontWeight: 700 }}>
                        ALOJAMENTO / LEITO
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0d9488' }}>
                        {selectedAcolhidoTermo.alojamento}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                        {selectedAcolhidoTermo.leito}
                      </div>
                    </div>

                    {/* Real Dynamic High-Contrast Scannable QR Code */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      marginTop: '0.75rem'
                    }}>
                      <div style={{
                        width: '130px',
                        height: '130px',
                        background: '#ffffff',
                        border: '3px solid #0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        padding: '6px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}>
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=2&ecc=M&data=${encodeURIComponent(`https://www.singulariconsult.com.br/valida-acolhido?id=${selectedAcolhidoTermo.id}&nome=${encodeURIComponent(selectedAcolhidoTermo.nome)}&cpf=${encodeURIComponent(selectedAcolhidoTermo.cpf)}&leito=${encodeURIComponent(selectedAcolhidoTermo.leito)}`)}`}
                          alt={`QR Code ${selectedAcolhidoTermo.id}`}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }}
                        />
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#0f172a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {selectedAcolhidoTermo.id} • VALIDAÇÃO REFEITÓRIO / PORTARIA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            
            {/* DOCUMENT 1: Termo de Declaração de Acolhimento Voluntário */}
            {termoTipo === 'voluntario' && (
              <div className="printable-document" style={{ background: '#ffffff', color: '#0f172a', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
                {/* Header Institucional Unificado */}
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', pb: '1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                    FUNDAÇÃO DOUTOR JESUS
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, margin: '0.2rem 0' }}>
                    Comunidade Terapêutica de Acolhimento Voluntário e Gratuito • Candeias / Bahia
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: 700, margin: 0 }}>
                    MROSC BAHIA • LEI FEDERAL Nº 13.840/2019 • RESOLUÇÃO RDC 29/2011 ANVISA
                  </p>
                </div>

                {/* Document Banner */}
                <div style={{ background: '#0f172a', color: '#ffffff', textAlign: 'center', padding: '0.6rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                  TERMO DE DECLARAÇÃO DE ACOLHIMENTO VOLUNTÁRIO E GRATUITO
                </div>

                {/* Box de Identificação do Acolhido com Foto Oficial */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1.25rem' }}>
                  {selectedAcolhidoTermo.foto && (
                    <img 
                      src={selectedAcolhidoTermo.foto} 
                      alt={selectedAcolhidoTermo.nome} 
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid #0d9488',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        flexShrink: 0
                      }} 
                    />
                  )}
                  <div style={{ flexGrow: 1, fontSize: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    <div>
                      <p style={{ margin: '0.2rem 0' }}><strong>Acolhido:</strong> {selectedAcolhidoTermo.nome}</p>
                      <p style={{ margin: '0.2rem 0' }}><strong>CPF nº:</strong> {selectedAcolhidoTermo.cpf}</p>
                      <p style={{ margin: '0.2rem 0' }}><strong>RG nº:</strong> {selectedAcolhidoTermo.rg}</p>
                    </div>
                    <div>
                      <p style={{ margin: '0.2rem 0' }}><strong>Protocolo FDJ:</strong> {selectedAcolhidoTermo.id}</p>
                      <p style={{ margin: '0.2rem 0' }}><strong>Município de Origem:</strong> {selectedAcolhidoTermo.municipioOrigem} / {selectedAcolhidoTermo.ufOrigem || 'BA'}</p>
                      <p style={{ margin: '0.2rem 0' }}><strong>Alojamento / Leito:</strong> {selectedAcolhidoTermo.alojamento} ({selectedAcolhidoTermo.leito})</p>
                    </div>
                  </div>
                </div>

                {/* Cláusulas Legais Estruturadas */}
                <div style={{ fontSize: '0.875rem', lineHeight: '1.65', color: '#1e293b', textAlign: 'justify', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <p style={{ textIndent: '2rem' }}>
                    Pelo presente instrumento, eu, <strong>{selectedAcolhidoTermo.nome}</strong>, portador(a) do CPF nº <strong>{selectedAcolhidoTermo.cpf}</strong> e documento de identidade RG nº <strong>{selectedAcolhidoTermo.rg}</strong>, residente e domiciliado(a) originariamente no município de <strong>{selectedAcolhidoTermo.municipioOrigem}</strong>, solicito e declaro expressamente a minha admissão para <strong>ACOLHIMENTO TOTALMENTE VOLUNTÁRIO E GRATUITO</strong> nas dependências da <strong>FUNDAÇÃO DOUTOR JESUS</strong>.
                  </p>

                  <p>
                    <strong>CLÁUSULA 1ª - DA VOLUNTARIEDADE:</strong> Declaro para todos os fins de direito e nos termos da Lei Federal nº 13.840/2019 e da Resolução RDC 29 da ANVISA que meu acolhimento é fruto de livre escolha e espontânea vontade, estando plenamente consciente da natureza do programa terapêutico e das normas operacionais da instituição.
                  </p>

                  <p>
                    <strong>CLÁUSULA 2ª - DA GRATUIDADE:</strong> Atesto que o acolhimento é integralmente gratuito, não havendo cobrança de mensalidades, taxas de inscrição ou qualquer contraprestação financeira por parte da Fundação Doutor Jesus ou de seus representantes.
                  </p>

                  <p>
                    <strong>CLÁUSULA 3ª - DO DESLIGAMENTO ESPONTÂNEO:</strong> Fica assegurado o meu direito de solicitar a qualquer tempo o desligamento voluntário do programa acolhedor, mediante comunicação formal ao Serviço Social e acompanhamento da equipe de triagem.
                  </p>

                  <p>
                    <strong>CLÁUSULA 4ª - DA CUSTÓDIA DE PERTENCES:</strong> Entreguei espontaneamente no ato da admissão meus pertences pessoais de valor, eletrônicos e documentos para guarda e custódia no Cofre Central da instituição, sob comprovante/recibo.
                  </p>
                </div>

                {/* Data e Assinaturas */}
                <div style={{ marginTop: '2.5rem', paddingTop: '1rem' }}>
                  <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#475569', marginBottom: '2rem' }}>
                    Candeias / BA, {new Date().toLocaleDateString('pt-BR')}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '0.85rem' }}>
                    <div style={{ width: '45%' }}>
                      <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.5rem' }}>
                        <strong>{selectedAcolhidoTermo.nome}</strong><br />
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Assinatura do Acolhido Voluntário</span>
                      </div>
                    </div>

                    <div style={{ width: '45%' }}>
                      <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.5rem' }}>
                        <strong>Equipe de Triagem & Serviço Social</strong><br />
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Fundação Doutor Jesus (Candeias/BA)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT 2: Regras Internas & Compromisso de Convivência */}
            {termoTipo === 'regras' && (
              <div className="printable-document" style={{ background: '#ffffff', color: '#0f172a', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', pb: '1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    FUNDAÇÃO DOUTOR JESUS
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, margin: '0.2rem 0' }}>
                    Regulamento Interno de Convivência Comunitária e Disciplina Institucional
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: 700, margin: 0 }}>
                    ANEXO NORMATIVO INSTITUCIONAL • REGRAS CONVIVENCIAIS
                  </p>
                </div>

                <div style={{ background: '#0f172a', color: '#ffffff', textAlign: 'center', padding: '0.6rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                  TERMO DE CIÊNCIA E COMPROMISSO DAS REGRAS INTERNAS
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <p style={{ margin: '0.2rem 0' }}><strong>Acolhido:</strong> {selectedAcolhidoTermo.nome}</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>CPF nº:</strong> {selectedAcolhidoTermo.cpf}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0.2rem 0' }}><strong>Protocolo FDJ:</strong> {selectedAcolhidoTermo.id}</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>Alojamento / Leito:</strong> {selectedAcolhidoTermo.alojamento} ({selectedAcolhidoTermo.leito})</p>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#1e293b', textAlign: 'justify', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <p>
                    Eu, <strong>{selectedAcolhidoTermo.nome}</strong>, abaixo assinado, declaro ter sido orientado(a) e comprometo-me a cumprir integralmente as seguintes diretrizes de convivência da Fundação Doutor Jesus:
                  </p>
                  <p><strong>1. PROIBIÇÃO DE SUBSTÂNCIAS:</strong> É terminantemente proibida a entrada, posse ou uso de álcool, drogas ilícitas, substâncias tóxicas ou medicamentos sem receita médica nas dependências da instituição.</p>
                  <p><strong>2. RESPEITO E CONVIVÊNCIA PACÍFICA:</strong> Manter conduta de respeito mútuo, cordialidade e não violência com os demais acolhidos, monitores, corpo técnico e visitantes.</p>
                  <p><strong>3. HORÁRIOS E ROTINA:</strong> Cumprir rigorosamente os horários fixados para despertar, refeições, atividades terapêuticas, higienização do leito e recolhimento noturno.</p>
                  <p><strong>4. USO DO CRACHÁ:</strong> Utilizar obrigatoriamente o crachá de identificação com QR Code durante a circulação interna, acessos ao refeitório e chamadas de presença.</p>
                </div>

                <div style={{ marginTop: '2.5rem', paddingTop: '1rem' }}>
                  <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#475569', marginBottom: '2rem' }}>
                    Candeias / BA, {new Date().toLocaleDateString('pt-BR')}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '0.85rem' }}>
                    <div style={{ width: '45%' }}>
                      <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.5rem' }}>
                        <strong>{selectedAcolhidoTermo.nome}</strong><br />
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Assinatura do Acolhido</span>
                      </div>
                    </div>
                    <div style={{ width: '45%' }}>
                      <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.5rem' }}>
                        <strong>Monitoria & Coordenação Interna</strong><br />
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Fundação Doutor Jesus</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT 3: Termo de Custódia de Pertences e Recibo do Cofre */}
            {termoTipo === 'custodia' && (
              <div className="printable-document" style={{ background: '#ffffff', color: '#0f172a', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', pb: '1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    FUNDAÇÃO DOUTOR JESUS
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, margin: '0.2rem 0' }}>
                    Gestão de Cofre Central & Custódia Institucional de Bens
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: 700, margin: 0 }}>
                    RECIBO COMPROBATÓRIO DE GUARDA E FIEL DEPOSITÁRIO
                  </p>
                </div>

                <div style={{ background: '#0f172a', color: '#ffffff', textAlign: 'center', padding: '0.6rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                  RECIBO INSTITUCIONAL DE CUSTÓDIA DE BENS E DOCUMENTOS
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <p style={{ margin: '0.2rem 0' }}><strong>Acolhido:</strong> {selectedAcolhidoTermo.nome}</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>CPF nº:</strong> {selectedAcolhidoTermo.cpf}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0.2rem 0' }}><strong>Protocolo FDJ:</strong> {selectedAcolhidoTermo.id}</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>Envelope Lacrado nº:</strong> {selectedAcolhidoTermo.id ? selectedAcolhidoTermo.id.replace('FDJ-2026-', 'ENV-') : 'ENV-104'}</p>
                  </div>
                </div>

                <div style={{ fontSize: '0.875rem', lineHeight: '1.65', color: '#1e293b', textAlign: 'justify', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <p style={{ textIndent: '2rem' }}>
                    Atestamos que no ato da triagem de admissão do acolhido voluntário <strong>{selectedAcolhidoTermo.nome}</strong>, deram entrada e foram devidamente conferidos e custodiados sob a responsabilidade do <strong>Cofre Central da Fundação Doutor Jesus</strong> os seguintes pertences:
                  </p>
                  
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '1rem', fontSize: '0.85rem' }}>
                    <p style={{ margin: '0.35rem 0' }}>• <strong>Aparelho Celular / Eletrônicos:</strong> {selectedAcolhidoTermo.celularEletronico || '1 Smartphone Samsung (Guardado no Cofre)'}</p>
                    <p style={{ margin: '0.35rem 0' }}>• <strong>Documentos Pessoais:</strong> {selectedAcolhidoTermo.documentosCofre || 'RG e CPF Originais'}</p>
                    <p style={{ margin: '0.35rem 0' }}>• <strong>Valor em Espécie:</strong> R$ {selectedAcolhidoTermo.valorDinheiro || '50,00'}</p>
                    <p style={{ margin: '0.35rem 0' }}>• <strong>Vestuário & Bagagem:</strong> {selectedAcolhidoTermo.vestuarioMochilas || '1 Mochila com pertences pessoais'}</p>
                    <p style={{ margin: '0.35rem 0' }}>• <strong>Observações:</strong> {selectedAcolhidoTermo.observacaoPertences || 'Pertences conferidos na presença do acolhido e lacrados no envelope oficial.'}</p>
                  </div>
                </div>

                <div style={{ marginTop: '2.5rem', paddingTop: '1rem' }}>
                  <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#475569', marginBottom: '2rem' }}>
                    Candeias / BA, {new Date().toLocaleDateString('pt-BR')}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '0.85rem' }}>
                    <div style={{ width: '45%' }}>
                      <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.5rem' }}>
                        <strong>{selectedAcolhidoTermo.nome}</strong><br />
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Assinatura do Acolhido</span>
                      </div>
                    </div>
                    <div style={{ width: '45%' }}>
                      <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.5rem' }}>
                        <strong>Fiel Depositário / Cofre Central</strong><br />
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Fundação Doutor Jesus</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT 4: Ficha Completa de Anamnese & Triagem Consolidada */}
            {termoTipo === 'ficha_completa' && (
              <div className="printable-document" style={{ background: '#ffffff', color: '#0f172a', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', pb: '1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    FUNDAÇÃO DOUTOR JESUS
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, margin: '0.2rem 0' }}>
                    Ficha Clínico-Social de Anamnese & Triagem Multidimensional
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: 700, margin: 0 }}>
                    PRONTUÁRIO INSTITUCIONAL DO ACOLHIDO • MROSC BAHIA
                  </p>
                </div>

                <div style={{ background: '#0f172a', color: '#ffffff', textAlign: 'center', padding: '0.6rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                  RELATÓRIO DE ANAMNESE E ALOCAÇÃO DE LEITO
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <p style={{ margin: '0.3rem 0' }}><strong>Acolhido:</strong> {selectedAcolhidoTermo.nome}</p>
                    <p style={{ margin: '0.3rem 0' }}><strong>CPF:</strong> {selectedAcolhidoTermo.cpf} | <strong>RG:</strong> {selectedAcolhidoTermo.rg}</p>
                    <p style={{ margin: '0.3rem 0' }}><strong>Origem:</strong> {selectedAcolhidoTermo.municipioOrigem} / {selectedAcolhidoTermo.ufOrigem || 'BA'}</p>
                    <p style={{ margin: '0.3rem 0' }}><strong>CadÚnico / NIS:</strong> {selectedAcolhidoTermo.numeroNIS || '128.49012.88-0'}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0.3rem 0' }}><strong>Código FDJ:</strong> {selectedAcolhidoTermo.id}</p>
                    <p style={{ margin: '0.3rem 0' }}><strong>Data Admissão:</strong> {selectedAcolhidoTermo.dataEntrada}</p>
                    <p style={{ margin: '0.3rem 0' }}><strong>Leito Alocado:</strong> {selectedAcolhidoTermo.alojamento} ({selectedAcolhidoTermo.leito})</p>
                    <p style={{ margin: '0.3rem 0' }}><strong>Benefício Social:</strong> {selectedAcolhidoTermo.beneficioSocial || 'Bolsa Família'}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
                  <div style={{ border: '1px solid #cbd5e1', padding: '0.85rem', borderRadius: '6px' }}>
                    <p style={{ fontWeight: 800, color: '#0d9488', margin: '0 0 0.35rem 0' }}>1. SINAIS VITAIS DE ENTRADA & DIETA:</p>
                    <p style={{ margin: '0.2rem 0' }}>Pressão Arterial: <strong>{selectedAcolhidoTermo.pressaoArterial || '120x80'} mmHg</strong> | Frequência Cardíaca: <strong>{selectedAcolhidoTermo.frequenciaCardiaca || '76'} bpm</strong> | Temp: <strong>{selectedAcolhidoTermo.temperatura || '36.5'}°C</strong></p>
                    <p style={{ margin: '0.2rem 0' }}>Restrição Alimentar / Alergias: <strong>{selectedAcolhidoTermo.restricaoAlimentar || 'Sem Restrições'}</strong></p>
                  </div>

                  <div style={{ border: '1px solid #cbd5e1', padding: '0.85rem', borderRadius: '6px' }}>
                    <p style={{ fontWeight: 800, color: '#0d9488', margin: '0 0 0.35rem 0' }}>2. CUSTÓDIA DE BENS & ENXOVAL ENTREGUE:</p>
                    <p style={{ margin: '0.2rem 0' }}>Pertences em Cofre: <strong>{selectedAcolhidoTermo.celularEletronico || 'Smartphone e documentos originais em envelope lacrado.'}</strong></p>
                    <p style={{ margin: '0.2rem 0' }}>Kit Acolhimento: <strong>Kit Higiene, Enxoval de Leito, Vestuário Padrão FDJ e Crachá QR Code entregues.</strong></p>
                  </div>
                </div>

                <div style={{ marginTop: '2.5rem', paddingTop: '1rem' }}>
                  <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#475569', marginBottom: '2rem' }}>
                    Candeias / BA, {new Date().toLocaleDateString('pt-BR')}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '0.85rem' }}>
                    <div style={{ width: '45%' }}>
                      <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.5rem' }}>
                        <strong>Serviço Social / Psicologia</strong><br />
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Avaliador Responsável</span>
                      </div>
                    </div>
                    <div style={{ width: '45%' }}>
                      <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.5rem' }}>
                        <strong>Coordenação de Admissão</strong><br />
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Fundação Doutor Jesus</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    
      {/* Modal: Termo de Restituição & Quitação de Pertences do Cofre */}
      {selectedDevolucaoTermo && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '820px' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={20} style={{ color: '#dc2626' }} /> Termo de Restituição & Quitação de Cofre Central
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={16} /> Imprimir Recibo / PDF
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedDevolucaoTermo(null)}>
                  <X size={16} /> Fechar
                </button>
              </div>
            </div>

            <div className="printable-document" style={{ background: '#ffffff', color: '#0f172a', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
              {/* Header Institucional Unificado */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', pb: '1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  FUNDAÇÃO DOUTOR JESUS
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, margin: '0.2rem 0' }}>
                  Gestão de Cofre Central & Custódia Institucional de Bens
                </p>
                <p style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 800, margin: 0 }}>
                  TERMO OFICIAL DE RESTITUIÇÃO DE BENS & QUITAÇÃO DE CUSTÓDIA
                </p>
              </div>

              {/* Document Banner */}
              <div style={{ background: '#dc2626', color: '#ffffff', textAlign: 'center', padding: '0.6rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                RECIBO DE RESTITUIÇÃO E QUITAÇÃO DEFINITIVA DE PERTENCES
              </div>

              {/* Box de Identificação do Acolhido com Foto Oficial */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1.25rem' }}>
                {selectedDevolucaoTermo.foto && (
                  <img 
                    src={selectedDevolucaoTermo.foto} 
                    alt={selectedDevolucaoTermo.nome} 
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #dc2626',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      flexShrink: 0
                    }} 
                  />
                )}
                <div style={{ flexGrow: 1, fontSize: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                  <div>
                    <p style={{ margin: '0.2rem 0' }}><strong>Acolhido:</strong> {selectedDevolucaoTermo.nome}</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>CPF nº:</strong> {selectedDevolucaoTermo.cpf}</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>RG nº:</strong> {selectedDevolucaoTermo.rg}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0.2rem 0' }}><strong>Protocolo FDJ:</strong> {selectedDevolucaoTermo.id}</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>Origem:</strong> {selectedDevolucaoTermo.municipioOrigem} / {selectedDevolucaoTermo.ufOrigem || 'BA'}</p>
                    <p style={{ margin: '0.2rem 0' }}><strong>Data/Hora Devolução:</strong> {selectedDevolucaoTermo.dataDevolucao || new Date().toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.875rem', lineHeight: '1.65', color: '#1e293b', textAlign: 'justify', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <p style={{ textIndent: '2rem' }}>
                  Declaramos que no ato da saída/desligamento do acolhido <strong>{selectedDevolucaoTermo.nome}</strong> (CPF nº <strong>{selectedDevolucaoTermo.cpf}</strong>), deram baixa no Cofre Central e foram integralmente devolvidos os seguintes pertences custodiados sob o Envelope nº <strong>104-{selectedDevolucaoTermo.id.replace('FDJ-', '')}</strong>:
                </p>

                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '1rem', fontSize: '0.85rem' }}>
                  <p style={{ margin: '0.35rem 0' }}>• <strong>Eletrônicos / Aparelho Celular:</strong> {selectedDevolucaoTermo.celularEletronico || '1 Smartphone Samsung (Conferido e Devolvido)'}</p>
                  <p style={{ margin: '0.35rem 0' }}>• <strong>Documentos Originais:</strong> {selectedDevolucaoTermo.documentosCofre || 'RG e CPF Originais (Entregues)'}</p>
                  <p style={{ margin: '0.35rem 0' }}>• <strong>Valor em Espécie:</strong> R$ {selectedDevolucaoTermo.valorDinheiro || '50,00'} (Restituído na íntegra)</p>
                  <p style={{ margin: '0.35rem 0' }}>• <strong>Bagagem / Pertences Pessoais:</strong> {selectedDevolucaoTermo.vestuarioMochilas || 'Mochila com roupas pessoais'}</p>
                </div>

                <p style={{ fontWeight: 700, color: '#0f172a' }}>
                  DECLARAÇÃO DE QUITAÇÃO DO ACOLHIDO:
                </p>
                <p style={{ textIndent: '2rem' }}>
                  "Declaro ter conferido e recebido em perfeito estado de conservação a totalidade dos meus pertences, documentos e valores depositados sob a custódia da <strong>FUNDAÇÃO DOUTOR JESUS</strong>, dando <strong>PLENA, IRREVOGÁVEL E GERAL QUITAÇÃO</strong> à instituição e seus prepostos quanto aos bens custodiados, nada mais tendo a reclamar a qualquer tempo."
                </p>
              </div>

              <div style={{ marginTop: '2.5rem', paddingTop: '1rem' }}>
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#475569', marginBottom: '2rem' }}>
                  Candeias / BA, {new Date().toLocaleDateString('pt-BR')}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '0.85rem' }}>
                  <div style={{ width: '45%' }}>
                    <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.5rem' }}>
                      <strong>{selectedDevolucaoTermo.nome}</strong><br />
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Assinatura do Acolhido (Recebedor)</span>
                    </div>
                  </div>
                  <div style={{ width: '45%' }}>
                    <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.5rem' }}>
                      <strong>Fiel Depositário / Cofre Central</strong><br />
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Fundação Doutor Jesus</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Crachá Institucional de Identificação do Acolhido com QR Code */}
      {selectedCrachaAcolhido && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px', padding: '1.5rem' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IdCard size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>Crachá Institucional PVC</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={14} /> Imprimir Crachá / PDF
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedCrachaAcolhido(null)}>
                  <X size={16} /> Fechar
                </button>
              </div>
            </div>

            {/* Crachá PVC Layout (Padrão 85mm x 54mm na impressão) */}
            <div className="printable-document" style={{ display: 'flex', justifyContent: 'center', margin: '0 auto' }}>
              <div style={{ 
                width: '340px', 
                minHeight: '480px', 
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', 
                border: '2px solid #0f172a', 
                borderRadius: '16px', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)', 
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}>
                {/* Top Header Banner */}
                <div style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', color: '#ffffff', textAlign: 'center', padding: '1rem 0.5rem 0.75rem 0.5rem' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 800 }}>MROSC • SJDH / BAHIA</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '0.02em', marginTop: '2px' }}>FUNDAÇÃO DOUTOR JESUS</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.9, marginTop: '2px' }}>Comunidade Terapêutica Candeias - BA</div>
                </div>

                {/* Photo & Badge */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.25rem 1rem 0.75rem 1rem' }}>
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={selectedCrachaAcolhido.foto} 
                      alt={selectedCrachaAcolhido.nome} 
                      style={{ 
                        width: '110px', 
                        height: '110px', 
                        borderRadius: '50%', 
                        objectFit: 'cover', 
                        border: '4px solid #dc2626',
                        boxShadow: '0 4px 12px rgba(220,38,38,0.25)' 
                      }} 
                    />
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '-6px', 
                      left: '50%', 
                      transform: 'translateX(-50%)', 
                      background: '#059669', 
                      color: '#ffffff', 
                      fontSize: '0.65rem', 
                      fontWeight: 800, 
                      padding: '0.15rem 0.6rem', 
                      borderRadius: '12px',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}>
                      ACOLHIDO ATIVO
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: '0.85rem 0 2px 0', textAlign: 'center', lineHeight: '1.25' }}>
                    {selectedCrachaAcolhido.nome}
                  </h3>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#dc2626', background: '#fee2e2', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    Código: {selectedCrachaAcolhido.id}
                  </span>
                </div>

                {/* Info Fields & Dieta Highlight */}
                <div style={{ padding: '0 1.25rem', fontSize: '0.775rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px border #e2e8f0', paddingBottom: '4px' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>CPF:</span>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>{selectedCrachaAcolhido.cpf}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px border #e2e8f0', paddingBottom: '4px' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Leito Alocado:</span>
                    <span style={{ fontWeight: 800, color: '#2563eb' }}>{selectedCrachaAcolhido.alojamento} ({selectedCrachaAcolhido.leito})</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px border #e2e8f0', paddingBottom: '4px' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Fase PTI:</span>
                    <span style={{ fontWeight: 800, color: '#059669' }}>{selectedCrachaAcolhido.fasePrograma || '🌱 Fase 1 (Adaptação)'}</span>
                  </div>

                  {/* Alerta Alimentar Destacado */}
                  <div style={{ 
                    background: selectedCrachaAcolhido.restricaoAlimentar && selectedCrachaAcolhido.restricaoAlimentar !== 'Sem Restrição' && selectedCrachaAcolhido.restricaoAlimentar !== 'Sem Restrições' ? '#fef3c7' : '#ecfdf5',
                    border: `1px solid ${selectedCrachaAcolhido.restricaoAlimentar && selectedCrachaAcolhido.restricaoAlimentar !== 'Sem Restrição' && selectedCrachaAcolhido.restricaoAlimentar !== 'Sem Restrições' ? '#f59e0b' : '#10b981'}`,
                    borderRadius: '6px',
                    padding: '0.4rem 0.6rem',
                    textAlign: 'center',
                    marginTop: '4px'
                  }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 800, color: selectedCrachaAcolhido.restricaoAlimentar && selectedCrachaAcolhido.restricaoAlimentar !== 'Sem Restrição' && selectedCrachaAcolhido.restricaoAlimentar !== 'Sem Restrições' ? '#b45309' : '#047857' }}>
                      ⚠️ ALERTA DE DIETA & SAÚDE:
                    </span>
                    <div style={{ fontSize: '0.775rem', fontWeight: 800, color: selectedCrachaAcolhido.restricaoAlimentar && selectedCrachaAcolhido.restricaoAlimentar !== 'Sem Restrição' && selectedCrachaAcolhido.restricaoAlimentar !== 'Sem Restrições' ? '#92400e' : '#065f46' }}>
                      {selectedCrachaAcolhido.restricaoAlimentar || 'Sem Restrições Alimentares'}
                    </div>
                  </div>
                </div>

                {/* Footer QR Code & Barcode */}
                <div style={{ marginTop: 'auto', background: '#0f172a', color: '#ffffff', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.8 }}>Validação de Acesso</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em' }}>FDJ-{selectedCrachaAcolhido.id.replace('FDJ-', '')}</div>
                  </div>
                  <div style={{ background: '#ffffff', padding: '4px', borderRadius: '4px' }}>
                    <QrCode size={40} style={{ color: '#0f172a', display: 'block' }} />
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
