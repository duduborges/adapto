import { getDictionary } from '@/lib/i18n/get-dictionary';
import { i18n } from '@/lib/i18n/config';
import { bookingHref } from '@/lib/site';
import type { Locale } from '@/types';
import { NotFoundView } from '@/components/sections/NotFoundView';

// not-found.tsx receives no params: ship both locales' copy (a few KB) and let
// the client pick one from the URL, so /fr/... gets a French 404.
export default async function NotFound() {
  const entries = await Promise.all(
    i18n.locales.map(async (lang) => {
      const { notFound, nav } = await getDictionary(lang);
      return [lang, { notFound, nav }] as const;
    }),
  );
  const copy = Object.fromEntries(entries) as Record<
    Locale,
    (typeof entries)[number][1]
  >;

  return <NotFoundView copy={copy} bookingHref={bookingHref()} />;
}
