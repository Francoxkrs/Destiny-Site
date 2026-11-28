// GET → os feitiços que a conta mandou pelo site (e como estão).
// POST (multipart: campos do feitiço + `imagem` opcional) → confere com a ficha e põe na fila do bot,
// que posta no fórum do Conselho Mágico. Ver src/lib/feitico.js.
import { env } from '../../lib/env.js';
import { MAX_IMAGEM, criarPedido, pedidosDe, validarPedido } from '../../lib/feitico.js';
import { json, preparar } from './altar/_comum.js';
export const prerender = false;

export async function GET(ctx) {
  const p = await preparar(ctx, false);
  if (p.erro) return p.erro;
  try {
    return json(200, { pedidos: await pedidosDe(p.db, env.guildId, p.s.id) });
  } catch (e) {
    console.error('feitiço (lista):', e?.message ?? e);
    return json(500, { erro: 'Não consegui ler os seus feitiços agora.' });
  }
}

export async function POST(ctx) {
  const p = await preparar(ctx, true);
  if (p.erro) return p.erro;
  const tamanho = Number(ctx.request.headers.get('content-length') || 0);
  if (tamanho > MAX_IMAGEM + 64 * 1024) return json(413, { erro: 'A imagem passa de 3 MB. Mande uma menor (ou um GIF mais curto).' });
  let form;
  try { form = await ctx.request.formData(); } catch { return json(400, { erro: 'Pedido inválido.' }); }
  const corpo = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === 'string'));
  try {
    const ficha = await p.db.collection('fichasWeb').findOne({ guildId: env.guildId, userId: p.s.id }, { projection: { escrita: 1 } });
    if (!ficha) return json(404, { erro: 'Você precisa de um personagem aprovado. Use /criar-personagem no Discord.' });
    const v = validarPedido(corpo, ficha.escrita);
    if (v.erro) return json(400, { erro: v.erro });
    let imagem = null;
    const arq = form.get('imagem');
    if (arq && typeof arq === 'object' && arq.size > 0) {
      if (arq.size > MAX_IMAGEM) return json(413, { erro: 'A imagem passa de 3 MB. Mande uma menor (ou um GIF mais curto).' });
      imagem = { bytes: new Uint8Array(await arq.arrayBuffer()), nome: arq.name || v.dados.nome };
    }
    const r = await criarPedido(p.db, env.guildId, p.s.id, ficha.escrita, { dados: v.dados, imagem });
    return r.erro ? json(r.status, { erro: r.erro }) : json(200, { id: r.id });
  } catch (e) {
    console.error('feitiço (enviar):', e?.message ?? e);
    return json(500, { erro: 'Não consegui mandar agora. O seu texto continua aqui: tente de novo.' });
  }
}
