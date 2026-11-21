import { criarCookie, mesmaOrigem } from '../../../lib/sessao.js';
import { usarCodigo } from '../../../lib/codigo.js';
import { env } from '../../../lib/env.js';
export const prerender = false;

// Entrar pelo link do /site (bot). Só POST: quem só abre o link (pré-visualização, antivírus) não gasta o código.
export async function POST({ request, url, cookies, redirect }) {
  if (!mesmaOrigem(request, url)) return new Response('Origem recusada', { status: 403 });
  if (env.sessionSecret.length < 32) return redirect('/entrar/?erro=config', 303);
  const form = await request.formData().catch(() => null);
  const codigo = String(form?.get('codigo') ?? '');
  const volta = String(form?.get('volta') ?? '');
  const u = await usarCodigo(codigo);
  if (!u) return redirect('/entrar/?erro=codigo', 303);
  criarCookie(cookies, u, url.protocol === 'https:');
  return redirect(volta.startsWith('/') && !volta.startsWith('//') ? volta : '/ficha/', 303);
}
