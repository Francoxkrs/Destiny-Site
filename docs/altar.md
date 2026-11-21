# Altar dos Vestígios

O Altar está de verdade desde 21/11/2026. O sorteio roda no servidor (`src/lib/altar.js`): o navegador só toca a animação do resultado.

## Rotas

- `GET /api/altar`: saldo (CP e Inscrições), garantia, Vestígios e histórico de quem entrou.
- `POST /api/altar/invocar` com `{ qtd: 1 | 10, ref }`: gasta e entrega. A `ref` é um id por clique. Repetir a mesma `ref` devolve o mesmo resultado sem cobrar de novo.

## Quanto custa

1. As Inscrições guardadas (`contas.inscricoes`) são gastas primeiro.
2. O que faltar sai dos Cristais Prismáticos, a 160 CP por Inscrição. Uma invocação ×10 nunca passa de 1.440 CP.

## Onde fica cada coisa (coleção `contas`, uma por conta do Discord)

| Campo | O que é |
| --- | --- |
| `altarPity` / `altarPityE` | Giros desde o último Lendário e desde o último Épico (garantia no 60º e a cada 10) |
| `altarV` | Trava otimista: duas invocações ao mesmo tempo nunca leem o mesmo estado |
| `vestigios` | `{ [id]: { n, em } }`, o que aparece na ficha (aba Perfil) |
| `fragmentos` | Repetido Épico +20, Lendário +100, Raro "3 Fragmentos" +3 |
| `gastos[]` | `{ ref: "altar:<ref>", cp, motivo, em }`, o mesmo formato que o bot usa no Passe |

- **Materiais dos Raros:** vão direto para `personagens.estado.recursos`, o mesmo caminho do `mexerRecurso` do bot: 1 Pó de Cristal, 2 Quartzos de Mana ou 3 Couros de Besta.
- **Personagem aprovado:** é preciso ter um para invocar.
- **Histórico:** cada invocação fica em `altarGiros`.

## Ainda falta

- **Fragmentos:** acumulam, mas ainda não compram nada. A troca por um Lendário de temporada passada só faz sentido a partir da Temporada II.

Testes: `npm run altar:teste` (sem Mongo, banco falso em memória).

## Pedra do Destino e Loja da conta (21/11/2026)

`src/lib/loja.js`, rotas `GET /api/loja` (limites usados) e `POST /api/loja/comprar` com `{ tipo: 'pedra' | 'loja', id, ref }`.

- **O site não gira.** Ele cobra e põe o item na `/bolsa` do bot (coleção `bolsas`, `itens.<chave>` e `recebido.<chave>`, igual ao `darItens` do bot). Quem gira é o bot, com as chances e as vagas de sempre.
- **Pedra:** gasta Inscrições primeiro e o resto a 160 CP. O limite é por personagem e por temporada (`contas.limites`).
- **Pacotes (21/11/2026):** giro com `id` próprio e `qtd` (5 Cápsulas por 4, 5 Giros de Magia por 9, 10 por 16). Cobra uma vez, entrega `qtd` na bolsa e soma `qtd` no limite do item, que é dividido com o avulso.
- **Reroll de Milagre:** é sorteado no servidor na hora (`sorteio` em `src/data/altar.js`): 80% Traço à escolha, 20% Reroll de Milagre. O Traço segue o teto do bot (1 Traço de recompensa por jogador); o segundo vira Troca de Traço. Liberado em CP pelo Silas em 21/11/2026.
- **Loja:** só CP. Skip Treino (3 por semana), Classe de Mago à escolha e Raça à escolha (1 por personagem). O que o bot ainda não entrega sozinho (Ateliê, Redefinir a trilha) aparece como "Em breve".
- **Falha na entrega:** se a bolsa falhar, devolve CP, Inscrições e limite e tira a ref.
- **Primeira compra de Cristais:** a Classe de Mago à escolha cai na bolsa na hora.
- **Inscrições ganhas jogando:** o bot soma em `contas.inscricoes` (`functions/cristais/inscricoes.ts`).
  - Missão de Rank D ou acima: +1, até 3 por semana.
  - Criatura: +1, 1 por semana.
  - Estágio novo: +5.

Testes: `npm run loja:teste`.
