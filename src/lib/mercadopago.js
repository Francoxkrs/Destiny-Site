// Cliente mínimo do Mercado Pago para Pix (o mesmo jeito do bot: functions/pagamento/mercadopago.ts).
// Puro: recebe o token e o fetch, não lê banco nem variável de ambiente (testa sem rede: npm run cristais:teste).
// Docs: POST /v1/payments com payment_method_id "pix" devolve o QR em point_of_interaction.transaction_data.
import { createHmac, timingSafeEqual } from 'node:crypto';

const API = 'https://api.mercadopago.com/v1/payments';

export class ErroMercadoPago extends Error {
  constructor(msg, status) { super(msg); this.status = status; }
}

async function chamar(token, url, init, f) {
  const r = await f(url, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    signal: AbortSignal.timeout(15_000),
  });
  const corpo = await r.json().catch(() => ({}));
  if (!r.ok) throw new ErroMercadoPago(`Mercado Pago: ${typeof corpo.message === 'string' ? corpo.message : `HTTP ${r.status}`}`, r.status);
  return corpo;
}

/** 2026-11-21T12:00:00.000-03:00 (horário de Brasília), o formato que o Mercado Pago aceita. */
export function dataMp(d) {
  return `${new Date(d.getTime() - 3 * 3600_000).toISOString().slice(0, 23)}-03:00`;
}

/** @returns {Promise<{ id: string, status: string, copiaCola: string, qrBase64: string, link: string | null }>} */
export async function criarPix(token, o, f = fetch) {
  const corpo = await chamar(token, API, {
    method: 'POST',
    // mesma chave = mesmo pagamento: um clique repetido não gera dois Pix
    headers: { 'X-Idempotency-Key': o.chave },
    body: JSON.stringify({
      transaction_amount: o.valor,
      description: o.descricao,
      payment_method_id: 'pix',
      payer: { email: o.email },
      external_reference: o.referencia,
      date_of_expiration: dataMp(o.expira),
      ...(o.aviso ? { notification_url: o.aviso } : {}),
      metadata: o.metadata ?? {},
    }),
  }, f);
  const dados = corpo.point_of_interaction?.transaction_data ?? {};
  const copiaCola = typeof dados.qr_code === 'string' ? dados.qr_code : '';
  if (!corpo.id || !copiaCola) throw new ErroMercadoPago('Mercado Pago não devolveu o QR Code. A conta tem uma chave Pix cadastrada?');
  return {
    id: String(corpo.id), status: String(corpo.status ?? 'pending'), copiaCola,
    qrBase64: typeof dados.qr_code_base64 === 'string' ? dados.qr_code_base64 : '',
    link: typeof dados.ticket_url === 'string' ? dados.ticket_url : null,
  };
}

/** @returns {Promise<{ id: string, status: string, valor: number, referencia: string | null }>} */
export async function consultarPix(token, id, f = fetch) {
  const c = await chamar(token, `${API}/${encodeURIComponent(id)}`, { method: 'GET' }, f);
  return { id: String(c.id), status: String(c.status ?? ''), valor: Number(c.transaction_amount ?? 0), referencia: typeof c.external_reference === 'string' ? c.external_reference : null };
}

export async function cancelarPix(token, id, f = fetch) {
  await chamar(token, `${API}/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify({ status: 'cancelled' }) }, f);
}

/** Só conta como pago quando o Mercado Pago diz "approved", o valor bate e o pagamento é deste pedido. */
export function pagamentoValido(s, esperado) {
  return s.status === 'approved' && s.valor + 0.001 >= esperado.valor && s.referencia === esperado.referencia;
}

/**
 * Assinatura do aviso (webhook) do Mercado Pago: cabeçalho x-signature "ts=...,v1=..." e o manifesto
 * "id:<data.id>;request-id:<x-request-id>;ts:<ts>;" com HMAC-SHA256 da chave secreta do painel.
 * O site nunca confia no aviso: ele só diz "olhe o pagamento X", e o site pergunta ao Mercado Pago.
 */
export function assinaturaValida({ assinatura, requestId, dataId, segredo }) {
  if (!assinatura || !segredo) return false;
  const partes = Object.fromEntries(String(assinatura).split(',').map((p) => p.trim().split('=').map((x) => x.trim())));
  if (!partes.ts || !partes.v1) return false;
  const id = /^[a-z0-9]+$/i.test(dataId) ? String(dataId).toLowerCase() : String(dataId);
  const manifesto = `id:${id};${requestId ? `request-id:${requestId};` : ''}ts:${partes.ts};`;
  const esperado = Buffer.from(createHmac('sha256', segredo).update(manifesto).digest('hex'));
  const recebido = Buffer.from(String(partes.v1));
  return esperado.length === recebido.length && timingSafeEqual(esperado, recebido);
}

/**
 * Checkout Pro (cartão): cria a "preferência" e devolve o link da página de pagamento do próprio Mercado Pago.
 * O número do cartão nunca passa pelo site. binary_mode = o pagamento sai aprovado ou recusado na hora (sem "em análise").
 * @returns {Promise<{ id: string, link: string }>}
 */
export async function criarPreferencia(token, o, f = fetch) {
  const corpo = await chamar(token, 'https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: { 'X-Idempotency-Key': o.chave },
    body: JSON.stringify({
      items: [{ id: o.item, title: o.titulo, quantity: 1, unit_price: o.valor, currency_id: 'BRL', category_id: 'virtual_goods' }],
      external_reference: o.referencia,
      back_urls: { success: o.volta, failure: o.volta, pending: o.volta },
      auto_return: 'approved',
      binary_mode: true,
      statement_descriptor: 'BLACKDESTINY',
      expires: true,
      expiration_date_to: dataMp(o.expira),
      // só cartão: Pix já tem o caminho próprio (mais barato), boleto demora dias
      payment_methods: { excluded_payment_types: [{ id: 'ticket' }, { id: 'bank_transfer' }, { id: 'atm' }], installments: 12 },
      ...(o.aviso ? { notification_url: o.aviso } : {}),
      metadata: o.metadata ?? {},
    }),
  }, f);
  const link = typeof corpo.init_point === 'string' ? corpo.init_point : '';
  if (!corpo.id || !link) throw new ErroMercadoPago('Mercado Pago não devolveu o link do pagamento.');
  return { id: String(corpo.id), link };
}

/** Pagamentos de um pedido (pela referência), do mais novo ao mais antigo. */
export async function buscarPorReferencia(token, referencia, f = fetch) {
  const q = new URLSearchParams({ external_reference: referencia, sort: 'date_created', criteria: 'desc', limit: '20' });
  const c = await chamar(token, `${API}/search?${q}`, { method: 'GET' }, f);
  return (Array.isArray(c.results) ? c.results : []).map((x) => ({ id: String(x.id), status: String(x.status ?? ''), valor: Number(x.transaction_amount ?? 0), referencia: typeof x.external_reference === 'string' ? x.external_reference : null }));
}
