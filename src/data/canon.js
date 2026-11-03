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
  { id: 'III', kanji: '魔導', nome: 'O Grimório', texto: 'O que a sua alma sabe fazer, e como isso se mede sem dados.' },
  { id: 'IV', kanji: '道', nome: 'O Caminho', texto: 'Como crescer, a quem servir e o que caçar.' },
  { id: 'V', kanji: '始', nome: 'O Despertar', texto: 'Criar o personagem e abrir os olhos.' },
];

export const paginas = [
  { slug: 'mundo', cap: 'I', num: '01', titulo: 'O Mundo', resumo: 'Diamond, suas regiões e os quatro reinos' },
  { slug: 'familias', cap: 'II', num: '02', titulo: 'Famílias', resumo: 'Classes sociais e as 24 linhagens' },
  { slug: 'racas', cap: 'II', num: '03', titulo: 'Raças', resumo: 'Humanos, Anões, Bruxas e Elfos' },
  { slug: 'classes', cap: 'III', num: '04', titulo: 'Classes de Mago', resumo: 'Oito estilos de combate' },
  { slug: 'milagres', cap: 'III', num: '05', titulo: 'Milagres e Traços', resumo: 'As bênçãos raras da mana' },
  { slug: 'magia', cap: 'III', num: '06', titulo: 'Magia', resumo: 'Magias, Grimórios e Feitiços' },
  { slug: 'mana', cap: 'III', num: '07', titulo: 'Mana', resumo: 'Reserva, custo e Técnicas de Mana' },
  { slug: 'atributos', cap: 'III', num: '08', titulo: 'Atributos', resumo: 'Acréscimos e confronto sem dados' },
  { slug: 'progressao', cap: 'IV', num: '09', titulo: 'Progressão', resumo: 'Treinos, Estudos e Estágios' },
  { slug: 'conhecimentos', cap: 'IV', num: '10', titulo: 'Conhecimentos', resumo: 'Comuns, Incomuns e Perdidos' },
  { slug: 'missoes', cap: 'IV', num: '11', titulo: 'Missões', resumo: 'Do Rank F ao Rank S, pelo bot' },
  { slug: 'generais', cap: 'IV', num: '12', titulo: 'Carreiras', resumo: 'Generais Brilhantes e Veio Negro' },
  { slug: 'comecar', cap: 'V', num: '13', titulo: 'Começar', resumo: 'Criação de personagem e Ficha' },
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
    texto: 'Quase extintos depois de séculos caçados pelos Humanos. Em Diamond, são capturados para os laboratórios; um Anão Retornado vive escondido. Forja, comida farta e verdade definem seu povo.',
    habilidades: [
      ['Discernimento Anão', 'Distingue o verdadeiro do falso; mentiras não funcionam contra ele.'],
      ['Visão Verdadeira', 'Enxerga através de ilusões enquanto tiver mais Mana atual que quem as mantém.'],
      ['Glutão', 'Uma refeição farta recupera 25% da Mana máxima, uma vez por cena.'],
      ['Limitações', 'Nunca passa de 1,50 m, nem por magia. Só pertence a famílias anãs.'],
    ],
  },
  {
    nome: 'Bruxas', atributos: ['Comum', 'Comum', 'Comum', 'II', 'I', '10%'], obtencao: 'Modelos (raro), sorteios e eventos',
    texto: 'Criadas pela magia da Rainha das Bruxas e educadas nas artes obscuras. Uma Bruxa Retornada renasce longe da Floresta das Bruxas e, por isso, já nasce sob a Maldição da Rainha.',
    habilidades: [
      ['Aptidão Arcana', 'Na criação, o modelo Bruxa recebe 2 giros extras de Magia, só para ele.'],
      ['Pacto Familiar', 'Cria um familiar com um feitiço que não ocupa espaço no Grimório.'],
      ['Conhecimento Proibido', 'Começa com Artes Obscuras, sem ocupar espaço.'],
      ['Maldição da Rainha', 'Não pode gerar filhos.'],
    ],
  },
  {
    nome: 'Elfos', atributos: ['Sobre-Humana', 'Sobre-Humana', 'Sobre-Humana', 'III', 'V', '35%'], obtencao: 'Família Licht, Reencarnação Élfica, sorteios e eventos',
    texto: 'A raça mais dotada de magia que já existiu, exterminada pelos Humanos. Foram os primeiros Retornados conhecidos. Em Diamond, são caçados como cobaias de valor inestimável.',
    habilidades: [
      ['Comunhão com a Mana', 'Regenera Mana em dobro e paga metade do custo de tudo.'],
      ['Aprendizado Natural', 'Aprende Técnicas de Mana sozinho, com metade dos treinos.'],
      ['Refinamento Superior', 'Manipula a magia com a precisão de um Estágio acima.'],
      ['Corpo Mágico', 'Acessa a Forma Mágica um Estágio antes.'],
      ['Conhecimento Proibido', 'Começa com Artes Obscuras e Artes Demoníacas, sem ocupar espaços.'],
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
  { nome: 'Kira', classe: 'Realeza', origem: 'Clover', raca: 'Humanos', raridade: 'Rara', lema: 'Família governante de Clover, juízes do trono.', magias: 'Balança; Luz só para o primeiro Retornado', heranca: ['Milagre Amado pela Mana', 'Conhecimento em Retórica', 'Zona de Mana um Estágio antes'], marco: '4º Estágio: Conhecimento em Arcanologia' },
  { nome: 'Vermillion', classe: 'Realeza', origem: 'Clover', raca: 'Humanos', raridade: 'Rara', lema: 'Linhagem real de sangue quente.', magias: 'Fogo, Plantas, Cerejeira', heranca: ['Conhecimento em Combate', 'Força e Resistência +1 classificação'], marco: '5º Estágio: Milagre Mana Distinta (Mana Quente), se não tiver Milagre' },
  { nome: 'Silva', classe: 'Realeza', origem: 'Clover', raca: 'Humanos', raridade: 'Rara', lema: 'Casa real ligada aos Elfos, obcecada por controle.', magias: 'Mercúrio, Névoa, Água', heranca: ['Percepção de Mana', 'Conhecimento em Magia', 'Forma Mágica um Estágio antes'], giro: '30% de Milagre Vaso Defeituoso', marco: '8º Estágio: o primeiro com Água recebe o feitiço Leviatã (Grau III)' },
  { nome: 'Grinberryal', classe: 'Realeza', origem: 'Spades', raca: 'Humanos', raridade: 'Rara', vagas: 3, lema: 'Antiga família real de Spades, derrubada pela Tríade.', magias: 'Sol, Lua, Estrela (se não houver usuário)', heranca: ['Milagre Amado pela Mana', 'Mana +1 nível', 'Conhecimento em Magia'], marco: '6º Estágio: pode reivindicar a coroa de Spades em evento' },
  { nome: 'Lolopechka', classe: 'Realeza', origem: 'Heart', raca: 'Humanos', raridade: 'Rara', lema: 'Reina em Heart, protegida pelo espírito da água.', magias: 'Água', heranca: ['Percepção de Mana', 'Matriz Rúnica sem requisito', 'Conhecimento em Magia'], marco: '5º Estágio: o primeiro com Água pode firmar pacto com Undine' },
  { nome: 'Zogratis', classe: 'Realeza', origem: 'Spades', raca: 'Humanos', raridade: 'Sorteio', vagas: 3, lema: 'Tomaram Spades e lideram a Tríade.', magias: 'Sangue, Ossos, Corpo', heranca: ['Grimório Demoníaco', 'Conhecimento em Artes Demoníacas', 'Força e Resistência +1 classificação', 'Traço Presença Impactante'], marco: '4º Estágio: pode disputar a liderança da Tríade' },
  { nome: 'Faust', classe: 'Nobreza', origem: 'Clover', raca: 'Humanos', raridade: 'Sorteio', lema: 'Estudaram demônios até serem destruídos por um.', magias: 'Sombras, Luz', heranca: ['Conhecimento em Artes Demoníacas', 'Conhecimento em Oratória', 'Poder Mágico +1 nível'], marco: '7º Estágio: o Grimório vira Demoníaco' },
  { nome: 'Libardirt', classe: 'Nobreza', origem: 'Diamond', raca: 'Humanos', raridade: 'Rara', lema: 'Cientistas reais de Diamond, mestres da costura de grimórios.', magias: 'Recombinação, Gel', heranca: ['Conhecimento Científico', 'Costura Grimórios na metade do tempo e do custo', 'Laboratório próprio (Câmara de Mana)'], giro: '50% de trocar a magia por Modificação', marco: '6º Estágio: Conhecimento em Ciências Aplicadas' },
  { nome: 'Vangeance', classe: 'Nobreza', origem: 'Clover', raca: 'Humanos', raridade: 'Comum', lema: 'Um atributo mágico incomum e um capitão lendário.', magias: 'Plantas, Cerejeira', heranca: ['Poder Mágico +1 nível'], marco: '4º Estágio: se for Elfo, Árvore do Mundo e Milagre Dupla Alma (1 vaga)' },
  { nome: 'Boismortier', classe: 'Nobreza', origem: 'Clover', raca: 'Humanos', raridade: 'Comum', lema: 'Artistas de magia poderosa e desgastante.', magias: '—', heranca: ['Milagre Amado pela Mana', '+1 Acréscimo em todos os feitiços'], giro: '60% de Pintura; 15% de Reencarnação Élfica' },
  { nome: 'Voltia', classe: 'Nobreza', origem: 'Clover', raca: 'Humanos', raridade: 'Comum', lema: 'Sentem a mana por instinto e vivem pela batalha.', magias: 'Relâmpago', heranca: ['Percepção de Mana', 'Conhecimento em Combate', 'Método de Mana e Forma Mágica com metade dos treinos'], marco: '7º Estágio: Fúria de Batalha' },
  { nome: 'Roselei', classe: 'Nobreza', origem: 'Clover', raca: 'Humanos', raridade: 'Comum', lema: 'Marcados por uma maldição que atravessa gerações.', magias: 'Roseiras, Terra, Plantas', heranca: ['Corpo Amaldiçoado', 'Método de Mana e Forma Mágica um Estágio antes'], giro: '40% de Reencarnação Élfica' },
  { nome: 'Agrippa', classe: 'Plebe', origem: 'Clover', raca: 'Humanos', raridade: 'Comum', lema: 'Pele pálida, olhos anelados e a Magia de Maldição.', magias: 'Veneno', heranca: ['Conhecimento em Maldição', 'Feitiços de Maldição +1 Acréscimo', 'Anulam a parte ruim do Corpo Amaldiçoado'], marco: 'Os 3 primeiros criam uma maldição própria' },
  { nome: 'Ideale', classe: 'Plebe', origem: 'Clover', raca: 'Humanos', raridade: 'Comum', lema: 'Os primeiros plebeus a vestir um manto de cavaleiro.', magias: 'Fogo, Fumaça', heranca: ['Conhecimento em Armadilha', '+4 espaços só para Armadilha'], giro: '40% de Matriz Rúnica; 8% de Amado pela Mana' },
  { nome: 'Lichita', classe: 'Plebe', origem: 'Clover', raca: 'Humanos', raridade: 'Comum', lema: 'Uma mulher que se isolou para não sugar a mana dos outros.', magias: '—', heranca: ['Resistência +1 classificação'], giro: '15% Sem Magia; com magia, 33% de Doença de Mana', marco: '5º Estágio: o primeiro Sem Magia recebe o Demônio da Antimagia' },
  { nome: 'Sukehiro', classe: 'Plebe', origem: 'Terra do Sol', raca: 'Humanos', raridade: 'Sorteio', lema: 'Estrangeiros que lutam com lâmina e Ki.', magias: '—', heranca: ['Leitura de Ki', 'Conhecimento em Esgrima', 'Força +1 classificação', 'Katana de qualidade Incomum'], marco: '5º Estágio: os dois primeiros podem receber Escuridão' },
  { nome: 'Swallowtail', classe: 'Plebe', origem: 'Spades', raca: 'Humanos', raridade: 'Rara', lema: 'Curam com qualquer magia.', magias: 'Corpo', heranca: ['Conhecimento Medicinal', 'Reversão: qualquer feitiço recebe Restauração', '+1 classificação num atributo físico'] },
  { nome: 'Frankenstein', classe: 'Plebe', origem: 'Diamond', raca: 'Anões', raridade: 'Comum', lema: 'Anões escravizados nos laboratórios de Diamond.', magias: '—', heranca: ['Força e Resistência +1 classificação', 'Arma pesada de qualidade Épica', 'Não pode ser Mago Artífice'] },
  { nome: 'Pappitson', classe: 'Plebe', origem: 'Clover', raca: 'Anões', raridade: 'Comum', lema: 'Anões antigos escondidos entre plebeus.', magias: '—', heranca: ['Resistência +1 classificação', 'Estudos e Técnicas pela metade'], marco: '7º Estágio: Hibridismo e Magia de Comida' },
  { nome: 'Alonargez', classe: 'Plebe', origem: 'Reino Subterrâneo', raca: 'Anões', raridade: 'Rara', lema: 'A família real dos Anões, criadores da ciência.', magias: '—', heranca: ['Resistência +1 classificação', 'Traço Resistência a Malefícios', 'Conhecimento Científico', 'Poder Mágico +1 nível'], marco: '6º Estágio: Magia de Forja (3 primeiros)' },
  { nome: 'Enoteca', classe: 'Plebe', origem: 'Floresta das Bruxas', raca: 'Bruxas', raridade: 'Comum', lema: 'A família real das Bruxas.', magias: 'Fios', heranca: ['Conhecimento em Maldição', 'Mana +1 nível'], giro: '30% de trocar a magia por Sangue', marco: '4º Estágio: Rainha das Bruxas; 3º: Fio Vermelho do Destino' },
  { nome: 'Trinity', classe: 'Plebe', origem: 'Floresta das Bruxas', raca: 'Bruxas', raridade: 'Rara', lema: 'Linhagem apagada, construtora das defesas da floresta.', magias: 'Barreiras', heranca: ['Milagre Amado pela Mana', 'Traço Presença Impactante', 'Conhecimento em Magia', '+3 espaços só para Criação'] },
  { nome: 'Unsworth', classe: 'Plebe', origem: 'Clover', raca: 'Bruxas', raridade: 'Comum', lema: 'Bruxas que fugiram e fizeram nome entre os humanos.', magias: '—', heranca: ['Percepção de Mana', 'Uma varinha', 'Conhecimento em Magia no 7º Estágio'], marco: '5º Estágio: a primeira pode trocar a magia por Sonhos' },
  { nome: 'Licht', classe: 'Plebe', origem: 'Elfos', raca: 'Elfos', raridade: 'Rara', lema: 'Almas élficas que voltam escondidas em corpos novos.', magias: 'Luz, Espadas', heranca: ['+3 feitiços iniciais', 'Poder Mágico +1 nível', 'Forma Mágica um Estágio antes'], giro: '45% de Terceiro Olho', marco: '6º Estágio: Conhecimento em Arcanologia' },
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
  { nome: 'Mana Distinta', antes: 'Característica Mágica', texto: 'A mana tem uma natureza própria: densa, quente, cortante. Definida com o Conselho Mágico.', efeitos: ['Todos os feitiços carregam a propriedade.', 'Uma vez por cena, +1 Acréscimo num atributo coerente com ela.'] },
  { nome: 'Anomalia Mágica', antes: 'Dominador', texto: 'Entende a magia por instinto e tem menos limites que os outros.', efeitos: ['Técnicas de Mana com metade dos treinos e alcance ampliado.', 'Feitiços custam 20% menos e começam com Maestria 2.', 'Lutas extremas contam como treinos de Técnica.'] },
  { nome: 'Dupla Alma', texto: 'Duas almas dividem o mesmo corpo, acorrentadas uma à outra.', efeitos: ['Alma Forte e Alma Fraca, cada uma com magia e grimório.', 'A troca custa o turno e troca feitiços e personalidade.', 'A Alma Forte pode se disfarçar da outra.'] },
  { nome: 'Insignificância', restricao: 'Só Plebe', texto: 'Nasceu quase sem mana num mundo onde a magia é tudo. No lugar da força, engenho.', efeitos: ['Mana um nível abaixo da classe (mínimo 50).', 'Matriz Rúnica sem requisito e sem limite de runas.', 'Percepção de Mana desde o início.', 'Nobres subestimam suas armadilhas.'] },
  { nome: 'Vaso Defeituoso', texto: 'Correntes enferrujadas: falta controle e sobra potência.', efeitos: ['Cada nível de Mana vale o dobro.', 'Poder Mágico +1 nível.', 'Treinos de Controle rendem metade.'] },
  { nome: 'Amado pela Mana', antes: 'Prodígio e Adorado pela Mana', texto: 'A mana reconhece o personagem e flui com mais naturalidade ao seu redor.', efeitos: ['Mana e Poder Mágico +1 nível.', 'Treinos mágicos e de Controle contam em dobro.', 'Pode receber um Grimório Lendário.'] },
  { nome: 'Tengentsu', texto: 'Técnica ocular do País do Sol que lê o Ki. O preço é a própria magia.', efeitos: ['Vê com precisão tudo ao redor no presente.', 'Lê intenções; nunca é pego desprevenido.', 'Renuncia à mana: sem feitiços nem Técnicas.'] },
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
  ['Ligação Natural', 'Entende e doma animais; +1 no limite de vinculados'],
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
  ['III', 'Grave', '2 classificações', '-1 classificação nos atributos físicos'],
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
  texto: 'Ninguém sabe por que certas almas voltam, nem por que todas voltam em Diamond. Os estudiosos do Lapidário chamam o fenômeno de Retorno e os renascidos de Retornados. Um Retornado lembra fragmentos da vida anterior: um nome de família, uma magia, um juramento. O resto ele precisa descobrir.',
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
  texto: 'A força militar de elite de Diamond nasce de experimentos. Crianças e jovens passam por procedimentos, treinos e condições extremas; muitos não sobrevivem, e os que sobrevivem são educados para obedecer, combater e eliminar. Os Retornados que se apresentam ao Exame da Forja passam por uma versão abreviada desse processo.',
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

export const exclusivasAntigas = 'Prodígio e Adorado pela Mana viraram o Milagre Amado pela Mana; Dupla Alma, Tengentsu e Absorção e Emissão são Milagres; Berserk virou a Fúria de Batalha dos Voltia; Corpo Amaldiçoado ficou com os Roselei; Doença de Mana ficou com os Lichita; Reencarnação Élfica virou Giro de Linhagem; Hibridismo virou o Marco dos Pappitson no 7º Estágio.';

// Utilitário: transforma um nome em caminho de arquivo (para os espaços de imagem).
export const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
