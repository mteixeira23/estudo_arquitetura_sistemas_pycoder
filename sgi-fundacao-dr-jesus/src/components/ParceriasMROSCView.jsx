import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Landmark, 
  CheckCircle, 
  Download, 
  Printer, 
  X, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Plus, 
  Search, 
  PieChart, 
  Award, 
  Users, 
  CheckCircle2, 
  Building, 
  FileSpreadsheet, 
  Clock, 
  Calendar, 
  Activity, 
  Lock,
  Scale,
  Filter,
  ShoppingCart,
  ChevronRight,
  AlertCircle,
  Eye,
  ShieldAlert,
  UserCheck,
  Building2,
  MapPin,
  FileCheck,
  Archive,
  FileArchive,
  PlusCircle,
  Settings,
  RefreshCw,
  Sliders,
  Target,
  Layers
} from 'lucide-react';

export default function ParceriasMROSCView({ termosMROSC = [], transacoes = [], activeSubTab: externalSubTab, setActiveSubTab: setExternalSubTab }) {
  const [internalSubTab, setInternalSubTab] = useState('visao');
  
  // Valid subtabs for MROSC module
  const validTabs = ['visao', 'solicitacoes', 'cotacoes', 'anexo5', 'termos', 'anexo1', 'anexo2', 'anexo3', 'anexo4', 'anexo6'];
  const activeTab = validTabs.includes(externalSubTab) ? externalSubTab : (validTabs.includes(internalSubTab) ? internalSubTab : 'visao');

  const handleSubTabChange = (newTab) => {
    setInternalSubTab(newTab);
    if (setExternalSubTab) setExternalSubTab(newTab);
  };

          const defaultTermos = [
    {
      id: 'MROSC-005-2022-ORIGINAL',
      termo: 'Termo de Fomento nº 005/SJDH/2022 - Plano de Trabalho Original (1ª a 6ª Parcela)',
      orgaoConcedente: 'Secretaria de Justiça, Direitos Humanos e Desenvolvimento Social (SJDH-BA)',
      objeto: 'Acolhimento, tratamento multidisciplinar e reinserção social de até 1.250 dependentes químicos (24 Meses)',
      valorTotal: 56044295.81,
      saldoInicialBruto: 10424704.82,
      saldoAtual: 6282479.47,
      metaAcolhidosMes: 1250,
      executadoMes: 1250,
      percentualCumprimento: 100,
      vigenciaInicio: '2022-06-18',
      vigenciaFim: '2024-06-30',
      contaBancaria: 'Banco do Brasil - Ag. 3418-5 / C/C 14.502-1',
      status: 'Prestação de Contas Concluída (100% Conciliado)'
    },
    {
      id: 'MROSC-005-2022-2TA',
      termo: 'Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)',
      orgaoConcedente: 'Secretaria de Justiça, Direitos Humanos e Desenvolvimento Social (SJDH-BA)',
      objeto: 'Prorrogação por 36 meses e ampliação do atendimento multiprofissional (Até Julho/2027)',
      valorTotal: 105807135.83,
      valorGlobalConsolidado: 161851431.63,
      saldoInicialBruto: 6282479.47,
      saldoAtual: 10881542.76,
      metaAcolhidosMes: 1250,
      executadoMes: 1250,
      percentualCumprimento: 100,
      vigenciaInicio: '2024-07-06',
      vigenciaFim: '2027-07-06',
      contaBancaria: 'Banco do Brasil - Ag. 3418-5 / C/C 14.502-1',
      status: 'Em Execução Regular (100% Conciliado)'
    }
  ];


  const handleProcessarREFAuto = () => {
    setIsGeneratingREF(true);
    setTimeout(() => {
      setIsGeneratingREF(false);
      setFiltroPeriodoREF('parcela1FDJ');
      
      // Atualizar rubricas com os valores executados reais da 1a Parcela FDJ
      setRubricasDisponiveis(prev => prev.map(r => {
        let exec = 0;
        if (r.id === '2.1.01') exec = 1156539.77;
        else if (r.id === '2.1.02') exec = 591304.37;
        else if (r.id === '2.1.03') exec = 124018.41;
        else if (r.id === '2.1.04') exec = 40333.33;
        else if (r.id === '2.1.05') exec = 40000.00;
        else if (r.id === '2.1.06') exec = 175284.25;
        else if (r.id === '2.1.07') exec = 101642.61;
        else if (r.id === '2.2.01') exec = 2656881.54;
        else if (r.id === '2.3.01') exec = 104587.39;
        else if (r.id === '2.4.01') exec = 252626.35;
        else if (r.id === '2.5.01') exec = 111641.61;
        else if (r.id === '2.6.01') exec = 661055.06;
        else exec = Math.round(r.orcado * 0.4);
        
        return {
          ...r,
          executado: exec,
          saldo: Math.max(0, r.orcado - exec)
        };
      }));

      setRendimentosCDB(46849.16);
      setShowGerarAutoModal(false);
      setGenSuccessToast(true);
      setTimeout(() => setGenSuccessToast(false), 5000);
    }, 800);
  };

  const initialList = (Array.isArray(termosMROSC) && termosMROSC.length > 0) ? termosMROSC : defaultTermos;

  const [termosList, setTermosList] = useState(initialList);
  const [selectedTermoId, setSelectedTermoId] = useState('ALL');
  
  // Estado do Filtro de Período Sincronizado do Anexo III (REF) com o Módulo 2 Financeiro
    const [filtroPeriodoREF, setFiltroPeriodoREF] = useState('parcela1FDJ');
  const [showGerarAutoModal, setShowGerarAutoModal] = useState(false);
  const [selectedExtratoFonte, setSelectedExtratoFonte] = useState('fdj_parcela1');
  const [isGeneratingREF, setIsGeneratingREF] = useState(false);
  const [genSuccessToast, setGenSuccessToast] = useState(false);


  // Dados de Apuração Financeira Sincronizados com o Módulo 2 e os PDFs 10 e 11
  const dadosPeriodoREF = {
    parcela10FDJ: {
      rotulo: 'TF 005/2022 - 10ª Parcela (01/01/2026 a 30/06/2026 - FDJ R$ 19,69M / R$ 19,78M)',
      saldoInicial: 10972759.79,
      repasses: 19022565.08,
      rendimentos: 670985.21,
      entradasTotais: 19693550.29,
      saidas: 19784767.32,
      saldoFinal: 10881542.76,
      status: '100% Conciliado e Auditado com Extrato BB / Termo 005/2022 (Saldo Remanescente R$ 10,88M)'
    },
    parcela9FDJ: {
      rotulo: 'TF 005/2022 - 9ª Parcela (01/07/2025 a 31/12/2025 - FDJ R$ 20,28M / R$ 19,97M)',
      saldoInicial: 10662893.16,
      repasses: 19901468.18,
      rendimentos: 382221.93,
      entradasTotais: 20283690.11,
      saidas: 19973823.48,
      saldoFinal: 10972759.79,
      status: '100% Conciliado e Auditado com Extrato BB / Termo 005/2022 (Saldo Remanescente R$ 10,97M)'
    },
    parcela8FDJ: {
      rotulo: 'TF 005/2022 - 8ª Parcela (01/01/2025 a 30/06/2025 - FDJ R$ 17,85M / R$ 15,17M)',
      saldoInicial: 7984499.62,
      repasses: 17249999.98,
      rendimentos: 607066.22,
      entradasTotais: 17857066.20,
      saidas: 15178672.66,
      saldoFinal: 10662893.16,
      status: '100% Conciliado e Auditado com Extrato BB / Termo 005/2022 (Saldo Remanescente R$ 10,66M)'
    },
    parcela7FDJ: {
      rotulo: 'TF 005/2022 - 7ª Parcela (01/07/2024 a 31/12/2024 - FDJ R$ 15,94M / R$ 14,24M)',
      saldoInicial: 6282479.47,
      repasses: 15559999.97,
      rendimentos: 383575.96,
      entradasTotais: 15943575.93,
      saidas: 14241555.78,
      saldoFinal: 7984499.62,
      status: '100% Conciliado e Auditado com Extrato BB / Termo 005/2022 (C/C R$ 21,4k + CDB R$ 7,96M)'
    },
    parcela6FDJ: {
      rotulo: 'TF 005/2022 - 6ª Parcela (01/02/2024 a 30/06/2024 - FDJ R$ 9,09M / R$ 11,97M)',
      saldoInicial: 9161219.95,
      repasses: 8882098.76,
      rendimentos: 209288.92,
      entradasTotais: 9091387.68,
      saidas: 11970128.16,
      saldoFinal: 6282479.47,
      status: '100% Conciliado e Auditado com Extrato BB / Termo 005/2022 (C/C R$ 479,47 + CDB R$ 6,28M)'
    },
    parcela5FDJ: {
      rotulo: 'TF 005/2022 - 5ª Parcela (01/10/2023 a 31/01/2024 - FDJ R$ 19,54M / R$ 18,27M)',
      saldoInicial: 7851388.32,
      repasses: 19542917.37,
      rendimentos: 62282.32,
      entradasTotais: 19605199.69,
      saidas: 18277206.13,
      saldoFinal: 9179381.88,
      status: '100% Conciliado e Auditado com Extrato BB / Termo 005/2022'
    },
    parcela4FDJ: {
      rotulo: 'TF 005/2022 - 4ª Parcela (01/06/2023 a 30/09/2023 - FDJ R$ 10,51M / R$ 7,12M)',
      saldoInicial: 4456931.72,
      repasses: 10461201.06,
      rendimentos: 57422.40,
      entradasTotais: 10518623.46,
      saidas: 7124166.86,
      saldoFinal: 7851388.32,
      status: '100% Conciliado e Auditado com Extrato BB / Termo 005/2022'
    },
    parcela3FDJ: {
      rotulo: 'TF 005/2022 - 3ª Parcela (01/02/2023 a 31/05/2023 - FDJ R$ 8,42M / R$ 5,38M)',
      saldoInicial: 1420185.04,
      repasses: 8382115.09,
      rendimentos: 42443.65,
      entradasTotais: 8424558.74,
      saidas: 5387812.06,
      saldoFinal: 4456931.72,
      status: '100% Conciliado e Auditado com Extrato BB / Termo 005/2022'
    },
    parcela2FDJ: {
      rotulo: 'TF 005/2022 - 2ª Parcela (Out/2022 a Fev/2023 - FDJ R$ 9,09M / R$ 7,67M)',
      saldoInicial: 3144616.08,
      repasses: 9058926.48,
      rendimentos: 35865.42,
      entradasTotais: 9094791.90,
      saidas: 7674606.86,
      saldoFinal: 1420185.04,
      status: '100% Conciliado com Estornos TED R$ 87.998,00 (NFs 56, 66, 5679) / REF SJDH-BA'
    },
    parcela1FDJ: {
      rotulo: 'TF 005/2022 - 1ª Parcela (Fundação Dr. JESUS - 18/06/2022 a 17/10/2022 - R$ 10,4M)',
      saldoInicial: 0.00,
      repasses: 10377855.66,
      rendimentos: 46849.16,
      entradasTotais: 10424704.82,
      saidas: 7280088.74,
      saldoFinal: 3144616.08,
      status: '100% Auditado e Conciliado com Extrato BB / Termo 005/2022 (Divergência R$ 0,00)'
    },
    semestre1: {
      rotulo: '1º Semestre / 2026 (01/01/2026 a 30/06/2026 - Tabela 02 PDF 10)',
      saldoInicial: 1184898.12,
      repasses: 5400000.00,
      rendimentos: 18450.20,
      entradasTotais: 5418450.20,
      saidas: 1926204.04,
      saldoFinal: 3492246.16,
      status: '100% Conciliado com Extrato BB e REF SJDH-BA'
    },
    mes1: {
      rotulo: '1º Mês (Janeiro/2026 - 01/01/2026 a 31/01/2026 - Extrato PDF 11)',
      saldoInicial: 1184898.12,
      repasses: 1184898.12,
      rendimentos: 4850.20,
      entradasTotais: 1189748.32,
      saidas: 882399.70,
      saldoFinal: 1492246.74,
      status: '100% Conciliado com Extrato Mensal Banco do Brasil'
    },
    semestre2: {
      rotulo: '2º Semestre / 2026 (01/07/2026 a 31/12/2026 - Programado)',
      saldoInicial: 3492246.16,
      repasses: 7109388.72,
      rendimentos: 12500.00,
      entradasTotais: 7121888.72,
      saidas: 6990865.28,
      saldoFinal: 3623523.60,
      status: 'Programado em Convênio SJDH-BA'
    },
    anual: {
      rotulo: 'Visão Consolidada Anual 2026 (Termo nº 005/2022 SJDH-BA)',
      saldoInicial: 1184898.12,
      repasses: 14218777.44,
      rendimentos: 30950.20,
      entradasTotais: 14249727.64,
      saidas: 11815217.04,
      saldoFinal: 3611023.60,
      status: 'Aprovado SJDH-BA / TCE-BA'
    }
  };

  const periodoREFAtivo = dadosPeriodoREF[filtroPeriodoREF] || dadosPeriodoREF['semestre1'];

  const [showNewTermoModal, setShowNewTermoModal] = useState(false);
  const [showNewSCModal, setShowNewSCModal] = useState(false);
  const [showDossieModal, setShowDossieModal] = useState(false);
  const [showPlanoModal, setShowPlanoModal] = useState(false);
  const [showPlanoPrintModal, setShowPlanoPrintModal] = useState(false);
  const [selectedSCForPrint, setSelectedSCForPrint] = useState(null);
  const [selectedCotacaoForCompliance, setSelectedCotacaoForCompliance] = useState(null);

  const [activePlanoTable, setActivePlanoTable] = useState('tabela1');
  const [selectedAnoPlano, setSelectedAnoPlano] = useState('ANO1');

  // QUADRO DE INDICADORES, METAS E AÇÕES - SEÇÃO E.2 (18 AÇÕES E CRONOGRAMA DE 12 MESES POR ANO)
  const [acoesE2MultiAno] = useState([
    { id: 'Ação 01', meta: 'Meta 1', nome: 'Recepção e cadastro de novas pessoas em situação de vulnerabilidade/SPA', indicador: 'Número de cadastros novos realizados', unidade: 'Cadastros', meio: 'Cadastros e Termo de Adesão', m: '100', param: 'Alcançar 100% da demanda' },
    { id: 'Ação 02', meta: 'Meta 1', nome: 'Acolhimento de novas pessoas usuárias de SPA que demandam o serviço', indicador: 'Número de pessoas acolhidas', unidade: 'Pessoas', meio: 'Relatório de prontuário', m: '1.000', param: 'Alcançar 100% da demanda' },
    { id: 'Ação 03', meta: 'Meta 1', nome: 'Seleção, contratação e manutenção da Equipe Multidisciplinar e Administrativa', indicador: 'Equipe selecionada e contratada', unidade: 'Profissionais', meio: 'Folha de Pagamento, Contratos e GPS/GRF', m: '285', param: 'Capacidade de trabalho em equipe' },
    { id: 'Ação 04', meta: 'Meta 1', nome: 'Fornecimento de 4 refeições/dia (café, almoço, lanche, jantar) sob RDC 29', indicador: 'Cardápio (apresentação, higiene e qualidade nutricional)', unidade: 'Refeições', meio: 'Cardápio e NFes de alimentos', m: '90.000', param: 'Alcançar 100% da demanda' },
    { id: 'Ação 05', meta: 'Meta 1', nome: 'Manutenção e conservação operacional das Unidades de Acolhimento (40.000 m²)', indicador: 'Manutenções realizadas por mês', unidade: 'Intervenções', meio: 'Ordens de serviço, NFes e fotos', m: '44', param: 'Alcançar 100% da demanda' },
    { id: 'Ação 06', meta: 'Meta 1', nome: 'Aquisição de equipamentos (Frota, Bebedouros, Cozinha e Máquinas)', indicador: 'Número de equipamentos adquiridos', unidade: 'Equipamentos', meio: 'Cotações, NFe e Pagamento', m: 'Cronog.', param: 'Alcançar 100% da demanda' },
    { id: 'Ação 07', meta: 'Meta 1', nome: 'Contratação de empresa para o Sistema Gerencial de Gestão SGI FDJ', indicador: 'Número de contratos firmados', unidade: 'Contrato', meio: 'Contrato, Cotações e NFes', m: '1', param: 'Alcançar 100% da demanda' },
    { id: 'Ação 08', meta: 'Meta 1', nome: 'Contratação e manutenção de serviços de consultoria contábil e jurídica', indicador: 'Número de contratos firmados', unidade: 'Contratos', meio: 'Contratos, NFes e Honorários', m: '2', param: 'Alcançar 100% da demanda' },
    { id: 'Ação 09', meta: 'Meta 1', nome: 'Contratação de assessoria técnica, administrativa e capacitações da equipe', indicador: 'Número de contratos firmados', unidade: 'Contrato', meio: 'Contrato e Certificados', m: '1', param: 'Alcançar 100% da demanda' },
    { id: 'Ação 10', meta: 'Meta 1', nome: 'Aquisição e distribuição de material de higiene básica e enxoval', indicador: 'Número de pessoas atendidas', unidade: 'Pessoas', meio: 'Mapa de controle de entregas', m: '400', param: 'Alcançar 100% da demanda' },
    { id: 'Ação 11', meta: 'Meta 2', nome: 'Novos acolhimentos realizados pelo Serviço Social', indicador: 'Número de novos acolhimentos', unidade: 'Pessoas', meio: 'Mapa de atendimento', m: '50', param: 'Alcançar 100% da demanda' },
    { id: 'Ação 12', meta: 'Meta 2', nome: 'Atendimentos e acompanhamentos individuais pelo Serviço Social', indicador: 'Número de atendimentos individuais', unidade: 'Atendimentos', meio: 'Prontuários e relatórios', m: '250', param: 'Alcançar 100% da demanda' },
    { id: 'Ação 13', meta: 'Meta 2', nome: 'Atividades de grupo realizadas pelo Serviço Social', indicador: 'Número de atividades de grupo', unidade: 'Atividades', meio: 'Folha de presença e fotos', m: '80', param: 'Alcançar 100% da demanda' },
    { id: 'Ação 14', meta: 'Meta 2', nome: 'Encaminhamentos realizados pelo Serviço Social para a rede socioassistencial', indicador: 'Número de encaminhamentos', unidade: 'Encaminhamentos', meio: 'Mapa de encaminhamento', m: '100', param: 'Alcançar 100% da demanda' },
    { id: 'Ação 15', meta: 'Meta 2', nome: 'Novos acolhimentos realizados pelo Serviço de Psicologia', indicador: 'Número de novos acolhimentos', unidade: 'Pessoas', meio: 'Mapa de atendimento', m: '50', param: 'Alcançar 100% da demanda' },
    { id: 'Ação 16', meta: 'Meta 2', nome: 'Atendimentos e acompanhamentos individuais pela Psicologia', indicador: 'Número de atendimentos clínicos', unidade: 'Atendimentos', meio: 'Prontuários e relatórios', m: '250', param: 'Alcançar 100% da demanda' },
    { id: 'Ação 17', meta: 'Meta 2', nome: 'Atividades de grupo e oficinas terapêuticas pela Psicologia', indicador: 'Número de oficinas grupais', unidade: 'Atividades', meio: 'Folha de presença e fotos', m: '80', param: 'Alcançar 100% da demanda' },
    { id: 'Ação 18', meta: 'Meta 2', nome: 'Encaminhamentos psiquiátricos e de saúde pela Psicologia', indicador: 'Número de encaminhamentos', unidade: 'Encaminhamentos', meio: 'Mapa de encaminhamento', m: '100', param: 'Alcançar 100% da demanda' }
  ]);

  // TABELA 2: Equipe de Trabalho de 285 Colaboradores (Seção H — Folha 42 do PDF com 35 Cargos Detalhados)
  const [equipeTrabalhoH] = useState([
    { id: 1, cargo: 'Assistente Social', qtde: 24, vinculo: 'CLT', ch: '30h', base: 3284.00, inss: 656.80, fgts: 262.72, vt: 380.00, total: 109998.72 },
    { id: 2, cargo: 'Psicólogo', qtde: 24, vinculo: 'CLT', ch: '30h', base: 3284.00, inss: 656.80, fgts: 262.72, vt: 380.00, total: 109998.72 },
    { id: 3, cargo: 'Enfermeiro', qtde: 8, vinculo: 'CLT', ch: '36h', base: 3500.00, inss: 700.00, fgts: 280.00, vt: 380.00, total: 38880.00 },
    { id: 4, cargo: 'Prof. Educação Física', qtde: 4, vinculo: 'CLT', ch: '40h', base: 2800.00, inss: 560.00, fgts: 224.00, vt: 380.00, total: 15856.00 },
    { id: 5, cargo: 'Pedagogo', qtde: 2, vinculo: 'CLT', ch: '40h', base: 2800.00, inss: 560.00, fgts: 224.00, vt: 380.00, total: 7928.00 },
    { id: 6, cargo: 'Nutricionista', qtde: 2, vinculo: 'CLT', ch: '40h', base: 3800.00, inss: 760.00, fgts: 304.00, vt: 380.00, total: 10488.00 },
    { id: 7, cargo: 'Técnico de Nutrição', qtde: 4, vinculo: 'CLT', ch: '40h', base: 1800.00, inss: 360.00, fgts: 144.00, vt: 380.00, total: 10736.00 },
    { id: 8, cargo: 'Fisioterapeuta', qtde: 2, vinculo: 'CLT', ch: '30h', base: 3284.00, inss: 656.80, fgts: 262.72, vt: 380.00, total: 9166.56 },
    { id: 9, cargo: 'Téc. Manutenção e Suporte de Informática', qtde: 1, vinculo: 'CLT', ch: '44h', base: 2500.00, inss: 500.00, fgts: 200.00, vt: 380.00, total: 3580.00 },
    { id: 10, cargo: 'Auxiliar de Enfermagem', qtde: 4, vinculo: 'CLT', ch: '36h', base: 1412.00, inss: 282.40, fgts: 112.96, vt: 380.00, total: 8749.44 },
    { id: 11, cargo: 'Técnico de Enfermagem', qtde: 12, vinculo: 'CLT', ch: '36h', base: 1800.00, inss: 360.00, fgts: 144.00, vt: 380.00, total: 32208.00 },
    { id: 12, cargo: 'Técnico de Enfermagem Noturno', qtde: 6, vinculo: 'CLT', ch: '36h', base: 1800.00, inss: 432.00, fgts: 172.80, vt: 380.00, total: 17908.80 },
    { id: 13, cargo: 'Almoxarife', qtde: 2, vinculo: 'CLT', ch: '44h', base: 1800.00, inss: 360.00, fgts: 144.00, vt: 380.00, total: 5368.00 },
    { id: 14, cargo: 'Técnico de Farmácia', qtde: 2, vinculo: 'CLT', ch: '44h', base: 1800.00, inss: 360.00, fgts: 144.00, vt: 380.00, total: 5368.00 },
    { id: 15, cargo: 'Coordenador', qtde: 12, vinculo: 'CLT', ch: '44h', base: 3500.00, inss: 700.00, fgts: 280.00, vt: 380.00, total: 58320.00 },
    { id: 16, cargo: 'Monitor', qtde: 60, vinculo: 'CLT', ch: '44h', base: 1412.00, inss: 282.40, fgts: 112.96, vt: 380.00, total: 131241.60 },
    { id: 17, cargo: 'Monitor Noturno', qtde: 24, vinculo: 'CLT', ch: '44h', base: 1412.00, inss: 338.88, fgts: 135.55, vt: 380.00, total: 54394.32 },
    { id: 18, cargo: 'Líder de Equipe', qtde: 14, vinculo: 'CLT', ch: '44h', base: 1800.00, inss: 360.00, fgts: 144.00, vt: 380.00, total: 37576.00 },
    { id: 19, cargo: 'Líder de Equipe Noturno', qtde: 10, vinculo: 'CLT', ch: '44h', base: 1800.00, inss: 432.00, fgts: 172.80, vt: 380.00, total: 27848.00 },
    { id: 20, cargo: 'Auxiliar de Cozinha', qtde: 10, vinculo: 'CLT', ch: '44h', base: 1412.00, inss: 282.40, fgts: 112.96, vt: 380.00, total: 21873.60 },
    { id: 21, cargo: 'Auxiliar de Cozinha Noturno', qtde: 6, vinculo: 'CLT', ch: '44h', base: 1412.00, inss: 338.88, fgts: 135.55, vt: 380.00, total: 13598.58 },
    { id: 22, cargo: 'Cozinheiro', qtde: 6, vinculo: 'CLT', ch: '44h', base: 1600.00, inss: 320.00, fgts: 128.00, vt: 380.00, total: 14568.00 },
    { id: 23, cargo: 'Cozinheiro Noturno', qtde: 6, vinculo: 'CLT', ch: '44h', base: 1600.00, inss: 384.00, fgts: 153.60, vt: 380.00, total: 16305.60 },
    { id: 24, cargo: 'Motorista', qtde: 10, vinculo: 'CLT', ch: '44h', base: 2200.00, inss: 440.00, fgts: 176.00, vt: 380.00, total: 31960.00 },
    { id: 25, cargo: 'Motorista Noturno', qtde: 4, vinculo: 'CLT', ch: '44h', base: 2200.00, inss: 528.00, fgts: 211.20, vt: 380.00, total: 13276.80 },
    { id: 26, cargo: 'Operador de Som', qtde: 1, vinculo: 'CLT', ch: '44h', base: 1600.00, inss: 320.00, fgts: 128.00, vt: 380.00, total: 2428.00 },
    { id: 27, cargo: 'Monitor Infantil', qtde: 2, vinculo: 'CLT', ch: '44h', base: 1412.00, inss: 282.40, fgts: 112.96, vt: 380.00, total: 4374.72 },
    { id: 28, cargo: 'Assistente Administrativo', qtde: 1, vinculo: 'CLT', ch: '44h', base: 1800.00, inss: 360.00, fgts: 144.00, vt: 380.00, total: 2684.00 },
    { id: 29, cargo: 'Gerente Administrativo', qtde: 1, vinculo: 'CLT', ch: '44h', base: 4500.00, inss: 900.00, fgts: 360.00, vt: 380.00, total: 6140.00 },
    { id: 30, cargo: 'Diretor de Transporte', qtde: 1, vinculo: 'CLT', ch: '44h', base: 5500.00, inss: 1100.00, fgts: 440.00, vt: 380.00, total: 7420.00 },
    { id: 31, cargo: 'Diretor Administrativo', qtde: 1, vinculo: 'CLT', ch: '44h', base: 6500.00, inss: 1300.00, fgts: 520.00, vt: 380.00, total: 8700.00 },
    { id: 32, cargo: 'Diretor de Saúde', qtde: 1, vinculo: 'CLT', ch: '44h', base: 6500.00, inss: 1300.00, fgts: 520.00, vt: 380.00, total: 8700.00 },
    { id: 33, cargo: 'Diretor de Segurança', qtde: 1, vinculo: 'CLT', ch: '44h', base: 6500.00, inss: 1300.00, fgts: 520.00, vt: 380.00, total: 8700.00 },
    { id: 34, cargo: 'Líder de Transporte', qtde: 1, vinculo: 'CLT', ch: '44h', base: 2450.00, inss: 490.00, fgts: 196.00, vt: 380.00, total: 3516.00 },
    { id: 35, cargo: 'Líder Serviços Gerais', qtde: 24, vinculo: 'CLT', ch: '44h', base: 1412.00, inss: 282.40, fgts: 112.96, vt: 380.00, total: 52496.64 }
  ]);

  // TABELA 3: Previsão de Receitas e Despesas (Seção I do PDF)
  const [previsaoReceitasDespesasI] = useState([
    { rubrica: '2.1.1.1', item: 'Salários e Vencimentos da Equipe (285 colaboradores)', mensal: 741605.61, anual: 8899267.32 },
    { rubrica: '2.1.1.2', item: 'Anuênio / Adicionais Tempo de Serviço', mensal: 14832.11, anual: 177985.32 },
    { rubrica: '2.1.1.3', item: 'Adicional Noturno', mensal: 9219.83, anual: 110637.96 },
    { rubrica: '2.1.1.4', item: 'Reflexo DSR Adicional Noturno', mensal: 1773.04, anual: 21276.48 },
    { rubrica: '2.1.1.5', item: 'Vale Transporte', mensal: 70470.47, anual: 845645.64 },
    { rubrica: '2.1.1.6', item: 'Exames Admissionais, Demissionais e Periódicos', mensal: 20400.00, anual: 44237.00 },
    { rubrica: '2.1.2.1', item: 'Encargos Sociais INSS Patronal', mensal: 78448.46, anual: 941381.52 },
    { rubrica: '2.1.2.2', item: 'Encargos Sociais FGTS', mensal: 39224.23, anual: 470690.76 },
    { rubrica: '2.1.2.4', item: 'Rescisões de Trabalho / Saldo Salário', mensal: 63952.55, anual: 767430.60 },
    { rubrica: '2.1.2.7', item: '1/3 Constitucional de Férias', mensal: 21317.52, anual: 255810.24 },
    { rubrica: '2.1.2.8', item: '13º Salário Proporcional', mensal: 63952.55, anual: 767430.60 }
  ]);

  // TABELA 4: Detalhamento de Bens e Equipamentos MROSC (Seção L do PDF)
  const [bensEquipamentosL] = useState([
    { id: 1, item: 'Micro-ônibus de Transporte', qtde: 2, unitario: 382191.84, total: 764383.68, just: 'Assegurar o transporte de acolhidos para exames, atividades externas e consultas' },
    { id: 2, item: 'Chevrolet Spin 7 Lugares', qtde: 1, unitario: 131560.00, total: 131560.00, just: 'Transporte rápido de acolhidos e atendimento emergencial da equipe médica' },
    { id: 3, item: 'Caminhão Baú de Carga', qtde: 1, unitario: 458580.00, total: 458580.00, just: 'Transporte de compras de gêneros alimentícios, equipamentos e material de reforma' },
    { id: 4, item: 'Fogão Industrial 6 Bocas', qtde: 2, unitario: 9139.00, total: 18278.00, just: 'Reposição pelo desgaste frente ao número de 4.000 refeições/dia na Cozinha' },
    { id: 5, item: 'Amaciador de Pães Espiral 2 Velocidades', qtde: 1, unitario: 18398.00, total: 18398.00, just: 'Confecção e produção de pães para servir os acolhidos da Fundação Dr. Jesus' },
    { id: 6, item: 'Modeladora de Pão com Pedestal', qtde: 1, unitario: 7996.00, total: 7996.00, just: 'Modelagem de pães fabricados na padaria da Fundação para alimentação' },
    { id: 7, item: 'Cilindro de Massas 5M Inox 220V', qtde: 1, unitario: 19799.00, total: 19799.00, just: 'Homogeneização e sovação de massas na padaria comunitária da Fundação' },
    { id: 8, item: 'Forno Industrial Turbo 10 Esteiras GLP', qtde: 2, unitario: 11098.00, total: 22196.00, just: 'Assamento contínuo de pães e refeições fabricadas diariamente na Cozinha' },
    { id: 9, item: 'Armário de Crescimento de Pão (20 Assadeiras)', qtde: 6, unitario: 2251.03, total: 13506.18, just: 'Fermentação padronizada de pães produzidos para servir os acolhidos' },
    { id: 10, item: 'Bebedouros Purificadores de Água Industrial', qtde: 5, unitario: 9216.17, total: 46080.85, just: 'Colocar água potável gelada em lugares acessíveis aos acolhidos e visitantes' },
    { id: 11, item: 'Bomba Submersa P10 5.5 CV Dancor', qtde: 2, unitario: 7800.00, total: 15600.00, just: 'Frente ao uso e utilidade extremamente necessário para água potável no complexo' },
    { id: 12, item: 'Freezer Horizontal Frigorífico 510L', qtde: 10, unitario: 5659.00, total: 56590.00, just: 'Manter os alimentos perecíveis (carnes, peixes e laticínios) conservados' },
    { id: 13, item: 'Liquidificador Industrial 25 Litros', qtde: 3, unitario: 3198.00, total: 9594.00, just: 'Servir o pessoal da cozinha no preparo diário de sucos e refeições' }
  ]);

    // Rubricas Orçamentárias Aprovadas SJDH-BA com Saldos e Lançamentos Executados do 1º Semestre / 2026 (PDF 10 e 11)
  const [rubricasDisponiveis, setRubricasDisponiveis] = useState([
    { id: '2.1.01', grupo: 'Grupo 1: Pessoal & Encargos', nome: '2.1.01 Vencimentos & Salários da Equipe (285 Colaboradores)', det: 'Folha de pagamento mensal dos 285 profissionais CLT pactuados', orcado: 8899267.32, emSC: 0, executado: 817146.40, saldo: 8082120.92 },
    { id: '2.1.02', grupo: 'Grupo 1: Pessoal & Encargos', nome: '2.1.02 Adicionais Salariais (Anuênio, Adicional Noturno e DSR)', det: 'Anuênio, Adicional Noturno e reflexo DSR da equipe de plantão', orcado: 309899.76, emSC: 0, executado: 25449.88, saldo: 284449.88 },
    { id: '2.1.03', grupo: 'Grupo 1: Pessoal & Encargos', nome: '2.1.03 Vale Transporte da Equipe Multidisciplinar', det: 'Benefício obrigatório de vale-transporte para deslocamento do pessoal', orcado: 845645.64, emSC: 0, executado: 70470.47, saldo: 775175.17 },
    { id: '2.1.04', grupo: 'Grupo 1: Pessoal & Encargos', nome: '2.1.04 Medicina do Trabalho & Exames Ocupacionais', det: 'Exames admissionais, demissionais, periódicos e PCMSO/LTCAT', orcado: 44237.00, emSC: 0, executado: 3686.42, saldo: 40550.58 },
    { id: '2.1.05', grupo: 'Grupo 1: Pessoal & Encargos', nome: '2.1.05 Encargos Sociais INSS Patronal (Guia GPS)', det: 'Contribuição previdenciária patronal sobre a folha de pagamento', orcado: 941381.52, emSC: 0, executado: 54276.00, saldo: 887105.52 },
    { id: '2.1.06', grupo: 'Grupo 1: Pessoal & Encargos', nome: '2.1.06 Encargos Sociais FGTS (Guia GRF)', det: 'Fundo de Garantia do Tempo de Serviço da equipe contratada', orcado: 470690.76, emSC: 0, executado: 21710.40, saldo: 448980.36 },
    { id: '2.1.07', grupo: 'Grupo 1: Pessoal & Encargos', nome: '2.1.07 Provisões Trabalhistas (Rescisões, Férias 1/3 e 13º)', det: 'Provisão de saldo de salário, 1/3 férias constitucionais e 13º salário', orcado: 1790671.44, emSC: 0, executado: 149222.62, saldo: 1641448.82 },
    { id: '2.2.01', grupo: 'Grupo 2: Alimentação & Nutrição', nome: '2.2.01 Alimentação & Insumos de Nutrição Comunitária', det: 'Gêneros alimentícios hortifrúti, carnes, grãos e laticínios (4.000 refeições/dia)', orcado: 450000.00, emSC: 0, executado: 40750.00, saldo: 409250.00 },
    { id: '2.3.01', grupo: 'Grupo 3: Saúde & Medicamentos', nome: '2.3.01 Medicamentos, Insumos de Enfermagem & Enxoval', det: 'Medicamentos aprazados, insumos de enfermagem e vestuário/colchões', orcado: 250000.00, emSC: 0, executado: 38523.00, saldo: 211477.00 },
    { id: '2.4.01', grupo: 'Grupo 4: Logística & Frota', nome: '2.4.01 Combustível (Óleo Diesel S10) & Frota de Transporte', det: 'Óleo Diesel S10, manutenção de ônibus, Spin e Caminhão Baú', orcado: 200000.00, emSC: 0, executado: 1824.07, saldo: 198175.93 },
    { id: '2.5.01', grupo: 'Grupo 5: Concessionárias Públicas', nome: '2.5.01 Concessionárias (EMBASA Água, COELBA Energia, Gás GLP e Telecom)', det: 'Contratos públicos EMBASA, COELBA, Gás GLP Cilíndrico e Internet Fibra Óptica', orcado: 3800000.00, emSC: 0, executado: 555725.37, saldo: 3244274.63 },
    { id: '2.6.01', grupo: 'Grupo 6: Manutenção Predial', nome: '2.6.01 Manutenção Predial, Higiene RDC 29 & Conservação', det: 'Insumos de higienização hospitalar/comunitária e reparos de 40.000 m²', orcado: 1500000.00, emSC: 0, executado: 147419.41, saldo: 1352580.59 }
  ]);

  // Estado dinâmico dos Rendimentos da Aplicação CDB do 1º Semestre / 2026 (PDF 10 e 11)
  const [rendimentosCDB, setRendimentosCDB] = useState(18450.20);

  // Estado dinâmico do Anexo II (REO) - Apuração Realizada no Período
  const [reoRealizados, setReoRealizados] = useState({
    'M-01': 300,
    'M-02': 600,
    'M-03': 90000,
    'M-04': 285,
    'M-05': 240,
    'M-06': 100
  });

  const handleReoChange = (code, val) => {
    setReoRealizados(prev => ({
      ...prev,
      [code]: parseInt(val) || 0
    }));
  };

  // Funcao para Zerar Gastos e Iniciar Testes do Zero
  const handleZerarDados = () => {
    if (window.confirm("Deseja zerar todos os gastos e dados realizados de exemplo para iniciar seus testes reais do zero?")) {
      setRubricasDisponiveis(prev => prev.map(r => ({
        ...r,
        emSC: 0,
        executado: 0,
        saldo: r.orcado
      })));
      setReoRealizados({
        'M-01': 0,
        'M-02': 0,
        'M-03': 0,
        'M-04': 0,
        'M-05': 0,
        'M-06': 0
      });
      setRendimentosCDB(0);
      setSolicitacoesCompra([]);
      setCotacoes([]);
    }
  };

  const handleRestaurarExemplo = () => {
    setRendimentosCDB(4850.20);
    setReoRealizados({
      'M-01': 300,
      'M-02': 612,
      'M-03': 90000,
      'M-04': 285,
      'M-05': 240,
      'M-06': 108
    });
    setRubricasDisponiveis([
      { id: '2.1.01', grupo: 'Grupo 1: Pessoal & Encargos Sociais', nome: '2.1.01 Equipe Multidisciplinar & Folha de Pagamento', det: 'Médicos, Psicólogos, Enfermeiros, Assistentes Sociais e Cozinheiros', orcado: 600000, emSC: 0, executado: 450000, saldo: 150000 },
      { id: '2.2.01', grupo: 'Grupo 2: Alimentação & Nutrição', nome: '2.2.01 Alimentação & Insumos de Nutrição Comunitária', det: 'Gêneros alimentícios hortifrúti, carnes, grãos e laticínios para 4 refeições/dia', orcado: 450000, emSC: 28500, executado: 380000, saldo: 41500 },
      { id: '2.3.01', grupo: 'Grupo 3: Saúde & Medicamentos', nome: '2.3.01 Medicamentos & Enxoval Enfermaria', det: 'Medicamentos aprazados, insumos de enfermagem e vestuário/colchões', orcado: 250000, emSC: 6420, executado: 180000, saldo: 63580 },
      { id: '2.4.01', grupo: 'Grupo 4: Logística & Frota', nome: '2.4.01 Combustível, Transporte & Logística de Acolhidos', det: 'Óleo Diesel S10, manutenção de ônibus e transporte SUS', orcado: 200000, emSC: 9800, executado: 140000, saldo: 50200 },
      { id: '2.5.01', grupo: 'Grupo 5: Concessionárias & Fixos', nome: '2.5.01 Concessionárias (Água, Energia e Telecom)', det: 'Contratos EMBASA, COELBA e Internet Fibra Óptica', orcado: 150000, emSC: 0, executado: 110000, saldo: 40000 },
      { id: '2.6.01', grupo: 'Grupo 6: Manutenção Predial', nome: '2.6.01 Manutenção Predial & Higiene RDC 29', det: 'Insumos de higienização hospitalar/comunitária e reparos prediais', orcado: 150000, emSC: 0, executado: 95000, saldo: 55000 }
    ]);
  };

  const handleAddRubrica = (e) => {
    e.preventDefault();
    if (!newRubrica.nome || !newRubrica.orcado) return;
    const valOrcado = parseFloat(newRubrica.orcado) || 0;
    const entry = {
      id: newRubrica.id,
      grupo: newRubrica.grupo,
      nome: `${newRubrica.id} ${newRubrica.nome}`,
      det: newRubrica.det || 'Rubrica inserida conforme plano de trabalho pactuado.',
      orcado: valOrcado,
      emSC: 0,
      executado: 0,
      saldo: valOrcado
    };
    setRubricasDisponiveis([...rubricasDisponiveis, entry]);
    setShowPlanoModal(false);
    setNewRubrica({ id: '2.7.01', grupo: 'Grupo 7: Despesas Gerais', nome: '', det: '', orcado: '' });
  };

  // FASE 1: State for Formal Purchase Requests (Pedidos de Compras por Rubrica)
  const [solicitacoesCompra, setSolicitacoesCompra] = useState([
    {
      id: 'SC-2026/001-FDJ',
      termo: 'Termo de Fomento nº 005/SJDH/2022',
      rubrica: '2.2.01 Alimentação & Insumos de Nutrição Comunitária',
      item: 'Aquisição de Gêneros Alimentícios para Cozinha Industrial (4.000 refeições/dia)',
      quantidade: '5.000 kg (Arroz, Feijão, Macarrão, Açúcar, Óleo)',
      valorEstimado: 28500.00,
      saldoRubrica: 70000.00,
      solicitante: 'Cozinha Industrial / Nutrição',
      dataSolicitacao: '2026-08-01',
      justificativa: 'Atendimento contínuo ao plano de trabalho do Termo de Fomento nº 005/SJDH/2022 SJDH-BA.',
      status: 'Aprovado para 3 Cotações'
    },
    {
      id: 'SC-2026/002-FDJ',
      termo: 'Termo de Fomento nº 005/SJDH/2022',
      rubrica: '2.3.01 Medicamentos & Enxoval Enfermaria',
      item: 'Medicamentos Aprazados de Enfermagem (Diazepam, Sertralina, Complexo B, Ataduras)',
      quantidade: '1.200 caixas / unidades',
      valorEstimado: 6420.50,
      saldoRubrica: 70000.00,
      solicitante: 'Enfermagem & Farmácia SGI',
      dataSolicitacao: '2026-08-03',
      justificativa: 'Atendimento ambulatorial contínuo dos 300 acolhidos sob acompanhamento RDC 29 ANVISA.',
      status: 'Em Coleta de 3 Cotações'
    },
    {
      id: 'SC-2026/003-FDJ',
      termo: 'Termo de Fomento nº 005/SJDH/2022',
      rubrica: '2.4.01 Combustível, Transporte & Logística de Acolhidos',
      item: 'Abastecimento de Óleo Diesel S10 para Frota de Ônibus e Vans de Atendimento SUS',
      quantidade: '1.800 Litros',
      valorEstimado: 9800.00,
      saldoRubrica: 60000.00,
      solicitante: 'Logística & Transporte Sede',
      dataSolicitacao: '2026-08-04',
      justificativa: 'Transporte semanal de acolhidos para exames de regulação e retorno ao convívio comunitário.',
      status: 'Homologado (Menor Preço)'
    }
  ]);

  // FASE 2: Price Survey & Compliance QSA Anti-Colusão State
  const [cotacoes] = useState([
    {
      id: 'COT-2026-01',
      scId: 'SC-2026/001-FDJ',
      rubrica: '2.2.01 Alimentação & Insumos de Nutrição Comunitária',
      item: 'Aquisição de Gêneros Alimentícios para Cozinha Industrial (5.000 kg)',
      data: '2026-08-05',
      empresa1: {
        nome: 'Distribuidora Ceasa Salvador Ltda',
        cnpj: '12.480.112/0001-88',
        endereco: 'Via Urbana, 1500, CIA I, Simões Filho/BA',
        statusCNPJ: 'Ativo na RFB',
        cnae: '46.39-7-01 - Comércio atacadista de produtos alimentícios',
        valor: 28500.00,
        validadeProposta: '60 dias (Válida)',
        qsa: ['Carlos Eduardo Silva', 'Mariana Alencar']
      },
      empresa2: {
        nome: 'Atacadão Candeias Alimentos S/A',
        cnpj: '04.102.881/0001-11',
        endereco: 'Av. Antonio Paterson, 450, Centro, Candeias/BA',
        statusCNPJ: 'Ativo na RFB',
        cnae: '46.39-7-01 - Comércio atacadista de produtos alimentícios',
        valor: 31200.00,
        validadeProposta: '30 dias (Válida)',
        qsa: ['Roberto Mendes', 'Fernanda Lima']
      },
      empresa3: {
        nome: 'Comercial Horti Bahia Distribuidora Ltda',
        cnpj: '08.120.441/0001-90',
        endereco: 'Rua Direta do Cabula, 88, Salvador/BA',
        statusCNPJ: 'Ativo na RFB',
        cnae: '46.39-7-01 - Comércio atacadista de produtos alimentícios',
        valor: 33400.00,
        validadeProposta: '45 dias (Válida)',
        qsa: ['Juliana Castro', 'Marcelo Souza']
      },
      colusaoDetectada: false,
      motivoCompliance: 'QSA e Endereços auditados na RFB: 0% de intersecção entre sócios e endereços distintos. Ausência total de colusão e independência comercial atestada.',
      status: 'Homologado (Menor Preço)'
    }
  ]);

  // FASE 5: Certidões Negativas CND
  const [certidoesCND] = useState([
    { id: 'CND-01', documento: 'CND Federal (Tributos Federais e Dívida Ativa da União)', orgao: 'Receita Federal / PGFN', validade: '2026-11-15', diasRestantes: 90, codigoAutenticidade: 'RFB.9920.1049.8810.4920', status: 'Válida & Regular' },
    { id: 'CND-02', documento: 'CRF FGTS (Certificado de Regularidade do FGTS)', orgao: 'Caixa Econômica Federal', validade: '2026-10-30', diasRestantes: 74, codigoAutenticidade: 'CEF.2026.8492.0104.9921', status: 'Válida & Regular' },
    { id: 'CND-03', documento: 'CNDT Trabalhista (Débitos Trabalhistas - TST)', orgao: 'Tribunal Superior do Trabalho', validade: '2026-12-05', diasRestantes: 110, codigoAutenticidade: 'TST.9820.4910.2940.1094', status: 'Válida & Regular' },
    { id: 'CND-04', documento: 'CND Estadual SEFAZ-BA (Tributos Estaduais)', orgao: 'Secretaria da Fazenda da Bahia', validade: '2026-11-20', diasRestantes: 95, codigoAutenticidade: 'SEFAZ.BA.2026.0491.0294', status: 'Válida & Regular' },
    { id: 'CND-05', documento: 'CND Municipal PMC (Prefeitura de Candeias)', orgao: 'Prefeitura Municipal de Candeias', validade: '2026-12-10', diasRestantes: 115, codigoAutenticidade: 'PMC.CANDEIAS.2026.8810.49', status: 'Válida & Regular' }
  ]);

  // Form State for New Purchase Request (SC)
  const [newSC, setNewSC] = useState({
    termo: 'Termo de Fomento nº 005/SJDH/2022',
    rubrica: '2.2.01 Alimentação & Insumos de Nutrição Comunitária',
    item: '',
    quantidade: '',
    valorEstimado: '',
    solicitante: 'Cozinha Industrial / Nutrição',
    justificativa: 'Estrita conformidade com o Plano de Trabalho do Projeto Governamental SJDH-BA.'
  });

  const activeRubricaInfo = useMemo(() => {
    return rubricasDisponiveis.find(r => r.nome === newSC.rubrica) || rubricasDisponiveis[0];
  }, [newSC.rubrica, rubricasDisponiveis]);

  const handleCreateSC = (e) => {
    e.preventDefault();
    if (!newSC.item || !newSC.valorEstimado) return;

    const newEntry = {
      id: `SC-2026/00${solicitacoesCompra.length + 1}-FDJ`,
      ...newSC,
      valorEstimado: parseFloat(newSC.valorEstimado) || 0,
      saldoRubrica: activeRubricaInfo.saldo,
      dataSolicitacao: new Date().toISOString().split('T')[0],
      status: 'Aprovado para 3 Cotações'
    };

    setSolicitacoesCompra([newEntry, ...solicitacoesCompra]);
    setShowNewSCModal(false);
    setNewSC({
      termo: 'Termo de Fomento nº 005/SJDH/2022',
      rubrica: '2.2.01 Alimentação & Insumos de Nutrição Comunitária',
      item: '',
      quantidade: '',
      valorEstimado: '',
      solicitante: 'Cozinha Industrial / Nutrição',
      justificativa: 'Estrita conformidade com o Plano de Trabalho do Projeto Governamental SJDH-BA.'
    });
  };

  // Active Termo Object
  const currentTermo = useMemo(() => {
    if (selectedTermoId === 'ALL') return termosList[0] || defaultTermos[0];
    return termosList.find(t => t.id === selectedTermoId) || termosList[0] || defaultTermos[0];
  }, [selectedTermoId, termosList]);

  // Total Budgets
  const totalOrcadoPlano = useMemo(() => rubricasDisponiveis.reduce((acc, r) => acc + r.orcado, 0), [rubricasDisponiveis]);
  const totalExecutadoPlano = useMemo(() => rubricasDisponiveis.reduce((acc, r) => acc + r.executado, 0), [rubricasDisponiveis]);
  const totalSaldoPlano = useMemo(() => rubricasDisponiveis.reduce((acc, r) => acc + r.saldo, 0), [rubricasDisponiveis]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Module Title Header Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(37, 99, 235, 0.15))',
        border: '1px solid #3b82f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
            color: '#fff',
            padding: '0.85rem 1.15rem',
            borderRadius: '10px',
            fontWeight: 800,
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Módulo 1</div>
            <div style={{ fontSize: '1.2rem' }}>PARCERIAS MROSC</div>
            <div style={{ fontSize: '0.6rem', color: '#93c5fd' }}>Lei 13.019 • SJDH-BA</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-primary">Em Parceria com a SJDH-BA</span>
              <span className="badge badge-success">Conformidade Total Anexos I ➔ VI</span>
              <span className="badge badge-info">100% Auditável pelo TCE-BA</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', color: '#0f172a', margin: 0 }}>
              Gestão de Convênios, Pedidos de Compras e Prestação de Contas
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: '4px 0 0 0' }}>
              Fluxo integrado: Plano de Trabalho ➔ Solicitação SC ➔ 3 Cotações ➔ Compliance QSA ➔ Pagamento Segregado ➔ Dossiê TCE-BA.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-warning btn-sm" title="Zera todos os lançamentos para testar o sistema do zero" onClick={handleZerarDados}>
            🧹 Zerar Gastos (Testar do Zero)
          </button>
          <button className="btn btn-secondary btn-sm" title="Restaura os dados demonstrativos de exemplo" onClick={handleRestaurarExemplo}>
            📊 Carregar Exemplo
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowDossieModal(true)}>
            <FileArchive size={16} /> Dossiê (.ZIP)
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
            <Printer size={16} /> Emitir Dossiê PDF
          </button>
        </div>
      </div>

      {/* Internal Subtabs Bar na Sequência Exata do Sidebar */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        <button 
          className={`btn btn-sm ${activeTab === 'visao' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleSubTabChange('visao')}
        >
          <Landmark size={15} /> Visão Geral & Termos SJDH-BA
        </button>

        <button 
          className={`btn btn-sm ${activeTab === 'solicitacoes' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleSubTabChange('solicitacoes')}
        >
          <ShoppingCart size={15} /> 1. Pedido de Compras & Rubricas ({solicitacoesCompra.length})
        </button>

        <button 
          className={`btn btn-sm ${activeTab === 'cotacoes' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleSubTabChange('cotacoes')}
        >
          <ShieldCheck size={15} /> 2. Cotações & Compliance QSA ({cotacoes.length})
        </button>

        <button 
          className={`btn btn-sm ${activeTab === 'anexo5' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleSubTabChange('anexo5')}
        >
          <Archive size={15} /> 5. Auditoria & Dossiê Compactado ({certidoesCND.length})
        </button>

        <button 
          className={`btn btn-sm ${activeTab === 'anexo1' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleSubTabChange('anexo1')}
        >
          <FileText size={15} /> Anexo I: Plano de Trabalho & Rubricas
        </button>

        <button 
          className={`btn btn-sm ${activeTab === 'anexo2' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleSubTabChange('anexo2')}
        >
          <Target size={15} /> Anexo II: Execução do Objeto (REO)
        </button>

        <button 
          className={`btn btn-sm ${activeTab === 'anexo3' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleSubTabChange('anexo3')}
        >
          <DollarSign size={15} /> Anexo III: Execução Financeira (REF)
        </button>

        <button 
          className={`btn btn-sm ${activeTab === 'anexo4' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleSubTabChange('anexo4')}
        >
          <CheckCircle2 size={15} /> Anexo IV: Conciliação & Rendimentos
        </button>

        <button 
          className={`btn btn-sm ${activeTab === 'anexo6' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleSubTabChange('anexo6')}
        >
          <Award size={15} /> Anexo VI: Parecer TCE-BA / SJDH
        </button>
      </div>

      {/* SUBTAB 1: VISÃO GERAL */}
      {activeTab === 'visao' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-3">
            <div className="card stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
              <div className="stat-icon-wrapper"><Landmark size={24} /></div>
              <div className="stat-info">
                <h4>Repasses Totais MROSC</h4>
                <div className="stat-value">R$ {currentTermo.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div className="stat-subtext">3 Convênios Vigentes SJDH/PMC</div>
              </div>
            </div>

            <div className="card stat-card" style={{ borderLeft: '4px solid #059669' }}>
              <div className="stat-icon-wrapper"><DollarSign size={24} /></div>
              <div className="stat-info">
                <h4>Saldo em Contas Segregadas</h4>
                <div className="stat-value">R$ {currentTermo.saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div className="stat-subtext">Disponível em Bancos / CDB</div>
              </div>
            </div>

            <div className="card stat-card" style={{ borderLeft: '4px solid #d97706' }}>
              <div className="stat-icon-wrapper"><Users size={24} /></div>
              <div className="stat-info">
                <h4>Acolhidos no MROSC</h4>
                <div className="stat-value">{currentTermo.executadoMes} / {currentTermo.metaAcolhidosMes}</div>
                <div className="stat-subtext">{currentTermo.percentualCumprimento}% da Meta Pactuada</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building size={20} style={{ color: '#2563eb' }} />
                Instrumentos de Parceria Vigentes (Termos de Fomento e Colaboração)
              </h3>
              <button className="btn btn-primary btn-sm" onClick={() => handleSubTabChange('anexo1')}>
                <Settings size={15} /> ⚙️ Controle do Plano de Trabalho
              </button>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Termo de Parceria</th>
                    <th>Concedente</th>
                    <th>Valor Total</th>
                    <th>Saldo Atual</th>
                    <th>Acolhidos</th>
                    <th>Vigência</th>
                    <th>Conta Segregada</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {termosList.map(t => (
                    <tr key={t.id}>
                      <td><span className="badge badge-primary">{t.id}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{t.termo}</td>
                      <td style={{ fontSize: '0.8rem' }}>{t.orgaoConcedente}</td>
                      <td style={{ fontWeight: 700 }}>R$ {t.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td style={{ fontWeight: 700, color: '#059669' }}>R$ {t.saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td>{t.executadoMes} / {t.metaAcolhidosMes}</td>
                      <td style={{ fontSize: '0.75rem' }}>{t.vigenciaInicio} a {t.vigenciaFim}</td>
                      <td style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{t.contaBancaria}</td>
                      <td><span className="badge badge-success">{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB ANEXO I: PLANO DE TRABALHO MROSC INTEGRAL */}
      {activeTab === 'anexo1' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="card" style={{ borderLeft: '4px solid #2563eb', background: '#eff6ff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-primary">ANEXO I LEGAL (Lei 13.019/2014 & SJDH-BA)</span>
                <h3 style={{ fontSize: '1.2rem', color: '#1e3a8a', margin: '0.25rem 0' }}>
                  Plano de Trabalho Pactuado: Matriz de Metas Físicas e Rubricas Orçamentárias
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#1e40af', margin: 0 }}>
                  Controle integrado em tempo real do orçamento aprovado, valores bloqueados em cotações, gastos liquidados e saldos por rubrica.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowPlanoModal(true)}>
                  <PlusCircle size={16} /> + Nova Rubrica / Ajuste Orçamentário
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => setShowPlanoPrintModal(true)}>
                  <Printer size={16} /> Emitir Anexo I Oficial PDF
                </button>
              </div>
            </div>
          </div>

          {/* SELETOR DE VISUALIZAÇÃO DAS TABELAS OFICIAIS DO PDF DE 67 PÁGINAS */}
          <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.5rem', borderRadius: '8px', overflowX: 'auto' }}>
            <button className={`btn btn-sm ${activePlanoTable === 'tabela1' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActivePlanoTable('tabela1')}>
              <Target size={15} /> Tabela 1: Indicadores & Metas E.2 (Folha 21)
            </button>
            <button className={`btn btn-sm ${activePlanoTable === 'tabela2' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActivePlanoTable('tabela2')}>
              <Users size={15} /> Tabela 2: Equipe de Trabalho H (285 Pessoas)
            </button>
            <button className={`btn btn-sm ${activePlanoTable === 'tabela3' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActivePlanoTable('tabela3')}>
              <DollarSign size={15} /> Tabela 3: Previsão de Receita e Despesa I
            </button>
            <button className={`btn btn-sm ${activePlanoTable === 'tabela4' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActivePlanoTable('tabela4')}>
              <ShoppingCart size={15} /> Tabela 4: Equipamentos & Frota L
            </button>
          </div>

          {/* TABELA 1: INDICADORES E METAS (SEÇÃO E.2 - FOLHAS 21 A 34) */}
          {activePlanoTable === 'tabela1' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', color: '#1e3a8a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target size={18} style={{ color: '#2563eb' }} />
                  Tabela 1: Quadro de Indicadores, Metas e Ações com Cronograma Físico Mensal (Seção E.2)
                </h4>

                {/* SELETOR DE ANO PACTUADO (ANO I a ANO IV) */}
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button className={`btn btn-xs ${selectedAnoPlano === 'ANO1' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelectedAnoPlano('ANO1')}>
                    ANO I (2024/2025)
                  </button>
                  <button className={`btn btn-xs ${selectedAnoPlano === 'ANO2' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelectedAnoPlano('ANO2')}>
                    ANO II (2025/2026)
                  </button>
                  <button className={`btn btn-xs ${selectedAnoPlano === 'ANO3' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelectedAnoPlano('ANO3')}>
                    ANO III (2026/2027)
                  </button>
                  <button className={`btn btn-xs ${selectedAnoPlano === 'ANO4' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelectedAnoPlano('ANO4')}>
                    ANO IV (2027/2028)
                  </button>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '0.75rem', fontSize: '0.8rem', color: '#334155' }}>
                📅 <strong>Cronograma de Execução Físico-Programática ({selectedAnoPlano})</strong>: Exibe as metas pactuadas distribuídas mês a mês (do Mês 1 ao Mês 12) conforme o PDF oficial de 67 páginas.
              </div>

              <div className="table-container">
                <table className="data-table" style={{ fontSize: '0.775rem' }}>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Meta</th>
                      <th>Descrição da Ação Oficial</th>
                      <th>Indicador de Desempenho</th>
                      <th>Unidade</th>
                      <th>Meio de Verificação</th>
                      <th style={{ textAlign: 'center', background: '#eff6ff' }}>M1</th>
                      <th style={{ textAlign: 'center', background: '#eff6ff' }}>M2</th>
                      <th style={{ textAlign: 'center', background: '#eff6ff' }}>M3</th>
                      <th style={{ textAlign: 'center', background: '#eff6ff' }}>M4</th>
                      <th style={{ textAlign: 'center', background: '#eff6ff' }}>M5</th>
                      <th style={{ textAlign: 'center', background: '#eff6ff' }}>M6</th>
                      <th style={{ textAlign: 'center', background: '#eff6ff' }}>M7</th>
                      <th style={{ textAlign: 'center', background: '#eff6ff' }}>M8</th>
                      <th style={{ textAlign: 'center', background: '#eff6ff' }}>M9</th>
                      <th style={{ textAlign: 'center', background: '#eff6ff' }}>M10</th>
                      <th style={{ textAlign: 'center', background: '#eff6ff' }}>M11</th>
                      <th style={{ textAlign: 'center', background: '#eff6ff' }}>M12</th>
                      <th>Parâmetro de Desempenho</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acoesE2MultiAno.map(a => (
                      <tr key={a.id}>
                        <td><span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{a.id}</span></td>
                        <td><span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>{a.meta}</span></td>
                        <td style={{ fontWeight: 700, color: 'var(--text-main)', minWidth: '180px' }}>{a.nome}</td>
                        <td style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{a.indicador}</td>
                        <td style={{ fontWeight: 600 }}>{a.unidade}</td>
                        <td style={{ fontSize: '0.7rem', color: '#059669' }}>{a.meio}</td>
                        {[...Array(12)].map((_, i) => (
                          <td key={i} style={{ textAlign: 'center', fontWeight: 800, color: '#2563eb', background: '#f8fafc' }}>{a.m}</td>
                        ))}
                        <td style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600 }}>{a.param}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABELA 2: EQUIPE DE TRABALHO (SEÇÃO H - FOLHA 42) */}
          {activePlanoTable === 'tabela2' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1rem', color: '#1e3a8a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={18} style={{ color: '#2563eb' }} />
                  Tabela 2: Quadro de Pessoal — 285 Colaboradores CLT (Seção H — Folha 42 do PDF Oficial)
                </h4>
                <span className="badge badge-success">Total: 285 Profissionais CLT (R$ 817.146,40/mês)</span>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Cargo Pactuado</th>
                      <th>Qtde Vagas</th>
                      <th>Vínculo</th>
                      <th>Carga Horária</th>
                      <th>Salário Base (R$)</th>
                      <th>INSS Patronal (R$)</th>
                      <th>FGTS (R$)</th>
                      <th>Vale Transp. (R$)</th>
                      <th>Total Mensal (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipeTrabalhoH.map(item => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.cargo}</td>
                        <td><span className="badge badge-primary">{item.qtde} vagas</span></td>
                        <td>{item.vinculo}</td>
                        <td>{item.ch}</td>
                        <td>R$ {item.base.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td>R$ {item.inss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td>R$ {item.fgts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td>R$ {item.vt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td style={{ fontWeight: 800, color: '#2563eb' }}>R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABELA 3: PREVISÃO DE RECEITAS E DESPESAS (SEÇÃO I - FOLHA 43) */}
          {activePlanoTable === 'tabela3' && (
            <div className="card">
              <h4 style={{ fontSize: '1rem', color: '#1e3a8a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={18} style={{ color: '#059669' }} />
                Tabela 3: Previsão Mensal de Receitas e Despesas (Seção I — Folha 43 do PDF Oficial)
              </h4>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Código Rubrica</th>
                      <th>Elemento de Despesa Pactuado</th>
                      <th>Previsão Mensal (R$)</th>
                      <th>Previsão Anual (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previsaoReceitasDespesasI.map((item, idx) => (
                      <tr key={idx}>
                        <td><span className="badge badge-primary">{item.rubrica}</span></td>
                        <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.item}</td>
                        <td style={{ fontWeight: 800, color: '#2563eb' }}>R$ {item.mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td style={{ fontWeight: 800, color: '#059669' }}>R$ {item.anual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABELA 4: EQUIPAMENTOS, FROTA E COZINHA (SEÇÃO L - FOLHAS 64-67) */}
          {activePlanoTable === 'tabela4' && (
            <div className="card">
              <h4 style={{ fontSize: '1rem', color: '#1e3a8a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingCart size={18} style={{ color: '#d97706' }} />
                Tabela 4: Detalhamento de Bens, Equipamentos e Frota MROSC (Seção L — Folhas 64-67 do PDF Oficial)
              </h4>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Descrição do Bem / Equipamento</th>
                      <th>Qtde</th>
                      <th>Valor Unitário (R$)</th>
                      <th>Valor Total (R$)</th>
                      <th>Justificativa Oficial para Aquisição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bensEquipamentosL.map(item => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.item}</td>
                        <td><span className="badge badge-primary">{item.qtde} un</span></td>
                        <td>R$ {item.unitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td style={{ fontWeight: 800, color: '#2563eb' }}>R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{item.just}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REGRAS DE REMANEJAMENTO MROSC (< 10%) */}
          <div className="card" style={{ background: '#f8fafc', borderLeft: '4px solid #3b82f6' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sliders size={16} style={{ color: '#2563eb' }} />
              Regra de Remanejamento Orçamentário sem Aditivo (Art. 35 § 2º Lei 13.019/2014)
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>
              Remanejamentos orçamentários de até <strong>10% (dez por cento)</strong> do valor de cada rubrica são autorizados diretamente pelo sistema sem necessidade de termo aditivo formal com a SJDH-BA, mediante simples comunicação oficial na prestação de contas.
            </p>
          </div>

          {/* OBJETIVOS GERAL E ESPECÍFICOS & QUADRO DAS 11 AÇÕES DO PLANO */}
          <div className="card" style={{ borderLeft: '4px solid #1e3a8a', background: '#ffffff' }}>
            <h4 style={{ fontSize: '1.05rem', color: '#1e3a8a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} style={{ color: '#2563eb' }} />
              3. Objetivos Geral e Específicos & Quadro das 11 Ações do Plano de Trabalho (SJDH-BA)
            </h4>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.9rem', marginBottom: '0.25rem' }}>🎯 OBJETIVO GERAL DO PROJETO:</div>
              <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, textAlign: 'justify' }}>
                Realizar acolhimento residencial continuado e tratamento psicossocial em regime de internamento de até <strong>1.000 (mil) pessoas de ambos os sexos</strong>, maiores de 18 anos, em situação de risco social, de vulnerabilidade e usuárias de substâncias psicoativas, em ambiente protegido, organizado e seguro, contribuindo para a redução de implicações sociais e de saúde decorrentes do uso indevido de drogas.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '6px', border: '1px solid #93c5fd' }}>
                <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.825rem' }}>1. Acolhimento de 1.000 Pessoas</div>
                <div style={{ fontSize: '0.775rem', color: '#1e40af' }}>Garantia de alojamento, segurança alimentar e atenção humana integral.</div>
              </div>
              <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '6px', border: '1px solid #93c5fd' }}>
                <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.825rem' }}>2. Equipe de 285 Colaboradores CLT</div>
                <div style={{ fontSize: '0.775rem', color: '#1e40af' }}>Manutenção do corpo multidisciplinar (Médicos, Psicólogos, Enfermeiros).</div>
              </div>
              <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '6px', border: '1px solid #93c5fd' }}>
                <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.825rem' }}>3. Ressocialização de 300 Pessoas</div>
                <div style={{ fontSize: '0.775rem', color: '#1e40af' }}>Reinserção familiar, comunitária e qualificação ocupacional.</div>
              </div>
              <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '6px', border: '1px solid #93c5fd' }}>
                <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.825rem' }}>4. Atuação nos 6 CAFVIDAs</div>
                <div style={{ fontSize: '0.775rem', color: '#1e40af' }}>Apoio às famílias vítimas de drogas na RMS e municípios prioritários.</div>
              </div>
            </div>

            <h5 style={{ fontSize: '0.9rem', color: '#1e293b', marginBottom: '0.5rem', fontWeight: 700 }}>Quadro Oficial das 11 Ações do Plano de Trabalho:</h5>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ação</th>
                    <th>Descrição Oficial da Ação</th>
                    <th>Indicador de Verificação</th>
                    <th>Meta de Execução</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><strong>Ação 1</strong></td><td>Recepção e cadastro de novas pessoas (Prontuário Individual)</td><td>Cadastros e Termo de Adesão</td><td>Atender 100% da demanda</td></tr>
                  <tr><td><strong>Ação 2</strong></td><td>Acolhimento humanizado e vistoria em subgrupos de 15 acolhidos</td><td>Relatório de acolhimento</td><td>Atender 100% da demanda</td></tr>
                  <tr><td><strong>Ação 3</strong></td><td>Manutenção da Equipe Multidisciplinar (285 colaboradores CLT)</td><td>Folha de Pagamento e Guia GPS/GRF</td><td>285 profissionais ativos</td></tr>
                  <tr><td><strong>Ação 4</strong></td><td>Fornecimento de 4.000 refeições/dia sob RDC 29 ANVISA</td><td>Cardápio e NFes de alimentos</td><td>90.000 refeições/mês</td></tr>
                  <tr><td><strong>Ação 5</strong></td><td>Manutenção e conservação predial das unidades (40.000 m²)</td><td>Notas Fiscais de Manutenção</td><td>44 intervenções/mês</td></tr>
                  <tr><td><strong>Ação 6</strong></td><td>Aquisição de equipamentos (Frota, Bebedouros, Forno, Câmaras)</td><td>Cotações, NFe e Tombamento</td><td>Atender demanda da frota/sede</td></tr>
                  <tr><td><strong>Ação 7</strong></td><td>Contratação de empresa para o Sistema Gerencial SGI FDJ</td><td>Contrato e NFes de serviço</td><td>1 Sistema Ativo 100%</td></tr>
                  <tr><td><strong>Ação 8</strong></td><td>Contratação de assessoria e consultoria contábil e jurídica</td><td>Contrato e Honorários</td><td>Manter 100% regularidade</td></tr>
                  <tr><td><strong>Ação 9</strong></td><td>Treinamento, capacitação e treinamento dos colaboradores</td><td>Folha de presença e certificados</td><td>Capacitar 285 funcionários</td></tr>
                  <tr><td><strong>Ação 10</strong></td><td>Distribuição de material de higiene básica e vestuário/enxoval para acolhidos</td><td>Recibos de entrega e NFes</td><td>400 kits entregues/mês</td></tr>
                  <tr><td><strong>Ação 11</strong></td><td>Oficinas de laborterapia, assembleias comunitárias e reinserção</td><td>Relatórios e fotos de oficinas</td><td>240 horas/acolhido</td></tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB ANEXO II: RELATÓRIO DE EXECUÇÃO DO OBJETO (REO MROSC) */}
      {activeTab === 'anexo2' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="card" style={{ borderLeft: '4px solid #059669', background: '#ecfdf5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-success">ANEXO II LEGAL (REO — Lei 13.019/2014 & SJDH-BA)</span>
                <h3 style={{ fontSize: '1.2rem', color: '#065f46', margin: '0.25rem 0' }}>
                  Relatório de Execução do Objeto (REO): Apuração do Cumprimento das Metas Físicas
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#047857', margin: 0 }}>
                  Demonstrativo periódico do alcance dos indicadores sociais, número de acolhidos atendidos, refeições servidas e atendimentos da equipe multidisciplinar.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => alert("Relatório Narrativo de Atividades do Período Exportado!")}>
                  <FileText size={16} /> Relatório Narrativo
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={16} /> Emitir Anexo II Oficial (REO PDF)
                </button>
              </div>
            </div>
          </div>

          {/* PAINEL DE APURAÇÃO DO CUMPRIMENTO DAS METAS FÍSICAS (REO) */}
          <div className="card">
            <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} style={{ color: '#059669' }} />
              1. Demonstrativo do Cumprimento das Metas Físicas Pactuadas no Período (Pactuado vs Executado)
            </h4>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Meta Física Pactuada</th>
                    <th>Meta Programada</th>
                    <th>Realizado no Período</th>
                    <th>% Cumprimento</th>
                    <th>Status do Desempenho Social</th>
                    <th>Comprovação / Dossiê Anexado</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { code: 'M-01', meta: 'Acolhimento Social Residencial Contínuo', prog: '300 Acolhidos/Mês', progNum: 300, meio: 'Prontuários e Termos de Adesão' },
                    { code: 'M-02', meta: 'Atendimento Multiprofissional (Saúde/Psicologia)', prog: '600 Consultas/Mês', progNum: 600, meio: 'Fichas de Evolução Médica/Clínica' },
                    { code: 'M-03', meta: 'Segurança Alimentar RDC 29 (4 Refeições/Dia)', prog: '90.000 Refeições/Mês', progNum: 90000, meio: 'Cardápios Assinados RT & NFes' },
                    { code: 'M-04', meta: 'Manutenção da Equipe Multidisciplinar CLT', prog: '285 Colaboradores Ativos', progNum: 285, meio: 'Folha de Pagamento, GPS e GRF' },
                    { code: 'M-05', meta: 'Oficinas Formativas e Laborterapia', prog: '240 Horas/Acolhido', progNum: 240, meio: 'Folhas de Frequência e Relatório Fotográfico' },
                    { code: 'M-06', meta: 'Altas Terapêuticas & Reinserção Familiar', prog: '100 Altas/Ano', progNum: 100, meio: 'Termos de Alta e Boletim CAFVIDA' }
                  ].map(row => {
                    const valReal = reoRealizados[row.code] || 0;
                    const pct = row.progNum > 0 ? ((valReal / row.progNum) * 100).toFixed(1) : 0;
                    return (
                      <tr key={row.code}>
                        <td><span className="badge badge-primary">{row.code}</span></td>
                        <td style={{ fontWeight: 700 }}>{row.meta}</td>
                        <td>{row.prog}</td>
                        <td>
                          <input 
                            type="number" 
                            className="input-field" 
                            style={{ width: '110px', fontWeight: 800, color: '#2563eb', padding: '4px 8px' }}
                            value={valReal}
                            onChange={(e) => handleReoChange(row.code, e.target.value)}
                            title="Digite a quantidade realizada no mês para prestação de contas"
                          />
                        </td>
                        <td style={{ fontWeight: 800, color: pct >= 100 ? '#059669' : (pct > 0 ? '#d97706' : '#dc2626') }}>
                          {pct}%
                        </td>
                        <td>
                          <span className={`badge ${pct >= 100 ? 'badge-success' : (pct > 0 ? 'badge-warning' : 'badge-danger')}`}>
                            {pct >= 100 ? `🟢 Meta Atingida (${pct}%)` : (pct > 0 ? `🟡 Em Execução (${pct}%)` : `🔴 Pendente (0%)`)}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.775rem', color: '#64748b' }}>{row.meio}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* RELATÓRIO NARRATIVO DE ATIVIDADES E SÍNTESE EXECUTIVA */}
          <div className="card">
            <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} style={{ color: '#2563eb' }} />
              2. Síntese Executiva do Cumprimento do Objeto (Relatório Narrativo SJDH-BA)
            </h4>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.6', margin: 0, textAlign: 'justify' }}>
                Durante o período de execução reportado, a <strong>Fundação Doutor Jesus</strong> manteve em pleno funcionamento a recepção, triagem, acolhimento humano e acompanhamento multidisciplinar continuado dos residentes na sede em Candeias/BA e nas 6 unidades do CAFVIDA. Todas as 4 refeições diárias foram preparadas sob responsabilidade de Nutricionista RT sob os critérios da RDC 29 ANVISA. A equipe técnica de 285 profissionais prestou assistência médica, psicológica, social e fisioterapêutica, garantindo o alcance de 100% das metas físicas programadas.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 2: PASSO 1 - SOLICITAÇÃO DE COMPRA (SC POR RUBRICA) */}
      {activeTab === 'solicitacoes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ borderLeft: '4px solid #2563eb', background: '#eff6ff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-primary">Passo 1 do Fluxo FDJ (Formalização de Compra)</span>
                <h3 style={{ fontSize: '1.15rem', color: '#1e3a8a', margin: '0.25rem 0' }}>
                  Solicitações Formais de Compra por Rubrica Orçamentária (SC)
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#1e40af', margin: 0 }}>
                  Formalização prévia de compras com checagem automática de saldo disponível da rubrica aprovada no Plano de Trabalho.
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowNewSCModal(true)}>
                <PlusCircle size={16} /> + Nova Solicitação Formal (SC)
              </button>
            </div>
          </div>

          {/* PAINEL 1: MATRIZ COMPLETA DAS 12 RUBRICAS OFICIAIS DO PLANO DE TRABALHO */}
          <div className="card" style={{ borderLeft: '4px solid #1e3a8a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1.05rem', color: '#1e3a8a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} style={{ color: '#2563eb' }} />
                1. Matriz de Rubricas Orçamentárias Aprovadas no Plano de Trabalho (Todas as 12 Rubricas Oficiais SJDH-BA)
              </h4>
              <span className="badge badge-info">12 Rubricas Pactuadas no Termo nº 005/2022</span>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código Rubrica</th>
                    <th>Elemento / Nome Oficial Pactuado</th>
                    <th>Grupo da Despesa</th>
                    <th>Valor Orçado (R$)</th>
                    <th>Comprometido em SC (R$)</th>
                    <th>Executado (R$)</th>
                    <th>Saldo Disponível (R$)</th>
                    <th>Status Rubrica</th>
                  </tr>
                </thead>
                <tbody>
                  {rubricasDisponiveis.map(r => (
                    <tr key={r.id}>
                      <td><span className="badge badge-primary">{r.id}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{r.nome}</td>
                      <td><span className="badge badge-secondary">{r.grupo}</span></td>
                      <td style={{ fontWeight: 700, color: '#1e3a8a' }}>R$ {r.orcado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td style={{ fontWeight: 700, color: '#d97706' }}>R$ {r.emSC.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td style={{ fontWeight: 700, color: '#2563eb' }}>R$ {r.executado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td style={{ fontWeight: 800, color: r.saldo > 0 ? '#059669' : '#dc2626' }}>
                        R$ {r.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className={`badge ${r.saldo > 0 ? 'badge-success' : 'badge-danger'}`}>
                          {r.saldo > 0 ? '🟢 Saldo Disponível' : '🔴 Esgotado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#0f172a', color: '#ffffff', fontWeight: 800, fontSize: '0.9rem' }}>
                    <td colSpan={3} style={{ color: '#f8fafc', padding: '12px', borderTop: '2px solid #3b82f6' }}>
                      📊 TOTAL CONSOLIDADO DAS 12 RUBRICAS SJDH-BA (24 MESES):
                    </td>
                    <td style={{ color: '#93c5fd', padding: '12px', fontSize: '0.95rem' }}>
                      R$ {totalOrcadoPlano.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ color: '#fde68a', padding: '12px', fontSize: '0.95rem' }}>
                      R$ {rubricasDisponiveis.reduce((acc, r) => acc + (r.emSC || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ color: '#93c5fd', padding: '12px', fontSize: '0.95rem' }}>
                      R$ {totalExecutadoPlano.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ color: '#34d399', padding: '12px', fontSize: '1rem', fontWeight: 900 }}>
                      R$ {totalSaldoPlano.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ color: '#34d399', padding: '12px' }}>
                      <span className="badge badge-success">🟢 Regular</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* PAINEL 2: LISTA DE SOLICITAÇÕES FORMAIS DE COMPRAS (SC) */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingCart size={18} style={{ color: '#2563eb' }} />
                2. Lista de Solicitações Formais de Compras (SCs) Registradas ({solicitacoesCompra.length})
              </h4>
              <span className="badge badge-info">Passo 1 Obrigatório antes das 3 Cotações</span>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código SC</th>
                    <th>Rubrica do Plano de Trabalho</th>
                    <th>Item / Objeto Solicitado</th>
                    <th>Quantidade</th>
                    <th>Valor Estimado</th>
                    <th>Solicitante</th>
                    <th>Validação de Saldo</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitacoesCompra.map(sc => (
                    <tr key={sc.id}>
                      <td><span className="badge badge-primary">{sc.id}</span></td>
                      <td style={{ fontSize: '0.8rem', fontWeight: 700 }}>{sc.rubrica}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{sc.item}</td>
                      <td style={{ fontSize: '0.8rem' }}>{sc.quantidade}</td>
                      <td style={{ fontWeight: 700, color: '#2563eb' }}>R$ {sc.valorEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td style={{ fontSize: '0.8rem' }}>{sc.solicitante}</td>
                      <td>
                        <span className={`badge ${sc.valorEstimado <= sc.saldoRubrica ? 'badge-success' : 'badge-danger'}`}>
                          {sc.valorEstimado <= sc.saldoRubrica ? '🟢 Dentro do Saldo' : '🔴 Excede Saldo'}
                        </span>
                      </td>
                      <td><span className="badge badge-warning">{sc.status}</span></td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => setSelectedSCForPrint(sc)}>
                          <Printer size={14} /> Espelho PDF
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

      {/* SUBTAB 3: PASSO 2 - COTAÇÕES DE MERCADO & COMPLIANCE QSA */}
      {activeTab === 'cotacoes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ borderLeft: '4px solid #d97706', background: '#fffbeb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-warning">Passo 2 do Fluxo FDJ (Coleta de 3 Preços & QSA)</span>
                <h3 style={{ fontSize: '1.15rem', color: '#92400e', margin: '0.25rem 0' }}>
                  Pesquisa de Mercado (3 Cotações) & Cruzamento QSA Anti-Colusão
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#b45309', margin: 0 }}>
                  Coleta formal de 3 propostas de empresas ativas na Receita Federal e verificação automatizada de sócios (QSA) para impedir fraudes.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: '#d97706' }} />
              Cotações de Mercado & Compliance de Sócios Receita Federal
            </h4>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>SC Vinculada</th>
                    <th>Empresa 1 (Vencedora)</th>
                    <th>Empresa 2 (Concorrente)</th>
                    <th>Empresa 3 (Concorrente)</th>
                    <th>Compliance QSA RFB</th>
                    <th>Status</th>
                    <th>Parecer Técnico</th>
                  </tr>
                </thead>
                <tbody>
                  {cotacoes.map(c => (
                    <tr key={c.id}>
                      <td><span className="badge badge-primary">{c.id}</span></td>
                      <td style={{ fontWeight: 700 }}>{c.scId}</td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#059669' }}>{c.empresa1.nome}</div>
                        <div style={{ fontSize: '0.75rem', color: '#2563eb' }}>R$ {c.empresa1.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem' }}>{c.empresa2.nome}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>R$ {c.empresa2.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem' }}>{c.empresa3.nome}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>R$ {c.empresa3.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      </td>
                      <td>
                        <span className={`badge ${c.colusaoDetectada ? 'badge-danger' : 'badge-success'}`}>
                          {c.colusaoDetectada ? '🚨 Bloqueado por Colusão QSA' : '🟢 Homologado (Independente)'}
                        </span>
                      </td>
                      <td><span className="badge badge-success">{c.status}</span></td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => setSelectedCotacaoForCompliance(c)}>
                          <FileText size={14} /> Parecer QSA PDF
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

      {/* SUBTAB 4: PASSO 5 - AUDITORIA INTERNA, CNDS & DOSSIÊ COMPACTADO */}
      {activeTab === 'anexo5' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="card" style={{ borderLeft: '4px solid #059669', background: '#ecfdf5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-success">Passo 5 do Fluxo FDJ (Revisado com Hash SHA-256 e Saneamento)</span>
                <h3 style={{ fontSize: '1.15rem', color: '#065f46', margin: '0.25rem 0' }}>
                  Auditoria Interna Documental, Validação de CNDs & Dossiê Digital Compactado
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#047857', margin: 0 }}>
                  Saneamento de incorreções formais, validação de certidões (Federal, FGTS, CNDT, SEFAZ-BA e PMC), ordenação cronológica e compactação digital em arquivo único com Hash SHA-256 para o TCE-BA.
                </p>
              </div>

              <button className="btn btn-success" onClick={() => setShowDossieModal(true)}>
                <FileArchive size={16} /> Gerar Dossiê Digital Compactado (.ZIP)
              </button>
            </div>
          </div>

          <div className="card">
            <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: '#059669' }} />
              Checklist de Certidões Negativas Regulares (CND - Lei 13.019)
            </h4>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Documento / Certidão Negativa</th>
                    <th>Órgão Emissor Responsável</th>
                    <th>Data de Validade</th>
                    <th>Prazo Restante</th>
                    <th>Código de Autenticidade</th>
                    <th>Status da Certidão</th>
                  </tr>
                </thead>
                <tbody>
                  {certidoesCND.map(c => (
                    <tr key={c.id}>
                      <td><span className="badge badge-primary">{c.id}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{c.documento}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.orgao}</td>
                      <td style={{ fontWeight: 700, color: '#059669' }}>{c.validade}</td>
                      <td style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2563eb' }}>{c.diasRestantes} dias restantes</td>
                      <td style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{c.codigoAutenticidade}</td>
                      <td><span className="badge badge-success"><CheckCircle2 size={11} /> {c.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 6: ANEXO III - EXECUÇÃO FINANCEIRA (REF) */}
      {activeTab === 'anexo3' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* BARRA DE SELEÇÃO DE PERÍODO DE APURAÇÃO SINCRONIZADA DO ANEXO III */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', background: '#f8fafc', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} style={{ color: 'var(--primary)' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  Período de Apuração do Relatório de Execução Financeira (REF)
                </h4>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                  {periodoREFAtivo.rotulo}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button 
                className={`btn btn-sm ${filtroPeriodoREF === 'semestre1' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFiltroPeriodoREF('semestre1')}
              >
                🗓️ 1º Semestre / 2026 (PDF 10)
              </button>
              <button 
                className={`btn btn-sm ${filtroPeriodoREF === 'mes1' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFiltroPeriodoREF('mes1')}
              >
                📄 1º Mês (Jan/26 Extrato PDF 11)
              </button>
              <button 
                className={`btn btn-sm ${filtroPeriodoREF === 'semestre2' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFiltroPeriodoREF('semestre2')}
              >
                🗓️ 2º Semestre / 2026
              </button>
              <button 
                className={`btn btn-sm ${filtroPeriodoREF === 'anual' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFiltroPeriodoREF('anual')}
              >
                📊 Anual Consolidado
              </button>
            </div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
              <div>
                <span className="badge badge-primary">ANEXO III LEGAL (REF — Lei 13.019/2014 & SJDH-BA)</span>
                <h3 style={{ fontSize: '1.15rem', color: '#1e3a8a', margin: '0.25rem 0' }}>
                  Anexo III: Relatório de Execução Financeira (REF SJDH-BA)
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
                  Demonstrativo consolidado e auditável de repasses recebidos, rendimentos da aplicação financeira CDB e despesas liquidadas por rubrica.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-sm" 
                  onClick={() => setShowGerarAutoModal(true)}
                  style={{ background: '#059669', color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Zap size={16} /> ⚡ Gerar REF & Conciliação Automáticos
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={16} /> Emitir REF Oficial (PDF)
                </button>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 700 }}>
                <span>(+) Saldo Inicial Abertura em C/C + CDB (Extrato Anterior):</span>
                <span style={{ color: '#2563eb', fontWeight: 800 }}>
                  R$ {periodoREFAtivo.saldoInicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 700, marginTop: '0.6rem' }}>
                <span>(+) Repasses Governamentais Recebidos SJDH-BA:</span>
                <span style={{ color: '#059669', fontWeight: 800 }}>
                  R$ {periodoREFAtivo.repasses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem', fontWeight: 700, marginTop: '0.6rem' }}>
                <span>(+) Rendimentos de Aplicação CDB MROSC:</span>
                <span style={{ color: '#8b5cf6', fontWeight: 800 }}>
                  + R$ {periodoREFAtivo.rendimentos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 700, marginTop: '0.6rem' }}>
                <span>(-) Total de Despesas Liquidadas em Convênio:</span>
                <span style={{ color: '#dc2626', fontWeight: 800 }}>
                  R$ {periodoREFAtivo.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.1rem', fontWeight: 800, marginTop: '1rem', paddingTop: '0.75rem', borderTop: '2px solid #cbd5e1' }}>
                <div>
                  <span>(=) Saldo Remanescente Conciliado em Conta Segregada (BB C/C 14.502-1):</span>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>🟢 {periodoREFAtivo.status}</div>
                </div>
                <span style={{ color: '#059669', fontSize: '1.3rem' }}>
                  R$ {periodoREFAtivo.saldoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* DETALHAMENTO DE DESPESAS POR RUBRICA EM ANEXO III */}
          <div className="card">
            <h4 style={{ fontSize: '1rem', color: '#1e3a8a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign size={18} style={{ color: '#2563eb' }} />
              Demonstrativo Analítico de Despesas Liquidadas por Rubrica Aprovada
            </h4>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código Rubrica</th>
                    <th>Rubrica / Elemento Pactuado</th>
                    <th>Valor Orçado (24 Meses)</th>
                    <th>Comprometido em SC (R$)</th>
                    <th>Despesa Liquidada (R$)</th>
                    <th>Saldo Remanescente (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {rubricasDisponiveis.map(r => (
                    <tr key={r.id}>
                      <td><span className="badge badge-primary">{r.id}</span></td>
                      <td style={{ fontWeight: 700 }}>{r.nome}</td>
                      <td>R$ {r.orcado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td>R$ {r.emSC.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td style={{ fontWeight: 800, color: r.executado > 0 ? '#dc2626' : '#64748b' }}>
                        R$ {r.executado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ fontWeight: 800, color: r.saldo > 0 ? '#059669' : '#dc2626' }}>
                        R$ {r.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#0f172a', color: '#ffffff', fontWeight: 800, fontSize: '0.9rem' }}>
                    <td colSpan={2} style={{ color: '#f8fafc', padding: '12px', borderTop: '2px solid #3b82f6' }}>
                      📊 TOTAL CONSOLIDADO DAS 12 RUBRICAS SJDH-BA (24 MESES):
                    </td>
                    <td style={{ color: '#93c5fd', padding: '12px', fontSize: '0.95rem' }}>
                      R$ {totalOrcadoPlano.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ color: '#fde68a', padding: '12px', fontSize: '0.95rem' }}>
                      R$ {rubricasDisponiveis.reduce((acc, r) => acc + (r.emSC || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ color: '#f87171', padding: '12px', fontSize: '0.95rem' }}>
                      R$ {totalExecutadoPlano.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ color: '#34d399', padding: '12px', fontSize: '1rem', fontWeight: 900 }}>
                      R$ {totalSaldoPlano.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                ℹ️ *O valor orçado de R$ 19.501.793,44 refere-se ao <strong>Orçamento Global Aprovado para a Vigência Plurianual de 24 Meses</strong> (Seção I — Folhas 43 a 67 do Termo nº 005/2022 SJDH-BA).*
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 7: ANEXO IV - CONCILIAÇÃO BANCÁRIA & RENDIMENTOS */}
      {activeTab === 'anexo4' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#1e3a8a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} style={{ color: '#2563eb' }} />
              Anexo IV: Conciliação Bancária & Extrato de Rendimentos CDB
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Demonstrativo de conciliação mensal dos extratos bancários da Conta Segregada (Banco do Brasil / Caixa) e aplicações automáticas no CDB MROSC (Art. 51 Lei 13.019/2014).
            </p>
            <div style={{ marginTop: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700 }}>
                <span>Conta Bancária Segregada:</span>
                <span>Banco do Brasil - Ag. 3418-5 / C/C 14.502-1</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, marginTop: '0.4rem' }}>
                <span>Status da Conciliação OFX:</span>
                <span className="badge badge-success">🟢 100% Conciliado sem Divergências</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, marginTop: '0.4rem' }}>
                <span>Total de Rendimentos CDB no Período Selecionado ({periodoREFAtivo.rotulo}):</span>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: '1.1rem' }}>
                  + R$ {periodoREFAtivo.rendimentos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="table-container" style={{ marginTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#1e3a8a', marginBottom: '0.75rem' }}>
                📅 Apuração Mensal de Rendimentos Financeiros Incorporados (CDB BB MROSC)
              </h4>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mês de Referência</th>
                    <th>Conta Segregada BB</th>
                    <th>Tipo de Aplicação</th>
                    <th>Rendimento Bruto (R$)</th>
                    <th>Status de Incorporação ao Convênio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Janeiro / 2026</strong></td>
                    <td>Ag: 3418-5 / CC: 14.502-1</td>
                    <td>CDB BB MROSC 100% CDI</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>+ R$ 4.850,20</td>
                    <td><span className="badge badge-success">Incorporado (Art. 51 Lei 13.019)</span></td>
                  </tr>
                  <tr>
                    <td><strong>Fevereiro / 2026</strong></td>
                    <td>Ag: 3418-5 / CC: 14.502-1</td>
                    <td>CDB BB MROSC 100% CDI</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>+ R$ 3.120,00</td>
                    <td><span className="badge badge-success">Incorporado (Art. 51 Lei 13.019)</span></td>
                  </tr>
                  <tr>
                    <td><strong>Março / 2026</strong></td>
                    <td>Ag: 3418-5 / CC: 14.502-1</td>
                    <td>CDB BB MROSC 100% CDI</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>+ R$ 2.940,00</td>
                    <td><span className="badge badge-success">Incorporado (Art. 51 Lei 13.019)</span></td>
                  </tr>
                  <tr>
                    <td><strong>Abril / 2026</strong></td>
                    <td>Ag: 3418-5 / CC: 14.502-1</td>
                    <td>CDB BB MROSC 100% CDI</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>+ R$ 2.680,00</td>
                    <td><span className="badge badge-success">Incorporado (Art. 51 Lei 13.019)</span></td>
                  </tr>
                  <tr>
                    <td><strong>Maio / 2026</strong></td>
                    <td>Ag: 3418-5 / CC: 14.502-1</td>
                    <td>CDB BB MROSC 100% CDI</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>+ R$ 2.510,00</td>
                    <td><span className="badge badge-success">Incorporado (Art. 51 Lei 13.019)</span></td>
                  </tr>
                  <tr>
                    <td><strong>Junho / 2026</strong></td>
                    <td>Ag: 3418-5 / CC: 14.502-1</td>
                    <td>CDB BB MROSC 100% CDI</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>+ R$ 2.350,00</td>
                    <td><span className="badge badge-success">Incorporado (Art. 51 Lei 13.019)</span></td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr style={{ background: '#0f172a', color: '#ffffff', fontWeight: 800 }}>
                    <td colSpan={3} style={{ color: '#f8fafc', padding: '10px' }}>
                      TOTAL CONSOLIDADO DE RENDIMENTOS CDB (1º SEMESTRE 2026):
                    </td>
                    <td style={{ color: '#34d399', padding: '10px', fontSize: '1rem' }}>
                      + R$ 18.450,20
                    </td>
                    <td style={{ color: '#93c5fd', padding: '10px' }}>
                      100% Reaplicado no Objeto Social
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 8: ANEXO VI - PARECER FINAL E HOMOLOGAÇÃO TCE-BA / SJDH */}
      {activeTab === 'anexo6' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ borderLeft: '4px solid #059669', background: '#ecfdf5' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#065f46', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} style={{ color: '#059669' }} />
              Anexo VI: Parecer Técnico de Aprovabilidade SJDH-BA & Homologação TCE-BA
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#047857' }}>
              Documento final de prestação de contas com atestado de conformidade da execução do objeto e regularidade financeira.
            </p>
            <div style={{ marginTop: '1rem', background: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #6ee7b7' }}>
              <div style={{ fontWeight: 800, color: '#065f46', marginBottom: '0.5rem' }}>PARECER TÉCNICO CONCLUSIVO Nº 005/2026:</div>
              <p style={{ fontSize: '0.85rem', color: '#064e3b', margin: 0, textAlign: 'justify' }}>
                A Comissão de Monitoramento e Avaliação da SJDH-BA atesta a regularidade integral da execução do Termo de Fomento nº 005/2022 (2º Termo Aditivo), com cumprimento integral de 100% das metas físicas do objeto social e plena conformidade dos comprovantes fiscais e bancários segregados.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOVA RUBRICA / AJUSTE ORÇAMENTÁRIO DO PLANO DE TRABALHO */}
      {showPlanoModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#1e3a8a' }}>Cadastrar Nova Rubrica no Plano de Trabalho</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowPlanoModal(false)}><X size={16} /></button>
            </div>

            <form onSubmit={handleAddRubrica} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Código Rubrica</label>
                  <input className="form-control" value={newRubrica.id} onChange={e => setNewRubrica({ ...newRubrica, id: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Grupo de Despesa</label>
                  <select className="form-control" value={newRubrica.grupo} onChange={e => setNewRubrica({ ...newRubrica, grupo: e.target.value })}>
                    <option value="Grupo 1: Pessoal & Encargos Sociais">Grupo 1: Pessoal & Encargos Sociais</option>
                    <option value="Grupo 2: Alimentação & Nutrição">Grupo 2: Alimentação & Nutrição</option>
                    <option value="Grupo 3: Saúde & Medicamentos">Grupo 3: Saúde & Medicamentos</option>
                    <option value="Grupo 4: Logística & Frota">Grupo 4: Logística & Frota</option>
                    <option value="Grupo 5: Concessionárias & Fixos">Grupo 5: Concessionárias & Fixos</option>
                    <option value="Grupo 6: Manutenção Predial">Grupo 6: Manutenção Predial</option>
                    <option value="Grupo 7: Despesas Gerais">Grupo 7: Despesas Gerais</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Nome da Rubrica</label>
                <input className="form-control" placeholder="ex: Material Didático e Oficinas..." value={newRubrica.nome} onChange={e => setNewRubrica({ ...newRubrica, nome: e.target.value })} required />
              </div>

              <div>
                <label className="form-label">Detalhamento dos Itens Pactuados</label>
                <textarea className="form-control" rows="2" placeholder="Descreva os bens ou serviços autorizados..." value={newRubrica.det} onChange={e => setNewRubrica({ ...newRubrica, det: e.target.value })} />
              </div>

              <div>
                <label className="form-label">Valor Aprovado (Orçado R$)</label>
                <input className="form-control" type="number" step="0.01" placeholder="150000.00" value={newRubrica.orcado} onChange={e => setNewRubrica({ ...newRubrica, orcado: e.target.value })} required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPlanoModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Inserir no Plano de Trabalho</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IMPRESSÃO DO ANEXO I PLANO DE TRABALHO OFICIAL PDF */}
      {showPlanoPrintModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-primary">ANEXO I: PLANO DE TRABALHO OFICIAL PACTUADO (PDF SJDH-BA)</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowPlanoPrintModal(false)}><X size={16} /></button>
            </div>
            <div style={{ border: '2px solid #2563eb', padding: '1.5rem', borderRadius: '8px', background: '#fff' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #cbd5e1', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#1e3a8a' }}>GOVERNO DO ESTADO DA BAHIA — SJDH-BA</h3>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#2563eb' }}>
                  ANEXO I — PLANO DE TRABALHO APROVADO (LEI 13.019/2014)
                </div>
                <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                  Parceria: {currentTermo.termo} • {currentTermo.objeto}
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                <div><strong>Entidade Proponente:</strong> Fundação Doutor Jesus (CNPJ: 04.992.810/0001-99)</div>
                <div><strong>Órgão Concedente:</strong> {currentTermo.orgaoConcedente}</div>
                <div><strong>Valor Global Pactuado:</strong> R$ {currentTermo.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div><strong>Conta Segregada Oficial:</strong> {currentTermo.contaBancaria}</div>
              </div>

              <div style={{ border: '1px solid #cbd5e1', padding: '0.75rem', borderRadius: '6px', background: '#f8fafc', marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#1e293b' }}>Resumo do Orçamento Aprovado por Rubrica</h4>
                {rubricasDisponiveis.map(r => (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
                    <span>{r.nome}:</span>
                    <strong>R$ {r.orcado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1rem', borderTop: '1px solid #cbd5e1', textAlign: 'center', fontSize: '0.75rem' }}>
                <div>________________________<br/>Fundação Doutor Jesus</div>
                <div>________________________<br/>Secretaria de Justiça e Direitos Humanos (SJDH-BA)</div>
              </div>
            </div>
            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={() => window.print()}><Printer size={16} /> Imprimir Anexo I PDF</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOVA SOLICITAÇÃO DE COMPRA (SC - PASSO 1) */}
      {showNewSCModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#1e3a8a' }}>Formalizar Nova Solicitação de Compra (SC - Passo 1)</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowNewSCModal(false)}><X size={16} /></button>
            </div>

            <form onSubmit={handleCreateSC} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Termo MROSC Parceria</label>
                <select className="form-control" value={newSC.termo} onChange={e => setNewSC({ ...newSC, termo: e.target.value })}>
                  <option value="Termo de Fomento nº 005/SJDH/2022">Termo de Fomento nº 005/SJDH/2022</option>
                  <option value="Termo de Colaboração nº 008/2025 (PMC)">Termo de Colaboração nº 008/2025 (PMC)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Rubrica do Plano de Trabalho Aprovado</label>
                <select className="form-control" value={newSC.rubrica} onChange={e => setNewSC({ ...newSC, rubrica: e.target.value })}>
                  {rubricasDisponiveis.map(r => (
                    <option key={r.id} value={r.nome}>{r.nome} (Saldo: R$ {r.saldo.toLocaleString('pt-BR')})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Item / Objeto Solicitado (Especificação Detalhada)</label>
                <input className="form-control" placeholder="ex: Gêneros alimentícios para Cozinha Industrial..." value={newSC.item} onChange={e => setNewSC({ ...newSC, item: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Quantidade / Unidade</label>
                  <input className="form-control" placeholder="ex: 5.000 kg" value={newSC.quantidade} onChange={e => setNewSC({ ...newSC, quantidade: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Valor Estimado Teto (R$)</label>
                  <input className="form-control" type="number" step="0.01" placeholder="28500.00" value={newSC.valorEstimado} onChange={e => setNewSC({ ...newSC, valorEstimado: e.target.value })} required />
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>Validação do Saldo da Rubrica:</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: (parseFloat(newSC.valorEstimado) || 0) <= activeRubricaInfo.saldo ? '#059669' : '#dc2626' }}>
                  {(parseFloat(newSC.valorEstimado) || 0) <= activeRubricaInfo.saldo ? '🟢 DENTRO DO SALDO DISPONÍVEL' : '🔴 EXCEDE O SALDO DISPONÍVEL'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Saldo disponível na rubrica selecionada: R$ {activeRubricaInfo.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div>
                <label className="form-label">Setor Solicitante</label>
                <input className="form-control" value={newSC.solicitante} onChange={e => setNewSC({ ...newSC, solicitante: e.target.value })} />
              </div>

              <div>
                <label className="form-label">Justificativa da Necessidade (Vínculo com os Acolhidos)</label>
                <textarea className="form-control" rows="2" value={newSC.justificativa} onChange={e => setNewSC({ ...newSC, justificativa: e.target.value })} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewSCModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={(parseFloat(newSC.valorEstimado) || 0) > activeRubricaInfo.saldo}>
                  Salvar & Liberar para 3 Cotações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ESPELHO SC PDF */}
      {selectedSCForPrint && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-primary">ESPELHO DA SOLICITAÇÃO DE COMPRA (SC PDF)</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedSCForPrint(null)}><X size={16} /></button>
            </div>
            <div className="printable-document" style={{ border: '2px solid #2563eb', padding: '1.5rem', borderRadius: '8px', background: '#fff' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #cbd5e1', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#1e3a8a' }}>FUNDAÇÃO DOUTOR JESUS — COMPRAS MROSC</h3>
                <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>SOLICITAÇÃO FORMAL DE COMPRA: {selectedSCForPrint.id}</div>
              </div>
              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div><strong>Termo:</strong> {selectedSCForPrint.termo}</div>
                <div><strong>Rubrica:</strong> {selectedSCForPrint.rubrica}</div>
                <div><strong>Item:</strong> {selectedSCForPrint.item}</div>
                <div><strong>Quantidade:</strong> {selectedSCForPrint.quantidade}</div>
                <div><strong>Valor Estimado:</strong> R$ {selectedSCForPrint.valorEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div><strong>Solicitante:</strong> {selectedSCForPrint.solicitante}</div>
                <div><strong>Justificativa:</strong> {selectedSCForPrint.justificativa}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #cbd5e1', textAlign: 'center', fontSize: '0.75rem' }}>
                <div>________________________<br/>Solicitante</div>
                <div>________________________<br/>Gestor MROSC</div>
                <div>________________________<br/>Presidência FDJ</div>
              </div>
            </div>
            <div className="no-print" style={{ textAlign: 'right', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={() => window.print()}><Printer size={16} /> Imprimir SC PDF</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PARECER QSA PDF */}
      {selectedCotacaoForCompliance && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-success">PARECER TÉCNICO DE COMPLIANCE QSA ANTI-COLUSÃO (PDF)</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedCotacaoForCompliance(null)}><X size={16} /></button>
            </div>
            <div className="printable-document" style={{ border: '2px solid #059669', padding: '1.5rem', borderRadius: '8px', background: '#fff' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #cbd5e1', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#065f46' }}>FUNDAÇÃO DOUTOR JESUS — CONTROLADORIA & COMPLIANCE</h3>
                <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>PARECER QSA AUDITORIA RECEITA FEDERAL: {selectedCotacaoForCompliance.id}</div>
              </div>
              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div><strong>SC Vinculada:</strong> {selectedCotacaoForCompliance.scId}</div>
                <div><strong>Empresa 1 (Homologada Vencedora):</strong> {selectedCotacaoForCompliance.empresa1.nome} (CNPJ: {selectedCotacaoForCompliance.empresa1.cnpj}) — R$ {selectedCotacaoForCompliance.empresa1.valor.toLocaleString('pt-BR')}</div>
                <div><strong>Empresa 2:</strong> {selectedCotacaoForCompliance.empresa2.nome} — R$ {selectedCotacaoForCompliance.empresa2.valor.toLocaleString('pt-BR')}</div>
                <div><strong>Empresa 3:</strong> {selectedCotacaoForCompliance.empresa3.nome} — R$ {selectedCotacaoForCompliance.empresa3.valor.toLocaleString('pt-BR')}</div>
                <div style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: '6px', border: '1px solid #6ee7b7', color: '#065f46' }}>
                  <strong>Atestado de Compliance QSA:</strong> {selectedCotacaoForCompliance.motivoCompliance}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #cbd5e1', textAlign: 'center', fontSize: '0.75rem' }}>
                <div>________________________<br/>Comissão de Licitação FDJ</div>
                <div>________________________<br/>Auditor Interno de Compliance</div>
              </div>
            </div>
            <div className="no-print" style={{ textAlign: 'right', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={() => window.print()}><Printer size={16} /> Imprimir Parecer QSA PDF</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DOSSIÊ COMPACTADO ZIP */}
      {showDossieModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '780px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-success">DOSSIÊ DIGITAL COMPACTADO PARA PRESTAÇÃO DE CONTAS (PASSO 5)</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowDossieModal(false)}><X size={16} /></button>
            </div>
            <div style={{ border: '2px solid #059669', padding: '1.5rem', borderRadius: '8px', background: '#ffffff' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #cbd5e1', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#065f46' }}>FUNDAÇÃO DOUTOR JESUS — AUDITORIA INTERNA & COMPLIANCE</h3>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#059669' }}>
                  TERMO DE CUSTÓDIA E COMPACTAÇÃO DO DOSSIÊ DIGITAL MROSC
                </div>
              </div>
              <div style={{ border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '6px', background: '#f8fafc', marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#1e293b' }}>
                  Conteúdo do Pacote Compactado (`Dossie_MROSC_SJDH-BA_2026.zip`)
                </h4>
                <div style={{ fontSize: '0.775rem', color: '#334155', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem', fontFamily: 'monospace' }}>
                  <div>✓ 01_Plano_Trabalho_SJDH-BA.pdf</div>
                  <div>✓ 02_Pedidos_Compras_SC.pdf</div>
                  <div>✓ 03_Cotacoes_QSA_RFB.pdf</div>
                  <div>✓ 04_NFes_Carimbo_MROSC.pdf</div>
                  <div>✓ 05_Comprovantes_TED_PIX.pdf</div>
                  <div>✓ 06_Extrato_Conciliado_OFX.pdf</div>
                  <div>✓ 07_Certidoes_CND_Validas.pdf</div>
                  <div>✓ 08_Relatorio_REF_Anexo3.pdf</div>
                </div>
              </div>
              <div style={{ background: '#f1f5f9', padding: '0.65rem', borderRadius: '6px', fontSize: '0.725rem', fontFamily: 'monospace', color: '#334155' }}>
                <strong>HASH SHA-256 DE INTEGRIDADE:</strong> `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
              </div>
              <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                <button className="btn btn-success" onClick={() => alert('Download do Dossiê Compactado em formato .ZIP iniciado!')}>
                  <Download size={18} /> Baixar Pacote Compactado (.ZIP com 8 PDF Auditados)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
