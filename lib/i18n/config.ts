import type { Locale } from '@/types';

export const i18n = {
  defaultLocale: 'en' as Locale,
  locales: ['en', 'fr'] as Locale[],
};

export const languages: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
};

export const languageShort: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR',
};

/** Region-qualified codes for hreflang: the site targets Canada (and the US). */
export const hreflangCode: Record<Locale, string> = {
  en: 'en-CA',
  fr: 'fr-CA',
};

/**
 * `alternates.languages` for a path that exists under every locale
 * (`''` for the home page, `/privacy`, `/services/x`): one entry per locale
 * plus x-default, where searchers matching neither language land.
 */
export function hreflang(path = '', origin = ''): Record<string, string> {
  return {
    ...Object.fromEntries(
      i18n.locales.map((l) => [hreflangCode[l], `${origin}/${l}${path}`]),
    ),
    'x-default': `${origin}/${i18n.defaultLocale}${path}`,
  };
}
