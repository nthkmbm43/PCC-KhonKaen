import { pgTable, text, timestamp, jsonb, uuid, pgEnum, index, integer, uniqueIndex, date, boolean } from 'drizzle-orm/pg-core';

export const pageTemplateEnum = pgEnum('page_template', [
  'default',
  'landing',
  'service',
  'product',
  'contact',
  'about',
]);

export const auditActionEnum = pgEnum('audit_action', ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'DEPLOY', 'UPLOAD', 'SEARCH', 'ROLLBACK', 'GENERATE']);
export const auditResourceEnum = pgEnum('audit_resource', ['product', 'page', 'user', 'setting', 'upload', 'richmenu', 'deploy', 'media', 'seo', 'revision']);

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id'),
  action: auditActionEnum('action').notNull(),
  resource: auditResourceEnum('resource').notNull(),
  resourceId: text('resource_id'),
  beforeState: jsonb('before_state'),
  afterState: jsonb('after_state'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  requestId: text('request_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    userIdIdx: index('audit_user_id_idx').on(table.userId),
    resourceIdx: index('audit_resource_idx').on(table.resource),
    resourceIdIdx: index('audit_resource_id_idx').on(table.resourceId),
    actionIdx: index('audit_action_idx').on(table.action),
    createdAtIdx: index('audit_created_at_idx').on(table.createdAt),
  };
});

export const mediaDeleteStatusEnum = pgEnum('delete_status', ['ACTIVE', 'PENDING_DELETE', 'DELETED', 'FAILED']);

export const mediaFiles = pgTable('media_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  filename: text('filename').notNull(),
  originalName: text('original_name').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  width: integer('width'),
  height: integer('height'),
  blobUrl: text('blob_url').notNull(),
  alt: text('alt'),
  createdBy: text('created_by'),
  deleteStatus: mediaDeleteStatusEnum('delete_status').default('ACTIVE'),
  cleanupAttempts: integer('cleanup_attempts').default(0),
  lastCleanupError: text('last_cleanup_error'),
  lastCleanupAt: timestamp('last_cleanup_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    filenameIdx: index('media_filename_idx').on(table.filename),
    altIdx: index('media_alt_idx').on(table.alt),
    deleteStatusIdx: index('media_delete_status_idx').on(table.deleteStatus),
  };
});

export const seoResourceTypeEnum = pgEnum('seo_resource_type', ['page', 'product']);

export const seoMetadata = pgTable('seo_metadata', {
  id: uuid('id').defaultRandom().primaryKey(),
  resourceType: seoResourceTypeEnum('resource_type').notNull(), // 'page' | 'product'
  resourceId: uuid('resource_id').notNull(),
  title: text('title'),
  description: text('description'),
  keywords: text('keywords'),
  canonical: text('canonical'),
  ogImage: text('og_image'),
  twitterImage: text('twitter_image'),
  robots: text('robots').default('index, follow'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    resourceIdx: index('seo_resource_idx').on(table.resourceType, table.resourceId),
    uniqueResource: uniqueIndex('seo_unique_resource_idx').on(table.resourceType, table.resourceId),
  };
});

export const workflowStateEnum = pgEnum('workflow_state', ['draft', 'review', 'published', 'archived']);

export const revisions = pgTable('revisions', {
  id: uuid('id').defaultRandom().primaryKey(),
  resourceType: text('resource_type').notNull(),
  resourceId: uuid('resource_id').notNull(),
  version: integer('version').notNull(),
  data: jsonb('data').notNull(),
  createdBy: text('created_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    uniqueResourceVersion: index('unique_resource_version_idx').on(table.resourceType, table.resourceId, table.version), // Unique constraint handled in migration via UNIQUE INDEX
  };
});

export const pages = pgTable('pages', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: jsonb('content').default('[]'),
  
  // Legacy SEO columns (to be contracted later)
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords'),
  ogImage: text('og_image'),
  
  status: text('status', { enum: ['draft', 'published'] }).default('published'), // Legacy status
  
  // New workflow columns
  template: pageTemplateEnum('template').default('default'),
  workflowState: workflowStateEnum('workflow_state').default('published'),
  previewTokenHash: text('preview_token_hash'),
  previewExpiresAt: timestamp('preview_expires_at', { withTimezone: true }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  
  // Auditing
  createdBy: uuid('created_by'),
  updatedBy: uuid('updated_by'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    createdAtIdx: index('pages_created_at_idx').on(table.createdAt),
  };
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
  tiktokUrl: text('tiktok_url'),
  workingHours: text('working_hours'),
  holidayNotice: text('holiday_notice'),
  companyAddress: text('company_address'),
  vercelDeployHookUrl: text('vercel_deploy_hook_url'),
  customHeadCode: text('custom_head_code'),
  customBodyCode: text('custom_body_code'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const businessHolidayClosures = pgTable('business_holiday_closures', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
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
  imageLayout: text('image_layout', { enum: ['normal', 'full-width'] }).default('normal'),
  category: text('category').default('general'),
  badge: text('badge'), // e.g. 'hot', 'new', or null
  isFeatured: text('is_featured').default('false'),
  highlights: jsonb('highlights').default('[]'),
  sortOrder: integer('sort_order').default(0),
  
  // Legacy SEO columns
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords'),
  ogImage: text('og_image'),
  
  status: text('status', { enum: ['draft', 'published'] }).default('published'), // Legacy status
  
  // New workflow columns
  workflowState: workflowStateEnum('workflow_state').default('published'),
  previewTokenHash: text('preview_token_hash'),
  previewExpiresAt: timestamp('preview_expires_at', { withTimezone: true }),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    statusCreatedAtIdx: index('products_status_created_at_idx').on(table.status, table.createdAt),
    createdAtIdx: index('products_created_at_idx').on(table.createdAt),
  };
});

export const lineRichMenus = pgTable('line_rich_menus', {
  id: uuid('id').defaultRandom().primaryKey(),
  imageUrl: text('image_url').notNull(),
  actionA: text('action_a'),
  actionB: text('action_b'),
  actionC: text('action_c'),
  actionD: text('action_d'),
  actionE: text('action_e'),
  actionF: text('action_f'),
  richMenuId: text('rich_menu_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
