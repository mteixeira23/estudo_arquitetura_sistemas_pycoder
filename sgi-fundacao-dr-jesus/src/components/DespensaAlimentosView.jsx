import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  ChefHat, 
  Package, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  ShoppingBag, 
  Truck, 
  Calendar, 
  Search, 
  Filter, 
  Printer, 
  Trash2, 
  Pencil, 
  X,
  Apple,
  Boxes,
  TrendingUp,
  Receipt,
  ShoppingCart,
  ShieldAlert,
  Calculator,
  HeartPulse,
  Tag,
  Sprout,
  DollarSign
} from 'lucide-react';

export default function DespensaAlimentosView({ acolhidos = [], profissionais = [], fornecedores = [], onAddTransacao, activeSubTab, setActiveSubTab }) {
  const [activeTabInternal, setActiveTabInternal] = useState('estoque');
  const activeTab = activeSubTab || activeTabInternal;
  const setActiveTab = setActiveSubTab || setActiveTabInternal;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoriaFilter, setSelectedCategoriaFilter] = useState('Todas');
  const [filterStatusEstoque, setFilterStatusEstoque] = useState('Todos');

  // Specific Table Filter States
  const [searchEntradas, setSearchEntradas] = useState('');
  const [filterFornecedorEntradas, setFilterFornecedorEntradas] = useState('Todos');

  const [searchDietas, setSearchDietas] = useState('');
  const [filterRestricaoDietas, setFilterRestricaoDietas] = useState('Todas');

  const [searchSaidas, setSearchSaidas] = useState('');
  const [filterRefeicaoSaidas, setFilterRefeicaoSaidas] = useState('Todas');

  const [searchPedidos, setSearchPedidos] = useState('');
  const [searchComparador, setSearchComparador] = useState('');
  const [searchPerdas, setSearchPerdas] = useState('');
  
  // Modals state
  const [showEntradaModal, setShowEntradaModal] = useState(false);
  const [showSaidaModal, setShowSaidaModal] = useState(false);
  const [showPerdaModal, setShowPerdaModal] = useState(false);
  const [showEtiquetaModal, setShowEtiquetaModal] = useState(false);
  const [selectedItemEtiqueta, setSelectedItemEtiqueta] = useState(null);
  const [showNewDietaModal, setShowNewDietaModal] = useState(false);
  const [newDieta, setNewDieta] = useState({
    acolhido: acolhidos[0]?.nome || 'Antonio Carlos da Silva Filho',
    restricao: 'Diabetes Mellitus Tipo 2',
    dietaRecomendada: 'Sem açúcar adicionado / Carboidratos complexos',
    refeicaoEspecial: 'Almoço/Jantar sem adição de açúcar ou sucos adoçados',
    observacao: 'Sincronizado com Gestão de Acolhidos & Enfermagem'
  });

  // Dynamic Multi-Supplier Price Comparison Data
  const [comparadorPrecos, setComparadorPrecos] = useState(() => [
    { 
      id: 'COMP-1', 
      item: 'Arroz Tipo 1 5kg', 
      cotacoes: [
        { empresa: 'Atacadão S.A.', preco: 28.90 },
        { empresa: 'Distribuidora Ceasa Salvador Ltda', preco: 31.50 }
      ],
      menorPreco: 'Atacadão S.A.', 
      menorValor: 28.90,
      economiaPercentual: '8.25%' 
    },
    { 
      id: 'COMP-2', 
      item: 'Feijão Carioca 1kg', 
      cotacoes: [
        { empresa: 'Atacadão S.A.', preco: 7.20 },
        { empresa: 'Distribuidora Ceasa Salvador Ltda', preco: 6.90 }
      ],
      menorPreco: 'Distribuidora Ceasa Salvador Ltda', 
      menorValor: 6.90,
      economiaPercentual: '4.16%' 
    },
    { 
      id: 'COMP-3', 
      item: 'Carne Bovina Coxão Mole (kg)', 
      cotacoes: [
        { empresa: 'Atacadão S.A.', preco: 34.90 },
        { empresa: 'Distribuidora Ceasa Salvador Ltda', preco: 32.50 },
        { empresa: 'Nacional Gás Butano Distribuidora Ltda', preco: 33.90 }
      ],
      menorPreco: 'Distribuidora Ceasa Salvador Ltda', 
      menorValor: 32.50,
      economiaPercentual: '6.87%' 
    },
    { 
      id: 'COMP-4', 
      item: 'Frango Resfriado (kg)', 
      cotacoes: [
        { empresa: 'Atacadão S.A.', preco: 14.80 },
        { empresa: 'Distribuidora Ceasa Salvador Ltda', preco: 15.20 }
      ],
      menorPreco: 'Atacadão S.A.', 
      menorValor: 14.80,
      economiaPercentual: '2.63%' 
    },
    { 
      id: 'COMP-5', 
      item: 'Óleo de Soja 900ml', 
      cotacoes: [
        { empresa: 'Atacadão S.A.', preco: 6.90 },
        { empresa: 'Distribuidora Ceasa Salvador Ltda', preco: 7.10 }
      ],
      menorPreco: 'Atacadão S.A.', 
      menorValor: 6.90,
      economiaPercentual: '2.81%' 
    }
  ]);

  const [showAddComparadorModal, setShowAddComparadorModal] = useState(false);
  const [showEditComparadorModal, setShowEditComparadorModal] = useState(false);
  const [editingComparador, setEditingComparador] = useState(null);

  const [newComparador, setNewComparador] = useState({
    item: 'Arroz Tipo 1 5kg',
    cotacoes: [
      { empresa: fornecedores[0]?.razaoSocial || 'Atacadão S.A.', preco: '28.90' },
      { empresa: fornecedores[4]?.razaoSocial || 'Distribuidora Ceasa Salvador Ltda', preco: '31.50' }
    ]
  });

  // Per Capita Calculator State
  const [qtdAcolhidosCalc, setQtdAcolhidosCalc] = useState(1240);
  const [refeicaoCalc, setRefeicaoCalc] = useState('Almoço Comunitário');

  // Initial Food Pantry Stock (Despensa FDJ)
  const INITIAL_DESPENSA_ESTOQUE = [
    { id: 'ALIM-101', item: 'Arroz Tipo 1 (Fardos 30kg)', categoria: 'Grãos e Cereais', qtdAtual: 450, unidade: 'kg', qtdMinima: 200, lote: 'LT-88491', validade: '2027-04-15', origem: 'Compra MROSC SJDH-BA (Atacadão)', valorUnitario: 5.80, status: 'Normal' },
    { id: 'ALIM-102', item: 'Feijão Carioca 1kg (Fardos 10kg)', categoria: 'Grãos e Cereais', qtdAtual: 320, unidade: 'kg', qtdMinima: 150, lote: 'LT-88492', validade: '2026-11-20', origem: 'Compra MROSC SJDH-BA (Atacadão)', valorUnitario: 7.20, status: 'Normal' },
    { id: 'ALIM-103', item: 'Carne Bovina Alcatra / Coxão Mole', categoria: 'Carnes & Proteínas', qtdAtual: 180, unidade: 'kg', qtdMinima: 100, lote: 'LT-90123', validade: '2026-09-05', origem: 'Compra MROSC (Ceasa Salvador)', valorUnitario: 32.50, status: 'Normal' },
    { id: 'ALIM-104', item: 'Frango Resfriado Inteiro / Coxa e Sobrecoxa', categoria: 'Carnes & Proteínas', qtdAtual: 240, unidade: 'kg', qtdMinima: 120, lote: 'LT-90124', validade: '2026-08-30', origem: 'Compra MROSC (Ceasa Salvador)', valorUnitario: 14.80, status: 'Normal' },
    { id: 'ALIM-105', item: 'Leite em Pó Integral 400g', categoria: 'Laticínios', qtdAtual: 140, unidade: 'pacotes', qtdMinima: 150, lote: 'LT-77102', validade: '2026-09-01', origem: 'Doação Privada (Atacadão)', valorUnitario: 12.00, status: 'Atenção (Validade Próxima)' },
    { id: 'ALIM-106', item: 'Óleo de Soja Refinado 900ml', categoria: 'Óleos & Condimentos', qtdAtual: 380, unidade: 'garrafas', qtdMinima: 200, lote: 'LT-66301', validade: '2027-06-10', origem: 'Compra MROSC SJDH-BA (Atacadão)', valorUnitario: 6.90, status: 'Normal' },
    { id: 'ALIM-107', item: 'Hortifrúti Diversos (Batata, Cenoura, Chuchu)', categoria: 'Hortifrúti & Verduras', qtdAtual: 290, unidade: 'kg', qtdMinima: 100, lote: 'LT-CEASA-08', validade: '2026-08-26', origem: 'Compra MROSC (Ceasa Salvador)', valorUnitario: 4.50, status: 'Normal' },
    { id: 'ALIM-108', item: 'Macarrão Espaguete Grano Duro 500g', categoria: 'Grãos e Cereais', qtdAtual: 85, unidade: 'pcts', qtdMinima: 120, lote: 'LT-55190', validade: '2027-08-01', origem: 'Acordo Federal SENAD', valorUnitario: 4.20, status: 'Estoque Crítico' },
    { id: 'ALIM-109', item: 'Açúcar Refinado 1kg', categoria: 'Grãos e Cereais', qtdAtual: 310, unidade: 'kg', qtdMinima: 100, lote: 'LT-44102', validade: '2028-01-10', origem: 'Compra MROSC SJDH-BA', valorUnitario: 4.10, status: 'Normal' },
    { id: 'ALIM-110', item: 'Gás de Cozinha Industrial GLP 45kg', categoria: 'Insumos de Cozinha', qtdAtual: 14, unidade: 'botijões', qtdMinima: 6, lote: 'N/A', validade: '2028-12-31', origem: 'Nacional Gás Distribuidora', valorUnitario: 380.00, status: 'Normal' }
  ];

  const [estoqueAlimentos, setEstoqueAlimentos] = useState(() => {
    const saved = localStorage.getItem('sgi_fdj_despensa_estoque');
    return saved ? JSON.parse(saved) : INITIAL_DESPENSA_ESTOQUE;
  });

  // Food Entry History (Entradas / Compras MROSC / NFe / Horta)
  const [entradas, setEntradas] = useState([
    { id: 'ENT-201', data: '2026-08-18', fornecedor: 'Atacadão S.A.', nfe: 'NFe-8841', item: 'Arroz Tipo 1 (Fardos 30kg)', quantidade: 300, unidade: 'kg', valorTotal: 1740.00, lote: 'LT-88491', validade: '2027-04-15', origem: 'Termo de Fomento nº 005/2022 (SJDH-BA)' },
    { id: 'ENT-202', data: '2026-08-15', fornecedor: 'Distribuidora Ceasa Salvador Ltda', nfe: 'NFe-9012', item: 'Carne Bovina Alcatra / Coxão Mole', quantidade: 150, unidade: 'kg', valorTotal: 4875.00, lote: 'LT-90123', validade: '2026-09-05', origem: 'Acordo de Cooperação Federal nº 002/2025 (SENAD)' },
    { id: 'ENT-203', data: '2026-08-10', fornecedor: 'Horta Orgânica FDJ (Produção Própria)', nfe: 'Colheita #04', item: 'Mandioca / Aipim & Hortaliças', quantidade: 210, unidade: 'kg', valorTotal: 0.00, lote: 'LT-HORTA-04', validade: '2026-08-28', origem: 'Produção Própria FDJ' }
  ]);

  // Central Kitchen Dispatch Log (Saídas p/ Cozinha)
  const [saidas, setSaidas] = useState([
    { id: 'SAI-301', data: '2026-08-19 07:30', refeicao: 'Almoço Comunitário (1.240 Acolhidos)', item: 'Arroz Tipo 1 & Feijão Carioca', quantidade: '124 kg Arroz / 62 kg Feijão', requisitante: 'Chefe Valdeci (Cozinha Central)', observacao: 'Preparo do almoço principal para os blocos residenciais' },
    { id: 'SAI-302', data: '2026-08-18 16:00', refeicao: 'Jantar & Sopa Nutritiva', item: 'Frango Resfriado & Hortifrúti', quantidade: '80 kg Frango / 50 kg Legumes', requisitante: 'Nutricionista Dra. Mariana', observacao: 'Cardápio proteico noturno reforçado' }
  ]);

  // Special Diets Data (Dietas Especiais RDC 29 - Sincronizado com Gestão de Acolhidos)
  const [dietasEspeciais, setDietasEspeciais] = useState(() => {
    if (acolhidos && acolhidos.length > 0) {
      return [
        { id: 'DIET-01', acolhido: acolhidos[0]?.nome || 'Antonio Carlos da Silva Filho', restricao: 'Diabetes Mellitus Tipo 2', dietaRecomendada: 'Sem açúcar adicionado / Carboidratos complexos', refeicaoEspecial: 'Almoço/Jantar sem adição de açúcar ou sucos adoçados', observacao: 'Sincronizado com Gestão de Acolhidos & Enfermagem' },
        { id: 'DIET-02', acolhido: acolhidos[1]?.nome || 'Marcos Vinicius Santos Santana', restricao: 'Hipertensão Arterial Severa', dietaRecomendada: 'Hipossódica (Baixo teor de sódio)', refeicaoEspecial: 'Comida preparada com sal reduzido/ervas naturais', observacao: 'Sincronizado com Gestão de Acolhidos & Enfermagem' },
        { id: 'DIET-03', acolhido: acolhidos[2]?.nome || 'Edvaldo Oliveira Souza', restricao: 'Intolerância Severa a Lactose', dietaRecomendada: 'Zero Lactose', refeicaoEspecial: 'Substituição de leite por extrato vegetal no café', observacao: 'Sincronizado com Gestão de Acolhidos & Enfermagem' }
      ];
    }
    return [
      { id: 'DIET-01', acolhido: 'Antonio Carlos da Silva Filho', restricao: 'Diabetes Mellitus Tipo 2', dietaRecomendada: 'Sem açúcar adicionado / Carboidratos complexos', refeicaoEspecial: 'Almoço/Jantar sem adição de açúcar ou sucos adoçados', observacao: 'Sincronizado com Gestão de Acolhidos & Enfermagem' },
      { id: 'DIET-02', acolhido: 'Marcos Vinicius Santos Santana', restricao: 'Hipertensão Arterial Severa', dietaRecomendada: 'Hipossódica (Baixo teor de sódio)', refeicaoEspecial: 'Comida preparada com sal reduzido/ervas naturais', observacao: 'Sincronizado com Gestão de Acolhidos & Enfermagem' },
      { id: 'DIET-03', acolhido: 'Edvaldo Oliveira Souza', restricao: 'Intolerância Severa a Lactose', dietaRecomendada: 'Zero Lactose', refeicaoEspecial: 'Substituição de leite por extrato vegetal no café', observacao: 'Sincronizado com Gestão de Acolhidos & Enfermagem' }
    ];
  });



  // Food Losses / Waste Audit (Perdas & Avarias Sanitárias)
  const [perdas, setPerdas] = useState([
    { id: 'PERD-01', data: '2026-08-12', item: 'Hortifrúti Diversos (Tomate)', quantidade: '12 kg', motivo: 'Deterioração Natural de Transporte', laudoSanitario: 'Laudo Sanitário #0829/2026', responsavel: 'Nutricionista Dra. Mariana' }
  ]);

  // Gramatura Per Capita Editable State
  const [gramaturas, setGramaturas] = useState([
    { id: 'GRAM-1', ingrediente: 'Arroz Tipo 1', gramasPorPessoa: 100, itemEstoque: 'Arroz Tipo 1 (Fardos 30kg)' },
    { id: 'GRAM-2', ingrediente: 'Feijão Carioca', gramasPorPessoa: 50, itemEstoque: 'Feijão Carioca 1kg (Fardos 10kg)' },
    { id: 'GRAM-3', ingrediente: 'Proteína Bovina / Alcatra', gramasPorPessoa: 120, itemEstoque: 'Carne Bovina Alcatra / Coxão Mole' },
    { id: 'GRAM-4', ingrediente: 'Frango Resfriado', gramasPorPessoa: 150, itemEstoque: 'Frango Resfriado Inteiro / Coxa e Sobrecoxa' },
    { id: 'GRAM-5', ingrediente: 'Hortifrúti / Legumes Cozidos', gramasPorPessoa: 100, itemEstoque: 'Hortifrúti Diversos (Batata, Cenoura, Chuchu)' }
  ]);

  const [editingGramaturaId, setEditingGramaturaId] = useState(null);
  const [tempGramasVal, setTempGramasVal] = useState(100);
  const [showAddGramaturaModal, setShowAddGramaturaModal] = useState(false);
  const [showEditGramaturaModal, setShowEditGramaturaModal] = useState(false);
  const [editingGramatura, setEditingGramatura] = useState(null);
  const [newGramatura, setNewGramatura] = useState({
    ingrediente: '',
    gramasPorPessoa: 100,
    itemEstoque: 'Arroz Tipo 1 (Fardos 30kg)'
  });

  // Available RMIs from Almoxarifado Central (Modulo 5 Integration)
  const INITIAL_RMIS = [
    {
      id: 'RMI-2026-093',
      label: 'RMI #093 — Farinha de Trigo Especial (53 kg = R$ 238,50) • Almoxarifado Padaria',
      nfe: 'RMI-2026-093',
      item: 'Farinha de Trigo Especial Padaria',
      quantidade: '53',
      unidade: 'kg',
      valorTotal: '238.50',
      fornecedor: 'Almoxarifado Galpão B (Padaria)',
      validade: '2027-01-15',
      lote: 'LT-FT-2026-093',
      origem: 'Termo de Fomento nº 005/2022 (SJDH-BA)',
      status: 'Pendente'
    },
    {
      id: 'RMI-2026-087',
      label: 'RMI #087 — Farinha de Trigo Especial (200 kg = R$ 900,00) • Almoxarifado Padaria',
      nfe: 'RMI-2026-087',
      item: 'Farinha de Trigo Especial Padaria',
      quantidade: '200',
      unidade: 'kg',
      valorTotal: '900.00',
      fornecedor: 'Almoxarifado Galpão B (Padaria)',
      validade: '2027-01-15',
      lote: 'LT-FT-2026-087',
      origem: 'Termo de Fomento nº 005/2022 (SJDH-BA)',
      status: 'Pendente'
    },
    {
      id: 'RMI-2026-089',
      label: 'RMI #089 — Feijão Carioca (40 kg = R$ 288,00) • Almoxarifado Galpão A',
      nfe: 'RMI-2026-089',
      item: 'Feijão Carioca Tipo 1',
      quantidade: '40',
      unidade: 'kg',
      valorTotal: '288.00',
      fornecedor: 'Almoxarifado Galpão A (Alimentos)',
      validade: '2027-05-20',
      lote: 'LT-FJ-2026-089',
      origem: 'Termo de Fomento nº 005/2022 (SJDH-BA)',
      status: 'Pendente'
    },
    {
      id: 'HORTA-004',
      label: 'HORTA #004 — Mandioca & Hortaliças (210 kg = R$ 945,00) • Horta Orgânica FDJ',
      nfe: 'HORTA-004',
      item: 'Mandioca / Aipim & Hortaliças Orgânicas',
      quantidade: '210',
      unidade: 'kg',
      valorTotal: '945.00',
      fornecedor: 'Produção Própria Horta Orgânica FDJ',
      validade: '2026-08-28',
      lote: 'LT-HORTA-04',
      origem: 'Produção Própria FDJ',
      status: 'Pendente'
    }
  ];

  const getLatestRmis = () => {
    const saved = localStorage.getItem('sgi_fdj_almoxarifado_rmis');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const savedIds = new Set(parsed.map(r => r.id));
        const merged = [...parsed, ...INITIAL_RMIS.filter(i => !savedIds.has(i.id))];
        return merged;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_RMIS;
  };

  const [rmisDisponiveis, setRmisDisponiveis] = useState(getLatestRmis);

  // Forms State
  const [newEntrada, setNewEntrada] = useState({
    fornecedor: 'Almoxarifado Galpão B (Padaria)',
    nfe: 'RMI-2026-093',
    item: 'Farinha de Trigo Especial Padaria',
    quantidade: '53',
    unidade: 'kg',
    valorTotal: '238.50',
    lote: 'LT-FT-2026-093',
    validade: '2027-01-15',
    origem: 'Termo de Fomento nº 005/2022 (SJDH-BA)'
  });

  const [newSaida, setNewSaida] = useState({
    refeicao: 'Almoço Comunitário (1.240 Acolhidos)',
    item: 'Arroz Tipo 1 (Fardos 30kg)',
    quantidade: '40 kg',
    quantidadeVal: '40',
    unidade: 'kg',
    requisitante: 'Chefe Valdeci (Cozinha Central)',
    observacao: ''
  });

  // Standardized Technical Disposal Reasons
  const [motivosDescarte, setMotivosDescarte] = useState([
    'Avaria na embalagem durante armazenagem',
    'Deterioração Natural de Hortifrúti / Validade',
    'Infestação Sanitária / Laudo de Pragas',
    'Falha na Cadeia de Frio / Refrigeração',
    'Rompimento de Embalagem no Transporte',
    'Sobra Limpa Não Consumida (Vencimento de Exposição)',
    'Umidade / Infiltração em Galpão de Alimentos'
  ]);
  const [showNovoMotivoModal, setShowNovoMotivoModal] = useState(false);
  const [novoMotivoTexto, setNovoMotivoTexto] = useState('');
  const [filterMotivoPerda, setFilterMotivoPerda] = useState('Todos');

  const [newPerda, setNewPerda] = useState({
    item: estoqueAlimentos[0]?.item || 'Arroz Tipo 1 (Fardos 30kg)',
    quantidadeVal: '10',
    unidade: 'kg',
    motivo: 'Avaria na embalagem durante armazenagem',
    laudoSanitario: 'Laudo Nutricional #0912/2026',
    responsavel: 'Nutricionista Dra. Mariana (CRN-BA 9102)'
  });

  // Handlers
  const handleCreateEntrada = (e) => {
    e.preventDefault();
    if (!newEntrada.nfe) return;

    const itemNome = newEntrada.item || 'Farinha de Trigo Especial Padaria';
    const qtdNum = parseFloat(newEntrada.quantidade) || 53;
    const valTotalNum = parseFloat(newEntrada.valorTotal) || 238.50;

    const newEnt = {
      id: `ENT-${200 + entradas.length + 1}`,
      data: new Date().toISOString().split('T')[0],
      fornecedor: newEntrada.fornecedor || 'Almoxarifado Galpão B (Padaria)',
      nfe: newEntrada.nfe,
      item: itemNome,
      quantidade: qtdNum,
      unidade: newEntrada.unidade || 'kg',
      valorTotal: valTotalNum,
      lote: newEntrada.lote || 'LT-FT-2026-093',
      validade: newEntrada.validade || '2027-01-15',
      origem: newEntrada.origem || 'Termo de Fomento nº 005/2022 (SJDH-BA)'
    };

    setEntradas([newEnt, ...entradas]);

    // Mark the selected RMI as Concluida in state so it disappears from available transfers!
    const updatedRmis = rmisDisponiveis.map(r => 
      r.nfe === newEntrada.nfe ? { ...r, status: 'Concluída' } : r
    );
    setRmisDisponiveis(updatedRmis);

    // Update or add stock item
    let updatedEstoqueDespensa = [];
    const exists = estoqueAlimentos.find(i => 
      i.item.toLowerCase().includes(itemNome.toLowerCase()) || 
      itemNome.toLowerCase().includes(i.item.toLowerCase())
    );
    if (exists) {
      updatedEstoqueDespensa = estoqueAlimentos.map(i => {
        if (i.id === exists.id) {
          const novaQtd = i.qtdAtual + qtdNum;
          return {
            ...i,
            qtdAtual: novaQtd,
            status: novaQtd <= i.qtdMinima ? 'Estoque Crítico' : 'Normal'
          };
        }
        return i;
      });
    } else {
      updatedEstoqueDespensa = [
        {
          id: `ALIM-${100 + estoqueAlimentos.length + 1}`,
          item: itemNome,
          categoria: itemNome.toLowerCase().includes('farinha') ? 'Grãos e Cereais' : 'Alimentos',
          qtdAtual: qtdNum,
          unidade: newEntrada.unidade || 'kg',
          qtdMinima: 100,
          lote: newEntrada.lote || 'LT-FT-2026-093',
          validade: newEntrada.validade || '2027-01-15',
          origem: newEntrada.fornecedor || 'Almoxarifado Galpão B (Padaria)',
          valorUnitario: qtdNum > 0 ? valTotalNum / qtdNum : 4.50,
          status: qtdNum <= 100 ? 'Estoque Crítico' : 'Normal'
        },
        ...estoqueAlimentos
      ];
    }

    setEstoqueAlimentos(updatedEstoqueDespensa);

    // PERSISTENCE TO LOCALSTORAGE
    localStorage.setItem('sgi_fdj_despensa_estoque', JSON.stringify(updatedEstoqueDespensa));
    localStorage.setItem('sgi_fdj_almoxarifado_rmis', JSON.stringify(updatedRmis));

    // Auto-select next pending RMI for next transfer, if any remain
    const remainingPending = updatedRmis.filter(r => r.status === 'Pendente');
    if (remainingPending.length > 0) {
      const nextRmi = remainingPending[0];
      setNewEntrada({
        fornecedor: nextRmi.fornecedor,
        nfe: nextRmi.nfe,
        item: nextRmi.item,
        quantidade: nextRmi.quantidade,
        unidade: nextRmi.unidade,
        valorTotal: nextRmi.valorTotal,
        lote: nextRmi.lote,
        validade: nextRmi.validade,
        origem: nextRmi.origem
      });
    } else {
      setNewEntrada({
        fornecedor: '',
        nfe: '',
        item: '',
        quantidade: '',
        unidade: 'kg',
        valorTotal: '',
        lote: '',
        validade: '',
        origem: ''
      });
    }

    setShowEntradaModal(false);
  };

  const handleCreateSaida = (e) => {
    e.preventDefault();
    if (!newSaida.item || !newSaida.quantidade) return;

    const newSai = {
      id: `SAI-${300 + saidas.length + 1}`,
      data: new Date().toLocaleString('pt-BR'),
      ...newSaida
    };

    setSaidas([newSai, ...saidas]);

    // Deduct from stock
    const qtdNum = parseFloat(newSaida.quantidade) || 0;
    setEstoqueAlimentos(prev => prev.map(i => {
      if (i.item.toLowerCase().includes(newSaida.item.toLowerCase())) {
        const novaQtd = Math.max(0, i.qtdAtual - qtdNum);
        return {
          ...i,
          qtdAtual: novaQtd,
          status: novaQtd <= i.qtdMinima ? 'Estoque Crítico' : 'Normal'
        };
      }
      return i;
    }));

    setShowSaidaModal(false);
  };

  const handleCreatePerda = (e) => {
    e.preventDefault();

    const itemNome = newPerda.item || estoqueAlimentos[0]?.item || 'Arroz Tipo 1';
    const qtdNum = parseFloat(newPerda.quantidadeVal) || 10;
    const unitStr = newPerda.unidade || 'kg';

    const newPerd = {
      id: `PERD-0${perdas.length + 1}`,
      data: new Date().toISOString().split('T')[0],
      item: itemNome,
      quantidade: `${qtdNum} ${unitStr}`,
      motivo: newPerda.motivo || 'Avaria na embalagem durante armazenagem',
      laudoSanitario: newPerda.laudoSanitario || 'Laudo Nutricional #0912/2026',
      responsavel: newPerda.responsavel || 'Nutricionista Dra. Mariana'
    };

    setPerdas([newPerd, ...perdas]);

    // Automatically deduct from stock
    setEstoqueAlimentos(prev => prev.map(i => {
      if (i.item === itemNome || i.item.toLowerCase().includes(itemNome.toLowerCase())) {
        const descKg = unitStr === 'ton' ? qtdNum * 1000 : qtdNum;
        const novaQtd = Math.max(0, i.qtdAtual - descKg);
        return {
          ...i,
          qtdAtual: novaQtd,
          status: novaQtd <= i.qtdMinima ? 'Estoque Crítico' : 'Normal'
        };
      }
      return i;
    }));

    setShowPerdaModal(false);
  };

  // Filtered Stock List (Aba 2: Despensa Física)
  const filteredEstoque = estoqueAlimentos.filter(item => {
    const matchesSearch = item.item.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.lote.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategoriaFilter === 'Todas' || item.categoria === selectedCategoriaFilter;
    const isCritico = item.qtdAtual <= item.qtdMinima;
    const matchesStatus = filterStatusEstoque === 'Todos' ||
      (filterStatusEstoque === 'Critico' && isCritico) ||
      (filterStatusEstoque === 'Normal' && !isCritico);
    return matchesSearch && matchesCat && matchesStatus;
  });

  // Filtered Entradas List (Aba 1)
  const filteredEntradas = entradas.filter(e => {
    const matchSearch = e.item.toLowerCase().includes(searchEntradas.toLowerCase()) ||
                        e.fornecedor.toLowerCase().includes(searchEntradas.toLowerCase()) ||
                        e.nfe.toLowerCase().includes(searchEntradas.toLowerCase()) ||
                        e.origem.toLowerCase().includes(searchEntradas.toLowerCase());
    const matchForn = filterFornecedorEntradas === 'Todos' || e.fornecedor.toLowerCase().includes(filterFornecedorEntradas.toLowerCase());
    return matchSearch && matchForn;
  });

  // Filtered Dietas Especiais (Aba 4)
  const filteredDietas = dietasEspeciais.filter(d => {
    const matchSearch = d.acolhido.toLowerCase().includes(searchDietas.toLowerCase()) ||
                        d.restricao.toLowerCase().includes(searchDietas.toLowerCase()) ||
                        d.dietaRecomendada.toLowerCase().includes(searchDietas.toLowerCase());
    const matchRest = filterRestricaoDietas === 'Todas' || d.restricao.toLowerCase().includes(filterRestricaoDietas.toLowerCase());
    return matchSearch && matchRest;
  });

  // Filtered Saídas (Aba 5)
  const filteredSaidas = saidas.filter(s => {
    const matchSearch = s.item.toLowerCase().includes(searchSaidas.toLowerCase()) ||
                        s.refeicao.toLowerCase().includes(searchSaidas.toLowerCase()) ||
                        s.requisitante.toLowerCase().includes(searchSaidas.toLowerCase());
    const matchRef = filterRefeicaoSaidas === 'Todas' || s.refeicao.toLowerCase().includes(filterRefeicaoSaidas.toLowerCase());
    return matchSearch && matchRef;
  });

  // Reorder Auto-Suggestion Items (Estoque Crítico)
  const itensParaPedido = estoqueAlimentos.filter(i => i.qtdAtual <= i.qtdMinima || i.status.includes('Crítico'));

  // Filtered Pedidos Reposição (Aba 7)
  const filteredPedidos = itensParaPedido.filter(i => 
    i.item.toLowerCase().includes(searchPedidos.toLowerCase()) ||
    (i.categoria && i.categoria.toLowerCase().includes(searchPedidos.toLowerCase()))
  );

  const getCotacoesList = (cp) => {
    if (cp.cotacoes && Array.isArray(cp.cotacoes) && cp.cotacoes.length > 0) {
      return cp.cotacoes.filter(c => c.empresa && parseFloat(c.preco) > 0);
    }
    const legacy = [];
    if (cp.precoAtacadao) legacy.push({ empresa: 'Atacadão S.A.', preco: parseFloat(cp.precoAtacadao) });
    if (cp.precoCeasa) legacy.push({ empresa: 'Distribuidora Ceasa Salvador Ltda', preco: parseFloat(cp.precoCeasa) });
    if (cp.precoMercadoBaiano) legacy.push({ empresa: 'Mercado Baiano Ltda', preco: parseFloat(cp.precoMercadoBaiano) });
    if (cp.precoAssai) legacy.push({ empresa: 'Assaí Atacadista', preco: parseFloat(cp.precoAssai) });
    return legacy;
  };

  const calculateBestSupplierDynamic = (cotacoesList) => {
    const valid = cotacoesList.filter(c => c.empresa && parseFloat(c.preco) > 0);
    if (valid.length === 0) return { menorPreco: 'N/A', menorValor: 0, economiaPercentual: '0.00%' };

    valid.sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco));
    const lowest = valid[0];
    const highest = valid[valid.length - 1];

    const diff = parseFloat(highest.preco) - parseFloat(lowest.preco);
    const pct = parseFloat(highest.preco) > 0 ? ((diff / parseFloat(highest.preco)) * 100).toFixed(2) : '0.00';

    return {
      menorPreco: lowest.empresa,
      menorValor: parseFloat(lowest.preco),
      economiaPercentual: `${pct}%`
    };
  };

  // Filtered Comparador (Aba 8)
  const filteredComparador = comparadorPrecos.filter(c => {
    const matchesSearch = c.item.toLowerCase().includes(searchComparador.toLowerCase()) ||
                          (c.menorPreco && c.menorPreco.toLowerCase().includes(searchComparador.toLowerCase()));
    return matchesSearch;
  });

  // Filtered Perdas (Aba 9)
  const filteredPerdas = perdas.filter(p => {
    const matchesSearch = p.item.toLowerCase().includes(searchPerdas.toLowerCase()) ||
                          p.motivo.toLowerCase().includes(searchPerdas.toLowerCase()) ||
                          (p.laudoSanitario && p.laudoSanitario.toLowerCase().includes(searchPerdas.toLowerCase()));
    const matchesMotivo = filterMotivoPerda === 'Todos' || p.motivo === filterMotivoPerda;
    return matchesSearch && matchesMotivo;
  });

  const totalKilosEstoque = estoqueAlimentos.reduce((acc, curr) => acc + (curr.unidade === 'kg' ? curr.qtdAtual : 0), 0);
  const totalItensCriticos = itensParaPedido.length;
  const totalAlertasValidade = estoqueAlimentos.filter(i => i.status.includes('Validade')).length;

  // Calculate total consumed/transferred to kitchen per item
  const getQtdSaidaCalculada = (itemNome) => {
    const matches = saidas.filter(s => 
      s.item.toLowerCase().includes(itemNome.toLowerCase()) || 
      itemNome.toLowerCase().includes(s.item.toLowerCase())
    );
    if (matches.length === 0) return '0 kg';
    
    let totalKg = 0;
    let foundNumeric = false;
    matches.forEach(m => {
      const val = parseFloat(m.quantidade);
      if (!isNaN(val)) {
        totalKg += val;
        foundNumeric = true;
      }
    });

    if (foundNumeric && totalKg > 0) {
      return `${totalKg} kg`;
    }
    return matches.map(m => m.quantidade).join(' + ');
  };

  // Gramatura Calculator Table Rules (in grams per acolhido)
  const gramaturasGramas = [
    { ingrediente: 'Arroz Tipo 1', gramasPorPessoa: 100, itemEstoque: 'Arroz Tipo 1 (Fardos 30kg)' },
    { ingrediente: 'Feijão Carioca', gramasPorPessoa: 50, itemEstoque: 'Feijão Carioca 1kg (Fardos 10kg)' },
    { ingrediente: 'Proteína Bovina / Alcatra', gramasPorPessoa: 120, itemEstoque: 'Carne Bovina Alcatra / Coxão Mole' },
    { ingrediente: 'Frango Resfriado', gramasPorPessoa: 150, itemEstoque: 'Frango Resfriado Inteiro / Coxa e Sobrecoxa' },
    { ingrediente: 'Hortifrúti / Legumes Cozidos', gramasPorPessoa: 100, itemEstoque: 'Hortifrúti Diversos (Batata, Cenoura, Chuchu)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Banner Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid #10b981' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-success">Módulo 6</span>
            <span className="badge badge-primary">Despensa & Nutrição Comunitária • Gestão de Alimentos (1.240 Acolhidos)</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UtensilsCrossed size={24} style={{ color: '#10b981' }} />
            Despensa, Controle de Alimentos & Cozinha Central FDJ
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Controle de estoque de gêneros alimentícios, gramatura per capita, dietas especiais, etiquetas MROSC e descarte sanitário.
          </p>
        </div>
      </div>





      {/* KPI Cards */}
      <div className="grid-4">
        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <ChefHat size={22} />
          </div>
          <div className="stat-label">Total de Alimentos em Estoque</div>
          <div className="stat-value">{totalKilosEstoque.toLocaleString('pt-BR')} kg</div>
          <div className="stat-subtext" style={{ color: '#047857', fontWeight: 600 }}>Grãos, Proteínas & Hortifrúti</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #2563eb' }}>
          <div className="stat-icon" style={{ background: 'rgba(37, 99, 235, 0.12)', color: '#2563eb' }}>
            <UtensilsCrossed size={22} />
          </div>
          <div className="stat-label">Refeições Servidas / Dia</div>
          <div className="stat-value">4.000 Refeições</div>
          <div className="stat-subtext" style={{ color: '#1d4ed8', fontWeight: 600 }}>Custo Médio: R$ 4,12 / refeição</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
            <Clock size={22} />
          </div>
          <div className="stat-label">Validade Próxima (FEFO)</div>
          <div className="stat-value">{totalAlertasValidade} Lotes</div>
          <div className="stat-subtext" style={{ color: '#b45309', fontWeight: 600 }}>Consumo Prioritário no Cardápio</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #dc2626' }}>
          <div className="stat-icon" style={{ background: 'rgba(220, 38, 38, 0.12)', color: '#dc2626' }}>
            <AlertTriangle size={22} />
          </div>
          <div className="stat-label">Estoque Crítico / Pedido</div>
          <div className="stat-value">{totalItensCriticos} Itens</div>
          <div className="stat-subtext" style={{ color: '#b91c1c', fontWeight: 600 }}>Sugestão de Compra Gerada</div>
        </div>
      </div>

      {/* Main Card with Subtabs */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          {/* Active Section Title Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {activeTab === 'entradas' && '1. 📥 Entradas & Transferências RMI do Almoxarifado'}
              {activeTab === 'estoque' && '2. 🏛️ Despensa Física (Estoque Armazenado na Prateleira)'}
              {activeTab === 'gramatura' && '3. 🧮 Calculadora de Gramatura Per Capita & Baixa Diária'}
              {activeTab === 'dietas' && '4. 🥗 Dietas Especiais & Restrições Clínicas (RDC 29)'}
              {activeTab === 'saidas' && '5. 🍳 Saídas p/ Refeições & Consumo da Cozinha Central'}
              {activeTab === 'cardapio' && '6. 📋 Cardápio Semanal (4.000 Refeições / Dia)'}
              {activeTab === 'pedidos' && '7. 🛒 Compras MROSC & Pedidos de Reposição Crítica'}
              {activeTab === 'comparador' && '8. 📊 Comparador de Preços & Cotação MROSC (Atacadão x Ceasa)'}
              {activeTab === 'perdas' && '9. ⚠️ Auditoria de Descarte & Perdas Sanitárias Anvisa'}
            </h3>
          </div>

          {/* Search and Category Filter */}
          {activeTab === 'estoque' && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Buscar alimento..." 
                style={{ height: '34px', fontSize: '0.8rem', width: '160px' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <select 
                className="form-select" 
                style={{ height: '34px', fontSize: '0.8rem', width: '150px' }}
                value={selectedCategoriaFilter}
                onChange={e => setSelectedCategoriaFilter(e.target.value)}
              >
                <option value="Todas">Todas Categorias</option>
                <option value="Grãos e Cereais">Grãos e Cereais</option>
                <option value="Carnes & Proteínas">Carnes & Proteínas</option>
                <option value="Laticínios">Laticínios</option>
                <option value="Hortifrúti & Verduras">Hortifrúti & Verduras</option>
                <option value="Óleos & Condimentos">Óleos & Condimentos</option>
                <option value="Insumos de Cozinha">Insumos de Cozinha</option>
              </select>

              <select 
                className="form-select" 
                style={{ height: '34px', fontSize: '0.8rem', width: '130px' }}
                value={filterStatusEstoque}
                onChange={e => setFilterStatusEstoque(e.target.value)}
              >
                <option value="Todos">Todos Status</option>
                <option value="Normal">Normal</option>
                <option value="Critico">Estoque Crítico</option>
              </select>

              <button className="btn btn-secondary" style={{ borderColor: '#10b981', color: '#047857', fontWeight: 700, height: '34px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', whitespace: 'nowrap' }} onClick={() => setShowSaidaModal(true)}>
                <ArrowDownRight size={16} /> - Baixa de Insumo em Prateleira
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: Estoque Atual de Alimentos na Despensa */}
        {activeTab === 'estoque' && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Gênero Alimentício</th>
                  <th>Categoria</th>
                  <th>Qtd Factual em Despensa 🏛️</th>
                  <th>Baixado p/ Cozinha 🍳</th>
                  <th>Estoque Mínimo</th>
                  <th>Lote & Validade FEFO</th>
                  <th>Origem do Recurso</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredEstoque.map(item => (
                  <tr key={item.id}>
                    <td><span className="badge badge-primary">{item.id}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.item}</td>
                    <td><span className="badge badge-info">{item.categoria}</span></td>
                    <td>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: item.qtdAtual <= item.qtdMinima ? '#dc2626' : '#047857' }}>
                        {item.qtdAtual.toLocaleString('pt-BR')} {item.unidade}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#15803d', fontWeight: 700 }}>🏛️ Na Prateleira</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, fontSize: '0.825rem', color: '#1d4ed8' }}>
                        {getQtdSaidaCalculada(item.item)}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 700 }}>🍳 Entregue à Cozinha</div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.qtdMinima} {item.unidade}</td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.775rem' }}>{item.lote}</div>
                      <div style={{ fontSize: '0.725rem', color: item.status.includes('Validade') ? '#d97706' : 'var(--text-muted)' }}>
                        Venc: {item.validade.split('-').reverse().join('/')}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{item.origem}</td>
                    <td>
                      {(() => {
                        let statusText = 'Normal';
                        let badgeClass = 'badge-success';

                        if (item.qtdAtual <= item.qtdMinima) {
                          statusText = 'Estoque Crítico';
                          badgeClass = 'badge-danger';
                        } else if (item.validade) {
                          const valDate = new Date(item.validade);
                          const now = new Date();
                          const diffDays = Math.ceil((valDate - now) / (1000 * 60 * 60 * 24));
                          if (diffDays <= 30 && diffDays >= 0) {
                            statusText = 'Atenção (Validade Próxima)';
                            badgeClass = 'badge-warning';
                          }
                        }

                        return (
                          <span className={`badge ${badgeClass}`} style={{ fontWeight: 800 }}>
                            {statusText}
                          </span>
                        );
                      })()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button 
                          className="btn btn-sm btn-secondary" 
                          onClick={() => {
                            setNewSaida({ ...newSaida, item: item.item });
                            setShowSaidaModal(true);
                          }}
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#047857', borderColor: '#a7f3d0' }}
                          title="Dar Saída para Cozinha Central"
                        >
                          - Saída
                        </button>
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setSelectedItemEtiqueta(item);
                            setShowEtiquetaModal(true);
                          }}
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#d97706', borderColor: '#fcd34d' }}
                          title="Imprimir Etiqueta de Lote MROSC"
                        >
                          🏷️ Etiqueta
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 1: Histórico de Entradas vindo do Almoxarifado */}
        {activeTab === 'entradas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#f0f9ff', border: '1.5px solid #0284c7', padding: '0.85rem 1.15rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ margin: 0, color: '#0369a1', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ArrowUpRight size={20} />
                  📥 Entrada de Alimentos & Transferências do Almoxarifado Central (RMI)
                </h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#0284c7' }}>
                  Lançamento de gêneros alimentícios transferidos do Módulo 5 (Almoxarifado Central), Compras NFe e Doações.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Filtrar por alimento, NFe..." 
                  style={{ height: '34px', fontSize: '0.8rem', width: '180px' }}
                  value={searchEntradas}
                  onChange={e => setSearchEntradas(e.target.value)}
                />
                <select 
                  className="form-select" 
                  style={{ height: '34px', fontSize: '0.8rem', width: '150px' }}
                  value={filterFornecedorEntradas}
                  onChange={e => setFilterFornecedorEntradas(e.target.value)}
                >
                  <option value="Todos">Todos Fornecedores</option>
                  <option value="Atacadão">Atacadão S.A.</option>
                  <option value="Ceasa">Ceasa Salvador</option>
                  <option value="Horta">Horta Orgânica FDJ</option>
                </select>

                <button 
                  className="btn btn-primary" 
                  style={{ background: '#0284c7', borderColor: '#0284c7', fontWeight: 700 }} 
                  onClick={() => {
                    const latest = getLatestRmis();
                    setRmisDisponiveis(latest);
                    if (latest && latest.length > 0) {
                      const top = latest[0];
                      setNewEntrada({
                        fornecedor: top.fornecedor || 'Almoxarifado Central',
                        nfe: top.nfe || top.id,
                        item: top.item,
                        quantidade: String(top.quantidade),
                        unidade: top.unidade || 'kg',
                        valorTotal: String(top.valorTotal),
                        lote: top.lote || 'LT-2026-RMI',
                        validade: top.validade || '2027-01-15',
                        origem: top.origem || 'Transferência Interna RMI'
                      });
                    }
                    setShowEntradaModal(true);
                  }}
                >
                  <ArrowUpRight size={16} /> 📥 Receber Transferência do Almoxarifado (RMI)
                </button>
              </div>
            </div>

            <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Fornecedor / Doador</th>
                  <th>NFe / Origem</th>
                  <th>Alimento Recebido</th>
                  <th>Quantidade</th>
                  <th>Valor Total (R$)</th>
                  <th>Lote & Vencimento</th>
                  <th>Termo MROSC Vinculado</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntradas.map(ent => (
                  <tr key={ent.id}>
                    <td style={{ fontWeight: 600, color: '#2563eb' }}>{ent.data.split('-').reverse().join('/')}</td>
                    <td style={{ fontWeight: 700 }}>{ent.fornecedor}</td>
                    <td><span className="badge badge-primary">{ent.nfe}</span></td>
                    <td style={{ fontWeight: 600 }}>{ent.item}</td>
                    <td style={{ fontWeight: 700, color: '#047857' }}>{ent.quantidade} {ent.unidade}</td>
                    <td style={{ fontWeight: 700 }}>R$ {ent.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td style={{ fontSize: '0.775rem' }}>
                      <div>Lote: {ent.lote}</div>
                      <div style={{ color: 'var(--text-muted)' }}>Venc: {ent.validade.split('-').reverse().join('/')}</div>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{ent.origem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

        {/* TAB 5: Saídas Diárias para Cozinha Central */}
        {activeTab === 'saidas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#eff6ff', border: '1.5px solid #60a5fa', padding: '0.85rem 1.15rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ margin: 0, color: '#1e40af', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UtensilsCrossed size={20} />
                  🍳 Registro de Gêneros Alimentícios Baixados para a Cozinha Central
                </h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#1e3a8a' }}>
                  Lista de insumos alimentícios retirados da Despensa e entregues à equipe de cozinheiros para o preparo das 4.000 refeições diárias dos 1.240 acolhidos.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Filtrar item, refeição..." 
                  style={{ height: '34px', fontSize: '0.8rem', width: '180px' }}
                  value={searchSaidas}
                  onChange={e => setSearchSaidas(e.target.value)}
                />
                <select 
                  className="form-select" 
                  style={{ height: '34px', fontSize: '0.8rem', width: '150px' }}
                  value={filterRefeicaoSaidas}
                  onChange={e => setFilterRefeicaoSaidas(e.target.value)}
                >
                  <option value="Todas">Todas Refeições</option>
                  <option value="Almoço">Almoço Comunitário</option>
                  <option value="Jantar">Jantar & Sopa</option>
                </select>

                <button className="btn btn-primary" style={{ background: '#2563eb', borderColor: '#2563eb', fontWeight: 700 }} onClick={() => setShowSaidaModal(true)}>
                  <ArrowDownRight size={16} /> 🍳 Nova Baixa / Vale de Saída p/ Cozinha
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Data & Hora</th>
                    <th>Refeição / Destino</th>
                    <th>Itens Alimentícios Baixados</th>
                    <th>Quantidade Requisitada</th>
                    <th>Responsável pela Retirada</th>
                    <th>Observação Técnica</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSaidas.map(sai => (
                    <tr key={sai.id}>
                      <td style={{ fontWeight: 600, color: '#2563eb' }}>{sai.data}</td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{sai.refeicao}</td>
                      <td style={{ fontWeight: 600 }}>{sai.item}</td>
                      <td><span className="badge badge-warning" style={{ fontSize: '0.75rem', fontWeight: 700 }}>{sai.quantidade}</span></td>
                      <td style={{ fontWeight: 600, fontSize: '0.8rem' }}>{sai.requisitante}</td>
                      <td style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{sai.observacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Calculadora de Gramatura Per Capita & Edição de Padrões */}
        {activeTab === 'gramatura' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ margin: 0, color: '#166534', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calculator size={20} />
                  Calculadora de Gramatura Per Capita & Edição de Ficha Técnica
                </h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#15803d' }}>
                  Ajuste a gramatura (g/pessoa) de cada ingrediente diretamente nesta tabela ou adicione novos gêneros.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534' }}>Nº de Acolhidos Hoje:</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    style={{ width: '100px', height: '36px', fontWeight: 800, textAlign: 'center' }}
                    value={qtdAcolhidosCalc}
                    onChange={e => setQtdAcolhidosCalc(parseInt(e.target.value) || 0)}
                  />
                </div>

                <button 
                  className="btn btn-sm btn-primary" 
                  style={{ background: '#166534', borderColor: '#166534', fontWeight: 700, height: '36px' }}
                  onClick={() => setShowAddGramaturaModal(true)}
                >
                  + Adicionar Ingrediente / Gramatura
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ingrediente / Gênero</th>
                    <th>Gramatura Per Capita Recomendada</th>
                    <th>Quantidade Total Requisitada (kg)</th>
                    <th>Estoque Disponível</th>
                    <th>Status de Abastecimento</th>
                    <th>Ações (Edição & Baixa)</th>
                  </tr>
                </thead>
                <tbody>
                  {gramaturas.map((g) => {
                    const totalKgNecessario = (g.gramasPorPessoa * qtdAcolhidosCalc) / 1000;
                    const itemEst = estoqueAlimentos.find(i => i.item === g.itemEstoque);
                    const estoqueQtd = itemEst ? itemEst.qtdAtual : 0;
                    const sufic = estoqueQtd >= totalKgNecessario;
                    const isEditing = editingGramaturaId === g.id;

                    return (
                      <tr key={g.id}>
                        <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{g.ingrediente}</td>
                        <td>
                          {isEditing ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <input 
                                type="number" 
                                className="form-input"
                                style={{ width: '80px', height: '30px', fontWeight: 800, textAlign: 'center' }}
                                value={tempGramasVal}
                                onChange={e => setTempGramasVal(parseFloat(e.target.value) || 0)}
                              />
                              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>g / pessoa</span>
                              <button 
                                className="btn btn-sm btn-success" 
                                style={{ padding: '0.15rem 0.4rem', fontSize: '0.7rem', fontWeight: 700 }}
                                onClick={() => {
                                  setGramaturas(gramaturas.map(item => item.id === g.id ? { ...item, gramasPorPessoa: tempGramasVal } : item));
                                  setEditingGramaturaId(null);
                                }}
                              >
                                ✓ Salvar
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontWeight: 700, color: '#166534' }}>{g.gramasPorPessoa}g / acolhido</span>
                              <button 
                                className="btn btn-sm btn-secondary" 
                                style={{ fontSize: '0.68rem', padding: '0.15rem 0.35rem', color: '#2563eb', borderColor: '#93c5fd' }}
                                onClick={() => {
                                  setEditingGramaturaId(g.id);
                                  setTempGramasVal(g.gramasPorPessoa);
                                }}
                                title="Editar Gramatura Per Capita"
                              >
                                ✏️ Editar
                              </button>
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="badge badge-primary" style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                            {totalKgNecessario.toFixed(1)} kg
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, color: sufic ? '#047857' : '#dc2626' }}>
                          {estoqueQtd} kg
                        </td>
                        <td>
                          <span className={`badge ${sufic ? 'badge-success' : 'badge-danger'}`}>
                            {sufic ? '✓ Estoque Suficiente' : '⚠️ Insuficiente'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setNewSaida({
                                  refeicao: refeicaoCalc,
                                  item: g.itemEstoque,
                                  quantidade: `${totalKgNecessario.toFixed(1)} kg`,
                                  requisitante: 'Chefe Valdeci (Cozinha Central)',
                                  observacao: `Baixa calculada per capita (${g.gramasPorPessoa}g/pessoa) para ${qtdAcolhidosCalc} acolhidos`
                                });
                                setShowSaidaModal(true);
                              }}
                              style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#047857', borderColor: '#a7f3d0' }}
                              title="Baixar em estoque"
                            >
                              - Baixar {totalKgNecessario.toFixed(1)} kg
                            </button>

                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setEditingGramatura(g);
                                setShowEditGramaturaModal(true);
                              }}
                              style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#2563eb', borderColor: '#93c5fd' }}
                              title="Editar ingrediente e gramatura"
                            >
                              ✏️ Editar
                            </button>

                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                if (window.confirm(`Tem certeza que deseja excluir '${g.ingrediente}' da ficha técnica?`)) {
                                  setGramaturas(gramaturas.filter(item => item.id !== g.id));
                                }
                              }}
                              style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#dc2626', borderColor: '#fca5a5' }}
                              title="Excluir este ingrediente"
                            >
                              🗑️ Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Dietas Especiais & Restrições Alimentares */}
        {activeTab === 'dietas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#eff6ff', border: '1px solid #93c5fd', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h4 style={{ margin: 0, color: '#1e40af', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <HeartPulse size={18} />
                  Controle de Dietas Especiais & Restrições Alimentares dos Acolhidos
                </h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#1d4ed8' }}>
                  Sincronizado com o Prontuário Médico (Módulo 5) para instrução diária de preparo da Cozinha Central.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Filtrar por acolhido ou dieta..." 
                  style={{ height: '34px', fontSize: '0.8rem', width: '200px' }}
                  value={searchDietas}
                  onChange={e => setSearchDietas(e.target.value)}
                />
                <select 
                  className="form-select" 
                  style={{ height: '34px', fontSize: '0.8rem', width: '150px' }}
                  value={filterRestricaoDietas}
                  onChange={e => setFilterRestricaoDietas(e.target.value)}
                >
                  <option value="Todas">Todas Restrições</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="Hipertensão">Hipertensão</option>
                  <option value="Lactose">Intolerância Lactose</option>
                </select>

                <button 
                  className="btn btn-primary" 
                  style={{ background: '#1e40af', borderColor: '#1e40af', fontWeight: 700, height: '34px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', whitespace: 'nowrap' }} 
                  onClick={() => setShowNewDietaModal(true)}
                >
                  <HeartPulse size={16} /> + Cadastrar Dieta p/ Acolhido
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Acolhido em Tratamento</th>
                    <th>Restrição Diagnosticada</th>
                    <th>Dieta Recomendada pela Nutrição</th>
                    <th>Instruções para a Cozinha</th>
                    <th>Observações de Enfermagem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDietas.map(d => (
                    <tr key={d.id}>
                      <td><span className="badge badge-primary">{d.id}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{d.acolhido}</td>
                      <td><span className="badge badge-warning" style={{ fontWeight: 700 }}>{d.restricao}</span></td>
                      <td style={{ fontSize: '0.8rem', fontWeight: 600, color: '#047857' }}>{d.dietaRecomendada}</td>
                      <td style={{ fontSize: '0.8rem' }}>{d.refeicaoEspecial}</td>
                      <td style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{d.observacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: Comparador de Preços (Cotações com Fornecedores Cadastrados) */}
        {activeTab === 'comparador' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#fffbe3', border: '1px solid #fef08a', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h4 style={{ margin: 0, color: '#713f12', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <DollarSign size={18} />
                  Comparador Dinâmico de Preços MROSC (Sincronizado com Fornecedores Cadastrados)
                </h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#854d0e' }}>
                  Compare 2 ou mais empresas fornecedoras homologadas no Módulo de Cadastros Administrativos para garantir o menor preço e economia nas compras.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Filtrar cotação de preço..." 
                  style={{ height: '34px', fontSize: '0.8rem', width: '200px' }}
                  value={searchComparador}
                  onChange={e => setSearchComparador(e.target.value)}
                />
                <button 
                  className="btn btn-warning"
                  style={{ height: '34px', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#713f12' }}
                  onClick={() => {
                    const defaultCompany1 = fornecedores[0]?.razaoSocial || 'Atacadão S.A.';
                    const defaultCompany2 = fornecedores[4]?.razaoSocial || 'Distribuidora Ceasa Salvador Ltda';
                    setNewComparador({
                      item: estoqueAlimentos[0]?.item || 'Arroz Tipo 1 5kg',
                      cotacoes: [
                        { empresa: defaultCompany1, preco: '' },
                        { empresa: defaultCompany2, preco: '' }
                      ]
                    });
                    setShowAddComparadorModal(true);
                  }}
                >
                  + Nova Cotação / Comparar Empresas
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item Alimentício</th>
                    <th>Empresas & Preços Cotados</th>
                    <th>Menor Preço Encontrado</th>
                    <th>Economia Estimada (%)</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComparador.map((cp) => {
                    const list = getCotacoesList(cp);
                    const best = calculateBestSupplierDynamic(list);
                    return (
                      <tr key={cp.id || cp.item}>
                        <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{cp.item}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {list.map((c, i) => (
                              <span 
                                key={i} 
                                className="badge" 
                                style={{ 
                                  background: c.empresa === best.menorPreco ? '#dcfce7' : '#f1f5f9', 
                                  color: c.empresa === best.menorPreco ? '#15803d' : '#475569',
                                  border: c.empresa === best.menorPreco ? '1px solid #86efac' : '1px solid #cbd5e1',
                                  fontSize: '0.75rem',
                                  fontWeight: 700
                                }}
                              >
                                {c.empresa}: <strong>R$ {(parseFloat(c.preco) || 0).toFixed(2)}</strong>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-success" style={{ fontWeight: 800 }}>
                            ✓ {best.menorPreco} {best.menorValor > 0 ? `(R$ ${best.menorValor.toFixed(2)})` : ''}
                          </span>
                        </td>
                        <td style={{ fontWeight: 800, color: '#047857' }}>{best.economiaPercentual} de economia</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setEditingComparador({
                                  ...cp,
                                  cotacoes: list.length > 0 ? list : [
                                    { empresa: fornecedores[0]?.razaoSocial || 'Atacadão S.A.', preco: '28.90' },
                                    { empresa: fornecedores[4]?.razaoSocial || 'Distribuidora Ceasa Salvador Ltda', preco: '31.50' }
                                  ]
                                });
                                setShowEditComparadorModal(true);
                              }}
                              style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#2563eb', borderColor: '#93c5fd' }}
                              title="Editar cotação de empresas"
                            >
                              ✏️ Editar
                            </button>

                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                if (window.confirm(`Deseja excluir a cotação de '${cp.item}'?`)) {
                                  setComparadorPrecos(comparadorPrecos.filter(c => (c.id || c.item) !== (cp.id || cp.item)));
                                }
                              }}
                              style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', color: '#dc2626', borderColor: '#fca5a5' }}
                              title="Excluir cotação de preço"
                            >
                              🗑️ Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: Sugestão Automática de Pedido de Compras MROSC */}
        {activeTab === 'pedidos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h4 style={{ margin: 0, color: '#991b1b', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShoppingCart size={18} />
                  Sugestão Automática de Reposição & Cotação MROSC (Estoque Crítico)
                </h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#b91c1c' }}>
                  Itens cujo saldo atual atingiu o limite mínimo configurado. Pronto para encaminhamento à equipe de Cotações (Módulo 1).
                </p>
              </div>

              <input 
                type="text" 
                className="form-input" 
                placeholder="Filtrar pedidos em falta..." 
                style={{ height: '34px', fontSize: '0.8rem', width: '200px' }}
                value={searchPedidos}
                onChange={e => setSearchPedidos(e.target.value)}
              />
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item Alimentício</th>
                    <th>Qtd Atual</th>
                    <th>Ponto de Pedido (Mínimo)</th>
                    <th>Sugestão de Compra (Qtd)</th>
                    <th>Estimativa de Custo (R$)</th>
                    <th>Rubrica MROSC Vinculada</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPedidos.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        ✅ Nenhum item abaixo do estoque mínimo correspondente à busca!
                      </td>
                    </tr>
                  ) : (
                    filteredPedidos.map(i => (
                      <tr key={i.id}>
                        <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{i.item}</td>
                        <td style={{ fontWeight: 800, color: '#dc2626' }}>{i.qtdAtual} {i.unidade}</td>
                        <td>{i.qtdMinima} {i.unidade}</td>
                        <td><span className="badge badge-warning" style={{ fontWeight: 800 }}>+{i.qtdMinima * 3} {i.unidade}</span></td>
                        <td style={{ fontWeight: 700, color: '#047857' }}>R$ {(i.qtdMinima * 3 * i.valorUnitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Rubrica 2.2.01 Alimentação & Cozinha</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 9: Descarte & Perdas Sanitárias */}
        {activeTab === 'perdas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Dashboard Cards para Mensuração de Perdas */}
            <div className="grid-3">
              <div className="card" style={{ borderLeft: '4px solid #dc2626', padding: '0.85rem 1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total de Descartes Registrados</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
                  {perdas.length} Ocorrência(s)
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Auditado com Laudo Sanitário
                </div>
              </div>

              <div className="card" style={{ borderLeft: '4px solid #f59e0b', padding: '0.85rem 1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Causa Principal Registrada</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#b45309', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {perdas.length > 0 ? perdas[0].motivo : 'Nenhuma'}
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Padronizado no Cadastro
                </div>
              </div>

              <div className="card" style={{ borderLeft: '4px solid #10b981', padding: '0.85rem 1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Conformidade de Auditoria RDC 29</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#047857', marginTop: '4px' }}>
                  100% Homologado
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Mensurável no Dashboard SJDH-BA
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', background: '#fef2f2', padding: '0.85rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', color: '#991b1b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldAlert size={18} /> Auditoria de Descarte & Perdas Sanitárias (Cadastro Padronizado)
                </h4>
                <p style={{ margin: '3px 0 0 0', fontSize: '0.775rem', color: '#991b1b' }}>
                  Mensuração detalhada por motivo técnico para controle de perdas e relatórios de prestação de contas.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  className="form-select"
                  style={{ height: '34px', fontSize: '0.8rem', width: '210px' }}
                  value={filterMotivoPerda}
                  onChange={e => setFilterMotivoPerda(e.target.value)}
                >
                  <option value="Todos">Todos os Motivos</option>
                  {motivosDescarte.map((m, idx) => (
                    <option key={idx} value={m}>{m}</option>
                  ))}
                </select>

                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Buscar alimento ou laudo..." 
                  style={{ height: '34px', fontSize: '0.8rem', width: '180px' }}
                  value={searchPerdas}
                  onChange={e => setSearchPerdas(e.target.value)}
                />
                
                <button 
                  className="btn btn-sm btn-secondary" 
                  style={{ height: '34px', fontSize: '0.775rem', fontWeight: 700, color: '#dc2626', borderColor: '#fca5a5' }}
                  onClick={() => setShowNovoMotivoModal(true)}
                >
                  + Motivo Técnico
                </button>

                <button className="btn btn-danger btn-sm" style={{ height: '34px', fontWeight: 800 }} onClick={() => setShowPerdaModal(true)}>
                  + Registrar Descarte
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código / Data</th>
                    <th>Alimento Descartado</th>
                    <th>Quantidade</th>
                    <th>Motivo Técnico Padronizado</th>
                    <th>Laudo Sanitário / Ordem</th>
                    <th>Responsável</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPerdas.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#dc2626' }}>{p.id}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{p.data.split('-').reverse().join('/')}</div>
                      </td>
                      <td style={{ fontWeight: 700 }}>{p.item}</td>
                      <td><span className="badge badge-danger" style={{ fontWeight: 700 }}>{p.quantidade}</span></td>
                      <td>
                        <span className="badge" style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', fontWeight: 700, fontSize: '0.75rem' }}>
                          {p.motivo}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.775rem', color: 'var(--primary)', fontWeight: 600 }}>{p.laudoSanitario}</td>
                      <td style={{ fontSize: '0.775rem' }}>{p.responsavel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 9: Cardápio Semanal */}
        {activeTab === 'cardapio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h4 style={{ margin: 0, color: '#166534', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Apple size={18} />
                  Programação Semanal de Refeições Nutritivas (4.000 Refeições/Dia)
                </h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#15803d' }}>
                  Elaborado em consonância com as exigências nutricionais do MROSC SJDH-BA para acolhidos em tratamento de dependência química.
                </p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                <Printer size={14} /> Imprimir Cardápio Semanal
              </button>
            </div>

            <div className="grid-3">
              <div className="card" style={{ borderTop: '3px solid #2563eb' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#1e40af', fontWeight: 800 }}>☕ Café da Manhã (06:30)</h5>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-main)', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <li>Pão Francês artesanal com manteiga/margarina</li>
                  <li>Café com Leite Integral enriquecido com vitaminas</li>
                  <li>Fruta da estação (Banana / Mamão Ceasa)</li>
                  <li>Raízes cozidas (Aipim / Batata Doce) 2x por semana</li>
                </ul>
              </div>

              <div className="card" style={{ borderTop: '3px solid #10b981' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#166534', fontWeight: 800 }}>🍲 Almoço Comunitário (11:30)</h5>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-main)', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <li>Arroz Tipo 1 e Feijão Carioca temperado</li>
                  <li>Proteína: Alcatra acebolada ou Frango ensopado com batatas</li>
                  <li>Salada crua (Alface, Tomate, Cenoura ralada)</li>
                  <li>Suco natural de frutas tropicais</li>
                </ul>
              </div>

              <div className="card" style={{ borderTop: '3px solid #d97706' }}>
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#b45309', fontWeight: 800 }}>🥣 Lanche & Jantar (17:30 / 20:00)</h5>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-main)', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <li>Sopa nutritiva de legumes com legumes e carne desfiada</li>
                  <li>Mingau de aveia / Munguzá cremoso</li>
                  <li>Chá de capim-santo / ervas medicinais comunitárias</li>
                  <li>Biscoitos doces/salgados sortidos</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal 1: Receber Transferência do Almoxarifado (RMI) */}
      {showEntradaModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #0284c7', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                <ArrowUpRight size={20} style={{ color: '#0284c7' }} />
                Receber Transferência do Almoxarifado Central (RMI)
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowEntradaModal(false)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', color: '#0369a1', marginBottom: '1rem' }}>
              🔒 <strong>Regra de Integridade MROSC:</strong> Os dados da Ordem RMI (Item, Quantidade, Código e Origem) são <u>100% autênticos e travados a partir do Almoxarifado Central (Módulo 5)</u> para impedir furos ou edições manuais na cozinha.
            </div>

            <form onSubmit={handleCreateEntrada} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 800, color: '#0369a1' }}>
                  Ordem de Transferência / RMI Selecionada no Almoxarifado *
                </label>
                <select 
                  className="form-select"
                  style={{ fontWeight: 700, borderColor: '#0284c7', background: '#f0f9ff' }}
                  value={newEntrada.nfe || ''} 
                  disabled={rmisDisponiveis.filter(r => r.status === 'Pendente').length === 0}
                  onChange={e => {
                    const selectedCode = e.target.value;
                    const foundRmi = rmisDisponiveis.find(r => r.nfe === selectedCode);
                    if (foundRmi) {
                      setNewEntrada({
                        ...newEntrada,
                        nfe: foundRmi.nfe,
                        item: foundRmi.item,
                        quantidade: foundRmi.quantidade,
                        unidade: foundRmi.unidade,
                        valorTotal: foundRmi.valorTotal,
                        fornecedor: foundRmi.fornecedor,
                        validade: foundRmi.validade,
                        lote: foundRmi.lote,
                        origem: foundRmi.origem
                      });
                    }
                  }}
                >
                  {rmisDisponiveis.filter(r => r.status === 'Pendente').length === 0 ? (
                    <option value="">✅ Todas as RMIs liberadas pelo Almoxarifado já foram integradas à Despensa!</option>
                  ) : (
                    rmisDisponiveis.filter(r => r.status === 'Pendente').map(rmi => (
                      <option key={rmi.id} value={rmi.nfe}>
                        {rmi.label}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Origem do Material / Almoxarifado 🔒
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    readOnly
                    style={{ background: '#e2e8f0', fontWeight: 700, color: '#334155', cursor: 'not-allowed' }}
                    value={newEntrada.fornecedor || 'Almoxarifado Galpão B (Padaria)'} 
                  />
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>🔒 Bloqueado (Vindo do Almoxarifado)</div>
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Cód. RMI / Termo de Origem 🔒
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    readOnly
                    style={{ background: '#e2e8f0', fontWeight: 800, color: '#1e3a8a', cursor: 'not-allowed' }}
                    value={newEntrada.nfe || 'RMI-2026-093'} 
                  />
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>🔒 Código Autêntico do Almoxarifado</div>
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Gênero Alimentício / Item Homologado 🔒
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  readOnly
                  style={{ background: '#e2e8f0', fontWeight: 800, color: '#0f172a', cursor: 'not-allowed' }}
                  value={newEntrada.item || 'Farinha de Trigo Especial Padaria'} 
                />
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>🔒 Nome Travado do Catálogo do Almoxarifado</div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Quantidade da RMI 🔒
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    readOnly
                    style={{ background: '#e2e8f0', fontWeight: 900, color: '#059669', fontSize: '1.05rem', cursor: 'not-allowed' }}
                    value={newEntrada.quantidade || '53'} 
                  />
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>🔒 Quantidade Baixada do Galpão</div>
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Unidade de Medida 🔒
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    readOnly
                    style={{ background: '#e2e8f0', fontWeight: 700, color: '#334155', cursor: 'not-allowed' }}
                    value={newEntrada.unidade === 'kg' ? 'Quilogramas (kg)' : newEntrada.unidade || 'Quilogramas (kg)'} 
                  />
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>🔒 Unidade Padrão do Almoxarifado</div>
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Valor Total Patrimonial / NFe (R$) 🔒
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    readOnly
                    style={{ background: '#e2e8f0', fontWeight: 800, color: '#1e3a8a', cursor: 'not-allowed' }}
                    value={`R$ ${parseFloat(newEntrada.valorTotal || 238.50).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                  />
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>🔒 Calculado pelo Custo Unitário NFe do Almoxarifado</div>
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Data de Validade (FEFO) 🔒
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    readOnly
                    style={{ background: '#e2e8f0', fontWeight: 800, color: '#991b1b', cursor: 'not-allowed' }}
                    value={newEntrada.validade ? newEntrada.validade.split('-').reverse().join('/') : '15/01/2027'} 
                  />
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>🔒 Regra Sanitária FEFO Importada do Almoxarifado</div>
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Lote do Fabricante / Almoxarifado 🔒
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    readOnly
                    style={{ background: '#e2e8f0', fontWeight: 700, color: '#334155', cursor: 'not-allowed' }}
                    value={newEntrada.lote || 'LT-FT-2026-093'} 
                  />
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>🔒 Lote Fiscal Auditado</div>
                </div>
                <div>
                  <label className="form-label">Origem do Recurso / Convênio 🔒</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    readOnly
                    style={{ background: '#e2e8f0', fontWeight: 600, color: '#334155', cursor: 'not-allowed' }}
                    value={newEntrada.origem || 'Termo de Fomento nº 005/2022 (SJDH-BA)'} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEntradaModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#0284c7', borderColor: '#0284c7', fontWeight: 800 }}>
                  <CheckCircle2 size={16} /> Confirmar Recebimento RMI & Integrar à Despensa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Registrar Saída de Alimentos para Cozinha */}
      {showSaidaModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '2px solid #047857', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                <ArrowDownRight size={20} style={{ color: '#047857' }} />
                Registrar Saída para Cozinha Central (Consumo Refeições)
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowSaidaModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSaida} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>Item / Alimento a Retirar da Despensa *</label>
                <select 
                  className="form-select"
                  style={{ fontWeight: 600 }}
                  required 
                  value={newSaida.item} 
                  onChange={e => setNewSaida({ ...newSaida, item: e.target.value })} 
                >
                  <option value="">-- Selecione o Insumo Cadastrado em Despensa --</option>
                  {estoqueAlimentos.map(i => (
                    <option key={i.id} value={i.item}>
                      {i.item} — SALDO ATUAL: {i.qtdAtual} {i.unidade} (Lote: {i.lote})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Refeição / Destino *</label>
                  <select 
                    className="form-select" 
                    value={newSaida.refeicao} 
                    onChange={e => setNewSaida({ ...newSaida, refeicao: e.target.value })}
                  >
                    <option value="Café da Manhã (1.240 Acolhidos)">Café da Manhã (1.240 Acolhidos)</option>
                    <option value="Almoço Comunitário (1.240 Acolhidos)">Almoço Comunitário (1.240 Acolhidos)</option>
                    <option value="Lanche da Tarde">Lanche da Tarde</option>
                    <option value="Jantar & Sopa Nutritiva">Jantar & Sopa Nutritiva</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Quantidade & Unidade a Baixar *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.4rem' }}>
                    <input 
                      type="number"
                      step="any" 
                      className="form-input" 
                      required 
                      placeholder="Ex: 50" 
                      value={newSaida.quantidadeVal || ''} 
                      onChange={e => {
                        const val = e.target.value;
                        const unit = newSaida.unidade || 'kg';
                        setNewSaida({ ...newSaida, quantidadeVal: val, quantidade: `${val} ${unit}` });
                      }} 
                    />
                    <select 
                      className="form-select"
                      value={newSaida.unidade || 'kg'}
                      onChange={e => {
                        const unit = e.target.value;
                        const val = newSaida.quantidadeVal || '';
                        setNewSaida({ ...newSaida, unidade: unit, quantidade: `${val} ${unit}` });
                      }}
                    >
                      <option value="kg">kg</option>
                      <option value="fardos">fardos</option>
                      <option value="caixas">caixas</option>
                      <option value="pacotes">pacotes</option>
                      <option value="t">toneladas</option>
                      <option value="un">unidades</option>
                      <option value="litros">litros</option>
                      <option value="g">gramas</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>Requisitante / Responsável da Cozinha (Cadastrado) *</label>
                <select 
                  className="form-select" 
                  required 
                  value={newSaida.requisitante} 
                  onChange={e => setNewSaida({ ...newSaida, requisitante: e.target.value })} 
                >
                  <option value="">-- Selecione o Servidor / Responsável Cadastrado --</option>
                  <option value="Chefe Valdeci (Cozinha Central)">Chefe Valdeci (Cozinha Central)</option>
                  <option value="Nutricionista Chefe - Dra. Luciana Ribeiro (CRN-5 #9401)">Nutricionista Chefe - Dra. Luciana Ribeiro (CRN-5 #9401)</option>
                  <option value="Nutricionista Dra. Mariana Santos (CRN-5 #10293)">Nutricionista Dra. Mariana Santos (CRN-5 #10293)</option>
                  <option value="Chef de Cozinha Industrial - Irmão Roberto Silva">Chef de Cozinha Industrial - Irmão Roberto Silva</option>
                  <option value="Coordenador de Almoxarifado - Carlos Eduardo Santos">Coordenador de Almoxarifado - Carlos Eduardo Santos</option>
                  <option value="Mestre Padeiro - João Batista de Jesus">Mestre Padeiro - João Batista de Jesus</option>
                  <option value="Supervisora de Higiene - Maria das Graças">Supervisora de Higiene - Maria das Graças</option>
                </select>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  🔒 Servidor autorizatório homologado no módulo de Cadastros Administrativos (2.5)
                </div>
              </div>

              <div>
                <label className="form-label">Observações Técnicas</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Utilizado lote com validade FEFO mais próxima" 
                  value={newSaida.observacao} 
                  onChange={e => setNewSaida({ ...newSaida, observacao: e.target.value })} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSaidaModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#047857', borderColor: '#047857', fontWeight: 800 }}>- Confirmar Baixa em Despensa</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Registrar Ocorrência de Descarte / Perda */}
      {showPerdaModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={20} style={{ color: '#dc2626' }} />
                Registrar Ocorrência de Descarte Sanitário
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowPerdaModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePerda} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Alimento Descartado (Cadastro Prévio de Estoque) *</label>
                <select 
                  className="form-select" 
                  required 
                  value={newPerda.item} 
                  onChange={e => setNewPerda({ ...newPerda, item: e.target.value })}
                >
                  {estoqueAlimentos.map(item => (
                    <option key={item.id} value={item.item}>
                      {item.item} ({item.qtdAtual} {item.unidade} em estoque • Lote: {item.lote})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid-2">
                <div>
                  <label className="form-label">Quantidade Descartada *</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input 
                      type="number" 
                      className="form-input" 
                      required 
                      placeholder="Ex: 10" 
                      style={{ flex: 1 }}
                      value={newPerda.quantidadeVal} 
                      onChange={e => setNewPerda({ ...newPerda, quantidadeVal: e.target.value })} 
                    />
                    <select 
                      className="form-select" 
                      style={{ width: '110px' }}
                      value={newPerda.unidade} 
                      onChange={e => setNewPerda({ ...newPerda, unidade: e.target.value })}
                    >
                      <option value="kg">kg</option>
                      <option value="ton">ton</option>
                      <option value="pcts">pcts</option>
                      <option value="unidades">unidades</option>
                      <option value="fardos">fardos</option>
                      <option value="botijões">botijões</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Laudo Nutricional / Ordem</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newPerda.laudoSanitario} 
                    onChange={e => setNewPerda({ ...newPerda, laudoSanitario: e.target.value })} 
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>Motivo Técnico do Descarte (Cadastro Padronizado MROSC) *</label>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-secondary"
                    style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', borderColor: '#93c5fd', padding: '0.15rem 0.4rem' }}
                    onClick={() => setShowNovoMotivoModal(true)}
                  >
                    + Cadastrar Novo Motivo
                  </button>
                </div>

                <select 
                  className="form-select" 
                  required 
                  value={newPerda.motivo} 
                  onChange={e => {
                    if (e.target.value === '__NEW_MOTIVO__') {
                      setShowNovoMotivoModal(true);
                    } else {
                      setNewPerda({ ...newPerda, motivo: e.target.value });
                    }
                  }}
                >
                  <option value="">-- Selecione o Motivo Técnico Homologado --</option>
                  {motivosDescarte.map((m, idx) => (
                    <option key={idx} value={m}>{m}</option>
                  ))}
                  <option value="__NEW_MOTIVO__" style={{ fontWeight: 800, color: '#2563eb' }}>
                    + Cadastrar Novo Motivo Técnico...
                  </option>
                </select>
              </div>

              <div>
                <label className="form-label">Responsável Técnico (Nutricionista / Fiscal Homologado) *</label>
                <select 
                  className="form-select" 
                  required 
                  value={newPerda.responsavel} 
                  onChange={e => setNewPerda({ ...newPerda, responsavel: e.target.value })}
                >
                  {profissionais && profissionais.length > 0 ? (
                    profissionais.map(p => (
                      <option key={p.id} value={`${p.nome} (${p.funcao || p.cargo || 'Responsável Técnico'})`}>
                        {p.nome} — {p.funcao || p.cargo || 'Profissional de Saúde / Fiscal'}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Nutricionista Dra. Mariana (CRN-BA 9102)">Nutricionista Dra. Mariana (CRN-BA 9102)</option>
                      <option value="Fiscal de Vigilância Sanitária - Dr. Arnaldo Silva">Fiscal de Vigilância Sanitária - Dr. Arnaldo Silva</option>
                      <option value="Enfermeira Chefe - Juliana Santos (COREN-BA 48192)">Enfermeira Chefe - Juliana Santos (COREN-BA 48192)</option>
                      <option value="Coordenador de Despensa - Irmão Valdeci">Coordenador de Despensa - Irmão Valdeci</option>
                    </>
                  )}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPerdaModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-danger">+ Salvar Descarte Sanitário</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 10: Cadastrar Novo Motivo Técnico de Descarte */}
      {showNovoMotivoModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#dc2626', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🛡️ Cadastrar Novo Motivo Técnico de Descarte
              </h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowNovoMotivoModal(false)}>✕</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!novoMotivoTexto.trim()) return;

              const trimmed = novoMotivoTexto.trim();
              if (!motivosDescarte.includes(trimmed)) {
                setMotivosDescarte([...motivosDescarte, trimmed]);
              }
              setNewPerda({ ...newPerda, motivo: trimmed });
              setNovoMotivoTexto('');
              setShowNovoMotivoModal(false);
            }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Descrição do Motivo Técnico *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Quebra de Lacres no Recebimento, Oxidação de Embalagem..."
                  required
                  value={novoMotivoTexto}
                  onChange={e => setNovoMotivoTexto(e.target.value)}
                />
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Este motivo ficará disponível nos seletores e nos relatórios de auditoria e dashboard.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNovoMotivoModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-danger" style={{ fontWeight: 800 }}>+ Salvar e Homologar Motivo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Gerador de Etiquetas de Lote & Vigilância Sanitária MROSC */}
      {showEtiquetaModal && selectedItemEtiqueta && (
        <div className="modal-overlay">
          {/* CSS @MEDIA PRINT FOR SANITARY LABEL PRINTING */}
          <style>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              .printable-etiqueta-card, .printable-etiqueta-card * {
                visibility: visible !important;
              }
              .printable-etiqueta-card {
                position: fixed !important;
                left: 50% !important;
                top: 50% !important;
                transform: translate(-50%, -50%) !important;
                width: 140mm !important;
                margin: 0 !important;
                padding: 10mm !important;
                background: #ffffff !important;
                color: #000000 !important;
                box-shadow: none !important;
                border: 3px dashed #000000 !important;
                border-radius: 8px !important;
                font-family: 'Arial', sans-serif !important;
                z-index: 999999 !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}</style>

          <div className="modal-content printable-etiqueta-card" style={{ maxWidth: '580px', background: '#fffbe3', border: '3px double #d97706', padding: '1.5rem' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-warning" style={{ fontSize: '0.8rem', fontWeight: 800 }}>ETIQUETA SANITÁRIA RDC 216 / AUDITORIA MROSC</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowEtiquetaModal(false)}>
                <X size={16} />
              </button>
            </div>

            {/* PRINTABLE CONTENT */}
            <div style={{ border: '2px dashed #b45309', padding: '1.25rem', borderRadius: '8px', background: '#ffffff', textAlign: 'center' }}>
              {/* INSTITUTIONAL LABEL HEADER */}
              <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '0.5rem', marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1e3a8a', textTransform: 'uppercase' }}>
                  FUNDAÇÃO DOUTOR JESUS • DESPENSA CENTRAL
                </div>
                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#475569', marginTop: '2px' }}>
                  CNPJ: 04.912.384/0001-92 • Rastreabilidade Sanitária (RDC 216 / ANVISA)
                </div>
              </div>

              {/* ITEM DETAILS TABLE */}
              <div style={{ textAlign: 'left', fontSize: '0.9rem', color: '#0f172a', display: 'flex', flexDirection: 'column', gap: '0.45rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div><strong>GÊNERO ALIMENTÍCIO:</strong> <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>{selectedItemEtiqueta.item}</span></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div><strong>LOTE FABRICANTE:</strong> <span style={{ fontWeight: 800, color: '#1e3a8a' }}>{selectedItemEtiqueta.lote}</span></div>
                  <div><strong>SALDO EM DESPENSA:</strong> <span style={{ fontWeight: 800, color: '#059669' }}>{selectedItemEtiqueta.qtdAtual} {selectedItemEtiqueta.unidade}</span></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div><strong>VALIDADE FEFO:</strong> <span style={{ fontWeight: 900, color: '#dc2626' }}>{selectedItemEtiqueta.validade.split('-').reverse().join('/')}</span></div>
                  <div><strong>ENTRADA NA DESPENSA:</strong> <span style={{ fontWeight: 700 }}>{new Date().toLocaleDateString('pt-BR')}</span></div>
                </div>
                <div><strong>ORIGEM DO RECURSO:</strong> <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{selectedItemEtiqueta.origem}</span></div>
              </div>

              {/* SIMULATED BARCODE */}
              <div style={{ marginTop: '0.85rem', fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '4px', color: '#0f172a' }}>
                ||||| |||| ||||||| |||| ||||||| |||||
              </div>
              <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#64748b' }}>
                COD-{selectedItemEtiqueta.id}-{selectedItemEtiqueta.lote}-FEFO
              </div>

              {/* WARNING SEAL */}
              <div style={{ marginTop: '0.85rem', padding: '0.5rem', background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '6px', color: '#78350f', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                PROIBIDA A VENDA • RECURSOS PÚBLICOS AUDITADOS (SJDH / TCE-BA)
              </div>
            </div>

            {/* SCREEN ACTION BUTTONS */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowEtiquetaModal(false)}>Fechar</button>
              <button className="btn btn-primary" onClick={() => window.print()} style={{ background: '#d97706', borderColor: '#d97706', fontWeight: 800 }}>
                <Printer size={16} /> Imprimir Etiqueta Sanitária (PDF / Térmica)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Adicionar Novo Ingrediente & Gramatura Per Capita */}
      {showAddGramaturaModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 800 }}>
                + Adicionar Novo Ingrediente & Gramatura
              </h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowAddGramaturaModal(false)}>✕</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newGramatura.ingrediente) return;
              const newG = {
                id: `GRAM-${gramaturas.length + 1}`,
                ingrediente: newGramatura.ingrediente,
                gramasPorPessoa: parseFloat(newGramatura.gramasPorPessoa) || 100,
                itemEstoque: newGramatura.itemEstoque
              };
              setGramaturas([...gramaturas, newG]);
              setShowAddGramaturaModal(false);
              setNewGramatura({ ingrediente: '', gramasPorPessoa: 100, itemEstoque: estoqueAlimentos[0]?.item || 'Arroz Tipo 1 (Fardos 30kg)' });
            }}>
              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Nome do Ingrediente / Gênero:</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Macarrão Espaguete, Açúcar, Óleo..."
                  required
                  value={newGramatura.ingrediente}
                  onChange={e => setNewGramatura({ ...newGramatura, ingrediente: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Gramatura Per Capita Recomendada (g / pessoa):</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="Ex: 100"
                  required
                  value={newGramatura.gramasPorPessoa}
                  onChange={e => setNewGramatura({ ...newGramatura, gramasPorPessoa: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Vincular ao Item de Estoque (Prateleira):</label>
                <select 
                  className="form-select"
                  value={newGramatura.itemEstoque}
                  onChange={e => setNewGramatura({ ...newGramatura, itemEstoque: e.target.value })}
                >
                  {estoqueAlimentos.map(i => (
                    <option key={i.id} value={i.item}>{i.item}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddGramaturaModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-success">+ Salvar Ficha Técnica</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 6: Editar Ingrediente & Gramatura Existente */}
      {showEditGramaturaModal && editingGramatura && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 800 }}>
                ✏️ Editar Ingrediente & Gramatura Per Capita
              </h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowEditGramaturaModal(false)}>✕</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setGramaturas(gramaturas.map(g => g.id === editingGramatura.id ? editingGramatura : g));
              setShowEditGramaturaModal(false);
              setEditingGramatura(null);
            }}>
              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Nome do Ingrediente / Gênero:</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required
                  value={editingGramatura.ingrediente}
                  onChange={e => setEditingGramatura({ ...editingGramatura, ingrediente: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Gramatura Per Capita Recomendada (g / pessoa):</label>
                <input 
                  type="number" 
                  className="form-input" 
                  required
                  value={editingGramatura.gramasPorPessoa}
                  onChange={e => setEditingGramatura({ ...editingGramatura, gramasPorPessoa: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Vincular ao Item de Estoque (Prateleira):</label>
                <select 
                  className="form-select"
                  value={editingGramatura.itemEstoque}
                  onChange={e => setEditingGramatura({ ...editingGramatura, itemEstoque: e.target.value })}
                >
                  {estoqueAlimentos.map(i => (
                    <option key={i.id} value={i.item}>{i.item}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditGramaturaModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">✓ Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 7: Cadastrar Nova Dieta Especial vinculada ao Acolhido */}
      {showNewDietaModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e40af', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <HeartPulse size={20} /> + Cadastrar Dieta Especial (Sincronizado Módulo 1 & 5)
              </h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowNewDietaModal(false)}>✕</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newDieta.acolhido) return;
              const newD = {
                id: `DIET-0${dietasEspeciais.length + 1}`,
                ...newDieta
              };
              setDietasEspeciais([newD, ...dietasEspeciais]);
              setShowNewDietaModal(false);
            }}>
              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Selecione o Acolhido (Cadastrado em Gestão de Acolhidos):</label>
                <select 
                  className="form-select"
                  required
                  value={newDieta.acolhido}
                  onChange={e => setNewDieta({ ...newDieta, acolhido: e.target.value })}
                >
                  {acolhidos && acolhidos.length > 0 ? (
                    acolhidos.map(a => (
                      <option key={a.id} value={a.nome}>{a.nome} ({a.id} • {a.alojamento || 'Ativo'})</option>
                    ))
                  ) : (
                    <>
                      <option value="Antonio Carlos da Silva Filho">Antonio Carlos da Silva Filho (FDJ-2026-0891)</option>
                      <option value="Marcos Vinicius Santos Santana">Marcos Vinicius Santos Santana (FDJ-2026-0892)</option>
                      <option value="Edvaldo Oliveira Souza">Edvaldo Oliveira Souza (FDJ-2026-0893)</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Restrição Médica Diagnosticada:</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Diabetes Mellitus, Hipertensão, Intolerância Glúten/Lactose"
                  required
                  value={newDieta.restricao}
                  onChange={e => setNewDieta({ ...newDieta, restricao: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Dieta Recomendada pela Nutrição:</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Zero açúcar, Hipossódica, Zero lactose"
                  required
                  value={newDieta.dietaRecomendada}
                  onChange={e => setNewDieta({ ...newDieta, dietaRecomendada: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Instruções de Preparo para a Cozinha Central:</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Servir refeição sem adição de açúcar ou condimentos fortes"
                  required
                  value={newDieta.refeicaoEspecial}
                  onChange={e => setNewDieta({ ...newDieta, refeicaoEspecial: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Observação / Prontuário Médico:</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Sincronizado com Prontuário Médico & Enfermagem"
                  value={newDieta.observacao}
                  onChange={e => setNewDieta({ ...newDieta, observacao: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewDietaModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#1e40af', borderColor: '#1e40af' }}>+ Salvar Dieta Especial</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 8: Cadastrar Nova Cotação Multiempresas com Seleção de Fornecedores */}
      {showAddComparadorModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#713f12', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <DollarSign size={20} /> + Nova Cotação de Preços (Cadastros Administrativos)
              </h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowAddComparadorModal(false)}>✕</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newComparador.item) return;

              const best = calculateBestSupplierDynamic(newComparador.cotacoes);

              const newC = {
                id: `COMP-${comparadorPrecos.length + 1}`,
                item: newComparador.item,
                cotacoes: newComparador.cotacoes,
                ...best
              };

              setComparadorPrecos([newC, ...comparadorPrecos]);
              setShowAddComparadorModal(false);
            }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Item Alimentício / Insumo (Cadastro Prévio de Estoque) *</label>
                <select 
                  className="form-select"
                  required
                  value={newComparador.item}
                  onChange={e => setNewComparador({ ...newComparador, item: e.target.value })}
                >
                  {estoqueAlimentos.map(i => (
                    <option key={i.id} value={i.item}>
                      {i.item} ({i.categoria} • Saldo: {i.qtdAtual} {i.unidade})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: 800, color: '#713f12' }}>
                    🏢 Empresas Cotadas (Módulo de Cadastros Administrativos):
                  </label>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-secondary"
                    style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', borderColor: '#93c5fd' }}
                    onClick={() => {
                      const nextEmpresa = fornecedores[newComparador.cotacoes.length]?.razaoSocial || `Fornecedor ${newComparador.cotacoes.length + 1}`;
                      setNewComparador({
                        ...newComparador,
                        cotacoes: [...newComparador.cotacoes, { empresa: nextEmpresa, preco: '' }]
                      });
                    }}
                  >
                    + Adicionar Outra Empresa
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {newComparador.cotacoes.map((cot, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <select 
                          className="form-select"
                          style={{ fontSize: '0.825rem' }}
                          value={cot.empresa}
                          onChange={e => {
                            const updated = [...newComparador.cotacoes];
                            updated[index].empresa = e.target.value;
                            setNewComparador({ ...newComparador, cotacoes: updated });
                          }}
                        >
                          {fornecedores && fornecedores.length > 0 ? (
                            fornecedores.map(f => (
                              <option key={f.id} value={f.razaoSocial}>
                                {f.razaoSocial} ({f.categoria || 'Fornecedor Cadastrado'})
                              </option>
                            ))
                          ) : (
                            <>
                              <option value="Atacadão S.A.">Atacadão S.A.</option>
                              <option value="Distribuidora Ceasa Salvador Ltda">Distribuidora Ceasa Salvador Ltda</option>
                              <option value="Nacional Gás Butano Ltda">Nacional Gás Butano Ltda</option>
                              <option value="Mercado Baiano Ltda">Mercado Baiano Ltda</option>
                              <option value="Assaí Atacadista">Assaí Atacadista</option>
                            </>
                          )}
                        </select>
                      </div>

                      <div style={{ width: '130px' }}>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="Preço (R$)"
                          className="form-input" 
                          style={{ fontSize: '0.825rem', fontWeight: 700 }}
                          required
                          value={cot.preco}
                          onChange={e => {
                            const updated = [...newComparador.cotacoes];
                            updated[index].preco = e.target.value;
                            setNewComparador({ ...newComparador, cotacoes: updated });
                          }}
                        />
                      </div>

                      {newComparador.cotacoes.length > 2 && (
                        <button 
                          type="button" 
                          className="btn btn-sm btn-secondary"
                          style={{ color: '#dc2626', borderColor: '#fca5a5', padding: '0.25rem 0.5rem' }}
                          onClick={() => {
                            const updated = newComparador.cotacoes.filter((_, idx) => idx !== index);
                            setNewComparador({ ...newComparador, cotacoes: updated });
                          }}
                          title="Remover esta empresa"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddComparadorModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-warning" style={{ background: '#eab308', borderColor: '#eab308', color: '#713f12', fontWeight: 800 }}>+ Salvar Cotação</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 9: Editar Cotação Multiempresas Existente */}
      {showEditComparadorModal && editingComparador && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#713f12', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                ✏️ Editar Cotação: {editingComparador.item}
              </h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowEditComparadorModal(false)}>✕</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();

              const best = calculateBestSupplierDynamic(editingComparador.cotacoes || []);

              const updatedC = {
                ...editingComparador,
                ...best
              };

              setComparadorPrecos(comparadorPrecos.map(c => (c.id || c.item) === (editingComparador.id || editingComparador.item) ? updatedC : c));
              setShowEditComparadorModal(false);
              setEditingComparador(null);
            }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Item Alimentício / Insumo (Cadastro Prévio de Estoque) *</label>
                <select 
                  className="form-select"
                  required
                  value={editingComparador.item}
                  onChange={e => setEditingComparador({ ...editingComparador, item: e.target.value })}
                >
                  {estoqueAlimentos.map(i => (
                    <option key={i.id} value={i.item}>
                      {i.item} ({i.categoria} • Saldo: {i.qtdAtual} {i.unidade})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: 800, color: '#713f12' }}>
                    🏢 Empresas Cotadas (Módulo de Cadastros Administrativos):
                  </label>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-secondary"
                    style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', borderColor: '#93c5fd' }}
                    onClick={() => {
                      const currentCot = editingComparador.cotacoes || [];
                      const nextEmpresa = fornecedores[currentCot.length]?.razaoSocial || `Fornecedor ${currentCot.length + 1}`;
                      setEditingComparador({
                        ...editingComparador,
                        cotacoes: [...currentCot, { empresa: nextEmpresa, preco: '' }]
                      });
                    }}
                  >
                    + Adicionar Outra Empresa
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {(editingComparador.cotacoes || []).map((cot, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <select 
                          className="form-select"
                          style={{ fontSize: '0.825rem' }}
                          value={cot.empresa}
                          onChange={e => {
                            const updated = [...(editingComparador.cotacoes || [])];
                            updated[index].empresa = e.target.value;
                            setEditingComparador({ ...editingComparador, cotacoes: updated });
                          }}
                        >
                          {fornecedores && fornecedores.length > 0 ? (
                            fornecedores.map(f => (
                              <option key={f.id} value={f.razaoSocial}>
                                {f.razaoSocial} ({f.categoria || 'Fornecedor Cadastrado'})
                              </option>
                            ))
                          ) : (
                            <>
                              <option value="Atacadão S.A.">Atacadão S.A.</option>
                              <option value="Distribuidora Ceasa Salvador Ltda">Distribuidora Ceasa Salvador Ltda</option>
                              <option value="Nacional Gás Butano Ltda">Nacional Gás Butano Ltda</option>
                              <option value="Mercado Baiano Ltda">Mercado Baiano Ltda</option>
                              <option value="Assaí Atacadista">Assaí Atacadista</option>
                            </>
                          )}
                        </select>
                      </div>

                      <div style={{ width: '130px' }}>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="Preço (R$)"
                          className="form-input" 
                          style={{ fontSize: '0.825rem', fontWeight: 700 }}
                          required
                          value={cot.preco}
                          onChange={e => {
                            const updated = [...(editingComparador.cotacoes || [])];
                            updated[index].preco = e.target.value;
                            setEditingComparador({ ...editingComparador, cotacoes: updated });
                          }}
                        />
                      </div>

                      {(editingComparador.cotacoes || []).length > 2 && (
                        <button 
                          type="button" 
                          className="btn btn-sm btn-secondary"
                          style={{ color: '#dc2626', borderColor: '#fca5a5', padding: '0.25rem 0.5rem' }}
                          onClick={() => {
                            const updated = (editingComparador.cotacoes || []).filter((_, idx) => idx !== index);
                            setEditingComparador({ ...editingComparador, cotacoes: updated });
                          }}
                          title="Remover esta empresa"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditComparadorModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">✓ Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
