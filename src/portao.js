// Portão do site: toda página exige login pelo Discord, menos a tela de Entrar.
// Roda na Vercel antes de qualquer página (inclusive as estáticas, que não passam pelo servidor do Astro):
// o scripts/portao-vercel.mjs empacota este arquivo como Edge Middleware depois do `astro build`.
// Por isso não importa nada do Node: confere o cookie com Web Crypto, igual ao src/lib/sessao.js.

/** A página inicial fica aberta como capa? false = quem não entrou cai direto no /entrar. */
export const INICIAL_ABERTA = false;

const COOKIE = 'bd_sessao';

// Caminhos que nunca pedem login:
// - /entrar: a própria tela de login;
// - /api/*: cada rota confere a sessão sozinha e responde em JSON (login, callback, aviso do Pix,
//   agendamento das métricas, imagens do bot); um redirecionamento quebraria quem chama;
// - arquivos (/_astro, /img, favicon, robots, sitemap): CSS, JS e imagens da tela de Entrar
//   e a imagem de prévia do link no Discord.
const ABERTOS = /^\/(?:entrar\/?$|api\/|_astro\/|img\/|favicon\.svg$|robots\.txt$|sitemap\.xml$)/;

/** Este caminho exige login? */
export function exigeLogin(pathname) {
  if (INICIAL_ABERTA && pathname === '/') return false;
  return !ABERTOS.test(pathname);
}

/** Expressão para o roteamento da Vercel: só chama o portão nos caminhos que podem exigir login. */
export const FILTRO_VERCEL = '^/(?!entrar/?$|api/|_astro/|img/|favicon\\.svg$|robots\\.txt$|sitemap\\.xml$).*$';

const b64url = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const deB64url = (s) => {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
};

function lerCookie(cabecalho, nome) {
  for (const parte of (cabecalho || '').split(';')) {
    const i = parte.indexOf('=');
    if (i > 0 && parte.slice(0, i).trim() === nome) return parte.slice(i + 1).trim();
  }
  return null;
}

/** Mesmo formato do src/lib/sessao.js: base64url(JSON).HMAC-SHA256 em base64url, com `exp` em ms. */
export async function sessaoValida(cabecalhoCookie, segredo, agora = Date.now()) {
  if (!segredo || segredo.length < 32) return false;
  let v = lerCookie(cabecalhoCookie, COOKIE);
  if (!v) return false;
  try { v = decodeURIComponent(v); } catch { return false; }
  const ponto = v.indexOf('.');
  if (ponto < 1) return false;
  const corpo = v.slice(0, ponto);
  const sig = v.slice(ponto + 1);
  const chave = await crypto.subtle.importKey('raw', new TextEncoder().encode(segredo), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const esperado = b64url(await crypto.subtle.sign('HMAC', chave, new TextEncoder().encode(corpo)));
  if (esperado.length !== sig.length) return false;
  let dif = 0;
  for (let i = 0; i < esperado.length; i++) dif |= esperado.charCodeAt(i) ^ sig.charCodeAt(i);
  if (dif !== 0) return false;
  try {
    const s = JSON.parse(deB64url(corpo));
    return Boolean(s.id) && typeof s.exp === 'number' && s.exp > agora;
  } catch { return false; }
}

/** Edge Middleware da Vercel. Sessão válida (ou caminho aberto): segue. Sem sessão: vai para o /entrar e volta depois. */
export default async function portao(request) {
  const url = new URL(request.url);
  if (!exigeLogin(url.pathname)) return seguir();
  const segredo = String(globalThis.process?.env?.SESSION_SECRET ?? '').trim();
  if (await sessaoValida(request.headers.get('cookie'), segredo)) return seguir();
  const destino = new URL('/entrar/', url);
  const volta = url.pathname + url.search;
  if (volta !== '/') destino.searchParams.set('volta', volta);
  return new Response(null, { status: 302, headers: { location: destino.pathname + destino.search, 'cache-control': 'private, no-store' } });
}

const seguir = () => new Response(null, { headers: { 'x-middleware-next': '1' } });
