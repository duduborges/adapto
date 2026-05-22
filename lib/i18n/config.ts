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
