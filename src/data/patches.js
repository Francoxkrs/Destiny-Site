// Patch notes do bot: cópia de src/functions/patch/notas.ts (o mesmo texto que o /patch posta no Discord).
// Gerado a partir do bot; ao postar um patch novo, gere de novo (o PATCH_ATUAL vira o primeiro da lista).
// Markdown do Discord: **negrito** e `comando`.
const PATCH_ATUAL = {
    "versao": "2026-11-27",
    "data": "27/11/2026",
    "titulo": "Chefe de Diamond, Música Tema e Magia Composta",
    "resumo": "Chegaram o **Chefe de Diamond** (todo o servidor contra uma criatura só), a **Música Tema**, a **Magia Composta** e os **mantos e trajes**. Junto: bônus de chegada, `/diario` com a tag, lembretes no chat e os **Acréscimos** somados na ficha.",
    "frase": "Quem carrega o nome de Diamond ganha por isso.",
    "secoes": [
        {
            "nome": "Cena e combate",
            "itens": [
                {
                    "titulo": "Chefe de Diamond",
                    "texto": "uma criatura enorme aparece num canal por algumas horas, com vida para o servidor inteiro. Cada post de RP seu de 500+ caracteres ali é um golpe pela sua ficha (Estágio e Poder Mágico), sem dados: um a cada 10 minutos, e post de 1.000+ caracteres bate 25% mais forte. Venceu ou ele fugiu, todo mundo que golpeou ganha Yuls e XP no Passe, e os três que mais bateram levam um extra. O bot anuncia 3 dias antes e avisa 1 hora antes. Veja o próximo com `/chefe ver`."
                },
                {
                    "titulo": "Música Tema",
                    "texto": "guarde a sua música com `/tema definir` (faixa do Spotify ou do YouTube) e escolha uma **Nota**: **Fúria** (o primeiro acerto de cada post ignora a Pele de Mana), **Muralha** (anula o próximo Ferimento), **Vento** (age primeiro e troca de posição sem gastar ação) ou **Foco** (o feitiço não é interrompido nem cortado em choque de magia). Link e Nota trocam uma vez por semana. Numa cena, depois de 5 posts seus, `/tema tocar` é a **Abertura**: volta 15% da sua Mana e a Nota fica ligada até o fim da cena. 3 posts depois, `/tema tocar` de novo é o **Refrão**: o próximo feitiço sobe um degrau e custa metade da Mana. Caiu com o tema tocando? `/tema climax` levanta você com Ferimento II para uma última ação. `/tema dueto` chama um aliado: a Magia Composta de vocês sai sem Mana para ele. Dois temas na mesma cena duelam, e quem está no Refrão vence. Com o tema tocando, caçada e chefe dão +10% de Yuls (e o chefe leva +10% de dano). Defesa perfeita contra quem toca corta o tema, se um narrador confirmar. O card mostra a capa da faixa, e todo domingo às 20h sai o mural **Temas da Semana**."
                },
                {
                    "titulo": "Magia Composta",
                    "texto": "dois Marcados na mesma cena juntam um feitiço de cada num efeito só. Use `/magia-composta parceiro:`, escolha o seu feitiço, e o parceiro escolhe o dele no card. Cada um paga a Mana do próprio feitiço, e o efeito sai no nível do feitiço mais forte **mais um degrau**. Uma vez por cena por dupla."
                },
                {
                    "titulo": "Mais criaturas",
                    "texto": "agora são **8 aparições por dia** nos canais de RP (antes 4). Bestas de **Rank B** e **Rank A** saem no máximo uma de cada por dia, e tem dia sem nenhuma; quando aparecem, o bot marca o cargo de alerta. Uma vez por mês acorda uma criatura de **Rank S**, com cargo próprio. Fique de olho."
                },
                {
                    "titulo": "Mantos e trajes",
                    "texto": "todo Marcado veste o manto da sua Tropa ou facção (Caçadores, sem patente), com um bônus pequeno de Acréscimo. Cada região vende um traje próprio (`/traje comprar`, estando lá), que soma mais meio ponto. Veja e troque com `/traje ver` e `/traje vestir`."
                }
            ]
        },
        {
            "nome": "Mago do Vazio",
            "itens": [
                {
                    "titulo": "Classe nova: Mago do Vazio",
                    "texto": "a nona Classe de Mago, só para quem tem o Milagre **Corpo Vazio** ou a magia **Antimagia**. Ele não tem mana: cada feitiço lançado perto dele enche o **Vácuo**, e as habilidades gastam o Vácuo. Quanto mais magia em volta, mais perigoso ele fica. Três ramos: **Predador** (marca um mago e não larga mais), **Carne Viva** (queima o corpo como combustível) e **Zona Morta** (faz o lugar esquecer a magia). Não sai nos giros da criação: quem tem Corpo Vazio ou Antimagia aprende com o **Mestre do Vazio**, nos Planaltos mortos (`/classe aprender`). Veja a árvore com `/trilha`."
                },
                {
                    "titulo": "Corpo que cresce",
                    "texto": "quem tem Corpo Vazio passa **uma classificação do teto físico** do Estágio em Força, Velocidade e Resistência. O nó Além do Limite do Mago do Vazio sobe mais uma."
                },
                {
                    "titulo": "Antimagia",
                    "texto": "a magia Anti-Maldição agora se chama **Antimagia**. Quem já tinha continua com ela, só o nome mudou."
                }
            ]
        },
        {
            "nome": "Diário e servidor",
            "itens": [
                {
                    "titulo": "/diario com a tag",
                    "texto": "o diário agora conta só para quem exibe a tag **丶幻** do servidor no perfil (Configurações, Perfis, Tag do servidor). Os seus dias e marcos continuam os mesmos."
                },
                {
                    "titulo": "Seus avisos no privado",
                    "texto": "use `/lembretes meus` e ligue o que quiser: o bot te avisa no privado quando o ciclo de um treino abre, quando você pode pedir missão de novo, quando o bump libera e quando o `/diario` do dia está esperando (na hora que você escolher). Nada vem sem você ligar."
                },
                {
                    "titulo": "Bump dá XP",
                    "texto": "cada `/bump` do Disboard agora dá **10 XP no Passe** (até 3 bumps por dia contam)."
                },
                {
                    "titulo": "Lembrete no chat",
                    "texto": "a cada 12 horas (ou 300 mensagens) o bot deixa no bate-papo um lembrete com o bump, o voto, o `/diario` e o atalho para criar a ficha. Só o mais novo fica no chat."
                },
                {
                    "titulo": "Bump do Disboard",
                    "texto": "quem der `/bump` ganha o agradecimento do bot na hora, e duas horas depois o bot avisa que o bump liberou de novo. A Staff vê quem mais ajudou na semana."
                },
                {
                    "titulo": "Quem ainda não tem ficha",
                    "texto": "quem entrou e passou um dia sem criar o Marcado recebe uma mensagem do bot com o caminho da criação. Uma vez só."
                },
                {
                    "titulo": "Bônus de chegada",
                    "texto": "até o fim da Temporada I (09/01), quem começa a criação ganha **+3 giros de Magia** na hora, e a ficha já nasce no **7º Estágio** quando o Conselho aprova, com o Ponto de Trilha e o Despertar de Traço desse caminho. Vale uma vez por jogador. Chegou agora? Não fica atrás de quem já joga."
                }
            ]
        },
        {
            "nome": "Acréscimos",
            "itens": [
                {
                    "titulo": "/acrescimos",
                    "texto": "mostra os seus Acréscimos já somados e de onde vem cada um: Traços, Milagres, Classe, itens equipados e Conhecimentos de arma. Esgrima e Esgrima Avançada só contam com lâmina na mão, Arquearia e Balística com arma de disparo, Combate desarmado. Onde a fonte deixa escolher o atributo (Esgrima, Arquearia, Combate, Corpo Amaldiçoado), escolha um por um no menu. O botão **Ver em combate** soma o que só vale lutando, e a seção **Só na cena** lista o que depende da cena. Use `mostrar:` para postar no canal e `jogador:` para ver os de outro Marcado."
                },
                {
                    "titulo": "Acréscimos na ficha",
                    "texto": "a `/ficha` agora soma sozinha os Acréscimos que valem o tempo todo: Físico Superior, Agilidade Inigualável, Resistência Suprema, Vigor Superior, Mago de Vanguarda, Corpo Amaldiçoado e os Conhecimentos de arma com a arma certa equipada. Se a Staff já tinha posto algum deles na mão, peça para tirar, para não contar duas vezes."
                },
                {
                    "titulo": "Buff de Reforço",
                    "texto": "lançar um feitiço de Reforço (Tipo Reforço Corporal ou Função Reforço) põe um buff nos seus Acréscimos até o fim da cena: o Poder Mágico e os bônus do feitiço (metade no Reforço Corporal; inteiro para o Mago de Batalha), mais Fisiologia e Controle Corporal. Manter o feitiço renova. No `/acrescimos` você escolhe em que atributo físico ele soma e encerra quando o efeito acabar."
                }
            ]
        },
        {
            "nome": "Staff",
            "itens": [
                {
                    "titulo": "A Staff é recompensada",
                    "texto": "narrar missões, criaturas e eventos, aprovar fichas e feitiços e cuidar do servidor agora conta para cada pessoa da equipe, e a Staff recebe Cristais Prismáticos pelo trabalho. Quer ajudar narrando? Fale com a Staff."
                }
            ]
        },
        {
            "nome": "Técnicas de Mana",
            "itens": [
                {
                    "titulo": "16 Técnicas novas",
                    "texto": "o Fluxo ganhou **Supressão de Mana**, **Fio de Mana**, **Pulso**, **Ponto de Mana**, **Leitura do Fluxo**, **Coração de Mana** e, no topo, a **Coroa de Mana** (1º Estágio, parte da Forma Mágica). Diamond ganhou **Sede de Cristal**, **Olho de Lapidário** e **Sangue Cristalino**; as Runas, **Runa de Disco** e **Círculo Rúnico**. Treine no `/treinar`, botão Técnica."
                },
                {
                    "titulo": "Técnicas Avançadas",
                    "texto": "oito Técnicas que partem de uma que você já domina: **Percepção Profunda**, **Manto de Mana**, **Matriz Expandida**, **Método Profundo**, **Domínio de Zona**, **Eco Profundo**, **Rastro Cintilante** e **Couraça de Cristal**. Pedem 6 treinos com mentor ou 10 sozinho."
                },
                {
                    "titulo": "Caçada e Proibidas",
                    "texto": "duas Técnicas de Caçada para quem vive atrás das criaturas (**Faro de Besta** e **Ritmo de Caça**) e duas Proibidas (**Queima de Vida** e **Sorver**), que só se aprendem no Fosso, numa cena com a Staff. Ser visto usando uma Proibida rende cartaz."
                },
                {
                    "titulo": "Progresso mais limpo",
                    "texto": "o Progresso do `/treinar` mostra as Técnicas que você já pode treinar e as do próximo Estágio. A árvore inteira fica no site, em Árvores > Técnicas."
                }
            ]
        },
        {
            "nome": "Discos",
            "itens": [
                {
                    "titulo": "Clínica de Engaste",
                    "texto": "não precisa mais achar alguém com Cirurgia Arcana: vá ao Lapidário e use `/disco clinica`. O cirurgião da clínica engasta o disco em você pelo preço da lapidação mais 150 Yuls. Discos Brutos e Ilegais, só na banca do Veio Negro, no Fosso."
                },
                {
                    "titulo": "Disco Virgem e Disco Bruto",
                    "texto": "o cristal já cortado, sem runa. Com um no inventário, o engaste sai 400 Yuls mais barato (o Bruto sai só pela taxa). O **Lapidador** faz Disco Virgem na Jornada (Lente + Fio Rúnico) e o **Contrabandista** faz 2 Brutos (Quartzo + Cobre Rúnico). Também estão à venda no Balcão do Ateliê e no Câmbio do Fosso, e dá para trocar e vender como qualquer Recurso."
                }
            ]
        }
    ],
    "rodape": "Comandos novos podem levar alguns minutos para aparecer (aperte Ctrl+R no Discord). Viu algum erro? Mande um print para a Staff.",
    "fecho": "Diamond lembra de quem lembra dela, e de quem lutou junto."
};

const PATCHES_ANTERIORES = [
    {
        "versao": "2026-11-21",
        "data": "21/11/2026",
        "titulo": "Versão 2",
        "resumo": "A maior atualização até agora. Chegou o **Passe de Temporada**, o mapa de Diamond foi refeito, o mundo ficou vivo (territórios, segredos, lojas e NPCs), o site ganhou login com a sua ficha e os **Cristais Prismáticos** substituem o VIP.",
        "frase": "Diamond cresceu enquanto vocês dormiam.",
        "secoes": [
            {
                "nome": "Painéis e visual novo",
                "itens": [
                    {
                        "titulo": "Câmara de criação",
                        "texto": "o `/criar-personagem` abre um canal só seu (a Staff também vê). A ficha aparece **um passo por vez**: os Três Destinos, o nome, idade, gênero e epíteto (esses três dá para pular), a imagem e a revisão. Você responde escrevendo no próprio canal. Ao enviar, o canal fecha e a ficha vai para o Conselho Mágico; se a Staff pedir ajustes, ele abre de novo."
                    },
                    {
                        "titulo": "/saude",
                        "texto": "Ferimentos, Sequelas e sustento num painel só. **Tratar** escolhe o ferimento e o que fazer (tratar, estabilizar, cirurgia), e o recibo sai no canal para a cena ver. **Pagar sustento** fica num botão. Para tratar outro Marcado, use `/saude jogador:`. O `/tratar`, o `/sustento` e o `/ferimento ver` saíram; marcar ferimento segue no `/ferimento marcar`."
                    },
                    {
                        "titulo": "Sustento com Barraco",
                        "texto": "pagar o sustento na mão agora cobra o mesmo valor da cobrança de segunda: com Barraco, a metade."
                    },
                    {
                        "titulo": "/terra é um painel só",
                        "texto": "`/terra` abre a imagem da sua terra com o menu **Fazer nesta terra**: erguer construção (com confirmação), morar, adubar, pagar o imposto, guardar e retirar. **Tipos e preços** e **Comprar terra** ficam nos botões; a compra pede confirmação e o nome da terra numa janela. Os subcomandos antigos saíram."
                    },
                    {
                        "titulo": "/territorio ver melhor",
                        "texto": "num canal de RP abre direto no lugar: a influência de cada facção em barra, a disputa aberta e como ganhar influência ali. Fora, mostra o placar do reino com um menu para abrir cada região, lugar por lugar."
                    },
                    {
                        "titulo": "/bolsa é um painel só",
                        "texto": "`/bolsa` mostra o que saiu agora, o que dá para girar, o que usar na ficha e o que está guardado, em seções. **Usar na ficha** virou um menu: escolha o item, onde usar (treino, ciclo ou Traço) e quantos. Os giros ficam nos botões. O `/bolsa ver`, o `/bolsa girar` e o `/bolsa usar` saíram."
                    },
                    {
                        "titulo": "/treinar é um painel só",
                        "texto": "um comando abre tudo: o que está livre agora, um guia curto e os caminhos. Escolha **um foco** no menu e o texto do treino abre; escolha **vários** e eles viram uma sessão. **Técnica**, **Com mestre**, **Combate** e **Progresso** ficam nos botões. Os comandos antigos do treino saíram."
                    },
                    {
                        "titulo": "/profissao é um painel só",
                        "texto": "a sua Profissão, a Jornada do ciclo num botão, a lista de todas com a licença num menu e o Largar. Os comandos `lista`, `ver`, `licenca` e `largar` saíram. Minerar, forjar e os outros trabalhos seguem no `/jornada`."
                    },
                    {
                        "titulo": "Ver o treino de outro",
                        "texto": "`/treinar jogador:` mostra o progresso de outro Marcado."
                    },
                    {
                        "titulo": "Visual novo",
                        "texto": "as telas ganharam dois moldes próprios do Destiny. Os **painéis** (treino, feitiços, profissão, saúde, bolsa) abrem com um édito da Guilda: lacre vermelho com o ícone, título e as seções marcadas. O **guia**, a `/ajuda`, os anúncios e estas notas viraram uma crônica, com título em letra gótica. Os avisos dizem o que houve e o que fazer."
                    },
                    {
                        "titulo": "Códigos de resgate",
                        "texto": "a cada meta de membros (800, 900, 1.000...) sai um código no canal de anúncios. Use `/codigo` e cole: vale uma vez por pessoa, por 7 dias, e os itens caem na sua `/bolsa`. O de 800 já está liberado."
                    },
                    {
                        "titulo": "Sessão de treino voltou",
                        "texto": "o painel do `/treinar` tem o botão **Sessão** de novo: escolha quantos treinos de cada foco (ex.: 2 Força e 2 Mana) e escreva um texto por tipo. É o jeito de usar de uma vez os treinos a mais de Corporal, Fisiologia, Magia e Arcanologia, que contam como 2."
                    },
                    {
                        "titulo": "Usar itens da bolsa",
                        "texto": "a janela de quantidade do **Usar na ficha** (Yuls dos códigos, PE, Cristal Branco, Méritos) não dá mais erro ao confirmar: o item entra na ficha e a bolsa mostra o resultado."
                    },
                    {
                        "titulo": "Canal de dúvidas",
                        "texto": "as dúvidas comuns do `/ajuda` agora ficam num painel fixo no canal de FAQ: escolha a pergunta no menu e a resposta abre só para você. O `/ajuda` continua funcionando em qualquer canal."
                    },
                    {
                        "titulo": "Primeiro dia",
                        "texto": "ficha aprovada? Use `/comecar`: quatro passos (ficha, treino, Grimório e missões), cada um com um botão que abre a tela certa. A mensagem de aprovação já mostra o caminho."
                    },
                    {
                        "titulo": "/missão é um painel só",
                        "texto": "`/missão` abre o quadro do dia, e dali os botões levam a Minhas missões, Pedir personalizada e Histórico. `/missão jogador:` mostra o histórico de outra pessoa. Os narradores registram o fim com `/narrador concluir`."
                    },
                    {
                        "titulo": "/estudar é um painel só",
                        "texto": "estudos em andamento, estudar hoje (Conhecimento, Biblioteca e o texto), as Cápsulas do Fosso com confirmação antes de pagar e o Esquecer, tudo no `/estudar`. O `/capsula` saiu."
                    },
                    {
                        "titulo": "Painel de Criaturas",
                        "texto": "`/criatura ver` mostra as suas criaturas e treina pelo menu (criatura e atributo). O Caderno de campo virou um botão."
                    },
                    {
                        "titulo": "Avisos que ensinam",
                        "texto": "todo aviso de erro agora diz o que fazer em seguida, em vez de só dizer que não deu."
                    },
                    {
                        "titulo": "Presença nos eventos",
                        "texto": "nos eventos, clique em **Estou aqui** na lista de presença. Quando o organizador encerrar, todos da lista recebem a recompensa de uma vez."
                    },
                    {
                        "titulo": "Medicina não soma",
                        "texto": "Medicinal e Medicina Avançada não somam mais no tratamento: vale só a melhor (Avançada tira 3 turnos, Medicinal tira 1). Conhecimento Comum não soma com o Incomum da mesma linha."
                    },
                    {
                        "titulo": "Imagem por arquivo na janela",
                        "texto": "a imagem do feitiço agora se manda direto na janela, sem precisar de link."
                    },
                    {
                        "titulo": "Ajuda",
                        "texto": "`/ajuda` responde as dúvidas mais comuns: resetar o personagem, Ferimentos dos feitiços, se Conhecimentos somam, comprar itens, Técnicas, Profissões, limites por Estágio, Acréscimos, RP durante treino e missão, Tipos mágicos e Cristais."
                    }
                ]
            },
            {
                "nome": "Feitiços",
                "itens": [
                    {
                        "titulo": "Imagem nos feitiços",
                        "texto": "todo feitiço pode ter uma imagem ou um GIF. Mande no `/feitiço`, em **Ver e organizar** → **Imagem**, por arquivo ou por link. A Staff aprova antes de aparecer."
                    },
                    {
                        "titulo": "Onde aparece",
                        "texto": "a imagem fica grande quando você abre o feitiço no `/feitiço`, vai junto quando você usa o feitiço em cena (o GIF anima) e ganha um quadro na página do `/grimório`."
                    },
                    {
                        "titulo": "Trocar ou tirar",
                        "texto": "o mesmo botão **Imagem** troca a imagem: até a Staff aprovar a nova, o feitiço segue com a antiga. Para tirar, marque **Tirar a imagem** na janela."
                    },
                    {
                        "titulo": "Cartão do feitiço",
                        "texto": "todo feitiço aprovado ganhou um cartão desenhado pelo bot, com a arte, o encantamento, o efeito, o custo e a Maestria. Ele aparece quando você usa o feitiço em cena e quando você abre o feitiço no `/feitiço`. Sem imagem, o cartão leva um selo na cor do seu personagem."
                    },
                    {
                        "titulo": "/feitiço é um painel só",
                        "texto": "um comando abre o Grimório com os botões **Escrever**, **Usar**, **Ver e organizar** e **Regras**. No Escrever, os menus mostram só o Tipo e a Função que você pode usar. No Usar, cada feitiço já mostra o custo de Mana com os seus descontos. Os comandos antigos (`criar`, `usar`, `ver`, `imagem`, `mover`, `apagar`) saíram: tudo está no painel. Para ver o Grimório de outro Marcado, use `/feitiço jogador:`."
                    }
                ]
            },
            {
                "nome": "Mural Livre",
                "itens": [
                    {
                        "titulo": "Para quem não tem patente",
                        "texto": "os Caçadores continuam pegando dos dois quadros e agora têm o próprio: o **Mural Livre**, no `/missão quadro`. Ele paga **Bounty**, que vale como os Méritos."
                    },
                    {
                        "titulo": "Caçadas e procurados",
                        "texto": "todo dia o Mural traz uma caçada e um procurado de cada Rank. As caçadas saem do Bestiário. Procurado trazido vivo paga tudo; morto paga 60%."
                    },
                    {
                        "titulo": "Cabeça a prêmio",
                        "texto": "`/bounty cabeca` põe Yuls na cabeça de outro Marcado. Os Yuls saem na hora e viram o prêmio de quem trouxer o alvo, sempre numa cena narrada pela Staff. O cartaz vale 14 dias; tirar antes devolve 90%."
                    },
                    {
                        "titulo": "Títulos",
                        "texto": "o Bounty que você junta dá título: Sem Nome, Rastreador, Caçador de Recompensas, Lâmina de Aluguel e Lenda do Mural. Veja o seu em `/bounty ver`."
                    },
                    {
                        "titulo": "Invasão",
                        "texto": "quem não tem patente e toma a missão de outro grupo agora ganha em Bounty."
                    }
                ]
            },
            {
                "nome": "Missões com lugar",
                "itens": [
                    {
                        "titulo": "Onde",
                        "texto": "toda missão do quadro acontece num lugar de Diamond, que aparece no quadro e no post. Se o texto cita uma região, é lá; senão o lugar sai pelo lado de quem dá a missão."
                    },
                    {
                        "titulo": "Urgente",
                        "texto": "um quadro por dia traz uma missão **Urgente**, no topo, que paga 50% a mais de Yuls. Agora são 3 missões por Rank em cada quadro."
                    },
                    {
                        "titulo": "Etapas",
                        "texto": "a missão tem 2 etapas no F e no E, 3 no D e no C e 4 do B para cima. O narrador marca cada uma no botão **Marcar etapa** do post, e o sucesso só fecha com todas marcadas."
                    },
                    {
                        "titulo": "Saque",
                        "texto": "missão com sucesso dá Recursos da região a cada um do grupo, mais e mais raros pelo Rank. Caçada sempre rende couro ou parte mágica."
                    },
                    {
                        "titulo": "Ferimentos",
                        "texto": "fracassar numa missão de Rank C ou maior deixa um Ferimento em quem estava no grupo: grau I no C e no B, grau II no A e no S."
                    }
                ]
            },
            {
                "nome": "Forja",
                "itens": [
                    {
                        "titulo": "/forja comecar",
                        "texto": "o artesão (Ferreiro, Engenheiro, Lapidador ou Mago Artífice) escolhe a peça e onde forjar, e escreve a primeira Jornada. As outras Jornadas da obra seguem no `/jornada`."
                    },
                    {
                        "titulo": "Onde forjar",
                        "texto": "a **Forja da Guilda** é segura e cobra 10% do valor do material (mínimo 30 Yuls; o Veio Negro paga o dobro). A **Oficina** numa terra sua é segura e de graça. Os **Veios** não cobram e fazem a peça uma Jornada mais rápido, mas ela pode ser roubada no caminho e nunca chegar: de 5% numa Comum a 25% numa Obra-Prima. Quem é do Veio Negro ou Contrabandista corre metade do risco."
                    },
                    {
                        "titulo": "A peça vira post",
                        "texto": "quando a peça fica pronta, o bot posta no canal o cartaz dela, com a arte, a qualidade, o material, o Traço e quem fez. Peça roubada também aparece, com o carimbo."
                    },
                    {
                        "titulo": "Encomendas",
                        "texto": "`/forja encomendar` pede uma peça a um artesão. O pagamento sai na hora e fica guardado; o artesão aceita no botão e forja escolhendo a encomenda. A peça vai direto para quem pediu e o artesão recebe. Recusou, venceu (7 dias para responder, 14 para forjar) ou foi roubada: o pagamento volta inteiro."
                    },
                    {
                        "titulo": "/forja ver",
                        "texto": "mostra o que está na sua forja, a taxa e o risco de cada lugar para você e as suas encomendas."
                    }
                ]
            },
            {
                "nome": "Mercado vivo",
                "itens": [
                    {
                        "titulo": "Preço de onde você está",
                        "texto": "no canal de RP de uma região, o `/mercado` usa o preço de lá (a Fronteira usa a tabela dos Veios). Fora dos canais de RP, vale onde você mora."
                    },
                    {
                        "titulo": "Estoque que reage",
                        "texto": "comprar aperta o estoque daquele mercado e o preço sobe; vender enche e o preço cai. Fica entre ×0,6 e ×1,8 e volta ao normal sozinho com os dias. A tabela mostra quanto cada coisa está acima ou abaixo do normal. Cristais não mudam."
                    },
                    {
                        "titulo": "Mercador",
                        "texto": "quem tem a Profissão compra mais barato e vende mais caro nas lojas de NPC: 5% Aprendiz, 10% Oficial e 15% Mestre."
                    },
                    {
                        "titulo": "Eventos sozinhos",
                        "texto": "sem evento ligado pela Staff, o mercado sorteia um de 2 ou 3 dias em 1 de cada 4 dias. Entraram três novos: Escassez nos Veios (minérios ×1,5), Caravana de Clover (orgânicos ×0,7) e Febre dos Encantos (Pó de Cristal, Fio Rúnico, Quartzo e Lente ×2)."
                    },
                    {
                        "titulo": "/extrato",
                        "texto": "seus Yuls, o patrimônio e a Riqueza, o custo de vida da semana, o salário de cada Profissão e o que está guardado em encomendas e cabeças a prêmio."
                    }
                ]
            },
            {
                "nome": "Treinos novos",
                "itens": [
                    {
                        "titulo": "Com mestre",
                        "texto": "no `/treinar`, o botão **Com mestre**: treine com um Marcado pelo menos 2 Estágios acima de você. Ele aceita no botão, e o treino gasta a vaga normal do ciclo mas rende **+1 treino** (ou +1% de Controle). O mestre ganha XP do Passe e ensina até 3 aulas por dia. O mestre do seu esquadrão ensina sem a regra dos Estágios."
                    },
                    {
                        "titulo": "Mestres de Classe",
                        "texto": "em vez de um Marcado, o botão **Com mestre** chama o Mestre de Classe do lugar onde você está, se houver um. Ele cobra 150 Yuls por Estágio que você já subiu."
                    },
                    {
                        "titulo": "Combate",
                        "texto": "no `/treinar`, o botão **Combate**: desafie outro Marcado para lutar em cena. Os dois treinam o foco que escolheram e gastam a vaga do ciclo; quem vence ganha **+1 treino** a mais (ou +1% de Controle). O resultado é marcado por um e confirmado pelo outro, ou pela Staff. O mesmo par só treina assim uma vez a cada 20 horas."
                    }
                ]
            },
            {
                "nome": "Progressão",
                "itens": [
                    {
                        "titulo": "Estágios mais caros",
                        "texto": "subir de Estágio pede mais Cristais: do 7º em diante já entram Cristais Brancos, e os Estágios altos pedem mais Negros e Dourados."
                    },
                    {
                        "titulo": "Teto dos físicos",
                        "texto": "cada Estágio tem uma classificação máxima de Força, Velocidade e Resistência. Quem já passou do teto não perde nada, só não sobe mais até avançar de Estágio."
                    }
                ]
            },
            {
                "nome": "Passe de Temporada",
                "itens": [
                    {
                        "titulo": "/passe ver",
                        "texto": "30 níveis com recompensas na trilha Grátis e na Premium. O XP vem jogando: posts de RP com 500 caracteres ou mais, call com outros jogadores, missões, treinos, criaturas vencidas e eventos (até 120 XP por dia)."
                    },
                    {
                        "titulo": "Premium",
                        "texto": "**600 Cristais Prismáticos**, no botão **Premium** do `/passe ver`. Quem vira Premium depois resgata na hora tudo o que já passou."
                    },
                    {
                        "titulo": "Nível 30",
                        "texto": "escolha entre a **Armadura do Miasma** ou um sorteio de Grimório."
                    },
                    {
                        "titulo": "Visual",
                        "texto": "títulos, molduras, fundos e a Capa da Temporada aparecem na aba nova **Visual** da `/ficha`. Também tem `/passe ranking` e `/passe mural`. A data de início da temporada sai em breve."
                    },
                    {
                        "titulo": "/diario",
                        "texto": "use uma vez por dia e ganhe **20 XP no Passe**, fora do limite de 120. Entrou no site (logado) no mesmo dia? O dia conta **2** e vem +20 XP, em qualquer ordem. A cada 7 dias seguidos, +50 XP. O contador é seu e nunca zera. Marcos nos dias 3, 7, 14, 21, 30, 45, 60, 75 (fundo de ficha **Vigília**), 90 e **100: o Milagre exclusivo Juramento** e o cargo Cem Dias. O Milagre ocupa a vaga do Despertar; quem já tem um escolhe trocar ou deixar guardado. Veja tudo no botão **Marcos**."
                    }
                ]
            },
            {
                "nome": "Site e Trilhas",
                "itens": [
                    {
                        "titulo": "/site",
                        "texto": "abre o site do Black Destiny já com a sua conta, sem senha. O link é só seu, vale 10 minutos e uma vez só. Lá você vê a sua ficha de verdade, sempre igual à `/ficha`."
                    },
                    {
                        "titulo": "Árvores novas",
                        "texto": "cada Classe de Mago agora tem uma árvore com **24 habilidades**: a Raiz, três ramos do Grau I ao Ápice e três Elos entre os ramos. Os nós que você já tinha continuam seus."
                    },
                    {
                        "titulo": "Pontos de Trilha",
                        "texto": "2 na criação e mais a cada Estágio, até 13 no 1º. Nós maiores custam mais pontos. A Staff pode dar até 2 Pontos de Feito por feitos no RP."
                    },
                    {
                        "titulo": "Gastar pelo site",
                        "texto": "dá para gastar os pontos na árvore do site ou com `/trilha pegar`. As duas usam a mesma regra e o bot vê na hora."
                    },
                    {
                        "titulo": "Site novo",
                        "texto": "o site foi refeito no traço do Destiny: a sua ficha como um grimório, as árvores das Classes, das Técnicas e dos Conhecimentos numa página só, a Academia do Marcado para quem está chegando, e as páginas de **Eventos** e de **Patch**."
                    },
                    {
                        "titulo": "Altar dos Vestígios",
                        "texto": "no site, o gacha da temporada: cada invocação gasta 1 Inscrição (ou 160 Cristais). Sai visual para a sua ficha (capa, título, fundo, tinta), Fragmentos ou materiais, que caem direto no `/inventario` do personagem, em Recursos. As chances e a garantia ficam sempre à vista: o Lendário é certo na 60ª invocação."
                    },
                    {
                        "titulo": "Visual do Altar na ficha",
                        "texto": "o que sai no Altar (título, fundo, Tinta Negra, capa e selo do Miasma) cai direto na aba **Visual** da `/ficha` e a primeira peça de cada tipo já vem vestida. Dá para trocar aqui ou na ficha do site: as duas usam o mesmo visual. No site, a Coleção do Miasma tem o botão **Ver na minha ficha** para provar antes."
                    },
                    {
                        "titulo": "Pedra do Destino",
                        "texto": "também no site: troque Inscrições (ou Cristais) por giros e rerolls da `/bolsa` (Cápsula, Giro de Magia, Grimório, Giro de Linhagem e outros), avulsos ou em pacotes de 5 e 10 com desconto. O item cai na sua `/bolsa` e você gira aqui no bot, com as chances e as vagas de sempre. O Reroll de Milagre é sorteado na hora: 80% sai um Traço à escolha e 20% sai o Reroll de Milagre."
                    }
                ]
            },
            {
                "nome": "Diamond e viagens",
                "itens": [
                    {
                        "titulo": "Mapa novo",
                        "texto": "as regiões de Diamond foram refeitas: 51 lugares, com fóruns, placas e o Perigo de cada um. Todo lugar tem uma zona de mana: Forte, Comum, Rala ou Morta."
                    },
                    {
                        "titulo": "Mana do lugar",
                        "texto": "o treino de Controle no `/treinar` e o `/mana concentrar` usam a mana do lugar onde você está. Nas Câmaras de Mana o Controle rende mais."
                    },
                    {
                        "titulo": "/viajar",
                        "texto": "vá de uma região a outra a pé, de montaria, pelo Trilho de Cristal, de vassoura, voando ou por portal. Cada jeito tem o seu tempo e o seu custo. `/viajar onde` mostra onde você está."
                    },
                    {
                        "titulo": "Sessão de treino",
                        "texto": "no `/treinar`, escolha vários focos no menu e eles viram uma sessão só, com um texto para tudo, como 2 de Força e 1 de Controle."
                    },
                    {
                        "titulo": "Criaturas novas",
                        "texto": "Vigia do Roçado, Sentinela de Musgo, O Derrame, Malware e o **Dragão Negro**, que só aparece à noite. As criaturas surgem só nos lugares com Perigo."
                    }
                ]
            },
            {
                "nome": "O mundo vivo",
                "itens": [
                    {
                        "titulo": "Chats novos",
                        "texto": "cada região ganhou três lugares para a cena do dia a dia: a entrada, um ponto de encontro e uma taverna. Diamond agora tem 51 lugares."
                    },
                    {
                        "titulo": "Quartéis",
                        "texto": "a **Sala de guerra** da Coroa é só dos Generais Brilhantes, e o **Covil do Veio Negro** é só de quem está contra eles, Rebeldes e Desgarrados. Cada Tropa e cada ala tem o seu tópico lá dentro. O cargo vem sozinho pela sua patente."
                    },
                    {
                        "titulo": "Moradas",
                        "texto": "toda Terra comprada vira um post no fórum de Moradas da região, onde o dono recebe visitas. A Toca do Fosso não diz de quem é."
                    },
                    {
                        "titulo": "/clima",
                        "texto": "cada região tem um clima por dia, que vira às 6h. A Névoa Cinza deixa a viagem até a região mais lenta, a Tempestade de Fuligem fecha o Trilho de Cristal, a Seca de Mana deixa a mana Comum Rala e a Maré de Mana faz o Controle render mais na Fenda de Clover."
                    },
                    {
                        "titulo": "/classe",
                        "texto": "agora dá para trocar de Classe de Mago jogando. Cada classe tem um mestre num lugar de Diamond (veja em `/classe mestres`). Ele passa 3 provas, missões Rank D, C e B. Feitas as 3, você paga 5.000 Yuls e troca. A trilha zera e os Pontos de Trilha voltam. Uma troca a cada 30 dias."
                    },
                    {
                        "titulo": "Territórios",
                        "texto": "cada lugar de Diamond tem 100 pontos de influência divididos entre Generais Brilhantes, Veio Negro e Caçadores. Quem passa de 50 domina; senão, é terra de ninguém. Missão concluída num lugar dá à sua facção os Méritos do Rank em pontos (quem não tem patente conta para os Caçadores). Lugar largado por 3 dias fora da região da facção vai perdendo pontos. Veja tudo em `/territorio ver`."
                    },
                    {
                        "titulo": "/patrulha",
                        "texto": "uma cena de 500 caracteres rondando o lugar dá 1 ponto para a sua facção. Até 2 patrulhas por dia, uma por lugar, estando na região."
                    },
                    {
                        "titulo": "Disputas",
                        "texto": "o Capitão (um General Brilhante) ou o Líder de ala (um Quilate) declara disputa por um lugar vizinho com `/territorio disputar`, uma por semana. Por 72 horas toda ação ali vale o dobro, os dois lados contratam Caçadores e o combate entre as facções no lugar não precisa de justificativa. Quem fizer mais pontos fica com o lugar."
                    },
                    {
                        "titulo": "Sentinelas",
                        "texto": "cena num lugar dominado pela facção inimiga não passa despercebida: minutos depois, o quartel de lá recebe um relatório de movimento suspeito. Sem nome."
                    },
                    {
                        "titulo": "Quem domina ganha",
                        "texto": "fazer missão ou Jornada num lugar da sua facção rende +15% de Yuls, e o mercado de lá dá 10% de desconto. No mercado de um lugar do Veio Negro a Coroa não cobra imposto; onde os Generais mandam, ninguém negocia nada do Fosso e o Contrabandista rende 30% menos."
                    },
                    {
                        "titulo": "Destaque de domingo",
                        "texto": "todo domingo às 20h sai em Mudanças do mundo o mapa do reino, quantos lugares cada facção ganhou ou perdeu na semana e quem mais rendeu influência em cada uma."
                    },
                    {
                        "titulo": "/mapa",
                        "texto": "a carta do lugar onde você está, desenhada pelo bot: muda com o clima, com o dia e a noite e com quem domina. Escolha Diamond inteiro para ver o reino com a cor de cada facção."
                    },
                    {
                        "titulo": "Mural dos Notáveis",
                        "texto": "um canal novo em O mundo com 9 cartazes que mudam sozinhos: **Os Brilhantes** (os 3 com mais Méritos), **Os Negros** (os 3 com mais Antiméritos) e os **Procurados** (as 3 cabeças mais caras). Cada cartaz mostra o retrato, a patente e os 3 maiores feitos."
                    },
                    {
                        "titulo": "Cabeça a prêmio",
                        "texto": "ganhar Méritos põe preço do Veio Negro na sua cabeça; ganhar Antiméritos põe preço dos Generais. Tomar missão do outro lado, vencer combate na disputa e derrotar alguém da facção inimiga em luta também sobem o preço. Sem crime novo, cai 5% por semana. Veja com `/mural ver`."
                    },
                    {
                        "titulo": "Cobrar uma cabeça",
                        "texto": "depois da cena narrada, a Staff confirma com `/mural captura`. Vivo paga 100%, o Grimório 70%, morto 60%, um Disco 50% e um membro ou olho 40%. Quem é da facção que paga recebe Méritos ou Antiméritos; Caçador recebe Bounty. Preso fica no quartel de quem pagou até fugir ou ser resgatado."
                    },
                    {
                        "titulo": "Esquadrões",
                        "texto": "com patente, entre numa divisão com `/esquadrao entrar`: as Tropas de Reconhecimento, de Abate e de Conquista (Generais) ou as alas dos Rebeldes e dos Desgarrados (Veio Negro). Cada uma vigia uma parte do mapa, onde a sua influência vale 50% a mais, e tem uma vantagem própria. Veja em `/esquadrao ver`."
                    },
                    {
                        "titulo": "Capitão e Líder",
                        "texto": "cada Tropa tem um Capitão (um General) e cada ala um Líder (um Quilate). Sem ninguém no posto, o Tenente ou Lapidador com mais moeda comanda como interino, e o bot troca sozinho. O chefe declara disputas e, se a divisão for a da semana no domingo, divide 30 Méritos ou Antiméritos com `/esquadrao premiar`."
                    },
                    {
                        "titulo": "Pupilo",
                        "texto": "o Capitão ou o Líder escolhe 1 pupilo da divisão, 2 Estágios abaixo, com `/esquadrao pupilo`. O mestre ganha 10% da moeda que o pupilo ganha em missão (o pupilo não perde nada) e +3 quando ele sobe de patente. Se o mestre sair, o pupilo herda o interino."
                    },
                    {
                        "titulo": "Deserção",
                        "texto": "`/esquadrao desertar` larga a patente e a facção. Quem você deixou põe 50 de preço na sua cabeça."
                    },
                    {
                        "titulo": "Segredos nos lugares",
                        "texto": "todo lugar de Diamond esconde segredos. Escreva uma cena de pelo menos 400 caracteres ali e use `/investigar` em até 30 minutos: você ganha uma pista de um segredo que combina com quem você é (seus Conhecimentos, Discos, profissão, facção, a hora e o clima). Com as pistas que ele pede, o segredo se revela só para você. 1 investigação por lugar a cada 24 horas, até 3 por ciclo."
                    },
                    {
                        "titulo": "O que um segredo dá",
                        "texto": "um achado (item, recurso ou Yuls), uma passagem secreta que encurta o `/viajar`, um saber de lore, uma missão que só você pode pedir, a fraqueza de uma criatura ou uma Brecha que dá +10 de influência numa disputa daquele lugar (`/segredos brecha`)."
                    },
                    {
                        "titulo": "Caderno e rumores",
                        "texto": "`/segredos caderno` mostra suas pistas e o que você já achou, e o `/mapa` marca com um X vermelho onde você tem pista. Toda semana cada região ganha um rumor que só o primeiro a achar leva: o canal de mudanças avisa quando ele aparece e quando alguém acha, sem dizer quem. A Tropa de Reconhecimento acha uma pista a mais."
                    },
                    {
                        "titulo": "Lojas com dono",
                        "texto": "11 lugares de Diamond têm loja com dono NPC (o Arsenal, a Joalheria da Avenida, as Fornalhas da Guilda, o Câmbio e o Leilão Mudo do Fosso e outras). Use `/loja ver`, `/loja comprar` e `/loja vender` dentro do canal delas, estando na região. Cada uma vende e compra coisas diferentes."
                    },
                    {
                        "titulo": "Estoque do dia",
                        "texto": "o estoque volta às 6h. Quando acaba o preço sobe até 50%, e quando os jogadores vendem demais ele cai até 20%. No Leilão Mudo o preço muda todo dia. Quem domina o lugar dá desconto à sua facção, e o Arsenal Brilhante só atende os Generais."
                    },
                    {
                        "titulo": "NPCs que conversam",
                        "texto": "8 NPCs agora respondem com `/falar` no canal deles: a taverneira do Último Brilho, o agenciador do Mural, o mestre das Fornalhas, o cambista, a dona da Toca do Lampião, o estalajadeiro da Encruzilhada, o leiloeiro mudo (responde por bilhete) e a reitora da Escola de Medicina. Cada um tem jeito próprio, sabe coisas do lugar e esconde segredos: quem ganha a confiança dele pode levar uma pista (uma a cada 7 dias por NPC). Até 20 falas por dia. Fica ligado quando a Staff ativar."
                    },
                    {
                        "titulo": "Arte de cada lugar",
                        "texto": "o `/mapa` de um lugar passa a mostrar a arte própria dele, no traço do Destiny, no lugar da planta desenhada. As artes chegam aos poucos; onde ainda não tem, a planta continua."
                    },
                    {
                        "titulo": "Mudanças do mundo",
                        "texto": "um canal novo com o clima do dia e um Boletim a cada 6 horas: criaturas vencidas ou que fugiram, patentes novas e o que a Staff anunciar. O **Muro dos caídos** guarda o nome de quem morreu."
                    }
                ]
            },
            {
                "nome": "Milagres e Conhecimentos",
                "itens": [
                    {
                        "titulo": "Milagres raros",
                        "texto": "cada Marcado tem no máximo 2 Milagres: um da linhagem e um do Despertar. Cada Milagre tem 3 portadores no servidor, e o **Amado pela Mana** tem 6. Quando enche, ele para de sair nos giros. Ninguém perde o Milagre que já tem."
                    },
                    {
                        "titulo": "Boismortier",
                        "texto": "o Amado pela Mana agora sai por chance no giro, em vez de vir garantido."
                    },
                    {
                        "titulo": "Limite de Conhecimentos",
                        "texto": "os Conhecimentos e Traços que vêm da família e da raça não contam mais no limite de 6."
                    },
                    {
                        "titulo": "/estudar esquecer",
                        "texto": "com o limite cheio, esqueça um Conhecimento para abrir espaço para outro."
                    },
                    {
                        "titulo": "/vagas",
                        "texto": "agora todo mundo pode ver quem ocupa cada família, magia e Milagre com vaga e o que já está cheio. Use `tipo` para ver só uma parte ou `nome` para ver uma só."
                    }
                ]
            },
            {
                "nome": "Classes e itens",
                "itens": [
                    {
                        "titulo": "Artífice",
                        "texto": "agora é o mago da forja de verdade: forja mesmo sem Profissão, faz peças um grau acima com metade do material, cria uma Obra-Prima por mês e encaixa mais discos."
                    },
                    {
                        "titulo": "Mago das Sombras",
                        "texto": "virou espião e assassino: fachadas com `/sombras fachada`, Rede de Informantes que avisa quando um alvo viaja, Mercado Negro sem imposto, Missões Ocultas e o rastro de criaturas que fugiram."
                    },
                    {
                        "titulo": "/equipamento",
                        "texto": "vincule, dê nome, desperte e repare os seus itens, e crie a sua Arma-Assinatura. Os itens ganham Ressonância nas missões e Partes das criaturas vencidas."
                    },
                    {
                        "titulo": "Inventário novo",
                        "texto": "o `/inventario` agora é uma grade com a arte de cada item, separada em Equipados, Mochila e Recursos."
                    },
                    {
                        "titulo": "Criar feitiço e equipamento",
                        "texto": "o painel de criação em <#1569905547640049744> ganhou as abas **Feitiço** e **Equipamento**. O pedido vai para a Staff, que define a qualidade e o preço em Yuls. Encantamento próprio só a partir de Rara, e cada um pode ter até 3 pedidos abertos."
                    }
                ]
            },
            {
                "nome": "Ficha",
                "itens": [
                    {
                        "titulo": "Imagem por link",
                        "texto": "na criação, além de enviar o arquivo, dá para colar um link ou mandar a imagem no chat. Ajuda quem tem celular que travava."
                    },
                    {
                        "titulo": "Pedir alteração",
                        "texto": "na `/ficha`, aba Pessoal, use **Pedir alteração** para mudar nome, aparência, imagem ou história. O pedido vai para a Staff aprovar."
                    }
                ]
            },
            {
                "nome": "Cristais Prismáticos",
                "itens": [
                    {
                        "titulo": "O VIP saiu",
                        "texto": "o VIP não é mais vendido. Tudo o que se compra com dinheiro agora passa pelos **Cristais Prismáticos**. Quem já tinha VIP não perde nada do que ganhou."
                    },
                    {
                        "titulo": "Como comprar",
                        "texto": "no site, na página Cristais, por Pix ou cartão, com o login do Discord (o `/site` abre já com a sua conta). O saldo é da sua conta e vale no bot na hora."
                    },
                    {
                        "titulo": "Onde gastar",
                        "texto": "o Passe Premium sai por 600 Cristais no `/passe ver`. No site: o Altar, a Pedra do Destino e a loja da conta (Skip Treino, Classe de Mago e Raça à escolha), tudo caindo na sua `/bolsa`."
                    },
                    {
                        "titulo": "Inscrições jogando",
                        "texto": "missão concluída de Rank D ou acima dá 1 Inscrição (até 3 por semana), criatura derrotada nos chats de RP dá 1 (1 por semana) e cada Estágio novo dá 5. Elas ficam na sua conta e o Altar gasta primeiro as Inscrições, depois os Cristais."
                    },
                    {
                        "titulo": "Presente da primeira compra",
                        "texto": "a Classe de Mago à escolha cai na sua `/bolsa` na hora. A moldura e o título a Staff entrega."
                    },
                    {
                        "titulo": "Limites",
                        "texto": "cada conta gasta no máximo R$ 500 por mês. Magia rara à escolha, Milagre à escolha, PE, Yuls e espaços de feitiço nunca estão à venda."
                    }
                ]
            },
            {
                "nome": "Boost",
                "itens": [
                    {
                        "titulo": "Recompensas de Boost",
                        "texto": "as recompensas foram refeitas. Veja em <#1568013020326658249>. Quem dá Boost ganha um agradecimento em <#1568013132624953414>."
                    }
                ]
            },
            {
                "nome": "Servidor",
                "itens": [
                    {
                        "titulo": "Boas-vindas",
                        "texto": "quem chega recebe uma mensagem nova, com os primeiros passos, e um oi no bate-papo."
                    },
                    {
                        "titulo": "Cargos animados",
                        "texto": "os cargos ganharam cores em degradê que combinam com o que cada um é."
                    },
                    {
                        "titulo": "Mais estável",
                        "texto": "o bot se recupera sozinho quando a conexão cai, e os botões da criação não mostram mais \"A interação falhou\"."
                    },
                    {
                        "titulo": "Treinos sem perda",
                        "texto": "`/treinar`, a sessão de treinos, o `/despertar`, o `/estudar` e o treino de criatura não gastam mais o ciclo quando a conexão falha. A sessão entra inteira ou não entra, e se der erro o bot devolve o seu texto."
                    },
                    {
                        "titulo": "Planeta Global",
                        "texto": "o jornal de Diamond agora chega pelo bot: a transmissão do Viktor Fritz em texto, com imagens, depoimentos e o vídeo logo abaixo."
                    }
                ]
            }
        ],
        "rodape": "Comandos novos podem levar alguns minutos para aparecer (aperte Ctrl+R no Discord). Viu algum erro? Mande um print para a Staff.",
        "fecho": "Diamond mudou. Agora, cabe a vocês escrever o resto."
    },
    {
        "versao": "2026-11-07",
        "data": "07/11/2026",
        "titulo": "Atualização do Bot",
        "resumo": "O bot recebeu uma revisão. Agora dá para usar os rerolls de **Boost** e **VIP** na ficha aprovada, a magia da família pode ser trocada e vários erros foram corrigidos.",
        "frase": "Toda alma volta. Nenhuma volta igual.",
        "secoes": [
            {
                "nome": "",
                "itens": [
                    {
                        "titulo": "Bolsa na ficha",
                        "texto": "com a ficha aprovada, use o menu da `/bolsa ver` para trocar raça, família, Classe de Mago, magia ou Grimório. Valem os rerolls, as escolhas do VIP e as magias que você girou e guardou. O bot mostra o que muda antes de gastar."
                    },
                    {
                        "titulo": "Magia da família",
                        "texto": "a magia girada agora pode ficar no lugar da magia da linhagem. Na criação, use o botão de troca para escolher qual delas fica."
                    },
                    {
                        "titulo": "/bolsa girar",
                        "texto": "agora gira de verdade, e os resultados ficam guardados até você usar."
                    },
                    {
                        "titulo": "Criação",
                        "texto": "família, raça, classe e magia à escolha agora são menus, sem precisar digitar o nome."
                    },
                    {
                        "titulo": "Erros",
                        "texto": "quando algo falha, o bot avisa em vez de mostrar \"A interação falhou\"."
                    }
                ]
            }
        ],
        "rodape": "Os giros da criação continuam valendo só na criação. Viu algum erro? Mande um print para a Staff.",
        "fecho": "Gire, troque e reescreva o seu destino."
    }
];

export const patches = [PATCH_ATUAL, ...PATCHES_ANTERIORES];
