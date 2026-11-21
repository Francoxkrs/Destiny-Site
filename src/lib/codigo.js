// Entrar pelo bot: o /site cria um código de uso único (10 min) e guarda só o sha256 em `acessosWeb`.
// Ler não gasta o código (a página de confirmação mostra o nome); só o POST de entrar gasta.
import { createHash } from 'node:crypto';
import { banco } from './db.js';
import { env } from './env.js';

const formato = (c) => typeof c === 'string' && /^[A-Za-z0-9_-]{20,64}$/.test(c);
const hash = (c) => createHash('sha256').update(c).digest('hex');
const filtro = (c) => ({ hash: hash(c), usadoEm: null, expiraEm: { $gt: new Date() }, ...(env.guildId ? { guildId: env.guildId } : {}) });

/** @returns {Promise<{ nome: string, avatar: string | null } | null>} */
export async function verCodigo(codigo) {
  if (!formato(codigo)) return null;
  const db = await banco().catch(() => null);
  if (!db) return null;
  const a = await db.collection('acessosWeb').findOne(filtro(codigo), { projection: { nome: 1, avatar: 1 } }).catch(() => null);
  return a ? { nome: String(a.nome), avatar: a.avatar ?? null } : null;
}

/** Gasta o código (uma vez só, mesmo com dois cliques). @returns {Promise<{ id: string, nome: string, avatar: string | null } | null>} */
export async function usarCodigo(codigo) {
  if (!formato(codigo)) return null;
  const db = await banco().catch(() => null);
  if (!db) return null;
  const r = await db.collection('acessosWeb').findOneAndUpdate(filtro(codigo), { $set: { usadoEm: new Date() } }, { projection: { userId: 1, nome: 1, avatar: 1 } }).catch(() => null);
  const a = r && 'value' in r && r.ok !== undefined ? r.value : r;
  return a?.userId ? { id: String(a.userId), nome: String(a.nome), avatar: a.avatar ?? null } : null;
}
