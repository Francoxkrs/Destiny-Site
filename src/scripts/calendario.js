// Aba Calendário de /eventos/: lê /api/calendario por mês e desenha a grade. Abas Mural | Calendário (#calendario abre direto).
const raiz = document.querySelector('[data-eventos]');
if (raiz) iniciar();

function iniciar() {
  const $ = (s) => raiz.querySelector(s);
  const cal = $('[data-cal]');
  const mural = $('[data-mural]');
  const abas = [...raiz.querySelectorAll('[data-aba]')];
  const TIPOS = JSON.parse(document.getElementById('cal-tipos').textContent);
  const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const SEM = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const hoje = new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10); // Brasília
  let mes = hoje.slice(0, 7);
  let itens = [];
  let escolhido = hoje;
  const cache = new Map();

  const el = (tag, attrs = {}, ...filhos) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) { if (v == null || v === false) continue; if (k === 'class') n.className = v; else if (k === 'style') n.style.cssText = v; else if (k.startsWith('data-') || k.startsWith('aria-') || k === 'role') n.setAttribute(k, v); else n[k] = v; }
    for (const f of filhos.flat()) if (f != null) n.append(f instanceof Node ? f : String(f));
    return n;
  };

  /* ---------- abas */
  let carregado = false;
  function abrir(qual, foco = false) {
    const c = qual === 'calendario';
    cal.hidden = !c; mural.hidden = c;
    abas.forEach((a) => a.setAttribute('aria-selected', String(a.dataset.aba === qual)));
    if (c && !carregado) { carregado = true; carregar(); }
    if (c && !matchMedia('(prefers-reduced-motion: reduce)').matches) cal.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 650, easing: 'cubic-bezier(.76,0,.24,1)' });
    if (foco) abas.find((a) => a.dataset.aba === qual)?.focus();
  }
  abas.forEach((a) => a.addEventListener('click', () => {
    abrir(a.dataset.aba);
    try { history.replaceState(null, '', a.dataset.aba === 'calendario' ? '#calendario' : location.pathname); } catch { /* sem histórico */ }
  }));
  abas.forEach((a, i) => a.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const o = abas[(i + (e.key === 'ArrowRight' ? 1 : abas.length - 1)) % abas.length];
    abrir(o.dataset.aba, true);
  }));

  /* ---------- dados */
  async function carregar() {
    $('[data-cal-titulo]').textContent = titulo(mes);
    if (!cache.has(mes)) {
      try {
        const r = await fetch(`/api/calendario?mes=${mes}`, { headers: { accept: 'application/json' } });
        const j = r.ok && (r.headers.get('content-type') || '').includes('json') ? await r.json() : { itens: [], ligado: false };
        cache.set(mes, j);
      } catch { cache.set(mes, { itens: [], ligado: false }); }
    }
    const j = cache.get(mes);
    itens = j.itens ?? [];
    $('[data-cal-nota]').textContent = j.ligado === false ? 'O calendário ainda não está ligado neste endereço do site.' : 'Horários de Brasília. A Staff atualiza o calendário a cada evento marcado.';
    desenhar();
  }
  const titulo = (m) => `${MESES[+m.slice(5) - 1]} ${m.slice(0, 4)}`;
  const doDia = (d) => itens.filter((x) => x.data <= d && (x.fim ?? x.data) >= d).sort((a, b) => (a.hora ?? '99').localeCompare(b.hora ?? '99'));

  /* ---------- grade */
  function desenhar() {
    const [a, m] = mes.split('-').map(Number);
    const ult = new Date(Date.UTC(a, m, 0)).getUTCDate();
    const pula = (new Date(Date.UTC(a, m - 1, 1)).getUTCDay() + 6) % 7; // segunda primeiro
    const grade = $('[data-cal-grade]');
    const cel = [...SEM.map((s) => el('div', { class: 'cal-sem', role: 'columnheader' }, s))];
    for (let i = 0; i < pula; i++) cel.push(el('div', { class: 'cal-c is-vazio', 'aria-hidden': 'true' }));
    for (let d = 1; d <= ult; d++) {
      const dia = `${mes}-${String(d).padStart(2, '0')}`;
      const l = doDia(dia);
      const b = el('button', {
        type: 'button', class: ['cal-c', dia === hoje && 'is-hoje', dia === escolhido && 'is-sel', dia < hoje && 'is-passou', l.length && 'tem'].filter(Boolean).join(' '),
        'data-dia': dia, role: 'gridcell', 'aria-label': `${d} de ${MESES[m - 1]}${l.length ? `, ${l.length} ${l.length > 1 ? 'eventos' : 'evento'}` : ''}`, 'aria-selected': String(dia === escolhido),
      },
      el('span', { class: 'cal-c__n' }, d),
      el('span', { class: 'cal-c__l' }, l.slice(0, 3).map((x) => el('i', { style: `--c:${TIPOS[x.tipo]?.cor ?? '#fff'}`, class: [x.fim && x.data !== dia && 'cont', x.fim && (x.fim !== dia) && 'segue'].filter(Boolean).join(' ') }, el('span', { 'aria-hidden': 'true' }, TIPOS[x.tipo]?.kanji ?? '・'), el('b', {}, x.titulo)))),
      l.length > 3 ? el('small', { class: 'cal-c__mais' }, `+${l.length - 3}`) : null);
      cel.push(b);
    }
    while ((cel.length - 7) % 7) cel.push(el('div', { class: 'cal-c is-vazio', 'aria-hidden': 'true' }));
    grade.replaceChildren(...cel);
    agenda();
  }

  function agenda() {
    const lista = $('[data-cal-agenda]');
    const t = $('[data-cal-dia-t]');
    if (escolhido.slice(0, 7) !== mes) {
      // fora do mês: mostra os próximos do mês
      const prox = itens.filter((x) => (x.fim ?? x.data) >= (mes === hoje.slice(0, 7) ? hoje : `${mes}-01`)).slice(0, 8);
      t.textContent = prox.length ? 'No mês' : 'Nada marcado neste mês';
      lista.replaceChildren(...prox.map(cartao));
      return;
    }
    const l = doDia(escolhido);
    const [, mm, dd] = escolhido.split('-');
    t.textContent = `${+dd} de ${MESES[+mm - 1]}${escolhido === hoje ? ' · hoje' : ''}`;
    lista.replaceChildren(...(l.length ? l.map(cartao) : [el('li', { class: 'cal-agenda__vazio' }, 'Nada marcado neste dia.')]));
  }

  const dataCurta = (d) => `${+d.slice(8)}/${d.slice(5, 7)}`;
  function cartao(x) {
    const t = TIPOS[x.tipo] ?? { nome: x.tipo, kanji: '・', cor: '#fff' };
    const quando = [x.fim ? `${dataCurta(x.data)} a ${dataCurta(x.fim)}` : dataCurta(x.data), x.hora ? `às ${x.hora}` : null].filter(Boolean).join(' ');
    return el('li', { class: 'cal-ev', style: `--c:${t.cor}` },
      el('span', { class: 'cal-ev__k', 'aria-hidden': 'true' }, t.kanji),
      el('div', {},
        el('p', { class: 'cal-ev__t' }, `${t.nome} · ${quando}`),
        el('h3', {}, x.titulo),
        x.texto ? el('p', { class: 'cal-ev__p' }, x.texto) : null,
        x.link ? el('a', { class: 'cal-ev__a', href: x.link, ...(x.link.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {}) }, x.link.startsWith('http') ? 'Abrir no Discord ↗' : 'Ver mais →') : null));
  }

  /* ---------- eventos da grade */
  cal.addEventListener('click', (e) => {
    const d = e.target.closest('[data-dia]');
    if (d) { escolhido = d.dataset.dia; desenhar(); return; }
    const s = e.target.closest('[data-cal-mes]');
    if (s) {
      const [a, m] = mes.split('-').map(Number);
      const n = new Date(Date.UTC(a, m - 1 + Number(s.dataset.calMes), 1));
      mes = n.toISOString().slice(0, 7);
      carregar();
      return;
    }
    if (e.target.closest('[data-cal-hoje]')) { mes = hoje.slice(0, 7); escolhido = hoje; carregar(); }
  });

  if (location.hash === '#calendario') abrir('calendario');
}
