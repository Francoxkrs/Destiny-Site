// Compra de Cristais Prismáticos pelo Pix (Mercado Pago). O banco e o token chegam de fora,
// então tudo aqui testa sem rede e sem Mongo de verdade (npm run cristais:teste).
//
// Caminho: o jogador clica no pacote → o site cria o pedido em `comprasCristais` e o Pix no Mercado Pago →
// quem confirmar primeiro (a página aberta, que pergunta a cada 4 s; o aviso do Mercado Pago; ou a próxima
// visita à página de Cristais) pergunta ao Mercado Pago e, se "approved", soma os CP em `contas`.
// Somar é idempotente: o id do pedido entra em `contas.pedidosCreditados` na MESMA operação que soma.
import { ObjectId } from 'mongodb';
import { pacotes } from '../data/cristais.js';
import { avisarCompra, avisarEstorno } from './aviso-staff.js';
import { buscarPorReferencia, cancelarPix, consultarPix, criarPix, criarPreferencia, ErroMercadoPago, pagamentoValido } from './mercadopago.js';

export const MINUTOS_PIX = 30;
/** Teto de gasto por conta no mês (regras da página de Cristais), contando Pix ainda abertos. */
export const TETO_MES = 150;
/** Folga depois do prazo do Pix antes de dar como expirado (o banco às vezes demora a compensar). */
const FOLGA_MS = 2 * 60_000;

export const pacotePorN = (n) => pacotes.find((p) => p.n === Number(n)) ?? null;
/** pix = QR na própria página; cartao = Checkout Pro (página do Mercado Pago) */
export const METODOS = ['pix', 'cartao'];
const metodoDe = (p) => p.metodo ?? 'pix';

const pedidos = (db) => db.collection('comprasCristais');
const contas = (db) => db.collection('contas');

let indices = false;
export async function garantirIndices(db) {
  if (indices) return;
  indices = true;
  // um Pix aberto por pacote por conta: dois cliques ao mesmo tempo não geram dois pedidos
  await pedidos(db).createIndex({ userId: 1, pacote: 1, metodo: 1 }, { unique: true, partialFilterExpression: { status: 'pendente' }, name: 'um_pendente_por_pacote_metodo' }).catch(() => null);
  await pedidos(db).createIndex({ userId: 1, status: 1, pagoEm: -1 }).catch(() => null);
  await pedidos(db).createIndex({ mpId: 1 }, { sparse: true }).catch(() => null);
  await contas(db).createIndex({ userId: 1 }, { unique: true }).catch(() => null);
}

/** Primeiro dia do mês em Brasília (UTC-3), em UTC. */
export function inicioDoMes(agora = new Date()) {
  const br = new Date(agora.getTime() - 3 * 3600_000);
  return new Date(Date.UTC(br.getUTCFullYear(), br.getUTCMonth(), 1, 3));
}

const centavos = (v) => Math.round(v * 100);

/** Quanto a conta já pagou neste mês, mais os Pix abertos que ainda valem (sem contar `exceto`). */
export async function comprometidoNoMes(db, userId, agora = new Date(), exceto = null) {
  const lista = await pedidos(db).find({
    userId,
    $or: [{ status: 'pago', pagoEm: { $gte: inicioDoMes(agora) } }, { status: 'pendente', expiraEm: { $gt: agora } }],
  }, { projection: { valor: 1, _id: 1 } }).toArray();
  return lista.filter((p) => !exceto || String(p._id) !== String(exceto)).reduce((s, p) => s + centavos(p.valor), 0) / 100;
}

/** O que a página recebe (nunca o pedido inteiro). */
export function vistaPedido(p) {
  return {
    id: String(p._id), status: p.status, metodo: metodoDe(p), pacote: p.pacote, nome: p.nomePacote, cp: p.cp, valor: p.valor,
    expiraEm: p.expiraEm?.toISOString?.() ?? null, copiaCola: p.status === 'pendente' ? p.copiaCola : null,
    qr: p.status === 'pendente' && p.qrBase64 ? `data:image/png;base64,${p.qrBase64}` : null, link: p.status === 'pendente' ? p.link : null,
  };
}

/** Soma os CP do pedido na conta, uma vez só. Devolve o saldo novo. */
export async function creditar(db, p, agora = new Date()) {
  const id = String(p._id);
  await contas(db).updateOne({ userId: p.userId }, { $setOnInsert: { userId: p.userId, cp: 0, criadoEm: agora } }, { upsert: true }).catch((e) => {
    if (e?.code !== 11000) throw e; // outra chamada criou a conta no mesmo instante
  });
  const somou = await contas(db).updateOne(
    { userId: p.userId, pedidosCreditados: { $ne: id } },
    { $inc: { cp: p.cp }, $push: { pedidosCreditados: id }, $set: { atualizadoEm: agora } },
  );
  // presente da primeira compra: fica marcado na conta para a Staff (e depois o bot) entregar na /bolsa
  const primeira = await contas(db).updateOne(
    { userId: p.userId, primeiraCompra: { $exists: false } },
    { $set: { primeiraCompra: { pedido: id, em: agora, entregue: false } } },
  );
  await pedidos(db).updateOne({ _id: p._id }, { $set: { status: 'pago', pagoEm: p.pagoEm ?? agora, creditado: true }, $unset: { copiaCola: '', qrBase64: '' } });
  const saldo = (await contas(db).findOne({ userId: p.userId }, { projection: { cp: 1 } }))?.cp ?? 0;
  if (somou.modifiedCount) await avisarCompra(p, { saldo, primeira: primeira.modifiedCount > 0 });
  return saldo;
}

/** Pagamento confirmado: marca o pedido (só uma conferida ganha) e credita. Aceita pedido já vencido (o dinheiro entrou). */
async function marcarPago(db, p, agora, de = ['pendente']) {
  const marcado = await pedidos(db).findOneAndUpdate(
    { _id: p._id, status: { $in: de } },
    { $set: { status: 'pago', pagoEm: agora, ...(p.mpId ? { mpId: p.mpId } : {}) } },
    { returnDocument: 'after' },
  ); // driver 6: devolve o documento, ou null se outra conferida chegou antes
  if (!marcado) {
    const atual = await pedidos(db).findOne({ _id: p._id });
    return atual?.status === 'pago' && !atual.creditado ? { status: 'pago', saldo: await creditar(db, atual, agora) } : { status: atual?.status ?? 'pago' };
  }
  return { status: 'pago', saldo: await creditar(db, marcado, agora) };
}

/**
 * Estorno (chargeback) ou reembolso de um pedido já creditado: tira os CP (o saldo pode ficar negativo,
 * o que trava gastar até repor) e avisa a Staff. Uma vez só, pelo `pedidosEstornados`.
 */
export async function estornar(db, p, motivo, agora = new Date()) {
  const id = String(p._id);
  const r = await contas(db).updateOne(
    { userId: p.userId, pedidosCreditados: id, pedidosEstornados: { $ne: id } },
    { $inc: { cp: -p.cp }, $push: { pedidosEstornados: id }, $set: { atualizadoEm: agora } },
  );
  await pedidos(db).updateOne({ _id: p._id }, { $set: { status: 'estornado', estornoEm: agora, mpStatus: motivo } });
  if (r.modifiedCount) {
    const saldo = (await contas(db).findOne({ userId: p.userId }, { projection: { cp: 1 } }))?.cp ?? 0;
    await avisarEstorno(p, { saldo, motivo });
  }
  return { status: 'estornado' };
}

/**
 * Pergunta ao Mercado Pago como está o pedido e age: pago → credita; recusado → fecha; venceu → cancela lá e fecha.
 * Cancela no Mercado Pago ANTES de marcar aqui, então um Pix pago no último segundo nunca se perde.
 * @returns {Promise<{ status: string, saldo?: number }>}
 */
export async function conferir(db, token, p, { agora = new Date(), f = fetch } = {}) {
  if (p.status === 'pago') return { status: 'pago', saldo: p.creditado ? undefined : await creditar(db, p, agora) };
  if (p.status !== 'pendente') return { status: p.status };
  if (!token) return { status: 'pendente' };
  if (metodoDe(p) === 'cartao') {
    // no cartão o pagamento só existe depois que a pessoa paga na página do Mercado Pago: procura pela referência
    const lista = await buscarPorReferencia(token, String(p._id), f);
    const bom = lista.find((s) => pagamentoValido(s, { valor: p.valor, referencia: String(p._id) }));
    if (bom) return marcarPago(db, { ...p, mpId: bom.id }, agora);
    if (p.expiraEm && p.expiraEm.getTime() + FOLGA_MS < agora.getTime()) {
      // a página do Mercado Pago não aceita mais pagar depois do prazo; se algo aprovar mesmo assim, o aviso credita
      await pedidos(db).updateOne({ _id: p._id, status: 'pendente' }, { $set: { status: 'expirado' } });
      return { status: 'expirado' };
    }
    return { status: 'pendente' };
  }
  if (p.mpId) {
    const s = await consultarPix(token, p.mpId, f);
    if (pagamentoValido(s, { valor: p.valor, referencia: String(p._id) })) {
      return marcarPago(db, p, agora);
    }
    if (['cancelled', 'rejected', 'refunded', 'charged_back'].includes(s.status)) {
      const motivo = s.status === 'cancelled' && p.expiraEm < agora ? 'expirado' : 'cancelado';
      await pedidos(db).updateOne({ _id: p._id, status: 'pendente' }, { $set: { status: motivo, mpStatus: s.status } });
      return { status: motivo };
    }
  }
  if (p.expiraEm && p.expiraEm.getTime() + FOLGA_MS < agora.getTime()) {
    if (p.mpId) {
      const ok = await cancelarPix(token, p.mpId, f).then(() => true).catch(() => false);
      if (!ok) return { status: 'pendente' }; // tenta de novo na próxima conferida
    }
    await pedidos(db).updateOne({ _id: p._id, status: 'pendente' }, { $set: { status: 'expirado' } });
    return { status: 'expirado' };
  }
  return { status: 'pendente' };
}

/** Confere todos os Pix abertos da conta (a página de Cristais faz isso ao abrir). */
export async function conferirAbertos(db, token, userId, o = {}) {
  const abertos = await pedidos(db).find({ userId, $or: [{ status: 'pendente' }, { status: 'pago', creditado: { $ne: true } }] }).limit(10).toArray();
  for (const p of abertos) await conferir(db, token, p, o).catch((e) => console.error('cristais (conferir):', e?.message ?? e));
}

/**
 * Abre a compra de um pacote. Reaproveita o Pix aberto do mesmo pacote enquanto ele vale.
 * @returns {Promise<{ ok: true, pedido: object } | { ok: false, erro: string, status?: number }>}
 */
export async function abrirCompra(db, cfg, { userId, nome, guildId, n, metodo = 'pix' }, { agora = new Date(), f = fetch } = {}) {
  const pac = pacotePorN(n);
  if (!pac) return { ok: false, erro: 'Esse pacote não existe.', status: 400 };
  if (!METODOS.includes(metodo)) return { ok: false, erro: 'Forma de pagamento inválida.', status: 400 };
  await garantirIndices(db);
  const pronto = (x) => (metodo === 'cartao' ? Boolean(x.link) : Boolean(x.copiaCola));

  const aberto = await pedidos(db).findOne({ userId, pacote: pac.n, metodo, status: 'pendente' });
  if (aberto) {
    if (aberto.expiraEm.getTime() - agora.getTime() > 3 * 60_000 && pronto(aberto)) return { ok: true, pedido: vistaPedido(aberto) };
    const r = await conferir(db, cfg.token, aberto, { agora, f }).catch(() => ({ status: 'pendente' }));
    if (r.status === 'pago') return { ok: false, erro: 'Esse Pix acabou de ser pago: os Cristais já estão na sua conta.', status: 409 };
    if (r.status === 'pendente' && aberto.expiraEm > agora && pronto(aberto)) return { ok: true, pedido: vistaPedido(aberto) };
    if (r.status === 'pendente') {
      // venceu e não deu para cancelar no Mercado Pago agora
      return { ok: false, erro: 'Seu Pix anterior deste pacote ainda está fechando. Tente de novo em um minuto.', status: 409 };
    }
  }

  const ja = await comprometidoNoMes(db, userId, agora);
  if (centavos(ja) + centavos(pac.preco) > centavos(TETO_MES)) {
    const livre = Math.max(0, TETO_MES - ja);
    return { ok: false, status: 409, erro: `Passa do teto de R$ 150 por mês (já usado: ${ja.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}). ${livre >= pacotes[0].preco ? 'Escolha um pacote menor ou' : 'Dá para'} comprar de novo no mês que vem.` };
  }

  const _id = new ObjectId();
  const expira = new Date(agora.getTime() + MINUTOS_PIX * 60_000);
  try {
    await pedidos(db).insertOne({ _id, userId, nome, guildId, pacote: pac.n, nomePacote: pac.nome, cp: pac.cp, valor: pac.preco, metodo, status: 'pendente', criadoEm: agora, expiraEm: expira, origem: 'site' });
  } catch (e) {
    if (e?.code === 11000) {
      const outro = await pedidos(db).findOne({ userId, pacote: pac.n, metodo, status: 'pendente' });
      if (outro && pronto(outro)) return { ok: true, pedido: vistaPedido(outro) };
      return { ok: false, erro: 'Já estou gerando o seu Pix, espere um instante.', status: 409 };
    }
    throw e;
  }

  if (metodo === 'cartao') {
    try {
      const pref = await criarPreferencia(cfg.token, {
        item: `cristais-${pac.n}`, titulo: `${pac.nome} · ${pac.cp} Cristais Prismáticos · Black Destiny`, valor: pac.preco,
        referencia: String(_id), expira, chave: String(_id), aviso: cfg.aviso, volta: `${cfg.volta}?compra=${_id}`,
        metadata: { user_id: userId, pacote: pac.n },
      }, f);
      await pedidos(db).updateOne({ _id }, { $set: { preferenciaId: pref.id, link: pref.link } });
      return { ok: true, pedido: vistaPedido({ _id, status: 'pendente', metodo, pacote: pac.n, nomePacote: pac.nome, cp: pac.cp, valor: pac.preco, expiraEm: expira, link: pref.link }) };
    } catch (e) {
      await pedidos(db).updateOne({ _id }, { $set: { status: 'cancelado', erro: String(e?.message ?? e).slice(0, 200) } });
      console.error('cristais (criar preferência):', e?.message ?? e);
      return { ok: false, status: 502, erro: e instanceof ErroMercadoPago && e.status === 401 ? 'O token do Mercado Pago está errado. Avise a Staff.' : 'Não consegui abrir o pagamento com cartão agora. Tente de novo em alguns minutos.' };
    }
  }

  let pix;
  try {
    pix = await criarPix(cfg.token, {
      valor: pac.preco, descricao: `${pac.nome} · ${pac.cp} Cristais Prismáticos · Black Destiny`, email: cfg.email,
      referencia: String(_id), expira, chave: String(_id), aviso: cfg.aviso,
      metadata: { user_id: userId, pacote: pac.n },
    }, f);
  } catch (e) {
    await pedidos(db).updateOne({ _id }, { $set: { status: 'cancelado', erro: String(e?.message ?? e).slice(0, 200) } });
    console.error('cristais (criar Pix):', e?.message ?? e);
    return {
      ok: false, status: 502,
      erro: e instanceof ErroMercadoPago && e.status === 401 ? 'O token do Mercado Pago está errado. Avise a Staff.' : 'Não consegui gerar o Pix agora. Tente de novo em alguns minutos.',
    };
  }
  const salvo = { mpId: pix.id, copiaCola: pix.copiaCola, qrBase64: pix.qrBase64, link: pix.link };
  await pedidos(db).updateOne({ _id }, { $set: salvo });
  return { ok: true, pedido: vistaPedido({ _id, status: 'pendente', pacote: pac.n, nomePacote: pac.nome, cp: pac.cp, valor: pac.preco, expiraEm: expira, ...salvo }) };
}

/** O pedido, só se for desta conta. */
export async function pedidoDe(db, userId, id) {
  if (!/^[a-f0-9]{24}$/i.test(String(id ?? ''))) return null;
  const p = await pedidos(db).findOne({ _id: new ObjectId(String(id)) });
  return p && p.userId === userId ? p : null;
}

/** O jogador desiste do Pix. Confere antes: se já pagou, credita em vez de cancelar. */
export async function cancelarCompra(db, token, p, o = {}) {
  const r = await conferir(db, token, p, o).catch(() => ({ status: 'pendente' }));
  if (r.status !== 'pendente') return r;
  const ok = metodoDe(p) === 'cartao' || !p.mpId || (await cancelarPix(token, p.mpId, o.f ?? fetch).then(() => true).catch(() => false));
  if (!ok) return { status: 'pendente', erro: 'Não consegui cancelar no Mercado Pago agora. Se pagar, os Cristais entram normalmente.' };
  await pedidos(db).updateOne({ _id: p._id, status: 'pendente' }, { $set: { status: 'cancelado' } });
  return { status: 'cancelado' };
}

/**
 * Pelo aviso do Mercado Pago: pergunta o pagamento, acha o pedido pela referência e age.
 * Aprovado → credita (mesmo se o pedido já tinha vencido: o dinheiro entrou). Estorno/reembolso de um pedido pago → tira os CP.
 */
export async function conferirPorPagamento(db, token, mpId, o = {}) {
  const agora = o.agora ?? new Date();
  const s = await consultarPix(token, String(mpId), o.f ?? fetch);
  let p = s.referencia && /^[a-f0-9]{24}$/i.test(s.referencia) ? await pedidos(db).findOne({ _id: new ObjectId(s.referencia) }) : null;
  if (!p) p = await pedidos(db).findOne({ mpId: String(mpId) });
  if (!p) return null;
  if (pagamentoValido(s, { valor: p.valor, referencia: String(p._id) })) {
    if (p.status === 'pago') return p.creditado ? { status: 'pago' } : { status: 'pago', saldo: await creditar(db, p, agora) };
    return marcarPago(db, { ...p, mpId: s.id }, agora, ['pendente', 'expirado', 'cancelado']);
  }
  if (p.status === 'pago' && s.referencia === String(p._id) && (!p.mpId || p.mpId === s.id) && ['refunded', 'charged_back'].includes(s.status)) {
    return estornar(db, p, s.status, agora);
  }
  if (p.status === 'pendente') return conferir(db, token, p, o);
  return { status: p.status };
}
