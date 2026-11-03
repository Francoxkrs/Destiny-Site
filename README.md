# Black Destiny · site

Site oficial do Black Destiny, servidor de RP de texto no Discord inspirado em Black Clover. É a porta de entrada do servidor: apresenta o mundo e todos os sistemas do Cânone v1.

Feito com [Astro](https://astro.build) (site estático), GSAP + ScrollTrigger (animações), Lenis (rolagem suave) e three.js (o cristal 3D da página inicial).

## Rodar no seu PC

Precisa do Node.js 20 ou mais novo.

```bash
npm install
npm run dev      # abre em http://localhost:4321
npm run build    # gera o site pronto na pasta dist/
npm run preview  # testa a versão gerada
```

## Onde mudar as coisas

| O que | Onde |
|---|---|
| Regras, tabelas, famílias, magias, ranks... | `src/data/canon.js` (fonte única de dados; o bot vai usar o mesmo arquivo) |
| Link de convite do Discord | `src/data/canon.js`, campo `site.discord` (hoje está `'#'`) |
| Textos e layout de cada página | `src/pages/*.astro` |
| Cores, fontes e estilos | `src/styles/global.css` (variáveis no topo) |
| Animações | `src/scripts/main.js`; simuladores em `src/scripts/sims.js`; cristal em `src/scripts/crystal.js` |

## Imagens

Cada sistema tem espaços para imagem. Enquanto não há arte, o espaço mostra o nome do arquivo esperado e o tamanho sugerido.

Para colocar uma imagem, salve o arquivo com o caminho mostrado dentro de `public/img/`. Pode ser `.jpg`, `.png`, `.webp` ou `.avif`; o site acha sozinho. Exemplo: o espaço "A Coroa" espera `public/img/regioes/a-coroa.jpg`. Depois rode `npm run build` de novo.

A lista completa (103 espaços) está em `IMAGENS.md`. Também vale criar `public/img/og.jpg` (1200×630), a imagem que aparece quando alguém cola o link do site no Discord.

## Publicar

O site é estático, então qualquer hospedagem serve. O caminho mais simples é a Vercel:

1. Crie uma conta em vercel.com.
2. Na pasta do site, rode `npx vercel --prod` e aceite as opções detectadas (Framework: Astro, Build: `npm run build`, Output: `dist`).
3. Ou envie a pasta para um repositório no GitHub e importe na Vercel; cada alteração publica sozinha.

Netlify e Cloudflare Pages também funcionam: basta enviar a pasta `dist/`.

## Acessibilidade e desempenho

- Quem ativa "reduzir movimento" no sistema vê o site sem animações e sem o cristal girando.
- O cristal 3D só desenha quando está visível e tem uma versão estática se o navegador não suportar WebGL.
- No celular, a rolagem horizontal das regiões vira uma lista vertical e as tabelas viram blocos.
