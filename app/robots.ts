import type { MetadataRoute } from 'next';
import { isProductionSite, siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // Preview/staging deploys must never be indexed.
  if (!isProductionSite) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
