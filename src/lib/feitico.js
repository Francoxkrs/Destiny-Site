// Escrever feitiço pelo site (2026-11-28). O site confere o pedido com o que o bot mandou na ficha (`fichasWeb.escrita`)
// e grava em `pedidosFeitico`; o bot pega em até 15 s, cria o feitiço pelas mesmas regras do /feitiço e posta no
// fórum do Conselho Mágico com Aprovar e Recusar. Contrato no bot: functions/portal/escrita.ts e pedidos-feitico.ts.
import { Binary, ObjectId } from 'mongodb';

import { LIMITES, MAX_IMAGEM, POR_DIA, custoDe, tipoImagem, txt } from './feitico-regras.js';
export { LIMITES, MAX_IMAGEM, POR_DIA, custoDe, tipoImagem };

/** @typedef {import('./feitico-regras.js').Escrita} Escrita */

/**
 * Confere o pedido com a escrita da ficha. Devolve os dados limpos ou o erro, igual ao que o jogador vê.
 * @param {Record<string, unknown>} corpo
 * @param {Escrita | undefined} e
 */
export function validarPedido(corpo, e) {
  if (!e) return { erro: 'A sua ficha ainda não tem o Grimório no site. Use /site no Discord e tente de novo.' };
  if (!e.pode) return { erro: e.motivo || 'Esta ficha não escreve feitiços agora.' };
  const L = { ...LIMITES, ...(e.limites ?? {}) };
  const d = {
    nome: txt(corpo.nome, L.nome), tipo: txt(corpo.tipo, 40), funcao: txt(corpo.funcao, 40), funcao2: txt(corpo.funcao2, 40) || null,
    sustentado: corpo.sustentado === true || corpo.sustentado === 'on' || corpo.sustentado === '1',
    encantamento: txt(corpo.encantamento, L.encantamento) || null, efeito: txt(corpo.efeito, L.efeito),
    duracao: txt(corpo.duracao, L.duracao) || null, alcance: txt(corpo.alcance, L.alcance) || null,
  };
  if (!d.nome) return { erro: 'O feitiço precisa de um nome.' };
  const tipo = e.tipos.find((t) => t.nome === d.tipo);
  if (!tipo) return { erro: 'Escolha o Tipo do feitiço.' };
  if (!tipo.liberado) return { erro: `O Tipo ${tipo.nome} exige Conhecimento em ${(tipo.exige ?? []).join(' ou ')}.` };
  for (const nome of [d.funcao, d.funcao2].filter(Boolean)) {
    const fn = e.funcoes.find((x) => x.nome === nome);
    if (!fn) return { erro: 'Escolha a Função do feitiço.' };
    if (!fn.liberado) return { erro: `A Função ${fn.nome} exige Conhecimento em ${(fn.exige ?? []).join(' ou ')}.` };
  }
  if (!d.funcao) return { erro: 'Escolha a Função do feitiço.' };
  if (d.funcao2 && !e.costurado) return { erro: 'Só o Grimório Costurado tem duas Funções por feitiço.' };
  if (d.funcao2 && d.funcao2 === d.funcao) return { erro: 'As duas Funções precisam ser diferentes.' };
  if (d.efeito.length < L.efeitoMin) return { erro: `Descreva melhor o efeito (${L.efeitoMin} caracteres ou mais).` };
  return { dados: d };
}

const projecao = { 'imagem.dados': 0 };

/** Os pedidos recentes da conta, do mais novo para o mais velho (sem os bytes da imagem). */
export async function pedidosDe(db, guildId, userId, limite = 8) {
  const xs = await db.collection('pedidosFeitico').find({ guildId, userId }, { projection: projecao }).sort({ criadoEm: -1 }).limit(limite).toArray();
  return xs.map((p) => ({
    id: String(p._id), nome: p.dados?.nome ?? 'Feitiço', status: p.status, erro: p.erro ?? null, threadId: p.threadId ?? null,
    criadoEm: p.criadoEm, comImagem: Boolean(p.imagem?.tipo),
  }));
}

/**
 * Grava o pedido (o bot posta). Confere o limite do dia e as páginas livres contando os pedidos que ainda não chegaram ao bot.
 * @param {{ dados: object, imagem?: { bytes: Uint8Array, nome: string } | null }} p
 */
export async function criarPedido(db, guildId, userId, escrita, p) {
  const col = db.collection('pedidosFeitico');
  const desde = new Date(Date.now() - 864e5);
  const [hoje, esperando] = await Promise.all([
    col.countDocuments({ guildId, userId, criadoEm: { $gte: desde } }),
    col.countDocuments({ guildId, userId, status: { $in: ['novo', 'processando'] } }),
  ]);
  if (hoje >= POR_DIA) return { status: 429, erro: `Você já mandou ${POR_DIA} feitiços nas últimas 24 horas. Espere o Conselho ler esses.` };
  if (esperando >= Math.max(0, escrita.livres)) return { status: 409, erro: 'Não sobrou página livre: os feitiços que você já mandou ocupam o resto do Grimório.' };
  let imagem = null;
  if (p.imagem) {
    const tipo = tipoImagem(p.imagem.bytes);
    if (!tipo) return { status: 400, erro: 'Mande uma imagem PNG, JPG, WEBP ou GIF.' };
    imagem = { dados: new Binary(Buffer.from(p.imagem.bytes)), nome: String(p.imagem.nome || 'feitico').replace(/[^\w.-]+/g, '-').slice(0, 60), tipo };
  }
  const doc = { _id: new ObjectId(), guildId, userId, status: 'novo', dados: p.dados, criadoEm: new Date(), origem: 'site', ...(imagem ? { imagem } : {}) };
  await col.insertOne(doc);
  return { status: 200, id: String(doc._id) };
}
