import { site, siteUrl } from '@/lib/site';
import { i18n } from '@/lib/i18n/config';
import { SERVICES } from '@/lib/services';
import type { Locale } from '@/types';

const descriptions: Record<Locale, string> = {
  en: 'Adapto is a Canadian software studio in Vancouver building custom systems, websites, automations, dashboards and AI integrations that adapt to how your business actually operates.',
  fr: "Adapto est un studio de software canadien basé à Vancouver qui conçoit des systèmes sur mesure, des sites web, des automatisations, des tableaux de bord et des intégrations d'IA adaptés au fonctionnement réel de votre entreprise.",
};

/**
 * What we sell, as schema.org Services — mirrors the Services section, in
 * the same order as SERVICES (each links to its page).
 */
const services: Record<Locale, { name: string; description: string }[]> = {
  en: [
    { name: 'Custom software development', description: 'ERPs, CRMs, internal tools and web applications built around how your team works.' },
    { name: 'Website and landing page development', description: 'Institutional websites, landing pages, online stores and client portals.' },
    { name: 'AI integration', description: 'AI assistants on your own data, document and email processing, smart triage and copilots inside existing tools.' },
    { name: 'Business process automation', description: 'Reports, approvals and data entry replaced by automated workflows.' },
    { name: 'Dashboards and reporting', description: 'Real-time views of sales, stock, operations and people.' },
    { name: 'Systems integration', description: 'Accounting, e-commerce, logistics and payment tools connected into one operation.' },
  ],
  fr: [
    { name: 'Développement de software sur mesure', description: "ERP, CRM, outils internes et applications web conçus autour du fonctionnement de votre équipe." },
    { name: 'Création de sites web et landing pages', description: 'Sites institutionnels, landing pages, boutiques en ligne et portails clients.' },
    { name: "Intégration d'IA", description: 'Assistants IA sur vos propres données, traitement de documents et de courriels, tri intelligent et copilotes dans vos outils.' },
    { name: 'Automatisation des processus', description: 'Rapports, approbations et saisie de données remplacés par des flux automatisés.' },
    { name: 'Tableaux de bord et reporting', description: 'Vues en temps réel des ventes, des stocks, des opérations et des équipes.' },
    { name: 'Intégration de systèmes', description: 'Comptabilité, e-commerce, logistique et paiements reliés en une seule opération.' },
  ],
};

/**
 * Organization + WebSite graph. Gives Google an entity to attach the brand to
 * and enables the sitelinks/knowledge-panel surfaces for local search.
 */
export function JsonLd({ lang }: { lang: Locale }) {
  const profiles = Object.values(site.social).filter(Boolean);
  // One entity across locales: the organisation's URL is the canonical home
  // (the bare domain only redirects there).
  const homeUrl = `${siteUrl}/${i18n.defaultLocale}`;

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${siteUrl}/#organization`,
        name: site.fullName,
        alternateName: site.name,
        url: homeUrl,
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
        serviceType: (services[lang] ?? services.en).map((s) => s.name),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Services',
          itemListElement: (services[lang] ?? services.en).map((s, i) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              '@id': `${siteUrl}/${lang}/services/${SERVICES[i].slug}#service`,
              name: s.name,
              description: s.description,
              url: `${siteUrl}/${lang}/services/${SERVICES[i].slug}`,
              provider: { '@id': `${siteUrl}/#organization` },
              areaServed: [
                { '@type': 'Country', name: 'Canada' },
                { '@type': 'Country', name: 'United States' },
              ],
            },
          })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: homeUrl,
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
