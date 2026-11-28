// Outras contas (2026-11-27): o admin muda os Cristais Prismáticos de outro jogador, e só eles.
// GET ?q=termo → procura por ID do Discord ou nome do personagem. GET → últimos ajustes em outras contas.
// POST { userId, modo: 'somar' | 'definir', valor, esperado, motivo? } → muda o CP (só grava se o saldo ainda for `esperado`).
// POST { desfazer: id } → devolve a diferença de um ajuste (uma vez só).
import { buscarContas, validarOutra, ajustarOutra, desfazerOutra, historicoOutras } from '../../../lib/admin.js';
import { json, preparar, corpoDe } from './_comum.js';
export const prerender = false;

export async function GET(ctx) {
  const p = await preparar(ctx, false);
  if (p.erro) return p.erro;
  try {
    const q = ctx.url.searchParams.get('q');
    if (q != null) {
      const r = await buscarContas(p.db, q, p.quem.guildId);
      return r.ok ? json(200, r) : json(400, { erro: r.erro });
    }
    return json(200, { historico: await historicoOutras(p.db) });
  } catch (e) {
    console.error('admin (outras):', e?.message ?? e);
    return json(500, { erro: 'Não consegui ler as contas agora.' });
  }
}

export async function POST(ctx) {
  const p = await preparar(ctx, true);
  if (p.erro) return p.erro;
  const corpo = await corpoDe(ctx.request);
  if (!corpo) return json(400, { erro: 'Pedido inválido.' });
  try {
    if (corpo.desfazer != null) {
      const r = await desfazerOutra(p.db, p.quem, corpo.desfazer);
      return r.ok ? json(200, r) : json(r.status, { erro: r.erro });
    }
    const v = validarOutra(corpo);
    if (!v.ok) return json(400, { erro: v.erro });
    const r = await ajustarOutra(p.db, p.quem, v);
    return r.ok ? json(200, r) : json(r.status, { erro: r.erro, agora: r.agora });
  } catch (e) {
    console.error('admin (outras):', e?.message ?? e);
    return json(500, { erro: 'Algo deu errado ao gravar. Recarregue a conta antes de tentar de novo.' });
  }
}
