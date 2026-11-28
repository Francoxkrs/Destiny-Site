// Sala de Testes · Outras contas: procura um jogador, muda os Cristais Prismáticos dele com confirmação e mostra o
// registro com Desfazer. O servidor confere tudo de novo (só CP, só grava se o saldo ainda for o confirmado).
const caixa = document.querySelector('[data-out]');
if (caixa) iniciar();

function iniciar() {
  const $ = (s) => caixa.querySelector(s);
  const D = JSON.parse(document.getElementById('adm-dados').textContent);
  const MAX = D.campos.cp.max;
  const fmt = new Intl.NumberFormat('pt-BR');
  const sinal = (n) => (n > 0 ? `+${fmt.format(n)}` : `−${fmt.format(-n)}`);
  const quando = (iso) => (iso ? new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—');
  const el = (tag, attrs = {}, ...filhos) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) { if (v == null || v === false) continue; if (k === 'class') n.className = v; else if (k === 'style') n.style.cssText = v; else if (k.startsWith('data-') || k.startsWith('aria-')) n.setAttribute(k, v); else n[k] = v; }
    for (const f of filhos.flat()) if (f != null) n.append(f instanceof Node ? f : String(f));
    return n;
  };
  async function api(caminho, corpo) {
    const r = await fetch(`/api/admin/outras${caminho}`, corpo ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(corpo), credentials: 'same-origin' } : { credentials: 'same-origin' });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { const e = new Error(j.erro || `Erro ${r.status}`); e.dados = j; throw e; }
    return j;
  }

  const msg = $('[data-out-msg]');
  const diz = (t, tipo = 'ok') => { msg.textContent = t; msg.dataset.tipo = tipo; };
  const nomeDe = (c) => c.nome || 'Sem personagem no site';

  let alvo = null;      // { userId, nome, imagem, cp, temConta }
  let pendente = null;  // o que espera o "Confirmar"
  let resultados = [];
  let historico = [];

  /* ---------------- busca */
  const res = $('[data-out-res]');
  function avatar(c, alvoEl) {
    alvoEl.textContent = '';
    alvoEl.style.backgroundImage = '';
    if (c.imagem && /^https:\/\//.test(c.imagem)) alvoEl.style.backgroundImage = `url("${c.imagem.replace(/["\\]/g, '')}")`;
    else alvoEl.textContent = '魂';
  }
  function desenharRes() {
    res.replaceChildren(...resultados.map((c) => {
      const av = el('span', { class: 'adm-out__av', 'aria-hidden': 'true' });
      avatar(c, av);
      return el('li', {}, el('button', { type: 'button', class: 'adm-out__r', 'data-out-escolher': c.userId, 'aria-pressed': String(alvo?.userId === c.userId) },
        av,
        el('span', {}, el('b', {}, nomeDe(c)), el('small', {}, `ID ${c.userId}${c.temConta ? '' : ' · ainda sem conta de Cristais'}`)),
        el('span', {}, `${fmt.format(c.cp)} CP`),
      ));
    }));
  }
  $('[data-out-busca]').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const q = new FormData(ev.currentTarget).get('q').trim();
    const b = ev.currentTarget.querySelector('button');
    b.disabled = true;
    try {
      const r = await api(`?q=${encodeURIComponent(q)}`);
      resultados = r.contas;
      desenharRes();
      if (!resultados.length) diz(`Nenhum personagem com "${q}" no nome. Tente o ID do Discord.`, 'erro');
      else if (resultados.length === 1) escolher(resultados[0]);
      else diz(`${resultados.length} contas encontradas. Escolha uma.`);
    } catch (e) { diz(e.message, 'erro'); }
    b.disabled = false;
  });

  /* ---------------- conta escolhida */
  const sel = $('[data-out-sel]');
  const valor = $('[data-out-v]');
  function escolher(c) {
    alvo = { ...c };
    fecharConf();
    sel.hidden = false;
    avatar(alvo, $('[data-out-av]'));
    $('[data-out-nome]').textContent = nomeDe(alvo);
    $('[data-out-id]').textContent = `ID ${alvo.userId}`;
    mostrarSaldo();
    desenharRes();
    diz(`Mexendo na conta de ${nomeDe(alvo)}.`);
  }
  function mostrarSaldo() {
    const antes = valor.textContent;
    valor.textContent = fmt.format(alvo.cp);
    if (antes !== '—' && antes !== valor.textContent) { valor.classList.remove('is-muda'); void valor.offsetWidth; valor.classList.add('is-muda'); }
    const r = resultados.find((x) => x.userId === alvo.userId);
    if (r && r.cp !== alvo.cp) { r.cp = alvo.cp; r.temConta = true; desenharRes(); }
  }
  async function reler() {
    if (!alvo) return;
    try {
      const r = await api(`?q=${encodeURIComponent(alvo.userId)}`);
      Object.assign(alvo, { cp: r.contas[0].cp, temConta: r.contas[0].temConta });
      mostrarSaldo();
    } catch (e) { diz(e.message, 'erro'); }
  }

  /* ---------------- confirmação (um quadro só, para ajuste e para Desfazer) */
  const conf = $('[data-out-conf]');
  function abrirConf(p, titulo, sub) {
    pendente = p;
    $('[data-out-conf-t]').textContent = titulo;
    $('[data-out-conf-s]').textContent = sub;
    conf.hidden = false;
    conf.style.animation = 'none'; void conf.offsetWidth; conf.style.animation = '';
    $('[data-out-sim]').disabled = false;
    $('[data-out-sim]').focus();
    conf.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  function fecharConf() { pendente = null; conf.hidden = true; }

  function pedirAjuste(modo, n) {
    if (!alvo) return;
    if (!Number.isSafeInteger(n)) { diz('Use um número inteiro.', 'erro'); return; }
    const depois = modo === 'somar' ? alvo.cp + n : n;
    if (modo === 'somar' && n === 0) { diz('Somar zero não muda nada.', 'erro'); return; }
    if (depois < 0 || depois > MAX) { diz(`Cristais Prismáticos ficam entre 0 e ${fmt.format(MAX)}. Ficaria ${fmt.format(depois)}.`, 'erro'); return; }
    if (depois === alvo.cp) { diz(`A conta já tem ${fmt.format(alvo.cp)} CP.`, 'erro'); return; }
    const motivo = $('[data-out-motivo]').value.trim();
    abrirConf(
      { tipo: 'ajuste', userId: alvo.userId, modo, valor: n, esperado: alvo.cp, motivo },
      `${nomeDe(alvo)}: ${fmt.format(alvo.cp)} → ${fmt.format(depois)} CP (${sinal(depois - alvo.cp)})`,
      `${modo === 'somar' ? `Somar ${sinal(n)}` : `Definir em ${fmt.format(n)}`}${motivo ? ` · Motivo: ${motivo}` : ' · Sem motivo'}. Só grava se o saldo ainda for ${fmt.format(alvo.cp)} na hora de salvar.`,
    );
  }

  caixa.addEventListener('click', async (ev) => {
    const b = ev.target.closest('button');
    if (!b || b.disabled) return;
    if (b.dataset.outEscolher) { const c = resultados.find((x) => x.userId === b.dataset.outEscolher); if (c) escolher(c); }
    else if (b.dataset.outSomar) pedirAjuste('somar', Number(b.dataset.outSomar));
    else if (b.hasAttribute('data-out-ler')) { b.disabled = true; await reler(); b.disabled = false; diz('Saldo lido de novo.'); }
    else if (b.hasAttribute('data-out-nao')) { fecharConf(); diz('Cancelado. Nada mudou.'); }
    else if (b.hasAttribute('data-out-sim')) confirmar(b);
    else if (b.dataset.outDesfazer) pedirDesfazer(b.dataset.outDesfazer);
  });
  conf.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { fecharConf(); diz('Cancelado. Nada mudou.'); } });

  $('[data-out-form]').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const modo = ev.submitter?.value === 'definir' ? 'definir' : 'somar';
    const inp = ev.currentTarget.querySelector('input');
    pedirAjuste(modo, Number(inp.value));
  });

  async function confirmar(b) {
    const p = pendente;
    if (!p) return;
    b.disabled = true;
    try {
      if (p.tipo === 'ajuste') {
        const r = await api('', { userId: p.userId, campo: 'cp', modo: p.modo, valor: p.valor, esperado: p.esperado, motivo: p.motivo });
        if (alvo?.userId === r.userId) { alvo.cp = r.depois; alvo.temConta = true; mostrarSaldo(); }
        $('[data-out-form] input').value = '';
        $('[data-out-motivo]').value = '';
        diz(`Salvo. ${r.nome || r.userId}: ${fmt.format(r.antes)} → ${fmt.format(r.depois)} CP.`);
      } else {
        const r = await api('', { desfazer: p.id });
        if (alvo?.userId === r.userId) { alvo.cp = r.depois; mostrarSaldo(); }
        diz(`Desfeito. ${r.nome || r.userId}: ${fmt.format(r.antes)} → ${fmt.format(r.depois)} CP.`);
      }
      fecharConf();
    } catch (e) {
      fecharConf();
      if (e.dados?.agora != null && alvo) { alvo.cp = e.dados.agora; mostrarSaldo(); }
      diz(e.message, 'erro');
    }
    carregarHist();
  }

  /* ---------------- registro */
  const hist = $('[data-out-hist]');
  function pedirDesfazer(id) {
    const l = historico.find((x) => x.id === id);
    if (!l) return;
    const dif = l.depois - l.antes;
    abrirConf(
      { tipo: 'desfazer', id },
      `Desfazer: ${l.nome || l.userId} ${sinal(-dif)} CP`,
      `Volta a diferença do ajuste de ${quando(l.em)} (${fmt.format(l.antes)} → ${fmt.format(l.depois)}) em cima do saldo de agora, porque o jogador pode ter gastado ou ganhado depois. Se ele já gastou esses Cristais, não deixa.`,
    );
  }
  function desenharHist() {
    if (!historico.length) { hist.replaceChildren(el('li', { class: 'adm-hist__vazio' }, 'Nenhuma mudança em outras contas ainda.')); return; }
    const porId = new Map(historico.map((x) => [x.id, x]));
    hist.replaceChildren(...historico.map((x) => {
      const dif = x.depois - x.antes;
      const desfeito = Boolean(x.desfeitoEm);
      const origem = x.desfaz ? porId.get(x.desfaz) : null;
      return el('li', { class: desfeito ? 'is-desfeito' : '' },
        el('time', {}, quando(x.em)),
        el('span', {},
          el('b', {}, x.nome || x.userId), ' ',
          el('span', { class: `adm-out__d ${dif > 0 ? 'is-mais' : 'is-menos'}` }, `${sinal(dif)} CP`),
          el('small', {}, ` · ${fmt.format(x.antes)} → ${fmt.format(x.depois)}`),
          el('small', { style: 'display:block' }, [
            x.desfaz ? `Desfez o ajuste${origem ? ` de ${quando(origem.em)}` : ''}` : x.motivo ? `Motivo: ${x.motivo}` : 'Sem motivo',
            x.por ? `por ${x.por}` : null,
            desfeito ? `desfeito ${quando(x.desfeitoEm)}` : null,
          ].filter(Boolean).join(' · ')),
        ),
        !x.desfaz && !desfeito ? el('button', { type: 'button', class: 'adm-chip', 'data-out-desfazer': x.id }, 'Desfazer') : null,
      );
    }));
  }
  async function carregarHist() {
    try { historico = (await api('')).historico; desenharHist(); } catch (e) { hist.replaceChildren(el('li', { class: 'adm-hist__vazio' }, e.message)); }
  }

  carregarHist();
}
