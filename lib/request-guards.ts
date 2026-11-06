/** Checks shared by the public POST endpoints (contact form, booking). */

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c] as string),
  );

// No commas, semicolons, spaces or angle brackets: one plain address, so the
// field can't smuggle extra recipients or a display name into Resend's `to`.
export const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
// Name and company are echoed in the subject and the visitor's confirmation;
// links there would turn the form into a spam relay.
export const LINK_RE = /(https?:\/\/|www\.|<|>|@)/i;

/**
 * Best-effort, per-instance rate limit. Serverless instances don't share
 * memory, so this blunts bursts rather than guaranteeing a global cap —
 * pair it with a Vercel WAF rate-limit rule on the endpoint.
 */
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

export function rateLimited(key: string, max: number): boolean {
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

export function clientIp(request: Request): string {
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown'
  );
}

/** Only accept posts from this site's own pages. */
export function sameOrigin(request: Request): boolean {
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
