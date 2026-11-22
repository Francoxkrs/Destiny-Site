import { lerSessao } from '../../lib/sessao.js';
import { carregarFicha } from '../../lib/ficha.js';
import { banco } from '../../lib/db.js';
export const prerender = false;

/** Dia de Brasília (UTC-3) como "AAAA-MM-DD", igual ao bot (functions/diario/regras.ts). */
const diaBrasilia = (agora = new Date()) => new Date(agora.getTime() - 3 * 3600_000).toISOString().slice(0, 10);

// O cabeçalho pergunta aqui quem está logado (nome, avatar, Estágio e saldo de Cristais Prismáticos).
export async function GET({ cookies }) {
  const s = lerSessao(cookies);
  const corpo = { sessao: null };
  if (s) {
    const { estado, ficha } = await carregarFicha(s);
    let cp = null, inscricoes = null;
    try {
      const db = await banco();
      const c = db && (await db.collection('contas').findOne({ userId: s.id }, { projection: { cp: 1, inscricoes: 1, diarioSite: 1 } }));
      cp = c?.cp ?? (db ? 0 : null); inscricoes = db ? Math.floor(c?.inscricoes ?? 0) : null;
      // Diário do bot: entrar logado no site no mesmo dia do /diario conta 2 dias. Grava o dia de Brasília uma vez por dia.
      const hoje = diaBrasilia();
      if (db && c?.diarioSite !== hoje) await db.collection('contas').updateOne({ userId: s.id }, { $set: { diarioSite: hoje } }, { upsert: true });
    } catch { /* sem saldo */ }
    corpo.sessao = { ...s, cp, inscricoes, personagem: estado === 'ok' ? { nome: ficha.nome, estagio: ficha.estagio } : null };
  }
  return new Response(JSON.stringify(corpo), { headers: { 'content-type': 'application/json', 'cache-control': 'private, no-store' } });
}
