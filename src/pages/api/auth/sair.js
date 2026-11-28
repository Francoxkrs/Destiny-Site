import { sair, mesmaOrigem } from '../../../lib/sessao.js';
export const prerender = false;
export function POST({ request, url, cookies, redirect }) {
  if (!mesmaOrigem(request, url)) return new Response('Origem recusada', { status: 403 });
  sair(cookies);
  return redirect('/entrar/', 303);
}
