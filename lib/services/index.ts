import 'server-only';
import type { Locale } from '@/types';

/**
 * The service pages (/[lang]/services/[slug]). Slugs are shared by both
 * locales so the header's language switch (which swaps only the /en|/fr
 * segment) lands on the same page. `key` ties a page to its entry in the
 * dictionary's services.items and to its ServiceGlyph.
 */
export const SERVICES = [
  { slug: 'custom-software', key: 'custom' },
  { slug: 'websites', key: 'websites' },
  { slug: 'ai-integration', key: 'ai' },
  { slug: 'automation', key: 'automation' },
  { slug: 'dashboards', key: 'dashboards' },
  { slug: 'integrations', key: 'integrations' },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]['slug'];
export type ServiceKey = (typeof SERVICES)[number]['key'];

export const serviceSlugByKey = Object.fromEntries(
  SERVICES.map((s) => [s.key, s.slug]),
) as Record<ServiceKey, ServiceSlug>;

export function isServiceSlug(slug: string): slug is ServiceSlug {
  return SERVICES.some((s) => s.slug === slug);
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ServiceContent {
  /** <title>: what, where, brand last. Under ~60 characters. */
  metaTitle: string;
  /** Search snippet, ~150 characters. */
  metaDescription: string;
  /** Plain name for structured data and breadcrumbs. */
  name: string;
  /** H1, in two parts like the home hero: sans line + serif ember accent. */
  title: string;
  titleAccent: string;
  lead: string;
  problems: { title: string; items: string[] };
  build: { title: string; items: { title: string; description: string }[] };
  steps: { title: string; items: { title: string; description: string }[] };
  faq: FaqItem[];
}

/** Labels shared by every service page. */
export interface ServicePageUi {
  home: string;
  services: string;
  /** "Service" — shown as "Service 01 / 06". */
  service: string;
  howWeWork: string;
  freeNote: string;
  included: string;
  problemsLabel: string;
  buildLabel: string;
  stepsLabel: string;
  free: { title: string; body: string };
  whyLabel: string;
  whyTitle: string;
  faqLabel: string;
  faqTitle: string;
  otherLabel: string;
  otherTitle: string;
  learnMore: string;
}

export interface ServiceLocaleContent {
  ui: ServicePageUi;
  services: Record<ServiceSlug, ServiceContent>;
}

const content = {
  en: () => import('./content/en').then((m) => m.default),
  fr: () => import('./content/fr').then((m) => m.default),
};

export async function getServiceContent(locale: Locale): Promise<ServiceLocaleContent> {
  return (content[locale] ?? content.en)();
}
