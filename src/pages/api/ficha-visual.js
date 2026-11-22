// POST { ativo, id | null } → equipa (ou tira) uma peça da aba Visual. Mesma coleção do bot (`visuais`): vale nos dois.
import { equiparVisual } from '../../lib/visual.js';
import { env } from '../../lib/env.js';
import { json, preparar } from './altar/_comum.js';
export const prerender = false;

export async function POST(ctx) {
  const p = await preparar(ctx, true);
  if (p.erro) return p.erro;
  let corpo;
  try { corpo = await ctx.request.json(); } catch { return json(400, { erro: 'Pedido inválido.' }); }
  try {
    const r = await equiparVisual(p.db, { guildId: env.guildId, userId: p.s.id }, String(corpo?.ativo ?? ''), corpo?.id == null || corpo.id === '' ? null : String(corpo.id).slice(0, 80));
    return r.ok ? json(200, { ativo: r.visual.ativo }) : json(r.status, { erro: r.erro });
  } catch (e) {
    console.error('ficha (visual):', e?.message ?? e);
    return json(500, { erro: 'Não consegui trocar agora. Tente de novo.' });
  }
}
