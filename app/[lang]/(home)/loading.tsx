import { Skeleton } from '@/components/ui/Skeleton';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';

/**
 * Next.js shows this in place of page.tsx (and everything it renders,
 * Header/Footer included) while the route's data resolves. Shaped to roughly
 * match the real landing page section-by-section so the swap-in doesn't jump.
 */
export default function Loading() {
  return (
    <>
      <HeaderSkeleton />
      <main className="relative pt-24 md:pt-28">
        <HeroSkeleton />
        <ServicesSkeleton />
        <ProcessSkeleton />
        <DifferentialsSkeleton />
        <AboutSkeleton />
        <ContactSkeleton />
      </main>
      <FooterSkeleton />
    </>
  );
}

function Eyebrow() {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-12 bg-cream/15" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-transparent">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:h-24 md:px-8 lg:px-10">
        <div className="flex items-center gap-4">
          <Skeleton className="h-11 w-11 rounded-full md:h-12 md:w-12" />
          <Skeleton className="hidden h-8 w-20 md:block" />
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-7">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-3.5 w-14" />
            ))}
          </div>
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </nav>
    </header>
  );
}

function HeroSkeleton() {
  return (
    <div className="flex min-h-[calc(100svh-6rem)] flex-col justify-center overflow-hidden">
      <Container size="wide" className="w-full">
        <Skeleton className="h-7 w-56 rounded-full" />
        <div className="mt-8 space-y-4">
          <Skeleton className="h-12 w-full max-w-xl md:h-16" />
          <Skeleton className="h-12 w-2/3 max-w-md md:h-16" />
        </div>
        <div className="mt-6 max-w-lg space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="mt-9 h-11 w-52 rounded-full" />
      </Container>
    </div>
  );
}

function HeadingBlock({ narrow = false }: { narrow?: boolean }) {
  return (
    <div className="mt-12 space-y-4 md:mt-16">
      <Skeleton className={narrow ? 'h-10 w-2/3 max-w-xl md:h-14' : 'h-10 w-3/4 max-w-2xl md:h-14'} />
      {!narrow && <Skeleton className="h-10 w-1/2 max-w-lg md:h-14" />}
    </div>
  );
}

function ServicesSkeleton() {
  return (
    <Section size="wide" className="border-t border-cream/10">
      <Eyebrow />
      <HeadingBlock />
      <div className="mt-20 space-y-0 border-t border-cream/15 md:mt-24">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 border-b border-cream/15 py-8 md:gap-10 md:py-12">
            <Skeleton className="h-4 w-6 shrink-0" />
            <Skeleton className="h-8 w-2/3 max-w-md" />
          </div>
        ))}
      </div>
    </Section>
  );
}

function ProcessSkeleton() {
  return (
    <Section size="wide" className="border-t border-cream/10">
      <Eyebrow />
      <HeadingBlock />
      <Skeleton className="mt-12 h-28 w-full rounded-2xl md:mt-16" />
      <Skeleton className="mt-8 hidden h-32 w-full rounded-full lg:block" />
      <div className="mt-16 space-y-8 lg:hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-5">
            <Skeleton className="mt-1 h-2 w-2 shrink-0 rounded-full" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-14 h-9 w-40 rounded-full" />
    </Section>
  );
}

function DifferentialsSkeleton() {
  return (
    <Section size="wide" className="border-t border-cream/10">
      <Eyebrow />
      <HeadingBlock />
      <div className="mt-20 border-b border-cream/15 pb-4 md:mt-24">
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="space-y-10 py-2 md:space-y-14">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="grid grid-cols-12 gap-4 border-b border-cream/10 py-8 md:gap-8">
            <Skeleton className="col-span-11 h-4 md:col-span-5" />
            <Skeleton className="col-span-12 h-16 rounded-md md:col-span-6" />
          </div>
        ))}
      </div>
    </Section>
  );
}

function AboutSkeleton() {
  return (
    <Section size="wide" className="relative">
      <Eyebrow />
      <HeadingBlock narrow />
      <div className="mt-20 max-w-2xl space-y-3 md:mt-24 md:pl-[41.66%]">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
      </div>
      <div className="mt-28 space-y-8 border-y border-cream/10 py-8 md:mt-36">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-1/2 max-w-sm" />
        ))}
      </div>
    </Section>
  );
}

function ContactSkeleton() {
  return (
    <Section size="wide" className="border-t border-cream/10">
      <Eyebrow />
      <HeadingBlock narrow />
      <div className="mt-16 grid grid-cols-12 gap-8 md:mt-20">
        <div className="col-span-12 space-y-6 md:col-span-5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="mt-10 h-9 w-56 rounded-full" />
        </div>
        <div className="col-span-12 space-y-6 md:col-span-6 md:col-start-7">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
      </div>
    </Section>
  );
}

function FooterSkeleton() {
  return (
    <footer className="border-t border-cream/10 bg-ink-950">
      <Container size="wide" className="py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-4">
          <Skeleton className="h-28 w-full lg:col-span-2" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="mt-16 h-4 w-full max-w-md" />
      </Container>
    </footer>
  );
}
