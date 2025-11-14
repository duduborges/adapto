import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Adapto - Software that Adapts to Your Business',
  description: 'Custom software development and automation solutions for small and medium businesses. Based in Vancouver, BC, Canada.',
  keywords: 'software development, automation, custom software, Vancouver, business software, ERP, systems integration',
  authors: [{ name: 'Adapto' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://adapto.com',
    siteName: 'Adapto',
    title: 'Adapto - Software that Adapts to Your Business',
    description: 'Custom software development and automation solutions for small and medium businesses.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adapto - Software that Adapts to Your Business',
    description: 'Custom software development and automation solutions for small and medium businesses.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
