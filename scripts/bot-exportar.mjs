// Copia do bot para o site os dados que as páginas mostram: a lista de comandos e as respostas do /ajuda.
// Assim o Índice de comandos (/comandos/) e as Dúvidas (/faq/) saem do mesmo código que o Discord usa.
//
// Uso (com o bot compilado: `npm run build` na pasta do bot):
//   node scripts/bot-exportar.mjs "C:\Code\Minha Missão\Black-Destiny-atualizado\Bot"
//
// O script não liga o bot nem fala com o banco: troca a conexão do mongoose por uma falsa antes de importar.
// Grava src/data/bot/comandos.json e src/data/bot/ajuda.json. Detalhes em docs/bot-dados.md.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raizBot = path.resolve(process.argv[2] || '');
const destino = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'bot');
if (!process.argv[2] || !fs.existsSync(path.join(raizBot, 'build', 'discord', 'commands'))) {
  console.error('Passe a pasta do bot já compilado (com build/). Ex.: node scripts/bot-exportar.mjs "C:\\Code\\Minha Missão\\Black-Destiny-atualizado\\Bot"');
  process.exit(1);
}

// Comandos que não vão para o site público, mesmo sem a marca [Staff].
// patrocinio: o site não mostra Patrocínio nem Preço das Patrocinadoras (decisão do Silas).
const OCULTOS = new Set(['patrocinio']);
// Descrições que começam assim são só da equipe.
const SO_STAFF = /^\[(Staff|Narrador e Staff)\]/i;
const SUB_STAFF = /^\[Staff\]/i;

process.env.BOT_TOKEN ||= 'site-exportar';
process.env.MONGO_URI ||= 'mongodb://127.0.0.1:1/site-exportar';
const modulo = (p) => import(pathToFileURL(path.join(raizBot, p)).href);
const mongoose = (await modulo('node_modules/mongoose/index.js')).default;
mongoose.connect = async () => mongoose;
mongoose.set('bufferCommands', false);

const { ConstaticApp } = await modulo('node_modules/@constatic/base/dist/app.js');
const andar = (d) => fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
  .flatMap((e) => (e.isDirectory() ? andar(path.join(d, e.name)) : e.name.endsWith('.js') ? [path.join(d, e.name)] : []));

// Importa um arquivo por vez para saber a pasta (grupo) de cada comando.
const pastaDe = {};
const pastaCmds = path.join(raizBot, 'build', 'discord', 'commands');
let vistos = 0;
for (const arq of andar(pastaCmds)) {
  await import(pathToFileURL(arq).href);
  const todos = ConstaticApp.getInstance().commands.build();
  for (const c of todos.slice(vistos)) pastaDe[c.name] = path.relative(pastaCmds, path.dirname(arq)).split(path.sep)[0];
  vistos = todos.length;
}

const tag = (d = '') => (d.match(/^\[([^\]]+)\]\s*/) || [])[1] || null;
const semTag = (d = '') => d.replace(/^\[[^\]]+\]\s*/, '');
const opcao = (o) => ({ nome: o.name, texto: o.description, obrigatoria: !!o.required, ...(o.choices?.length ? { escolhas: o.choices.map((x) => x.name) } : {}) });

const brutos = ConstaticApp.getInstance().commands.build().filter((c) => c.type === 1 || c.type === undefined);
const comandos = [];
for (const c of brutos) {
  if (SO_STAFF.test(c.description || '') || OCULTOS.has(c.name)) continue;
  const subsBrutos = (c.options || []).filter((o) => o.type === 1 || o.type === 2)
    .flatMap((o) => (o.type === 2 ? (o.options || []).map((s) => ({ ...s, name: `${o.name} ${s.name}` })) : [o]));
  const subs = subsBrutos.filter((s) => !SUB_STAFF.test(s.description || '')).map((s) => ({
    nome: s.name, texto: semTag(s.description), tag: tag(s.description), opcoes: (s.options || []).map(opcao),
  }));
  comandos.push({
    nome: c.name,
    texto: c.description,
    pasta: pastaDe[c.name] || 'outros',
    opcoes: subsBrutos.length ? [] : (c.options || []).map(opcao),
    subs,
  });
}
comandos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));

// /ajuda: as perguntas com a resposta já montada (os números saem do Cânone do bot).
const { PERGUNTAS } = await modulo('build/functions/servidor/ajuda.js');
const ajuda = PERGUNTAS.map((p) => ({ id: p.id, curta: p.curta, pergunta: p.pergunta, resposta: p.resposta().filter((l) => l !== null) }));

// Conferência: todo /comando citado nas respostas precisa existir no bot.
const existe = new Set(ConstaticApp.getInstance().commands.build().map((c) => c.name));
const avisos = [];
for (const p of ajuda) {
  for (const m of p.resposta.join('\n').matchAll(/`\/([\p{L}-]+)/gu)) if (!existe.has(m[1])) avisos.push(`/ajuda "${p.curta}" cita /${m[1]}, que não existe no bot`);
}

fs.mkdirSync(destino, { recursive: true });
const meta = { geradoEm: new Date().toISOString().slice(0, 10), fonte: 'bot (build/)' };
fs.writeFileSync(path.join(destino, 'comandos.json'), `${JSON.stringify({ ...meta, comandos }, null, 1)}\n`);
fs.writeFileSync(path.join(destino, 'ajuda.json'), `${JSON.stringify({ ...meta, perguntas: ajuda }, null, 1)}\n`);
console.log(`ok: ${comandos.length} comandos públicos (de ${brutos.length}) e ${ajuda.length} perguntas do /ajuda em src/data/bot/`);
for (const a of avisos) console.warn(`aviso: ${a}`);
process.exit(0);
