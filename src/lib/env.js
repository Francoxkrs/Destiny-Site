// Variáveis de ambiente do portal (configuradas na Vercel). Nada aqui vai para o navegador.
// Lista completa e o que cada uma faz: README.md, seção "Portal: login e ficha".
const e = (k) => (import.meta.env?.[k] ?? process.env[k] ?? '').trim();

export const env = {
  get discordId() { return e('DISCORD_CLIENT_ID'); },
  get discordSecret() { return e('DISCORD_CLIENT_SECRET'); },
  get sessionSecret() { return e('SESSION_SECRET'); },
  get mongoUri() { return e('MONGO_URI'); },
  get dbName() { return e('DATABASE_NAME') || 'black-destiny'; },
  /** servidor do Black Destiny (a ficha é por servidor) */
  get guildId() { return e('GUILD_ID'); },
};

/** O login só liga com as três chaves; o banco, com a URI e o servidor. */
export const loginPronto = () => Boolean(env.discordId && env.discordSecret && env.sessionSecret.length >= 32);
export const bancoPronto = () => Boolean(env.mongoUri && env.guildId);
