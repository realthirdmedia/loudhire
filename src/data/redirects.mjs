/**
 * Permanent redirects from the old WordPress site to the new structure.
 * Keys are old paths (no trailing slash), values are new paths.
 * Used by scripts/build-vercel-json.mjs (edge redirects in vercel.json) and by
 * src/pages/[...legacy].astro (server-side fallback for anything else).
 * Product URLs (/product/<slug>/) are generated from src/data/equipment.json.
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const equipment = require('./equipment.json');

const NP = '/news-and-projects';
const EQ = '/dry-hire/equipment';

/** @type {Record<string, string>} */
export const pageRedirects = {
  // Pages
  '/home': '/',
  '/sample-page': '/',
  '/sample-page-2': '/',
  '/bristol-pa-hire': '/event-production/sound/',
  '/bristol-pa-hire/equipment-lease': '/dry-hire/#lease',
  '/bristol-pa-hire/events-in-bristol': `${NP}/projects/`,
  '/broadcast': '/event-production/video/',
  '/live-events': '/event-production/festivals/',
  '/live-events-2': '/event-production/festivals/',
  '/production-services': '/event-production/',
  '/production-services/corporate-event-management': '/event-production/corporate-events/',
  '/production-services/festivals': '/event-production/festivals/',
  '/production-services/parties': '/event-production/private-events/',
  '/production-services/performing-arts': '/event-production/performing-arts/',
  '/production-services/production-packages': '/event-production/',
  '/production-services/public-announcement-horn-speakers': `${NP}/public-announcement-horn-speakers/`,
  '/corporate': '/event-production/corporate-events/',
  '/sound': '/event-production/sound/',
  '/event-sound-design': '/event-production/sound/',
  '/bristol-lighting-hire': '/event-production/lighting/',
  '/bristol-lighting-hire/bristol-event-lighting-projects': `${NP}/service/lighting/`,
  '/staging': '/event-production/staging/',
  '/theatre-lighting-hire': `${NP}/theatre-lighting-and-sound-hire/`,
  '/martin-audio-hire-bristol': `${NP}/martin-audio-line-array/`,
  '/great-sound-without-feedback': `${NP}/great-sound-without-feedback/`,
  '/case-studies': `${NP}/projects/`,
  '/portfolio': `${NP}/projects/`,
  '/news/portfolio': `${NP}/projects/`,
  '/news': `${NP}/`,
  '/feed': `${NP}/`,
  '/news/feed': `${NP}/`,
  '/author/admin': `${NP}/`,
  '/contact-us': '/contact/',
  '/thank_you': '/thank-you/',
  '/privacy-policy-2': '/privacy-policy/',

  // Shop / equipment rental
  '/equipment-rental': '/dry-hire/',
  '/equipment-rental/sound': '/dry-hire/#sound',
  '/equipment-rental/lighting': '/dry-hire/#lighting',
  '/equipment-rental/effects': '/dry-hire/#lighting',
  '/equipment-rental/staging': '/dry-hire/#staging',
  '/equipment-rental/video': '/dry-hire/#video',
  '/equipment-rental/power': '/dry-hire/#power',
  '/equipment-rental/cable-rental': '/dry-hire/#accessories',
  '/equipment-rental/party-packages': '/dry-hire/#packages',
  '/dry-hire-explorer': '/dry-hire/',
  '/ex-hire-equipment': '/dry-hire/',
  '/store': `${EQ}/`,
  '/shop': `${EQ}/`,
  '/cart': '/dry-hire/',
  '/checkout': '/dry-hire/',
  '/my-account': '/dry-hire/',

  // Product categories (WooCommerce, nested)
  '/product-category/sound': `${EQ}/#sound`,
  '/product-category/lighting': `${EQ}/#lighting`,
  '/product-category/cable': `${EQ}/#accessories`,
  '/product-category/staging-hardware': `${EQ}/#staging`,
  '/product-category/uncategorized': `${EQ}/`,
  '/product-category/sound/dj-decks-players': `${EQ}/#sound`,
  '/product-category/staging-hardware/drapes-curtains': `${EQ}/#staging`,
  '/product-category/power': `${EQ}/category/power/`,
  '/product-category/staging': `${EQ}/category/staging/`,
  '/product-category/video': `${EQ}/category/video/`,
  '/product-category/effects': `${EQ}/category/effects/`,
  '/product-category/packages': `${EQ}/category/packages/`,
  '/product-category/accessory': `${EQ}/category/accessory/`,
  '/product-category/computing-networkingcomms': `${EQ}/category/computing-networkingcomms/`,
  '/product-category/stage-roof': `${EQ}/category/stage-roof/`,
  '/product-category/sound/amplifiers': `${EQ}/category/amplifiers/`,
  '/product-category/sound/audio': `${EQ}/category/audio/`,
  '/product-category/sound/microphones': `${EQ}/category/microphones/`,
  '/product-category/sound/mixers': `${EQ}/category/mixers/`,
  '/product-category/sound/speakers': `${EQ}/category/speakers/`,
  '/product-category/lighting/dimmers-data': `${EQ}/category/dimmers-data/`,
  '/product-category/lighting/lighting-effects': `${EQ}/category/lighting-effects/`,
  '/product-category/lighting/outdoor-lighting': `${EQ}/category/outdoor-lighting/`,
  '/product-category/lighting/stage-lighting': `${EQ}/category/stage-lighting/`,
  '/product-category/cable/cable-mains-power': `${EQ}/category/cable-mains-power/`,
  '/product-category/cable/cable-speaker-microphone-control': `${EQ}/category/cable-speaker-microphone-control/`,
  '/product-category/staging-hardware/rigging': `${EQ}/category/rigging/`,

  // News posts
  '/news/led-video-wall-hire': `${NP}/led-video-wall-hire/`,
  '/news/konligo-fastival-hire': `${NP}/konligo-fastival-stage-roof/`,
  '/news/pa-system-hire-2024': `${NP}/2023-in-review/`,
  '/news/bristol-wireless-microphone-hire': `${NP}/wireless-microphone-hire/`,
  '/news/danley-sound-labs-pa-investments-for-2023': `${NP}/danley-sound-labs-pa/`,
  '/news/allen-and-heath-sq-digital-mixers-added-to-hire': `${NP}/allen-and-heath-sq-mixers/`,
  '/news/sennheiser-ew-d-radio-microphones-added-to-hire': `${NP}/sennheiser-ew-d-radio-microphones/`,
  '/news/loud-hire-get-new-website': `${NP}/`,
  '/news/2022-review-loud-hire-bristol': `${NP}/2022-review/`,
  '/news/big-screen-coming-soon': `${NP}/led-video-wall-hire/`,
  '/news/covid-19-statement': `${NP}/`,
  '/news/theatre-lighting-hire-2': `${NP}/theatre-lighting-and-sound-hire/`,
  '/news/theatre-lighting-hire': `${NP}/theatre-lighting-and-sound-hire/`,
  '/news/stage-lighting-investments-for-2019': `${NP}/stage-lighting-investments-2019/`,
  '/news/digital-amplifier-technology': `${NP}/digital-amplifier-technology/`,
  '/news/new-elumen8-alu-hex-par-64-led-stage-lighting': `${NP}/elumen8-alu-hex-par-64/`,
  '/news/2018-event-hire': `${NP}/2018-event-hire/`,
  '/news/martin-audio-hire-bristol': `${NP}/martin-audio-line-array/`,
  '/news/1141-2': `${NP}/public-announcement-horn-speakers/`,
  '/news/great-sound-without-feedback': `${NP}/great-sound-without-feedback/`,

  // News categories
  '/news/category/video': `${NP}/service/video/`,
  '/news/category/staging': `${NP}/service/staging/`,
  '/news/category/pa-systems': `${NP}/service/sound/`,
  '/news/category/pa-systems/microphone-hire': `${NP}/service/sound/`,
  '/news/category/pa-systems/sound-mixers': `${NP}/service/sound/`,
  '/news/category/stage-lighting': `${NP}/service/lighting/`,
  '/news/category/equipment-hire': `${NP}/news/`,
  '/news/category/news': `${NP}/news/`,
  '/news/category/bristol': `${NP}/`,
  '/news/category/uncategorized': `${NP}/`,
  '/news/category/allgemein': `${NP}/`,
  '/news/category/personal': `${NP}/`,

  // Portfolio (case studies)
  '/news/portfolio/british-airways-summer-fly-in-event': `${NP}/british-airways-summer-fly-in/`,
  '/news/portfolio/hawkstone-tv-launch': `${NP}/hawkstone-advert-launch/`,
  '/news/portfolio/video-wall-for-stretch-tent': `${NP}/video-wall-for-stretch-tent/`,
  '/news/portfolio/downend-fireworks-lighting': `${NP}/downend-fireworks-lighting/`,
  '/news/portfolio/tall-ships': `${NP}/gloucester-tall-ships-festival/`,
  '/portfolio/eats-everything': `${NP}/eats-everything-hot-air-balloon/`,
  '/portfolio/the-wurzels': `${NP}/the-wurzels-bath-racecourse/`,
  '/portfolio/shield-group': `${NP}/shield-group-corporate-festival/`,
  '/portfolio/gorgon-city-2': `${NP}/gorgon-city-private-party/`,
  '/portfolio/festival-birthday-party': `${NP}/festival-birthday-party-herefordshire/`,
  '/portfolio/proms-in-park': `${NP}/proms-in-the-park-speech-house/`,
  '/portfolio/tipi-wedding': `${NP}/festival-style-tipi-wedding/`,
  '/portfolio/mount-without-bristol': `${NP}/shakespeare-at-the-mount-without/`,
  '/portfolio/aerospace-bristols-5th-anniversary': `${NP}/aerospace-bristol-5th-anniversary/`,
  '/portfolio/christmas-concert-ilford-london': `${NP}/christmas-concert-ilford/`,
  '/portfolio/santas-float': `${NP}/santas-float-bristol/`,
  '/portfolio/the-queens-jubilee': `${NP}/ilford-queens-jubilee/`,

  // Old XML sitemaps (Yoast)
  '/sitemap_index.xml': '/sitemap-index.xml',
  '/sitemap.xml': '/sitemap-index.xml',
  '/post-sitemap.xml': '/sitemap-index.xml',
  '/page-sitemap.xml': '/sitemap-index.xml',
  '/product-sitemap.xml': '/sitemap-index.xml',
  '/portfolio-sitemap.xml': '/sitemap-index.xml',
  '/category-sitemap.xml': '/sitemap-index.xml',
  '/product_cat-sitemap.xml': '/sitemap-index.xml',
  '/pa_hire-duration-sitemap.xml': '/sitemap-index.xml',
  '/author-sitemap.xml': '/sitemap-index.xml',
};

/** Every old /product/<slug>/ URL maps to its equipment page. */
export const productRedirects = Object.fromEntries(
  equipment.map((item) => [item.oldUrl.replace(/\/$/, ''), `/dry-hire/equipment/${item.slug}/`]),
);

/** Catch-alls for archives, tags and pagination (mirrored in vercel.json). */
export const patternRedirects = {
  '/news/page/[...rest]': `${NP}/`,
  '/case-studies/page/[...rest]': `${NP}/projects/`,
  '/product-tag/[...rest]': `${EQ}/`,
  '/product_brand/[...rest]': `${EQ}/`,
  '/pa_hire-duration/[...rest]': '/dry-hire/',
  '/product-category/[...rest]': `${EQ}/`,
  '/product/[...rest]': `${EQ}/`,
  '/portfolio/[...rest]': `${NP}/projects/`,
  '/news/portfolio/[...rest]': `${NP}/projects/`,
  '/news/category/[...rest]': `${NP}/`,
  '/news/[...rest]': `${NP}/`,
  '/author/[...rest]': `${NP}/`,
};

/** All exact redirects, old path -> new path. */
export function exactRedirects() {
  return { ...productRedirects, ...pageRedirects };
}

/**
 * Comparable form of a path: no trailing slash, percent-encoding decoded
 * (old product URLs contain characters like ² and ½), lower case.
 */
function normalise(pathname) {
  let p = pathname.replace(/\/+$/, '') || '/';
  try {
    p = decodeURIComponent(p);
  } catch {
    // leave malformed encodings as they are
  }
  return p.toLowerCase();
}

let exactCache = null;
function normalisedExact() {
  if (!exactCache) {
    exactCache = {};
    for (const [from, to] of Object.entries(exactRedirects())) exactCache[normalise(from)] = to;
  }
  return exactCache;
}

/**
 * Resolve an incoming pathname to a redirect destination, or null.
 * Exact matches first, then the longest matching catch-all prefix.
 */
export function resolveRedirect(pathname) {
  const clean = normalise(pathname);
  const exact = normalisedExact();
  if (exact[clean]) return exact[clean];
  let best = null;
  for (const [pattern, dest] of Object.entries(patternRedirects)) {
    const prefix = pattern.replace('[...rest]', '');
    if ((clean + '/').startsWith(prefix) && (!best || prefix.length > best.prefix.length)) best = { prefix, dest };
  }
  return best ? best.dest : null;
}
