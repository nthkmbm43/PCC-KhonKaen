import { pgTable, text, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';

export const pages = pgTable('pages', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: jsonb('content').default('[]'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  status: text('status', { enum: ['draft', 'published'] }).default('published'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const siteSettings = pgTable('site_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  mainPhone: text('main_phone'),
  lineUrl: text('line_url'),
  googleMapsUrl: text('google_maps_url'),
  facebookUrl: text('facebook_url'),
  updatedAt: timestamp('updated_at').defaultNow(),
});
