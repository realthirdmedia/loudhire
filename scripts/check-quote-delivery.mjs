import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// Exercise the real handlers with provider responses matching the live failures.
const env = { CURRENT_RMS_API_KEY: 'test-only', CURRENT_RMS_OWNER_ID: '1', ENQUIRY_TO: 'tom@loudhire.co.uk' };
const compile = async (file, imports = {}) => {
  let source = await readFile(new URL(file, import.meta.url), 'utf8');
  source = source.replaceAll('import.meta.env', JSON.stringify(env));
  for (const [path, url] of Object.entries(imports)) source = source.replaceAll(`'${path}'`, `'${url}'`);
  const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
  return `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
};
const rmsUrl = await compile('../src/lib/currentRms.ts');
const packagesUrl = await compile('../src/lib/quotePackages.ts');
const { POST } = await import(await compile('../src/pages/api/quote-request.ts', {
  '../../lib/currentRms': rmsUrl, '../../lib/quotePackages': packagesUrl,
}));
const { createMember } = await import(rmsUrl);
const realFetch = globalThis.fetch;
const realError = console.error;
const realWarn = console.warn;
const logs = [];
let rmsFails = false;
let emailFails = true;
let checkouts = 0;
let members = 0;
let notifications = 0;
const response = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
globalThis.fetch = async (input, init = {}) => {
  const url = new URL(input);
  const body = init.body ? JSON.parse(init.body) : null;
  if (url.hostname === 'formsubmit.co') {
    notifications++;
    assert.equal(url.pathname, '/ajax/tom@loudhire.co.uk');
    return response({ success: !emailFails }, emailFails ? 403 : 200);
  }
  assert.equal(url.hostname, 'api.current-rms.com');
  if (url.pathname.endsWith('/rate_definitions')) return response({ rate_definitions: [] });
  if (url.pathname.endsWith('/products')) return response({ products: [{ id: 269, name: 'Test plug', active: true }] });
  if (url.pathname.endsWith('/members') && !body) return response({ members: [] });
  if (url.pathname.endsWith('/members')) {
    if (rmsFails) return response({ errors: { 'membership.owned_by': ["can't be blank"], name: ['Private customer value must not be logged'] } }, 422);
    if (body.member.membership_type === 'Organisation') assert.equal(body.member.membership.owned_by, 1, 'Organisation owner is required by the RMS account');
    else assert.deepEqual(body.member.membership, {});
    return response({ member: { id: ++members } });
  }
  if (url.pathname.endsWith('/opportunities/checkout')) {
    checkouts++;
    assert.equal(body.opportunity.state, 1, 'Quote requests remain drafts');
    assert.equal(body.opportunity.owned_by, 1);
    assert.equal(body.items.length, 1);
    assert.equal(body.items[0].item_id, 269);
    assert.equal(body.items[0].quantity, 1);
    return response({ opportunity: { id: 1953 } });
  }
  throw new Error(`Unexpected provider request ${url.pathname}`);
};
console.error = (...args) => logs.push(args.map(String).join(' '));
console.warn = (...args) => logs.push(args.map(String).join(' '));
const submit = async (ip) => POST({ clientAddress: ip, request: new Request('https://example.com/api/quote-request/', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
    lines: [{ type: 'product', id: 269, quantity: 1 }],
    periods: [{ start: '2026-10-21', end: '2026-10-21', venue: 'Test venue' }],
    organisation: 'Test organisation', name: 'Test contact', email: 'test@example.invalid', phone: '0117 214 1470', address: 'Test address', notes: '',
  }),
}) });
try {
  let result = await submit('test-rms-success');
  assert.equal(result.status, 200, 'RMS receipt must succeed even when email is unavailable');
  assert.equal((await result.json()).ok, true);
  assert.equal(checkouts, 1);
  assert.equal(notifications, 1);
  rmsFails = true;
  result = await submit('test-both-fail');
  assert.equal(result.status, 502, 'Never claim receipt if both providers fail');
  emailFails = false;
  result = await submit('test-email-success');
  assert.equal(result.status, 200, 'Email remains a valid fallback');
  await assert.rejects(createMember({ name: 'Test', membership_type: 'Organisation' }), /validation fields: membership.owned_by, name/);
  assert(!logs.join('\n').includes('Private customer value'), 'Validation logging must omit customer values');
} finally {
  globalThis.fetch = realFetch;
  console.error = realError;
  console.warn = realWarn;
}
console.log('Quote delivery checks passed: RMS owner, single-item draft, provider failover, failure honesty and private error logging.');
