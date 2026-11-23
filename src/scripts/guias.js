// Guias: link de cada regra (copiar para o Discord), índice da página em folha lateral, barra de leitura,
// tempo de leitura e o carimbo "Lido" (guardado no navegador, contado no Guia).
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// cabeçalho (72) + abas fixas + folga: a regra não fica escondida atrás deles
const folgaTopo = () => 72 + ($('[data-pagenav]')?.offsetHeight || 0) + 20;
const rolar = (alvo, imediato = false) => (window.__lenis ? window.__lenis.scrollTo(alvo, { offset: -folgaTopo(), immediate: imediato }) : scrollTo({ top: alvo.getBoundingClientRect().top + scrollY - folgaTopo(), behavior: imediato ? 'auto' : 'smooth' }));
const nomeDe = (el) => Array.from(el.childNodes).filter((n) => !(n.nodeType === 1 && (n.matches('b, .elo-h, .term__tip') || n.classList?.contains('elo-h')))).map((n) => n.textContent).join('').replace(/\s+/g, ' ').trim();

/* ------------------------------------------------------------ ids dos subtítulos (o build já põe; isto cobre o astro dev) */
function idsDosSubtitulos(slugify) {
  const usados = new Set($$('[id]').map((e) => e.id));
  const usar = (base, prefixo) => {
    let id = base;
    if (usados.has(id) && prefixo) id = `${prefixo}-${base}`;
    for (let n = 2; usados.has(id); n++) id = `${base}-${n}`;
    usados.add(id);
    return id;
  };
  $$('main section[id]').forEach((sec) => $$('h3:not([id])', sec).forEach((h) => {
    if (h.closest('section') !== sec) return;
    const s = slugify(h.textContent);
    if (s) h.id = usar(s, sec.id);
  }));
}

/* ------------------------------------------------------------ copiar o link */
let avisoEl = null;
let avisoT = 0;
export function aviso(titulo, sub) {
  if (!avisoEl) {
    avisoEl = document.createElement('div');
    avisoEl.className = 'elo-aviso';
    avisoEl.setAttribute('role', 'status');
    avisoEl.setAttribute('aria-live', 'polite');
    document.body.append(avisoEl);
  }
  avisoEl.innerHTML = `<span class="elo-aviso__k" aria-hidden="true">鎖</span><span><b>${esc(titulo)}</b><small>${esc(sub)}</small></span>`;
  avisoEl.classList.remove('is-on');
  void avisoEl.offsetWidth;
  avisoEl.classList.add('is-on');
  clearTimeout(avisoT);
  avisoT = setTimeout(() => avisoEl.classList.remove('is-on'), 2600);
}
export async function copiarTexto(t) {
  try { await navigator.clipboard.writeText(t); return true; } catch { /* sem permissão: tenta o jeito antigo */ }
  const ta = Object.assign(document.createElement('textarea'), { value: t });
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
  document.body.append(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { ok = false; }
  ta.remove();
  return ok;
}
export async function copiarLink(id) {
  const url = `${location.origin}${location.pathname}#${id}`;
  history.replaceState(null, '', `#${id}`);
  const ok = await copiarTexto(url);
  aviso(ok ? 'Link da regra copiado' : 'Copie o endereço da barra', `${location.pathname}#${id}`);
}
const ICONE_ELO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4L12 5.6" /><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2" /></svg>';

function botoesDeLink() {
  // seção: botão "Link" ao lado do rótulo
  $$('main section[id]').forEach((sec) => {
    const eb = $('.eyebrow', sec);
    if (!eb || eb.closest('section') !== sec || eb.nextElementSibling?.classList.contains('elo')) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'elo';
    b.dataset.elo = sec.id;
    b.innerHTML = `${ICONE_ELO}<span>Link</span>`;
    b.setAttribute('aria-label', `Copiar o link da seção ${nomeDe(eb)}`);
    eb.after(b);
  });
  // subtítulo: "#" no fim do h3 (fora de cartões que já são links)
  $$('main section h3[id]').forEach((h) => {
    if (h.closest('a, button, summary, .tabs') || $('.elo-h', h)) return;
    const a = document.createElement('a');
    a.className = 'elo-h';
    a.href = `#${h.id}`;
    a.dataset.elo = h.id;
    a.textContent = '#';
    a.setAttribute('aria-label', `Copiar o link de ${h.textContent.trim()}`);
    h.append(a);
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-elo]');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    copiarLink(b.dataset.elo);
  }, true);
}

/* ------------------------------------------------------------ leva até a regra do link (e acende ela) */
function irParaHash() {
  const vai = (imediato) => {
    const id = decodeURIComponent(location.hash.slice(1));
    const alvo = id && document.getElementById(id);
    if (!alvo) return;
    if (alvo.tagName === 'DETAILS') alvo.open = true;
    rolar(alvo, imediato);
    const marca = alvo.tagName === 'SECTION' ? ($('.sec-head', alvo) || $('.eyebrow', alvo) || alvo) : (alvo.closest('[data-alvo]') || alvo);
    marca.classList.remove('is-alvo');
    void marca.offsetWidth;
    marca.classList.add('is-alvo');
    setTimeout(() => marca.classList.remove('is-alvo'), 2400);
  };
  if (location.hash.length > 1) {
    if (document.readyState === 'complete') setTimeout(() => vai(true), 60);
    else addEventListener('load', () => setTimeout(() => vai(true), 60), { once: true });
  }
  addEventListener('hashchange', () => vai(false));
}

/* ------------------------------------------------------------ índice da página (folha lateral) e barra de leitura */
function folhaDaPagina() {
  const nav = $('[data-pagenav]');
  if (!nav || $('.folha')) return;
  const titulo = ($('.page-hero h1') || $('h1'))?.textContent.trim() || document.title;
  const itens = $$('a[data-tab]', nav).map((a) => {
    const sec = document.getElementById(a.dataset.tab);
    const subs = sec ? $$('h3[id]', sec).filter((h) => h.closest('section') === sec && !h.closest('a, button, summary')) : [];
    return { id: a.dataset.tab, nome: nomeDe(a).replace(/^\d+\s*/, ''), subs: subs.length <= 14 ? subs.map((h) => ({ id: h.id, nome: h.textContent.replace(/#$/, '').trim() })) : [], mais: subs.length > 14 ? subs.length : 0 };
  });
  if (!itens.length) return;

  // barra de leitura no pé das abas
  const prog = document.createElement('span');
  prog.className = 'tabs__prog';
  prog.setAttribute('aria-hidden', 'true');
  nav.append(prog);
  const main = $('main');
  let pend = false;
  const mede = () => {
    pend = false;
    const r = main.getBoundingClientRect();
    const total = r.height - innerHeight;
    prog.style.transform = `scaleX(${total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0})`;
  };
  addEventListener('scroll', () => { if (!pend) { pend = true; requestAnimationFrame(mede); } }, { passive: true });
  mede();

  // botão que abre a folha
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'tabs__folha';
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.innerHTML = '<span class="tabs__folha-k" aria-hidden="true">目</span><span>Índice da página</span>';
  ($('.tabs__in', nav) || nav).append(btn);
  nav.classList.add('tabs--folha');

  const leitura = $('[data-leitura]')?.textContent.trim();
  const folha = document.createElement('div');
  folha.className = 'folha';
  folha.hidden = true;
  folha.setAttribute('data-lenis-prevent', '');
  folha.innerHTML = `
    <div class="folha__veu" data-folha-fecha></div>
    <aside class="folha__papel" role="dialog" aria-modal="true" aria-labelledby="folha-t">
      <header class="folha__h">
        <span class="folha__k" aria-hidden="true">目次</span>
        <div><p class="t-label">Índice da página${leitura ? ` · ${esc(leitura)}` : ''}</p><p class="folha__t" id="folha-t">${esc(titulo)}</p></div>
        <button type="button" class="folha__x" data-folha-fecha aria-label="Fechar">Esc</button>
      </header>
      <p class="folha__dica">Toque no <span class="folha__dica-i" aria-hidden="true">${ICONE_ELO}</span> para copiar o link de uma regra e mandar no Discord.</p>
      <ol class="folha__lista">
        ${itens.map((it, i) => `
          <li>
            <div class="folha__l"><a href="#${esc(it.id)}" data-folha-ir><span class="folha__n">${String(i + 1).padStart(2, '0')}</span>${esc(it.nome)}</a><button type="button" class="folha__elo" data-elo="${esc(it.id)}" aria-label="Copiar o link de ${esc(it.nome)}">${ICONE_ELO}</button></div>
            ${it.subs.length ? `<ul>${it.subs.map((s) => `<li><div class="folha__l folha__l--sub"><a href="#${esc(s.id)}" data-folha-ir>${esc(s.nome)}</a><button type="button" class="folha__elo" data-elo="${esc(s.id)}" aria-label="Copiar o link de ${esc(s.nome)}">${ICONE_ELO}</button></div></li>`).join('')}</ul>` : ''}
            ${it.mais ? `<p class="folha__mais">${it.mais} itens nesta seção</p>` : ''}
          </li>`).join('')}
      </ol>
    </aside>`;
  document.body.append(folha);
  let antes = null;
  const abre = () => {
    antes = document.activeElement;
    folha.hidden = false;
    document.documentElement.classList.add('folha-open');
    window.__lenis?.stop();
    const ativo = $('a[data-tab].is-on', nav)?.dataset.tab;
    $$('[data-folha-ir]', folha).forEach((a) => a.classList.toggle('is-on', a.getAttribute('href') === `#${ativo}`));
    requestAnimationFrame(() => folha.classList.add('is-on'));
    setTimeout(() => $('.folha__x', folha).focus(), 30);
  };
  const fecha = () => {
    folha.classList.remove('is-on');
    document.documentElement.classList.remove('folha-open');
    window.__lenis?.start();
    setTimeout(() => { folha.hidden = true; }, 320);
    antes?.focus?.();
  };
  btn.addEventListener('click', abre);
  $$('[data-folha-fecha]', folha).forEach((b) => b.addEventListener('click', fecha));
  folha.addEventListener('click', (e) => {
    const a = e.target.closest('[data-folha-ir]');
    if (!a) return;
    e.preventDefault();
    const alvo = document.getElementById(a.getAttribute('href').slice(1));
    fecha();
    if (alvo) setTimeout(() => { history.replaceState(null, '', a.getAttribute('href')); rolar(alvo); }, 60);
  });
  addEventListener('keydown', (e) => {
    if (folha.hidden) return;
    if (e.key === 'Escape') fecha();
    if (e.key === 'Tab') {
      const foco = $$('a, button', folha);
      const [p, u] = [foco[0], foco[foco.length - 1]];
      if (e.shiftKey && document.activeElement === p) { e.preventDefault(); u.focus(); }
      else if (!e.shiftKey && document.activeElement === u) { e.preventDefault(); p.focus(); }
    }
  });
}

/* ------------------------------------------------------------ tempo de leitura (quando a página não veio do build) */
function tempoDeLeitura() {
  const el = $('[data-leitura]');
  if (!el || el.textContent.trim()) return;
  const main = $('main').cloneNode(true);
  $$('.next, .fecho, .tabs, dialog, script, style', main).forEach((x) => x.remove());
  const n = main.textContent.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;
  el.textContent = `${Math.max(1, Math.round(n / 200))} min de leitura`;
}

/* ------------------------------------------------------------ "Lido" */
const CHAVE = 'bd-lidas';
const lerLidas = () => { try { const v = JSON.parse(localStorage.getItem(CHAVE) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } };
const gravarLidas = (v) => { try { localStorage.setItem(CHAVE, JSON.stringify(v)); return true; } catch { return false; } };
function lidas() {
  let lista = lerLidas();
  const pinta = () => {
    $$('[data-lidas-n]').forEach((e) => { e.textContent = String(lista.length); });
    $$('[data-lida-de]').forEach((a) => a.classList.toggle('is-lida', lista.includes(a.dataset.lidaDe)));
    $$('[data-cap-lido]').forEach((s) => {
      const ps = $$('[data-lida-de]', s);
      s.classList.toggle('is-lido', ps.length > 0 && ps.every((a) => a.classList.contains('is-lida')));
    });
    const fecho = $('[data-fecho]');
    if (!fecho) return;
    const lida = lista.includes(fecho.dataset.fecho);
    const b = $('[data-lido]', fecho);
    b.setAttribute('aria-pressed', String(lida));
    fecho.classList.toggle('is-lida', lida);
    $('[data-lido-t]', fecho).textContent = lida ? 'Lido' : 'Marcar como lido';
    $('[data-lido-s]', fecho).textContent = lida ? 'Toque de novo para desmarcar' : 'Fica guardado neste navegador';
    $$('[data-lido-tag]').forEach((t) => { t.hidden = !lida; });
  };
  const b = $('[data-lido]');
  b?.addEventListener('click', () => {
    const slug = $('[data-fecho]').dataset.fecho;
    const ja = lista.includes(slug);
    lista = ja ? lista.filter((s) => s !== slug) : [...lista, slug];
    const salvou = gravarLidas(lista);
    pinta();
    if (!ja) {
      b.classList.remove('is-carimbo');
      void b.offsetWidth;
      b.classList.add('is-carimbo');
      if (!salvou) aviso('Carimbado só por agora', 'Este navegador não deixa guardar');
    }
  });
  // outra aba marcou: acompanha
  addEventListener('storage', (e) => { if (e.key === CHAVE) { lista = lerLidas(); pinta(); } });
  pinta();
}

export function initGuias({ slugify }) {
  if ($('.page-hero') || $('[data-guia-consulta]')) {
    idsDosSubtitulos(slugify);
    botoesDeLink();
    tempoDeLeitura();
    folhaDaPagina();
  }
  irParaHash();
  lidas();
}
