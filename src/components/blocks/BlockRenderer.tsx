import React from 'react'
import { BlockErrorBoundary } from './BlockErrorBoundary'
import HeroBlock from './HeroBlock'
import RichTextBlock from './RichTextBlock'
import ImageBlock from './ImageBlock'
import CtaBlock from './CtaBlock'
import FeatureGridBlock from './FeatureGridBlock'
import MapBlock from './MapBlock'

const blockComponents = {
  hero: HeroBlock,
  richText: RichTextBlock,
  image: ImageBlock,
  cta: CtaBlock,
  featureGrid: FeatureGridBlock,
  mapBlock: MapBlock,
  // Support existing payload types
  homeHero: HeroBlock, 
  content: RichTextBlock,
}

export default function BlockRenderer({ layout }: { layout: Record<string, unknown>[] }) {
  if (!layout || !Array.isArray(layout)) return null

  return (
    <>
      {layout.map((block, i) => {
        // Handle both type and blockType for backward compatibility
        const type = block.type || block.blockType
        const BlockComponent = blockComponents[type as keyof typeof blockComponents] as React.ComponentType<{ data: Record<string, unknown> }>

        if (BlockComponent) {
          // Pass the data explicitly to match the requirement <HeroBlock data="{blockData}"/>
          return (
            <BlockErrorBoundary key={i} blockName={type as string}>
              <BlockComponent data={block} />
            </BlockErrorBoundary>
          )
        }

        console.warn(`Block component for type "${type}" not found.`)
        return null
      })}
    </>
  )
}
