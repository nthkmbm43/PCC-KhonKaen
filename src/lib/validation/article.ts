import { z } from "zod";

const nonEmptyLines = z.array(z.string().trim().min(1)).min(1);

export const articleDocumentSchema = z.object({
  slug: z.string().trim().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug ต้องเป็นภาษาอังกฤษตัวเล็ก ตัวเลข และขีดกลางเท่านั้น"),
  title: z.string().trim().min(1).max(240),
  seoTitle: z.string().trim().min(1).max(240),
  description: z.string().trim().min(1).max(500),
  excerpt: z.string().trim().min(1).max(700),
  category: z.string().trim().min(1).max(100),
  publishedAt: z.string().date(),
  updatedAt: z.string().date(),
  readTime: z.string().trim().min(1).max(40),
  image: z.string().trim().min(1).max(1000),
  imageAlt: z.string().trim().min(1).max(300),
  product: z.object({
    label: z.string().trim().min(1).max(200),
    href: z.string().trim().min(1).max(500),
  }),
  summary: nonEmptyLines,
  sections: z.array(z.object({
    heading: z.string().trim().min(1).max(240),
    paragraphs: nonEmptyLines,
    bullets: z.array(z.string().trim().min(1)).optional(),
    callout: z.string().trim().optional(),
    images: z.array(z.object({
      src: z.string().trim().min(1).max(1000),
      alt: z.string().trim().min(1).max(300),
      caption: z.string().trim().max(500).optional(),
    })).max(12).optional(),
  })).min(1),
  checklist: nonEmptyLines,
  faq: z.array(z.object({
    question: z.string().trim().min(1).max(300),
    answer: z.string().trim().min(1).max(2000),
  })).min(1),
});

export const articlePayloadSchema = z.object({
  status: z.enum(["draft", "published"]).default("published"),
  article: articleDocumentSchema,
});

export type ArticlePayload = z.infer<typeof articlePayloadSchema>;
