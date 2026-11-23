# Dados do bot no site

O Índice de comandos (`/comandos/`) e as respostas do `/ajuda` nas Dúvidas (`/faq/`) saem do código do bot.
Assim, quando um comando muda no bot, o site muda junto na próxima exportação, sem ninguém reescrever à mão.

## Como atualizar

1. Na pasta do bot, compile: `npm run build`.
2. Na pasta do site, rode (troque pelo caminho do bot):

   ```
   npm run bot:exportar -- "C:\Code\Minha Missão\Black-Destiny-atualizado\Bot"
   ```

3. Confira: `npm run guias:teste`.
4. Faça o commit de `src/data/bot/comandos.json` e `src/data/bot/ajuda.json`.

O script não liga o bot nem fala com o banco: ele troca a conexão do mongoose por uma falsa antes de importar.

## O que vai para o site

- **Comandos**: nome, descrição, subcomandos e opções, como o Discord mostra.
  Ficam de fora os comandos com `[Staff]` ou `[Narrador e Staff]` na descrição, os subcomandos com `[Staff]`
  e os da lista `OCULTOS` em `scripts/bot-exportar.mjs` (hoje só `/patrocinio`, porque o site não mostra
  Patrocínio nem Preço das Patrocinadoras).
- **/ajuda**: as perguntas de `PERGUNTAS` (`functions/servidor/ajuda.ts`) com a resposta já montada.
  Os números (tetos por Estágio, Cristais, Técnicas) vêm do Cânone do bot.

O script avisa quando uma resposta do `/ajuda` cita um comando que não existe.

## O que é do site

Em `src/data/guias.js`:

- `gruposComandos`: em que grupo cada comando aparece. Comando novo sem grupo cai em "Outros"
  (o `guias:teste` avisa).
- `paginaDoComando`: a página de regra de cada comando.
- `ajudaNoSite`: tema e "Regra completa" de cada pergunta do `/ajuda`.
- `faqSite`: as perguntas escritas só para o site.
- `relacionados`: o "Leia junto" do fim de cada página de regra.

Os links `/pagina/#secao` são conferidos no build: um link que não cai numa seção aparece como
`link dos guias sem destino` no terminal.

## Links de cada regra

No build, toda seção com rótulo e todo subtítulo (`h3`) das páginas de regra ganham um `id` fixo,
tirado do texto (`/atributos/#acrescimos`, `/atributos/#empate-total`). Mudar o texto de um rótulo muda o link.
O botão **Link** ao lado do rótulo, o `#` no fim do subtítulo e o **Índice da página** copiam o endereço.
