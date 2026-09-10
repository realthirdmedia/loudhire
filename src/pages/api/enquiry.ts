import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Enquiry endpoint.
 *
 * Accepts the enquiry form (multipart or urlencoded), validates it, and forwards
 * it by email. Two delivery options, chosen by environment variables:
 *
 *   RESEND_API_KEY set  -> sent via Resend (https://resend.com) from ENQUIRY_FROM
 *   otherwise           -> forwarded via FormSubmit (https://formsubmit.co) to ENQUIRY_TO;
 *                          the first submission triggers a one-time activation email
 *
 * Responds with JSON when the client asks for it (fetch), otherwise redirects.
 */

const TO = import.meta.env.ENQUIRY_TO || 'info@loudhire.co.uk';
const FROM = import.meta.env.ENQUIRY_FROM || 'website@loudhire.co.uk';
const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;

const MAX = { name: 120, email: 200, phone: 60, location: 200, date: 100, message: 4000 };

// Very light rate limiting per function instance.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 8;
}

function clean(value: FormDataEntryValue | null, max: number) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, max);
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const respond = (status: number, body: { ok: boolean; error?: string }) => {
    if (wantsJson) {
      return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
    }
    return redirect(body.ok ? '/thank-you/' : `/contact/?error=${encodeURIComponent(body.error || 'Something went wrong')}#enquiry`, 303);
  };

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return respond(400, { ok: false, error: 'Could not read the form.' });
  }

  // Honeypot
  if (clean(form.get('website'), 200)) {
    return respond(200, { ok: true });
  }

  const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
  if (rateLimited(ip)) {
    return respond(429, { ok: false, error: 'Too many enquiries from this connection. Please call us instead.' });
  }

  const data = {
    name: clean(form.get('name'), MAX.name),
    email: clean(form.get('email'), MAX.email),
    phone: clean(form.get('phone'), MAX.phone),
    location: clean(form.get('location'), MAX.location),
    date: clean(form.get('date'), MAX.date),
    undecided: clean(form.get('undecided'), 10) === 'yes',
    message: clean(form.get('message'), MAX.message),
    page: clean(form.get('page'), 200),
  };

  if (!data.name || !data.email || !data.message) {
    return respond(400, { ok: false, error: 'Please add your name, email and a few words about the event.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return respond(400, { ok: false, error: 'That email address does not look right.' });
  }

  const subject = `Website enquiry from ${data.name}${data.location ? ` (${data.location})` : ''}`;
  const lines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || '-'}`,
    `Event location: ${data.location || '-'}`,
    `Event date: ${data.date || '-'}${data.undecided ? ' (not decided yet)' : ''}`,
    `Sent from: ${data.page || '-'}`,
    '',
    'Message:',
    data.message,
  ];
  const text = lines.join('\n');

  try {
    if (RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `Loud Hire website <${FROM}>`,
          to: [TO],
          reply_to: data.email,
          subject,
          text,
          html: `<pre style="font: 14px/1.5 -apple-system, Segoe UI, sans-serif; white-space: pre-wrap">${escapeHtml(text)}</pre>`,
        }),
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    } else {
      const res = await fetch(`https://formsubmit.co/ajax/${TO}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: subject,
          _template: 'table',
          _replyto: data.email,
          Name: data.name,
          Email: data.email,
          Phone: data.phone || '-',
          'Event location': data.location || '-',
          'Event date': `${data.date || '-'}${data.undecided ? ' (not decided yet)' : ''}`,
          Message: data.message,
          'Sent from': data.page || '-',
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || String(body.success) !== 'true') throw new Error(`FormSubmit responded ${res.status}: ${JSON.stringify(body)}`);
    }
  } catch (err) {
    console.error('[enquiry] delivery failed', err);
    return respond(502, { ok: false, error: 'We could not send your enquiry just now. Please call 0117 214 1470 or email info@loudhire.co.uk.' });
  }

  return respond(200, { ok: true });
};

export const GET: APIRoute = ({ redirect }) => redirect('/contact/', 302);
