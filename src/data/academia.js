/**
 * Academia do Marcado (/guia/): as regras ensinadas em lições curtas, com exemplo e uma pergunta.
 * Todos os números saem do Cânone (canon.js); nada aqui é regra nova.
 */
import { classesSociais, classificacoes, manaNiveis, romanos, estagios, pontosEstagio, ranks, controleFaixas } from './canon.js';

const cs = Object.fromEntries(classesSociais.map((c) => [c.nome, c]));
const rankBranco = ranks.find((r) => /Branco/.test(r.cristais));

export const licoes = [
  {
    id: 'marcado', k: '魂', titulo: 'O que é um Marcado',
    curto: 'Quem você é quando acorda em Diamond.',
    blocos: [
      ['Você já morreu', 'Todo personagem viveu e morreu em outro reino (Clover, Spades, Heart ou outras terras) e voltou num corpo novo em Diamond, com uma Marca que a mana reconhece. Por isso se chama Marcado.'],
      ['A família vem da vida passada', 'O sobrenome, as magias que a família costuma ter e alguns dons vêm de quem você foi. A família também decide a classe social.'],
      ['A classe social decide onde você renasce', `Realeza acorda em ${cs.Realeza.regiao} com ${cs.Realeza.dinheiro}; Nobreza, em ${cs.Nobreza.regiao} com ${cs.Nobreza.dinheiro}; Plebe, em ${cs.Plebe.regiao} com ${cs.Plebe.dinheiro}.`],
    ],
    exemplo: 'Lúx foi um herdeiro em Spades e morreu na própria cerimônia. A família Zogratis é da Realeza, então ele acorda na Coroa, com 5.000 Yuls no bolso.',
    pergunta: { q: 'Uma alma da Nobreza renasce em qual região?', opcoes: [cs.Realeza.regiao, cs.Nobreza.regiao, cs.Plebe.regiao], certa: 1, porque: `A Nobreza renasce em ${cs.Nobreza.regiao}, as cidades-laboratório do reino.` },
    links: [['familias', 'Famílias'], ['mundo', 'O Mundo'], ['racas', 'Raças']],
  },
  {
    id: 'atributos', k: '体', titulo: 'Lutar sem dados',
    curto: 'Quem vence um golpe, e por quê.',
    blocos: [
      ['Três atributos físicos', `Força (o que você destrói), Resistência (o que você aguenta) e Velocidade (quem age primeiro). Cada um tem uma classificação, de ${classificacoes[0].nome} a ${classificacoes.at(-1).nome}.`],
      ['Acréscimos', 'Bônus pequenos em cima da classificação, vindos de magia, Poder Mágico, classe e itens. Dez Acréscimos valem uma classificação inteira.'],
      ['O confronto', 'Força contra Resistência, Velocidade contra Velocidade. A classificação decide primeiro; se empatar, valem os Acréscimos; se empatar de novo, as circunstâncias e a qualidade da cena escrita.'],
    ],
    exemplo: `Força ${classificacoes[3].nome} contra Resistência ${classificacoes[2].nome} +3: a classificação decide primeiro, e Extrema é maior. O golpe passa, os Acréscimos nem entram na conta.`,
    simulador: true,
    pergunta: { q: `Força ${classificacoes[2].nome} +4 contra Resistência ${classificacoes[2].nome} +1. Quem vence?`, opcoes: ['O ataque', 'A defesa', 'Empate'], certa: 0, porque: 'As classificações empatam, então valem os Acréscimos: 4 contra 1.' },
    links: [['atributos', 'Atributos'], ['ferimentos', 'Ferimentos']],
  },
  {
    id: 'mana', k: '魔', titulo: 'Mana, Poder e Controle',
    curto: 'Os três números da sua magia.',
    blocos: [
      ['Reserva Mágica (I a X)', `O tamanho do tanque. Reserva I tem ${manaNiveis[0]} de Mana; Reserva X tem ${manaNiveis[9]}. A barra de Mana da ficha mostra quanto ainda resta.`],
      ['Poder Mágico (I a VI)', 'A força dos feitiços. O nível é o número de Acréscimos que a magia soma ao atributo que ela usa.'],
      ['Controle (0 a 100%)', `A precisão. Mais Controle, menos Mana por feitiço (até ${controleFaixas.at(-1)[1]}% de desconto com 96% ou mais), e alguns Estágios pedem um mínimo.`],
    ],
    exemplo: `Na ficha do bot aparece "Reserva Mágica VI / X" e "Mana 1100 / 1100": Reserva ${romanos[5]} é ${manaNiveis[5]} de Mana cheia.`,
    pergunta: { q: 'Reserva Mágica IV dá quanta Mana máxima?', opcoes: [String(manaNiveis[2]), String(manaNiveis[3]), String(manaNiveis[4])], certa: 1, porque: `Os níveis vão ${manaNiveis.slice(0, 5).join(', ')}... A Reserva IV guarda ${manaNiveis[3]}.` },
    links: [['mana', 'Mana'], ['magia', 'Magia'], ['classes', 'Classes de Mago']],
  },
  {
    id: 'estagios', k: '昇', titulo: 'Estágios e Ascensão',
    curto: 'Como o Marcado fica mais forte.',
    blocos: [
      ['Do 9º ao 1º', `Todo Marcado começa no 9º Estágio. Cada Estágio pede Pontos de Estágio (PE), às vezes Cristais e Controle. O 8º, por exemplo, pede ${estagios[1].req}.`],
      ['De onde vêm os PE', pontosEstagio.map(([v, d]) => `${v} ${d}`).join('; ') + '.'],
      ['O que muda', 'Cada Estágio sobe o teto dos atributos físicos e destrava coisas: Técnicas de Mana, Pontos de Trilha, Despertar de Traço, Forma Mágica.'],
    ],
    exemplo: 'Lúx treinou Velocidade até Sobre-Humana (+1 PE) e ganhou Controle de 20% para 30% (+1 PE). Com o resto dos PE e os Cristais Brancos, ele pede a Ascensão.',
    pergunta: { q: 'Subir um nível de Poder Mágico dá quantos PE?', opcoes: ['1 PE', '2 PE', '3 PE'], certa: 1, porque: 'Poder Mágico vale o dobro: 2 PE por nível. Atributo físico e Mana valem 1.' },
    links: [['estagios', 'Estágios'], ['progressao', 'Progressão']],
  },
  {
    id: 'arvore', k: '樹', titulo: 'A árvore da sua classe',
    curto: 'Pontos de Trilha e habilidades.',
    blocos: [
      ['Raiz', 'Cada Classe de Mago tem uma Raiz: uma passiva que todo mago da classe ganha de graça.'],
      ['Três ramos', 'Os ramos abrem em direções diferentes (defesa, ataque, apoio...). Cada habilidade pede a anterior do mesmo ramo, e as melhores pedem um Estágio mínimo.'],
      ['Pontos de Trilha', 'Você ganha pontos ao subir de Estágio e escolhe onde gastar. Dá para fechar um ramo até o Ápice ou espalhar pela árvore.'],
    ],
    exemplo: 'Um Mago de Batalha que quer aguentar pancada sobe o Bastião; quem quer bater primeiro sobe a Fúria. Os dois são o mesmo Mago de Batalha, com papéis diferentes no grupo.',
    pergunta: { q: 'A Raiz da classe custa quantos Pontos de Trilha?', opcoes: ['Nenhum', '1', '2'], certa: 0, porque: 'A Raiz é grátis: todo mago da classe já começa com ela.' },
    links: [['arvores', 'Abrir as árvores'], ['classes', 'Classes de Mago']],
  },
  {
    id: 'missoes', k: '任', titulo: 'Missões e carreira',
    curto: 'O que pagar para ficar forte.',
    blocos: [
      ['Ranks', `As missões vão do Rank F ao S. ${ranks.slice(0, 3).map((r) => `Rank ${r.r} paga ${r.meritos} ${r.meritos === 1 ? 'Mérito' : 'Méritos'} e ${r.yuls} Yuls`).join('; ')}.`],
      ['Cristais de Ascensão', `A partir do Rank ${rankBranco.r}, a missão também paga Cristais: é assim que se junta o que a Ascensão pede.`],
      ['Dois caminhos', 'Méritos sobem você nos Generais Brilhantes, a serviço do Rei. Antiméritos sobem você no Veio Negro, o sindicato do Fosso.'],
    ],
    exemplo: `Um grupo do 6º Estágio faz uma missão Rank ${rankBranco.r}: cada um leva ${rankBranco.meritos} Méritos, ${rankBranco.yuls} Yuls e ${rankBranco.cristais}.`,
    pergunta: { q: 'Qual é o primeiro Rank que paga Cristal Branco?', opcoes: ['Rank D', `Rank ${rankBranco.r}`, 'Rank A'], certa: 1, porque: `Rank ${rankBranco.r} paga ${rankBranco.cristais}; antes dele, só Méritos e Yuls.` },
    links: [['missoes', 'Missões'], ['generais', 'Carreiras'], ['criaturas', 'Criaturas']],
  },
  {
    id: 'sustento', k: '業', titulo: 'Viver em Diamond',
    curto: 'Yuls, profissões e a terra seca.',
    blocos: [
      ['Yuls', 'A moeda do reino. Compra comida, equipamento, licenças e terras. Missões e profissões pagam em Yuls.'],
      ['Profissões', 'Entre uma missão e outra alguém precisa minerar, forjar, curar e cobrar. Uma profissão dá renda e itens; a segunda abre no 6º Estágio.'],
      ['A terra seca', 'Diamond esgotou o próprio chão. Cristal, comida e mana valem muito, e o preço muda com o que os jogadores compram e vendem.'],
    ],
    exemplo: 'Um plebeu dos Veios começa com 200 Yuls. Minerando entre missões, ele paga a própria licença de forja e começa a vender armas para o grupo.',
    pergunta: { q: 'Em que Estágio abre a profissão secundária?', opcoes: ['9º', '6º', '3º'], certa: 1, porque: 'O 6º Estágio dá a profissão secundária, junto com a Matriz Rúnica.' },
    links: [['profissoes', 'Profissões'], ['economia', 'Economia'], ['mineracao', 'Mineração']],
  },
];
