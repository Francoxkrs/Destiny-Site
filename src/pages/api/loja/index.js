// GET → saldo, Inscrições e quanto já foi usado de cada limite da Pedra do Destino e da Loja.
import { limitesDaConta } from '../../../lib/loja.js';
import { env } from '../../../lib/env.js';
import { json, preparar } from '../altar/_comum.js';
export const prerender = false;

export async function GET(ctx) {
  const p = await preparar(ctx, false);
  if (p.erro) return p.erro;
  try { return json(200, await limitesDaConta(p.db, { userId: p.s.id, guildId: env.guildId })); } catch (e) {
    console.error('loja (estado):', e?.message ?? e);
    return json(500, { erro: 'Não consegui ler a sua conta agora.' });
  }
}
