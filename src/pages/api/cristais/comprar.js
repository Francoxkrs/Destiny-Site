// POST { pacote: 1..6, metodo: 'pix' | 'cartao' } → Pix: devolve o QR. Cartão: devolve o link da página do Mercado Pago.
import { abrirCompra } from '../../../lib/compras.js';
import { env } from '../../../lib/env.js';
import { json, preparar } from './_comum.js';
export const prerender = false;

export async function POST(ctx) {
  const p = await preparar(ctx, true);
  if (p.erro) return p.erro;
  let corpo;
  try { corpo = await ctx.request.json(); } catch { return json(400, { erro: 'Pedido inválido.' }); }
  // aviso do Mercado Pago só num endereço público com https (prévia com senha da Vercel não recebe; a página confere sozinha)
  const u = ctx.url;
  const aviso = u.protocol === 'https:' && !/^(localhost|127\.)/.test(u.hostname) ? `${u.origin}/api/cristais/aviso` : undefined;
  try {
    const r = await abrirCompra(p.db, { token: p.token, email: env.mpEmail, aviso, volta: `${u.origin}/cristais/` }, { userId: p.s.id, nome: p.s.nome, guildId: env.guildId, n: corpo?.pacote, metodo: corpo?.metodo === 'cartao' ? 'cartao' : 'pix' });
    return r.ok ? json(200, { pedido: r.pedido }) : json(r.status ?? 400, { erro: r.erro });
  } catch (e) {
    console.error('cristais (comprar):', e?.message ?? e);
    return json(500, { erro: 'Algo deu errado ao abrir a compra. Tente de novo.' });
  }
}
