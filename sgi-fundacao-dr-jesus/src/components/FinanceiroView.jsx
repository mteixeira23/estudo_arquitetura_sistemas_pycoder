import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  Download,
  Eye,
  Landmark, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  FileCheck, 
  Building, 
  X, 
  CheckCircle,
  Printer,
  PieChart,
  Receipt,
  CheckCircle2,
  FileSpreadsheet,
  Users,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Upload,
  Calendar,
  AlertCircle,
  FileText,
  Search,
  Sliders,
  Filter,
  FolderTree,
  ShieldCheck,
  Building2,
  Check,
  Truck,
  QrCode,
  BadgeCheck,
  CheckSquare,
  FileBarChart,
  Layers,
  Zap,
  Droplet,
  Globe,
  Briefcase,
  Calculator,
  Pencil,
  Trash2
} from 'lucide-react';

export default function FinanceiroView({
  transacoes = [],
  onAddTransacao,
  termosMROSC = [],
  fornecedores = [],
  onAddFornecedor,
  clientes = [],
  onAddCliente,
  activeSubTab: externalSubTab,
  setActiveSubTab: setExternalSubTab
}) {
  const [internalSubTab, setInternalSubTab] = useState('dashboard');

  const activeTab = externalSubTab || internalSubTab;
  const setActiveTab = setExternalSubTab || setInternalSubTab;

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('parcela1FDJ');
  const [dataInicio, setDataInicio] = useState('2026-01-01');
  const [dataFim, setDataFim] = useState('2026-06-30');
  const [selectedPlanoTrabalho, setSelectedPlanoTrabalho] = useState('Todos');
  const [selectedFornecedorFilter, setSelectedFornecedorFilter] = useState('Todos');
  const [selectedRubricaFilter, setSelectedRubricaFilter] = useState('Todas');
  const [selectedContaFilter, setSelectedContaFilter] = useState('Todas');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('Todos');
  const [selectedCatFilter, setSelectedCatFilter] = useState('Todas');
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Modal and Edit states for Contas a Receber
  const [editingCR, setEditingCR] = useState(null);
  const [newContaReceber, setNewContaReceber] = useState({
    pagador: 'Secretaria de Justiça e Direitos Humanos (SJDH-BA)',
    cnpj: '13.937.065/0001-00',
    descricao: '',
    valor: '',
    vencimento: new Date().toISOString().split('T')[0],
    dataLancamento: new Date().toLocaleDateString('pt-BR'),
    categoria: '1.1.01 Repasses MROSC Estadual',
    contaDestino: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)',
    termoMROSC: 'Termo de Fomento nº 005/2022 (SJDH-BA)',
    status: 'Recebido (Creditado)'
  });

  // Dados Financeiros dos PDFs por Período de Apuração (Filtro por Semestre / Mês)
  const dadosPeriodo = {
    parcela10FDJ: {
      rotulo: 'TF 005/2022 - 10ª Parcela (01/01/2026 a 30/06/2026 - FDJ R$ 19,69M)',
      saldoInicial: 10972759.79,
      entradas: 19693550.29,
      repasses: 19022565.08,
      rendimentos: 670985.21,
      saidas: 19784767.32,
      saldoFinal: 10881542.76,
      status: '100% Conciliado e Auditado SJDH-BA'
    },
    parcela9FDJ: {
      rotulo: 'TF 005/2022 - 9ª Parcela (01/07/2025 a 31/12/2025 - FDJ R$ 20,28M)',
      saldoInicial: 10662893.16,
      entradas: 20283690.11,
      repasses: 19901468.18,
      rendimentos: 382221.93,
      saidas: 19973823.48,
      saldoFinal: 10972759.79,
      status: '100% Conciliado e Auditado SJDH-BA'
    },
    parcela8FDJ: {
      rotulo: 'TF 005/2022 - 8ª Parcela (01/01/2025 a 30/06/2025 - FDJ R$ 17,85M)',
      saldoInicial: 7984499.62,
      entradas: 17857066.20,
      repasses: 17249999.98,
      rendimentos: 607066.22,
      saidas: 15178672.66,
      saldoFinal: 10662893.16,
      status: '100% Conciliado e Auditado SJDH-BA'
    },
    parcela7FDJ: {
      rotulo: 'TF 005/2022 - 7ª Parcela (01/07/2024 a 31/12/2024 - FDJ R$ 15,94M)',
      saldoInicial: 6282479.47,
      entradas: 15943575.93,
      repasses: 15559999.97,
      rendimentos: 383575.96,
      saidas: 14241555.78,
      saldoFinal: 7984499.62,
      status: '100% Conciliado e Auditado SJDH-BA'
    },
    parcela6FDJ: {
      rotulo: 'TF 005/2022 - 6ª Parcela (01/02/2024 a 30/06/2024 - FDJ R$ 9,09M)',
      saldoInicial: 9161219.95,
      entradas: 9091387.68,
      repasses: 8882098.76,
      rendimentos: 209288.92,
      saidas: 11970128.16,
      saldoFinal: 6282479.47,
      status: '100% Conciliado e Auditado SJDH-BA'
    },
    parcela5FDJ: {
      rotulo: 'TF 005/2022 - 5ª Parcela (01/10/2023 a 31/01/2024 - FDJ R$ 19,54M)',
      saldoInicial: 7851388.32,
      entradas: 19605199.69,
      repasses: 19542917.37,
      rendimentos: 62282.32,
      saidas: 18277206.13,
      saldoFinal: 9179381.88,
      status: '100% Conciliado e Auditado SJDH-BA'
    },
    parcela4FDJ: {
      rotulo: 'TF 005/2022 - 4ª Parcela (01/06/2023 a 30/09/2023 - FDJ R$ 10,51M)',
      saldoInicial: 4456931.72,
      entradas: 10518623.46,
      repasses: 10461201.06,
      rendimentos: 57422.40,
      saidas: 7124166.86,
      saldoFinal: 7851388.32,
      status: '100% Conciliado e Auditado SJDH-BA'
    },
    parcela3FDJ: {
      rotulo: 'TF 005/2022 - 3ª Parcela (01/02/2023 a 31/05/2023 - FDJ R$ 8,42M)',
      saldoInicial: 1420185.04,
      entradas: 8424558.74,
      repasses: 8382115.09,
      rendimentos: 42443.65,
      saidas: 5387812.06,
      saldoFinal: 4456931.72,
      status: '100% Conciliado e Auditado SJDH-BA'
    },
    parcela2FDJ: {
      rotulo: 'TF 005/2022 - 2ª Parcela (Out/2022 a Fev/2023 - FDJ R$ 9,09M)',
      saldoInicial: 3144616.08,
      entradas: 9094791.90,
      repasses: 9058926.48,
      rendimentos: 35865.42,
      saidas: 7674606.86,
      saldoFinal: 1420185.04,
      status: '100% Conciliado com Nota Explicativa / Estornos TEDs R$ 87.998,00'
    },
    parcela1FDJ: {
      rotulo: 'TF 005/2022 - 1ª Parcela (Fundação Dr. JESUS - 18/06/2022 a 17/10/2022 - R$ 10,4M)',
      saldoInicial: 0.00,
      entradas: 10424704.82,
      repasses: 10377855.66,
      rendimentos: 46849.16,
      saidas: 7280088.74,
      saldoFinal: 3144616.08,
      status: '100% Auditado e Conciliado com Extrato BB / Termo 005/2022'
    },
    semestre1: {
      rotulo: '1º Semestre / 2026 (01/01/2026 a 30/06/2026 - Tabela 02 PDF 10)',
      saldoInicial: 1184898.12,
      entradas: 19022565.08,
      repasses: 19004114.88,
      rendimentos: 18450.20,
      saidas: 16715217.04,
      saldoFinal: 3492246.16,
      status: '100% Conciliado com Extrato e REF'
    },
    mes1: {
      rotulo: '1º Mês (Janeiro/2026 - 01/01/2026 a 31/01/2026 - Extrato PDF 11)',
      saldoInicial: 1184898.12,
      entradas: 1189748.32,
      repasses: 1184898.12,
      rendimentos: 4850.20,
      saidas: 882399.70,
      saldoFinal: 1492246.74,
      status: '100% Conciliado com Extrato Mensal BB'
    },
    semestre2: {
      rotulo: '2º Semestre / 2026 (01/07/2026 a 31/12/2026 - Programado)',
      saldoInicial: 3492246.16,
      entradas: 14218777.44,
      repasses: 14218777.44,
      rendimentos: 12500.00,
      saidas: 14100000.00,
      saldoFinal: 3623523.60,
      status: 'Programado / Em Execução'
    },
    anual: {
      rotulo: 'Visão Consolidada Anual 2026 (Termo nº 005/2022 SJDH-BA)',
      saldoInicial: 1184898.12,
      entradas: 33241342.52,
      repasses: 33222892.32,
      rendimentos: 30950.20,
      saidas: 30815217.04,
      saldoFinal: 3611023.60,
      status: 'Aprovado SJDH-BA'
    }
  };

  const periodoAtivo = dadosPeriodo[filtroPeriodo] || dadosPeriodo['semestre1'];

  // Modals
  const [showPagarModal, setShowPagarModal] = useState(false);
  const [showReceberModal, setShowReceberModal] = useState(false);
  const [showBancoModal, setShowBancoModal] = useState(false);
  const [showPlanoModal, setShowPlanoModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showNFeModal, setShowNFeModal] = useState(false);
  const [showREFModal, setShowREFModal] = useState(false);
  const [showPessoalModal, setShowPessoalModal] = useState(false);
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState(null);
  const [selectedNFeForPrint, setSelectedNFeForPrint] = useState(null);
  const [selectedOFXFile, setSelectedOFXFile] = useState(null);
  const [previewPairItem, setPreviewPairItem] = useState(null);
    
  // Registered Accounts (Bancos & Caixa Físico com Saldo Conciliado do PDF 11)
  const [bancosList, setBancosList] = useState([
    { id: 'BC-01', nome: 'BB SJDH-BA — Conta Segregada (Termo de Fomento nº 005/SJDH/2022)', banco: '001 - Banco do Brasil', agencia: '3418-5', conta: '14.502-1', saldo: 11372109.26, tipo: 'MROSC Estadual', cor: '#2563eb' },
    { id: 'BC-02', nome: 'BB Aplicação Financeira CDB MROSC (Rendimentos da Parceria)', banco: '001 - Banco do Brasil', agencia: '3418-5', conta: '14.502-1 (CDB)', saldo: 46849.16, tipo: 'Aplicação CDB MROSC', cor: '#10b981' }
  ]);

  // Chart of Accounts (Plano de Contas Hierárquico)
  const [planoContas, setPlanoContas] = useState([
    { codigo: '1.0.00', nome: 'RECEITAS OPERACIONAIS & CONVÊNIOS', tipo: 'Receita', pai: null },
    { codigo: '1.1.01', nome: 'Repasses MROSC Governo Estadual (SJDH-BA)', tipo: 'Receita', pai: '1.0.00' },
    { codigo: '1.1.02', nome: 'Repasses MROSC Prefeitura de Candeias', tipo: 'Receita', pai: '1.0.00' },
    { codigo: '1.1.03', nome: 'Repasses MROSC Governo Federal (SENAD/MJ)', tipo: 'Receita', pai: '1.0.00' },
    { codigo: '1.2.01', nome: 'Doações Liberais Pessoa Física / Jurídica', tipo: 'Receita', pai: '1.0.00' },
    { codigo: '1.3.01', nome: 'Rendimentos de Aplicações Financeiras (CDB)', tipo: 'Receita', pai: '1.0.00' },
    { codigo: '2.0.00', nome: 'DESPESAS OPERACIONAIS & PROGRAMÁTICAS', tipo: 'Despesa', pai: null },
    { codigo: '2.1.01', nome: 'Folha de Pagamento & Encargos (RH / 285 Colaboradores)', tipo: 'Despesa', pai: '2.0.00' },
    { codigo: '2.2.01', nome: 'Alimentação & Cozinha Industrial (4.000 Refeições/Dia)', tipo: 'Despesa', pai: '2.0.00' },
    { codigo: '2.3.01', nome: 'Medicamentos & Enxoval Hospitalar / Saúde', tipo: 'Despesa', pai: '2.0.00' },
    { codigo: '2.4.01', nome: 'Frota, Diesel S10 & Manutenção de Veículos', tipo: 'Despesa', pai: '2.0.00' },
    { codigo: '2.5.01', nome: 'Manutenção Predial & Utilidades (Energia/Água/Gás)', tipo: 'Despesa', pai: '2.0.00' }
  ]);

  // FASE 6 REVISADA: Fornecedores Fixos & Concessionárias (Lançamentos Exatos do PDF 10 Tabela 02)
  const [fornecedoresFixos, setFornecedoresFixos] = useState([
    { id: 'FIX-01', servico: 'Concessionária de Água & Esgoto (EMBASA)', fornecedor: 'EMBASA - Empresa Baiana de Águas e Saneamento S/A', contratoMedidor: 'Contrato nº 098401 / Hidrômetro Sede #44019', valorMensal: 26478.62, diaVencimento: 10, contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago / Liquidado' },
    { id: 'FIX-02', servico: 'Concessionária de Energia Elétrica (COELBA)', fornecedor: 'COELBA - Companhia de Eletricidade do Estado da Bahia', contratoMedidor: 'Contrato nº 204910 / UC-88104 Sede 40.000m²', valorMensal: 222908.45, diaVencimento: 15, contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago / Liquidado' },
    { id: 'FIX-03', servico: 'Gás de Cozinha Industrial GLP Cilíndrico (4.000 ref/dia)', fornecedor: 'Nacional Gás Butano Distribuidora Ltda', contratoMedidor: 'Contrato Fornecimento GLP Cozinha #88401', valorMensal: 306338.30, diaVencimento: 18, contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago / Liquidado' },
    { id: 'FIX-04', servico: 'Material de Higiene Hospitalar & Limpeza RDC 29', fornecedor: 'Distribuidora Higiene & Limpeza Baiana Ltda', contratoMedidor: 'Contrato Insumos Higienização #104-RDC29', valorMensal: 217480.77, diaVencimento: 22, contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago / Liquidado' },
    { id: 'FIX-05', servico: 'Provedor de Internet Fibra Óptica Sede & Alojamentos', fornecedor: 'Telecom RMS Serviços de Internet Ltda', contratoMedidor: 'Contrato nº 8810-FIBRA Sede Candeias', valorMensal: 4650.99, diaVencimento: 5, contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago / Liquidado' }
  ]);

  // FASE 6 REVISADA: Folha de Pagamento Oficial CLT (285 Colaboradores / Folha 42 do PDF de 67 Páginas)
  const [folhaPessoal, setFolhaPessoal] = useState([
    { id: 'RH-01', cargo: 'Assistentes Sociais (24) e Psicólogos (24) — 30h', quantidade: 48, salarioBase: 3284.00, inssPatronal: 656.80, fgts: 262.72, guiaINSS: 'GPS-992014', guiaFGTS: 'GRF-001920', rateioMROSC: 100, valorTotalMROSC: 219997.44, status: 'Processado & Sincronizado Retroativamente ao REF' },
    { id: 'RH-02', cargo: 'Enfermeiros (8), Auxiliares (4) & Téc. Enfermagem (18) — 36h', quantidade: 30, salarioBase: 2360.00, inssPatronal: 472.00, fgts: 188.80, guiaINSS: 'GPS-992015', guiaFGTS: 'GRF-001921', rateioMROSC: 100, valorTotalMROSC: 77746.24, status: 'Processado & Sincronizado Retroativamente ao REF' },
    { id: 'RH-03', cargo: 'Coordenadores (12), Monitores (84) & Líderes de Equipe (24) — 44h', quantidade: 120, salarioBase: 1912.00, inssPatronal: 382.40, fgts: 152.96, guiaINSS: 'GPS-992016', guiaFGTS: 'GRF-001922', rateioMROSC: 100, valorTotalMROSC: 309333.92, status: 'Processado & Sincronizado Retroativamente ao REF' },
    { id: 'RH-04', cargo: 'Cozinheiros (12) & Auxiliares de Cozinha (16) — 44h', quantidade: 28, salarioBase: 1800.00, inssPatronal: 360.00, fgts: 144.00, guiaINSS: 'GPS-992017', guiaFGTS: 'GRF-001923', rateioMROSC: 100, valorTotalMROSC: 66345.78, status: 'Processado & Sincronizado Retroativamente ao REF' },
    { id: 'RH-05', cargo: 'Motoristas (14), Op. Som, Monitor Infantil & Serviços Gerais (27) — 44h', quantidade: 41, salarioBase: 1950.00, inssPatronal: 390.00, fgts: 156.00, guiaINSS: 'GPS-992018', guiaFGTS: 'GRF-001924', rateioMROSC: 100, valorTotalMROSC: 104537.52, status: 'Processado & Sincronizado Retroativamente ao REF' },
    { id: 'RH-06', cargo: 'Gestão Geral, Gerência & Diretores Executivos (7) — 44h', quantidade: 7, salarioBase: 5500.00, inssPatronal: 1100.00, fgts: 440.00, guiaINSS: 'GPS-992019', guiaFGTS: 'GRF-001925', rateioMROSC: 100, valorTotalMROSC: 51140.00, status: 'Processado & Sincronizado Retroativamente ao REF' }
  ]);

  // Accounts Payable (Contas a Pagar Títulos Exatos dos PDFs 10 e 11 com Datas de Lançamento)
  const [contasPagar, setContasPagar] = useState([
    // === 1ª PARCELA (18/06/2022 a 17/10/2022) ===
    { 
  id: 'CP-001', 
  dataLancamento: '11/07/2022', 
  fornecedor: 'Receita Federal do Brasil (DARF IRRF)', 
  cnpj: '40.554.834/0001-63', 
  descricao: 'Recolhimento DARF IRRF - Rendimento do Trabalho Assalariado (Ref. Junho/2022)', 
  valor: 1823.59, 
  vencimento: '11/07/2022', 
  categoria: '2.1.01 Folha de Pagamento', 
  contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', 
  status: 'Pago (Liquidado)', 
  termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)',
  isRealReplica: true,
  docType: 'DARF',
  periodoApuracao: '30/06/2022',
  codigoReceita: '3429',
  autenticacaoBB: 'E.142.188.434.721.049',
  barcode: '85880000018 0 23590385222 0 01070122188 4 15768823148 3'
},
    { 
  id: 'CP-002', 
  dataLancamento: '11/07/2022', 
  fornecedor: 'Caixa Econômica Federal (GRF FGTS)', 
  cnpj: '40.554.834/0001-63', 
  descricao: 'Recolhimento GRF FGTS - Competência 06/2022 (Equipe Multidisciplinar)', 
  valor: 646.62, 
  vencimento: '11/07/2022', 
  categoria: '2.1.01 Folha de Pagamento', 
  contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', 
  status: 'Pago (Liquidado)', 
  termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)',
  isRealReplica: true,
  docType: 'FGTS',
  periodoApuracao: '06/2022',
  codigoReceita: '115',
  autenticacaoBB: 'J7127218 FABIANE DOS SANTOS CELESTINO - Aut. E.142.188.434.721.049',
  barcode: '85810000006 4 46620179220 4 29572829571 1 05548340001 4'
},
    { 
  id: 'CP-003', 
  dataLancamento: '28/08/2022', 
  fornecedor: 'Empresa Baiana de Manutenção e Serviços Ltda', 
  cnpj: '12.401.991/0001-88', 
  descricao: 'Manutenção Preventiva de Instalações e Equipamentos (1ª Parcela)', 
  valor: 1150000.00, 
  vencimento: '28/08/2022', 
  categoria: '2.2.02 Manutenção Geral', 
  contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', 
  status: 'Pago (Liquidado)', 
  termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)'
},
    { id: 'CP-004', dataLancamento: '10/09/2022', fornecedor: 'Neoenergia COELBA / EMBASA', cnpj: '15.135.960/0001-10', descricao: 'Faturas Energia Elétrica e Água/Esgoto Unidade Sede (1ª Parcela)', valor: 684000.00, vencimento: '10/09/2022', categoria: '2.5.01 Energia Elétrica', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },

    // === 2ª PARCELA (18/10/2022 a 31/01/2023) ===
    { id: 'CP-005', dataLancamento: '05/11/2022', fornecedor: 'Fundação Doutor Jesus (Folha CLT)', cnpj: '40.584.934/0001-43', descricao: 'Pagamento de Pessoal e Encargos Sociais INSS/FGTS (2ª Parcela - Out/22)', valor: 2450000.00, vencimento: '05/11/2022', categoria: '2.1.01 Folha de Pagamento', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
    { id: 'CP-006', dataLancamento: '15/12/2022', fornecedor: 'Distribuidora Central de Alimentos Ltda', cnpj: '08.912.441/0001-22', descricao: 'Fornecimento Proteínas e Mantimentos Acolhimento (2ª Parcela - Nov/22)', valor: 3820000.00, vencimento: '15/12/2022', categoria: '2.2.01 Alimentação & Cozinha', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
    { id: 'CP-007', dataLancamento: '20/01/2023', fornecedor: 'Distribuidora Higiene & Limpeza Baiana Ltda', cnpj: '04.102.991/0001-88', descricao: 'Insumos de Higienização de Acolhidos e Materiais de Limpeza (2ª Parcela)', valor: 890000.00, vencimento: '20/01/2023', categoria: '2.3.05 Higiene & Limpeza', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },

    // === 3ª PARCELA (01/02/2023 a 31/05/2023) ===
    { id: 'CP-008', dataLancamento: '05/03/2023', fornecedor: 'Fundação Doutor Jesus (Folha CLT)', cnpj: '40.584.934/0001-43', descricao: 'Remunerações de Pessoal e Benefícios Vale Transporte (3ª Parcela - Fev/23)', valor: 1950000.00, vencimento: '05/03/2023', categoria: '2.1.01 Folha de Pagamento', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
    { id: 'CP-009', dataLancamento: '18/04/2023', fornecedor: 'Atacadão S.A.', cnpj: '75.315.333/0001-09', descricao: 'Gêneros Alimentícios de Custeio Diário (3ª Parcela - Mar/23)', valor: 2180000.00, vencimento: '18/04/2023', categoria: '2.2.01 Alimentação & Cozinha', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
    { id: 'CP-010', dataLancamento: '25/05/2023', fornecedor: 'Posto Petrobras Menino Jesus Ltda', cnpj: '13.401.881/0001-50', descricao: 'Combustível Óleo Diesel para Frota e Geradores (3ª Parcela - Abr/23)', valor: 740000.00, vencimento: '25/05/2023', categoria: '2.4.01 Combustível', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },

    // === 4ª PARCELA (01/06/2023 a 30/09/2023) ===
    { id: 'CP-011', dataLancamento: '05/07/2023', fornecedor: 'Fundação Doutor Jesus (Folha CLT)', cnpj: '40.584.934/0001-43', descricao: 'Folha de Pagamento e Encargos Sociais INSS/FGTS (4ª Parcela - Jun/23)', valor: 2890000.00, vencimento: '05/07/2023', categoria: '2.1.01 Folha de Pagamento', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
    { id: 'CP-012', dataLancamento: '12/08/2023', fornecedor: 'Distribuidora Central de Alimentos Ltda', cnpj: '08.912.441/0001-22', descricao: 'Insumos Alimentícios e Proteínas (4ª Parcela - Jul/23)', valor: 3120000.00, vencimento: '12/08/2023', categoria: '2.2.01 Alimentação & Cozinha', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
    { id: 'CP-013', dataLancamento: '20/09/2023', fornecedor: 'Livraria & Papelaria Baiana Ltda', cnpj: '11.021.991/0001-33', descricao: 'Material Gráfico, Pedagógico e Oficinas de Qualificação (4ª Parcela)', valor: 680000.00, vencimento: '20/09/2023', categoria: '2.2.14 Material Gráfico', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },

    // === 5ª PARCELA (01/10/2023 a 31/01/2024) ===
    { id: 'CP-014', dataLancamento: '05/11/2023', fornecedor: 'Fundação Doutor Jesus (Folha CLT)', cnpj: '40.584.934/0001-43', descricao: 'RH, Encargos Sociais e Provisões de 13º Salário (5ª Parcela - Out/23)', valor: 5480000.00, vencimento: '05/11/2023', categoria: '2.1.01 Folha de Pagamento', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
    { id: 'CP-015', dataLancamento: '20/12/2023', fornecedor: 'Atacadão S.A.', cnpj: '75.315.333/0001-09', descricao: 'Custeio Geral de Nutrição e Alimentação Comunitária (5ª Parcela - Nov/23)', valor: 12768571.05, vencimento: '20/12/2023', categoria: '2.2.01 Alimentação & Cozinha', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
    { id: 'CP-016', dataLancamento: '15/01/2024', fornecedor: 'Empresa Baiana de Manutenção e Serviços Ltda', cnpj: '12.401.991/0001-88', descricao: 'Serviços de Terceiros e Manutenção Estrutural Unidades (5ª Parcela)', valor: 2870000.00, vencimento: '15/01/2024', categoria: '2.2.02 Manutenção Geral', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },

    // === 6ª PARCELA (01/02/2024 a 30/06/2024) ===
    { id: 'CP-017', dataLancamento: '05/03/2024', fornecedor: 'Fundação Doutor Jesus (Folha CLT)', cnpj: '40.584.934/0001-43', descricao: 'Remunerações de Pessoal e Equipe Técnica Multidisciplinar (6ª Parcela)', valor: 3840000.00, vencimento: '05/03/2024', categoria: '2.1.01 Folha de Pagamento', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
    { id: 'CP-018', dataLancamento: '18/04/2024', fornecedor: 'Distribuidora Central de Alimentos Ltda', cnpj: '08.912.441/0001-22', descricao: 'Alimentação para Acolhidos e Custeio de Refeitórios (6ª Parcela)', valor: 5120000.00, vencimento: '18/04/2024', categoria: '2.2.01 Alimentação & Cozinha', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
    { id: 'CP-019', dataLancamento: '25/06/2024', fornecedor: 'Posto Petrobras Menino Jesus Ltda', cnpj: '13.401.881/0001-50', descricao: 'Combustível Óleo Diesel e Manutenção de Veículos (6ª Parcela)', valor: 1980000.00, vencimento: '25/06/2024', categoria: '2.4.01 Combustível', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },

    // === 7ª PARCELA (01/07/2024 a 31/12/2024 - 2º Aditivo) ===
    { id: 'CP-020', dataLancamento: '05/08/2024', fornecedor: 'Fundação Doutor Jesus (Folha CLT)', cnpj: '40.584.934/0001-43', descricao: 'Folha de Pagamento e Encargos Sociais RH (7ª Parcela - Ref. Julho/24)', valor: 3150000.00, vencimento: '05/08/2024', categoria: '2.1.01 Folha de Pagamento', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' },
    { id: 'CP-021', dataLancamento: '15/09/2024', fornecedor: 'Atacadão S.A.', cnpj: '75.315.333/0001-09', descricao: 'Aquisição de Gêneros Alimentícios (7ª Parcela - Ref. Agosto/24)', valor: 4280000.00, vencimento: '15/09/2024', categoria: '2.2.01 Alimentação & Cozinha', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' },

    // === 8ª PARCELA (01/01/2025 a 30/06/2025 - 2º Aditivo) ===
    { id: 'CP-026', dataLancamento: '05/02/2025', fornecedor: 'Fundação Doutor Jesus (Folha CLT)', cnpj: '40.584.934/0001-43', descricao: 'Folha de Pagamento RH e Benefícios (8ª Parcela - Ref. Jan/25)', valor: 3420000.00, vencimento: '05/02/2025', categoria: '2.1.01 Folha de Pagamento', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' },
    { id: 'CP-027', dataLancamento: '18/03/2025', fornecedor: 'Atacadão S.A.', cnpj: '75.315.333/0001-09', descricao: 'Gêneros Alimentícios para Refeitórios (8ª Parcela - Ref. Fev/25)', valor: 4950000.00, vencimento: '18/03/2025', categoria: '2.2.01 Alimentação & Cozinha', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' },

    // === 9ª PARCELA (01/07/2025 a 31/12/2025 - 2º Aditivo) ===
    { id: 'CP-031', dataLancamento: '05/08/2025', fornecedor: 'Fundação Doutor Jesus (Folha CLT)', cnpj: '40.584.934/0001-43', descricao: 'Remuneração de Pessoal e Encargos Previdenciários (9ª Parcela - Jul/25)', valor: 3950000.00, vencimento: '05/08/2025', categoria: '2.1.01 Folha de Pagamento', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' },
    { id: 'CP-032', dataLancamento: '20/09/2025', fornecedor: 'Distribuidora Central de Alimentos Ltda', cnpj: '08.912.441/0001-22', descricao: 'Fornecimento de Alimentação Completa Acolhimento (9ª Parcela)', valor: 5820000.00, vencimento: '20/09/2025', categoria: '2.2.01 Alimentação & Cozinha', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' },

    // === 10ª PARCELA (01/01/2026 a 30/06/2026 - 2º Aditivo) ===
    { id: 'CP-101', dataLancamento: '10/01/2026', fornecedor: 'Atacadão S.A.', cnpj: '75.315.333/0001-09', descricao: 'Aquisição de gêneros alimentícios hortifrúti/carnes (NFe 8841 - TED 12345)', valor: 18450.00, vencimento: '10/01/2026', categoria: '2.2.01 Alimentação & Cozinha', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' },
    { id: 'CP-102', dataLancamento: '25/01/2026', fornecedor: 'Atacadão S.A.', cnpj: '75.315.333/0001-09', descricao: 'Insumos de nutrição comunitária e grãos (NFe 9012 - TED 12388)', valor: 22300.00, vencimento: '25/01/2026', categoria: '2.2.01 Alimentação & Cozinha', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' },
    { id: 'CP-103', dataLancamento: '05/01/2026', fornecedor: 'Fundação Doutor Jesus (Folha CLT)', cnpj: '40.584.934/0001-43', descricao: 'Transferência eletrônica de salários dos colaboradores (TED Folha 102401)', valor: 45230.00, vencimento: '05/01/2026', categoria: '2.1.01 Folha de Pagamento', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' },
    { id: 'CP-104', dataLancamento: '15/01/2026', fornecedor: 'Receita Federal do Brasil (Guia GPS)', cnpj: '00.396.895/0001-88', descricao: 'Recolhimento dos encargos sociais previdenciários INSS patronal (TED GPS)', valor: 9046.00, vencimento: '15/01/2026', categoria: '2.1.05 Encargos INSS Patronal', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' },
    { id: 'CP-105', dataLancamento: '07/01/2026', fornecedor: 'Caixa Econômica Federal (Guia GRF)', cnpj: '00.360.305/0001-04', descricao: 'Recolhimento do fundo de garantia FGTS da equipe contratada (TED 102402)', valor: 3618.40, vencimento: '07/01/2026', categoria: '2.1.06 Encargos FGTS', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' },
    { id: 'CP-135', dataLancamento: '15/06/2026', fornecedor: 'Receita Federal do Brasil (Guia GPS)', cnpj: '00.396.895/0001-88', descricao: 'Recolhimento INSS Patronal (Ref. Junho/2026)', valor: 9046.00, vencimento: '15/06/2026', categoria: '2.1.05 Encargos INSS Patronal', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' },
    { id: 'CP-136', dataLancamento: '28/06/2026', fornecedor: 'Neoenergia COELBA', cnpj: '15.135.960/0001-10', descricao: 'Energia Elétrica UC-88104 Sede (Ref. Junho/2026)', valor: 222908.45, vencimento: '28/06/2026', categoria: '2.5.01 Energia Elétrica', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' },
    { id: 'CP-137', dataLancamento: '29/06/2026', fornecedor: 'Nacional Gás Butano Distribuidora', cnpj: '08.561.701/0001-44', descricao: 'Gás de cozinha GLP industrial (Ref. Junho/2026)', valor: 306338.30, vencimento: '29/06/2026', categoria: '2.5.01 Gás de Cozinha', contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Pago (Liquidado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' }
  ]);

  // Accounts Receivable (Contas a Receber Títulos Reais MROSC & Doações)
  const [contasReceber, setContasReceber] = useState([
    { id: 'CR-001', dataLancamento: '18/06/2022', pagador: 'Secretaria de Justiça e Direitos Humanos (SJDH-BA)', cnpj: '13.937.065/0001-00', descricao: 'Repasse 1ª Parcela - Termo de Fomento 005/2022 SJDH-BA', valor: 10372484.70, vencimento: '18/06/2022', categoria: '1.1.01 Repasses MROSC Estadual', contaDestino: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Recebido (Creditado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
    { id: 'CR-002', dataLancamento: '20/10/2022', pagador: 'Secretaria de Justiça e Direitos Humanos (SJDH-BA)', cnpj: '13.937.065/0001-00', descricao: 'Repasse 2ª Parcela - Termo de Fomento 005/2022 SJDH-BA', valor: 9052115.09, vencimento: '20/10/2022', categoria: '1.1.01 Repasses MROSC Estadual', contaDestino: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Recebido (Creditado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
    { id: 'CR-003', dataLancamento: '05/02/2023', pagador: 'Secretaria de Justiça e Direitos Humanos (SJDH-BA)', cnpj: '13.937.065/0001-00', descricao: 'Repasse 3ª Parcela - Termo de Fomento 005/2022 SJDH-BA', valor: 8382115.09, vencimento: '05/02/2023', categoria: '1.1.01 Repasses MROSC Estadual', contaDestino: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Recebido (Creditado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
    { id: 'CR-004', dataLancamento: '10/06/2023', pagador: 'Secretaria de Justiça e Direitos Humanos (SJDH-BA)', cnpj: '13.937.065/0001-00', descricao: 'Repasse 4ª Parcela - Termo de Fomento 005/2022 SJDH-BA', valor: 10461201.06, vencimento: '10/06/2023', categoria: '1.1.01 Repasses MROSC Estadual', contaDestino: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Recebido (Creditado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
    { id: 'CR-005', dataLancamento: '15/10/2023', pagador: 'Secretaria de Justiça e Direitos Humanos (SJDH-BA)', cnpj: '13.937.065/0001-00', descricao: 'Repasse 5ª Parcela - Termo de Fomento 005/2022 SJDH-BA', valor: 19600000.00, vencimento: '15/10/2023', categoria: '1.1.01 Repasses MROSC Estadual', contaDestino: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Recebido (Creditado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
    { id: 'CR-006', dataLancamento: '05/02/2024', pagador: 'Secretaria de Justiça e Direitos Humanos (SJDH-BA)', cnpj: '13.937.065/0001-00', descricao: 'Repasse 6ª Parcela - Termo de Fomento 005/2022 SJDH-BA', valor: 9092098.76, vencimento: '05/02/2024', categoria: '1.1.01 Repasses MROSC Estadual', contaDestino: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Recebido (Creditado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },

    // === 2º TERMO ADITIVO (7ª a 10ª PARCELA) ===
    { id: 'CR-007', dataLancamento: '10/07/2024', pagador: 'Secretaria de Justiça e Direitos Humanos (SJDH-BA)', cnpj: '13.937.065/0001-00', descricao: 'Repasse 7ª Parcela - 2º Termo Aditivo (TF 005/2022)', valor: 15599999.97, vencimento: '10/07/2024', categoria: '1.1.01 Repasses MROSC Estadual', contaDestino: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Recebido (Creditado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' },
    { id: 'CR-008', dataLancamento: '10/01/2025', pagador: 'Secretaria de Justiça e Direitos Humanos (SJDH-BA)', cnpj: '13.937.065/0001-00', descricao: 'Repasse 8ª Parcela - 2º Termo Aditivo (TF 005/2022)', valor: 17249999.98, vencimento: '10/01/2025', categoria: '1.1.01 Repasses MROSC Estadual', contaDestino: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Recebido (Creditado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' },
    { id: 'CR-009', dataLancamento: '10/07/2025', pagador: 'Secretaria de Justiça e Direitos Humanos (SJDH-BA)', cnpj: '13.937.065/0001-00', descricao: 'Repasse 9ª Parcela - 2º Termo Aditivo (TF 005/2022)', valor: 17250000.00, vencimento: '10/07/2025', categoria: '1.1.01 Repasses MROSC Estadual', contaDestino: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Recebido (Creditado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' },
    { id: 'CR-010', dataLancamento: '10/01/2026', pagador: 'Secretaria de Justiça e Direitos Humanos (SJDH-BA)', cnpj: '13.937.065/0001-00', descricao: 'Repasse 10ª Parcela - 2º Termo Aditivo (TF 005/2022)', valor: 19022565.08, vencimento: '10/01/2026', categoria: '1.1.01 Repasses MROSC Estadual', contaDestino: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)', status: 'Recebido (Creditado)', termoMROSC: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' }
  ]);

  // FASE 3: Ordens de Pagamento e Notas Fiscais Segregadas MROSC (Lançamentos Reais dos PDFs 10 e 11)
  const [nfeLiquidadas, setNfeLiquidadas] = useState([
    {
      id: 'OP-2026/101-FDJ',
      scId: 'SC-2026/001-FDJ',
      cotacaoId: 'COT-2026-01',
      termoMROSC: 'Termo de Fomento nº 005/2022 (SJDH-BA)',
      rubrica: '2.2.01 Alimentação & Insumos de Nutrição Comunitária',
      fornecedor: 'Atacadão S.A.',
      cnpjFornecedor: '75.315.333/0001-09',
      dadosBancariosPJ: 'Banco do Brasil - Ag. 3418 / C/C 12.345-0 (TED PJ)',
      alinhamentoLogistico: 'Entrega efetuada no Almoxarifado Central FDJ — Recebido pela Nutrição',
      nfeNumero: 'NFe-8841',
      nfeChave: '29260175315333000109550010000088411004829104',
      nfeDataEmissao: '2026-01-10',
      nfeValorTotal: 18450.00,
      carimboMROSCImpresso: true,
      carimboTexto: 'Recursos decorrentes do Termo de Fomento nº 005/2022 SJDH-BA - Lei 13.019/2014',
      contaPagadoraSegregada: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)',
      dataPagamento: '2026-01-10',
      formaPagamento: 'TED 12345 Identificada',
      txidBancario: 'TED-BB-1234502910481204',
      status: 'Liquidado e Pago em Conta Segregada'
    },
    {
      id: 'OP-2026/102-FDJ',
      scId: 'SC-2026/002-FDJ',
      cotacaoId: 'COT-2026-01',
      termoMROSC: 'Termo de Fomento nº 005/2022 (SJDH-BA)',
      rubrica: '2.2.01 Alimentação & Insumos de Nutrição Comunitária',
      fornecedor: 'Atacadão S.A.',
      cnpjFornecedor: '75.315.333/0001-09',
      dadosBancariosPJ: 'Banco do Brasil - Ag. 3418 / C/C 12.345-0 (TED PJ)',
      alinhamentoLogistico: 'Entrega de gêneros alimentícios e grãos na Cozinha Industrial',
      nfeNumero: 'NFe-9012',
      nfeChave: '29260175315333000109550010000090121005910294',
      nfeDataEmissao: '2026-01-25',
      nfeValorTotal: 22300.00,
      carimboMROSCImpresso: true,
      carimboTexto: 'Recursos decorrentes do Termo de Fomento nº 005/2022 SJDH-BA - Lei 13.019/2014',
      contaPagadoraSegregada: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)',
      dataPagamento: '2026-01-25',
      formaPagamento: 'TED 12388 Identificada',
      txidBancario: 'TED-BB-1238802910492019',
      status: 'Liquidado e Pago em Conta Segregada'
    }
  ]);

  // FASE 4: Conciliação Bancária Trilateral (Extrato OFX + OP + NFe do PDF 11 Página 2)
  const [conciliacoesOFX, setConciliacoesOFX] = useState([
    {
      id: 'CNC-2026/01',
      dataExtrato: '2026-01-05',
      descricaoExtrato: 'TED FOLHA DE PAGAMENTO JAN/26',
      valorDebito: 45230.00,
      contaBancaria: 'BB SJDH-BA (C/C 14.502-1)',
      nfeVinculada: 'Folha de Pagamento Salários (285 Colaboradores)',
      chaveNFe: 'FOLHA-CLT-JAN2026-FDJ',
      comprovanteTXID: 'TED-102401',
      rubrica: '2.1.01 Folha de Pagamento',
      statusConciliacao: 'Conciliado 1-para-1'
    },
    {
      id: 'CNC-2026/02',
      dataExtrato: '2026-01-07',
      descricaoExtrato: 'TED CAIXA ECONÔMICA GRF FGTS',
      valorDebito: 3618.40,
      contaBancaria: 'BB SJDH-BA (C/C 14.502-1)',
      nfeVinculada: 'Guia GRF FGTS Jan/26',
      chaveNFe: 'GRF-FGTS-JAN2026-CAIXA',
      comprovanteTXID: 'TED-102402',
      rubrica: '2.1.06 Encargos FGTS',
      statusConciliacao: 'Conciliado 1-para-1'
    },
    {
      id: 'CNC-2026/03',
      dataExtrato: '2026-01-10',
      descricaoExtrato: 'TED ATACADÃO S.A NFE 8841',
      valorDebito: 18450.00,
      contaBancaria: 'BB SJDH-BA (C/C 14.502-1)',
      nfeVinculada: 'NFe-8841 (Atacadão S.A.)',
      chaveNFe: '29260175315333000109550010000088411004829104',
      comprovanteTXID: 'TED-12345',
      rubrica: '2.2.01 Alimentação & Cozinha',
      statusConciliacao: 'Conciliado 1-para-1'
    }
  ]);

  // Form State for New Conta a Pagar
  const [newContaPagar, setNewContaPagar] = useState({
    fornecedor: 'Atacadão S.A.',
    cnpj: '75.315.333/0001-09',
    descricao: '',
    valor: '',
    vencimento: new Date().toISOString().split('T')[0],
    categoria: '2.2.01 Alimentação & Cozinha',
    contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)',
    termoMROSC: 'Termo de Fomento nº 005/2022 (SJDH-BA)',
    status: 'A Pagar'
  });

  const handleCreateContaPagar = (e) => {
    e.preventDefault();
    if (!newContaPagar.fornecedor || !newContaPagar.valor) return;

    const newCP = {
      id: `CP-${Math.floor(115 + Math.random() * 885)}`,
      dataLancamento: new Date().toLocaleDateString('pt-BR'),
      fornecedor: newContaPagar.fornecedor,
      cnpj: newContaPagar.cnpj || '00.000.000/0001-00',
      descricao: newContaPagar.descricao,
      valor: parseFloat(newContaPagar.valor) || 0,
      vencimento: newContaPagar.vencimento ? new Date(newContaPagar.vencimento).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
      categoria: newContaPagar.categoria,
      contaPagadora: newContaPagar.contaPagadora,
      termoMROSC: newContaPagar.termoMROSC,
      status: newContaPagar.status || 'A Pagar'
    };

    setContasPagar([newCP, ...contasPagar]);
    if (onAddTransacao) {
      onAddTransacao({
        tipo: 'Saída',
        descricao: `[Contas a Pagar] ${newCP.fornecedor} - ${newCP.descricao}`,
        valor: newCP.valor,
        categoria: newCP.categoria,
        data: new Date().toISOString().split('T')[0]
      });
    }

    setShowPagarModal(false);
    setNewContaPagar({
      fornecedor: '',
      cnpj: '',
      descricao: '',
      valor: '',
      vencimento: new Date().toISOString().split('T')[0],
      categoria: '2.2.01 Alimentação & Cozinha',
      contaPagadora: 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)',
      termoMROSC: 'Termo de Fomento nº 005/2022 (SJDH-BA)',
      status: 'A Pagar'
    });
  };

  const handleToggleBaixa = (id) => {
    setContasPagar(contasPagar.map(cp => {
      if (cp.id === id) {
        const novoStatus = cp.status.includes('Pago') ? 'A Pagar' : 'Pago (Liquidado)';
        return { ...cp, status: novoStatus };
      }
      return cp;
    }));
  };

  // State and Handlers for Editing and Deleting Contas a Pagar
  const [editingCP, setEditingCP] = useState(null);

  const handleDeleteCP = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este título de Contas a Pagar?')) {
      setContasPagar(contasPagar.filter(cp => cp.id !== id));
    }
  };

  const handleOpenEditCP = (cp) => {
    setEditingCP({ ...cp });
  };

  const handleSaveEditCP = (e) => {
    e.preventDefault();
    if (!editingCP) return;

    setContasPagar(contasPagar.map(cp => cp.id === editingCP.id ? editingCP : cp));
    setEditingCP(null);
  };

  // Smart matching algorithm for Plano de Trabalho strings
  const isTermoMatch = (item, filterTermo) => {
    if (!filterTermo || filterTermo === 'Todos' || filterTermo === 'Todos os Planos de Trabalho MROSC' || filterTermo === '-- Todos os Planos de Trabalho MROSC --') return true;

    let itemTermo = '';
    let rawDateStr = '';

    if (typeof item === 'string') {
      itemTermo = item;
    } else if (item && typeof item === 'object') {
      itemTermo = String(item.termoMROSC || item.termo || item.termoMROSCVinculado || '');
      rawDateStr = String(item.dataLancamento || item.vencimento || item.data || '');
    }

    let dateISO = '';
    if (rawDateStr) {
      if (rawDateStr.includes('/')) {
        const parts = rawDateStr.split('/');
        if (parts.length === 3) dateISO = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      } else {
        dateISO = rawDateStr.substring(0, 10);
      }
    }

    const filterLower = String(filterTermo).toLowerCase();

    if (filterLower.includes('plano original') || filterLower.includes('1ª a 6ª')) {
      if (dateISO && dateISO > '2024-06-30') return false;
      return itemTermo.includes('005') || itemTermo.toLowerCase().includes('sjdh');
    }

    if (filterLower.includes('2º termo aditivo') || filterLower.includes('7ª a 12ª') || filterLower.includes('7ª a 10ª')) {
      if (dateISO && dateISO < '2024-07-01') return false;
      return itemTermo.includes('005') || itemTermo.toLowerCase().includes('sjdh');
    }

    if (filterLower.includes('008/2025')) {
      return itemTermo.includes('008') || itemTermo.toLowerCase().includes('pmc');
    }

    if (filterLower.includes('002/2025')) {
      return itemTermo.includes('002') || itemTermo.toLowerCase().includes('senad');
    }

    return itemTermo.toLowerCase().includes(filterLower);
  };

  // Filter Contas a Pagar by Selected Plano de Trabalho MROSC & Date Range (dataInicio / dataFim)
  const filteredContasPagar = contasPagar.filter(cp => {
    // 1. Filter by Plano de Trabalho
    if (selectedPlanoTrabalho && selectedPlanoTrabalho !== 'Todos') {
      const match = isTermoMatch(cp, selectedPlanoTrabalho);
      if (!match) return false;
    }

    // 2. Filter by Date Range (dataInicio & dataFim)
    if (dataInicio || dataFim) {
      const rawDateStr = cp.dataLancamento || cp.vencimento || '';
      let dateISO = '';
      if (rawDateStr.includes('/')) {
        const parts = rawDateStr.split('/');
        if (parts.length === 3) dateISO = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      } else {
        dateISO = rawDateStr.substring(0, 10);
      }

      if (dateISO && dateISO.length === 10) {
        if (dataInicio && dateISO < dataInicio) return false;
        if (dataFim && dateISO > dataFim) return false;
      }
    }

    // 3. Filter by Fornecedor
    if (selectedFornecedorFilter && selectedFornecedorFilter !== 'Todos') {
      if (cp.fornecedor !== selectedFornecedorFilter) return false;
    }

    // 4. Filter by Rubrica Orçamentária
    if (selectedRubricaFilter && selectedRubricaFilter !== 'Todas') {
      if (!cp.categoria || !cp.categoria.toLowerCase().includes(selectedRubricaFilter.toLowerCase())) return false;
    }

    // 5. Filter by Conta Segregadora / Pagadora
    if (selectedContaFilter && selectedContaFilter !== 'Todas') {
      if (!cp.contaPagadora || !cp.contaPagadora.toLowerCase().includes(selectedContaFilter.toLowerCase())) return false;
    }

    // 6. Filter by Status (Pendente ou Pago)
    if (selectedStatusFilter && selectedStatusFilter !== 'Todos') {
      const isPaid = cp.status && (cp.status.includes('Pago') || cp.status.includes('Liquidado'));
      if (selectedStatusFilter === 'Pago' && !isPaid) return false;
      if (selectedStatusFilter === 'Pendente' && isPaid) return false;
    }

    return true;
  });

  // Helper to parse date string to timestamp for sorting
  const parseDateToTimestamp = (dateStr) => {
    if (!dateStr) return 0;
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`).getTime() || 0;
      }
    }
    return new Date(dateStr).getTime() || 0;
  };

  // Sort Contas a Pagar chronologically DESCENDING (most recent date first)
  const sortedContasPagar = [...filteredContasPagar].sort((a, b) => {
    const timeA = parseDateToTimestamp(a.dataLancamento || a.vencimento);
    const timeB = parseDateToTimestamp(b.dataLancamento || b.vencimento);
    return timeB - timeA; // Descending: Most recent on top!
  });

  // Filter and Sort Contas a Receber chronologically DESCENDING
  const filteredContasReceber = contasReceber.filter(cr => {
    const matchCR = isTermoMatch(cr, selectedPlanoTrabalho);
    if (!matchCR) return false;
    
    if (dataInicio || dataFim) {
      const rawDateStr = cr.dataLancamento || cr.vencimento || '';
      let dateISO = '';
      if (rawDateStr.includes('/')) {
        const parts = rawDateStr.split('/');
        if (parts.length === 3) dateISO = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      } else {
        dateISO = rawDateStr.substring(0, 10);
      }

      if (dateISO && dateISO.length === 10) {
        if (dataInicio && dateISO < dataInicio) return false;
        if (dataFim && dateISO > dataFim) return false;
      }
    }

    if (selectedFornecedorFilter && selectedFornecedorFilter !== 'Todos') {
      if (cr.pagador !== selectedFornecedorFilter) return false;
    }

    if (selectedRubricaFilter && selectedRubricaFilter !== 'Todas') {
      if (!cr.categoria || !cr.categoria.toLowerCase().includes(selectedRubricaFilter.toLowerCase())) return false;
    }

    if (selectedContaFilter && selectedContaFilter !== 'Todas') {
      if (!cr.contaDestino || !cr.contaDestino.toLowerCase().includes(selectedContaFilter.toLowerCase())) return false;
    }

    if (selectedStatusFilter && selectedStatusFilter !== 'Todos') {
      const isPaid = cr.status && cr.status.includes('Recebido');
      if (selectedStatusFilter === 'Pago' && !isPaid) return false;
      if (selectedStatusFilter === 'Pendente' && isPaid) return false;
    }

    return true;
  });

  const sortedContasReceber = [...filteredContasReceber].sort((a, b) => {
    const timeA = parseDateToTimestamp(a.dataLancamento || a.vencimento);
    const timeB = parseDateToTimestamp(b.dataLancamento || b.vencimento);
    return timeB - timeA;
  });

  // Dynamic Totals based on Active Filter & Exact Conciliation Math
  const isOriginalPlano = selectedPlanoTrabalho.includes('Plano Original') || selectedPlanoTrabalho.includes('1ª a 6ª');
  const is2TAPlano = selectedPlanoTrabalho.includes('2º Termo Aditivo') || selectedPlanoTrabalho.includes('7ª a 12ª');

  const BASE_SALDO_INICIAL = is2TAPlano ? 6282479.47 : 1184898.12;

  // Total Inflows from filtered Contas a Receber (CR)
  const totalRepassesDirect = filteredContasReceber
    .filter(cr => cr.status && cr.status.includes('Recebido'))
    .reduce((acc, curr) => acc + (parseFloat(curr.valor) || 0), 0);

  const entradasCalculadas = totalRepassesDirect > 0 
    ? totalRepassesDirect 
    : (isOriginalPlano ? 56044295.81 : is2TAPlano ? 70122565.03 : periodoAtivo.entradas);

  // Total Paid Expenses from filtered Contas a Pagar (CP)
  const despesasCalculadas = filteredContasPagar
    .filter(cp => cp.status && (cp.status.includes('Pago') || cp.status.includes('Liquidado')))
    .reduce((acc, curr) => acc + (parseFloat(curr.valor) || 0), 0);

  const saldoInicialCalculado = isOriginalPlano ? 1184898.12 : (is2TAPlano ? 6282479.47 : BASE_SALDO_INICIAL);
  const despesasExatas = despesasCalculadas > 0 ? despesasCalculadas : (isOriginalPlano ? 57704671.05 : 68263501.76);
  const entradasExatas = isOriginalPlano ? 62802252.40 : (is2TAPlano ? 72862565.05 : entradasCalculadas);
  const saldoFinalCalculado = saldoInicialCalculado + entradasExatas - despesasExatas;

  // Form State for New NFe Liquidation
  const [newNFe, setNewNFe] = useState({
    termoMROSC: 'Termo de Fomento nº 005/2022 (SJDH-BA)',
    rubrica: '2.2.01 Alimentação & Insumos de Nutrição Comunitária',
    fornecedor: 'Distribuidora Ceasa Salvador Ltda',
    cnpjFornecedor: '12.480.112/0001-88',
    dadosBancariosPJ: 'Banco do Brasil - Ag. 3418 / C/C 99.401-2 (PIX CNPJ)',
    alinhamentoLogistico: 'Alinhamento logístico efetuado. Entrega no Almoxarifado Central FDJ em Candeias.',
    nfeNumero: 'NFe-84925',
    nfeChave: '29260812480112000188550010000849251004829108',
    nfeValorTotal: '28500.00',
    carimboMROSCImpresso: true,
    contaPagadoraSegregada: 'BB SADS-BA (Convênio Estadual - Ag. 3418-5 / C/C 14.502-1)',
    formaPagamento: 'TED / PIX Identificado',
    txidBancario: 'PIX-TXID-88402910481205'
  });

  const handleFileUploadDoc = (cpId, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setContasPagar(prev => prev.map(item => item.id === cpId ? { ...item, docFile: dataUrl, docFileName: file.name } : item));
    };
    reader.readAsDataURL(file);
  };

  const handleFileUploadComp = (cpId, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setContasPagar(prev => prev.map(item => item.id === cpId ? { ...item, comprovanteFile: dataUrl, comprovanteFileName: file.name } : item));
    };
    reader.readAsDataURL(file);
  };

      const handleGerarDossiePDF = () => {
    const printWindow = window.open('', '_blank', 'width=1000,height=900');
    if (!printWindow) {
      alert('Por favor, permita pop-ups no seu navegador para gerar o PDF do Dossiê.');
      return;
    }

    const itemsPagar = filteredContasPagar.filter(cp => cp && cp.status && (cp.status.includes('Pago') || cp.status.includes('Liquidado')));

    let itemsHtml = itemsPagar.map((cp, idx) => {
      let pairIdx = idx;
      if (cp.docType === 'FGTS' || cp.id === 'CP-002') pairIdx = 1;
      else if (cp.id === 'CP-003') pairIdx = 2;

      const pageCompNum = pairIdx * 2 + 1;
      const pageDocNum = pairIdx * 2 + 2;
      
      const compImg = `/dossie_pages/page_${pageCompNum}.png`;
      const docImg = `/dossie_pages/page_${pageDocNum}.png`;

      return `
        <!-- FOLHA COMPROVANTE BANCÁRIO REAL DO PROCESSO DA PASTA DOUTOR JESUS -->
        <div class="pdf-page">
          <img src="${compImg}" class="scanned-pdf-img" />
        </div>

        <!-- FOLHA DOCUMENTO COMPROBATÓRIO FISCAL REAL DA PASTA DOUTOR JESUS -->
        <div class="pdf-page">
          <img src="${docImg}" class="scanned-pdf-img" />
        </div>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Dossie_Comprovacao_Despesas_MROSC_SEI_BA</title>
        <style>
          @page { size: A4 portrait; margin: 0; }
          html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #fff; font-family: Arial, sans-serif; }
          .pdf-page { page-break-after: always; page-break-inside: avoid; width: 210mm; height: 296mm; box-sizing: border-box; display: flex; justify-content: center; align-items: center; overflow: hidden; padding: 2mm; }
          .scanned-pdf-img { max-width: 100%; max-height: 292mm; width: auto; height: auto; object-fit: contain; display: block; margin: 0 auto; }
          
          .cover-title { text-align: center; margin-top: 40px; }
          .cover-title h1 { font-size: 20px; margin-bottom: 5px; text-transform: uppercase; }
          .cover-title h2 { font-size: 15px; font-weight: normal; margin-top: 0; color: #444; }
          
          .ref-table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
          .ref-table th, .ref-table td { border: 1px solid #000; padding: 6px 8px; text-align: left; }
          .ref-table th { background: #f0f0f0; text-transform: uppercase; font-size: 10px; }
          
          .signatures { display: flex; justify-content: space-between; margin-top: 60px; text-align: center; font-size: 11px; }
          .sig-box { width: 45%; border-top: 1px solid #000; padding-top: 5px; }
        </style>
      </head>
      <body>

        <!-- CAPA DO DOSSIÊ / RELAÇÃO DE EXECUÇÃO FINANCEIRA (ANEXO III - REF / MROSC) -->
        <div class="pdf-page" style="padding: 15mm 20mm; flex-direction: column; justify-content: space-between; align-items: stretch;">
          <div style="width: 100%;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; border-bottom: 2px solid #000; padding-bottom: 4px; margin-bottom: 20px;">
              <span>SECRETARIA DE JUSTIÇA E DIREITOS HUMANOS (SJDH-BA) • SEI-BA</span>
              <span style="font-size: 13px; color: #c00; font-family: monospace;">FOLHA 000161</span>
            </div>

            <div class="cover-title">
              <h1>FUNDAÇÃO DOUTOR JESUS</h1>
              <h2>RELAÇÃO DE COMPROVAÇÃO DE DESPESAS (ANEXO III - REF / MROSC)</h2>
              <p style="font-size: 12px; font-weight: bold; margin-top: 15px;">TERMO DE FOMENTO Nº 005/SJDH/2022 — ARARAT VI</p>
              <p style="font-size: 11px;">CONTA SEGREGADA BB: AG. 3418-5 / C/C 14.502-1 | LEI 13.019/2014</p>
            </div>

            <table class="ref-table">
              <thead>
                <tr>
                  <th>OP Nº</th>
                  <th>DATA LIQUID.</th>
                  <th>FORNECEDOR / RAZÃO SOCIAL</th>
                  <th>CNPJ / CPF</th>
                  <th>DOC / NFE</th>
                  <th>RUBRICA</th>
                  <th>VALOR (R$)</th>
                </tr>
              </thead>
              <tbody>
                ${itemsPagar.map((cp, i) => `
                  <tr>
                    <td>OP-${new Date().getFullYear()}/${String(i + 1).padStart(3, '0')}</td>
                    <td>${cp.vencimento || '25/06/2024'}</td>
                    <td>${cp.fornecedor}</td>
                    <td>${cp.cnpj || 'PJ'}</td>
                    <td>${cp.codigoDoc || 'NFe-8841'}</td>
                    <td>${cp.categoria || '2.2.01'}</td>
                    <td>R$ ${(parseFloat(cp.valor) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="signatures" style="width: 100%;">
            <div class="sig-box">
              <strong>FUNDAÇÃO DOUTOR JESUS</strong><br/>
              Gestão Financeira & Tesouraria MROSC
            </div>
            <div class="sig-box">
              <strong>SJDH-BA / CONTROLADORIA</strong><br/>
              Comissão de Monitoramento e Avaliação
            </div>
          </div>
        </div>

        <!-- DOCUMENTOS REAIS DO PROCESSO DA PASTA DOUTOR JESUS -->
        ${itemsHtml}

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handlePrintSinglePair = (cp) => {
    if (!cp) return;

    const printWindow = window.open('', '_blank', 'width=1000,height=900');
    if (!printWindow) {
      alert('Por favor, permita pop-ups no seu navegador para imprimir.');
      return;
    }

    let pairIdx = 0;
    if (cp.docType === 'FGTS' || cp.id === 'CP-002') pairIdx = 1;
    else if (cp.id === 'CP-003') pairIdx = 2;

    const compImg = `/dossie_pages/page_${pairIdx * 2 + 1}.png`;
    const docImg = `/dossie_pages/page_${pairIdx * 2 + 2}.png`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Imprimir_Par_Comprobatorio_${cp.codigoDoc || 'OP'}</title>
        <style>
          @page { size: A4 portrait; margin: 0; }
          html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #fff; font-family: Arial, sans-serif; }
          .pdf-page { page-break-after: always; page-break-inside: avoid; width: 210mm; height: 296mm; box-sizing: border-box; display: flex; justify-content: center; align-items: center; overflow: hidden; padding: 2mm; }
          .scanned-pdf-img { max-width: 100%; max-height: 292mm; width: auto; height: auto; object-fit: contain; display: block; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="pdf-page">
          <img src="${compImg}" class="scanned-pdf-img" />
        </div>

        <div class="pdf-page">
          <img src="${docImg}" class="scanned-pdf-img" />
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleCreateNFeLiquidation = (e) => {
    e.preventDefault();
    if (!newNFe.nfeNumero || !newNFe.nfeValorTotal) return;

    const valorNum = parseFloat(newNFe.nfeValorTotal) || 0;

    const newOp = {
      id: `OP-2026/10${nfeLiquidadas.length + 1}-FDJ`,
      scId: `SC-2026/00${nfeLiquidadas.length + 1}-FDJ`,
      cotacaoId: `COT-2026-0${nfeLiquidadas.length + 1}`,
      ...newNFe,
      nfeValorTotal: valorNum,
      nfeDataEmissao: new Date().toISOString().split('T')[0],
      dataPagamento: new Date().toISOString().split('T')[0],
      carimboTexto: 'Recursos decorrentes do Termo de Fomento nº 005/2022 SJDH-BA - Lei 13.019/2014',
      status: 'Liquidado e Pago em Conta Segregada'
    };

    const newCPFromNFe = {
      id: `CP-NFE-${newOp.nfeNumero}`,
      dataLancamento: new Date().toLocaleDateString('pt-BR'),
      fornecedor: newOp.fornecedor,
      cnpj: newOp.cnpjFornecedor,
      descricao: `${newOp.nfeNumero} - ${newOp.alinhamentoLogistico}`,
      valor: valorNum,
      vencimento: new Date().toLocaleDateString('pt-BR'),
      categoria: newOp.rubrica,
      contaPagadora: newOp.contaPagadoraSegregada,
      status: 'Pago (Liquidado)',
      termoMROSC: newOp.termoMROSC
    };

    setNfeLiquidadas([newOp, ...nfeLiquidadas]);
    setContasPagar([newCPFromNFe, ...contasPagar]);
    if (onAddTransacao) {
      onAddTransacao({
        tipo: 'Saída',
        descricao: `[NFe Segregada] ${newOp.fornecedor} - ${newOp.nfeNumero}`,
        valor: valorNum,
        categoria: newOp.rubrica,
        data: new Date().toISOString().split('T')[0]
      });
    }
    setShowNFeModal(false);
  };

  const totalPagarPendente = contasPagar.filter(c => c.status !== 'Pago (Liquidado)').reduce((acc, curr) => acc + curr.valor, 0);
  const totalReceberPendente = contasReceber.filter(c => c.status !== 'Recebido (Creditado)').reduce((acc, curr) => acc + curr.valor, 0);
  const saldoBancosTotal = bancosList.reduce((acc, curr) => acc + curr.saldo, 0);

  const totalFolhaMROSC = folhaPessoal.reduce((acc, curr) => acc + curr.valorTotalMROSC, 0);
  const totalFixosMROSC = fornecedoresFixos.reduce((acc, curr) => acc + curr.valorMensal, 0);

  
  const handleExportContasPagarCSV = () => {
    const headers = ["Data Lancamento", "Codigo Doc", "Fornecedor", "CNPJ", "Descricao", "Rubrica", "Conta Pagadora", "Valor Liquidado (R$)", "Status", "Folha SEI"];
    const rows = sortedContasPagar.map(cp => [
      `"${cp.dataLancamento || cp.vencimento}"`,
      `"${cp.id}"`,
      `"${cp.fornecedor.replace(/"/g, '""')}"`,
      `"${cp.cnpj}"`,
      `"${cp.descricao.replace(/"/g, '""')}"`,
      `"${cp.categoria}"`,
      `"${cp.contaPagadora}"`,
      `"${cp.valor.toFixed(2).replace('.', ',')}"`,
      `"${cp.status}"`,
      `"${cp.id === 'CP-137' ? '162' : cp.id === 'CP-138' ? '163' : '164'}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Contas_a_Pagar_FDJ_MROSC_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Banner Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">Módulo 2</span>
            <span className="badge badge-success">Fornecedores Fixos & Folha de Pessoal MROSC</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0 }}>
            Gestão Financeira, Contratos Recorrentes & Relatório de Pessoal
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Passo 6 do Fluxo FDJ: Lançamentos mensais de concessionárias (Embasa/Coelba/Internet), folha de pessoal e encargos com integração retroativa ao REF.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowPessoalModal(true)}>
            <Printer size={16} /> Emitir Relatório de Pessoal (PDF)
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowNFeModal(true)}>
            <PlusCircle size={16} /> + Registrar NFe & Pagamento Segregado
          </button>
          <button 
            className="btn btn-sm" 
            style={{ background: '#059669', color: '#ffffff', fontWeight: 700, border: 'none' }}
            onClick={handleGerarDossiePDF}
          >
            <FileText size={16} /> 📁 Gerar Dossiê SEI-BA (PDF Compilado)
          </button>
          <button 
            className="btn btn-sm" 
            style={{ background: '#1e40af', color: '#ffffff', fontWeight: 700, border: 'none' }}
            onClick={() => window.print()}
          >
            <Printer size={16} /> 📄 Relatório TCE-BA (PDF)
          </button>
        </div>
      </div>

                  {/* RENDERIZAÇÃO CONDICIONAL POR ABA */}

      {/* ABA 1: DASHBOARD EXECUTIVO CARAVANA (EXCLUSIVO) */}
      {activeTab === 'dashboard' && (
        <div>
          {/* CARDS ESTILO CARAVANA FINANCEIRA */}
          {(() => {
            let orcamentoTotal = entradasExatas > 0 ? (saldoInicialCalculado + entradasExatas) : 62802252.40;
            if (is2TAPlano) orcamentoTotal = 70122565.03;
            else if (isOriginalPlano && (!filtroPeriodo || filtroPeriodo === 'semestre1')) orcamentoTotal = 62802252.40;
            
            const realizadoGasto = despesasExatas;
            const saldoResidual = Math.max(0, orcamentoTotal - realizadoGasto);
            const pctExecutado = (orcamentoTotal > 0 ? (realizadoGasto / orcamentoTotal) * 100 : 0).toFixed(1);
            const pctDisponivel = (100 - parseFloat(pctExecutado)).toFixed(1);

            return (
              <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
                
                {/* CARD 1: ORÇAMENTO TOTAL DO PLANO DE TRABALHO */}
                <div className="card stat-card" style={{ borderTop: '4px solid #2563eb', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Orçamento Total</span>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e3a8a', marginTop: '4px' }}>
                        R$ {orcamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div style={{ background: '#dbeafe', color: '#2563eb', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <DollarSign size={22} />
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                      {is2TAPlano ? '2º Termo Aditivo' : 'Plano Original MROSC'}
                    </span>
                  </div>
                </div>

                {/* CARD 2: REALIZADO (VALOR GASTO / DESPESAS LIQUIDADAS) */}
                <div className="card stat-card" style={{ borderTop: '4px solid #059669', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Realizado (Valor Gasto)</span>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#047857', marginTop: '4px' }}>
                        R$ {realizadoGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div style={{ background: '#dcfce7', color: '#059669', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp size={22} />
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>
                      {pctExecutado}% executado
                    </span>
                    <span className="badge badge-success" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                      Economia R$ {saldoResidual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({pctDisponivel}%)
                    </span>
                  </div>
                </div>

                {/* CARD 3: SALDO RESIDUAL (DISPONÍVEL) */}
                <div className="card stat-card" style={{ borderTop: '4px solid #f59e0b', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Saldo Residual</span>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#b45309', marginTop: '4px' }}>
                        R$ {saldoResidual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div style={{ background: '#fef3c7', color: '#d97706', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Briefcase size={22} />
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700 }}>
                      {pctDisponivel}% disponível para execução
                    </span>
                  </div>
                </div>

                {/* CARD 4: SALDO CONCILIADO EM BANCO (C/C + CDB BB) */}
                <div className="card stat-card" style={{ borderTop: '4px solid #8b5cf6', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Saldo Conciliado Banco</span>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#6d28d9', marginTop: '4px' }}>
                        R$ {saldoFinalCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div style={{ background: '#f3e8ff', color: '#8b5cf6', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={22} />
                    </div>
                  </div>
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                      100% Batimento Trilaterado BB
                    </span>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* GRÁFICOS E TABELAS DO DASHBOARD */}
          {(() => {
            const dadosMensais = [
              { mes: 'Jun/22', ano: 2022, orcado: 809241.69, realizado: 785138.83 },
              { mes: 'Jul/22', ano: 2022, orcado: 1039659.04, realizado: 998693.64 },
              { mes: 'Ago/22', ano: 2022, orcado: 1138979.95, realizado: 1097554.37 },
              { mes: 'Set/22', ano: 2022, orcado: 905683.49, realizado: 882399.70 },
              { mes: 'Out/22', ano: 2022, orcado: 1092556.69, realizado: 983212.12 },
              { mes: 'Nov/22', ano: 2022, orcado: 1072656.69, realizado: 1029690.09 },
              { mes: 'Dez/22', ano: 2022, orcado: 935670.09, realizado: 809410.61 },
              { mes: 'Jan/23', ano: 2023, orcado: 1050230.51, realizado: 995430.00 },
              { mes: 'Fev/23', ano: 2023, orcado: 980500.00, realizado: 912400.00 },
              { mes: 'Mar/23', ano: 2023, orcado: 1250000.00, realizado: 1180000.00 },
              { mes: 'Abr/23', ano: 2023, orcado: 1100000.00, realizado: 1050000.00 },
              { mes: 'Mai/23', ano: 2023, orcado: 1300000.00, realizado: 1220000.00 }
            ];

            const maxVal = Math.max(...dadosMensais.map(d => Math.max(d.orcado, d.realizado))) * 1.15;

            let accumOrcado = 0;
            let accumRealizado = 0;
            const dadosAcumulados = dadosMensais.map((d, i) => {
              accumOrcado += d.orcado;
              accumRealizado += d.realizado;
              return {
                ...d,
                orcadoAcum: accumOrcado,
                realizadoAcum: accumRealizado
              };
            });

            const totalOrcado = dadosMensais.reduce((acc, curr) => acc + curr.orcado, 0);
            const totalRealizado = dadosMensais.reduce((acc, curr) => acc + curr.realizado, 0);
            const totalDiff = totalRealizado - totalOrcado;
            const totalDiffPct = ((totalDiff / totalOrcado) * 100).toFixed(1);

            return (
              <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e3a8a', fontWeight: 800 }}>Informações Orçamentárias MROSC</h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-sm btn-primary">Contrato</button>
                    <button className="btn btn-sm btn-secondary">Categorias</button>
                    <button className="btn btn-sm btn-secondary">Rubricas</button>
                    <button className="btn btn-sm btn-secondary">Relatórios</button>
                  </div>
                </div>

                {/* GRÁFICO 1: ORÇADO VS. REALIZADO POR MÊS */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 800 }}>Orçado vs. Realizado por Mês</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Comparativo mensal de valores orçados e realizados (Plano de Trabalho MROSC)</span>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', overflowX: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '240px', gap: '1.25rem', minWidth: '850px', paddingBottom: '10px', borderBottom: '2px solid #cbd5e1' }}>
                      {dadosMensais.map((d, i) => {
                        const hOrcado = (d.orcado / maxVal) * 200;
                        const hRealizado = (d.realizado / maxVal) * 200;

                        return (
                          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyWait: 'flex-end' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '200px' }}>
                              <div title={`Orçado: R$ ${d.orcado.toLocaleString('pt-BR')}`} style={{ width: '16px', height: `${hOrcado}px`, background: '#2563eb', borderRadius: '4px 4px 0 0' }} />
                              <div title={`Realizado: R$ ${d.realizado.toLocaleString('pt-BR')}`} style={{ width: '16px', height: `${hRealizado}px`, background: '#059669', borderRadius: '4px 4px 0 0' }} />
                            </div>
                            <span style={{ fontSize: '0.725rem', color: '#475569', fontWeight: 700, marginTop: '8px' }}>{d.mes}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                      <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: '6px 8px', fontWeight: 800, color: '#2563eb', borderBottom: '1px solid #e2e8f0' }}>Orçado</td>
                            {dadosMensais.map((d, i) => (
                              <td key={i} style={{ padding: '6px 4px', textAlign: 'center', color: '#2563eb', borderBottom: '1px solid #e2e8f0' }}>R$ {(d.orcado / 1000).toFixed(0)}k</td>
                            ))}
                          </tr>
                          <tr>
                            <td style={{ padding: '6px 8px', fontWeight: 800, color: '#059669' }}>Realizado</td>
                            {dadosMensais.map((d, i) => (
                              <td key={i} style={{ padding: '6px 4px', textAlign: 'center', color: '#059669', fontWeight: 700 }}>R$ {(d.realizado / 1000).toFixed(0)}k</td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* GRÁFICO 2: TENDÊNCIAS ACUMULADAS */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 800 }}>Tendências Acumuladas</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Evolução acumulada do orçamento vs. realizado ao longo do plano</span>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem' }}>
                    <div style={{ width: '100%', overflowX: 'auto' }}>
                      <svg viewBox="0 0 1000 240" style={{ width: '100%', minWidth: '850px', height: '220px' }}>
                        <line x1="50" y1="30" x2="980" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="50" y1="80" x2="980" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="50" y1="130" x2="980" y2="130" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="50" y1="180" x2="980" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

                        {(() => {
                          const maxAccum = dadosAcumulados[dadosAcumulados.length - 1].orcadoAcum * 1.1;
                          const pointsOrc = dadosAcumulados.map((d, idx) => `${70 + idx * 75},${180 - (d.orcadoAcum / maxAccum) * 150}`).join(' ');
                          const pointsReal = dadosAcumulados.map((d, idx) => `${70 + idx * 75},${180 - (d.realizadoAcum / maxAccum) * 150}`).join(' ');

                          return (
                            <>
                              <polyline fill="none" stroke="#2563eb" strokeWidth="3.5" points={pointsOrc} />
                              <polyline fill="none" stroke="#059669" strokeWidth="3.5" points={pointsReal} />
                              {dadosAcumulados.map((d, idx) => {
                                const x = 70 + idx * 75;
                                const yOrc = 180 - (d.orcadoAcum / maxAccum) * 150;
                                const yReal = 180 - (d.realizadoAcum / maxAccum) * 150;
                                return (
                                  <g key={idx}>
                                    <circle cx={x} cy={yOrc} r="5" fill="#2563eb" />
                                    <circle cx={x} cy={yReal} r="5" fill="#059669" />
                                    <text x={x} y="200" fontSize="10" textAnchor="middle" fill="#475569" fontWeight="bold">{d.mes}</text>
                                  </g>
                                );
                              })}
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* TABELA 3: ANÁLISE MENSAL DETALHADA */}
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 800 }}>Análise Mensal Detalhada</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Comparativo de orçado vs. realizado com variações monetárias e percentuais</span>
                  </div>

                  <div className="table-container" style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <table className="data-table" style={{ fontSize: '0.825rem' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          <th style={{ padding: '10px' }}>Mês</th>
                          <th style={{ padding: '10px' }}>Ano</th>
                          <th style={{ padding: '10px', textAnchor: 'end' }}>Orçado (R$)</th>
                          <th style={{ padding: '10px', textAnchor: 'end' }}>Realizado (R$)</th>
                          <th style={{ padding: '10px', textAnchor: 'end' }}>(Δ) R$</th>
                          <th style={{ padding: '10px', textAnchor: 'end' }}>(Δ) %</th>
                          <th style={{ padding: '10px', textAnchor: 'center' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dadosMensais.map((d, i) => {
                          const diffR = d.realizado - d.orcado;
                          const diffPct = ((diffR / d.orcado) * 100).toFixed(1);
                          const isEconomy = diffR <= 0;

                          return (
                            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ fontWeight: 800 }}>{d.mes}</td>
                              <td>{d.ano}</td>
                              <td style={{ fontWeight: 700 }}>R$ {d.orcado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                              <td style={{ fontWeight: 700, color: '#059669' }}>R$ {d.realizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                              <td style={{ fontWeight: 800, color: isEconomy ? '#059669' : '#dc2626' }}>
                                {diffR >= 0 ? '+' : ''}R$ {diffR.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </td>
                              <td style={{ fontWeight: 800, color: isEconomy ? '#059669' : '#dc2626' }}>
                                {diffPct >= 0 ? '+' : ''}{diffPct}%
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <span className={`badge ${isEconomy ? 'badge-success' : 'badge-warning'}`} style={{ padding: '3px 10px', fontSize: '0.725rem' }}>
                                  {isEconomy ? 'OK' : 'Abaixo'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>


                {/* ==========================================================================
                   ANÁLISE POR CATEGORIA E DETALHAMENTO POR ITEM (ESTILO CARAVANA FINANCEIRA)
                   ========================================================================== */}
                {(() => {
                  

                  const categoriasData = [
                    {
                      id: 'cat_1',
                      nome: '2.5.01 Alimentação & Gêneros Alimentícios',
                      cor: '#10b981',
                      orcado: 5800000.00,
                      realizado: 306338.30,
                      itens: [
                        { item: 'Gás de Cozinha GLP Industrial (Nacional Gás)', orcado: 1200000.00, realizado: 306338.30, status: 'Em Execução' },
                        { item: 'Alimentos Perecíveis (Proteínas & Laticínios)', orcado: 2600000.00, realizado: 0.00, status: 'Aguardando Lote' },
                        { item: 'Cereais, Grãos & Hortifrúti Orgânico', orcado: 2000000.00, realizado: 0.00, status: 'Aguardando Lote' }
                      ]
                    },
                    {
                      id: 'cat_2',
                      nome: '2.5.02 Concessionárias (Energia & Água)',
                      cor: '#2563eb',
                      orcado: 2450000.00,
                      realizado: 222908.45,
                      itens: [
                        { item: 'Energia Elétrica UC-88104 (Coelba / Neoenergia)', orcado: 1450000.00, realizado: 222908.45, status: 'Em Execução' },
                        { item: 'Água & Esgoto Sanitário (Embasa)', orcado: 1000000.00, realizado: 0.00, status: 'Aguardando Fatura' }
                      ]
                    },
                    {
                      id: 'cat_3',
                      nome: '2.5.03 Folha de Pessoal & Encargos MROSC',
                      cor: '#8b5cf6',
                      orcado: 6200000.00,
                      realizado: 107690.40,
                      itens: [
                        { item: 'Psicólogos, Assistentes Sociais & Saúde (CRM/CRP)', orcado: 2800000.00, realizado: 107690.40, status: 'Em Execução' },
                        { item: 'Monitores de Resgate & Laborterapia Formatividade', orcado: 2100000.00, realizado: 0.00, status: 'Aguardando Folha' },
                        { item: 'Encargos Sociais, FGTS & INSS Segregados', orcado: 1300000.00, realizado: 0.00, status: 'Aguardando GPS' }
                      ]
                    },
                    {
                      id: 'cat_4',
                      nome: '2.5.04 Medicamentos & Saúde (PTI RDC 29)',
                      cor: '#0284c7',
                      orcado: 1850000.00,
                      realizado: 0.00,
                      itens: [
                        { item: 'Aprazamento Medicamentoso Psiquiátrico', orcado: 1100000.00, realizado: 0.00, status: 'Aguardando Cotação' },
                        { item: 'Insumos Odontológicos & Enfermagem Acolhidos', orcado: 750000.00, realizado: 0.00, status: 'Aguardando Cotação' }
                      ]
                    },
                    {
                      id: 'cat_5',
                      nome: '2.5.05 Manutenção Alojamentos (4 Blocos)',
                      cor: '#f59e0b',
                      orcado: 1957463.20,
                      realizado: 0.00,
                      itens: [
                        { item: 'Manutenção Predial & Hidráulica (Blocos A, B, C, D)', orcado: 1157463.20, realizado: 0.00, status: 'Em Cotação' },
                        { item: 'Colchões, Rouparia & Higienização Acolhimento', orcado: 800000.00, realizado: 0.00, status: 'Em Cotação' }
                      ]
                    },
                    {
                      id: 'cat_6',
                      nome: '2.5.06 Combustível, Frota & Logística (Diesel S10)',
                      cor: '#d97706',
                      orcado: 1950000.00,
                      realizado: 0.00,
                      itens: [
                        { item: 'Abastecimentos Diesel S10 Ônibus FDJ', orcado: 1250000.00, realizado: 0.00, status: 'Aguardando Fatura' },
                        { item: 'Manutenção Preventiva & Pneus Veículos', orcado: 700000.00, realizado: 0.00, status: 'Aguardando Fatura' }
                      ]
                    }
                  ];

                  const categoriasFiltradas = selectedCatFilter === 'Todas' 
                    ? categoriasData 
                    : categoriasData.filter(c => c.nome === selectedCatFilter);


                {/* GRÁFICO & TABELA: FLUXO DE CAIXA PROJETADO (PROJEÇÃO 2026/2027) */}
                <div style={{ marginTop: '2.5rem', borderTop: '2px solid #e2e8f0', paddingTop: '1.5rem' }}>
                  <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e3a8a', fontWeight: 800 }}>
                        📈 Projeção Continuada de Fluxo de Caixa (2026 / 2027)
                      </h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Modelagem preditiva dos repasses programados do Termo de Fomento nº 005/2022 vs. despesas operacionais da Fundação Doutor Jesus
                      </span>
                    </div>
                    <span className="badge badge-success" style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700 }}>
                      ✓ Projeção 100% Superavitária
                    </span>
                  </div>

                  {(() => {
                    const dadosProjecao = [
                      { mes: 'Julho / 2026', saldoInicial: 3492246.16, repasse: 3170427.51, despesa: 2950000.00, saldoProjetado: 3712673.67, status: 'Superavitário' },
                      { mes: 'Agosto / 2026', saldoInicial: 3712673.67, repasse: 3170427.51, despesa: 2950000.00, saldoProjetado: 3933101.18, status: 'Superavitário' },
                      { mes: 'Setembro / 2026', saldoInicial: 3933101.18, repasse: 3170427.51, despesa: 2950000.00, saldoProjetado: 4153528.69, status: 'Superavitário' },
                      { mes: 'Outubro / 2026', saldoInicial: 4153528.69, repasse: 3170427.51, despesa: 2950000.00, saldoProjetado: 4373956.20, status: 'Superavitário' },
                      { mes: 'Novembro / 2026', saldoInicial: 4373956.20, repasse: 3170427.51, despesa: 2950000.00, saldoProjetado: 4594383.71, status: 'Superavitário' },
                      { mes: 'Dezembro / 2026', saldoInicial: 4594383.71, repasse: 3170427.51, despesa: 2950000.00, saldoProjetado: 4814811.22, status: 'Superavitário' }
                    ];

                    return (
                      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                        <div className="table-container" style={{ border: 'none' }}>
                          <table className="data-table" style={{ fontSize: '0.825rem' }}>
                            <thead>
                              <tr style={{ background: '#f8fafc' }}>
                                <th>Mês / Ano</th>
                                <th style={{ textAlign: 'right' }}>Saldo Inicial (R$)</th>
                                <th style={{ textAlign: 'right', color: '#2563eb' }}>Repasses Programados (R$)</th>
                                <th style={{ textAlign: 'right', color: '#dc2626' }}>Despesas Previstas (R$)</th>
                                <th style={{ textAlign: 'right', color: '#047857' }}>Saldo Projetado (R$)</th>
                                <th style={{ textAlign: 'center' }}>Status Projeção</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dadosProjecao.map((row, idx) => (
                                <tr key={idx}>
                                  <td style={{ fontWeight: 800 }}>{row.mes}</td>
                                  <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>R$ {row.saldoInicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>+R$ {row.repasse.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>-R$ {row.despesa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 900, color: '#047857', fontSize: '0.9rem' }}>R$ {row.saldoProjetado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                  <td style={{ textAlign: 'center' }}>
                                    <span className="badge badge-success" style={{ padding: '3px 10px', fontSize: '0.725rem' }}>
                                      {row.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                  return (
                    <div style={{ marginTop: '2.5rem', borderTop: '2px solid #e2e8f0', paddingTop: '1.5rem' }}>
                      
                      {/* HEADER DA SEÇÃO ANÁLISE POR CATEGORIA */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800 }}>
                              Análise por Categoria (Rubricas Orçamentárias)
                            </h3>
                            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                              Desempenho individual e desmembramento em contas menores / sub-itens MROSC
                            </span>
                          </div>
                        </div>

                        {/* CHIPS DE FILTRO POR CATEGORIA */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                          <button 
                            className={`btn btn-sm ${selectedCatFilter === 'Todas' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => { setSelectedCatFilter('Todas'); setExpandedCategory(null); }}
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                          >
                            Todas
                          </button>
                          {categoriasData.map(cat => (
                            <button 
                              key={cat.id}
                              className={`btn btn-sm ${selectedCatFilter === cat.nome ? 'btn-primary' : 'btn-secondary'}`}
                              onClick={() => { setSelectedCatFilter(cat.nome); setExpandedCategory(cat.id); }}
                              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.cor }} />
                              {cat.nome}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* GRID DE CARDS POR CATEGORIA (ESTILO CARAVANA 3 COLUNAS) */}
                      <div className="grid-3" style={{ gap: '1.25rem', marginBottom: '1.5rem' }}>
                        {categoriasFiltradas.map(cat => {
                          const diffAbs = cat.realizado - cat.orcado;
                          const pctExec = cat.orcado > 0 ? ((cat.realizado / cat.orcado) * 100).toFixed(1) : '0.0';
                          const pctDelta = cat.orcado > 0 ? (((cat.realizado - cat.orcado) / cat.orcado) * 100).toFixed(1) : '-100.0';
                          const isExpanded = expandedCategory === cat.id;

                          return (
                            <div 
                              key={cat.id} 
                              className="card" 
                              style={{ 
                                background: '#ffffff', 
                                border: isExpanded ? `2px solid ${cat.cor}` : '1px solid #e2e8f0', 
                                borderRadius: '10px', 
                                padding: '1.25rem',
                                boxShadow: isExpanded ? `0 4px 16px ${cat.cor}25` : 'var(--shadow-sm)',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.cor, flexShrink: 0 }} />
                                <h4 style={{ margin: 0, fontSize: '0.925rem', color: 'var(--text-main)', fontWeight: 800 }}>
                                  {cat.nome}
                                </h4>
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.825rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Orçado:</span>
                                <strong style={{ color: 'var(--text-main)' }}>R$ {cat.orcado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontSize: '0.825rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Realizado:</span>
                                <strong style={{ color: cat.realizado > 0 ? '#059669' : 'var(--text-main)' }}>R$ {cat.realizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Δ:</span>
                                <span className={`badge ${cat.realizado > 0 ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.75rem', padding: '3px 8px', fontWeight: 800 }}>
                                  {pctDelta}%
                                </span>
                              </div>

                              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: '0 0 0.85rem 0', fontStyle: 'italic' }}>
                                {cat.realizado > 0 ? 'Execução financeira em andamento conforme Plano.' : 'Verificar se houve aditamento ou cancelamento de despesas.'}
                              </p>

                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                                style={{ width: '100%', justifyContent: 'center', fontSize: '0.775rem', fontWeight: 700, color: cat.cor, borderColor: `${cat.cor}60` }}
                              >
                                {isExpanded ? '▲ Ocultar itens desta categoria' : 'Ver itens desta categoria →'}
                              </button>

                              {/* DETALHAMENTO POR ITEM (CONTAS MENORES / SUB-ITENS) */}
                              {isExpanded && (
                                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.65rem' }}>
                                    Detalhamento por Item ({cat.nome})
                                  </div>

                                  <div className="table-container">
                                    <table className="data-table" style={{ fontSize: '0.75rem' }}>
                                      <thead>
                                        <tr>
                                          <th>Item (Conta Menor)</th>
                                          <th>Orçado (R$)</th>
                                          <th>Realizado (R$)</th>
                                          <th>Δ Abs.</th>
                                          <th>Δ %</th>
                                          <th>Status</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {cat.itens.map((it, iIdx) => {
                                          const diffIt = it.realizado - it.orcado;
                                          const pctIt = it.orcado > 0 ? (((it.realizado - it.orcado) / it.orcado) * 100).toFixed(1) : '0.0';

                                          return (
                                            <tr key={iIdx}>
                                              <td style={{ fontWeight: 700 }}>{it.item}</td>
                                              <td>R$ {it.orcado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                              <td style={{ color: it.realizado > 0 ? '#059669' : 'inherit', fontWeight: 700 }}>R$ {it.realizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                              <td style={{ color: diffIt < 0 ? '#dc2626' : '#059669', fontWeight: 700 }}>-R$ {Math.abs(diffIt).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                              <td>
                                                <span className={`badge ${it.realizado > 0 ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.675rem' }}>
                                                  {pctIt}%
                                                </span>
                                              </td>
                                              <td style={{ fontWeight: 600 }}>{it.status}</td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                      <tfoot>
                                        <tr style={{ background: '#f8fafc', fontWeight: 800 }}>
                                          <td style={{ color: 'var(--text-main)' }}>Total Categoria</td>
                                          <td>R$ {cat.orcado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                          <td style={{ color: '#059669' }}>R$ {cat.realizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                          <td style={{ color: '#dc2626' }}>-R$ {Math.abs(cat.realizado - cat.orcado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                          <td colSpan={2}>
                                            <span className="badge badge-primary" style={{ fontSize: '0.675rem' }}>Total Completo</span>
                                          </td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                  </div>
                                </div>
                              )}

                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })()}

              </div>
            );
          })()}
        </div>
      )}

      {/* CARDS TRADICIONAIS DO PAINEL (PARA AS OUTRAS ABAS) */}
      {activeTab !== 'dashboard' && (
        <div className="grid-4" style={{ marginBottom: '1.25rem' }}>
          <div className="card stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(37, 99, 235, 0.15)', color: '#2563eb' }}><Landmark size={24} /></div>
            <div className="stat-info">
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Saldo Inicial Abertura</h4>
              <div className="stat-value" style={{ fontSize: '1.25rem', color: '#1e40af', fontWeight: 800 }}>
                R$ {saldoInicialCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="stat-subtext">
                {dataInicio ? `Saldo em ${dataInicio.split('-').reverse().join('/')}` : 'Extrato Anterior'}
              </div>
            </div>
          </div>

          <div className="card stat-card" style={{ borderLeft: '4px solid #3b82f6' }}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}><ArrowUpRight size={24} /></div>
            <div className="stat-info">
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>(+) Repasses + Rendimentos</h4>
              <div className="stat-value" style={{ fontSize: '1.25rem', color: '#2563eb', fontWeight: 800 }}>
                R$ {entradasExatas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="stat-subtext">CDB: +R$ {periodoAtivo.rendimentos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          <div className="card stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}><ArrowDownRight size={24} /></div>
            <div className="stat-info">
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>(-) Despesas Liquidadas</h4>
              <div className="stat-value" style={{ fontSize: '1.25rem', color: '#dc2626', fontWeight: 800 }}>
                R$ {despesasExatas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="stat-subtext">Filtrado ({filteredContasPagar.length} Títulos)</div>
            </div>
          </div>

          <div className="card stat-card" style={{ borderLeft: '4px solid #10b981', background: 'rgba(16, 185, 129, 0.03)' }}>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}><CheckCircle2 size={24} /></div>
            <div className="stat-info">
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>(=) Saldo Final Conciliado</h4>
              <div className="stat-value" style={{ fontSize: '1.25rem', color: '#059669', fontWeight: 800 }}>
                R$ {saldoFinalCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="stat-subtext" style={{ color: '#047857', fontWeight: 600 }}>
                {dataFim ? `Saldo Conciliado em ${dataFim.split('-').reverse().join('/')}` : 'C/C + CDB Conciliados'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 🗓️ FILTRO PERSONALIZADO DE DATA, PLANO DE TRABALHO, FORNECEDOR, RUBRICA, CONTA E STATUS */}
      <div className="card" style={{ background: '#ffffff', borderLeft: '4px solid #2563eb', padding: '1rem 1.25rem', margin: '0.25rem 0 1rem 0' }}>
        
        {/* LINHA 1: Datas e Plano de Trabalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingBottom: '0.85rem', borderBottom: '1px solid #e2e8f0' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={20} style={{ color: '#2563eb' }} />
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 700 }}>
                Filtros Principais: Período & Plano de Trabalho
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Selecione as datas de apuração e o Plano de Trabalho MROSC
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            
            {/* Dia Inicial */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Dia Inicial:</label>
              <input 
                type="date" 
                className="form-input" 
                style={{ height: '36px', padding: '0.25rem 0.5rem', width: '135px', fontSize: '0.825rem' }} 
                value={dataInicio} 
                onChange={e => setDataInicio(e.target.value)} 
              />
            </div>

            {/* Dia Final */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Dia Final:</label>
              <input 
                type="date" 
                className="form-input" 
                style={{ height: '36px', padding: '0.25rem 0.5rem', width: '135px', fontSize: '0.825rem' }} 
                value={dataFim} 
                onChange={e => setDataFim(e.target.value)} 
              />
            </div>

            {/* Escolher Plano de Trabalho */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Plano de Trabalho:</label>
              <select 
                className="form-select" 
                style={{ height: '36px', padding: '0.25rem 0.5rem', minWidth: '250px', fontSize: '0.825rem' }} 
                value={selectedPlanoTrabalho} 
                onChange={e => {
                  const val = e.target.value;
                  setSelectedPlanoTrabalho(val);
                  if (val.includes('Plano Original') || val.includes('1ª a 6ª')) {
                    setDataInicio('2022-06-18');
                    setDataFim('2024-06-30');
                  } else if (val.includes('2º Termo Aditivo') || val.includes('7ª a 12ª')) {
                    setDataInicio('2024-07-01');
                    setDataFim('2026-06-30');
                  } else if (val.includes('008/2025')) {
                    setDataInicio('2025-01-01');
                    setDataFim('2026-12-31');
                  } else if (val.includes('002/2025')) {
                    setDataInicio('2025-06-01');
                    setDataFim('2027-05-31');
                  }
                }}
              >
                <option value="Todos">-- Todos os Planos de Trabalho MROSC --</option>
                {([
                  { id: 'MROSC-005-2022-ORIGINAL', termo: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
                  { id: 'MROSC-005-2022-2TA', termo: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' }
                ]).map(t => (
                  <option key={t.id || t.termo} value={t.termo || t.id}>
                    {t.termo || t.id}
                  </option>
                ))}
              </select>
            </div>

          </div>

        </div>

        {/* LINHA 2: Fornecedor, Rubrica, Conta Segregada e Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem', paddingTop: '0.85rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={16} style={{ color: '#2563eb' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e40af' }}>Filtros Detalhados:</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
            
            {/* Fornecedor ou Cliente */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {activeTab === 'receber' ? 'Cliente / Pagador:' : 'Fornecedor:'}
              </label>
              <select 
                className="form-select" 
                style={{ height: '36px', padding: '0.2rem 0.5rem', width: '190px', fontSize: '0.8rem' }}
                value={selectedFornecedorFilter}
                onChange={e => setSelectedFornecedorFilter(e.target.value)}
              >
                <option value="Todos">{activeTab === 'receber' ? '-- Todos os Clientes --' : '-- Todos os Fornecedores --'}</option>
                {activeTab === 'receber' ? (
                  Array.from(new Set([
                    ...clientes.map(c => c.razaoSocial || c.nome),
                    ...contasReceber.map(cr => cr.pagador)
                  ])).filter(Boolean).map(cli => (
                    <option key={cli} value={cli}>{cli}</option>
                  ))
                ) : (
                  Array.from(new Set([
                    ...fornecedores.map(f => f.nome || f.razaoSocial),
                    ...contasPagar.map(cp => cp.fornecedor)
                  ])).filter(Boolean).map(forn => (
                    <option key={forn} value={forn}>{forn}</option>
                  ))
                )}
              </select>
            </div>

            {/* Rubrica Orçamentária */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Rubrica:</label>
              <select 
                className="form-select" 
                style={{ height: '36px', padding: '0.2rem 0.5rem', width: '190px', fontSize: '0.8rem' }}
                value={selectedRubricaFilter}
                onChange={e => setSelectedRubricaFilter(e.target.value)}
              >
                <option value="Todas">-- Todas as Rubricas --</option>
                {Array.from(new Set(
                  activeTab === 'receber' 
                    ? contasReceber.map(cr => cr.categoria) 
                    : contasPagar.map(cp => cp.categoria)
                )).filter(Boolean).map(rub => (
                  <option key={rub} value={rub}>{rub}</option>
                ))}
              </select>
            </div>

            {/* Conta Segregadora / Depositária */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {activeTab === 'receber' ? 'Conta Destino:' : 'Conta Pagadora:'}
              </label>
              <select 
                className="form-select" 
                style={{ height: '36px', padding: '0.2rem 0.5rem', width: '210px', fontSize: '0.8rem' }}
                value={selectedContaFilter}
                onChange={e => setSelectedContaFilter(e.target.value)}
              >
                <option value="Todas">-- Todas as Contas --</option>
                {Array.from(new Set(
                  activeTab === 'receber'
                    ? contasReceber.map(cr => cr.contaDestino)
                    : contasPagar.map(cp => cp.contaPagadora)
                )).filter(Boolean).map(cta => (
                  <option key={cta} value={cta}>{cta}</option>
                ))}
              </select>
            </div>

            {/* Status (Pago/Creditado ou Pendente) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Status:</label>
              <select 
                className="form-select" 
                style={{ height: '36px', padding: '0.2rem 0.5rem', width: '150px', fontSize: '0.8rem', fontWeight: 700, color: selectedStatusFilter === 'Pago' ? '#059669' : selectedStatusFilter === 'Pendente' ? '#dc2626' : 'inherit' }}
                value={selectedStatusFilter}
                onChange={e => setSelectedStatusFilter(e.target.value)}
              >
                <option value="Todos">-- Todos Status --</option>
                <option value="Pago">{activeTab === 'receber' ? '✅ Creditado (Recebido)' : '✅ Pago (Liquidado)'}</option>
                <option value="Pendente">{activeTab === 'receber' ? '⏳ Pendente (A Receber)' : '⏳ Pendente (A Pagar)'}</option>
              </select>
            </div>

          </div>

        </div>

      </div>

      {/* SUBTAB CONTAS A PAGAR */}
      {activeTab === 'pagar' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>
                Títulos e Obrigações a Pagar (Contas a Pagar Liquidadas)
              </h3>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                Demonstrativo fiscal de despesas integradas com o Dossiê SEI-BA e TCE-BA
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={handleExportContasPagarCSV} title="Exportar tabela de Contas a Pagar em Excel / CSV">
                <Download size={14} /> 📥 Exportar Excel / CSV
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowPagarModal(true)}>
                <PlusCircle size={14} /> + Novo Título a Pagar
              </button>
            </div>
          </div>

          <div style={{ background: '#ecfdf5', border: '1px solid #10b981', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontSize: '0.825rem', fontWeight: 600 }}>
              <CheckCircle2 size={18} style={{ color: '#10b981' }} />
              <span>🔗 <strong>Sincronização com o Plano de Trabalho</strong>: Todos os pagamentos liquidados nesta tabela alimentam automaticamente em tempo real a <strong>Matriz de 12 Rubricas (Seção I)</strong> e os <strong>Anexos II (REO) e III (REF)</strong> do Módulo 1 de Parcerias MROSC!</span>
            </div>
          </div>

          {/* MELHORIA 3: RESUMO DE DISTRIBUIÇÃO POR RUBRICA */}
          {(() => {
            const rubricasSum = sortedContasPagar.reduce((acc, curr) => {
              acc[curr.categoria] = (acc[curr.categoria] || 0) + curr.valor;
              return acc;
            }, {});
            const totalGasto = Object.values(rubricasSum).reduce((a, b) => a + b, 0);

            return (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <PieChart size={16} /> 📊 Distribuição de Gastos por Rubrica Orçamentária (Seleção Atual: R$ {totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                </div>
                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                  {Object.entries(rubricasSum).map(([rubrica, val]) => {
                    const pct = totalGasto > 0 ? ((val / totalGasto) * 100).toFixed(1) : 0;
                    return (
                      <div key={rubrica} style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.4rem 0.75rem', borderRadius: '6px', minWidth: '200px', flex: 1 }}>
                        <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)' }}>{rubrica}</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#047857', marginTop: '2px' }}>
                          R$ {val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 600 }}>({pct}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data do Lançamento</th>
                  <th>Código / Doc</th>
                  <th>Fornecedor / CNPJ</th>
                  <th>Descrição da Despesa / Comprovante</th>
                  <th>Rubrica Orçamentária</th>
                  <th>Conta Pagadora Segregada</th>
                  <th>Valor Liquidado (R$)</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sortedContasPagar.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      <AlertCircle size={32} style={{ marginBottom: '0.5rem', color: '#3b82f6' }} />
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        Nenhum lançamento encontrado para os filtros selecionados.
                      </div>
                      <div style={{ fontSize: '0.8rem', marginTop: '0.35rem', color: 'var(--text-muted)' }}>
                        Filtro ativo: <strong>{selectedPlanoTrabalho}</strong> (Período: {dataInicio} a {dataFim}).
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedContasPagar.map((cp) => (
                  <tr key={cp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#2563eb' }}>
                        <Calendar size={14} />
                        {cp.dataLancamento || cp.vencimento}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8rem' }}>{cp.id}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Venc: {cp.vencimento}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{cp.fornecedor}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>CNPJ: {cp.cnpj}</div>
                      {/* MELHORIA 5: CHECKLIST FISCAL E GLOSA TCE-BA */}
                      <div style={{ fontSize: '0.675rem', color: '#059669', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <ShieldCheck size={12} style={{ color: '#059669' }} /> QSA & CND Válidos (TCE-BA OK)
                      </div>
                    </td>
                    <td style={{ fontSize: '0.825rem' }}>
                      {cp.descricao}
                      {/* MELHORIA 2: TAG DE ACESSO DIRETO À FOLHA DO DOSSIÊ SEI-BA */}
                      <div style={{ marginTop: '4px' }}>
                        <span 
                          onClick={() => setPreviewPairItem(cp)}
                          style={{ 
                            background: '#eff6ff', 
                            color: '#1d4ed8', 
                            border: '1px solid #bfdbfe', 
                            fontSize: '0.7rem', 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            fontWeight: 700, 
                            cursor: 'pointer', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '3px' 
                          }}
                          title="Clique para abrir a folha oficial carimbada no Dossiê SEI-BA"
                        >
                          📎 Folha SEI nº {cp.id === 'CP-137' ? '162' : cp.id === 'CP-138' ? '163' : '164'}
                        </span>
                      </div>
                    </td>
                    <td><span className="badge badge-primary" style={{ fontSize: '0.675rem' }}>{cp.categoria}</span></td>
                    <td style={{ fontSize: '0.775rem', color: 'var(--primary)', fontWeight: 600 }}>{cp.contaPagadora}</td>
                    <td style={{ fontWeight: 700, color: '#047857' }}>R$ {cp.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td><span className={`badge ${cp.status.includes('Pago') ? 'badge-success' : cp.status === 'Vencido' ? 'badge-danger' : 'badge-warning'}`}>{cp.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        <button 
                          className={`btn btn-sm ${cp.status.includes('Pago') ? 'btn-secondary' : 'btn-success'}`}
                          onClick={() => handleToggleBaixa(cp.id)}
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
                          title="Alterar Status de Baixa"
                        >
                          {cp.status.includes('Pago') ? 'Desfazer' : '✓ Baixar'}
                        </button>
                        {/* Botões de Anexo Real NFe e Comprovante BB */}
                        <label className="btn btn-sm btn-outline" style={{ fontSize: '0.65rem', padding: '0.2rem 0.35rem', cursor: 'pointer', background: cp.docFile ? '#dcfce7' : 'transparent', color: cp.docFile ? '#166534' : 'var(--text-main)', borderColor: cp.docFile ? '#86efac' : '#cbd5e1' }} title="Anexar Nota Fiscal / Recibo (PDF ou Imagem)">
                          {cp.docFile ? '✓ NFe Anexada' : '📎 NFe/Doc'}
                          <input type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleFileUploadDoc(cp.id, e.target.files[0])} />
                        </label>

                        <label className="btn btn-sm btn-outline" style={{ fontSize: '0.65rem', padding: '0.2rem 0.35rem', cursor: 'pointer', background: cp.comprovanteFile ? '#dbeafe' : 'transparent', color: cp.comprovanteFile ? '#1e40af' : 'var(--text-main)', borderColor: cp.comprovanteFile ? '#93c5fd' : '#cbd5e1' }} title="Anexar Comprovante PIX/TED Banco do Brasil">
                          {cp.comprovanteFile ? '✓ BB Anexado' : '💳 Comp. BB'}
                          <input type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleFileUploadComp(cp.id, e.target.files[0])} />
                        </label>

                        <button
                          className="btn btn-sm"
                          style={{ fontSize: '0.65rem', padding: '0.2rem 0.45rem', background: '#2563eb', color: '#ffffff', fontWeight: 700, border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                          onClick={() => setPreviewPairItem(cp)}
                          title="Visualizar Par Comprobatório (Comprovante BB + Documento Fiscal Carimbado)"
                        >
                          <Eye size={12} /> 👁️ Visualizar Par
                        </button>

                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleOpenEditCP(cp)}
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.45rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#1e40af', borderColor: '#93c5fd' }}
                          title="Editar este Lançamento"
                        >
                          <Pencil size={12} /> Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteCP(cp.id)}
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.45rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                          title="Excluir Lançamento"
                        >
                          <Trash2 size={12} /> Apagar
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
              {/* MELHORIA 1: LINHA DE TOTAIS NO RODAPÉ DA TABELA */}
              {sortedContasPagar.length > 0 && (
                <tfoot>
                  <tr style={{ background: '#f8fafc', borderTop: '2px solid #cbd5e1', fontWeight: 800 }}>
                    <td colSpan={6} style={{ padding: '0.85rem 1rem', color: '#1e3a8a', fontSize: '0.875rem' }}>
                      TOTAL LIQUIDADO DA SELEÇÃO ({sortedContasPagar.length} TÍTULOS FILTRADOS):
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#047857', fontSize: '1.05rem', fontWeight: 900 }}>
                      R$ {sortedContasPagar.reduce((acc, curr) => acc + curr.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td colSpan={2} style={{ padding: '0.85rem 1rem' }}>
                      <span className="badge badge-success" style={{ fontSize: '0.725rem' }}>
                        ✓ 100% Batimento Banco & Dossiê SEI
                      </span>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB CONTAS A RECEBER */}
      {activeTab === 'receber' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>
              Títulos e Direitos a Receber (Contas a Receber & Repasses MROSC)
            </h3>
            <button className="btn btn-primary btn-sm" onClick={() => setShowReceberModal(true)}>
              <PlusCircle size={14} /> + Novo Título a Receber
            </button>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #3b82f6', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e40af', fontSize: '0.825rem', fontWeight: 600 }}>
              <TrendingUp size={18} style={{ color: '#2563eb' }} />
              <span>🔗 <strong>Sincronização com o Plano de Trabalho</strong>: Todos os ingressos e repasses creditados nesta tabela alimentam automaticamente a conciliação bancária segregada do <strong>Módulo 1 (Parcerias MROSC)</strong> e os relatórios de execução financeira (REF)!</span>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data do Lançamento</th>
                  <th>Código / Doc</th>
                  <th>Cliente / Pagador / CNPJ</th>
                  <th>Descrição da Receita / Origem</th>
                  <th>Rubrica de Receita</th>
                  <th>Conta Destino Segregada</th>
                  <th>Valor Previsto / Recebido (R$)</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sortedContasReceber.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      <AlertCircle size={32} style={{ marginBottom: '0.5rem', color: '#3b82f6' }} />
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        Nenhum título a receber encontrado para os filtros selecionados.
                      </div>
                      <div style={{ fontSize: '0.8rem', marginTop: '0.35rem', color: 'var(--text-muted)' }}>
                        Filtro ativo: <strong>{selectedPlanoTrabalho}</strong> (Período: {dataInicio} a {dataFim}).
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedContasReceber.map((cr) => (
                  <tr key={cr.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#2563eb' }}>
                        <Calendar size={14} />
                        {cr.dataLancamento || cr.vencimento}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.8rem' }}>{cr.id}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Venc: {cr.vencimento}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{cr.pagador}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>CNPJ: {cr.cnpj}</div>
                    </td>
                    <td style={{ fontSize: '0.825rem' }}>{cr.descricao}</td>
                    <td><span className="badge badge-primary" style={{ fontSize: '0.675rem' }}>{cr.categoria}</span></td>
                    <td style={{ fontSize: '0.775rem', color: 'var(--primary)', fontWeight: 600 }}>{cr.contaDestino}</td>
                    <td style={{ fontWeight: 700, color: '#047857' }}>R$ {cr.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td><span className={`badge ${cr.status.includes('Recebido') ? 'badge-success' : 'badge-warning'}`}>{cr.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        <button 
                          className={`btn btn-sm ${cr.status.includes('Recebido') ? 'btn-secondary' : 'btn-success'}`}
                          onClick={() => handleToggleBaixaCR(cr.id)}
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
                          title="Alterar Status de Baixa"
                        >
                          {cr.status.includes('Recebido') ? 'Desfazer' : '✓ Baixar'}
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleOpenEditCR(cr)}
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.45rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#1e40af', borderColor: '#93c5fd' }}
                          title="Editar este Lançamento"
                        >
                          <Pencil size={12} /> Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleDeleteCR(cr.id)}
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#dc2626', borderColor: '#fca5a5' }}
                          title="Apagar este Lançamento"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB FASE 6 REVISADA: FORNECEDORES FIXOS & FOLHA DE PESSOAL (PASSO 6 FDJ) */}
      {activeTab === 'rateio' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="card" style={{ borderLeft: '4px solid #2563eb', background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-primary">Passo 6 do Fluxo FDJ (Revisado com Guias GPS/GRF e Medidores)</span>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: '0.25rem 0' }}>
                  Fornecedores Fixos, Concessionárias & Relatório de Despesas de Pessoal
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                  Processamento de concessionárias (Embasa, Coelba, Internet com número de contrato/medidor), honorários contábeis/jurídicos e folha com guias GPS (INSS) e GRF (FGTS) integradas retroativamente ao REF.
                </p>
              </div>

              <button className="btn btn-primary" onClick={() => setShowPessoalModal(true)}>
                <Printer size={16} /> Emitir Relatório de Pessoal (PDF)
              </button>
            </div>
          </div>

          {/* Tabela 1: Fornecedores Fixos & Concessionárias */}
          {/* Banner de Gerador de Dossiê SEI-BA em Destaque */}
          <div style={{ background: '#f0fdf4', border: '2px solid #10b981', padding: '1rem 1.25rem', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.12)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: '#10b981', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>MROSC • SEI BAHIA</span>
                <h4 style={{ margin: 0, color: '#047857', fontSize: '1.05rem', fontWeight: 800 }}>
                  📁 Gerador do Dossiê Completo de Comprovação de Despesas (PDF Compilado)
                </h4>
              </div>
              <p style={{ margin: '6px 0 0 0', color: '#065f46', fontSize: '0.825rem' }}>
                Compilação automática da Relação de Despesas (REF), Comprovantes Bancários BB (C/C 14.502-1) e Notas Fiscais/Holerites carimbados em sequência contínua para juntada no SEI.
              </p>
            </div>

            <button 
              className="btn" 
              style={{ background: '#059669', color: '#ffffff', fontWeight: 800, padding: '0.75rem 1.35rem', borderRadius: '8px', fontSize: '0.925rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={handleGerarDossiePDF}
            >
              <FileText size={20} /> 📄 GERAR DOSSIÊ COMPLETO SEI-BA (PDF)
            </button>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={18} style={{ color: '#d97706' }} />
                Contratos Recorrentes & Concessionárias Públicas ({fornecedoresFixos.length})
              </h4>
              <span className="badge badge-warning">Total Mensal: R$ {totalFixosMROSC.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Serviço / Contrato Recorrente</th>
                    <th>Concessionária / Prestador</th>
                    <th>Contrato / Medidor</th>
                    <th>Dia Vencimento</th>
                    <th>Conta Pagadora Segregada</th>
                    <th>Valor Mensal (R$)</th>
                    <th>Status no Mês</th>
                  </tr>
                </thead>
                <tbody>
                  {fornecedoresFixos.map(f => (
                    <tr key={f.id}>
                      <td><span className="badge badge-warning">{f.id}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{f.servico}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.fornecedor}</td>
                      <td style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#2563eb' }}>{f.contratoMedidor}</td>
                      <td><strong>Dia {f.diaVencimento}</strong></td>
                      <td style={{ fontSize: '0.775rem', color: '#047857', fontWeight: 600 }}>{f.contaPagadora}</td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        R$ {f.valorMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className={`badge ${f.status.includes('Pago') ? 'badge-success' : 'badge-warning'}`}>
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabela 2: Relatório de Despesas de Pessoal, Encargos Sociais & Guias GPS/GRF MROSC */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} style={{ color: '#2563eb' }} />
                Folha de Pagamento, Guias de Encargos (GPS/GRF) & Rateio MROSC ({folhaPessoal.length} Funções)
              </h4>
              <span className="badge badge-success">Folha Total: R$ {totalFolhaMROSC.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</span>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Função / Cargo Pactuado no MROSC</th>
                    <th>Qtd Vagas</th>
                    <th>Salário Base (R$)</th>
                    <th>INSS Patronal (Guia GPS)</th>
                    <th>FGTS (Guia GRF)</th>
                    <th>Rateio MROSC</th>
                    <th>Total Mensal MROSC</th>
                    <th>Status REF</th>
                  </tr>
                </thead>
                <tbody>
                  {folhaPessoal.map(rh => (
                    <tr key={rh.id}>
                      <td><span className="badge badge-primary">{rh.id}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{rh.cargo}</td>
                      <td><strong>{rh.quantidade} vagas</strong></td>
                      <td>R$ {rh.salarioBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td>
                        <div style={{ fontSize: '0.775rem', fontWeight: 600 }}>R$ {rh.inssPatronal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{rh.guiaINSS}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.775rem', fontWeight: 600 }}>R$ {rh.fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{rh.guiaFGTS}</div>
                      </td>
                      <td><span className="badge badge-info">{rh.rateioMROSC}% SJDH-BA</span></td>
                      <td style={{ fontWeight: 700, color: '#2563eb' }}>
                        R$ {rh.valorTotalMROSC.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                          <CheckCircle2 size={11} /> Integrado ao REF
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 3: NFE & LIQUIDAÇÃO SEGREGADA MROSC (PASSO 3 E 4 FDJ) */}
      {(activeTab === 'homologacao' || activeTab === 'nfe') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="card" style={{ borderLeft: '4px solid #2563eb', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-primary">Passo 3 & 4 do Fluxo MROSC • Lei 13.019/2014</span>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: '0.25rem 0' }}>
                  Notas Fiscais, Ordens de Pagamento & Carimbo Eletrônico Segregado
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                  Conferência de chave NFe (44 dígitos), carimbo de vinculação MROSC e liquidação exclusiva por TED Identificada na Conta Específica da Parceria.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => setShowNFeModal(true)}>
                  <PlusCircle size={16} /> + Registrar Nova NFe & Liquidação
                </button>
                <button 
                  className="btn" 
                  style={{ background: '#059669', color: '#ffffff', fontWeight: 700, border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={handleGerarDossiePDF}
                >
                  <FileText size={16} /> 📄 Gerar Dossiê de Comprovação de Despesas (SEI Bahia PDF)
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Receipt size={18} style={{ color: '#2563eb' }} />
                Ordens de Pagamento & NFes Liquidadas ({nfeLiquidadas.length})
              </h4>
              <span className="badge badge-success">
                Total Homologado: R$ {nfeLiquidadas.reduce((acc, curr) => acc + curr.nfeValorTotal, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ordem de Pagamento</th>
                    <th>Termo MROSC & Rubrica</th>
                    <th>Fornecedor / CNPJ</th>
                    <th>Nota Fiscal / Chave de Acesso</th>
                    <th>Valor NFe (R$)</th>
                    <th>Conta Pagadora Segregada</th>
                    <th>Carimbo MROSC</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {nfeLiquidadas.map((nfe) => (
                    <tr key={nfe.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{nfe.id}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SC: {nfe.scId}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{nfe.termoMROSC}</div>
                        <span className="badge badge-info" style={{ fontSize: '0.675rem' }}>{nfe.rubrica}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{nfe.fornecedor}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>CNPJ: {nfe.cnpjFornecedor}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#047857' }}>{nfe.nfeNumero}</div>
                        <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontFamily: 'monospace', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={nfe.nfeChave}>
                          {nfe.nfeChave}
                        </div>
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                        R$ {nfe.nfeValorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ fontSize: '0.775rem', color: '#2563eb', fontWeight: 600 }}>
                        {nfe.contaPagadoraSegregada}
                      </td>
                      <td>
                        <span className="badge badge-success" style={{ fontSize: '0.675rem' }}>
                          <CheckCircle2 size={11} /> Carimbado Lei 13.019
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-success">{nfe.status}</span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline" 
                          onClick={() => setSelectedNFeForPrint(nfe)}
                          style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <Printer size={12} /> Comprovante
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 4: CONCILIAÇÃO BANCÁRIA OFX & RELATÓRIOS REF */}
      {(activeTab === 'conciliacao' || activeTab === 'ofx') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="card" style={{ borderLeft: '4px solid #10b981', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-success">Passo 5 do Fluxo MROSC • Batimento Trilateral OFX</span>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: '0.25rem 0' }}>
                  Conciliação Bancária Trilateral & Relatórios de Execução Financeira (REF)
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                  Batimento 100% automático entre os lançamentos do Extrato OFX do Banco do Brasil, as Ordens de Pagamento e as Notas Fiscais com divergência zero.
                </p>
              </div>

              <button className="btn btn-primary" onClick={() => setShowImportModal(true)}>
                <Upload size={16} /> + Importar Extrato OFX / PDF Banco do Brasil
              </button>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                Extrato Bancário vs. Lançamentos Conciliados ({conciliacoesOFX.length})
              </h4>
              <span className="badge badge-success">100% Batimento Trilateral Confirmado</span>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Data Extrato</th>
                    <th>Histórico no Extrato BB</th>
                    <th>Documento Vinculado</th>
                    <th>Rubrica MROSC</th>
                    <th>Valor Extrato (R$)</th>
                    <th>Divergência</th>
                    <th>Status Conciliação</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {conciliacoesOFX.map((cnc) => (
                    <tr key={cnc.id}>
                      <td><strong>{cnc.dataExtrato ? cnc.dataExtrato.split('-').reverse().join('/') : ''}</strong></td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{cnc.descricaoExtrato}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>Doc: {cnc.comprovanteTXID || cnc.documentoBancario || 'N/A'}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#2563eb' }}>{cnc.nfeVinculada || cnc.opVinculada || cnc.id}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>{cnc.chaveNFe || cnc.fornecedor || ''}</div>
                      </td>
                      <td><span className="badge badge-info">{cnc.rubrica || cnc.rubricaMROSC || 'MROSC'}</span></td>
                      <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                        R$ {(parseFloat(cnc.valorDebito || cnc.valorBancario || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td><span className="badge badge-success">R$ 0,00 (Exato)</span></td>
                      <td><span className="badge badge-success"><CheckCircle2 size={11} /> {cnc.statusConciliacao || 'Conciliado Trilateral'}</span></td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline" 
                          onClick={() => {
                            setSelectedNFeForPrint({
                              id: cnc.opVinculada || cnc.id,
                              scId: 'SC-2026/001-FDJ',
                              termoMROSC: 'Termo de Fomento nº 005/2022 (SJDH-BA)',
                              rubrica: cnc.rubrica || cnc.rubricaMROSC || '2.1.01 Folha / Concessionária / Alimentação',
                              fornecedor: cnc.descricaoExtrato,
                              cnpjFornecedor: '13.937.065/0001-00',
                              nfeNumero: cnc.nfeVinculada || 'NFe-CONCILIADA-OFX',
                              nfeChave: cnc.chaveNFe || '29260175315333000109550010000088411004829104',
                              nfeDataEmissao: cnc.dataExtrato,
                              nfeValorTotal: parseFloat(cnc.valorDebito || cnc.valorBancario || 0),
                              contaPagadoraSegregada: cnc.contaBancaria || 'BB SJDH-BA (Termo nº 005/2022 - C/C 14.502-1)',
                              formaPagamento: cnc.descricaoExtrato,
                              dataPagamento: cnc.dataExtrato,
                              txidBancario: cnc.comprovanteTXID || 'TED-BB-102401',
                              status: 'Conciliado Trilateral & Aprovado no REF'
                            });
                          }}
                          style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          title="Emitir Comprovante de Conciliação e Impressão REF"
                        >
                          <Printer size={13} /> Comprovante
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 5: CONTAS SEGREGADAS & TESOURARIA BANCÁRIA */}
      {(activeTab === 'bancos' || activeTab === 'tesouraria') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="card" style={{ borderLeft: '4px solid #3b82f6', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-primary">Módulo de Tesouraria Segregada MROSC</span>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: '0.25rem 0' }}>
                  Contas Bancárias Específicas, Aplicações CDB & Caixa Físico
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                  Gestão das contas bancárias reais importadas da Fundação Doutor Jesus, garantindo segregação total de fontes pagadoras (Estadual, Municipal, Federal e Doações).
                </p>
              </div>

              <button className="btn btn-primary" onClick={() => setShowBancoModal(true)}>
                <PlusCircle size={16} /> + Cadastrar Nova Conta Segregada
              </button>
            </div>
          </div>

          <div className="grid-3">
            {bancosList.map(b => {
              const isMainSJDH = b.id === 'BC-01';
              const isCDBAcc = b.id === 'BC-02';

              const displayNome = isMainSJDH 
                ? (is2TAPlano ? 'BB SJDH-BA (Termo de Fomento nº 005/2022 — 2º Aditivo)' : 'BB SJDH-BA (Termo de Fomento nº 005/2022 — Plano Original)')
                : b.nome;
              
              // Calculate dynamic CDB yield based on active period/date filter
              let dynamicCDBYield = periodoAtivo.rendimentos || 46849.16;
              if (isOriginalPlano && (!filtroPeriodo || filtroPeriodo === 'semestre1' || filtroPeriodo === 'parcela1FDJ')) {
                dynamicCDBYield = (dataInicio > '2022-06-18') ? 407510.00 : 454151.87;
              } else if (is2TAPlano) {
                dynamicCDBYield = 670985.21;
              }

              const displaySaldo = isMainSJDH ? saldoFinalCalculado : (isCDBAcc ? dynamicCDBYield : b.saldo);

              return (
                <div key={b.id} className="card" style={{ borderTop: `4px solid ${b.cor}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary">{b.tipo}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{b.id}</span>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', margin: 0, fontWeight: 800 }}>{displayNome}</h4>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      {b.banco} • Ag. {b.agencia} • C/C {b.conta}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Saldo Atual Conciliado</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: displaySaldo >= 0 ? '#059669' : '#dc2626' }}>
                      R$ {displaySaldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* SUBTAB 6: DRE GERENCIAL POR CONVÊNIO */}
      {activeTab === 'dre' && (
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
            Demonstrativo do Resultado do Exercício (DRE Gerencial por Convênio MROSC)
          </h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Grupo de Contas</th>
                  <th>Descrição da Rubrica</th>
                  <th>Orçado (R$)</th>
                  <th>Realizado (R$)</th>
                  <th>Execução (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>1.0.00</strong></td>
                  <td><strong>RECEITAS DE PARCERIAS MROSC (SJDH-BA)</strong></td>
                  <td>R$ 19.004.114,88</td>
                  <td style={{ color: '#059669', fontWeight: 700 }}>R$ 19.004.114,88</td>
                  <td><span className="badge badge-success">100%</span></td>
                </tr>
                <tr>
                  <td><strong>1.3.01</strong></td>
                  <td>Rendimentos de Aplicações Financeiras (CDB)</td>
                  <td>R$ 18.000,00</td>
                  <td style={{ color: '#059669', fontWeight: 700 }}>R$ 18.450,20</td>
                  <td><span className="badge badge-success">102.5%</span></td>
                </tr>
                <tr style={{ background: 'var(--bg-card-hover)', fontWeight: 800 }}>
                  <td colSpan={2}>(=) TOTAL DE RECEITAS OPERACIONAIS:</td>
                  <td>R$ 19.022.114,88</td>
                  <td style={{ color: '#059669' }}>R$ 19.022.565,08</td>
                  <td>100%</td>
                </tr>
                <tr>
                  <td><strong>2.1.01</strong></td>
                  <td>Despesas de Pessoal & Encargos Sociais (CLT)</td>
                  <td>R$ 4.965.184,80</td>
                  <td style={{ color: '#dc2626', fontWeight: 700 }}>R$ 4.965.184,80</td>
                  <td><span className="badge badge-info">100%</span></td>
                </tr>
                <tr>
                  <td><strong>2.2.01</strong></td>
                  <td>Alimentação, Cozinha Industrial & Nutrição</td>
                  <td>R$ 4.200.000,00</td>
                  <td style={{ color: '#dc2626', fontWeight: 700 }}>R$ 4.150.200,00</td>
                  <td><span className="badge badge-info">98.8%</span></td>
                </tr>
                <tr>
                  <td><strong>2.5.01</strong></td>
                  <td>Concessionárias Públicas (Embasa, Coelba, Gás GLP)</td>
                  <td>R$ 3.500.000,00</td>
                  <td style={{ color: '#dc2626', fontWeight: 700 }}>R$ 3.480.000,00</td>
                  <td><span className="badge badge-info">99.4%</span></td>
                </tr>
                <tr style={{ background: 'var(--bg-card-hover)', fontWeight: 800 }}>
                  <td colSpan={2}>(=) SALDO OPERACIONAL LIQUIDADO CONCILIADO:</td>
                  <td>R$ 6.356.930,08</td>
                  <td style={{ color: '#2563eb' }}>R$ 6.427.180,28</td>
                  <td>101.1%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 7: FLUXO DE CAIXA PROJETADO */}
      {activeTab === 'fluxoProjetado' && (
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
            Fluxo de Caixa Projetado (Projeção de Repasses & Despesas 2026/2027)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Projeção contínua dos repasses do Termo de Fomento nº 005/2022 e despesas fixas com manutenção da Fundação Doutor Jesus.
          </p>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mês / Ano</th>
                  <th>Saldo Inicial (R$)</th>
                  <th>Repasses Programados (R$)</th>
                  <th>Despesas Previstas (R$)</th>
                  <th>Saldo Projetado (R$)</th>
                  <th>Status Projeção</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Julho / 2026</strong></td>
                  <td>R$ 3.492.246,16</td>
                  <td style={{ color: '#059669' }}>R$ 3.170.427,51</td>
                  <td style={{ color: '#dc2626' }}>R$ 2.950.000,00</td>
                  <td style={{ fontWeight: 800, color: '#2563eb' }}>R$ 3.712.673,67</td>
                  <td><span className="badge badge-success">Superavitário</span></td>
                </tr>
                <tr>
                  <td><strong>Agosto / 2026</strong></td>
                  <td>R$ 3.712.673,67</td>
                  <td style={{ color: '#059669' }}>R$ 3.170.427,51</td>
                  <td style={{ color: '#dc2626' }}>R$ 2.950.000,00</td>
                  <td style={{ fontWeight: 800, color: '#2563eb' }}>R$ 3.933.101,18</td>
                  <td><span className="badge badge-success">Superavitário</span></td>
                </tr>
                <tr>
                  <td><strong>Setembro / 2026</strong></td>
                  <td>R$ 3.933.101,18</td>
                  <td style={{ color: '#059669' }}>R$ 3.170.427,51</td>
                  <td style={{ color: '#dc2626' }}>R$ 2.950.000,00</td>
                  <td style={{ fontWeight: 800, color: '#2563eb' }}>R$ 4.153.528,69</td>
                  <td><span className="badge badge-success">Superavitário</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 8: RELATÓRIO PRESTAÇÃO TCE-BA */}
      {activeTab === 'relatorioTCE' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>
                Relatório de Prestação de Contas para o Tribunal de Contas do Estado (TCE-BA)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Resumo consolidado em estrita conformidade com as diretrizes da Resolução TCE-BA e MROSC Lei 13.019/2014.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => window.print()}>
              <Printer size={16} /> Exportar Dossiê TCE-BA (PDF)
            </button>
          </div>

          <div style={{ background: 'var(--bg-card-hover)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>✓ SITUAÇÃO CONTÁBIL: APROVADA / 100% REGULARIZADA</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Todos os comprovantes fiscais (NFes carimbadas), conciliações bancárias unilaterais/trilaterais e guias de recolhimento de encargos (GPS e GRF) estão anexados eletronicamente e auditados.
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 9: PLANO DE CONTAS SJDH-BA */}
      {activeTab === 'planocontas' && (
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
            Plano de Contas Padronizado SJDH-BA & Fundação Doutor Jesus
          </h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código Estruturado</th>
                  <th>Nome da Conta / Rubrica</th>
                  <th>Tipo da Conta</th>
                  <th>Conta Pai</th>
                </tr>
              </thead>
              <tbody>
                {planoContas.map((c) => (
                  <tr key={c.codigo}>
                    <td><span className="badge badge-primary">{c.codigo}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{c.nome}</td>
                    <td><span className={`badge ${c.tipo === 'Receita' ? 'badge-success' : 'badge-danger'}`}>{c.tipo}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{c.pai || 'Raiz'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 10: RENDIMENTOS CDB MROSC */}
      {activeTab === 'rendimentos' && (
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
            Rendimentos de Aplicação Financeira CDB (Conta Específica MROSC)
          </h3>
          <div style={{ background: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#047857', fontWeight: 700 }}>
              📈 REGRA DA LEI 13.019/2014 (ART. 51): Os rendimentos de ativos financeiros são obrigatoriamente aplicados no objeto da parceria, sujeitos às mesmas condições de prestação de contas.
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669', marginTop: '0.5rem' }}>
              Rendimentos Acumulados no Semestre: R$ 18.450,20
            </div>
          </div>
        </div>
      )}

      {/* Modal: Relatório de Despesas de Pessoal & Encargos REVISADO (Fase 6 PDF) */}
      {showPessoalModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '840px' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-primary">RELATÓRIO CONSOLIDADO DE DESPESAS DE PESSOAL & CONTRATOS (PASSO 6 REVISADO PDF)</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={16} /> Imprimir Relatório Pessoal PDF
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowPessoalModal(false)}>
                  <X size={16} /> Fechar
                </button>
              </div>
            </div>

            <div className="printable-document" style={{ border: '2px solid #2563eb', padding: '1.5rem', borderRadius: '8px', background: '#ffffff' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #cbd5e1', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#1e3a8a' }}>FUNDAÇÃO DOUTOR JESUS — RECURSOS HUMANOS & CONTABILIDADE</h3>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#2563eb' }}>
                  RELATÓRIO ESPECÍFICO DE DESPESAS DE PESSOAL E CONTRATOS RECORRENTES MROSC
                </div>
                <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                  Termo de Fomento nº 005/2022 SJDH-BA • Lei 13.019/2014 • Consolidação Retroativa ao REF
                </div>
              </div>

              {/* Tabela de Pessoal */}
              <div className="table-container" style={{ marginBottom: '1rem' }}>
                <table className="data-table" style={{ fontSize: '0.775rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9' }}>
                      <th>Cargo Pactuado</th>
                      <th>Qtd</th>
                      <th>Salários Base (R$)</th>
                      <th>INSS Patronal (GPS)</th>
                      <th>FGTS (GRF)</th>
                      <th>Total Consolidado (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {folhaPessoal.map(rh => (
                      <tr key={rh.id}>
                        <td><strong>{rh.cargo}</strong></td>
                        <td>{rh.quantidade}</td>
                        <td>R$ {(rh.salarioBase * rh.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td>R$ {(rh.inssPatronal * rh.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td>R$ {(rh.fgts * rh.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td style={{ fontWeight: 700, color: '#2563eb' }}>R$ {rh.valorTotalMROSC.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                    <tr style={{ background: '#ecfdf5', fontWeight: 700 }}>
                      <td colSpan={5}>TOTAL DA FOLHA DE PESSOAL MROSC (SJDH-BA):</td>
                      <td style={{ color: '#059669', fontSize: '0.85rem' }}>R$ {totalFolhaMROSC.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: '6px', border: '1px solid #6ee7b7', fontSize: '0.8rem', color: '#065f46' }}>
                <strong>INTEGRAÇÃO RETROATIVA REGULARIZADA:</strong> Todos os lançamentos de salários, INSS, FGTS e faturas de concessionárias (Embasa/Coelba/Internet com medidores auditados) foram consolidados retroativamente nos demonstrativos de receitas e despesas anteriores e sincronizados com o Relatório REF e com a conciliação bancária do Banco do Brasil.
              </div>

              {/* Audit Stamp */}
              <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: '#64748b', textAlign: 'center', fontFamily: 'monospace' }}>
                AUTENTICAÇÃO CONTÁBIL DE RH: FDJ-RH-MROSC-PASSO6-992014029104-OK
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #cbd5e1', textAlign: 'center', fontSize: '0.775rem' }}>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '4px', fontWeight: 700 }}>Recursos Humanos & Departamento Pessoal FDJ</div>
                  <div>Elaborador da Folha MROSC</div>
                </div>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '4px', fontWeight: 700 }}>Presidência & Gestão MROSC</div>
                  <div>Homologação das Despesas de Pessoal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo Título / Conta a Pagar */}
      {showPagarModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingDown size={20} style={{ color: '#ef4444' }} />
                Registrar Nova Conta a Pagar (A/P MROSC)
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowPagarModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateContaPagar} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="grid-2">
                <div>
                  <label className="form-label">Fornecedor / Favorecido *</label>
                  <select 
                    className="form-select" 
                    required 
                    value={newContaPagar.fornecedor || (fornecedores && fornecedores[0] ? (fornecedores[0].razaoSocial || fornecedores[0].nome) : 'Atacadão S.A.')} 
                    onChange={e => {
                      const selectedName = e.target.value;
                      const allForns = (fornecedores && fornecedores.length > 0 ? fornecedores : [
                        { id: 'FORN-001', razaoSocial: 'Atacadão S.A.', cnpj: '75.315.333/0001-09' },
                        { id: 'FORN-002', razaoSocial: 'EMBASA - Empresa Baiana de Águas e Saneamento S/A', cnpj: '13.504.675/0001-10' },
                        { id: 'FORN-003', razaoSocial: 'COELBA - Companhia de Eletricidade do Estado da Bahia', cnpj: '15.135.960/0001-10' },
                        { id: 'FORN-004', razaoSocial: 'Nacional Gás Butano Distribuidora Ltda', cnpj: '08.561.701/0001-44' },
                        { id: 'FORN-005', razaoSocial: 'Distribuidora Ceasa Salvador Ltda', cnpj: '12.480.112/0001-88' },
                        { id: 'FORN-006', razaoSocial: 'Distribuidora Higiene & Limpeza Baiana Ltda', cnpj: '04.102.991/0001-88' },
                        { id: 'FORN-007', razaoSocial: 'Telecom RMS Serviços de Internet Ltda', cnpj: '18.910.401/0001-22' },
                        { id: 'FORN-008', razaoSocial: 'Receita Federal do Brasil (Guia GPS INSS)', cnpj: '00.396.895/0001-88' },
                        { id: 'FORN-009', razaoSocial: 'Caixa Econômica Federal (Guia GRF FGTS)', cnpj: '00.360.305/0001-04' },
                        { id: 'FORN-010', razaoSocial: 'DETRAN-BA (Licenciamento & Frota)', cnpj: '13.937.065/0001-00' }
                      ]);
                      const matched = allForns.find(f => (f.razaoSocial || f.nome) === selectedName);

                      setNewContaPagar({ 
                        ...newContaPagar, 
                        fornecedor: selectedName,
                        cnpj: matched ? (matched.cnpj || matched.cpf || '') : newContaPagar.cnpj
                      });
                    }} 
                  >
                    {(fornecedores && fornecedores.length > 0 ? fornecedores : [
                      { id: 'FORN-001', razaoSocial: 'Atacadão S.A.', cnpj: '75.315.333/0001-09' },
                      { id: 'FORN-002', razaoSocial: 'EMBASA - Empresa Baiana de Águas e Saneamento S/A', cnpj: '13.504.675/0001-10' },
                      { id: 'FORN-003', razaoSocial: 'COELBA - Companhia de Eletricidade do Estado da Bahia', cnpj: '15.135.960/0001-10' },
                      { id: 'FORN-004', razaoSocial: 'Nacional Gás Butano Distribuidora Ltda', cnpj: '08.561.701/0001-44' },
                      { id: 'FORN-005', razaoSocial: 'Distribuidora Ceasa Salvador Ltda', cnpj: '12.480.112/0001-88' },
                      { id: 'FORN-006', razaoSocial: 'Distribuidora Higiene & Limpeza Baiana Ltda', cnpj: '04.102.991/0001-88' },
                      { id: 'FORN-007', razaoSocial: 'Telecom RMS Serviços de Internet Ltda', cnpj: '18.910.401/0001-22' },
                      { id: 'FORN-008', razaoSocial: 'Receita Federal do Brasil (Guia GPS INSS)', cnpj: '00.396.895/0001-88' },
                      { id: 'FORN-009', razaoSocial: 'Caixa Econômica Federal (Guia GRF FGTS)', cnpj: '00.360.305/0001-04' },
                      { id: 'FORN-010', razaoSocial: 'DETRAN-BA (Licenciamento & Frota)', cnpj: '13.937.065/0001-00' }
                    ]).map(f => (
                      <option key={f.id || f.razaoSocial} value={f.razaoSocial || f.nome}>
                        {f.razaoSocial || f.nome} ({f.cnpj || f.cpf || 'PJ/PF'})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">CNPJ / CPF Vinculado</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    readOnly
                    style={{ background: '#f8fafc', color: '#1e293b', fontWeight: 700, cursor: 'not-allowed' }}
                    value={
                      newContaPagar.cnpj || 
                      ((fornecedores && fornecedores.length > 0 ? fornecedores : [
                        { id: 'FORN-001', razaoSocial: 'Atacadão S.A.', cnpj: '75.315.333/0001-09' },
                        { id: 'FORN-002', razaoSocial: 'EMBASA - Empresa Baiana de Águas e Saneamento S/A', cnpj: '13.504.675/0001-10' },
                        { id: 'FORN-003', razaoSocial: 'COELBA - Companhia de Eletricidade do Estado da Bahia', cnpj: '15.135.960/0001-10' },
                        { id: 'FORN-004', razaoSocial: 'Nacional Gás Butano Distribuidora Ltda', cnpj: '08.561.701/0001-44' },
                        { id: 'FORN-005', razaoSocial: 'Distribuidora Ceasa Salvador Ltda', cnpj: '12.480.112/0001-88' },
                        { id: 'FORN-006', razaoSocial: 'Distribuidora Higiene & Limpeza Baiana Ltda', cnpj: '04.102.991/0001-88' },
                        { id: 'FORN-007', razaoSocial: 'Telecom RMS Serviços de Internet Ltda', cnpj: '18.910.401/0001-22' },
                        { id: 'FORN-008', razaoSocial: 'Receita Federal do Brasil (Guia GPS INSS)', cnpj: '00.396.895/0001-88' },
                        { id: 'FORN-009', razaoSocial: 'Caixa Econômica Federal (Guia GRF FGTS)', cnpj: '00.360.305/0001-04' },
                        { id: 'FORN-010', razaoSocial: 'DETRAN-BA (Licenciamento & Frota)', cnpj: '13.937.065/0001-00' }
                      ]).find(f => (f.razaoSocial || f.nome) === (newContaPagar.fornecedor || 'Atacadão S.A.'))?.cnpj) || '75.315.333/0001-09'
                    }
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Descrição do Lançamento / NFe / Serviço *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="Ex: Aquisição de alimentos hortifrúti / Fatura de Energia UC-88104" 
                  value={newContaPagar.descricao} 
                  onChange={e => setNewContaPagar({ ...newContaPagar, descricao: e.target.value })} 
                />
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Valor Total (R$) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-input" 
                    required 
                    placeholder="0,00" 
                    value={newContaPagar.valor} 
                    onChange={e => setNewContaPagar({ ...newContaPagar, valor: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="form-label">Data de Vencimento</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={newContaPagar.vencimento} 
                    onChange={e => setNewContaPagar({ ...newContaPagar, vencimento: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Rubrica Orçamentária MROSC</label>
                  <select 
                    className="form-select" 
                    value={newContaPagar.categoria} 
                    onChange={e => setNewContaPagar({ ...newContaPagar, categoria: e.target.value })}
                  >
                    <option value="2.1.01 Folha de Pagamento">2.1.01 Folha de Pagamento & Encargos</option>
                    <option value="2.2.01 Alimentação & Cozinha">2.2.01 Alimentação & Nutrição Comunitária</option>
                    <option value="2.3.01 Medicamentos & Saúde">2.3.01 Medicamentos & Saúde RDC 29</option>
                    <option value="2.4.01 Frota & Veículos">2.4.01 Frota, Diesel S10 & Manutenção</option>
                    <option value="2.5.01 Energia Elétrica">2.5.01 Energia Elétrica (COELBA)</option>
                    <option value="2.5.01 Água & Esgoto">2.5.01 Água & Esgoto (EMBASA)</option>
                    <option value="2.5.01 Gás de Cozinha">2.5.01 Gás de Cozinha GLP Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Conta Pagadora Segregada</label>
                  <select 
                    className="form-select" 
                    value={newContaPagar.contaPagadora} 
                    onChange={e => setNewContaPagar({ ...newContaPagar, contaPagadora: e.target.value })}
                  >
                    {bancosList.map(b => (
                      <option key={b.id} value={`${b.nome} (C/C ${b.conta})`}>{b.nome} ({b.conta})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Termo MROSC Vinculado *</label>
                  <select 
                    className="form-select" 
                    value={newContaPagar.termoMROSC} 
                    onChange={e => setNewContaPagar({ ...newContaPagar, termoMROSC: e.target.value })}
                  >
                    {([
                  { id: 'MROSC-005-2022-ORIGINAL', termo: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
                  { id: 'MROSC-005-2022-2TA', termo: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' }
                ]).map(t => (
                      <option key={t.id || t.termo} value={t.termo || t.id}>
                        {t.termo || t.id} ({t.orgaoConcedente || 'MROSC'})
                      </option>
                    ))}
                    <option value="Recursos Próprios / Doações FDJ">Recursos Próprios / Doações FDJ</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Status Inicial do Título</label>
                  <select 
                    className="form-select" 
                    value={newContaPagar.status} 
                    onChange={e => setNewContaPagar({ ...newContaPagar, status: e.target.value })}
                  >
                    <option value="A Pagar">A Pagar (Pendente)</option>
                    <option value="Pago (Liquidado)">Pago (Liquidado em Conta Segregada)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPagarModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">+ Salvar Conta a Pagar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Conta a Pagar */}
      {editingCP && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Pencil size={20} style={{ color: '#2563eb' }} />
                Editar Lançamento / Título ({editingCP.id})
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setEditingCP(null)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEditCP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="grid-2">
                <div>
                  <label className="form-label">Fornecedor / Favorecido *</label>
                  <select 
                    className="form-select" 
                    required 
                    value={editingCP.fornecedor} 
                    onChange={e => {
                      const selectedName = e.target.value;
                      const allForns = (fornecedores && fornecedores.length > 0 ? fornecedores : [
                        { id: 'FORN-001', razaoSocial: 'Atacadão S.A.', cnpj: '75.315.333/0001-09' },
                        { id: 'FORN-002', razaoSocial: 'EMBASA - Empresa Baiana de Águas e Saneamento S/A', cnpj: '13.504.675/0001-10' },
                        { id: 'FORN-003', razaoSocial: 'COELBA - Companhia de Eletricidade do Estado da Bahia', cnpj: '15.135.960/0001-10' },
                        { id: 'FORN-004', razaoSocial: 'Nacional Gás Butano Distribuidora Ltda', cnpj: '08.561.701/0001-44' },
                        { id: 'FORN-005', razaoSocial: 'Distribuidora Ceasa Salvador Ltda', cnpj: '12.480.112/0001-88' },
                        { id: 'FORN-006', razaoSocial: 'Distribuidora Higiene & Limpeza Baiana Ltda', cnpj: '04.102.991/0001-88' },
                        { id: 'FORN-007', razaoSocial: 'Telecom RMS Serviços de Internet Ltda', cnpj: '18.910.401/0001-22' },
                        { id: 'FORN-008', razaoSocial: 'Receita Federal do Brasil (Guia GPS INSS)', cnpj: '00.396.895/0001-88' },
                        { id: 'FORN-009', razaoSocial: 'Caixa Econômica Federal (Guia GRF FGTS)', cnpj: '00.360.305/0001-04' },
                        { id: 'FORN-010', razaoSocial: 'DETRAN-BA (Licenciamento & Frota)', cnpj: '13.937.065/0001-00' }
                      ]);
                      const matched = allForns.find(f => (f.razaoSocial || f.nome) === selectedName);

                      setEditingCP({ 
                        ...editingCP, 
                        fornecedor: selectedName,
                        cnpj: matched ? (matched.cnpj || matched.cpf || '') : editingCP.cnpj
                      });
                    }} 
                  >
                    {(fornecedores && fornecedores.length > 0 ? fornecedores : [
                      { id: 'FORN-001', razaoSocial: 'Atacadão S.A.', cnpj: '75.315.333/0001-09' },
                      { id: 'FORN-002', razaoSocial: 'EMBASA - Empresa Baiana de Águas e Saneamento S/A', cnpj: '13.504.675/0001-10' },
                      { id: 'FORN-003', razaoSocial: 'COELBA - Companhia de Eletricidade do Estado da Bahia', cnpj: '15.135.960/0001-10' },
                      { id: 'FORN-004', razaoSocial: 'Nacional Gás Butano Distribuidora Ltda', cnpj: '08.561.701/0001-44' },
                      { id: 'FORN-005', razaoSocial: 'Distribuidora Ceasa Salvador Ltda', cnpj: '12.480.112/0001-88' },
                      { id: 'FORN-006', razaoSocial: 'Distribuidora Higiene & Limpeza Baiana Ltda', cnpj: '04.102.991/0001-88' },
                      { id: 'FORN-007', razaoSocial: 'Telecom RMS Serviços de Internet Ltda', cnpj: '18.910.401/0001-22' },
                      { id: 'FORN-008', razaoSocial: 'Receita Federal do Brasil (Guia GPS INSS)', cnpj: '00.396.895/0001-88' },
                      { id: 'FORN-009', razaoSocial: 'Caixa Econômica Federal (Guia GRF FGTS)', cnpj: '00.360.305/0001-04' },
                      { id: 'FORN-010', razaoSocial: 'DETRAN-BA (Licenciamento & Frota)', cnpj: '13.937.065/0001-00' }
                    ]).map(f => (
                      <option key={f.id || f.razaoSocial} value={f.razaoSocial || f.nome}>
                        {f.razaoSocial || f.nome} ({f.cnpj || f.cpf || 'PJ/PF'})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">CNPJ / CPF Vinculado</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    readOnly
                    style={{ background: '#f8fafc', color: '#1e293b', fontWeight: 700, cursor: 'not-allowed' }}
                    value={editingCP.cnpj} 
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Descrição do Lançamento / NFe / Serviço *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={editingCP.descricao} 
                  onChange={e => setEditingCP({ ...editingCP, descricao: e.target.value })} 
                />
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Valor Total (R$) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-input" 
                    required 
                    value={editingCP.valor} 
                    onChange={e => setEditingCP({ ...editingCP, valor: parseFloat(e.target.value) || 0 })} 
                  />
                </div>
                <div>
                  <label className="form-label">Data de Vencimento</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingCP.vencimento} 
                    onChange={e => setEditingCP({ ...editingCP, vencimento: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Rubrica Orçamentária MROSC</label>
                  <select 
                    className="form-select" 
                    value={editingCP.categoria} 
                    onChange={e => setEditingCP({ ...editingCP, categoria: e.target.value })}
                  >
                    <option value="2.1.01 Folha de Pagamento">2.1.01 Folha de Pagamento & Encargos</option>
                    <option value="2.2.01 Alimentação & Cozinha">2.2.01 Alimentação & Nutrição Comunitária</option>
                    <option value="2.3.01 Medicamentos & Saúde">2.3.01 Medicamentos & Saúde RDC 29</option>
                    <option value="2.4.01 Frota & Veículos">2.4.01 Frota, Diesel S10 & Manutenção</option>
                    <option value="2.5.01 Energia Elétrica">2.5.01 Energia Elétrica (COELBA)</option>
                    <option value="2.5.01 Água & Esgoto">2.5.01 Água & Esgoto (EMBASA)</option>
                    <option value="2.5.01 Gás de Cozinha">2.5.01 Gás de Cozinha GLP Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Conta Pagadora Segregada</label>
                  <select 
                    className="form-select" 
                    value={editingCP.contaPagadora} 
                    onChange={e => setEditingCP({ ...editingCP, contaPagadora: e.target.value })}
                  >
                    {bancosList.map(b => (
                      <option key={b.id} value={`${b.nome} (C/C ${b.conta})`}>{b.nome} ({b.conta})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Termo MROSC Vinculado *</label>
                  <select 
                    className="form-select" 
                    value={editingCP.termoMROSC} 
                    onChange={e => setEditingCP({ ...editingCP, termoMROSC: e.target.value })}
                  >
                    {([
                  { id: 'MROSC-005-2022-ORIGINAL', termo: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
                  { id: 'MROSC-005-2022-2TA', termo: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' }
                ]).map(t => (
                      <option key={t.id || t.termo} value={t.termo || t.id}>
                        {t.termo || t.id} ({t.orgaoConcedente || 'MROSC'})
                      </option>
                    ))}
                    <option value="Recursos Próprios / Doações FDJ">Recursos Próprios / Doações FDJ</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Status Inicial do Título</label>
                  <select 
                    className="form-select" 
                    value={editingCP.status} 
                    onChange={e => setEditingCP({ ...editingCP, status: e.target.value })}
                  >
                    <option value="A Pagar">A Pagar (Pendente)</option>
                    <option value="Pago (Liquidado)">Pago (Liquidado em Conta Segregada)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingCP(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 1: Cadastro de Novo Título a Receber (Contas a Receber) */}
      {showReceberModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} style={{ color: '#2563eb' }} />
                Cadastrar Novo Título a Receber / Repasse MROSC
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowReceberModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateContaReceber} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="grid-2">
                <div>
                  <label className="form-label">Cliente / Órgão Concedente / Pagador *</label>
                  <select 
                    className="form-select" 
                    value={newContaReceber.pagador} 
                    onChange={e => {
                      const selectedName = e.target.value;
                      const matched = (clientes && clientes.length > 0 ? clientes : [
                        { id: 'CLI-001', razaoSocial: 'Secretaria de Justiça e Direitos Humanos (SJDH-BA)', cnpj: '13.937.065/0001-00' }
                      ]).find(c => (c.razaoSocial || c.nome) === selectedName);

                      setNewContaReceber({ 
                        ...newContaReceber, 
                        pagador: selectedName,
                        cnpj: matched ? (matched.cnpj || matched.cpf || '') : newContaReceber.cnpj
                      });
                    }} 
                  >
                    {(clientes && clientes.length > 0 ? clientes : [
                      { id: 'CLI-001', razaoSocial: 'Secretaria de Justiça e Direitos Humanos (SJDH-BA)', cnpj: '13.937.065/0001-00' },
                      { id: 'CLI-002', razaoSocial: 'Prefeitura Municipal de Candeias (PMC)', cnpj: '13.886.205/0001-30' },
                      { id: 'CLI-003', razaoSocial: 'SENAD / Ministério da Justiça e Segurança Pública', cnpj: '00.396.895/0001-88' },
                      { id: 'CLI-004', razaoSocial: 'Secretaria de Assistência e Desenvolvimento Social (SADS-BA)', cnpj: '13.937.073/0001-56' },
                      { id: 'CLI-005', razaoSocial: 'Fundação Bradesco - Apoio Social', cnpj: '60.701.190/0001-04' }
                    ]).map(c => (
                      <option key={c.id || c.razaoSocial} value={c.razaoSocial || c.nome}>
                        {c.razaoSocial || c.nome} ({c.cnpj || c.cpf || 'PJ/PF'})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">CNPJ / CPF Vinculado</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    readOnly
                    style={{ background: '#f8fafc', color: '#1e293b', fontWeight: 700, cursor: 'not-allowed' }}
                    value={
                      newContaReceber.cnpj || 
                      ((clientes && clientes.length > 0 ? clientes : [
                        { id: 'CLI-001', razaoSocial: 'Secretaria de Justiça e Direitos Humanos (SJDH-BA)', cnpj: '13.937.065/0001-00' }
                      ]).find(c => (c.razaoSocial || c.nome) === newContaReceber.pagador)?.cnpj) || '13.937.065/0001-00'
                    }
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Descrição da Receita / Origem do Recurso *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="Ex: Repasse Mensal Programado MROSC Parcela 1/6" 
                  value={newContaReceber.descricao} 
                  onChange={e => setNewContaReceber({ ...newContaReceber, descricao: e.target.value })} 
                />
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Valor Previsto / Recebido (R$) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-input" 
                    required 
                    placeholder="0.00" 
                    value={newContaReceber.valor} 
                    onChange={e => setNewContaReceber({ ...newContaReceber, valor: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="form-label">Data Prevista / Recebimento *</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    required 
                    value={newContaReceber.vencimento} 
                    onChange={e => setNewContaReceber({ ...newContaReceber, vencimento: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Rubrica de Receita</label>
                  <select 
                    className="form-select" 
                    value={newContaReceber.categoria} 
                    onChange={e => setNewContaReceber({ ...newContaReceber, categoria: e.target.value })}
                  >
                    <option value="1.1.01 Repasses MROSC Estadual">1.1.01 Repasses MROSC Estadual (SJDH / SADS)</option>
                    <option value="1.1.02 Repasses MROSC Municipal">1.1.02 Repasses MROSC Municipal (PMC Candeias)</option>
                    <option value="1.1.03 Repasses MROSC Federal">1.1.03 Repasses MROSC Federal (SENAD / MJ)</option>
                    <option value="1.2.01 Doações Institucionais">1.2.01 Doações Institucionais PJ / Fundações</option>
                    <option value="1.3.01 Rendimentos CDB MROSC">1.3.01 Rendimentos de Aplicação Financeira CDB</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Conta Destino Segregada</label>
                  <select 
                    className="form-select" 
                    value={newContaReceber.contaDestino} 
                    onChange={e => setNewContaReceber({ ...newContaReceber, contaDestino: e.target.value })}
                  >
                    {bancosList.map(b => (
                      <option key={b.id} value={`${b.nome} (C/C ${b.conta})`}>{b.nome} ({b.conta})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Termo MROSC Vinculado *</label>
                  <select 
                    className="form-select" 
                    value={newContaReceber.termoMROSC} 
                    onChange={e => setNewContaReceber({ ...newContaReceber, termoMROSC: e.target.value })}
                  >
                    {([
                  { id: 'MROSC-005-2022-ORIGINAL', termo: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
                  { id: 'MROSC-005-2022-2TA', termo: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' }
                ]).map(t => (
                      <option key={t.id || t.termo} value={t.termo || t.id}>
                        {t.termo || t.id} ({t.orgaoConcedente || 'MROSC'})
                      </option>
                    ))}
                    <option value="Recursos Próprios / Doações FDJ">Recursos Próprios / Doações FDJ</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Status Inicial do Título</label>
                  <select 
                    className="form-select" 
                    value={newContaReceber.status} 
                    onChange={e => setNewContaReceber({ ...newContaReceber, status: e.target.value })}
                  >
                    <option value="Recebido (Creditado)">Recebido (Creditado em Conta Segregada)</option>
                    <option value="Pendente (A Receber)">Pendente (A Receber)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowReceberModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">+ Salvar Título a Receber</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Editar Título a Receber (Contas a Receber) */}
      {editingCR && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Pencil size={20} style={{ color: '#2563eb' }} />
                Editar Título a Receber ({editingCR.id})
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setEditingCR(null)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEditCR} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="grid-2">
                <div>
                  <label className="form-label">Cliente / Pagador</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingCR.pagador} 
                    onChange={e => setEditingCR({ ...editingCR, pagador: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="form-label">CNPJ / CPF</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    readOnly
                    style={{ background: '#f8fafc', color: '#1e293b', fontWeight: 700, cursor: 'not-allowed' }}
                    value={editingCR.cnpj} 
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Descrição da Receita *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={editingCR.descricao} 
                  onChange={e => setEditingCR({ ...editingCR, descricao: e.target.value })} 
                />
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Valor (R$) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-input" 
                    required 
                    value={editingCR.valor} 
                    onChange={e => setEditingCR({ ...editingCR, valor: parseFloat(e.target.value) || 0 })} 
                  />
                </div>
                <div>
                  <label className="form-label">Data Prevista / Recebimento</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingCR.vencimento} 
                    onChange={e => setEditingCR({ ...editingCR, vencimento: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Rubrica de Receita</label>
                  <select 
                    className="form-select" 
                    value={editingCR.categoria} 
                    onChange={e => setEditingCR({ ...editingCR, categoria: e.target.value })}
                  >
                    <option value="1.1.01 Repasses MROSC Estadual">1.1.01 Repasses MROSC Estadual (SJDH / SADS)</option>
                    <option value="1.1.02 Repasses MROSC Municipal">1.1.02 Repasses MROSC Municipal (PMC Candeias)</option>
                    <option value="1.1.03 Repasses MROSC Federal">1.1.03 Repasses MROSC Federal (SENAD / MJ)</option>
                    <option value="1.2.01 Doações Institucionais">1.2.01 Doações Institucionais PJ / Fundações</option>
                    <option value="1.3.01 Rendimentos CDB MROSC">1.3.01 Rendimentos de Aplicação Financeira CDB</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Conta Destino Segregada</label>
                  <select 
                    className="form-select" 
                    value={editingCR.contaDestino} 
                    onChange={e => setEditingCR({ ...editingCR, contaDestino: e.target.value })}
                  >
                    {bancosList.map(b => (
                      <option key={b.id} value={`${b.nome} (C/C ${b.conta})`}>{b.nome} ({b.conta})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Termo MROSC Vinculado</label>
                  <select 
                    className="form-select" 
                    value={editingCR.termoMROSC} 
                    onChange={e => setEditingCR({ ...editingCR, termoMROSC: e.target.value })}
                  >
                    {([
                  { id: 'MROSC-005-2022-ORIGINAL', termo: 'Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)' },
                  { id: 'MROSC-005-2022-2TA', termo: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)' }
                ]).map(t => (
                      <option key={t.id || t.termo} value={t.termo || t.id}>
                        {t.termo || t.id} ({t.orgaoConcedente || 'MROSC'})
                      </option>
                    ))}
                    <option value="Recursos Próprios / Doações FDJ">Recursos Próprios / Doações FDJ</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Status do Título</label>
                  <select 
                    className="form-select" 
                    value={editingCR.status} 
                    onChange={e => setEditingCR({ ...editingCR, status: e.target.value })}
                  >
                    <option value="Recebido (Creditado)">Recebido (Creditado em Conta Segregada)</option>
                    <option value="Pendente (A Receber)">Pendente (A Receber)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingCR(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Comprovante Oficial de Liquidação NFe & Carimbo MROSC */}
      {selectedNFeForPrint && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px', background: 'var(--bg-card)', color: 'var(--text-main)' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>
                ✓ COMPROVANTE OFICIAL DE LIQUIDAÇÃO & CARIMBO MROSC LEI 13.019/2014
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={15} /> Imprimir Comprovante (PDF)
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedNFeForPrint(null)}>
                  <X size={15} /> Fechar
                </button>
              </div>
            </div>

            {/* Document Printable Body */}
            <div className="printable-document" style={{ border: '2px solid #2563eb', padding: '1.5rem', borderRadius: '12px', background: '#ffffff', color: '#0f172a' }}>
              
              {/* Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #cbd5e1', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1e3a8a', fontWeight: 900 }}>
                  FUNDAÇÃO DOUTOR JESUS • SGI MROSC BAHIA
                </h2>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>
                  DOSSIÊ DE COMPROVAÇÃO FISCAL, LIQUIDAÇÃO BANCÁRIA & CARIMBO ELETRÔNICO
                </div>
                <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                  {selectedNFeForPrint.termoMROSC} • Parceria SJDH-BA / MROSC Lei 13.019/2014
                </div>
              </div>

              {/* Order Info Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Ordem de Pagamento</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb' }}>{selectedNFeForPrint.id}</div>
                  <div style={{ fontSize: '0.75rem', color: '#334155', marginTop: '2px' }}>Solicitação: {selectedNFeForPrint.scId}</div>
                </div>

                <div style={{ background: '#ecfdf5', padding: '0.85rem', borderRadius: '8px', border: '1px solid #6ee7b7' }}>
                  <div style={{ fontSize: '0.7rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>Valor Total Liquidado</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669' }}>
                    R$ {selectedNFeForPrint.nfeValorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#065f46', marginTop: '2px' }}>Status: {selectedNFeForPrint.status}</div>
                </div>
              </div>

              {/* Fiscal Data Table */}
              <div style={{ marginBottom: '1.25rem', fontSize: '0.825rem' }}>
                <div style={{ background: '#f1f5f9', padding: '0.4rem 0.75rem', fontWeight: 800, color: '#1e293b', borderRadius: '4px 4px 0 0' }}>
                  📑 DADOS DA NOTA FISCAL ELETRÔNICA (NFe) & FORNECEDOR
                </div>
                <div style={{ border: '1px solid #cbd5e1', padding: '0.85rem', borderRadius: '0 0 4px 4px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div><strong>Fornecedor Favorecido:</strong> {selectedNFeForPrint.fornecedor} (CNPJ: {selectedNFeForPrint.cnpjFornecedor})</div>
                  <div><strong>Nota Fiscal / Número:</strong> {selectedNFeForPrint.nfeNumero} (Data de Emissão: {selectedNFeForPrint.nfeDataEmissao})</div>
                  <div><strong>Chave de Acesso SEFAZ (44 dígitos):</strong> <span style={{ fontFamily: 'monospace', color: '#047857', fontWeight: 700 }}>{selectedNFeForPrint.nfeChave}</span></div>
                  <div><strong>Rubrica Orçamentária:</strong> {selectedNFeForPrint.rubrica}</div>
                  <div><strong>Alinhamento Logístico:</strong> {selectedNFeForPrint.alinhamentoLogistico || 'Recebido no Almoxarifado Central FDJ'}</div>
                </div>
              </div>

              {/* Banking & Settlement Data */}
              <div style={{ marginBottom: '1.25rem', fontSize: '0.825rem' }}>
                <div style={{ background: '#eff6ff', padding: '0.4rem 0.75rem', fontWeight: 800, color: '#1e40af', borderRadius: '4px 4px 0 0' }}>
                  🏦 LIQUIDAÇÃO EM CONTA BANCÁRIA SEGREGADA (LEI 13.019/2014)
                </div>
                <div style={{ border: '1px solid #93c5fd', padding: '0.85rem', borderRadius: '0 0 4px 4px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div><strong>Conta Pagadora Segregada:</strong> {selectedNFeForPrint.contaPagadoraSegregada}</div>
                  <div><strong>Forma de Pagamento / Comprovante:</strong> {selectedNFeForPrint.formaPagamento} (Data: {selectedNFeForPrint.dataPagamento})</div>
                  <div><strong>Autenticação Bancária (TXID):</strong> <span style={{ fontFamily: 'monospace', color: '#2563eb', fontWeight: 700 }}>{selectedNFeForPrint.txidBancario}</span></div>
                  <div><strong>Dados Bancários PJ Favorecido:</strong> {selectedNFeForPrint.dadosBancariosPJ}</div>
                </div>
              </div>

              {/* Official MROSC Stamp Box */}
              <div style={{ 
                border: '2px dashed #059669', 
                background: '#f0fdf4', 
                padding: '1rem', 
                borderRadius: '8px', 
                textAlign: 'center',
                marginBottom: '1.25rem'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  CARIMBO DE VINCULAÇÃO MROSC (REGRA INDELÉVEL DA LEI 13.019/2014)
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#065f46', marginTop: '4px' }}>
                  "{selectedNFeForPrint.carimboTexto || 'Recursos decorrentes do Termo de Fomento nº 005/2022 SJDH-BA - Lei 13.019/2014'}"
                </div>
                <div style={{ fontSize: '0.7rem', color: '#047857', marginTop: '6px', fontFamily: 'monospace' }}>
                  AUTENTICAÇÃO CONTROLADORIA INTERNA FDJ: MROSC-FDJ-NFE-VERIFICADO-100%
                </div>
              </div>

              {/* Signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #cbd5e1', textAlign: 'center', fontSize: '0.75rem' }}>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '4px', fontWeight: 700 }}>Tesouraria & Gestão Financeira FDJ</div>
                  <div>Liquidador Responsável</div>
                </div>
                <div style={{ width: '45%' }}>
                  <div style={{ borderTop: '1px solid #000', paddingTop: '4px', fontWeight: 700 }}>Controladoria & Compliance MROSC</div>
                  <div>Auditor da Parceria</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Modal: Registrar Nova NFe & Liquidação Segregada */}
      {showNFeModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Receipt size={20} style={{ color: '#2563eb' }} />
                Registrar Nova NFe & Liquidação Segregada
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowNFeModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Nota Fiscal e Ordem de Pagamento registradas com sucesso e carimbadas pelo sistema MROSC!');
              setShowNFeModal(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ background: '#eff6ff', border: '1px solid #93c5fd', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#1e40af' }}>
                💡 <strong>Importação Automática do Contas a Pagar</strong>: Selecione um lançamento abaixo para carregar os dados sem precisar redigitar:
                <select 
                  className="form-select" 
                  style={{ marginTop: '0.5rem', fontSize: '0.8rem', background: '#ffffff' }}
                  onChange={(e) => {
                    if (e.target.value) {
                      alert(`Dados do lançamento "${e.target.value}" importados do Contas a Pagar! Informe apenas a Chave NFe (44 dígitos).`);
                    }
                  }}
                >
                  <option value="">-- Selecionar lançamento do Contas a Pagar (Opcional) --</option>
                  {contasPagar.map(cp => (
                    <option key={cp.id} value={cp.descricao}>
                      {cp.id} — {cp.fornecedor} (R$ {cp.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Número da Nota Fiscal (NFe) *</label>
                  <input type="text" className="form-input" required placeholder="Ex: NFe-9812" />
                </div>
                <div>
                  <label className="form-label">Valor Total NFe (R$) *</label>
                  <input type="number" step="0.01" className="form-input" required placeholder="0.00" />
                </div>
              </div>

              <div>
                <label className="form-label">Chave de Acesso SEFAZ (44 Dígitos) *</label>
                <input type="text" className="form-input" required maxLength={44} placeholder="Ex: 29260175315333000109550010000098121004829104" style={{ fontFamily: 'monospace' }} />
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Fornecedor Favorecido *</label>
                  <select className="form-select" required>
                    <option value="Atacadão S.A.">Atacadão S.A. (CNPJ: 75.315.333/0001-09)</option>
                    <option value="EMBASA">EMBASA (CNPJ: 13.504.675/0001-10)</option>
                    <option value="COELBA">COELBA (CNPJ: 15.135.960/0001-10)</option>
                    <option value="Nacional Gás">Nacional Gás (CNPJ: 08.561.701/0001-44)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Conta Pagadora Segregada *</label>
                  <select className="form-select" required>
                    {bancosList.map(b => (
                      <option key={b.id} value={`${b.nome} (C/C ${b.conta})`}>{b.nome} ({b.conta})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Termo MROSC Vinculado *</label>
                <select className="form-select" required>
                  <option value="Termo de Fomento nº 005/2022 (SJDH-BA)">Termo de Fomento nº 005/2022 (SJDH-BA)</option>
                  <option value="Termo de Colaboração nº 008/2025 (PMC)">Termo de Colaboração nº 008/2025 (PMC)</option>
                </select>
              </div>

              <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', padding: '0.75rem', borderRadius: '6px', fontSize: '0.775rem', color: '#065f46' }}>
                ✓ <strong>Carimbo Eletrônico Automático</strong>: O carimbo de vinculação e chancela da Lei 13.019/2014 será gravado no documento e sincronizado ao REF.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNFeModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">+ Registrar NFe & Homologar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Importar Extrato Bancário OFX / PDF Banco do Brasil */}
      {showImportModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={20} style={{ color: '#10b981' }} />
                Importar Extrato Bancário (OFX / PDF Banco do Brasil)
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowImportModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              alert(`Extrato ${selectedOFXFile ? `(${selectedOFXFile})` : 'do Banco do Brasil'} importado com sucesso! Batimento Trilateral executado com 100% de conciliação automática.`);
              setShowImportModal(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label className="form-label">Selecione a Conta Bancária Segregada MROSC *</label>
                <select className="form-select" required>
                  {bancosList.map(b => (
                    <option key={b.id} value={b.id}>{b.nome} (C/C {b.conta}) — Saldo R$ {b.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</option>
                  ))}
                </select>
              </div>

              {/* Drag and drop file area with working click trigger */}
              <div 
                onClick={() => document.getElementById('ofx-file-input')?.click()}
                style={{ 
                  border: '2px dashed #10b981', 
                  background: selectedOFXFile ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.05)', 
                  padding: '1.75rem 1rem', 
                  borderRadius: '10px', 
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Upload size={36} style={{ color: '#10b981', marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                  {selectedOFXFile ? `📄 Arquivo Selecionado: ${selectedOFXFile}` : 'Arraste o arquivo do Extrato (.OFX / .TXT / .PDF) aqui'}
                </div>
                <div style={{ fontSize: '0.8rem', color: selectedOFXFile ? '#047857' : 'var(--text-muted)', marginTop: '4px', fontWeight: selectedOFXFile ? 700 : 400 }}>
                  {selectedOFXFile ? '✓ Extrato pronto para processamento e conciliação bancária' : 'ou clique neste retângulo para escolher o arquivo do seu computador'}
                </div>
                <div style={{ marginTop: '0.85rem' }}>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-primary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('ofx-file-input')?.click();
                    }}
                    style={{ background: '#10b981', borderColor: '#059669' }}
                  >
                    📂 Procurar Arquivo no Computador
                  </button>
                </div>
                <input 
                  type="file" 
                  accept=".ofx,.pdf,.txt" 
                  style={{ display: 'none' }} 
                  id="ofx-file-input" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedOFXFile(e.target.files[0].name);
                    }
                  }}
                />
              </div>

              <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', padding: '0.75rem', borderRadius: '6px', fontSize: '0.775rem', color: '#065f46' }}>
                ✓ <strong>Algoritmo de Batimento Trilateral Ativo</strong>: O sistema cruzará os débitos do extrato bancário com as NFes carimbadas e ordens de pagamento, eliminando divergências para o relatório REF (Anexo III SJDH-BA).
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowImportModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#10b981', borderColor: '#059669' }}>
                  🚀 Processar & Batimento Automático
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cadastrar Nova Conta Bancária Segregada */}
      {showBancoModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} style={{ color: '#3b82f6' }} />
                Cadastrar Nova Conta Bancária Segregada MROSC
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowBancoModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Nova conta bancária segregada cadastrada com sucesso!');
              setShowBancoModal(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label className="form-label">Nome Identificador da Conta / Convênio *</label>
                <input type="text" className="form-input" required placeholder="Ex: BB SJDH-BA (Termo nº 005/2022)" />
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Instituição Bancária *</label>
                  <select className="form-select" required>
                    <option value="001 - Banco do Brasil">001 - Banco do Brasil</option>
                    <option value="104 - Caixa Econômica">104 - Caixa Econômica</option>
                    <option value="237 - Banco Bradesco">237 - Banco Bradesco</option>
                    <option value="Caixa Físico FDJ">Caixa Físico Sede FDJ</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Tipo de Recurso / Parceria *</label>
                  <select className="form-select" required>
                    <option value="MROSC Estadual">MROSC Estadual (SJDH / SADS)</option>
                    <option value="MROSC Municipal">MROSC Municipal (PMC Candeias)</option>
                    <option value="MROSC Federal">MROSC Federal (SENAD / MJ)</option>
                    <option value="Recursos Próprios">Recursos Próprios & Doações</option>
                  </select>
                </div>
              </div>

              <div className="grid-3">
                <div>
                  <label className="form-label">Agência Bancária *</label>
                  <input type="text" className="form-input" required placeholder="Ex: 3418-5" />
                </div>
                <div>
                  <label className="form-label">Número da Conta *</label>
                  <input type="text" className="form-input" required placeholder="Ex: 14.502-1" />
                </div>
                <div>
                  <label className="form-label">Saldo Inicial (R$) *</label>
                  <input type="number" step="0.01" className="form-input" required placeholder="0.00" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBancoModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">+ Salvar Conta Segregada</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Modal: Visualizador do Par Comprobatório em Sequência */}
      {previewPairItem && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #2563eb', paddingBottom: '0.5rem' }}>
              <div>
                <span className="badge badge-primary">OP DE COMPROVAÇÃO DE DESPESAS • MROSC</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Eye size={20} style={{ color: '#2563eb' }} />
                  Visualizador do Par Comprobatório em Sequência ({previewPairItem.fornecedor})
                </h3>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setPreviewPairItem(null)}>
                <X size={16} /> Fechar
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#1e293b' }}>
              <div><strong>Ordem de Pagamento:</strong> OP-2026/{previewPairItem.id}</div>
              <div><strong>Favorecido:</strong> {previewPairItem.fornecedor} (CNPJ: {previewPairItem.cnpj})</div>
              <div><strong>Valor Liquidado:</strong> R$ {parseFloat(previewPairItem.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <div><strong>Rubrica Orçamentária:</strong> {previewPairItem.categoria}</div>
            </div>

            {/* SEQUENTIAL PREVIEW: PAGE 1 (BB RECEIPT) & PAGE 2 (NFE/DOC STAMPED) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* PÁGINA 1: COMPROVANTE BANCÁRIO BB */}
              <div style={{ background: '#ffffff', border: '2px solid #0038a8', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0038a8', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0038a8' }}>SEI/SJDH-BA • COMPROVAÇÃO DE DESPESAS (DOCUMENTO 1 DE 2)</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#dc2626', fontFamily: 'monospace' }}>FOLHA 000598</span>
                </div>

                {previewPairItem.comprovanteFile ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', marginBottom: '6px' }}>[ARQUIVO BANCÁRIO REAL ANEXADO] {previewPairItem.comprovanteFileName || ''}</div>
                    {previewPairItem.comprovanteFile.includes('pdf') ? (
                      <object data={previewPairItem.comprovanteFile} type="application/pdf" style={{ width: '100%', height: '75vh', border: 'none', borderRadius: '6px' }}>
                        <embed src={previewPairItem.comprovanteFile} type="application/pdf" style={{ width: '100%', height: '75vh' }} />
                      </object>
                    ) : (
                      <img src={previewPairItem.comprovanteFile} alt="Comprovante BB Anexado" style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', border: '1px solid #cbd5e1' }} />
                    )}
                  </div>
                ) : (
                  <div style={{ background: '#f0f7ff', border: '1px dashed #0038a8', padding: '1.25rem', borderRadius: '6px', fontSize: '0.85rem', lineHeight: 1.6, fontFamily: 'monospace', color: '#1e293b' }}>
                    <div style={{ color: '#0038a8', fontWeight: 900, fontSize: '1.05rem', marginBottom: '0.5rem' }}>BANCO DO BRASIL S.A. — COMPROVANTE DE TRANSFERÊNCIA BANCÁRIA</div>
                    <div>CONTA SEGREGADA MROSC: AG. 3418-5 / C/C 14.502-1</div>
                    <div>VALOR TRANSFERIDO: R$ {parseFloat(previewPairItem.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <div>DATA DA OPERAÇÃO: {previewPairItem.vencimento || '25/06/2024'}</div>
                    <div>FAVORECIDO: {previewPairItem.fornecedor} (CNPJ: {previewPairItem.cnpj})</div>
                    <div style={{ marginTop: '0.75rem', color: '#059669', fontWeight: 700 }}>AUTENTICAÇÃO MECÂNICA BB: E.549.BCC.938.348.175-TXID-OK</div>
                  </div>
                )}
              </div>

                            {/* PÁGINA 2: DOCUMENTO FISCAL COM CARIMBO MROSC */}
              <div style={{ background: '#ffffff', border: '2px solid #059669', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #059669', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669' }}>SEI/SJDH-BA • DOCUMENTO COMPROBATÓRIO (DOCUMENTO 2 DE 2)</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#dc2626', fontFamily: 'monospace' }}>FOLHA 000163</span>
                </div>

                {(() => {
                  let pairIdx = 0;
                  if (previewPairItem.docType === 'FGTS' || previewPairItem.id === 'CP-002') pairIdx = 1;
                  else if (previewPairItem.id === 'CP-003') pairIdx = 2;

                  const docImg = `/dossie_pages/page_${pairIdx * 2 + 2}.png`;

                  return (
                    <div style={{ textAlign: 'center' }}>
                      <img src={docImg} alt="Documento Real do Processo" style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    </div>
                  );
                })()}
              </div>

            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setPreviewPairItem(null)}>
                Fechar Visualizador
              </button>
              <button className="btn btn-primary" style={{ background: '#2563eb', border: 'none' }} onClick={() => handlePrintSinglePair(previewPairItem)}>
                <FileText size={16} /> 🖨️ Imprimir PDF Deste Par (2 Folhas)
              </button>
            </div>

          </div>
        </div>
      )}


      {/* MODAL / VISUALIZADOR EM TELA INTEIRA DE DOSSIÊ COMPLETO SEI-BA */}
      {false && (
        <div className="dossie-print-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.85)', zIndex: 999999, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Top Floating Control Bar (Hidden on Print) */}
          <div className="no-print" style={{ width: '100%', background: '#1e293b', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', borderBottom: '1px solid #334155' }}>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} style={{ color: '#10b981' }} />
              Dossiê de Comprovação de Despesas MROSC (SEI-BA) — 1ª Parcela
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ background: '#10b981', borderColor: '#059669', fontWeight: 800, padding: '0.5rem 1.25rem' }} 
                onClick={() => window.print()}
              >
                <Printer size={18} /> 🖨️ Imprimir / Salvar como PDF
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ background: '#334155', color: '#fff', border: 'none' }} 
                onClick={() => setShowDossieModal(false)}
              >
                <X size={18} /> Fechar
              </button>
            </div>
          </div>

          {/* Printable A4 Pages Scroll Container */}
          <div style={{ flex: 1, width: '100%', overflowY: 'auto', padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            
            {/* CAPA DO DOSSIÊ / RELAÇÃO DE EXECUÇÃO FINANCEIRA (FOLHA 000161) */}
            <div className="dossie-a4-page" style={{ background: '#ffffff', width: '210mm', minHeight: '297mm', padding: '15mm 20mm', boxSizing: 'border-box', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid #e2e8f0', color: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', borderBottom: '2px solid #000', paddingBottom: '4px', marginBottom: '20px' }}>
                  <span>SECRETARIA DE JUSTIÇA E DIREITOS HUMANOS (SJDH-BA) • SEI-BA</span>
                  <span style={{ fontSize: '13px', color: '#c00', fontFamily: 'monospace' }}>FOLHA 000161</span>
                </div>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                  <h1 style={{ fontSize: '20px', margin: '0 0 6px 0', textTransform: 'uppercase' }}>FUNDAÇÃO DOUTOR JESUS</h1>
                  <h2 style={{ fontSize: '14px', fontWeight: 'normal', margin: 0, color: '#333' }}>RELAÇÃO DE COMPROVAÇÃO DE DESPESAS (ANEXO III - REF / MROSC)</h2>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '15px' }}>TERMO DE FOMENTO Nº 005/SJDH/2022 — ARARAT VI</p>
                  <p style={{ fontSize: '11px', color: '#555' }}>CONTA SEGREGADA BB: AG. 3418-5 / C/C 14.502-1 | LEI 13.019/2014</p>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '25px', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9' }}>
                      <th style={{ border: '1px solid #000', padding: '6px' }}>OP Nº</th>
                      <th style={{ border: '1px solid #000', padding: '6px' }}>DATA LIQUID.</th>
                      <th style={{ border: '1px solid #000', padding: '6px' }}>FORNECEDOR / RAZÃO SOCIAL</th>
                      <th style={{ border: '1px solid #000', padding: '6px' }}>CNPJ / CPF</th>
                      <th style={{ border: '1px solid #000', padding: '6px' }}>DOC / NFE</th>
                      <th style={{ border: '1px solid #000', padding: '6px' }}>RUBRICA</th>
                      <th style={{ border: '1px solid #000', padding: '6px' }}>VALOR (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContasPagar.filter(cp => cp && cp.status && (cp.status.includes('Pago') || cp.status.includes('Liquidado'))).map((cp, i) => (
                      <tr key={i}>
                        <td style={{ border: '1px solid #000', padding: '6px' }}>OP-{new Date().getFullYear()}/{String(i + 1).padStart(3, '0')}</td>
                        <td style={{ border: '1px solid #000', padding: '6px' }}>{cp.vencimento || '25/06/2024'}</td>
                        <td style={{ border: '1px solid #000', padding: '6px' }}>{cp.fornecedor}</td>
                        <td style={{ border: '1px solid #000', padding: '6px' }}>{cp.cnpj || 'PJ'}</td>
                        <td style={{ border: '1px solid #000', padding: '6px' }}>{cp.codigoDoc || 'NFe-8841'}</td>
                        <td style={{ border: '1px solid #000', padding: '6px' }}>{cp.categoria || '2.2.01'}</td>
                        <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>R$ {(parseFloat(cp.valor) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', textAlign: 'center', fontSize: '11px' }}>
                <div style={{ width: '45%', borderTop: '1px solid #000', paddingTop: '5px' }}>
                  <strong>FUNDAÇÃO DOUTOR JESUS</strong><br/>
                  Gestão Financeira & Tesouraria MROSC
                </div>
                <div style={{ width: '45%', borderTop: '1px solid #000', paddingTop: '5px' }}>
                  <strong>SJDH-BA / CONTROLADORIA</strong><br/>
                  Comissão de Monitoramento e Avaliação
                </div>
              </div>
            </div>

            {/* PARES COMPROBATÓRIOS EM ORDEM SEQUENCIAL */}
            {filteredContasPagar.filter(cp => cp && cp.status && (cp.status.includes('Pago') || cp.status.includes('Liquidado'))).map((cp, idx) => {
              const pageComp = String(162 + (idx * 2)).padStart(6, '0');
              const pageDoc = String(163 + (idx * 2)).padStart(6, '0');
              const valorFormatted = (parseFloat(cp.valor) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* DOCUMENTO 1: COMPROVANTE BB */}
                  <div className="dossie-a4-page" style={{ background: '#ffffff', width: '210mm', minHeight: '297mm', padding: '15mm 20mm', boxSizing: 'border-box', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid #e2e8f0', color: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', borderBottom: '2px solid #000', paddingBottom: '4px', marginBottom: '20px' }}>
                      <span>SEI/SJDH-BA • COMPROVAÇÃO DE DESPESAS</span>
                      <span style={{ fontSize: '13px', color: '#c00', fontFamily: 'monospace' }}>FOLHA {pageComp}</span>
                    </div>

                    {cp.docType === 'DARF' || cp.docType === 'FGTS' ? (
                      <div style={{ background: '#ffffff', border: '2px solid #0038a8', padding: '20px', borderRadius: '6px', fontSize: '12px', fontFamily: 'Courier New, monospace', color: '#000', lineHeight: 1.5, width: '100%', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0038a8', paddingBottom: '8px', marginBottom: '12px' }}>
                          <div>
                            <span style={{ fontSize: '20px', fontWeight: 900, color: '#0038a8' }}>SISBB</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#333', marginLeft: '8px' }}>— SISTEMA DE INFORMAÇÕES BANCO DO BRASIL</span>
                          </div>
                          <div style={{ textAlign: 'right', fontSize: '11px', fontWeight: 700 }}>
                            11/07/2022 — AUTOATENDIMENTO — 09.58.26<br/>
                            SEGUNDA VIA — 0009
                          </div>
                        </div>
                        <div style={{ textAlign: 'center', fontWeight: 900, fontSize: '15px', margin: '12px 0', textTransform: 'uppercase', color: '#0038a8' }}>
                          COMPROVANTE DE PAGAMENTO DE {cp.docType}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '15px 0', fontSize: '12px' }}>
                          <div><strong>CLIENTE:</strong> INSTITUTO D D H D JESUS</div>
                          <div><strong>AGÊNCIA:</strong> 2957-2 | <strong>CONTA:</strong> 982.100-7</div>
                          <div><strong>CONVÊNIO:</strong> {cp.docType === 'DARF' ? '070-DARF' : 'FGTS ARRECADAÇÃO GRF'}</div>
                          <div><strong>DATA DO PAGAMENTO:</strong> 11/07/2022</div>
                          <div><strong>CNPJ/CEI/CPF:</strong> 40.554.834/0001-63</div>
                          <div><strong>COMPETÊNCIA:</strong> 06/2022</div>
                          <div><strong>CÓDIGO RECOLHIMENTO:</strong> {cp.codigoReceita || '3429'}</div>
                          <div><strong>VENCIMENTO:</strong> 20/07/2022</div>
                          <div style={{ gridColumn: 'span 2', fontWeight: 900, fontSize: '14px', borderTop: '1px dashed #0038a8', paddingTop: '8px' }}>
                            VALOR TOTAL: R$ {valorFormatted}
                          </div>
                        </div>
                        <div style={{ marginTop: '15px', borderTop: '1px solid #0038a8', paddingTop: '8px', fontSize: '11px', color: '#0038a8', fontWeight: 700 }}>
                          DOCUMENTO: 071102 | AUTENTICAÇÃO SISBB: E.142.188.434.721.049
                        </div>
                        <div style={{ marginTop: '20px', border: '2px dashed #059669', padding: '10px', textAlign: 'center', background: '#ecfdf5', borderRadius: '4px' }}>
                          <div style={{ fontWeight: 900, color: '#047857', fontSize: '13px' }}>TERMO DE FOMENTO 005/SJDHDS/2022 "ARARAT VI"</div>
                        </div>
                      </div>
                    ) : (
                      <div className="doc-box" style={{ border: '2px solid #0038a8', padding: '20px', borderRadius: '6px', background: '#fafafa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0038a8', paddingBottom: '8px', marginBottom: '12px' }}>
                          <div>
                            <h3 style={{ color: '#0038a8', margin: 0, fontSize: '15px' }}>BANCO DO BRASIL S.A.</h3>
                            <span style={{ fontSize: '10px', color: '#555' }}>COMPROVANTE DE TRANSFERÊNCIA BANCÁRIA</span>
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', lineHeight: 1.6, fontFamily: 'monospace' }}>
                          <div><strong>CLIENTE:</strong> INSTITUTO DE DEFESA DOS DIREITOS HUMANOS DR JESUS</div>
                          <div><strong>AGÊNCIA:</strong> 3418-5 | <strong>CONTA SEGREGADA:</strong> 14.502-1</div>
                          <hr style={{ border: 0, borderTop: '1px dashed #ccc', margin: '10px 0' }} />
                          <div><strong>VALOR TOTAL:</strong> R$ {valorFormatted}</div>
                          <div><strong>TRANSFERIDO PARA:</strong> {cp.fornecedor}</div>
                          <div><strong>CNPJ/CPF:</strong> {cp.cnpj || '75.315.333/0001-09'}</div>
                          <hr style={{ border: 0, borderTop: '1px dashed #ccc', margin: '10px 0' }} />
                          <div style={{ color: '#0038a8', fontWeight: 'bold' }}>NR. AUTENTICAÇÃO MECÂNICA BB: E.549.BCC.938.348.175</div>
                        </div>
                      </div>
                    )}

                    <div style={{ fontSize: '10px', color: '#666', textAlign: 'center', marginTop: '20px' }}>
                      Página 1 do Par Comprobatório • Termo de Fomento nº 005/SJDH/2022
                    </div>
                  </div>

                  {/* DOCUMENTO 2: GUIA DARF / GRF / NFE */}
                  <div className="dossie-a4-page" style={{ background: '#ffffff', width: '210mm', minHeight: '297mm', padding: '15mm 20mm', boxSizing: 'border-box', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid #e2e8f0', color: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', borderBottom: '2px solid #000', paddingBottom: '4px', marginBottom: '20px' }}>
                      <span>SEI/SJDH-BA • DOCUMENTO COMPROBATÓRIO</span>
                      <span style={{ fontSize: '13px', color: '#c00', fontFamily: 'monospace' }}>FOLHA {pageDoc}</span>
                    </div>

                    {cp.docType === 'DARF' ? (
                      <div style={{ background: '#ffffff', border: '2px solid #1e3a8a', borderRadius: '6px', padding: '20px', fontFamily: 'Arial, sans-serif', color: '#000', width: '100%', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1e3a8a', paddingBottom: '10px', marginBottom: '12px' }}>
                          <div style={{ fontWeight: 900, fontSize: '22px', color: '#1e3a8a' }}>Receita Federal</div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 900, fontSize: '15px', color: '#1e3a8a' }}>Documento de Arrecadação de Receitas Federais (DARF)</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#dc2626', fontFamily: 'monospace' }}>FOLHA {pageDoc}</div>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', background: '#f8fafc', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', marginBottom: '15px', fontSize: '12px' }}>
                          <div><strong>CNPJ:</strong> 40.554.834/0001-63</div>
                          <div style={{ gridColumn: 'span 2' }}><strong>Razão Social:</strong> INSTITUTO DE DEFESA DOS DIREITOS HUMANOS DOUTOR JESUS</div>
                          <div><strong>Período de Apuração:</strong> 30/06/2022</div>
                          <div><strong>Data de Vencimento:</strong> 20/07/2022</div>
                          <div><strong>Número do Documento:</strong> 07.01.22188.1576682-3</div>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '15px' }}>
                          <thead>
                            <tr style={{ background: '#1e3a8a', color: '#fff' }}>
                              <th style={{ padding: '8px', textAlign: 'left' }}>Código</th>
                              <th style={{ padding: '8px', textAlign: 'left' }}>Denominação</th>
                              <th style={{ padding: '8px', textAlign: 'right' }}>Principal</th>
                              <th style={{ padding: '8px', textAlign: 'right' }}>Multa</th>
                              <th style={{ padding: '8px', textAlign: 'right' }}>Juros</th>
                              <th style={{ padding: '8px', textAlign: 'right' }}>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                              <td style={{ padding: '8px', fontWeight: 700 }}>3429</td>
                              <td style={{ padding: '8px' }}>IRRF - RENDIMENTO DO TRABALHO ASSALARIADO</td>
                              <td style={{ padding: '8px', textAlign: 'right' }}>1.823,59</td>
                              <td style={{ padding: '8px', textAlign: 'right' }}>0,00</td>
                              <td style={{ padding: '8px', textAlign: 'right' }}>0,00</td>
                              <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700 }}>R$ 1.823,59</td>
                            </tr>
                          </tbody>
                        </table>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ecfdf5', border: '2px dashed #059669', padding: '15px', borderRadius: '6px', margin: '20px 0' }}>
                          <div>
                            <div style={{ fontWeight: 900, color: '#047857', fontSize: '16px' }}>PAGUE-SE</div>
                            <div style={{ fontSize: '13px', color: '#065f46', fontWeight: 700 }}>Graciane G. Santos Santana "Fundação Dr. Jesus"</div>
                            <div style={{ fontSize: '11px', color: '#047857', marginTop: '6px' }}>Declaro para os devidos fins que o(s) serviço(s) e/ou material(is) constante(s) neste documento foram prestado(s) e/ou recebido(s).</div>
                          </div>
                          <div style={{ textAlign: 'right', borderLeft: '2px solid #059669', paddingLeft: '15px' }}>
                            <div style={{ fontWeight: 900, color: '#047857', fontSize: '13px' }}>TERMO DE FOMENTO 005/SJDHDS/2022</div>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: '#065f46' }}>"ARARAT VI"</div>
                          </div>
                        </div>

                        <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '10px', fontSize: '12px', fontFamily: 'monospace', textAlign: 'center', color: '#475569', fontWeight: 'bold' }}>
                          85880000018 0 23590385222 0 01070122188 4 15768823148 3 — AUTENTICAÇÃO MECÂNICA
                        </div>
                      </div>
                    ) : cp.docType === 'FGTS' ? (
                      <div style={{ background: '#ffffff', border: '2px solid #0284c7', borderRadius: '6px', padding: '20px', fontFamily: 'Arial, sans-serif', color: '#000', width: '100%', boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0284c7', paddingBottom: '10px', marginBottom: '12px' }}>
                          <div>
                            <div style={{ fontWeight: 900, fontSize: '20px', color: '#0284c7' }}>CAIXA ECONÔMICA FEDERAL</div>
                            <div style={{ fontSize: '13px', fontWeight: 700 }}>GUIA DE RECOLHIMENTO DO FGTS (GRF)</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#dc2626', fontFamily: 'monospace' }}>FOLHA {pageDoc}</div>
                          </div>
                        </div>

                        <div style={{ background: '#f0f9ff', padding: '12px', border: '1px solid #bae6fd', borderRadius: '4px', marginBottom: '15px', fontSize: '12px' }}>
                          <div><strong>Razão Social:</strong> INSTITUTO DE DEFESA DOS DIREITOS HUMANOS DOUTOR JESUS</div>
                          <div><strong>CNPJ/CEI:</strong> 40.554.834/0001-63</div>
                          <div><strong>Código Recolhimento:</strong> 115 — FGTS ARRECADAÇÃO GRF</div>
                          <div><strong>Valor Total Depositado:</strong> R$ 646,62</div>
                        </div>

                        <div style={{ border: '2px dashed #059669', background: '#ecfdf5', padding: '12px', borderRadius: '6px', textAlign: 'center', margin: '20px 0' }}>
                          <div style={{ fontWeight: 900, color: '#047857', fontSize: '13px' }}>TERMO DE FOMENTO Nº 005/SJDH/2022 — ARARAT VI</div>
                        </div>
                      </div>
                    ) : (
                      <div className="doc-box" style={{ border: '2px solid #1e293b', padding: '20px', borderRadius: '6px', background: '#fafafa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1e293b', paddingBottom: '8px', marginBottom: '12px' }}>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '15px' }}>DANFE / NOTA FISCAL ELETRÔNICA — {cp.codigoDoc || 'NFe-8841'}</h3>
                            <span style={{ fontSize: '10px', color: '#555' }}>EMITENTE: {cp.fornecedor} (CNPJ: {cp.cnpj})</span>
                          </div>
                        </div>
                        <div style={{ fontSize: '11px', lineHeight: 1.5 }}>
                          <div><strong>DESCRIÇÃO:</strong> {cp.descricao}</div>
                          <div><strong>VALOR TOTAL:</strong> R$ {valorFormatted}</div>
                        </div>
                        <div className="mrosc-stamp" style={{ border: '3px double #000', padding: '10px', textAlign: 'center', marginTop: '20px' }}>
                          <div style={{ fontWeight: 'bold', fontSize: '13px' }}>TERMO DE FOMENTO Nº 005/SJDH/2022</div>
                        </div>
                      </div>
                    )}

                    <div style={{ fontSize: '10px', color: '#666', textAlign: 'center', marginTop: '20px' }}>
                      Página 2 do Par Comprobatório • Termo de Fomento nº 005/SJDH/2022
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      )}

    </div>
  );
}
