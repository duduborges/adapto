'use client';

import { resetConsent } from '@/lib/consent';

/** Footer link that re-opens the consent banner so a choice can be changed. */
export function CookiePrefsLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={resetConsent}
      className="text-left transition-colors hover:text-cream/70"
    >
      {label}
    </button>
  );
}
