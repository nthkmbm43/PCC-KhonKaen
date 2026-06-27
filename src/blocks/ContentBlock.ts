import { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { link } from '../fields/link'

export const ContentBlock: Block = {
  slug: 'content',
  labels: {
    singular: 'Content Section',
    plural: 'Content Sections',
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'size',
          type: 'select',
          defaultValue: 'oneThird',
          options: [
            { label: 'One Third', value: 'oneThird' },
            { label: 'Half', value: 'half' },
            { label: 'Two Thirds', value: 'twoThirds' },
            { label: 'Full', value: 'full' },
          ],
        },
        {
          name: 'richText',
          type: 'richText',
          editor: lexicalEditor({}),
          label: false,
        },
        {
          name: 'enableLink',
          type: 'checkbox',
        },
        link({
          overrides: {
            admin: {
              condition: (_: any, siblingData: any) => Boolean(siblingData?.enableLink),
            },
          },
        }),
      ],
    },
    // Keep for backward compatibility with existing data
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({}),
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.columns || siblingData.columns.length === 0,
        description: 'Legacy content (Please use columns instead for new layouts)',
      },
    },
  ],
}
