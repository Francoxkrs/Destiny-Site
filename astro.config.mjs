import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Gera dist/busca.json com as seções de cada página (título, rótulo e o primeiro parágrafo),
// para a busca do site (Ctrl+K) achar regras dentro das páginas.
const limpa = (t) => t.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').replace(/\s+([.,;:!?])/g, '$1').trim();

const slug = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Páginas de regra: cada seção com rótulo e cada subtítulo (h3) ganha um id fixo no HTML, para a Staff
// mandar no Discord o link da regra exata (/atributos/#acrescimos). O main.js usa a mesma conta quando
// roda sem build (astro dev). Também escreve o tempo de leitura no espaço [data-leitura] do topo
// (sem contar as fichas que abrem em janela, como as das criaturas).
const PALAVRAS_POR_MINUTO = 200;
const minutosDeLeitura = (html) => {
  const corpo = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/) || [])[1] || '';
  const texto = limpa(corpo.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<dialog[\s\S]*?<\/dialog>/g, ' ').replace(/<a class="next"[\s\S]*$/, ' '));
  return Math.max(1, Math.round(texto.split(' ').filter((w) => /\p{L}/u.test(w)).length / PALAVRAS_POR_MINUTO));
};
function marcarRegras(html) {
  if (!html.includes('class="page-hero')) return { html, ids: [] };
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const usar = (base, prefixo) => {
    let id = base;
    if (ids.has(id) && prefixo) id = `${prefixo}-${base}`;
    for (let n = 2; ids.has(id); n++) id = `${base}-${n}`;
    ids.add(id);
    return id;
  };
  const [antes, ...partes] = html.split('<section');
  const novas = partes.map((parte) => {
    const rotulo = (parte.match(/class="eyebrow"[^>]*>\s*<b>[^<]*<\/b>([^<]+)</) || [])[1];
    let secId = (parte.match(/^[^>]*\sid="([^"]+)"/) || [])[1];
    if (rotulo && !secId) { secId = usar(slug(limpa(rotulo))); parte = ` id="${secId}"${parte}`; }
    if (!secId) return parte;
    return parte.replace(/<h3((?:(?!\sid=)[^>])*)>([\s\S]*?)<\/h3>/g, (tudo, attrs, dentro) => {
      const s = slug(limpa(dentro));
      return s ? `<h3 id="${usar(s, secId)}"${attrs}>${dentro}</h3>` : tudo;
    });
  });
  let saida = [antes, ...novas].join('<section');
  saida = saida.replace(/<span([^>]*)data-leitura([^>]*)><\/span>/, (_, a, b) => `<span${a}data-leitura${b}>${minutosDeLeitura(saida)} min de leitura</span>`);
  return { html: saida, ids: [...ids] };
}

function indiceDeBusca() {
  let base;
  return {
    name: 'bd-busca',
    hooks: {
      'astro:config:done': ({ config }) => { base = config.site; },
      'astro:build:done': async ({ dir, logger }) => {
        const raiz = fileURLToPath(dir);
        const saida = [];
        // ids nas seções e subtítulos das páginas de regra; guarda os ids de cada página para conferir os links
        const idsPorPagina = {};
        for (const pasta of fs.readdirSync(raiz)) {
          const arq = path.join(raiz, pasta, 'index.html');
          if (!fs.existsSync(arq)) continue;
          const original = fs.readFileSync(arq, 'utf8');
          const { html, ids } = marcarRegras(original);
          if (html !== original) fs.writeFileSync(arq, html);
          idsPorPagina[`/${pasta}/`] = new Set(ids.length ? ids : [...original.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
        }
        // Os links das Dúvidas e do Índice de comandos precisam cair numa seção que existe.
        const { linksDosGuias, faq, comandos, idComando } = await import('./src/data/guias.js');
        const quebrados = [...new Set(linksDosGuias)].filter((u) => {
          const [p, h] = u.split('#');
          if (!idsPorPagina[p]) return !['/ficha/', '/arvores/', '/cristais/', '/entrar/'].includes(p);
          return h && !idsPorPagina[p].has(h);
        });
        for (const u of quebrados) logger.warn(`link dos guias sem destino: ${u}`);
        for (const pasta of fs.readdirSync(raiz)) {
          const arq = path.join(raiz, pasta, 'index.html');
          if (!fs.existsSync(arq) || pasta === '404') continue;
          const html = fs.readFileSync(arq, 'utf8');
          const pagina = limpa((html.match(/<title>([^<]*)<\/title>/) || [])[1] || pasta).split(' · ')[0];
          for (const parte of html.split('<section').slice(1)) {
            const rotulo = (parte.match(/class="eyebrow"[^>]*>\s*<b>[^<]*<\/b>([^<]+)</) || [])[1];
            if (!rotulo) continue;
            // sem id, o sumário automático (main.js) usa o rótulo como id
            const id = (parte.match(/^[^>]*\sid="([^"]+)"/) || [])[1] || slug(limpa(rotulo));
            const titulo = limpa((parte.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1] || '');
            const texto = limpa((parte.match(/<p class="t-body[^"]*"[^>]*>([\s\S]*?)<\/p>/) || [])[1] || '').slice(0, 160);
            saida.push({ t: limpa(rotulo), d: [titulo, texto].filter(Boolean).join(' · '), c: pagina, u: `/${pasta}/#${id}` });
          }
        }
        // Páginas do Portal que rodam no servidor não estão no build: as seções delas entram à mão.
        const { loja } = await import('./src/data/cristais.js');
        const { tecnicasArvore } = await import('./src/data/tecnicas-arvore.js');
        saida.push(
          { t: 'Trilha da Classe', d: 'A árvore de habilidades da sua Classe de Mago', c: 'Árvores', u: '/arvores/#classe' },
          { t: 'Técnicas de Mana', d: 'O Leque do Despertar: as técnicas por Estágio e Controle', c: 'Árvores', u: '/arvores/#tecnicas' },
          { t: 'Conhecimentos', d: 'O livro dos Conhecimentos: as 6 vagas e como conseguir cada um', c: 'Árvores', u: '/arvores/#conhecimentos' },
          ...tecnicasArvore.map((x) => ({ t: x.nome, d: `Técnica de Mana · ${x.estagio}º Estágio · Controle ${x.controle}%`, c: 'Árvores', u: '/arvores/#tecnicas' })),
          { t: 'Pacotes de Cristais', d: 'Os 6 pacotes de Cristais Prismáticos', c: 'Cristais Prismáticos', u: '/cristais/#cp-pac' },
          { t: 'Calculadora de Cristais', d: 'Quanto custa chegar no que você quer', c: 'Cristais Prismáticos', u: '/cristais/#cp-calc-t' },
          ...loja.map((x) => ({ t: x.nome, d: `Loja da conta · ${x.cp} CP${x.limite ? ` · ${x.limite}` : ''}`, c: 'Cristais Prismáticos', u: '/cristais/#cp-loja' })),
          { t: 'Perfil e Poder', d: 'Estágio, Mana, atributos e Ferimentos do seu Marcado', c: 'Ficha', u: '/ficha/#gv-perfil' },
          { t: 'Feitiços', d: 'Os feitiços do Grimório na sua ficha', c: 'Ficha', u: '/ficha/#gv-feiticos' },
          { t: 'História', d: 'A história do Marcado na ficha', c: 'Ficha', u: '/ficha/#gv-historia' },
          ...faq.map((p) => ({ t: p.curta, d: limpa(p.blocos.map((b) => b.h).join(' ')).slice(0, 160), c: 'Dúvidas', u: `/faq/#${p.id}` })),
          ...comandos.map((c) => ({ t: `/${c.nome}`, d: c.texto, c: 'Comandos', u: `/comandos/#${idComando(c.nome)}` })),
        );
        fs.writeFileSync(path.join(raiz, 'busca.json'), JSON.stringify(saida));
        // sitemap.xml e a linha Sitemap do robots.txt (só quando o endereço público é conhecido)
        if (base) {
          const paginas = ['', ...fs.readdirSync(raiz).filter((p) => p !== '404' && fs.existsSync(path.join(raiz, p, 'index.html'))), 'ficha', 'arvores', 'cristais'];
          const urls = [...new Set(paginas)].map((p) => `<url><loc>${new URL(p ? `/${p}/` : '/', base).href}</loc></url>`).join('');
          fs.writeFileSync(path.join(raiz, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
          fs.appendFileSync(path.join(raiz, 'robots.txt'), `Sitemap: ${new URL('/sitemap.xml', base).href}\n`);
        }
      },
    },
  };
}

// Endereço público (a Vercel informa no build). Serve para a imagem de prévia do link e o sitemap.
const dominio = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);

export default defineConfig({
  site: dominio,
  // Páginas estáticas por padrão; Ficha, Árvores, Cristais e /api/* rodam no servidor (export const prerender = false).
  output: 'static',
  adapter: vercel(),
  devToolbar: { enabled: false },
  build: { format: 'directory' },
  trailingSlash: 'ignore',
  integrations: [indiceDeBusca()],
});
