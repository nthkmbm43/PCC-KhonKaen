import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { requireApiPermission } from '@/lib/auth/api';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

const optionalNumber = z.union([
  z.literal(''),
  z.string().trim().regex(/^\d+(\.\d{1,2})?$/).max(20),
]).optional().default('');

const updateSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'closed', 'spam']),
  handoffStatus: z.enum(['pending', 'handed_off', 'quoted', 'won', 'lost']),
  confirmedAreaSqm: optionalNumber,
  saleValue: optionalNumber,
  commissionRate: optionalNumber,
  commissionAmount: optionalNumber,
  salesNotes: z.string().trim().max(5000).optional().default(''),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { response } = await requireApiPermission(new URL(request.url).pathname);
  if (response) return response;

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'ข้อมูลติดตามลูกค้าไม่ถูกต้อง' }, { status: 400 });
  }

  const { id } = await context.params;
  const current = await db.select({ handoffStatus: leads.handoffStatus }).from(leads).where(eq(leads.id, id)).limit(1);
  if (!current[0]) return NextResponse.json({ error: 'ไม่พบข้อมูลลูกค้า' }, { status: 404 });

  const data = parsed.data;
  const [updated] = await db.update(leads).set({
    status: data.status,
    handoffStatus: data.handoffStatus,
    handedOffAt: data.handoffStatus !== 'pending' && current[0].handoffStatus === 'pending' ? new Date() : undefined,
    confirmedAreaSqm: data.confirmedAreaSqm || null,
    saleValue: data.saleValue || null,
    commissionRate: data.commissionRate || null,
    commissionAmount: data.commissionAmount || null,
    salesNotes: data.salesNotes || null,
    updatedAt: new Date(),
  }).where(eq(leads.id, id)).returning();

  revalidateTag('leads', { expire: 0 });

  return NextResponse.json({ ok: true, lead: updated });
}
