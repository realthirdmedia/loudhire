import assert from 'node:assert/strict';
import { searchCatalog } from '../src/lib/catalogSearch.ts';

const product = (name, description = '', group = 'Equipment') => ({ name, description, group });
const cable = product('60m piano cable');
const exact = product('60m Roland piano cable');
const unrelated = product('Microphone stand');
const products = [unrelated, cable, product('6m piano cable'), exact];

assert.deepEqual(searchCatalog(products, '60m Roland piano cable'), [exact, cable]);
assert.deepEqual(searchCatalog([cable], 'cable piano 60 m'), [cable]);
assert.deepEqual(searchCatalog([exact], '60m rolanad piano cabel'), [exact]);
assert.deepEqual(searchCatalog([cable], '60m Roland piano cable wireless'), []);
assert.deepEqual(searchCatalog([unrelated], 'piano cable'), []);
assert.deepEqual(searchCatalog(products, '   '), products);
assert.deepEqual(searchCatalog([product('SQ6 mixer')], 'SQ5 mixer'), []);
const described = product('Stage kit', 'Includes a piano cable');
const named = product('Piano cable');
assert.deepEqual(searchCatalog([described, named], 'piano cable'), [named, described]);
const pack = product('RCF speaker package', '', 'Packages');
assert.deepEqual(searchCatalog([pack], 'package RCF speker'), [pack]);
assert.deepEqual(searchCatalog([product('D&B C7-TOP')], 'd&b c7 top'), [product('D&B C7-TOP')]);
console.log('Catalogue search checks passed: missing words, typos, ranking, packages, punctuation and specifications.');
