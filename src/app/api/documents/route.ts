import { auth } from '@/auth';
import { db } from '@/db';
import { documents } from '@/db/schema';
import { requireApiPermission } from '@/lib/auth/api';
import { logAudit } from '@/lib/audit';
import { downloadDocumentPayloadSchema } from '@/lib/validation/document';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { response } = await requireApiPermission(new URL(request.url).pathname);
  if (response) return response;

  const parsed = downloadDocumentPayloadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'ข้อมูลเอกสารไม่ครบหรือรูปแบบไม่ถูกต้อง', details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { document, status } = parsed.data;
    const [created] = await db.insert(documents).values({
      slug: document.slug,
      title: document.title,
      category: document.category,
      workflowState: status,
      data: document,
      sortOrder: document.sortOrder,
    }).returning();
    await logAudit({ session, action: 'CREATE', resource: 'document', resourceId: created.id, afterState: created });
    revalidatePath('/downloads');
    revalidatePath('/sitemap.xml');
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating document', error);
    const code = (error as { code?: string })?.code;
    return NextResponse.json({ error: code === '23505' ? 'มีเอกสารที่ใช้ URL Slug นี้แล้ว' : 'ไม่สามารถสร้างเอกสารได้' }, { status: code === '23505' ? 409 : 500 });
  }
}
