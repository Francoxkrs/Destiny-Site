# Compra de Cristais Prismáticos (Pix e cartão)

Os 6 pacotes da página `/cristais/` são vendidos pelo Mercado Pago, a mesma conta que o bot já usa para o VIP e o Passe:

- **Pix**: QR Code e copia e cola na própria página.
- **Cartão** (crédito até 12x ou débito): Checkout Pro, a página segura do Mercado Pago. O número do cartão nunca passa pelo site. Depois de pagar, a pessoa volta para `/cristais/?compra=<id>` e a página confere.

Sem as variáveis abaixo na Vercel, o botão continua "Em breve" (nada quebra). O cartão usa o mesmo token, sem configuração a mais.

## Variáveis na Vercel (Settings → Environment Variables, ambiente Production)

| Nome | O que é | Obrigatória |
|---|---|---|
| `MP_ACCESS_TOKEN` | Access Token de **produção** do Mercado Pago (começa com `APP_USR-`). O mesmo do `.env` do bot. | sim |
| `MP_PAYER_EMAIL` | E-mail que vai como pagador no Pix (o Mercado Pago exige um). O mesmo do bot. | sim |
| `MP_WEBHOOK_SECRET` | Chave secreta dos Webhooks (painel do Mercado Pago). Com ela, o site recusa avisos falsos. | recomendada |
| `DISCORD_WEBHOOK_COMPRAS` | URL de um Webhook do canal de logs da Staff: avisa cada compra e o presente da primeira compra. | opcional |

Além dessas, a compra usa o que o portal já pede: `SESSION_SECRET`, `MONGO_URI`, `GUILD_ID` (ver [portal.md](portal.md)).
Depois de salvar as variáveis, faça um Redeploy do último deploy de produção.

## Aviso do Mercado Pago (Webhook)

Mercado Pago → Suas integrações → (a aplicação do token) → Webhooks → Configurar notificações:

- URL de produção: `https://<domínio do site>/api/cristais/aviso`
- Eventos: **Pagamentos** e **Contestações** (chargebacks)
- Copie a "Assinatura secreta" para `MP_WEBHOOK_SECRET`.

O Webhook é um reforço: mesmo sem ele os Cristais entram, porque a janela do Pix pergunta ao Mercado Pago a cada 4 s
e a página de Cristais confere os Pix abertos da pessoa sempre que ela abre.

## Como funciona

1. `POST /api/cristais/comprar { pacote }`: exige login; cria o pedido em `comprasCristais` e o Pix (30 min) com `external_reference` = id do pedido. Dois cliques no mesmo pacote reaproveitam o mesmo Pix.
2. `GET /api/cristais/pedido?id=`: a janela pergunta; o site consulta o pagamento no Mercado Pago.
3. Só credita quando o Mercado Pago diz `approved`, o valor bate e a referência é do pedido. A soma em `contas.cp` e o id em `contas.pedidosCreditados` vão na mesma operação, então nunca soma duas vezes.
4. Venceu sem pagar: o site cancela o Pix no Mercado Pago antes de fechar o pedido (um Pix pago no último segundo nunca se perde).
5. `POST /api/cristais/aviso`: o Webhook. O corpo não é confiado; o site só usa o id para perguntar ao Mercado Pago.
6. Cartão: o pedido guarda a preferência; o site acha o pagamento pela referência (`/v1/payments/search`). Pagamento aprovado depois do pedido vencer ainda credita (o dinheiro entrou).
7. Estorno (chargeback) ou reembolso de um pedido pago: os CP saem da conta uma vez só (`contas.pedidosEstornados`), o saldo pode ficar negativo e a Staff recebe o aviso.

Taxas: o cartão custa mais que o Pix para o vendedor; a taxa de cada um está no painel do Mercado Pago (Seu negócio → Custos).

Regras aplicadas: teto de R$ 500 por mês por conta (era R$ 150 até 21/11/2026) (pagos no mês, horário de Brasília, mais Pix ainda abertos).
Primeira compra da conta: `contas.primeiraCompra { pedido, em, entregue: false }`; a Staff entrega o presente (o aviso no Discord lembra).

Ainda não vendido pelo site: Selo Mensal (depende do `/selo` no bot) e presente para amigo.
Gastar CP (Altar, loja da conta) é a próxima etapa.

Testes sem rede: `npm run cristais:teste`.
