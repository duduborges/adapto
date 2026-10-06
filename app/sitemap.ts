import type { MetadataRoute } from 'next';
import { i18n, hreflang } from '@/lib/i18n/config';
import { siteUrl } from '@/lib/site';
import { SERVICES } from '@/lib/services';

/** Pages that exist under every locale prefix. */
const routes = [
  { path: '', priority: 1, changeFrequency: 'monthly' as const },
  ...SERVICES.map(({ slug }) => ({
    path: `/services/${slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  })),
  { path: '/faq', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
];

/**
 * No `lastModified`: stamping every URL with the build time made it change on
 * each deploy whether or not the page did, and Google ignores lastmod values
 * it learns aren't trustworthy. Add a real per-page date here when one exists.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) =>
    i18n.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages: hreflang(route.path, siteUrl) },
    })),
  );
}
