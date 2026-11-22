/**
 * Altar dos Vestígios de verdade (2026-11-21): o sorteio roda no servidor, gasta da conta e entrega.
 *
 * Tudo mora no documento da conta (`contas`, um por conta do Discord, o mesmo dos Cristais):
 *   inscricoes   Inscrições guardadas (gastas antes dos Cristais)
 *   altarPity    giros desde o último Lendário (garantia no 60º)
 *   altarPityE   giros desde o último Épico ou melhor (garantia a cada 10)
 *   altarV       versão do estado do Altar: cada invocação só grava se ninguém mexeu antes (trava otimista)
 *   vestigios    { [id]: { n, em } } o que a conta já tirou (aparece na ficha)
 *   fragmentos   Fragmentos de Vestígio (repetidos e Raros)
 *   gastos[]     { ref, cp, motivo, em }, igual ao bot: a mesma ref nunca cobra duas vezes
 *
 * Materiais (Raros) vão direto para a bolsa do personagem aprovado no bot (`personagens.estado.recursos`),
 * pelo mesmo caminho que o bot usa em mexerRecurso. O histórico de cada invocação fica em `altarGiros`.
 */
import { altar, raridades, garantia, inscricao } from '../data/altar.js';
import { darVisualNoBot } from './visual.js';
import { avisarAltarStaff } from './aviso-staff.js';

export const TETO_INVOCAR = 10;

/** Chance do Lendário no giro n (contando este), com a subida da garantia. */
export function chanceLendario(n) {
  if (n >= garantia.lendario) return 100;
  if (n >= garantia.sobeDe) return raridades.lendario.chance + garantia.passo * (n - garantia.sobeDe + 1);
  return raridades.lendario.chance;
}

/** Quanto custa invocar `qtd` vezes tendo `insc` Inscrições: as Inscrições vão primeiro, o resto sai em CP. */
export function custo(qtd, insc) {
  const usaInsc = Math.min(Math.max(0, Math.floor(insc ?? 0)), qtd);
  const faltam = qtd - usaInsc;
  // 10 de uma vez sai por 1.440 (o preço do pacote); nunca mais caro que isso
  const cp = Math.min(faltam * inscricao.cp, inscricao.cp10);
  return { insc: usaInsc, cp };
}

/**
 * Sorteia `qtd` giros a partir do estado da conta. Puro: não toca no banco.
 * @param {{ pity: number, pityE: number, vestigios: Record<string, { n: number, em?: any }>, fragmentos: number }} est
 * @param {number} qtd
 * @param {() => number} rng  0 ≤ x < 1
 */
export function sortear(est, qtd, rng = Math.random, agora = new Date()) {
  let { pity, pityE, fragmentos } = est;
  const vestigios = structuredClone(est.vestigios ?? {});
  const materiais = {};
  const res = [];
  for (let i = 0; i < qtd; i++) {
    pity += 1; pityE += 1;
    const r = rng() * 100;
    const cl = chanceLendario(pity);
    let rar = 'raro';
    if (r < cl) rar = 'lendario';
    else if (r < cl + raridades.epico.chance || pityE >= garantia.epico) rar = 'epico';
    if (rar === 'lendario') { pity = 0; pityE = 0; }
    if (rar === 'epico') pityE = 0;
    const pool = altar.premios[rar];
    const p = pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))];
    const item = { id: p.id, nome: p.nome, tipo: p.tipo, rar, ...(p.img ? { img: p.img } : {}), ...(p.k ? { k: p.k } : {}) };
    if (p.fragmentos) { fragmentos += p.fragmentos; item.ganho = `+${p.fragmentos} Fragmentos`; }
    else if (p.material) { materiais[p.material.chave] = (materiais[p.material.chave] ?? 0) + p.material.qtd; item.ganho = 'No /inventario do bot, em Recursos'; }
    else if (vestigios[p.id]) {
      // repetido vira Fragmento
      const f = rar === 'lendario' ? 100 : 20;
      fragmentos += f; vestigios[p.id].n += 1; item.repetido = true; item.ganho = `Repetido · +${f} Fragmentos`;
    } else { vestigios[p.id] = { n: 1, em: agora }; item.novo = true; item.ganho = p.bot ? 'Novo · já vestido na sua ficha, no site e no bot' : 'Novo · a Staff libera no Discord'; }
    res.push(item);
  }
  return { res, pity, pityE, fragmentos, vestigios, materiais };
}

const estadoDe = (c) => ({
  cp: Math.floor(c?.cp ?? 0), inscricoes: Math.floor(c?.inscricoes ?? 0),
  pity: c?.altarPity ?? 0, pityE: c?.altarPityE ?? 0, v: c?.altarV ?? 0,
  vestigios: c?.vestigios ?? {}, fragmentos: c?.fragmentos ?? 0,
});

/** O que a tela do Altar mostra: saldo, garantia, Vestígios e o histórico recente. */
export async function estadoAltar(db, userId) {
  const c = await db.collection('contas').findOne({ userId }, { projection: { cp: 1, inscricoes: 1, altarPity: 1, altarPityE: 1, altarV: 1, vestigios: 1, fragmentos: 1 } });
  const e = estadoDe(c);
  const giros = await db.collection('altarGiros').find({ userId }).sort({ em: -1 }).limit(20).toArray().catch(() => []);
  const hist = giros.flatMap((g) => g.res.slice().reverse().map((p) => ({ nome: p.nome, rar: p.rar, em: g.em }))).slice(0, 90);
  return { cp: e.cp, inscricoes: e.inscricoes, pity: e.pity, pityE: e.pityE, fragmentos: e.fragmentos, vestigios: Object.keys(e.vestigios), hist };
}

/**
 * Invoca no Altar. `ref` vem do navegador (um id por clique): repetir a mesma ref devolve o mesmo resultado sem cobrar.
 * @returns {Promise<{ ok: true, res: any[], estado: any, repetido?: boolean } | { ok: false, status: number, erro: string, falta?: { cp: number } }>}
 */
export async function invocar(db, { userId, guildId, qtd, ref }, o = {}) {
  const agora = o.agora ?? new Date();
  const rng = o.rng ?? Math.random;
  if (qtd !== 1 && qtd !== TETO_INVOCAR) return { ok: false, status: 400, erro: 'Invoque 1 ou 10 vezes.' };
  if (typeof ref !== 'string' || !/^[a-z0-9-]{8,64}$/i.test(ref)) return { ok: false, status: 400, erro: 'Pedido inválido.' };
  const chave = `altar:${ref}`;
  const contas = db.collection('contas');
  const giros = db.collection('altarGiros');

  const anterior = await giros.findOne({ userId, ref: chave });
  if (anterior) return { ok: true, repetido: true, res: anterior.res, estado: await estadoAltar(db, userId) };

  const pers = await db.collection('personagens').findOne({ guildId, userId, etapa: 'aprovado' }, { projection: { _id: 1 } });
  if (!pers) return { ok: false, status: 409, erro: 'O Altar entrega na ficha: você precisa de um personagem aprovado no Discord.' };

  for (let tentativa = 0; tentativa < 4; tentativa++) {
    const c = await contas.findOne({ userId });
    const e = estadoDe(c);
    const preco = custo(qtd, e.inscricoes);
    if (e.cp < preco.cp) return { ok: false, status: 402, erro: 'Cristais insuficientes.', falta: { cp: preco.cp - e.cp } };
    const s = sortear(e, qtd, rng, agora);
    const filtro = { userId, altarV: e.v ? e.v : { $in: [null, 0] }, 'gastos.ref': { $ne: chave } };
    if (preco.cp) filtro.cp = { $gte: preco.cp };
    if (preco.insc) filtro.inscricoes = { $gte: preco.insc };
    const feito = await contas.findOneAndUpdate(filtro, {
      $inc: { cp: -preco.cp, inscricoes: -preco.insc, altarV: 1 },
      $set: { altarPity: s.pity, altarPityE: s.pityE, fragmentos: s.fragmentos, vestigios: s.vestigios, atualizadoEm: agora },
      $push: { gastos: { ref: chave, cp: preco.cp, motivo: `Altar dos Vestígios ×${qtd}${preco.insc ? ` (${preco.insc} Inscrições)` : ''}`, em: agora } },
    }, { returnDocument: 'after' });
    if (!feito) {
      const ja = await giros.findOne({ userId, ref: chave });
      if (ja) return { ok: true, repetido: true, res: ja.res, estado: await estadoAltar(db, userId) };
      continue; // outra invocação gravou antes: sorteia de novo com o estado novo
    }
    // materiais dos Raros: direto nos Recursos do personagem, que o /inventario mostra (mesmo caminho do mexerRecurso do bot)
    const inc = Object.fromEntries(Object.entries(s.materiais).map(([k, n]) => [`estado.recursos.${k}`, n]));
    if (Object.keys(inc).length) {
      await db.collection('personagens').updateOne({ _id: pers._id }, { $inc: inc })
        .catch((err) => console.error('altar (materiais):', userId, JSON.stringify(s.materiais), err?.message ?? err));
    }
    // visuais novos: vão para a aba Visual do bot (coleção `visuais`), e o primeiro de cada tipo já fica equipado
    for (const x of s.res.filter((r) => r.novo)) {
      const p = [...altar.premios.lendario, ...altar.premios.epico].find((y) => y.id === x.id);
      if (p?.bot) await darVisualNoBot(db, { guildId, userId }, p.bot).catch((err) => console.error('altar (visual):', userId, p.id, err?.message ?? err));
    }
    // o que o site não entrega sozinho (o emote): avisa a Staff no canal de logs
    const manuais = s.res.filter((r) => r.novo && ![...altar.premios.lendario, ...altar.premios.epico].find((y) => y.id === r.id)?.bot).map((r) => r.nome);
    if (manuais.length) await (o.avisar ?? avisarAltarStaff)(userId, manuais).catch(() => {});
    await giros.insertOne({ userId, guildId, ref: chave, qtd, cp: preco.cp, insc: preco.insc, res: s.res, materiais: s.materiais, em: agora })
      .catch((err) => console.error('altar (histórico):', err?.message ?? err));
    return { ok: true, res: s.res, estado: await estadoAltar(db, userId) };
  }
  return { ok: false, status: 409, erro: 'Muitas invocações ao mesmo tempo. Tente de novo.' };
}

/** Vestígios da conta para a ficha: os itens do Altar que ela tem, do mais raro ao mais comum. */
export async function vestigiosDaConta(db, userId) {
  const c = await db.collection('contas').findOne({ userId }, { projection: { vestigios: 1, fragmentos: 1 } });
  const tem = c?.vestigios ?? {};
  const ordem = ['lendario', 'epico', 'raro'];
  const lista = ordem.flatMap((rar) => altar.premios[rar].filter((p) => tem[p.id]).map((p) => ({ ...p, rar, n: tem[p.id].n })));
  return { lista, fragmentos: c?.fragmentos ?? 0 };
}

