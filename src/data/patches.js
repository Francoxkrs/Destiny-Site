// Patch notes do bot: cópia de src/functions/patch/notas.ts (o mesmo texto que o /patch posta no Discord).
// Ao postar um patch novo no bot, copie o PATCH_ATUAL para o topo desta lista.
// Markdown do Discord: **negrito** e `comando`.
export const patches = [
  {
      versao: "2026-11-11",
      data: "11/11/2026",
      titulo: "Atualização do Bot",
      resumo: "A maior atualização até agora. Chegou o **Passe de Temporada**, o mapa de Diamond foi refeito, dá para viajar entre as regiões, o Artífice e o Mago das Sombras ficaram muito mais fortes e os Milagres agora são raros de verdade.",
      frase: "Diamond cresceu enquanto vocês dormiam.",
      secoes: [
          {
              nome: "Passe de Temporada",
              itens: [
                  { titulo: "/passe ver", texto: "30 níveis com recompensas na trilha Grátis e na Premium. O XP vem jogando: posts de RP com 500 caracteres ou mais, call com outros jogadores, missões, treinos, criaturas vencidas e eventos (até 120 XP por dia)." },
                  { titulo: "Premium", texto: "R$ 9,90 no Pix, direto pelo bot, ou já incluso no **VIP Essential**. Quem vira Premium depois resgata na hora tudo o que já passou." },
                  { titulo: "Nível 30", texto: "escolha entre a **Armadura do Miasma** ou um sorteio de Grimório." },
                  { titulo: "Visual", texto: "títulos, molduras, fundos e a Capa da Temporada aparecem na aba nova **Visual** da `/ficha`. Também tem `/passe ranking` e `/passe mural`. A data de início da temporada sai em breve." },
              ],
          },
          {
              nome: "Diamond e viagens",
              itens: [
                  { titulo: "Mapa novo", texto: "as regiões de Diamond foram refeitas: 31 lugares, com fóruns, placas e o Perigo de cada um. Todo lugar tem uma zona de mana: Forte, Comum, Rala ou Morta." },
                  { titulo: "Mana do lugar", texto: "`/treinar controle` e `/mana concentrar` usam a mana do lugar onde você está. Nas Câmaras de Mana o Controle rende mais." },
                  { titulo: "/viajar", texto: "vá de uma região a outra a pé, de montaria, pelo Trilho de Cristal, de vassoura, voando ou por portal. Cada jeito tem o seu tempo e o seu custo. `/viajar onde` mostra onde você está." },
                  { titulo: "/treinar sessao", texto: "junte vários treinos do ciclo de uma vez, como 2 de Força e 1 de Controle." },
                  { titulo: "Criaturas novas", texto: "Vigia do Roçado, Sentinela de Musgo, O Derrame, Malware e o **Dragão Negro**, que só aparece à noite. As criaturas surgem só nos lugares com Perigo." },
              ],
          },
          {
              nome: "Milagres e Conhecimentos",
              itens: [
                  { titulo: "Milagres raros", texto: "cada Marcado tem no máximo 2 Milagres: um da linhagem e um do Despertar. Cada Milagre tem 3 portadores no servidor, e o **Amado pela Mana** tem 6. Quando enche, ele para de sair nos giros. Ninguém perde o Milagre que já tem." },
                  { titulo: "Boismortier", texto: "o Amado pela Mana agora sai por chance no giro, em vez de vir garantido." },
                  { titulo: "Limite de Conhecimentos", texto: "os Conhecimentos e Traços que vêm da família e da raça não contam mais no limite de 6." },
                  { titulo: "/estudar esquecer", texto: "com o limite cheio, esqueça um Conhecimento para abrir espaço para outro." },
                  { titulo: "/vagas", texto: "agora todo mundo pode ver quem ocupa cada família, magia e Milagre com vaga e o que já está cheio. Use `tipo` para ver só uma parte ou `nome` para ver uma só." },
              ],
          },
          {
              nome: "Classes e itens",
              itens: [
                  { titulo: "Artífice", texto: "agora é o mago da forja de verdade: forja mesmo sem Profissão, faz peças um grau acima com metade do material, cria uma Obra-Prima por mês e encaixa mais discos." },
                  { titulo: "Mago das Sombras", texto: "virou espião e assassino: fachadas com `/sombras fachada`, Rede de Informantes que avisa quando um alvo viaja, Mercado Negro sem imposto, Missões Ocultas e o rastro de criaturas que fugiram." },
                  { titulo: "/equipamento", texto: "vincule, dê nome, desperte e repare os seus itens, e crie a sua Arma-Assinatura. Os itens ganham Ressonância nas missões e Partes das criaturas vencidas." },
                  { titulo: "Inventário novo", texto: "o `/inventario` agora é uma grade com a arte de cada item, separada em Equipados, Mochila e Recursos." },
                  { titulo: "Criar feitiço e equipamento", texto: `o painel de criação em #criação ganhou as abas **Feitiço** e **Equipamento**. O pedido vai para a Staff, que define a qualidade e o preço em Yuls. Encantamento próprio só a partir de Rara, e cada um pode ter até 3 pedidos abertos.` },
              ],
          },
          {
              nome: "Ficha",
              itens: [
                  { titulo: "Imagem por link", texto: "na criação, além de enviar o arquivo, dá para colar um link ou mandar a imagem no chat. Ajuda quem tem celular que travava." },
                  { titulo: "Pedir alteração", texto: "na `/ficha`, aba Pessoal, use **Pedir alteração** para mudar nome, aparência, imagem ou história. O pedido vai para a Staff aprovar." },
              ],
          },
          {
              nome: "Apoio",
              itens: [
                  { titulo: "Boost e VIP", texto: `as recompensas foram refeitas. Veja em #boost e #vip. O VIP Sensacional custa R$ 14,99 e o VIP Essential, R$ 24,99.` },
                  { titulo: "Carrinho do VIP", texto: `compre o VIP pelo Pix em #vip. O bot abre um ticket privado com o QR Code e entrega o cargo e os itens sozinho assim que o pagamento cai.` },
                  { titulo: "Obrigado", texto: `quem dá Boost ou compra VIP ganha um agradecimento em #agradecimentos.` },
              ],
          },
          {
              nome: "Servidor",
              itens: [
                  { titulo: "Boas-vindas", texto: "quem chega recebe uma mensagem nova, com os primeiros passos, e um oi no bate-papo." },
                  { titulo: "Cargos animados", texto: "os cargos ganharam cores em degradê que combinam com o que cada um é." },
                  { titulo: "Mais estável", texto: "o bot se recupera sozinho quando a conexão cai, e os botões da criação não mostram mais \"A interação falhou\"." },
              ],
          },
      ],
      rodape: "Comandos novos podem levar alguns minutos para aparecer (aperte Ctrl+R no Discord). Viu algum erro? Mande um print para a Staff.",
      fecho: "Diamond mudou. Agora, cabe a vocês escrever o resto.",
  },
  {
        versao: "2026-11-07",
        data: "07/11/2026",
        titulo: "Atualização do Bot",
        resumo: "O bot recebeu uma revisão. Agora dá para usar os rerolls de **Boost** e **VIP** na ficha aprovada, a magia da família pode ser trocada e vários erros foram corrigidos.",
        frase: "Toda alma volta. Nenhuma volta igual.",
        secoes: [{
            nome: "",
            itens: [
                { titulo: "Bolsa na ficha", texto: "com a ficha aprovada, use o menu da `/bolsa ver` para trocar raça, família, Classe de Mago, magia ou Grimório. Valem os rerolls, as escolhas do VIP e as magias que você girou e guardou. O bot mostra o que muda antes de gastar." },
                { titulo: "Magia da família", texto: "a magia girada agora pode ficar no lugar da magia da linhagem. Na criação, use o botão de troca para escolher qual delas fica." },
                { titulo: "/bolsa girar", texto: "agora gira de verdade, e os resultados ficam guardados até você usar." },
                { titulo: "Criação", texto: "família, raça, classe e magia à escolha agora são menus, sem precisar digitar o nome." },
                { titulo: "Erros", texto: "quando algo falha, o bot avisa em vez de mostrar \"A interação falhou\"." },
            ],
        }],
        rodape: "Os giros da criação continuam valendo só na criação. Viu algum erro? Mande um print para a Staff.",
        fecho: "Gire, troque e reescreva o seu destino.",
    },
];
