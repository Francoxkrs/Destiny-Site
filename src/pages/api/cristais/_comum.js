// Peças comuns das rotas de compra de Cristais (o "_" faz o Astro não publicar este arquivo como rota).
import { lerSessao, mesmaOrigem } from '../../../lib/sessao.js';
import { banco } from '../../../lib/db.js';
import { env, pagamentoPronto } from '../../../lib/env.js';

export const json = (status, corpo) => new Response(JSON.stringify(corpo), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

/** Sessão + banco + Mercado Pago, ou a Response de erro. */
export async function preparar({ request, url, cookies }, altera) {
  if (altera && !mesmaOrigem(request, url)) return { erro: json(403, { erro: 'Pedido de fora do site.' }) };
  if (!pagamentoPronto()) return { erro: json(503, { erro: 'A compra pelo Pix ainda não está ligada no site. Avise a Staff.' }) };
  const s = lerSessao(cookies);
  if (!s) return { erro: json(401, { erro: 'Entre com o Discord para comprar.' }) };
  const db = await banco().catch((e) => { console.error('cristais (banco):', e?.message ?? e); return null; });
  if (!db) return { erro: json(503, { erro: 'O site não conseguiu falar com o banco agora. Tente de novo.' }) };
  return { s, db, token: env.mpToken };
}

export const saldoDe = async (db, userId) => (await db.collection('contas').findOne({ userId }, { projection: { cp: 1 } }))?.cp ?? 0;
