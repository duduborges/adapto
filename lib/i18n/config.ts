import type { Locale } from '@/types';

export const i18n = {
  defaultLocale: 'en' as Locale,
  locales: ['en', 'pt', 'fr'] as Locale[],
};

export const languages: Record<Locale, string> = {
  en: 'English',
  pt: 'Português',
  fr: 'Français',
};

export const languageShort: Record<Locale, string> = {
  en: 'EN',
  pt: 'PT',
  fr: 'FR',
};
