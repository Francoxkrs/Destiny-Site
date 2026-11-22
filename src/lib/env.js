// Variáveis de ambiente do portal (configuradas na Vercel). Nada aqui vai para o navegador.
// Lista completa e o que cada uma faz: README.md, seção "Portal: login e ficha".
// process.env primeiro: o Astro converte valores só com dígitos (como o GUILD_ID) em número no import.meta.env,
// e um id do Discord perde os últimos dígitos virando número.
const e = (k) => String(process.env[k] ?? import.meta.env?.[k] ?? '').trim();

export const env = {
  get discordId() { return e('DISCORD_CLIENT_ID'); },
  get discordSecret() { return e('DISCORD_CLIENT_SECRET'); },
  get sessionSecret() { return e('SESSION_SECRET'); },
  get mongoUri() { return e('MONGO_URI'); },
  get dbName() { return e('DATABASE_NAME') || 'black-destiny'; },
  /** servidor do Black Destiny (a ficha é por servidor) */
  get guildId() { return e('GUILD_ID'); },
  /** Mercado Pago (Pix dos Cristais): o mesmo token do bot (MP_ACCESS_TOKEN) e o e-mail que vai como pagador */
  get mpToken() { return e('MP_ACCESS_TOKEN'); },
  get mpEmail() { return e('MP_PAYER_EMAIL'); },
  /** opcional: chave secreta dos avisos (Webhooks) do painel do Mercado Pago, para conferir a assinatura */
  get mpSegredo() { return e('MP_WEBHOOK_SECRET'); },
  /** Sala de Testes (/admin): ids do Discord com acesso, separados por vírgula. Vazio = a sala não existe. */
  get adminIds() { return e('ADMIN_IDS'); },
  /** Métricas da Sala de Testes: token do bot (lê membros pela API do Discord) e a chave do agendamento diário da Vercel */
  get botToken() { return e('DISCORD_BOT_TOKEN'); },
  get cronSecret() { return e('CRON_SECRET'); },
};

/** O login só liga com as três chaves; o banco, com a URI e o servidor. */
export const loginPronto = () => Boolean(env.discordId && env.discordSecret && env.sessionSecret.length >= 32);
export const bancoPronto = () => Boolean(env.mongoUri && env.guildId);
/** A compra de Cristais liga com o banco, a sessão e as duas chaves do Mercado Pago. */
export const pagamentoPronto = () => Boolean(bancoPronto() && env.sessionSecret.length >= 32 && env.mpToken && env.mpEmail);
