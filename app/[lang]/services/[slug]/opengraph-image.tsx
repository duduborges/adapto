import { ImageResponse } from 'next/og';
import { ADAPTO_MARK_PNG_DATA_URL } from '@/lib/brand/adapto-mark';
import { outfitFonts } from '@/lib/brand/outfit-og';
import { getServiceContent, isServiceSlug } from '@/lib/services';
import type { Locale } from '@/types';

// Same composition as the home page's image (app/[lang]/opengraph-image.tsx),
// with the service's own headline.
export const alt = 'Adapto Software House — Vancouver, Canada';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const INK = '#221a1a';
const CREAM = '#fefefe';
const EMBER = '#c35622';
const MARK_SIZE = 300;
const DISC = 300;

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = (lang === 'fr' ? 'fr' : 'en') as Locale;
  const { ui, services } = await getServiceContent(locale);
  const content = services[isServiceSlug(slug) ? slug : 'custom-software'];
  const long = content.title.length + content.titleAccent.length > 48;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'Outfit',
          backgroundImage: `linear-gradient(135deg, ${INK} 0%, ${INK} 50%, #3d2823 100%)`,
          padding: '72px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
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
          <div style={{ width: 18, height: 18, borderRadius: 999, background: EMBER }} />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: CREAM,
              opacity: 0.75,
            }}
          >
            {`Adapto · ${ui.service}`}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 26, width: 720 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: long ? 54 : 64,
                lineHeight: 1.06,
                fontWeight: 600,
                letterSpacing: -1.5,
              }}
            >
              <div style={{ color: CREAM }}>{content.title}</div>
              <div style={{ color: EMBER }}>{content.titleAccent}</div>
            </div>
            <div style={{ fontSize: 24, color: CREAM, opacity: 0.6 }}>{ui.freeNote}</div>
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
              src={ADAPTO_MARK_PNG_DATA_URL}
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
    { ...size, fonts: outfitFonts() },
  );
}
