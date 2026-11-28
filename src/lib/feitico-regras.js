// Regras puras do feitiço escrito no site (servem ao servidor e ao navegador; sem banco).
/** Iguais aos do modal do /feitiço (o bot manda os dele em `escrita.limites`). */
export const LIMITES = { nome: 60, efeitoMin: 40, efeito: 1500, encantamento: 200, duracao: 80, alcance: 80 };
/** A Vercel aceita até 4,5 MB por pedido; a imagem fica abaixo disso com folga. */
export const MAX_IMAGEM = 3 * 1024 * 1024;
/** Pedidos por conta a cada 24 h (o Grimório é o limite de verdade; isto só segura abuso). */
export const POR_DIA = 6;

/**
 * @typedef {{ pode: boolean, motivo: string | null, estagio: number, nivel: { alcance: number, destroi: string, temperatura: string, cura: string },
 *   grimorio: string, costurado: boolean, espacos: number, ocupados: number, livres: number,
 *   tipos: { nome: string, texto: string, liberado: boolean, exige: string[] | null }[],
 *   funcoes: { nome: string, grupo: string, liberado: boolean, exige: string[] | null }[],
 *   custo: { base: number, gerais: [string, number][], porTipo: Record<string, [string, number][]>, porFuncao: Record<string, [string, number][]>, max: number, instabilidade: boolean },
 *   analise: { nome: string, threadId: string | null }[], recusados: { nome: string, motivo: string | null }[], limites?: typeof LIMITES }} Escrita
 */

export const txt = (v, max) => (typeof v === 'string' ? v.replace(/\r\n/g, '\n').trim().slice(0, max) : '');

/** Tipo da imagem pelos primeiros bytes (nunca pela extensão). */
export function tipoImagem(b) {
  if (!b || b.length < 12) return null;
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg';
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return 'gif';
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'webp';
  return null;
}

/**
 * Custo de Mana no Estágio atual com os descontos (mesma soma do bot: tudo junto até o teto; Mago do Caos +10% depois).
 * @param {Escrita['custo']} c
 */
export function custoDe(c, tipo, funcoes) {
  if (!c) return null;
  const lista = [...(c.gerais ?? []), ...(c.porTipo?.[tipo] ?? [])];
  for (const fn of new Set(funcoes.filter(Boolean))) for (const d of c.porFuncao?.[fn] ?? []) if (!lista.some(([n]) => n === d[0])) lista.push(d);
  const desconto = Math.min(c.max ?? 50, lista.reduce((s, [, v]) => s + v, 0));
  let custo = c.base * (1 - desconto / 100);
  if (c.instabilidade) custo *= 1.1;
  return { base: c.base, custo: Math.max(1, Math.round(custo)), desconto, descontos: lista, instabilidade: Boolean(c.instabilidade) };
}

