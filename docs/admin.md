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
