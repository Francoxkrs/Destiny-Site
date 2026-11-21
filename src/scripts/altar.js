// Altar dos Vestígios: troca de banner, garantia e a invocação de tela cheia.
// O sorteio do Altar dos Vestígios roda no servidor (/api/altar/invocar): gasta, entrega e devolve o resultado;
// esta tela só toca a animação. A Pedra do Destino ainda é prévia (sorteia aqui e não entrega nada).
import gsap from 'gsap';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const D = JSON.parse($('#al-dados').textContent);
const G = D.garantia;
const R = D.raridades;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ORDEM = { raro: 0, epico: 1, lendario: 2 };

/* ---------------------------------------------------------------- estado (vem do servidor) */
// modo: 'carregando' | 'ok' (logado, banco ligado) | 'visitante' (não entrou) | 'fora' (banco desligado ou erro)
const st = { modo: 'carregando', pity: 0, pityE: 0, hist: [], cp: null, insc: null, ocupado: false };
const aviso = $('[data-al-aviso]');
const AVISO_PADRAO = aviso?.innerHTML ?? '';
function avisar(html, erro = false) {
  if (!aviso) return;
  aviso.innerHTML = html || AVISO_PADRAO;
  aviso.classList.toggle('is-erro', erro);
}
function aplicaEstado(e, garantiaJa = true) {
  st.pity = e.pity; st.pityE = e.pityE; st.hist = e.hist ?? [];
  st.cp = e.cp; st.insc = e.inscricoes;
  pintaCustos();
  if (typeof pintaPedra === 'function') pintaPedra();
  pintaSaldo(); if (garantiaJa) pintaGarantia(); // na invocação, a barra só muda ao fechar (não entrega o resultado antes da animação)
}
async function carregar() {
  try {
    const r = await fetch('/api/altar', { headers: { accept: 'application/json' }, credentials: 'same-origin' });
    const tipo = r.headers.get('content-type') || '';
    if (r.status === 401) { st.modo = 'visitante'; avisar('Entre com o Discord para invocar. Gasta suas Inscrições primeiro e o que faltar sai dos Cristais Prismáticos.'); return; }
    if (!r.ok || !tipo.includes('json')) { st.modo = 'fora'; avisar((tipo.includes('json') && (await r.json()).erro) || 'O Altar não está ligado neste endereço do site.', true); return; }
    st.modo = 'ok';
    aplicaEstado(await r.json());
    carregarLimites();
  } catch { st.modo = 'fora'; avisar('O Altar não está ligado neste endereço do site.', true); }
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
  $$('[data-aviso-banner]').forEach((x) => (x.hidden = x.dataset.avisoBanner !== id));
}));

/* ---------------------------------------------------------------- custo nos botões (Inscrições primeiro, o resto em CP) */
function custoAltar(qtd) {
  const insc = typeof st.insc === 'number' ? st.insc : 0;
  const usa = Math.min(insc, qtd);
  const cp = Math.min((qtd - usa) * D.inscricao.cp, D.inscricao.cp10);
  return { usa, cp };
}
function pintaCustos() {
  if (st.modo !== 'ok') return;
  $$('[data-girar]').forEach((b) => {
    const { usa, cp } = custoAltar(Number(b.dataset.girar));
    const el = b.querySelector('[data-custo]');
    if (el) el.textContent = [usa && `${usa} ${usa === 1 ? 'Inscrição' : 'Inscrições'}`, cp && `${new Intl.NumberFormat('pt-BR').format(cp)} CP`].filter(Boolean).join(' + ');
    b.classList.toggle('is-falta', cp > (st.cp ?? 0));
  });
}

/* ---------------------------------------------------------------- saldo */
const fmt = new Intl.NumberFormat('pt-BR');
function pintaSaldo() {
  if (typeof st.cp === 'number') $('[data-cp]').textContent = fmt.format(st.cp);
  if (typeof st.insc === 'number') $('[data-insc]').textContent = fmt.format(st.insc);
  // o CP do cabeçalho acompanha o gasto
  const n = $('[data-sessao-cp-n]');
  if (n && typeof st.cp === 'number') n.textContent = fmt.format(st.cp);
}
document.addEventListener('bd:sessao', (e) => {
  const s = e.detail;
  if (st.modo === 'ok') return; // o Altar já tem o saldo mais novo
  if (s && typeof s.cp === 'number') $('[data-cp]').textContent = fmt.format(s.cp);
  if (s && typeof s.inscricoes === 'number') $('[data-insc]').textContent = fmt.format(s.inscricoes);
});
if (window.__bdSessao) document.dispatchEvent(new CustomEvent('bd:sessao', { detail: window.__bdSessao }));
carregar();

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
  if (p.ganho) { const g = document.createElement('p'); g.className = `inv-card__g${p.novo ? ' is-novo' : ''}`; g.textContent = p.ganho; el.querySelector('.inv-card__txt').append(g); }
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

const novaRef = () => (crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`);
const btnsInv = $$('[data-girar]');
async function invocar(qtd) {
  if (st.ocupado) return;
  if (st.modo === 'carregando') await carregar();
  if (st.modo === 'visitante') { location.href = '/api/auth/login?volta=/altar/'; return; }
  if (st.modo !== 'ok') { avisar('O Altar não está ligado neste endereço do site.', true); return; }
  ultima = () => invocar(qtd);
  st.ocupado = true;
  btnsInv.forEach((b) => b.setAttribute('aria-busy', 'true'));
  const ref = novaRef();
  try {
    let r;
    // uma segunda tentativa com a MESMA ref, se a rede cair: o servidor nunca cobra duas vezes
    for (let t = 0; t < 2; t++) {
      try { r = await fetch('/api/altar/invocar', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ qtd, ref }) }); break; } catch (e) { if (t) throw e; }
    }
    const corpo = await r.json().catch(() => ({}));
    if (r.status === 401) { location.href = '/api/auth/login?volta=/altar/'; return; }
    if (r.status === 402) {
      if (!inv.hidden) fechar();
      avisar(`Faltam <b class="al-falta">${fmt.format(corpo.falta?.cp ?? 0)} CP</b> para esta invocação. <a href="/cristais/">Comprar Cristais</a>`, true);
      return;
    }
    if (!r.ok) { if (!inv.hidden) fechar(); avisar(corpo.erro || 'A invocação não deu certo. Tente de novo.', true); return; }
    avisar('');
    aplicaEstado(corpo.estado, false);
    sequencia(corpo.res, resumo(corpo.res));
  } catch {
    if (!inv.hidden) fechar();
    avisar('Sem conexão com o site. Abra o histórico antes de tentar de novo: se o giro entrou, ele aparece lá.', true);
  } finally {
    st.ocupado = false;
    btnsInv.forEach((b) => b.removeAttribute('aria-busy'));
  }
}

function resumo(res) {
  const c = { lendario: 0, epico: 0, raro: 0 };
  res.forEach((p) => (c[p.rar] += 1));
  const partes = [c.lendario && `${c.lendario} Lendário`, c.epico && `${c.epico} ${c.epico === 1 ? 'Épico' : 'Épicos'}`, c.raro && `${c.raro} ${c.raro === 1 ? 'Raro' : 'Raros'}`].filter(Boolean);
  return `${partes.join(' · ')} · faltam ${G.lendario - st.pity} para a garantia`;
}

/* ---------------------------------------------------------------- Pedra do Destino */
// O site cobra e põe o item na /bolsa do bot (/api/loja/comprar); quem gira é o bot, com as vagas de sempre.
const giros = D.giros;
let giroSel = giros[0];
const usados = {}; // 'pedra:giroMagia' → quantos já pegou nesta temporada
const rarDoGiro = (g) => (g.custo >= 15 ? 'lendario' : g.custo >= 4 ? 'epico' : 'raro');
const plural = (n, um, varios) => `${fmt.format(n)} ${n === 1 ? um : varios}`;
function custoPedra(g) {
  const insc = typeof st.insc === 'number' ? st.insc : 0;
  const usa = Math.min(insc, g.custo);
  const faltam = g.custo - usa;
  if (faltam && g.so) return { texto: `${plural(g.custo, 'Inscrição', 'Inscrições')} ganhas jogando`, bloqueado: st.modo === 'ok' ? `Faltam ${plural(faltam, 'Inscrição', 'Inscrições')}` : null };
  if (!faltam) return { texto: plural(g.custo, 'Inscrição', 'Inscrições') };
  const cp = faltam * D.inscricao.cp;
  return { texto: usa ? `${plural(usa, 'Inscrição', 'Inscrições')} + ${fmt.format(cp)} CP` : `${fmt.format(cp)} CP` };
}
function pintaPedra() {
  const g = giroSel;
  const u = usados[`pedra:${g.chave}`] ?? 0;
  const cheio = u >= g.limite;
  const c = custoPedra(g);
  $('[data-pedra-ch]').textContent = `Chances no bot: ${g.chances}. ${st.modo === 'ok' ? `Você já pegou ${u} de ${g.limite} nesta temporada.` : `Até ${g.limite} por personagem nesta temporada.`}`;
  $('[data-pedra-custo]').textContent = cheio ? 'Limite da temporada' : c.bloqueado ? c.bloqueado : `${c.texto} · ${g.nome}`;
  $('[data-girar-pedra]').disabled = cheio || Boolean(c.bloqueado);
  $$('[data-giro]').forEach((l) => {
    const x = giros.find((y) => y.chave === l.dataset.giro);
    const ux = usados[`pedra:${x.chave}`] ?? 0;
    l.classList.toggle('is-cheio', ux >= x.limite);
    l.querySelector('[data-lim]').textContent = `${x.so ? 'Só Inscrições · ' : ''}${st.modo === 'ok' ? `${ux}/${x.limite}` : `até ${x.limite}`}`;
  });
}
function escolheGiro(i) { giroSel = giros[i]; pintaPedra(); }
$$('[data-pedra] input').forEach((r) => r.addEventListener('change', () => escolheGiro(Number(r.value))));
async function carregarLimites() {
  if (st.modo !== 'ok') return;
  try {
    const r = await fetch('/api/loja', { headers: { accept: 'application/json' }, credentials: 'same-origin' });
    if (r.ok) Object.assign(usados, (await r.json()).usados);
  } catch { /* sem limites: o servidor confere na hora da compra */ }
  pintaPedra();
}
const avisoPedra = $('[data-al-aviso-pedra]');
const AVISO_PEDRA = avisoPedra?.innerHTML ?? '';
const avisarPedra = (html, erro = false) => { if (!avisoPedra) return; avisoPedra.innerHTML = html || AVISO_PEDRA; avisoPedra.classList.toggle('is-erro', erro); };
async function girarPedra() {
  const g = giroSel;
  if (st.ocupado) return;
  if (st.modo === 'carregando') await carregar();
  if (st.modo === 'visitante') { location.href = '/api/auth/login?volta=/altar/%23pedra'; return; }
  if (st.modo !== 'ok') { avisarPedra('A Pedra não está ligada neste endereço do site.', true); return; }
  ultima = girarPedra;
  st.ocupado = true;
  const btn = $('[data-girar-pedra]');
  btn.setAttribute('aria-busy', 'true');
  const ref = novaRef();
  try {
    let r;
    for (let t = 0; t < 2; t++) {
      try { r = await fetch('/api/loja/comprar', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ tipo: 'pedra', id: g.chave, ref }) }); break; } catch (e) { if (t) throw e; }
    }
    const corpo = await r.json().catch(() => ({}));
    if (r.status === 401) { location.href = '/api/auth/login?volta=/altar/%23pedra'; return; }
    if (!inv.hidden && !r.ok) fechar();
    if (r.status === 402 && corpo.falta?.cp) { avisarPedra(`Faltam <b class="al-falta">${fmt.format(corpo.falta.cp)} CP</b> para este giro. <a href="/cristais/">Comprar Cristais</a>`, true); return; }
    if (!r.ok) { avisarPedra(corpo.erro || 'Não deu certo. Tente de novo.', true); return; }
    avisarPedra('');
    st.cp = corpo.conta.cp; st.insc = corpo.conta.inscricoes; Object.assign(usados, corpo.conta.usados);
    pintaSaldo(); pintaCustos(); pintaPedra();
    const gasto = [corpo.recibo.insc && plural(corpo.recibo.insc, 'Inscrição', 'Inscrições'), corpo.recibo.cp && `${fmt.format(corpo.recibo.cp)} CP`].filter(Boolean).join(' + ');
    sequencia([{ nome: g.nome, tipo: 'Pedra do Destino', rar: rarDoGiro(g), rotulo: 'Na sua /bolsa', k: '石', novo: true, ganho: 'Gire na /bolsa do bot' }], `Pedra do Destino · ${gasto} · use na /bolsa do bot`);
  } catch {
    if (!inv.hidden) fechar();
    avisarPedra('Sem conexão com o site. Confira a sua /bolsa no bot antes de tentar de novo.', true);
  } finally {
    st.ocupado = false;
    btn.removeAttribute('aria-busy');
  }
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
$('[data-historico]').addEventListener('click', async () => {
  if (st.modo === 'ok') await carregar();
  $('[data-hist-nota]').textContent = st.modo === 'ok' ? 'Suas últimas invocações no Altar dos Vestígios.' : 'Entre com o Discord para ver as suas invocações.';
  const ol = $('[data-hist-lista]');
  ol.innerHTML = '';
  if (!st.hist.length) { const li = document.createElement('li'); li.textContent = 'Nenhuma invocação ainda.'; ol.append(li); }
  st.hist.slice(0, 60).forEach((h) => { const li = document.createElement('li'); li.dataset.r = h.rar; li.textContent = `${nomeR[h.rar]} · ${h.nome}`; ol.append(li); });
  hist.showModal();
});
