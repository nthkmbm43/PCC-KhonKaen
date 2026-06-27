import { Block } from 'payload'

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
      name: 'buttons',
      type: 'array',
      label: 'Buttons',
      minRows: 1,
      maxRows: 2,
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
