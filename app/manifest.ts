import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.fullName,
    short_name: site.name,
    description:
      'Custom software, automations and dashboards that adapt to how your business actually operates.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#2a2021',
    theme_color: '#2a2021',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
