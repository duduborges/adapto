import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.fullName,
    short_name: site.name,
    description:
      'Custom software, websites, automations and AI integration that help your business adapt and grow.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#221a1a',
    theme_color: '#221a1a',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
