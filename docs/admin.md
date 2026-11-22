# Sala de Testes (`/admin`)

Painel só do admin para testar o site e o bot com a própria conta: ver e mexer nos números, simular o Altar, ver o histórico e o estado do bot.

## Como ligar

Na Vercel (Project → Settings → Environment Variables), crie:

| Nome | O que é |
| --- | --- |
| `ADMIN_IDS` | O seu ID do Discord. Mais de um: separados por vírgula. |

Para pegar o ID: Discord → Configurações → Avançado → ligue o **Modo Desenvolvedor** → clique com o direito no seu nome → **Copiar ID do usuário**.

Depois, faça um novo deploy (Deployments → ⋯ → Redeploy) e entre no site com o Discord. Aparece um selo **試** no cabeçalho, ao lado do seu nome, que leva a `/admin/`.

Sem `ADMIN_IDS`, a sala não existe para ninguém.

## Segurança

- A checagem é no servidor, a cada pedido: a página `/admin` e todas as rotas `/api/admin/*` respondem **404** para quem não está em `ADMIN_IDS` (logado ou não). Esconder o link é só conforto; a trava é a rota.
- A sessão é o mesmo cookie assinado do login (HMAC com `SESSION_SECRET`); com `SESSION_SECRET` menor que 32 caracteres a sala fecha.
- Pedidos que alteram exigem a origem do próprio site (`Origin` e `Sec-Fetch-Site`) e corpo JSON, então um formulário ou link de outro site não consegue mexer em nada.
- O admin só mexe na **própria** conta (o id da sessão). Não há campo para escolher outra pessoa.
- Só os campos da lista `CAMPOS` (`src/lib/admin.js`) podem ser mexidos, cada um com mínimo e máximo.
- Cada mudança fica em `adminLog` com o valor de antes e o de depois, e pode ser desfeita no Histórico.
- A página manda `noindex` e não entra no sitemap nem na busca.

## O que dá para fazer

| Parte | O que faz | Onde grava |
| --- | --- | --- |
| Conta | Cristais Prismáticos, Inscrições, Fragmentos, garantia do Altar (Lendário e Épico); zerar garantia; zerar os limites da Pedra e da Loja; deixar a 1 giro do Lendário | `contas` (sobe `altarV`, a mesma trava do Altar e da Loja) |
| Personagem | Yuls, Méritos, Antiméritos, PE, Estágio, Cristais Brancos/Negros/Dourados; encher a Mana | `personagens.estado.*` + `updatedAt` (o bot refaz a ficha do site) |
| Simular o Altar | 10 a 10.000 giros com a mesma função do giro de verdade (`sortear`), do zero ou da sua garantia | Nada: não cobra, não grava, não entrega |
| Bot e site | Quais partes estão ligadas (só sim/não, nunca o valor das chaves), ping do banco, contagens, e o **teste do bot** | O teste soma 1 Yul, espera o bot mandar a ficha nova e tira o Yul |
| Histórico | Ajustes (com Desfazer), invocações do Altar, Pedra e Loja, compras de Cristais, gastos da conta | Só leitura |

### Teste do bot
O bot ouve o banco (change stream) e regrava a ficha do site em até ~2 s. Se a resposta vier em mais de 10 s, a escuta está desligada e o bot só pegou pela varredura de 2 min. Sem resposta em 2 min e meio, o bot está fora do ar ou sem acesso ao banco.

## Usuário do MongoDB do site
O usuário `site-portal` precisa de mais estas permissões para a sala:
- `find`, `insert` em `adminLog`
- `update` em `personagens` (já existe para a trilha) e em `contas` (já existe para os Cristais)

## Testes
`npm run admin:teste` (banco falso em memória: quem entra, limites, conta nova, Yuls que partem da ficha, só a própria conta, atalhos, simulação).

## Métricas do servidor (22/11)
Painel "Métricas" no topo da sala: membros, online, **jogaram nesta semana** (ganharam XP do Passe nos últimos 7 dias) contra a meta de 40 do plano, jogaram hoje, novatos (7 e 30 dias), **novatos que ficam** (dos que chegaram há 1 a 5 semanas, quantos continuam), caminho do novato (entrou → criou → aprovado → jogou), última vez que jogou, entradas e saídas por semana, e as linhas diárias.

Variáveis novas na Vercel:

| Nome | O que é |
| --- | --- |
| `DISCORD_BOT_TOKEN` | O mesmo token do bot (`BOT_TOKEN` do `.env`). Lê membros e online pela API do Discord. **Nunca no chat nem no código.** O bot precisa da intenção "Server Members" ligada (Portal de Desenvolvedores → Bot). |
| `CRON_SECRET` | 16+ caracteres aleatórios. A Vercel usa para chamar `/api/cron/metricas` todo dia às 00h de Brasília (`vercel.json` → `crons`) e tirar a foto do dia. Sem ela, a rota dá 404. |

As fotos ficam em `metricasDia` (uma por dia, com os ids dos membros para saber quem saiu). Os ids nunca vão para o navegador. O botão "Tirar a foto de hoje" faz o mesmo na hora. Usuário do Atlas: `find`, `insert`, `update`, `createIndex` em `metricasDia` e `find` em `passes`.

## Calendário de Eventos (22/11)
Painel "Calendário" na sala: marca, edita e apaga eventos (título, tipo, dia, até, hora, texto, link do site ou do Discord, rascunho ou público). O público aparece em **Eventos → Calendário** (`/eventos/#calendario`), lido de `/api/calendario?mes=AAAA-MM`. Mora em `calendario`; cada mudança vai para `adminLog`. Usuário do Atlas: `find`, `insert`, `update`, `remove` em `calendario`.

Testes: `npm run calendario:teste`.

## Arquivo de NPCs (`/admin/npcs`, 22/11)
Os dossiês completos dos NPCs, **só para a Staff** (pedido do Silas: tem informação que jogador não pode ver). Link "NPCs" na barra da Sala de Testes.

- O repositório é público, então **nenhum NPC fica no código**. Eles moram na coleção `npcsStaff` do banco e só saem por `/api/admin/npcs`, com a mesma trava de `ADMIN_IDS` (404 para os outros).
- Cada NPC: nome, grupo, alcunha, papel, kanji, cor, ordem, campos (rótulo + valor, com a marca **Segredo**) e falas. Valor vazio ou `[A DEFINIR]` aparece como mistério.
- **Importar**: escolha o arquivo `.json` (ou cole). NPC com o mesmo nome é regravado; ninguém é apagado. **Baixar cópia** salva tudo num `.json`.
- Apagar pede dois toques. O NPC apagado fica inteiro no `adminLog`.
- Usuário `site-portal` do Atlas: `find`, `insert`, `update`, `remove` em `npcsStaff`.
- Testes: `npm run npcs:teste` (banco falso).
