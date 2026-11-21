/**
 * Ficha no portal.
 *
 * O bot é a fonte das regras: sempre que um personagem muda, ele grava uma "foto" já calculada
 * da ficha na coleção `fichasWeb` (um documento por servidor + jogador). O site só lê essa foto,
 * então nunca mostra um número diferente do /ficha. O contrato está abaixo (FichaWeb, versão 1).
 *
 * @typedef {{ nome: string, indice: number, teto: number, acrescimos: number, treino: { feitos: number, precisa: number | null } }} FisicoWeb
 * @typedef {{
 *   versao: 1, guildId: string, userId: string, atualizadoEm: string, numero?: number,
 *   nome: string, sobrenome?: string, epiteto?: string, imagem?: string | null, cor?: string | null,
 *   raca: string, familia: string, classeSocial: string, regiao: string, origem?: string,
 *   classeMago: string, magia: string, magiaRaridade?: string, grimorio: string, milagres: string[], patente?: string | null,
 *   estagio: number, pe: number, controle: number,
 *   proximo: { estagio: number, pe: number, controle: number, cristais: { branco: number, negro: number, dourado: number } } | null,
 *   mana: { atual: number, max: number, regenHora?: number, em?: string | Date }, reserva: number, poder: number,
 *   fisicos: FisicoWeb[],
 *   moedas: { yuls: number, meritos: number, antimeritos: number, cristais: { branco: number, negro: number, dourado: number } },
 *   trilha: { versao?: 2, pontos: number, gastos: number, livres: number, feitos?: number, nos: string[] },  // versao 2 = o bot já usa as árvores v2 (ids "classe.ramo.no")
 *   conhecimentos: string[], tracos: string[], tecnicas: string[],
 *   feiticos: { nome: string, tipo?: string, estagio?: number, imagem?: string | null }[],
 *   historia: { vidaPassada?: string, renascimento?: string, personalidade?: string },
 *   // opcionais (o site mostra o que vier; sem eles, mostra o padrão da ficha do bot)
 *   profissao?: string | null, riqueza?: string, racasHibrido?: string[], feiticosTotal?: number,
 *   ferimentos?: { pior: 0 | 1 | 2 | 3 | 4, desnutrido?: boolean, casas: { grau: 1 | 2 | 3 | 4, ocupada: boolean, fome?: boolean }[] },
 *   treinosLivres?: { fisico: [number, number], magico: [number, number], controle: [number, number], tecnica: [number, number] },
 * }} FichaWeb
 */
import { banco } from './db.js';
import { env } from './env.js';

/** Ficha de exemplo: mostrada a quem não entrou e na prévia sem banco. Os números seguem as regras atuais do bot. */
/** @type {FichaWeb} */
export const fichaExemplo = {
  versao: 1, guildId: 'exemplo', userId: 'exemplo', atualizadoEm: '2026-11-17T00:00:00.000Z', numero: 42,
  nome: 'Lúx', sobrenome: 'Zogratis Adamar', epiteto: 'A Lâmina que Volta', imagem: null, cor: '#ff3b2e',
  raca: 'Humano', familia: 'Zogratis', classeSocial: 'Realeza', regiao: 'A Coroa', origem: 'Spades',
  classeMago: 'Mago de Batalha', magia: 'Magia de Sangue', magiaRaridade: 'Rara', grimorio: 'Demoníaco', milagres: ['Fúria de Batalha'], patente: 'Quilate',
  estagio: 6, pe: 14, controle: 27,
  proximo: { estagio: 5, pe: 17, controle: 0, cristais: { branco: 5, negro: 0, dourado: 0 } },
  mana: { atual: 410, max: 550 }, reserva: 4, poder: 3,
  fisicos: [
    { nome: 'Força', indice: 3, teto: 3, acrescimos: 2, treino: { feitos: 0, precisa: null } },
    { nome: 'Resistência', indice: 3, teto: 3, acrescimos: 1, treino: { feitos: 0, precisa: null } },
    { nome: 'Velocidade', indice: 2, teto: 3, acrescimos: 0, treino: { feitos: 1, precisa: 3 } },
  ],
  moedas: { yuls: 7340, meritos: 18, antimeritos: 0, cristais: { branco: 3, negro: 0, dourado: 0 } },
  trilha: { versao: 2, pontos: 6, gastos: 4, livres: 2, nos: ['batalha.furia.avanco', 'batalha.furia.sangue-quente', 'batalha.arsenal.arma-vinculada', 'batalha.furia.grito-de-guerra'] },
  conhecimentos: ['Artes Demoníacas', 'Combate', 'Esgrima', 'Etiqueta da Coroa'],
  tracos: ['Presença Impactante', 'Sangue Frio'],
  tecnicas: ['Percepção de Mana', 'Pele de Mana', 'Respiração de Mana'],
  feiticos: [
    { nome: 'Lança Carmesim', tipo: 'Ataque', estagio: 6 },
    { nome: 'Coágulo de Muralha', tipo: 'Defesa', estagio: 7 },
    { nome: 'Veia Aberta', tipo: 'Suporte', estagio: 8 },
    { nome: 'Chuva de Agulhas', tipo: 'Ataque', estagio: 6 },
  ],
  profissao: null, feiticosTotal: 7,
  ferimentos: { pior: 1, desnutrido: false, casas: [{ grau: 1, ocupada: true }, { grau: 1, ocupada: false }, { grau: 1, ocupada: false }, { grau: 2, ocupada: false }, { grau: 2, ocupada: false }, { grau: 3, ocupada: false }, { grau: 4, ocupada: false }] },
  treinosLivres: { fisico: [1, 2], magico: [2, 2], controle: [0, 1], tecnica: [1, 1] },
  historia: {
    vidaPassada: 'Herdeiro menor dos Zogratis em Spades, criado para obedecer à Tríade. Morreu na própria cerimônia de juramento, pela mão de um irmão.',
    renascimento: 'Acordou num quarto da Coroa com o mesmo sangue nas mãos e um Grimório que sussurra em duas vozes.',
    personalidade: 'Educado até o primeiro corte. Não perdoa traição e não esquece um nome.',
  },
};

/** A foto guarda a Mana do momento em que foi tirada; soma a regeneração até agora (mesma conta do bot). */
export function comRegeneracao(f, agora = Date.now()) {
  const m = f.mana;
  if (!m?.regenHora || !m.em || m.atual >= m.max) return f;
  const horas = Math.max(0, (agora - new Date(m.em).getTime()) / 3_600_000);
  return { ...f, mana: { ...m, atual: Math.min(m.max, Math.floor(m.atual + m.max * m.regenHora * horas)) } };
}

/**
 * Carrega a ficha de quem entrou.
 * @returns {Promise<{ estado: 'exemplo' | 'sem-banco' | 'sem-ficha' | 'ok' | 'erro', ficha: FichaWeb, aviso?: string }>}
 */
export async function carregarFicha(sessao) {
  if (!sessao) return { estado: 'exemplo', ficha: fichaExemplo };
  let db;
  try { db = await banco(); } catch { return { estado: 'erro', ficha: fichaExemplo, aviso: 'Não consegui falar com o banco agora. Tente de novo em instantes.' }; }
  if (!db) return { estado: 'sem-banco', ficha: fichaExemplo };
  try {
    const f = await db.collection('fichasWeb').findOne({ guildId: env.guildId, userId: sessao.id }, { projection: { _id: 0 } });
    if (f) return { estado: 'ok', ficha: /** @type {FichaWeb} */ (comRegeneracao(f)) };
    const p = await db.collection('personagens').findOne({ guildId: env.guildId, userId: sessao.id }, { projection: { etapa: 1 } });
    return {
      estado: 'sem-ficha', ficha: fichaExemplo,
      aviso: p ? (p.etapa === 'aprovado' ? 'Sua ficha ainda não chegou ao site. Use /site no Discord: o bot manda a ficha na hora.' : 'Seu personagem ainda está em criação ou em análise pela Staff.') : 'Você ainda não tem personagem. Use /criar-personagem no Discord.',
    };
  } catch {
    return { estado: 'erro', ficha: fichaExemplo, aviso: 'Não consegui ler a sua ficha agora. Tente de novo em instantes.' };
  }
}

export const imagemUrl = (hash) => (hash && /^[a-f0-9]{64}$/.test(hash) ? `/api/imagem/${hash}` : null);
