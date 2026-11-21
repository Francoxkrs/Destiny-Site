import { banco } from '../../../lib/db.js';
export const prerender = false;

// Imagens dos personagens: o bot guarda na coleção `assets`, endereçadas pelo sha256 do conteúdo.
// Como o endereço muda quando a imagem muda, a resposta pode ficar em cache para sempre.
export async function GET({ params }) {
  const hash = String(params.hash || '');
  if (!/^[a-f0-9]{64}$/.test(hash)) return new Response('Não encontrada', { status: 404 });
  const db = await banco().catch(() => null);
  if (!db) return new Response('Indisponível', { status: 503 });
  const a = await db.collection('assets').findOne({ hash }, { projection: { data: 1, contentType: 1 } });
  if (!a?.data) return new Response('Não encontrada', { status: 404 });
  const tipo = /^image\/(png|jpeg|webp|gif)$/.test(a.contentType || '') ? a.contentType : 'image/png';
  return new Response(a.data.buffer ?? a.data, { headers: { 'content-type': tipo, 'cache-control': 'public, max-age=31536000, immutable', 'x-content-type-options': 'nosniff' } });
}
