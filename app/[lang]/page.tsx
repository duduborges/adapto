import { getDictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/types';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Differentials } from '@/components/sections/Differentials';
import { Portfolio } from '@/components/sections/Portfolio';
import { Testimonials } from '@/components/sections/Testimonials';
import { Process } from '@/components/sections/Process';
import { Contact } from '@/components/sections/Contact';

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <main className="min-h-screen">
      <Header lang={lang as Locale} dict={dict} />
      <Hero dict={dict} />
      <About dict={dict} />
      <Services dict={dict} />
      <Differentials dict={dict} />
      <Portfolio dict={dict} />
      <Testimonials dict={dict} />
      <Process dict={dict} />
      <Contact dict={dict} />
      <Footer lang={lang as Locale} dict={dict} />
    </main>
  );
}
