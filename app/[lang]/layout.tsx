import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Instrument_Serif } from 'next/font/google';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});
import { i18n } from '@/lib/i18n/config';
import { site } from '@/lib/site';
import type { Locale } from '@/types';
import '../globals.css';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

const titles: Record<Locale, string> = {
  en: 'Adapto Software House — Software that adapts to your business',
  pt: 'Adapto Software House — Software que se adapta ao seu negócio',
  fr: "Adapto Software House — Un logiciel qui s'adapte à votre entreprise",
};

const descriptions: Record<Locale, string> = {
  en: 'Custom systems, automations and dashboards built around the way your company actually works. A Canadian software studio founded by Brazilian engineers.',
  pt: 'Sistemas sob medida, automações e dashboards construídos no jeito real que sua empresa funciona. Software house canadense fundada por engenheiros brasileiros.',
  fr: "Systèmes sur mesure, automatisations et tableaux de bord conçus autour du fonctionnement réel de votre entreprise. Studio logiciel canadien fondé par des ingénieurs brésiliens.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    metadataBase: new URL(`https://${site.domain}`),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        pt: '/pt',
        fr: '/fr',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'pt' ? 'pt_BR' : locale === 'fr' ? 'fr_CA' : 'en_CA',
      url: `https://${site.domain}/${locale}`,
      siteName: 'Adapto',
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
    },
    icons: {
      icon: '/favicon.svg',
      apple: '/favicon.svg',
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <html
      lang={lang}
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-ink font-sans text-cream antialiased">{children}</body>
    </html>
  );
}
