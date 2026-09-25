/**
 * ⚠️ TOMBSTONE INTELIGENTE — MIGRAÇÃO SCSI (Fase 3.2)
 *
 * O cliente Supabase foi aposentado em favor da API própria (Django + SimpleJWT).
 * Se algum componente ou hook legado tentar acessar qualquer propriedade ou método,
 * este Proxy interceptará o acesso e disparará um erro explicativo com rastreamento.
 */

const TOMBSTONE_MSG = 
  '[SCSI][TOMBSTONE] O cliente Supabase (supabase.js) foi descontinuado neste projeto.\n' +
  'Use a instância centralizada do Axios em "src/lib/api.js" para chamadas REST, ' +
  'ou "src/lib/aiStream.js" para streaming cognitivo.\n' +
  'Verifique a pilha de chamadas abaixo para localizar o módulo que tentou acessar o Supabase:';

const supabaseTombstone = new Proxy({}, {
  get(_target, prop) {
    if (prop === 'then' || prop === 'catch') {
      // Evita disparar erro se algum código tentar tratar o objeto como Promise
      return undefined;
    }
    const err = new Error(`${TOMBSTONE_MSG}\n-> Propriedade interceptada: "${String(prop)}"`);
    console.error(err);
    throw err;
  },
  apply() {
    const err = new Error(TOMBSTONE_MSG);
    console.error(err);
    throw err;
  }
});

export default supabaseTombstone;
export const supabase = supabaseTombstone;
export const createClient = () => { throw new Error(TOMBSTONE_MSG); };
