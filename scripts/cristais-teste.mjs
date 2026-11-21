// Compra de Cristais sem rede e sem Mongo: banco falso em memória e Mercado Pago falso. node scripts/cristais-teste.mjs
import { createHmac } from 'node:crypto';
import { abrirCompra, cancelarCompra, conferir, conferirAbertos, conferirPorPagamento, inicioDoMes, pedidoDe } from '../src/lib/compras.js';
import { assinaturaValida, dataMp } from '../src/lib/mercadopago.js';

let ok = 0, falhas = 0;
const caso = async (nome, fn) => { try { await fn(); ok++; } catch (e) { falhas++; console.error(`✗ ${nome}: ${e.message}`); } };
const igual = (a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };

// ---------- banco falso (só o que compras.js usa) ----------
const v = (x) => (x && typeof x === 'object' && x._bsontype === 'ObjectId' ? String(x) : x instanceof Date ? x.getTime() : x);
function casa(doc, f) {
  return Object.entries(f).every(([k, c]) => {
    if (k === '$or') return c.some((g) => casa(doc, g));
    const d = doc[k];
    if (c && typeof c === 'object' && !(c instanceof Date) && c._bsontype !== 'ObjectId') {
      return Object.entries(c).every(([op, x]) => {
        if (op === '$ne') return Array.isArray(d) ? !d.map(v).includes(v(x)) : v(d) !== v(x);
        if (op === '$gt') return d != null && v(d) > v(x);
        if (op === '$gte') return d != null && v(d) >= v(x);
        if (op === '$exists') return (d !== undefined) === x;
        if (op === '$in') return x.map(v).includes(v(d));
        throw new Error(`op ${op}`);
      });
    }
    return Array.isArray(d) ? d.map(v).includes(v(c)) : v(d) === v(c);
  });
}
function aplica(doc, u, novo) {
  for (const [k, x] of Object.entries(u.$set ?? {})) doc[k] = x;
  if (novo) for (const [k, x] of Object.entries(u.$setOnInsert ?? {})) doc[k] = x;
  for (const [k, x] of Object.entries(u.$inc ?? {})) doc[k] = (doc[k] ?? 0) + x;
  for (const [k, x] of Object.entries(u.$push ?? {})) (doc[k] ??= []).push(x);
  for (const k of Object.keys(u.$unset ?? {})) delete doc[k];
}
function colecao(unico) {
  const docs = [];
  const dup = (d) => unico && docs.some((o) => o !== d && unico(o, d));
  return {
    docs,
    createIndex: async () => 'ok',
    findOne: async (f) => docs.find((d) => casa(d, f)) ?? null,
    find: (f) => { let l = docs.filter((d) => casa(d, f)); const c = { limit: (n) => { l = l.slice(0, n); return c; }, toArray: async () => l.map((d) => ({ ...d })) }; return c; },
    insertOne: async (d) => { if (dup(d)) throw Object.assign(new Error('dup'), { code: 11000 }); docs.push({ ...d }); },
    updateOne: async (f, u, o = {}) => {
      const d = docs.find((x) => casa(x, f));
      if (d) { aplica(d, u, false); return { modifiedCount: 1 }; }
      if (o.upsert) { const n = { ...Object.fromEntries(Object.entries(f).filter(([, x]) => typeof x !== 'object')) }; aplica(n, u, true); if (dup(n)) throw Object.assign(new Error('dup'), { code: 11000 }); docs.push(n); return { modifiedCount: 0, upsertedCount: 1 }; }
      return { modifiedCount: 0 };
    },
    findOneAndUpdate: async (f, u) => { const d = docs.find((x) => casa(x, f)); if (!d) return null; aplica(d, u, false); return { ...d }; },
  };
}
function bancoFalso() {
  const cols = {
    comprasCristais: colecao((a, b) => a.status === 'pendente' && b.status === 'pendente' && a.userId === b.userId && a.pacote === b.pacote && (a.metodo ?? 'pix') === (b.metodo ?? 'pix')),
    contas: colecao((a, b) => a.userId === b.userId),
  };
  return { cols, collection: (n) => cols[n] };
}

// ---------- Mercado Pago falso ----------
function mpFalso() {
  const pags = new Map(); const prefs = new Map(); let seq = 1000; const chamadas = [];
  const f = async (url, init) => {
    chamadas.push({ url, metodo: init.method, corpo: init.body ? JSON.parse(init.body) : null, chave: init.headers['X-Idempotency-Key'] });
    const resp = (status, corpo) => ({ ok: status < 400, status, json: async () => corpo });
    if (init.headers.Authorization !== 'Bearer TESTE') return resp(401, { message: 'invalid token' });
    if (url.includes('/checkout/preferences')) {
      const b = JSON.parse(init.body); const id = `pref-${++seq}`;
      prefs.set(id, b);
      return resp(201, { id, init_point: `https://mp/checkout/${id}` });
    }
    if (url.includes('/v1/payments/search')) {
      const ref = new URL(url).searchParams.get('external_reference');
      return resp(200, { results: [...pags.values()].filter((p) => p.external_reference === ref).reverse() });
    }
    if (init.method === 'POST') {
      const b = JSON.parse(init.body); const id = String(++seq);
      pags.set(id, { id, status: 'pending', transaction_amount: b.transaction_amount, external_reference: b.external_reference });
      return resp(201, { id, status: 'pending', point_of_interaction: { transaction_data: { qr_code: `000201PIX${id}`, qr_code_base64: 'iVBOR', ticket_url: `https://mp/${id}` } } });
    }
    const id = decodeURIComponent(url.split('/').pop());
    const p = pags.get(id); if (!p) return resp(404, { message: 'not found' });
    if (init.method === 'PUT') { if (p.status === 'approved') return resp(400, { message: 'already approved' }); p.status = 'cancelled'; }
    return resp(200, p);
  };
  // cartão: a pessoa paga na página do Mercado Pago, que cria o pagamento com a referência da preferência
  const pagarCartao = (prefId, status = 'approved', valor) => { const b = prefs.get(prefId); const id = String(++seq); pags.set(id, { id, status, transaction_amount: valor ?? b.items[0].unit_price, external_reference: b.external_reference }); return id; };
  return { f, pags, prefs, chamadas, pagarCartao, pagar: (id, valor) => { const p = pags.get(id); p.status = 'approved'; if (valor) p.transaction_amount = valor; } };
}

const cfg = { token: 'TESTE', email: 'loja@exemplo.com', aviso: 'https://site/api/cristais/aviso' };
const quem = { userId: 'u1', nome: 'Lúx', guildId: 'g1' };
const T0 = new Date('2026-11-21T15:00:00Z');

await caso('abre o Pix do pacote com valor, referência e aviso certos', async () => {
  const db = bancoFalso(), mp = mpFalso();
  const r = await abrirCompra(db, cfg, { ...quem, n: 2 }, { agora: T0, f: mp.f });
  igual([r.ok, r.pedido.cp, r.pedido.valor, r.pedido.status, Boolean(r.pedido.copiaCola), r.pedido.qr.startsWith('data:image/png;base64,')], [true, 990, 14.99, 'pendente', true, true]);
  const c = mp.chamadas[0];
  igual([c.corpo.transaction_amount, c.corpo.external_reference, c.corpo.notification_url, c.chave], [14.99, r.pedido.id, cfg.aviso, r.pedido.id]);
});
await caso('pacote que não existe', async () => igual((await abrirCompra(bancoFalso(), cfg, { ...quem, n: 9 }, { agora: T0, f: mpFalso().f })).ok, false));
await caso('dois cliques no mesmo pacote = o mesmo Pix', async () => {
  const db = bancoFalso(), mp = mpFalso();
  const a = await abrirCompra(db, cfg, { ...quem, n: 1 }, { agora: T0, f: mp.f });
  const b = await abrirCompra(db, cfg, { ...quem, n: 1 }, { agora: new Date(T0.getTime() + 60_000), f: mp.f });
  igual([a.pedido.id === b.pedido.id, mp.chamadas.length], [true, 1]);
});
await caso('pago: credita uma vez só, mesmo conferido três vezes ao mesmo tempo', async () => {
  const db = bancoFalso(), mp = mpFalso();
  const a = await abrirCompra(db, cfg, { ...quem, n: 3 }, { agora: T0, f: mp.f });
  mp.pagar(db.cols.comprasCristais.docs[0].mpId);
  const p = await pedidoDe(db, 'u1', a.pedido.id);
  await Promise.all([conferir(db, 'TESTE', p, { f: mp.f }), conferir(db, 'TESTE', p, { f: mp.f }), conferirPorPagamento(db, 'TESTE', p.mpId, { f: mp.f })]);
  await conferir(db, 'TESTE', await pedidoDe(db, 'u1', a.pedido.id), { f: mp.f });
  const conta = db.cols.contas.docs[0];
  igual([conta.cp, conta.pedidosCreditados.length, db.cols.comprasCristais.docs[0].status, db.cols.comprasCristais.docs[0].copiaCola], [2070, 1, 'pago', undefined]);
});
await caso('primeira compra fica marcada só na primeira', async () => {
  const db = bancoFalso(), mp = mpFalso();
  for (const n of [1, 2]) { const a = await abrirCompra(db, cfg, { ...quem, n }, { agora: T0, f: mp.f }); const d = db.cols.comprasCristais.docs.find((x) => String(x._id) === a.pedido.id); mp.pagar(d.mpId); await conferir(db, 'TESTE', d, { f: mp.f }); }
  const conta = db.cols.contas.docs[0];
  igual([conta.cp, conta.primeiraCompra.pedido === String(db.cols.comprasCristais.docs[0]._id)], [1290, true]);
});
await caso('valor menor que o do pacote não credita', async () => {
  const db = bancoFalso(), mp = mpFalso();
  await abrirCompra(db, cfg, { ...quem, n: 4 }, { agora: T0, f: mp.f });
  const d = db.cols.comprasCristais.docs[0]; mp.pagar(d.mpId, 5);
  igual([(await conferir(db, 'TESTE', d, { agora: T0, f: mp.f })).status, db.cols.contas.docs.length], ['pendente', 0]);
});
await caso('Pix de outro pedido não credita este', async () => {
  const db = bancoFalso(), mp = mpFalso();
  await abrirCompra(db, cfg, { ...quem, n: 1 }, { agora: T0, f: mp.f });
  const d = db.cols.comprasCristais.docs[0]; mp.pags.get(d.mpId).external_reference = 'outro'; mp.pagar(d.mpId);
  igual((await conferir(db, 'TESTE', d, { agora: T0, f: mp.f })).status, 'pendente');
});
await caso('venceu sem pagar: cancela no Mercado Pago e fecha', async () => {
  const db = bancoFalso(), mp = mpFalso();
  await abrirCompra(db, cfg, { ...quem, n: 1 }, { agora: T0, f: mp.f });
  const d = db.cols.comprasCristais.docs[0];
  const r = await conferir(db, 'TESTE', d, { agora: new Date(T0.getTime() + 33 * 60_000), f: mp.f });
  igual([r.status, mp.pags.get(d.mpId).status], ['expirado', 'cancelled']);
});
await caso('pago no último segundo nunca se perde', async () => {
  const db = bancoFalso(), mp = mpFalso();
  await abrirCompra(db, cfg, { ...quem, n: 1 }, { agora: T0, f: mp.f });
  const d = db.cols.comprasCristais.docs[0]; mp.pagar(d.mpId);
  igual((await conferir(db, 'TESTE', d, { agora: new Date(T0.getTime() + 60 * 60_000), f: mp.f })).status, 'pago');
});
await caso('desistir: cancela; se já pagou, credita', async () => {
  const db = bancoFalso(), mp = mpFalso();
  await abrirCompra(db, cfg, { ...quem, n: 1 }, { agora: T0, f: mp.f });
  await abrirCompra(db, cfg, { ...quem, n: 2 }, { agora: T0, f: mp.f });
  const [a, b] = db.cols.comprasCristais.docs; mp.pagar(b.mpId);
  igual([(await cancelarCompra(db, 'TESTE', a, { agora: T0, f: mp.f })).status, (await cancelarCompra(db, 'TESTE', b, { agora: T0, f: mp.f })).status, db.cols.contas.docs[0].cp], ['cancelado', 'pago', 990]);
});
await caso('teto de R$ 150 no mês conta pagos e Pix abertos', async () => {
  const db = bancoFalso(), mp = mpFalso();
  const a = await abrirCompra(db, cfg, { ...quem, n: 6 }, { agora: T0, f: mp.f });
  const b = await abrirCompra(db, cfg, { ...quem, n: 1 }, { agora: T0, f: mp.f });
  igual([a.ok, b.ok, b.erro.includes('teto')], [true, false, true]);
  // pagou a Coroa em novembro: em dezembro abre de novo
  const d = db.cols.comprasCristais.docs[0]; mp.pagar(d.mpId); await conferir(db, 'TESTE', d, { agora: T0, f: mp.f });
  igual((await abrirCompra(db, cfg, { ...quem, n: 1 }, { agora: new Date('2026-12-01T03:30:00Z'), f: mp.f })).ok, true);
});
await caso('mês vira à meia-noite de Brasília', () => igual([inicioDoMes(new Date('2026-12-01T02:59:00Z')).toISOString(), inicioDoMes(new Date('2026-12-01T03:00:00Z')).toISOString()], ['2026-11-01T03:00:00.000Z', '2026-12-01T03:00:00.000Z']));
await caso('pedido de outra conta não aparece', async () => {
  const db = bancoFalso(), mp = mpFalso();
  const a = await abrirCompra(db, cfg, { ...quem, n: 1 }, { agora: T0, f: mp.f });
  igual([await pedidoDe(db, 'u2', a.pedido.id), await pedidoDe(db, 'u1', 'lixo')], [null, null]);
});
await caso('token errado avisa e não deixa pedido aberto', async () => {
  const db = bancoFalso(), mp = mpFalso();
  const r = await abrirCompra(db, { ...cfg, token: 'ERRADO' }, { ...quem, n: 1 }, { agora: T0, f: mp.f });
  igual([r.ok, r.erro.includes('token'), db.cols.comprasCristais.docs[0].status], [false, true, 'cancelado']);
});
await caso('página aberta depois credita o que foi pago com ela fechada', async () => {
  const db = bancoFalso(), mp = mpFalso();
  await abrirCompra(db, cfg, { ...quem, n: 5 }, { agora: T0, f: mp.f });
  mp.pagar(db.cols.comprasCristais.docs[0].mpId);
  await conferirAbertos(db, 'TESTE', 'u1', { f: mp.f });
  igual(db.cols.contas.docs[0].cp, 7500);
});
await caso('cartão: abre a página do Mercado Pago com volta, referência e só cartão', async () => {
  const db = bancoFalso(), mp = mpFalso();
  const r = await abrirCompra(db, { ...cfg, volta: 'https://site/cristais/' }, { ...quem, n: 4, metodo: 'cartao' }, { agora: T0, f: mp.f });
  const [prefId, b] = [...mp.prefs.entries()][0];
  igual([r.ok, r.pedido.metodo, r.pedido.link, b.items[0].unit_price, b.external_reference, b.back_urls.success, b.binary_mode, b.payment_methods.excluded_payment_types.map((x) => x.id).includes('bank_transfer')],
    [true, 'cartao', `https://mp/checkout/${prefId}`, 59.99, r.pedido.id, `https://site/cristais/?compra=${r.pedido.id}`, true, true]);
});
await caso('cartão e Pix do mesmo pacote convivem', async () => {
  const db = bancoFalso(), mp = mpFalso();
  const a = await abrirCompra(db, cfg, { ...quem, n: 1, metodo: 'cartao' }, { agora: T0, f: mp.f });
  const b = await abrirCompra(db, cfg, { ...quem, n: 1 }, { agora: T0, f: mp.f });
  igual([a.ok, b.ok, a.pedido.id !== b.pedido.id], [true, true, true]);
});
await caso('cartão aprovado: a conferida acha pela referência e credita uma vez', async () => {
  const db = bancoFalso(), mp = mpFalso();
  await abrirCompra(db, cfg, { ...quem, n: 2, metodo: 'cartao' }, { agora: T0, f: mp.f });
  const d = db.cols.comprasCristais.docs[0];
  mp.pagarCartao(d.preferenciaId, 'rejected');
  igual((await conferir(db, 'TESTE', d, { agora: T0, f: mp.f })).status, 'pendente');
  const pid = mp.pagarCartao(d.preferenciaId);
  await conferir(db, 'TESTE', d, { agora: T0, f: mp.f });
  await conferirPorPagamento(db, 'TESTE', pid, { f: mp.f });
  igual([db.cols.contas.docs[0].cp, d.status, d.mpId], [990, 'pago', pid]);
});
await caso('cartão: aviso de pagamento aprovado depois de vencido ainda credita', async () => {
  const db = bancoFalso(), mp = mpFalso();
  await abrirCompra(db, cfg, { ...quem, n: 1, metodo: 'cartao' }, { agora: T0, f: mp.f });
  const d = db.cols.comprasCristais.docs[0];
  igual((await conferir(db, 'TESTE', d, { agora: new Date(T0.getTime() + 40 * 60_000), f: mp.f })).status, 'expirado');
  const pid = mp.pagarCartao(d.preferenciaId);
  igual([(await conferirPorPagamento(db, 'TESTE', pid, { f: mp.f })).status, db.cols.contas.docs[0].cp], ['pago', 300]);
});
await caso('estorno no cartão tira os CP uma vez só (saldo pode ficar negativo)', async () => {
  const db = bancoFalso(), mp = mpFalso();
  await abrirCompra(db, cfg, { ...quem, n: 3, metodo: 'cartao' }, { agora: T0, f: mp.f });
  const d = db.cols.comprasCristais.docs[0];
  const pid = mp.pagarCartao(d.preferenciaId);
  await conferirPorPagamento(db, 'TESTE', pid, { f: mp.f });
  db.cols.contas.docs[0].cp -= 2000; // gastou
  mp.pags.get(pid).status = 'charged_back';
  await conferirPorPagamento(db, 'TESTE', pid, { f: mp.f });
  await conferirPorPagamento(db, 'TESTE', pid, { f: mp.f });
  igual([db.cols.contas.docs[0].cp, d.status, db.cols.contas.docs[0].pedidosEstornados.length], [70 - 2070, 'estornado', 1]);
});
await caso('assinatura do aviso do Mercado Pago', () => {
  const segredo = 'abc', ts = '1700000000', man = `id:123;request-id:r1;ts:${ts};`;
  const v1 = createHmac('sha256', segredo).update(man).digest('hex');
  igual([assinaturaValida({ assinatura: `ts=${ts},v1=${v1}`, requestId: 'r1', dataId: '123', segredo }), assinaturaValida({ assinatura: `ts=${ts},v1=${v1}`, requestId: 'r2', dataId: '123', segredo })], [true, false]);
});
await caso('data no fuso de Brasília', () => igual(dataMp(new Date('2026-11-21T15:00:00Z')), '2026-11-21T12:00:00.000-03:00'));

console.log(`${ok} ok, ${falhas} falharam`);
process.exit(falhas ? 1 : 0);
