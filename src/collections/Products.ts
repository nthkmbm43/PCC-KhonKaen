import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'Slug (URL Path)',
    },
    {
      name: 'shortTitle',
      type: 'text',
      label: 'Short Title',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Meta Description',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
    },
    {
      name: 'keywords',
      type: 'array',
      label: 'Keywords',
      fields: [
        {
          name: 'keyword',
          type: 'text',
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      fields: [
        {
          name: 'feature',
          type: 'text',
        },
      ],
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Sections',
      fields: [
        {
          name: 'sectionId',
          type: 'text',
          label: 'ID',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
        },
        {
          name: 'content',
          type: 'textarea',
          label: 'Content',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
        },
        {
          name: 'bullets',
          type: 'array',
          label: 'Bullets',
          fields: [
            {
              name: 'bullet',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
}
