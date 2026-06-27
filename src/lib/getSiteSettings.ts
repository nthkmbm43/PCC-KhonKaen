import { getPayload } from 'payload'
import config from '@/payload.config'
import { siteConfig } from '@/data/site-config'

export async function getSiteSettings() {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings' })

    // Use payload data if available, otherwise fallback to siteConfig
    return {
      seo: {
        title: settings.defaultMetaTitle || siteConfig.name,
        description: settings.defaultMetaDescription || siteConfig.description,
        keywords: settings.defaultKeywords || '',
      },
      contact: {
        mainPhone: settings.mainPhoneNumber || siteConfig.phone,
        secondaryPhone: settings.secondaryPhoneNumber || '',
        lineUrl: settings.lineUrl || siteConfig.social.line.url,
        facebookUrl: settings.facebookUrl || siteConfig.social.facebook?.url || '',
        googleMapsUrl: settings.googleMapsUrl || '',
      }
    }
  } catch (error) {
    console.error('Error fetching site settings from Payload:', error)
    // Absolute fallback
    return {
      seo: {
        title: siteConfig.name,
        description: siteConfig.description,
        keywords: '',
      },
      contact: {
        mainPhone: siteConfig.phone,
        secondaryPhone: '',
        lineUrl: siteConfig.social.line.url,
        facebookUrl: siteConfig.social.facebook?.url || '',
        googleMapsUrl: '',
      }
    }
  }
}
