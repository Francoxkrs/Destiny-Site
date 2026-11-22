// Visual da ficha: o site grava na mesma coleção do bot (`visuais`). node scripts/visual-teste.mjs
import { darVisualNoBot, equiparVisual, visualDaConta, provadorDe } from '../src/lib/visual.js';

let ok = 0, falhou = 0;
const igual = (a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`esperava ${JSON.stringify(b)}, veio ${JSON.stringify(a)}`); };
async function caso(nome, fn) { try { await fn(); ok++; console.log('✓', nome); } catch (e) { falhou++; console.log('✗', nome + ':', e.message); } }

// banco falso só com o que visual.js usa
const pega = (o, k) => k.split('.').reduce((x, p) => x?.[p], o);
const poe = (o, k, v) => { const ps = k.split('.'); let x = o; for (const p of ps.slice(0, -1)) x = x[p] ??= {}; x[ps.at(-1)] = v; };
function casa(d, f) {
  return Object.entries(f).every(([k, v]) => {
    if (k === '$or') return v.some((g) => casa(d, g));
    const x = pega(d, k);
    if (v && typeof v === 'object' && '$exists' in v) return (x !== undefined) === v.$exists;
    if (Array.isArray(x)) return x.includes(v);
    return v === null ? x == null : x === v;
  });
}
function banco() {
  const docs = [];
  const col = {
    docs,
    findOne: async (f) => structuredClone(docs.find((d) => casa(d, f)) ?? null),
    updateOne: async (f, u, op = {}) => {
      let d = docs.find((x) => casa(x, f));
      if (!d && op.upsert) { d = Object.fromEntries(Object.entries(f).filter(([, v]) => typeof v !== 'object')); Object.assign(d, u.$setOnInsert ?? {}); docs.push(d); }
      if (!d) return { matchedCount: 0 };
      for (const [k, v] of Object.entries(u.$set ?? {})) poe(d, k, v);
      for (const [k, v] of Object.entries(u.$addToSet ?? {})) { const a = pega(d, k) ?? []; if (!a.includes(v)) a.push(v); poe(d, k, a); }
      return { matchedCount: 1 };
    },
  };
  return { col, collection: () => col };
}
const quem = { guildId: 'g', userId: 'u1' };

await caso('peça nova vai para a aba Visual e a primeira de cada tipo já fica equipada', async () => {
  const db = banco();
  await darVisualNoBot(db, quem, { tipo: 'fundos', id: 'fossa-miasma' });
  await darVisualNoBot(db, quem, { tipo: 'titulos', id: 'Arauto do Miasma' });
  await darVisualNoBot(db, quem, { tipo: 'titulos', id: 'Desgarrado' });
  await darVisualNoBot(db, quem, { tipo: 'selos', id: 'altar-t1' });
  const v = await visualDaConta(db, quem);
  igual([v.ativo, v.selos, v.pecas.length, db.col.docs.length], [{ fundo: "fossa-miasma", titulo: "Arauto do Miasma" }, ["altar-t1"], 3, 1]);
});
await caso('o Passe já tinha equipado: o Altar não troca', async () => {
  const db = banco();
  db.col.docs.push({ guildId: 'g', userId: 'u1', tem: { tintas: ['dourada'] }, ativo: { tinta: 'dourada' } });
  await darVisualNoBot(db, quem, { tipo: 'tintas', id: 'negra' });
  igual((await visualDaConta(db, quem)).ativo, { tinta: 'dourada' });
});
await caso('equipar só o que tem; tirar deixa vazio', async () => {
  const db = banco();
  await darVisualNoBot(db, quem, { tipo: 'tintas', id: 'dourada' });
  await darVisualNoBot(db, quem, { tipo: 'tintas', id: 'negra' });
  const a = await equiparVisual(db, quem, 'tinta', 'negra');
  const b = await equiparVisual(db, quem, 'moldura', 'miasma');
  const c = await equiparVisual(db, quem, 'nada', 'x');
  const d = await equiparVisual(db, quem, 'tinta', null);
  igual([a.ok, a.visual.ativo.tinta, b.status, c.status, d.visual.ativo.tinta], [true, 'negra', 403, 400, undefined]);
});
await caso('provador: id do prêmio vira encaixe; emote e material não', () => {
  igual([provadorDe('t1-tinta')?.ativo, provadorDe('t1-tinta')?.id, provadorDe('t1-selo')?.selo, provadorDe('t1-emote'), provadorDe('quartzo'), provadorDe('lixo')], ['tinta', 'negra', true, null, null, null]);
});

console.log(`\n${ok} ok, ${falhou} falharam`);
process.exit(falhou ? 1 : 0);
