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
  dayPrice: number | null;
  weekPrice: number | null;
  rateName: string | null;
  rateDefinitionId: number | null;
  isPackage: boolean;
  hasAccessories: boolean;
}

export interface RmsPackageComponent {
  id: number;
  productId: number;
  name: string;
  inclusion: 'mandatory' | 'default' | 'optional';
  mode: number;
  quantity: number;
  zeroPriced: boolean;
  price: number | null;
  dayPrice: number | null;
  weekPrice: number | null;
  rateDefinitionId: number | null;
}

export interface RmsProductDetail extends RmsProduct {
  components: RmsPackageComponent[];
}

type RawProduct = Record<string, any>;
let productCache: { expires: number; products: RmsProduct[] } | null = null;
let definitionCache: { expires: number; definitions: Map<number, RawProduct> } | null = null;
const detailCache = new Map<number, { expires: number; detail: RmsProductDetail }>();

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
    // Log validation field names, never submitted values or customer data.
    const body = await response.json().catch(() => null);
    const fields = body?.errors && typeof body.errors === 'object' && !Array.isArray(body.errors)
      ? Object.keys(body.errors).filter((field) => /^[a-z_][a-z0-9_.]{0,80}$/i.test(field)) : [];
    throw new Error(`Current RMS ${init.method ?? 'GET'} ${path.split('?')[0]} returned ${response.status}${fields.length ? ` (validation fields: ${fields.join(', ')})` : ''}`);
  }
  return response.json() as Promise<T>;
}

function money(value: unknown): number | null {
  const parsed = Number(value);
  return value === null || value === undefined || value === '' || !Number.isFinite(parsed) ? null : parsed;
}

function rentalRate(raw: RawProduct): RawProduct {
  const storeId = Number(import.meta.env.CURRENT_RMS_STORE_ID || 1);
  const rates = Array.isArray(raw.rental_rates) ? raw.rental_rates : [];
  return rates.find((rate: RawProduct) => Number(rate.store_id) === storeId) ??
    (raw.rental_rate && typeof raw.rental_rate === 'object' ? raw.rental_rate : rates[0] ?? {});
}

/** Display guides only. RMS checkout always receives the original base price. */
export function rentalPriceGuides(basePrice: number | null, definition: RawProduct | undefined): { dayPrice: number | null; weekPrice: number | null } {
  const unknown = { dayPrice: null, weekPrice: null };
  if (basePrice === null || !Number.isFinite(basePrice) || basePrice < 0) return unknown;
  if (basePrice === 0) return { dayPrice: 0, weekPrice: 0 };
  if (!definition || /obsol(?:ete|ite)/i.test(String(definition.name ?? ''))) return unknown;
  const config = definition.config ?? {};
  const engine = definition.rate_engine?.rate_engine ?? definition.rate_engine ?? {};
  const engineClass = engine.config?.charging_engine_class;
  const nonnegative = (value: unknown) => {
    const result = money(value);
    return result !== null && result >= 0 ? result : null;
  };
  const amount = (multiplier: number | null) => multiplier === null ? null : Math.round((basePrice * multiplier + Number.EPSILON) * 100) / 100;
  const daysInWeek = nonnegative(config.options?.days_in_week ?? engine.config?.options?.days_in_week?.default_value);
  if (engineClass === 'DayChargingEngine2') {
    const multipliers = config.multipliers;
    const factors = config.factors;
    const forDays = (days: number): number | null => {
      if (!Array.isArray(multipliers) || !multipliers.length || !Array.isArray(factors)) return null;
      const multiplier = nonnegative(multipliers[Math.min(days, multipliers.length) - 1]);
      const band = factors.find((row: RawProduct) => {
        const from = nonnegative(row.from);
        const to = row.to === '' || row.to == null ? Infinity : nonnegative(row.to);
        return from !== null && to !== null && days >= from && days <= to;
      });
      const factor = nonnegative(band?.factor);
      return multiplier === null || factor === null ? null : amount(multiplier * factor);
    };
    return { dayPrice: forDays(1), weekPrice: daysInWeek && Number.isInteger(daysInWeek) ? forDays(daysInWeek) : null };
  }
  if (engineClass === 'DayChargingEngine1') {
    const minimum = nonnegative(config.options?.minimum_days ?? 0);
    return { dayPrice: minimum === null ? null : amount(Math.max(1, minimum)), weekPrice: daysInWeek && minimum !== null ? amount(Math.max(daysInWeek, minimum)) : null };
  }
  // Weekly-only definitions provide no daily conversion. Never assume week / 7.
  if (engine.lead_charge_period === 'week') {
    const periods = config.charging_periods ?? config.periods ?? {};
    const percent = nonnegative(periods['1_day'] ?? periods.day ?? periods.days ?? config.day_percent ?? config.day);
    const weekPercent = nonnegative(periods.week ?? 100);
    return { dayPrice: percent === null ? null : amount(percent / 100), weekPrice: weekPercent === null ? null : amount(weekPercent / 100) };
  }
  return unknown;
}

function normalizeProduct(raw: RawProduct, definitions: Map<number, RawProduct>): RmsProduct {
  const rate = rentalRate(raw);
  const definitionId = money(rate.rate_definition_id ?? raw.rate_definition_id);
  const definition = definitionId === null ? undefined : definitions.get(definitionId);
  const rateName = String(definition?.name ?? rate.rate_definition_name ?? '').trim() || null;
  const price = money(rate.price ?? rate.amount ?? rate.value ?? null);
  const { dayPrice, weekPrice } = rentalPriceGuides(price, definition);
  const icon = raw.icon && typeof raw.icon === 'object' ? raw.icon : {};
  const image = typeof icon.url === 'string' && /^https:\/\//.test(icon.url) ? icon.url : null;
  return {
    id: Number(raw.id),
    name: String(raw.name ?? '').trim(),
    description: String(raw.description ?? '').replace(/<[^>]*>/g, ' ').trim().slice(0, 1200),
    group: String(raw.product_group?.name ?? 'Equipment').trim(),
    image,
    price,
    dayPrice,
    weekPrice,
    rateName,
    rateDefinitionId: definitionId,
    isPackage: /package/i.test(String(raw.product_group?.name ?? '')),
    hasAccessories: Array.isArray(raw.accessories) && raw.accessories.some((a: RawProduct) =>
      [0, 1].includes(Number(a.parent_transaction_type)) && Number(a.item_transaction_type) === 1),
  };
}

async function getRateDefinitions(): Promise<Map<number, RawProduct>> {
  if (definitionCache && definitionCache.expires > Date.now()) return definitionCache.definitions;
  const result = await rmsRequest<{ rate_definitions?: RawProduct[] }>('/rate_definitions?per_page=100');
  const definitions = new Map((result.rate_definitions ?? []).map((item) => [Number(item.id), item]));
  definitionCache = { expires: Date.now() + 10 * 60_000, definitions };
  return definitions;
}

export async function getRmsProducts(): Promise<RmsProduct[]> {
  if (productCache && productCache.expires > Date.now()) return productCache.products;
  const definitions = await getRateDefinitions();
  const products: RmsProduct[] = [];
  for (let page = 1; page <= 30; page++) {
    const params = new URLSearchParams({ page: String(page), per_page: '100', 'q[s][]': 'id asc', 'include[]': 'accessories' });
    const result = await rmsRequest<{ products?: RawProduct[]; meta?: { total_row_count?: number } }>(`/products?${params}`);
    const batch = result.products ?? [];
    products.push(...batch.filter((p) => p.active !== false && p.accessory_only !== true &&
      !/obsol(?:ete|ite)/i.test(String(rentalRate(p).rate_definition_name ?? definitions.get(Number(rentalRate(p).rate_definition_id))?.name ?? ''))
    ).map((p) => normalizeProduct(p, definitions)));
    if (batch.length < 100 || (result.meta?.total_row_count && page * 100 >= result.meta.total_row_count)) break;
  }
  const sorted = products.filter((p) => Number.isInteger(p.id) && p.name).sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name));
  productCache = { expires: Date.now() + 10 * 60_000, products: sorted };
  return sorted;
}

/** Fetch one current product with the RMS accessory rules used by checkout. */
export async function getRmsProductDetail(id: number): Promise<RmsProductDetail> {
  const cached = detailCache.get(id);
  if (cached && cached.expires > Date.now()) return cached.detail;
  const catalogue = await getRmsProducts();
  const listed = catalogue.find((product) => product.id === id);
  if (!listed) throw new Error('Product is not in the current catalogue');
  const definitions = await getRateDefinitions();
  const result = await rmsRequest<{ product?: RawProduct }>(`/products/${id}?include%5B%5D=accessories`);
  const raw = result.product;
  if (!raw || raw.active === false) throw new Error('Product is no longer active');
  const accessories = (Array.isArray(raw.accessories) ? raw.accessories : [])
    .filter((a: RawProduct) => [0, 1].includes(Number(a.parent_transaction_type)) && Number(a.item_transaction_type) === 1 && Number.isInteger(Number(a.related_id)))
    .sort((a: RawProduct, b: RawProduct) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
  const components: RmsPackageComponent[] = [];
  for (const accessory of accessories) {
    const productId = Number(accessory.related_id);
    try {
      let child = catalogue.find((product) => product.id === productId);
      if (!child) {
        const childResult = await rmsRequest<{ product?: RawProduct }>(`/products/${productId}`);
        if (!childResult.product || childResult.product.active === false) continue;
        child = normalizeProduct(childResult.product, definitions);
      }
      const type = Number(accessory.inclusion_type);
      components.push({
        id: Number(accessory.id), productId, name: child.name || String(accessory.related_name ?? `Product ${productId}`),
        inclusion: type === 1 ? 'mandatory' : type === 2 ? 'optional' : 'default',
        mode: Number(accessory.mode) || 0,
        quantity: Math.max(0, Math.round(Number(accessory.quantity) || 0)),
        zeroPriced: accessory.zero_priced === true,
        price: child.price, dayPrice: child.dayPrice, weekPrice: child.weekPrice, rateDefinitionId: child.rateDefinitionId,
      });
    } catch (error) {
      console.warn(`[rms-product] accessory ${Number(accessory.id)} could not be loaded`, error);
    }
  }
  const detail = { ...normalizeProduct(raw, definitions), dayPrice: listed.dayPrice, weekPrice: listed.weekPrice,
    rateDefinitionId: listed.rateDefinitionId, rateName: listed.rateName, components };
  detailCache.set(id, { expires: Date.now() + 5 * 60_000, detail });
  if (detailCache.size > 100) detailCache.delete(detailCache.keys().next().value!);
  return detail;
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
  // Loud Hire requires an owner on the Organisation membership, not on the outer Member.
  const membership = {
    ...(member.membership_type === 'Organisation' ? { owned_by: Number(import.meta.env.CURRENT_RMS_OWNER_ID || 1) } : {}),
    ...(member.membership && typeof member.membership === 'object' ? member.membership : {}),
  };
  const result = await rmsRequest<{ member: { id: number; addresses?: { id: number }[] } }>('/members', {
    method: 'POST', body: JSON.stringify({ member: { ...member, membership } }),
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
