'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import {
  ATTRIBUTION_STORAGE_KEY,
  type LeadAttribution,
  readLeadAttribution,
  trackLeadEvent,
} from '@/lib/lead-attribution';

const rawMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
const measurementId = /^G-[A-Z0-9]+$/i.test(rawMeasurementId) ? rawMeasurementId : '';

function captureFirstTouch(): LeadAttribution {
  const existing = readLeadAttribution();
  const search = new URLSearchParams(window.location.search);
  const current: LeadAttribution = {
    landingPage: `${window.location.pathname}${window.location.search}`.slice(0, 1000),
    referrer: document.referrer.slice(0, 1000),
    utmSource: search.get('utm_source')?.slice(0, 200),
    utmMedium: search.get('utm_medium')?.slice(0, 200),
    utmCampaign: search.get('utm_campaign')?.slice(0, 200),
    utmContent: search.get('utm_content')?.slice(0, 200),
    utmTerm: search.get('utm_term')?.slice(0, 200),
    clickId: (search.get('gclid') || search.get('fbclid') || '')?.slice(0, 300),
  };

  const attribution = Object.keys(existing).length ? existing : current;
  window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  return attribution;
}

export default function LeadAnalytics() {
  useEffect(() => {
    const attribution = captureFirstTouch();

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.href.toLowerCase();
      const shared = {
        page_path: window.location.pathname,
        lead_source: attribution.utmSource || 'direct',
      };

      if (href.startsWith('tel:')) {
        trackLeadEvent('click_phone', shared);
      } else if (href.includes('line.me') || href.includes('lin.ee')) {
        trackLeadEvent('click_line', shared);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      {measurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-config" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};window.gtag('js',new Date());window.gtag('config','${measurementId}',{send_page_view:true});`}
          </Script>
        </>
      ) : null}
    </>
  );
}
