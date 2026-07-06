import { db } from '@/db'
import { siteSettings } from '@/db/schema'
import { siteConfig } from '@/data/site-config'
import { unstable_cache } from 'next/cache'

function formatImageUrl(url: string | null | undefined | unknown): string {
  if (typeof url !== 'string' || !url.trim()) return '';
  const cleanUrl = url.trim();
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('/')) return cleanUrl;
  return `/${cleanUrl}`;
}

export const getSiteSettings = unstable_cache(
  async () => {
  try {
    const settingsArray = await db.select().from(siteSettings).limit(1)
    const settings = settingsArray[0]

    // Parse footerData safely
    const footerDataRaw = settings?.footerData as Record<string, unknown> || {};
    const footerData = {
      ...footerDataRaw,
      footerLogoUrl: formatImageUrl(footerDataRaw.footerLogoUrl),
    };

    // Use DB data if available, otherwise fallback to siteConfig
    return {
      seo: {
        title: siteConfig.name,
        description: siteConfig.description,
        keywords: '',
      },
      navbarLinks: (settings?.navbarLinks as Record<string, unknown>[]) || [],
      footerData: footerData,
      contact: {
        logoUrl: formatImageUrl(settings?.logoUrl),
        faviconUrl: formatImageUrl(settings?.faviconUrl),
        mainPhone: settings?.mainPhone || siteConfig.phone,
        secondaryPhone: '',
        lineUrl: settings?.lineUrl || siteConfig.social.line.url,
        facebookUrl: settings?.facebookUrl || siteConfig.social.facebook?.url || '',
        googleMapsUrl: settings?.googleMapsUrl || siteConfig.googleMapsEmbed || '',
        workingHours: settings?.workingHours || '',
        holidayNotice: settings?.holidayNotice || '',
        companyAddress: settings?.companyAddress || '',
      },
      rawSettings: settings
    }
  } catch (error) {
    console.error('Error fetching site settings from DB:', error)
    // Absolute fallback
    return {
      seo: {
        title: siteConfig.name,
        description: siteConfig.description,
        keywords: '',
      },
      navbarLinks: [],
      footerData: {},
      contact: {
        logoUrl: '',
        mainPhone: siteConfig.phone,
        secondaryPhone: '',
        lineUrl: siteConfig.social.line.url,
        facebookUrl: siteConfig.social.facebook?.url || '',
        googleMapsUrl: siteConfig.googleMapsEmbed || '',
        workingHours: '',
        holidayNotice: '',
        companyAddress: '',
      },
      rawSettings: null
    }
  }
}, ['site-settings'], { tags: ['site-settings'], revalidate: 60 })
