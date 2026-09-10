/**
 * Generates vercel.json: security/caching headers plus 301 redirects for every
 * old WordPress URL (src/data/redirects.mjs). Run with `npm run vercel-json`
 * after editing the redirect map. Sources use Vercel's path-to-regexp matching,
 * so both `/old` and `/old/` are redirected.
 */
import { writeFileSync } from 'node:fs';
import { exactRedirects, patternRedirects } from '../src/data/redirects.mjs';

const redirects = [];
for (const [source, destination] of Object.entries(exactRedirects())) {
  redirects.push({ source, destination, permanent: true });
}
for (const [pattern, destination] of Object.entries(patternRedirects)) {
  redirects.push({ source: pattern.replace('[...rest]', ':rest*'), destination, permanent: true });
}

const config = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  trailingSlash: true,
  headers: [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
    {
      source: '/images/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
    },
  ],
  redirects,
};

writeFileSync(new URL('../vercel.json', import.meta.url), JSON.stringify(config, null, 2) + '\n');
console.log(`vercel.json written with ${redirects.length} redirects`);
