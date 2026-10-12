import type { APIRoute } from 'astro';
import { getRmsProductDetail } from '../../../lib/currentRms';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) return new Response(JSON.stringify({ error: 'Invalid product.' }), { status: 400 });
  try {
    const product = await getRmsProductDetail(id);
    return new Response(JSON.stringify({ product }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=120' },
    });
  } catch (error) {
    console.error('[quote-product]', error);
    return new Response(JSON.stringify({ error: 'This product is temporarily unavailable. Please try again.' }), {
      status: 503, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }
};
