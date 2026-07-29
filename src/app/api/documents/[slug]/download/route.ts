import { eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { documents } from '@/db/schema';
import { getEditableDocument } from '@/lib/repositories/document';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const document = await getEditableDocument(slug);
  if (!document || document.status !== 'published') {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  try {
    await db.update(documents)
      .set({ downloadCount: sql`${documents.downloadCount} + 1` })
      .where(eq(documents.slug, slug));
  } catch (error) {
    console.error('Unable to increment document download count', error);
  }

  return NextResponse.redirect(new URL(document.fileUrl, request.url), 307);
}
