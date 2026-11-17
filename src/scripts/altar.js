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
  const est = Array.from({ length: R[p.rar].estrelas }, () => '<i>◆</i>').join('');
  el.innerHTML = `<div class="inv-card__img${p.img ? '' : ' inv-card__img--k'}">${arte}</div><div class="inv-card__txt"><p class="inv-card__d">${est}</p><p class="inv-card__n"></p><p class="inv-card__t"></p></div>${p.rar === 'lendario' ? '<span class="inv-card__k" aria-hidden="true">運</span>' : ''}`;
  el.querySelector('.inv-card__d').setAttribute('aria-label', p.rotulo ?? nomeR[p.rar]);
  el.querySelector('.inv-card__n').textContent = p.nome;
  el.querySelector('.inv-card__t').textContent = `${p.rotulo ?? nomeR[p.rar]} · ${p.tipo}`;
  return el;
}

/* ---------------------------------------------------------------- a invocação */
// Sequência (como nos gachas): o rastro cai e diz a cor do melhor resultado; depois cada carta
// aparece sozinha, grande, e um toque passa para a próxima; no fim, todas juntas.
let tl = null;
let ultima = () => {};
let vez = 0; // cada invocação nova cancela a anterior
let pular = null; // resolve a espera atual
let pulouTudo = false;
const palco = $('[data-inv-palco]');
const um = $('[data-inv-um]');
const fim = $('[data-inv-fim]');
const toque = $('[data-inv-toque]');

function abrir() {
  inv.hidden = false;
  document.documentElement.classList.add('inv-aberto');
  window.__lenis?.stop();
  ceuInicia();
}
function fechar() {
  vez += 1;
  tl?.kill();
  if (pular) pular();
  rodando = false;
  gsap.to(inv, { opacity: 0, duration: reduce ? 0 : 0.35, onComplete: () => { inv.hidden = true; gsap.set(inv, { opacity: 1 }); palco.innerHTML = ''; um.innerHTML = ''; fim.hidden = true; toque.hidden = true; } });
  document.documentElement.classList.remove('inv-aberto');
  window.__lenis?.start();
  pintaGarantia();
}

// espera um toque ou o tempo passar (o que vier antes)
function espera(ms) {
  return new Promise((ok) => {
    let ligado = false;
    const t = setTimeout(feito, ms);
    const t2 = setTimeout(() => { ligado = true; inv.addEventListener('click', clique); }, 150);
    function feito() { clearTimeout(t); clearTimeout(t2); if (ligado) inv.removeEventListener('click', clique); pular = null; ok(); }
    function clique(e) { if (e.target.closest('button, a')) return; feito(); }
    pular = feito;
  });
}

function rastro(melhor) {
  const cor = R[melhor].cor;
  const met = $('[data-meteoro]');
  const k = $('[data-inv-k]');
  const flash = $('[data-flash]');
  rajada(cor);
  gsap.set([linhas, k, flash], { opacity: 0 });
  // Lendário: o rastro nasce violeta e vira vermelho no meio do caminho (o susto dos gachas).
  const corIni = melhor === 'lendario' ? R.epico.cor : cor;
  tl = gsap.timeline();
  tl.set(met, { '--mc': corIni, opacity: 1, x: innerWidth * 0.42, y: -innerHeight * 0.55, scale: 0.6 })
    .to(met, { x: 0, y: 0, scale: 1, duration: 1.4, ease: 'power2.in' }, 0.2);
  if (melhor === 'lendario') tl.to(met, { '--mc': cor, duration: 0.25 }, 1.0);
  tl.to(flash, { opacity: 1, duration: 0.08 }, 1.6)
    .set(met, { opacity: 0 }, 1.68)
    .to(flash, { opacity: 0, duration: 0.7, ease: 'power2.out' }, 1.7)
    .fromTo(linhas, { opacity: 0, scale: 1.4 }, { opacity: melhor === 'raro' ? 0.35 : 0.9, scale: 1, duration: 0.5, ease: 'expo.out' }, 1.62);
  if (melhor !== 'raro') tl.fromTo(k, { opacity: 0, scale: 2.6 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, 1.66).to(k, { opacity: 0, duration: 0.5 }, 2.4);
  tl.to(linhas, { opacity: 0.12, duration: 0.8 }, 2.3);
  return new Promise((ok) => {
    const acaba = () => { pular = null; ok(); };
    tl.eventCallback('onComplete', acaba);
    pular = () => { tl.progress(1); acaba(); };
  });
}

// uma carta sozinha no centro: silhueta branca, estrelas uma a uma, nome
async function revelaUma(p, i, total, minha) {
  um.innerHTML = '';
  const c = carta(p, true);
  um.append(c);
  inv.style.setProperty('--rc', R[p.rar].cor);
  $('[data-inv-conta]').textContent = total > 1 ? `${i + 1} / ${total}` : '';
  toque.hidden = false;
  const est = c.querySelectorAll('.inv-card__d i');
  const txt = c.querySelectorAll('.inv-card__n, .inv-card__t');
  const t = gsap.timeline();
  t.fromTo(c, { opacity: 0, scale: 1.25, filter: 'brightness(6) blur(8px)' }, { opacity: 1, scale: 1, filter: 'brightness(1) blur(0px)', duration: p.rar === 'raro' ? 0.45 : 0.8, ease: 'expo.out' })
    .fromTo(est, { opacity: 0, scale: 2.4 }, { opacity: 1, scale: 1, duration: 0.25, stagger: 0.09, ease: 'back.out(2)' }, '-=0.2')
    .fromTo(txt, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.08 }, '-=0.15');
  if (p.rar === 'lendario') t.fromTo(c, { '--glow': 0 }, { '--glow': 1, duration: 0.5, yoyo: true, repeat: 3 }, 0.4).fromTo($('[data-flash]'), { opacity: 0.8 }, { opacity: 0, duration: 0.6 }, 0);
  if (p.rar !== 'raro') t.fromTo(linhas, { opacity: 0.9, scale: 1.2 }, { opacity: 0.25, scale: 1, duration: 0.8 }, 0);
  await espera(p.rar === 'lendario' ? 3400 : p.rar === 'epico' ? 2000 : 1100);
  t.progress(1);
  if (minha !== vez || pulouTudo) return;
  if (i < total - 1) await gsap.to(c, { opacity: 0, x: -60, duration: 0.18 });
}

async function sequencia(res, titulo) {
  const minha = ++vez;
  pulouTudo = false;
  palco.innerHTML = '';
  um.innerHTML = '';
  fim.hidden = true;
  toque.hidden = true;
  $('[data-inv-resumo]').textContent = titulo;
  const melhor = res.reduce((m, p) => (ORDEM[p.rar] > ORDEM[m] ? p.rar : m), 'raro');
  abrir();
  inv.style.setProperty('--rc', R[melhor].cor);
  gsap.set($('[data-meteoro]'), { opacity: 0 });

  if (!reduce) {
    await rastro(melhor);
    for (let i = 0; i < res.length; i++) {
      if (minha !== vez || pulouTudo) break;
      await revelaUma(res[i], i, res.length, minha);
    }
  }
  if (minha !== vez) return;
  toque.hidden = true;
  // fim: com 1 resultado a carta grande fica; com 10, a fileira inteira
  if (res.length === 1) {
    if (!um.children.length) um.append(carta(res[0], true));
    gsap.set(um.children, { opacity: 1, x: 0, scale: 1, filter: 'none' });
  } else {
    um.innerHTML = '';
    const cartas = res.map((p) => carta(p));
    cartas.forEach((c) => palco.append(c));
    if (!reduce) gsap.fromTo(cartas, { opacity: 0, y: 40, rotate: -4 }, { opacity: 1, y: 0, rotate: 0, duration: 0.5, stagger: 0.05, ease: 'expo.out' });
  }
  fim.hidden = false;
  if (!reduce) gsap.from(fim, { opacity: 0, y: 16, duration: 0.5, delay: 0.3 });
}

function invocar(qtd) {
  ultima = () => invocar(qtd);
  const res = Array.from({ length: qtd }, sortear);
  st.hist.unshift(...res.slice().reverse().map((p) => ({ nome: p.nome, rar: p.rar, em: Date.now() })));
  salvar();
  sequencia(res, resumo(res));
}

function resumo(res) {
  const c = { lendario: 0, epico: 0, raro: 0 };
  res.forEach((p) => (c[p.rar] += 1));
  const partes = [c.lendario && `${c.lendario} Lendário`, c.epico && `${c.epico} ${c.epico === 1 ? 'Épico' : 'Épicos'}`, c.raro && `${c.raro} ${c.raro === 1 ? 'Raro' : 'Raros'}`].filter(Boolean);
  return `${partes.join(' · ')} · faltam ${G.lendario - st.pity} para a garantia`;
}

/* ---------------------------------------------------------------- Pedra do Destino (prévia) */
const giros = D.giros;
let giroSel = giros[0];
const pesa = (l) => { const t = l.reduce((s, x) => s + x.peso, 0); let r = Math.random() * t; for (const x of l) { r -= x.peso; if (r <= 0) return x; } return l[l.length - 1]; };
function escolheGiro(i) {
  giroSel = giros[i];
  $('[data-pedra-ch]').textContent = giroSel.pool
    ? `Chances: ${giroSel.chances}. Até ${giroSel.limite} por personagem e temporada.`
    : `Chances: ${giroSel.chances}. Este depende da sua família, então só gira no bot.`;
  $('[data-pedra-custo]').textContent = `${giroSel.custo} ${giroSel.custo === 1 ? 'Inscrição' : 'Inscrições'} · ${giroSel.nome}`;
  $('[data-girar-pedra]').disabled = !giroSel.pool;
}
$$('[data-pedra] input').forEach((r) => r.addEventListener('change', () => escolheGiro(Number(r.value))));
function girarPedra() {
  const g = giroSel;
  if (!g.pool) return;
  ultima = girarPedra;
  const grupo = pesa(g.pool);
  const nome = grupo.lista[Math.floor(Math.random() * grupo.lista.length)];
  sequencia([{ nome, tipo: g.nome, rar: grupo.rar, rotulo: grupo.rot, k: '石' }], `Pedra do Destino · prévia · ${grupo.rot}`);
}
$('[data-girar-pedra]')?.addEventListener('click', girarPedra);
// /altar/#pedra abre direto na Pedra do Destino (links de Conhecimentos e Cristais)
if (location.hash === '#pedra') $('[data-troca="pedra"]')?.click();

$$('[data-girar]').forEach((b) => b.addEventListener('click', () => invocar(Number(b.dataset.girar))));
$('[data-inv-pular]').addEventListener('click', () => { if (!fim.hidden) { fechar(); return; } pulouTudo = true; if (pular) pular(); });
$('[data-inv-fechar]').addEventListener('click', fechar);
$('[data-inv-denovo]').addEventListener('click', () => { tl?.kill(); ultima(); });
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
