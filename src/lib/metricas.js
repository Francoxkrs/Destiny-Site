/**
 * Métricas do servidor na Sala de Testes (2026-11-22, pedido do Silas): quantas pessoas, quantas ficam, quantas jogam.
 *
 * De onde vem cada número:
 *   Discord (API, com DISCORD_BOT_TOKEN): membros, online agora e a data em que cada membro entrou.
 *   Banco do bot: `passes.dia` (último dia em que a pessoa ganhou XP do Passe = jogou: post de RP, missão, treino, criatura)
 *                 e `personagens` (quem criou e quem foi aprovado).
 *   `metricasDia`: uma foto por dia (horário de Brasília), tirada pela Vercel à meia-noite (/api/cron/metricas)
 *                  ou na hora pelo painel. Só ela sabe quem SAIU: compara os membros de um dia com os do anterior.
 *
 * Nada de dado de pessoa vai para o navegador: só contagens. Os ids ficam só no banco, para as próximas fotos.
 */
export const META = { ativos: 40, ate: '2027-02-01', fonte: 'Plano do Destiny (proposta de 22/11)' };

const DIA = 864e5;
export const diaBR = (t = Date.now()) => new Date(t - 3 * 3600e3).toISOString().slice(0, 10);
const menosDias = (dia, n) => new Date(Date.parse(`${dia}T12:00:00Z`) - n * DIA).toISOString().slice(0, 10);
/** segunda-feira da semana de um dia "AAAA-MM-DD" */
const semana = (dia) => { const t = Date.parse(`${dia}T12:00:00Z`); const w = (new Date(t).getUTCDay() + 6) % 7; return new Date(t - w * DIA).toISOString().slice(0, 10); };

/* ------------------------------------------------------------------ Discord */

let cacheDiscord = null; // { em, dados }

/**
 * Lê o servidor pela API do Discord. Precisa do token do bot e da intenção "Server Members" ligada no portal do Discord.
 * @returns {Promise<{ ok: true, total: number, online: number|null, membros: { id: string, bot: boolean, entrou: string }[] } | { ok: false, erro: string }>}
 */
export async function lerDiscord(token, guildId, f = fetch) {
  if (!token) return { ok: false, erro: 'Falta DISCORD_BOT_TOKEN na Vercel (o mesmo token do bot).' };
  if (cacheDiscord && Date.now() - cacheDiscord.em < 60_000 && cacheDiscord.guildId === guildId) return cacheDiscord.dados;
  const h = { authorization: `Bot ${token}`, 'user-agent': 'BlackDestinySite (site, 1.0)' };
  const g = await f(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, { headers: h });
  if (g.status === 401) return { ok: false, erro: 'O Discord recusou o DISCORD_BOT_TOKEN (token errado ou trocado).' };
  if (!g.ok) return { ok: false, erro: `O Discord respondeu ${g.status} ao ler o servidor.` };
  const gj = await g.json();
  const membros = [];
  let depois = '0';
  for (let pag = 0; pag < 20; pag++) {
    const r = await f(`https://discord.com/api/v10/guilds/${guildId}/members?limit=1000&after=${depois}`, { headers: h });
    if (r.status === 403) return { ok: false, erro: 'Ligue a intenção "Server Members" do bot no Portal de Desenvolvedores do Discord.' };
    if (r.status === 429) { const s = Number((await r.json().catch(() => ({}))).retry_after ?? 1); await new Promise((ok) => setTimeout(ok, Math.min(5, s) * 1000)); pag--; continue; }
    if (!r.ok) return { ok: false, erro: `O Discord respondeu ${r.status} ao listar os membros.` };
    const l = await r.json();
    for (const m of l) membros.push({ id: m.user.id, bot: Boolean(m.user.bot), entrou: m.joined_at });
    if (l.length < 1000) break;
    depois = l[l.length - 1].user.id;
  }
  const dados = { ok: true, total: gj.approximate_member_count ?? membros.length, online: gj.approximate_presence_count ?? null, membros };
  cacheDiscord = { em: Date.now(), guildId, dados };
  return dados;
}

/* ------------------------------------------------------------------ banco do bot */

export async function lerBanco(db, guildId) {
  const [passes, pers] = await Promise.all([
    db.collection('passes').find({ guildId }, { projection: { userId: 1, dia: 1 } }).toArray().catch(() => []),
    db.collection('personagens').find({ guildId, npc: { $ne: true } }, { projection: { userId: 1, etapa: 1, createdAt: 1 } }).toArray().catch(() => []),
  ]);
  // a mesma pessoa pode ter um Passe por temporada: vale o dia mais recente
  const ultimoDia = new Map();
  for (const p of passes) if (p.userId && p.dia && (!ultimoDia.has(p.userId) || p.dia > ultimoDia.get(p.userId))) ultimoDia.set(p.userId, p.dia);
  return {
    ultimoDia,
    criaram: new Set(pers.map((p) => p.userId).filter(Boolean)),
    aprovados: new Set(pers.filter((p) => p.etapa === 'aprovado').map((p) => p.userId).filter(Boolean)),
    fichasPorSemana: contarPor(pers.map((p) => p.createdAt && diaBR(new Date(p.createdAt).getTime())).filter(Boolean), semana),
  };
}

function contarPor(dias, chave) {
  const m = {};
  for (const d of dias) { const k = chave(d); m[k] = (m[k] ?? 0) + 1; }
  return m;
}

/* ------------------------------------------------------------------ contas (puras) */

/** As últimas `n` semanas (segundas), da mais velha para a mais nova. */
export function semanas(hoje, n = 12) {
  const s0 = semana(hoje);
  return Array.from({ length: n }, (_, i) => menosDias(s0, (n - 1 - i) * 7));
}

/**
 * Junta Discord, banco e o histórico de fotos nos números do painel.
 * @param {{ ok: boolean, total?: number, online?: number|null, membros?: any[] }} dc
 * @param {Awaited<ReturnType<typeof lerBanco>>} bd
 * @param {{ dia: string, membros: number, humanos?: number, ativos7: number, saidas?: number, entradas?: number, novosIds?: string[] }[]} hist  fotos, da mais velha para a mais nova
 */
export function calcular(dc, bd, hoje, hist = []) {
  const humanos = dc.ok ? dc.membros.filter((m) => !m.bot) : [];
  const presentes = new Set(humanos.map((m) => m.id));
  const entrouDia = (m) => diaBR(Date.parse(m.entrou));
  const d7 = menosDias(hoje, 6), d30 = menosDias(hoje, 29);

  // quem jogou: ganhou XP do Passe nos últimos 7 dias (contando hoje)
  const faixas = [['Hoje', 0, 0], ['1 a 2 dias', 1, 2], ['3 a 6 dias', 3, 6], ['1 a 2 semanas', 7, 13], ['2 a 4 semanas', 14, 29], ['Mais de 30 dias', 30, Infinity]];
  const ultimaVez = faixas.map(([nome]) => ({ nome, n: 0 }));
  let ativos7 = 0, ativosHoje = 0;
  for (const [, dia] of bd.ultimoDia) {
    const dd = Math.round((Date.parse(`${hoje}T12:00:00Z`) - Date.parse(`${dia}T12:00:00Z`)) / DIA);
    if (dd < 0) continue;
    if (dd <= 6) ativos7++;
    if (dd === 0) ativosHoje++;
    const i = faixas.findIndex(([, a, b]) => dd >= a && dd <= b);
    if (i >= 0) ultimaVez[i].n++;
  }

  // novatos: entraram nos últimos 30 dias e continuam no servidor
  const novatos30 = humanos.filter((m) => entrouDia(m) >= d30);
  const novatos7 = humanos.filter((m) => entrouDia(m) >= d7).length;
  const jogou = (id) => { const d = bd.ultimoDia.get(id); return Boolean(d && d >= d7); };
  const funil = [
    { nome: 'Entraram e continuam', n: novatos30.length },
    { nome: 'Criaram personagem', n: novatos30.filter((m) => bd.criaram.has(m.id)).length },
    { nome: 'Personagem aprovado', n: novatos30.filter((m) => bd.aprovados.has(m.id)).length },
    { nome: 'Jogaram nesta semana', n: novatos30.filter((m) => jogou(m.id)).length },
  ];

  // entradas por semana (de quem continua: o Discord só mostra quem está) e saídas (só com as fotos diárias)
  const sems = semanas(hoje, 12);
  const porSemana = contarPor(humanos.map(entrouDia), semana);
  const saidasPorSemana = {};
  for (const f of hist) if (f.saidas != null) saidasPorSemana[semana(f.dia)] = (saidasPorSemana[semana(f.dia)] ?? 0) + f.saidas;
  const entradas = sems.map((s) => ({ semana: s, ficaram: porSemana[s] ?? 0, saidas: saidasPorSemana[s] ?? null, fichas: bd.fichasPorSemana[s] ?? 0 }));

  // quantos novatos ficam: dos que as fotos viram chegar entre 7 e 37 dias atrás, quantos ainda estão
  const chegaram = new Set();
  for (const f of hist) if (f.dia >= menosDias(hoje, 37) && f.dia <= menosDias(hoje, 7)) for (const id of f.novosIds ?? []) chegaram.add(id);
  const ficaram = [...chegaram].filter((id) => presentes.has(id)).length;
  const retencao = chegaram.size ? { chegaram: chegaram.size, ficaram, pct: Math.round((ficaram / chegaram.size) * 100) } : null;

  const semanaPassada = hist.find((f) => f.dia === menosDias(hoje, 7));
  return {
    hoje,
    discord: dc.ok ? { ok: true } : { ok: false, erro: dc.erro },
    membros: dc.ok ? { total: dc.total, humanos: humanos.length, online: dc.online, delta7: semanaPassada ? humanos.length - (semanaPassada.humanos ?? semanaPassada.membros) : null } : null,
    ativos: { semana: ativos7, hoje: ativosHoje, meta: META, delta7: semanaPassada ? ativos7 - semanaPassada.ativos7 : null },
    novatos: dc.ok ? { semana: novatos7, mes: novatos30.length, funil, retencao } : null,
    jogadores: { criaram: bd.criaram.size, aprovados: bd.aprovados.size },
    ultimaVez,
    entradas,
    historico: hist.map((f) => ({ dia: f.dia, membros: f.humanos ?? f.membros, ativos7: f.ativos7, entradas: f.entradas ?? null, saidas: f.saidas ?? null })),
  };
}

/* ------------------------------------------------------------------ foto do dia */

/** Grava (ou regrava) a foto de hoje em `metricasDia`, comparando com a última foto de antes de hoje. */
export async function tirarFoto(db, dc, bd, hoje) {
  if (!dc.ok) return { ok: false, erro: dc.erro };
  const col = db.collection('metricasDia');
  const ids = dc.membros.filter((m) => !m.bot).map((m) => m.id);
  const antes = await col.find({ dia: { $lt: hoje } }).sort({ dia: -1 }).limit(1).next().catch(() => null);
  let entradas = null, saidas = null, novosIds = [];
  if (antes?.ids) {
    const a = new Set(antes.ids), b = new Set(ids);
    novosIds = ids.filter((id) => !a.has(id));
    entradas = novosIds.length;
    saidas = antes.ids.filter((id) => !b.has(id)).length;
  } else {
    // primeira foto: conta como chegada quem entrou de ontem para hoje, pela data do Discord
    novosIds = dc.membros.filter((m) => !m.bot && diaBR(Date.parse(m.entrou)) >= menosDias(hoje, 1)).map((m) => m.id);
  }
  const c = calcular(dc, bd, hoje, []);
  const foto = { dia: hoje, membros: dc.total, humanos: ids.length, online: dc.online, ativos7: c.ativos.semana, ativosHoje: c.ativos.hoje, aprovados: bd.aprovados.size, entradas, saidas, novosIds, ids, em: new Date() };
  await col.updateOne({ dia: hoje }, { $set: foto }, { upsert: true });
  await col.createIndex({ dia: 1 }, { unique: true }).catch(() => null);
  return { ok: true, dia: hoje, entradas, saidas };
}

/** Fotos dos últimos `n` dias, sem a lista de ids (só os novos, para a retenção). */
export async function historico(db, hoje, n = 120) {
  return db.collection('metricasDia').find({ dia: { $gte: menosDias(hoje, n) } }, { projection: { _id: 0, ids: 0 } }).sort({ dia: 1 }).toArray().catch(() => []);
}
