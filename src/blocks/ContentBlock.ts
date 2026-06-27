import { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const ContentBlock: Block = {
  slug: 'content',
  labels: {
    singular: 'Content Section',
    plural: 'Content Sections',
  },
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({}),
      required: true,
      label: 'Content',
    },
  ],
}
