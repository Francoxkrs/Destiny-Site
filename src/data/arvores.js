/**
 * Árvores de Trilha v2 (frente das trilhas, 17/11/2026). Fonte: src/data/trilhas/*.json,
 * cópia de /mnt/project-files/black-destiny/trilhas-v2/ (o bot lê os mesmos JSON). Formato em tipos.ts de lá.
 * Raiz grátis, 3 ramos de 7 nós e 3 Elos: 24 habilidades. Artífice e Sombras mantêm os 9 nós antigos dentro das 24.
 * Ao receber JSON novo da frente das trilhas, troque os arquivos de src/data/trilhas/ e rode o build.
 */
import regras from './trilhas/regras.json';
import arcano from './trilhas/arcano.json';
import batalha from './trilhas/batalha.json';
import balistico from './trilhas/balistico.json';
import curandeiro from './trilhas/curandeiro.json';
import caos from './trilhas/caos.json';
import conjurador from './trilhas/conjurador.json';
import artifice from './trilhas/artifice.json';
import sombras from './trilhas/sombras.json';
import { classesMago, slugify } from './canon.js';

export { regras };

/** Cor de cada classe: brilho dos nós e da aba. Tudo dentro da paleta de tinta (vermelho, osso, violeta, ciano frio). */
const CORES = {
  arcano: '#9d8cff', batalha: '#ff3b2e', balistico: '#f0b54a', curandeiro: '#5fd39b',
  caos: '#ff4f9a', conjurador: '#4fc6d6', artifice: '#d99a5b', sombras: '#8b6fd6',
};
const KANJI = { arcano: '魔', batalha: '戦', balistico: '弾', curandeiro: '癒', caos: '乱', conjurador: '召', artifice: '鍛', sombras: '影' };

export const graus = Object.fromEntries(regras.graus.map((g) => [g.grau, g]));

export const arvores = [arcano, batalha, balistico, curandeiro, caos, conjurador, artifice, sombras].map((t) => {
  const canon = classesMago.find((c) => c.nome === t.classe);
  const cols = t.nos.map((n) => n.pos[0]);
  const linhas = t.nos.map((n) => n.pos[1]);
  return {
    id: t.slug,
    nome: t.classe,
    papel: t.papel,
    conhecimento: canon?.conhecimento ?? null,
    img: `/img/classes/${slugify(t.classe)}.webp`,
    cor: CORES[t.slug] ?? '#ff3b2e',
    kanji: KANJI[t.slug] ?? '道',
    raiz: t.raiz,
    ramos: t.ramos,
    intocada: t.nos.length < 24,
    colMin: Math.min(...cols),
    colMax: Math.max(...cols),
    linhaMax: Math.max(...linhas),
    nos: t.nos.map((n) => ({ ...n, requer: n.requer ?? [] })),
  };
});

export const arvorePorClasse = (nome) => arvores.find((a) => a.nome === nome) ?? null;

/** Ids antigos ("Ramo/0") que o bot ainda grava antes da v2 → ids novos. */
export function migrarIds(arvore, ids = []) {
  const porLegado = Object.fromEntries(arvore.nos.filter((n) => n.legado).map((n) => [n.legado, n.id]));
  return [...new Set(ids.map((id) => porLegado[id] ?? id).filter((id) => arvore.nos.some((n) => n.id === id)))];
}
