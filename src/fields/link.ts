import type { Field } from 'payload'

export type LinkType = 'reference' | 'custom'

export type LinkOptions = {
  appearances?: string[] | false
  disableLabel?: boolean
  overrides?: Record<string, unknown>
}

export const link = ({ appearances, disableLabel = false, overrides = {} }: LinkOptions = {}): Field => {
  const linkResult: Field = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
      ...(overrides?.admin || {}),
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
            ],
            defaultValue: 'reference',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
          },
          {
            name: 'newTab',
            label: 'Open in new tab',
            type: 'checkbox',
            admin: {
              width: '50%',
              style: {
                alignSelf: 'flex-end',
              },
            },
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      label: 'Document to link to',
      type: 'relationship',
      relationTo: ['pages'],
      required: true,
      maxDepth: 1,
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.type === 'reference',
      },
    },
    {
      name: 'url',
      label: 'Custom URL',
      type: 'text',
      required: true,
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.type === 'custom',
      },
    },
  ]

  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
        width: '50%',
      },
    }))

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [
      {
        label: 'Primary',
        value: 'primary',
      },
      {
        label: 'Secondary',
        value: 'secondary',
      },
      {
        label: 'Outline',
        value: 'outline',
      },
    ]

    if (appearances) {
      appearanceOptionsToUse = appearanceOptionsToUse.filter((appearance) => appearances.includes(appearance.value))
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      defaultValue: 'primary',
      options: appearanceOptionsToUse,
      admin: {
        description: 'Choose how the link should be rendered.',
      },
    })
  }

  // Deep merge overrides
  return Object.assign(linkResult, overrides)
}
