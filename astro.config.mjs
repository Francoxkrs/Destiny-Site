import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Gera dist/busca.json com as seções de cada página (título, rótulo e o primeiro parágrafo),
// para a busca do site (Ctrl+K) achar regras dentro das páginas.
const limpa = (t) => t.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').replace(/\s+([.,;:!?])/g, '$1').trim();

const slug = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function indiceDeBusca() {
  let base;
  return {
    name: 'bd-busca',
    hooks: {
      'astro:config:done': ({ config }) => { base = config.site; },
      'astro:build:done': async ({ dir }) => {
        const raiz = fileURLToPath(dir);
        const saida = [];
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
