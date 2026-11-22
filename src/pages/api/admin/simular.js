// POST { giros, partida: 'zero' | 'conta' } → simula o Altar com as regras de verdade. Não grava nada nem cobra.
import { simular, TETO_SIMULAR } from '../../../lib/admin.js';
import { json, preparar, corpoDe } from './_comum.js';
export const prerender = false;

export async function POST(ctx) {
  const p = await preparar(ctx, true);
  if (p.erro) return p.erro;
  const corpo = await corpoDe(ctx.request);
  const n = Math.floor(Number(corpo?.giros));
  if (!Number.isFinite(n) || n < 1 || n > TETO_SIMULAR) return json(400, { erro: `Simule de 1 a ${TETO_SIMULAR.toLocaleString('pt-BR')} giros.` });
  let inicio = {};
  if (corpo?.partida === 'conta') {
    const c = await p.db.collection('contas').findOne({ userId: p.quem.userId }, { projection: { altarPity: 1, altarPityE: 1, vestigios: 1, fragmentos: 1 } });
    inicio = { pity: c?.altarPity ?? 0, pityE: c?.altarPityE ?? 0, vestigios: c?.vestigios ?? {}, fragmentos: c?.fragmentos ?? 0 };
  }
  return json(200, simular(n, inicio));
}
