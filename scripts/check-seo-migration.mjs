/** Check the old WordPress sitemap snapshot against the built site and 301 map. */
import { readFileSync, readdirSync } from 'node:fs';
import { resolveRedirect, exactRedirects } from '../src/data/redirects.mjs';

const old = JSON.parse(readFileSync(new URL('../docs/seo/legacy-urls.json', import.meta.url), 'utf8'));
const output = new URL('../.vercel/output/static/', import.meta.url);
const sitemapFiles = readdirSync(output).filter((name) => /^sitemap-\d+\.xml$/.test(name));
if (!sitemapFiles.length) throw new Error('Build the site before running check:seo');

const newPaths = new Set();
for (const name of sitemapFiles) {
  const xml = readFileSync(new URL(name, output), 'utf8');
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    newPaths.add(new URL(match[1]).pathname);
  }
}

const normalize = (path) => {
  let value = path.replace(/\/+$/, '') || '/';
  try { value = decodeURIComponent(value); } catch { /* keep malformed input */ }
  return value.toLowerCase();
};
const exact = new Map(Object.entries(exactRedirects()).map(([path, destination]) => [normalize(path), destination]));
const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const edge = new Map(config.redirects.filter((item) => !item.source.includes(':')).map(({ source, destination }) => [normalize(source), destination]));
const allowedNoindex = new Set(['/thank-you/']);
const failures = [];
let covered = 0;

for (const paths of Object.values(old)) {
  for (const oldPath of paths) {
    if (newPaths.has(oldPath)) { covered++; continue; }
    const key = normalize(oldPath);
    const destination = resolveRedirect(oldPath);
    if (!destination) { failures.push(`${oldPath}: no redirect`); continue; }
    if (!exact.has(key)) { failures.push(`${oldPath}: only a catch-all redirect`); continue; }
    if (edge.get(key) !== destination) { failures.push(`${oldPath}: vercel.json is out of sync`); continue; }
    const target = destination.split('#')[0];
    if (!newPaths.has(target) && !allowedNoindex.has(target)) {
      failures.push(`${oldPath}: destination ${target} is not a built page`);
      continue;
    }
    covered++;
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`SEO migration check passed: ${covered} legacy URLs covered; ${newPaths.size} indexable pages in sitemap.`);
}

// Crawl actual server-rendered links from the homepage. An XML sitemap alone
// does not prove that a visitor or crawler can discover a page through the site.
const htmlByPath = new Map();
const linksByPath = new Map();
for (const path of newPaths) {
  const file = new URL(`.${decodeURIComponent(path)}index.html`, output);
  const html = readFileSync(file, 'utf8');
  htmlByPath.set(path, html);
  const links = new Set();
  for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), `https://www.loudhire.co.uk${path}`);
    if (url.origin !== 'https://www.loudhire.co.uk') continue;
    links.add(url.pathname);
  }
  linksByPath.set(path, links);
  const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/i)?.[1] ?? '';
  if (!footer.includes('href="/site-map/"')) failures.push(`${path}: footer site-map link missing`);
  if (!html.includes('rel="canonical"')) failures.push(`${path}: canonical missing`);
  if (!html.includes('name="description"')) failures.push(`${path}: meta description missing`);
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  if (!schemas.length) failures.push(`${path}: structured data missing`);
  for (const schema of schemas) {
    try { JSON.parse(schema[1]); } catch { failures.push(`${path}: invalid JSON-LD`); }
  }
}
const reached = new Set(['/']);
const queue = ['/'];
for (let i = 0; i < queue.length; i++) {
  for (const path of linksByPath.get(queue[i]) ?? []) {
    if (newPaths.has(path) && !reached.has(path)) { reached.add(path); queue.push(path); }
  }
}
for (const path of newPaths) if (!reached.has(path)) failures.push(`${path}: orphaned page, no crawl path from home`);
for (const redirect of config.redirects) {
  if (redirect.statusCode !== 301) failures.push(`${redirect.source}: expected HTTP 301`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Crawl check passed: all ${reached.size} indexable pages reachable through HTML links; footer links, metadata and JSON-LD verified.`);
}
