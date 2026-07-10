import React from 'react'
import { BlockErrorBoundary } from './BlockErrorBoundary'
import HeroBlock from './HeroBlock'
import RichTextBlock from './RichTextBlock'
import ImageBlock from './ImageBlock'
import CtaBlock from './CtaBlock'
import FeatureGridBlock from './FeatureGridBlock'
import MapBlock from './MapBlock'
import StatsBlock from './StatsBlock'
import WhyUsBlock from './WhyUsBlock'
import ProcessBlock from './ProcessBlock'
import ContactFormBlock from './ContactFormBlock'
import ContactInfoBlock from './ContactInfoBlock'
import ContactSocialBlock from './ContactSocialBlock'
import BranchLocationsBlock from './BranchLocationsBlock'
import TestimonialBlock from './TestimonialBlock'
import ProductSpecBlock from './ProductSpecBlock'
import CustomCodeBlock from './CustomCodeBlock'

const blockComponents = {
  // Core blocks
  hero: HeroBlock,
  richText: RichTextBlock,
  image: ImageBlock,
  cta: CtaBlock,
  customCode: CustomCodeBlock,
  featureGrid: FeatureGridBlock,
  mapBlock: MapBlock,
  // New blocks (Phase 1)
  stats: StatsBlock,
  whyUs: WhyUsBlock,
  process: ProcessBlock,
  contactInfo: ContactInfoBlock,
  contactSocial: ContactSocialBlock,
  contactForm: ContactFormBlock,
  branchLocations: BranchLocationsBlock,
  testimonial: TestimonialBlock,
  productSpec: ProductSpecBlock,
  // Legacy aliases for backward compatibility
  homeHero: HeroBlock,
  content: RichTextBlock,
  text: RichTextBlock,
}

import { getBusinessStatus } from '@/lib/getBusinessStatus'

export default async function BlockRenderer({ layout }: { layout: Record<string, unknown>[] }) {
  if (!layout || !Array.isArray(layout)) return null

  const needsBusinessStatus = layout.some(b => 
    (b.type || b.blockType) === 'contactForm' || 
    (b.type || b.blockType) === 'branchLocations'
  );

  let status = null;
  if (needsBusinessStatus) {
    status = await getBusinessStatus().catch(() => null);
  }

  return (
    <>
      {layout.map((block, i) => {
        // Handle both type and blockType for backward compatibility
        const type = block.type || block.blockType
        const BlockComponent = blockComponents[type as keyof typeof blockComponents] as React.ComponentType<{ data: Record<string, unknown>, initialStatus?: any }>

        if (BlockComponent) {
          const isStatusAware = type === 'contactForm' || type === 'branchLocations';
          return (
            <BlockErrorBoundary key={i} blockName={type as string}>
              {isStatusAware ? (
                <BlockComponent data={block} initialStatus={status} />
              ) : (
                <BlockComponent data={block} />
              )}
            </BlockErrorBoundary>
          )
        }

        console.warn(`Block component for type "${type}" not found.`)
        return null
      })}
    </>
  )
}
