// GET → tudo da própria conta (números, ficha do site, histórico) e a saúde do site e do banco.
// GET ?so=foto → só a foto da ficha (o teste de sincronia do bot pergunta isto a cada segundo).
import { painel, saude, fotoDaFicha } from '../../../lib/admin.js';
import { estadoEnvs } from '../../../lib/admin-envs.js';
import { json, preparar } from './_comum.js';
export const prerender = false;

export async function GET(ctx) {
  const p = await preparar(ctx, false);
  if (p.erro) return p.erro;
  try {
    if (ctx.url.searchParams.get('so') === 'foto') return json(200, { foto: await fotoDaFicha(p.db, p.quem) });
    const [dados, s] = await Promise.all([painel(p.db, p.quem), saude(p.db, estadoEnvs())]);
    return json(200, { ...dados, saude: s, eu: { id: p.s.id, nome: p.s.nome } });
  } catch (e) {
    console.error('admin (painel):', e?.message ?? e);
    return json(500, { erro: 'Não consegui ler o painel agora.' });
  }
}
