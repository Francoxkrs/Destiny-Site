// GET ?mes=AAAA-MM → o que a Staff marcou no Calendário de Eventos (só o público). Aberto a todos.
import { banco } from '../../lib/db.js';
import { doMes, hojeBR } from '../../lib/calendario.js';
export const prerender = false;

const json = (status, corpo, cache = 'public, max-age=0, s-maxage=60, stale-while-revalidate=300') => new Response(JSON.stringify(corpo), { status, headers: { 'content-type': 'application/json', 'cache-control': cache } });

export async function GET({ url }) {
  const mes = url.searchParams.get('mes') || hojeBR().slice(0, 7);
  const db = await banco().catch(() => null);
  if (!db) return json(200, { mes, itens: [], ligado: false }, 'no-store');
  try {
    const itens = await doMes(db, mes);
    if (!itens) return json(400, { erro: 'Mês inválido.' }, 'no-store');
    return json(200, { mes, itens, ligado: true });
  } catch (e) {
    console.error('calendário:', e?.message ?? e);
    return json(500, { erro: 'Não consegui ler o calendário agora.' }, 'no-store');
  }
}
