import { getDictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/types';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { ScrollSnap } from '@/components/ui/ScrollSnap';
import { RevealObserver } from '@/components/ui/RevealObserver';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';
import { Differentials } from '@/components/sections/Differentials';
import { Contact } from '@/components/sections/Contact';

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  // Client sections get only their slice of the dictionary: each prop is
  // serialized into the page's RSC payload, and the whole dictionary per
  // section was most of the HTML's weight on a throttled phone.
  return (
    <>
      <ScrollSnap />
      <RevealObserver />
      <Header lang={lang as Locale} dict={{ nav: dict.nav, contact: dict.contact, process: dict.process }} />
      <main className="relative">
        {/* Order: Hero → Services (what we do) → Process (how we do it)
            → Differentials (why us) → About (who we are) → Contact
            (the FAQ has its own page, /[lang]/faq)
            Portfolio (work) is pulled out for now — no real cases to show yet. */}
        <Hero dict={{ hero: dict.hero }} lang={lang} />
        <Services dict={{ services: dict.services }} lang={lang} />
        <Process dict={{ process: dict.process }} />
        <Differentials dict={{ differentials: dict.differentials }} />
        <About dict={{ manifesto: dict.manifesto }} />
        <Contact dict={{ contact: dict.contact }} />
      </main>
      <Footer lang={lang as Locale} dict={dict} />
    </>
  );
}
