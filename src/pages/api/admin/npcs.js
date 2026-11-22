// Arquivo de NPCs da Staff. Só admin (404 para os outros).
// GET → todos os NPCs. POST { op: 'salvar', npc } | { op: 'apagar', id } | { op: 'importar', lista }.
import { listar, salvar, apagar, importar } from '../../../lib/npcs.js';
import { json, preparar, corpoDe } from './_comum.js';
export const prerender = false;

export async function GET(ctx) {
  const p = await preparar(ctx, false);
  if (p.erro) return p.erro;
  try { return json(200, { npcs: await listar(p.db) }); } catch (e) {
    console.error('admin (npcs):', e?.message ?? e);
    return json(500, { erro: 'Não consegui ler os NPCs.' });
  }
}

export async function POST(ctx) {
  const p = await preparar(ctx, true);
  if (p.erro) return p.erro;
  const corpo = await corpoDe(ctx.request);
  try {
    const op = corpo?.op;
    const r = op === 'salvar' ? await salvar(p.db, p.quem, corpo.npc)
      : op === 'apagar' ? await apagar(p.db, p.quem, corpo.id)
      : op === 'importar' ? await importar(p.db, p.quem, corpo.lista)
      : { ok: false, status: 400, erro: 'Pedido inválido.' };
    return r.ok ? json(200, r) : json(r.status, { erro: r.erro });
  } catch (e) {
    console.error('admin (npcs, gravar):', e?.message ?? e);
    return json(500, { erro: 'Não consegui gravar o NPC.' });
  }
}
