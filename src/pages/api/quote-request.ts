import type { APIRoute } from 'astro';
import { packageById } from '../../lib/quotePackages';
import { checkoutOpportunity, createMember, createProject, findMemberByEmail, findOrganisation, getRmsProducts, hasRmsKey, rmsRequest } from '../../lib/currentRms';

export const prerender = false;

const recentRequests = new Map<string, number[]>();
function tooManyRequests(ip: string) {
  const now = Date.now();
  const recent = (recentRequests.get(ip) || []).filter((time) => now - time < 15 * 60_000);
  recent.push(now);
  recentRequests.set(ip, recent);
  return recent.length > 5;
}

type RequestedLine = { type: 'product' | 'package'; id: number | string; quantity: number; fullBand?: boolean };
type RequestedPeriod = {
  start: string; end: string; venue: string;
  delivery: boolean; collection: boolean; setup: boolean; engineer: boolean;
};
type RequestBody = {
  lines: RequestedLine[]; periods: RequestedPeriod[]; organisation: string;
  name: string; email: string; phone: string; address: string; notes: string; website?: string;
};

const text = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const validDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
const toDateTime = (date: string, end = false) => `${date}T${end ? '18' : '09'}:00:00.000Z`;
const json = (status: number, body: Record<string, unknown>) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

async function sendEmail(subject: string, body: string, replyTo: string) {
  const to = import.meta.env.ENQUIRY_TO || 'info@loudhire.co.uk';
  const resendKey = import.meta.env.RESEND_API_KEY;
  if (resendKey) {
    const from = import.meta.env.ENQUIRY_FROM || 'website@loudhire.co.uk';
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: `Loud Hire website <${from}>`, to: [to], reply_to: replyTo, subject, text: body }),
    });
    if (!response.ok) throw new Error(`Resend returned ${response.status}`);
  } else {
    const response = await fetch(`https://formsubmit.co/ajax/${to}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: subject, _replyto: replyTo, _template: 'table', 'Quote request': body }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || String(data.success) !== 'true') throw new Error(`FormSubmit returned ${response.status}`);
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (Number(request.headers.get('content-length') || 0) > 32_000) return json(413, { error: 'The request is too large.' });
  let input: RequestBody;
  try { input = await request.json(); } catch { return json(400, { error: 'Could not read your request.' }); }
  if (text(input.website, 200)) return json(200, { ok: true }); // honeypot
  if (tooManyRequests(clientAddress || request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown')) {
    return json(429, { error: 'Too many requests from this connection. Please call us instead.' });
  }

  const organisation = text(input.organisation, 120);
  const name = text(input.name, 120);
  const email = text(input.email, 200).toLowerCase();
  const phone = text(input.phone, 60);
  const address = text(input.address, 300);
  const notes = text(input.notes, 3000);
  if (!organisation || !name || !phone || !address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: 'Please add your organisation, contact name, email, phone and address.' });
  }
  if (!Array.isArray(input.lines) || input.lines.length < 1 || input.lines.length > 60 ||
      !Array.isArray(input.periods) || input.periods.length < 1 || input.periods.length > 12) {
    return json(400, { error: 'Add at least one item and one date range.' });
  }

  const periods = input.periods.map((p) => ({
    start: text(p.start, 10), end: text(p.end, 10), venue: text(p.venue, 300),
    delivery: p.delivery === true, collection: p.collection === true,
    setup: p.setup === true, engineer: p.engineer === true,
  })).sort((a, b) => a.start.localeCompare(b.start));
  if (periods.some((p) => !validDate(p.start) || !validDate(p.end) || p.end < p.start || !p.venue)) {
    return json(400, { error: 'Add valid dates and a venue address for every date range.' });
  }

  let products;
  try { products = input.lines.some((l) => l.type === 'product') ? await getRmsProducts() : []; }
  catch (error) {
    console.error('[quote-request] product lookup failed', error);
    return json(503, { error: 'We could not verify the equipment list. Please try again shortly.' });
  }
  const productMap = new Map(products.map((p) => [p.id, p]));
  const lines = [];
  for (const item of input.lines) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) return json(400, { error: 'Check the item quantities.' });
    if (item.type === 'product') {
      const product = productMap.get(Number(item.id));
      if (!product) return json(400, { error: 'An equipment item has changed. Please refresh the list and try again.' });
      lines.push({ type: 'product' as const, quantity: item.quantity, product });
    } else if (item.type === 'package') {
      const pkg = packageById(String(item.id));
      if (!pkg) return json(400, { error: 'A package has changed. Please refresh and try again.' });
      lines.push({ type: 'package' as const, quantity: item.quantity, pkg, fullBand: item.fullBand === true });
    } else return json(400, { error: 'Unknown item type.' });
  }

  const reference = `WEB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const lineDescriptions = lines.map((line) => line.type === 'product'
    ? `${line.quantity} × ${line.product.name} (RMS product ${line.product.id})${line.product.price === null ? ' — price to confirm' : ` — RMS rate £${line.product.price.toFixed(2)}${line.product.rateName ? ` ${line.product.rateName}` : ''}`}`
    : `${line.quantity} × ${line.pkg.group}: ${line.pkg.name} (${line.pkg.duration}) — from £${line.pkg.price.toFixed(2)} + VAT${line.fullBand ? `, full band option +£${line.pkg.extras?.[0]?.price ?? 0} + VAT` : ''}`);
  const periodDescriptions = periods.map((p, i) => [
    `Date ${i + 1}: ${p.start} to ${p.end}`,
    `Venue: ${p.venue}`,
    `Services: ${[p.delivery && 'delivery', p.collection && 'collection', p.setup && 'setup', p.engineer && 'engineer'].filter(Boolean).join(', ') || 'none selected'}`,
  ].join('\n'));
  const summary = [
    `Website quote request ${reference}`, `Organisation: ${organisation}`, `Contact: ${name}`,
    `Email: ${email}`, `Phone: ${phone}`, `Organisation address: ${address}`,
    '', 'Requested items:', ...lineDescriptions, '', 'Dates and venues:', ...periodDescriptions,
    '', `Notes: ${notes || 'None'}`, '',
    'Indicative prices only. Availability, hire period, delivery and final quotation to be confirmed by Loud Hire.',
  ].join('\n');

  const opportunityIds: number[] = [];
  let rmsError = false;
  if (hasRmsKey()) {
    try {
      let org = await findOrganisation(organisation);
      if (!org) org = await createMember({ name: organisation, membership_type: 'Organisation', active: true });
      let contact = await findMemberByEmail(email);
      if (!contact) {
        contact = await createMember({
          name, membership_type: 'Contact', active: true,
          emails: [{ address: email, type_id: 4001 }],
          phones: [{ number: phone, type_id: 6001 }],
          parent_members: [{ relatable_id: org.id, relatable_type: 'Member' }],
        });
      }
      const storeId = Number(import.meta.env.CURRENT_RMS_STORE_ID || 1);
      const ownerId = Number(import.meta.env.CURRENT_RMS_OWNER_ID || 1);
      const project = periods.length > 1 ? await createProject({
        store_id: storeId, member_id: org.id, owned_by: ownerId,
        name: `Website quote ${reference} — ${organisation}`,
        description: summary, starts_at: toDateTime(periods[0].start),
        ends_at: toDateTime(periods[periods.length - 1].end, true),
      }) : null;
      for (const [index, period] of periods.entries()) {
        const start = toDateTime(period.start);
        const end = toDateTime(period.end, true);
        const opportunity = {
          store_id: storeId, member_id: org.id, owned_by: ownerId,
          ...(project ? { project_id: project.id } : {}),
          subject: `Website quote ${reference}${periods.length > 1 ? ` — date ${index + 1}` : ''}`,
          description: `${summary}\n\nRMS contact ID: ${contact.id}\nThis date: ${period.start} to ${period.end}\nVenue: ${period.venue}`,
          reference, state: 1, starts_at: start, ends_at: end,
          charge_starts_at: start, charge_ends_at: end,
          customer_collecting: !period.delivery,
          customer_returning: !period.collection,
          delivery_instructions: period.venue,
        };
        const rmsItems = lines.filter((l) => l.type === 'product').map((line) => ({
          item_id: line.product.id, item_type: 'Product', name: line.product.name,
          opportunity_item_type: 1, transaction_type: 1, quantity: line.quantity,
          ...(line.product.rateDefinitionId ? { rate_definition_id: line.product.rateDefinitionId } : {}),
          price: String(line.product.price ?? 0), starts_at: start, ends_at: end,
          description: line.product.price === null ? 'Rate to confirm' : '',
        }));
        const created = rmsItems.length
          ? await checkoutOpportunity(opportunity, rmsItems)
          : (await rmsRequest<{ opportunity: { id: number } }>('/opportunities', { method: 'POST', body: JSON.stringify({ opportunity }) })).opportunity;
        opportunityIds.push(created.id);
      }
    } catch (error) {
      rmsError = true;
      console.error('[quote-request] RMS write failed', error);
    }
  } else rmsError = true;

  try {
    await sendEmail(`Website quote request ${reference} — ${organisation}`, `${summary}\n\nRMS opportunity IDs: ${opportunityIds.join(', ') || 'Not created'}`, email);
  } catch (error) {
    console.error('[quote-request] email failed', error);
    if (!opportunityIds.length) return json(502, { error: 'We could not send the request. Please email info@loudhire.co.uk or call 0117 214 1470.' });
  }
  if (rmsError) console.warn(`[quote-request] ${reference} delivered by email with incomplete RMS write`);
  return json(200, { ok: true, reference });
};
