import { z } from 'zod';

export const downloadDocumentSchema = z.object({
  slug: z.string().trim().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(240),
  description: z.string().trim().min(1).max(800),
  category: z.enum(['catalog', 'specification', 'certificate', 'company-profile', 'installation-guide']),
  fileUrl: z.string().trim().min(1).max(1500).refine((value) => value.startsWith('/') || value.startsWith('https://')),
  originalName: z.string().trim().min(1).max(240),
  fileSize: z.number().int().nonnegative().max(50 * 1024 * 1024),
  pageCount: z.number().int().positive().max(1000).optional(),
  relatedProduct: z.object({
    label: z.string().trim().min(1).max(200),
    href: z.string().trim().min(1).max(500),
  }).optional(),
  sourceLabel: z.string().trim().max(240).optional(),
  note: z.string().trim().max(1000).optional(),
  sortOrder: z.number().int().min(0).max(10000).default(0),
  updatedAt: z.string().date(),
});

export const downloadDocumentPayloadSchema = z.object({
  status: z.enum(['draft', 'published']).default('published'),
  document: downloadDocumentSchema,
});

export type DownloadDocumentPayload = z.infer<typeof downloadDocumentPayloadSchema>;
