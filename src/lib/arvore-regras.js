// Regras da árvore v2, puras: usadas pelo planejador no navegador e pela gravação no servidor.
// Espelham `bloqueio` e `temApice` de trilhas-v2/tipos.ts (a mesma regra do /trilha pegar no bot).
import { regras } from '../data/arvores.js';

/** Pontos de Trilha somados até o Estágio (Estágios descem: o 9º é a criação). Feitos de RP somam à parte. */
export function pontosDeTrilha(estagio, feitos = 0) {
  const linha = regras.pontosPorEstagio.filter((p) => p.estagio >= estagio).sort((a, b) => a.estagio - b.estagio)[0];
  return (linha?.total ?? 0) + Math.min(feitos, regras.pontosDeFeito?.max ?? 2);
}

/** Próximo Estágio que dá ponto e quanto dá. */
export function proximoPonto(estagio) {
  const p = regras.pontosPorEstagio.filter((x) => x.estagio < estagio).sort((a, b) => b.estagio - a.estagio)[0];
  return p ? { estagio: p.estagio, ganha: p.ganha } : null;
}

export const gastos = (arvore, tem) => arvore.nos.filter((n) => tem.includes(n.id)).reduce((a, n) => a + n.custo, 0);

/** Pode pegar? null quando pode, ou o motivo (mesmo texto do bot). */
export function bloqueio(arvore, pontosTotais, estagio, tem, id) {
  const n = arvore.nos.find((x) => x.id === id);
  if (!n) return 'Esse nó não é da sua classe.';
  if (tem.includes(id)) return `Você já tem ${n.nome}.`;
  if (estagio > n.estagioMin) return `${n.nome} exige o ${n.estagioMin}º Estágio.`;
  const livres = pontosTotais - gastos(arvore, tem);
  if (livres < n.custo) return `Faltam Pontos de Trilha (${n.nome} custa ${n.custo}, livres: ${livres}).`;
  if (n.requer.length && !n.requer.some((alt) => alt.every((r) => tem.includes(r)))) {
    const nome = (r) => arvore.nos.find((x) => x.id === r)?.nome ?? r;
    return `Antes: ${n.requer.map((alt) => alt.map(nome).join(' + ')).join(' ou ')}.`;
  }
  return null;
}

export const temApice = (arvore, tem) => arvore.nos.some((n) => n.grau === 5 && tem.includes(n.id));

/** Estado de cada nó para desenhar: 'tem' | 'livre' | 'bloqueado'. */
export function estados(arvore, pontosTotais, estagio, tem) {
  return Object.fromEntries(arvore.nos.map((n) => [n.id, tem.includes(n.id) ? 'tem' : bloqueio(arvore, pontosTotais, estagio, tem, n.id) ? 'bloqueado' : 'livre']));
}
