/**
 * Altar dos Vestígios e Pedra do Destino (proposta de monetização v2, 17/11/2026).
 * Decidido: gacha pago aberto, Inscrição a 160 CP (10 por 1.440). Chances e garantia ficam SEMPRE visíveis.
 * O destaque da temporada é exemplo da proposta até o Silas escolher.
 * Altar dos Vestígios: o giro é de verdade (src/lib/altar.js, /api/altar): gasta Inscrições e depois CP, entrega na conta.
 * Os materiais dos Raros valem o mesmo que 1 Inscrição no mercado (Pó 150, Quartzo 2×80, Couro 3×50 Yuls).
 * Pedra do Destino: ainda prévia (os giros vão para a /bolsa do bot, que ainda não recebe do site).
 */
export const inscricao = { nome: 'Inscrição', cp: 160, cp10: 1440 };

export const raridades = {
  lendario: { nome: 'Lendário', estrelas: 5, cor: '#ff3b2e', chance: 1.2 },
  epico: { nome: 'Épico', estrelas: 4, cor: '#b77bff', chance: 8 },
  raro: { nome: 'Raro', estrelas: 3, cor: '#9fc7d6', chance: 90.8 },
};

export const garantia = {
  lendario: 60, // certo no 60º giro
  sobeDe: 46, // a partir do 46º, +6 pontos por giro
  passo: 6,
  epico: 10, // pelo menos um Épico ou melhor a cada 10
};

export const altar = {
  id: 'vestigios',
  nome: 'Altar dos Vestígios',
  kanji: '運',
  temporada: 'Temporada I · Miasma',
  proposta: false, // era o exemplo da proposta; ficou como destaque da Temporada I quando o Altar abriu (21/11)
  destaque: {
    nome: 'Capa do Miasma',
    tipo: 'Capa de grimório animada',
    texto: 'A capa do grimório se desfaz em névoa negra na sua ficha, no Discord e aqui no site.',
    img: '/img/grimorios/demoniaco.webp',
  },
  texto: 'O gacha da temporada. Tudo o que sai aqui é visual: nada do Altar muda números da ficha. Repetidos viram Fragmentos de Vestígio, e 400 Fragmentos vão comprar o Lendário de uma temporada passada quando a Temporada II abrir.',
  regras: [
    'Sem 50/50: quando o Lendário sai, é o destaque.',
    'A contagem da garantia passa de uma temporada para a outra.',
    'Repetidos viram Fragmentos: Épico 20, Lendário 100.',
    'Nada do Altar se troca entre jogadores.',
  ],
  premios: {
    lendario: [{ id: 't1-capa-miasma', nome: 'Capa do Miasma', tipo: 'Capa de grimório animada', img: '/img/grimorios/demoniaco.webp', bot: { tipo: 'capas', id: 'miasma' }, efeito: 'O Grimório ganha a capa roxa do Miasma, com a névoa correndo pelas bordas (no site e no /grimório).' }],
    // Épicos e Raros sem arte própria ainda: a carta mostra o kanji do item (k) até a arte chegar.
    epico: [
      { id: 't1-titulo', nome: 'Título da Temporada', tipo: 'Título', k: '名', bot: { tipo: 'titulos', id: 'Arauto do Miasma' }, efeito: 'Aparece com o nome, no site e na /ficha do bot: Arauto do Miasma.' },
      { id: 't1-fundo', nome: 'Fundo do Miasma', tipo: 'Fundo de ficha', k: '景', bot: { tipo: 'fundos', id: 'fossa-miasma' }, efeito: 'A névoa roxa da Fossa do Miasma atrás do retrato, no site e na /ficha do bot.' },
      { id: 't1-tinta', nome: 'Tinta Negra', tipo: 'Tinta', k: '墨', bot: { tipo: 'tintas', id: 'negra' }, efeito: 'O nome escrito em tinta negra com sombra vermelha, no site e na /ficha do bot.' },
      { id: 't1-selo', nome: 'Selo da Temporada', tipo: 'Selo', k: '印', bot: { tipo: 'selos', id: 'altar-t1' }, efeito: 'Selo da temporada ao lado do nome no /lb, e o selo de cera da ficha fica roxo.' },
      { id: 't1-emote', nome: 'Emote da Temporada', tipo: 'Emote', k: '顔', efeito: 'Um emote do servidor só seu. A Staff libera no Discord.' },
    ],
    raro: [
      { id: 'fragmentos-3', nome: '3 Fragmentos de Vestígio', tipo: 'Fragmento', k: '片', fragmentos: 3 },
      { id: 'po-de-cristal', nome: '1 Pó de Cristal', tipo: 'Material', k: '粉', material: { chave: 'po-de-cristal', qtd: 1 } },
      { id: 'couro', nome: '3 Couros de Besta', tipo: 'Material', k: '革', material: { chave: 'couro', qtd: 3 } },
      { id: 'quartzo', nome: '2 Quartzos de Mana', tipo: 'Material', k: '晶', material: { chave: 'quartzo', qtd: 2 } },
    ],
  },
  colecao: { nome: 'Miasma', texto: 'A coleção da Temporada 1. Cada peça muda um pedaço da sua ficha, no site e no bot.' },
  /** Onde cada prêmio cai (o Histórico e a carta mostram isso). */
  onde: {
    visual: 'Na sua ficha, em Vestígios: equipe e ele aparece no site e na /ficha do bot',
    fragmentos: 'Somam na sua ficha do site, em Vestígios',
    material: 'No /inventario do bot, em Recursos',
  },
  oQueSai: {
    lendario: 'Nesta temporada: a Capa do Miasma, capa de grimório animada.',
    epico: 'Nesta temporada: título Arauto do Miasma, Fundo do Miasma, Tinta Negra, Selo da Temporada e um emote só seu.',
    raro: '3 Fragmentos de Vestígio ou um material que cai no /inventario do bot, em Recursos (1 Pó de Cristal, 2 Quartzos de Mana ou 3 Couros de Besta).',
  },
};

/**
 * Pedra do Destino: Inscrições viram itens da /bolsa do bot (src/lib/loja.js). O site NÃO gira: entrega o item e o
 * jogador gira no bot, com as chances e as vagas de sempre. `chave` = chave do item no bot (canon/recompensas.ts).
 * `sorteio` = o site sorteia na hora entre esses itens (pesos) e entrega o que saiu. Liberados em CP pelo Silas em 21/11/2026,
 * com o Reroll de Milagre virando 80% Traço à escolha e 20% Reroll de Milagre.
 * O limite é por personagem e por temporada.
 * Tabela de 21/11/2026 (Silas achou os preços estranhos e poucos giros): preços em escada de 1 a 10 Inscrições, limites
 * maiores e pacotes. Pacote = `id` próprio + `qtd`: cobra uma vez, entrega `qtd` itens e conta `qtd` no limite do item
 * (o limite é do item, `chave`, então avulso e pacote dividem o mesmo teto).
 */
export const pedra = {
  id: 'pedra',
  nome: 'Pedra do Destino',
  kanji: '石',
  texto: 'Aqui as Inscrições viram giros e rerolls da sua /bolsa no bot. Você gira lá, quando quiser, com as chances de sempre e respeitando as vagas.',
  giros: [
    { chave: 'giroConhecimento', nome: 'Cápsula de Conhecimento', custo: 1, chances: 'Comum 80%, Incomum 20%', limite: 15 },
    { chave: 'giroMagia', nome: 'Giro de Magia', custo: 2, chances: 'Comum 45%, Incomum 27%, Rara 15%, Épica 9%, Lendária 4%', limite: 20 },
    { chave: 'rerollFamilia', nome: 'Reroll de Família', custo: 2, chances: 'Peso Comum 6, Rara 1', limite: 6 },
    { id: 'giroConhecimento-5', chave: 'giroConhecimento', qtd: 5, nome: '5 Cápsulas de Conhecimento', custo: 4, chances: 'Comum 80%, Incomum 20%, cada uma', limite: 15 },
    { id: 'giroMagia-5', chave: 'giroMagia', qtd: 5, nome: '5 Giros de Magia', custo: 9, chances: 'Comum 45%, Incomum 27%, Rara 15%, Épica 9%, Lendária 4%, cada um', limite: 20 },
    { id: 'giroMagia-10', chave: 'giroMagia', qtd: 10, nome: '10 Giros de Magia', custo: 16, chances: 'Comum 45%, Incomum 27%, Rara 15%, Épica 9%, Lendária 4%, cada um', limite: 20 },
    { chave: 'rerollClasse', nome: 'Reroll de Classe de Mago', custo: 2, chances: 'Pesa a herança da família', limite: 4 },
    { chave: 'rerollRaca', nome: 'Reroll de Raça', custo: 3, chances: 'Humanos 85%, Anões 8%, Bruxas 7%', limite: 4 },
    { chave: 'giroMagiaSemComum', nome: 'Giro de Magia sem Comum', custo: 4, chances: 'As mesmas, sem Comum', limite: 10 },
    { chave: 'giroGrimorio', nome: 'Giro de Grimório', custo: 4, chances: 'Comum 92%, Lendário 8%', limite: 5 },
    { chave: 'giroLinhagem', nome: 'Giro de Linhagem', custo: 6, chances: 'O da família', limite: 2 },
    {
      chave: 'rerollMilagre', nome: 'Reroll de Milagre de família', custo: 10, limite: 2,
      chances: '80% Traço à escolha, 20% Reroll de Milagre (o da família, se houver vaga)',
      sorteio: [
        { chave: 'traco', nome: 'Traço à escolha', peso: 80, rar: 'epico', k: '徴' },
        { chave: 'rerollMilagre', nome: 'Reroll de Milagre de família', peso: 20, rar: 'lendario', k: '奇' },
      ],
    },
  ],
};

/** Como se ganham Inscrições (igual para quem paga e quem não paga). */
export const fontes = [
  // [fonte, quantas, limite, já soma no bot?]: o bot soma em contas.inscricoes (functions/cristais/inscricoes.ts)
  ['Missão concluída (Rank D ou acima)', '1', '3 por semana', true],
  ['Criatura derrotada nos chats de RP', '1', '1 por semana', true],
  ['Subir de Estágio', '5', 'Por Estágio', true],
  ['Prêmio de evento da Staff', 'Varia', 'Quando a Staff anunciar', true],
];

/** O que NÃO dá Inscrição, mas dá XP do Passe (functions/passe/regras.ts e functions/diario do bot). */
export const xpNaoInscricao = [
  ['Post de RP com 500+ caracteres', '15 XP do Passe'],
  ['/diario com a tag 丶幻 no perfil', '20 XP do Passe, fora do teto do dia'],
  ['Bump do servidor', '10 XP do Passe, até 30 por dia'],
];
