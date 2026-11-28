// Escrever feitiço pelo site: validação do pedido, custo e tipo da imagem (sem banco). npm run feitico:teste
import { validarPedido } from '../src/lib/feitico.js';
import { custoDe, tipoImagem } from '../src/lib/feitico-regras.js';
import { fichaExemplo } from '../src/lib/ficha.js';

let ok = 0, falhas = 0;
const caso = (nome, fn) => { try { fn(); ok++; } catch (e) { falhas++; console.error(`✗ ${nome}: ${e.message}`); } };
const igual = (a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
const e = fichaExemplo.escrita;
const base = { nome: ' Lança ', tipo: 'Externalizado', funcao: 'Ataque', efeito: 'x'.repeat(60) };

caso('pedido bom passa e apara', () => { const r = validarPedido(base, e); igual([r.erro, r.dados.nome, r.dados.funcao2], [undefined, 'Lança', null]); });
caso('sem escrita na ficha', () => igual(Boolean(validarPedido(base, undefined).erro), true));
caso('Grimório fechado', () => igual(validarPedido(base, { ...e, pode: false, motivo: 'cheio' }).erro, 'cheio'));
caso('Tipo trancado', () => igual(/exige/.test(validarPedido({ ...base, tipo: 'Conjuração' }, e).erro), true));
caso('Função trancada', () => igual(/Maldição exige/.test(validarPedido({ ...base, funcao: 'Maldição' }, e).erro), true));
caso('Função inventada', () => igual(Boolean(validarPedido({ ...base, funcao: 'Explosão' }, e).erro), true));
caso('duas Funções sem Costurado', () => igual(/Costurado/.test(validarPedido({ ...base, funcao2: 'Defesa' }, e).erro), true));
caso('duas Funções iguais no Costurado', () => igual(/diferentes/.test(validarPedido({ ...base, funcao2: 'Ataque' }, { ...e, costurado: true }).erro), true));
caso('efeito curto', () => igual(/40/.test(validarPedido({ ...base, efeito: 'curto' }, e).erro), true));
caso('efeito longo é cortado', () => igual(validarPedido({ ...base, efeito: 'y'.repeat(3000) }, e).dados.efeito.length, 1500));
caso('custo: geral + tipo + função, teto 50', () => {
  const c = { base: 100, gerais: [['Elfos', 50]], porTipo: { Externalizado: [['Fluxo', 10]] }, porFuncao: {}, max: 50, instabilidade: false };
  igual(custoDe(c, 'Externalizado', ['Ataque']).custo, 50);
  igual(custoDe({ ...c, gerais: [['Controle', 5]] }, 'Externalizado', ['Ataque']).custo, 85);
  igual(custoDe({ ...c, gerais: [], instabilidade: true }, 'Criação', ['Ataque']).custo, 110);
});
caso('custo do exemplo (110, Controle 5%)', () => igual(custoDe(e.custo, 'Externalizado', ['Ataque']).custo, 105));
caso('imagem pelos bytes', () => {
  igual(tipoImagem(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0, 0, 0, 0, 0])), 'png');
  igual(tipoImagem(Uint8Array.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0, 0, 0, 0, 0, 0])), 'gif');
  igual(tipoImagem(Uint8Array.from([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50])), 'webp');
  igual(tipoImagem(new TextEncoder().encode('<svg onload=alert(1)>')), null);
});
console.log(`${ok} ok, ${falhas} falha(s)`);
if (falhas) process.exit(1);
