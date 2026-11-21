import { lerSessao } from '../../lib/sessao.js';
import { carregarFicha } from '../../lib/ficha.js';
import { banco } from '../../lib/db.js';
export const prerender = false;

// O cabeçalho pergunta aqui quem está logado (nome, avatar, Estágio e saldo de Cristais Prismáticos).
export async function GET({ cookies }) {
  const s = lerSessao(cookies);
  const corpo = { sessao: null };
  if (s) {
    const { estado, ficha } = await carregarFicha(s);
    let cp = null, inscricoes = null;
    try { const db = await banco(); const c = db && (await db.collection('contas').findOne({ userId: s.id }, { projection: { cp: 1, inscricoes: 1 } })); cp = c?.cp ?? (db ? 0 : null); inscricoes = db ? Math.floor(c?.inscricoes ?? 0) : null; } catch { /* sem saldo */ }
    corpo.sessao = { ...s, cp, inscricoes, personagem: estado === 'ok' ? { nome: ficha.nome, estagio: ficha.estagio } : null };
  }
  return new Response(JSON.stringify(corpo), { headers: { 'content-type': 'application/json', 'cache-control': 'private, no-store' } });
}
