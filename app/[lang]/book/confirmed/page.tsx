import React from 'react';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { i18n } from '@/lib/i18n/config';
import type { Locale } from '@/types';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { Container } from '@/components/ui/Container';
import { BookingConfirmed } from '@/components/booking/BookingConfirmed';

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  const { booking } = await getDictionary(lang as Locale);

  return {
    title: { absolute: booking.confirmed.metaTitle },
    // Only means something after booking: a search result landing here would
    // read as a booking that never happened.
    robots: { index: false, follow: false },
    alternates: { canonical: null, languages: {} },
  };
}

export default async function BookingConfirmedPage({ params }: { params: Params }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return (
    <>
      <Header lang={locale} dict={{ nav: dict.nav, contact: dict.contact, process: dict.process }} />
      <main className="relative isolate overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 grid-glow"
          style={{ '--glow': 'radial-gradient(620px circle at 12% 30%, black 0%, rgba(0,0,0,0.5) 40%, transparent 72%)' } as React.CSSProperties}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-8%] top-[8%] -z-10 h-[520px] w-[520px] rounded-full bg-ember/[0.12] blur-[140px]"
        />
        <Container size="wide">
          <BookingConfirmed lang={locale} t={dict.booking} />
        </Container>
      </main>
      <Footer lang={locale} dict={dict} />
    </>
  );
}
