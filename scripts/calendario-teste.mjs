// Calendário e métricas sem Mongo nem Discord. node scripts/calendario-teste.mjs
import { validarItem, dataValida, linkValido, limitesDoMes } from '../src/lib/calendario.js';
import { calcular, lerDiscord } from '../src/lib/metricas.js';

let ok = 0, falhas = 0;
const caso = async (nome, fn) => { try { await fn(); ok++; } catch (e) { falhas++; console.error(`✗ ${nome}: ${e.message}`); } };
const igual = (a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };

// ---------- calendário
await caso('datas: só dia que existe', () => igual([dataValida('2026-12-19'), dataValida('2026-02-30'), dataValida('2026-13-01'), dataValida('19/12/2026')], [true, false, false, false]));
await caso('link: só do site ou do Discord', () => igual(
  [linkValido('/altar/'), linkValido('https://discord.com/channels/1/2'), linkValido('https://discord.gg/abc'), linkValido('javascript:alert(1)'), linkValido('https://evil.com'), linkValido('//evil.com'), linkValido('')],
  ['/altar/', 'https://discord.com/channels/1/2', 'https://discord.gg/abc', null, null, null, ''],
));
await caso('item válido sai limpo', () => {
  const r = validarItem({ titulo: '  Masmorra do Solstício ', tipo: 'evento', data: '2026-12-19', fim: '2026-12-21', hora: '20:00', texto: 'x', link: '', publico: true, extra: 'não entra' });
  igual(r, { ok: true, item: { titulo: 'Masmorra do Solstício', tipo: 'evento', data: '2026-12-19', publico: true, fim: '2026-12-21', hora: '20:00', texto: 'x' } });
});
await caso('item: tipo, fim antes, hora e título', () => igual(
  [validarItem({ titulo: 'A', tipo: 'evento', data: '2026-12-19' }).ok, validarItem({ titulo: 'Ab', tipo: 'xx', data: '2026-12-19' }).ok,
    validarItem({ titulo: 'Ab', tipo: 'evento', data: '2026-12-19', fim: '2026-12-18' }).ok, validarItem({ titulo: 'Ab', tipo: 'evento', data: '2026-12-19', hora: '25:00' }).ok,
    validarItem({ titulo: 'Ab', tipo: 'rp', data: '2026-12-19', publico: false }).item.publico],
  [false, false, false, false, false],
));
await caso('mês: limites', () => igual([limitesDoMes('2026-02'), limitesDoMes('2026-13')], [{ de: '2026-02-01', ate: '2026-02-28' }, null]));

// ---------- métricas
const hoje = '2026-11-22';
const dc = { ok: true, total: 6, online: 3, membros: [
  { id: 'a', bot: false, entrou: '2026-01-01T10:00:00Z' },
  { id: 'b', bot: false, entrou: '2026-11-20T10:00:00Z' },
  { id: 'c', bot: false, entrou: '2026-11-05T10:00:00Z' },
  { id: 'd', bot: false, entrou: '2026-11-21T10:00:00Z' },
  { id: 'bot', bot: true, entrou: '2026-11-21T10:00:00Z' },
] };
const bd = { ultimoDia: new Map([['a', '2026-11-22'], ['c', '2026-11-17'], ['x', '2026-10-01']]), criaram: new Set(['a', 'b', 'c']), aprovados: new Set(['a', 'c']), fichasPorSemana: {} };
await caso('métricas: ativos, novatos e funil', () => {
  const m = calcular(dc, bd, hoje, []);
  igual([m.membros.humanos, m.ativos.semana, m.ativos.hoje, m.novatos.semana, m.novatos.mes], [4, 2, 1, 2, 3]);
  igual(m.novatos.funil.map((f) => f.n), [3, 2, 1, 1]);
  igual(m.ultimaVez.map((f) => f.n), [1, 0, 1, 0, 0, 1]);
  igual(m.entradas.length, 12);
});
await caso('métricas: retenção pelas fotos', () => {
  const hist = [{ dia: '2026-11-01', membros: 3, ativos7: 1, novosIds: ['c', 'z'] }, { dia: '2026-11-15', membros: 4, ativos7: 2, novosIds: ['y'], saidas: 1 }];
  const m = calcular(dc, bd, hoje, hist);
  igual(m.novatos.retencao, { chegaram: 3, ficaram: 1, pct: 33 });
  igual(m.entradas.find((e) => e.semana === '2026-11-09').saidas, 1);
});
await caso('métricas: sem Discord, ainda conta os jogadores', () => {
  const m = calcular({ ok: false, erro: 'x' }, bd, hoje, []);
  igual([m.membros, m.novatos, m.ativos.semana], [null, null, 2]);
});
await caso('Discord: sem token avisa; 403 pede a intenção', async () => {
  igual((await lerDiscord('', 'g')).ok, false);
  const f = async (u) => (u.includes('/members') ? { ok: false, status: 403 } : { ok: true, status: 200, json: async () => ({ approximate_member_count: 5 }) });
  const r = await lerDiscord('t', 'g403', f);
  igual([r.ok, r.erro.includes('Server Members')], [false, true]);
});

console.log(`${ok} ok, ${falhas} falha(s)`);
process.exit(falhas ? 1 : 0);
