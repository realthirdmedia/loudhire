import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../src/components/Analytics.astro', import.meta.url), 'utf8');
const script = source.match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
function run(hostname = 'www.loudhire.co.uk', saved = null) {
  const listeners = {};
  const scripts = [];
  const buttons = ['denied', 'granted'].map(choice => ({ dataset: { analyticsChoice: choice }, addEventListener: (_, fn) => { listeners[choice] = fn; }, focus() {} }));
  const banner = { hidden: true, querySelectorAll: () => buttons, querySelector: () => buttons[0] };
  const settings = { hidden: true, addEventListener: (_, fn) => { listeners.settings = fn; } };
  const storage = new Map(saved ? [['loudhire-analytics-choice-v1', JSON.stringify(saved)]] : []);
  const context = {
    URL, URLSearchParams, Date, window: {},
    location: { hostname, origin: `https://${hostname}`, pathname: '/contact/', search: '?utm_source=test&email=private@example.com', reload() {} },
    localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    document: { referrer: 'https://example.com/page?email=private@example.com', cookie: '', getElementById: () => banner, querySelector: () => settings, createElement: () => ({}), head: { append: node => scripts.push(node) } },
  };
  vm.runInNewContext(script, context);
  return { ...context, scripts, listeners, banner };
}
let test = run();
assert.equal(test.scripts.length, 0, 'No tracking before a choice');
assert.equal(test.banner.hidden, false);
test.listeners.denied();
assert.equal(test.scripts.length, 0, 'Rejection must not load analytics');
test.listeners.settings();
test.listeners.granted();
assert.equal(test.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-0BRD96ZVY5');
const config = Array.from(test.window.dataLayer.find(event => event[0] === 'config'));
assert.equal(config[1], 'G-0BRD96ZVY5');
assert.equal(config[2].page_location, 'https://www.loudhire.co.uk/contact/?utm_source=test');
assert.equal(config[2].page_referrer, 'https://example.com/page');
test.listeners.granted();
assert.equal(test.scripts.length, 1, 'Do not initialise a second page view on repeat acceptance');
test.listeners.denied();
assert.equal(test.window['ga-disable-G-0BRD96ZVY5'], true);
assert.equal(run('www.loudhire.co.uk', { choice: 'granted', expires: Date.now() + 60000 }).scripts.length, 1);
assert.equal(run('www.loudhire.co.uk', { choice: 'denied', expires: Date.now() + 60000 }).scripts.length, 0);
assert.equal(run('loudhire-preview.vercel.app', { choice: 'granted', expires: Date.now() + 60000 }).scripts.length, 0);
console.log('Analytics checks passed: correct property, consent, repeat visits, query privacy, and preview exclusion.');
