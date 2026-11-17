/**
 * Árvore das Técnicas de Mana (/arvores/?arvore=tecnicas).
 * As técnicas, Estágios, Controles e textos são os do Cânone (canon.js) e do bot (canon/progressao.ts: TECNICAS).
 * Regra de verdade: só "requer" (requerTecnica no bot) trava uma técnica atrás de outra.
 * "vem" é só o desenho: a linha tracejada que mostra o caminho natural; o que vale é Estágio e Controle.
 */
import { tecnicas, tecnicasDiamond, runas } from './canon.js';

const porNome = Object.fromEntries([...tecnicas, ...tecnicasDiamond.lista, ...runas.lista].map((t) => [t.nome, t]));
const n = (s) => Number.parseInt(s, 10);

export const grupos = [
  { id: 'fluxo', nome: 'Fluxo', k: '流', texto: 'As Técnicas de Mana de todo reino: sentir, vestir, espalhar e fundir a mana.' },
  { id: 'diamond', nome: 'Diamond', k: '晶', texto: 'Técnicas de quem cresceu na terra seca. Estrangeiros não aprendem.' },
  { id: 'runa', nome: 'Runas', k: '陣', texto: 'Partem da Matriz Rúnica. Quem tem o Milagre Insignificância aprende sem o requisito de Estágio.' },
  { id: 'assimilacao', nome: 'Assimilação', k: '獣', texto: 'Só com uma criatura em Vínculo Elo. 6 Treinos de Técnica ao lado dela.' },
];

// x: posição na largura (0 a 100). O Estágio dá a altura.
const base = [
  { nome: 'Respiração de Mana', k: '息', grupo: 'fluxo', x: 50, raiz: true },
  { nome: 'Percepção de Mana', k: '感', grupo: 'fluxo', x: 50, vem: ['Respiração de Mana'] },
  { nome: 'Pele de Mana', k: '膚', grupo: 'fluxo', x: 50, vem: ['Percepção de Mana'] },
  { nome: 'Matriz Rúnica', k: '陣', grupo: 'fluxo', x: 50, vem: ['Pele de Mana'] },
  { nome: 'Método de Mana', k: '法', grupo: 'fluxo', x: 50, vem: ['Matriz Rúnica'] },
  { nome: 'Zona de Mana', k: '域', grupo: 'fluxo', x: 50, vem: ['Método de Mana'] },
  { nome: 'Forma Mágica', k: '化', grupo: 'fluxo', x: 50, vem: ['Zona de Mana'], apice: true },

  { nome: 'Corpo Seco', k: '枯', grupo: 'diamond', x: 31, vem: ['Respiração de Mana'], quem: 'Só Plebe, ou quem viveu 1 mês real nos Veios.', social: ['Plebe'] },
  { nome: 'Eco de Veio', k: '響', grupo: 'diamond', x: 24, vem: ['Corpo Seco'] },
  { nome: 'Passo Cintilante', k: '閃', grupo: 'diamond', x: 38, vem: ['Corpo Seco'] },
  { nome: 'Couraça de Pó', k: '鎧', grupo: 'diamond', x: 31, vem: ['Eco de Veio', 'Passo Cintilante'] },

  { nome: 'Leitura Rúnica', k: '読', grupo: 'runa', x: 74, vem: ['Percepção de Mana'] },
  { nome: 'Runa Condicional', k: '条', grupo: 'runa', x: 72, requer: 'Matriz Rúnica' },
  { nome: 'Inscrição', k: '刻', grupo: 'runa', x: 66, requer: 'Matriz Rúnica', vem: ['Runa Condicional'] },
  { nome: 'Runa em Cadeia', k: '鎖', grupo: 'runa', x: 82, requer: 'Matriz Rúnica', vem: ['Runa Condicional'] },
  { nome: 'Selo Rúnico', k: '封', grupo: 'runa', x: 68, requer: 'Matriz Rúnica', vem: ['Inscrição'] },
  { nome: 'Voto de Cristal', k: '誓', grupo: 'runa', x: 84, requer: 'Matriz Rúnica', vem: ['Runa em Cadeia'] },

  { nome: 'Assimilação Parcial', k: '獣', grupo: 'assimilacao', x: 7, estagio: 6, controle: 30, elo: true, vem: ['Pele de Mana'],
    texto: 'Uma parte da criatura no corpo (asas, garras, olhos, escamas): +2 Acréscimos num atributo físico ligado a ela e a Habilidade Natural. 15 de Mana por turno, até 5 turnos.' },
  { nome: 'Assimilação Total', k: '融', grupo: 'assimilacao', x: 7, estagio: 3, controle: 60, elo: true, requer: 'Assimilação Parcial',
    texto: 'O corpo inteiro vira um híbrido com a criatura: usa a classificação dela onde for maior e ganha +1 nos feitiços coerentes. 40 de Mana por turno, até 5 turnos.', apice: true },
];

export const tecnicasArvore = base.map((t) => {
  const c = porNome[t.nome];
  return {
    id: t.nome.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    nome: t.nome, k: t.k, grupo: t.grupo, x: t.x, raiz: Boolean(t.raiz), apice: Boolean(t.apice), elo: Boolean(t.elo),
    estagio: t.estagio ?? n(c.estagio), controle: t.controle ?? n(c.controle),
    texto: t.texto ?? c.texto, quem: t.quem ?? null, social: t.social ?? null, requer: t.requer ?? null, vem: t.vem ?? [],
    treinos: t.grupo === 'assimilacao' ? '6 Treinos de Técnica ao lado da criatura' : '5 Treinos de Técnica com mentor, ou 8 sozinho',
  };
});

export const regrasTecnicas = [
  'Cada técnica pede um Estágio e um Controle mínimos.',
  'Aprende com Treinos de Técnica: 5 com um mentor ou 8 sozinho, 1 por ciclo de 24 horas, ação de 800 caracteres.',
  'Elfos e quem tem a Anomalia Mágica aprendem com metade dos treinos.',
  'Linha cheia: precisa dominar a técnica de antes. Linha tracejada: só o caminho natural.',
];
