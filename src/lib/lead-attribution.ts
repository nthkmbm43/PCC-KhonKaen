export const ATTRIBUTION_STORAGE_KEY = 'pcc_lead_attribution_v1';

export type LeadAttribution = {
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  clickId?: string;
};

export function readLeadAttribution(): LeadAttribution {
  if (typeof window === 'undefined') return {};

  try {
    return JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) || '{}') as LeadAttribution;
  } catch {
    return {};
  }
}

export function trackLeadEvent(eventName: string, parameters: Record<string, string> = {}) {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', eventName, parameters);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...parameters });
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (command: 'event', eventName: string, parameters: Record<string, string>) => void;
  }
}
