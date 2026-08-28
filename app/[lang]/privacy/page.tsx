import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { i18n } from '@/lib/i18n/config';
import { siteUrl } from '@/lib/site';
import type { Locale } from '@/types';
import { Container } from '@/components/ui/Container';
import { Footer } from '@/components/ui/Footer';
import { Logo } from '@/components/ui/Logo';

const LAST_UPDATED = '2026-08-27';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return {
    title: `${dict.privacy.title} · Adapto`,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/${lang}/privacy`,
      languages: { en: '/en/privacy', fr: '/fr/privacy' },
    },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  const formatted = new Intl.DateTimeFormat(
    locale === 'fr' ? 'fr-CA' : 'en-CA',
    // Format in UTC — a bare date string parses as UTC midnight, which would
    // otherwise render as the previous day west of Greenwich.
    { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' },
  ).format(new Date(LAST_UPDATED));

  return (
    <>
      <main className="relative bg-ink pb-24 pt-16 md:pt-20">
        <Container size="narrow">
          <Link href={`/${locale}`} className="block w-fit">
            <Logo variant="mark" sizeClass="h-10" priority />
          </Link>

          <Link
            href={`/${locale}`}
            className="mt-12 inline-flex items-center gap-2 text-sm text-cream/50 transition-colors hover:text-cream"
          >
            <ArrowLeft className="h-4 w-4" />
            {dict.privacy.back}
          </Link>

          <h1 className="mt-8 text-[clamp(2rem,4vw,3rem)] font-medium leading-tight tracking-tight text-cream">
            {dict.privacy.title}
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-cream/40">
            {dict.privacy.updated} — {formatted}
          </p>

          <div className="mt-14 space-y-12">
            {dict.privacy.sections.map(
              (s: { heading: string; body: string }) => (
                <section key={s.heading}>
                  <h2 className="text-lg font-medium text-cream">
                    {s.heading}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-cream/60">
                    {s.body}
                  </p>
                </section>
              ),
            )}
          </div>
        </Container>
      </main>
      <Footer lang={locale} dict={dict} />
    </>
  );
}
