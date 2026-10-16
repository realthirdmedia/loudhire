type SearchableProduct = { name: string; group: string; description: string };

const normalise = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/(\d)\s+(mm|cm|m|kw|w)\b/g, '$1$2').replace(/[^a-z0-9]+/g, ' ').trim();
const words = (value: string) => [...new Set(normalise(value).split(' ').filter(Boolean))];

function similarity(query: string, word: string): number {
  if (query === word) return 1;
  // Lengths and model numbers must not be mistaken for a different specification.
  if (/\d/.test(query) || /\d/.test(word)) return 0;
  if (query.length >= 3 && word.startsWith(query)) return 0.95;
  if (Math.min(query.length, word.length) < 4) return 0;
  const limit = Math.max(query.length, word.length);
  if (Math.abs(query.length - word.length) / limit > 0.3) return 0;
  let previous = Array.from({ length: word.length + 1 }, (_, i) => i);
  for (let i = 1; i <= query.length; i++) {
    const current = [i];
    for (let j = 1; j <= word.length; j++) {
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1,
        previous[j - 1] + (query[i - 1] === word[j - 1] ? 0 : 1));
    }
    previous = current;
  }
  const score = 1 - previous[word.length] / limit;
  return score >= 0.7 ? score : 0;
}

function coverage(query: string[], target: string[]): number {
  const matches = query.flatMap((term, q) => target.map((word, t) => ({ q, t, score: similarity(term, word) })))
    .filter((match) => match.score > 0).sort((a, b) => b.score - a.score);
  const usedQuery = new Set<number>();
  const usedTarget = new Set<number>();
  let total = 0;
  for (const match of matches) {
    if (usedQuery.has(match.q) || usedTarget.has(match.t)) continue;
    usedQuery.add(match.q); usedTarget.add(match.t); total += match.score;
  }
  return total / query.length;
}

/** Match at least 70% of the query, regardless of word order; favour product titles. */
export function searchCatalog<T extends SearchableProduct>(products: T[], search: string): T[] {
  const query = words(search);
  if (!query.length) return products;
  return products.map((product) => {
    const title = words(product.name);
    const all = words(`${product.name} ${product.group} ${product.description || ''}`);
    if (query.some((term) => /\d/.test(term) && !all.includes(term))) return { product, match: 0, rank: 0 };
    const match = coverage(query, all);
    const titleMatch = coverage(query, title);
    const exactTitle = normalise(product.name) === normalise(search);
    return { product, match, rank: match + titleMatch + (exactTitle ? 1 : 0) };
  }).filter(({ match }) => match >= 0.7)
    .sort((a, b) => b.rank - a.rank)
    .map(({ product }) => product);
}
