// Sessão em cookie assinado (HMAC-SHA256). Guarda só quem é a pessoa no Discord; a ficha vem do banco a cada pedido.
import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import { env } from './env.js';

export const COOKIE = 'bd_sessao';
export const COOKIE_ESTADO = 'bd_oauth';
const DIAS = 30;

const b64 = (s) => Buffer.from(s).toString('base64url');
const assina = (dados) => createHmac('sha256', env.sessionSecret).update(dados).digest('base64url');

export function criarCookie(cookies, usuario, seguro = true) {
  const corpo = b64(JSON.stringify({ ...usuario, exp: Date.now() + DIAS * 864e5 }));
  cookies.set(COOKIE, `${corpo}.${assina(corpo)}`, { path: '/', httpOnly: true, secure: seguro, sameSite: 'lax', maxAge: DIAS * 86400 });
}

/** @returns {{ id: string, nome: string, avatar: string | null } | null} */
export function lerSessao(cookies) {
  if (!env.sessionSecret) return null;
  const v = cookies.get(COOKIE)?.value;
  if (!v || !v.includes('.')) return null;
  const [corpo, sig] = v.split('.');
  const esperado = Buffer.from(assina(corpo));
  const recebido = Buffer.from(sig);
  if (esperado.length !== recebido.length || !timingSafeEqual(esperado, recebido)) return null;
  try {
    const s = JSON.parse(Buffer.from(corpo, 'base64url').toString('utf8'));
    if (!s.exp || s.exp < Date.now()) return null;
    return { id: String(s.id), nome: String(s.nome), avatar: s.avatar ?? null };
  } catch { return null; }
}

export const sair = (cookies) => cookies.delete(COOKIE, { path: '/' });
export const novoEstado = () => randomBytes(18).toString('base64url');

/** Pedidos que alteram algo precisam vir do próprio site (proteção contra CSRF, além do SameSite). */
export function mesmaOrigem(request, url) {
  const o = request.headers.get('origin');
  return !o || o === url.origin;
}
