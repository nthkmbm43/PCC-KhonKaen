import React from 'react'
import HeroBlock from './HeroBlock'
import ContentBlock from './ContentBlock'
import CallToActionBlock from './CallToActionBlock'
import { MediaBlock } from './MediaBlock'
import HomeHeroBlock from './HomeHeroBlock'
import TrustBannerBlock from './TrustBannerBlock'
import ServicesGridBlock from './ServicesGridBlock'
import PortfolioGridBlock from './PortfolioGridBlock'
import FAQBlock from './FAQBlock'
import CTABannerBlock from './CTABannerBlock'

import AboutHeroBlock from './AboutHeroBlock'
import AboutContentBlock from './AboutContentBlock'
import AboutFeatureGridBlock from './AboutFeatureGridBlock'
import ContactInfoBlock from './ContactInfoBlock'
import ContactSocialBlock from './ContactSocialBlock'
import PortfolioFullGridBlock from './PortfolioFullGridBlock'
import CustomCodeBlock from './CustomCodeBlock'
import TextBlock from './TextBlock'
import ImageBlock from './ImageBlock'
import CtaBlock from './CtaBlock'

const blockComponents = {
  hero: HeroBlock,
  content: ContentBlock,
  callToAction: CallToActionBlock,
  mediaBlock: MediaBlock,
  homeHero: HomeHeroBlock,
  trustBanner: TrustBannerBlock,
  servicesGrid: ServicesGridBlock,
  portfolioGrid: PortfolioGridBlock,
  faqSection: FAQBlock,
  ctaBanner: CTABannerBlock,
  aboutHero: AboutHeroBlock,
  aboutContent: AboutContentBlock,
  aboutFeatureGrid: AboutFeatureGridBlock,
  contactInfo: ContactInfoBlock,
  contactSocial: ContactSocialBlock,
  portfolioFullGrid: PortfolioFullGridBlock,
  customCode: CustomCodeBlock,
  text: TextBlock,
  image: ImageBlock,
  cta: CtaBlock,
}

export default function RenderBlocks({ layout }: { layout: Record<string, unknown>[] }) {
  if (!layout || !Array.isArray(layout)) return null

  return (
    <>
      {layout.map((block, i) => {
        const BlockComponent = blockComponents[block.blockType as keyof typeof blockComponents]

        if (BlockComponent) {
          return <BlockComponent key={i} {...block} />
        }

        return null
      })}
    </>
  )
}
