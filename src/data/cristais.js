/**
 * Cristais Prismáticos (CP): a moeda da CONTA no Discord, não do personagem.
 * Tudo aqui é estrutura: preços, quantidades, bônus e prêmios entram quando a monetização for aprovada.
 * Campo null = "a definir" na página. Regra do Silas: o pacote mais caro custa R$ 149,99; não há mais VIP.
 */
export const moeda = {
  nome: 'Cristal Prismático',
  sigla: 'CP',
  texto: 'A moeda da sua conta do Discord. Serve para todos os seus personagens e não se perde quando um Marcado morre.',
  teto: 'R$ 149,99',
};

export const primeiraCompra = {
  titulo: 'Na sua primeira compra de Cristais',
  texto: 'Qualquer pacote libera um presente único na conta.',
  premios: [null, null, null], // a definir
};

/** 6 vitrines, do menor ao maior. */
export const pacotes = Array.from({ length: 6 }, (_, i) => ({
  n: i + 1,
  nome: null,
  cp: null,
  bonus: null,
  preco: null,
}));

export const secoes = [
  { id: 'giros', titulo: 'Giros', texto: 'Banners com prêmios que mudam a presença do seu Marcado no servidor. Cada banner mostra as chances e a garantia antes do primeiro giro.' },
  { id: 'loja', titulo: 'Loja da conta', texto: 'Itens de preço fixo: novos giros de nascimento, conveniência e personalização. Nada que compre vitória numa luta.' },
  { id: 'gratis', titulo: 'Sem gastar', texto: 'Também dá para ganhar Cristais jogando: eventos e recompensas do servidor.' },
];
