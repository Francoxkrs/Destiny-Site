/**
 * Visual da ficha (2026-11-21): o site usa a MESMA coleção do bot, `visuais` ({ guildId, userId, tem, ativo }),
 * a da aba Visual da /ficha (functions/passe/servico.ts no bot). Assim o que se equipa no site aparece no bot e vice-versa,
 * e os cosméticos do Passe e os do Altar ficam juntos.
 *   tem:   { titulos: string[], molduras: [], fundos: [], tintas: [], capas: [], selos: [], murais: [] }
 *   ativo: { titulo, moldura, fundo, tinta, capa }  (selo e mural não se equipam: valem por ter)
 */
import { altar } from '../data/altar.js';

/** tipo da lista → campo do equipado (igual ao ATIVO_DO_TIPO do bot) */
export const ATIVO_DO_TIPO = { titulos: 'titulo', molduras: 'moldura', fundos: 'fundo', tintas: 'tinta', capas: 'capa' };
const TIPO_DO_ATIVO = Object.fromEntries(Object.entries(ATIVO_DO_TIPO).map(([t, a]) => [a, t]));

/** Nome de cada peça para a tela (o id é o que fica no banco; título é o próprio texto). */
export const NOME_VISUAL = {
  'moldura:miasma': 'Moldura do Miasma', 'fundo:fossa-miasma': 'Fossa do Miasma', 'tinta:dourada': 'Tinta dourada',
  'tinta:negra': 'Tinta Negra', 'capa:miasma': 'Capa do Miasma',
};
export const ROTULO_ATIVO = { titulo: 'Título', moldura: 'Moldura', fundo: 'Fundo', tinta: 'Tinta', capa: 'Capa' };
export const nomeVisual = (ativo, id) => (ativo === 'titulo' ? id : NOME_VISUAL[`${ativo}:${id}`] ?? id);

const col = (db) => db.collection('visuais');

/** Dá uma peça na aba Visual do bot; a primeira de um tipo já fica equipada (igual ao darVisual do bot). */
export async function darVisualNoBot(db, { guildId, userId }, { tipo, id }, agora = new Date()) {
  await col(db).updateOne({ guildId, userId }, { $addToSet: { [`tem.${tipo}`]: id }, $setOnInsert: { guildId, userId, createdAt: agora }, $set: { updatedAt: agora } }, { upsert: true });
  const ativo = ATIVO_DO_TIPO[tipo];
  if (ativo) await col(db).updateOne({ guildId, userId, $or: [{ [`ativo.${ativo}`]: null }, { [`ativo.${ativo}`]: { $exists: false } }] }, { $set: { [`ativo.${ativo}`]: id } });
}

/** O visual da conta: o que tem (por encaixe, com nome) e o que está equipado. */
export async function visualDaConta(db, { guildId, userId }) {
  const v = await col(db).findOne({ guildId, userId }, { projection: { tem: 1, ativo: 1 } });
  const tem = v?.tem ?? {};
  const pecas = Object.entries(ATIVO_DO_TIPO).flatMap(([tipo, ativo]) => (tem[tipo] ?? []).map((id) => ({ ativo, id, nome: nomeVisual(ativo, id), eq: v?.ativo?.[ativo] === id })));
  const ativo = Object.fromEntries(Object.entries(v?.ativo ?? {}).filter(([a, id]) => id && TIPO_DO_ATIVO[a] && (tem[TIPO_DO_ATIVO[a]] ?? []).includes(id)));
  return { pecas, ativo, selos: tem.selos ?? [] };
}

/** Equipa (ou tira, com null) uma peça que a conta tem. */
export async function equiparVisual(db, { guildId, userId }, ativo, id) {
  const tipo = TIPO_DO_ATIVO[ativo];
  if (!tipo) return { ok: false, status: 400, erro: 'Esse encaixe não existe.' };
  if (id == null) { await col(db).updateOne({ guildId, userId }, { $set: { [`ativo.${ativo}`]: null } }); return { ok: true, visual: await visualDaConta(db, { guildId, userId }) }; }
  const r = await col(db).updateOne({ guildId, userId, [`tem.${tipo}`]: id }, { $set: { [`ativo.${ativo}`]: id } });
  if (!r.matchedCount) return { ok: false, status: 403, erro: 'Você ainda não tem essa peça.' };
  return { ok: true, visual: await visualDaConta(db, { guildId, userId }) };
}

/** Provador: a peça do Altar com esse id, como encaixe { ativo, id } (ou null). */
export function provadorDe(premioId) {
  const p = [...altar.premios.lendario, ...altar.premios.epico].find((x) => x.id === premioId && x.bot);
  if (!p) return null;
  const ativo = ATIVO_DO_TIPO[p.bot.tipo];
  return { premio: p, ativo: ativo ?? null, id: p.bot.id, selo: p.bot.tipo === 'selos' };
}
