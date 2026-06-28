import { db } from '@/db'
import { siteSettings } from '@/db/schema'
import { siteConfig } from '@/data/site-config'

export async function getSiteSettings() {
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
      navbarLinks: (settings?.navbarLinks as any[]) || [],
      footerData: settings?.footerData || {},
      contact: {
        logoUrl: settings?.logoUrl || '',
        faviconUrl: settings?.faviconUrl || '',
        mainPhone: settings?.mainPhone || siteConfig.phone,
        secondaryPhone: '',
        lineUrl: settings?.lineUrl || siteConfig.social.line.url,
        facebookUrl: settings?.facebookUrl || siteConfig.social.facebook?.url || '',
        googleMapsUrl: settings?.googleMapsUrl || '',
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
        googleMapsUrl: '',
      },
      rawSettings: null
    }
  }
}
