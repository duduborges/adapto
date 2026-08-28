const PRODUCTION_URL = 'https://adapto-sh.com';

/**
 * Canonical origin for this deployment, no trailing slash.
 *
 * Vercel's `VERCEL_URL` is the *deployment's* generated URL even in production
 * (adapto-a1b2c3.vercel.app), so it must never be used for production
 * canonicals — `VERCEL_PROJECT_PRODUCTION_URL` is the real domain. Preview and
 * branch deploys fall back to their own `VERCEL_URL`, which keeps them out of
 * the index (see robots.ts) and stops them claiming production canonicals.
 *
 * Only read from Server Components / route handlers: these are not
 * NEXT_PUBLIC_ vars and are undefined in the browser bundle.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  if (process.env.VERCEL_ENV === 'production') {
    const domain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    return domain ? `https://${domain}` : PRODUCTION_URL;
  }

  const deployment = process.env.VERCEL_URL;
  if (deployment) return `https://${deployment}`;

  return PRODUCTION_URL;
}

export const siteUrl = resolveSiteUrl();

/** Preview/branch deploys must not be indexed and must not emit prod canonicals. */
export const isProductionSite = siteUrl === PRODUCTION_URL;

export const site = {
  name: 'Adapto',
  fullName: 'Adapto Software House',
  shortName: 'Adapto · Software House',
  domain: 'adapto-sh.com',
  email: 'hello@adapto-sh.com',
  bookingUrl: 'https://calendar.app.google/kzHtcffwJgX8JQVG7',
  location: {
    city: 'Vancouver',
    region: 'British Columbia',
    country: 'Canada',
  },
  /** Legal entity + address shown in the footer and in the JSON-LD payload. */
  legal: {
    entity: 'Adapto Software House',
    addressLocality: 'Vancouver',
    addressRegion: 'BC',
    addressCountry: 'CA',
    foundingDate: '2025',
  },
  social: {
    linkedin: '',
    instagram: '',
    github: '',
  },
} as const;

/** Returns the booking CTA href. */
export function bookingHref(): string {
  return site.bookingUrl;
}

/** Whether the booking CTA opens in a new tab. Always true for the calendar URL. */
export function bookingIsExternal(): boolean {
  return true;
}
