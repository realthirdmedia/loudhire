/** Parse day/month/year without relying on the browser's locale or Date.parse. */
export function parseBritishDate(value: string): string | null {
  const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const d = Number(day), m = Number(month), y = Number(year);
  if (y < 1000 || m < 1 || m > 12 || d < 1) return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export function formatBritishDate(iso: string): string {
  const parts = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return parts ? `${parts[3]}/${parts[2]}/${parts[1]}` : iso;
}
