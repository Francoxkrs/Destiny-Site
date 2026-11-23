// Filtro das páginas de consulta (Dúvidas e Comandos): esconde o que não bate e conta o que sobrou.
const norm = (t) => (t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function initFiltro(nome) {
  const input = document.querySelector('[data-filtro]');
  if (!input) return;
  const itens = Array.from(document.querySelectorAll('[data-filtro-item]')).map((el) => ({ el, t: norm(el.dataset.texto || el.textContent) }));
  const grupos = Array.from(document.querySelectorAll('[data-filtro-grupo]'));
  const conta = document.querySelector('[data-filtro-n]');
  const vazio = document.querySelector('[data-filtro-vazio]');
  let tempo = 0;
  const aplica = () => {
    const q = norm(input.value).split(/\s+/).filter(Boolean);
    let n = 0;
    for (const it of itens) {
      const ok = q.every((w) => it.t.includes(w));
      it.el.hidden = !ok;
      if (ok) n++;
    }
    for (const g of grupos) g.hidden = !g.querySelector('[data-filtro-item]:not([hidden])');
    if (conta) conta.textContent = q.length ? `${n} de ${itens.length} ${nome}` : '';
    if (vazio) vazio.hidden = n > 0;
    // as animações de rolagem recalculam as posições depois que a página encolheu
    clearTimeout(tempo);
    tempo = setTimeout(() => dispatchEvent(new Event('resize')), 120);
  };
  input.addEventListener('input', aplica);
  input.addEventListener('keydown', (e) => { if (e.key === 'Escape' && input.value) { input.value = ''; aplica(); } });
}
