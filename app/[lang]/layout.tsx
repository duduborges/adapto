import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Instrument_Serif } from 'next/font/google';
import { i18n } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { siteUrl } from '@/lib/site';
import type { Locale } from '@/types';
import { JsonLd } from '@/components/seo/JsonLd';
import { Analytics } from '@/components/analytics/Analytics';
import { CookieBanner } from '@/components/analytics/CookieBanner';
import '../globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

// Short tab title (browsers only show ~30-50 chars). Long-form goes into OG title.
const tabTitle = 'Adapto · Software House';

const ogTitles: Record<Locale, string> = {
  en: 'Adapto Software House — Software that adapts to your business',
  fr: "Adapto Software House — Un logiciel qui s'adapte à votre entreprise",
};

const descriptions: Record<Locale, string> = {
  en: 'Adapto is a Canadian software studio in Vancouver. We build custom systems, automations and dashboards that adapt to how your business actually operates.',
  fr: "Adapto est un studio logiciel canadien basé à Vancouver. Nous concevons des systèmes sur mesure, des automatisations et des tableaux de bord qui s'adaptent au fonctionnement réel de votre entreprise.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;

  return {
    // Tab title — short. Long form is below in openGraph.title for SEO/AEO.
    title: tabTitle,
    description: descriptions[locale] ?? descriptions.en,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        fr: '/fr',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      url: `${siteUrl}/${locale}`,
      siteName: 'Adapto',
      title: ogTitles[locale] ?? ogTitles.en,
      description: descriptions[locale] ?? descriptions.en,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitles[locale] ?? ogTitles.en,
      description: descriptions[locale] ?? descriptions.en,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#2a2021',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return (
    <html
      lang={locale === 'fr' ? 'fr-CA' : 'en-CA'}
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd lang={locale} />
      </head>
      <body className="bg-ink font-sans text-cream antialiased">
        {children}
        <CookieBanner lang={locale} dict={dict} />
        <Analytics />
      </body>
    </html>
  );
}
