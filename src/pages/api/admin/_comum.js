// Peças comuns das rotas da Sala de Testes. Quem não é admin recebe 404, igual a uma rota que não existe.
import { lerSessao } from '../../../lib/sessao.js';
import { banco } from '../../../lib/db.js';
import { env, bancoPronto } from '../../../lib/env.js';
import { ehAdmin } from '../../../lib/admin.js';

const cabecalhos = { 'content-type': 'application/json', 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' };
export const json = (status, corpo) => new Response(JSON.stringify(corpo), { status, headers: cabecalhos });
const naoExiste = () => new Response('Not found', { status: 404, headers: { 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex' } });

/**
 * Sessão de admin + banco, ou a Response de erro.
 * Pedidos que alteram exigem a origem do próprio site (o navegador sempre manda Origin num POST por fetch)
 * e corpo JSON: um formulário de outro site não consegue nenhum dos dois.
 */
export async function preparar({ request, url, cookies }, altera) {
  const s = lerSessao(cookies);
  if (!ehAdmin(s)) return { erro: naoExiste() };
  if (altera) {
    const origem = request.headers.get('origin');
    const site = request.headers.get('sec-fetch-site');
    if (origem !== url.origin || (site && site !== 'same-origin')) return { erro: json(403, { erro: 'Pedido de fora do site.' }) };
    if (!(request.headers.get('content-type') || '').includes('application/json')) return { erro: json(415, { erro: 'Pedido inválido.' }) };
  }
  if (!bancoPronto()) return { erro: json(503, { erro: 'O site não está ligado ao banco (MONGO_URI e GUILD_ID na Vercel).' }) };
  const db = await banco().catch((e) => { console.error('admin (banco):', e?.message ?? e); return null; });
  if (!db) return { erro: json(503, { erro: 'O site não conseguiu falar com o banco agora.' }) };
  return { s, db, quem: { userId: s.id, guildId: env.guildId, nome: s.nome } };
}

export async function corpoDe(request) {
  try { return await request.json(); } catch { return null; }
}
