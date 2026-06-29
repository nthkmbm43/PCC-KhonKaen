import { pgTable, text, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';

export const pages = pgTable('pages', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: jsonb('content').default('[]'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords'),
  ogImage: text('og_image'),
  status: text('status', { enum: ['draft', 'published'] }).default('published'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const siteSettings = pgTable('site_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  logoUrl: text('logo_url'),
  faviconUrl: text('favicon_url'),
  navbarLinks: jsonb('navbar_links').default('[]'),
  footerData: jsonb('footer_data').default('{}'),
  mainPhone: text('main_phone'),
  lineUrl: text('line_url'),
  googleMapsUrl: text('google_maps_url'),
  facebookUrl: text('facebook_url'),
  vercelDeployHookUrl: text('vercel_deploy_hook_url'),
  customHeadCode: text('custom_head_code'),
  customBodyCode: text('custom_body_code'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const admins = pgTable('admins', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  shortTitle: text('short_title').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  content: jsonb('content').default('[]'),
  image: text('image'),
  category: text('category').default('general'),
  isFeatured: text('is_featured').default('false'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords'),
  ogImage: text('og_image'),
  status: text('status', { enum: ['draft', 'published'] }).default('published'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
