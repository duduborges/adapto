import { site, siteUrl } from '@/lib/site';
import type { Locale } from '@/types';

const descriptions: Record<Locale, string> = {
  en: 'Adapto is a Canadian software studio in Vancouver building custom systems, automations and dashboards that adapt to how your business actually operates.',
  fr: "Adapto est un studio logiciel canadien basé à Vancouver qui conçoit des systèmes sur mesure, des automatisations et des tableaux de bord adaptés au fonctionnement réel de votre entreprise.",
};

/**
 * Organization + WebSite graph. Gives Google an entity to attach the brand to
 * and enables the sitelinks/knowledge-panel surfaces for local search.
 */
export function JsonLd({ lang }: { lang: Locale }) {
  const profiles = Object.values(site.social).filter(Boolean);

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${siteUrl}/#organization`,
        name: site.fullName,
        alternateName: site.name,
        url: `${siteUrl}/${lang}`,
        email: site.email,
        description: descriptions[lang] ?? descriptions.en,
        logo: `${siteUrl}/icon-512.png`,
        image: `${siteUrl}/icon-512.png`,
        foundingDate: site.legal.foundingDate,
        ...(profiles.length ? { sameAs: profiles } : {}),
        address: {
          '@type': 'PostalAddress',
          addressLocality: site.legal.addressLocality,
          addressRegion: site.legal.addressRegion,
          addressCountry: site.legal.addressCountry,
        },
        areaServed: [
          { '@type': 'Country', name: 'Canada' },
          { '@type': 'Country', name: 'United States' },
        ],
        knowsLanguage: ['en-CA', 'fr-CA'],
        serviceType: [
          'Custom software development',
          'Business process automation',
          'Data dashboards and reporting',
          'Systems integration',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/${lang}`,
        name: site.fullName,
        inLanguage: lang === 'fr' ? 'fr-CA' : 'en-CA',
        publisher: { '@id': `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Values are all authored constants — no user input reaches this string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
