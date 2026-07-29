import { asc, desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { documents as documentRecords } from '@/db/schema';
import { starterDocuments, type DownloadDocument } from '@/data/documents';
import { downloadDocumentSchema } from '@/lib/validation/document';

export type EditableDownloadDocument = DownloadDocument & {
  databaseId?: string;
  downloadCount: number;
  status: 'draft' | 'published';
  source: 'starter' | 'database';
};

function parseRecord(record: typeof documentRecords.$inferSelect): EditableDownloadDocument | null {
  const parsed = downloadDocumentSchema.safeParse(record.data);
  if (!parsed.success) {
    console.error(`Invalid download document stored for ${record.slug}`, parsed.error.flatten());
    return null;
  }
  return {
    ...parsed.data,
    databaseId: record.id,
    downloadCount: record.downloadCount,
    status: record.workflowState === 'published' ? 'published' : 'draft',
    source: 'database',
  };
}

async function getDatabaseDocuments() {
  try {
    return await db.select().from(documentRecords).orderBy(asc(documentRecords.sortOrder), desc(documentRecords.updatedAt));
  } catch (error) {
    console.error('Unable to read document library; using starter documents', error);
    return [];
  }
}

export async function getAdminDocuments(): Promise<EditableDownloadDocument[]> {
  const records = await getDatabaseDocuments();
  const overrides = new Set(records.map((record) => record.slug));
  const database = records.map(parseRecord).filter((item): item is EditableDownloadDocument => Boolean(item));
  const starter = starterDocuments
    .filter((item) => !overrides.has(item.slug))
    .map((item) => ({ ...item, downloadCount: 0, status: 'published' as const, source: 'starter' as const }));
  return [...database, ...starter].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getPublishedDocuments() {
  const documents = await getAdminDocuments();
  return documents.filter((item) => item.status === 'published');
}

export async function getEditableDocument(slug: string) {
  const documents = await getAdminDocuments();
  return documents.find((item) => item.slug === slug);
}

export async function getDatabaseDocumentBySlug(slug: string) {
  const [record] = await db.select().from(documentRecords).where(eq(documentRecords.slug, slug)).limit(1);
  return record;
}
