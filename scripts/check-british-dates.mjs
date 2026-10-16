import assert from 'node:assert/strict';
import { parseBritishDate, formatBritishDate } from '../src/lib/dates.ts';

assert.equal(parseBritishDate('17/10/2026'), '2026-10-17');
assert.equal(parseBritishDate('01/02/2026'), '2026-02-01');
assert.equal(parseBritishDate('1/2/2026'), '2026-02-01');
assert.equal(parseBritishDate('29/02/2028'), '2028-02-29');
for (const invalid of ['10/17/2026', '31/04/2026', '29/02/2026', '00/10/2026', '17/00/2026', '17/10/26', '2026-10-17', '']) {
  assert.equal(parseBritishDate(invalid), null, invalid);
}
assert.equal(formatBritishDate('2026-10-17'), '17/10/2026');
assert.ok(parseBritishDate('31/01/2027') < parseBritishDate('01/02/2027'));
console.log('British date checks passed: unambiguous dates, leap years, invalid dates and chronological ordering.');
