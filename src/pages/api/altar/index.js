// GET → saldo (CP e Inscrições), garantia, Vestígios e histórico de quem entrou.
import { estadoAltar } from '../../../lib/altar.js';
import { json, preparar } from './_comum.js';
export const prerender = false;

export async function GET(ctx) {
  const p = await preparar(ctx, false);
  if (p.erro) return p.erro;
  try { return json(200, await estadoAltar(p.db, p.s.id)); } catch (e) {
    console.error('altar (estado):', e?.message ?? e);
    return json(500, { erro: 'Não consegui ler o Altar agora.' });
  }
}
