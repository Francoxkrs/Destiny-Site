/**
 * Árvore das Técnicas de Mana (/arvores/#tecnicas).
 * As técnicas, Estágios, Controles e textos são os do Cânone (canon.js) e do bot (canon/progressao.ts: TECNICAS).
 * Regra de verdade: só "requer" (requerTecnica no bot) trava uma técnica atrás de outra.
 * "vem" é só o desenho: a linha tracejada que mostra o caminho natural; o que vale é Estágio e Controle.
 */
import { tecnicas, tecnicasDiamond, runas, tecnicasCacada, tecnicasProibidas } from './canon.js';

const porNome = Object.fromEntries([...tecnicas, ...tecnicasDiamond.lista, ...runas.lista, ...tecnicasCacada.lista, ...tecnicasProibidas.lista].map((t) => [t.nome, t]));
const n = (s) => Number.parseInt(s, 10);

export const grupos = [
  { id: 'fluxo', nome: 'Fluxo', k: '流', texto: 'As Técnicas de Mana de todo reino: sentir, vestir, espalhar e fundir a mana.' },
  { id: 'diamond', nome: 'Diamond', k: '晶', texto: 'Técnicas de quem cresceu na terra seca. Estrangeiros não aprendem.' },
  { id: 'runa', nome: 'Runas', k: '陣', texto: 'Partem da Matriz Rúnica. Quem tem o Milagre Insignificância aprende sem o requisito de Estágio.' },
  { id: 'assimilacao', nome: 'Assimilação', k: '獣', texto: 'Só com uma criatura em Vínculo Elo. 6 Treinos de Técnica ao lado dela.' },
  { id: 'cacada', nome: 'Caçada', k: '狩', texto: 'De quem caça as criaturas que aparecem nos chats de RP.' },
  { id: 'proibida', nome: 'Proibidas', k: '禁', texto: 'Só no Fosso. Não há mentor: a Staff dá a Técnica pela cena.' },
];

// x: posição na largura (0 a 100). O Estágio dá a altura.
const base = [
  { nome: 'Respiração de Mana', k: '息', grupo: 'fluxo', x: 50, raiz: true },
  { nome: 'Percepção de Mana', k: '感', grupo: 'fluxo', x: 50, vem: ['Respiração de Mana'] },
  { nome: 'Pele de Mana', k: '膚', grupo: 'fluxo', x: 50, vem: ['Percepção de Mana'] },
  { nome: 'Matriz Rúnica', k: '陣', grupo: 'fluxo', x: 50, vem: ['Pele de Mana'] },
  { nome: 'Método de Mana', k: '法', grupo: 'fluxo', x: 50, vem: ['Matriz Rúnica'] },
  { nome: 'Zona de Mana', k: '域', grupo: 'fluxo', x: 50, vem: ['Método de Mana'] },
  { nome: 'Forma Mágica', k: '化', grupo: 'fluxo', x: 50, vem: ['Zona de Mana'] },
  { nome: 'Coração de Mana', k: '心', grupo: 'fluxo', x: 50, vem: ['Zona de Mana'] },
  { nome: 'Coroa de Mana', k: '冠', grupo: 'fluxo', x: 50, requer: 'Forma Mágica', apice: true },
  { nome: 'Supressão de Mana', k: '隠', grupo: 'fluxo', x: 44, baixo: true, vem: ['Respiração de Mana'] },
  { nome: 'Fio de Mana', k: '糸', grupo: 'fluxo', x: 56, baixo: true, vem: ['Percepção de Mana'] },
  { nome: 'Pulso', k: '衝', grupo: 'fluxo', x: 45, baixo: true, vem: ['Pele de Mana'] },
  { nome: 'Ponto de Mana', k: '点', grupo: 'fluxo', x: 45, baixo: true, vem: ['Pulso'] },
  { nome: 'Leitura do Fluxo', k: '観', grupo: 'fluxo', x: 45, baixo: true, vem: ['Ponto de Mana'] },
  { nome: 'Percepção Profunda', k: '深', grupo: 'fluxo', x: 55, baixo: true, requer: 'Percepção de Mana', avancada: true },
  { nome: 'Manto de Mana', k: '衣', grupo: 'fluxo', x: 55, baixo: true, requer: 'Pele de Mana', avancada: true },
  { nome: 'Método Profundo', k: '泉', grupo: 'fluxo', x: 55, baixo: true, requer: 'Método de Mana', avancada: true },
  { nome: 'Domínio de Zona', k: '界', grupo: 'fluxo', x: 55, baixo: true, requer: 'Zona de Mana', avancada: true },

  { nome: 'Corpo Seco', k: '枯', grupo: 'diamond', x: 31, vem: ['Respiração de Mana'], quem: 'Só Plebe, ou quem viveu 1 mês real nos Veios.', social: ['Plebe'] },
  { nome: 'Eco de Veio', k: '響', grupo: 'diamond', x: 24, vem: ['Corpo Seco'] },
  { nome: 'Passo Cintilante', k: '閃', grupo: 'diamond', x: 38, vem: ['Corpo Seco'] },
  { nome: 'Couraça de Pó', k: '鎧', grupo: 'diamond', x: 31, vem: ['Eco de Veio', 'Passo Cintilante'] },
  { nome: 'Sede de Cristal', k: '渇', grupo: 'diamond', x: 31, vem: ['Corpo Seco'] },
  { nome: 'Olho de Lapidário', k: '眼', grupo: 'diamond', x: 20, vem: ['Sede de Cristal'] },
  { nome: 'Sangue Cristalino', k: '血', grupo: 'diamond', x: 31, vem: ['Couraça de Pó'] },
  { nome: 'Eco Profundo', k: '谺', grupo: 'diamond', x: 24, requer: 'Eco de Veio', avancada: true },
  { nome: 'Rastro Cintilante', k: '軌', grupo: 'diamond', x: 38, requer: 'Passo Cintilante', avancada: true },
  { nome: 'Couraça de Cristal', k: '晶', grupo: 'diamond', x: 28, requer: 'Couraça de Pó', avancada: true },

  { nome: 'Leitura Rúnica', k: '読', grupo: 'runa', x: 74, vem: ['Percepção de Mana'] },
  { nome: 'Runa Condicional', k: '条', grupo: 'runa', x: 72, requer: 'Matriz Rúnica' },
  { nome: 'Inscrição', k: '刻', grupo: 'runa', x: 66, requer: 'Matriz Rúnica', vem: ['Runa Condicional'] },
  { nome: 'Runa em Cadeia', k: '鎖', grupo: 'runa', x: 82, requer: 'Matriz Rúnica', vem: ['Runa Condicional'] },
  { nome: 'Selo Rúnico', k: '封', grupo: 'runa', x: 68, requer: 'Matriz Rúnica', vem: ['Inscrição'] },
  { nome: 'Voto de Cristal', k: '誓', grupo: 'runa', x: 84, requer: 'Matriz Rúnica', vem: ['Runa em Cadeia'] },
  { nome: 'Matriz Expandida', k: '拡', grupo: 'runa', x: 90, requer: 'Matriz Rúnica', avancada: true },
  { nome: 'Runa de Disco', k: '盤', grupo: 'runa', x: 90, requer: 'Matriz Rúnica', vem: ['Runa Condicional'] },
  { nome: 'Círculo Rúnico', k: '環', grupo: 'runa', x: 76, requer: 'Matriz Rúnica', vem: ['Inscrição'] },

  { nome: 'Assimilação Parcial', k: '獣', grupo: 'assimilacao', x: 7, estagio: 6, controle: 30, elo: true, vem: ['Pele de Mana'],
    texto: 'Uma parte da criatura no corpo (asas, garras, olhos, escamas): +2 Acréscimos num atributo físico ligado a ela e a Habilidade Natural. 15 de Mana por turno, até 5 turnos.' },
  { nome: 'Assimilação Total', k: '融', grupo: 'assimilacao', x: 7, estagio: 3, controle: 60, elo: true, requer: 'Assimilação Parcial',
    texto: 'O corpo inteiro vira um híbrido com a criatura: usa a classificação dela onde for maior e ganha +1 nos feitiços coerentes. 40 de Mana por turno, até 5 turnos.', apice: true },

  { nome: 'Faro de Besta', k: '嗅', grupo: 'cacada', x: 92, vem: ['Respiração de Mana'] },
  { nome: 'Ritmo de Caça', k: '狩', grupo: 'cacada', x: 92, vem: ['Faro de Besta'] },
  { nome: 'Queima de Vida', k: '燃', grupo: 'proibida', x: 96, proibida: true },
  { nome: 'Sorver', k: '吸', grupo: 'proibida', x: 96, proibida: true, vem: ['Queima de Vida'] },
];

export const tecnicasArvore = base.map((t) => {
  const c = porNome[t.nome];
  return {
    id: t.nome.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    nome: t.nome, k: t.k, grupo: t.grupo, x: t.x, raiz: Boolean(t.raiz), apice: Boolean(t.apice), elo: Boolean(t.elo),
    estagio: t.estagio ?? n(c.estagio), controle: t.controle ?? n(c.controle),
    texto: t.texto ?? c.texto, quem: t.quem ?? null, social: t.social ?? null, requer: t.requer ?? c?.requer ?? null, vem: t.vem ?? [],
    baixo: Boolean(t.baixo), avancada: Boolean(t.avancada), proibida: Boolean(t.proibida),
    treinos: t.grupo === 'assimilacao' ? '6 Treinos de Técnica ao lado da criatura'
      : t.proibida ? 'Sem mentor: a Staff dá pela cena, no Fosso'
      : t.avancada ? `Avançada de ${t.requer}: 6 Treinos com mentor, ou 10 sozinho` : '5 Treinos de Técnica com mentor, ou 8 sozinho',
  };
});

export const regrasTecnicas = [
  'Cada técnica pede um Estágio e um Controle mínimos.',
  'Aprende com Treinos de Técnica: 5 com um mentor ou 8 sozinho, 1 por ciclo de 24 horas, ação de 800 caracteres.',
  'Elfos e quem tem a Anomalia Mágica aprendem com metade dos treinos.',
  'As Avançadas partem de uma Técnica que você já domina e pedem 6 treinos com mentor ou 10 sozinho.',
  'As Proibidas só se aprendem no Fosso, numa cena: a Staff dá a Técnica direto.',
  'Linha vermelha com cadeado: precisa dominar a técnica de antes (o bot trava). Linha tracejada: só a ordem dos Estágios.',
];
