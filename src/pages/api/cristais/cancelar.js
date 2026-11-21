// POST { id } → o jogador desiste do Pix. Se já tinha pago, credita em vez de cancelar.
import { cancelarCompra, pedidoDe } from '../../../lib/compras.js';
import { json, preparar, saldoDe } from './_comum.js';
export const prerender = false;

export async function POST(ctx) {
  const p = await preparar(ctx, true);
  if (p.erro) return p.erro;
  let corpo;
  try { corpo = await ctx.request.json(); } catch { return json(400, { erro: 'Pedido inválido.' }); }
  const pedido = await pedidoDe(p.db, p.s.id, corpo?.id);
  if (!pedido) return json(404, { erro: 'Pedido não encontrado.' });
  const r = await cancelarCompra(p.db, p.token, pedido);
  return json(r.erro ? 409 : 200, { status: r.status, erro: r.erro, saldo: await saldoDe(p.db, p.s.id) });
}
