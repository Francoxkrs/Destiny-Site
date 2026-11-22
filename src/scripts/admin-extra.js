// Sala de Testes: Métricas (gráficos em SVG) e editor do Calendário. Tudo conferido de novo no servidor.
const raiz = document.querySelector('[data-adm]');

const fmt = new Intl.NumberFormat('pt-BR');
const $ = (s, el = raiz) => el.querySelector(s);
const SVG = 'http://www.w3.org/2000/svg';
function el(tag, attrs = {}, ...filhos) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (v == null || v === false) continue; if (k === 'class') n.className = v; else if (k === 'style') n.style.cssText = v; else if (k.startsWith('data-') || k.startsWith('aria-') || k === 'role') n.setAttribute(k, v); else n[k] = v; }
  for (const f of filhos.flat()) if (f != null) n.append(f instanceof Node ? f : String(f));
  return n;
}
function sv(tag, attrs = {}, ...filhos) {
  const n = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) n.setAttribute(k, v);
  for (const f of filhos.flat()) if (f != null) n.append(f instanceof Node ? f : document.createTextNode(String(f)));
  return n;
}
async function api(caminho, corpo) {
  const r = await fetch(`/api/admin${caminho}`, corpo ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(corpo), credentials: 'same-origin' } : { credentials: 'same-origin' });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.erro || `Erro ${r.status}`);
  return j;
}
const dm = (d) => `${+d.slice(8)}/${d.slice(5, 7)}`;
const sinal = (n) => (n == null ? '' : n > 0 ? `+${fmt.format(n)}` : n < 0 ? `−${fmt.format(-n)}` : '±0');

/* ------------------------------------------------------------------ dica (tooltip) única */
const dica = el('div', { class: 'adm-dica', role: 'tooltip', hidden: true });
document.body.append(dica);
function ligaDica(alvo, texto) {
  const mostra = (e) => { dica.textContent = texto; dica.hidden = false; const x = e.clientX ?? alvo.getBoundingClientRect().left, y = e.clientY ?? alvo.getBoundingClientRect().top; dica.style.left = `${Math.min(innerWidth - dica.offsetWidth - 8, x + 12)}px`; dica.style.top = `${y - dica.offsetHeight - 10}px`; };
  alvo.addEventListener('pointermove', mostra);
  alvo.addEventListener('pointerleave', () => (dica.hidden = true));
  alvo.addEventListener('focus', (e) => { const r = alvo.getBoundingClientRect(); mostra({ clientX: r.left + r.width / 2, clientY: r.top }); });
  alvo.addEventListener('blur', () => (dica.hidden = true));
  alvo.setAttribute('tabindex', '0');
  alvo.setAttribute('aria-label', texto);
}

/* ------------------------------------------------------------------ MÉTRICAS */
function metricas() {
  const kpis = $('[data-met-kpis]');
  const graf = $('[data-met-graf]');
  const aviso = $('[data-met-aviso]');

  async function carregar() {
    try { desenhar(await api('/metricas')); } catch (e) { kpis.replaceChildren(el('p', { class: 'adm-vazio' }, e.message)); }
  }
  $('[data-met-foto]').addEventListener('click', async (ev) => {
    const b = ev.currentTarget; b.disabled = true;
    try { const r = await api('/metricas', {}); b.textContent = `Foto de ${dm(r.dia)} tirada`; await carregar(); } catch (e) { aviso.hidden = false; aviso.textContent = e.message; }
    b.disabled = false;
  });

  function desenhar(m) {
    aviso.hidden = m.discord.ok;
    if (!m.discord.ok) aviso.textContent = `Sem o Discord: ${m.discord.erro} Os números do bot aparecem mesmo assim.`;
    const a = m.ativos;
    const pctMeta = Math.min(100, Math.round((a.semana / a.meta.ativos) * 100));
    const tiles = [
      m.membros && tile('Membros', fmt.format(m.membros.humanos), m.membros.delta7 != null ? `${sinal(m.membros.delta7)} em 7 dias` : 'pessoas, sem bots'),
      m.membros && tile('Online agora', m.membros.online != null ? fmt.format(m.membros.online) : '—', 'pelo Discord'),
      el('div', { class: 'adm-kpi adm-kpi--meta' },
        el('p', { class: 'adm-kpi__l' }, 'Jogaram nesta semana'),
        el('b', { class: 'adm-kpi__v' }, fmt.format(a.semana), el('small', {}, ` / ${a.meta.ativos}`)),
        el('span', { class: 'adm-meta', role: 'img', 'aria-label': `${pctMeta}% da meta de ${a.meta.ativos}` }, el('i', { style: `width:${pctMeta}%` })),
        el('small', { class: 'adm-kpi__s' }, `Meta até ${dm(a.meta.ate)}/${a.meta.ate.slice(2, 4)}${a.delta7 != null ? ` · ${sinal(a.delta7)} em 7 dias` : ''}`)),
      tile('Jogaram hoje', fmt.format(a.hoje), 'ganharam XP do Passe hoje'),
      m.novatos && tile('Novatos', fmt.format(m.novatos.semana), `nesta semana · ${fmt.format(m.novatos.mes)} em 30 dias`),
      m.novatos && tile('Novatos que ficam', m.novatos.retencao ? `${m.novatos.retencao.pct}%` : '—', m.novatos.retencao ? `${m.novatos.retencao.ficaram} de ${m.novatos.retencao.chegaram} que chegaram há 1 a 5 semanas` : 'aparece depois de 8 dias de fotos diárias'),
      tile('Personagens', fmt.format(m.jogadores.aprovados), `aprovados · ${fmt.format(m.jogadores.criaram)} criados`),
    ].filter(Boolean);
    kpis.replaceChildren(...tiles);

    graf.replaceChildren(
      caixa('Jogaram nesta semana, dia a dia', 'Contagem de cada foto diária, com a meta', linha(m.historico.map((h) => ({ x: h.dia, y: h.ativos7 })), { meta: a.meta.ativos, vazio: 'A linha aparece a partir da 2ª foto diária.' })),
      caixa('Entradas por semana', 'Quem entrou e continua, e quem saiu (das fotos)', barrasSemana(m.entradas)),
      m.novatos ? caixa('Caminho do novato', 'Quem entrou nos últimos 30 dias', barrasH(m.novatos.funil, { pct: true })) : null,
      caixa('Última vez que jogou', 'Todos que já ganharam XP do Passe', barrasH(m.ultimaVez)),
      caixa('Membros, dia a dia', 'Pessoas no servidor em cada foto diária', linha(m.historico.map((h) => ({ x: h.dia, y: h.membros })), { vazio: 'A linha aparece a partir da 2ª foto diária.', zero: false })),
    );
  }
  const tile = (l, v, s) => el('div', { class: 'adm-kpi' }, el('p', { class: 'adm-kpi__l' }, l), el('b', { class: 'adm-kpi__v' }, v), el('small', { class: 'adm-kpi__s' }, s));
  const caixa = (t, s, corpo) => el('figure', { class: 'adm-gc' }, el('figcaption', {}, el('b', {}, t), el('small', {}, s)), corpo);

  // barras horizontais, uma série
  function barrasH(lista, { pct = false } = {}) {
    const max = Math.max(1, ...lista.map((x) => x.n));
    const base = lista[0]?.n || 0;
    const ul = el('ul', { class: 'adm-hb' });
    for (const x of lista) {
      const li = el('li', {}, el('span', { class: 'adm-hb__n' }, x.nome), el('span', { class: 'adm-hb__t' }, el('i', { style: `width:${(x.n / max) * 100}%` })), el('b', {}, fmt.format(x.n), pct && base && x !== lista[0] ? el('small', {}, ` ${Math.round((x.n / base) * 100)}%`) : null));
      ligaDica(li, `${x.nome}: ${fmt.format(x.n)}${pct && base ? ` (${Math.round((x.n / base) * 100)}% de quem entrou)` : ''}`);
      ul.append(li);
    }
    return ul;
  }

  // linha com eixo y a partir de 0, meta tracejada e dica por ponto
  function linha(pts, { meta = null, vazio, zero = true }) {
    if (pts.length < 2) return el('p', { class: 'adm-vazio' }, vazio);
    const W = 560, H = 200, E = 34, B = 24, T = 12;
    const maxY = Math.max(1, meta ?? 0, ...pts.map((p) => p.y));
    const minY = zero ? 0 : Math.max(0, Math.floor(Math.min(...pts.map((p) => p.y)) * 0.97));
    const topo = zero ? Math.ceil(maxY * 1.1) : Math.ceil(maxY * 1.01 + 1);
    const x = (i) => E + (i / (pts.length - 1)) * (W - E - 8);
    const y = (v) => T + (1 - (v - minY) / (topo - minY)) * (H - T - B);
    const s = sv('svg', { viewBox: `0 0 ${W} ${H}`, class: 'adm-lin', role: 'img', 'aria-label': `${pts.length} dias, de ${dm(pts[0].x)} a ${dm(pts.at(-1).x)}` });
    for (const v of [minY, Math.round((minY + topo) / 2), topo]) s.append(sv('line', { x1: E, x2: W - 8, y1: y(v), y2: y(v), class: 'adm-lin__g' }), sv('text', { x: E - 6, y: y(v) + 4, class: 'adm-lin__e', 'text-anchor': 'end' }, fmt.format(v)));
    if (meta != null) s.append(sv('line', { x1: E, x2: W - 8, y1: y(meta), y2: y(meta), class: 'adm-lin__meta' }), sv('text', { x: W - 10, y: y(meta) - 5, class: 'adm-lin__e adm-lin__e--meta', 'text-anchor': 'end' }, `meta ${meta}`));
    s.append(sv('path', { d: pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.y).toFixed(1)}`).join(''), class: 'adm-lin__l' }));
    [0, pts.length - 1].forEach((i) => s.append(sv('text', { x: x(i), y: H - 6, class: 'adm-lin__e', 'text-anchor': i ? 'end' : 'start' }, dm(pts[i].x))));
    pts.forEach((p, i) => {
      const g = sv('g', { class: 'adm-lin__p' }, sv('rect', { x: x(i) - 10, y: T, width: 20, height: H - T - B, fill: 'transparent' }), sv('circle', { cx: x(i), cy: y(p.y), r: 4 }));
      ligaDica(g, `${dm(p.x)}: ${fmt.format(p.y)}`);
      s.append(g);
    });
    // último valor rotulado direto
    s.append(sv('text', { x: x(pts.length - 1) - 6, y: y(pts.at(-1).y) - 9, class: 'adm-lin__v', 'text-anchor': 'end' }, fmt.format(pts.at(-1).y)));
    return s;
  }

  // entradas (para cima) e saídas (para baixo) por semana
  function barrasSemana(l) {
    const W = 560, H = 210, E = 30, B = 22, T = 10;
    const temSaida = l.some((x) => x.saidas != null);
    const maxC = Math.max(1, ...l.map((x) => x.ficaram));
    const maxB = temSaida ? Math.max(1, ...l.map((x) => x.saidas ?? 0)) : 0;
    const zero = T + (maxC / (maxC + maxB)) * (H - T - B);
    const k = (H - T - B) / (maxC + maxB);
    const bw = (W - E - 8) / l.length;
    const s = sv('svg', { viewBox: `0 0 ${W} ${H}`, class: 'adm-bar2', role: 'img', 'aria-label': 'Entradas por semana nas últimas 12 semanas' });
    s.append(sv('line', { x1: E, x2: W - 8, y1: zero, y2: zero, class: 'adm-lin__g adm-lin__g--zero' }));
    s.append(sv('text', { x: E - 6, y: T + 8, class: 'adm-lin__e', 'text-anchor': 'end' }, fmt.format(maxC)));
    l.forEach((x, i) => {
      const cx = E + i * bw + 2, w = Math.max(4, bw - 4);
      const g = sv('g', { class: 'adm-bar2__g' });
      g.append(sv('rect', { x: cx - 2, y: T, width: bw, height: H - T - B, fill: 'transparent' }));
      if (x.ficaram) g.append(sv('path', { d: barraCima(cx, zero - x.ficaram * k, w, x.ficaram * k), class: 'adm-bar2__c' }));
      if (x.saidas) g.append(sv('path', { d: barraBaixo(cx, zero, w, x.saidas * k), class: 'adm-bar2__s' }));
      ligaDica(g, `Semana de ${dm(x.semana)}: ${fmt.format(x.ficaram)} entraram e continuam${x.saidas != null ? ` · ${fmt.format(x.saidas)} saíram` : ''} · ${fmt.format(x.fichas)} fichas criadas`);
      s.append(g);
      if (i % 3 === 0 || i === l.length - 1) s.append(sv('text', { x: cx + w / 2, y: H - 6, class: 'adm-lin__e', 'text-anchor': 'middle' }, dm(x.semana)));
    });
    const leg = el('p', { class: 'adm-leg' }, el('span', { class: 'is-c' }, 'Entraram e continuam'), temSaida ? el('span', { class: 'is-s' }, 'Saíram') : el('small', {}, 'Saídas aparecem com as fotos diárias'));
    return el('div', {}, leg, s);
  }
  const barraCima = (x, y, w, h) => { const r = Math.min(4, h, w / 2); return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`; };
  const barraBaixo = (x, y, w, h) => { const r = Math.min(4, h, w / 2); return `M${x},${y}V${y + h - r}Q${x},${y + h} ${x + r},${y + h}H${x + w - r}Q${x + w},${y + h} ${x + w},${y + h - r}V${y}Z`; };

  carregar();
}

/* ------------------------------------------------------------------ CALENDÁRIO */
function calendario() {
  const D = JSON.parse(document.getElementById('adm-dados').textContent);
  const form = $('[data-cal-form]');
  const lista = $('[data-cal-lista]');
  const novo = $('[data-cal-novo]');
  const salvarB = $('[data-cal-salvar]');
  const status = $('[data-adm-status]');
  const avisa = (t, tipo = 'ok') => { status.textContent = t; status.dataset.tipo = tipo; };
  let itens = [];
  let hoje = '';

  async function carregar() {
    try { const r = await api('/calendario'); itens = r.itens; hoje = r.hoje; desenhar(); } catch (e) { lista.replaceChildren(el('li', { class: 'adm-vazio' }, e.message)); }
  }
  function desenhar() {
    if (!itens.length) { lista.replaceChildren(el('li', { class: 'adm-vazio' }, 'Nada marcado ainda. O primeiro evento que você marcar aparece em Eventos → Calendário.')); return; }
    lista.replaceChildren(...itens.map((x) => {
      const t = D.tipos[x.tipo] ?? { kanji: '・', nome: x.tipo, cor: '#fff' };
      const passou = (x.fim ?? x.data) < hoje;
      return el('li', { class: ['adm-cali', passou && 'is-passou', !x.publico && 'is-rascunho'].filter(Boolean).join(' '), style: `--c:${t.cor}` },
        el('span', { class: 'adm-cali__k', 'aria-hidden': 'true' }, t.kanji),
        el('div', {},
          el('small', {}, `${dm(x.data)}${x.fim ? ` a ${dm(x.fim)}` : ''}${x.hora ? ` · ${x.hora}` : ''} · ${t.nome}${x.publico ? '' : ' · rascunho'}${passou ? ' · passou' : ''}`),
          el('b', {}, x.titulo)),
        el('span', { class: 'adm-cali__b' },
          el('button', { type: 'button', class: 'adm-chip', 'data-cal-editar': x.id }, 'Editar'),
          el('button', { type: 'button', class: 'adm-chip adm-chip--menos', 'data-cal-apagar': x.id }, 'Apagar')));
    }));
  }
  const campo = (k) => form.elements.namedItem(k);
  function limpar() { form.reset(); campo('ref').value = ''; novo.hidden = true; salvarB.textContent = 'Marcar no calendário'; }
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const f = new FormData(form);
    const item = { titulo: f.get('titulo'), tipo: f.get('tipo'), data: f.get('data'), fim: f.get('fim') || '', hora: f.get('hora') || '', texto: f.get('texto') || '', link: f.get('link') || '', publico: f.get('publico') === 'on' };
    if (campo('ref').value) item.id = campo('ref').value;
    salvarB.disabled = true;
    try { await api('/calendario', { op: 'salvar', item }); avisa(`Calendário: “${item.titulo}” ${item.id ? 'atualizado' : 'marcado'}.`); limpar(); await carregar(); } catch (e) { avisa(e.message, 'erro'); }
    salvarB.disabled = false;
  });
  novo.addEventListener('click', limpar);
  lista.addEventListener('click', async (ev) => {
    const ed = ev.target.closest('[data-cal-editar]');
    const ap = ev.target.closest('[data-cal-apagar]');
    if (ed) {
      const x = itens.find((i) => i.id === ed.dataset.calEditar);
      if (!x) return;
      campo('ref').value = x.id;
      for (const k of ['titulo', 'tipo', 'data', 'fim', 'hora', 'texto', 'link']) campo(k).value = x[k] ?? '';
      campo('publico').checked = x.publico;
      novo.hidden = false; salvarB.textContent = 'Salvar a mudança';
      campo('titulo').focus();
    } else if (ap) {
      const x = itens.find((i) => i.id === ap.dataset.calApagar);
      if (!x) return;
      if (ap.dataset.certeza !== '1') { ap.dataset.certeza = '1'; ap.textContent = 'Clique de novo'; setTimeout(() => { ap.dataset.certeza = ''; ap.textContent = 'Apagar'; }, 3000); return; }
      try { await api('/calendario', { op: 'apagar', id: x.id }); avisa(`Calendário: “${x.titulo}” apagado.`); await carregar(); } catch (e) { avisa(e.message, 'erro'); }
    }
  });
  carregar();
}

if (raiz) { metricas(); calendario(); }
