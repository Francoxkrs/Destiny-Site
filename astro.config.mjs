import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Gera dist/busca.json com as seções de cada página (título, rótulo e o primeiro parágrafo),
// para a busca do site (Ctrl+K) achar regras dentro das páginas.
const limpa = (t) => t.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').replace(/\s+([.,;:!?])/g, '$1').trim();

const slug = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function indiceDeBusca() {
  return {
    name: 'bd-busca',
    hooks: {
      'astro:build:done': ({ dir }) => {
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
        fs.writeFileSync(path.join(raiz, 'busca.json'), JSON.stringify(saida));
      },
    },
  };
}

export default defineConfig({
  output: 'static',
  build: { format: 'directory' },
  trailingSlash: 'ignore',
  integrations: [indiceDeBusca()],
});
