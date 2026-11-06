import { ATTRIBUTION_FIELDS, type Attribution } from './config';

/**
 * Remembers where a visitor came from (UTM tags, ad click IDs, the referring
 * site) until they book, so each call can be traced back to a post or an ad.
 * sessionStorage on purpose: it stays on the device, dies with the tab, and only
 * leaves the browser if the visitor books. No cookie, nothing to consent to.
 */
const KEY = 'adapto.attribution.v1';

/** Runs once per page load: a new campaign link replaces the previous one. */
export function captureAttribution(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Attribution = {};
    for (const key of ATTRIBUTION_FIELDS) {
      const value = params.get(key);
      if (value) found[key] = value.slice(0, 200);
    }

    let referrer = '';
    if (document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host !== window.location.hostname) referrer = host;
    }

    // Internal navigation carries neither: keep what the entry page recorded.
    if (Object.keys(found).length === 0 && !referrer) return;
    if (Object.keys(found).length === 0 && window.sessionStorage.getItem(KEY)) return;

    if (referrer) found.referrer = referrer;
    found.landing = window.location.pathname;
    window.sessionStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    /* Storage disabled or a malformed referrer: the booking just has no source. */
  }
}

export function readAttribution(): Attribution {
  try {
    return JSON.parse(window.sessionStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
}
