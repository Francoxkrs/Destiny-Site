// Relíquias de Criatura (aprovadas pelo Silas em 2026-11-08).
// Uma por criatura de Rank B, A ou S do Bestiário, e só existe uma de cada no servidor.
// Formato longo: Sobre, Habilidade, Observação e Como obter.

export const reliquiasRegras = {
  texto: 'Toda criatura de Rank B, A ou S guarda um item lendário, e só existe um de cada no servidor. Ele tem poder de verdade, mas sempre cobra um preço. Uma Relíquia de Criatura não é forjada: ela é tomada da criatura.',
  regras: [
    ['Como cai', 'Matando a criatura (não vale domar) numa cena narrada. Quem deu o golpe final rola um d100 no bot. Rank B cai com 90 ou mais, Rank A com 75 ou mais, e Rank S cai sempre. Saena e Qadosh não se matam: cada uma diz como se obtém.'],
    ['Única', 'Só existe uma de cada. Enquanto alguém a tem, nenhuma criatura daquela espécie solta outra.'],
    ['Estágio mínimo', 'Para empunhar: 6º Estágio no Rank B, 4º no Rank A e 2º no Rank S. Abaixo disso, cada Relíquia diz o que acontece.'],
    ['Teste ao pegar', 'As Relíquias que têm vontade própria pedem um d100 na primeira vez que são empunhadas. Cada uma diz o que acontece se falhar.'],
    ['Ressonância', 'A Relíquia já nasce Desperta e ocupa o lugar do item em Ressonância do dono, que não pode ter outro.'],
    ['Preço', 'Mana por turno (em % da Mana máxima), Corrupção ou Sequela. A Corrupção já existe na ficha, e a Staff decide o que ela faz quando fica alta.'],
    ['Maldição', 'Algumas não saem mais do dono. Quando ele morre, o item fica onde ele caiu e volta ao covil da criatura depois de 7 dias.'],
    ['Personalização', 'As que mudam com o dono (como o Miasma) têm o visual e a habilidade única escritos pelo jogador no fórum de criação e aprovados pela Staff.'],
  ],
  artifice: 'O Mago Artífice continua com a Relíquia dele, uma vez na vida, pela Arma-Assinatura.',
};

export const reliquias = [
  {
    nome: 'Miasma do Desgarrado', criatura: 'Desgarrado', rank: 'S', tipo: 'Armadura',
    sobre: 'A última peça do Desgarrado: um pedaço de miasma púrpura que não se desfaz quando ele morre. Encostado na pele, ele se espalha e vira armadura, e cada dono a vê de um jeito. Ela protege e dá força, mas tem fome, e quem a veste por tempo demais corre o risco de virar o próximo Desgarrado.',
    habilidade: 'Couraça de Miasma. A armadura cobre o dono e muda com ele, em três formas. Quanto mais solta, mais forte, e mais ela cobra.',
    observacao: [
      'Controlada: sempre ativa enquanto equipada. +1 Acréscimo em Força, Resistência e Velocidade, e a armadura se regenera sozinha. Não cobre a cabeça nem os braços.',
      'Parcialmente Controlada: o dono solta a névoa por vontade própria. +2 em Força, Resistência e Velocidade; os Ferimentos III e IV contam como I e II até o fim da cena; a névoa forma membros a mais, que seguram e golpeiam. Custa 15% da Mana máxima por turno e 1 de Corrupção por cena.',
      'Incontrolada: +3 em Força, Resistência e Velocidade, e o dono não sente dor nem distingue aliado de inimigo. Custa 25% da Mana máxima por turno e 2 de Corrupção por cena. Começa sozinha depois de 5 turnos seguidos na Parcialmente Controlada, ou quando o dono entra em fúria.',
      'Se a armadura for destruída, ela volta em 2 turnos.',
      'No fim da cena, cada Ferimento que a armadura segurou volta um grau acima.',
      'Com a Mana em zero, o dono entra em Exaustão Mágica e a armadura volta à forma Controlada.',
      'Teste ao pegar: d100. Abaixo de 40, o dono passa 5 turnos na forma Incontrolada, atacando quem estiver perto.',
      'Abaixo do 2º Estágio: o miasma consome o dono, que vira um Desgarrado e passa a ser um NPC da Staff.',
      'Maldição: depois de vestida, não sai mais do dono.',
      'O visual da armadura e uma habilidade única de cada dono são escritos no fórum de criação e aprovados pela Staff.',
    ],
    obter: 'Matando o Desgarrado. Por ser Rank S, a Relíquia cai sempre para quem der o golpe final.',
  },
  {
    nome: 'Katana da Hydra Negra', criatura: 'Hydra Negra', rank: 'A', tipo: 'Arma',
    sobre: 'Uma lâmina preta com veios roxos, feita da presa maior da Hydra Negra e temperada no próprio fogo dela. Os veios brilham quando a katana tem fome. Dizem nos Veios que a alma da Hydra ainda mora no aço e espera a hora de voltar.',
    habilidade: 'Fogo Púrpura. Todo corte acende uma chama roxa que queima e envenena. O estrago depende do Estágio do alvo comparado ao do dono.',
    observacao: [
      'Alvo de Estágio acima do dono: Ferimento I de queimadura e -1 Velocidade de veneno.',
      'Mesmo Estágio: Ferimento II e -2 Velocidade.',
      '1 Estágio abaixo: Ferimento III e -3 Velocidade.',
      '2 Estágios abaixo: Ferimento IV, a parte atingida pode ser perdida, e -4 Velocidade.',
      '3 ou mais Estágios abaixo: a parte atingida é incinerada (Sequela), -5 Velocidade, e a magia do alvo não apaga o fogo.',
      'O veneno dura até o fim da cena ou até uma cura. A lâmina não quebra nem racha.',
      'Fusão: 1 vez por cena, por 3 turnos, o dono se funde com a alma da Hydra. A lâmina cresce 30 cm, ele ganha +1 Força e +1 Velocidade, e o fogo sobe uma linha na lista acima. Custa 10% da Mana máxima por turno.',
      'No fim da Fusão, d100: abaixo de 30, a alma da Hydra toma o corpo do dono por 1 turno, e a Staff narra o que ela faz.',
      'Abaixo do 4º Estágio: quem toca na katana leva Ferimento IV de queimadura na mão.',
    ],
    obter: 'Matando a Hydra Negra. Quem deu o golpe final rola um d100 e leva a katana com 75 ou mais.',
  },
  {
    nome: 'Fornalha de Sigilos', criatura: 'Rubrossigilo', rank: 'B', tipo: 'Arma (manopla)',
    sobre: 'Uma manopla de ferro escuro feita do couro do Rubrossigilo, com as marcas dele ainda gravadas por dentro. Fica sempre quente, e quem a usa por muito tempo tem os dedos marcados de vermelho.',
    habilidade: 'Sigilos Ardentes. Cada acerto acende um sigilo no alvo. No terceiro sigilo, eles explodem: o alvo e todos a até 3 m levam um Ferimento I extra de queimadura, aliados também.',
    observacao: [
      'Os sigilos somem no fim da cena.',
      'A partir da segunda explosão na mesma cena, o dono também leva Ferimento I de queimadura na mão.',
      'Abaixo do 6º Estágio: a manopla esquenta até não dar para segurar e não acende sigilo nenhum.',
    ],
    obter: 'Matando um Rubrossigilo. Quem deu o golpe final rola um d100 e leva a manopla com 90 ou mais.',
  },
  {
    nome: 'Cauda de Enxerto', criatura: 'Manticorno de Enxerto', rank: 'B', tipo: 'Arma (chicote de ferrão)',
    sobre: 'A cauda de escorpião do Manticorno, ainda viva, costurada num cabo de couro. Ela se mexe sozinha quando sente perigo e, nas mãos certas, aceita ser costurada em outras coisas, como o próprio Manticorno foi.',
    habilidade: 'Ferrão e Enxerto. Um acerto do ferrão paralisa as pernas do alvo no turno seguinte: ele ainda ataca e conjura, mas não sai do lugar (1 vez por cena em cada alvo). E 1 vez por cena, o dono enxerta no próprio corpo uma garra ou um chifre de uma criatura de que tenha a Parte, e usa como segunda arma até o fim da cena.',
    observacao: [
      'Cada enxerto ocupa 1 ponto de Rejeição dos Discos de Engaste até o fim da cena.',
      'Com Ferimento III, d100: abaixo de 30, o enxerto toma o controle e ataca quem estiver mais perto por 1 turno.',
      'Abaixo do 6º Estágio: a cauda se enrola no braço do dono e não solta, e ele fica com -1 Velocidade até um Médico tirá-la numa Jornada.',
    ],
    obter: 'Matando um Manticorno de Enxerto. Quem deu o golpe final rola um d100 e leva a cauda com 90 ou mais.',
  },
  {
    nome: 'Laje do Posto', criatura: 'Sentinela de Musgo', rank: 'B', tipo: 'Escudo',
    sobre: 'A laje-escudo da Sentinela de Musgo, coberta de musgo que não morre. Ainda guarda a doutrina do posto que a Sentinela vigiou por séculos: enquanto o dono não se mexe, ela não deixa nada passar.',
    habilidade: 'Doutrina de Posto. Num turno em que o dono não se move, a laje dispara pedras até 300 m, com um ataque à distância que usa a Força dele. E ela bloqueia o primeiro ataque de cada turno vindo de alguém de Estágio igual ou inferior ao do dono.',
    observacao: [
      'Palavra de rendição: ao pegar a laje, o dono escolhe uma palavra. Se alguém disser essa palavra perto dele, o escudo desliga até o fim da cena.',
      'É pesada: -0,5 Velocidade enquanto equipada.',
      'Abaixo do 6º Estágio: a laje não sai do chão.',
    ],
    obter: 'Matando uma Sentinela de Musgo. Quem deu o golpe final rola um d100 e leva a laje com 90 ou mais.',
  },
  {
    nome: 'Prisma dos Matizes', criatura: 'O Derrame', rank: 'B', tipo: 'Catalisador',
    sobre: 'Uma gota do Derrame que endureceu como vidro. Dentro dela as cores ainda giram, uma por turno, e quem aprende o ciclo consegue fazer a magia girar junto.',
    habilidade: 'Ciclo de Matizes. Ligado, a cada turno os feitiços do dono ganham um elemento extra, numa ordem fixa. No sétimo turno seguido, sai a Gota Branca: um feitiço do dono conta como um Estágio acima.',
    observacao: [
      'Custa 10% da Mana máxima por turno enquanto o ciclo está ligado.',
      'Se o ciclo for interrompido (o dono para ou leva Ferimento III), o próximo feitiço sai com um elemento sorteado.',
      'Depois da Gota Branca, o ciclo volta ao começo e não pode ser ligado de novo na mesma cena.',
      'Abaixo do 6º Estágio: os feitiços do dono saem sempre com um elemento sorteado.',
    ],
    obter: 'Matando um Derrame. Quem deu o golpe final rola um d100 e leva o prisma com 90 ou mais.',
  },
  {
    nome: 'Escama de Breu', criatura: 'Dragão Negro', rank: 'B', tipo: 'Armadura',
    sobre: 'Uma escama do Dragão Negro, do tamanho de um peito, que bebe a luz em volta. Presa ao corpo, faz o dono crescer no escuro como o dragão crescia.',
    habilidade: 'Nível de Sombra. O dono ganha Força e Resistência conforme a luz em volta: +0,5 na sombra, +1 na penumbra e +2 no breu total. E 1 vez por cena, apaga todas as luzes a até 10 m (tochas e feitiços de luz de Estágio igual ou inferior ao dele).',
    observacao: [
      'Sob a luz do dia, o dono fica com -1 Velocidade.',
      'Abaixo do 6º Estágio: a escama gruda na pele e o dono fica com -1 em tudo sob luz forte.',
    ],
    obter: 'Matando um Dragão Negro. Quem deu o golpe final rola um d100 e leva a escama com 90 ou mais.',
  },
  {
    nome: 'Núcleo Galvânico', criatura: 'Malware', rank: 'A', tipo: 'Acessório (implante)',
    sobre: 'O coração de cristal e cobre do Malware. Continua zumbindo depois que ele morre e se prende a quem o carrega, aprendendo como essa pessoa luta e como os inimigos dela lutam.',
    habilidade: 'Assimilação Galvânica. 1 vez por cena, copia por 3 turnos o encantamento ou o Traço de um item inimigo que encostou no dono. E, contra o mesmo inimigo, o dono ganha +0,5 Acréscimo a cada 2 turnos de luta, até +2.',
    observacao: [
      'Fome de metal: o núcleo precisa comer 1 Recurso de metal (minério ou lingote) por dia. Um dia sem comer dá Ferimento I e o núcleo desliga até ser alimentado.',
      'Golens e Autômatos a até 5 m ficam instáveis, aliados também (a Staff narra).',
      'Abaixo do 4º Estágio: o núcleo come o metal do próprio dono, e as próteses e os Discos dele param de funcionar.',
    ],
    obter: 'Matando o Malware. Quem deu o golpe final rola um d100 e leva o núcleo com 75 ou mais.',
  },
  {
    nome: 'Pincel Rupestre', criatura: 'O Painel', rank: 'A', tipo: 'Catalisador',
    sobre: 'Um pincel de osso com a ponta sempre suja de ocre, achado no chão da Galeria 31 depois que o Painel se calou. O que ele pinta sai da parede, como as feras dele saíam.',
    habilidade: 'Pintura Viva. 1 vez por cena, o dono pinta numa superfície algo que já viu (uma fera, uma arma, uma ponte) e a pintura sai e é real por 1 turno. O que for pintado não passa do Estágio do dono.',
    observacao: [
      'Cada pintura apaga uma memória do dono, que a Staff escolhe e o jogador anota na ficha.',
      'Pintar uma pessoa viva não funciona: a pintura sai com o rosto do dono.',
      'Abaixo do 4º Estágio: quem vira pintura numa parede é o dono, por uma cena.',
    ],
    obter: 'Calando o Painel numa cena narrada. Quem deu o golpe final rola um d100 e leva o pincel com 75 ou mais.',
  },
  {
    nome: 'Máscara Pálida', criatura: 'O Rei de Amarelo', rank: 'A', tipo: 'Acessório',
    sobre: 'Uma máscara lisa, sem boca, deixada no palco do Teatro Pálido quando a peça acabou. Quem a veste passa a ver todo mundo como atores, e todo mundo passa a ouvir o dono como se fosse a fala principal.',
    habilidade: 'O Segundo Ato. 1 vez por cena, o dono olha para um alvo, que perde a reação até o próximo turno dele. E 1 vez por arco, a cena vira uma peça por 1 turno: o dono escreve uma fala curta para cada um ali, e todos agem conforme ela (a Staff aprova).',
    observacao: [
      'Teste ao pegar: d100. Abaixo de 40, o dono vira o Rei de Amarelo por uma cena e passa a ser um NPC da Staff até ela acabar.',
      'O dono não pode recusar papel num evento da Staff.',
      'Maldição: depois de vestida, não sai mais do rosto.',
      'Abaixo do 4º Estágio: quem a veste perde o próprio nome, e os outros esquecem como chamá-lo até a máscara sair.',
    ],
    obter: 'Encerrando a peça do Rei de Amarelo numa cena narrada. Quem deu o golpe final rola um d100 e leva a máscara com 75 ou mais.',
  },
  {
    nome: 'Cajado dos Mortos', criatura: 'Ossuário Errante', rank: 'A', tipo: 'Catalisador',
    sobre: 'A espinha mais longa do Ossuário Errante, ainda com dedos presos em volta. Onde alguém morre perto dele, os ossos tremem e querem levantar.',
    habilidade: 'Coleta os Mortos. O dono ganha +1 Força para cada morte na cena a até 30 m, até +3. E 1 vez por cena, ergue o último morto da cena para lutar ao lado dele por 2 turnos.',
    observacao: [
      'Cada corpo erguido dá 1 de Corrupção ao dono.',
      'O morto erguido tem o Estágio que tinha em vida, no máximo o do dono. Marcados não são erguidos, só NPCs e criaturas.',
      'Abaixo do 4º Estágio: os mortos que o cajado juntou se voltam contra o dono.',
    ],
    obter: 'Matando o Ossuário Errante. Quem deu o golpe final rola um d100 e leva o cajado com 75 ou mais.',
  },
  {
    nome: 'Coroa do Sol Negro', criatura: 'O Eclipsado', rank: 'S', tipo: 'Acessório',
    sobre: 'O aro de ferro que segurava o sol no lugar da cabeça do Eclipsado. Vazio, ainda puxa a luz para dentro, e quem o põe na cabeça aprende a apagar o dia.',
    habilidade: 'Eclipse. 1 vez por arco, por 3 turnos, apaga o sol (ou toda a luz) no lugar da cena. O dono enxerga no escuro e ganha +2 em tudo.',
    observacao: [
      'Os aliados também não enxergam no Eclipse.',
      'No terceiro uso, o dono ganha a Sequela de cegueira sob a luz do dia.',
      'Abaixo do 2º Estágio: a coroa queima a cabeça de quem a põe (Ferimento IV).',
    ],
    obter: 'Matando o Eclipsado. Por ser Rank S, a Relíquia cai sempre para quem der o golpe final.',
  },
  {
    nome: 'Livro da Dívida', criatura: 'A Coroa de Mãos', rank: 'S', tipo: 'Catalisador',
    sobre: 'O livro-razão da Coroa de Mãos, onde cada preço que ela cobrou está escrito numa letra perfeita. As páginas em branco esperam novas dívidas, e o livro sempre cobra.',
    habilidade: 'Cobrança e Contrato. 1 vez por cena, um alvo atingido pelo dono paga a Mana do próximo feitiço dele. E 1 vez por arco, o dono firma um contrato com alguém (os dois aceitam no RP); quem quebrar o contrato perde um membro (Sequela).',
    observacao: [
      'O dono não pode mentir sobre um preço ou uma dívida. Se mentir, perde uma mão.',
      'Toda cobrança e todo contrato ficam escritos no livro, e a Staff pode lê-lo.',
      'Abaixo do 2º Estágio: o livro cobra o próprio dono, e toda Mana que ele gastar custa o dobro.',
    ],
    obter: 'Matando a Coroa de Mãos. Por ser Rank S, a Relíquia cai sempre para quem der o golpe final.',
  },
  {
    nome: 'Lágrima do Luar', criatura: 'Saena', rank: 'S', tipo: 'Acessório',
    sobre: 'Uma gota de luar que não seca, presa num fio de prata. É o selo de um contrato com Saena: quem a carrega pode pedir, e Saena sempre atende, e sempre cobra.',
    habilidade: 'Empréstimo. 1 vez por arco, o dono pega emprestado, por uma cena, um feitiço de outra magia.',
    observacao: [
      'Cada empréstimo tem um preço, escrito pela Staff antes do uso, como todo contrato de Saena.',
      'Abaixo do 2º Estágio: Saena cobra antes de emprestar.',
    ],
    obter: 'Saena não se mata. A Lágrima vem de um contrato com ela, numa noite de lua cheia, numa cena narrada pela Staff.',
  },
  {
    nome: 'Pena do Éden', criatura: 'Qadosh', rank: 'S', tipo: 'Acessório',
    sobre: 'Uma pena branca que pesa como chumbo para os impuros e não pesa nada para os puros. Qadosh a deixa nos sonhos de quem nasceu enfermo, e quem acorda com ela na mão sabe que foi escolhido.',
    habilidade: 'Éden. 1 vez por arco, por uma cena, os feitiços do dono contam como um Estágio acima e podem transformar as coisas que tocam (a Staff narra).',
    observacao: [
      'Ferir alguém indefeso transforma a pena em cinza para sempre.',
      'Abaixo do 2º Estágio: a pena pesa demais para ser levantada.',
    ],
    obter: 'Qadosh não se mata. Ele entrega a pena, num sonho narrado pela Staff, a quem nasceu enfermo e é puro de alma.',
  },
  {
    nome: 'Boca dos Veios', criatura: 'Devorador-de-Veios', rank: 'S', tipo: 'Catalisador',
    sobre: 'Um anel de dentes de cristal arrancado da garganta do Devorador. Ainda tem fome de Mana, e quem o carrega sente a mana dos outros como cheiro de comida.',
    habilidade: 'Devora Mana. Os feitiços inimigos a até 10 m do dono custam 50% a mais. E 1 vez por cena, ele devora um feitiço lançado contra ele, de Estágio igual ou inferior, e recupera 20% da própria Mana máxima.',
    observacao: [
      'Enquanto o dono tiver a Boca, a Terra dele perde um grau de Vigor por semana.',
      'Abaixo do 2º Estágio: a Boca devora a Mana do próprio dono, que cai em Exaustão Mágica.',
    ],
    obter: 'Matando o Devorador-de-Veios. Por ser Rank S, a Relíquia cai sempre para quem der o golpe final.',
  },
];
