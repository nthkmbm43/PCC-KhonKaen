import { db } from '@/db'
import { siteSettings } from '@/db/schema'
import { siteConfig } from '@/data/site-config'
import { unstable_cache } from 'next/cache'

export const getSiteSettings = unstable_cache(
  async () => {
  try {
    const settingsArray = await db.select().from(siteSettings).limit(1)
    const settings = settingsArray[0]

    // Use DB data if available, otherwise fallback to siteConfig
    return {
      seo: {
        title: siteConfig.name,
        description: siteConfig.description,
        keywords: '',
      },
      navbarLinks: (settings?.navbarLinks as Record<string, unknown>[]) || [],
      footerData: settings?.footerData || {},
      contact: {
        logoUrl: settings?.logoUrl || '',
        faviconUrl: settings?.faviconUrl || '',
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
