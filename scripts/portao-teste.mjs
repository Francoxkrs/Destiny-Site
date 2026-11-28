// Confere o portão de login (src/portao.js): quem passa, quem vai para o /entrar, e se o cookie
// feito pelo site (src/lib/sessao.js) é aceito pela conferência em Web Crypto.
//   npm run portao:teste            (depois do build, também confere todas as páginas geradas)
import fs from 'node:fs';
import path from 'node:path';

const SEGREDO = 'x'.repeat(40);
process.env.SESSION_SECRET = SEGREDO;
const { default: portao, exigeLogin, sessaoValida, FILTRO_VERCEL } = await import('../src/portao.js');
const { criarCookie, COOKIE } = await import('../src/lib/sessao.js');

const erros = [];
const ok = (cond, msg) => { if (!cond) erros.push(msg); };

// cookie igual ao que o login grava
let valor;
criarCookie({ set: (_n, v) => { valor = v; } }, { id: '123', nome: 'Teste', avatar: null });
const cookie = `outro=1; ${COOKIE}=${encodeURIComponent(valor)}`;

ok(await sessaoValida(cookie, SEGREDO), 'cookie do site recusado');
ok(!(await sessaoValida(cookie, 'y'.repeat(40))), 'cookie aceito com outro segredo');
ok(!(await sessaoValida(cookie.replace(/.$/, (c) => (c === 'A' ? 'B' : 'A')), SEGREDO)), 'assinatura adulterada aceita');
ok(!(await sessaoValida(cookie, SEGREDO, Date.now() + 31 * 864e5)), 'cookie vencido aceito');
ok(!(await sessaoValida('', SEGREDO)), 'sem cookie aceito');
ok(!(await sessaoValida(cookie, '')), 'aceito sem SESSION_SECRET');

// caminhos abertos e fechados (a regra e o filtro da Vercel têm de concordar)
const filtro = new RegExp(FILTRO_VERCEL);
const abertos = ['/entrar', '/entrar/', '/api/auth/login', '/api/auth/callback', '/api/cristais/aviso', '/api/cron/metricas', '/api/sessao', '/_astro/x.css', '/img/og.jpg', '/favicon.svg', '/robots.txt', '/sitemap.xml'];
const fechados = ['/', '/atributos/', '/atributos', '/ficha/', '/arvores/', '/cristais/', '/altar/', '/admin/', '/admin/npcs/', '/busca.json', '/entrar/x', '/entrarx/', '/apis/', '/qualquer/'];
for (const p of abertos) { ok(!exigeLogin(p), `${p} devia ser aberto`); ok(!filtro.test(p), `${p} passa pelo filtro da Vercel`); }
for (const p of fechados) { ok(exigeLogin(p), `${p} devia pedir login`); ok(filtro.test(p), `${p} escapa do filtro da Vercel`); }

// todas as páginas geradas no build pedem login, menos /entrar
const estatico = path.resolve('.vercel/output/static');
if (fs.existsSync(estatico)) {
  const paginas = [];
  const andar = (d) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const c = path.join(d, f.name); if (f.isDirectory()) andar(c); else if (f.name.endsWith('.html')) paginas.push('/' + path.relative(estatico, c).replace(/\\/g, '/').replace(/index\.html$/, '').replace(/\.html$/, '')); } };
  andar(estatico);
  for (const p of paginas) ok(exigeLogin(p), `página do build sem login: ${p}`);
  console.log(`${paginas.length} páginas estáticas conferidas`);
}

// o middleware: sem sessão vai para o /entrar com a volta; com sessão segue
const sem = await portao(new Request('https://site.test/atributos/?x=1'));
ok(sem.status === 302 && sem.headers.get('location') === '/entrar/?volta=%2Fatributos%2F%3Fx%3D1', `sem sessão: ${sem.status} ${sem.headers.get('location')}`);
const raiz = await portao(new Request('https://site.test/'));
ok(raiz.headers.get('location') === '/entrar/', `inicial sem sessão: ${raiz.headers.get('location')}`);
const com = await portao(new Request('https://site.test/atributos/', { headers: { cookie } }));
ok(com.headers.get('x-middleware-next') === '1', 'com sessão não seguiu');
const entrar = await portao(new Request('https://site.test/entrar/'));
ok(entrar.headers.get('x-middleware-next') === '1', '/entrar não seguiu');

if (erros.length) { console.error(erros.map((e) => `✗ ${e}`).join('\n')); process.exit(1); }
console.log('portão ok');
