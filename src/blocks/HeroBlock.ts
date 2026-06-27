import { Block } from 'payload'
import { link } from '../fields/link'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Main Heading',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
      required: true,
    },
    {
      name: 'links',
      type: 'array',
      label: 'Call to Action Links (New Format)',
      minRows: 0,
      maxRows: 2,
      fields: [
        link({
          appearances: ['primary', 'secondary'],
        }),
      ],
    },
    {
      name: 'buttons',
      type: 'array',
      label: 'Call to Action Buttons (Legacy)',
      minRows: 0,
      maxRows: 2,
      admin: {
        condition: (data: any, siblingData: any) => !data?.links || data.links.length === 0,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'style',
          type: 'select',
          required: true,
          defaultValue: 'primary',
          options: [
            { label: 'Primary (Amber)', value: 'primary' },
            { label: 'Secondary (Navy Outline)', value: 'secondary' },
          ],
        },
      ],
    },
  ],
}
