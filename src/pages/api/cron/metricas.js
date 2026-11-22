// Foto diária das métricas (vercel.json → crons, 03:00 UTC = meia-noite em Brasília).
// A Vercel manda "Authorization: Bearer <CRON_SECRET>". Sem CRON_SECRET, a rota não existe.
import { timingSafeEqual } from 'node:crypto';
import { banco } from '../../../lib/db.js';
import { env } from '../../../lib/env.js';
import { lerDiscord, lerBanco, tirarFoto, diaBR } from '../../../lib/metricas.js';
export const prerender = false;

const resp = (status, corpo) => new Response(JSON.stringify(corpo), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const igual = (a, b) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };

export async function GET({ request }) {
  if (env.cronSecret.length < 16) return new Response('Not found', { status: 404 });
  if (!igual(request.headers.get('authorization') ?? '', `Bearer ${env.cronSecret}`)) return new Response('Not found', { status: 404 });
  const db = await banco().catch(() => null);
  if (!db) return resp(503, { erro: 'sem banco' });
  try {
    const [dc, bd] = await Promise.all([lerDiscord(env.botToken, env.guildId), lerBanco(db, env.guildId)]);
    const r = await tirarFoto(db, dc, bd, diaBR());
    return resp(r.ok ? 200 : 503, r);
  } catch (e) {
    console.error('cron (métricas):', e?.message ?? e);
    return resp(500, { erro: 'falhou' });
  }
}
