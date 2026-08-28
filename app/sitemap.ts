import type { MetadataRoute } from 'next';
import { i18n } from '@/lib/i18n/config';
import { siteUrl } from '@/lib/site';

/** Pages that exist under every locale prefix. */
const routes = [
  { path: '', priority: 1, changeFrequency: 'monthly' as const },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.flatMap((route) =>
    i18n.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(
          i18n.locales.map((l) => [l, `${siteUrl}/${l}${route.path}`]),
        ),
      },
    })),
  );
}
