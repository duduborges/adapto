/**
 * Cookie consent, stored client-side only. Analytics scripts are not injected
 * at all until the visitor accepts — no "load first, ask later".
 */
export const CONSENT_KEY = 'adapto.consent.v1';
export const CONSENT_EVENT = 'adapto:consent-change';

export type ConsentValue = 'granted' | 'denied';

export function readConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    // Private mode / storage disabled — treat as "not yet answered".
    return null;
  }
}

export function writeConsent(value: ConsentValue): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/** Re-opens the banner from the footer link. */
export function resetConsent(): void {
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}
