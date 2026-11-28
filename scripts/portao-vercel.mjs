// Depois do `astro build`: instala o portão de login (src/portao.js) como Edge Middleware da Vercel.
// O Astro só roda middleware nas páginas de servidor; as páginas estáticas (Atributos, Classes, Mapa...)
// saem direto da CDN. O Edge Middleware roda antes de tudo, então tranca as estáticas também.
// Formato: Build Output API v3 (rota com middlewarePath e função edge em .vercel/output/functions).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FILTRO_VERCEL } from '../src/portao.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const saida = path.join(raiz, '.vercel', 'output');
const arqConfig = path.join(saida, 'config.json');
if (!fs.existsSync(arqConfig)) {
  console.error('portão: .vercel/output/config.json não existe (rode depois do astro build com o adaptador da Vercel).');
  process.exit(1);
}

const NOME = '_portao';
const pasta = path.join(saida, 'functions', `${NOME}.func`);
fs.mkdirSync(pasta, { recursive: true });
fs.copyFileSync(path.join(raiz, 'src', 'portao.js'), path.join(pasta, 'index.mjs'));
fs.writeFileSync(path.join(pasta, '.vc-config.json'), JSON.stringify({ runtime: 'edge', entrypoint: 'index.mjs', envVarsInUse: ['SESSION_SECRET'] }, null, 2));

const config = JSON.parse(fs.readFileSync(arqConfig, 'utf8'));
config.routes = (config.routes ?? []).filter((r) => r.middlewarePath !== NOME);
config.routes.unshift({ src: FILTRO_VERCEL, middlewarePath: NOME, continue: true });
fs.writeFileSync(arqConfig, JSON.stringify(config, null, 2));
console.log(`portão: Edge Middleware instalado (${FILTRO_VERCEL})`);
