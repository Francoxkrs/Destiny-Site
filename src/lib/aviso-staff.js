// Aviso para a Staff no Discord quando uma compra de Cristais entra (opcional).
// DISCORD_WEBHOOK_COMPRAS = URL de um Webhook do canal de logs (Editar canal → Integrações → Webhooks).
// Sem ela, nada é enviado; a compra funciona igual.
const url = () => String(process.env.DISCORD_WEBHOOK_COMPRAS ?? import.meta.env?.DISCORD_WEBHOOK_COMPRAS ?? '').trim();

export async function avisarCompra(p, { saldo, primeira }, f = fetch) {
  const u = url();
  if (!/^https:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/api\/webhooks\//.test(u)) return;
  const valor = p.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const linhas = [
    `💎 <@${p.userId}> comprou **${p.nomePacote}** (${p.cp.toLocaleString('pt-BR')} CP) por ${valor} no site.`,
    `-# Mercado Pago \`${p.mpId ?? '?'}\` ・ saldo agora: ${saldo.toLocaleString('pt-BR')} CP`,
    primeira ? '🎁 **Primeira compra da conta**: a Classe de Mago à escolha já caiu na /bolsa. O Título "Patrono de Diamond" já está na aba Visual. Entreguem a Moldura Centelha Prismática.' : null,
  ].filter(Boolean);
  await f(u, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: 'Cristais Prismáticos', content: linhas.join('\n'), allowed_mentions: { parse: [] } }),
    signal: AbortSignal.timeout(5000),
  }).catch((e) => console.error('cristais (aviso Staff):', e?.message ?? e));
}

/** Estorno ou reembolso: os CP saíram da conta (o saldo pode ter ficado negativo). */
export async function avisarEstorno(p, { saldo, motivo }, f = fetch) {
  const u = url();
  if (!/^https:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/api\/webhooks\//.test(u)) return;
  const nome = motivo === 'charged_back' ? 'Estorno no cartão (chargeback)' : 'Reembolso';
  const linhas = [
    `⚠️ **${nome}**: <@${p.userId}> ・ ${p.nomePacote} (${p.cp.toLocaleString('pt-BR')} CP, ${p.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}).`,
    `-# Mercado Pago \`${p.mpId ?? '?'}\` ・ os CP saíram da conta ・ saldo agora: ${saldo.toLocaleString('pt-BR')} CP${saldo < 0 ? ' (negativo: já tinha gastado)' : ''}`,
  ];
  await f(u, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: 'Cristais Prismáticos', content: linhas.join('\n'), allowed_mentions: { parse: [] } }),
    signal: AbortSignal.timeout(5000),
  }).catch((e) => console.error('cristais (aviso Staff):', e?.message ?? e));
}

/** Altar: saiu um prêmio que a Staff entrega no Discord (o emote). Sem o webhook, só fica no log. */
export async function avisarAltarStaff(userId, nomes, f = fetch) {
  const u = url();
  if (!/^https:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/api\/webhooks\//.test(u)) { console.warn('altar (Staff entrega):', userId, nomes.join(', ')); return; }
  await f(u, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: 'Altar dos Vestígios', content: `🎴 <@${userId}> tirou no Altar: **${nomes.join('**, **')}**. Esse prêmio a Staff entrega no Discord.`, allowed_mentions: { parse: [] } }),
    signal: AbortSignal.timeout(5000),
  }).catch((e) => console.error('altar (aviso Staff):', e?.message ?? e));
}
