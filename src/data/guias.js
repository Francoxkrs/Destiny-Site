// Guias: o que liga as páginas de regra entre si e a consulta rápida (Dúvidas e Comandos).
// Os comandos e as respostas do /ajuda vêm do bot (src/data/bot/*.json, gerados por scripts/bot-exportar.mjs).
// Os links "/pagina/#secao" são conferidos no build: um link quebrado aparece como aviso no terminal.
import { paginas } from './canon.js';
import { fontes as fontesInscricao } from './altar.js';
import comandosBot from './bot/comandos.json' with { type: 'json' };
import ajudaBot from './bot/ajuda.json' with { type: 'json' };

/** Três páginas para ler depois de cada uma (aparecem no fim da página, em "Leia junto"). */
export const relacionados = {
  comecar: ['familias', 'atributos', 'progressao'],
  mundo: ['mapa', 'vivo', 'generais'],
  mapa: ['mundo', 'vivo', 'missoes'],
  vivo: ['generais', 'mapa', 'missoes'],
  generais: ['vivo', 'missoes', 'economia'],
  familias: ['racas', 'milagres', 'comecar'],
  racas: ['familias', 'milagres', 'atributos'],
  milagres: ['familias', 'mana', 'classes'],
  atributos: ['ferimentos', 'estagios', 'progressao'],
  ferimentos: ['atributos', 'classes', 'conhecimentos'],
  magia: ['estagios', 'mana', 'classes'],
  classes: ['magia', 'progressao', 'milagres'],
  mana: ['magia', 'estagios', 'discos'],
  discos: ['itens', 'mana', 'classes'],
  progressao: ['estagios', 'conhecimentos', 'atributos'],
  estagios: ['progressao', 'magia', 'mana'],
  conhecimentos: ['progressao', 'profissoes', 'ferimentos'],
  missoes: ['criaturas', 'generais', 'economia'],
  criaturas: ['missoes', 'itens', 'vivo'],
  profissoes: ['conhecimentos', 'mineracao', 'economia'],
  mineracao: ['profissoes', 'itens', 'terras'],
  itens: ['mineracao', 'profissoes', 'discos'],
  terras: ['economia', 'profissoes', 'mineracao'],
  economia: ['terras', 'profissoes', 'missoes'],
};

export const paginaPorSlug = Object.fromEntries(paginas.map((p) => [p.slug, p]));

/** Anterior e próxima na ordem do Guia (a última volta para a primeira, como o "A seguir"). */
export function vizinhas(slug) {
  const i = paginas.findIndex((p) => p.slug === slug);
  return { anterior: i > 0 ? paginas[i - 1] : null, proxima: paginas[(i + 1) % paginas.length] };
}

/* ------------------------------------------------------------------ Comandos */

/** Grupos do Índice de comandos. Comando novo no bot que não estiver aqui cai em "Outros". */
export const gruposComandos = [
  { id: 'primeiros', kanji: '始', nome: 'Primeiros passos', texto: 'Criar o Marcado, achar ajuda e pegar o que é seu.', cmds: ['criar-personagem', 'comecar', 'guia', 'ajuda', 'site', 'diario', 'codigo', 'bolsa'] },
  { id: 'ficha', kanji: '前世', nome: 'Ficha e poder', texto: 'Ver a ficha, treinar, estudar e subir de Estágio.', cmds: ['ficha', 'ficha-cor', 'vagas', 'treinar', 'estudar', 'despertar', 'trilha', 'classe', 'mana', 'sincronia'] },
  { id: 'grimorio', kanji: '魔導', nome: 'Grimório e discos', texto: 'Escrever e lançar feitiços, engastar discos.', cmds: ['feitiço', 'grimório', 'disco', 'sombras'] },
  { id: 'mundo', kanji: '目覚', nome: 'Mundo e viagem', texto: 'Andar por Diamond, falar com quem mora lá e descobrir o que ele esconde.', cmds: ['viajar', 'mapa', 'clima', 'falar', 'investigar', 'segredos', 'patrulha', 'territorio'] },
  { id: 'aventura', kanji: '狩', nome: 'Missões e caçadas', texto: 'Missões, criaturas, cabeças a prêmio, patentes e lutas.', cmds: ['missão', 'criatura', 'bounty', 'mural', 'esquadrao', 'patente', 'luta'] },
  { id: 'sustento', kanji: '生業', nome: 'Dinheiro e ofício', texto: 'Yuls, itens, forja, Profissão, terras, contratos e saúde.', cmds: ['extrato', 'inventario', 'equipamento', 'loja', 'mercado', 'forja', 'profissao', 'jornada', 'terra', 'contrato', 'dar', 'pagar', 'negociar', 'saude', 'ferimento'] },
  { id: 'temporada', kanji: '祭', nome: 'Temporada e rankings', texto: 'Passe, rankings e o evento de convites.', cmds: ['passe', 'lb', 'convites'] },
];

/** Onde a regra de cada comando está explicada no site. */
export const paginaDoComando = {
  'criar-personagem': '/comecar/#modelos', comecar: '/comecar/', guia: '/guia/', ajuda: '/faq/', site: '/entrar/', codigo: '/comecar/#codigos', bolsa: '/comecar/#apoio',
  ficha: '/ficha/', vagas: '/milagres/#milagres', treinar: '/progressao/#treinamento', estudar: '/conhecimentos/', despertar: '/progressao/#estagios', trilha: '/arvores/', classe: '/classes/', mana: '/mana/#regras-da-mana', sincronia: '/milagres/#sincronia',
  'feitiço': '/magia/#feiticos', 'grimório': '/magia/#grimorios', disco: '/discos/', sombras: '/classes/#mago-das-sombras',
  viajar: '/mapa/#viagem', mapa: '/mapa/', clima: '/vivo/#clima', investigar: '/vivo/#segredos', segredos: '/vivo/#segredos', patrulha: '/vivo/#territorios', territorio: '/vivo/#territorios',
  'missão': '/missoes/', criatura: '/criaturas/', bounty: '/vivo/#mural-livre', mural: '/vivo/#cabecas', esquadrao: '/vivo/#esquadroes', patente: '/generais/',
  extrato: '/economia/', inventario: '/itens/#carga', equipamento: '/itens/', loja: '/vivo/#lojas', mercado: '/economia/#mercado', forja: '/itens/#forja', profissao: '/profissoes/', jornada: '/profissoes/#regras', terra: '/terras/', contrato: '/economia/#contratos', saude: '/ferimentos/#tratar', ferimento: '/ferimentos/',
  passe: '/eventos/',
};

/** Âncora de um comando no Índice: /comandos/#cmd-treinar */
export const idComando = (nome) => `cmd-${nome.normalize('NFD').replace(/[̀-ͯ]/g, '')}`;

export const comandos = comandosBot.comandos;
export const comandosGeradosEm = comandosBot.geradoEm;

export function comandosAgrupados() {
  const porNome = Object.fromEntries(comandos.map((c) => [c.nome, c]));
  const usados = new Set();
  const grupos = gruposComandos.map((g) => ({ ...g, lista: g.cmds.map((n) => porNome[n]).filter(Boolean).map((c) => (usados.add(c.nome), c)) }));
  const resto = comandos.filter((c) => !usados.has(c.nome));
  if (resto.length) grupos.push({ id: 'outros', kanji: '他', nome: 'Outros', texto: 'Comandos novos que ainda não ganharam grupo.', lista: resto });
  return grupos.filter((g) => g.lista.length);
}

/* ------------------------------------------------------------------ Dúvidas (FAQ) */

export const temasFaq = [
  { id: 'comecar', kanji: '始', nome: 'Começar', titulo: 'Antes da <em>primeira cena</em>.' },
  { id: 'personagem', kanji: '前世', nome: 'Personagem e Mana', titulo: 'O corpo, a alma <em>e a Mana</em>.' },
  { id: 'progressao', kanji: '道', nome: 'Progressão', titulo: 'Do 9º <em>ao 1º</em>.' },
  { id: 'aventura', kanji: '狩', nome: 'Missões e mundo', titulo: 'Lá fora, <em>em Diamond</em>.' },
  { id: 'sustento', kanji: '生業', nome: 'Itens, dinheiro e conta', titulo: 'Yuls, itens <em>e a sua conta</em>.' },
];

/** As perguntas do /ajuda do bot: tema e onde está a regra completa no site. */
const ajudaNoSite = {
  resetar: ['comecar', '/comecar/#escolha-e-aprovacao'],
  ferimento: ['personagem', '/ferimentos/#golpe'],
  conhecimentos: ['progressao', '/conhecimentos/#incomuns'],
  itens: ['sustento', '/itens/#forja'],
  tecnicas: ['progressao', '/mana/#tecnicas'],
  profissao: ['sustento', '/profissoes/#regras'],
  limites: ['progressao', '/progressao/#estagios'],
  acrescimos: ['personagem', '/atributos/#acrescimos'],
  ocupado: ['aventura', '/progressao/#treinamento'],
  tipos: ['personagem', '/magia/#feiticos'],
  cristais: ['progressao', '/mundo/#cristais-de-mana'],
};

const inscricoesJogando = fontesInscricao.filter((f) => f[3]);

/**
 * Perguntas escritas para o site: respostas curtas, tiradas das páginas de regra, que levam à seção completa.
 * resposta = parágrafos em HTML simples (<b>, <code>).
 */
const faqSite = [
  { id: 'criar', tema: 'comecar', pergunta: 'Como eu crio o meu personagem?', link: '/comecar/#modelos', resposta: ['Use <code>/criar-personagem</code> no Discord. O bot abre uma câmara só sua com três destinos: você gira Magias, Conhecimentos e Grimório, escolhe um, dá nome, imagem e história e envia.', 'A Staff aprova e você acorda em Diamond.'] },
  { id: 'dados', tema: 'comecar', pergunta: 'Tem dado no Black Destiny?', link: '/atributos/#confronto', resposta: ['<b>Não.</b> Nenhuma ação usa dado. Num confronto compara-se a classificação e, se empatar, os Acréscimos.', 'Sorteio só existe nos giros: na criação, na <code>/bolsa</code> e no Altar.'] },
  { id: 'site', tema: 'comecar', pergunta: 'Como entro no site com a minha conta?', link: '/entrar/', resposta: ['Use <code>/site</code> no Discord. O bot manda um link só seu, que vale 10 minutos. Com ele você vê a ficha, gasta os pontos da trilha e usa os Cristais.'] },
  { id: 'codigos', tema: 'comecar', pergunta: 'Onde uso os códigos do servidor?', link: '/comecar/#codigos', resposta: ['A cada meta de membros sai um código no canal de anúncios. Use <code>/codigo</code> e cole: vale uma vez por pessoa, por 7 dias, e os itens caem na sua <code>/bolsa</code>.'] },
  { id: 'milagres', tema: 'personagem', pergunta: 'Quantos Milagres e Traços eu posso ter?', link: '/milagres/#milagres', resposta: ['<b>Milagres:</b> no máximo dois por Marcado, um da linhagem e um do Despertar. Cada Milagre aceita até três Marcados ao mesmo tempo (Amado pela Mana aceita seis).', '<b>Traços:</b> até três, nenhum com mais de 1 Acréscimo.'] },
  { id: 'mana-zero', tema: 'personagem', pergunta: 'O que acontece quando a minha Mana zera?', link: '/mana/#regras-da-mana', resposta: ['Vem a <b>Exaustão Mágica</b>: -1 classificação em todos os atributos físicos até recuperar 25% da reserva.', 'Dá para forçar um último feitiço com a Mana Vital, ao preço de um Ferimento III.'] },
  { id: 'mana-volta', tema: 'personagem', pergunta: 'Como a Mana volta?', link: '/mana/#regras-da-mana', resposta: ['10% da reserva por hora real fora de combate e 5% por turno de Concentração em combate. Em Zona de Forte Mana é o dobro; em Mana Morta, nada.', 'Uma noite inteira de descanso (<code>/mana descansar</code>) recupera tudo.'] },
  { id: 'estagio', tema: 'progressao', pergunta: 'Como eu subo de Estágio?', link: '/progressao/#estagios', resposta: ['Junte os Pontos de Estágio, o Controle e os Cristais pedidos e use <code>/despertar</code>. Ele confere tudo e pede uma Ação de Ascensão de 1.000 caracteres.', 'O 7º Estágio é o primeiro que pede Cristal.'] },
  { id: 'pe', tema: 'progressao', pergunta: 'Como ganho Pontos de Estágio (PE)?', link: '/progressao/#estagios', resposta: ['Só conta o que você conquistou depois da criação: <b>1 PE</b> por classificação física subida, <b>1 PE</b> por nível de Mana, <b>2 PE</b> por nível de Poder Mágico e <b>1 PE</b> a cada 10% de Controle Mágico.'] },
  { id: 'missoes-dia', tema: 'aventura', pergunta: 'Quantas missões posso fazer por dia?', link: '/missoes/#limite', resposta: ['Até <b>2 a cada 24 horas</b>, contadas a partir da primeira, solo ou em grupo.', 'A única exceção são as Missões de Evento abertas para quem está esperando: elas não reiniciam a contagem.'] },
  { id: 'domar', tema: 'aventura', pergunta: 'Como eu domo uma criatura?', link: '/criaturas/#domacao', resposta: ['Domar não depende de sorte. A criatura aparece numa missão, num evento ou numa cena de caça com narrador; você se aproxima por Confiança (cenas sem feri-la) ou por Subjugação (vence sem matar).', 'Depois vem o Laço, que custa Mana, e o narrador registra a criatura na sua ficha.'] },
  { id: 'viajar', tema: 'aventura', pergunta: 'Quanto tempo leva para viajar?', link: '/mapa/#viagem', resposta: ['Minutos reais, por trecho de estrada: 30 a pé, 20 de montaria, 10 de Trilho de Cristal, 15 de vassoura, 10 em voo mágico e 2 por portal. Use <code>/viajar para</code>.', 'Dentro da mesma região, andar entre os lugares é livre e na hora.'] },
  { id: 'yuls', tema: 'sustento', pergunta: 'Como eu ganho Yuls?', link: '/economia/#moedas', resposta: ['Missões pagam de 100 Yuls (Rank F) a 15.000 (Rank S). A Profissão paga o salário do seu grau a cada Jornada de Trabalho. E dá para vender Recursos e itens no <code>/mercado</code>.'] },
  { id: 'inscricoes', tema: 'sustento', pergunta: 'Como ganho Inscrições do Altar jogando?', link: '/altar/#ganhar', resposta: [inscricoesJogando.map(([f, q, l]) => `<b>${f}:</b> ${q} (${l.toLowerCase()})`).join('<br>'), 'Elas valem igual para quem paga e para quem não paga.'] },
];

/** Converte o texto do Discord (negrito, código, -# miúdo, separadores) em HTML simples. */
function discordParaHtml(linhas) {
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = (t) => esc(t).replace(/\*\*`([^`]+)`\*\*/g, '<code>$1</code>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
  const blocos = [];
  let atual = [];
  const fecha = () => { if (atual.length) blocos.push({ t: 'p', h: atual.join('<br>') }); atual = []; };
  for (const bruta of linhas) {
    // o bot marca seções e ícones com caracteres de uso privado (U+E000 a U+F8FF); aqui eles saem
    const l = bruta.replace(/[\uE000-\uF8FF]/g, '');
    const sep = l.match(/^\s*\*‹\s*(.+?)\s*›\*\s*$/);
    if (!l.trim()) fecha();
    else if (sep) { fecha(); blocos.push({ t: 'h', h: inline(sep[1]) }); }
    else if (l.startsWith('-# ')) { fecha(); blocos.push({ t: 'miudo', h: inline(l.slice(3)) }); }
    else atual.push(inline(l));
  }
  fecha();
  return blocos;
}

export const faq = [
  ...ajudaBot.perguntas.map((p) => ({ id: p.id, tema: ajudaNoSite[p.id]?.[0] ?? 'comecar', pergunta: p.pergunta, curta: p.curta, link: ajudaNoSite[p.id]?.[1] ?? null, blocos: discordParaHtml(p.resposta), bot: true })),
  ...faqSite.map((p) => ({ ...p, curta: p.pergunta, blocos: p.resposta.map((h) => ({ t: 'p', h })), bot: false })),
];

/** Todos os links internos dos guias, para o build conferir se a seção existe. */
export const linksDosGuias = [
  ...Object.values(paginaDoComando),
  ...faq.map((p) => p.link).filter(Boolean),
];
