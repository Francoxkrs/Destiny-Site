// Simuladores das regras (sem dados): confronto, Acréscimos, custo de Mana e a criação de personagem.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const fmt = (n) => String(Math.round(n * 10) / 10).replace('.', ',');
const readJSON = (el, k) => { try { return JSON.parse(el.dataset[k] || 'null'); } catch { return null; } };

function paintRange(r) {
  const p = ((r.value - r.min) / (r.max - r.min)) * 100;
  r.style.setProperty('--p', `${p}%`);
}

/* ------------------------------------------------------------ confronto */
function confronto(root) {
  const cls = readJSON(root, 'cls') || [];
  const fer = readJSON(root, 'fer') || [];
  const modo = $('[name=modo]', root);
  const aC = $('[name=a-cls]', root), aA = $('[name=a-acr]', root);
  const dC = $('[name=d-cls]', root), dA = $('[name=d-acr]', root);
  const aLbl = $('[data-a-attr]', root), dLbl = $('[data-d-attr]', root);
  const outR = $('[data-result]', root), outW = $('[data-why]', root);

  const eff = (i, acr) => (acr >= 10 ? { c: Math.min(i + 1, cls.length - 1), r: 0 } : { c: i, r: acr });

  const run = () => {
    [aA, dA].forEach(paintRange);
    $('[data-a-out]', root).textContent = `+${fmt(aA.value)}`;
    $('[data-d-out]', root).textContent = `+${fmt(dA.value)}`;
    const esquiva = modo.value === 'vel';
    aLbl.textContent = esquiva ? 'Velocidade do ataque' : 'Força de quem ataca';
    dLbl.textContent = esquiva ? 'Velocidade de quem esquiva' : 'Resistência de quem defende';
    const A = eff(+aC.value, +aA.value), D = eff(+dC.value, +dA.value);
    const nomeA = `${cls[A.c]}${A.r ? ` +${fmt(A.r)}` : ''}`;
    const nomeD = `${cls[D.c]}${D.r ? ` +${fmt(D.r)}` : ''}`;
    const sobe = (x, i) => (+x.value >= 10 ? ` (10 Acréscimos elevam ${cls[i]} para ${cls[Math.min(i + 1, cls.length - 1)]})` : '');
    const nota = sobe(aA, +aC.value) + sobe(dA, +dC.value);
    const diff = A.c - D.c;
    outR.classList.remove('is-bad');

    if (esquiva) {
      const ok = diff < 0 || (diff === 0 && D.r >= A.r);
      outR.innerHTML = ok ? 'A esquiva <em>acontece</em>.' : 'O golpe <em>acerta</em>.';
      if (!ok) outR.classList.add('is-bad');
      outW.textContent = `Velocidade efetiva: ataque ${nomeA} contra esquiva ${nomeD}${nota}. Se a Velocidade de quem esquiva for igual ou maior que a do ataque, a esquiva acontece. Se o golpe acerta, compare Força contra Resistência.`;
      return;
    }
    let res, why;
    if (diff >= 3) { res = fer[3]; why = `${diff} classificações acima da defesa.`; }
    else if (diff === 2) { res = fer[2]; why = 'duas classificações acima da defesa.'; }
    else if (diff === 1) { res = fer[1]; why = 'uma classificação acima da defesa.'; }
    else if (diff === 0 && A.r > D.r) { res = fer[0]; why = `mesma classificação; vence por ${fmt(A.r - D.r)} Acréscimo${A.r - D.r >= 2 ? 's' : ''}.`; }
    else if (diff === 0 && A.r === D.r) {
      outR.innerHTML = 'Empate: decidem as <em>circunstâncias</em>.';
      outW.textContent = `${nomeA} contra ${nomeD}${nota}. Mesma classificação e mesmos Acréscimos: o narrador olha surpresa, terreno, região atingida, Conhecimentos e a qualidade da ação escrita. Se ainda empatar, os efeitos se anulam.`;
      return;
    } else {
      outR.innerHTML = 'A defesa <em>aguenta</em>.';
      outW.textContent = `${nomeA} contra ${nomeD}${nota}. A Resistência supera a Força, então o golpe não fere. Nenhum dado foi rolado.`;
      return;
    }
    outR.innerHTML = `Ferimento ${res[0]} · <em>${res[1]}</em>`;
    if (res[0] !== 'I') outR.classList.add('is-bad');
    outW.textContent = `${nomeA} contra ${nomeD}${nota}: o ataque fica ${why} Efeito até ser tratado: ${res[3]}.`;
  };
  $$('select, input', root).forEach((el) => el.addEventListener('input', run));
  run();
}

/* ------------------------------------------------------------ Acréscimos */
function acrescimos(root) {
  const cls = readJSON(root, 'cls') || [];
  const faixas = readJSON(root, 'faixas') || [];
  const base = $('[name=base]', root);
  const acr = $('[name=acr]', root);
  const meter = $('.meter', root);
  const cells = $$('i', meter);
  const out = $('[data-result]', root), why = $('[data-why]', root);
  const run = () => {
    paintRange(acr);
    const v = +acr.value;
    $('[data-out]', root).textContent = `+${fmt(v)}`;
    cells.forEach((c, i) => c.classList.toggle('on', v >= i + 1 || (v > i && v < i + 1)));
    cells.forEach((c, i) => { c.style.opacity = v > i && v < i + 1 ? String(0.35 + (v - i) * 0.65) : ''; });
    meter.classList.toggle('is-full', v >= 10);
    const b = +base.value;
    if (v >= 10) {
      const up = cls[Math.min(b + 1, cls.length - 1)];
      out.innerHTML = `Age como <em>${up}</em>`;
      why.textContent = `${cls[b]} com 10 Acréscimos sobe uma classificação completa enquanto os 10 forem mantidos. O que passar de 10 não gera nada.`;
      return;
    }
    if (v === 0) { out.innerHTML = `${cls[b]} <em>pura</em>`; why.textContent = 'Sem Acréscimos: o desempenho natural da classificação.'; return; }
    const f = v < 3 ? faixas[0] : v < 5 ? faixas[1] : v < 7 ? faixas[2] : v < 9 ? faixas[3] : faixas[4];
    out.innerHTML = `${cls[b]} <em>+${fmt(v)}</em>`;
    why.textContent = `${f[1]}. Cada aplicação dá de 0,1 a 1 Acréscimo; fontes diferentes se somam até 10.`;
  };
  [base, acr].forEach((el) => el.addEventListener('input', run));
  run();
}

/* ------------------------------------------------------------ custo de Mana */
function custo(root) {
  const graus = readJSON(root, 'graus') || [];
  const faixas = readJSON(root, 'faixas') || [];
  const niveis = readJSON(root, 'niveis') || [];
  const grau = $('[name=grau]', root), ctrl = $('[name=ctrl]', root), mae = $('[name=mae]', root), mana = $('[name=mana]', root);
  const arc = $('[name=arcano]', root), caos = $('[name=caos]', root), elfo = $('[name=elfo]', root);
  const out = $('[data-result]', root), why = $('[data-why]', root);
  const descontoCtrl = (c) => {
    const lim = [10, 25, 35, 45, 55, 65, 75, 85, 95, 100];
    const i = lim.findIndex((l) => c <= l);
    return faixas[i === -1 ? faixas.length - 1 : i][1];
  };
  const run = () => {
    paintRange(ctrl);
    const c = +ctrl.value;
    $('[data-out]', root).textContent = `${c}%`;
    const base = graus[+grau.value][1];
    const partes = [];
    let d = descontoCtrl(c); partes.push(`Controle ${d}%`);
    const m = +mae.value;
    if (m >= 1) { d += 10; partes.push('Maestria 10%'); }
    if (m >= 3) { d += 10; partes.push('Maestria III +10%'); }
    if (arc.checked) { d += 10; partes.push('Fluxo Refinado 10%'); }
    if (elfo.checked) { d += 50; partes.push('Comunhão com a Mana 50%'); }
    const capped = Math.min(d, 50);
    let v = base * (1 - capped / 100);
    if (caos.checked) v *= 1.1;
    v = Math.max(1, Math.round(v));
    const reserva = niveis[+mana.value];
    const vezes = Math.floor(reserva / v);
    out.innerHTML = `${v} de Mana <em>por feitiço</em>`;
    why.textContent = `Grau ${graus[+grau.value][0]} custa ${base}. Descontos: ${partes.join(' + ')} = ${d}%${d > 50 ? ', limitado a 50%' : ''}${caos.checked ? '; Instabilidade soma 10% ao custo' : ''}. Com ${reserva} de Mana, dá para lançar ${vezes} vez${vezes === 1 ? '' : 'es'} antes da Exaustão Mágica.`;
  };
  $$('select, input', root).forEach((el) => el.addEventListener('input', run));
  run();
}

/* ------------------------------------------------------------ criação: os três modelos */
function criacao(root) {
  const pools = readJSON(root, 'pools');
  if (!pools) return;
  const models = $$('[data-model]', root);
  const res = $('[data-spin-result]', root);
  const resName = $('[data-spin-name]', root);
  const resKind = $('[data-spin-kind]', root);
  const left = { magia: 4, conh: 4, grim: 2 };
  let current = null;

  const pick = (list) => {
    const total = list.reduce((s, x) => s + x.w, 0);
    let r = Math.random() * total;
    for (const x of list) { r -= x.w; if (r <= 0) return x; }
    return list[list.length - 1];
  };
  const spin = (kind) => {
    if (left[kind] <= 0 || current) return;
    left[kind]--;
    const g = pick(pools[kind]);
    const name = g.items[Math.floor(Math.random() * g.items.length)];
    current = { kind, name, tier: g.label };
    // animação de “roleta”
    let n = 0;
    const all = pools[kind].flatMap((x) => x.items);
    res.classList.add('is-spinning');
    const iv = setInterval(() => {
      resName.textContent = all[Math.floor(Math.random() * all.length)];
      if (++n > 14) {
        clearInterval(iv);
        resName.textContent = name;
        resKind.textContent = `${kind === 'magia' ? 'Magia' : kind === 'conh' ? 'Conhecimento' : 'Grimório'} ${g.label}`;
        res.classList.remove('is-spinning');
        root.classList.add('has-result');
        refresh();
      }
    }, 55);
    refresh();
  };
  const place = (m) => {
    if (!current) return;
    const slots = $$(`[data-slot-kind="${current.kind}"]`, m);
    const free = slots.find((s) => !s.classList.contains('is-filled')) || (current.kind !== 'conh' ? slots[0] : null);
    if (!free) return;
    free.classList.add('is-filled');
    $('span', free).textContent = `${current.name} · ${current.tier}`;
    current = null;
    root.classList.remove('has-result');
    resName.textContent = 'Gire de novo';
    resKind.textContent = 'Escolha o que girar';
    refresh();
  };
  const discard = () => { current = null; root.classList.remove('has-result'); resName.textContent = 'Descartado'; resKind.textContent = 'Escolha o que girar'; refresh(); };
  const refresh = () => {
    $$('[data-spin]', root).forEach((b) => {
      const k = b.dataset.spin;
      $('b', b).textContent = left[k];
      b.disabled = left[k] <= 0 || !!current;
    });
    models.forEach((m) => {
      const btn = $('[data-place]', m);
      if (!current) { btn.disabled = true; return; }
      const slots = $$(`[data-slot-kind="${current.kind}"]`, m);
      btn.disabled = current.kind === 'conh' ? slots.every((s) => s.classList.contains('is-filled')) : false;
    });
    $('[data-discard]', root).disabled = !current;
  };
  $$('[data-spin]', root).forEach((b) => b.addEventListener('click', () => spin(b.dataset.spin)));
  models.forEach((m) => $('[data-place]', m).addEventListener('click', () => place(m)));
  $('[data-discard]', root).addEventListener('click', discard);
  $('[data-reset]', root)?.addEventListener('click', () => {
    left.magia = 4; left.conh = 4; left.grim = 2; current = null;
    $$('.is-filled', root).forEach((s) => { s.classList.remove('is-filled'); $('span', s).textContent = s.dataset.empty; });
    root.classList.remove('has-result');
    resName.textContent = 'Comece girando';
    resKind.textContent = 'Escolha o que girar';
    refresh();
  });
  refresh();
}

export function initSims() {
  $$('[data-sim="confronto"]').forEach(confronto);
  $$('[data-sim="acrescimos"]').forEach(acrescimos);
  $$('[data-sim="custo"]').forEach(custo);
  $$('[data-sim="criacao"]').forEach(criacao);
}
