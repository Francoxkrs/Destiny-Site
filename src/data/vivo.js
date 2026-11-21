// Diamond vivo (v2): os sistemas do mundo vivo do bot, com os números do bot
// (canon/territorio.ts, esquadroes.ts, mural.ts, mural-livre.ts, clima.ts, lojas.ts, npcs-ia.ts, segredos.ts).
// Mudou um número no bot? Mude aqui também.

export const territorios = {
  texto: 'Cada lugar de RP de Diamond tem 100 pontos de influência divididos entre os Generais Brilhantes, o Veio Negro e os Caçadores (quem não tem patente). Quem passa de 50 domina; senão, é terra de ninguém. O /territorio ver mostra tudo, e o /mapa pinta cada lugar com a cor de quem manda.',
  ganhar: [
    ['Missão concluída', 'Os Méritos do Rank viram pontos para a sua facção no lugar da missão (F 1, E 2, D 3, C 5, B 8, A 12, S 20). Sem patente, conta para os Caçadores.'],
    ['Patrulha', 'Uma cena de 500 caracteres rondando o lugar, com /patrulha: 1 ponto. Até 2 por dia, uma por lugar, estando na região.'],
    ['Vitória em combate', '5 pontos para quem vence uma luta confirmada no lugar.'],
    ['Abandono', 'Lugar largado por 3 dias fora da região-base da facção perde 1 ponto por dia para ninguém.'],
  ],
  disputa: [
    ['Quem declara', 'O Capitão de uma Tropa (um General Brilhante) ou o Líder de uma ala (um Quilate), com /territorio disputar, por um lugar vizinho. Uma declaração por facção por semana.'],
    ['72 horas', 'Por três dias toda ação no lugar vale o dobro, os dois lados contratam Caçadores e o combate entre as facções ali não precisa de justificativa.'],
    ['O resultado', 'Quem fizer mais pontos fica com o lugar, com 60 de influência.'],
  ],
  vantagens: [
    ['Sentinelas', 'Cena num lugar dominado pelo inimigo não passa despercebida: 10 minutos depois, o quartel de lá recebe um relatório de movimento suspeito, sem nome.'],
    ['Quem domina ganha', 'Missão ou Jornada num lugar da sua facção rende +15% de Yuls, e o mercado de lá dá 10% de desconto.'],
    ['Veio Negro e Coroa', 'No mercado de um lugar do Veio Negro a Coroa não cobra imposto. Onde os Generais mandam, ninguém negocia nada do Fosso e o Contrabandista rende 30% menos.'],
    ['Destaque de domingo', 'Todo domingo às 20h sai em Mudanças do mundo o mapa do reino, quantos lugares cada facção ganhou ou perdeu e quem mais rendeu influência.'],
    ['Quartéis', 'O Palácio e a Forja dos generais não se tomam. A Sala de guerra (só Generais) e o Covil do Veio Negro (Rebeldes e Desgarrados) ficam fora do mapa.'],
  ],
};

export const esquadroes = {
  texto: 'Quem tem patente entra numa divisão com /esquadrao entrar. Cada uma vigia uma parte do mapa, onde a influência dos membros vale 50% a mais, e tem uma vantagem própria. Trocar de divisão: uma vez a cada 30 dias.',
  lista: [
    ['Tropa de Reconhecimento', 'Generais', 'Fronteira Cinzenta: Postos, Rotas de fuga e Zona neutra', 'O relatório de sentinela chega com a facção do invasor, e nos segredos acham uma pista a mais.'],
    ['Tropa de Abate', 'Generais', 'Os Veios e a Descida para o Fosso', '+20% de Méritos em missões contra o Veio Negro e um cartaz por semana contra alguém do Veio Negro, pago pelo Tesouro.'],
    ['Tropa de Conquista', 'Generais', 'Ruínas e Planaltos mortos', 'A influência vale o dobro num lugar em disputa.'],
    ['Rebeldes', 'Veio Negro', 'Vilarejos mineiros e Barracões da doença', 'Influência num lugar dos Generais vale o dobro.'],
    ['Desgarrados', 'Veio Negro', 'Galerias, Mercado negro e Minas ilegais', 'Sem imposto da Coroa e 5% a menos nos mercados do Fosso.'],
  ],
  regras: [
    ['Capitão e Líder', 'Cada Tropa tem um Capitão (um General) e cada ala um Líder (um Quilate). Sem ninguém no posto, o Tenente ou Lapidador com mais moeda comanda como interino, e o bot troca sozinho.'],
    ['Divisão da semana', 'A divisão que mais rendeu influência na semana divide 30 Méritos ou Antiméritos, que o chefe distribui com /esquadrao premiar.'],
    ['Pupilo', 'O chefe escolhe 1 pupilo da divisão, pelo menos 2 Estágios abaixo. O mestre ganha 10% da moeda que o pupilo ganha em missão (o pupilo não perde nada) e +3 quando ele sobe de patente.'],
    ['Deserção', '/esquadrao desertar larga a patente e a facção. Quem você deixou põe 50 de preço na sua cabeça.'],
  ],
};

export const cabecas = {
  texto: 'Ganhar Méritos põe preço do Veio Negro na sua cabeça; ganhar Antiméritos põe preço dos Generais. Tomar missão do outro lado, vencer combate numa disputa e derrotar alguém da facção inimiga em luta também sobem o preço. Sem crime novo, cai 5% por semana. Veja com /mural ver.',
  pedidos: [
    ['Vivo', '100%', 'Fica preso no quartel de quem pagou até fugir ou ser resgatado.'],
    ['O Grimório', '70%', 'O Grimório fica selado com quem pagou até ser recuperado.'],
    ['Morto', '60%', 'Morte pela regra de hoje; se for permanente, o nome vai para o Muro dos caídos.'],
    ['Um Disco', '50%', 'O Disco vira item de quem pagou.'],
    ['Um membro ou olho', '40%', 'Vira Sequela de Ferimento.'],
  ],
  notaveis: 'Um canal em O mundo com 9 cartazes que mudam sozinhos: Os Brilhantes (os 3 com mais Méritos), Os Negros (os 3 com mais Antiméritos) e os Procurados (as 3 cabeças mais caras), cada um com retrato, patente e os 3 maiores feitos.',
  cobrar: 'A captura sempre acontece numa cena narrada; a Staff confirma com /mural captura. Quem é da facção que paga recebe Méritos ou Antiméritos; Caçador recebe Bounty.',
};

export const muralLivre = {
  texto: 'Quem não tem patente (os Caçadores) pega missões dos dois quadros de facção e também do Mural Livre, no /missão quadro. O Mural paga Bounty, a moeda dos neutros, no mesmo valor dos Méritos do Rank.',
  tipos: [
    ['Caçada', 'Todo dia, uma por Rank. Uma espécie do Bestiário foi vista: traga a prova do abate ou a criatura viva.'],
    ['Procurado', 'Todo dia, um por Rank. Um NPC com cartaz: vivo paga tudo, morto paga 60%.'],
    ['Cabeça a prêmio', '/bounty cabeca põe Yuls (de 1.000 a 500.000) na cabeça de outro Marcado. Os Yuls saem na hora e viram o prêmio de quem trouxer o alvo, numa cena narrada pela Staff. O cartaz vale 14 dias, cada pessoa tem até 2 abertos, e tirar antes devolve 90%.'],
    ['Invasão', 'Quem não tem patente e toma a missão de outro grupo ganha em Bounty.'],
  ],
  titulos: [
    ['Sem Nome', '0', 'Ninguém no Mural sabe quem você é.'],
    ['Rastreador', '15', 'Os taverneiros já guardam cartaz para você.'],
    ['Caçador de Recompensas', '40', 'Seu nome aparece nos cartazes como quem pega.'],
    ['Lâmina de Aluguel', '90', 'As duas facções mandam recado antes de chamar outro.'],
    ['Lenda do Mural', '180', 'Procurados mudam de região quando ouvem que você chegou.'],
  ],
};

export const segredos = {
  texto: 'Todo lugar de Diamond esconde segredos. Escreva uma cena de pelo menos 400 caracteres ali e use /investigar em até 30 minutos: você ganha uma pista de um segredo que combina com quem você é (Conhecimentos, Discos, profissão, facção, a hora e o clima). Com as pistas que ele pede, o segredo se revela só para você.',
  regras: [
    ['Limite', '1 investigação por lugar a cada 24 horas, até 3 por ciclo.'],
    ['O que um segredo dá', 'Um achado (item, recurso ou Yuls), uma passagem secreta que encurta o /viajar, um saber de lore, uma missão que só você pode pedir, a fraqueza de uma criatura ou uma Brecha que dá +10 de influência numa disputa daquele lugar.'],
    ['Caderno', '/segredos caderno mostra as suas pistas e o que você já achou, e o /mapa marca com um X vermelho onde você tem pista.'],
    ['Rumores', 'Toda semana cada região ganha um rumor que só o primeiro a achar leva. O canal de mudanças avisa quando ele aparece e quando alguém acha, sem dizer quem.'],
  ],
};

export const lojas = {
  texto: '11 lugares de Diamond têm loja com dono NPC. Use /loja ver, /loja comprar e /loja vender dentro do canal delas, estando na região. Cada uma vende e compra coisas diferentes.',
  lista: [
    ['Arsenal Brilhante', 'A Coroa', 'Só atende os Generais Brilhantes.'],
    ['Joalheria da Avenida', 'A Coroa', 'Avenida lapidada.'],
    ['Balcão do Ateliê', 'O Lapidário', 'Ateliê de Lapidação.'],
    ['Banca do estufeiro', 'O Lapidário', 'Estufas de mana.'],
    ['Fornalhas da Guilda', 'Os Veios', 'O mestre da Guilda dos Ferreiros.'],
    ['Feira dos veios', 'Os Veios', 'A feirante mais velha.'],
    ['Câmbio de Cristais', 'O Fosso', 'Cristais sem a Taxa de Cristal da Coroa.'],
    ['Leilão Mudo', 'O Fosso', 'O preço muda todo dia.'],
    ['Balcão da Toca', 'O Fosso', 'Toca do lampião.'],
    ['Despensa da estalagem', 'Fronteira Cinzenta', 'Estalagem da encruzilhada.'],
    ['Mercado de Trocas', 'Fronteira Cinzenta', 'O mercador de Clover, na Zona neutra.'],
  ],
  estoque: 'O estoque volta às 6h. Quando acaba, o preço sobe até 50%; quando os jogadores vendem demais, cai até 20%. Quem domina o lugar dá desconto à sua facção.',
  npcs: 'Oito NPCs respondem com /falar no canal deles: a taverneira do Último Brilho, o agenciador do Mural, o mestre das Fornalhas, o cambista, a dona da Toca do Lampião, o estalajadeiro da Encruzilhada, o leiloeiro mudo (responde por bilhete) e a reitora da Escola de Medicina. Cada um tem jeito próprio, sabe coisas do lugar e esconde segredos: quem ganha a confiança dele pode levar uma pista (uma a cada 7 dias por NPC). Até 20 falas por dia, quando a Staff ativar.',
};

export const clima = {
  texto: 'Cada região tem um clima por dia, que vira às 6h (horário de Brasília). Veja com /clima; o clima também aparece no /mapa e no canal Mudanças do mundo.',
  lista: [
    ['Céu limpo', 'Nada muda. No Fosso, que não tem céu, chama Ar parado.'],
    ['Névoa Cinza', 'A viagem até a região leva +50%.'],
    ['Chuva de Pó', 'A Respiração de Mana recupera +3% e a mineração rende +1 Pó de Cristal (a Staff aplica).'],
    ['Tempestade de Fuligem', 'O Trilho de Cristal fecha para quem sai ou chega na região; criaturas de Rank C ou mais rondam.'],
    ['Geada', 'Comida ×1,3 no mercado da região (a Staff aplica).'],
    ['Seca de Mana', 'Lugares de mana Comum viram Rala no dia.'],
    ['Vazamento de Gás', 'Só no Fosso: sem Máscara de Filtro, Doença de Mana em 3 turnos nas Galerias.'],
    ['Maré de Mana', 'Só na Fronteira: o Treino de Controle na Fenda de Clover rende +1%, e a Embriaguez de Mana chega na metade do tempo.'],
  ],
};

export const oMundo = [
  ['Mudanças do mundo', 'O clima do dia e um Boletim a cada 6 horas: criaturas vencidas ou que fugiram, patentes novas e o que a Staff anunciar.'],
  ['Mural dos notáveis', 'Os 9 cartazes de Brilhantes, Negros e Procurados.'],
  ['Muro dos caídos', 'O nome de quem morreu de vez.'],
];

// Treinos novos, forja, mercado vivo e missões (entram nas páginas de cada sistema).
export const treinosNovos = [
  ['Com mestre', 'No /treinar, botão Com mestre: treine com um Marcado pelo menos 2 Estágios acima de você. Ele aceita no botão; o treino gasta a vaga normal do ciclo, mas rende +1 treino (ou +1% de Controle). O mestre ganha XP do Passe e ensina até 3 aulas por dia. O mestre do seu esquadrão ensina sem a regra dos Estágios.'],
  ['Mestres de Classe', 'Se houver um Mestre de Classe no lugar onde você está, o botão Com mestre chama ele. Cobra 150 Yuls por Estágio que você já subiu.'],
  ['Combate', 'Botão Combate: desafie outro Marcado para lutar em cena. Os dois treinam o foco que escolheram e gastam a vaga do ciclo; quem vence ganha +1 treino (ou +1% de Controle). Um marca o resultado e o outro confirma, ou a Staff. O mesmo par só treina assim uma vez a cada 20 horas.'],
  ['Sessão de treino', 'Escolha vários focos no menu do /treinar e eles viram uma sessão só, com um texto para tudo, como 2 de Força e 1 de Controle.'],
];

export const forja = [
  ['Quem forja', 'O artesão (Ferreiro, Engenheiro, Lapidador ou Mago Artífice) começa com /forja comecar: escolhe a peça, onde forjar e escreve a primeira Jornada. As outras seguem no /jornada.'],
  ['Forja da Guilda', 'Segura. Cobra 10% do valor do material (mínimo 30 Yuls); o Veio Negro paga o dobro.'],
  ['Oficina', 'Numa terra sua: segura e de graça.'],
  ['Os Veios', 'Não cobram e a peça sai uma Jornada mais rápido, mas pode ser roubada no caminho: 5% numa Comum, 8% Incomum, 12% Rara, 18% Épica e 25% Obra-Prima. Veio Negro e Contrabandista correm metade do risco.'],
  ['A peça vira post', 'Pronta, o bot posta o cartaz da peça com a arte, a qualidade, o material, o Traço e quem fez. Peça roubada aparece com o carimbo.'],
  ['Encomendas', '/forja encomendar pede uma peça a um artesão. O pagamento sai na hora e fica guardado; o artesão aceita e forja, a peça vai direto para quem pediu e o artesão recebe. Recusou, venceu (7 dias para responder, 14 para forjar) ou foi roubada: o pagamento volta inteiro.'],
];

export const mercadoVivo = [
  ['Preço de onde você está', 'No canal de RP de uma região, o /mercado usa o preço de lá (a Fronteira usa a tabela dos Veios). Fora dos canais de RP, vale onde você mora.'],
  ['Estoque que reage', 'Comprar aperta o estoque e o preço sobe; vender enche e o preço cai. Fica entre ×0,6 e ×1,8 e volta ao normal sozinho com os dias. Cristais não mudam.'],
  ['Mercador', 'Quem tem a Profissão compra mais barato e vende mais caro nas lojas de NPC: 5% Aprendiz, 10% Oficial e 15% Mestre.'],
  ['Eventos sozinhos', 'Sem evento da Staff, o mercado sorteia um de 2 ou 3 dias em 1 de cada 4 dias: Escassez nos Veios (minérios ×1,5), Caravana de Clover (orgânicos ×0,7) e Febre dos Encantos (Pó de Cristal, Fio Rúnico, Quartzo e Lente ×2).'],
  ['/extrato', 'Seus Yuls, o patrimônio e a Riqueza, o custo de vida da semana, o salário de cada Profissão e o que está guardado em encomendas e cabeças a prêmio.'],
];

export const missoesNovas = [
  ['3 por Rank', 'Cada quadro (Generais e Veio Negro) traz 3 missões de cada Rank por dia.'],
  ['Urgente', 'Um quadro por dia traz uma missão Urgente, no topo, que paga 50% a mais de Yuls.'],
  ['Com lugar', 'Toda missão acontece num lugar de Diamond, que aparece no quadro e no post. Se o texto cita uma região, é lá; senão, o lugar sai pelo lado de quem dá a missão.'],
  ['Mural Livre', 'Quem não tem patente também pega caçadas, procurados e cabeças a prêmio, pagos em Bounty.'],
];

export const codigos = 'A cada meta de membros do servidor (800, 900, 1.000...) sai um código no canal de anúncios. Use /codigo e cole: vale uma vez por pessoa, por 7 dias, e os itens caem na sua /bolsa.';
