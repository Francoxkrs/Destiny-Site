// Peças comuns das rotas do Altar (o "_" faz o Astro não publicar este arquivo como rota).
import { lerSessao, mesmaOrigem } from '../../../lib/sessao.js';
import { banco } from '../../../lib/db.js';
import { bancoPronto } from '../../../lib/env.js';

export const json = (status, corpo) => new Response(JSON.stringify(corpo), { status, headers: { 'content-type': 'application/json', 'cache-control': 'private, no-store' } });

/** Sessão + banco, ou a Response de erro. */
export async function preparar({ request, url, cookies }, altera) {
  if (altera && !mesmaOrigem(request, url)) return { erro: json(403, { erro: 'Pedido de fora do site.' }) };
  const s = lerSessao(cookies);
  if (!s) return { erro: json(401, { erro: 'Entre com o Discord para continuar.' }) };
  if (!bancoPronto()) return { erro: json(503, { erro: 'O Altar ainda não está ligado neste endereço do site.' }) };
  const db = await banco().catch((e) => { console.error('altar (banco):', e?.message ?? e); return null; });
  if (!db) return { erro: json(503, { erro: 'O site não conseguiu falar com o banco agora. Tente de novo.' }) };
  return { s, db };
}
