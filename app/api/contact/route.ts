import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { ContactFormData } from '@/types';
import { site } from '@/lib/site';

// Force the route to be dynamic so Next.js does not try to pre-collect it
// at build time (which would touch RESEND_API_KEY before envs are available).
export const dynamic = 'force-dynamic';

const FROM_EMAIL =
  process.env.RESEND_FROM || 'contact@resend.eduardoborges.dev.br';
const TO_EMAIL = process.env.CONTACT_TO || site.email;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c] as string),
  );

/** Per-field caps — generous for real people, useless for payload stuffing. */
const LIMITS = { name: 100, email: 254, company: 150, message: 5000 } as const;
const MAX_BODY_BYTES = 16 * 1024;

// No commas, semicolons, spaces or angle brackets: one plain address, so the
// field can't smuggle extra recipients or a display name into Resend's `to`.
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
// Name and company are echoed in the subject and the visitor's confirmation;
// links there would turn the form into a spam relay.
const LINK_RE = /(https?:\/\/|www\.|<|>|@)/i;

/**
 * Best-effort, per-instance rate limit. Serverless instances don't share
 * memory, so this blunts bursts rather than guaranteeing a global cap —
 * pair it with a Vercel WAF rate-limit rule on /api/contact.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_IP = 5;
const MAX_PER_RECIPIENT = 2;
const hits = new Map<string, number[]>();

function rateLimited(key: string, max: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    // Drop the oldest keys so the map can't grow without bound
    for (const k of Array.from(hits.keys()).slice(0, 1000)) hits.delete(k);
  }
  return false;
}

function clientIp(request: Request): string {
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown'
  );
}

/** Only accept posts from this site's own pages. */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host =
    request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const bad = (error: string, status = 400) =>
  NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  try {
    if (!sameOrigin(request)) return bad('Forbidden', 403);

    if (!request.headers.get('content-type')?.includes('application/json')) {
      return bad('Unsupported content type', 415);
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return bad('Payload too large', 413);

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw);
    } catch {
      return bad('Invalid JSON');
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return bad('Invalid payload');
    }

    // Honeypot: a hidden field real visitors never fill. Pretend it worked.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ message: 'ok' }, { status: 200 });
    }

    const field = (k: keyof typeof LIMITS) =>
      typeof body[k] === 'string' ? (body[k] as string).trim() : '';
    const data: ContactFormData = {
      // Collapse newlines/tabs in single-line fields (they end up in the subject)
      name: field('name').replace(/\s+/g, ' '),
      email: field('email').toLowerCase(),
      company: field('company').replace(/\s+/g, ' '),
      message: field('message'),
    };

    if (!data.name || !data.email || !data.message) {
      return bad('Missing required fields');
    }
    for (const k of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
      if (data[k].length > LIMITS[k]) return bad(`Field too long: ${k}`);
    }
    if (!EMAIL_RE.test(data.email)) return bad('Invalid email format');
    if (LINK_RE.test(data.name) || LINK_RE.test(data.company)) {
      return bad('Invalid characters in name or company');
    }

    if (
      rateLimited(`ip:${clientIp(request)}`, MAX_PER_IP) ||
      rateLimited(`to:${data.email}`, MAX_PER_RECIPIENT)
    ) {
      return bad('Too many requests', 429);
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[adapto] RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 },
      );
    }
    const resend = new Resend(apiKey);

    const name = esc(data.name);
    const email = esc(data.email);
    const company = esc(data.company);
    const message = esc(data.message).replace(/\n/g, '<br/>');

    /* ---- Notify Adapto ---- */
    const adminResult = await resend.emails.send({
      from: `Adapto Website <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: data.email,
      subject: `New conversation request — ${data.name}${data.company ? ` (${data.company})` : ''}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #2a2021;">
          <div style="background: #2a2021; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #fefefe; margin: 0; font-size: 20px; letter-spacing: -0.01em;">
              New conversation request
            </h1>
            <p style="color: rgba(254,254,254,0.6); margin: 8px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.18em;">
              Adapto Software House
            </p>
          </div>
          <div style="border: 1px solid #e6e1e1; border-top: none; padding: 28px; border-radius: 0 0 12px 12px; background: #fefefe;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #5b4a4a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.18em; width: 110px; vertical-align: top;">Name</td>
                <td style="padding: 10px 0; color: #2a2021; font-size: 15px; font-weight: 500;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #5b4a4a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.18em; vertical-align: top;">Email</td>
                <td style="padding: 10px 0; color: #2a2021; font-size: 15px;"><a href="mailto:${email}" style="color: #c35622; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #5b4a4a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.18em; vertical-align: top;">Company</td>
                <td style="padding: 10px 0; color: #2a2021; font-size: 15px;">${company || '—'}</td>
              </tr>
              <tr>
                <td style="padding: 16px 0 6px; color: #5b4a4a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.18em; vertical-align: top;" colspan="2">Problem to solve</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 0 0 8px; color: #2a2021; font-size: 15px; line-height: 1.65;">${message}</td>
              </tr>
            </table>
            <p style="margin: 24px 0 0; padding-top: 16px; border-top: 1px solid #e6e1e1; color: #a89898; font-size: 12px;">
              Reply directly to this email to reach ${name}.
            </p>
          </div>
        </div>
      `,
    });

    if (adminResult.error) {
      console.error('[adapto] Resend admin send error:', adminResult.error);
      return NextResponse.json(
        { error: 'Failed to deliver message' },
        { status: 502 },
      );
    }

    /* ---- Send confirmation to the visitor ---- */
    try {
      await resend.emails.send({
        from: `Adapto <${FROM_EMAIL}>`,
        to: data.email,
        // Resend can't send from a Gmail address, so replies are routed there.
        replyTo: site.email,
        subject: 'Thanks — we received your message',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #2a2021;">
            <div style="background: #2a2021; padding: 28px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #fefefe; margin: 0; font-size: 22px; letter-spacing: -0.01em;">
                Hi ${name},
              </h1>
              <p style="color: rgba(254,254,254,0.7); margin: 12px 0 0; font-size: 16px; line-height: 1.55;">
                Thanks for reaching out — we got your message.
              </p>
            </div>
            <div style="border: 1px solid #e6e1e1; border-top: none; padding: 28px; border-radius: 0 0 12px 12px; background: #fefefe; font-size: 15px; line-height: 1.65; color: #2a2021;">
              <p style="margin: 0 0 14px;">
                One of the founders will reply within one business day. In the meantime, if it's easier, you can
                <a href="${site.bookingUrl}" style="color: #c35622; font-weight: 500;">book a 30-minute call</a> directly on our calendar.
              </p>
              <!-- The visitor's message is deliberately NOT echoed here: the
                   address is unverified, so echoing it would let anyone send
                   arbitrary text from our domain to any inbox. -->
              <p style="margin: 0; color: #5b4a4a; font-size: 14px;">
                — The Adapto team
              </p>
              <p style="margin: 18px 0 0; padding-top: 16px; border-top: 1px solid #e6e1e1; color: #a89898; font-size: 12px;">
                Vancouver, BC · Canada &nbsp;·&nbsp; <a href="https://www.adapto-sh.com" style="color: #a89898;">adapto-sh.com</a>
              </p>
            </div>
          </div>
        `,
      });
    } catch (confirmErr) {
      // Confirmation failure shouldn't fail the request — the admin was already notified.
      console.error('[adapto] Resend confirmation send error:', confirmErr);
    }

    return NextResponse.json({ message: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('[adapto] contact form error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
