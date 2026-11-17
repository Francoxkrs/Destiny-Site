import { env, loginPronto } from '../../../lib/env.js';
import { COOKIE_ESTADO, novoEstado } from '../../../lib/sessao.js';
export const prerender = false;

// Manda a pessoa para o Discord. Escopo só "identify": nome e avatar, nada de mensagens ou servidores.
export function GET({ url, cookies, redirect }) {
  if (!loginPronto()) return redirect('/entrar/?erro=config', 302);
  const estado = novoEstado();
  const volta = url.searchParams.get('volta');
  const destino = volta && volta.startsWith('/') && !volta.startsWith('//') ? volta : '/ficha/';
  cookies.set(COOKIE_ESTADO, JSON.stringify({ estado, destino }), { path: '/', httpOnly: true, secure: url.protocol === 'https:', sameSite: 'lax', maxAge: 600 });
  const q = new URLSearchParams({ client_id: env.discordId, response_type: 'code', scope: 'identify', redirect_uri: `${url.origin}/api/auth/callback`, state: estado, prompt: 'none' });
  return redirect(`https://discord.com/oauth2/authorize?${q}`, 302);
}
