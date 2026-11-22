// NPCs de Diamond mostrados em /npcs/.
// O repositório é público: aqui entra SÓ o que um jogador pode ler.
// Segredos (ponto fraco, ligações, passado escondido) ficam na mesa do mestre, nunca neste arquivo.
//
// Campo de dossiê: { r: rótulo, v: texto } e, quando for o caso:
//   s: 'indef'  -> ainda não definido pela Staff: aparece como mistério
//   s: 'selado' -> a Staff sabe, os jogadores não: aparece riscado (não ponha o texto em v)
//   s: 'incerto'-> há suspeitas, nada confirmado (v = o que se suspeita)
//   opcoes: [...] -> lista de candidatas (ex.: magia ainda em aberto)
// Para revelar um segredo depois de descoberto no RP: troque s: 'selado' por v: 'o texto'.

export const circulo = {
  nome: 'Círculo Meridiano',
  kanji: '環',
  texto: 'Um grupo sem estandarte, sem sede e sem nome nos registros da Coroa. O que se sabe dele cabe em quatro pastas, e metade das folhas ainda está em branco.',
  aviso: 'Folha em branco não é erro: é o que ninguém em Diamond descobriu ainda.',
  dossies: [
    {
      id: 'edmund-kreutz',
      nome: 'Edmund Kreutz',
      kanji: '圧',
      cor: '#ff3b2e',
      campos: [
        { r: 'Afiliação', v: 'Círculo Meridiano' },
        { r: 'Alinhamento', v: 'Maligno, ou neutro de tendência maligna' },
        { r: 'Magia', v: 'Pressão ou Precisão', s: 'incerto' },
        { r: 'Tempo de atuação', s: 'selado' },
        { r: 'Idade e origem', s: 'indef' },
        { r: 'Vínculo de maior relevância', v: 'Iluin Lestrange, aliado por quem nutre estima incomum.' },
      ],
    },
    {
      id: 'iluin-lestrange',
      nome: 'Iluin Lestrange',
      alcunha: 'O Monstro',
      alcunhaNota: 'Nome dado por quem o enfrentou.',
      kanji: '獣',
      cor: '#b77bff',
      campos: [
        { r: 'Natureza', v: 'Humano. A natureza monstruosa pertence à sua magia, e não a ele.' },
        { r: 'Magia', v: 'Magia Monstruosa: transforma-se em monstro, ganha as características dele e sofre mutações.' },
        { r: 'Afiliação', v: 'Círculo Meridiano' },
        { r: 'Alinhamento', v: 'Maligno, ou neutro de tendência maligna' },
        { r: 'Idade e origem', s: 'indef' },
        { r: 'Vínculo de maior relevância', v: 'Edmund Kreutz, aliado que nutre por ele uma estima incomum e o considera indispensável aos desígnios do grupo.' },
        { r: 'Registro de maior relevância', v: 'Enviado por {censura}, por ser a escolha mais conveniente à ocasião, despertou a antimagia num garoto, aterrorizando-o e infectando seus colegas.' },
      ],
    },
    {
      id: 'odette-kern',
      nome: 'Odette Kern',
      kanji: '言',
      cor: '#dcb465',
      campos: [
        { r: 'Magia', v: 'Kotodama, a Magia da Palavra' },
        { r: 'Afiliação', v: 'Círculo Meridiano' },
        { r: 'Alinhamento', v: 'Maligno, ou neutro de tendência maligna' },
        { r: 'Idade e origem', s: 'indef' },
        { r: 'Vínculos de maior relevância', s: 'indef' },
      ],
    },
    {
      id: 'cassian-reiter',
      nome: 'Cassian Reiter',
      kanji: '謎',
      cor: '#8fa3b8',
      campos: [
        { r: 'Magia', s: 'indef', opcoes: ['Calor', 'Precisão', 'Projétil', 'Reparo', 'Fratura', 'Revestimento'] },
        { r: 'Afiliação', v: 'Círculo Meridiano' },
        { r: 'Alinhamento', v: 'Maligno, ou neutro de tendência maligna' },
        { r: 'Idade e origem', s: 'indef' },
        { r: 'Vínculos de maior relevância', s: 'indef' },
      ],
    },
  ],
};

// A Feira do Cristal (21/11/2026): quem estava lá.
export const lados = [
  { id: 'coroa', nome: 'A Coroa', kanji: '冠', texto: 'Farda, medalha e o leilão oficial.' },
  { id: 'fosso', nome: 'O Fosso', kanji: '淵', texto: 'Quem manda de onde a luz não chega.' },
  { id: 'veios', nome: 'Os Veios', kanji: '脈', texto: 'Barracas, fornalhas e gente que se vira.' },
];

export const feira = {
  nome: 'Feira do Cristal',
  quando: '21/11/2026',
  texto: 'A noite em que a Coroa abriu o leilão para o povo e alguém levou o lote que não devia. Estes são os rostos que os Marcados encontraram por lá. O que cada um esconde, só o RP descobre.',
  npcs: [
    {
      id: 'severo-halden', lado: 'fosso', nome: 'Severo Halden', papel: 'O dono das galerias do Fosso', kanji: '鉱',
      onde: 'O Fosso',
      aparencia: 'Alto e magro, cabelo preto penteado para trás, cicatriz escura e vitrificada repuxando o lado esquerdo do rosto. O olho esquerdo, âmbar avermelhado, nunca pisca. Sobretudo de gola alta e piteira.',
      quer: 'Ex-minerador dos Veios que tomou as galerias do Fosso em vez de pedir piedade. Trata pessoas como investimento.',
      tique: 'Bate a piteira duas vezes na bigorna ou na cadeira quando alguém diz algo ingênuo.',
      falas: ['Vocês desceram mais rápido do que eu achei. Isso é bom. Gente lenta não me serve.', 'Eu não roubei nada. Eu recebi uma encomenda. A diferença é quem assina.'],
    },
    {
      id: 'mordecai-vane', lado: 'fosso', nome: 'Mordecai Vane', alcunha: 'Bico-de-Ouro', papel: 'Agiota do Fosso', kanji: '金',
      onde: 'Vias escuras, Entrada e Leilão',
      aparencia: 'Terno escuro impecável, casaco de pele sobre os ombros, cicatriz cruzando o nariz, charuto grosso, anéis de ouro pesado e o sorriso de quem já fechou o negócio.',
      quer: 'Emprestar para todo mundo que tem olho brilhando e bolso vazio, e cobrar com juros.',
      tique: 'Gira uma moeda de ouro antiga entre os nós dos dedos enquanto espera a resposta.',
      falas: ['Olho brilhando e bolso vazio é a receita mais triste de Diamond. Me dê sua assinatura e eu ponho o ouro na sua mão agora.', 'Os bancos da Coroa tomam sua casa. Eu tomo o seu futuro. É mais justo, se você pensar bem.'],
    },
    {
      id: 'leiloeiro-mudo', lado: 'fosso', nome: 'O Leiloeiro Mudo', papel: 'Contrabandista das vias escuras', kanji: '黙',
      onde: 'Vias escuras · responde por bilhete no /falar',
      aparencia: 'Manto escuro, máscara lisa rachada, mãos rápidas. Só fala por gestos.',
      quer: 'Vender e não ser lembrado. Nunca entrega cliente.',
      tique: 'Duas batidas no caixote significam não. Um dedo na máscara significa silêncio.',
      falas: ['(mostra o preço nos dedos)', '(desenha uma escada no pó do chão e apaga com o pé)'],
    },
    {
      id: 'cassius-albrecht', lado: 'coroa', nome: 'Cassius Albrecht', papel: 'General da Tropa de Abate', kanji: '傲',
      onde: 'Leilão',
      aparencia: 'Porte imponente, armadura branca e dourada, cabelo claro perfeitamente alinhado e um nojo mal disfarçado diante da Plebe.',
      quer: 'Nobre do Lapidário. Acredita de verdade que os Veios são um tumor sugando Diamond e que ele é o cirurgião.',
      tique: 'Segura um lenço de seda perfumado perto do nariz ao falar com gente dos Veios e limpa uma poeira que não existe do ombro.',
      falas: ['Ninguém sai. Revistem primeiro os dos Veios. Ladrão tem cheiro de fuligem, e aqui sobra.', 'Você, plebeu. De joelhos enquanto eu falo.'],
    },
    {
      id: 'iselde-varn', lado: 'coroa', nome: 'Iselde Varn', papel: 'Capitã da Tropa de Reconhecimento', kanji: '義',
      onde: 'Leilão e Vias escuras',
      aparencia: 'Postura militar impecável, uniforme de campanha gasto, cabelo preso sem vaidade, olhar firme e cansado de quem já viu guerra demais.',
      quer: 'Proteger quem não pode se proteger, mesmo sabendo que há podridão na Coroa.',
      tique: 'Estala os nós dos dedos em silêncio toda vez que se segura para não interromper o Cassius.',
      falas: ['Cassius, o ladrão está fugindo enquanto você revista uma avó.', 'Quem tiver perna e coragem, comigo. Agora.'],
    },
    {
      id: 'orlen-vasq', lado: 'coroa', nome: 'Orlen Vasq', papel: 'Tenente da Tropa de Conquista', kanji: '諂',
      onde: 'Leilão',
      aparencia: 'Postura curvada, sorriso bajulador e sádico, uniforme coberto de medalhas polidas e cara de covarde quando enfrenta alguém mais forte.',
      quer: 'Nobre falido com medo de perder o posto. Compensa humilhando quem está abaixo dele.',
      tique: 'Ajeita as medalhas toda vez que fala com alguém acima dele.',
      falas: ['Ouviram o General. Bolsa no chão, ratos.', 'Ops. Imposto.'],
    },
    {
      id: 'brann-tolve', lado: 'coroa', nome: 'Brann Tolve', papel: 'Sargento da guarda da entrada', kanji: '番',
      onde: 'Entrada',
      aparencia: 'Homem sério de olheiras marcadas, farda bem passada com o colarinho afrouxado e a energia de quem só quer terminar o turno sem mortos.',
      quer: 'Voltar para casa inteiro. A filha nasce na semana que vem.',
      tique: 'Olha o relógio de bolso a cada fala, sem nunca ler a hora.',
      falas: ['Bolsa aberta, mão fora do grimório. Isso, assim.', 'Não entrem nas vias escuras, tá? Ontem sumiu uma carroça inteira lá atrás. Ninguém viu nada. Como sempre.'],
    },
    {
      id: 'anselm-quilate', lado: 'coroa', nome: 'Lorde Anselm Quilate', papel: 'Leiloeiro da Coroa', kanji: '槌',
      onde: 'Leilão',
      aparencia: 'Alto e magro, sorriso teatral exagerado, fraque elegante com detalhes dourados e uma bengala de cristal que faz as vezes de martelo.',
      quer: 'Terminar o leilão vivo.',
      tique: 'Gira a bengala antes de cada frase importante.',
      falas: ['Senhoras, senhores, Marcados de todo canto de Diamond!', 'Dou-lhe uma, dou-lhe duas... vendido!'],
    },
    {
      id: 'hulda-pedra-fria', lado: 'veios', nome: 'Hulda Pedra-Fria', papel: 'Mestra da Guilda dos Ferreiros', kanji: '鍛',
      onde: 'Feira, barraca da Guilda',
      aparencia: 'Robusta, braços fortes marcados por faíscas, olhar severo e honesto, pavio curto para frescura.',
      quer: 'Saber para quem a Coroa vai vender o martelo.',
      tique: 'Bate o martelo na bancada para encerrar qualquer negociação.',
      falas: ['Dois por cabeça, e não adianta chorar.', 'Ferro bom tem marca. Toda peça das Fornalhas leva o punção da Guilda. Peça sem marca é peça que ninguém quer assumir.'],
    },
    {
      id: 'vo-mirela', lado: 'veios', nome: 'Vó Mirela', papel: 'A feirante mais antiga dos Veios', kanji: '母',
      onde: 'Feira, panela de sopa',
      aparencia: 'Baixinha, curvada, coque bagunçado e um olhar absurdamente esperto atrás das rugas.',
      quer: 'Alimentar os órfãos da rua. Perdeu o filho nas minas e adotou o bairro inteiro.',
      tique: 'Chama todo mundo de "meu filho", inclusive General.',
      falas: ['Chega, meu filho, chega! Sopa é de graça pra quem me contar uma novidade.', 'Você viu um menino magrinho, boné de mineiro? É o Pito. Bom menino. Anda com gente ruim lá de baixo.'],
    },
    {
      id: 'kaelen-vidro-fino', lado: 'veios', nome: 'Mestre Kaelen Vidro-Fino', papel: 'Estudioso expulso do Lapidário', kanji: '盤',
      onde: 'Feira, banca de Discos',
      aparencia: 'Jaleco do Lapidário manchado de tinta rúnica, óculos redondos, cabelo desalinhado e o ar de quem dorme três horas por semana.',
      quer: 'Provar que plebeu merece magia tanto quanto nobre. Foi expulso por vender Discos baratos.',
      tique: 'Fala com os Discos como se eles respondessem.',
      falas: ['Disco Lapidado, quase de graça! Não explode. Quase nunca.', 'A mana não tem classe social. Quem tem é a gente.'],
    },
    {
      id: 'pito', lado: 'veios', nome: 'Pito', papel: 'Menino dos Veios, 12 anos', kanji: '童',
      onde: 'Entrada, Feira e Vias escuras',
      aparencia: 'Magro, arisco, roupas largas e remendadas, boné de mineiro torto e o olhar rápido de quem cresceu sobrevivendo.',
      tique: 'Puxa a aba do boné para baixo quando mente.',
      falas: ['Moça, me dá uma moeda? Não? Tá bom. Seu bolso tá furado, só pra você saber.', 'Quando o sino tocar pela segunda vez, fica longe do palco. Sério.'],
    },
  ],
};

// NPCs que respondem com /falar no bot (canon/npcs-ia.ts). Sem nome próprio por enquanto.
export const balcoes = {
  texto: 'Oito NPCs respondem com /falar no canal deles. Cada um sabe coisas do lugar e esconde segredos: quem ganha a confiança leva uma pista, uma a cada 7 dias por NPC.',
  lista: [
    ['A taverneira', 'Último Brilho'],
    ['O agenciador', 'Mural'],
    ['O mestre das Fornalhas', 'Fornalhas da Guilda'],
    ['O cambista', 'Câmbio'],
    ['A dona da Toca', 'Toca do Lampião'],
    ['O estalajadeiro', 'Estalagem da Encruzilhada'],
    ['O leiloeiro mudo', 'Vias escuras · responde por bilhete'],
    ['A reitora', 'Escola de Medicina'],
  ],
};
