// POST { qtd: 1 | 10, ref } → sorteia no servidor, gasta (Inscrições, depois CP) e entrega. A mesma ref nunca cobra duas vezes.
import { invocar } from '../../../lib/altar.js';
import { env } from '../../../lib/env.js';
import { json, preparar } from './_comum.js';
export const prerender = false;

export async function POST(ctx) {
  const p = await preparar(ctx, true);
  if (p.erro) return p.erro;
  let corpo;
  try { corpo = await ctx.request.json(); } catch { return json(400, { erro: 'Pedido inválido.' }); }
  try {
    const r = await invocar(p.db, { userId: p.s.id, guildId: env.guildId, qtd: Number(corpo?.qtd), ref: corpo?.ref });
    return r.ok ? json(200, { res: r.res, estado: r.estado, repetido: Boolean(r.repetido) }) : json(r.status, { erro: r.erro, falta: r.falta });
  } catch (e) {
    console.error('altar (invocar):', e?.message ?? e);
    return json(500, { erro: 'Algo deu errado na invocação. Abra o histórico antes de tentar de novo: se o giro entrou, ele aparece lá.' });
  }
}
