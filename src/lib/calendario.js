/**
 * Calendário de Eventos (2026-11-22, pedido do Silas): a aba Calendário de /eventos/ mostra o que a Staff
 * marca na Sala de Testes (/admin). Mora na coleção `calendario` do banco do bot, um documento por marcação:
 *
 *   { _id, titulo, tipo, data: 'AAAA-MM-DD', fim?: 'AAAA-MM-DD', hora?: 'HH:MM', texto?, link?, publico, criadoEm, atualizadoEm, por }
 *
 * Datas e horas são do horário de Brasília, guardadas como texto (sem fuso para errar).
 * Só o que está `publico: true` aparece no site; o resto é rascunho da Staff.
 */
import { ObjectId } from 'mongodb';

export const TIPOS = {
  evento: { nome: 'Evento', kanji: '祭', cor: '#ff3b2e' },
  cacada: { nome: 'Caçada', kanji: '狩', cor: '#e8a33d' },
  rp: { nome: 'RP de mundo', kanji: '劇', cor: '#9fc7d6' },
  temporada: { nome: 'Temporada', kanji: '季', cor: '#b77bff' },
  atualizacao: { nome: 'Atualização', kanji: '新', cor: '#7ef0a6' },
  staff: { nome: 'Staff', kanji: '司', cor: '#ece6d9' },
};

const DATA = /^(\d{4})-(\d{2})-(\d{2})$/;
const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

/** "2026-11-31" não existe: confere o dia de verdade. */
export function dataValida(s) {
  const m = DATA.exec(String(s ?? ''));
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3] && +m[1] >= 2024 && +m[1] <= 2100;
}

const limpa = (s, n) => String(s ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, n);

/** Link só para dentro do site ("/altar/") ou para o Discord. */
export function linkValido(s) {
  if (!s) return '';
  const t = String(s).trim();
  if (/^\/(?!\/)[\w\-./#?=&%]*$/.test(t)) return t;
  try {
    const u = new URL(t);
    if (u.protocol === 'https:' && /(^|\.)(discord\.com|discord\.gg)$/.test(u.hostname)) return u.href;
  } catch { /* não é URL */ }
  return null;
}

/** Confere o que veio do painel. @returns {{ ok: true, item: object } | { ok: false, erro: string }} */
export function validarItem(x) {
  const titulo = limpa(x?.titulo, 80);
  if (titulo.length < 2) return { ok: false, erro: 'Dê um título ao evento.' };
  const tipo = String(x?.tipo ?? '');
  if (!Object.hasOwn(TIPOS, tipo)) return { ok: false, erro: 'Escolha o tipo.' };
  const data = String(x?.data ?? '');
  if (!dataValida(data)) return { ok: false, erro: 'Data inválida.' };
  const fim = x?.fim ? String(x.fim) : '';
  if (fim && (!dataValida(fim) || fim < data)) return { ok: false, erro: 'O fim precisa ser no mesmo dia ou depois do começo.' };
  if (fim && (Date.parse(fim) - Date.parse(data)) / 864e5 > 120) return { ok: false, erro: 'Um evento dura no máximo 120 dias.' };
  const hora = x?.hora ? String(x.hora) : '';
  if (hora && !HORA.test(hora)) return { ok: false, erro: 'Hora inválida (use 20:30).' };
  const link = linkValido(x?.link);
  if (link === null) return { ok: false, erro: 'O link precisa ser do site (/altar/) ou do Discord.' };
  const item = { titulo, tipo, data, publico: x?.publico !== false };
  if (fim && fim !== data) item.fim = fim;
  if (hora) item.hora = hora;
  const texto = limpa(x?.texto, 500);
  if (texto) item.texto = texto;
  if (link) item.link = link;
  return { ok: true, item };
}

const col = (db) => db.collection('calendario');
const doc = (d) => ({ id: String(d._id), titulo: d.titulo, tipo: d.tipo, data: d.data, ...(d.fim ? { fim: d.fim } : {}), ...(d.hora ? { hora: d.hora } : {}), ...(d.texto ? { texto: d.texto } : {}), ...(d.link ? { link: d.link } : {}), publico: d.publico !== false });

/** Mês "AAAA-MM" → primeiro e último dia ("AAAA-MM-01", "AAAA-MM-31"). */
export function limitesDoMes(mes) {
  const m = /^(\d{4})-(\d{2})$/.exec(String(mes ?? ''));
  if (!m || +m[2] < 1 || +m[2] > 12) return null;
  const ult = new Date(Date.UTC(+m[1], +m[2], 0)).getUTCDate();
  return { de: `${m[1]}-${m[2]}-01`, ate: `${m[1]}-${m[2]}-${String(ult).padStart(2, '0')}` };
}

/** O que aparece no site num mês (inclui eventos que começaram antes e ainda valem). */
export async function doMes(db, mes, { todos = false } = {}) {
  const l = limitesDoMes(mes);
  if (!l) return null;
  const f = { data: { $lte: l.ate }, $or: [{ fim: { $gte: l.de } }, { data: { $gte: l.de } }] };
  if (!todos) f.publico = { $ne: false };
  const l2 = await col(db).find(f).sort({ data: 1, hora: 1 }).limit(300).toArray();
  return l2.map(doc);
}

/** Para o painel: tudo de 60 dias atrás em diante, rascunhos inclusive. */
export async function paraPainel(db, hoje) {
  const de = new Date(Date.parse(`${hoje}T12:00:00Z`) - 60 * 864e5).toISOString().slice(0, 10);
  const l = await col(db).find({ $or: [{ data: { $gte: de } }, { fim: { $gte: de } }] }).sort({ data: 1, hora: 1 }).limit(300).toArray();
  return l.map(doc);
}

/** Cria (sem id) ou regrava (com id). */
export async function salvar(db, quem, entrada, agora = new Date()) {
  const v = validarItem(entrada);
  if (!v.ok) return { ok: false, status: 400, erro: v.erro };
  const unset = Object.fromEntries(['fim', 'hora', 'texto', 'link'].filter((k) => !(k in v.item)).map((k) => [k, '']));
  if (entrada?.id) {
    if (!ObjectId.isValid(String(entrada.id))) return { ok: false, status: 400, erro: 'Marcação inválida.' };
    const _id = new ObjectId(String(entrada.id));
    const antes = await col(db).findOne({ _id });
    if (!antes) return { ok: false, status: 404, erro: 'Essa marcação não existe mais.' };
    await col(db).updateOne({ _id }, { $set: { ...v.item, atualizadoEm: agora, por: quem.userId }, ...(Object.keys(unset).length ? { $unset: unset } : {}) });
    await registrar(db, quem, 'calendario-editar', doc(antes), { id: String(_id), ...v.item }, agora);
    return { ok: true, id: String(_id) };
  }
  const r = await col(db).insertOne({ ...v.item, criadoEm: agora, atualizadoEm: agora, por: quem.userId });
  await registrar(db, quem, 'calendario-criar', null, { id: String(r.insertedId), ...v.item }, agora);
  return { ok: true, id: String(r.insertedId) };
}

export async function apagar(db, quem, id, agora = new Date()) {
  if (!ObjectId.isValid(String(id ?? ''))) return { ok: false, status: 400, erro: 'Marcação inválida.' };
  const _id = new ObjectId(String(id));
  const antes = await col(db).findOne({ _id });
  if (!antes) return { ok: false, status: 404, erro: 'Essa marcação não existe mais.' };
  await col(db).deleteOne({ _id });
  await registrar(db, quem, 'calendario-apagar', doc(antes), null, agora);
  return { ok: true };
}

function registrar(db, quem, acao, antes, depois, em) {
  return db.collection('adminLog').insertOne({ userId: quem.userId, nome: quem.nome ?? null, acao, antes, depois, em }).catch((e) => console.error('calendário (log):', e?.message ?? e));
}

/** Hoje em Brasília, "AAAA-MM-DD". */
export const hojeBR = (agora = new Date()) => new Date(agora.getTime() - 3 * 3600e3).toISOString().slice(0, 10);
