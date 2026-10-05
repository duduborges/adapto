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
import { MotionProvider } from '@/components/ui/MotionProvider';
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

// Search-result titles: say what we do and where, brand last. Kept under
// ~60 characters so Google shows them whole.
const titles: Record<Locale, string> = {
  en: 'Custom Software, AI & Web Development in Vancouver | Adapto',
  fr: 'Software sur mesure, IA et sites web à Vancouver | Adapto',
};

const ogTitles: Record<Locale, string> = {
  en: 'Adapto Software House — Software that adapts to your business',
  fr: "Adapto Software House — Un software qui s'adapte à votre entreprise",
};

// ~150 characters: what, for whom, where — the snippet under the title.
const descriptions: Record<Locale, string> = {
  en: 'Vancouver software studio building custom systems, websites, automations and AI integrations that fit how your business actually works. Book a free call.',
  fr: 'Studio de software à Vancouver : systèmes sur mesure, sites web, automatisations et intégration d’IA adaptés à votre façon de travailler. Appel gratuit.',
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
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        fr: '/fr',
        // Where searchers matching neither language land
        'x-default': '/en',
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
  themeColor: '#221a1a',
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
        <MotionProvider>
          {children}
          <CookieBanner lang={locale} dict={dict} />
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
