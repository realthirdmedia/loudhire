import type { ImageMetadata } from 'astro';
import equipmentJson from '../data/equipment.json';
import categoriesJson from '../data/equipment-categories.json';

export interface EquipmentItem {
  slug: string;
  name: string;
  section: string;
  category: string;
  categories: string[];
  categorySlug: string;
  pricePerDay: number | null;
  description: string;
  image: string | null;
  oldUrl: string;
}

export interface EquipmentCategory {
  slug: string;
  name: string;
  section: string;
  count: number;
}

export const SECTIONS: { key: string; name: string; blurb: string }[] = [
  { key: 'sound', name: 'Sound', blurb: 'Loudspeakers, subwoofers, amplifiers, mixers, microphones and wireless.' },
  { key: 'lighting', name: 'Lighting', blurb: 'Stage fixtures, effects, followspots, control, dimming and outdoor lighting.' },
  { key: 'staging', name: 'Staging', blurb: 'Litedeck, stage roofs, truss, hoists, stands and rigging hardware.' },
  { key: 'video', name: 'Video', blurb: 'LED wall, displays, projection and screens.' },
  { key: 'power', name: 'Power', blurb: 'Generators, distribution, mains cabling and battery power.' },
  { key: 'accessories', name: 'Accessories', blurb: 'Speaker, microphone and control cabling, DMX, networking and antenna distribution.' },
];

export const sectionName = (key: string) => SECTIONS.find((s) => s.key === key)?.name ?? key;

const images = import.meta.glob<{ default: ImageMetadata }>('../assets/equipment/*.jpg', { eager: true });

export function equipmentImage(item: EquipmentItem): ImageMetadata | undefined {
  if (!item.image) return undefined;
  return images[`../assets/equipment/${item.image}`]?.default;
}

const sectionOrder = Object.fromEntries(SECTIONS.map((s, i) => [s.key, i]));

export const equipment: EquipmentItem[] = (equipmentJson as EquipmentItem[]).slice().sort((a, b) => {
  const s = (sectionOrder[a.section] ?? 99) - (sectionOrder[b.section] ?? 99);
  if (s !== 0) return s;
  const c = a.category.localeCompare(b.category);
  if (c !== 0) return c;
  return a.name.localeCompare(b.name, 'en', { numeric: true });
});

export const categories: EquipmentCategory[] = (categoriesJson as EquipmentCategory[])
  .map((c) => {
    // Derive the section from the majority of its items rather than the first one.
    const items = equipment.filter((i) => i.categorySlug === c.slug);
    const tally: Record<string, number> = {};
    for (const i of items) tally[i.section] = (tally[i.section] || 0) + 1;
    const section = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? c.section;
    return { ...c, section, count: items.length, name: c.name.replace(/ - /g, ': ') };
  })
  .sort((a, b) => (sectionOrder[a.section] ?? 99) - (sectionOrder[b.section] ?? 99) || a.name.localeCompare(b.name));

export function itemsInSection(section: string) {
  return equipment.filter((i) => i.section === section);
}

export function itemsInCategory(categorySlug: string) {
  return equipment.filter((i) => i.categorySlug === categorySlug);
}

export const itemUrl = (item: EquipmentItem) => `/dry-hire/equipment/${item.slug}/`;
export const categoryUrl = (c: { slug: string }) => `/dry-hire/equipment/category/${c.slug}/`;

export function formatPrice(item: EquipmentItem) {
  if (item.pricePerDay === null) return 'Price on enquiry';
  const value = Number.isInteger(item.pricePerDay) ? item.pricePerDay.toString() : item.pricePerDay.toFixed(2);
  return `£${value}/day + VAT`;
}

export const enquireUrl = (item: EquipmentItem) => `/quote/?search=${encodeURIComponent(item.name)}#equipment`;
