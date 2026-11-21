# Portal do Marcado (site v2): login, ficha e árvore

O site é estático, com quatro partes que rodam no servidor da Vercel: **Ficha**, **Árvores**, **Cristais**, **Entrar** e as rotas `/api/*`.
Sem as variáveis abaixo, tudo funciona em modo de exemplo (ficha do Lúx, nada grava).

## Variáveis de ambiente (Vercel → Project → Settings → Environment Variables)

| Nome | O que é | Onde pegar |
| --- | --- | --- |
| `DISCORD_CLIENT_ID` | ID do aplicativo do Discord (pode ser o do bot) | Portal de Desenvolvedores → app → OAuth2 |
| `DISCORD_CLIENT_SECRET` | Segredo do aplicativo | Mesma tela, "Reset Secret". **Nunca no chat nem no código.** |
| `SESSION_SECRET` | Chave que assina o cookie de sessão, 32+ caracteres aleatórios | Gere com `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `MONGO_URI` | Conexão com o MongoDB do bot, com o usuário do site (abaixo) | Atlas → Connect → Drivers |
| `DATABASE_NAME` | Nome do banco (padrão `black-destiny`) | O mesmo do `.env` do bot |
| `GUILD_ID` | ID do servidor do Black Destiny | Discord → clique direito no servidor → Copiar ID |

### Redirect do Discord
Em OAuth2 → Redirects, adicione exatamente: `https://<domínio do site>/api/auth/callback`.
O Discord exige o endereço exato, então as prévias de PR (cada uma com um endereço) só fazem login se o endereço delas também for cadastrado.
O site pede só o escopo `identify` (nome e avatar).

### Usuário do MongoDB para o site
O site lê a ficha e grava só o que ele muda. Crie no Atlas (Database Access → Custom Roles) uma função `site-portal` com:

- `find` em `personagens`, `fichasWeb`, `assets`, `contas`
- `update` em `personagens` (só para a trilha; o site valida as regras antes) e `fichasWeb`

e um usuário com essa função. Em Network Access, a Vercel não tem IP fixo, então é preciso liberar `0.0.0.0/0`; por isso o usuário do site deve ter senha forte e só essa função.

## Contrato com o bot: `fichasWeb`

O bot é a fonte das regras. Sempre que um personagem muda (treino, despertar, Staff, trilha), ele grava em `fichasWeb` a ficha já calculada, um documento por `{ guildId, userId }`, no formato `FichaWeb` versão 1 (`src/lib/ficha.js`). Campos principais:

- identidade: `nome`, `sobrenome`, `epiteto`, `imagem` (hash da coleção `assets`), `cor`, `raca`, `familia`, `classeSocial`, `regiao`, `origem`, `patente`
- magia: `classeMago`, `magia`, `magiaRaridade`, `grimorio`, `milagres[]`, `feiticos[]` (com `imagem` opcional)
- progressão: `estagio`, `pe`, `controle`, `proximo` (`{ estagio, pe, controle, cristais }` do próximo Estágio, ou `null` no 1º)
- atributos: `fisicos[]` com `indice` (0 Comum ... 7 Transcendental), `teto` (de `limiteFisicoPorEstagio`), `acrescimos`, `treino`; `mana { atual, max }`, `reserva` (1–10), `poder` (1–6)
- bolsa: `moedas { yuls, meritos, antimeritos, cristais { branco, negro, dourado } }`
- trilha: `trilha { versao, pontos, gastos, livres, nos[] }`. Com as árvores v2, `versao: 2`, `nos` usa os ids novos ("batalha.furia.avanco") e `pontos` já soma os Pontos de Feito. Sem `versao: 2`, o site só mostra e planeja (os ids antigos "Ramo/0" são convertidos pelo campo `legado`).
- `conhecimentos[]`, `tracos[]`, `tecnicas[]`, `historia { vidaPassada, renascimento, personalidade }`, `atualizadoEm`

Quando o site gasta Pontos de Trilha (só com `trilha.versao === 2`), ele grava `estado.trilhaClasse` em `personagens` (só se a trilha não mudou desde a leitura), registra no `diario` e atualiza `trilha` em `fichasWeb`. O bot deve recalcular a foto quando notar a mudança.

Saldo de Cristais Prismáticos: coleção `contas` `{ userId, cp }` (por conta do Discord, não por personagem). Formato final depende da monetização aprovada.

## De onde vem cada tela

| Tela | Dados | Como atualizar |
|---|---|---|
| Árvores | `src/data/trilhas/*.json` (cópia de `trilhas-v2/`) | Copiar os JSON novos da frente das trilhas; o bot lê os mesmos arquivos |
| Altar dos Vestígios | `src/data/altar.js` | Banner, chances e garantia da temporada. Hoje o giro é **prévia** no navegador; o giro real precisa de uma rota no servidor ligada ao bot |
| Cristais | `src/data/cristais.js` | `aprovado: false` mostra o selo de proposta. Nada cobra até existir o pagamento |
| Eventos | `src/data/eventos.js` | Um item por evento: `estado` ativo, sempre ou breve |
| Patch Notes | `src/data/patches.js` | Copiar o `PATCH_ATUAL` de `functions/patch/notas.ts` do bot para o topo da lista |
