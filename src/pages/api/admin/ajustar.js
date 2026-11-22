// POST { campo, modo: 'somar' | 'definir', valor, motivo? } ou { acao } → muda um número da PRÓPRIA conta e registra em adminLog.
import { ajustar, acao, validarAjuste } from '../../../lib/admin.js';
import { json, preparar, corpoDe } from './_comum.js';
export const prerender = false;

export async function POST(ctx) {
  const p = await preparar(ctx, true);
  if (p.erro) return p.erro;
  const corpo = await corpoDe(ctx.request);
  if (!corpo) return json(400, { erro: 'Pedido inválido.' });
  try {
    if (corpo.acao) {
      const r = await acao(p.db, p.quem, String(corpo.acao));
      return r.ok ? json(200, r) : json(r.status, { erro: r.erro });
    }
    const v = validarAjuste(corpo);
    if (!v.ok) return json(400, { erro: v.erro });
    const r = await ajustar(p.db, p.quem, v);
    return r.ok ? json(200, r) : json(r.status, { erro: r.erro });
  } catch (e) {
    console.error('admin (ajustar):', e?.message ?? e);
    return json(500, { erro: 'Algo deu errado ao gravar. Recarregue o painel antes de tentar de novo.' });
  }
}
