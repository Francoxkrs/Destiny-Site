// Calendário de Eventos na Sala de Testes.
// GET → marcações de 60 dias atrás em diante (rascunhos inclusive). POST { op: 'salvar', item } | { op: 'apagar', id }.
import { paraPainel, salvar, apagar, hojeBR, TIPOS } from '../../../lib/calendario.js';
import { json, preparar, corpoDe } from './_comum.js';
export const prerender = false;

export async function GET(ctx) {
  const p = await preparar(ctx, false);
  if (p.erro) return p.erro;
  try { return json(200, { hoje: hojeBR(), tipos: TIPOS, itens: await paraPainel(p.db, hojeBR()) }); } catch (e) {
    console.error('admin (calendário):', e?.message ?? e);
    return json(500, { erro: 'Não consegui ler o calendário.' });
  }
}

export async function POST(ctx) {
  const p = await preparar(ctx, true);
  if (p.erro) return p.erro;
  const corpo = await corpoDe(ctx.request);
  try {
    const r = corpo?.op === 'apagar' ? await apagar(p.db, p.quem, corpo.id) : corpo?.op === 'salvar' ? await salvar(p.db, p.quem, corpo.item) : { ok: false, status: 400, erro: 'Pedido inválido.' };
    return r.ok ? json(200, r) : json(r.status, { erro: r.erro });
  } catch (e) {
    console.error('admin (calendário, gravar):', e?.message ?? e);
    return json(500, { erro: 'Não consegui gravar no calendário.' });
  }
}
