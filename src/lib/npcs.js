/**
 * Arquivo de NPCs da Staff (2026-11-22, pedido do Silas): os dossiês dos NPCs são SÓ da Staff.
 *
 * O repositório do site é público, então nenhum NPC mora no código: tudo fica na coleção `npcsStaff`
 * do banco do bot e só sai pela rota /api/admin/npcs, que confere ADMIN_IDS a cada pedido (404 para os outros).
 *
 *   { _id: 'edmund-kreutz', grupo, nome, alcunha?, papel?, kanji?, cor?, campos: [{ r, v, segredo? }], falas: [], ordem,
 *     criadoEm, atualizadoEm, por }
 *
 * Campo com v vazio ou "[A DEFINIR]" aparece no painel como mistério. segredo: true marca o que nem os jogadores sabem.
 */

const limpa = (s, n) => String(s ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, n);
const limpaTexto = (s, n) => String(s ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').replace(/\r\n?/g, '\n').trim().slice(0, n);

export const LIMITES = { campos: 24, falas: 8, npcs: 300, rotulo: 48, valor: 2000, fala: 400 };

export const slugDe = (t) => String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);

/** Confere um NPC vindo do painel. @returns {{ ok: true, npc } | { ok: false, erro }} */
export function validarNpc(x) {
  if (!x || typeof x !== 'object') return { ok: false, erro: 'NPC inválido.' };
  const nome = limpa(x.nome, 80);
  if (nome.length < 2) return { ok: false, erro: 'Dê um nome ao NPC.' };
  const id = slugDe(x.id || nome);
  if (!id) return { ok: false, erro: 'Nome sem letras.' };
  const grupo = limpa(x.grupo, 60) || 'Sem grupo';
  const cor = /^#[0-9a-f]{6}$/i.test(String(x.cor ?? '')) ? String(x.cor).toLowerCase() : '';
  const kanji = limpa(x.kanji, 2);
  if (x.campos != null && !Array.isArray(x.campos)) return { ok: false, erro: 'Campos precisam ser uma lista.' };
  if (x.falas != null && !Array.isArray(x.falas)) return { ok: false, erro: 'Falas precisam ser uma lista.' };
  const campos = (x.campos ?? []).slice(0, LIMITES.campos).map((c) => ({ r: limpa(c?.r, LIMITES.rotulo), v: limpaTexto(c?.v, LIMITES.valor), ...(c?.segredo ? { segredo: true } : {}) })).filter((c) => c.r);
  const falas = (x.falas ?? []).slice(0, LIMITES.falas).map((f) => limpaTexto(f, LIMITES.fala)).filter(Boolean);
  const ordem = Number.isFinite(+x.ordem) ? Math.max(0, Math.min(9999, Math.trunc(+x.ordem))) : 0;
  const npc = { id, grupo, nome, campos, falas, ordem };
  for (const [k, n] of [['alcunha', 60], ['papel', 120]]) { const v = limpa(x[k], n); if (v) npc[k] = v; }
  if (kanji) npc.kanji = kanji;
  if (cor) npc.cor = cor;
  return { ok: true, npc };
}

const col = (db) => db.collection('npcsStaff');
const doc = (d) => {
  const { _id, criadoEm, por, ...resto } = d;
  return { id: String(_id), ...resto, atualizadoEm: d.atualizadoEm ? new Date(d.atualizadoEm).toISOString() : null };
};

export async function listar(db) {
  const l = await col(db).find({}).sort({ grupo: 1, ordem: 1, nome: 1 }).limit(LIMITES.npcs).toArray();
  return l.map(doc);
}

/** Cria ou regrava pelo id (slug). antigo = id de antes, quando o nome mudou. */
export async function salvar(db, quem, entrada, agora = new Date()) {
  const v = validarNpc(entrada);
  if (!v.ok) return { ok: false, status: 400, erro: v.erro };
  const { id, ...dados } = v.npc;
  const antigo = entrada?.antigo ? slugDe(entrada.antigo) : '';
  const unset = Object.fromEntries(['alcunha', 'papel', 'kanji', 'cor'].filter((k) => !(k in dados)).map((k) => [k, '']));
  const antes = await col(db).findOne({ _id: antigo || id });
  if (!antes && (await col(db).countDocuments({})) >= LIMITES.npcs) return { ok: false, status: 400, erro: `O arquivo guarda no máximo ${LIMITES.npcs} NPCs.` };
  if (antigo && antigo !== id) {
    if (await col(db).findOne({ _id: id })) return { ok: false, status: 409, erro: 'Já existe um NPC com esse nome.' };
    if (antes) await col(db).deleteOne({ _id: antigo });
  }
  await col(db).updateOne(
    { _id: id },
    { $set: { ...dados, atualizadoEm: agora, por: quem.userId }, $setOnInsert: { criadoEm: antes?.criadoEm ?? agora }, ...(Object.keys(unset).length ? { $unset: unset } : {}) },
    { upsert: true },
  );
  await registrar(db, quem, antes ? 'npc-editar' : 'npc-criar', antes ? { id: String(antes._id), nome: antes.nome } : null, { id, nome: dados.nome }, agora);
  return { ok: true, id };
}

export async function apagar(db, quem, id, agora = new Date()) {
  const _id = slugDe(id);
  const antes = _id && await col(db).findOne({ _id });
  if (!antes) return { ok: false, status: 404, erro: 'Esse NPC não existe mais.' };
  await col(db).deleteOne({ _id });
  // o log guarda o NPC inteiro, para dar para recuperar à mão se apagar sem querer
  await registrar(db, quem, 'npc-apagar', doc(antes), null, agora);
  return { ok: true };
}

/** Importa uma lista (o arquivo JSON da Staff). Regrava quem tem o mesmo id; não apaga ninguém. */
export async function importar(db, quem, lista, agora = new Date()) {
  if (!Array.isArray(lista) || !lista.length) return { ok: false, status: 400, erro: 'O arquivo precisa ter uma lista de NPCs.' };
  if (lista.length > LIMITES.npcs) return { ok: false, status: 400, erro: `No máximo ${LIMITES.npcs} NPCs por vez.` };
  const bons = [];
  for (const [i, x] of lista.entries()) {
    const v = validarNpc(x);
    if (!v.ok) return { ok: false, status: 400, erro: `NPC nº ${i + 1}${x?.nome ? ` (${limpa(x.nome, 40)})` : ''}: ${v.erro}` };
    bons.push(v.npc);
  }
  const ids = new Set(bons.map((n) => n.id));
  if (ids.size !== bons.length) return { ok: false, status: 400, erro: 'Há dois NPCs com o mesmo nome no arquivo.' };
  const ja = await col(db).countDocuments({ _id: { $nin: [...ids] } });
  if (ja + bons.length > LIMITES.npcs) return { ok: false, status: 400, erro: `O arquivo guarda no máximo ${LIMITES.npcs} NPCs.` };
  await col(db).bulkWrite(bons.map(({ id, ...dados }) => {
    const unset = Object.fromEntries(['alcunha', 'papel', 'kanji', 'cor'].filter((k) => !(k in dados)).map((k) => [k, '']));
    return { updateOne: { filter: { _id: id }, update: { $set: { ...dados, atualizadoEm: agora, por: quem.userId }, $setOnInsert: { criadoEm: agora }, ...(Object.keys(unset).length ? { $unset: unset } : {}) }, upsert: true } };
  }));
  await registrar(db, quem, 'npc-importar', null, { total: bons.length }, agora);
  return { ok: true, total: bons.length };
}

function registrar(db, quem, acao, antes, depois, em) {
  return db.collection('adminLog').insertOne({ userId: quem.userId, nome: quem.nome ?? null, acao, antes, depois, em }).catch((e) => console.error('npcs (log):', e?.message ?? e));
}
