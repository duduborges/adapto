import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/types';

export const alt = 'Adapto Software House — Vancouver, Canada';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const INK = '#221a1a';
const CREAM = '#fefefe';
const EMBER = '#c35622';

const kickers: Record<Locale, string> = {
  en: 'Custom systems · Websites · Automations · Dashboards',
  fr: 'Systèmes sur mesure · Sites web · Automatisations · Tableaux de bord',
};

// The mark's PNG has ~10% padding on every side, so a 340px box shows the
// "A" ~305px tall — inside the 340px disc, clear of the header and footer rows.
const MARK_SIZE = 340;
const DISC = 340;

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang === 'fr' ? 'fr' : 'en') as Locale;
  // Same words as the hero headline, so the preview and the page never drift
  const { hero } = await getDictionary(locale);

  const mark = await readFile(join(process.cwd(), 'public/logos/adapto-mark.png'));
  const markSrc = `data:image/png;base64,${mark.toString('base64')}`;

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

        {/* Headline + kicker on the left, the mark on the right */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 26, width: 700 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: locale === 'fr' ? 54 : 64,
                lineHeight: 1.06,
                letterSpacing: -1.5,
              }}
            >
              <div style={{ color: CREAM }}>{hero.title}</div>
              <div style={{ color: EMBER }}>{hero.titleAccent}</div>
            </div>
            <div style={{ fontSize: locale === 'fr' ? 20 : 26, color: CREAM, opacity: 0.6, whiteSpace: 'nowrap' }}>
              {kickers[locale]}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: DISC,
              height: DISC,
              position: 'relative',
            }}
          >
            {/* Soft ember disc behind the mark, echoing the site's bloom */}
            <div
              style={{
                display: 'flex',
                position: 'absolute',
                width: DISC,
                height: DISC,
                borderRadius: 999,
                backgroundImage: `linear-gradient(135deg, rgba(195,86,34,0.22), rgba(195,86,34,0.04))`,
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={markSrc}
              width={MARK_SIZE}
              height={MARK_SIZE}
              alt=""
              style={{ position: 'absolute', width: MARK_SIZE, height: MARK_SIZE }}
            />
          </div>
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
