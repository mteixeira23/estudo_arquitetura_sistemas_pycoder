// ==========================================================================
// SGI - FUNDAÇÃO DOUTOR JESUS | MOCK DATASETS & REALISTIC REPOSITORY
// Specific Context: Candeias & Salvador, Bahia - Therapeutic Community
// ==========================================================================

export const INITIAL_METRICS = {
  totalAcolhidos: 940,
  leitosTotais: 1100,
  leitosOcupados: 940,
  capacidadeOcupacao: 85.4,
  acolhidosTriagemMes: 64,
  altasTerapêuticasMes: 42,
  termosMROSCAtivos: 3,
  valorTotalMROSC: 4800000.00,
  refeicoesServidasDia: 3760, // 4 refeições/dia * 940 acolhidos
};

export const INITIAL_ACOLHIDOS = [];

export const SAMPLE_ACOLHIDOS = [
  {
    id: "FDJ-2026-0891",
    nome: "Antonio Carlos da Silva Filho",
    cpf: "721.482.905-34",
    rg: "14.829.401-02 SSP/BA",
    dataNascimento: "1988-04-12",
    idade: 38,
    municipioOrigem: "Salvador (Subúrbio Ferroviário)",
    bairro: "Periperi",
    dataEntrada: "2026-02-10",
    status: "Ativo",
    substanciaPrincipal: "Crack / Álcool",
    tempoUso: "12 anos",
    alojamento: "Bloco A - Restauração",
    leito: "Leito A-104",
    termoMROSC: "Termo de Fomento 014/2025 (SADS-BA)",
    contatoFamilia: "Maria das Graças (Mãe) - (71) 98842-1044",
    laborterapiaSector: "Padaria Comunidade",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "FDJ-2026-0892",
    nome: "Marcos Vinicius Santos Santana",
    cpf: "842.109.385-61",
    rg: "16.902.114-55 SSP/BA",
    dataNascimento: "1995-09-23",
    idade: 30,
    municipioOrigem: "Candeias",
    bairro: "Malembá",
    dataEntrada: "2026-01-15",
    status: "Ativo",
    substanciaPrincipal: "Múltiplas (Álcool, Cocaína)",
    tempoUso: "8 anos",
    alojamento: "Bloco A - Restauração",
    leito: "Leito A-105",
    termoMROSC: "Termo de Colaboração 008/2025 (Pref. Candeias)",
    contatoFamilia: "Roberto Santana (Irmão) - (71) 99120-4491",
    laborterapiaSector: "Horta & Agricultura",
    foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "FDJ-2026-0893",
    nome: "Edvaldo Oliveira Souza",
    cpf: "419.002.815-10",
    rg: "09.412.001-33 SSP/BA",
    dataNascimento: "1982-11-04",
    idade: 43,
    municipioOrigem: "Simões Filho",
    bairro: "Centro",
    dataEntrada: "2026-03-01",
    status: "Ativo",
    substanciaPrincipal: "Álcool",
    tempoUso: "20 anos",
    alojamento: "Bloco B - Renovação",
    leito: "Leito B-201",
    termoMROSC: "Acordo Federal 002/2025 (SENAD/MJ)",
    contatoFamilia: "Luciana Souza (Esposa) - (71) 98711-2090",
    laborterapiaSector: "Cozinha Industrial",
    foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "FDJ-2026-0894",
    nome: "Gerson Ferreira Ramos",
    cpf: "512.980.125-99",
    rg: "12.304.991-88 SSP/BA",
    dataNascimento: "1991-06-18",
    idade: 35,
    municipioOrigem: "Feira de Santana",
    bairro: "Tomba",
    dataEntrada: "2025-11-10",
    status: "Alta Terapêutica",
    substanciaPrincipal: "Crack",
    tempoUso: "10 anos",
    alojamento: "Desalocado (Alta Concluída)",
    leito: "N/A",
    termoMROSC: "Termo de Fomento 014/2025 (SADS-BA)",
    contatoFamilia: "Vania Ramos (Irmã) - (75) 99812-3311",
    laborterapiaSector: "Concluído",
    foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "FDJ-2026-0895",
    nome: "Luan Barbosa dos Santos",
    cpf: "901.223.415-08",
    rg: "18.441.902-11 SSP/BA",
    dataNascimento: "2001-01-30",
    idade: 25,
    municipioOrigem: "Salvador (Miolos)",
    bairro: "Cajazeiras VIII",
    dataEntrada: "2026-08-10",
    status: "Em Triagem",
    substanciaPrincipal: "Cannabis / Cocaína",
    tempoUso: "5 anos",
    alojamento: "Bloco C - Esperança (Aguardando leito)",
    leito: "Leito C-302",
    termoMROSC: "Termo de Fomento 014/2025 (SADS-BA)",
    contatoFamilia: "Claudia Barbosa (Mãe) - (71) 98112-9901",
    laborterapiaSector: "Aguardando PTI",
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
  },
  {
    id: "FDJ-2026-0933",
    nome: "Teste",
    cpf: "045.511.555-55",
    rg: "20.104.555-99 SSP/BA",
    dataNascimento: "1994-07-15",
    idade: 31,
    municipioOrigem: "Simões Filho",
    bairro: "Centro",
    dataEntrada: "2026-08-14",
    status: "Ativo",
    substanciaPrincipal: "Cannabis / Outros",
    tempoUso: "10 anos",
    alojamento: "Bloco A - Restauração",
    leito: "Leito A-110",
    termoMROSC: "Termo de Fomento 014/2025 (SADS-BA)",
    contatoFamilia: "Maria das Dores (Mãe) - (71) 98877-0011",
    laborterapiaSector: "Padaria Comunidade",
    foto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80",
    restricaoAlimentar: "Intolerante a Lactose"
  }
];

export const INITIAL_BLOCOS = [
  {
    id: "BL-A",
    nome: "Bloco A - Restauração",
    capacidade: 250,
    ocupados: 235,
    dormitorios: 25,
    coordenador: "Monitor Jorge Lima",
    cor: "#14b8a6"
  },
  {
    id: "BL-B",
    nome: "Bloco B - Renovação",
    capacidade: 250,
    ocupados: 240,
    dormitorios: 25,
    coordenador: "Monitor Pastor Cláudio",
    cor: "#06b6d4"
  },
  {
    id: "BL-C",
    nome: "Bloco C - Esperança",
    capacidade: 300,
    ocupados: 255,
    dormitorios: 30,
    coordenador: "Monitor Valdir Bahia",
    cor: "#f59e0b"
  },
  {
    id: "BL-D",
    nome: "Bloco D - Graça",
    capacidade: 300,
    ocupados: 210,
    dormitorios: 30,
    coordenador: "Monitor Irmão Reinaldo",
    cor: "#10b981"
  }
];

export const INITIAL_PARCERIAS_MROSC = [
  {
    id: "MROSC-005-2022-ORIGINAL",
    termo: "Termo de Fomento nº 005/SJDH/2022 - Plano Original (1ª a 6ª Parcela)",
    orgaoConcedente: "SJDH-BA / Governo do Estado da Bahia",
    objeto: "Acolhimento, tratamento multidisciplinar e reinserção social de até 1.250 dependentes químicos (24 Meses)",
    valorTotal: 56044295.81,
    saldoAtual: 6282479.47,
    metaAcolhidosMes: 1250,
    executadoMes: 1250,
    percentualCumprimento: 100,
    vigenciaInicio: "2022-06-18",
    vigenciaFim: "2024-06-30",
    contaBancaria: "Banco do Brasil - Ag. 3418-5 / C/C 14.502-1",
    status: "Prestação de Contas Concluída (100% Conciliado)"
  },
  {
    id: "MROSC-005-2022-2TA",
    termo: "Termo de Fomento nº 005/SJDH/2022 - 2º Termo Aditivo (7ª a 12ª Parcela)",
    orgaoConcedente: "SJDH-BA / Governo do Estado da Bahia",
    objeto: "Prorrogação por 36 meses e ampliação do atendimento multiprofissional (Até Julho/2027)",
    valorTotal: 105807135.83,
    valorGlobalConsolidado: 161851431.63,
    saldoAtual: 10881542.76,
    metaAcolhidosMes: 1250,
    executadoMes: 1250,
    percentualCumprimento: 100,
    vigenciaInicio: "2024-07-06",
    vigenciaFim: "2027-07-06",
    contaBancaria: "Banco do Brasil - Ag. 3418-5 / C/C 14.502-1",
    status: "Em Execução Regular (100% Conciliado)"
  }
];

export const INITIAL_TRANSACOES_FINANCEIRAS = [
  {
    id: "FIN-901",
    data: "2026-08-12",
    descricao: "Aquisição de Insumos para Padaria e Refeitório (Farinha, Trigo, Óleo)",
    fornecedor: "Moinho Salvador Alimentos Ltda",
    cnpj: "04.182.901/0001-44",
    categoria: "Alimentação / Gêneros Agrícolas",
    valor: 24800.00,
    tipo: "Despesa",
    termoMROSCId: "MROSC-014-2025",
    comprovanteFiscal: "NF-e nº 49.104",
    processoCotacao: "Cotação de Preços nº 018/2026 (3 fornecedores)",
    status: "Pago"
  },
  {
    id: "FIN-902",
    data: "2026-08-10",
    descricao: "Repasse 8ª Parcela - Termo de Fomento SADS/BA",
    fornecedor: "Secretaria de Assistência Social - BA",
    cnpj: "13.937.073/0001-56",
    categoria: "Repasse de Parceria MROSC",
    valor: 150000.00,
    tipo: "Receita",
    termoMROSCId: "MROSC-014-2025",
    comprovanteFiscal: "Ordem de Bancária Estado BA nº 2026OB08122",
    processoCotacao: "N/A",
    status: "Recebido"
  },
  {
    id: "FIN-903",
    data: "2026-08-05",
    descricao: "Folha de Pagamento - Equipe Multidisciplinar (Rateio Psicólogos/Assistentes Social)",
    fornecedor: "Folha de Pagamento SGI-FDJ",
    cnpj: "14.502.991/0001-00",
    categoria: "Recursos Humanos / Equipe Técnica",
    valor: 38500.00,
    tipo: "Despesa",
    termoMROSCId: "MROSC-008-2025",
    comprovanteFiscal: "Guia GFIP / Relatório de Rateio RH",
    processoCotacao: "Quadro de Pessoal Plano de Trabalho",
    status: "Pago"
  }
];

export const INITIAL_PRESENCA_DIARIA = [
  { id: "P1", horario: "Alvorada / Café (07:00)", presencas: 938, ausencias: 2, observacao: "2 acolhidos na enfermagem para medicação" },
  { id: "P2", horario: "Laborterapia / Oficinas (09:00)", presencas: 940, ausencias: 0, observacao: "Todas as equipes alocadas" },
  { id: "P3", horario: "Almoço Comunidade (12:00)", presencas: 940, ausencias: 0, observacao: "Refeição servida no refeitório central" },
  { id: "P4", horario: "Culto / Espiritualidade (18:00)", presencas: 935, ausencias: 5, observacao: "5 no posto médico" },
  { id: "P5", horario: "Pernoite / Fechamento Alojamentos (21:30)", presencas: 940, ausencias: 0, observacao: "Chamada nos 4 blocos finalizada" }
];

export const INITIAL_PROFISSIONAIS = [
  {
    id: "PROF-001",
    nome: "Dra. Fernanda Matos",
    cargo: "Psicóloga Clínico-Comunitária",
    registroProfissional: "CRP 03/14820",
    especialidade: "Psicologia",
    telefone: "(71) 99210-4499",
    email: "fernanda.matos@fundacaodrjesus.org.br",
    status: "Ativo"
  },
  {
    id: "PROF-002",
    nome: "AS Valéria Costa",
    cargo: "Assistente Social Coordenadora",
    registroProfissional: "CRESS-BA 4912",
    especialidade: "Serviço Social",
    telefone: "(71) 98842-1044",
    email: "valeria.costa@fundacaodrjesus.org.br",
    status: "Ativo"
  },
  {
    id: "PROF-003",
    nome: "Dr. Roberto Medeiros",
    cargo: "Médico Psiquiatra",
    registroProfissional: "CRM-BA 14820",
    especialidade: "Psiquiatria",
    telefone: "(71) 99104-5522",
    email: "roberto.medeiros@fundacaodrjesus.org.br",
    status: "Ativo"
  },
  {
    id: "PROF-004",
    nome: "Dra. Patricia Sampaio",
    cargo: "Médica Clínica Geral",
    registroProfissional: "CRM-BA 22910",
    especialidade: "Clínica Geral",
    telefone: "(71) 98711-2090",
    email: "patricia.sampaio@fundacaodrjesus.org.br",
    status: "Ativo"
  },
  {
    id: "PROF-005",
    nome: "Enf. Juliana Ramos",
    cargo: "Enfermeira Chefe de Posto",
    registroProfissional: "COREN-BA 20491",
    especialidade: "Enfermagem",
    telefone: "(71) 99812-3311",
    email: "juliana.ramos@fundacaodrjesus.org.br",
    status: "Ativo"
  },
  {
    id: "PROF-006",
    nome: "Dr. Lucas Silveira",
    cargo: "Cirurgião-Dentista Estético",
    registroProfissional: "CRO-BA 8492",
    especialidade: "Odontologia",
    telefone: "(71) 99120-4491",
    email: "lucas.silveira@fundacaodrjesus.org.br",
    status: "Ativo"
  },
  {
    id: "PROF-007",
    nome: "Dra. Camila Ramos",
    cargo: "Cirurgiã-Dentista Protesista",
    registroProfissional: "CRO-BA 10240",
    especialidade: "Odontologia",
    telefone: "(71) 98112-9901",
    email: "camila.ramos@fundacaodrjesus.org.br",
    status: "Ativo"
  }
];

export const INITIAL_REDE_SUS = [
  { id: "SUS-01", nome: "CAPS AD III Pelourinho / Salvador", municipio: "Salvador", tipo: "CAPS AD III", contato: "(71) 3321-4900" },
  { id: "SUS-02", nome: "UPA 24h Candeias (Centro)", municipio: "Candeias", tipo: "UPA 24h", contato: "(75) 3601-2200" },
  { id: "SUS-03", nome: "Policlínica Regional Metropolitana", municipio: "Simões Filho", tipo: "Policlínica", contato: "(71) 3392-1100" }
];

export const INITIAL_FORNECEDORES = [
  { id: 'FORN-001', razaoSocial: 'Atacadão S.A.', cnpj: '75.315.333/0001-09', categoria: '2.2.01 Alimentação & Cozinha', dadosBancarios: 'Banco do Brasil - Ag. 3418 / C/C 12.345-0', contato: '(71) 3301-4400', status: 'Homologado MROSC' },
  { id: 'FORN-002', razaoSocial: 'EMBASA - Empresa Baiana de Águas e Saneamento S/A', cnpj: '13.504.675/0001-10', categoria: '2.5.01 Água & Esgoto', dadosBancarios: 'Contrato nº 098401', contato: '0800 055 5195', status: 'Concessionária Pública' },
  { id: 'FORN-003', razaoSocial: 'COELBA - Companhia de Eletricidade do Estado da Bahia', cnpj: '15.135.960/0001-10', categoria: '2.5.01 Energia Elétrica', dadosBancarios: 'UC-88104 Sede 40.000m²', contato: '0800 276 0116', status: 'Concessionária Pública' },
  { id: 'FORN-004', razaoSocial: 'Nacional Gás Butano Distribuidora Ltda', cnpj: '08.561.701/0001-44', categoria: '2.5.01 Gás de Cozinha', dadosBancarios: 'Contrato GLP #88401', contato: '(71) 3622-9000', status: 'Homologado MROSC' },
  { id: 'FORN-005', razaoSocial: 'Distribuidora Ceasa Salvador Ltda', cnpj: '12.480.112/0001-88', categoria: '2.2.01 Alimentação & Cozinha', dadosBancarios: 'Banco do Brasil - Ag. 3418 / C/C 99.401-2', contato: '(71) 3392-1020', status: 'Homologado MROSC' },
  { id: 'FORN-006', razaoSocial: 'Distribuidora Higiene & Limpeza Baiana Ltda', cnpj: '04.102.991/0001-88', categoria: '2.3.05 Higiene & Limpeza RDC 29', dadosBancarios: 'Bradesco - Ag. 0891 / C/C 40.102-9', contato: '(71) 3240-8811', status: 'Homologado MROSC' },
  { id: 'FORN-007', razaoSocial: 'Telecom RMS Serviços de Internet Ltda', cnpj: '18.910.401/0001-22', categoria: '2.3.03 Telefone & Internet', dadosBancarios: 'PIX CNPJ Telecom RMS', contato: '(71) 3644-2000', status: 'Provedor Local' },
  { id: 'FORN-008', razaoSocial: 'Receita Federal do Brasil (Guia GPS INSS)', cnpj: '00.396.895/0001-88', categoria: '2.1.05 Encargos INSS Patronal', dadosBancarios: 'Guia GPS Eletrônica', contato: '146', status: 'Órgão Público Federal' },
  { id: 'FORN-009', razaoSocial: 'Caixa Econômica Federal (Guia GRF FGTS)', cnpj: '00.360.305/0001-04', categoria: '2.1.06 Encargos FGTS', dadosBancarios: 'Guia GRF Eletrônica', contato: '0800 726 0101', status: 'Órgão Público Federal' },
  { id: 'FORN-010', razaoSocial: 'DETRAN-BA (Licenciamento & Frota)', cnpj: '13.937.065/0001-00', categoria: '2.4.01 Frota & Veículos', dadosBancarios: 'DUC DETRAN-BA', contato: '(71) 3535-0888', status: 'Órgão Público Estadual' }
];

export const INITIAL_CLIENTES = [
  { id: 'CLI-001', razaoSocial: 'Secretaria de Justiça e Direitos Humanos (SJDH-BA)', cnpj: '13.937.065/0001-00', tipo: 'Órgão Concedente Estadual', contato: '(71) 3115-6000', email: 'convenios.sjdh@ba.gov.br', status: 'Ativo (Termo 005/2022)' },
  { id: 'CLI-002', razaoSocial: 'Prefeitura Municipal de Candeias (PMC)', cnpj: '13.886.205/0001-30', tipo: 'Órgão Concedente Municipal', contato: '(75) 3601-2200', email: 'parcerias.pmc@candeias.ba.gov.br', status: 'Ativo (Termo 008/2025)' },
  { id: 'CLI-003', razaoSocial: 'SENAD / Ministério da Justiça e Segurança Pública', cnpj: '00.396.895/0001-88', tipo: 'Órgão Concedente Federal', contato: '(61) 2025-3000', email: 'convenios.senad@mj.gov.br', status: 'Ativo (Acordo 002/2025)' },
  { id: 'CLI-004', razaoSocial: 'Secretaria de Assistência e Desenvolvimento Social (SADS-BA)', cnpj: '13.937.073/0001-56', tipo: 'Órgão Concedente Estadual', contato: '(71) 3115-9000', email: 'mrosc.sads@ba.gov.br', status: 'Ativo (Termo 014/2025)' },
  { id: 'CLI-005', razaoSocial: 'Fundação Bradesco - Apoio Social', cnpj: '60.701.190/0001-04', tipo: 'Doador Institucional PJ', contato: '(11) 3684-2000', email: 'projetos@fundacaobradesco.org.br', status: 'Parceiro Privado' },
  { id: 'CLI-006', razaoSocial: 'Itaú Social Fundo Comunitário', cnpj: '01.673.456/0001-22', tipo: 'Doador Institucional PJ', contato: '(11) 3572-8000', email: 'parcerias@itausocial.org.br', status: 'Parceiro Privado' }
];

export const INITIAL_ENDERECOS_GALPAO = [
  { id: 'END-01', galpao: 'Galpão A (Alimentos)', corredor: 'Corredor 01', prateleira: 'Prateleira 01', palete: 'Palete 02', descricao: 'Galpão A — Corredor 01 — Prateleira 01 (Palete 02)', status: 'Ativo' },
  { id: 'END-02', galpao: 'Galpão A (Alimentos)', corredor: 'Corredor 02', prateleira: 'Prateleira 03', palete: 'Palete 08', descricao: 'Galpão A — Corredor 02 — Prateleira 03 (Palete 08)', status: 'Ativo' },
  { id: 'END-03', galpao: 'Galpão A (Alimentos)', corredor: 'Corredor 03', prateleira: 'Prateleira 02', palete: 'N/A', descricao: 'Galpão A — Corredor 03 — Prateleira 02', status: 'Ativo' },
  { id: 'END-04', galpao: 'Galpão B (Padaria)', corredor: 'Corredor Único', prateleira: 'Prateleira 01', palete: 'Palete 01', descricao: 'Galpão B (Padaria) — Prateleira 01', status: 'Ativo' },
  { id: 'END-05', galpao: 'Galpão C (Higiene)', corredor: 'Corredor 01', prateleira: 'Prateleira 04', palete: 'Palete 05', descricao: 'Galpão C (Higiene & Limpeza) — Prateleira 04', status: 'Ativo' },
  { id: 'END-06', galpao: 'Galpão D (Mobiliário)', corredor: 'Corredor Central', prateleira: 'Área Livre', palete: 'N/A', descricao: 'Galpão D (Mobiliário & Enxovais) — Área Livre', status: 'Ativo' }
];

export const INITIAL_PROCEDIMENTOS_ODONTO = [
  { id: 'PROC-001', nome: 'Avaliação Odontológica de Admissão', categoria: 'Diagnóstico & Admissão', duracaoEstimada: '30 min', especialista: 'Cirurgião Dentista', status: 'Ativo' },
  { id: 'PROC-002', nome: 'Restauração Estética Superior (Resina Composta)', categoria: 'Dentística Restauradora', duracaoEstimada: '45 min', especialista: 'Cirurgião Dentista', status: 'Ativo' },
  { id: 'PROC-003', nome: 'Moldagem e Confecção de Prótese Parcial Removível', categoria: 'Prótese Dental', duracaoEstimada: '60 min', especialista: 'Protesista / Dentista', status: 'Ativo' },
  { id: 'PROC-004', nome: 'Profilaxia, Raspagem & Limpeza Tártaro', categoria: 'Periodontia & Prevenção', duracaoEstimada: '30 min', especialista: 'Dentista / Higienista', status: 'Ativo' },
  { id: 'PROC-005', nome: 'Exodontia Simples / Extração Terapêutica', categoria: 'Cirurgia Oral', duracaoEstimada: '45 min', especialista: 'Cirurgião Dentista', status: 'Ativo' },
  { id: 'PROC-006', nome: 'Tratamento Endodôntico / Canal Radicular', categoria: 'Endodontia', duracaoEstimada: '60 min', especialista: 'Endodontista', status: 'Ativo' },
  { id: 'PROC-007', nome: 'Manutenção / Ajuste de Prótese Dental', categoria: 'Prótese Dental', duracaoEstimada: '30 min', especialista: 'Protesista / Dentista', status: 'Ativo' }
];

export const INITIAL_MEDICAMENTOS_CATALOGO = [
  { id: 'MED-001', nome: 'Complexo B + Suplementação Vitaminica', categoria: 'Suplementação', controle: 'Livre', dosagemPadrao: '1 cp no almoço (12:00)', viaPadrao: 'Via Oral (VO)', status: 'Ativo' },
  { id: 'MED-002', nome: 'Sertralina 50mg', categoria: 'Antidepressivo / ISRS', controle: 'Portaria 344 (C1)', dosagemPadrao: '1 cp pela manhã (08:00)', viaPadrao: 'Via Oral (VO)', status: 'Ativo' },
  { id: 'MED-003', nome: 'Fluoxetina 20mg', categoria: 'Antidepressivo / Ansiolítico', controle: 'Portaria 344 (C1)', dosagemPadrao: '1 cp pela manhã (08:00)', viaPadrao: 'Via Oral (VO)', status: 'Ativo' },
  { id: 'MED-004', nome: 'Quetiapina 25mg', categoria: 'Antipsicótico / Estabilizador', controle: 'Portaria 344 (C1)', dosagemPadrao: '1 cp à noite (22:00)', viaPadrao: 'Via Oral (VO)', status: 'Ativo' },
  { id: 'MED-005', nome: 'Clonazepam 2mg (Rivotril)', categoria: 'Benzodiazepínico', controle: 'Portaria 344 (B1 Preta)', dosagemPadrao: '1 cp à noite (22:00)', viaPadrao: 'Via Oral (VO)', status: 'Ativo' },
  { id: 'MED-006', nome: 'Haloperidol 5mg (Haldol)', categoria: 'Antipsicótico', controle: 'Portaria 344 (C1)', dosagemPadrao: '1 cp SOS em agitação', viaPadrao: 'Via Oral (VO)', status: 'Ativo' },
  { id: 'MED-007', nome: 'Omeprazol 20mg', categoria: 'Protetor Gástrico', controle: 'Livre', dosagemPadrao: '1 cp em jejum (07:00)', viaPadrao: 'Via Oral (VO)', status: 'Ativo' },
  { id: 'MED-008', nome: 'Dipirona Sódica 500mg', categoria: 'Analgésico / Antitérmico', controle: 'Livre', dosagemPadrao: '1 cp 6/6h SOS dor/febre', viaPadrao: 'Via Oral (VO)', status: 'Ativo' }
];

export const INITIAL_CARGOS_LABORTERAPIA = [
  { id: 'C-01', nome: 'Padeiro Aprendiz', setor: 'Padaria Comunidade', descricao: 'Auxílio na sovagem, fermentação e corte da massa' },
  { id: 'C-02', nome: 'Forneiro / Forno Industrial', setor: 'Padaria Comunidade', descricao: 'Operação dos fornos industriais e controle de tempo' },
  { id: 'C-03', nome: 'Masseiro / Misturador', setor: 'Padaria Comunidade', descricao: 'Preparo da mistura e masseira industrial' },
  { id: 'C-04', nome: 'Cilindrista de Massa', setor: 'Padaria Comunidade', descricao: 'Passagem da massa no cilindro profissional' },
  { id: 'C-05', nome: 'Embalador & Distribuição de Pães', setor: 'Padaria Comunidade', descricao: 'Embalagem e distribuição nos refeitórios' },

  { id: 'C-06', nome: 'Auxiliar de Cozinha / Preparo', setor: 'Cozinha Industrial', descricao: 'Corte de legumes, carnes e pré-preparo' },
  { id: 'C-07', nome: 'Cozinheiro Auxiliar', setor: 'Cozinha Industrial', descricao: 'Preparo das grandes caldeiras e temperos' },
  { id: 'C-08', nome: 'Porcionamento de Marmitas', setor: 'Cozinha Industrial', descricao: 'Porcionamento das 4.000 refeições diárias' },
  { id: 'C-09', nome: 'Higienização de Caldeirões', setor: 'Cozinha Industrial', descricao: 'Lavagem pesada e higienização dos utensílios' },

  { id: 'C-10', nome: 'Manejo do Solo & Irrigação', setor: 'Horta & Agroecologia', descricao: 'Adubação orgânica e sistema de rega' },
  { id: 'C-11', nome: 'Plantio & Semeio de Hortaliças', setor: 'Horta & Agroecologia', descricao: 'Semeio em canteiros e mudas de hortaliças' },
  { id: 'C-12', nome: 'Compostagem & Adubo Orgânico', setor: 'Horta & Agroecologia', descricao: 'Tratamento de resíduos orgânicos' },
  { id: 'C-13', nome: 'Colheita & Pesagem Agrícola', setor: 'Horta & Agroecologia', descricao: 'Colheita e pesagem para remessa à cozinha' },

  { id: 'C-14', nome: 'Pintor Residencial / Predial', setor: 'Manutenção Geral', descricao: 'Pintura dos blocos de alojamento e salas' },
  { id: 'C-15', nome: 'Auxiliar de Encanador', setor: 'Manutenção Geral', descricao: 'Reparos hidráulicos de banheiros e caixas' },
  { id: 'C-16', nome: 'Auxiliar de Eletricista', setor: 'Manutenção Geral', descricao: 'Manutenção de lâmpadas e fiação elétrica' },
  { id: 'C-17', nome: 'Marceneiro / Conserto de Camas', setor: 'Manutenção Geral', descricao: 'Reparo de beliches e mobiliário' },

  { id: 'C-18', nome: 'Higienização de Pátio Central', setor: 'Limpeza & Higienização', descricao: 'Varrição e lavagem das áreas de convivência' },
  { id: 'C-19', nome: 'Higienização de Sanitários', setor: 'Limpeza & Higienização', descricao: 'Desinfecção diária dos banheiros coletivos' },
  { id: 'C-20', nome: 'Zeladoria de Dormitórios', setor: 'Limpeza & Higienização', descricao: 'Apoio na organização e limpeza dos dormitórios' }
];
