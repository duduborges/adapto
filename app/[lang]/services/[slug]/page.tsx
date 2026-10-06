import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { i18n, hreflang } from '@/lib/i18n/config';
import { siteUrl } from '@/lib/site';
import { SERVICES, getServiceContent, isServiceSlug } from '@/lib/services';
import type { Locale } from '@/types';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { RevealObserver } from '@/components/ui/RevealObserver';
import { Contact } from '@/components/sections/Contact';
import { ServicePage } from '@/components/services/ServicePage';
import { StructuredData } from '@/components/seo/StructuredData';

// Every locale × service is generated at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return i18n.locales.flatMap((lang) => SERVICES.map(({ slug }) => ({ lang, slug })));
}

type Params = Promise<{ lang: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isServiceSlug(slug)) return {};
  const locale = lang as Locale;
  const { services } = await getServiceContent(locale);
  const content = services[slug];
  const path = `/services/${slug}`;

  return {
    // Absolute: the brand is already at the end of each metaTitle
    title: { absolute: content.metaTitle },
    description: content.metaDescription,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: hreflang(path),
    },
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      url: `${siteUrl}/${locale}${path}`,
      siteName: 'Adapto',
      title: content.metaTitle,
      description: content.metaDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ServiceRoute({ params }: { params: Params }) {
  const { lang, slug } = await params;
  if (!isServiceSlug(slug)) notFound();
  const locale = lang as Locale;
  const [dict, { ui, services }] = await Promise.all([
    getDictionary(locale),
    getServiceContent(locale),
  ]);
  const content = services[slug];
  const url = `${siteUrl}/${locale}/services/${slug}`;

  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Service',
              '@id': `${url}#service`,
              name: content.name,
              serviceType: content.name,
              description: content.metaDescription,
              url,
              inLanguage: locale === 'fr' ? 'fr-CA' : 'en-CA',
              provider: { '@id': `${siteUrl}/#organization` },
              areaServed: [
                { '@type': 'Country', name: 'Canada' },
                { '@type': 'Country', name: 'United States' },
              ],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: content.build.title.replace(/[.?!]$/, ''),
                itemListElement: content.build.items.map((item) => ({
                  '@type': 'Offer',
                  itemOffered: { '@type': 'Service', name: item.title, description: item.description },
                })),
              },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: ui.home, item: `${siteUrl}/${locale}` },
                { '@type': 'ListItem', position: 2, name: ui.services, item: `${siteUrl}/${locale}#services` },
                { '@type': 'ListItem', position: 3, name: content.name, item: url },
              ],
            },
          ],
        }}
      />
      <RevealObserver />
      <Header lang={locale} dict={{ nav: dict.nav, contact: dict.contact, process: dict.process }} />
      <main className="relative">
        <ServicePage lang={locale} slug={slug} content={content} ui={ui} all={services} dict={dict} />
        <Contact dict={{ contact: dict.contact }} />
      </main>
      <Footer lang={locale} dict={dict} />
    </>
  );
}
