import React from 'react'
import HeroBlock from './HeroBlock'
import ContentBlock from './ContentBlock'
import CallToActionBlock from './CallToActionBlock'

const blockComponents = {
  hero: HeroBlock,
  content: ContentBlock,
  callToAction: CallToActionBlock,
}

export default function RenderBlocks({ layout }: { layout: any[] }) {
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
