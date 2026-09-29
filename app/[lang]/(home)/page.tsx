import { getDictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/types';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { ScrollSnap } from '@/components/ui/ScrollSnap';
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

  return (
    <>
      <ScrollSnap />
      <Header lang={lang as Locale} dict={dict} />
      <main className="relative">
        {/* Order: Hero → Services (what we do) → Process (how we do it)
            → Differentials (why us) → About (who we are) → Contact
            Portfolio (work) is pulled out for now — no real cases to show yet. */}
        <Hero dict={dict} lang={lang} />
        <Services dict={dict} />
        <Process dict={dict} />
        <Differentials dict={dict} />
        <About dict={dict} />
        <Contact dict={dict} />
      </main>
      <Footer lang={lang as Locale} dict={dict} />
    </>
  );
}
