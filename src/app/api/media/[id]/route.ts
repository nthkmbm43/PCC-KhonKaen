import { db } from '@/db';
import { mediaFiles } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { logAudit } from '@/lib/audit';
import { logger } from '@/lib/logger';
import { requireApiPermission } from '@/lib/auth/api';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { response } = await requireApiPermission(new URL(req.url).pathname);
  if (response) return response;

  const { id } = await params;

  try {
    // 1. Fetch media record
    const media = await db.query.mediaFiles.findFirst({
      where: eq(mediaFiles.id, id),
    });

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // 2. Mark Database as Pending Delete (Soft Delete Saga)
    await db.transaction(async (tx) => {
      const updated = await tx.update(mediaFiles)
        .set({ deleteStatus: 'PENDING_DELETE', updatedAt: new Date() })
        .where(eq(mediaFiles.id, id))
        .returning();
      
      await logAudit({
        tx,
        session,
        action: 'DELETE',
        resource: 'media',
        resourceId: id,
        beforeState: media,
        afterState: updated[0],
      });
    });

    // 3. Observability
    logger.info({
      event: 'MEDIA_DELETE_REQUESTED',
      mediaId: id,
      blobUrl: media.blobUrl,
      userId: session.user.id
    }, 'Media marked for deletion. Cleanup deferred to Background Worker (JOB-001).');

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting media file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
