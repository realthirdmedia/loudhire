import { getCollection, type CollectionEntry } from 'astro:content';
import type { CapabilityKey } from '../data/site';

export type Entry = CollectionEntry<'newsAndProjects'>;

export const entryUrl = (entry: Entry) => `/news-and-projects/${entry.id}/`;

export const isProject = (entry: Entry) => entry.data.type === 'project' || entry.data.type === 'both';
export const isNews = (entry: Entry) => entry.data.type === 'news' || entry.data.type === 'both';

export const byDateDesc = (a: Entry, b: Entry) => b.data.date.getTime() - a.data.date.getTime();

/** All published entries, newest first. */
export async function getEntries(): Promise<Entry[]> {
  const all = await getCollection('newsAndProjects', ({ data }) => !data.draft);
  return all.sort(byDateDesc);
}

export async function getProjects(): Promise<Entry[]> {
  return (await getEntries()).filter(isProject);
}

export async function getNews(): Promise<Entry[]> {
  return (await getEntries()).filter(isNews);
}

/** Latest N entries from the combined collection, driven by publication date. */
export async function getLatest(n = 3): Promise<Entry[]> {
  return (await getEntries()).slice(0, n);
}

/** Projects tagged with a service, newest first. */
export async function getProjectsForService(service: CapabilityKey, limit?: number): Promise<Entry[]> {
  const list = (await getProjects()).filter((e) => e.data.services.includes(service));
  return typeof limit === 'number' ? list.slice(0, limit) : list;
}

/** Look up specific entries by id, preserving the requested order. Missing ids are skipped. */
export async function getEntriesByIds(ids: string[]): Promise<Entry[]> {
  const all = await getEntries();
  return ids.map((id) => all.find((e) => e.id === id)).filter((e): e is Entry => Boolean(e));
}

export function formatDate(date: Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...opts }).format(date);
}

export function typeLabel(entry: Entry) {
  return entry.data.type === 'news' ? 'News' : 'Project';
}
