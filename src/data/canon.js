// Cânone do Black Destiny — fonte única de dados do site (e, no futuro, do bot).
// Espelha o documento "Black Destiny — Cânone v1". Ao mudar uma regra, mude aqui.

export const site = {
  nome: 'Black Destiny',
  tagline: 'Toda alma volta. Nenhuma volta igual.',
  discord: 'https://discord.gg/S7ejKvhdjs',
};

// Ordem e metadados das páginas de sistema (usados no menu, índice e "próxima página").
export const capitulos = [
  { id: 'I', kanji: '目覚', nome: 'Onde você acorda', texto: 'Diamond, o reino que esgotou a própria terra.' },
  { id: 'II', kanji: '前世', nome: 'Quem você foi', texto: 'A família e a raça que a sua alma carrega de outra vida.' },
  { id: 'III', kanji: '魔導', nome: 'O Grimório', texto: 'O que a sua alma sabe fazer, como isso se mede sem dados e o quanto o corpo aguenta.' },
  { id: 'IV', kanji: '道', nome: 'O Caminho', texto: 'Como crescer, o que domar, a quem servir e o que caçar.' },
  { id: 'V', kanji: '生業', nome: 'O Sustento', texto: 'Ofício, minas, forja, terra e Yuls num reino que está acabando.' },
  { id: 'VI', kanji: '始', nome: 'O Despertar', texto: 'Criar o personagem e abrir os olhos.' },
];

// essencial = "Em 30 segundos": três linhas com o que importa de cada página.
export const paginas = [
  { slug: 'mundo', cap: 'I', num: '01', titulo: 'O Mundo', resumo: 'Diamond, suas regiões e os quatro reinos', essencial: ['Todo personagem renasce em Diamond, o reino que esgotou a própria terra.', 'A Coroa, o Lapidário e os Veios separam Realeza, Nobreza e Plebe; o Fosso é o mercado negro.', 'Clover, Spades e Heart são os reinos de onde as almas vieram.'] },
  { slug: 'familias', cap: 'II', num: '02', titulo: 'Famílias', resumo: 'Classes sociais e as 24 linhagens', essencial: ['A família da vida passada define a Classe Social, a região onde você renasce e o dinheiro inicial.', 'Cada família tem magias típicas, heranças e às vezes um Marco num Estágio.', 'Na criação, a família vem sorteada no modelo: Comuns pesam 6, Raras pesam 1.'] },
  { slug: 'racas', cap: 'II', num: '03', titulo: 'Raças', resumo: 'Humanos, Anões, Bruxas, Elfos e Híbridos', essencial: ['Humanos são a maioria; Anões e Bruxas são raros na criação.', 'Cada raça tem traços próprios; Bruxas já nascem sob a Maldição da Rainha.', 'Elfos só aparecem pela família Licht ou por Reencarnação Élfica.'] },
  { slug: 'classes', cap: 'III', num: '04', titulo: 'Classes de Mago', resumo: 'Oito estilos de combate', essencial: ['A Classe de Mago é o seu estilo de luta: oito no total.', 'Cada uma pede um Conhecimento e dá uma passiva; a Classe Avançada vem depois.', 'O Mago Curandeiro é a classe dos curadores (ver Ferimentos).'] },
  { slug: 'milagres', cap: 'III', num: '05', titulo: 'Milagres e Traços', resumo: 'As bênçãos raras da mana e o Feitiço de Alma', essencial: ['Milagres são bênçãos raras que mudam as regras do personagem.', 'Traços são talentos menores: até 3, nenhum com mais de 1 Acréscimo.', 'O Traço Alma Indomável abre o Feitiço de Alma, uma técnica única por personagem.'] },
  { slug: 'magia', cap: 'III', num: '06', titulo: 'Magia', resumo: 'Magias, Grimórios e Feitiços', essencial: ['Cada personagem tem uma magia, e cada magia tem vagas limitadas.', 'O Grimório guarda os feitiços; existem cinco tipos.', 'Você escreve o feitiço e o Conselho Mágico aprova pelo bot.'] },
  { slug: 'mana', cap: 'III', num: '07', titulo: 'Mana', resumo: 'Reserva, custo, Técnicas de Mana e Runas', essencial: ['A Mana é a reserva que paga os feitiços; o Controle dá desconto de até 50%.', 'Com Mana zero vem a Exaustão Mágica.', 'Técnicas de Mana se aprendem fora do Grimório, por Estágio e Controle.', 'Diamond tem técnicas próprias, como a Respiração de Mana, e leva as Runas mais longe que qualquer reino.'] },
  { slug: 'atributos', cap: 'III', num: '08', titulo: 'Atributos', resumo: 'Acréscimos e confronto sem dados', essencial: ['Três atributos do corpo (Força, Resistência, Velocidade) e três da mana.', 'Classificações são patamares; Acréscimos marcam a diferença dentro deles.', 'Num confronto não se rola nada: compara-se classificação, depois Acréscimos.'] },
  { slug: 'ferimentos', cap: 'III', num: '09', titulo: 'Ferimentos', resumo: 'A trilha de vida, curas e curadores', essencial: ['Cada golpe que passa a Resistência ocupa uma casa da Trilha de Ferimentos: 3 Leves, 2 Moderados, 1 Grave, 1 Crítico.', 'Ferimentos acumulam, sobem de grau e pioram sem tratamento.', 'Curar exige Conhecimento, feitiço ou um Mago Curandeiro.'] },
  { slug: 'discos', cap: 'III', num: '10', titulo: 'Discos', resumo: 'Discos de Engaste: os chips de Diamond', essencial: ['Discos são runas gravadas em cristal e engastadas no corpo: cada um faz uma coisa só, sem gastar Mana.', 'O corpo aguenta 2 discos (mais 1 no 6º e no 3º Estágio) e uma Rejeição limitada.', 'Nenhum disco dá Acréscimo, e os mais fortes têm Instabilidade: no limite, o efeito colateral acontece.'] },
  { slug: 'progressao', cap: 'IV', num: '11', titulo: 'Progressão', resumo: 'Treinos, Estudos e Estágios', essencial: ['Treinos sobem atributos; Estudos dão Conhecimentos.', 'Pontos de Estágio levam do 9º ao 1º Estágio.', 'A partir do 5º Estágio é preciso Cristal de Mana.'] },
  { slug: 'conhecimentos', cap: 'IV', num: '12', titulo: 'Conhecimentos', resumo: 'Comuns, Incomuns e Perdidos', essencial: ['Conhecimentos são o que o personagem sabe fazer fora da magia.', 'Comuns se estudam em Bibliotecas; Incomuns e Perdidos vêm de giros, Cápsulas e eventos.', 'Eles abrem Profissões e a cura de Ferimentos.'] },
  { slug: 'criaturas', cap: 'IV', num: '13', titulo: 'Criaturas', resumo: 'Domação, Assimilação e Familiares', essencial: ['Toda criatura tem um Rank, como as missões.', 'Domar exige cenas escritas, não sorte.', 'Assimilação e Familiar das Bruxas são vínculos mais fundos.'] },
  { slug: 'missoes', cap: 'IV', num: '14', titulo: 'Missões', resumo: 'Do Rank F ao Rank S, pelo bot', essencial: ['O bot publica as missões por Rank, de F a S.', 'Cada jogador faz até 2 missões a cada 24 horas.', 'Missões pagam Méritos ou Antiméritos, Yuls e Cristais.'] },
  { slug: 'generais', cap: 'IV', num: '15', titulo: 'Carreiras', resumo: 'Generais Brilhantes e Veio Negro', essencial: ['Servir ao Rei como General Brilhante ou lucrar no Veio Negro.', 'Cada lado tem três patentes e sua moeda de honra.', 'O posto de General pode ser tomado em desafio.'] },
  { slug: 'profissoes', cap: 'V', num: '16', titulo: 'Profissões', resumo: 'Doze ofícios, licenças e salário', essencial: ['Uma Profissão principal (e uma secundária no 6º Estágio), aberta por um Conhecimento e uma licença.', 'Cada Jornada de Trabalho (um post de 500 caracteres por ciclo) paga o salário do grau.', 'Aprendiz, Oficial e Mestre: só o Mestre faz Obras-Primas e abre Corporação.'] },
  { slug: 'mineracao', cap: 'V', num: '17', titulo: 'Mineração', resumo: 'Jazidas, Minas Profundas e refino', essencial: ['Cada Jornada numa jazida rende uma quantidade fixa de Recursos, sem dados.', 'Toda jazida tem uma Reserva e se esgota; o Achado vem a cada 10 Jornadas.', 'As Minas Profundas pagam mais e cobram em Ferimentos.'] },
  { slug: 'itens', cap: 'V', num: '18', titulo: 'Itens Mágicos', resumo: 'Qualidade, forja e encantamentos', essencial: ['Material, artesão e encantamentos definem um item.', 'A qualidade vai de Comum (+0) a Obra-Prima (+2 Acréscimos).', 'Encantamentos são gravados com Pó de Cristal, que vem das minas.'] },
  { slug: 'terras', cap: 'V', num: '19', titulo: 'Terras', resumo: 'Lotes, minas, estufas e feudos', essencial: ['Quase toda a terra de Diamond morreu: o Vigor do solo decide o que ela produz.', 'Compre um lote, construa Oficina, Loja ou Estufa e dê bônus ao seu ofício.', 'Toda terra paga 2% do valor por semana ao Tesouro.'] },
  { slug: 'economia', cap: 'V', num: '20', titulo: 'Economia', resumo: 'Yuls, mercado, impostos e contratos', essencial: ['Tudo é contado em Yuls; Cristais valem como ouro.', 'O preço muda por região e por evento; o Fosso não cobra imposto.', 'Contratos registrados no bot valem como lei, e quebrá-los custa caro.'] },
  { slug: 'comecar', cap: 'VI', num: '21', titulo: 'Começar', resumo: 'Criação de personagem e Ficha', essencial: ['Entre no Discord e use /criar-personagem.', 'O bot gera três modelos; você gira Magias, Conhecimentos e Grimório e escolhe um.', 'Escreva a história, receba a ficha e acorde em Diamond.'] },
];

export const regioes = [
  { nome: 'A Coroa', quem: 'Realeza e alto comando', texto: 'Valcristal, a capital. O Palácio de Cristal, a Forja dos Generais Brilhantes e a Torre dos Grimórios. Almas da Realeza renascem aqui.' },
  { nome: 'O Lapidário', quem: 'Nobreza e cientistas', texto: 'Cidades-laboratório, academias, o Grande Arquivo e as Câmaras de Mana, as únicas zonas de Forte Mana do reino. Almas da Nobreza renascem aqui.' },
  { nome: 'Os Veios', quem: 'Plebe', texto: 'Vilarejos mineiros em volta de minas esgotadas. Fome, Doença de Mana e trabalho forçado. Almas da Plebe renascem aqui.' },
  { nome: 'O Fosso', quem: 'Ninguém admite', texto: 'Mercado negro nas galerias abaixo dos Veios. Cápsulas de Conhecimento, contrabando de Cristais e o Veio Negro.' },
  { nome: 'Fronteira Cinzenta', quem: 'Soldados e contrabandistas', texto: 'A divisa com Clover e a Zona Neutra. Postos militares, ruínas e rotas de fuga.' },
];

export const eventosDiamond = [
  ['Exame da Forja', 'Seleção anual dos Generais Brilhantes.'],
  ['Colheita Cristalina', 'Expedição às últimas jazidas; recompensa em Cristais.'],
  ['Inverno da Fome', 'Crise de suprimentos; missões de escolta e de saque.'],
  ['Exposição Real', 'Competição de pesquisa no Lapidário; recompensa em Conhecimentos.'],
  ['Ofensiva da Fronteira', 'Guerra aberta contra Clover.'],
];

export const reinos = [
  {
    nome: 'Diamond', simbolo: '◆', pos: 'Oeste', foco: true,
    texto: 'Esgotou a própria terra e sobrevive de ciência, guerra e dos últimos Cristais de Mana. É aqui que toda alma renasce.',
    dados: { extensao: 180000, populacao: 1650000, densidade: '9,17', riqueza: '240.000.000 (em queda)', mana: 'Baixa', cobertura: 'Baixa', desenvolvimento: 'Alto (científico)', ambientes: 'Planaltos áridos, minas esgotadas, cidades-laboratório', povo: 'Humanos' },
  },
  {
    nome: 'Clover', simbolo: '♣', pos: 'Leste',
    texto: 'O reino mais populoso e o alvo preferido de Diamond. Dividido entre Região Nobre, Comum e Esquecida; berço dos Cavaleiros Mágicos.',
    dados: { extensao: 260000, populacao: 5200000, densidade: '20,00', riqueza: '610.000.000', mana: 'Alta', cobertura: 'Alta', desenvolvimento: 'Alto', ambientes: 'Planícies, florestas, cidades muradas', povo: 'Humanos' },
  },
  {
    nome: 'Heart', simbolo: '♥', pos: 'Sul',
    texto: 'Florestas, rios e mana abundante. Seus magos têm aptidão excepcional. Diamond cobiça sua mana e teme seus espíritos.',
    dados: { extensao: 230000, populacao: 1200000, densidade: '5,22', riqueza: '390.000.000', mana: 'Excepcional', cobertura: 'Muito alta', desenvolvimento: 'Excepcional', ambientes: 'Florestas, rios e lagos', povo: 'Humanos' },
  },
  {
    nome: 'Spades', simbolo: '♠', pos: 'Norte',
    texto: 'O maior reino, frio e montanhoso, hoje dominado por uma organização terrorista. Seus refugiados chegam a Diamond pela Zona Neutra.',
    dados: { extensao: 540000, populacao: 2700000, densidade: '5,00', riqueza: '480.000.000', mana: 'Moderada', cobertura: 'Média', desenvolvimento: 'Alto', ambientes: 'Tundras, montanhas, fortalezas', povo: 'Humanos' },
  },
];

export const racas = [
  {
    nome: 'Humanos', atributos: ['Comum', 'Comum', 'Comum', 'Pela classe', 'Pela classe', 'Pela classe'], obtencao: 'Modelos do /criar-personagem (comum)',
    texto: 'A raça mais numerosa e dispersa do mundo, definida pela adaptação. A ligação com a mana é limitada, e por isso os Humanos aprenderam a estudá-la e a usá-la em tudo, da guerra à medicina.',
    habilidades: [
      ['Espírito Inconformado', 'Na criação, o modelo Humano recebe 1 giro extra de Magia e 1 de Conhecimento, só para ele.'],
      ['Elo Humano', 'Com quatro ou mais aliados Humanos na mesma cena e grupo: +1 Acréscimo em Força, Resistência e Velocidade.'],
    ],
  },
  {
    nome: 'Anões', atributos: ['Incomum', 'Incomum', 'Comum', 'I', 'II', '10%'], obtencao: 'Modelos (raro), sorteios e eventos',
    texto: 'Quase extintos depois de séculos caçados pelos Humanos. Em Diamond, são capturados para os laboratórios; um Anão Marcado vive escondido. Forja, comida farta e verdade definem seu povo.',
    habilidades: [
      ['Discernimento Anão', 'Distingue o verdadeiro do falso; mentiras não funcionam contra ele.'],
      ['Visão Verdadeira', 'Enxerga através de ilusões enquanto tiver mais Mana atual que quem as mantém.'],
      ['Glutão', 'Uma refeição farta recupera 25% da Mana máxima, uma vez por cena.'],
      ['Limitações', 'Nunca passa de 1,50 m, nem por magia. Só pertence a famílias anãs.'],
    ],
  },
  {
    nome: 'Bruxas', atributos: ['Comum', 'Comum', 'Comum', 'II', 'I', '10%'], obtencao: 'Modelos (raro), sorteios e eventos',
    texto: 'Criadas pela magia da Rainha das Bruxas e educadas nas artes obscuras. Uma Bruxa Marcada renasce longe da Floresta das Bruxas e, por isso, já nasce sob a Maldição da Rainha.',
    habilidades: [
      ['Aptidão Arcana', 'Na criação, o modelo Bruxa recebe 2 giros extras de Magia, só para ele.'],
      ['Pacto Familiar', 'Cria um familiar com um feitiço que não ocupa espaço no Grimório.'],
      ['Conhecimento Proibido', 'Começa com Artes Obscuras, sem ocupar espaço.'],
      ['Maldição da Rainha', 'Não pode gerar filhos.'],
    ],
  },
  {
    nome: 'Elfos', atributos: ['Sobre-Humana', 'Sobre-Humana', 'Sobre-Humana', 'III', 'V', '35%'], obtencao: 'Família Licht, Reencarnação Élfica, sorteios e eventos',
    texto: 'A raça mais dotada de magia que já existiu, exterminada pelos Humanos. Foram os primeiros Marcados conhecidos. Em Diamond, são caçados como cobaias de valor inestimável.',
    habilidades: [
      ['Comunhão com a Mana', 'Regenera Mana em dobro e paga metade do custo de tudo.'],
      ['Aprendizado Natural', 'Aprende Técnicas de Mana sozinho, com metade dos treinos.'],
      ['Refinamento Superior', 'Manipula a magia com a precisão de um Estágio acima.'],
      ['Corpo Mágico', 'Acessa a Forma Mágica um Estágio antes.'],
      ['Conhecimento Proibido', 'Começa com Artes Obscuras e Artes Demoníacas, sem ocupar espaços.'],
    ],
  },
  {
    nome: 'Híbridos', atributos: ['Comum', 'Comum', 'Comum', 'Pela classe', 'Pela classe', 'Pela classe'], obtencao: 'Primeiro membro Pappitson, famílias de Bruxa que aceitam híbridas, sorteios e eventos',
    texto: 'Filhos de Humano com Anão ou com Bruxa. Carregam o dom de um povo e a desconfiança dos dois. Em Diamond, onde Anões e Bruxas são cobaias, um Híbrido Marcado esconde metade de quem é.',
    habilidades: [
      ['Sangue Dividido', 'Escolhe uma habilidade da raça-mãe (Anão ou Bruxa), nunca as Limitações nem a Maldição da Rainha.'],
      ['Adaptável', 'Na criação, o modelo Híbrido recebe 1 giro extra de Magia ou de Conhecimento, só para ele.'],
      ['Entre Dois Povos', 'Famílias de sangue puro (Enoteca, Frankenstein, Alonargez) não aceitam Híbridos.'],
      ['Despertar Anão', 'Um Híbrido de Anão pode despertar o Milagre Hibridismo (ver Milagres).'],
    ],
  },
];

export const classesSociais = [
  { nome: 'Plebe', regiao: 'Os Veios', dinheiro: '200 Yuls', pm: 'I', mana: 'I', controle: '0%' },
  { nome: 'Nobreza', regiao: 'O Lapidário', dinheiro: '1.000 Yuls', pm: 'I', mana: 'II', controle: '5%' },
  { nome: 'Realeza', regiao: 'A Coroa', dinheiro: '5.000 Yuls', pm: 'II', mana: 'II', controle: '10%' },
];

// classe: Realeza | Nobreza | Plebe ; raridade: Comum | Rara | Sorteio
export const familias = [
  { nome: 'Kira', classe: 'Realeza', origem: 'Clover', raca: 'Humanos', raridade: 'Rara', lema: 'Família governante de Clover, juízes do trono.', magias: 'Balança; Luz só para o primeiro Marcado', heranca: ['Milagre Amado pela Mana', 'Conhecimento em Retórica', 'Zona de Mana um Estágio antes'], marco: '4º Estágio: Conhecimento em Arcanologia' },
  { nome: 'Vermillion', classe: 'Realeza', origem: 'Clover', raca: 'Humanos', raridade: 'Rara', lema: 'Linhagem real de sangue quente.', magias: 'Fogo, Plantas, Cerejeira', heranca: ['Conhecimento em Combate', 'Força e Resistência +1 classificação'], marco: '5º Estágio: Milagre Mana Distinta (Mana Quente), se não tiver Milagre' },
  { nome: 'Silva', classe: 'Realeza', origem: 'Clover', raca: 'Humanos', raridade: 'Rara', lema: 'Casa real ligada aos Elfos, obcecada por controle.', magias: 'Mercúrio, Névoa, Água', heranca: ['Percepção de Mana', 'Conhecimento em Magia', 'Forma Mágica um Estágio antes'], giro: '30% de Milagre Vaso Defeituoso', marco: '8º Estágio: o primeiro com Água recebe o feitiço Leviatã (Grau III)' },
  { nome: 'Grinberryal', classe: 'Realeza', origem: 'Spades', raca: 'Humanos', raridade: 'Sorteio', vagas: 3, lema: 'Antiga família real de Spades, derrubada pela Tríade.', magias: 'Sol, Lua, Estrela (se não houver usuário)', heranca: ['Milagre Amado pela Mana', 'Mana +1 nível', 'Conhecimento em Magia'], marco: '6º Estágio: pode reivindicar a coroa de Spades em evento' },
  { nome: 'Lolopechka', classe: 'Realeza', origem: 'Heart', raca: 'Humanos', raridade: 'Rara', lema: 'Reina em Heart, protegida pelo espírito da água.', magias: 'Água', heranca: ['Percepção de Mana', 'Matriz Rúnica sem requisito', 'Conhecimento em Magia'], marco: '7º Estágio: o primeiro com Água pode firmar pacto com Undine' },
  { nome: 'Zogratis', classe: 'Realeza', origem: 'Spades', raca: 'Humanos', raridade: 'Sorteio', vagas: 3, lema: 'Tomaram Spades e lideram a Tríade.', magias: 'Sangue, Ossos, Corpo', heranca: ['Grimório Demoníaco', 'Conhecimento em Artes Demoníacas', 'Força e Resistência +1 classificação', 'Traço Presença Impactante'], marco: '4º Estágio: pode disputar a liderança da Tríade' },
  { nome: 'Faust', classe: 'Nobreza', origem: 'Clover', raca: 'Humanos', raridade: 'Sorteio', lema: 'Estudaram demônios até serem destruídos por um.', magias: 'Sombras, Luz', heranca: ['Conhecimento em Artes Demoníacas', 'Conhecimento em Oratória', 'Poder Mágico +1 nível'], marco: '7º Estágio: o Grimório vira Demoníaco' },
  { nome: 'Libardirt', classe: 'Nobreza', origem: 'Diamond', raca: 'Humanos', raridade: 'Rara', lema: 'Cientistas reais de Diamond, mestres da costura de grimórios.', magias: 'Recombinação, Gel', heranca: ['Conhecimento Científico', 'Costura Grimórios na metade do tempo e do custo', 'Laboratório próprio (Câmara de Mana)'], giro: '50% de trocar a magia por Modificação', marco: '6º Estágio: Conhecimento em Ciências Aplicadas' },
  { nome: 'Vangeance', classe: 'Nobreza', origem: 'Clover', raca: 'Humanos', raridade: 'Comum', lema: 'Um atributo mágico incomum e um capitão lendário.', magias: 'Plantas, Cerejeira', heranca: ['Poder Mágico +1 nível'], giro: 'Giro de Linhagem: Árvore do Mundo', marco: '4º Estágio: Milagre Dupla Alma (1 vaga), de qualquer raça' },
  { nome: 'Boismortier', classe: 'Nobreza', origem: 'Clover', raca: 'Humanos', raridade: 'Comum', lema: 'Artistas de magia poderosa e desgastante.', magias: '—', heranca: ['Milagre Amado pela Mana', '+1 Acréscimo em todos os feitiços'], giro: '60% de Pintura; 15% de Reencarnação Élfica' },
  { nome: 'Voltia', classe: 'Nobreza', origem: 'Clover', raca: 'Humanos', raridade: 'Comum', lema: 'Sentem a mana por instinto e vivem pela batalha.', magias: 'Relâmpago', heranca: ['Percepção de Mana', 'Conhecimento em Combate', 'Método de Mana e Forma Mágica com metade dos treinos'], marco: '7º Estágio: Fúria de Batalha' },
  { nome: 'Roselei', classe: 'Nobreza', origem: 'Clover', raca: 'Humanos', raridade: 'Comum', lema: 'Marcados por uma maldição que atravessa gerações.', magias: 'Roseiras, Terra, Plantas', heranca: ['Corpo Amaldiçoado', 'Método de Mana e Forma Mágica um Estágio antes'], giro: '40% de Reencarnação Élfica' },
  { nome: 'Agrippa', classe: 'Plebe', origem: 'Clover', raca: 'Humanos', raridade: 'Comum', lema: 'Pele pálida, olhos anelados e a Magia de Maldição.', magias: 'Veneno', heranca: ['Conhecimento em Maldição', 'Feitiços de Maldição +1 Acréscimo', 'Anulam a parte ruim do Corpo Amaldiçoado'], marco: 'Os 3 primeiros criam uma maldição própria' },
  { nome: 'Ideale', classe: 'Plebe', origem: 'Clover', raca: 'Humanos', raridade: 'Comum', lema: 'Os primeiros plebeus a vestir um manto de cavaleiro.', magias: 'Fogo, Fumaça', heranca: ['Conhecimento em Armadilha', '+4 espaços só para Armadilha'], giro: '40% de Matriz Rúnica; 8% de Amado pela Mana' },
  { nome: 'Lichita', classe: 'Plebe', origem: 'Clover', raca: 'Humanos', raridade: 'Comum', lema: 'Uma mulher que se isolou para não sugar a mana dos outros.', magias: '—', heranca: ['Resistência +1 classificação'], giro: '15% Sem Magia; com magia, 33% de Doença de Mana', marco: '8º Estágio: o primeiro Sem Magia recebe o Demônio da Antimagia' },
  { nome: 'Sukehiro', classe: 'Plebe', origem: 'Terra do Sol', raca: 'Humanos', raridade: 'Sorteio', lema: 'Estrangeiros que lutam com lâmina e Ki.', magias: '—', heranca: ['Leitura de Ki', 'Conhecimento em Esgrima', 'Força +1 classificação', 'Katana de qualidade Incomum'], marco: '5º Estágio: os dois primeiros podem receber Escuridão' },
  { nome: 'Swallowtail', classe: 'Plebe', origem: 'Clover', raca: 'Humanos', raridade: 'Rara', lema: 'Seladores antigos de Clover. A última da linhagem passou séculos selada no corpo de uma ave.', magias: 'Selamento', heranca: ['Função Perdida Selamento, sem requisito', 'Selo Rúnico sem requisito de Estágio', 'Conhecimento em Magia'], marco: '5º Estágio: Forma Selada. Vira uma ave por até 1 cena: não lança feitiços, e ninguém sente a sua mana' },
  { nome: 'Valerian', classe: 'Plebe', origem: 'Spades', raca: 'Humanos', raridade: 'Rara', lema: 'Curam com qualquer magia.', magias: 'Corpo', heranca: ['Conhecimento Medicinal', 'Reversão: qualquer feitiço recebe Restauração', '+1 classificação num atributo físico'] },
  { nome: 'Frankenstein', classe: 'Plebe', origem: 'Diamond', raca: 'Anões', raridade: 'Comum', lema: 'Anões escravizados nos laboratórios de Diamond.', magias: '—', heranca: ['Força e Resistência +1 classificação', 'Arma pesada de qualidade Épica', 'Não pode ser Mago Artífice'] },
  { nome: 'Pappitson', classe: 'Plebe', origem: 'Clover', raca: 'Anões', raridade: 'Comum', lema: 'Anões antigos escondidos entre plebeus.', magias: '—', heranca: ['Resistência +1 classificação', 'Estudos e Técnicas pela metade'], marco: '7º Estágio: Hibridismo e Magia de Comida' },
  { nome: 'Alonargez', classe: 'Plebe', origem: 'Reino Subterrâneo', raca: 'Anões', raridade: 'Rara', lema: 'A família real dos Anões, criadores da ciência.', magias: '—', heranca: ['Resistência +1 classificação', 'Traço Resistência a Malefícios', 'Conhecimento Científico', 'Poder Mágico +1 nível'], marco: '6º Estágio: Magia de Forja (3 primeiros)' },
  { nome: 'Enoteca', classe: 'Plebe', origem: 'Floresta das Bruxas', raca: 'Bruxas', raridade: 'Comum', lema: 'A família real das Bruxas.', magias: 'Fios', heranca: ['Conhecimento em Maldição', 'Mana +1 nível'], giro: '30% de trocar a magia por Sangue', marco: '6º Estágio: Fio Vermelho do Destino; 4º: Rainha das Bruxas' },
  { nome: 'Trinity', classe: 'Plebe', origem: 'Floresta das Bruxas', raca: 'Bruxas', raridade: 'Rara', lema: 'Linhagem apagada, construtora das defesas da floresta.', magias: 'Barreiras', heranca: ['Milagre Amado pela Mana', 'Traço Presença Impactante', 'Conhecimento em Magia', '+3 espaços só para Criação'] },
  { nome: 'Unsworth', classe: 'Plebe', origem: 'Clover', raca: 'Bruxas', raridade: 'Comum', lema: 'Bruxas que fugiram e fizeram nome entre os humanos.', magias: 'Ilusão (qualquer Unsworth pode ter)', heranca: ['Percepção de Mana', 'Uma varinha', 'Conhecimento em Magia no 7º Estágio'], giro: 'Giro de Linhagem: Sonhos; se já houver usuário, vira Ilusão' },
  { nome: 'Licht', classe: 'Plebe', origem: 'Elfos', raca: 'Elfos', raridade: 'Sorteio', lema: 'Almas élficas que voltam escondidas em corpos novos.', magias: 'Luz, Espadas', heranca: ['+3 feitiços iniciais', 'Poder Mágico +1 nível', 'Forma Mágica um Estágio antes'], giro: '45% de Terceiro Olho', marco: '6º Estágio: Conhecimento em Arcanologia' },
];

export const classesMago = [
  { nome: 'Mago Arcano', papel: 'Magia pura e feitiços à distância', conhecimento: 'Conhecimento em Magia', passiva: ['Fluxo Refinado', 'Feitiços externalizados custam 10% menos Mana.'], avancada: ['Arquimago', '+1 Acréscimo em feitiços externalizados e mantém dois feitiços sustentados.'] },
  { nome: 'Mago de Batalha', papel: 'Linha de frente, armas e corpo reforçado', conhecimento: 'Combate ou Esgrima', passiva: ['Corpo de Guerra', 'Reforço Corporal recebe 100% dos Acréscimos do Poder Mágico.'], avancada: ['Mago de Vanguarda', '+1 Acréscimo permanente de Resistência; Reforço Corporal custa 15% menos.'] },
  { nome: 'Mago das Sombras', papel: 'Infiltração, espionagem e assassinato', conhecimento: 'Conhecimento em Oratória', passiva: ['Passo Silencioso', 'Só é percebido por quem tem Controle maior que o seu.'], avancada: ['Lâmina Oculta', 'Primeiro ataque contra alvo desprevenido: +1 Acréscimo e sem reação.'] },
  { nome: 'Mago Balístico', papel: 'Projéteis e longo alcance', conhecimento: 'Conhecimento em Arquearia', passiva: ['Trajetória', 'Projéteis com alcance dobrado e +1 Acréscimo de Velocidade.'], avancada: ['Artilheiro Arcano', 'Disparo carregado: +1 Acréscimo de Força e alcance triplicado.'] },
  { nome: 'Mago Curandeiro', papel: 'Cura e suporte', conhecimento: 'Conhecimento Medicinal', passiva: ['Mãos Restauradoras', 'Restauração custa 20% menos e cura 1 turno mais rápido.'], avancada: ['Sacerdote da Mana', 'Cura Ferimentos Graves e transfere até 20% da Mana por turno.'] },
  { nome: 'Mago do Caos', papel: 'Potência bruta e instável', conhecimento: 'Conhecimento em Debilitação', passiva: ['Instabilidade', '+1 Acréscimo em todos os feitiços, que custam 10% a mais.'], avancada: ['Arauto do Caos', 'Uma vez por cena, lança um feitiço um Grau acima do limite, pagando o dobro.'] },
  { nome: 'Mago Conjurador', papel: 'Invocações, golens e familiares', conhecimento: 'Conhecimento em Conjuração', passiva: ['Legião', '+2 no limite de conjurados; cada um com +1 Acréscimo.'], avancada: ['Mestre Invocador', 'Conjurados duram 3 turnos após o Grimório fechar.'] },
  { nome: 'Mago Artífice', papel: 'Itens mágicos, mecanismos e ciência', conhecimento: 'Produção ou Científico', passiva: ['Oficina', 'Produções 20% mais rápidas; grava um feitiço num objeto.'], avancada: ['Engenheiro Arcano', 'Recebe Engenharia sem ocupar espaço.'] },
];

export const milagres = [
  { nome: 'Mana Distinta', texto: 'A mana tem uma natureza própria: densa, quente, cortante. Definida com o Conselho Mágico.', efeitos: ['Todos os feitiços carregam a propriedade.', 'Uma vez por cena, +1 Acréscimo num atributo coerente com ela.'] },
  { nome: 'Anomalia Mágica', texto: 'Entende a magia por instinto e tem menos limites que os outros.', efeitos: ['Técnicas de Mana com metade dos treinos e alcance ampliado.', 'Feitiços custam 20% menos e começam com Maestria 2.', 'Lutas extremas contam como treinos de Técnica.'] },
  { nome: 'Dupla Alma', texto: 'Duas almas dividem o mesmo corpo, acorrentadas uma à outra.', efeitos: ['Alma Forte e Alma Fraca, cada uma com magia e grimório.', 'A troca custa o turno e troca feitiços e personalidade.', 'A Alma Forte pode se disfarçar da outra.'] },
  { nome: 'Insignificância', restricao: 'Só Plebe', texto: 'Nasceu quase sem mana num mundo onde a magia é tudo. No lugar da força, engenho.', efeitos: ['Mana um nível abaixo da classe (mínimo 50).', 'Matriz Rúnica sem requisito e sem limite de runas.', 'Percepção de Mana desde o início.', 'Nobres subestimam suas armadilhas.'] },
  { nome: 'Vaso Defeituoso', texto: 'Correntes enferrujadas: falta controle e sobra potência.', efeitos: ['Cada nível de Mana vale o dobro.', 'Poder Mágico +1 nível.', 'Começa com -10% de Controle (mínimo 0%) e nunca passa de 70%.', 'Treinos de Controle rendem metade.'] },
  { nome: 'Amado pela Mana', texto: 'A mana reconhece o personagem e flui com mais naturalidade ao seu redor.', efeitos: ['Mana e Poder Mágico +1 nível.', 'Treinos mágicos e de Controle contam em dobro.', 'Pode receber um Grimório Lendário.'] },
  { nome: 'Tengentsu', texto: 'Técnica ocular do País do Sol que lê o Ki. O preço é a própria magia.', efeitos: ['Vê com precisão tudo ao redor no presente.', 'Lê intenções; nunca é pego desprevenido.', 'Renuncia à mana: sem feitiços nem Técnicas.'] },
  { nome: 'Corpo Amaldiçoado', restricao: 'Roselei, Boost ou sorteio', texto: 'Uma bênção de nascença paga com uma perda do mesmo tamanho. O corpo é mais forte num ponto e amaldiçoado nesse mesmo ponto.', efeitos: ['+1 Acréscimo permanente num atributo à escolha, físico ou mágico.', 'O jogador escreve a maldição ligada a esse atributo, maior que a bênção, e o Conselho Mágico aprova.', 'A família Agrippa anula a parte ruim.'] },
  { nome: 'Fúria de Batalha', restricao: 'Voltia (7º Estágio), Boost ou sorteio', texto: 'O corpo pede luta. A adrenalina cresce quando o combate fica sério e explode quando a morte chega perto.', efeitos: ['Em combate: +1 Acréscimo em Força, Velocidade e Poder Mágico.', 'Imune a Presença Impactante.', 'Com Ferimento III ou pior, entra em Fúria: +1 classificação em todos os atributos por 4 turnos. Depois desmaia.'] },
  { nome: 'Doença de Mana', restricao: 'Lichita (giro)', texto: 'Uma doença antiga dos Veios. O corpo suga a mana de quem está perto, sem querer, e não escolhe entre amigo e inimigo.', efeitos: ['No próprio turno, drena 20 de Mana de cada pessoa a até 1/3 do alcance da magia. Fora de combate, bem menos.', 'Drena 2 Acréscimos de Resistência por turno de quem estiver a até 1/4 do alcance.', 'Os próprios Ferimentos agravam um grau mais rápido.'] },
  { nome: 'Reencarnação Élfica', restricao: 'Giro de Linhagem, Boost, sorteios e eventos', texto: 'Uma alma élfica dorme dentro do Marcado, esperando a hora de voltar.', efeitos: ['Enquanto o elfo dorme: +1 Acréscimo em Mana, Poder Mágico e Controle.', 'Quando a Reencarnação acontece em evento: +1 nível em todos os atributos mágicos, mas o elfo controla o corpo até a alma dele sair.', 'Depois, o personagem pode virar Elfo (ver Raças).'] },
  { nome: 'Hibridismo', restricao: 'Pappitson (7º Estágio) ou sorteio', texto: 'O sangue anão antigo acorda com o ódio. O Marcado se conecta ao seu anão interior e vira outra coisa por alguns turnos.', efeitos: ['Ativado por uma emoção negativa forte e plausível, causada por outro ser.', 'Troca a magia por uma segunda, Lendária ou menor e inversa à original (Água vira Fogo, Fogo vira Plantas), por 5 turnos.', '+1 classificação em todos os atributos durante esses 5 turnos.'] },
  { nome: 'Absorção e Emissão', restricao: 'Só em Diamond', texto: 'Um corpo refeito em cirurgia para engolir magia alheia e devolvê-la.', efeitos: ['Absorve feitiços que atingem o corpo e guarda a Mana.', 'Emite a energia como ataque do mesmo Grau.', 'Perde a própria magia; excesso causa Ferimento II.'] },
];

export const tracos = [
  ['Físico Superior', '+1 Acréscimo de Força'],
  ['Agilidade Inigualável', '+1 Acréscimo de Velocidade'],
  ['Resistência Suprema', '+1 Acréscimo de Resistência'],
  ['Vigor Superior', '+0,5 de Resistência e ignora Ferimentos II'],
  ['Controle Corporal', '+0,5 em Reforço Corporal; ignora um Ferimento III por 3 turnos'],
  ['Mira Divina', 'Alcance +12%; ponto fraco dá +1 Acréscimo; teleguiados no 6º Estágio'],
  ['Sentidos Apurados', 'Um sentido alcança 35 m (visão, 50 m) e detecta furtivos'],
  ['Inteligência Avançada', 'Após 4 turnos, prevê movimentos e acha a fraqueza de um feitiço'],
  ['Presença Impactante', 'Uma vez por cena, -1 Acréscimo em oponentes por 3 turnos'],
  ['Determinação Total', 'Imune a Presença Impactante; Estudos 10% mais rápidos'],
  ['Resistência a Malefícios', '+1 de Resistência contra veneno, maldição e queimadura'],
  ['Alma Indomável', '+0,5% extra em cada treino de Controle; ao despertar, abre o Feitiço de Alma, numa das Vias ou num desenhado pelo jogador'],
  ['Ligação Natural', 'Entende criaturas; Domação com uma cena a menos, +1 no limite de vinculadas e Assimilação 2 turnos mais longa'],
];

export const classificacoes = [
  { nome: 'Comum', forca: 'Objetos frágeis', resistencia: 'Impactos do dia a dia', vel: 10 },
  { nome: 'Incomum', forca: 'Portas de madeira e móveis', resistencia: 'Golpes que feririam um humano', vel: 20 },
  { nome: 'Sobre-Humana', forca: 'Portas reforçadas e paredes simples', resistencia: 'Golpes que quebram paredes frágeis', vel: 40 },
  { nome: 'Extrema', forca: 'Paredes inteiras e pequenos pilares', resistencia: 'Golpes que derrubam paredes', vel: 70 },
  { nome: 'Colossal', forca: 'Grande parte de uma casa pequena', resistencia: 'Ataques que destroem partes de uma casa', vel: 100 },
  { nome: 'Monstruosa', forca: 'Uma casa de médio porte', resistencia: 'Ataques que destroem uma casa média', vel: 140 },
  { nome: 'Titânica', forca: 'Um prédio pequeno', resistencia: 'Ataques que derrubam um prédio', vel: 175 },
  { nome: 'Transcendental', forca: 'Vários prédios', resistencia: 'Devastação de área', vel: 200 },
];

export const manaNiveis = [100, 200, 350, 550, 800, 1100, 1450, 1850, 2200, 2500];
export const romanos = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export const controleFaixas = [
  ['0–10%', 1], ['11–25%', 3], ['26–35%', 5], ['36–45%', 7], ['46–55%', 9],
  ['56–65%', 10], ['66–75%', 11], ['76–85%', 12], ['86–95%', 13], ['96–100%', 15],
];

export const acrescimosFaixas = [
  ['1–2', 'Vantagem muito pequena, perceptível em confrontos equilibrados'],
  ['3–4', 'Vantagem moderada sobre quem tem o mesmo atributo-base'],
  ['5–6', 'Vantagem elevada; supera claramente a mesma classificação'],
  ['7–8', 'Vantagem superior; perto do limite da classificação'],
  ['9', 'Quase na classificação seguinte'],
  ['10', 'Sobe uma classificação completa enquanto mantidos'],
];

export const ferimentos = [
  ['I', 'Leve', 'Só por Acréscimos', 'Nenhum efeito mecânico'],
  ['II', 'Moderado', '1 classificação', '-1 Acréscimo nos atributos físicos'],
  ['III', 'Grave', '2 classificações', '-1 classificação nos atributos físicos e Sangramento'],
  ['IV', 'Crítico', '3 ou mais', 'Incapacitado; morte só quando a cena permite'],
];

export const tecnicas = [
  { nome: 'Percepção de Mana', estagio: '8º', controle: '10%', texto: 'Sente presenças, feitiços e o fluxo de mana num raio de 50 m.' },
  { nome: 'Pele de Mana', estagio: '7º', controle: '20%', texto: 'Envolve o corpo em mana: +1 Acréscimo de Resistência contra magia. 10 de Mana por turno.' },
  { nome: 'Matriz Rúnica', estagio: '6º', controle: '30%', texto: 'Prepara até 5 runas com feitiços gravados, ativadas sem gastar a ação principal.' },
  { nome: 'Método de Mana', estagio: '5º', controle: '40%', texto: 'Puxa a mana do ambiente: regenera 5% por turno mesmo lançando. Em Diamond, só em Zonas de Forte Mana.' },
  { nome: 'Zona de Mana', estagio: '4º', controle: '50%', texto: 'Espalha a própria mana em 20 m e lança feitiços de qualquer ponto dela.' },
  { nome: 'Forma Mágica', estagio: '2º', controle: '70%', texto: 'Funde corpo e magia: +1 Acréscimo nos atributos da magia e Grau máximo +1. 50 de Mana por turno.' },
];

export const magias = [
  { raridade: 'Comum', vagas: 15, chance: 45, lista: ['Fogo', 'Água', 'Terra', 'Vento', 'Relâmpago', 'Plantas', 'Névoa', 'Asas'] },
  { raridade: 'Incomum', vagas: 10, chance: 27, lista: ['Correntes', 'Gelo', 'Óleo Negro', 'Fios', 'Espelhos', 'Fumaça', 'Cristal', 'Algodão', 'Ferro', 'Recombinação', 'Globo Ocular', 'Butoh', 'Gel'] },
  { raridade: 'Rara', vagas: 7, chance: 15, lista: ['Som', 'Ilusão', 'Música', 'Pele', 'Roseiras', 'Mosquito', 'Ossos', 'Cabelo', 'Dados', 'Areia', 'Sombras', 'Mercúrio', 'Aço', 'Espacial Defensiva', 'Veneno'] },
  { raridade: 'Épica', vagas: 5, chance: 9, lista: ['Espacial Ofensiva', 'Feral', 'Olhos', 'Legião', 'Memória', 'Balança', 'Vórtice', 'Comida', 'Sangue', 'Bússola', 'Luz', 'Cerejeira'] },
  { raridade: 'Lendária', vagas: 3, chance: 4, lista: ['Modificação', 'Ar', 'Espadas', 'Selamento', 'Pintura', 'Imitação', 'Corte', 'Barreiras', 'Fungos', 'Cadáver', 'Catalisadora', 'Permeação', 'Corpo'] },
  { raridade: 'Exclusiva', vagas: null, chance: null, lista: ['Tempo', 'Estrelas', 'Sol', 'Lua', 'Original', 'Transmutação', 'Árvore do Mundo', 'Fio Vermelho do Destino', 'Sonhos', 'Jogos', 'Almas', 'Anti-Maldição', 'Chaves', 'Gravidade', 'Escuridão', 'Transcrição Mágica', 'Forja'] },
];

export const grimorios = [
  { nome: 'Comum', iniciais: '3', ganho: '+1', max: '10', mana: '0', distancia: '10 m', obtencao: 'Giro (92%)', texto: 'O modelo tradicional: registro e manifestação da magia. Em Diamond, a capa traz um diamante.' },
  { nome: 'Lendário', iniciais: '4', ganho: '+1, e +1 no 6º, 4º e 2º', max: '14', mana: '250', distancia: '30 m', obtencao: 'Giro (8%), sorteios e eventos', texto: 'Versão raríssima, sinal de potencial excepcional. Trevo de quatro folhas em Clover; diamante puro em Diamond.' },
  { nome: 'Sem Capa', iniciais: '4', ganho: '+2', max: '20', mana: '150', distancia: '3 km', obtencao: 'Sorteios', texto: 'Folhas soltas que flutuam ao redor do usuário, sempre abertas. Não pode ser fechado.' },
  { nome: 'Demoníaco', iniciais: '4 + 4 demoníacos', ganho: 'Como o Lendário', max: '14 + 4', mana: '500 negativa', distancia: '30 m', obtencao: 'Sorteios, eventos e famílias', texto: 'Um Lendário corrompido pelo desespero. Pode abrigar um Demônio.' },
  { nome: 'Costurado', iniciais: '3', ganho: '+1', max: '10', mana: '0', distancia: '10 m', obtencao: 'Criação, sorteios e eventos', texto: 'Dois Grimórios Comuns de magias diferentes costurados em um. Duas magias e duas Funções por feitiço.' },
];

export const custoGrau = [['I', 10], ['II', 25], ['III', 50], ['IV', 100], ['V', 200]];

export const estagios = [
  { n: '9º', req: 'Inicial', ganhos: 'Feitiços até Grau II' },
  { n: '8º', req: '3 PE', ganhos: 'Libera Percepção de Mana' },
  { n: '7º', req: '7 PE', ganhos: 'Grau III; Pele de Mana; Despertar de Traço' },
  { n: '6º', req: '12 PE · Controle 20%', ganhos: 'Classe Avançada; Matriz Rúnica' },
  { n: '5º', req: '17 PE · 3 Cristais Brancos', ganhos: 'Grau IV; Método de Mana; Despertar de Traço' },
  { n: '4º', req: '23 PE · 8 Brancos · Controle 40%', ganhos: 'Zona de Mana; disputa de General' },
  { n: '3º', req: '30 PE · 2 Cristais Negros', ganhos: 'Grau V; Despertar de Traço' },
  { n: '2º', req: '37 PE · 5 Negros · Controle 60%', ganhos: 'Forma Mágica' },
  { n: '1º', req: '44 PE · 1 Cristal Dourado', ganhos: 'Despertar: escolhe um Milagre' },
];

export const treinos = [
  { tipo: 'Físico', sobe: 'Força, Resistência ou Velocidade', duracao: '2 horas', limite: '2 por ciclo', acao: '500 caracteres' },
  { tipo: 'Mágico', sobe: 'Mana ou Poder Mágico', duracao: '1 hora', limite: '2 por ciclo', acao: '400 caracteres' },
  { tipo: 'Controle', sobe: '+1% (+2% em Forte Mana)', duracao: '1 hora', limite: '1 por ciclo', acao: '600 caracteres' },
  { tipo: 'Técnica', sobe: 'Uma Técnica de Mana', duracao: '1 hora', limite: '1 por ciclo', acao: '800 caracteres' },
];

export const conhecimentos = {
  comuns: [
    ['Esgrima', '+1 Acréscimo em Força, Velocidade ou Resistência usando lâmina', 2],
    ['Arquearia', '+1 Acréscimo em Força, Velocidade ou Resistência com arma de disparo', 2],
    ['Combate', '+1 Acréscimo em Força, Velocidade ou Resistência desarmado', 2],
    ['Corporal', '+1 Treino Físico por ciclo (conta como 2); Função Reforço; ciclo de 23 h', 4],
    ['Magia', '+1 Treino Mágico por ciclo (conta como 2); +1% em Controle; Função Barreira', 4],
    ['Medicinal', 'Função Restauração; trata Ferimentos I e II; curas 1 turno mais rápidas', 3],
    ['Debilitação', 'Função Enfraquecimento; debilitações +1 turno', 3],
    ['Conjuração', 'Até 3 conjurados; Função Comunicação', 4],
    ['Produção', 'Sistema de Criação; produções 20% mais rápidas', 4],
    ['Herbalístico', 'Poções; +20% Acréscimos e +1 turno nas poções', 4],
    ['Oratória', 'Lábia, detecção de mentiras e retórica', 3],
    ['Científico', 'Criações científicas; costura Grimórios', '5 · Grande Arquivo'],
  ],
  incomuns: [
    ['Artes Obscuras', 'Mana Negativa do Submundo; +1 Acréscimo em Feitiços Obscuros'],
    ['Esgrima Avançada', '+1 em Força, Velocidade e Resistência com lâmina; +0,5 de Velocidade no golpe'],
    ['Balística', '+1 em Força, Velocidade e Resistência com disparo; +0,5 de Velocidade preparado'],
    ['Arcanologia', '+2 Treinos Mágicos (contam 4); +2% em Controle; +1 nos feitiços; ciclo de 20 h'],
    ['Medicina Avançada', 'Trata Ferimentos III; curas 3 turnos mais rápidas; diagnóstico'],
    ['Debilitação Avançada', 'Debilitações +2 turnos e +1 Acréscimo; combina efeitos'],
    ['Alta Conjuração', 'Até 10 conjurados, cada um com +1 Acréscimo'],
    ['Engenharia', 'Máquinas e estruturas; produção 50% mais rápida; Criação 20% mais barata'],
    ['Botânica Arcana', 'Poções com plantas mágicas; +30% Acréscimos e +3 turnos'],
    ['Fisiologia', '+2 Treinos Físicos (contam 4); Reforço com +1 Acréscimo; ciclo de 20 h'],
    ['Estratégia Marcial', 'Analisa estilos; +1 Acréscimo distribuído com plano; adapta-se em 3 turnos'],
    ['Retórica', 'Distingue verdade e mentira; convence NPCs; tutorias de graça'],
    ['Ciências Aplicadas', 'Criações especializadas; experimentos 50% mais rápidos (sorteios e eventos)'],
    ['Maldição', 'Função Maldição com +1 Acréscimo (sorteios e eventos)'],
    ['Cirurgia Arcana', 'Trata Ferimentos IV, corrige Sequelas e implanta próteses (só no Lapidário)'],
    ['Armadilha', 'Função Armadilha com +1 Acréscimo (sorteios e eventos)'],
    ['Anti-Maldição', 'Função Anti-Maldição com +1; +1 de Resistência contra maldições (sorteios e eventos)'],
  ],
  perdidos: [
    ['Artes Demoníacas', 'Pactos e invocações de Demônios; inclui Artes Obscuras'],
    ['Ressurreição', 'Função Ressurreição'],
    ['Selamento', 'Funções Selamento e Restrição; Restrição 20% mais barata'],
  ],
};

export const capsulas = [
  ['Aleatória', '80% Comum, 20% Incomum; pode repetir', '300 Yuls'],
  ['Direcionada Comum', 'O Conhecimento Comum escolhido', '1.500 Yuls'],
  ['Direcionada Incomum', 'O Incomum escolhido', '5.000 Yuls'],
  ['Perdida', 'Um Conhecimento Perdido, sob encomenda', '30.000+ Yuls'],
];

export const ranks = [
  { r: 'F', perigo: 'Baixíssimo', estagio: '9º', grupo: '1–4', meritos: 1, yuls: 100, cristais: '—' },
  { r: 'E', perigo: 'Baixo', estagio: '9º–8º', grupo: '1–4', meritos: 2, yuls: 250, cristais: '—' },
  { r: 'D', perigo: 'Real', estagio: '8º–7º', grupo: '2–4', meritos: 3, yuls: 500, cristais: '—' },
  { r: 'C', perigo: 'Moderado', estagio: '6º', grupo: '2–5', meritos: 5, yuls: 1000, cristais: '1 Branco' },
  { r: 'B', perigo: 'Alto', estagio: '5º–4º', grupo: '3–5', meritos: 8, yuls: 2500, cristais: '2 Brancos' },
  { r: 'A', perigo: 'Extremo', estagio: '3º–2º', grupo: '3–6', meritos: 12, yuls: 6000, cristais: '1 Negro' },
  { r: 'S', perigo: 'Mundial', estagio: '1º+', grupo: '4–8', meritos: 20, yuls: 15000, cristais: '1 Dourado' },
];

// ——— Textos e regras que as páginas usam (seções 2, 9, 10, 11, 12, 14, 15 e 16 do Cânone) ———

export const segundaVida = {
  titulo: 'A Segunda Vida',
  texto: 'Ninguém sabe por que certas almas voltam, nem por que todas voltam em Diamond. Toda alma que volta traz no corpo uma Marca, um sinal que a mana de Diamond reconhece, e por isso os renascidos são chamados de Marcados. Um Marcado lembra fragmentos da vida anterior: um nome de família, uma magia, um juramento. O resto ele precisa descobrir.',
};

export const primeirosPassos = [
  ['Entre no servidor', 'Leia as regras de RP e apresente-se.'],
  ['Use /criar-personagem', 'O bot gera três modelos com Raça, Família e Classe de Mago definidas. Você gira Magias, Conhecimentos e Grimório e distribui os resultados entre os três. No fim, escolhe um.'],
  ['Escreva a história', 'Nome, aparência (imagem), a vida passada e o renascimento. O Conselho Mágico aprova.'],
  ['Receba a ficha', 'O bot gera a ficha em imagem com /ficha.'],
  ['Comece em Diamond', 'Almas da Realeza renascem na Coroa, da Nobreza no Lapidário e da Plebe nos Veios.'],
  ['Escolha um caminho', 'Treine, estude no Grande Arquivo, faça Missões de Rank F e prepare-se para o Exame da Forja, ou desça ao Fosso e ao Veio Negro.'],
];

export const cristais = [
  { nome: 'Cristal Branco', raridade: 'Raro', uso: '5º e 4º Estágio', texto: 'Brota nas últimas jazidas. Move a economia legal do reino.' },
  { nome: 'Cristal Negro', raridade: 'Raríssimo', uso: '3º e 2º Estágio', texto: 'Formado onde a mana morreu. Vale mais que uma vida nos Veios.' },
  { nome: 'Cristal Dourado', raridade: 'Lenda', uso: '1º Estágio', texto: 'Ninguém vivo admite ter visto um. Todos os reis o procuram.' },
];

export const atributos = [
  { nome: 'Força', grupo: 'Físico', escala: 'Classificação', texto: 'O que o personagem destrói.' },
  { nome: 'Resistência', grupo: 'Físico', escala: 'Classificação', texto: 'O que o personagem aguenta.' },
  { nome: 'Velocidade', grupo: 'Físico', escala: 'Classificação', texto: 'Quem age primeiro e se a esquiva funciona.' },
  { nome: 'Poder Mágico', grupo: 'Mágico', escala: 'I a VI', texto: 'Amplifica o atributo que a magia usa: o nível é o número de Acréscimos.' },
  { nome: 'Mana', grupo: 'Mágico', escala: 'I a X', texto: 'A reserva de energia mágica.' },
  { nome: 'Controle Mágico', grupo: 'Mágico', escala: '0 a 100%', texto: 'A precisão no uso da mana. Reduz o custo e libera Estágios e Técnicas.' },
];

export const confronto = [
  ['Classificação', 'A classificação efetiva do atributo de ataque contra o de defesa: Força contra Resistência, Velocidade contra Velocidade.'],
  ['Acréscimos', 'Se as classificações empatam, vencem os Acréscimos restantes de cada lado.'],
  ['Circunstâncias', 'Surpresa, terreno, região atingida, Conhecimentos aplicáveis e a qualidade da ação escrita.'],
  ['Empate total', 'Os dois efeitos se anulam, ou o narrador decide pela coerência da cena.'],
];

export const turno = [
  ['Ação principal', 'Atacar, lançar um feitiço ou usar uma Técnica.'],
  ['Movimento', 'Deslocar-se, reposicionar-se, abrir distância.'],
  ['Reação', 'Defender ou esquivar.'],
];

export const manaRegras = [
  { nome: 'Reserva', texto: 'A reserva máxima vem do nível de Mana. Grimórios Lendários, Sem Capa e Demoníacos guardam Mana extra nas páginas, que o personagem usa como se fosse sua.' },
  { nome: 'Custo', texto: 'O custo depende do Grau do feitiço. O desconto do Controle Mágico e os outros descontos se somam, até um máximo de 50%. Feitiços sustentados pagam de novo a cada 3 turnos.' },
  { nome: 'Regeneração', texto: '10% da reserva por hora real fora de combate; 5% por turno de Concentração em combate; o dobro em Zona de Forte Mana. Uma noite inteira de descanso recupera tudo.' },
  { nome: 'Esgotamento', texto: 'Com Mana zero vem a Exaustão Mágica: -1 classificação em todos os atributos físicos até recuperar 25%. Dá para forçar um último feitiço com Mana Vital, ao preço de um Ferimento III.' },
  { nome: 'Afinidade', texto: 'Cada personagem tem uma magia, e todos os feitiços pertencem a ela. Quando o ambiente favorece a magia (água perto de um rio, cristal numa mina), os feitiços recebem +1 Acréscimo.' },
];

export const grauPorEstagio = [['9º e 8º', 'II'], ['7º e 6º', 'III'], ['5º e 4º', 'IV'], ['3º ao 1º', 'V']];

export const tiposFeitico = [
  ['Externalizado', 'A magia sai do corpo e age no mundo. Recebe 100% dos Acréscimos do Poder Mágico.'],
  ['Reforço Corporal', 'A magia envolve o próprio corpo. Recebe 50%, arredondado para baixo.'],
  ['Criação', 'Produz objetos, estruturas ou armas.'],
  ['Conjuração', 'Produz seres que agem sozinhos. Exige Conhecimento em Conjuração.'],
];

export const funcoes = {
  basicas: ['Ataque', 'Defesa', 'Criação', 'Mobilidade'],
  avancadas: ['Barreira', 'Reforço', 'Restauração', 'Enfraquecimento', 'Comunicação', 'Armadilha', 'Maldição', 'Anti-Maldição'],
  perdidas: ['Selamento', 'Restrição', 'Ressurreição'],
};

export const maestria = [['0', 'Feitiço recém-criado'], ['1', 'Custa 10% menos Mana'], ['2', '+1 Acréscimo'], ['3', 'Lançado sem encantamento e mais 10% de desconto']];

export const treinosFisicos = [['Incomum', 3], ['Sobre-Humana', 6], ['Extrema', 9], ['Colossal', 12], ['Monstruosa', 15], ['Titânica', 18], ['Transcendental', 27]];
export const treinosMana = [3, 6, 9, 12, 15, 18, 21, 24, 27]; // níveis II a X
export const treinosPoder = [9, 18, 27, 36, 45]; // níveis II a VI

export const pontosEstagio = [
  ['1 PE', 'por classificação física subida'],
  ['1 PE', 'por nível de Mana subido'],
  ['2 PE', 'por nível de Poder Mágico subido'],
  ['1 PE', 'a cada 10% de Controle Mágico ganho'],
];

export const bibliotecas = [
  { nome: 'Biblioteca dos Veios', onde: 'Os Veios', ensina: 'Esgrima, Arquearia, Combate e Herbalístico' },
  { nome: 'Academias do Lapidário', onde: 'O Lapidário', ensina: 'Todos os Conhecimentos Comuns, menos o Científico' },
  { nome: 'Grande Arquivo de Valcristal', onde: 'A Coroa', ensina: 'Todos os Conhecimentos Comuns, inclusive o Científico' },
];

export const generais = {
  texto: 'A força militar de elite de Diamond nasce de experimentos. Crianças e jovens passam por procedimentos, treinos e condições extremas; muitos não sobrevivem, e os que sobrevivem são educados para obedecer, combater e eliminar. Os Marcados que se apresentam ao Exame da Forja passam por uma versão abreviada desse processo.',
  cultura: 'Força, obediência e opressão. A posição na hierarquia depende de quem a ocupa e pode ser tomada em desafio. Uma ordem direta do Rei não pode ser recusada por ninguém.',
  exame: 'Seleção anual na Coroa. Quem passa entra como Recruta Brilhante. As regras de cada edição são publicadas pelo bot.',
  patentes: [
    ['I', 'Recruta Brilhante', 'Aprovação no Exame da Forja'],
    ['II', 'Tenente Brilhante', '30 Méritos e 6º Estágio'],
    ['III', 'General Brilhante', '4º Estágio e um posto vago, por indicação do Rei ou vitória em desafio. Há 7 postos'],
  ],
  vaga: 'Quando um posto de General fica vago, quem se considera apto pode reivindicá-lo. Com um só candidato, ele luta pelo posto; com vários, há uma disputa eliminatória. Um General também pode perder o posto para quem o derrotar.',
  tropas: [
    { nome: 'Tropas de Reconhecimento', funcao: 'Reconhecimento e inteligência militar', atuacao: 'Territórios externos e áreas estratégicas', comando: 'Oficiais de Diamond' },
    { nome: 'Tropas de Abate', funcao: 'Eliminação de alvos prioritários', atuacao: 'Operações de alto risco', comando: 'Oficiais de Diamond' },
    { nome: 'Tropas de Conquista', funcao: 'Conquista e ocupação territorial', atuacao: 'Invasões, cercos e guerras', comando: 'Generais Brilhantes' },
  ],
};

export const veioNegro = {
  texto: 'O sindicato que controla o Fosso: contrabando de Cristais, Cápsulas de Conhecimento, roubo de pesquisas e fuga de cobaias. Para o Veio Negro, Diamond já está morto, e quem sobrevive é quem lucra com o cadáver.',
  moeda: 'Antiméritos (Estrelas Negras)',
  patentes: [
    ['I', 'Pedra Bruta', 'Indicação de um membro e um trabalho de teste'],
    ['II', 'Lapidador', '30 Antiméritos e 6º Estágio'],
    ['III', 'Quilate', '4º Estágio e um posto vago, por indicação ou desafio. Há 3 postos'],
  ],
};

export const missaoFluxo = [
  ['Quadro', 'O bot publica as missões disponíveis por Rank, separadas para Generais Brilhantes e Veio Negro. O quadro se renova todo dia.', '/missoes'],
  ['Solicitação', 'O jogador pega uma missão do quadro ou pede uma personalizada pelo bot. A Staff aprova e define os objetivos.', '/missao solicitar'],
  ['Narração', 'Um narrador assume a missão e conduz o RP no canal indicado.', '#canal-da-missao'],
  ['Conclusão', 'O narrador registra o resultado no bot, que entrega as recompensas e guarda a missão no histórico do perfil.', '/missao concluir'],
];

export const missaoRegras = {
  exemplos: 'F e E são tarefas do dia a dia (escoltas, entregas, pequenos furtos); D e C envolvem criminosos, magos hostis e resgates; B e A enfrentam ameaças mágicas e organizações poderosas; S decide o destino de regiões inteiras.',
  requisitos: 'Cada missão pode exigir atributos, Conhecimentos ou Técnicas específicos, definidos na publicação. Uma missão fracassada não dá recompensa; a partir do Rank B, o fracasso também tira metade dos Méritos ou Antiméritos que ela daria.',
  limite: 'Cada jogador participa de até 2 missões a cada 24 horas, contadas a partir da primeira, solo ou em grupo. A única exceção são Missões de Evento abertas para quem está no período de espera; elas não reiniciam a contagem.',
  interferencia: 'Um grupo pode invadir a missão de outro (Generais contra Veio Negro, ou o contrário) só com justificativa prévia dentro do RP: uma informação obtida em cena, um motivo para estar na região. O que o jogador viu fora do personagem não vale. Se o invasor cumpre o objetivo, fica com as recompensas e o grupo original as perde; se fracassa, sofre as consequências da cena, que podem incluir captura, prisão ou morte.',
};

export const criacao = {
  modelos: [
    ['Raça', 'Humanos 85%, Anões 8%, Bruxas 7%. Elfos só aparecem pela família Licht ou por Reencarnação Élfica.'],
    ['Família', 'Sorteada entre as da raça. Famílias Comuns pesam 6, Raras pesam 1 e as de Sorteio nunca aparecem.'],
    ['Classe de Mago', 'Sorteada entre as oito, com mais chance para a classe que combina com a família.'],
  ],
  giros: [
    ['Magia', '4', 'Cada modelo termina com exatamente uma magia. Sobras são descartadas.'],
    ['Conhecimento', '4', '80% Comum, 20% Incomum. Cada modelo recebe até 2.'],
    ['Grimório', '2', '92% Comum, 8% Lendário. Quem não receber fica com um Comum.'],
    ['Extras de raça', 'Humano +1 Magia e +1 Conhecimento · Bruxa +2 Magia', 'Só podem ir para o modelo daquela raça.'],
    ['Giro de Linhagem', 'Conforme a família', 'Só vale para o modelo daquela família.'],
  ],
  escolha: [
    'O jogador escolhe um dos três modelos; os outros dois são descartados.',
    'Escreve nome, aparência (com imagem), a vida passada e o renascimento em Diamond.',
    'O Conselho Mágico aprova, e a ficha é criada.',
    'O /criar-personagem só pode ser usado uma vez por conta; refazer exige liberação da Staff.',
  ],
  ficha: [
    ['Identidade', 'Nome, imagem, raça, família da vida passada, classe social, Classe de Mago e Milagre'],
    ['Patamar', 'Estágio, Pontos de Estágio e patente'],
    ['Mana', 'Barra com a Mana atual e a máxima'],
    ['Atributos', 'Força, Resistência e Velocidade com classificação e Acréscimos; Poder Mágico, Mana e Controle'],
    ['Magia', 'Magia, Grimório e feitiços usados sobre o total'],
    ['Saber', 'Conhecimentos (x de 6), Traços (x de 3) e Técnicas'],
    ['Carreira', 'Méritos ou Antiméritos, Yuls, Cristais e os treinos disponíveis no ciclo'],
  ],
};

export const sincronia = 'Um vínculo entre dois ou três personagens que já passaram juntos por duas situações de vida ou morte (uma delas em evento) e por duas lutas entre si com motivo real. Desperta numa situação de risco de vida. Enquanto ativa, os envolvidos recuperam 50% da Mana uma vez, recebem +1 Acréscimo em Força e Velocidade, coordenam ações sem falar e podem criar feitiços de união.';

export const exclusivasAntigas = 'Prodígio e Adorado pela Mana viraram o Milagre Amado pela Mana; Dupla Alma, Tengentsu e Absorção e Emissão são Milagres; Berserk virou o Milagre Fúria de Batalha (Voltia); Corpo Amaldiçoado (Roselei), Doença de Mana (Lichita), Reencarnação Élfica (Giro de Linhagem) e Hibridismo (Pappitson) continuam como Milagres.';

// Utilitário: transforma um nome em caminho de arquivo (para os espaços de imagem).
// ——— Criaturas (proposta para o Silas revisar) ———
export const criaturas = {
  texto: 'Diamond secou a própria terra, e as criaturas que sobraram ou fugiram para as bordas do reino ou beberam mana demais. Toda criatura tem um Rank, como as missões, e atributos como os de um personagem: classificações físicas, Acréscimos e, nas mágicas, uma magia própria.',
  tipos: [
    ['Bestas Comuns', 'Animais sem mana: corvos, cabras de planalto, cães de mina. Domáveis desde o 9º Estágio.', 'F a E'],
    ['Bestas Mágicas', 'Animais que carregam mana e uma Habilidade Natural ligada a ela. Mais raras em Diamond, comuns perto da Fronteira.', 'D a A'],
    ['Quimeras', 'Criaturas montadas nos laboratórios do Lapidário a partir de várias outras. Instáveis e cobiçadas; muitas escapam para o Fosso.', 'C a A'],
    ['Espíritos e Lendas', 'Seres de mana pura ou bestas antigas. Só aparecem em eventos e nunca são domados à força.', 'B a S'],
  ],
  bestiario: [
    { nome: 'Arauto-de-Fuligem', cientifico: 'Corvus cinerarius', img: 'arauto-de-fuligem', rank: 'F', tipo: 'Besta Comum', onde: 'Fronteira Cinzenta', fisico: 'Comum', natural: 'Mensageiro: leva bilhetes até 5 km e volta sozinho. As penas soltam fuligem, e o rastro dele no céu é como os Veios avisam que vem gente.' },
    { nome: 'Farejador-de-Grisu', cientifico: 'Canis grisuphilus', img: 'farejador-de-grisu', rank: 'F', tipo: 'Besta Comum', onde: 'Os Veios', fisico: 'Comum', natural: 'Faro de Grisu: sente gás de mina e desabamento antes de acontecer. Todo poço dos Veios tem um, e nenhum mineiro desce sem ele.' },
    { nome: 'Chifre-Espiral', cientifico: 'Capra helicoceros', img: 'chifre-espiral', rank: 'E', tipo: 'Besta Comum', onde: 'Planaltos áridos', fisico: 'Incomum', natural: 'Montaria de Encosta: escala paredes de pedra com o cavaleiro. Os chifres crescem um anel por seca que a cabra sobrevive.' },
    { nome: 'Lobo Olho-de-Brasa', cientifico: 'Lupus limitaneus', img: 'lobo-olho-de-brasa', rank: 'D', tipo: 'Besta Mágica', onde: 'Fronteira Cinzenta', fisico: 'Incomum (+4 em Velocidade)', natural: 'Matilha: +1 Acréscimo para cada aliado lutando ao lado. Os olhos acendem quando ele sente mana, e é assim que a matilha escolhe a presa.' },
    { nome: 'Alva-da-Névoa', cientifico: 'Crystallophis nebularis', img: 'alva-da-nevoa', rank: 'C', tipo: 'Besta Mágica', onde: 'Jazidas profundas', fisico: 'Sobre-Humana', natural: 'Escamas de Cristal: +1 de Resistência contra feitiços. Exala uma névoa de pó de cristal que esconde quem estiver a até 10 m dela.' },
    { nome: 'Monólito-Andante', cientifico: 'Lithopodus muscosus', img: 'monolito-andante', rank: 'C', tipo: 'Besta Mágica', onde: 'Planaltos mortos', fisico: 'Sobre-Humana (+4 em Resistência)', natural: 'Último Musgo: carrega nas costas um dos últimos musgos vivos de Diamond. Uma Terra onde ele descansa por uma semana sobe um grau de Vigor.' },
    { nome: 'Rubrossigilo', cientifico: 'Ignifer stigmatus', img: 'rubrossigilo', rank: 'B', tipo: 'Besta Mágica', onde: 'Forjas abandonadas do Lapidário', fisico: 'Extrema', natural: 'Sigilos Ardentes: cada golpe acende uma marca no alvo; na terceira marca, o alvo sofre um Ferimento I extra de queimadura.' },
    { nome: 'Manticorno de Enxerto', cientifico: 'Chimaera lapidaria', img: 'manticorno-de-enxerto', rank: 'B', tipo: 'Quimera', onde: 'O Lapidário e o Fosso', fisico: 'Extrema', natural: 'Enxerto: juba de leão, chifres de carneiro e cauda de escorpião costurados por um cientista. Tem duas Habilidades Naturais, mas perde o controle com Ferimento III.' },
    { nome: 'Vigia-dos-Girassóis', cientifico: 'Helianthus vigilans', img: 'vigia-dos-girassois', rank: 'B', tipo: 'Espírito', onde: 'Estufas de Mana abandonadas', fisico: 'Incomum', natural: 'Mil Olhos: vê tudo o que os girassóis dela veem a até 200 m. Ninguém a pega de surpresa, e quem ataca escondido perde o bônus.' },
    { nome: 'Ossuário Errante', cientifico: 'Umbra ossilegens', img: 'ossuario-errante', rank: 'A', tipo: 'Espírito', onde: 'As valas do Fosso', fisico: 'Colossal', natural: 'Coleta os Mortos: cada pessoa ou criatura que morre a até 30 m dele vira mais um braço; +1 Acréscimo de Força por morte na cena (máx. +5).' },
    { nome: 'Devorador-de-Veios', cientifico: 'Vermis manivorax', img: 'devorador-de-veios', rank: 'S', tipo: 'Lenda', onde: 'Onde a mana morreu', fisico: 'Titânica', natural: 'Devora Mana: feitiços a até 20 m custam o dobro. Dizem que foi ele, e não a mineração, que secou Diamond.' },
  ],
  rupestre: 'Ninguém em Diamond desenhou estas criaturas. Os registros vêm das paredes das cavernas abaixo dos Veios, pintados com ocre e carvão por alguém que viu tudo isto muito antes do reino existir.',
  patrocinadoras: {
    texto: 'Antes de Diamond secar, três coisas já moravam embaixo dele. Não têm Rank, não aparecem nas paredes das cavernas e ninguém as doma. São as Patrocinadoras: escolhem um Marcado, bancam a segunda vida dele e um dia cobram.',
    lista: [
      { nome: 'Gan', img: 'gan', epiteto: 'A Que Empresta', dominio: 'Dívida e fortuna', aparencia: 'Uma boca dourada sem rosto, cercada de moedas que giram como luas pequenas.', patrocinio: 'Todo pagamento que o escolhido recebe vem com +10% de Yuls.', preco: 'Gan cobra o que empresta: se o escolhido ficar com Yuls negativos, perde um item à escolha do narrador.' },
      { nome: 'Org', img: 'org', epiteto: 'A Que Cresce', dominio: 'Carne, criaturas e o que ainda está vivo', aparencia: 'Uma massa verde de raízes e olhos que se move por baixo da terra morta.', patrocinio: 'As criaturas aceitam o escolhido: a Domação pede uma cena a menos (mínimo 1), e Ferimentos II fecham com 12 h de descanso em vez de 24 h.', preco: 'O corpo do escolhido começa a florescer: no 6º Estágio ganha uma Sequela estética (musgo, folhas, olhos a mais) que não sai mais.' },
      { nome: 'Preg', img: 'preg', epiteto: 'A Que Rasga', dominio: 'Caos, guerra e o céu vermelho', aparencia: 'Um rosto verde em cacos, um olho azul que não pisca e um sorriso de vidro quebrado, recortado contra um céu vermelho.', patrocinio: 'Uma vez por cena, ao sofrer um Ferimento III, o escolhido ganha +1 Acréscimo em Força e Velocidade até o fim da cena.', preco: 'Preg odeia tédio: um ciclo inteiro sem lutar custa 10% da Mana máxima até a próxima luta.' },
    ],
    regras: [
      ['Quem escolhe', 'A Patrocinadora escolhe; o jogador não pede. A escolha acontece em evento da Staff ou como prêmio especial.'],
      ['Uma por vida', 'Um personagem tem no máximo uma Patrocinadora, e ela não troca.'],
      ['Romper', 'O jogador pode romper o patrocínio a qualquer momento. Perde o Patrocínio na hora e carrega o Preço por mais 1 mês real.'],
    ],
  },
  domacao: [
    ['Encontro', 'A criatura aparece numa missão, num evento ou numa cena de caça com narrador. Fora disso, não existe criatura para domar.'],
    ['Aproximação', 'Dois caminhos. Confiança: cenas de aproximação (alimentar, curar, proteger), sem ferir a criatura. Subjugação: vencer o confronto sem matar, deixando-a em Ferimento III. Criatura subjugada começa Arisca.'],
    ['Laço', 'Um ritual de vínculo: o personagem gasta 50 de Mana por Rank acima de F (F custa 25) e marca a criatura com a própria mana. Bestas Comuns dispensam o ritual.'],
    ['Registro', 'O narrador registra a criatura na ficha, com Rank, atributos e Habilidade Natural. A partir daí ela acompanha o personagem e tem ficha própria.'],
  ],
  cenas: [['F', '1', '9º'], ['E', '2', '9º'], ['D', '3', '8º'], ['C', '4', '6º'], ['B', '5', '5º'], ['A', '7', '3º'], ['S', 'Só em evento', '1º']],
  limite: 'Cada personagem mantém 1 criatura vinculada, mais 1 no 6º Estágio e mais 1 no 3º. O Traço Ligação Natural soma +1. Conjurados e o familiar de uma Bruxa não contam nesse limite.',
  vinculo: [
    ['Arisca', 'Recém-subjugada. Obedece ordens simples e foge com Ferimento II.'],
    ['Domada', 'Recém-vinculada (ou Arisca depois de 3 cenas juntos). Luta, carrega e vigia.'],
    ['Leal', 'Depois de 5 missões ou cenas narradas juntos. Age sozinha a favor do dono e entende ordens complexas.'],
    ['Elo', 'Depois de 10 cenas e uma situação de vida ou morte enfrentada juntos. Libera a Assimilação.'],
  ],
  regras: [
    ['Ação em combate', 'A criatura age no turno do dono, com ação e reação próprias. Ordens dadas no meio da cena custam o movimento do dono.'],
    ['Treino', '1 Treino de Criatura por ciclo, de 1 hora e 400 caracteres. Sobe Força, Resistência ou Velocidade da criatura na mesma tabela dos Treinos Físicos.'],
    ['Teto', 'Uma criatura nunca passa a classificação física mais alta que o Rank dela permite: F e E param em Incomum, D em Sobre-Humana, C em Extrema, B em Colossal, A em Monstruosa.'],
    ['Ferimentos e morte', 'Criaturas usam a mesma tabela de Ferimentos. Uma criatura morta não volta; o vínculo quebra e o dono sofre Ferimento I.'],
    ['Maus-tratos', 'Criatura ferida pelo dono ou abandonada numa cena cai um nível de vínculo. Abaixo de Arisca, ela foge.'],
    ['Comércio', 'Bestas Comuns são vendidas nos Veios. Quimeras só pelo Veio Negro, no Fosso, ou com Conhecimento Científico, no Lapidário.'],
  ],
  assimilacao: {
    texto: 'Quando o vínculo chega a Elo, a mana do dono e a da criatura aprendem a ocupar o mesmo corpo. A criatura some dentro do personagem, e o corpo dele assume a forma dela: asas, garras, escamas, faro.',
    graus: [
      { nome: 'Assimilação Parcial', req: '6º Estágio · Controle 30% · Vínculo Elo', custo: '15 de Mana por turno', duracao: 'Até 5 turnos', efeitos: ['Uma parte da criatura no corpo (asas, garras, olhos, escamas).', '+2 Acréscimos num atributo físico ligado a essa parte.', 'Usa a Habilidade Natural da criatura.'] },
      { nome: 'Assimilação Total', req: '3º Estágio · Controle 60% · Vínculo Elo', custo: '40 de Mana por turno', duracao: 'Até 5 turnos', efeitos: ['O corpo inteiro vira um híbrido com a criatura.', 'Em cada atributo físico, usa a classificação da criatura se ela for maior.', '+1 Acréscimo nos feitiços coerentes com a criatura.', 'Usa a Habilidade Natural e se move como ela (voo, escalada, mergulho).'] },
    ],
    custos: [
      ['Exaustão Bestial', 'Ao sair da Assimilação: -1 Acréscimo nos atributos físicos por 3 turnos, e a criatura fica fora da cena.'],
      ['Dano dividido', 'Ferimentos sofridos durante a Assimilação passam para os dois. Se a criatura morrer nesse estado, o dono sofre Ferimento III.'],
      ['Uma de cada vez', 'Só uma criatura assimilada por vez e uma Assimilação por cena.'],
      ['Mana zero', 'Se a Mana acabar, a Assimilação se desfaz na hora e a Exaustão dobra para 6 turnos.'],
    ],
    treino: 'Para aprender cada grau, o personagem precisa de 6 Treinos de Técnica feitos ao lado da criatura (Elfos e a Anomalia Mágica pela metade, como nas Técnicas de Mana).',
  },
  familiar: {
    texto: 'Uma Bruxa não doma: ela pactua. O Pacto Familiar cria um feitiço próprio que dá corpo a um familiar, um ser feito da mana dela e moldado pela magia que ela carrega. O feitiço não ocupa espaço no Grimório.',
    regras: [
      ['Quem pode', 'Só Bruxas, de qualquer família (Enoteca, Trinity, Unsworth ou outra). Um familiar por Bruxa.'],
      ['Forma', 'Definida com o Conselho Mágico, coerente com a magia: uma aranha de fios, um gato de névoa, uma coruja de barreiras.'],
      ['Grau', 'O feitiço do familiar acompanha o Grau máximo do Estágio da Bruxa (Grau II no 9º, III no 7º, IV no 5º, V no 3º).'],
      ['Atributos', 'Classificações físicas uma abaixo das da Bruxa (mínimo Comum) e +1 Acréscimo por nível de Poder Mágico dela, distribuídos na criação.'],
      ['Traço da Magia', 'Uma habilidade tirada da magia da Bruxa: teia de Fios, sono de Sonhos, escudo de Barreiras. Definida com o Conselho Mágico.'],
      ['Ligação', 'Fala com a Bruxa pela mente até a distância do Grimório dela e enxerga o que o familiar enxerga uma vez por cena.'],
      ['Invocação', 'Aparece com o Grimório aberto e pelo custo do feitiço. Fica até a Bruxa dispensar, dormir ou ficar sem Mana.'],
      ['Morte', 'Um familiar destruído volta depois de 24 horas reais, com a memória intacta. A Bruxa sofre Ferimento I na hora.'],
    ],
    marcos: [
      ['6º Estágio', 'O familiar ganha um segundo Traço da Magia.'],
      ['3º Estágio', 'Assimilação Familiar: a Bruxa assimila o familiar sem precisar do vínculo Elo e sem custo de Mana por turno.'],
      ['Pacto com uma criatura', 'Em vez de criar um familiar, a Bruxa pode pactuar com uma criatura já domada e Leal. Ela vira o familiar: mantém os próprios atributos, ganha o Traço da Magia e sai do limite de vinculadas.'],
    ],
  },
};

/* ==========================================================================
   Sistemas novos (2026-11-04): Ferimentos, Feitiço de Alma, Profissões,
   Mineração, Itens Mágicos, Terras e Economia. Aprovados pelo Silas no plano.
   ========================================================================== */

export const feridas = {
  texto: 'Os quatro graus de Ferimento formam a Trilha de Ferimentos, a barra de vida do personagem. Cada golpe que passa da Resistência ocupa uma casa; as casas cheias transbordam para o grau de cima, e um ferimento sem tratamento piora sozinho.',
  trilha: [['I', 'Leve', 3], ['II', 'Moderado', 2], ['III', 'Grave', 1], ['IV', 'Crítico', 1]],
  regras: [
    ['Acúmulo', 'Se o grau já está cheio, o ferimento novo sobe um grau. Quatro golpes leves seguidos viram um Moderado: é assim que danos pequenos e repetidos derrubam alguém mais forte.'],
    ['Pior grau', 'Os efeitos não somam casa por casa: vale o pior grau marcado, mais -1 Acréscimo extra se houver dois graus diferentes ocupados.'],
    ['Região atingida', 'Um II ou III num braço pesa só na Força daquele braço; numa perna, na Velocidade; na cabeça, no Controle (-5% enquanto durar).'],
    ['Traços', 'Vigor Superior ignora Ferimentos II e Controle Corporal ignora um III por 3 turnos, como já era.'],
  ],
  agravamento: [
    ['I', 'Nada', 'Sim, no fim da cena'],
    ['II', 'Vira III se o personagem lutar ou fizer Treino Físico antes de tratar', 'Sim, após 24 h reais de descanso'],
    ['III', 'Sangramento: vira IV após 6 turnos em combate ou 12 h reais fora dele', 'Não; precisa de Medicina Avançada ou Sacerdote da Mana'],
    ['IV', 'Morte ou Sequela ao fim da cena, se ninguém estabilizar', 'Não; precisa de Cirurgia'],
  ],
  diamond: 'Em Diamond pesa mais: nos Veios não há médicos, então o tratamento custa Yuls ou depende de outro jogador. Quem tem Doença de Mana agrava um grau mais rápido, e quem está Desnutrido já começa a cena com uma casa de Ferimento I marcada.',
  sequelas: 'Sobreviver a um Ferimento IV sem Cirurgia deixa uma marca permanente: cicatriz, perda de um olho ou de um membro, falha de mana. O jogador escolhe a Sequela com o narrador. Algumas só se corrigem com uma prótese do Lapidário.',
  tratar: [
    ['Estabilizar', 'Para o Agravamento por 1 cena', 'Qualquer um com kit médico; Medicinal sem kit', '1 turno'],
    ['Tratar I e II', 'Remove o ferimento', 'Conhecimento Medicinal ou Função Restauração', 'I: 1 turno · II: 3 turnos'],
    ['Tratar III', 'Desce para II', 'Medicina Avançada ou Sacerdote da Mana', '5 turnos'],
    ['Cirurgia', 'Desce IV para III; evita ou corrige uma Sequela', 'Cirurgia Arcana', '1 cena fora de combate'],
  ],
  bonus: 'Os bônus continuam somando: Medicinal cura 1 turno mais rápido, Medicina Avançada 3, Mãos Restauradoras 1, Consultório 1. O mínimo é 1 turno. Curar com feitiço custa a Mana do Grau usado: Grau II trata até Ferimento II, Grau III trata o III.',
  curandeiro: [
    ['Mãos Restauradoras', 'Passiva · criação', 'Restauração custa 20% menos e cura 1 turno mais rápido.'],
    ['Triagem', '7º Estágio', 'Vê a Trilha de Ferimentos de quem toca e estabiliza sem kit.'],
    ['Sacerdote da Mana', 'Classe Avançada · 5º Estágio', 'Cura Ferimentos III e transfere até 20% da Mana por turno.'],
    ['Voto de Vida', '3º Estágio', 'Uma vez por cena, devolve um aliado do Ferimento IV ao III na hora.'],
  ],
  conhecimentos: [
    ['Medicinal', 'Comum', 'Trata I e II; estabiliza sem kit'],
    ['Herbalístico', 'Comum', 'Poções de cura: removem um I fora de combate'],
    ['Medicina Avançada', 'Incomum', 'Trata III; diagnostica doenças e maldições'],
    ['Cirurgia Arcana', 'Incomum · só no Lapidário', 'Trata IV, corrige Sequelas, implanta próteses'],
    ['Ressurreição', 'Perdido', 'Volta da morte, só em evento'],
  ],
  extras: 'A família Valerian cura com qualquer magia, e o Milagre Absorção e Emissão causa Ferimento II quando passa do limite. Os dois se encaixam sem mudança. Na ficha do bot, a trilha aparece como uma barra de 7 casas.',
};

export const feiticoAlma = {
  texto: 'O Traço Alma Indomável deixa o personagem criar um único Feitiço de Alma: uma técnica pessoal que dobra as regras da própria magia, como a corrente de alma de um plebeu sem mana ou uma maga que vira a própria magia. O Traço respeita o teto dos Traços; o poder está no feitiço, e ele custa caro.',
  ganho: [
    ['O Traço', '+0,5% extra em cada treino de Controle, e nada além disso até despertar. Ocupa uma das 3 vagas de Traço.'],
    ['Despertar', 'Numa cena de vida ou morte, com narrador, estando em Ferimento III ou com Mana abaixo de 25%. Como a Sincronia, não se compra nem se gira.'],
    ['Requisitos', '6º Estágio e 30% de Controle. O feitiço é desenhado com o Conselho Mágico e fica preso à magia do personagem.'],
    ['Limite', 'Um Feitiço de Alma por personagem, usado uma vez por cena.'],
  ],
  vias: [
    { nome: 'Vínculo', inspiracao: 'A corrente de alma', efeito: 'Prende o lançador e um alvo numa regra: a Mana dos dois fica igual à do menor, ou nenhum dos dois lança feitiços, ou nenhum foge. Dura até um cair.', preco: 'A regra vale para o lançador também; quebrar a corrente antes do fim dá Ferimento III.' },
    { nome: 'Fusão', inspiracao: 'Virar a própria mana', efeito: 'O corpo vira a própria magia por 3 turnos: golpes físicos o atravessam, +1 classificação no atributo da magia e Grau máximo +1.', preco: '100 de Mana por turno; ao terminar, Exaustão Mágica e um Ferimento II.' },
    { nome: 'Ruptura', inspiracao: 'A regra quebrada', efeito: 'Quebra uma regra da própria magia uma vez por cena: o fogo que congela, a corrente que corta mana.', preco: 'Custa o dobro do Grau, e o feitiço seguinte sai com -1 Acréscimo.' },
    { nome: 'Própria', inspiracao: 'A sua alma, as suas regras', efeito: 'O jogador desenha o próprio Feitiço de Alma, fora das três Vias: o que ele faz, o que inspira e o que custa. Precisa caber na magia do personagem e ter um preço do tamanho do poder.', preco: 'Definido com o Conselho Mágico, nunca menor que o das outras Vias: Mana alta por turno, Ferimento, Exaustão ou uma regra que vale contra o próprio lançador.' }
  ],
  diamond: 'O Vínculo favorece quem tem pouca mana. Em Diamond, onde o reino tem Mana Baixa e a Plebe nasce com Mana I, ele dá ao fraco uma arma contra o nobre; com o Milagre Insignificância, pode ser a assinatura de um personagem inteiro. A Fusão é o contrário: só quem tem reserva grande aguenta.',
};

export const profissoes = {
  texto: 'A Profissão é o que o personagem faz quando não está lutando. Ela pede um Conhecimento, precisa de uma licença que a Classe Social facilita ou dificulta, rende Yuls por ciclo e produz os Recursos e os itens que movem o Mercado.',
  regras: [
    ['Quantas', 'Uma Profissão principal. Uma secundária a partir do 6º Estágio.'],
    ['Licença', 'Emitida pela Corporação do ofício, na Coroa: 200 Yuls para a classe nativa do ofício e 1.000 para as outras. Ofícios do Fosso não têm licença nem pagam imposto, mas podem render prisão.'],
    ['Jornada de Trabalho', 'Um post de RP de 500 caracteres, 1 por ciclo, como os treinos. Rende o salário do grau e conta para subir de grau.'],
    ['Carreiras', 'Generais e membros do Veio Negro podem ter ofício. A Forja paga soldo; o Veio Negro paga em Antiméritos e contrabando.'],
  ],
  graus: [
    ['I', 'Aprendiz', 'Licença', '40 Yuls por Jornada'],
    ['II', 'Oficial', '15 Jornadas', '100 Yuls por Jornada'],
    ['III', 'Mestre', '40 Jornadas, 6º Estágio e uma Obra-Prima avaliada pela Staff', '250 Yuls por Jornada; ensina Aprendizes e abre Corporação'],
  ],
  lista: [
    { nome: 'Mineiro', conhecimento: 'Nenhum', classe: 'Plebe', onde: 'Os Veios', produz: 'Minério e Cristais residuais' },
    { nome: 'Caçador', conhecimento: 'Arquearia ou Combate', classe: 'Plebe', onde: 'Fronteira Cinzenta', produz: 'Couro, carne e Partes de Criaturas' },
    { nome: 'Ferreiro', conhecimento: 'Produção', classe: 'Plebe', onde: 'Os Veios', produz: 'Lingotes, armas, armaduras e ferramentas' },
    { nome: 'Boticário', conhecimento: 'Herbalístico', classe: 'Plebe', onde: 'Os Veios', produz: 'Poções, remédios e consumíveis' },
    { nome: 'Cultivador de Estufa', conhecimento: 'Herbalístico ou Botânica Arcana', classe: 'Nobreza', onde: 'O Lapidário', produz: 'Comida e ervas raras' },
    { nome: 'Médico', conhecimento: 'Medicinal', classe: 'Nobreza', onde: 'O Lapidário', produz: 'Tratamento cobrado e cirurgias' },
    { nome: 'Engenheiro', conhecimento: 'Científico ou Engenharia', classe: 'Nobreza', onde: 'O Lapidário', produz: 'Máquinas, catalisadores, próteses e encantamentos' },
    { nome: 'Lapidador de Cristais', conhecimento: 'Científico', classe: 'Nobreza', onde: 'O Lapidário', produz: 'Lentes, Núcleos e Pó de Cristal' },
    { nome: 'Mercador', conhecimento: 'Oratória', classe: 'Nobreza', onde: 'Qualquer cidade', produz: 'Compra e revende; abre Loja' },
    { nome: 'Notário', conhecimento: 'Retórica', classe: 'Realeza', onde: 'A Coroa', produz: 'Registra Contratos e Escrituras' },
    { nome: 'Magistrado', conhecimento: 'Retórica', classe: 'Realeza', onde: 'A Coroa', produz: 'Julga e cobra impostos de terras' },
    { nome: 'Contrabandista', conhecimento: 'Oratória', classe: 'Nenhuma', onde: 'O Fosso', produz: 'Recursos sem imposto e itens proibidos' },
  ],
  ligacoes: [
    ['Classe Social', 'A Plebe começa perto das minas, a Nobreza das academias, a Realeza dos cartórios. Trocar de mundo custa caro, mas é possível.'],
    ['Conhecimentos', 'Quem compra uma Cápsula ou estuda numa Biblioteca agora tem um motivo econômico para isso.'],
    ['Terras', 'Uma Oficina, Loja, Estufa, Laboratório ou Consultório na própria terra dá bônus ao ofício.'],
    ['Sistema de Criação', 'Ferreiro, Boticário, Engenheiro e Lapidador são o Sistema de Criação: tudo o que eles fazem segue a página Itens Mágicos.'],
  ],
};

export const mineracao = {
  texto: 'Minerar sustenta os Veios e abastece as forjas. Cada Jornada numa jazida rende uma quantidade fixa de Recursos, sem dados, e toda jazida se esgota. Para achar coisa melhor é preciso descer mais fundo, onde a mina cobra em Ferimentos.',
  jazidas: [
    ['Esgotada', '1 Carvão', '—', 'Sem fim', 'A maioria dos Veios'],
    ['Pobre', '2 Ferro Cinzento', '1 Cobre Rúnico', '40', 'Veios, minas comunitárias'],
    ['Comum', '3 Ferro Cinzento, 1 Cobre Rúnico', '1 Pó de Cristal', '30', 'Concessões de Mina'],
    ['Rica', '3 Ferro Cinzento, 1 Cobre Rúnico, 1 Quartzo de Mana', '1 Cristal Branco', '20', 'Concessões raras, prêmios de evento'],
    ['Veio Virgem', 'Como a Rica, mais 1 Ferro Estelar', '1 Cristal Branco e 1 Obsidiana Viva', '10', 'Só por Prospecção ou conquista na Fronteira'],
  ],
  reserva: 'Toda jazida tem uma Reserva, contada em Jornadas. Quando ela acaba, a jazida desce um grau. É o problema de Diamond em escala pequena.',
  modificadores: [
    ['Ferramenta', 'Uma picareta Incomum ou melhor rende +1 do Recurso Comum por Jornada; uma Rara encurta o Achado para 8 Jornadas.'],
    ['Magia', 'Terra, Cristal, Ferro e Aço contam como Afinidade: +1 do Recurso Incomum da jazida.'],
    ['Força', 'Com Força Colossal ou maior, o Mineiro faz duas Jornadas por ciclo, mas a segunda gasta Reserva em dobro.'],
    ['Grau do ofício', 'Oficial ganha +1 Ferro Cinzento por Jornada. Mestre lê a rocha e sabe quantas Jornadas a Reserva ainda tem.'],
  ],
  profundas: 'Abaixo das galerias esgotadas ficam as Minas Profundas, perto do Fosso. Uma expedição é uma missão pelo bot, com narrador, de Rank D a A. A recompensa é dividida pelo grupo: Obsidiana Viva no Rank B, Cristal Negro no Rank A.',
  perigos: [
    ['Desabamento', 'Ferimento II em todos, ou III em quem está na frente', 'Resistência Extrema ou um Engenheiro no grupo'],
    ['Gás de Mana', 'Doença de Mana após 3 turnos', 'Pele de Mana ou máscara de Engenheiro'],
    ['Criaturas das profundezas', 'Confronto com uma criatura do Bestiário', 'Combate; um Caçador no grupo'],
    ['Escuridão total', '-1 Acréscimo em Velocidade sem luz', 'Lanterna de Quartzo, magia de luz ou fogo'],
  ],
  prospeccao: 'Um Mineiro Oficial ou Mestre pode gastar 3 Jornadas procurando um veio novo numa região. No fim, a Staff revela o que ele achou conforme a região e o Renome, sem sorteio. A jazida nova precisa de Concessão da Coroa (um Contrato com Notário) ou vira mina ilegal do Veio Negro.',
  refino: [
    ['3 Ferro Cinzento + 1 Carvão', '1 Lingote de Ferro', 'Ferreiro', '1 Jornada'],
    ['2 Cobre Rúnico', '1 Fio Rúnico (conduz mana)', 'Ferreiro ou Engenheiro', '1 Jornada'],
    ['2 Quartzo de Mana', '1 Lente de Quartzo', 'Lapidador', '1 Jornada'],
    ['1 Cristal Branco', '1 Núcleo Branco ou 3 Pó de Cristal', 'Lapidador com Laboratório', '2 Jornadas'],
    ['2 Ferro Estelar', '1 Lingote Estelar', 'Ferreiro Mestre', '2 Jornadas'],
  ],
  escolha: 'O Cristal Branco tem dois destinos que competem: subir de Estágio ou virar o núcleo de um item Épico. Cada um que sai da mina obriga uma escolha.',
};

export const itens = {
  texto: 'Todo item tem três partes: o material define a qualidade máxima, o artesão define a qualidade que consegue fazer, e os encantamentos gravam mana no objeto. Cada item rastreia de volta a uma mina, uma caçada ou uma estufa.',
  qualidades: [
    ['Comum', 'Nenhum', 'Ferro, couro, madeira', 'Aprendiz', '0', '100'],
    ['Incomum', '+0,5 Acréscimo', 'Lingote de Ferro + Fio Rúnico', 'Oficial', '1 (Grau I e II)', '800'],
    ['Rara', '+1 Acréscimo', 'Lingote Estelar ou Parte Mágica de Criatura', 'Oficial com Oficina', '1 (até Grau III)', '4.000'],
    ['Épica', '+1,5 Acréscimo', 'Material Raro + Núcleo Branco', 'Mestre', '2', '15.000'],
    ['Obra-Prima', '+2 Acréscimos e uma propriedade única', 'Obsidiana Viva ou Cristal Negro', 'Mestre, aprovado pela Staff', '3', 'Só por encomenda'],
  ],
  nota: 'A Katana de qualidade Incomum dos Sukehiro já segue esta escala. Os bônus contam no teto de 10 Acréscimos por atributo, como tudo.',
  tipos: [
    ['Armas', 'Ferreiro', 'Força ou Velocidade com a arma; soma com Esgrima, Arquearia e Combate'],
    ['Armaduras', 'Ferreiro', 'Resistência; uma Rara ou melhor absorve o primeiro Ferimento I da cena'],
    ['Catalisadores', 'Engenheiro ou Lapidador', 'Acréscimos dos feitiços da própria magia (anéis, cajados, amuletos)'],
    ['Ferramentas', 'Ferreiro ou Engenheiro', 'A profissão: picareta, kit médico, kit de forja'],
    ['Próteses', 'Engenheiro + Médico com Cirurgia Arcana', 'Corrigem uma Sequela; as Raras ou melhores aceitam encantamento'],
    ['Consumíveis', 'Boticário', 'Poções, bombas e óleos de uso único, pela regra do Herbalístico'],
  ],
  encantamentos: [
    ['Afiado', '+0,5 Acréscimo extra de Força com a arma', '1 Pó de Cristal'],
    ['Leve', '+0,5 Acréscimo de Velocidade ao usar', '1 Pó de Cristal'],
    ['Condutor', 'Canaliza a magia do dono: +0,5 Acréscimo nos feitiços lançados através dele', '2 Pó de Cristal + Fio Rúnico'],
    ['Reservatório', 'Guarda 50 de Mana (100 num Épico) que o dono usa como sua', '2 Pó de Cristal + Lente de Quartzo'],
    ['Rúnico', 'Guarda um feitiço do dono, solto sem gastar a ação principal, 1 vez por cena', '3 Pó de Cristal'],
    ['Resguardo', '+0,5 de Resistência contra magia', '2 Pó de Cristal'],
    ['Vital', 'Uma vez por cena, cura um Ferimento I do dono', '2 Pó de Cristal + Erva rara'],
  ],
  quemEncanta: 'Encantar é gravar um efeito com Pó de Cristal. Quem encanta é um Engenheiro ou um Mago Artífice, cuja passiva Oficina já grava um feitiço num objeto.',
  desgaste: [
    ['Rachar', 'Um item usado contra algo duas classificações acima dele racha e perde o bônus até ser consertado.'],
    ['Conserto', '1 Jornada de um Ferreiro e 20% do material original.'],
    ['Histórico', 'Itens Raros ou melhores têm nome e histórico no bot: quem fez e de que mina veio o material. Um item roubado pode ser rastreado.'],
  ],
  compra: 'Comuns e Incomuns estão nas lojas de NPC; Raros, só com artesãos jogadores ou na Coroa; Épicos e Obras-Primas, só por Contrato de Encomenda. O Fosso vende de tudo, inclusive itens proibidos, por ×1,5 do preço de Mercado.',
};

export const terras = {
  texto: 'Em Diamond a terra é o bem mais disputado porque quase toda ela morreu. O jogador compra um lote, constrói o que o ofício precisa e paga para mantê-lo vivo. A falta de terra boa também explica a guerra: Diamond quer as terras férteis de Clover.',
  tipos: [
    ['Barraco', 'Os Veios', 'Qualquer um', '800 Yuls', 'Moradia; corta o custo de vida pela metade'],
    ['Lote Urbano', 'Qualquer cidade', 'Qualquer um', '3.000 (Veios) a 20.000 (Coroa)', '1 construção'],
    ['Concessão de Mina', 'Os Veios', 'Nobreza, ou Plebe com Contrato com um nobre', '15.000 Yuls', 'Uma jazida Comum (ver Mineração)'],
    ['Estufa de Mana', 'O Lapidário', 'Nobreza e Realeza', '25.000 Yuls', 'Comida e ervas mesmo em terra morta'],
    ['Feudo', 'A Coroa e a Fronteira', 'Realeza, ou General Brilhante como prêmio', 'Só por concessão do Rei', 'Vários lotes; cobra imposto de NPCs'],
    ['Toca', 'O Fosso', 'Membros do Veio Negro', 'Sem escritura', 'Esconderijo e loja ilegal'],
  ],
  vigor: [
    ['Morta', 'Nada brota.'],
    ['Exausta', 'Produz metade.'],
    ['Fraca', 'Produz o normal.'],
    ['Viva', 'Produz o dobro. Raríssima em Diamond; terras conquistadas em Clover nascem Vivas.'],
  ],
  vigorTexto: 'O Vigor sobe com um Cultivador de Estufa ou um Cristal Branco enterrado, e cai com eventos como a Colheita Cristalina.',
  construcoes: [
    ['Oficina', 'Produções 20% mais rápidas (soma com o Mago Artífice)', 'Ferreiro, Engenheiro'],
    ['Loja', 'Vende a jogadores e NPCs sem intermediário; +10% no preço de venda', 'Mercador, qualquer um'],
    ['Estufa', 'Produz Recursos de comida e ervas por semana', 'Cultivador, Boticário'],
    ['Laboratório', 'Pesquisa e refino de Cristais', 'Lapidador, Engenheiro'],
    ['Consultório', 'Cirurgias e tratamento cobrado; cura 1 turno mais rápido', 'Médico'],
    ['Armazém', 'Guarda Recursos sem perda no Inverno da Fome', 'Mercador, Mineiro'],
  ],
  manter: [
    ['Imposto territorial', '2% do valor da propriedade por semana, pago ao Tesouro.'],
    ['Atraso', '2 semanas sem pagar tiram uma construção; 4 semanas, a Coroa toma a terra.'],
    ['Proteção', 'O Veio Negro pode cobrar proteção nos Veios. Recusar abre uma missão de defesa.'],
    ['Herança', 'Uma terra pode ser vendida, arrendada ou deixada de herança por Contrato. Quando o personagem morre, ela vai para o próximo Marcado do mesmo jogador, com 50% de imposto.'],
  ],
};

export const economia = {
  texto: 'Tudo o que vem da terra está acabando em Diamond: comida, madeira, minério e Cristais ficam caros, e quem controla esses Recursos controla o reino.',
  moedas: [
    ['Yul', 'A moeda legal de todos os reinos. Tudo no bot é contado em Yuls.'],
    ['Cristais de Mana', 'Não são moeda, mas valem como ouro. A Coroa compra todo Cristal Branco por 3.000 Yuls; no Fosso pagam 4.000, sem perguntas.'],
    ['Antiméritos', 'A moeda do Veio Negro. Só vale no Fosso.'],
  ],
  riquezas: [
    ['Miserável', 'Menos de 200 Yuls', 'Guardas desconfiam; só consegue Contratos no Fosso'],
    ['Pobre', '200 a 2.000', 'Normal nos Veios'],
    ['Confortável', '2.000 a 20.000', 'Entra nas academias do Lapidário'],
    ['Rico', '20.000 a 200.000', 'Preços -5% com mercadores; alvo de extorsão'],
    ['Opulento', 'Mais de 200.000', 'Audiência com a Coroa; pode financiar missões'],
  ],
  riquezasTexto: 'O patrimônio (Yuls, Cristais, terras e itens) coloca o personagem numa faixa, que muda como os NPCs o tratam.',
  comercio: [
    ['Com NPC', 'Compra pelo preço de mercado e vende por metade.'],
    ['Entre jogadores', 'Livre, pelo bot, com o preço que combinarem. A venda paga o Dízimo.'],
    ['Loja própria', 'Uma Loja na própria terra vende a NPCs pelo preço cheio + 10%.'],
  ],
  regioes: [
    ['Os Veios', '×0,8', '×1,5', '×1,3'],
    ['O Lapidário', '×1', '×1,2', '×1'],
    ['A Coroa', '×1,3', '×1', '×0,9'],
    ['O Fosso', '×1,2, sem imposto', '×1', '×1,5, inclusive proibidos'],
  ],
  eventos: 'Eventos mexem nos preços por um ciclo inteiro: no Inverno da Fome a comida vale ×3; na Colheita Cristalina o Cristal cai para ×0,7; na Ofensiva da Fronteira armas e poções valem ×2.',
  tesouro: 'O Tesouro da Coroa (240.000.000 Yuls, em queda) paga os soldos dos Generais e as recompensas das missões, e recebe os impostos. Se cair abaixo de 200.000.000 num evento, as recompensas em Yuls das missões dos Generais caem 25% até ele subir de novo.',
  impostos: [
    ['Dízimo', '10% Plebe, 15% Nobreza, 20% Realeza, sobre salário e venda', 'O bot, na hora'],
    ['Territorial', '2% do valor da propriedade por semana', 'O bot, toda semana'],
    ['Taxa de Cristal', '20% sobre Cristais vendidos fora da Coroa', 'Fiscais; no Fosso não há'],
  ],
  sonegar: 'Vender no Fosso não paga imposto. Quem é pego, por missão de General ou denúncia, paga o triplo ou vai preso.',
  contratosTexto: 'Um acordo entre personagens, registrado no bot e assinado pelos dois. Com um Notário presente, ele vale na Coroa; sem Notário, vale só entre as partes.',
  contratos: [
    ['Emprego', 'Um Mestre Ferreiro paga 60 Yuls por Jornada a um Aprendiz'],
    ['Empréstimo', '5.000 Yuls, devolvidos como 6.000 em 4 semanas'],
    ['Arrendamento', 'Usa a mina de um nobre e entrega metade do minério'],
    ['Encomenda', 'Uma espada Rara por 4.000 Yuls, entregue em 2 semanas'],
    ['Escolta', 'Protege uma carga até a Fronteira'],
    ['Sociedade', 'Dois sócios dividem o lucro de uma Loja'],
  ],
  quebra: 'Quebrar um Contrato registrado dá multa igual ao valor dele, paga à outra parte, e marca a ficha: nenhum Contrato com Notário por 4 semanas.',
  recursos: [
    ['Carvão', 'Comum', 'Minas', '5'],
    ['Ferro Cinzento', 'Comum', 'Minas', '10'],
    ['Água limpa (barril)', 'Comum', 'Poços, Estufas', '10'],
    ['Ração (1 semana)', 'Comum', 'Estufas, caça', '30'],
    ['Erva medicinal', 'Comum', 'Estufas', '25'],
    ['Couro de Besta', 'Comum', 'Caça', '50'],
    ['Madeira', 'Incomum', 'Fronteira, importada de Clover', '60'],
    ['Cobre Rúnico', 'Incomum', 'Minas Pobres a Ricas', '40'],
    ['Quartzo de Mana', 'Incomum', 'Minas Ricas', '80'],
    ['Pó de Cristal', 'Incomum', 'Refino, Achados', '150'],
    ['Erva rara', 'Rara', 'Estufa de Mana', '120'],
    ['Parte Mágica de Criatura', 'Rara', 'Caça de criaturas mágicas', '300'],
    ['Disco Bruto (em branco)', 'Incomum', 'Veio Negro, no Fosso', '150'],
    ['Disco Lapidado (em branco)', 'Rara', 'Oficinas do Lapidário', '400'],
    ['Ferro Estelar', 'Rara', 'Veios Virgens, meteoritos', '400'],
    ['Obsidiana Viva', 'Épica', 'Minas Profundas', '1.200'],
    ['Cristal Branco', 'Rara', 'Achados, missões C e B', '3.000'],
    ['Cristal Negro', 'Épica', 'Minas Profundas, missões A', '25.000'],
    ['Cristal Dourado', 'Lenda', 'Só em evento', 'Não se vende'],
  ],
  custoVida: [
    ['Os Veios', '50 Yuls por semana'],
    ['O Lapidário', '200 Yuls por semana'],
    ['A Coroa', '600 Yuls por semana'],
  ],
  desnutrido: 'Quem não paga o sustento fica Desnutrido: uma casa de Ferimento I fica marcada até ele comer. Um Barraco próprio corta o custo pela metade. É assim que a fome dos Veios aparece na ficha, não só no texto.',
};

// Glossário: termo, definição curta, página (e seção) onde está a regra.
export const glossario = [
  ['Achado', 'Recurso garantido a cada 10 Jornadas na mesma jazida.', 'mineracao#jazidas'],
  ['Acréscimo', 'Valor extra num atributo, de 0,1 a 1 por aplicação; 10 sobem uma classificação.', 'atributos#acrescimos'],
  ['Afinidade', 'Quando o ambiente favorece a magia: +1 Acréscimo.', 'mana'],
  ['Agravamento', 'Ferimento sem tratamento que piora sozinho.', 'ferimentos#agravamento'],
  ['Alma Indomável', 'Traço que abre o Feitiço de Alma.', 'milagres#feitico-de-alma'],
  ['Antiméritos', 'A moeda de honra do Veio Negro, as Estrelas Negras.', 'generais'],
  ['Cápsula de Conhecimento', 'Compra de um Conhecimento sem estudar.', 'conhecimentos#capsulas'],
  ['Classe de Mago', 'O estilo de combate do personagem.', 'classes'],
  ['Classe Social', 'Plebe, Nobreza ou Realeza: define região, dinheiro e atributos iniciais.', 'familias'],
  ['Classificação', 'Patamar de um atributo físico, de Comum a Transcendental.', 'atributos'],
  ['Concessão', 'Direito de explorar uma jazida, dado pela Coroa por Contrato.', 'mineracao#prospeccao'],
  ['Confronto', 'Comparação sem dados: classificação, depois Acréscimos, depois circunstâncias.', 'atributos#confronto'],
  ['Contrato', 'Acordo entre personagens registrado no bot.', 'economia#contratos'],
  ['Controle Mágico', 'Precisão no uso da mana, de 0 a 100%.', 'atributos'],
  ['Cristal de Mana', 'Branco, Negro ou Dourado: exigido nos Estágios altos e valioso no Mercado.', 'progressao'],
  ['Custo de vida', 'Sustento semanal: 50, 200 ou 600 Yuls conforme a região.', 'economia#recursos'],
  ['Desnutrido', 'Quem não paga o sustento: uma casa de Ferimento I marcada.', 'economia#recursos'],
  ['Dízimo', 'Imposto sobre salário e venda: 10, 15 ou 20%.', 'economia#impostos'],
  ['Encantamento', 'Efeito gravado num item com Pó de Cristal.', 'itens#encantamentos'],
  ['Estágio', 'Nível de poder do personagem, do 9º ao 1º.', 'progressao'],
  ['Exaustão Mágica', 'Mana zero: -1 classificação nos atributos físicos.', 'mana'],
  ['Feitiço de Alma', 'Técnica única que dobra as regras da própria magia.', 'milagres#feitico-de-alma'],
  ['Ferimento', 'Dano de I (Leve) a IV (Crítico), marcado na Trilha.', 'ferimentos'],
  ['Grau', 'Nível de um feitiço, de I a V.', 'magia'],
  ['Grimório', 'O livro que guarda os feitiços.', 'magia'],
  ['Jazida', 'Mina com grau e Reserva; rende Recursos por Jornada.', 'mineracao#jazidas'],
  ['Jornada de Trabalho', 'Post de 500 caracteres por ciclo que paga o salário do ofício.', 'profissoes#regras'],
  ['Licença', 'Permissão para exercer um ofício, emitida pela Corporação.', 'profissoes#regras'],
  ['Maestria', 'Domínio de um feitiço, de 0 a 3.', 'magia'],
  ['Méritos', 'A moeda de honra dos Generais Brilhantes.', 'generais'],
  ['Milagre', 'Bênção rara que muda as regras do personagem.', 'milagres'],
  ['Minas Profundas', 'Expedições de Rank D a A abaixo das galerias esgotadas.', 'mineracao#minas-profundas'],
  ['Obra-Prima', 'A qualidade máxima de um item: +2 Acréscimos.', 'itens#qualidade'],
  ['Poder Mágico', 'De I a VI: o nível é o número de Acréscimos da magia.', 'atributos'],
  ['Pó de Cristal', 'Recurso que paga os encantamentos.', 'economia#recursos'],
  ['Qualidade', 'Comum, Incomum, Rara, Épica ou Obra-Prima.', 'itens#qualidade'],
  ['Recursos', 'Materiais da economia: minério, cristal, comida, ervas.', 'economia#recursos'],
  ['Reserva', 'Quantas Jornadas uma jazida aguenta antes de descer um grau.', 'mineracao#jazidas'],
  ['Marcado', 'Alma de outro reino que renasce em Diamond com uma Marca no corpo. Todo personagem é um Marcado.', 'mundo'],
  ['Sequela', 'Marca permanente de quem sobrevive a um Ferimento IV sem cirurgia.', 'ferimentos#agravamento'],
  ['Sincronia', 'Vínculo entre dois ou três personagens forjado em perigo.', 'milagres'],
  ['Técnica de Mana', 'Uso da mana fora do Grimório, como Percepção ou Zona de Mana.', 'mana#tecnicas'],
  ['Disco', 'Runa gravada em cristal e engastada no corpo; faz uma coisa só, sem gastar Mana.', 'discos'],
  ['Encaixe', 'Quantos Discos o corpo aguenta: 2, mais 1 no 6º e no 3º Estágio.', 'discos#regras'],
  ['Rejeição', 'O peso de um Disco no corpo; passar do limite causa Cristalização.', 'discos#regras'],
  ['Instabilidade', 'Marcas de uso dos Discos fortes; no limite, o efeito colateral acontece.', 'discos#regras'],
  ['Respiração de Mana', 'Técnica de Diamond que tira mana do pó de cristal do ar.', 'mana#diamond'],
  ['Técnica Rúnica', 'Técnica que leva a Matriz Rúnica mais longe: runas condicionais, inscritas, em cadeia.', 'mana#runas'],
  ['Traço', 'Talento menor: até 3, nenhum com mais de 1 Acréscimo.', 'milagres'],
  ['Trilha de Ferimentos', 'A barra de vida: 3 Leves, 2 Moderados, 1 Grave, 1 Crítico.', 'ferimentos#trilha'],
  ['Vigor', 'O quanto uma terra produz: Morta, Exausta, Fraca ou Viva.', 'terras#vigor'],
  ['Yul', 'A moeda de todos os reinos.', 'economia#moedas'],
];

/* ==========================================================================
   Sistemas exclusivos de Diamond (2026-11-05): Discos de Engaste, Técnicas
   de Mana de Diamond e Técnicas Rúnicas. Aprovados pelo Silas no documento.
   ========================================================================== */

export const discos = {
  texto: 'O Lapidário aprendeu a cortar Cristais de Mana em discos finos e gravar neles uma runa. Um disco engastado no corpo (nuca, antebraço, peito, olho) faz uma coisa só, sempre, sem gastar a Mana do dono. Os Generais Brilhantes saem da Forja cheios deles, a Nobreza compra discos lapidados e a Plebe dos Veios se vira com discos brutos do Veio Negro.',
  regras: [
    ['Encaixes', 'Todo corpo aguenta 2 discos. +1 Encaixe no 6º Estágio e +1 no 3º.'],
    ['Rejeição', 'Cada disco tem Rejeição de 1 a 3. O corpo aguenta Rejeição 5, +1 por classificação de Resistência acima de Comum.'],
    ['Cristalização', 'Passar do limite de Rejeição deixa uma Sequela permanente: a pele em volta do disco vira cristal e o personagem perde 5% de Controle por ponto acima.'],
    ['Instabilidade', 'Os discos mais fortes ganham 1 marca a cada uso. Quando as marcas chegam ao limite do disco, o efeito colateral acontece na hora. As marcas somem no começo de cada ciclo. É um contador, não sorte: o jogador sempre sabe quanto falta.'],
    ['Sobrecarga', '1 vez por cena, o disco rende o dobro por 1 turno. Custa 1 Ferimento I na hora e conta 2 marcas de Instabilidade.'],
    ['Engaste e Desengaste', 'Só com Cirurgia Arcana ou Conhecimento Científico, em 1 cena fora de combate. Tirar um disco não devolve o Encaixe até o fim do ciclo.'],
    ['Sem Acréscimos', 'Nenhum disco dá Acréscimo. Eles dão funções: sentidos, memória, mana guardada, truques.'],
  ],
  lapidacao: [
    ['Bruto', 'Veio Negro, no Fosso', '+1', '150 Yuls'],
    ['Lapidado', 'Oficinas do Lapidário', 'Normal', '400 Yuls'],
    ['Facetado', 'Libardirt e contratos da Coroa', 'Normal, efeito +50%', '1.200 Yuls + Pó de Cristal'],
    ['Brilhante', 'Só a Forja e eventos', '-1', 'Não está à venda'],
  ],
  linhas: [
    ['Sentidos', 'O que o corpo não percebe sozinho.'],
    ['Mente', 'Memória, línguas mortas e conversa à distância.'],
    ['Transporte', 'Para quem cruza o reino seco.'],
    ['Mana', 'Mana guardada, feitiços prontos e gravados.'],
    ['Corpo', 'Aguentar o que mataria um corpo comum.'],
    ['Ilegal', 'Apreendidos pela Guarda da Coroa. Ser pego com um dá multa ou missão punitiva.'],
  ],
  lista: [
    { nome: 'Lente de Mana', linha: 'Sentidos', onde: 'Olho', rejeicao: 1, efeito: 'Vê o fluxo de mana a até 30 m e nota feitiços sendo preparados.' },
    { nome: 'Olho Térmico', linha: 'Sentidos', onde: 'Olho', rejeicao: 1, efeito: 'Enxerga calor através de fumaça, poeira e escuridão.' },
    { nome: 'Sentinela', linha: 'Sentidos', onde: 'Nuca', rejeicao: 1, efeito: 'Acorda o dono quando algo com mana chega a 20 m; ninguém o pega dormindo.' },
    { nome: 'Disco de Pulso', linha: 'Sentidos', onde: 'Ouvido', rejeicao: 1, efeito: 'Ouve batimentos a até 5 m: percebe medo, pressa e nervosismo. Não detecta mentira.' },
    { nome: 'Leitor de Runas', linha: 'Sentidos', onde: 'Olho', rejeicao: 1, efeito: 'Lê qualquer runa, escrita antiga e as pinturas das cavernas; vê quantos turnos faltam para uma runa armada disparar.' },
    { nome: 'Disco de Memória', linha: 'Mente', onde: 'Nuca', rejeicao: 2, efeito: 'Guarda 1 Conhecimento Comum tirado de uma Cápsula de Conhecimento.' },
    { nome: 'Cartógrafo', linha: 'Mente', onde: 'Nuca', rejeicao: 1, efeito: 'Grava toda rota percorrida; o dono nunca se perde e desenha mapas exatos.' },
    { nome: 'Registrador', linha: 'Mente', onde: 'Olho', rejeicao: 2, efeito: 'Grava 1 cena com imagem e som; vale como prova em Contratos e julgamentos.' },
    { nome: 'Âncora', linha: 'Mente', onde: 'Nuca', rejeicao: 2, efeito: '1 vez por cena, ignora uma ilusão, um sono ou um controle mental.' },
    { nome: 'Par Ressonante', linha: 'Mente', onde: 'Ouvido', rejeicao: 1, efeito: 'Vendido em pares: os dois portadores falam pela mente a até 1 km.' },
    { nome: 'Estribo', linha: 'Transporte', onde: 'Perna', rejeicao: 2, efeito: 'Liga o portador a uma montaria, carroça ou barco: o veículo anda o dobro e não cansa, e viagens entre regiões de Diamond levam metade do tempo.' },
    { nome: 'Bateria de Mana', linha: 'Mana', onde: 'Peito', rejeicao: 3, efeito: 'Guarda até 100 de Mana para usar depois; recarrega fora de combate.', instavel: '3 descargas no ciclo: explode. Ferimento III no peito, a Mana guardada se perde e o disco quebra.' },
    { nome: 'Conduíte', linha: 'Mana', onde: 'Antebraço', rejeicao: 2, efeito: '1 feitiço escolhido custa 15% menos Mana.' },
    { nome: 'Gatilho', linha: 'Mana', onde: 'Antebraço', rejeicao: 2, efeito: 'Guarda 1 feitiço próprio já pronto e solta como reação, sem gastar o turno.', instavel: '3 marcas: o feitiço guardado dispara sozinho, no turno que o narrador escolher.' },
    { nome: 'Disco de Gravação', linha: 'Mana', onde: 'Antebraço', rejeicao: 3, efeito: 'Grava 1 feitiço Grau I ou II de outra pessoa (com permissão dela); usa 1 vez por cena.', instavel: '2 marcas: o feitiço sai descontrolado e acerta o alvo mais próximo, aliado ou não.' },
    { nome: 'Selo', linha: 'Mana', onde: 'Mão', rejeicao: 1, efeito: 'Marca uma porta, um baú ou um grimório: só o dono abre sem arrombar.' },
    { nome: 'Filtro', linha: 'Corpo', onde: 'Peito', rejeicao: 1, efeito: 'Imune a gás de mina, poeira tóxica e venenos comuns.' },
    { nome: 'Hemostático', linha: 'Corpo', onde: 'Peito', rejeicao: 2, efeito: 'Ferimentos III não sangram por 1 cena: o Agravamento para.' },
    { nome: 'Coração de Reserva', linha: 'Corpo', onde: 'Peito', rejeicao: 2, efeito: 'Ao chegar no Ferimento IV, fica de pé por mais 2 turnos antes de cair.', instavel: '1 uso: depois disso o disco racha e precisa ser trocado.' },
    { nome: 'Disco Fantasma', linha: 'Ilegal', onde: 'Nuca', rejeicao: 2, efeito: 'Esconde a mana do dono de quem sente mana.' },
    { nome: 'Mímico', linha: 'Ilegal', onde: 'Rosto', rejeicao: 3, efeito: 'Cópia total de alguém que o portador tocou: rosto, corpo, voz, cheiro e assinatura de mana, por 1 cena. Só não copia a magia nem as memórias.', instavel: '2 marcas: o portador se perde na cópia e, por 1 cena, acredita ser a pessoa copiada.' },
    { nome: 'Chave-Mestra', linha: 'Ilegal', onde: 'Mão', rejeicao: 2, efeito: 'Abre Selos e fechaduras comuns em 1 turno.' },
    { nome: 'Disco Berserk', linha: 'Ilegal', onde: 'Nuca', rejeicao: 3, efeito: 'Sobrecarga sem custo de Ferimento, mas o dono não distingue aliado de inimigo naquele turno.', instavel: '2 marcas: apaga e acorda com Ferimento II, sem lembrar a cena.' },
  ],
};

export const tecnicasDiamond = {
  texto: 'O reino secou e a mana no ar ficou rala. Quem vive aqui aprendeu a tirar mana de onde quase não tem. Seguem as regras das outras Técnicas de Mana (Treinos de Técnica; Elfos e Anomalia Mágica pela metade). Estrangeiros não as aprendem.',
  lista: [
    { nome: 'Respiração de Mana', estagio: '9º', controle: '10%', quem: 'Qualquer Marcado', texto: 'Respira o pó de cristal do ar e recupera 3% de Mana por turno sem lançar feitiço (6% numa Zona de Forte Mana). Fora de Diamond, onde a mana é densa, fica Embriagado de Mana: -5% de Controle até se acostumar (3 cenas). Com uma Bateria de Mana engastada, o que passar do máximo vai para a bateria.', ideia: 'As Respirações de Demon Slayer' },
    { nome: 'Corpo Seco', estagio: '9º', controle: '10%', quem: 'Só Plebe, ou quem viveu 1 mês real nos Veios', texto: 'O corpo aprende a gastar quase nada: aguenta 3 dias sem comida e água sem ficar Desnutrido, e a parte de comida do custo de vida cai pela metade.', ideia: 'A disciplina da água dos Fremen, em Duna' },
    { nome: 'Eco de Veio', estagio: '6º', controle: '30%', quem: 'Qualquer Marcado', texto: 'Encosta a mão na pedra e sente o que se move a até 50 m pela vibração da mana no chão. Na Mineração, revela o grau de uma jazida sem gastar Jornada.', ideia: 'O sentido sísmico da Toph, em Avatar, e o En de Hunter x Hunter' },
    { nome: 'Passo Cintilante', estagio: '6º', controle: '30%', quem: 'Qualquer Marcado', texto: 'Solta mana pelas solas e reaparece a até 10 m, como reação. No máximo 2 vezes por cena e nunca em turnos seguidos. Custa 20 de Mana e dobra no segundo uso da cena (40).', ideia: 'O Shunpo de Bleach e o Soru de One Piece' },
    { nome: 'Couraça de Pó', estagio: '5º', controle: '40%', quem: 'Qualquer Marcado', texto: 'Junta o pó de cristal do ar numa casca na pele por 3 turnos: o primeiro Ferimento I de cada turno é anulado. 20 de Mana por turno; não funciona molhado.', ideia: 'O Ken de Hunter x Hunter e o Hierro de Bleach' },
  ],
};

export const runas = {
  texto: 'Um disco é uma runa gravada em cristal. Diamond leva a Matriz Rúnica mais longe que qualquer reino: os runistas do Lapidário gravam runas em pedra, em metal (Cobre e Fio Rúnico) e no próprio corpo. Tudo aqui parte da Matriz Rúnica (6º Estágio, Controle 30%, até 5 runas preparadas). Quem tem o Milagre Insignificância aprende estas técnicas sem o requisito de Estágio.',
  lista: [
    { nome: 'Leitura Rúnica', estagio: '8º', controle: '15%', texto: 'Lê runas alheias: sabe o que cada uma faz e quando dispara. Com 1 turno de toque, desarma uma runa de Grau igual ou menor que o seu máximo. Não exige a Matriz.' },
    { nome: 'Runa Condicional', estagio: '6º', controle: '30%', texto: 'A runa dispara sozinha quando uma condição declarada acontece ("quando alguém abrir esta porta", "quando eu cair"). Fica armada até o fim da cena.' },
    { nome: 'Inscrição', estagio: '5º', controle: '40%', texto: 'Grava a runa numa parede, arma ou objeto, e ela dura 1 semana real. Serve para armadilhas, proteção de Terras e armas com feitiço. Custa 1 Fio Rúnico por runa.' },
    { nome: 'Runa em Cadeia', estagio: '5º', controle: '40%', texto: 'Liga até 3 runas preparadas: quando uma dispara, as outras disparam juntas no mesmo turno.' },
    { nome: 'Selo Rúnico', estagio: '4º', controle: '50%', texto: 'Grava uma runa de selo num grimório, num feitiço ativo ou numa criatura: o alvo fica selado por 3 turnos, ou até alguém desarmar a runa. Custa 2 runas da Matriz.' },
    { nome: 'Voto de Cristal', estagio: '4º', controle: '50%', texto: 'Grava no próprio corpo uma runa de restrição declarada em cena (ex.: "só uso um feitiço nesta luta"). Enquanto cumprir, um feitiço escolhido dobra de alcance ou custa metade da Mana. Quebrar o voto racha a runa: Ferimento II na hora.', ideia: 'Os Votos Vinculantes de Jujutsu Kaisen e as Restrições do Nen' },
  ],
};

// Ordem de leitura para quem acabou de chegar.
export const comecePorAqui = [
  ['mundo', 'Onde você vai acordar.'],
  ['familias', 'Quem a sua alma foi.'],
  ['atributos', 'Como se luta sem dados.'],
  ['profissoes', 'Como se vive em Diamond.'],
  ['comecar', 'Como criar o personagem.'],
];

export const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
