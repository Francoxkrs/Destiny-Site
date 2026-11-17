/**
 * Cristais Prismáticos (CP): a moeda da CONTA no Discord, não do personagem.
 * Números da proposta de monetização v2 (Claude Doc "Monetização com Cristais Prismáticos", 17/11/2026).
 * Decidido pelo Silas: gacha pago aberto (Inscrições a 160 CP), presente para amigo, sem VIP, teto R$ 149,99.
 * O resto ainda é proposta: a página mostra o selo "Proposta" enquanto `aprovado` for false.
 * Nada aqui cobra: o pagamento (Pix pelo Mercado Pago) só entra depois do ok do Silas.
 */
export const aprovado = false;

export const moeda = {
  nome: 'Cristal Prismático',
  sigla: 'CP',
  texto: 'A moeda da sua conta do Discord. Vale para todos os seus personagens, não expira e não se perde quando um Marcado morre.',
};

export const primeiraCompra = {
  titulo: 'Sua primeira centelha',
  texto: 'Qualquer pacote aprovado deixa um presente na sua conta.',
  letra: 'Válido uma única vez por conta. Os itens vão para a sua /bolsa.',
  premios: [
    { nome: 'Moldura Centelha Prismática', texto: 'Moldura animada para a /ficha e para a ficha no site. Só se ganha assim.', icone: 'moldura' },
    { nome: 'Título "Patrono de Diamond"', texto: 'Aparece na ficha e no perfil do site.', icone: 'titulo' },
    { nome: '1 Classe de Mago à escolha', texto: 'Usa na criação ou na ficha. Classe não tem vaga, então não tira nada de ninguém.', icone: 'classe' },
  ],
};

/** Do menor ao maior. tamanho = desenho do cristal (1 a 6). */
export const pacotes = [
  { n: 1, nome: 'Lasca', cp: 300, base: 300, bonus: 0, preco: 4.99 },
  { n: 2, nome: 'Fragmento', cp: 990, base: 900, bonus: 90, preco: 14.99 },
  { n: 3, nome: 'Geodo', cp: 2070, base: 1800, bonus: 270, preco: 29.99 },
  { n: 4, nome: 'Veio', cp: 4320, base: 3600, bonus: 720, preco: 59.99, destaque: 'Mais escolhido' },
  { n: 5, nome: 'Coração do Veio', cp: 7500, base: 6000, bonus: 1500, preco: 99.99 },
  { n: 6, nome: 'Cristal da Coroa', cp: 11700, base: 9000, bonus: 2700, preco: 149.99, destaque: 'Maior bônus' },
];

export const selo = {
  nome: 'Selo Mensal',
  preco: 9.99,
  agora: 300,
  porDia: 30,
  dias: 30,
  total: 1200,
  texto: '300 CP na hora e mais 30 CP por dia ao usar /selo, por 30 dias. Acumula no máximo 90 dias comprados. Os CP diários perdidos não voltam.',
};

export const presente = {
  titulo: 'Dar de presente',
  texto: 'Qualquer pacote, o Selo Mensal ou o Passe Premium pode ser comprado para outro membro do servidor, com um bilhete curto. Mesmo preço; conta no teto de gasto de quem paga.',
};

/** Loja da conta: tudo com resultado conhecido. */
export const loja = [
  { nome: 'Inscrição do Altar', cp: 160, nota: '10 por 1.440 CP', limite: null, grupo: 'Giros' },
  { nome: 'Passe Premium da temporada', cp: 600, nota: '≈ R$ 9,90', limite: '1 por temporada', grupo: 'Temporada' },
  { nome: 'Redefinir a trilha', cp: 450, nota: 'Devolve todos os Pontos de Trilha', limite: '1 a cada 30 dias', grupo: 'Personagem' },
  { nome: 'Família Comum à escolha', cp: 900, nota: 'Com vaga', limite: '1 por personagem', grupo: 'Personagem' },
  { nome: 'Classe de Mago à escolha', cp: 900, nota: '', limite: '1 por personagem', grupo: 'Personagem' },
  { nome: 'Raça à escolha', cp: 1200, nota: 'Humanos, Anões ou Bruxas', limite: '1 por personagem', grupo: 'Personagem' },
  { nome: 'Ateliê comum', cp: 150, nota: 'Título, tinta ou selo', limite: null, grupo: 'Ateliê' },
  { nome: 'Ateliê épico', cp: 450, nota: 'Fundo ou moldura', limite: null, grupo: 'Ateliê' },
  { nome: 'Ateliê lendário animado', cp: 1200, nota: 'Visual animado', limite: null, grupo: 'Ateliê' },
  { nome: 'Fundo ou arte da ficha fora da fila', cp: 150, nota: '', limite: null, grupo: 'Ateliê' },
];

/** Nunca à venda, por nenhum caminho pago. */
export const nuncaAVenda = [
  'Magia Rara ou acima à escolha', 'Grimório Lendário, Sem Capa ou Demoníaco', 'Milagres e Reroll de Milagre', 'Elfos e Híbridos',
  'Famílias Raras, Sorteio e Realeza', 'PE, Treinos e Skip Treino', 'Yuls, Cristais de Mana e Méritos', 'Espaços de feitiço',
];

export const regras = [
  'Teto de gasto de R$ 150 por mês por conta.',
  'Reembolso em até 7 dias se os CP não foram usados.',
  'CP não se trocam entre jogadores e não viram Yuls, Cristais de Mana, PE nem Méritos.',
  'Itens do Altar e do Ateliê não se trocam.',
];
