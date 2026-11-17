// Sessão do portal: pergunta ao servidor quem está logado e acende o cabeçalho.
// Sem a parte de servidor (prévia estática), fica no estado "Entrar".
const $ = (s) => document.querySelector(s);
const fmt = new Intl.NumberFormat('pt-BR');

export async function sessao() {
  if (window.__bdSessao !== undefined) return window.__bdSessao;
  let s = null;
  try {
    const r = await fetch('/api/sessao', { headers: { accept: 'application/json' }, credentials: 'same-origin' });
    if (r.ok && (r.headers.get('content-type') || '').includes('json')) s = (await r.json()).sessao ?? null;
  } catch { /* sem servidor: visitante */ }
  window.__bdSessao = s;
  return s;
}

sessao().then((s) => {
  document.documentElement.dataset.sessao = s ? 'sim' : 'nao';
  if (s) {
    $('[data-sessao-entrar]')?.setAttribute('hidden', '');
    const u = $('[data-sessao-user]');
    if (u) {
      u.hidden = false;
      $('[data-sessao-nome]').textContent = s.personagem?.nome || s.nome;
      $('[data-sessao-sub]').textContent = s.personagem ? `${s.personagem.estagio}º Estágio` : 'Sem ficha';
      const av = $('[data-sessao-av]');
      if (s.avatar) av.src = s.avatar; else av.remove();
    }
    const cp = $('[data-sessao-cp]');
    if (cp && typeof s.cp === 'number') { cp.hidden = false; $('[data-sessao-cp-n]').textContent = fmt.format(s.cp); }
  }
  document.dispatchEvent(new CustomEvent('bd:sessao', { detail: s }));
});
