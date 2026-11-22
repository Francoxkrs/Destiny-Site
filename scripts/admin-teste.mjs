// Sala de Testes sem Mongo: banco falso em memória. node scripts/admin-teste.mjs
process.env.SESSION_SECRET = 'x'.repeat(40);
process.env.ADMIN_IDS = '250000000000000001, lixo,250000000000000002';
process.env.GUILD_ID = '900000000000000001';
const { ehAdmin, adminIds, validarAjuste, ajustar, acao, painel, simular, fotoDaFicha } = await import('../src/lib/admin.js');
const { garantia } = await import('../src/data/altar.js');

let ok = 0, falhas = 0;
const caso = async (nome, fn) => { try { await fn(); ok++; } catch (e) { falhas++; console.error(`✗ ${nome}: ${e.message}`); } };
const igual = (a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
const certo = (x, msg = 'esperava verdadeiro') => { if (!x) throw new Error(msg); };

// ---------- banco falso (só o que admin.js usa) ----------
const pega = (doc, k) => k.split('.').reduce((o, p) => o?.[p], doc);
const poe = (doc, k, x) => { const ps = k.split('.'); let o = doc; for (const p of ps.slice(0, -1)) o = (o[p] ??= {}); o[ps.at(-1)] = x; };
function casa(doc, f) {
  return Object.entries(f).every(([k, c]) => {
    const d = pega(doc, k);
    if (c && typeof c === 'object' && !Array.isArray(c) && !(c instanceof Date)) {
      return Object.entries(c).every(([op, x]) => {
        if (op === '$ne') return d !== x;
        if (op === '$gte') return d != null && d >= x;
        if (op === '$in') return x.includes(d ?? null);
        throw new Error(`op ${op}`);
      });
    }
    return d === c;
  });
}
function aplica(doc, u) {
  for (const [k, x] of Object.entries(u.$set ?? {})) poe(doc, k, structuredClone(x));
  for (const [k, x] of Object.entries(u.$inc ?? {})) poe(doc, k, (pega(doc, k) ?? 0) + x);
}
function colecao() {
  const docs = [];
  let id = 0;
  return {
    docs,
    findOne: async (f) => structuredClone(docs.find((d) => casa(d, f)) ?? null),
    find: (f) => { let l = docs.filter((d) => casa(d, f)); const c = { sort: (s) => { const [[k, o]] = Object.entries(s); l = l.slice().sort((a, b) => (a[k] > b[k] ? o : -o)); return c; }, limit: (n) => { l = l.slice(0, n); return c; }, toArray: async () => structuredClone(l) }; return c; },
    insertOne: async (d) => { docs.push({ _id: `id${++id}`, ...structuredClone(d) }); },
    countDocuments: async (f) => docs.filter((d) => casa(d, f)).length,
    updateOne: async (f, u, o = {}) => {
      const d = docs.find((x) => casa(x, f));
      if (!d) {
        if (o.upsert) { const n = { _id: `id${++id}`, ...structuredClone(u.$setOnInsert ?? {}) }; aplica(n, u); docs.push(n); return { modifiedCount: 0, upsertedCount: 1 }; }
        return { modifiedCount: 0, upsertedCount: 0 };
      }
      aplica(d, u); return { modifiedCount: 1, upsertedCount: 0 };
    },
  };
}
const G = process.env.GUILD_ID;
function bancoFalso({ conta, pers = true, foto = true } = {}) {
  const nomes = ['contas', 'personagens', 'fichasWeb', 'adminLog', 'altarGiros', 'comprasLoja', 'comprasCristais'];
  const cols = Object.fromEntries(nomes.map((n) => [n, colecao()]));
  if (conta) cols.contas.docs.push({ _id: 'c1', userId: 'u1', ...conta });
  if (pers) cols.personagens.docs.push({ _id: 'p1', guildId: G, userId: 'u1', etapa: 'aprovado', estado: { estagio: 7, pe: 3, cristais: { branco: 1, negro: 0, dourado: 0 } } });
  if (foto) cols.fichasWeb.docs.push({ guildId: G, userId: 'u1', nome: 'Lúx', moedas: { yuls: 500 }, mana: { atual: 10, max: 300 }, atualizadoEm: new Date() });
  return { cols, collection: (n) => cols[n], command: async () => ({ ok: 1 }) };
}
const quem = { userId: 'u1', guildId: G, nome: 'Silas' };

// ---------- quem entra ----------
await caso('ADMIN_IDS: só ids do Discord valem', () => igual(adminIds(), ['250000000000000001', '250000000000000002']));
await caso('admin: id da lista entra, outro não, sem sessão não', () => igual(
  [ehAdmin({ id: '250000000000000001' }), ehAdmin({ id: '250000000000000003' }), ehAdmin(null), ehAdmin({})],
  [true, false, false, false],
));
await caso('admin: SESSION_SECRET curta fecha a sala', () => {
  const antes = process.env.SESSION_SECRET; process.env.SESSION_SECRET = 'curta';
  try { certo(!ehAdmin({ id: '250000000000000001' })); } finally { process.env.SESSION_SECRET = antes; }
});
await caso('admin: ADMIN_IDS vazio fecha a sala para todos', () => {
  const antes = process.env.ADMIN_IDS; process.env.ADMIN_IDS = '';
  try { certo(!ehAdmin({ id: '250000000000000001' })); } finally { process.env.ADMIN_IDS = antes; }
});

// ---------- validação ----------
await caso('validar: campo fora da lista, modo e número', () => {
  certo(!validarAjuste({ campo: 'userId', modo: 'definir', valor: 1 }).ok, 'userId');
  certo(!validarAjuste({ campo: '__proto__', modo: 'definir', valor: 1 }).ok, 'proto');
  certo(!validarAjuste({ campo: 'cp', modo: 'trocar', valor: 1 }).ok, 'modo');
  certo(!validarAjuste({ campo: 'cp', modo: 'somar', valor: 1.5 }).ok, 'fração');
  certo(!validarAjuste({ campo: 'cp', modo: 'somar', valor: '1e400' }).ok, 'infinito');
  certo(!validarAjuste({ campo: 'cp', modo: 'somar', valor: 0 }).ok, 'zero');
  certo(validarAjuste({ campo: 'cp', modo: 'somar', valor: '1440' }).ok, 'texto numérico');
});

// ---------- ajustes ----------
await caso('conta nova: somar CP cria a conta', async () => {
  const db = bancoFalso();
  const r = await ajustar(db, quem, validarAjuste({ campo: 'cp', modo: 'somar', valor: 1440 }));
  igual([r.ok, r.antes, r.depois], [true, 0, 1440]);
  igual(db.cols.contas.docs[0].cp, 1440);
  igual(db.cols.adminLog.docs.length, 1);
});
await caso('conta: somar sobe a trava do Altar (altarV)', async () => {
  const db = bancoFalso({ conta: { cp: 100, altarV: 4 } });
  await ajustar(db, quem, validarAjuste({ campo: 'inscricoes', modo: 'somar', valor: 10 }));
  igual([db.cols.contas.docs[0].inscricoes, db.cols.contas.docs[0].altarV], [10, 5]);
});
await caso('conta: não deixa ficar negativo nem passar do teto', async () => {
  const db = bancoFalso({ conta: { cp: 100 } });
  const r1 = await ajustar(db, quem, validarAjuste({ campo: 'cp', modo: 'somar', valor: -101 }));
  const r2 = await ajustar(db, quem, validarAjuste({ campo: 'altarPity', modo: 'definir', valor: garantia.lendario }));
  igual([r1.ok, r2.ok, db.cols.contas.docs[0].cp], [false, false, 100]);
});
await caso('conta: garantia a 1 giro do Lendário', async () => {
  const db = bancoFalso({ conta: { cp: 0 } });
  const r = await ajustar(db, quem, validarAjuste({ campo: 'altarPity', modo: 'definir', valor: garantia.lendario - 1 }));
  igual([r.ok, db.cols.contas.docs[0].altarPity], [true, garantia.lendario - 1]);
});
await caso('personagem: Yuls sem valor gravado partem da ficha do site', async () => {
  const db = bancoFalso();
  const r = await ajustar(db, quem, validarAjuste({ campo: 'yuls', modo: 'somar', valor: 1 }));
  igual([r.antes, r.depois, db.cols.personagens.docs[0].estado.yuls], [500, 501, 501]);
  certo(db.cols.personagens.docs[0].updatedAt instanceof Date, 'updatedAt para o bot ver');
});
await caso('personagem: Estágio entre 1 e 9; Cristais de Mana no caminho certo', async () => {
  const db = bancoFalso();
  const r1 = await ajustar(db, quem, validarAjuste({ campo: 'estagio', modo: 'definir', valor: 0 }));
  const r2 = await ajustar(db, quem, validarAjuste({ campo: 'estagio', modo: 'definir', valor: 3 }));
  const r3 = await ajustar(db, quem, validarAjuste({ campo: 'cristalNegro', modo: 'somar', valor: 5 }));
  igual([r1.ok, r2.ok, r3.ok, db.cols.personagens.docs[0].estado.estagio, db.cols.personagens.docs[0].estado.cristais], [false, true, true, 3, { branco: 1, negro: 5, dourado: 0 }]);
});
await caso('personagem: sem personagem aprovado, não mexe', async () => {
  const db = bancoFalso({ pers: false });
  const r = await ajustar(db, quem, validarAjuste({ campo: 'pe', modo: 'somar', valor: 5 }));
  igual([r.ok, r.status], [false, 409]);
});
await caso('só mexe na própria conta: outra conta fica igual', async () => {
  const db = bancoFalso({ conta: { cp: 10 } });
  db.cols.contas.docs.push({ _id: 'c2', userId: 'u2', cp: 7 });
  await ajustar(db, quem, validarAjuste({ campo: 'cp', modo: 'definir', valor: 99 }));
  igual(db.cols.contas.docs.map((c) => c.cp), [99, 7]);
});

// ---------- atalhos ----------
await caso('encher Mana usa a Mana máxima da ficha', async () => {
  const db = bancoFalso();
  const r = await acao(db, quem, 'encher-mana');
  igual([r.ok, db.cols.personagens.docs[0].estado.manaAtual], [true, 300]);
});
await caso('zerar limites e garantia', async () => {
  const db = bancoFalso({ conta: { limites: { t1_p1_giroMagia: 20 }, altarPity: 30, altarPityE: 4 } });
  await acao(db, quem, 'zerar-limites');
  await acao(db, quem, 'zerar-garantia');
  const c = db.cols.contas.docs[0];
  igual([c.limites, c.altarPity, c.altarPityE], [{}, 0, 0]);
  igual(db.cols.adminLog.docs.length, 2);
});
await caso('ação desconhecida é recusada', async () => igual((await acao(bancoFalso(), quem, 'apagar-tudo')).ok, false));

// ---------- painel ----------
await caso('painel: valores, ficha e histórico', async () => {
  const db = bancoFalso({ conta: { cp: 1440, inscricoes: 3, gastos: [{ ref: 'altar:x', cp: 160, motivo: 'Altar ×1', em: new Date() }] } });
  await ajustar(db, quem, validarAjuste({ campo: 'cp', modo: 'somar', valor: 160 }));
  const p = await painel(db, quem);
  igual([p.valores.cp, p.valores.inscricoes, p.valores.yuls, p.valores.estagio], [1600, 3, 500, 7]);
  igual([p.historico.admin.length, p.conta.gastos.length, Boolean(p.ficha)], [1, 1, true]);
  igual(await fotoDaFicha(db, quem).then((f) => f.yuls), 500);
});

// ---------- simulação ----------
await caso('simular: nunca passa da garantia e soma os giros certos', () => {
  const r = simular(5000);
  igual(r.porRar.lendario + r.porRar.epico + r.porRar.raro, 5000);
  certo(r.lendario.maior <= garantia.lendario, `seca de ${r.lendario.maior}`);
  certo(r.maiorSecaEpico <= garantia.epico, `seca de Épico ${r.maiorSecaEpico}`);
  igual(r.custoCp, 500 * 1440);
});
await caso('simular: começando a 1 giro da garantia, o 1º é Lendário', () => {
  const r = simular(1, { pity: garantia.lendario - 1 });
  igual(r.porRar.lendario, 1);
});

console.log(`${ok} ok, ${falhas} falha(s)`);
process.exit(falhas ? 1 : 0);
