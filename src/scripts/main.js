// Black Destiny — movimento e interação.
// Lenis (rolagem suave) + GSAP/ScrollTrigger/SplitText/Flip.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';
import { initSims } from './sims.js';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

const html = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const store = {
  get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* sem storage */ } },
  del(k) { try { sessionStorage.removeItem(k); } catch { /* sem storage */ } },
};

window.__bdReady = true;
if (reduce) html.classList.add('no-anim');

/* ---------------------------------------------------------------- rolagem */
let lenis = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.095, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
window.__lenis = lenis;

/* ---------------------------------------------------------------- navegação: sumário, busca e glossário */
const slugifyTxt = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Sumário: páginas sem abas próprias ganham um, montado das seções que têm rótulo.
function autoToc() {
  if ($('[data-pagenav]') || !$('.page-hero')) return;
  const secs = $$('main > section').filter((s) => $('.eyebrow', s));
  if (secs.length < 2) return;
  const items = secs.map((s, i) => {
    const eb = $('.eyebrow', s);
    const nome = Array.from(eb.childNodes).filter((n) => n.nodeName !== 'B').map((n) => n.textContent).join('').trim();
    if (!s.id) s.id = slugifyTxt(nome) || `secao-${i + 1}`;
    return [s.id, nome];
  });
  const nav = document.createElement('nav');
  nav.className = 'tabs';
  nav.setAttribute('aria-label', 'Nesta página');
  nav.dataset.pagenav = '';
  nav.innerHTML = `<div class="wrap tabs__in"><span class="tabs__h" aria-hidden="true">Nesta página</span>${items.map(([id, n], i) => `<a href="#${id}" data-tab="${id}"><span>${String(i + 1).padStart(2, '0')}</span>${n}</a>`).join('')}</div>`;
  $('.page-hero').after(nav);
  // o id só existe depois do script: leva até a seção pedida no endereço
  const alvo = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (alvo) addEventListener('load', () => setTimeout(() => (window.__lenis ? window.__lenis.scrollTo(alvo, { offset: -80, immediate: true }) : alvo.scrollIntoView()), 50));
}
autoToc();

// Marca a aba da seção visível.
function pageNavSpy() {
  const nav = $('[data-pagenav]');
  if (!nav) return;
  const links = $$('a[data-tab]', nav);
  const secs = links.map((a) => document.getElementById(a.dataset.tab)).filter(Boolean);
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => {
        const on = a.dataset.tab === e.target.id;
        a.classList.toggle('is-on', on);
        if (on) {
          const box = a.parentElement;
          box.scrollTo({ left: a.offsetLeft - box.clientWidth / 3, behavior: 'smooth' });
        }
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach((s) => io.observe(s));
}
pageNavSpy();

const searchData = (() => { try { return JSON.parse($('#bd-search')?.textContent || '{}'); } catch { return {}; } })();
const norm = (t) => (t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Busca: páginas, termos do glossário e seções de cada página (busca.json, gerado no build).
function search() {
  const box = $('[data-search]');
  if (!box) return;
  const input = $('[data-search-input]', box);
  const list = $('[data-search-res]', box);
  let secoes = null;
  let sel = 0;
  let res = [];
  const base = [
    ...(searchData.paginas || []).map((p) => ({ ...p, k: 'Página', w: 3 })),
    ...(searchData.termos || []).map((p) => ({ ...p, k: 'Termo', w: 2 })),
  ];
  const loadSecoes = () => {
    if (secoes) return;
    secoes = [];
    fetch(new URL('/busca.json', location.href)).then((r) => (r.ok ? r.json() : [])).then((j) => { secoes = j.map((s) => ({ ...s, k: 'Seção', w: 1 })); if (!box.hidden) render(); }).catch(() => {});
  };
  const score = (it, q) => {
    const t = norm(it.t);
    const d = norm(`${it.d || ''} ${it.e || ''}`);
    let sc = 0;
    for (const w of q) {
      if (t.startsWith(w)) sc += 6;
      else if (t.includes(w)) sc += 4;
      else if (d.includes(w)) sc += 1;
      else return 0;
    }
    return sc + it.w;
  };
  const render = () => {
    const q = norm(input.value).split(/\s+/).filter(Boolean);
    res = q.length
      ? [...base, ...(secoes || [])].map((it) => [score(it, q), it]).filter(([s]) => s > 0).sort((a, b) => b[0] - a[0]).slice(0, 12).map(([, it]) => it)
      : (searchData.paginas || []).map((p) => ({ ...p, k: 'Página' }));
    sel = 0;
    list.innerHTML = res.length
      ? res.map((r, i) => `<li role="option" aria-selected="${i === sel}"><a href="${esc(r.u)}"><span class="search__k">${r.k}</span><b>${esc(r.t)}</b><span class="search__d">${r.c ? `${esc(r.c)} · ` : ''}${esc(r.d || '')}</span></a></li>`).join('')
      : '<li class="search__none">Nada encontrado. Tente outra palavra ou abra o Índice.</li>';
  };
  const mark = () => $$('li[role="option"]', list).forEach((li, i) => { li.setAttribute('aria-selected', String(i === sel)); if (i === sel) li.scrollIntoView({ block: 'nearest' }); });
  const open = () => {
    box.hidden = false;
    html.classList.add('search-open');
    window.__lenis?.stop();
    loadSecoes();
    render();
    requestAnimationFrame(() => input.focus());
  };
  const close = () => {
    box.hidden = true;
    html.classList.remove('search-open');
    window.__lenis?.start();
  };
  $$('[data-search-open]').forEach((b) => b.addEventListener('click', open));
  $$('[data-search-close]', box).forEach((b) => b.addEventListener('click', close));
  input.addEventListener('input', render);
  addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (box.hidden) open(); else close(); return; }
    if (box.hidden) {
      if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement?.tagName || '')) { e.preventDefault(); open(); }
      return;
    }
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(res.length - 1, sel + 1); mark(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); mark(); }
    else if (e.key === 'Enter' && res[sel] && document.activeElement === input) { e.preventDefault(); close(); location.href = res[sel].u; }
  });
  list.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
}
search();

// Termos com dica: a primeira vez que um termo do glossário aparece no texto, ele mostra a definição.
function glossTips() {
  const termos = (searchData.termos || []).slice().sort((a, b) => b.t.length - a.t.length);
  if (!termos.length || !$('.page-hero')) return;
  const aqui = location.pathname.replace(/index\.html$/, '');
  // Uma dica por termo em cada seção: quem chega numa seção pelo índice também vê a definição.
  const porSecao = new Map();
  const alvos = $$('main p.t-body, main p.t-lead, main p.t-small, main .card__text, main .gifts dd, main .tbl td, main .ticks li, main .kv dd, main .ladder p, main .perk p, main .no p, main .tl-item__gain, main .tl-item__req, main .corr > div > span, main .chap__text, main li');
  const skip = (n) => n.parentElement?.closest('a, button, h1, h2, h3, h4, .term, .tabs, .page-hero, .sim, nav, .hdr, .footer, label, select, [data-split]');
  const regs = termos.map((t) => [t, new RegExp(`(^|[^\\p{L}])(${t.t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?)(?![\\p{L}])`, 'u')]);
  for (const el of alvos) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const sec = el.closest('section') || document.body;
    if (!porSecao.has(sec)) porSecao.set(sec, new Set());
    const usados = porSecao.get(sec);
    for (const node of nodes) {
      if (skip(node)) continue;
      for (const [t, re] of regs) {
        if (usados.has(t.t)) continue;
        const m = node.textContent.match(re);
        if (!m) continue;
        usados.add(t.t);
        const after = node.splitText(m.index + m[1].length);
        after.splitText(m[2].length);
        const mesmo = t.u.split('#')[0] === aqui;
        const tag = document.createElement(mesmo ? 'span' : 'a');
        tag.className = 'term';
        if (mesmo) tag.tabIndex = 0;
        else tag.href = t.u;
        tag.dataset.def = t.d;
        tag.textContent = after.textContent;
        after.replaceWith(tag);
        break;
      }
    }
  }
}
glossTips();

// âncoras internas
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = $(id);
    if (!t) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(t, { offset: -80 }) : t.scrollIntoView();
  });
});

/* ---------------------------------------------------------------- cabeçalho */
const hdr = $('.hdr');
let lastY = 0;
const onScroll = (y) => {
  if (!hdr) return;
  hdr.classList.toggle('is-scrolled', y > 40);
  if (!html.classList.contains('menu-open')) hdr.classList.toggle('is-hidden', y > lastY && y > 320);
  lastY = y;
};
if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
else addEventListener('scroll', () => onScroll(scrollY), { passive: true });

/* ---------------------------------------------------------------- menu */
const menu = $('#menu');
const toggle = $('[data-menu-toggle]');
const label = $('[data-menu-label]');
let menuTl = null;
if (menu && toggle) {
  menuTl = gsap.timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
    .set(menu, { visibility: 'visible' })
    .fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9 })
    .from($$('[data-menu-item]', menu), { y: 60, opacity: 0, duration: 0.8, stagger: 0.035, ease: 'expo.out' }, '-=0.45');
  const open = (v) => {
    html.classList.toggle('menu-open', v);
    toggle.setAttribute('aria-expanded', String(v));
    if (label) label.textContent = v ? 'Fechar' : 'Capítulos';
    hdr?.classList.remove('is-hidden');
    if (v) { lenis?.stop(); menuTl.timeScale(1).play(); }
    else { lenis?.start(); menuTl.timeScale(1.6).reverse(); }
  };
  toggle.addEventListener('click', () => open(!html.classList.contains('menu-open')));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && html.classList.contains('menu-open')) open(false); });
}

/* ---------------------------------------------------------------- cursor */
if (fine && !reduce) {
  html.classList.add('has-cursor');
  const c = $('.cursor');
  const dot = $('.cursor__dot', c);
  const ring = $('.cursor__ring', c);
  const txt = $('.cursor__ring span', c);
  const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
  let shown = false;
  addEventListener('pointermove', (e) => {
    if (!shown) { shown = true; gsap.set([dot, ring], { x: e.clientX, y: e.clientY }); gsap.to(c, { opacity: 1, duration: 0.4 }); }
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
  });
  document.addEventListener('pointerover', (e) => {
    const lab = e.target.closest('[data-cursor]');
    const lnk = e.target.closest('a, button, select, input, label, summary');
    c.classList.toggle('is-label', !!lab);
    c.classList.toggle('is-link', !lab && !!lnk);
    if (lab) txt.textContent = lab.dataset.cursor;
  });
  document.addEventListener('pointerleave', () => gsap.to(c, { opacity: 0, duration: 0.3 }));
  document.addEventListener('pointerenter', () => gsap.to(c, { opacity: 1, duration: 0.3 }));
}

/* ---------------------------------------------------------------- botões magnéticos */
if (fine && !reduce) {
  $$('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.3);
      yTo((e.clientY - r.top - r.height / 2) * 0.3);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

/* ---------------------------------------------------------------- transição de página */
// Duas lâminas fecham na diagonal, um corte vermelho passa e o nome da próxima página aparece.
const tr = $('.transition');
const blades = tr ? $$('.transition__panel', tr) : [];
const slash = tr ? $('.transition__slash line', tr) : null;
const trTitle = tr ? $('[data-transition-title]', tr) : null;
let titles = {};
try { titles = JSON.parse($('#bd-titles')?.textContent || '{}'); } catch { /* sem títulos */ }

function leave(href) {
  const seg = new URL(href, location.href).pathname.split('/').filter(Boolean).pop() || '';
  const slug = seg.replace(/\.html$/, '');
  const name = titles[`/${slug}/`] || 'Black Destiny';
  store.set('bd-nav', name);
  if (reduce || !tr) { location.href = href; return; }
  lenis?.stop();
  if (trTitle) trTitle.textContent = name;
  gsap.timeline({ onComplete: () => { location.href = href; } })
    .set(tr, { visibility: 'visible' })
    .set(trTitle, { opacity: 0, yPercent: -40 })
    .fromTo(blades[0], { xPercent: -104 }, { xPercent: 0, duration: 0.7, ease: 'expo.inOut' }, 0)
    .fromTo(blades[1], { xPercent: 104 }, { xPercent: 0, duration: 0.7, ease: 'expo.inOut' }, 0.04)
    .fromTo(slash, { strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, duration: 0.28, ease: 'power3.in' }, 0.5)
    .to(slash, { opacity: 0, duration: 0.25 }, 0.8)
    .to(trTitle, { opacity: 1, yPercent: -50, duration: 0.45, ease: 'expo.out' }, 0.62);
}

function enter() {
  return new Promise((resolve) => {
    if (!html.classList.contains('is-entering') || !tr) { resolve(); return; }
    store.del('bd-nav');
    gsap.set(tr, { visibility: 'visible' });
    gsap.set(blades, { xPercent: 0, yPercent: 0 });
    gsap.set(trTitle, { opacity: 1, yPercent: -50 });
    gsap.timeline({
      delay: 0.1,
      onComplete: () => { html.classList.remove('is-entering'); gsap.set(tr, { visibility: 'hidden' }); resolve(); },
    })
      .to(trTitle, { opacity: 0, yPercent: -80, duration: 0.4, ease: 'power3.in' })
      .fromTo(slash, { strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, duration: 0.22, ease: 'power3.in' }, 0.2)
      .to(blades[0], { xPercent: -30, yPercent: -110, duration: 0.95, ease: 'expo.inOut' }, 0.38)
      .to(blades[1], { xPercent: 30, yPercent: 110, duration: 0.95, ease: 'expo.inOut' }, 0.38)
      .to(slash, { opacity: 0, duration: 0.3 }, 0.45);
    setTimeout(resolve, 900); // a página começa a animar antes das lâminas saírem
  });
}

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (a.target === '_blank' || a.hasAttribute('download')) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return;
  if (url.pathname === location.pathname && url.hash) return;
  if (a.getAttribute('href') === '#') { e.preventDefault(); return; }
  e.preventDefault();
  if (html.classList.contains('menu-open')) { html.classList.remove('menu-open'); }
  leave(url.href);
});

addEventListener('pageshow', (e) => {
  if (e.persisted && tr) {
    html.classList.remove('is-entering');
    gsap.set(tr, { visibility: 'hidden' });
    lenis?.start();
  }
});

/* ---------------------------------------------------------------- pré-carregamento */
// Primeira visita: o nome surge letra a letra, um corte vermelho atravessa a tela e ela se abre em duas.
function preloader() {
  return new Promise((resolve) => {
    const el = $('.preloader');
    if (!el || html.classList.contains('no-preloader')) { el?.remove(); resolve(); return; }
    store.set('bd-seen', '1');
    lenis?.stop();
    const halves = $$('.preloader__half', el);
    const inner = $('.preloader__in', el);
    const chars = splitChars($('.preloader__title', el));
    const count = $('.preloader__count', el);
    const bar = $('.preloader__bar', el);
    const cut = $('.preloader__slash line', el);
    const n = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => { el.remove(); lenis?.start(); } });
    tl.to(n, { v: 100, duration: 2.1, ease: 'power2.inOut', onUpdate: () => { count.textContent = String(Math.round(n.v)).padStart(3, '0'); } }, 0)
      .to(bar, { scaleX: 1, duration: 2.1, ease: 'power2.inOut' }, 0)
      .from('.preloader__kanji', { opacity: 0, letterSpacing: '1.4em', duration: 1.4, ease: 'expo.out' }, 0.1)
      .from(chars, { yPercent: 110, opacity: 0, rotate: 8, duration: 1, stagger: 0.05, ease: 'expo.out' }, 0.25)
      .from('.preloader__sub', { opacity: 0, y: 10, duration: 0.8 }, 0.9)
      .to([inner, count], { opacity: 0, duration: 0.25, ease: 'power2.in' }, 2.15)
      .fromTo(cut, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.3, ease: 'power4.in' }, 2.2)
      .to(halves[0], { xPercent: -40, yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, 2.5)
      .to(halves[1], { xPercent: 40, yPercent: 100, duration: 1.1, ease: 'expo.inOut' }, 2.5)
      .to([cut, bar], { opacity: 0, duration: 0.3 }, 2.55);
    tl.call(resolve, null, 2.75);
  });
}

/* ---------------------------------------------------------------- entrada do herói */
function splitChars(el) {
  // Divide em letras mantendo as linhas (<br>) e o itálico (<em>).
  const walk = (node) => {
    Array.from(node.childNodes).forEach((ch) => {
      if (ch.nodeType === 3) {
        const frag = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach((word) => {
          if (!word) return;
          if (/^\s+$/.test(word)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span');
          w.style.display = 'inline-block';
          w.style.whiteSpace = 'nowrap';
          [...word].forEach((c) => {
            const s = document.createElement('span');
            s.className = 'ch';
            s.textContent = c;
            w.appendChild(s);
          });
          frag.appendChild(w);
        });
        ch.replaceWith(frag);
      } else if (ch.nodeType === 1 && ch.tagName !== 'BR') walk(ch);
    });
  };
  walk(el);
  return $$('.ch', el);
}

function heroIn() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  // capa da página inicial: os quadros caem como uma página de mangá
  const cover = $('[data-cover]');
  if (cover) {
    const panelsEls = $$('[data-panel]', cover);
    const order = [2, 0, 4, 1, 3];
    order.forEach((idx, k) => {
      const p = panelsEls[idx];
      if (!p) return;
      tl.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'none' }, 0.1 + k * 0.12);
      tl.fromTo($('img', p), { scale: 1.45, filter: 'grayscale(1) contrast(2) brightness(1.6)' }, { scale: 1, filter: 'grayscale(1) contrast(1.35) brightness(0.62)', duration: 1.6 }, 0.1 + k * 0.12);
    });
    tl.from($$('.cover__gutters polyline', cover), { opacity: 0, duration: 0.6, ease: 'none' }, 0.1);
    const chars = splitChars($('[data-cover-title]', cover));
    tl.from(chars, { yPercent: 120, rotate: 14, opacity: 0, duration: 1.2, stagger: 0.045 }, 0.55);
    tl.fromTo($('[data-cover-page]', cover), { x: 0 }, { keyframes: [{ x: -10, y: 6 }, { x: 8, y: -5 }, { x: -5, y: 3 }, { x: 0, y: 0 }], duration: 0.32, ease: 'none' }, 1.05);
    tl.from('.speedlines', { opacity: 0, scale: 1.4, duration: 1.4 }, 0.9);
  }

  const titlesEls = $$('[data-hero-title]');
  titlesEls.forEach((t) => {
    t.__split = new SplitText(t, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
    const chars = splitChars(t);
    gsap.set(chars, { yPercent: 115, rotate: 8 });
    tl.to(chars, { yPercent: 0, rotate: 0, duration: 1.3, stagger: { each: 0.03 } }, 0.05);
  });
  const fades = $$('[data-hero-fade]');
  if (fades.length) tl.from(fades, { opacity: 0, y: 24, duration: 1.2, stagger: 0.07 }, cover ? 1 : 0.35);
  $$('[data-hero-media]').forEach((m) => {
    const slot = $('.slot', m);
    tl.fromTo(slot, { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' }, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.5, ease: 'expo.inOut' }, 0.25);
    const inner = $('.slot__media', slot);
    if (inner) tl.fromTo(inner, { scale: 1.35 }, { scale: 1, duration: 1.9, ease: 'expo.out' }, 0.3);
  });
  return tl;
}

/* ---------------------------------------------------------------- capa: linhas de velocidade e rolagem */
function speedlines() {
  const svg = $('[data-speedlines]');
  if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const sets = [0, 1, 2].map(() => {
    const g = document.createElementNS(NS, 'g');
    let d = '';
    for (let i = 0; i < 70; i++) {
      const a = Math.random() * Math.PI * 2;
      const w = 0.004 + Math.random() * 0.012;
      const r0 = 20 + Math.random() * 16;
      const r1 = 90;
      const p = (r, t) => `${(Math.cos(t) * r).toFixed(2)},${(Math.sin(t) * r).toFixed(2)}`;
      d += `M${p(r0, a)}L${p(r1, a - w)}L${p(r1, a + w)}Z`;
    }
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    g.appendChild(path);
    g.style.opacity = '0';
    svg.appendChild(g);
    return g;
  });
  let k = 0;
  sets[0].style.opacity = '1';
  setInterval(() => { sets[k].style.opacity = '0'; k = (k + 1) % 3; sets[k].style.opacity = '1'; }, 140);
}

function coverScroll() {
  const cover = $('[data-cover]');
  if (!cover) return;
  const ps = $$('[data-panel]', cover);
  const moves = [{ xPercent: -14, yPercent: -12 }, { xPercent: -14, yPercent: 14 }, { scale: 1.18 }, { xPercent: 14, yPercent: -12 }, { xPercent: 14, yPercent: 14 }];
  const tl = gsap.timeline({ scrollTrigger: { trigger: cover, start: 'top top', end: 'bottom top', scrub: 0.6 } });
  ps.forEach((p, i) => tl.to(p, { ...moves[i], ease: 'none' }, 0));
  tl.to('.cover__gutters', { opacity: 0, ease: 'none' }, 0)
    .to('[data-cover-title] .row:first-child', { xPercent: -18, ease: 'none' }, 0)
    .to('[data-cover-title] .row--r', { xPercent: 18, ease: 'none' }, 0)
    .to('.cover__content', { opacity: 0, ease: 'power1.in' }, 0)
    .to('.speedlines', { scale: 1.6, opacity: 0, ease: 'none' }, 0);

  if (fine) {
    const imgs = ps.map((p) => $('img', p));
    const tos = imgs.map((im) => [gsap.quickTo(im, 'x', { duration: 1.2, ease: 'power3' }), gsap.quickTo(im, 'y', { duration: 1.2, ease: 'power3' })]);
    cover.addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      tos.forEach(([x, y], i) => { const f = (i % 2 ? 18 : 30); x(-nx * f); y(-ny * f); });
    });
  }
}

/* ---------------------------------------------------------------- prólogo fixado */
function prologue() {
  const sec = $('[data-prologue]');
  if (!sec) return;
  const bgs = $$('[data-pro-bg]', sec);
  const words = $$('[data-pro-word]', sec);
  const kanji = $$('[data-pro-kanji]', sec);
  const lines = $$('[data-pro-line]', sec);
  const ticks = $$('[data-pro-tick]', sec);
  const end = $('[data-pro-end]', sec);
  const lineChars = lines.map((l) => splitChars(l));
  gsap.set(bgs.slice(1), { clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' });
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: {
      trigger: sec, start: 'top top', end: () => `+=${innerHeight * 3.2}`, pin: $('.prologue__stage', sec), scrub: 0.7, anticipatePin: 1,
      onUpdate: (self) => {
        const step = Math.min(3, Math.floor(self.progress * 4.4));
        ticks.forEach((t, i) => t.classList.toggle('is-on', i <= step));
      },
    },
  });
  lines.forEach((l, i) => {
    const at = i * 1;
    if (i > 0) {
      tl.to(bgs[i], { clipPath: 'polygon(-25% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 0.6, ease: 'power2.inOut' }, at - 0.15);
      tl.to(lines[i - 1], { opacity: 0, yPercent: -30, duration: 0.3, ease: 'power2.in' }, at - 0.2);
      tl.to(words[i - 1], { opacity: 0, xPercent: -10, duration: 0.3 }, at - 0.2);
      tl.to(kanji[i - 1], { opacity: 0, duration: 0.2 }, at - 0.2);
    }
    tl.fromTo($('img', bgs[i]), { scale: 1.25 }, { scale: 1.02, duration: 1.2, ease: 'none' }, Math.max(0, at - 0.15));
    if (i === 0) {
      // o primeiro passo já está na tela quando o prólogo encosta no topo
      gsap.set([l, words[0], kanji[0]], { opacity: 1 });
      gsap.from(lineChars[0], { yPercent: 90, opacity: 0, duration: 0.9, stagger: 0.02, ease: 'expo.out', scrollTrigger: { trigger: sec, start: 'top 60%', once: true } });
      gsap.from(words[0], { xPercent: 12, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: sec, start: 'top 60%', once: true } });
      return;
    }
    tl.set(l, { opacity: 1, yPercent: 0 }, at);
    tl.from(lineChars[i], { yPercent: 90, opacity: 0, duration: 0.4, stagger: 0.012 }, at);
    tl.fromTo(words[i], { opacity: 0, xPercent: 12 }, { opacity: 1, xPercent: 0, duration: 0.6 }, at);
    tl.fromTo(kanji[i], { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, at + 0.05);
  });
  tl.fromTo(end, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, 3.5);
  tl.to({}, { duration: 0.6 });
}

/* ---------------------------------------------------------------- capítulos, impacto, despertar */
function chapters() {
  $$('[data-chap]').forEach((c) => {
    const num = $('[data-chap-num]', c);
    if (num) gsap.fromTo(num, { yPercent: 25, opacity: 0.2 }, { yPercent: -25, opacity: 1, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true } });
    const k = $('.chap__kanji', c);
    if (k) gsap.from(k, { opacity: 0, yPercent: -30, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 75%', once: true } });
  });

  $$('[data-origins]').forEach((row) => {
    const items = $$('[data-origin]', row);
    gsap.fromTo(items, { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' }, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.3, ease: 'expo.inOut', stagger: 0.09,
      scrollTrigger: { trigger: row, start: 'top 85%', once: true },
    });
    items.forEach((it) => gsap.from($('img', it), { scale: 1.4, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 85%', once: true } }));
  });

  $$('[data-impact]').forEach((sec) => {
    const sfx = $('[data-sfx]', sec);
    const img = $('.impact__img', sec);
    gsap.to(img, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 55%', once: true } });
    tl.fromTo(sfx, { scale: 3.2, opacity: 0, rotate: -24 }, { scale: 1, opacity: 1, rotate: -8, duration: 0.55, ease: 'back.out(2.4)' })
      .fromTo(sec, { x: 0 }, { keyframes: [{ x: -14 }, { x: 11 }, { x: -7 }, { x: 4 }, { x: 0 }], duration: 0.35, ease: 'none' }, 0.12);
  });

  $$('[data-awaken]').forEach((sec) => {
    const lids = $$('[data-lid]', sec);
    gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 85%', end: 'top 10%', scrub: 0.6 } })
      .fromTo(lids, { scaleY: 1 }, { scaleY: 0, ease: 'power2.inOut' })
      .fromTo($('[data-awaken-img] img', sec), { scale: 1.25, filter: 'blur(14px) grayscale(1) brightness(0.3)' }, { scale: 1, filter: 'blur(0px) grayscale(0.3) brightness(0.55)', ease: 'none' }, 0);
  });
}

/* ---------------------------------------------------------------- revelações ao rolar */
function reveals() {
  // títulos por linha
  $$('.chap__title[data-split], .awaken__title[data-split]').forEach((el) => {
    el.removeAttribute('data-split');
    SplitText.create(el, {
      type: 'lines,chars', mask: 'lines', linesClass: 'split-line', autoSplit: true,
      onSplit(self) {
        return gsap.from(self.chars, {
          yPercent: 120, rotate: 10, duration: 1.3, ease: 'expo.out', stagger: 0.035,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      },
    });
  });
  $$('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 110, duration: 1.25, ease: 'expo.out', stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });

  // blocos simples, com escalonamento entre irmãos
  const groups = new Map();
  $$('[data-reveal]').forEach((el) => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });
  groups.forEach((els) => {
    ScrollTrigger.batch(els, {
      start: 'top 90%', once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
    });
  });

  // imagens: cortina + paralaxe interna
  $$('[data-slot]').forEach((slot) => {
    if (slot.closest('[data-hero-media]') || slot.closest('.index-preview')) return;
    const inner = $('.slot__media', slot);
    if (slot.closest('.next__bg')) return;
    // retícula: a imagem nasce de pontos que crescem até fechar
    slot.classList.add('is-dotting');
    gsap.fromTo(slot, { '--dot': '0px' }, {
      '--dot': '11px', duration: 1.5, ease: 'power2.inOut',
      scrollTrigger: { trigger: slot, start: 'top 90%', once: true },
      onComplete: () => slot.classList.remove('is-dotting'),
    });
    if (inner) gsap.from(inner, { scale: 1.2, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: slot, start: 'top 90%', once: true } });
    if (inner && slot.hasAttribute('data-parallax-slot')) {
      gsap.fromTo(inner, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: slot, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }
  });
  $$('[data-hero-media] [data-slot]').forEach((slot) => {
    const inner = $('.slot__media', slot);
    if (inner) gsap.to(inner, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: slot, start: 'top top+=200', end: 'bottom top', scrub: true } });
  });

  // linhas horizontais
  $$('.rule').forEach((r) => gsap.from(r, { scaleX: 0, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: r, start: 'top 92%', once: true } }));

  // contadores
  $$('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const pad = el.dataset.pad ? parseInt(el.dataset.pad, 10) : 0;
    const o = { v: 0 };
    el.textContent = String(0).padStart(pad, '0');
    gsap.to(o, {
      v: end, duration: 2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = String(Math.round(o.v)).padStart(pad, '0'); },
    });
  });

  // manifesto: palavras acendem conforme a rolagem
  $$('[data-scrub-words]').forEach((el) => {
    const s = new SplitText(el, { type: 'words', wordsClass: 'w' });
    gsap.to(s.words, {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
    });
  });

  // barras (escala, mana, raridade)
  $$('[data-bars] i').forEach((b) => {
    const vertical = !!b.closest('.bars');
    gsap.from(b, {
      [vertical ? 'scaleY' : 'scaleX']: 0, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: b.closest('[data-bars]'), start: 'top 85%', once: true },
      delay: (Array.from(b.closest('[data-bars]').querySelectorAll('i')).indexOf(b)) * 0.05,
    });
  });

  // linha do tempo dos Estágios
  $$('[data-timeline]').forEach((tl) => {
    const fill = $('.timeline__fill', tl);
    if (fill) gsap.to(fill, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: tl, start: 'top 70%', end: 'bottom 70%', scrub: true } });
  });

  // paralaxe genérica
  $$('[data-speed]').forEach((el) => {
    const s = parseFloat(el.dataset.speed);
    gsap.to(el, { yPercent: s * 100, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // faixa rolante: inverte com a direção da rolagem
  const tracks = $$('.marquee__track');
  if (tracks.length && lenis) {
    lenis.on('scroll', ({ direction }) => {
      tracks.forEach((t) => { const base = t.dataset.dir === '-1' ? -1 : 1; t.style.animationDirection = direction * base < 0 ? 'reverse' : 'normal'; });
    });
  }
}

/* ---------------------------------------------------------------- rolagem horizontal */
function hscroll() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    $$('[data-hscroll]').forEach((sec) => {
      const track = $('.hscroll__track', sec);
      const bar = $('.hscroll__progress i', sec);
      const dist = () => track.scrollWidth - innerWidth;
      const tw = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: sec, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (self) => bar && gsap.set(bar, { scaleX: self.progress }),
        },
      });
      return () => tw.kill();
    });
  });
}

/* ---------------------------------------------------------------- índice com prévia */
function indexPreview() {
  if (!fine) return;
  $$('[data-index-wrap]').forEach((wrap) => {
    const list = $('[data-index]', wrap);
    const prev = $('.index-preview', wrap);
    if (!list || !prev) return;
    const slots = $$('.slot', prev);
    const xTo = gsap.quickTo(prev, 'x', { duration: 0.7, ease: 'power3' });
    const yTo = gsap.quickTo(prev, 'y', { duration: 0.7, ease: 'power3' });
    const rTo = gsap.quickTo(prev, 'rotate', { duration: 0.9, ease: 'power3' });
    let lx = 0;
    wrap.addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); rTo(Math.max(-12, Math.min(12, (e.clientX - lx) * 0.6))); lx = e.clientX; });
    $$('[data-index-item]', list).forEach((item, i) => {
      item.addEventListener('pointerenter', () => {
        slots.forEach((s, j) => s.classList.toggle('is-on', i === j));
        gsap.to(prev, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
      });
    });
    list.addEventListener('pointerleave', () => gsap.to(prev, { opacity: 0, scale: 0.85, duration: 0.4 }));
  });
}

/* ---------------------------------------------------------------- filtro de famílias */
function filters() {
  $$('[data-filter-group]').forEach((group) => {
    const target = $(group.dataset.filterGroup);
    if (!target) return;
    const items = $$('[data-tags]', target);
    const count = $('[data-filter-count]', group);
    const btns = $$('[data-filter]', group);
    btns.forEach((b) => b.addEventListener('click', () => {
      const f = b.dataset.filter;
      btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      // quem ainda não apareceu na rolagem fica visível antes de reorganizar
      gsap.set(items, { opacity: 1, y: 0, clearProps: 'transform' });
      const state = Flip.getState(items);
      let n = 0;
      items.forEach((it) => {
        const show = f === 'todas' || it.dataset.tags.split(' ').includes(f);
        it.hidden = !show;
        if (show) n++;
      });
      if (count) count.textContent = `${n} ${n === 1 ? (count.dataset.um || 'família') : (count.dataset.varios || 'famílias')}`;
      Flip.from(state, {
        duration: reduce ? 0 : 0.7, ease: 'expo.inOut', absolute: true, scale: false,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }),
        onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.3 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    }));
  });
}

/* ---------------------------------------------------------------- inclinação nos cartões */
function tilt() {
  if (!fine || reduce) return;
  $$('[data-tilt]').forEach((el) => {
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 8);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
    });
    el.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

/* ---------------------------------------------------------------- início */
async function boot() {
  try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]); } catch { /* sem API de fontes */ }
  initSims();
  filters();
  indexPreview();
  tilt();

  if (reduce) {
    html.classList.add('reveal-all');
    $('.preloader')?.remove();
    html.classList.remove('is-entering');
    return;
  }

  const pre = preloader();
  const ent = enter();
  await Promise.all([pre, ent]);
  speedlines();
  heroIn();
  reveals();
  coverScroll();
  prologue();
  chapters();
  hscroll();
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  document.dispatchEvent(new CustomEvent('bd:ready'));
  addEventListener('load', () => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 1200);
}

boot();
