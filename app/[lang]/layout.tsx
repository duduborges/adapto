import type { Metadata } from 'next';
import { i18n } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/types';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const titles: Record<Locale, string> = {
    en: 'Adapto - Software that Adapts to Your Business',
    pt: 'Adapto - Software que se Adapta ao Seu Negócio',
    es: 'Adapto - Software que se Adapta a tu Negocio',
  };

  const descriptions: Record<Locale, string> = {
    en: 'Custom software development and automation solutions for small and medium businesses. Based in Vancouver, BC, Canada.',
    pt: 'Desenvolvimento de software personalizado e soluções de automação para pequenas e médias empresas. Baseado em Vancouver, BC, Canadá.',
    es: 'Desarrollo de software personalizado y soluciones de automatización para pequeñas y medianas empresas. Basado en Vancouver, BC, Canadá.',
  };

  return {
    title: titles[lang as Locale],
    description: descriptions[lang as Locale],
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
