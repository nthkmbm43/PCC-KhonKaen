import { db } from '@/db';
import { businessHolidayClosures } from '@/db/schema';
import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { auth } from '@/auth';
import { requireApiPermission } from '@/lib/auth/api';

export const dynamic = 'force-dynamic';

async function ensureTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS business_holiday_closures (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

// GET: list all holidays (admin)
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { response } = await requireApiPermission(new URL(req.url).pathname);
  if (response) return response;

  try {
    await ensureTable();
    const holidays = await db
      .select()
      .from(businessHolidayClosures)
      .orderBy(businessHolidayClosures.startDate);
    return NextResponse.json({ success: true, holidays });
  } catch (error) {
    console.error('GET holidays error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// POST: create a new holiday closure
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { response } = await requireApiPermission(new URL(req.url).pathname);
  if (response) return response;

  try {
    await ensureTable();
    const body = await req.json();
    const { title, startDate, endDate, isActive = true } = body;

    if (!title || !startDate || !endDate) {
      return NextResponse.json({ success: false, error: 'title, startDate, endDate required' }, { status: 400 });
    }
    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json({ success: false, error: 'startDate must be before or equal to endDate' }, { status: 400 });
    }

    const inserted = await db.insert(businessHolidayClosures).values({
      title,
      startDate,
      endDate,
      isActive,
    }).returning();

    return NextResponse.json({ success: true, holiday: inserted[0] });
  } catch (error) {
    console.error('POST holiday error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
