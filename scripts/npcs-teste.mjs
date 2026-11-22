// Arquivo de NPCs sem Mongo. node scripts/npcs-teste.mjs
import { validarNpc, salvar, apagar, importar, listar, slugDe } from '../src/lib/npcs.js';

let ok = 0, falhas = 0;
const caso = async (nome, fn) => { try { await fn(); ok++; } catch (e) { falhas++; console.error(`✗ ${nome}: ${e.message}`); } };
const igual = (a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };

// banco falso: só o que lib/npcs.js usa
function bancoFalso() {
  const cols = {};
  const casa = (d, f) => Object.entries(f).every(([k, v]) => (v && typeof v === 'object' && '$nin' in v ? !v.$nin.includes(d[k]) : d[k] === v));
  const upd = (c, filtro, u, upsert) => {
    let d = c.find((x) => casa(x, filtro));
    if (!d) { if (!upsert) return; d = { ...filtro, ...(u.$setOnInsert || {}) }; c.push(d); }
    Object.assign(d, u.$set || {});
    for (const k of Object.keys(u.$unset || {})) delete d[k];
  };
  return {
    collection(n) {
      const c = (cols[n] ??= []);
      return {
        findOne: async (f) => c.find((x) => casa(x, f)) ?? null,
        find: (f) => ({ sort: () => ({ limit: (l) => ({ toArray: async () => c.filter((x) => casa(x, f)).slice(0, l).map((x) => ({ ...x })) }) }) }),
        countDocuments: async (f) => c.filter((x) => casa(x, f)).length,
        updateOne: async (f, u, o = {}) => upd(c, f, u, o.upsert),
        deleteOne: async (f) => { const i = c.findIndex((x) => casa(x, f)); if (i >= 0) c.splice(i, 1); },
        insertOne: async (d) => { c.push(d); },
        bulkWrite: async (ops) => ops.forEach((o) => upd(c, o.updateOne.filter, o.updateOne.update, o.updateOne.upsert)),
      };
    },
    cols,
  };
}
const quem = { userId: '1', nome: 'Staff' };

await caso('slug', () => igual(slugDe('Vó Mirela'), 'vo-mirela'));
await caso('valida: nome, listas, cor e kanji', () => {
  igual(validarNpc({ nome: 'A' }).ok, false);
  igual(validarNpc({ nome: 'Pito', campos: 'x' }).ok, false);
  const r = validarNpc({ nome: ' Pito ', cor: 'red', kanji: '童童童', campos: [{ r: 'Ponto fraco', v: 'boné', segredo: 1 }, { r: '', v: 'some' }], falas: ['', 'oi'] });
  igual(r.npc, { id: 'pito', grupo: 'Sem grupo', nome: 'Pito', campos: [{ r: 'Ponto fraco', v: 'boné', segredo: true }], falas: ['oi'], ordem: 0, kanji: '童童' });
});
await caso('salvar, renomear, apagar e log', async () => {
  const db = bancoFalso();
  igual((await salvar(db, quem, { nome: 'Odette Kern', grupo: 'Círculo', alcunha: 'x' })).id, 'odette-kern');
  await salvar(db, quem, { antigo: 'odette-kern', nome: 'Odette K.', grupo: 'Círculo' });
  const l = await listar(db);
  igual([l.length, l[0].id, 'alcunha' in l[0]], [1, 'odette-k', false]);
  igual((await salvar(db, quem, { antigo: 'nao-existe', nome: 'Odette K.' })).status, 409);
  igual((await apagar(db, quem, 'odette-k')).ok, true);
  igual((await apagar(db, quem, 'odette-k')).status, 404);
  igual(db.cols.adminLog.map((x) => x.acao), ['npc-criar', 'npc-editar', 'npc-apagar']);
});
await caso('renomear para nome que já existe é recusado', async () => {
  const db = bancoFalso();
  await salvar(db, quem, { nome: 'Pito' }); await salvar(db, quem, { nome: 'Mirela' });
  igual((await salvar(db, quem, { antigo: 'mirela', nome: 'Pito' })).status, 409);
  igual((await listar(db)).length, 2);
});
await caso('importar: regrava pelo nome e recusa repetido ou inválido', async () => {
  const db = bancoFalso();
  await salvar(db, quem, { nome: 'Pito', grupo: 'Velho' });
  igual((await importar(db, quem, [{ nome: 'Pito', grupo: 'Feira' }, { nome: 'Vó Mirela', grupo: 'Feira' }])).total, 2);
  const l = await listar(db);
  igual([l.length, l.find((n) => n.id === 'pito').grupo], [2, 'Feira']);
  igual((await importar(db, quem, [{ nome: 'X1' }, { nome: 'x1' }])).ok, false);
  igual((await importar(db, quem, [{ nome: 'Ok' }, { nome: 'B' }])).erro.startsWith('NPC nº 2'), true);
  igual((await importar(db, quem, {})).ok, false);
});
await caso('o arquivo da Staff passa na validação', async () => {
  const fs = await import('node:fs');
  const arq = process.argv[2];
  if (!arq || !fs.existsSync(arq)) return;
  const lista = JSON.parse(fs.readFileSync(arq, 'utf8'));
  const db = bancoFalso();
  igual((await importar(db, quem, lista)).total, lista.length);
});

console.log(`${ok} ok, ${falhas} falha(s)`);
process.exit(falhas ? 1 : 0);
