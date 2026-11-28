# Portal do Marcado (site v2): login, ficha e árvore

O site é estático, com quatro partes que rodam no servidor da Vercel: **Ficha**, **Árvores**, **Cristais**, **Entrar** e as rotas `/api/*`.
Sem as variáveis abaixo, tudo funciona em modo de exemplo (ficha do Lúx, nada grava).

## Dois jeitos de entrar

1. **Pelo bot (`/site`)**: o jogador usa `/site` no Discord e recebe um botão "Abrir o site" que só ele vê. O link vale 10 minutos e uma vez só; o site pede um clique em "Entrar" (quem só abre o link, como a pré-visualização de um antivírus, não gasta o código). Precisa só de `SESSION_SECRET`, `MONGO_URI` e `GUILD_ID` na Vercel e de `SITE_URL` no `.env` do bot. Funciona também nas prévias de PR (o link aponta para o `SITE_URL`).
2. **Entrar com Discord (OAuth2)**: o botão da página /entrar. Precisa também de `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` e do Redirect cadastrado.

## Variáveis de ambiente (Vercel → Project → Settings → Environment Variables)

| Nome | O que é | Onde pegar |
| --- | --- | --- |
| `DISCORD_CLIENT_ID` | ID do aplicativo do Discord (pode ser o do bot) | Portal de Desenvolvedores → app → OAuth2 |
| `DISCORD_CLIENT_SECRET` | Segredo do aplicativo | Mesma tela, "Reset Secret". **Nunca no chat nem no código.** |
| `SESSION_SECRET` | Chave que assina o cookie de sessão, 32+ caracteres aleatórios | Gere com `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `MONGO_URI` | Conexão com o MongoDB do bot, com o usuário do site (abaixo) | Atlas → Connect → Drivers |
| `DATABASE_NAME` | Nome do banco (padrão `black-destiny`) | O mesmo do `.env` do bot |
| `GUILD_ID` | ID do servidor do Black Destiny | Discord → clique direito no servidor → Copiar ID |
| `ADMIN_IDS` | Opcional: seu ID do Discord, abre a Sala de Testes (`/admin`). Ver [admin.md](admin.md) | Discord → Modo Desenvolvedor → clique direito no seu nome → Copiar ID |

### Redirect do Discord
Em OAuth2 → Redirects, adicione exatamente: `https://<domínio do site>/api/auth/callback`.
O Discord exige o endereço exato, então as prévias de PR (cada uma com um endereço) só fazem login se o endereço delas também for cadastrado.
O site pede só o escopo `identify` (nome e avatar).

### Usuário do MongoDB para o site
O site lê a ficha e grava só o que ele muda. Crie no Atlas (Database Access → Custom Roles) uma função `site-portal` com:

- `find` em `personagens`, `fichasWeb`, `assets`, `contas`, `acessosWeb`, `comprasCristais`
- `update` em `personagens` (só para a trilha; o site valida as regras antes), `fichasWeb` e `acessosWeb` (marcar o link do /site como usado)
- `insert`, `update` e `createIndex` em `contas` e `comprasCristais` (compra de Cristais pelo Pix, ver [pagamento.md](pagamento.md))
- `find` e `insert` em `pedidosFeitico` (escrever feitiço pelo site, abaixo)

e um usuário com essa função. Em Network Access, a Vercel não tem IP fixo, então é preciso liberar `0.0.0.0/0`; por isso o usuário do site deve ter senha forte e só essa função.

## Contrato com o bot: `fichasWeb`

O bot é a fonte das regras (`functions/portal/` no bot). Ele ouve o banco (change stream em `personagens`, `feiticos` e `itens`) e, a cada mudança de um jogador, regrava em até 2 s a ficha já calculada; ao ligar, confere todos, e a cada 2 min pega o que escapou. Grava em `fichasWeb` um documento por `{ guildId, userId }`, no formato `FichaWeb` versão 1 (`src/lib/ficha.js`). Campos principais:

- identidade: `nome`, `sobrenome`, `epiteto`, `imagem` (hash da coleção `assets`), `cor`, `raca`, `familia`, `classeSocial`, `regiao`, `origem`, `patente`
- magia: `classeMago`, `magia`, `magiaRaridade`, `grimorio`, `milagres[]`, `feiticos[]` (com `imagem` opcional)
- progressão: `estagio`, `pe`, `controle`, `proximo` (`{ estagio, pe, controle, cristais }` do próximo Estágio, ou `null` no 1º)
- atributos: `fisicos[]` com `indice` (0 Comum ... 7 Transcendental), `teto` (de `limiteFisicoPorEstagio`), `acrescimos`, `treino`; `mana { atual, max }`, `reserva` (1–10), `poder` (1–6)
- bolsa: `moedas { yuls, meritos, antimeritos, cristais { branco, negro, dourado } }`
- trilha: `trilha { versao: 2, pontos, gastos, livres, feitos, nos[] }`. O bot usa as árvores v2 (`assets/trilhas/*.json`, os mesmos JSON de `src/data/trilhas/`), `nos` vem com os ids novos ("batalha.furia.avanco") e `pontos` já soma os Pontos de Feito (`estado.trilhaFeitos`, máx. 2, dados pela Staff com `/staff trilha feito:`). Fichas antigas guardam "Ramo/0"; bot e site convertem pelo campo `legado`.
- `mana { atual, max, regenHora, em }`: o site soma a regeneração desde `em`.
- `conhecimentos[]`, `tracos[]`, `tecnicas[]`, `historia { vidaPassada, renascimento, personalidade }`, `atualizadoEm`

Quando o site gasta Pontos de Trilha (só com `trilha.versao === 2`), ele conta os pontos pelo personagem (Estágio + Feitos), grava `estado.trilhaClasse` com os ids novos e `updatedAt` em `personagens` (só se a trilha não mudou desde a leitura), registra no `diario` e atualiza `trilha` em `fichasWeb`. O bot vê a mudança pela escuta e refaz a foto inteira.

### No bot (`.env` na Discloud)
- `SITE_URL`: o endereço público do site, sem barra no fim (ex.: `https://black-destiny.vercel.app`). É para onde o `/site` manda; sem ele, o bot usa esse mesmo endereço.
- O usuário do MongoDB do bot já pode tudo; a escuta (change stream) precisa de um cluster com replica set, que é o padrão do Atlas (inclusive o gratuito). Sem isso, o bot cai sozinho para a conferência de 2 em 2 minutos.

Saldo de Cristais Prismáticos: coleção `contas` `{ userId, cp, pedidosCreditados[], primeiraCompra? }` (por conta do Discord, não por personagem). Quem soma é a compra pelo Pix do site: ver [pagamento.md](pagamento.md).

## De onde vem cada tela

| Tela | Dados | Como atualizar |
|---|---|---|
| Árvores | `src/data/trilhas/*.json` (cópia de `trilhas-v2/`) | Copiar os JSON novos da frente das trilhas; o bot lê os mesmos arquivos |
| Altar dos Vestígios | `src/data/altar.js` | Banner, chances e garantia da temporada. Hoje o giro é **prévia** no navegador; o giro real precisa de uma rota no servidor ligada ao bot |
| Cristais | `src/data/cristais.js` | `aprovado: false` mostra o selo de proposta. Nada cobra até existir o pagamento |
| Eventos | `src/data/eventos.js` | Um item por evento: `estado` ativo, sempre ou breve |
| Patch Notes | `src/data/patches.js` | Copiar o `PATCH_ATUAL` de `functions/patch/notas.ts` do bot para o topo da lista |

## Escrever feitiço pelo site (`/feitico/`, 2026-11-28)

O jogador escreve o feitiço no site e o bot posta no fórum de feitiços (`/config feiticos`) com os mesmos botões Aprovar e Recusar do `/feitiço`.

1. O bot põe na `fichasWeb` o campo `escrita` (`functions/portal/escrita.ts`): Tipos e Funções com `liberado`/`exige` (pelos Conhecimentos), páginas (`espacos`, `ocupados`, `livres`), Grimório Costurado, nível do Estágio, descontos de Mana (`custo.gerais`, `porTipo`, `porFuncao`), feitiços em análise (com o post) e os 5 últimos recusados (com o motivo).
2. A página mostra só o que vale e desenha a página do Grimório ao vivo. O rascunho fica no navegador.
3. `POST /api/feitico` (multipart) confere de novo com a `escrita` (`src/lib/feitico.js`), limita a 6 pedidos por 24 h e às páginas livres, e grava em `pedidosFeitico` `{ guildId, userId, status: "novo", dados, imagem?: { dados (bytes, até 3 MB), nome, tipo }, criadoEm }`. A imagem é conferida pelos bytes (PNG, JPG, WEBP, GIF).
4. O bot (`functions/portal/pedidos-feitico.ts`) pega a cada 15 s, cria o feitiço pelo `criarFeitico` (as mesmas regras do Discord), guarda a imagem como pendente e posta. O pedido vira `enviado` (com `threadId`) ou `erro` (com o motivo), e os bytes da imagem saem do pedido.
5. A Staff decide no fórum. Aprovado, o feitiço entra no Grimório e a `fichasWeb` muda sozinha. `GET /api/feitico` lista os pedidos da conta.

Feitiço de Alma e a segunda alma (Dupla Alma) continuam só pelo `/feitiço` no Discord. Teste: `npm run feitico:teste` (site) e `npm run feitico-site:teste` (bot).
