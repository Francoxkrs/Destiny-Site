// Altar dos Vestígios: troca de banner, garantia e a invocação de tela cheia.
// PRÉVIA: o sorteio roda no navegador, não gasta nem entrega nada. Quando o Altar abrir no bot,
// o sorteio passa para o servidor (/api/altar) e esta tela só toca a animação do resultado.
import gsap from 'gsap';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const D = JSON.parse($('#al-dados').textContent);
const G = D.garantia;
const R = D.raridades;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ORDEM = { raro: 0, epico: 1, lendario: 2 };
const CHAVE = 'bd-altar-previa';

/* ---------------------------------------------------------------- estado da prévia */
const ler = () => { try { return JSON.parse(localStorage.getItem(CHAVE)) || null; } catch { return null; } };
const st = Object.assign({ pity: 0, pityE: 0, hist: [] }, ler());
const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify({ ...st, hist: st.hist.slice(0, 90) })); } catch { /* sem storage */ } };

function chanceLendario(n) {
  if (n >= G.lendario) return 100;
  if (n >= G.sobeDe) return R.lendario.chance + G.passo * (n - G.sobeDe + 1);
  return R.lendario.chance;
}

function sortear() {
  st.pity += 1; st.pityE += 1;
  const r = Math.random() * 100;
  const cl = chanceLendario(st.pity);
  let rar = 'raro';
  if (r < cl) rar = 'lendario';
  else if (r < cl + R.epico.chance || st.pityE >= G.epico) rar = 'epico';
  if (rar === 'lendario') { st.pity = 0; st.pityE = 0; }
  if (rar === 'epico') st.pityE = 0;
  const pool = D.altar.premios[rar];
  const p = pool[Math.floor(Math.random() * pool.length)];
  return { ...p, rar, n: st.hist.length + 1 };
}

function pintaGarantia() {
  const faltam = G.lendario - st.pity;
  const f = $('[data-faltam]'); if (f) f.textContent = String(faltam);
  const fe = $('[data-faltam-epico]'); if (fe) fe.textContent = String(G.epico - st.pityE);
  $$('.al-gar__bar i').forEach((i, k) => i.classList.toggle('is-on', k < st.pity));
}
pintaGarantia();

/* ---------------------------------------------------------------- troca de banner */
$$('[data-troca]').forEach((b) => b.addEventListener('click', () => {
  const id = b.dataset.troca;
  $$('[data-troca]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
  $$('[data-banner]').forEach((x) => {
    const on = x.dataset.banner === id;
    x.hidden = !on;
    if (on && !reduce) gsap.fromTo(x, { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.9, ease: 'expo.inOut', clearProps: 'clipPath' });
  });
  $$('[data-btns]').forEach((x) => (x.hidden = x.dataset.btns !== id));
}));

/* ---------------------------------------------------------------- saldo */
const fmt = new Intl.NumberFormat('pt-BR');
document.addEventListener('bd:sessao', (e) => {
  const s = e.detail;
  if (s && typeof s.cp === 'number') $('[data-cp]').textContent = fmt.format(s.cp);
  if (s && typeof s.inscricoes === 'number') $('[data-insc]').textContent = fmt.format(s.inscricoes);
});
if (window.__bdSessao) document.dispatchEvent(new CustomEvent('bd:sessao', { detail: window.__bdSessao }));

/* ---------------------------------------------------------------- céu de nanquim (canvas) */
const inv = $('[data-inv]');
// fora do <main>: assim a tela cheia fica por cima do cabeçalho e não herda transformações da página
document.body.append(inv, $('[data-hist]'));
const ceu = $('[data-ceu]');
const ctx = ceu.getContext('2d');
let pontos = [];
let rodando = false;
function ceuInicia() {
  const dpr = Math.min(2, devicePixelRatio || 1);
  ceu.width = innerWidth * dpr; ceu.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  pontos = Array.from({ length: Math.round(innerWidth / 9) }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, v: 0.2 + Math.random() * 0.9, r: Math.random() * 1.6 + 0.3, a: Math.random() * 0.6 + 0.15 }));
  if (!rodando) { rodando = true; requestAnimationFrame(ceuQuadro); }
}
function ceuQuadro() {
  if (!rodando) return;
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const p of pontos) {
    p.y -= p.v; p.x += Math.sin((p.y + p.r * 50) / 60) * 0.25;
    if (p.y < -4) { p.y = innerHeight + 4; p.x = Math.random() * innerWidth; }
    ctx.globalAlpha = p.a; ctx.fillStyle = '#f1ebdf';
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
  }
  requestAnimationFrame(ceuQuadro);
}

/* ---------------------------------------------------------------- linhas de velocidade */
const linhas = $('[data-inv-linhas]');
function rajada(cor) {
  let d = '';
  for (let i = 0; i < 90; i++) {
    const a = (i / 90) * Math.PI * 2 + Math.random() * 0.05;
    const r0 = 14 + Math.random() * 16; const r1 = 90;
    const w = 0.15 + Math.random() * 0.9;
    const x0 = Math.cos(a) * r0, y0 = Math.sin(a) * r0;
    const x1 = Math.cos(a - w * 0.01) * r1, y1 = Math.sin(a - w * 0.01) * r1;
    const x2 = Math.cos(a + w * 0.01) * r1, y2 = Math.sin(a + w * 0.01) * r1;
    d += `M${x0.toFixed(2)} ${y0.toFixed(2)}L${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}Z`;
  }
  linhas.innerHTML = `<path d="${d}" fill="${cor}"/>`;
}

/* ---------------------------------------------------------------- cartas */
const nomeR = { lendario: 'Lendário', epico: 'Épico', raro: 'Raro' };
function carta(p, grande = false) {
  const el = document.createElement('div');
  el.className = `inv-card${grande ? ' inv-card--g' : ''}`;
  el.dataset.r = p.rar;
  const arte = p.img ? `<img alt="" src="${p.img}">` : `<span class="inv-card__glifo" aria-hidden="true">${p.k ?? '◆'}</span>`;
  el.innerHTML = `<div class="inv-card__img${p.img ? '' : ' inv-card__img--k'}">${arte}</div><div class="inv-card__txt"><p class="inv-card__d" aria-label="${nomeR[p.rar]}">${'◆'.repeat(R[p.rar].estrelas)}</p><p class="inv-card__n"></p><p class="inv-card__t"></p></div>${p.rar === 'lendario' ? '<span class="inv-card__k" aria-hidden="true">運</span>' : ''}`;
  el.querySelector('.inv-card__n').textContent = p.nome;
  el.querySelector('.inv-card__t').textContent = `${nomeR[p.rar]} · ${p.tipo}`;
  return el;
}

/* ---------------------------------------------------------------- a invocação */
let tl = null;
let ultima = 1;
const palco = $('[data-inv-palco]');
const fim = $('[data-inv-fim]');

function abrir() {
  inv.hidden = false;
  document.documentElement.classList.add('inv-aberto');
  window.__lenis?.stop();
  ceuInicia();
}
function fechar() {
  tl?.kill();
  rodando = false;
  gsap.to(inv, { opacity: 0, duration: reduce ? 0 : 0.35, onComplete: () => { inv.hidden = true; gsap.set(inv, { opacity: 1 }); palco.innerHTML = ''; fim.hidden = true; } });
  document.documentElement.classList.remove('inv-aberto');
  window.__lenis?.start();
  pintaGarantia();
}

function invocar(qtd) {
  ultima = qtd;
  const res = Array.from({ length: qtd }, sortear);
  st.hist.unshift(...res.slice().reverse().map((p) => ({ nome: p.nome, rar: p.rar, em: Date.now() })));
  salvar();
  const melhor = res.reduce((m, p) => (ORDEM[p.rar] > ORDEM[m] ? p.rar : m), 'raro');
  const cor = R[melhor].cor;

  palco.innerHTML = '';
  fim.hidden = true;
  palco.className = `inv__palco${qtd === 1 ? ' is-um' : ''}`;
  const cartas = res.map((p) => carta(p, qtd === 1));
  cartas.forEach((c) => palco.append(c));
  $('[data-inv-resumo]').textContent = resumo(res);

  abrir();
  inv.style.setProperty('--rc', cor);
  rajada(cor);
  const met = $('[data-meteoro]');
  const k = $('[data-inv-k]');
  const flash = $('[data-flash]');
  gsap.set([linhas, k, flash], { opacity: 0 });
  gsap.set(cartas, { opacity: 0 });
  gsap.set(met, { opacity: 0 });

  if (reduce) { gsap.set(cartas, { opacity: 1 }); fim.hidden = false; return; }

  // Lendário: o rastro nasce violeta e vira vermelho no meio do caminho (o "susto" dos gachas).
  const corIni = melhor === 'lendario' ? R.epico.cor : cor;
  tl = gsap.timeline({ onComplete: () => { fim.hidden = false; gsap.from(fim, { opacity: 0, y: 16, duration: 0.5 }); } });
  tl.set(met, { '--mc': corIni, opacity: 1, x: innerWidth * 0.42, y: -innerHeight * 0.55, rotate: 0, scale: 0.6 })
    .to(met, { x: 0, y: 0, scale: 1, duration: 1.5, ease: 'power2.in' }, 0.25);
  if (melhor === 'lendario') tl.to(met, { '--mc': cor, duration: 0.25 }, 1.05);
  tl.to(flash, { opacity: 1, duration: 0.08 }, 1.72)
    .set(met, { opacity: 0 }, 1.8)
    .to(flash, { opacity: 0, duration: 0.7, ease: 'power2.out' }, 1.82)
    .fromTo(linhas, { opacity: 0, scale: 1.4 }, { opacity: melhor === 'raro' ? 0.35 : 0.9, scale: 1, duration: 0.5, ease: 'expo.out' }, 1.75);
  if (melhor !== 'raro') tl.fromTo(k, { opacity: 0, scale: 2.6 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, 1.8).to(k, { opacity: 0, duration: 0.5 }, 2.6);
  tl.to(linhas, { opacity: 0.12, duration: 0.8 }, 2.4);

  // cartas: entram como quadros de mangá, uma a uma
  const base = melhor === 'raro' ? 2.1 : 2.8;
  cartas.forEach((c, i) => {
    const t = base + i * (qtd === 1 ? 0 : 0.16);
    tl.fromTo(c, { opacity: 1, clipPath: 'inset(0 0 100% 0)', y: 30 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 0.6, ease: 'expo.out' }, t);
    if (c.dataset.r === 'lendario') tl.fromTo(c, { '--glow': 0 }, { '--glow': 1, duration: 0.6, yoyo: true, repeat: 1 }, t + 0.3);
  });
}

function resumo(res) {
  const c = { lendario: 0, epico: 0, raro: 0 };
  res.forEach((p) => (c[p.rar] += 1));
  const partes = [c.lendario && `${c.lendario} Lendário`, c.epico && `${c.epico} ${c.epico === 1 ? 'Épico' : 'Épicos'}`, c.raro && `${c.raro} ${c.raro === 1 ? 'Raro' : 'Raros'}`].filter(Boolean);
  return `${partes.join(' · ')} · faltam ${G.lendario - st.pity} para a garantia`;
}

$$('[data-girar]').forEach((b) => b.addEventListener('click', () => invocar(Number(b.dataset.girar))));
$('[data-inv-pular]').addEventListener('click', () => { if (tl && tl.progress() < 1) tl.progress(1); else fechar(); });
$('[data-inv-fechar]').addEventListener('click', fechar);
$('[data-inv-denovo]').addEventListener('click', () => { tl?.kill(); invocar(ultima); });
addEventListener('keydown', (e) => { if (!inv.hidden && e.key === 'Escape') fechar(); });
addEventListener('resize', () => { if (!inv.hidden) ceuInicia(); });

/* ---------------------------------------------------------------- histórico */
const hist = $('[data-hist]');
$('[data-historico]').addEventListener('click', () => {
  const ol = $('[data-hist-lista]');
  ol.innerHTML = '';
  if (!st.hist.length) { const li = document.createElement('li'); li.textContent = 'Nenhum giro ainda.'; ol.append(li); }
  st.hist.slice(0, 60).forEach((h) => { const li = document.createElement('li'); li.dataset.r = h.rar; li.textContent = `${nomeR[h.rar]} · ${h.nome}`; ol.append(li); });
  hist.showModal();
});
