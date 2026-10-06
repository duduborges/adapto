import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Outfit } from 'next/font/google';
import { i18n, hreflang } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { siteUrl } from '@/lib/site';
import type { Locale } from '@/types';
import { JsonLd } from '@/components/seo/JsonLd';
import { Analytics } from '@/components/analytics/Analytics';
import { CookieBanner } from '@/components/analytics/CookieBanner';
import { geistSans, geistMono } from '@/lib/fonts';
import '../globals.css';

// The wordmark's typeface ("dapto" in the logo is Outfit SemiBold): every
// display heading and title (`font-brand`). Body copy stays in Geist.
// Loaded as the variable font (one file, every weight): the hero's "adapts"
// animates along its weight axis.
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
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
  en: 'Adapto Software House — Adapt your business',
  fr: 'Adapto Software House — Adaptez votre entreprise',
};

// ~150 characters: what, for whom, where — the snippet under the title.
const descriptions: Record<Locale, string> = {
  en: 'Vancouver software studio: custom systems, websites, automations and AI integrations that help your business adapt and grow. Book a free call.',
  fr: 'Studio de software à Vancouver : systèmes sur mesure, sites web, automatisations et intégration d’IA pour que votre entreprise s’adapte et grandisse.',
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
      languages: hreflang(),
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
    // Google Search Console ownership. Keep it: removing the tag un-verifies the property.
    verification: { google: 'DylUNzT1McCdMac6X3rFHhKs3r91Hda55yBBrjf8ceQ' },
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
  // The middleware skips paths with a dot, so /anything.txt lands here with
  // lang = "anything.txt": without this it rendered the home page with a 200
  // (a soft 404, and duplicate content for search engines).
  if (!(i18n.locales as readonly string[]).includes(lang)) notFound();
  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return (
    <html
      lang={locale === 'fr' ? 'fr-CA' : 'en-CA'}
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Freezes --svh (1% of the screen height) before first paint. The
            hero's phone layout is sized from it; it only changes when the
            width does (rotation), never when a mobile browser's toolbar
            collapses on scroll, which used to resize the hero mid-scroll. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var r=document.documentElement,w=0;function s(){if(innerWidth===w)return;w=innerWidth;r.style.setProperty('--svh',innerHeight/100+'px')}s();addEventListener('resize',s)})();",
          }}
        />
        <JsonLd lang={locale} />
      </head>
      <body className="bg-ink font-sans text-cream antialiased">
        {children}
        <CookieBanner lang={locale} dict={{ cookies: dict.cookies }} />
        <Analytics />
      </body>
    </html>
  );
}
