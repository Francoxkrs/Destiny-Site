// GET → métricas do servidor (Discord + banco do bot + fotos diárias). POST → tira a foto de hoje agora.
import { lerDiscord, lerBanco, calcular, tirarFoto, historico, diaBR } from '../../../lib/metricas.js';
import { env } from '../../../lib/env.js';
import { json, preparar } from './_comum.js';
export const prerender = false;

async function juntar(db) {
  const hoje = diaBR();
  const [dc, bd] = await Promise.all([lerDiscord(env.botToken, env.guildId).catch((e) => ({ ok: false, erro: `Discord: ${e?.message ?? e}` })), lerBanco(db, env.guildId)]);
  return { hoje, dc, bd };
}

export async function GET(ctx) {
  const p = await preparar(ctx, false);
  if (p.erro) return p.erro;
  try {
    const { hoje, dc, bd } = await juntar(p.db);
    return json(200, calcular(dc, bd, hoje, await historico(p.db, hoje)));
  } catch (e) {
    console.error('admin (métricas):', e?.message ?? e);
    return json(500, { erro: 'Não consegui montar as métricas agora.' });
  }
}

export async function POST(ctx) {
  const p = await preparar(ctx, true);
  if (p.erro) return p.erro;
  try {
    const { hoje, dc, bd } = await juntar(p.db);
    const r = await tirarFoto(p.db, dc, bd, hoje);
    return r.ok ? json(200, r) : json(503, { erro: r.erro });
  } catch (e) {
    console.error('admin (foto):', e?.message ?? e);
    return json(500, { erro: 'Não consegui tirar a foto de hoje.' });
  }
}
