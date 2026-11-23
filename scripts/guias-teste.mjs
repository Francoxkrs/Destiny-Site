// Confere os dados dos guias: comandos, Dúvidas e "Leia junto". Rode depois de `node scripts/bot-exportar.mjs`.
//   npm run guias:teste
// Os links "/pagina/#secao" são conferidos no build (aviso "link dos guias sem destino").
import { paginas } from '../src/data/canon.js';
import { relacionados, gruposComandos, paginaDoComando, comandos, faq, temasFaq, idComando } from '../src/data/guias.js';
import ajuda from '../src/data/bot/ajuda.json' with { type: 'json' };

const erros = [];
const avisos = [];
const slugs = new Set(paginas.map((p) => p.slug));
const nomes = new Set(comandos.map((c) => c.nome));

// Leia junto: toda página tem três, todas existem, nenhuma aponta para si mesma
for (const p of paginas) {
  const r = relacionados[p.slug];
  if (!r) erros.push(`página ${p.slug} sem "Leia junto"`);
  else {
    if (r.length !== 3) avisos.push(`${p.slug}: "Leia junto" com ${r.length} páginas`);
    for (const s of r) if (!slugs.has(s) || s === p.slug) erros.push(`${p.slug}: "Leia junto" com página inválida (${s})`);
  }
}
for (const s of Object.keys(relacionados)) if (!slugs.has(s)) erros.push(`"Leia junto" de página que não existe: ${s}`);

// Comandos: grupos e páginas de regra só com comandos que o bot tem
for (const g of gruposComandos) for (const n of g.cmds) if (!nomes.has(n)) avisos.push(`grupo ${g.id}: /${n} não está no bot (ou é só da Staff)`);
for (const n of Object.keys(paginaDoComando)) if (!nomes.has(n)) avisos.push(`paginaDoComando: /${n} não está no bot`);
const agrupados = new Set(gruposComandos.flatMap((g) => g.cmds));
for (const c of comandos) {
  if (!agrupados.has(c.nome)) avisos.push(`/${c.nome} cai em "Outros": ponha num grupo em src/data/guias.js`);
  if (!c.texto) erros.push(`/${c.nome} sem descrição`);
  if (/^\[Staff\]/i.test(c.texto)) erros.push(`/${c.nome} é da Staff e não devia estar no site`);
  for (const s of c.subs) if (/^\[?Staff\]?$/i.test(s.tag || '')) erros.push(`/${c.nome} ${s.nome} é da Staff`);
}
const ids = comandos.map((c) => idComando(c.nome));
if (new Set(ids).size !== ids.length) erros.push('dois comandos com a mesma âncora no Índice');

// Dúvidas: ids únicos, todo tema existe, toda pergunta do /ajuda tem tema e link
const fids = faq.map((p) => p.id);
for (const id of fids.filter((x, i) => fids.indexOf(x) !== i)) erros.push(`pergunta repetida: ${id}`);
const temas = new Set(temasFaq.map((t) => t.id));
for (const p of faq) {
  if (!temas.has(p.tema)) erros.push(`pergunta ${p.id} com tema que não existe (${p.tema})`);
  if (!p.link) avisos.push(`pergunta ${p.id} sem "Regra completa"`);
  if (!p.blocos.length) erros.push(`pergunta ${p.id} sem resposta`);
  if (p.blocos.some((b) => /[-]/.test(b.h))) erros.push(`pergunta ${p.id} com marca do Discord sobrando`);
}
for (const p of ajuda.perguntas) {
  const f = faq.find((x) => x.id === p.id);
  if (f && f.link === null) avisos.push(`/ajuda "${p.curta}" ainda não tem página no site (ajudaNoSite em src/data/guias.js)`);
}

for (const a of avisos) console.warn(`aviso: ${a}`);
for (const e of erros) console.error(`ERRO: ${e}`);
console.log(`${erros.length ? 'falhou' : 'ok'}: ${paginas.length} páginas, ${comandos.length} comandos, ${faq.length} dúvidas (${ajuda.perguntas.length} do /ajuda), ${avisos.length} avisos`);
process.exit(erros.length ? 1 : 0);
