import { env, loginPronto } from '../../../lib/env.js';
import { COOKIE_ESTADO, criarCookie } from '../../../lib/sessao.js';
export const prerender = false;

export async function GET({ url, cookies, redirect }) {
  if (!loginPronto()) return redirect('/entrar/?erro=config', 302);
  let salvo = null;
  try { salvo = JSON.parse(cookies.get(COOKIE_ESTADO)?.value ?? 'null'); } catch { /* cookie estragado */ }
  cookies.delete(COOKIE_ESTADO, { path: '/' });
  const code = url.searchParams.get('code');
  if (url.searchParams.get('error')) return redirect('/entrar/?erro=negado', 302);
  if (!code || !salvo || salvo.estado !== url.searchParams.get('state')) return redirect('/entrar/?erro=estado', 302);

  try {
    const tok = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: env.discordId, client_secret: env.discordSecret, grant_type: 'authorization_code', code, redirect_uri: `${url.origin}/api/auth/callback` }),
    });
    if (!tok.ok) return redirect('/entrar/?erro=discord', 302);
    const { access_token } = await tok.json();
    const me = await fetch('https://discord.com/api/users/@me', { headers: { authorization: `Bearer ${access_token}` } });
    if (!me.ok) return redirect('/entrar/?erro=discord', 302);
    const u = await me.json();
    const avatar = u.avatar ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=96` : null;
    criarCookie(cookies, { id: u.id, nome: u.global_name || u.username, avatar }, url.protocol === 'https:');
    return redirect(salvo.destino || '/ficha/', 302);
  } catch {
    return redirect('/entrar/?erro=discord', 302);
  }
}
