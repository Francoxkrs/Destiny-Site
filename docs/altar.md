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

- **Pedra do Destino:** continua prévia. Os giros dela vão para a /bolsa do bot, que ainda não recebe do site.
- **Inscrições ganhas jogando:** a tabela "Como ganhar Inscrições" ainda não soma nada. Quando o bot passar a dar Inscrições, ele soma em `contas.inscricoes`.
- **Fragmentos:** acumulam, mas ainda não compram nada. A troca por um Lendário de temporada passada só faz sentido a partir da Temporada II.

Testes: `npm run altar:teste` (sem Mongo, banco falso em memória).
