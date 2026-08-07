import { db } from '@/db';
import { documents } from '@/db/schema';
import { requireApiPermission } from '@/lib/auth/api';
import { logAudit } from '@/lib/audit';
import { downloadDocumentPayloadSchema } from '@/lib/validation/document';
import { eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { session, response } = await requireApiPermission(new URL(request.url).pathname);
  if (response) return response;

  const { slug } = await params;
  const parsed = downloadDocumentPayloadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'ข้อมูลเอกสารไม่ครบหรือรูปแบบไม่ถูกต้อง', details: parsed.error.flatten() }, { status: 400 });
  }
  if (parsed.data.document.slug !== slug) {
    return NextResponse.json({ error: 'ไม่สามารถเปลี่ยน URL Slug ของเอกสารเดิมได้' }, { status: 400 });
  }

  try {
    const before = await db.select().from(documents).where(eq(documents.slug, slug)).limit(1);
    const { document, status } = parsed.data;
    const [saved] = await db.insert(documents).values({
      slug,
      title: document.title,
      category: document.category,
      workflowState: status,
      data: document,
      sortOrder: document.sortOrder,
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: documents.slug,
      set: {
        title: document.title,
        category: document.category,
        workflowState: status,
        data: document,
        sortOrder: document.sortOrder,
        updatedAt: new Date(),
      },
    }).returning();
    await logAudit({ session, action: 'UPDATE', resource: 'document', resourceId: saved.id, beforeState: before[0], afterState: saved });
    revalidatePath('/downloads');
    revalidatePath('/sitemap.xml');
    revalidateTag('documents', { expire: 0 });
    return NextResponse.json(saved);
  } catch (error) {
    console.error('Error updating document', error);
    return NextResponse.json({ error: 'ไม่สามารถบันทึกเอกสารได้' }, { status: 500 });
  }
}
