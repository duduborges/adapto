import { ImageResponse } from 'next/og';
import type { Locale } from '@/types';

export const alt = 'Adapto Software House — Vancouver, Canada';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const INK = '#2a2021';
const CREAM = '#fefefe';
const EMBER = '#c35622';

const headlines: Record<Locale, string> = {
  en: 'Software that adapts to your business',
  fr: "Un logiciel qui s'adapte à votre entreprise",
};

const kickers: Record<Locale, string> = {
  en: 'Custom systems · Automations · Dashboards',
  fr: 'Systèmes sur mesure · Automatisations · Tableaux de bord',
};

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang === 'fr' ? 'fr' : 'en') as Locale;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          // Satori bands radial gradients and renders `filter: blur` as a hard
          // box — a linear gradient is the only warm wash it draws cleanly.
          backgroundImage: `linear-gradient(135deg, ${INK} 0%, ${INK} 50%, #3d2823 100%)`,
          padding: '72px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ember rule along the bottom edge — the brand's accent line.
            Satori needs explicit dimensions on absolutely positioned nodes. */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: size.width,
            height: 10,
            background: EMBER,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: EMBER,
            }}
          />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: CREAM,
              opacity: 0.75,
            }}
          >
            Adapto · Software House
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div
            style={{
              fontSize: 78,
              lineHeight: 1.05,
              color: CREAM,
              maxWidth: 940,
              letterSpacing: -2,
            }}
          >
            {headlines[locale]}
          </div>
          <div style={{ fontSize: 30, color: EMBER }}>{kickers[locale]}</div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 24,
            color: CREAM,
            opacity: 0.55,
          }}
        >
          <div>Vancouver, British Columbia · Canada</div>
          <div>adapto-sh.com</div>
        </div>
      </div>
    ),
    size,
  );
}
