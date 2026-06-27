import { Block } from 'payload'
import { link } from '../fields/link'

export const CallToActionBlock: Block = {
  slug: 'callToAction',
  labels: {
    singular: 'Call To Action',
    plural: 'Calls To Action',
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      label: 'Headline',
    },
    {
      name: 'subheadline',
      type: 'textarea',
      label: 'Subheadline',
    },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'navy',
      options: [
        { label: 'Corporate Navy', value: 'navy' },
        { label: 'Corporate Amber', value: 'amber' },
        { label: 'Light/White', value: 'light' },
      ],
      required: true,
    },
    {
      name: 'links',
      type: 'array',
      label: 'Links (New Format)',
      minRows: 1,
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
      label: 'Buttons (Legacy)',
      minRows: 1,
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
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
          ],
        },
      ],
    },
  ],
}
