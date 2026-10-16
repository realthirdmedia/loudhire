import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const env = { RESEND_API_KEY: 'test-only', ENQUIRY_TO: 'tom@loudhire.co.uk', ENQUIRY_FROM: 'website@notifications.loudhire.co.uk' };
const source = (await readFile(new URL('../src/pages/api/enquiry.ts', import.meta.url), 'utf8')).replaceAll('import.meta.env', JSON.stringify(env));
const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { POST } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const original = { fetch: globalThis.fetch, info: console.info, warn: console.warn, error: console.error };
const logs = [];
let sends = 0;
let providerStatus = 200;
let providerBody = { id: 'test-message-reference' };
globalThis.fetch = async (url, options) => {
  assert.equal(url, 'https://api.resend.com/emails');
  const email = JSON.parse(options.body);
  assert.deepEqual(email.to, ['tom@loudhire.co.uk']);
  assert.equal(email.from, 'Loud Hire website <website@notifications.loudhire.co.uk>');
  assert.equal(email.reply_to, 'customer@example.com');
  sends++;
  return new Response(JSON.stringify(providerBody), { status: providerStatus });
};
console.info = console.warn = console.error = (...args) => logs.push(args);
const submit = (fields = {}) => POST({
  request: new Request('https://www.loudhire.co.uk/api/enquiry/', {
    method: 'POST', headers: { Accept: 'application/json' },
    body: new URLSearchParams({ name: 'Private test name', email: 'customer@example.com', message: 'Private test message', ...fields }),
  }),
  clientAddress: 'test-client',
});
try {
  assert.equal((await submit()).status, 200);
  assert.equal(sends, 1);
  assert.ok(JSON.stringify(logs).includes('test-message-reference'));
  assert.equal((await submit({ website: 'autofilled.example' })).status, 422);
  assert.equal(sends, 1, 'Blocked forms must not send email or claim success');
  providerStatus = 403;
  assert.equal((await submit()).status, 502);
  providerStatus = 200;
  providerBody = {};
  assert.equal((await submit()).status, 502, 'Success requires a provider message reference');
  assert.ok(!JSON.stringify(logs).includes('Private test'));
  assert.ok(!JSON.stringify(logs).includes('customer@example.com'));
} finally {
  globalThis.fetch = original.fetch;
  console.info = original.info;
  console.warn = original.warn;
  console.error = original.error;
}
console.log('Enquiry delivery checks passed: receipt, recipient, failures and spam-check response.');
