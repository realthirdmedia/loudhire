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
