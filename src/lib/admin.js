/**
 * Sala de Testes (2026-11-22, pedido do Silas): painel só do admin para testar o site e o bot com a própria conta.
 *
 * Quem entra: só as contas do Discord listadas em ADMIN_IDS (variável da Vercel, ids separados por vírgula).
 * Sem a variável, a sala não existe para ninguém. A checagem é sempre no servidor: a página e cada rota /api/admin/*
 * respondem 404 a quem não é admin (nem dizem que a sala existe).
 *
 * Os painéis Conta e Personagem mexem só na PRÓPRIA conta (userId da sessão). A única exceção é "Outras contas"
 * (2026-11-27, pedido do Silas): o admin muda os Cristais Prismáticos de outro jogador, e só eles (CAMPOS_OUTRAS).
 * Cada mudança fica em `adminLog` com o valor de antes e o de depois (e quem fez), e pode ser desfeita pelo painel.
 *
 * Onde cada número mora:
 *   contas (por conta do Discord, a mesma dos Cristais e do Altar): cp, inscricoes, fragmentos, altarPity, altarPityE, limites
 *   personagens.estado (personagem aprovado no bot): yuls, meritos, antimeritos, pe, estagio, cristais.{branco,negro,dourado}, manaAtual
 * Mexer em `personagens` também muda `updatedAt`: o bot vê pela escuta (ou pela varredura de 2 min) e refaz a ficha do site.
 */
import { env } from './env.js';
import { sortear, chanceLendario } from './altar.js';
import { altar, raridades, garantia, inscricao } from '../data/altar.js';

/** Ids do Discord com acesso à Sala de Testes. Só números de 17 a 20 dígitos contam. */
export function adminIds() {
  return String(env.adminIds ?? '').split(/[\s,;]+/).filter((x) => /^\d{17,20}$/.test(x));
}

/** A sessão é de um admin? Exige a chave da sessão forte (a mesma regra do login). */
export function ehAdmin(sessao) {
  if (!sessao?.id || env.sessionSecret.length < 32) return false;
  return adminIds().includes(String(sessao.id));
}

/** Campos que o painel pode mexer. `onde` diz a coleção; `min`/`max` são os limites do valor final. */
export const CAMPOS = {
  cp: { onde: 'conta', nome: 'Cristais Prismáticos', min: 0, max: 1_000_000 },
  inscricoes: { onde: 'conta', nome: 'Inscrições', min: 0, max: 10_000 },
  fragmentos: { onde: 'conta', nome: 'Fragmentos de Vestígio', min: 0, max: 100_000 },
  altarPity: { onde: 'conta', nome: 'Giros desde o último Lendário', min: 0, max: garantia.lendario - 1 },
  altarPityE: { onde: 'conta', nome: 'Giros desde o último Épico', min: 0, max: garantia.epico - 1 },
  yuls: { onde: 'pers', caminho: 'estado.yuls', nome: 'Yuls', min: 0, max: 100_000_000 },
  meritos: { onde: 'pers', caminho: 'estado.meritos', nome: 'Méritos', min: 0, max: 100_000 },
  antimeritos: { onde: 'pers', caminho: 'estado.antimeritos', nome: 'Antiméritos', min: 0, max: 10_000 },
  pe: { onde: 'pers', caminho: 'estado.pe', nome: 'Pontos de Evolução', min: 0, max: 100_000 },
  estagio: { onde: 'pers', caminho: 'estado.estagio', nome: 'Estágio', min: 1, max: 9 },
  cristalBranco: { onde: 'pers', caminho: 'estado.cristais.branco', nome: 'Cristais Brancos', min: 0, max: 10_000 },
  cristalNegro: { onde: 'pers', caminho: 'estado.cristais.negro', nome: 'Cristais Negros', min: 0, max: 10_000 },
  cristalDourado: { onde: 'pers', caminho: 'estado.cristais.dourado', nome: 'Cristais Dourados', min: 0, max: 10_000 },
};

/** Atalhos de uma tecla só. */
export const ACOES = {
  'zerar-limites': 'Zerar os limites da Pedra e da Loja',
  'zerar-garantia': 'Zerar a garantia do Altar',
  'encher-mana': 'Encher a Mana',
};

const pega = (doc, caminho) => caminho.split('.').reduce((o, p) => o?.[p], doc);
const conta = (db) => db.collection('contas');
const log = (db) => db.collection('adminLog');

async function personagem(db, quem) {
  return db.collection('personagens').findOne({ guildId: quem.guildId, userId: quem.userId, etapa: 'aprovado', npc: { $ne: true } });
}

/** Valor de agora. Yuls nunca gravados no estado: o bot usa o dinheiro da criação, que a foto do site já traz. */
async function valorAtual(db, quem, campo, docs) {
  const c = CAMPOS[campo];
  if (c.onde === 'conta') return Math.floor(docs.conta?.[campo] ?? 0);
  const v = pega(docs.pers, c.caminho);
  if (v != null) return Number(v);
  if (campo === 'yuls') {
    const f = await db.collection('fichasWeb').findOne({ guildId: quem.guildId, userId: quem.userId }, { projection: { 'moedas.yuls': 1 } });
    return Math.floor(f?.moedas?.yuls ?? 0);
  }
  if (campo === 'estagio') return 9;
  return 0;
}

/** Confere o pedido do navegador. @returns {{ ok: true, campo: string, modo: 'somar'|'definir', valor: number } | { ok: false, erro: string }} */
export function validarAjuste(corpo) {
  const campo = String(corpo?.campo ?? '');
  if (!Object.hasOwn(CAMPOS, campo)) return { ok: false, erro: 'Campo desconhecido.' };
  const modo = corpo?.modo === 'definir' ? 'definir' : corpo?.modo === 'somar' ? 'somar' : null;
  if (!modo) return { ok: false, erro: 'Modo inválido.' };
  const valor = Number(corpo?.valor);
  if (!Number.isSafeInteger(valor)) return { ok: false, erro: 'Use um número inteiro.' };
  if (modo === 'somar' && valor === 0) return { ok: false, erro: 'Somar zero não muda nada.' };
  const motivo = typeof corpo?.motivo === 'string' ? corpo.motivo.slice(0, 80).replace(/[^\p{L}\p{N} .,:()+-]/gu, '') : '';
  return { ok: true, campo, modo, valor, motivo };
}

/**
 * Muda um número de uma conta. Grava só se ninguém mexeu no mesmo campo entre a leitura e a escrita.
 * Sem `opcoes`, é a própria conta do admin. Com `opcoes.por`, é a conta de outro jogador (Outras contas).
 * `opcoes.esperado`: o saldo que o admin viu ao confirmar; se mudou desde então, não grava.
 * @param {{ userId: string, guildId: string, nome?: string }} quem  a conta que muda
 * @param {{ por?: { id: string, nome?: string }, esperado?: number, desfaz?: any }} [opcoes]
 */
export async function ajustar(db, quem, pedido, agora = new Date(), opcoes = {}) {
  const c = CAMPOS[pedido.campo];
  for (let tentativa = 0; tentativa < 3; tentativa++) {
    const docs = {
      conta: c.onde === 'conta' ? await conta(db).findOne({ userId: quem.userId }) : null,
      pers: c.onde === 'pers' ? await personagem(db, quem) : null,
    };
    if (c.onde === 'pers' && !docs.pers) return { ok: false, status: 409, erro: 'Você não tem personagem aprovado no bot: Yuls, Méritos, PE e Estágio moram nele.' };
    const antes = await valorAtual(db, quem, pedido.campo, docs);
    if (opcoes.esperado != null && antes !== opcoes.esperado) {
      return { ok: false, status: 409, erro: `O saldo mudou de ${opcoes.esperado.toLocaleString('pt-BR')} para ${antes.toLocaleString('pt-BR')} desde que você abriu a conta (um giro, uma compra ou outro ajuste). Confira e confirme de novo.`, agora: antes };
    }
    const depois = pedido.modo === 'somar' ? antes + pedido.valor : pedido.valor;
    if (depois < c.min || depois > c.max) return { ok: false, status: 400, erro: `${c.nome} fica entre ${c.min} e ${c.max.toLocaleString('pt-BR')}. Ficaria ${depois.toLocaleString('pt-BR')}.` };
    if (depois === antes) return { ok: false, status: 400, erro: `${c.nome} já está em ${antes.toLocaleString('pt-BR')}.` };

    let gravou = false;
    if (c.onde === 'conta') {
      if (!docs.conta) {
        // conta nova: cria já com o valor (upsert só se ainda não existe)
        const r = await conta(db).updateOne({ userId: quem.userId }, { $setOnInsert: { userId: quem.userId, [pedido.campo]: depois, altarV: 1, criadoEm: agora, atualizadoEm: agora } }, { upsert: true });
        gravou = Boolean(r.upsertedCount);
      } else {
        // altarV é a trava que o Altar e a Loja usam: subir ela faz um giro no meio ler o saldo de novo
        const v = docs.conta.altarV ?? 0;
        const r = await conta(db).updateOne(
          { userId: quem.userId, altarV: v ? v : { $in: [null, 0] }, [pedido.campo]: docs.conta[pedido.campo] ?? { $in: [null] } },
          { $set: { [pedido.campo]: depois, atualizadoEm: agora }, $inc: { altarV: 1 } },
        );
        gravou = r.modifiedCount === 1;
      }
    } else {
      const guardado = pega(docs.pers, c.caminho);
      const r = await db.collection('personagens').updateOne(
        { _id: docs.pers._id, [c.caminho]: guardado ?? { $in: [null] } },
        { $set: { [c.caminho]: depois, updatedAt: agora } },
      );
      gravou = r.modifiedCount === 1;
    }
    if (!gravou) continue; // alguém mexeu no meio: lê de novo
    const registro = { userId: quem.userId, nome: quem.nome ?? null, campo: pedido.campo, onde: c.onde, modo: pedido.modo, valor: pedido.valor, antes, depois, motivo: pedido.motivo || null, em: agora };
    if (opcoes.por) Object.assign(registro, { outra: true, por: { id: opcoes.por.id, nome: opcoes.por.nome ?? null } }, opcoes.desfaz != null ? { desfaz: opcoes.desfaz } : {});
    await log(db).insertOne(registro)
      .catch((e) => console.error('admin (log):', e?.message ?? e));
    return { ok: true, campo: pedido.campo, antes, depois };
  }
  return { ok: false, status: 409, erro: 'O número mudou enquanto eu gravava (um giro ou o bot no meio). Tente de novo.' };
}

/** Atalhos: zerar limites, zerar garantia, encher Mana. */
export async function acao(db, quem, id, agora = new Date()) {
  if (!Object.hasOwn(ACOES, id)) return { ok: false, status: 400, erro: 'Ação desconhecida.' };
  let antes = null, depois = null;
  if (id === 'zerar-limites' || id === 'zerar-garantia') {
    const c = await conta(db).findOne({ userId: quem.userId });
    if (!c) return { ok: false, status: 409, erro: 'Sua conta ainda não existe: dê alguns Cristais primeiro.' };
    if (id === 'zerar-limites') {
      antes = c.limites ?? {}; depois = {};
      await conta(db).updateOne({ userId: quem.userId }, { $set: { limites: {}, atualizadoEm: agora }, $inc: { altarV: 1 } });
    } else {
      antes = { altarPity: c.altarPity ?? 0, altarPityE: c.altarPityE ?? 0 }; depois = { altarPity: 0, altarPityE: 0 };
      await conta(db).updateOne({ userId: quem.userId }, { $set: { ...depois, atualizadoEm: agora }, $inc: { altarV: 1 } });
    }
  } else {
    const p = await personagem(db, quem);
    if (!p) return { ok: false, status: 409, erro: 'Você não tem personagem aprovado no bot.' };
    const f = await db.collection('fichasWeb').findOne({ guildId: quem.guildId, userId: quem.userId }, { projection: { mana: 1 } });
    const max = Math.floor(f?.mana?.max ?? 0);
    if (!max) return { ok: false, status: 409, erro: 'A ficha do site ainda não tem a Mana máxima: use /site no Discord e tente de novo.' };
    antes = p.estado?.manaAtual ?? null; depois = max;
    await db.collection('personagens').updateOne({ _id: p._id }, { $set: { 'estado.manaAtual': max, 'estado.manaEm': agora, updatedAt: agora } });
  }
  await log(db).insertOne({ userId: quem.userId, nome: quem.nome ?? null, acao: id, antes, depois, em: agora }).catch((e) => console.error('admin (log):', e?.message ?? e));
  return { ok: true, acao: id };
}

/* ------------------------------------------------------------------ outras contas (só Cristais Prismáticos) */

/** O que o admin pode mudar na conta de outro jogador. Só CP: o resto mora no bot e tem fluxo próprio. */
export const CAMPOS_OUTRAS = ['cp'];

export const ehIdDiscord = (x) => /^\d{17,20}$/.test(String(x ?? ''));
const escaparRegex = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Nome que aparece para a conta: o do personagem no site, ou nada. */
const nomeDaFicha = (f) => (f ? [f.nome, f.sobrenome].filter(Boolean).join(' ') : null);

/**
 * Procura contas por ID do Discord (exato) ou pelo nome do personagem (pedaço do nome ou do sobrenome).
 * Um ID sem conta nem ficha ainda volta: o CP fica guardado e a pessoa vê quando entrar no site.
 */
export async function buscarContas(db, termo, guildId = env.guildId) {
  const t = String(termo ?? '').trim().slice(0, 40);
  if (ehIdDiscord(t)) {
    const [c, f] = await Promise.all([
      conta(db).findOne({ userId: t }, { projection: { cp: 1 } }),
      db.collection('fichasWeb').findOne({ guildId, userId: t }, { projection: { nome: 1, sobrenome: 1, imagem: 1 } }),
    ]);
    return { ok: true, contas: [{ userId: t, nome: nomeDaFicha(f), imagem: f?.imagem ?? null, cp: Math.floor(c?.cp ?? 0), temConta: Boolean(c) }] };
  }
  if (t.length < 2) return { ok: false, erro: 'Escreva pelo menos 2 letras do nome do personagem, ou o ID do Discord.' };
  const rx = { $regex: escaparRegex(t), $options: 'i' };
  const fichas = await db.collection('fichasWeb').find({ guildId, $or: [{ nome: rx }, { sobrenome: rx }] }, { projection: { userId: 1, nome: 1, sobrenome: 1, imagem: 1 } }).limit(8).toArray();
  const ids = fichas.map((f) => f.userId);
  const contas = ids.length ? await conta(db).find({ userId: { $in: ids } }, { projection: { userId: 1, cp: 1 } }).toArray() : [];
  const porId = new Map(contas.map((c) => [c.userId, c]));
  return { ok: true, contas: fichas.map((f) => ({ userId: f.userId, nome: nomeDaFicha(f), imagem: f.imagem ?? null, cp: Math.floor(porId.get(f.userId)?.cp ?? 0), temConta: porId.has(f.userId) })) };
}

/** Confere o pedido de mudar o CP de outro jogador. `esperado` (o saldo que o admin confirmou) é obrigatório. */
export function validarOutra(corpo) {
  const userId = String(corpo?.userId ?? '');
  if (!ehIdDiscord(userId)) return { ok: false, erro: 'ID do Discord inválido.' };
  const v = validarAjuste({ ...corpo, campo: corpo?.campo ?? 'cp' });
  if (!v.ok) return v;
  if (!CAMPOS_OUTRAS.includes(v.campo)) return { ok: false, erro: 'Em outras contas, só os Cristais Prismáticos podem mudar.' };
  const esperado = Number(corpo?.esperado);
  if (!Number.isSafeInteger(esperado) || esperado < 0) return { ok: false, erro: 'Falta o saldo que você confirmou. Recarregue a conta.' };
  return { ...v, userId, esperado };
}

/** Muda o CP de outro jogador. `admin` é quem está fazendo (vai para o registro). */
export async function ajustarOutra(db, admin, pedido, agora = new Date()) {
  const f = await db.collection('fichasWeb').findOne({ guildId: admin.guildId, userId: pedido.userId }, { projection: { nome: 1, sobrenome: 1 } });
  const alvo = { userId: pedido.userId, guildId: admin.guildId, nome: nomeDaFicha(f) };
  const r = await ajustar(db, alvo, pedido, agora, { por: { id: admin.userId, nome: admin.nome }, esperado: pedido.esperado });
  return r.ok ? { ...r, userId: alvo.userId, nome: alvo.nome } : r;
}

/** O id do registro vem do navegador: vira ObjectId quando tem o formato, senão fica como texto (o banco falso dos testes). */
async function idDoRegistro(id) {
  const t = String(id ?? '');
  if (!/^[a-f\d]{24}$/i.test(t)) return t.slice(0, 40);
  const { ObjectId } = await import('mongodb');
  return new ObjectId(t);
}

/**
 * Desfaz um ajuste de outra conta: devolve a DIFERENÇA (não volta ao número antigo), porque o jogador pode ter
 * gastado ou ganhado CP depois. Cada ajuste só pode ser desfeito uma vez; a marca é gravada antes, para dois
 * cliques não desfazerem duas vezes.
 */
export async function desfazerOutra(db, admin, id, agora = new Date()) {
  const _id = await idDoRegistro(id);
  const l = await log(db).findOne({ _id });
  if (!l || !l.outra || !CAMPOS_OUTRAS.includes(l.campo) || l.desfaz != null) return { ok: false, status: 404, erro: 'Esse ajuste não existe ou não pode ser desfeito.' };
  if (l.desfeitoEm) return { ok: false, status: 409, erro: 'Esse ajuste já foi desfeito.' };
  const diferenca = l.depois - l.antes;
  const marca = await log(db).updateOne({ _id, desfeitoEm: { $in: [null] } }, { $set: { desfeitoEm: agora, desfeitoPor: { id: admin.userId, nome: admin.nome ?? null } } });
  if (marca.modifiedCount !== 1) return { ok: false, status: 409, erro: 'Esse ajuste já foi desfeito.' };
  const alvo = { userId: l.userId, guildId: admin.guildId, nome: l.nome ?? null };
  const r = await ajustar(db, alvo, { campo: l.campo, modo: 'somar', valor: -diferenca, motivo: 'desfazer' }, agora, { por: { id: admin.userId, nome: admin.nome }, desfaz: l._id });
  if (!r.ok) {
    await log(db).updateOne({ _id }, { $set: { desfeitoEm: null, desfeitoPor: null } }).catch(() => null);
    return r.status === 400 ? { ...r, erro: `Não dá para desfazer: ${r.erro} O jogador já gastou parte desses Cristais.` } : r;
  }
  return { ...r, userId: l.userId, nome: l.nome ?? null };
}

/** Os últimos ajustes em outras contas, do mais novo ao mais velho. */
export async function historicoOutras(db, limite = 30) {
  const l = await log(db).find({ outra: true }).sort({ em: -1 }).limit(limite).toArray().catch(() => []);
  return l.map((x) => ({
    id: String(x._id), userId: x.userId, nome: x.nome ?? null, campo: x.campo, antes: x.antes, depois: x.depois,
    motivo: x.motivo ?? null, por: x.por?.nome ?? x.por?.id ?? null, em: iso(x.em),
    desfeitoEm: iso(x.desfeitoEm), desfaz: x.desfaz != null ? String(x.desfaz) : null,
  }));
}

/* ------------------------------------------------------------------ leitura */

const iso = (d) => (d instanceof Date ? d.toISOString() : d ? String(d) : null);
const semId = ({ _id, ...x }) => x;

/** Tudo o que o painel mostra da própria conta: números, a foto da ficha e o histórico. */
export async function painel(db, quem) {
  const [c, p, f, logs, giros, loja, compras] = await Promise.all([
    conta(db).findOne({ userId: quem.userId }),
    personagem(db, quem),
    db.collection('fichasWeb').findOne({ guildId: quem.guildId, userId: quem.userId }, { projection: { _id: 0 } }),
    log(db).find({ userId: quem.userId }).sort({ em: -1 }).limit(40).toArray().catch(() => []),
    db.collection('altarGiros').find({ userId: quem.userId }).sort({ em: -1 }).limit(12).toArray().catch(() => []),
    db.collection('comprasLoja').find({ userId: quem.userId }).sort({ em: -1 }).limit(12).toArray().catch(() => []),
    db.collection('comprasCristais').find({ userId: quem.userId }).sort({ criadoEm: -1 }).limit(12).toArray().catch(() => []),
  ]);
  const valores = {};
  for (const k of Object.keys(CAMPOS)) valores[k] = (CAMPOS[k].onde === 'pers' && !p) ? null : await valorAtual(db, quem, k, { conta: c, pers: p });
  return {
    valores,
    personagem: p ? { nome: f?.nome ?? null, etapa: p.etapa, atualizado: iso(p.updatedAt), mana: p.estado?.manaAtual ?? null } : null,
    ficha: f ? { ...f, atualizadoEm: iso(f.atualizadoEm) } : null,
    conta: c ? {
      cp: c.cp ?? 0, inscricoes: c.inscricoes ?? 0, fragmentos: c.fragmentos ?? 0,
      altarPity: c.altarPity ?? 0, altarPityE: c.altarPityE ?? 0, altarV: c.altarV ?? 0,
      vestigios: c.vestigios ?? {}, limites: c.limites ?? {}, primeiraCompra: c.primeiraCompra ?? null,
      gastos: (c.gastos ?? []).slice(-20).reverse().map((g) => ({ ...g, em: iso(g.em) })),
    } : null,
    historico: {
      admin: logs.map((x) => ({ ...semId(x), id: String(x._id), em: iso(x.em) })),
      altar: giros.map((g) => ({ qtd: g.qtd, cp: g.cp, insc: g.insc, em: iso(g.em), res: (g.res ?? []).map((r) => ({ nome: r.nome, rar: r.rar })) })),
      loja: loja.map((r) => ({ tipo: r.tipo, nome: r.nome, qtd: r.qtd, cp: r.cp, insc: r.insc, em: iso(r.em) })),
      compras: compras.map((r) => ({ id: String(r._id), nome: r.nomePacote, cp: r.cp, valor: r.valor, metodo: r.metodo ?? 'pix', status: r.status, em: iso(r.criadoEm) })),
    },
  };
}

/** Só a foto da ficha (o teste de sincronia pergunta isto a cada segundo). */
export async function fotoDaFicha(db, quem) {
  const f = await db.collection('fichasWeb').findOne({ guildId: quem.guildId, userId: quem.userId }, { projection: { 'moedas.yuls': 1, atualizadoEm: 1 } });
  return f ? { yuls: f.moedas?.yuls ?? null, atualizadoEm: iso(f.atualizadoEm) } : null;
}

/** Saúde do site e do banco. Nunca devolve valores de variáveis: só se estão postas. */
export async function saude(db, envs) {
  const t0 = Date.now();
  let ping = null, erroBanco = null;
  try { await db.command({ ping: 1 }); ping = Date.now() - t0; } catch (e) { erroBanco = String(e?.message ?? e).slice(0, 160); }
  const contar = (n, f = {}) => db.collection(n).countDocuments(f).catch(() => null);
  const desde = new Date(Date.now() - 864e5);
  const [aprovados, fichas, contas, pendentes, girosDia, ultima] = await Promise.all([
    contar('personagens', { guildId: env.guildId, etapa: 'aprovado' }),
    contar('fichasWeb', { guildId: env.guildId }),
    contar('contas'),
    contar('comprasCristais', { status: 'pendente' }),
    contar('altarGiros', { em: { $gte: desde } }),
    db.collection('fichasWeb').find({ guildId: env.guildId }, { projection: { atualizadoEm: 1 } }).sort({ atualizadoEm: -1 }).limit(1).toArray().catch(() => []),
  ]);
  return {
    banco: { ok: ping != null, ping, erro: erroBanco, nome: env.dbName },
    contagens: { aprovados, fichas, contas, pendentes, girosDia },
    ultimaFoto: iso(ultima[0]?.atualizadoEm),
    envs,
  };
}

/* ------------------------------------------------------------------ simulação do Altar (não grava nada) */

export const TETO_SIMULAR = 20_000;

/** "po-de-cristal" → "Pó de Cristal", pelo nome do prêmio do Altar. */
const nomeMaterial = (k) => (altar.premios.raro.find((p) => p.material?.chave === k)?.nome ?? k).replace(/^\d+\s+/, '');

/**
 * Gira `n` vezes no Altar com as regras de verdade (a mesma função `sortear` da invocação), sem tocar no banco.
 * partida 'zero' começa do zero; 'conta' começa da garantia e dos Vestígios atuais da conta.
 */
export function simular(n, inicio = {}, rng = Math.random) {
  const est = { pity: inicio.pity ?? 0, pityE: inicio.pityE ?? 0, vestigios: inicio.vestigios ?? {}, fragmentos: inicio.fragmentos ?? 0 };
  const porRar = { lendario: 0, epico: 0, raro: 0 };
  const porItem = {};
  const intervalos = [];
  let desdeLend = est.pity, maiorSecaEpico = 0, secaE = est.pityE, primeiroLend = null;
  // em blocos de 10 (como o botão ×10), para o estado andar igual ao de verdade
  let feitos = 0, pity = est.pity, pityE = est.pityE, vest = est.vestigios, frag = est.fragmentos;
  const materiais = {};
  while (feitos < n) {
    const q = Math.min(10, n - feitos);
    const s = sortear({ pity, pityE, vestigios: vest, fragmentos: frag }, q, rng);
    for (const r of s.res) {
      feitos += 1; desdeLend += 1; secaE += 1;
      porRar[r.rar] += 1;
      const it = (porItem[r.id] ??= { nome: r.nome, rar: r.rar, n: 0 });
      it.n += 1;
      if (r.rar === 'lendario') { intervalos.push(desdeLend); desdeLend = 0; primeiroLend ??= feitos; }
      if (r.rar !== 'raro') { maiorSecaEpico = Math.max(maiorSecaEpico, secaE); secaE = 0; }
    }
    for (const [k, v] of Object.entries(s.materiais)) materiais[k] = (materiais[k] ?? 0) + v;
    ({ pity, pityE, vestigios: vest, fragmentos: frag } = s);
  }
  const soma = intervalos.reduce((a, b) => a + b, 0);
  return {
    giros: n,
    porRar,
    pct: Object.fromEntries(Object.entries(porRar).map(([k, v]) => [k, n ? Math.round((v / n) * 10000) / 100 : 0])),
    itens: Object.entries(porItem).map(([id, x]) => ({ id, ...x })).sort((a, b) => b.n - a.n),
    lendario: { primeiro: primeiroLend, media: intervalos.length ? Math.round((soma / intervalos.length) * 10) / 10 : null, menor: intervalos.length ? Math.min(...intervalos) : null, maior: intervalos.length ? Math.max(...intervalos) : null },
    maiorSecaEpico,
    fragmentosGanhos: frag - est.fragmentos,
    materiais: Object.fromEntries(Object.entries(materiais).map(([k, n]) => [nomeMaterial(k), n])),
    fim: { pity, pityE },
    // quanto custaria em CP comprando em blocos de 10 (1.440) e o resto avulso (160)
    custoCp: Math.floor(n / 10) * inscricao.cp10 + (n % 10) * inscricao.cp,
    teoria: { lendario: raridades.lendario.chance, epico: raridades.epico.chance, garantia: garantia.lendario, sobeDe: garantia.sobeDe, chanceNoSobe: chanceLendario(garantia.sobeDe) },
    premios: Object.fromEntries(Object.entries(altar.premios).map(([k, l]) => [k, l.length])),
  };
}
