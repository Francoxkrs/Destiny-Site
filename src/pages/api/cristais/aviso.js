// Aviso (webhook) do Mercado Pago: "o pagamento X mudou". O site não confia no corpo: pergunta ao Mercado Pago
// pelo id e só credita se lá estiver "approved", com o valor e o pedido certos. Responde 200 rápido sempre que
// entendeu o aviso, para o Mercado Pago não repetir à toa.
import { banco } from '../../../lib/db.js';
import { env, pagamentoPronto } from '../../../lib/env.js';
import { conferirPorPagamento } from '../../../lib/compras.js';
import { assinaturaValida } from '../../../lib/mercadopago.js';
export const prerender = false;

const ok = (status = 200) => new Response(null, { status, headers: { 'cache-control': 'no-store' } });

export async function POST({ request, url }) {
  if (!pagamentoPronto()) return ok(503);
  let corpo = {};
  try { corpo = await request.json(); } catch { /* aviso antigo vem só na URL */ }
  const tipo = url.searchParams.get('type') ?? url.searchParams.get('topic') ?? corpo?.type ?? corpo?.topic ?? '';
  const id = String(url.searchParams.get('data.id') ?? corpo?.data?.id ?? url.searchParams.get('id') ?? '');
  if (tipo !== 'payment' || !/^\d{1,30}$/.test(id)) return ok(); // outros avisos (teste, merchant_order) não interessam

  if (env.mpSegredo && !assinaturaValida({ assinatura: request.headers.get('x-signature'), requestId: request.headers.get('x-request-id'), dataId: url.searchParams.get('data.id') ?? id, segredo: env.mpSegredo })) {
    return ok(401);
  }
  const db = await banco().catch(() => null);
  if (!db) return ok(503); // o Mercado Pago tenta de novo
  try {
    await conferirPorPagamento(db, env.mpToken, id);
    return ok();
  } catch (e) {
    console.error('cristais (aviso):', e?.message ?? e);
    return ok(500);
  }
}
