/**
 * Árvores de habilidade das Classes de Mago, no formato que o portal desenha.
 *
 * Formato genérico (a frente das trilhas pode mandar árvores maiores neste mesmo formato):
 *   { id, nome, papel, cor, raiz: { nome, texto }, colunas, nos: [{ id, nome, texto, ramo, linha, coluna, requer: [ids], estagioMin?, apice?, estrela? }] }
 * `id` do nó é o mesmo que o bot grava em estado.trilhaClasse ("Ramo/0", "Ramo/1", "Ramo/2").
 * `linha` 1.. desce a partir da raiz; `coluna` 0.. vai da esquerda para a direita.
 *
 * Hoje as árvores vêm das trilhas atuais (classesMago no canon.js): 3 ramos de 3 nós.
 * Conteúdo provisório até a frente das trilhas entregar as árvores novas.
 */
import { classesMago, slugify } from './canon.js';

export const ESTAGIO_APICE = 3;
/** Pontos de Trilha por Estágio (bot: ESTAGIOS[].pontoTrilha): criação (9º), 7º, 5º e 3º. */
export const ESTAGIOS_COM_PONTO = [9, 7, 5, 3];

/** Cor de cada classe (aba e brilho dos nós). */
const CORES = {
  'Mago Arcano': '#9d8cff', 'Mago de Batalha': '#ff5a3c', 'Mago das Sombras': '#8b6fd6', 'Mago Balístico': '#f0b54a',
  'Mago Curandeiro': '#5fd39b', 'Mago do Caos': '#ff4f9a', 'Mago Conjurador': '#4fc6d6', 'Mago Artífice': '#d99a5b',
};

export const arvores = classesMago.map((c) => ({
  id: slugify(c.nome),
  nome: c.nome,
  papel: c.papel,
  conhecimento: c.conhecimento,
  cor: CORES[c.nome] ?? '#d9b56a',
  raiz: { nome: c.passiva[0], texto: c.passiva[1] },
  colunas: c.trilha.length,
  provisoria: true,
  nos: c.trilha.flatMap((r, coluna) => r.nos.map(([nome, texto], i) => ({
    id: `${r.ramo}/${i}`,
    nome, texto, ramo: r.ramo,
    linha: i + 1, coluna,
    requer: i > 0 ? [`${r.ramo}/${i - 1}`] : [],
    estagioMin: i === 2 ? ESTAGIO_APICE : null,
    apice: i === 2,
    estrela: Boolean(r.estrela && i === 2),
  }))),
}));

export const arvorePorClasse = (nome) => arvores.find((a) => a.nome === nome) ?? null;
