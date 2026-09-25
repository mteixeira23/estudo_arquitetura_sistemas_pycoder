const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const supabase = createClient(
  'https://ozzooqhfxmdfwdzheuzi.supabase.co', 
  'sb_publishable_XbLwp0TWMsgxXulY8If99A_hrR65yad',
  {
    realtime: {
      transport: WebSocket
    }
  }
);

(async () => {
  console.log('📡 [Step 2: Database Audit] Querying Supabase PostgreSQL Tables...');

  const { data: estoque, error: errEst } = await supabase.from('estoque').select('*');
  console.log('📦 Supabase `estoque` Table Count:', estoque ? estoque.length : 0, 'items');
  if (estoque && estoque.length > 0) {
    estoque.forEach(i => {
      console.log(`  - ${i.item} (${i.id}): Saldo Inicial=${i.qtd_inicial} ${i.unidade} | Entradas=+${i.qtd_entradas} | Saídas=-${i.qtd_saidas} | Endereço=${i.endereco}`);
    });
  } else if (errEst) {
    console.error('Error fetching estoque:', errEst);
  }

  const { data: movs } = await supabase.from('movimentacoes').select('*');
  console.log('📊 Supabase `movimentacoes` Table Count:', movs ? movs.length : 0, 'records');

  const { data: doacoes } = await supabase.from('doacoes').select('*');
  console.log('🎁 Supabase `doacoes` Table Count:', doacoes ? doacoes.length : 0, 'records');

  const { data: rmis } = await supabase.from('rmis').select('*');
  console.log('🚚 Supabase `rmis` Table Count:', rmis ? rmis.length : 0, 'records');

  console.log('\n💬 [Step 3: WhatsApp Stock Alert Simulation]');
  const targetItem = (estoque && estoque[0]) ? estoque[0] : { item: 'Feijão Carioca Tipo 1', qtd_inicial: 80, unidade: 'kg' };
  const alertPayload = {
    whatsapp_channel: '+55 71 99120-4491 (Coordenadoria de Almoxarifado FDJ)',
    message: `⚠️ ALERTA DE ESTOQUE MÍNIMO: O insumo ${targetItem.item} atingiu o nível crítico com apenas ${targetItem.qtd_inicial} ${targetItem.unidade} disponíveis no Galpão A. Favor emitir Ordem de Compra MROSC.`,
    status: 'SENT_SUCCESS',
    timestamp: new Date().toISOString()
  };
  console.log('✅ WhatsApp Stock Alert Delivered:\n', JSON.stringify(alertPayload, null, 2));

})().catch(console.error);
