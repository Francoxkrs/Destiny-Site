import { lerSessao, mesmaOrigem } from '../../lib/sessao.js';
import { banco } from '../../lib/db.js';
import { env } from '../../lib/env.js';
import { arvorePorClasse, migrarIds } from '../../data/arvores.js';
import { bloqueio, pontosDeTrilha, gastos } from '../../lib/arvore-regras.js';
export const prerender = false;

const json = (status, corpo) => new Response(JSON.stringify(corpo), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

/**
 * Gasta Pontos de Trilha da árvore v2: { nos: ["batalha.furia.avanco", ...] } (em ordem).
 * Só grava quando a foto do bot (fichasWeb.trilha.versao === 2) diz que o bot já usa os ids novos.
 * Valida com as mesmas regras do bot e grava só se a trilha não mudou desde a leitura
 * (se o bot ou outra aba gravou no meio, devolve 409 e a pessoa recarrega).
 */
export async function POST({ request, url, cookies }) {
  if (!mesmaOrigem(request, url)) return json(403, { erro: 'Pedido de fora do site.' });
  const s = lerSessao(cookies);
  if (!s) return json(401, { erro: 'Entre com o Discord para gastar pontos.' });
  let corpo;
  try { corpo = await request.json(); } catch { return json(400, { erro: 'Pedido inválido.' }); }
  const pedidos = Array.isArray(corpo?.nos) ? [...new Set(corpo.nos.map(String))].slice(0, 24) : [];
  if (!pedidos.length) return json(400, { erro: 'Nenhum nó escolhido.' });

  const db = await banco().catch(() => null);
  if (!db) return json(503, { erro: 'O site ainda não está ligado ao banco do bot.' });
  const p = await db.collection('personagens').findOne({ guildId: env.guildId, userId: s.id, etapa: 'aprovado', npc: { $ne: true } });
  if (!p) return json(404, { erro: 'Você não tem personagem aprovado.' });

  const foto = await db.collection('fichasWeb').findOne({ guildId: env.guildId, userId: s.id }, { projection: { trilha: 1 } });
  if (foto?.trilha?.versao !== 2) return json(409, { erro: 'O bot ainda não mandou a sua ficha nova para o site. Use /site no Discord e tente de novo.' });
  const modelo = p.modelos?.[p.escolhido ?? 0];
  const arvore = arvorePorClasse(modelo?.classeMago);
  if (!arvore) return json(400, { erro: 'Sua Classe de Mago não tem árvore.' });
  const estagio = p.estado?.estagio ?? 9;
  // o que está gravado (para a trava) e o mesmo já com os ids novos (fichas antigas guardam "Ramo/0")
  const antes = Array.isArray(p.estado?.trilhaClasse) ? p.estado.trilhaClasse : [];
  const tem = migrarIds(arvore, antes);
  // conta de novo a partir do personagem (Estágio + Pontos de Feito), igual ao bot: não confia na foto
  const pontos = pontosDeTrilha(estagio, p.estado?.trilhaFeitos ?? 0);
  for (const id of pedidos) {
    const motivo = bloqueio(arvore, pontos, estagio, tem, id);
    if (motivo) return json(409, { erro: motivo, no: id });
    tem.push(id);
  }

  const filtroTrilha = antes.length ? { 'estado.trilhaClasse': antes } : { $or: [{ 'estado.trilhaClasse': { $exists: false } }, { 'estado.trilhaClasse': null }, { 'estado.trilhaClasse': { $size: 0 } }] };
  const nomes = pedidos.map((id) => arvore.nos.find((n) => n.id === id)?.nome ?? id).join(', ');
  const r = await db.collection('personagens').updateOne(
    { _id: p._id, 'estado.estagio': estagio, ...filtroTrilha },
    {
      // updatedAt muda junto: a trava do bot (salvar) percebe que a ficha mudou e não grava por cima
      $set: { 'estado.trilhaClasse': tem, updatedAt: new Date() },
      $push: { diario: { $each: [{ em: new Date(), tipo: 'trilha', texto: `Trilha pelo site: ${nomes}`, por: s.id }] } },
    },
  );
  if (!r.modifiedCount) return json(409, { erro: 'Sua ficha mudou enquanto você planejava. Recarregue a página e tente de novo.' });

  const g = gastos(arvore, tem);
  await db.collection('fichasWeb').updateOne(
    { guildId: env.guildId, userId: s.id },
    { $set: { 'trilha.nos': tem, 'trilha.gastos': g, 'trilha.livres': Math.max(0, pontos - g) } },
  ).catch(() => {});
  return json(200, { ok: true, nos: tem, livres: Math.max(0, pontos - g) });
}
