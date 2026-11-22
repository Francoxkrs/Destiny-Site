// Altar dos Vestígios sem Mongo: banco falso em memória. node scripts/altar-teste.mjs
import { custo, chanceLendario, sortear, invocar, estadoAltar, vestigiosDaConta } from '../src/lib/altar.js';
import { altar } from '../src/data/altar.js';

let ok = 0, falhas = 0;
const caso = async (nome, fn) => { try { await fn(); ok++; } catch (e) { falhas++; console.error(`✗ ${nome}: ${e.message}`); } };
const igual = (a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
const certo = (x, msg = 'esperava verdadeiro') => { if (!x) throw new Error(msg); };

// ---------- banco falso (só o que altar.js usa; aceita caminhos com ponto) ----------
const pega = (doc, k) => k.split('.').reduce((o, p) => (Array.isArray(o) ? o.map((x) => x?.[p]) : o?.[p]), doc);
const poe = (doc, k, x) => { const ps = k.split('.'); let o = doc; for (const p of ps.slice(0, -1)) o = (o[p] ??= {}); o[ps.at(-1)] = x; };
function casa(doc, f) {
  return Object.entries(f).every(([k, c]) => {
    const d = pega(doc, k);
    if (c && typeof c === 'object' && !Array.isArray(c)) {
      return Object.entries(c).every(([op, x]) => {
        if (op === '$ne') return Array.isArray(d) ? !d.includes(x) : d !== x;
        if (op === '$gte') return d != null && d >= x;
        if (op === '$in') return x.includes(d ?? null);
        throw new Error(`op ${op}`);
      });
    }
    return Array.isArray(d) ? d.includes(c) : d === c;
  });
}
function aplica(doc, u) {
  for (const [k, x] of Object.entries(u.$set ?? {})) poe(doc, k, structuredClone(x));
  for (const [k, x] of Object.entries(u.$inc ?? {})) poe(doc, k, (pega(doc, k) ?? 0) + x);
  for (const [k, x] of Object.entries(u.$push ?? {})) { const a = pega(doc, k) ?? []; a.push(x); poe(doc, k, a); }
}
function colecao() {
  const docs = [];
  return {
    docs,
    findOne: async (f) => structuredClone(docs.find((d) => casa(d, f)) ?? null),
    find: (f) => { let l = docs.filter((d) => casa(d, f)); const c = { sort: (s) => { const [[k, o]] = Object.entries(s); l = l.slice().sort((a, b) => (a[k] > b[k] ? o : -o)); return c; }, limit: (n) => { l = l.slice(0, n); return c; }, toArray: async () => structuredClone(l) }; return c; },
    insertOne: async (d) => { docs.push(structuredClone(d)); },
    updateOne: async (f, u) => { const d = docs.find((x) => casa(x, f)); if (!d) return { modifiedCount: 0 }; aplica(d, u); return { modifiedCount: 1 }; },
    findOneAndUpdate: async (f, u) => { const d = docs.find((x) => casa(x, f)); if (!d) return null; aplica(d, u); return structuredClone(d); },
  };
}
// aba Visual do bot: só guarda as chamadas (visual.js tem o próprio teste)
function visuaisFalso() { const chamadas = []; return { chamadas, updateOne: async (f, u) => { chamadas.push(u); return { matchedCount: 1 }; } }; }
function bancoFalso({ cp = 0, inscricoes, aprovado = true } = {}) {
  const cols = { contas: colecao(), altarGiros: colecao(), personagens: colecao(), visuais: visuaisFalso() };
  cols.contas.docs.push({ userId: 'u1', cp, ...(inscricoes != null ? { inscricoes } : {}) });
  cols.personagens.docs.push({ _id: 'p1', guildId: 'g', userId: 'u1', etapa: aprovado ? 'aprovado' : 'criacao', estado: { recursos: {} } });
  return { cols, collection: (n) => cols[n] };
}
const quem = { userId: 'u1', guildId: 'g' };
// rng em sequência: cada giro usa 2 números (raridade, item)
const seq = (...xs) => { let i = 0; return () => xs[i++ % xs.length]; };
const RARO = [0.99, 0]; // 99 → Raro, primeiro item (3 Fragmentos)

// ---------- regras puras ----------
await caso('custo: Inscrições primeiro, o resto em CP, 10 nunca passa de 1.440', () => igual(
  [custo(1, 0), custo(1, 3), custo(10, 0), custo(10, 4), custo(10, 1), custo(10, 12)],
  [{ insc: 0, cp: 160 }, { insc: 1, cp: 0 }, { insc: 0, cp: 1440 }, { insc: 4, cp: 960 }, { insc: 1, cp: 1440 }, { insc: 10, cp: 0 }],
));
await caso('garantia: 1,2% até o 45º, sobe 6 por giro, certo no 60º', () => igual([chanceLendario(1), chanceLendario(45), chanceLendario(46), chanceLendario(50), chanceLendario(60)], [1.2, 1.2, 7.2, 31.2, 100]));
await caso('Épico garantido a cada 10', () => {
  const s = sortear({ pity: 0, pityE: 0, vestigios: {}, fragmentos: 0 }, 10, seq(...RARO));
  igual([s.res.filter((r) => r.rar === 'epico').length, s.res[9].rar, s.pityE], [1, 'epico', 0]);
});
await caso('Lendário no 60º, mesmo com azar, e zera as duas contagens', () => {
  const s = sortear({ pity: 59, pityE: 3, vestigios: {}, fragmentos: 0 }, 1, seq(...RARO));
  igual([s.res[0].id, s.pity, s.pityE, s.res[0].novo], ['t1-capa-miasma', 0, 0, true]);
});
await caso('repetido vira Fragmento (Épico 20, Lendário 100), também dentro do mesmo ×10', () => {
  const s = sortear({ pity: 0, pityE: 0, vestigios: { 't1-capa-miasma': { n: 1 } }, fragmentos: 5 }, 2, seq(0, 0, 0, 0));
  igual([s.res.map((r) => r.repetido ?? false), s.fragmentos, s.vestigios['t1-capa-miasma'].n], [[true, true], 205, 3]);
  const e = sortear({ pity: 0, pityE: 0, vestigios: {}, fragmentos: 0 }, 2, seq(0.05, 0, 0.05, 0)); // 5 → Épico, 1º item, duas vezes
  igual([e.res[0].novo, e.res[1].repetido, e.fragmentos], [true, true, 20]);
});
await caso('Raros: Fragmentos somam e materiais juntam por chave', () => {
  const s = sortear({ pity: 0, pityE: 0, vestigios: {}, fragmentos: 0 }, 4, seq(0.99, 0, 0.99, 0.3, 0.99, 0.3, 0.99, 0.99));
  igual([s.fragmentos, s.materiais], [3, { 'po-de-cristal': 2, quartzo: 2 }]);
});
await caso('chances do sorteio batem com as publicadas (200 mil giros)', () => {
  let r = 0x2f6b; const rng = () => ((r = (r * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
  const c = { lendario: 0, epico: 0, raro: 0 }; let est = { pity: 0, pityE: 0, vestigios: {}, fragmentos: 0 };
  for (let i = 0; i < 20000; i++) { const s = sortear(est, 10, rng); s.res.forEach((x) => c[x.rar]++); est = { ...s, vestigios: {} }; }
  const lend = (c.lendario / 200000) * 100;
  // com a garantia, a taxa real do Lendário fica perto de 1 a cada ~40 giros (bem acima de 1,2%)
  certo(lend > 1.6 && lend < 3.2, `Lendário ${lend.toFixed(2)}%`);
  certo(c.epico / 200000 > 0.1, `Épico ${(c.epico / 2000).toFixed(2)}%`);
});

// ---------- invocar no banco ----------
await caso('×1 com CP: cobra 160, grava pity, Vestígio e histórico', async () => {
  const db = bancoFalso({ cp: 500 });
  const r = await invocar(db, { ...quem, qtd: 1, ref: 'ref-aaaa-0001' }, { rng: seq(0.05, 0) });
  const c = db.cols.contas.docs[0];
  igual([r.ok, c.cp, c.altarPity, c.altarPityE, Object.keys(c.vestigios), c.gastos[0].cp, db.cols.altarGiros.docs.length, r.estado.cp], [true, 340, 1, 0, ['t1-titulo'], 160, 1, 340]);
});
await caso('×10 usa as Inscrições primeiro e o resto em CP', async () => {
  const db = bancoFalso({ cp: 2000, inscricoes: 4 });
  const r = await invocar(db, { ...quem, qtd: 10, ref: 'ref-aaaa-0002' }, { rng: seq(...RARO) });
  const c = db.cols.contas.docs[0];
  igual([r.ok, r.res.length, c.inscricoes, c.cp], [true, 10, 0, 2000 - 960]);
});
await caso('mesma ref não cobra duas vezes e devolve o mesmo resultado', async () => {
  const db = bancoFalso({ cp: 1000 });
  const a = await invocar(db, { ...quem, qtd: 1, ref: 'ref-aaaa-0003' }, { rng: seq(0.05, 0.4) });
  const b = await invocar(db, { ...quem, qtd: 1, ref: 'ref-aaaa-0003' }, { rng: seq(0, 0) });
  igual([b.ok, b.repetido, b.res[0].id === a.res[0].id, db.cols.contas.docs[0].cp, db.cols.altarGiros.docs.length], [true, true, true, 840, 1]);
});
await caso('sem saldo: não cobra e diz quanto falta', async () => {
  const db = bancoFalso({ cp: 100 });
  const r = await invocar(db, { ...quem, qtd: 1, ref: 'ref-aaaa-0004' });
  igual([r.ok, r.status, r.falta, db.cols.contas.docs[0].cp, db.cols.altarGiros.docs.length], [false, 402, { cp: 60 }, 100, 0]);
});
await caso('sem personagem aprovado: não cobra', async () => {
  const db = bancoFalso({ cp: 1000, aprovado: false });
  const r = await invocar(db, { ...quem, qtd: 1, ref: 'ref-aaaa-0005' });
  igual([r.ok, r.status, db.cols.contas.docs[0].cp], [false, 409, 1000]);
});
await caso('qtd e ref inválidas são recusadas', async () => {
  const db = bancoFalso({ cp: 99999 });
  const a = await invocar(db, { ...quem, qtd: 5, ref: 'ref-aaaa-0006' });
  const b = await invocar(db, { ...quem, qtd: 1, ref: 'x' });
  const c = await invocar(db, { ...quem, qtd: 1, ref: { $ne: 1 } });
  igual([a.status, b.status, c.status, db.cols.contas.docs[0].cp], [400, 400, 400, 99999]);
});
await caso('materiais dos Raros caem na bolsa do personagem', async () => {
  const db = bancoFalso({ cp: 1000 });
  await invocar(db, { ...quem, qtd: 1, ref: 'ref-aaaa-0007' }, { rng: seq(0.99, 0.99) }); // último Raro: 2 Quartzos
  igual(db.cols.personagens.docs[0].estado.recursos, { quartzo: 2 });
});
await caso('duas invocações ao mesmo tempo: trava otimista, cobra as duas certo', async () => {
  const db = bancoFalso({ cp: 320 });
  const [a, b] = await Promise.all([
    invocar(db, { ...quem, qtd: 1, ref: 'ref-aaaa-0008' }, { rng: seq(...RARO) }),
    invocar(db, { ...quem, qtd: 1, ref: 'ref-aaaa-0009' }, { rng: seq(...RARO) }),
  ]);
  const c = db.cols.contas.docs[0];
  igual([a.ok, b.ok, c.cp, c.altarPity, c.altarV], [true, true, 0, 2, 2]);
});
await caso('estado e ficha: histórico do mais novo para o mais velho, Vestígios em ordem de raridade', async () => {
  const db = bancoFalso({ cp: 1000 });
  await invocar(db, { ...quem, qtd: 1, ref: 'ref-aaaa-0010' }, { rng: seq(0.05, 0) });
  await invocar(db, { ...quem, qtd: 1, ref: 'ref-aaaa-0011' }, { rng: seq(0, 0) });
  db.cols.altarGiros.docs[1].em = new Date(Date.now() + 5000);
  const e = await estadoAltar(db, 'u1');
  const v = await vestigiosDaConta(db, 'u1');
  igual([e.hist.map((h) => h.rar), v.lista.map((x) => x.id)], [['lendario', 'epico'], ['t1-capa-miasma', 't1-titulo']]);
});
await caso('visual novo vai para a aba Visual do bot; repetido e material não', async () => {
  const db = bancoFalso({ cp: 99999 });
  // rng 0 = Lendário (chance > 0) e o primeiro do pool: a Capa do Miasma
  await invocar(db, { userId: 'u1', guildId: 'g', qtd: 1, ref: 'ref-visual-0001' }, { rng: () => 0 });
  const n1 = db.cols.visuais.chamadas.length;
  await invocar(db, { userId: 'u1', guildId: 'g', qtd: 1, ref: 'ref-visual-0002' }, { rng: () => 0 });
  igual([n1 > 0, JSON.stringify(db.cols.visuais.chamadas[0]).includes('tem.capas'), db.cols.visuais.chamadas.length], [true, true, n1]);
});
await caso('todo prêmio tem id único e Raro tem Fragmento ou material', () => {
  const todos = Object.values(altar.premios).flat();
  igual(new Set(todos.map((p) => p.id)).size, todos.length);
  certo(altar.premios.raro.every((p) => p.fragmentos || p.material));
});

console.log(`${ok} ok, ${falhas} falharam`);
process.exit(falhas ? 1 : 0);
