// Sala de Testes (/admin): lê /api/admin, mostra os números e manda os ajustes. Tudo é conferido de novo no servidor.
const raiz = document.querySelector('[data-adm]');
if (raiz) iniciar();

function iniciar() {
  const $ = (s, el = raiz) => el.querySelector(s);
  const $$ = (s, el = raiz) => [...el.querySelectorAll(s)];
  const D = JSON.parse(document.getElementById('adm-dados').textContent);
  const fmt = new Intl.NumberFormat('pt-BR');
  const quando = (iso) => (iso ? new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }) : '—');
  const ha = (iso) => {
    if (!iso) return 'nunca';
    const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return `há ${s} s`;
    if (s < 3600) return `há ${Math.round(s / 60)} min`;
    if (s < 86400) return `há ${Math.round(s / 3600)} h`;
    return `há ${Math.round(s / 86400)} dias`;
  };
  // monta nós sem innerHTML com dados do banco
  const el = (tag, attrs = {}, ...filhos) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) { if (v == null || v === false) continue; if (k === 'class') n.className = v; else if (k.startsWith('data-')) n.setAttribute(k, v); else n[k] = v; }
    for (const f of filhos.flat()) if (f != null) n.append(f instanceof Node ? f : String(f));
    return n;
  };
  const status = $('[data-adm-status]');
  const aviso = (txt, tipo = 'ok') => { status.textContent = txt; status.dataset.tipo = tipo; status.classList.remove('is-pisca'); void status.offsetWidth; status.classList.add('is-pisca'); };

  let estado = null;
  let aba = 'admin';

  async function api(caminho, corpo) {
    const r = await fetch(`/api/admin${caminho}`, corpo ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(corpo), credentials: 'same-origin' } : { credentials: 'same-origin' });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.erro || `Erro ${r.status}`);
    return j;
  }

  async function carregar(msg) {
    try {
      estado = await api('');
      desenhar();
      if (msg) aviso(msg); else aviso(`Conta lida ${quando(new Date().toISOString())}.`);
    } catch (e) { aviso(e.message, 'erro'); }
  }

  /* ---------------- números */
  function desenhar() {
    const v = estado.valores;
    for (const n of $$('[data-campo]')) {
      const k = n.dataset.campo;
      const x = v[k];
      const out = $('[data-v]', n);
      const antes = out.textContent;
      out.textContent = x == null ? '—' : k === 'estagio' ? `${x}º` : fmt.format(x);
      if (antes !== '—' && antes !== out.textContent) { out.classList.remove('is-muda'); void out.offsetWidth; out.classList.add('is-muda'); }
      n.classList.toggle('is-off', x == null);
      for (const b of $$('button, input', n)) b.disabled = x == null;
    }
    $('[data-adm-sem-pers]').hidden = Boolean(estado.personagem);
    for (const b of $$('[data-acao="encher-mana"]')) b.disabled = !estado.personagem;
    desenharBot();
    desenharHist();
    $('[data-cru]').textContent = JSON.stringify({ conta: estado.conta, ficha: estado.ficha }, null, 2);
  }

  async function ajustar(campo, modo, valor, motivo) {
    try {
      const r = await api('/ajustar', { campo, modo, valor, motivo });
      await carregar(`${D.campos[campo].nome}: ${fmt.format(r.antes)} → ${fmt.format(r.depois)}.`);
      return r;
    } catch (e) { aviso(e.message, 'erro'); return null; }
  }

  raiz.addEventListener('click', async (ev) => {
    const b = ev.target.closest('button');
    if (!b || b.disabled) return;
    const n = b.closest('[data-campo]');
    if (b.dataset.somar && n) { b.disabled = true; await ajustar(n.dataset.campo, 'somar', Number(b.dataset.somar)); b.disabled = false; }
    else if (b.dataset.acao) {
      b.disabled = true;
      try { await api('/ajustar', { acao: b.dataset.acao }); await carregar(`${D.acoes[b.dataset.acao]}: feito.`); } catch (e) { aviso(e.message, 'erro'); }
      b.disabled = false;
    } else if (b.hasAttribute('data-quase')) {
      b.disabled = true;
      await ajustar('altarPity', 'definir', D.garantia.lendario - 1, 'teste da garantia');
      b.disabled = false;
    } else if (b.dataset.desfazer) {
      const l = estado.historico.admin.find((x) => x.id === b.dataset.desfazer);
      if (l?.campo) { b.disabled = true; await ajustar(l.campo, 'definir', l.antes, 'desfazer'); }
    } else if (b.dataset.tab) {
      aba = b.dataset.tab;
      for (const t of $$('[data-tab]')) t.setAttribute('aria-selected', String(t === b));
      desenharHist();
    }
  });

  for (const f of $$('[data-form]')) {
    f.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const modo = ev.submitter?.value === 'definir' ? 'definir' : 'somar';
      const inp = $('input', f);
      const valor = Number(inp.value);
      if (!Number.isInteger(valor)) { aviso('Use um número inteiro.', 'erro'); return; }
      const r = await ajustar(f.closest('[data-campo]').dataset.campo, modo, valor);
      if (r) inp.value = '';
    });
  }

  /* ---------------- bot e site */
  function desenharBot() {
    const s = estado.saude;
    const envs = $('[data-envs]');
    envs.replaceChildren(...s.envs.partes.map((p) => el('li', { class: p.ok ? 'is-ok' : 'is-off' }, el('b', {}, p.nome), el('small', {}, p.ok ? 'Ligado' : `Falta: ${p.precisa}`))));
    const c = s.contagens;
    const linhas = [
      ['Banco', s.banco.ok ? `${s.banco.nome} · ${s.banco.ping} ms` : `Fora: ${s.banco.erro ?? 'sem resposta'}`],
      ['Sua ficha no site', estado.ficha ? `atualizada ${ha(estado.ficha.atualizadoEm)}` : 'ainda não chegou'],
      ['Última ficha que o bot mandou', s.ultimaFoto ? ha(s.ultimaFoto) : 'nenhuma'],
      ['Personagens aprovados', c.aprovados ?? '—'],
      ['Fichas no site', c.fichas ?? '—'],
      ['Contas com Cristais', c.contas ?? '—'],
      ['Pix esperando pagamento', c.pendentes ?? '—'],
      ['Invocações nas últimas 24 h', c.girosDia ?? '—'],
      ['Admins', s.envs.admins],
      ['Versão do site', [s.envs.vercel.ambiente, s.envs.vercel.commit, s.envs.vercel.regiao].filter(Boolean).join(' · ')],
    ];
    $('[data-bot-dl]').replaceChildren(...linhas.flatMap(([a, b]) => [el('dt', {}, a), el('dd', {}, String(b))]));
    $('[data-ping]').disabled = !estado.personagem;
  }

  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  async function esperarFoto(yuls, ate) {
    const t0 = Date.now();
    while (Date.now() - t0 < ate) {
      await espera(1000);
      const { foto } = await api('?so=foto').catch(() => ({ foto: null }));
      if (foto?.yuls === yuls) return Date.now() - t0;
      pingRes.textContent = `Esperando o bot… ${Math.round((Date.now() - t0) / 1000)} s${Date.now() - t0 > 10000 ? ' (sem a escuta, a varredura do bot passa a cada 2 min)' : ''}`;
    }
    return null;
  }
  const pingRes = $('[data-ping-res]');
  $('[data-ping]').addEventListener('click', async (ev) => {
    const b = ev.currentTarget;
    b.disabled = true; pingRes.dataset.tipo = '';
    pingRes.textContent = 'Somando 1 Yul…';
    try {
      const r = await api('/ajustar', { campo: 'yuls', modo: 'somar', valor: 1, motivo: 'teste do bot' });
      const t = await esperarFoto(r.depois, 150000);
      await api('/ajustar', { campo: 'yuls', modo: 'somar', valor: -1, motivo: 'teste do bot (volta)' }).catch(() => null);
      if (t == null) { pingRes.textContent = 'O bot não mandou a ficha em 2 min e meio: está desligado ou sem acesso ao banco. O Yul já foi tirado.'; pingRes.dataset.tipo = 'erro'; }
      else { pingRes.textContent = `O bot respondeu em ${(t / 1000).toFixed(1).replace('.', ',')} s${t > 10000 ? ' (pela varredura: a escuta do banco está desligada)' : ' (pela escuta do banco)'}. O Yul já foi tirado.`; pingRes.dataset.tipo = 'ok'; }
      await carregar();
    } catch (e) { pingRes.textContent = e.message; pingRes.dataset.tipo = 'erro'; }
    b.disabled = false;
  });

  /* ---------------- histórico */
  const rarNome = (r) => D.raridades[r]?.nome ?? r;
  function desenharHist() {
    const h = estado.historico;
    const lista = $('[data-hist]');
    const vazio = (t) => [el('li', { class: 'adm-hist__vazio' }, t)];
    let itens = [];
    if (aba === 'admin') {
      itens = h.admin.length ? h.admin.map((x) => el('li', {},
        el('time', {}, quando(x.em)),
        el('span', {}, x.campo ? `${D.campos[x.campo]?.nome ?? x.campo}: ${fmt.format(x.antes)} → ${fmt.format(x.depois)}` : D.acoes[x.acao] ?? x.acao, x.motivo ? el('small', {}, ` · ${x.motivo}`) : null),
        x.campo ? el('button', { type: 'button', class: 'adm-chip', 'data-desfazer': x.id }, 'Desfazer') : null,
      )) : vazio('Nenhum ajuste ainda.');
    } else if (aba === 'altar') {
      itens = h.altar.length ? h.altar.map((g) => el('li', {},
        el('time', {}, quando(g.em)),
        el('span', {}, `×${g.qtd} · ${g.insc ? `${g.insc} Inscrições` : ''}${g.insc && g.cp ? ' + ' : ''}${g.cp ? `${fmt.format(g.cp)} CP` : ''}`,
          el('span', { class: 'adm-res' }, g.res.map((r) => el('i', { class: `is-${r.rar}`, title: `${r.nome} · ${rarNome(r.rar)}` }, r.rar === 'raro' ? '' : r.nome)))),
      )) : vazio('Nenhuma invocação ainda.');
    } else if (aba === 'loja') {
      itens = h.loja.length ? h.loja.map((r) => el('li', {}, el('time', {}, quando(r.em)), el('span', {}, `${r.tipo === 'pedra' ? 'Pedra' : 'Loja'}: ${r.nome}${r.qtd > 1 ? ` ×${r.qtd}` : ''} · ${[r.insc ? `${r.insc} Inscrições` : '', r.cp ? `${fmt.format(r.cp)} CP` : ''].filter(Boolean).join(' + ') || 'grátis'}`))) : vazio('Nada comprado na Pedra ou na Loja.');
    } else if (aba === 'compras') {
      itens = h.compras.length ? h.compras.map((r) => el('li', {}, el('time', {}, quando(r.em)), el('span', {}, `${r.nome} · ${fmt.format(r.cp)} CP · R$ ${Number(r.valor).toFixed(2).replace('.', ',')} · ${r.metodo}`), el('b', { class: `adm-st is-${r.status}` }, r.status))) : vazio('Nenhuma compra de Cristais.');
    } else {
      const g = estado.conta?.gastos ?? [];
      itens = g.length ? g.map((x) => el('li', {}, el('time', {}, quando(x.em)), el('span', {}, `${x.motivo ?? x.ref}${x.cp ? ` · ${fmt.format(x.cp)} CP` : ''}`))) : vazio('Nenhum gasto na conta.');
    }
    lista.replaceChildren(...itens);
  }

  /* ---------------- simulação do Altar */
  const sim = $('[data-sim]');
  sim.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const fd = new FormData(sim);
    const btn = $('button[type=submit]', sim);
    btn.disabled = true;
    try {
      const r = await api('/simular', { giros: Number(fd.get('giros')), partida: fd.get('partida') });
      mostrarSim(r);
      aviso(`Simulação de ${fmt.format(r.giros)} giros pronta. Nada foi gravado.`);
    } catch (e) { aviso(e.message, 'erro'); }
    btn.disabled = false;
  });

  function mostrarSim(r) {
    const box = $('[data-sim-res]');
    box.hidden = false;
    const teoria = { lendario: r.teoria.lendario, epico: r.teoria.epico, raro: 100 - r.teoria.lendario - r.teoria.epico };
    const max = Math.max(...Object.values(r.pct), 1);
    $('[data-sim-bars]').replaceChildren(...['lendario', 'epico', 'raro'].map((k) => el('div', { class: `adm-bar is-${k}` },
      el('span', { class: 'adm-bar__n' }, rarNome(k)),
      el('span', { class: 'adm-bar__t' }, el('i', { style: '' })),
      el('b', {}, `${fmt.format(r.porRar[k])} · ${String(r.pct[k]).replace('.', ',')}%`),
      el('small', {}, `base ${String(teoria[k].toFixed(1)).replace('.', ',')}%`),
    )));
    // largura animada pela CSS
    $$('.adm-bar', box).forEach((b, i) => { const k = ['lendario', 'epico', 'raro'][i]; requestAnimationFrame(() => { $('i', b).style.width = `${(r.pct[k] / max) * 100}%`; }); });
    const L = r.lendario;
    const linhas = [
      ['Primeiro Lendário', L.primeiro ? `no ${L.primeiro}º giro` : 'não saiu'],
      ['Giros por Lendário', L.media ? `média ${String(L.media).replace('.', ',')} · menor ${L.menor} · maior ${L.maior}` : '—'],
      ['Maior seca sem Épico', `${r.maiorSecaEpico} giros (garantia: ${D.garantia.epico})`],
      ['Fragmentos ganhos', fmt.format(r.fragmentosGanhos)],
      ['Materiais', Object.entries(r.materiais).map(([k, n]) => `${fmt.format(n)} × ${k}`).join(', ') || '—'],
      ['Custaria em Cristais', `${fmt.format(r.custoCp)} CP`],
      ['Garantia no fim', `${r.fim.pity} de ${D.garantia.lendario}`],
    ];
    $('[data-sim-dl]').replaceChildren(...linhas.flatMap(([a, b]) => [el('dt', {}, a), el('dd', {}, b)]));
    $('[data-sim-itens] tbody').replaceChildren(...r.itens.map((x) => el('tr', { class: `is-${x.rar}` }, el('td', {}, x.nome), el('td', {}, rarNome(x.rar)), el('td', {}, fmt.format(x.n)))));
  }

  carregar();
}
