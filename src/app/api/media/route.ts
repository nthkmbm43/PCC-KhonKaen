import { db } from '@/db';
import { mediaFiles } from '@/db/schema';
import { NextResponse } from 'next/server';
import { desc, ilike, or, eq, and } from 'drizzle-orm';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  
  // Basic pagination (skip/limit for now, can be upgraded to true cursor later)
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const offset = (page - 1) * limit;

  try {
    let condition: any = eq(mediaFiles.deleteStatus, 'ACTIVE');
    if (q) {
      condition = and(
        eq(mediaFiles.deleteStatus, 'ACTIVE'),
        or(
          ilike(mediaFiles.filename, `%${q}%`),
          ilike(mediaFiles.alt, `%${q}%`)
        )
      );
    }

    const files = await db.select()
      .from(mediaFiles)
      .where(condition)
      .orderBy(desc(mediaFiles.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(files);
  } catch (error: any) {
    console.error('Error fetching media files:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
