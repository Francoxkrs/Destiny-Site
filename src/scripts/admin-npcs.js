// Arquivo de NPCs (/admin/npcs): lê e grava pela rota /api/admin/npcs, que confere o admin a cada pedido.
// Todo texto entra por textContent: nada do banco vira HTML.
const raiz = document.querySelector('[data-npcs-adm]');

if (raiz) {
  const LIM = JSON.parse(raiz.dataset.limites || '{}');
  const $ = (s, el = raiz) => el.querySelector(s);
  const $$ = (s, el = raiz) => [...el.querySelectorAll(s)];
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, attrs = {}, ...filhos) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v; else if (k === 'style') n.style.cssText = v;
      else if (k.startsWith('data-') || k.startsWith('aria-') || k === 'role' || k === 'for') n.setAttribute(k, v); else n[k] = v;
    }
    for (const f of filhos.flat()) if (f != null && f !== false) n.append(f instanceof Node ? f : String(f));
    return n;
  }
  const SVG = 'http://www.w3.org/2000/svg';
  const silhueta = () => {
    const s = document.createElementNS(SVG, 'svg'); s.setAttribute('viewBox', '0 0 100 120'); s.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS(SVG, 'path'); p.setAttribute('d', 'M50 14c-13 0-22 10-22 24 0 9 3 17 8 22-14 5-25 15-28 32l-2 28h88l-2-28c-3-17-14-27-28-32 5-5 8-13 8-22 0-14-9-24-22-24z');
    s.append(p); return s;
  };

  async function api(corpo) {
    const r = await fetch('/api/admin/npcs', corpo ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(corpo), credentials: 'same-origin' } : { credentials: 'same-origin' });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.erro || `Erro ${r.status}`);
    return j;
  }

  const status = $('[data-npc-status]');
  const avisa = (t, tipo) => { status.textContent = t; status.dataset.tipo = tipo || ''; status.classList.remove('is-pisca'); void status.offsetWidth; status.classList.add('is-pisca'); };

  let npcs = [];
  let grupo = 'todos';
  const indef = (v) => !v || /^\[?\s*a\s+definir\s*\]?$/i.test(v.trim());
  const grupos = () => [...new Set(npcs.map((n) => n.grupo))];
  const norm = (t) => String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  /* ------------------------------------------------------------ desenho */
  function pasta(n, i, num) {
    const cor = n.cor || '#ff3b2e';
    const cheios = n.campos.filter((c) => !indef(c.v)).length;
    const pct = n.campos.length ? Math.round((cheios / n.campos.length) * 100) : 0;
    const rot = [-1.1, 0.8, -0.5, 1.2][i % 4];
    const art = el('article', { class: 'dossie', style: `--c:${cor};--r:${rot}deg;--d:${calmo ? 0 : Math.min(i, 8) * 0.06}s`, id: `npc-${n.id}` },
      el('div', { class: 'dossie__tab' }, el('span', {}, `Nº ${String(num).padStart(3, '0')}`), el('span', {}, n.grupo)),
      el('div', { class: 'dossie__sheet' },
        el('span', { class: 'dossie__stamp', 'aria-hidden': 'true' }, el('b', {}, '機密'), el('i', {}, 'Staff')),
        el('header', { class: 'dossie__head' },
          el('div', { class: 'dossie__face', 'aria-hidden': 'true' }, silhueta(), el('span', { class: 'dossie__kanji' }, n.kanji || '?')),
          el('div', {},
            el('p', { class: 'dossie__eyebrow' }, n.papel || '⸻ Dossiê ⸻'),
            el('h3', { class: 'dossie__name' }, n.nome),
            n.alcunha && el('p', { class: 'dossie__alias' }, `“${n.alcunha}”`))),
        el('dl', { class: 'dossie__fields' }, n.campos.map((c) => el('div', { class: `dossie__f${c.segredo ? ' is-segredo' : ''}` },
          el('dt', {}, c.r),
          el('dd', {}, indef(c.v) ? el('span', { class: 'redige', title: 'Ainda não definido' }, el('span', {}, '[ A definir ]')) : c.v)))),
        n.falas.length ? el('ul', { class: 'dossie__falas', 'aria-label': 'Falas' }, n.falas.map((f) => el('li', {}, f))) : null,
        el('footer', { class: 'dossie__foot' },
          el('span', {}, `${cheios}/${n.campos.length} preenchidos`),
          el('span', { class: 'dossie__meter' }, el('i', { style: `width:${pct}%` })),
          el('button', { type: 'button', class: 'dossie__edit', 'data-editar': n.id }, 'Editar'))));
    return art;
  }

  function desenha() {
    const busca = norm($('[data-npc-busca]').value);
    const lista = $('[data-npc-lista]');
    const gs = grupos();
    // filtros
    const fb = $('[data-npc-grupos]');
    fb.replaceChildren(
      el('button', { type: 'button', class: grupo === 'todos' ? 'is-on' : '', 'aria-pressed': String(grupo === 'todos'), 'data-grupo': 'todos' }, 'Todos ', el('small', {}, npcs.length)),
      ...gs.map((g) => el('button', { type: 'button', class: grupo === g ? 'is-on' : '', 'aria-pressed': String(grupo === g), 'data-grupo': g }, g, ' ', el('small', {}, npcs.filter((n) => n.grupo === g).length))),
    );
    $('[data-npc-datalist]').replaceChildren(...gs.map((g) => el('option', { value: g })));

    if (!npcs.length) {
      lista.replaceChildren(el('div', { class: 'adm-vazio' }, 'O arquivo está vazio. Use ', el('b', {}, 'Importar'), ' com o arquivo npcs-staff.json, ou crie um NPC.'));
      return;
    }
    const passa = (n) => (grupo === 'todos' || n.grupo === grupo) && (!busca || norm([n.nome, n.alcunha, n.papel, n.grupo, ...n.campos.map((c) => `${c.r} ${c.v}`), ...n.falas].join(' ')).includes(busca));
    const blocos = [];
    let i = 0;
    for (const g of gs) {
      const ns = npcs.filter((n) => n.grupo === g && passa(n));
      if (!ns.length) continue;
      blocos.push(el('section', { class: 'npcs-grupo' },
        el('div', { class: 'npcs-grupo__h' }, el('h2', {}, g), el('span', {}, `${ns.length} ${ns.length === 1 ? 'pasta' : 'pastas'}`)),
        el('div', { class: 'npcs-grade' }, ns.map((n, j) => pasta(n, i++, j + 1)))));
    }
    lista.replaceChildren(...(blocos.length ? blocos : [el('p', { class: 'adm-vazio' }, 'Nenhum NPC com isso.')]));
  }

  async function carrega() {
    try {
      const j = await api();
      npcs = j.npcs;
      if (grupo !== 'todos' && !grupos().includes(grupo)) grupo = 'todos';
      desenha();
      avisa(`${npcs.length} ${npcs.length === 1 ? 'NPC' : 'NPCs'} no arquivo.`);
    } catch (e) { avisa(e.message, 'erro'); $('[data-npc-lista]').replaceChildren(el('p', { class: 'adm-vazio' }, e.message)); }
  }

  $('[data-npc-grupos]').addEventListener('click', (e) => { const b = e.target.closest('[data-grupo]'); if (!b) return; grupo = b.dataset.grupo; desenha(); });
  $('[data-npc-busca]').addEventListener('input', desenha);

  /* ------------------------------------------------------------ editor */
  const dlg = $('[data-npc-dlg]');
  const form = $('[data-npc-form]');
  const erro = $('[data-npc-erro]');
  const camposOl = $('[data-npc-campos]');
  let editando = null;

  function linhaCampo(c = { r: '', v: '' }) {
    const li = el('li', { class: 'npcs-campo' },
      el('input', { name: 'cr', maxLength: LIM.rotulo || 48, placeholder: 'Rótulo', value: c.r, 'aria-label': 'Rótulo do campo' }),
      el('textarea', { name: 'cv', rows: 3, maxLength: LIM.valor || 2000, placeholder: '[A DEFINIR]', 'aria-label': 'Valor do campo' }),
      el('label', {}, el('input', { type: 'checkbox', name: 'cs', checked: !!c.segredo }), 'Segredo'),
      el('button', { type: 'button', 'aria-label': 'Tirar campo', 'data-tira': '' }, '×'));
    li.querySelector('textarea').value = c.v || '';
    return li;
  }
  camposOl.addEventListener('click', (e) => { if (e.target.closest('[data-tira]')) e.target.closest('li').remove(); });
  $('[data-npc-campo-mais]').addEventListener('click', () => { if (camposOl.children.length < (LIM.campos || 24)) camposOl.append(linhaCampo()); camposOl.lastElementChild?.querySelector('input')?.focus(); });

  function abre(n) {
    editando = n;
    erro.hidden = true;
    form.reset();
    $('[data-npc-dlg-t]').textContent = n ? `Editar ${n.nome}` : 'Novo NPC';
    form.antigo.value = n?.id || '';
    form.nome.value = n?.nome || '';
    form.grupo.value = n?.grupo || (grupo !== 'todos' ? grupo : '');
    form.alcunha.value = n?.alcunha || '';
    form.papel.value = n?.papel || '';
    form.kanji.value = n?.kanji || '';
    form.cor.value = n?.cor || '#ff3b2e';
    form.ordem.value = n?.ordem ?? 0;
    form.falas.value = (n?.falas || []).join('\n');
    const base = n?.campos?.length ? n.campos : [{ r: 'Magia', v: '' }, { r: 'Afiliação', v: '' }, { r: 'Alinhamento', v: '' }, { r: 'Idade e origem', v: '' }, { r: 'Ponto fraco', v: '', segredo: true }];
    camposOl.replaceChildren(...base.map(linhaCampo));
    $('[data-npc-apagar]').hidden = !n;
    dlg.showModal();
    form.nome.focus();
  }
  raiz.addEventListener('click', (e) => {
    const b = e.target.closest('[data-editar]');
    if (b) abre(npcs.find((n) => n.id === b.dataset.editar));
  });
  $('[data-npc-novo]').addEventListener('click', () => abre(null));
  $$('[data-npc-fechar]').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const npc = {
      antigo: form.antigo.value || undefined,
      nome: form.nome.value, grupo: form.grupo.value, alcunha: form.alcunha.value, papel: form.papel.value,
      kanji: form.kanji.value, cor: form.cor.value, ordem: form.ordem.value,
      campos: $$('li', camposOl).map((li) => ({ r: li.querySelector('[name=cr]').value, v: li.querySelector('[name=cv]').value, segredo: li.querySelector('[name=cs]').checked })),
      falas: form.falas.value.split('\n').map((x) => x.trim()).filter(Boolean),
    };
    const btn = $('[data-npc-salvar]'); btn.disabled = true;
    try {
      const r = await api({ op: 'salvar', npc });
      dlg.close();
      await carrega();
      avisa(`${npc.nome} salvo.`);
      document.getElementById(`npc-${r.id}`)?.scrollIntoView({ block: 'center', behavior: calmo ? 'auto' : 'smooth' });
    } catch (x) { erro.textContent = x.message; erro.hidden = false; } finally { btn.disabled = false; }
  });

  $('[data-npc-apagar]').addEventListener('click', async () => {
    if (!editando) return;
    const b = $('[data-npc-apagar]');
    // segundo toque confirma (sem confirm() do navegador)
    if (b.dataset.certeza !== editando.id) { b.dataset.certeza = editando.id; b.textContent = `Apagar ${editando.nome} mesmo?`; return; }
    b.disabled = true;
    try { await api({ op: 'apagar', id: editando.id }); dlg.close(); await carrega(); avisa(`${editando.nome} apagado (uma cópia fica no adminLog do banco).`); }
    catch (x) { erro.textContent = x.message; erro.hidden = false; }
    finally { b.disabled = false; delete b.dataset.certeza; b.textContent = 'Apagar NPC'; }
  });

  /* ------------------------------------------------------------ importar / baixar */
  const imp = $('[data-npc-imp]');
  const impErro = $('[data-npc-imp-erro]');
  $('[data-npc-importar]').addEventListener('click', () => { impErro.hidden = true; $('[data-npc-imp-form]').reset(); imp.showModal(); });
  $('[data-npc-arq]').addEventListener('change', async (e) => { const f = e.target.files?.[0]; if (f) $('[data-npc-colar]').value = await f.text(); });
  $('[data-npc-imp-form]').addEventListener('submit', async (e) => {
    e.preventDefault();
    let lista;
    try { lista = JSON.parse($('[data-npc-colar]').value); } catch { impErro.textContent = 'Não é um JSON válido.'; impErro.hidden = false; return; }
    if (lista && !Array.isArray(lista) && Array.isArray(lista.npcs)) lista = lista.npcs;
    try { const r = await api({ op: 'importar', lista }); imp.close(); await carrega(); avisa(`${r.total} NPCs importados.`); }
    catch (x) { impErro.textContent = x.message; impErro.hidden = false; }
  });
  $('[data-npc-baixar]').addEventListener('click', () => {
    const limpo = npcs.map(({ atualizadoEm, ...n }) => n);
    const url = URL.createObjectURL(new Blob([JSON.stringify(limpo, null, 2)], { type: 'application/json' }));
    const a = el('a', { href: url, download: `npcs-staff-${new Date().toISOString().slice(0, 10)}.json` });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });

  carrega();
}
