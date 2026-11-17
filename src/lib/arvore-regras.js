// Regras da árvore, puras: usadas pelo planejador no navegador e pela gravação no servidor.
// Espelham functions/trilha/regras.ts do bot (pontosDeTrilha, bloqueioNo).
import { ESTAGIOS_COM_PONTO } from '../data/arvores.js';

/** Pontos ganhos até o Estágio (Estágios descem: o 9º é o primeiro). */
export const pontosDeTrilha = (estagio) => ESTAGIOS_COM_PONTO.filter((e) => estagio <= e).length;
export const proximoPonto = (estagio) => ESTAGIOS_COM_PONTO.filter((e) => e < estagio).sort((a, b) => b - a)[0] ?? null;

/**
 * Pode pegar o nó? Devolve null quando pode, ou o motivo.
 * @param {{ nos: any[] }} arvore  @param {number} estagio  @param {string[]} tem  @param {string} id
 */
export function bloqueio(arvore, estagio, tem, id, pontos = pontosDeTrilha(estagio)) {
  const no = arvore.nos.find((n) => n.id === id);
  if (!no) return 'Esse nó não é desta árvore.';
  if (tem.includes(id)) return 'Você já tem este nó.';
  const falta = no.requer.find((r) => !tem.includes(r));
  if (falta) { const f = arvore.nos.find((n) => n.id === falta); return `Pegue antes ${f?.nome ?? falta}.`; }
  if (no.estagioMin && estagio > no.estagioMin) return `Exige o ${no.estagioMin}º Estágio.`;
  const gastos = tem.filter((t) => arvore.nos.some((n) => n.id === t)).length;
  if (gastos >= pontos) { const p = proximoPonto(estagio); return `Sem Pontos de Trilha livres.${p ? ` O próximo vem no ${p}º Estágio.` : ''}`; }
  return null;
}

/** Estado de cada nó para desenhar: 'tem' | 'livre' | 'bloqueado'. */
export function estados(arvore, estagio, tem, pontos) {
  return Object.fromEntries(arvore.nos.map((n) => [n.id, tem.includes(n.id) ? 'tem' : bloqueio(arvore, estagio, tem, n.id, pontos) ? 'bloqueado' : 'livre']));
}
