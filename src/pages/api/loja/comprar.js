// POST { tipo: 'pedra' | 'loja', id, ref } → cobra (Inscrições e/ou CP) e põe o item na /bolsa do bot. A mesma ref nunca cobra duas vezes.
import { comprar } from '../../../lib/loja.js';
import { env } from '../../../lib/env.js';
import { json, preparar } from '../altar/_comum.js';
export const prerender = false;

export async function POST(ctx) {
  const p = await preparar(ctx, true);
  if (p.erro) return p.erro;
  let corpo;
  try { corpo = await ctx.request.json(); } catch { return json(400, { erro: 'Pedido inválido.' }); }
  try {
    const r = await comprar(p.db, { userId: p.s.id, guildId: env.guildId, tipo: String(corpo?.tipo ?? ''), id: String(corpo?.id ?? ''), ref: corpo?.ref });
    return r.ok ? json(200, { recibo: { nome: r.recibo.nome, chave: r.recibo.chave, cp: r.recibo.cp, insc: r.recibo.insc }, conta: r.conta, repetido: Boolean(r.repetido) }) : json(r.status, { erro: r.erro, falta: r.falta });
  } catch (e) {
    console.error('loja (comprar):', e?.message ?? e);
    return json(500, { erro: 'Algo deu errado na compra. Confira a sua /bolsa no bot antes de tentar de novo.' });
  }
}
