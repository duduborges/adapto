import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { i18n } from '@/lib/i18n/config';
import { bookingHref } from '@/lib/site';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

// not-found.tsx receives no params, so fall back to the default locale.
export default async function NotFound() {
  const lang = i18n.defaultLocale;
  const dict = await getDictionary(lang);

  return (
    <main className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid-bg mask-radial opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-ember/15 blur-[140px]"
      />

      <Container size="default" className="py-24">
        <Link href={`/${lang}`} className="block w-fit">
          <Logo variant="mark" sizeClass="h-12" priority />
        </Link>

        <p className="mt-14 font-mono text-sm uppercase tracking-[0.28em] text-ember">
          {dict.notFound.code}
        </p>
        <h1 className="mt-5 max-w-2xl text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1.05] tracking-tight text-cream">
          {dict.notFound.title}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/60">
          {dict.notFound.body}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button href={`/${lang}`} size="lg">
            <ArrowLeft className="h-4 w-4" />
            {dict.notFound.cta}
          </Button>
          <Button href={bookingHref()} variant="secondary" size="lg">
            {dict.notFound.secondary}
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </Container>
    </main>
  );
}
