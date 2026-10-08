/** Server-only Current RMS access. Never import this module into an Astro client script. */
const API_ROOT = 'https://api.current-rms.com/api/v1';
const SUBDOMAIN = 'loudhire';

export interface RmsProduct {
  id: number;
  name: string;
  description: string;
  group: string;
  image: string | null;
  price: number | null;
  rateName: string | null;
  rateDefinitionId: number | null;
}

type RawProduct = Record<string, any>;
let productCache: { expires: number; products: RmsProduct[] } | null = null;

export function hasRmsKey() {
  return Boolean(import.meta.env.CURRENT_RMS_API_KEY);
}

export async function rmsRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const key = import.meta.env.CURRENT_RMS_API_KEY;
  if (!key) throw new Error('CURRENT_RMS_API_KEY is not configured');
  const response = await fetch(`${API_ROOT}${path}`, {
    ...init,
    headers: {
      'X-SUBDOMAIN': SUBDOMAIN,
      'X-AUTH-TOKEN': key,
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
    signal: init.signal ?? AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    // Avoid logging the request body or any customer data.
    throw new Error(`Current RMS ${init.method ?? 'GET'} ${path.split('?')[0]} returned ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function money(value: unknown): number | null {
  const parsed = Number(value);
  return value === null || value === undefined || value === '' || !Number.isFinite(parsed) ? null : parsed;
}

function normalizeProduct(raw: RawProduct): RmsProduct {
  const rate = raw.rental_rate && typeof raw.rental_rate === 'object' ? raw.rental_rate : {};
  const icon = raw.icon && typeof raw.icon === 'object' ? raw.icon : {};
  const image = typeof icon.url === 'string' && /^https:\/\//.test(icon.url) ? icon.url : null;
  return {
    id: Number(raw.id),
    name: String(raw.name ?? '').trim(),
    description: String(raw.description ?? '').replace(/<[^>]*>/g, ' ').trim().slice(0, 1200),
    group: String(raw.product_group?.name ?? 'Equipment').trim(),
    image,
    price: money(rate.price ?? rate.amount ?? rate.value ?? null),
    rateName: typeof rate.rate_definition_name === 'string' ? rate.rate_definition_name : null,
    rateDefinitionId: money(rate.rate_definition_id ?? raw.rate_definition_id),
  };
}

export async function getRmsProducts(): Promise<RmsProduct[]> {
  if (productCache && productCache.expires > Date.now()) return productCache.products;
  const products: RmsProduct[] = [];
  for (let page = 1; page <= 30; page++) {
    const params = new URLSearchParams({ page: String(page), per_page: '100', 'q[s][]': 'id asc' });
    const result = await rmsRequest<{ products?: RawProduct[]; meta?: { total_row_count?: number } }>(`/products?${params}`);
    const batch = result.products ?? [];
    products.push(...batch.filter((p) => p.active !== false && p.accessory_only !== true).map(normalizeProduct));
    if (batch.length < 100 || (result.meta?.total_row_count && page * 100 >= result.meta.total_row_count)) break;
  }
  const sorted = products.filter((p) => Number.isInteger(p.id) && p.name).sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name));
  productCache = { expires: Date.now() + 10 * 60_000, products: sorted };
  return sorted;
}

export async function findMemberByEmail(email: string): Promise<any | null> {
  const params = new URLSearchParams({ per_page: '100', 'q[emails_address_eq]': email });
  const result = await rmsRequest<{ members?: any[] }>(`/members?${params}`);
  return result.members?.find((m) => m.membership_type === 'Contact' && m.emails?.some((e: any) => String(e.address).toLowerCase() === email.toLowerCase())) ?? null;
}

export async function findOrganisation(name: string): Promise<any | null> {
  const params = new URLSearchParams({ per_page: '100', 'q[name_eq]': name });
  const result = await rmsRequest<{ members?: any[] }>(`/members?${params}`);
  return result.members?.find((m) => m.membership_type === 'Organisation' && String(m.name).toLowerCase() === name.toLowerCase()) ?? null;
}

export async function createMember(member: Record<string, unknown>) {
  const result = await rmsRequest<{ member: { id: number; addresses?: { id: number }[] } }>('/members', {
    method: 'POST', body: JSON.stringify({ member }),
  });
  return result.member;
}

export async function createProject(project: Record<string, unknown>) {
  const result = await rmsRequest<{ project: { id: number } }>('/projects', {
    method: 'POST', body: JSON.stringify({ project }),
  });
  return result.project;
}

export async function checkoutOpportunity(opportunity: Record<string, unknown>, items: Record<string, unknown>[]) {
  const result = await rmsRequest<{ opportunity: { id: number; number?: string } }>('/opportunities/checkout', {
    method: 'POST', body: JSON.stringify({ opportunity, items }),
  });
  return result.opportunity;
}
