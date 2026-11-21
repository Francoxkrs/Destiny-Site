// Pedra do Destino e Loja da conta sem Mongo: banco falso em memória. node scripts/loja-teste.mjs
import { comprar, precoDe, ofertaDe, semanaDe, limitesDaConta } from '../src/lib/loja.js';

let ok = 0, falhas = 0;
const caso = async (nome, fn) => { try { await fn(); ok++; } catch (e) { falhas++; console.error(`✗ ${nome}: ${e.message}`); } };
const igual = (a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };

// ---------- banco falso (caminhos com ponto, upsert, $pull, $push com $each/$slice) ----------
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
function aplica(doc, u, novo) {
  if (novo) for (const [k, x] of Object.entries(u.$setOnInsert ?? {})) poe(doc, k, structuredClone(x));
  for (const [k, x] of Object.entries(u.$set ?? {})) poe(doc, k, structuredClone(x));
  for (const [k, x] of Object.entries(u.$inc ?? {})) poe(doc, k, (pega(doc, k) ?? 0) + x);
  for (const [k, x] of Object.entries(u.$push ?? {})) {
    const a = pega(doc, k) ?? [];
    if (x && x.$each) { a.push(...x.$each); if (x.$slice) a.splice(0, Math.max(0, a.length + x.$slice)); } else a.push(x);
    poe(doc, k, a);
  }
  for (const [k, x] of Object.entries(u.$pull ?? {})) { const a = pega(doc, k) ?? []; poe(doc, k, a.filter((e) => !casa(e, x))); }
}
function colecao(o = {}) {
  const docs = [];
  return {
    docs,
    findOne: async (f) => structuredClone(docs.find((d) => casa(d, f)) ?? null),
    insertOne: async (d) => { docs.push(structuredClone(d)); },
    updateOne: async (f, u, op = {}) => {
      if (o.quebra) throw new Error('caiu');
      const d = docs.find((x) => casa(x, f));
      if (d) { aplica(d, u, false); return { modifiedCount: 1 }; }
      if (op.upsert) { const n = Object.fromEntries(Object.entries(f).filter(([, x]) => typeof x !== 'object')); aplica(n, u, true); docs.push(n); return { modifiedCount: 0, upsertedCount: 1 }; }
      return { modifiedCount: 0 };
    },
    findOneAndUpdate: async (f, u) => { const d = docs.find((x) => casa(x, f)); if (!d) return null; aplica(d, u, false); return structuredClone(d); },
  };
}
function bancoFalso({ cp = 0, inscricoes, bolsaQuebra = false, semPersonagem = false } = {}) {
  const cols = { contas: colecao(), comprasLoja: colecao(), personagens: colecao(), bolsas: colecao({ quebra: bolsaQuebra }) };
  cols.contas.docs.push({ userId: 'u1', cp, ...(inscricoes != null ? { inscricoes } : {}) });
  if (!semPersonagem) cols.personagens.docs.push({ _id: 'p1', guildId: 'g', userId: 'u1', etapa: 'aprovado' });
  return { cols, collection: (n) => cols[n] };
}
const quem = { userId: 'u1', guildId: 'g' };
let n = 0; const ref = () => `ref-teste-${String(++n).padStart(4, '0')}`;
const conta = (db) => db.cols.contas.docs[0];
const bolsa = (db) => db.cols.bolsas.docs[0];

await caso('preço da Pedra: Inscrições primeiro, resto a 160 CP; Milagre também em CP', () => {
  igual([precoDe(ofertaDe('pedra', 'giroMagia'), 0), precoDe(ofertaDe('pedra', 'giroMagia'), 1), precoDe(ofertaDe('pedra', 'rerollMilagre'), 10), precoDe(ofertaDe('pedra', 'rerollMilagre'), 15)],
    [{ insc: 0, cp: 320 }, { insc: 1, cp: 160 }, { insc: 10, cp: 800 }, { insc: 15, cp: 0 }]);
});
await caso('Família à escolha não está mais à venda', () => igual([ofertaDe('loja', 'familia-escolha'), ofertaDe('loja', 'classe-escolha')?.chave], [null, 'classeEscolha']));
await caso('semana vira na segunda 00h de Brasília', () => igual([semanaDe(new Date('2026-11-23T02:59:00Z')), semanaDe(new Date('2026-11-23T03:00:00Z'))], ['2026-11-16', '2026-11-23']));

await caso('Pedra: cobra e o item cai na bolsa (bolsa nova, no formato do bot)', async () => {
  const db = bancoFalso({ cp: 1000, inscricoes: 1 });
  const r = await comprar(db, { ...quem, tipo: 'pedra', id: 'giroMagia', ref: ref() });
  igual([r.ok, conta(db).cp, conta(db).inscricoes, bolsa(db).itens.giroMagia, bolsa(db).recebido.giroMagia, bolsa(db).salvos, bolsa(db).historico.length], [true, 840, 0, 1, 1, [], 1]);
});
await caso('Pedra: soma numa bolsa que já existe', async () => {
  const db = bancoFalso({ cp: 1000 });
  db.cols.bolsas.docs.push({ guildId: 'g', userId: 'u1', itens: { giroMagia: 2, yuls: 5 }, recebido: { giroMagia: 2 }, historico: [] });
  await comprar(db, { ...quem, tipo: 'pedra', id: 'giroMagia', ref: ref() });
  igual([bolsa(db).itens, db.cols.bolsas.docs.length], [{ giroMagia: 3, yuls: 5 }, 1]);
});
await caso('Pedra: limite por personagem e temporada', async () => {
  const db = bancoFalso({ cp: 99999 });
  const rs = [];
  for (let i = 0; i < 3; i++) rs.push(await comprar(db, { ...quem, tipo: 'pedra', id: 'giroGrimorio', ref: ref() }));
  igual([rs.map((r) => r.ok), rs[2].status, bolsa(db).itens.giroGrimorio], [[true, true, false], 409, 2]);
});
await caso('Reroll de Milagre: 80% Traço, 20% Milagre, sorteado no servidor e pago em CP', async () => {
  const db = bancoFalso({ cp: 99999 });
  const r1 = await comprar(db, { ...quem, tipo: 'pedra', id: 'rerollMilagre', ref: ref() }, { rng: () => 0.79 });
  igual([r1.ok, r1.recibo.chave, r1.recibo.rar, conta(db).cp, bolsa(db).itens], [true, 'traco', 'epico', 99999 - 2400, { traco: 1 }]);
  const db2 = bancoFalso({ cp: 99999 });
  const r2 = await comprar(db2, { ...quem, tipo: 'pedra', id: 'rerollMilagre', ref: ref() }, { rng: () => 0.8 });
  igual([r2.recibo.chave, r2.recibo.rar, bolsa(db2).itens], ['rerollMilagre', 'lendario', { rerollMilagre: 1 }]);
});
await caso('Traço repetido vira Troca de Traço (teto do bot)', async () => {
  const db = bancoFalso({ cp: 99999 });
  db.cols.bolsas.docs.push({ guildId: 'g', userId: 'u1', itens: {}, recebido: { traco: 1 }, historico: [] });
  const r = await comprar(db, { ...quem, tipo: 'pedra', id: 'rerollMilagre', ref: ref() }, { rng: () => 0.1 });
  igual([r.recibo.chave, bolsa(db).itens], ['trocaTraco', { trocaTraco: 1 }]);
});
await caso('chances do Reroll de Milagre batem com 80/20 (100 mil)', async () => {
  const { sortearPeso } = await import('../src/lib/loja.js');
  const { pedra } = await import('../src/data/altar.js');
  const l = pedra.giros.find((g) => g.chave === 'rerollMilagre').sorteio;
  let x = 7; const rng = () => ((x = (x * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
  let m = 0; for (let i = 0; i < 100000; i++) if (sortearPeso(l, rng).chave === 'rerollMilagre') m++;
  if (m < 19000 || m > 21000) throw new Error(`Milagre ${m / 1000}%`);
});
await caso('Loja: Skip Treino até 3 por semana', async () => {
  const db = bancoFalso({ cp: 1000 });
  const rs = [];
  for (let i = 0; i < 4; i++) rs.push((await comprar(db, { ...quem, tipo: 'loja', id: 'skip-treino', ref: ref() }, { agora: new Date('2026-11-21T18:00:00Z') })).ok);
  const semanaQueVem = await comprar(db, { ...quem, tipo: 'loja', id: 'skip-treino', ref: ref() }, { agora: new Date('2026-11-24T18:00:00Z') });
  igual([rs, semanaQueVem.ok, conta(db).cp, bolsa(db).itens.skipTreino], [[true, true, true, false], true, 1000 - 4 * 120, 4]);
});
await caso('Loja: Classe à escolha 1 por personagem, não usa Inscrições', async () => {
  const db = bancoFalso({ cp: 2000, inscricoes: 50 });
  const a = await comprar(db, { ...quem, tipo: 'loja', id: 'classe-escolha', ref: ref() });
  const b = await comprar(db, { ...quem, tipo: 'loja', id: 'classe-escolha', ref: ref() });
  igual([a.ok, b.ok, conta(db).cp, conta(db).inscricoes], [true, false, 1100, 50]);
});
await caso('sem saldo: não cobra e diz quanto falta', async () => {
  const db = bancoFalso({ cp: 100 });
  const r = await comprar(db, { ...quem, tipo: 'loja', id: 'raca-escolha', ref: ref() });
  igual([r.ok, r.falta, conta(db).cp], [false, { cp: 1100 }, 100]);
});
await caso('mesma ref não cobra duas vezes', async () => {
  const db = bancoFalso({ cp: 1000 });
  const x = ref();
  await comprar(db, { ...quem, tipo: 'pedra', id: 'giroConhecimento', ref: x });
  const b = await comprar(db, { ...quem, tipo: 'pedra', id: 'giroConhecimento', ref: x });
  igual([b.ok, b.repetido, conta(db).cp, bolsa(db).itens.giroConhecimento], [true, true, 840, 1]);
});
await caso('bolsa fora do ar: devolve CP, Inscrições e limite, e dá para tentar de novo', async () => {
  const db = bancoFalso({ cp: 1000, inscricoes: 1, bolsaQuebra: true });
  const x = ref();
  const r = await comprar(db, { ...quem, tipo: 'pedra', id: 'giroMagia', ref: x });
  const lim = Object.values(conta(db).limites ?? {});
  igual([r.ok, r.status, conta(db).cp, conta(db).inscricoes, lim, conta(db).gastos], [false, 503, 1000, 1, [0], []]);
});
await caso('compra simultânea: as duas cobram certo (trava otimista)', async () => {
  const db = bancoFalso({ cp: 240 });
  const [a, b] = await Promise.all([
    comprar(db, { ...quem, tipo: 'loja', id: 'skip-treino', ref: ref() }),
    comprar(db, { ...quem, tipo: 'loja', id: 'skip-treino', ref: ref() }),
  ]);
  igual([a.ok, b.ok, conta(db).cp, bolsa(db).itens.skipTreino], [true, true, 0, 2]);
});
await caso('item, tipo e ref inválidos são recusados', async () => {
  const db = bancoFalso({ cp: 99999 });
  const rs = await Promise.all([
    comprar(db, { ...quem, tipo: 'loja', id: 'ateliê', ref: ref() }),
    comprar(db, { ...quem, tipo: 'nada', id: 'giroMagia', ref: ref() }),
    comprar(db, { ...quem, tipo: 'pedra', id: 'giroMagia', ref: 'x' }),
  ]);
  igual([rs.map((r) => r.status), conta(db).cp], [[400, 400, 400], 99999]);
});
await caso('tela: limites usados por item', async () => {
  const db = bancoFalso({ cp: 1000 });
  await comprar(db, { ...quem, tipo: 'pedra', id: 'giroMagia', ref: ref() });
  const l = await limitesDaConta(db, quem);
  igual([l.usados['pedra:giroMagia'], l.usados['pedra:giroGrimorio'], l.usados['loja:classe-escolha'], l.cp], [1, 0, 0, 680]);
});

console.log(`${ok} ok, ${falhas} falharam`);
process.exit(falhas ? 1 : 0);
