// Quais variáveis da Vercel estão postas (só sim/não, nunca o valor), para a Sala de Testes.
import { env, loginPronto, bancoPronto, pagamentoPronto } from './env.js';
import { adminIds } from './admin.js';

const tem = (k) => Boolean(String(process.env[k] ?? import.meta.env?.[k] ?? '').trim());

export function estadoEnvs() {
  return {
    partes: [
      { nome: 'Login pelo Discord', ok: loginPronto(), precisa: 'DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, SESSION_SECRET (32+)' },
      { nome: 'Banco do bot', ok: bancoPronto(), precisa: 'MONGO_URI, GUILD_ID' },
      { nome: 'Compra de Cristais', ok: pagamentoPronto(), precisa: 'MP_ACCESS_TOKEN, MP_PAYER_EMAIL' },
      { nome: 'Assinatura dos avisos do Mercado Pago', ok: Boolean(env.mpSegredo), precisa: 'MP_WEBHOOK_SECRET' },
      { nome: 'Métricas do Discord', ok: tem('DISCORD_BOT_TOKEN'), precisa: 'DISCORD_BOT_TOKEN' },
      { nome: 'Foto diária das métricas', ok: String(process.env.CRON_SECRET ?? '').length >= 16, precisa: 'CRON_SECRET (16+)' },
      { nome: 'Aviso de compra no Discord', ok: tem('DISCORD_WEBHOOK_COMPRAS'), precisa: 'DISCORD_WEBHOOK_COMPRAS' },
    ],
    admins: adminIds().length,
    vercel: { ambiente: process.env.VERCEL_ENV ?? 'local', commit: (process.env.VERCEL_GIT_COMMIT_SHA ?? '').slice(0, 7) || null, regiao: process.env.VERCEL_REGION ?? null },
    node: process.version,
  };
}
