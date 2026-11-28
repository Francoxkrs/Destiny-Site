// /feitico: prévia ao vivo da página do Grimório, rascunho no navegador, imagem e envio para o Conselho.
import { custoDe } from '../lib/feitico-regras.js';

const raiz = document.querySelector('[data-ef]');
if (raiz) iniciar(raiz);

function iniciar(raiz) {
  const dados = JSON.parse(raiz.querySelector('[data-dados]')?.textContent || '{}');
  const e = dados.escrita;
  const L = dados.limites;
  const form = raiz.querySelector('[data-form]');
  const P = (k) => raiz.querySelector(`[data-p="${k}"]`);
  const erroEl = raiz.querySelector('[data-erro]');
  const btn = raiz.querySelector('[data-enviar]');
  const TIPO_K = { Externalizado: '放', 'Reforço Corporal': '纏', 'Criação': '創', 'Conjuração': '召' };
  const FN_K = { Ataque: '攻', Defesa: '守', 'Criação': '創', Mobilidade: '駆', Barreira: '壁', Reforço: '強', Restauração: '癒', Enfraquecimento: '弱', Comunicação: '伝', Armadilha: '罠', Maldição: '呪', 'Anti-Maldição': '祓', Selamento: '封', Restrição: '縛', Ressurreição: '甦' };
  let arquivo = null;
  let urlImagem = null;

  const ler = (n) => form.elements.namedItem(n);
  const valor = (n) => (ler(n)?.value ?? '').trim();
  const tipo = () => form.querySelector('input[name="tipo"]:checked')?.value ?? '';
  const funcoes = () => [...form.querySelectorAll('input[name="funcao"]:checked')].map((x) => x.value);

  /* ---------- rascunho (só neste navegador; some quando manda) */
  const chave = dados.rascunho;
  const guardar = () => {
    if (!chave) return;
    try { localStorage.setItem(chave, JSON.stringify({ nome: valor('nome'), encantamento: valor('encantamento'), efeito: ler('efeito').value, duracao: valor('duracao'), alcance: valor('alcance'), tipo: tipo(), funcoes: funcoes(), sustentado: ler('sustentado').checked })); } catch { /* sem armazenamento */ }
  };
  const restaurar = () => {
    if (!chave) return;
    let r = null;
    try { r = JSON.parse(localStorage.getItem(chave) || 'null'); } catch { r = null; }
    if (!r) return;
    for (const k of ['nome', 'encantamento', 'efeito', 'duracao', 'alcance']) if (typeof r[k] === 'string' && ler(k)) ler(k).value = r[k];
    const t = form.querySelector(`input[name="tipo"][value="${CSS.escape(r.tipo || '')}"]:not(:disabled)`);
    if (t) t.checked = true;
    if (Array.isArray(r.funcoes) && r.funcoes.length) {
      form.querySelectorAll('input[name="funcao"]').forEach((x) => { x.checked = !x.disabled && r.funcoes.includes(x.value); });
      if (!funcoes().length) form.querySelector('input[name="funcao"][value="Ataque"]').checked = true;
    }
    ler('sustentado').checked = Boolean(r.sustentado);
  };
  const apagarRascunho = () => { if (chave) try { localStorage.removeItem(chave); } catch { /* nada */ } };

  /* ---------- prévia */
  const selo = (k, t) => { const s = document.createElement('span'); s.className = 'ef-selo'; s.innerHTML = '<i></i><b></b>'; s.firstChild.textContent = k; s.lastChild.textContent = t; return s; };
  function desenhar() {
    const nome = valor('nome');
    P('nome').textContent = nome || 'Feitiço sem nome';
    P('nome').classList.toggle('is-vazio', !nome);
    const enc = valor('encantamento');
    P('encantamento').hidden = !enc;
    P('encantamento').textContent = enc ? `“${enc}”` : '';
    const ef = ler('efeito').value.trim();
    P('efeito').textContent = ef || 'O efeito aparece aqui enquanto você escreve.';
    P('efeito').classList.toggle('is-vazio', !ef);
    P('duracao').textContent = valor('duracao') || (ler('sustentado').checked ? 'Sustentado' : 'Instantânea');
    P('alcance').textContent = valor('alcance') || (e ? `${e.nivel.alcance} m` : '—');
    const t = tipo();
    const fs = funcoes();
    P('kanji').textContent = TIPO_K[t] ?? '術';
    const selos = P('selos');
    selos.replaceChildren(...[t && selo(TIPO_K[t] ?? '術', t), ...fs.map((f) => selo(FN_K[f] ?? '術', f)), ler('sustentado').checked && selo('続', 'Sustentado')].filter(Boolean));
    const c = e ? custoDe(e.custo, t, fs) : null;
    if (c) {
      P('custo').textContent = String(c.custo);
      P('descontos').textContent = c.descontos.length ? `${c.base} de base · ${c.descontos.map(([n, v]) => `${n} −${v}%`).join(' · ')}${c.desconto >= (e.custo.max ?? 50) ? ' · teto' : ''}${c.instabilidade ? ' · Mana Indomável +10%' : ''}` : `${c.base} de base`;
    }
    for (const k of ['nome', 'encantamento', 'efeito']) {
      const n = raiz.querySelector(`[data-conta="${k}"]`);
      if (n) n.textContent = `${(ler(k).value || '').length} / ${L[k]}`;
    }
    const min = raiz.querySelector('.ef-min');
    const falta = L.efeitoMin - ef.length;
    min.textContent = falta > 0 ? `Faltam ${falta} caracteres.` : '';
    erroEl.textContent = '';
  }

  /* ---------- Funções: no Costurado, no máximo duas */
  form.querySelectorAll('input[name="funcao"][type="checkbox"]').forEach((x) => x.addEventListener('change', () => {
    const marcadas = funcoes();
    if (marcadas.length > 2) x.checked = false;
    if (!funcoes().length) x.checked = true;
  }));

  /* ---------- imagem */
  const drop = raiz.querySelector('[data-drop]');
  const inp = raiz.querySelector('[data-imagem]');
  const vazio = drop.querySelector('.ef-drop__vazio');
  const cheio = drop.querySelector('.ef-drop__cheio');
  function usarArquivo(f) {
    if (urlImagem) URL.revokeObjectURL(urlImagem);
    arquivo = null; urlImagem = null;
    if (f) {
      if (!/^image\/(png|jpeg|webp|gif)$/.test(f.type)) { erroEl.textContent = 'Mande uma imagem PNG, JPG, WEBP ou GIF.'; inp.value = ''; f = null; }
      else if (f.size > dados.maxImagem) { erroEl.textContent = 'A imagem passa de 3 MB. Mande uma menor (ou um GIF mais curto).'; inp.value = ''; f = null; }
    }
    if (f) { arquivo = f; urlImagem = URL.createObjectURL(f); }
    vazio.hidden = Boolean(arquivo); cheio.hidden = !arquivo;
    drop.querySelector('[data-drop-img]').src = urlImagem ?? '';
    drop.querySelector('[data-drop-nome]').textContent = arquivo ? `${arquivo.name} · ${(arquivo.size / 1024 / 1024).toFixed(1).replace('.', ',')} MB` : '';
    P('imagem').hidden = !arquivo; P('imagem').src = urlImagem ?? '';
    P('kanji').hidden = Boolean(arquivo);
  }
  inp.addEventListener('change', () => usarArquivo(inp.files?.[0] ?? null));
  drop.querySelector('[data-tirar]').addEventListener('click', (ev) => { ev.preventDefault(); inp.value = ''; usarArquivo(null); });
  ['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, (ev) => { ev.preventDefault(); drop.classList.add('is-sobre'); }));
  ['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, () => drop.classList.remove('is-sobre')));
  drop.addEventListener('drop', (ev) => { ev.preventDefault(); const f = ev.dataTransfer?.files?.[0]; if (f) usarArquivo(f); });

  /* ---------- reescrever um recusado: o nome volta para o manuscrito */
  raiz.querySelectorAll('[data-reescrever]').forEach((b) => b.addEventListener('click', () => {
    ler('nome').value = b.dataset.reescrever; desenhar(); guardar();
    ler('efeito').focus({ preventScroll: true });
    form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }));

  /* ---------- envio */
  const STATUS = { novo: 'Na fila do bot', processando: 'O bot está postando', enviado: 'No fórum do Conselho', erro: 'Não foi' };
  const lista = raiz.querySelector('[data-pedidos]');
  const linkDiscord = (id) => (id && dados.guildId ? `https://discord.com/channels/${dados.guildId}/${id}` : null);
  function pintarPedidos(ps) {
    if (!ps.length) return;
    lista.replaceChildren(...ps.map((p) => {
      const li = document.createElement('li');
      li.dataset.s = p.status;
      const b = document.createElement('b'); b.textContent = p.nome;
      const st = document.createElement('span'); st.className = 'ef-st'; st.textContent = STATUS[p.status] ?? p.status;
      const sm = document.createElement('small');
      sm.textContent = new Date(p.criadoEm).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) + (p.erro ? ` · ${p.erro}` : '');
      li.append(b, st, sm);
      const u = linkDiscord(p.threadId);
      if (u) { const a = document.createElement('a'); a.href = u; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Abrir no Discord'; li.append(a); }
      return li;
    }));
  }
  let espera = null;
  function acompanhar(id, tentativas = 0) {
    clearTimeout(espera);
    espera = setTimeout(async () => {
      try {
        const r = await fetch('/api/feitico', { credentials: 'same-origin' });
        const c = await r.json();
        if (r.ok && Array.isArray(c.pedidos)) {
          pintarPedidos(c.pedidos);
          const p = c.pedidos.find((x) => x.id === id);
          if (p?.status === 'enviado') { estado(`Postado no fórum do Conselho Mágico.${p.erro ? ` ${p.erro}` : ''}`, linkDiscord(p.threadId)); return; }
          if (p?.status === 'erro') { estado(`O bot não postou: ${p.erro}`, null, true); return; }
        }
      } catch { /* tenta de novo */ }
      if (tentativas < 40) acompanhar(id, tentativas + 1);
      else estado('Mandado. O bot está demorando para postar; a lista abaixo atualiza quando você voltar.');
    }, tentativas < 6 ? 2500 : 6000);
  }
  function estado(texto, link = null, erro = false) {
    const caixa = raiz.querySelector('[data-estado]') ?? Object.assign(document.createElement('p'), { className: 'ef-estado' });
    caixa.dataset.estado = '';
    caixa.classList.toggle('is-erro', erro);
    caixa.replaceChildren(document.createTextNode(texto));
    if (link) { const a = document.createElement('a'); a.href = link; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Abrir no Discord'; caixa.append(' ', a); }
    if (!caixa.isConnected) raiz.querySelector('.ef-enviar').prepend(caixa);
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!dados.pode) return;
    const t = tipo(); const fs = funcoes(); const ef = ler('efeito').value.trim();
    if (!valor('nome')) { erroEl.textContent = 'O feitiço precisa de um nome.'; ler('nome').focus(); return; }
    if (!t || !fs.length) { erroEl.textContent = 'Escolha o Tipo e a Função.'; return; }
    if (ef.length < L.efeitoMin) { erroEl.textContent = `Descreva melhor o efeito (${L.efeitoMin} caracteres ou mais).`; ler('efeito').focus(); return; }
    const fd = new FormData();
    for (const k of ['nome', 'encantamento', 'efeito', 'duracao', 'alcance']) fd.set(k, ler(k).value);
    fd.set('tipo', t); fd.set('funcao', fs[0]); if (fs[1]) fd.set('funcao2', fs[1]);
    if (ler('sustentado').checked) fd.set('sustentado', '1');
    if (arquivo) fd.set('imagem', arquivo, arquivo.name);
    btn.disabled = true; btn.classList.add('is-indo');
    try {
      const r = await fetch('/api/feitico', { method: 'POST', credentials: 'same-origin', body: fd });
      const c = await r.json().catch(() => ({}));
      if (!r.ok) { erroEl.textContent = c.erro || 'Não deu certo. Tente de novo.'; btn.disabled = false; btn.classList.remove('is-indo'); return; }
      apagarRascunho();
      raiz.classList.add('is-selado');
      estado('Mandado. O bot posta no fórum do Conselho em alguns segundos...');
      acompanhar(c.id);
      btn.querySelector('span').textContent = 'Mandado';
      const novo = Object.assign(document.createElement('button'), { type: 'button', className: 'btn ef-btn ef-btn--outro', textContent: 'Escrever outro' });
      novo.addEventListener('click', () => location.reload());
      btn.after(novo);
    } catch {
      erroEl.textContent = 'Sem conexão com o site. O seu texto continua aqui: tente de novo.';
      btn.disabled = false; btn.classList.remove('is-indo');
    }
  });

  restaurar();
  form.addEventListener('input', () => { desenhar(); guardar(); });
  form.addEventListener('change', () => { desenhar(); guardar(); });
  desenhar();
}
