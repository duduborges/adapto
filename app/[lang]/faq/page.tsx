import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronRight } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { i18n, hreflang } from '@/lib/i18n/config';
import { bookingHref, siteUrl } from '@/lib/site';
import { SERVICES, getServiceContent } from '@/lib/services';
import type { Locale } from '@/types';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { Container } from '@/components/ui/Container';
import { RevealObserver } from '@/components/ui/RevealObserver';
import { ServiceGlyph } from '@/components/sections/ServiceGlyph';
import { Contact } from '@/components/sections/Contact';
import { FaqList, faqSchema } from '@/components/sections/Faq';
import { StructuredData } from '@/components/seo/StructuredData';

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const { faq } = await getDictionary(locale);

  return {
    title: { absolute: faq.page.metaTitle },
    description: faq.page.metaDescription,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/${locale}/faq`,
      languages: hreflang('/faq'),
    },
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      url: `${siteUrl}/${locale}/faq`,
      siteName: 'Adapto',
      title: faq.page.metaTitle,
      description: faq.page.metaDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: faq.page.metaTitle,
      description: faq.page.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

export default async function FaqPage({ params }: { params: Params }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const [dict, { ui, services }] = await Promise.all([
    getDictionary(locale),
    getServiceContent(locale),
  ]);
  const t = dict.faq.page;

  // General questions first, then one group per service, in menu order
  const groups = [
    { id: 'general', title: t.general, items: dict.faq.items as { q: string; a: string }[] },
    ...SERVICES.map(({ slug, key }) => ({
      id: slug,
      key,
      title: dict.services.items[key].title as string,
      href: `/${locale}/services/${slug}`,
      items: services[slug].faq,
    })),
  ];

  return (
    <>
      <StructuredData data={faqSchema(groups.flatMap((g) => g.items))} />
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: ui.home, item: `${siteUrl}/${locale}` },
            { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${siteUrl}/${locale}/faq` },
          ],
        }}
      />
      <RevealObserver />
      <Header lang={locale} dict={dict} />
      <main className="relative">
        {/* ---------- Hero ---------- */}
        <section className="relative isolate overflow-hidden pb-16 pt-32 md:pb-20 md:pt-40">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 grid-glow"
            style={{ '--glow': 'radial-gradient(620px circle at calc(100% - 260px) 40%, black 0%, rgba(0,0,0,0.5) 40%, transparent 72%), radial-gradient(420px circle at 8% 0%, black 0%, rgba(0,0,0,0.35) 40%, transparent 72%)' } as React.CSSProperties}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-10%] top-1/4 -z-10 h-[520px] w-[520px] rounded-full bg-ember/[0.1] blur-[140px]"
          />
          <Container size="wide">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/45">
                <li>
                  <Link href={`/${locale}`} className="transition-colors hover:text-cream">
                    {ui.home}
                  </Link>
                </li>
                <ChevronRight aria-hidden className="h-3 w-3 text-cream/25" />
                <li aria-current="page" className="text-ember">
                  FAQ
                </li>
              </ol>
            </nav>

            <div className="mt-12 grid grid-cols-12 items-end gap-x-4 gap-y-10 md:mt-16 lg:gap-x-12">
              <h1 className="col-span-12 text-[clamp(2.6rem,6vw,5rem)] font-medium leading-[1.02] tracking-[-0.02em] text-cream lg:col-span-7">
                <span className="block">{t.title}</span>
                <span className="mt-1 block font-serif font-normal italic text-ember">
                  {t.titleAccent}
                </span>
              </h1>
              <div className="col-span-12 lg:col-span-5">
                <p className="text-lg leading-[1.6] text-cream/70 md:text-xl">{t.lead}</p>
                <a
                  href={bookingHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex items-baseline gap-3 border-b border-ember pb-1 font-serif text-2xl text-cream transition-colors hover:text-ember md:text-3xl"
                >
                  <span>{dict.nav.book}</span>
                  <ArrowRight className="h-5 w-5 self-center transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Topic shortcuts */}
            <nav aria-label={t.topics} className="mt-16 border-t border-cream/10 pt-8 md:mt-20">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/45">{t.topics}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {groups.map((g) => (
                  <li key={g.id}>
                    <a
                      href={`#${g.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-cream/[0.03] px-4 py-2 text-sm font-medium text-cream/75 transition-colors hover:border-ember/50 hover:text-cream"
                    >
                      {'key' in g && g.key ? (
                        <span className="h-4 w-4 text-ember">
                          <ServiceGlyph kind={g.key} />
                        </span>
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                      )}
                      {g.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Container>
        </section>

        {/* ---------- Question groups ---------- */}
        {groups.map((g, gi) => (
          <section
            key={g.id}
            id={g.id}
            className="relative scroll-mt-24 border-t border-cream/10 py-20 md:scroll-mt-28 md:py-28"
          >
            <Container size="wide">
              <div className="grid grid-cols-12 gap-x-4 gap-y-10 md:gap-x-8">
                <div className="col-span-12 lg:col-span-4">
                  <div className="lg:sticky lg:top-32">
                    <span className="font-mono text-xs font-semibold text-ember">
                      {String(gi + 1).padStart(2, '0')}
                    </span>
                    <div className="mt-5 flex items-center gap-4">
                      {'key' in g && g.key && (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ember/50 bg-ember/10 p-2.5 text-ember-400">
                          <ServiceGlyph kind={g.key} />
                        </span>
                      )}
                      <h2 className="font-serif text-4xl leading-[1.05] tracking-[-0.01em] text-cream md:text-5xl">
                        {g.title}
                        <span className="text-ember">.</span>
                      </h2>
                    </div>
                    {'href' in g && g.href && (
                      <Link
                        href={g.href}
                        className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-cream/60 transition-colors hover:text-ember"
                      >
                        {t.explore}
                        <ArrowUpRight
                          aria-hidden
                          className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-8">
                  <FaqList items={g.items} openFirst={gi === 0} />
                </div>
              </div>
            </Container>
          </section>
        ))}

        <Contact dict={dict} />
      </main>
      <Footer lang={locale} dict={dict} />
    </>
  );
}
