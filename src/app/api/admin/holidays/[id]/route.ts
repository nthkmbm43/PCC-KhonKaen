import { db } from '@/db';
import { businessHolidayClosures } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { requireApiPermission } from '@/lib/auth/api';

export const dynamic = 'force-dynamic';

// PUT: update a holiday
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { response } = await requireApiPermission(new URL(req.url).pathname);
  if (response) return response;

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, startDate, endDate, isActive } = body;

    if (!title || !startDate || !endDate) {
      return NextResponse.json({ success: false, error: 'title, startDate, endDate required' }, { status: 400 });
    }

    const updated = await db
      .update(businessHolidayClosures)
      .set({ title, startDate, endDate, isActive })
      .where(eq(businessHolidayClosures.id, id))
      .returning();

    return NextResponse.json({ success: true, holiday: updated[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// DELETE: remove a holiday
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { response } = await requireApiPermission(new URL(req.url).pathname);
  if (response) return response;

  try {
    const { id } = await params;
    await db.delete(businessHolidayClosures).where(eq(businessHolidayClosures.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
