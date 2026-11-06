import React from 'react';
import type { Metadata } from 'next';
import { Clock, Handshake, UserRound, Video } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { i18n, hreflang } from '@/lib/i18n/config';
import { site, siteUrl } from '@/lib/site';
import type { Locale } from '@/types';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { Container } from '@/components/ui/Container';
import { BookingFlow } from '@/components/booking/BookingFlow';

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const { booking } = await getDictionary(locale);

  return {
    title: { absolute: booking.metaTitle },
    description: booking.metaDescription,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/${locale}/book`,
      languages: hreflang('/book'),
    },
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      url: `${siteUrl}/${locale}/book`,
      siteName: 'Adapto',
      title: booking.metaTitle,
      description: booking.metaDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: booking.metaTitle,
      description: booking.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

export default async function BookPage({ params }: { params: Params }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const t = dict.booking;

  const perks = [
    { icon: Clock, label: t.duration },
    { icon: Video, label: t.meet },
    { icon: UserRound, label: t.founder },
    { icon: Handshake, label: t.free },
  ];

  return (
    <>
      <Header lang={locale} dict={{ nav: dict.nav, contact: dict.contact, process: dict.process }} />
      <main className="relative isolate overflow-hidden pb-20 pt-24 md:pb-28 md:pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 grid-glow"
          style={{ '--glow': 'radial-gradient(620px circle at 12% 28%, black 0%, rgba(0,0,0,0.5) 40%, transparent 72%), radial-gradient(520px circle at calc(100% - 200px) 70%, black 0%, rgba(0,0,0,0.35) 40%, transparent 72%)' } as React.CSSProperties}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-8%] top-[10%] -z-10 h-[520px] w-[520px] rounded-full bg-ember/[0.1] blur-[140px]"
        />

        <Container size="wide">
          <div className="grid grid-cols-12 gap-x-4 gap-y-8 lg:gap-x-12">
            <div className="col-span-12 lg:col-span-4">
              <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-cream/50">
                <span className="h-px w-12 bg-cream/15" />
                {t.eyebrow}
              </p>
              <h1 className="mt-5 font-brand text-[clamp(2.1rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-cream">
                {t.title}
                <span className="text-ember">.</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-[1.6] text-cream/70 phone:hidden md:text-lg">
                {t.lead}
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm text-cream/75 phone:mt-5 lg:mt-8 lg:grid-cols-1">
                {perks.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2.5">
                    <Icon aria-hidden className="h-4 w-4 shrink-0 text-ember" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <noscript>
                <p className="mb-4 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
                  {t.loadError} <a href={`mailto:${site.email}`} className="underline">{site.email}</a>
                </p>
              </noscript>
              <BookingFlow lang={locale} t={t} />
            </div>
          </div>
        </Container>
      </main>
      <Footer lang={locale} dict={dict} />
    </>
  );
}
