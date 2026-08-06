import { pgTable, text, timestamp, jsonb, uuid, pgEnum, index, integer, uniqueIndex, date, boolean, numeric } from 'drizzle-orm/pg-core';

export const pageTemplateEnum = pgEnum('page_template', [
  'default',
  'landing',
  'service',
  'product',
  'contact',
  'about',
]);

export const auditActionEnum = pgEnum('audit_action', ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'DEPLOY', 'UPLOAD', 'SEARCH', 'ROLLBACK', 'GENERATE']);
export const auditResourceEnum = pgEnum('audit_resource', ['product', 'page', 'user', 'setting', 'upload', 'richmenu', 'deploy', 'media', 'seo', 'revision', 'document']);

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

export const leadStatusEnum = pgEnum('lead_status', ['new', 'contacted', 'qualified', 'closed', 'spam']);

export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  leadCode: text('lead_code').unique(),
  teamCode: text('team_code').default('khon-kaen-new-team').notNull(),
  sourceHost: text('source_host'),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  project: text('project'),
  message: text('message'),
  province: text('province'),
  district: text('district'),
  estimatedLength: text('estimated_length'),
  levelDifference: text('level_difference'),
  waterCondition: text('water_condition'),
  accessCondition: text('access_condition'),
  nearbyLoad: text('nearby_load'),
  status: leadStatusEnum('status').default('new').notNull(),
  handoffStatus: text('handoff_status').default('pending').notNull(),
  handedOffAt: timestamp('handed_off_at', { withTimezone: true }),
  confirmedAreaSqm: numeric('confirmed_area_sqm', { precision: 12, scale: 2 }),
  saleValue: numeric('sale_value', { precision: 14, scale: 2 }),
  commissionRate: numeric('commission_rate', { precision: 6, scale: 2 }),
  commissionAmount: numeric('commission_amount', { precision: 14, scale: 2 }),
  salesNotes: text('sales_notes'),
  landingPage: text('landing_page'),
  referrer: text('referrer'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  utmContent: text('utm_content'),
  utmTerm: text('utm_term'),
  clickId: text('click_id'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  statusCreatedAtIdx: index('leads_status_created_at_idx').on(table.status, table.createdAt),
  createdAtIdx: index('leads_created_at_idx').on(table.createdAt),
  utmSourceIdx: index('leads_utm_source_idx').on(table.utmSource),
  teamCodeCreatedAtIdx: index('leads_team_code_created_at_idx').on(table.teamCode, table.createdAt),
  handoffStatusCreatedAtIdx: index('leads_handoff_status_created_at_idx').on(table.handoffStatus, table.createdAt),
}));

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

// Article records are database-backed overrides for the editorial starter
// content in src/data/articles.ts. Keeping the complete article document in
// JSONB lets the CMS evolve its section structure without a migration for
// every new block type, while the indexed columns support admin listing and
// publication filtering.
export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  workflowState: workflowStateEnum('workflow_state').default('published').notNull(),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  statusUpdatedAtIdx: index('articles_status_updated_at_idx').on(table.workflowState, table.updatedAt),
  categoryIdx: index('articles_category_idx').on(table.category),
}));

export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  workflowState: workflowStateEnum('workflow_state').default('published').notNull(),
  data: jsonb('data').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  downloadCount: integer('download_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  statusSortIdx: index('documents_status_sort_idx').on(table.workflowState, table.sortOrder),
  categoryIdx: index('documents_category_idx').on(table.category),
}));

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
