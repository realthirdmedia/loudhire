import type { APIRoute } from 'astro';
import { getRmsProducts } from '../../lib/currentRms';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const products = await getRmsProducts();
    return new Response(JSON.stringify({ products }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
    });
  } catch (error) {
    console.error('[quote-products]', error);
    return new Response(JSON.stringify({ error: 'The live equipment list is temporarily unavailable.' }), {
      status: 503, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }
};
