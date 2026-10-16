import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = (await readFile(new URL('../src/lib/currentRms.ts', import.meta.url), 'utf8')).replaceAll('import.meta.env', '{}');
const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { rentalPriceGuides } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const weekly = (day) => ({ name: 'Weekly test', config: { charging_periods: day === undefined ? {} : { day, week: '100' } }, rate_engine: { rate_engine: { lead_charge_period: 'week', config: { charging_engine_class: 'WeekChargingEngine1' } } } });
for (const [percent, expected] of [['40', 40], ['50', 50], ['75', 75], ['33.333333333', 33.33]]) {
  assert.deepEqual(rentalPriceGuides(100, weekly(percent)), { dayPrice: expected, weekPrice: 100 });
}
assert.deepEqual(rentalPriceGuides(190, weekly('33.333333333')), { dayPrice: 63.33, weekPrice: 190 });
assert.deepEqual(rentalPriceGuides(3.5, weekly('75')), { dayPrice: 2.63, weekPrice: 3.5 });
assert.deepEqual(rentalPriceGuides(70, weekly()), { dayPrice: null, weekPrice: 70 }, 'Weekly-only must not invent a daily price');
const stage = { name: 'Multiplier test', config: { options: { days_in_week: '7' }, multipliers: ['1', '1.5', '1.7'], factors: [{ from: '1', to: '', factor: '1' }] }, rate_engine: { rate_engine: { config: { charging_engine_class: 'DayChargingEngine2' } } } };
assert.deepEqual(rentalPriceGuides(3500, stage), { dayPrice: 3500, weekPrice: 5950 }, 'Stage base is a daily multiplier base, not its weekly price');
const discount = structuredClone(stage);
discount.config.factors = [{ from: '1', to: '3', factor: '1' }, { from: '4', to: '', factor: '0.9' }];
assert.deepEqual(rentalPriceGuides(100, discount), { dayPrice: 100, weekPrice: 153 }, 'Duration-specific factors must be respected');
const invalid = structuredClone(stage);
invalid.config.multipliers = ['bad'];
assert.deepEqual(rentalPriceGuides(100, invalid), { dayPrice: null, weekPrice: null });
assert.deepEqual(rentalPriceGuides(null, stage), { dayPrice: null, weekPrice: null });
assert.deepEqual(rentalPriceGuides(0, stage), { dayPrice: 0, weekPrice: 0 });
assert.deepEqual(rentalPriceGuides(100, undefined), { dayPrice: null, weekPrice: null });
console.log('Rental rates passed: category percentages, rounding, weekly-only, daily multipliers, factors and missing data.');
