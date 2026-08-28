'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { CONSENT_EVENT, readConsent, type ConsentValue } from '@/lib/consent';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Speed Insights is cookieless and anonymous, so it runs unconditionally.
 * GA4 only mounts once consent is granted, with Consent Mode v2 signals set
 * before the first hit.
 */
export function Analytics() {
  const [consent, setConsent] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    const onChange = (e: Event) =>
      setConsent((e as CustomEvent<ConsentValue | null>).detail);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  const gaEnabled = Boolean(GA_ID) && consent === 'granted';

  return (
    <>
      <SpeedInsights />
      {gaEnabled && (
        <>
          <Script
            id="ga-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied'
              });
              gtag('consent', 'update', { analytics_storage: 'granted' });
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
    </>
  );
}
