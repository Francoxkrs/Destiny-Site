/**
 * Pedra do Destino e Loja da conta (2026-11-21): o site cobra e o item cai na /bolsa do bot.
 *
 * O site não gira nada aqui. Ele entrega o item (Giro de Magia, Reroll de Raça, Skip Treino...) e o jogador
 * usa no bot, que confere as chances, as vagas e as regras de sempre.
 *
 * Cobrança na conta (`contas`, a mesma dos Cristais e do Altar):
 *   - Pedra: gasta Inscrições primeiro; o que faltar sai em CP (160 por Inscrição). Itens com `so: 'inscricao'`
 *     só saem com Inscrições (Milagre e Linhagem estão no muro do "nunca à venda").
 *   - Loja: só CP.
 *   - `altarV` é a mesma trava otimista do Altar: dois gastos ao mesmo tempo nunca leem o mesmo saldo.
 *   - `limites` conta o que já foi comprado por personagem (e por temporada ou semana).
 *   - `gastos[]` guarda a ref: a mesma ref nunca cobra duas vezes. O recibo fica em `comprasLoja`.
 *
 * Entrega: `bolsas` do bot (`{ guildId, userId, itens, recebido, historico }`), mesmo formato do darItens do bot.
 */
import { pedra, inscricao } from '../data/altar.js';
import { loja } from '../data/cristais.js';

export const TEMPORADA = 't1';

/** Segunda-feira da semana (horário de Brasília) em "2026-11-16": a semana do limite do Skip Treino. */
export function semanaDe(agora = new Date()) {
  const br = new Date(agora.getTime() - 3 * 3600e3);
  const dia = (br.getUTCDay() + 6) % 7; // 0 = segunda
  const seg = new Date(Date.UTC(br.getUTCFullYear(), br.getUTCMonth(), br.getUTCDate() - dia));
  return seg.toISOString().slice(0, 10);
}

/** O que pode ser comprado aqui: giros da Pedra e itens da Loja com entrega na bolsa. */
export function ofertaDe(tipo, id) {
  if (tipo === 'pedra') {
    const g = pedra.giros.find((x) => x.chave === id);
    return g ? { tipo, id: g.chave, chave: g.chave, nome: g.nome, insc: g.custo, so: g.so ?? null, max: g.limite, por: 'temporada' } : null;
  }
  if (tipo === 'loja') {
    const i = loja.find((x) => x.id === id && x.chave);
    return i ? { tipo, id: i.id, chave: i.chave, nome: i.nome, cp: i.cp, max: i.max ?? null, por: i.por ?? null } : null;
  }
  return null;
}

/** Preço da oferta para quem tem `insc` Inscrições. */
export function precoDe(o, insc) {
  if (o.tipo === 'loja') return { insc: 0, cp: o.cp };
  const usa = Math.min(Math.max(0, Math.floor(insc ?? 0)), o.insc);
  const faltam = o.insc - usa;
  if (faltam && o.so === 'inscricao') return { insc: usa, cp: null, faltamInsc: faltam };
  return { insc: usa, cp: faltam * inscricao.cp };
}

/** Chave do limite: por personagem e por temporada (Pedra) ou por semana (Skip Treino). Só letras, números, - e _. */
export function chaveLimite(o, persId, agora = new Date()) {
  if (!o.max) return null;
  const quando = o.por === 'semana' ? `s${semanaDe(agora)}` : o.por === 'temporada' ? TEMPORADA : 'sempre';
  return `${quando}_${persId}_${o.chave}`.replace(/[^a-zA-Z0-9_-]/g, '');
}

const contaDe = (c) => ({ cp: Math.floor(c?.cp ?? 0), insc: Math.floor(c?.inscricoes ?? 0), v: c?.altarV ?? 0, limites: c?.limites ?? {} });

/** Quanto falta de cada limite para a tela (Pedra e Loja). */
export async function limitesDaConta(db, { userId, guildId }, agora = new Date()) {
  const c = await db.collection('contas').findOne({ userId }, { projection: { cp: 1, inscricoes: 1, limites: 1 } });
  const pers = await db.collection('personagens').findOne({ guildId, userId }, { projection: { _id: 1 } });
  const persId = String(pers?._id ?? 'novo');
  const conta = contaDe(c);
  const usados = {};
  for (const g of pedra.giros) usados[`pedra:${g.chave}`] = conta.limites[chaveLimite(ofertaDe('pedra', g.chave), persId, agora)] ?? 0;
  for (const i of loja.filter((x) => x.chave)) { const o = ofertaDe('loja', i.id); if (o.max) usados[`loja:${i.id}`] = conta.limites[chaveLimite(o, persId, agora)] ?? 0; }
  return { cp: conta.cp, inscricoes: conta.insc, usados };
}

/** Põe itens na bolsa do jogador no bot (cria a bolsa se ainda não existe). */
export async function darNaBolsa(db, { guildId, userId }, itens, texto, agora = new Date()) {
  const inc = {};
  for (const [k, n] of Object.entries(itens)) { inc[`itens.${k}`] = n; inc[`recebido.${k}`] = n; }
  await db.collection('bolsas').updateOne(
    { guildId, userId },
    {
      $inc: inc,
      $set: { updatedAt: agora },
      $setOnInsert: { guildId, userId, salvos: [], pacotes: [], createdAt: agora },
      $push: { historico: { $each: [{ em: agora, texto, por: 'site' }], $slice: -80 } },
    },
    { upsert: true },
  );
}

/**
 * Compra uma oferta: cobra e entrega na bolsa. A mesma `ref` nunca cobra duas vezes.
 * @returns {Promise<{ ok: true, recibo: any, conta: any, repetido?: boolean } | { ok: false, status: number, erro: string, falta?: any }>}
 */
export async function comprar(db, { userId, guildId, tipo, id, ref }, o = {}) {
  const agora = o.agora ?? new Date();
  const of = ofertaDe(tipo, id);
  if (!of) return { ok: false, status: 400, erro: 'Esse item não está à venda.' };
  if (typeof ref !== 'string' || !/^[a-z0-9-]{8,64}$/i.test(ref)) return { ok: false, status: 400, erro: 'Pedido inválido.' };
  const chave = `${tipo}:${ref}`;
  const contas = db.collection('contas');
  const recibos = db.collection('comprasLoja');

  const ja = await recibos.findOne({ userId, ref: chave });
  if (ja) return { ok: true, repetido: true, recibo: ja, conta: await limitesDaConta(db, { userId, guildId }, agora) };

  const pers = await db.collection('personagens').findOne({ guildId, userId }, { projection: { _id: 1 } });
  const persId = String(pers?._id ?? 'novo');
  const lim = chaveLimite(of, persId, agora);

  for (let tentativa = 0; tentativa < 4; tentativa++) {
    const c = contaDe(await contas.findOne({ userId }));
    if (lim && (c.limites[lim] ?? 0) >= of.max) {
      const quando = of.por === 'semana' ? 'nesta semana' : of.por === 'temporada' ? 'nesta temporada' : 'para este personagem';
      return { ok: false, status: 409, erro: `Você já pegou o máximo de ${of.nome} ${quando} (${of.max}).` };
    }
    const preco = precoDe(of, c.insc);
    if (preco.cp === null) return { ok: false, status: 402, erro: `${of.nome} só sai com Inscrições ganhas jogando. Faltam ${preco.faltamInsc}.`, falta: { insc: preco.faltamInsc } };
    if (c.cp < preco.cp) return { ok: false, status: 402, erro: 'Cristais insuficientes.', falta: { cp: preco.cp - c.cp } };

    const filtro = { userId, altarV: c.v ? c.v : { $in: [null, 0] }, 'gastos.ref': { $ne: chave } };
    const inc = { altarV: 1 };
    if (preco.cp) { filtro.cp = { $gte: preco.cp }; inc.cp = -preco.cp; }
    if (preco.insc) { filtro.inscricoes = { $gte: preco.insc }; inc.inscricoes = -preco.insc; }
    if (lim) inc[`limites.${lim}`] = 1;
    const motivo = `${tipo === 'pedra' ? 'Pedra do Destino' : 'Loja'}: ${of.nome}${preco.insc ? ` (${preco.insc} Inscrições)` : ''}`;
    const feito = await contas.findOneAndUpdate(filtro, { $inc: inc, $set: { atualizadoEm: agora }, $push: { gastos: { ref: chave, cp: preco.cp, insc: preco.insc, motivo, em: agora } } }, { returnDocument: 'after' });
    if (!feito) {
      const r = await recibos.findOne({ userId, ref: chave });
      if (r) return { ok: true, repetido: true, recibo: r, conta: await limitesDaConta(db, { userId, guildId }, agora) };
      if (!(await contas.findOne({ userId }))) return { ok: false, status: 402, erro: 'Cristais insuficientes.', falta: { cp: preco.cp } };
      continue; // outro gasto entrou antes: confere de novo com o saldo novo
    }
    try {
      await darNaBolsa(db, { guildId, userId }, { [of.chave]: 1 }, `${motivo} (site)`, agora);
    } catch (e) {
      // não entregou: devolve tudo (CP, Inscrições, limite) e tira a ref, para poder tentar de novo
      const volta = { altarV: 1 };
      if (preco.cp) volta.cp = preco.cp;
      if (preco.insc) volta.inscricoes = preco.insc;
      if (lim) volta[`limites.${lim}`] = -1;
      await contas.updateOne({ userId, 'gastos.ref': chave }, { $inc: volta, $pull: { gastos: { ref: chave } } }).catch(() => null);
      console.error('loja (bolsa):', userId, of.chave, e?.message ?? e);
      return { ok: false, status: 503, erro: 'Não consegui pôr o item na sua /bolsa agora. Nada foi cobrado. Tente de novo.' };
    }
    const recibo = { userId, guildId, ref: chave, tipo, id: of.id, chave: of.chave, nome: of.nome, cp: preco.cp, insc: preco.insc, em: agora };
    await recibos.insertOne(recibo).catch((e) => console.error('loja (recibo):', e?.message ?? e));
    return { ok: true, recibo, conta: await limitesDaConta(db, { userId, guildId }, agora) };
  }
  return { ok: false, status: 409, erro: 'Muitas compras ao mesmo tempo. Tente de novo.' };
}
