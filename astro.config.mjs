// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://www.loudhire.co.uk',
  trailingSlash: 'always',
  // Keep standard whitespace handling (Astro 7 defaults to JSX-style stripping).
  compressHTML: true,
  // Static site; only the enquiry endpoint (src/pages/api/enquiry.ts) is server-rendered.
  output: 'static',
  adapter: vercel(),
  image: {
    // Responsive images by default: every <Image> gets srcset + sizes.
    layout: 'constrained',
    responsiveStyles: true,
    objectFit: 'cover',
    objectPosition: 'center',
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/thank-you/') && !page.includes('/api/') && !page.includes('/404'),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  // Old WordPress URLs -> new pages: see vercel.json (generated from src/data/redirects.mjs
  // by scripts/build-vercel-json.mjs) and the SSR fallback in src/pages/[...legacy].astro.
});
