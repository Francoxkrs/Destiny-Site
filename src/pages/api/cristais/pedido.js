// GET ?id= → como está o Pix (a página pergunta a cada poucos segundos). Confere no Mercado Pago e credita se pagou.
import { conferir, pedidoDe, vistaPedido } from '../../../lib/compras.js';
import { json, preparar, saldoDe } from './_comum.js';
export const prerender = false;

export async function GET(ctx) {
  const p = await preparar(ctx, false);
  if (p.erro) return p.erro;
  const pedido = await pedidoDe(p.db, p.s.id, ctx.url.searchParams.get('id'));
  if (!pedido) return json(404, { erro: 'Pedido não encontrado.' });
  const r = await conferir(p.db, p.token, pedido).catch((e) => { console.error('cristais (conferir):', e?.message ?? e); return { status: pedido.status }; });
  const vista = r.status === 'pendente' ? vistaPedido(pedido) : { ...vistaPedido({ ...pedido, status: r.status }) };
  return json(200, { pedido: vista, saldo: await saldoDe(p.db, p.s.id) });
}
