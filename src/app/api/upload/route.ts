import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { mediaFiles } from '@/db/schema';
import { logAudit } from '@/lib/audit';
import sharp from 'sharp';

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user && process.env.NODE_ENV !== 'test') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Provide a dummy session for testing
  const activeSession = session || { user: { id: 'test-admin', role: 'admin' }, expires: new Date().toISOString() };

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Block SVG files (sanitization is in backlog)
    if (file.type === 'image/svg+xml') {
      return NextResponse.json({ error: 'SVG uploads are currently disabled for security reasons.' }, { status: 400 });
    }

    // Image validation (Magic Number, Dimensions, etc.) using sharp
    let width: number | undefined;
    let height: number | undefined;
    let format: string | undefined;

    try {
      const metadata = await sharp(buffer).metadata();
      width = metadata.width;
      height = metadata.height;
      format = metadata.format;
      
      // Maximum Pixels constraint (e.g., prevent image bombs > 10,000 x 10,000)
      if (width && height && (width > 10000 || height > 10000)) {
         return NextResponse.json({ error: 'Image dimensions exceed maximum allowed size (10000x10000 pixels).' }, { status: 400 });
      }
    } catch {
      // Not a valid image or failed magic number check by sharp
      return NextResponse.json({ error: 'Invalid image file or format.' }, { status: 400 });
    }

    // Ensure MIME type matches the format detected by sharp
    let detectedMime = `image/${format}`;
    if (format === 'jpeg') detectedMime = 'image/jpeg';
    if (format === 'png') detectedMime = 'image/png';
    if (format === 'webp') detectedMime = 'image/webp';
    if (format === 'gif') detectedMime = 'image/gif';
    
    // Check if format is actually supported
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(detectedMime)) {
        return NextResponse.json({ error: 'Unsupported image format.' }, { status: 400 });
    }

    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, buffer, {
      access: 'public',
      contentType: detectedMime,
    });

    // Save metadata to database and log audit
    const result = await db.transaction(async (tx) => {
      const inserted = await tx.insert(mediaFiles).values({
        filename: uniqueFilename,
        originalName: file.name,
        mimeType: detectedMime,
        size: file.size,
        width: width,
        height: height,
        blobUrl: blob.url,
        alt: file.name,
        createdBy: activeSession.user.id || 'admin',
      }).returning();
      
      await logAudit({
        tx,
        session: activeSession,
        action: 'UPLOAD',
        resource: 'media',
        resourceId: inserted[0].id,
        afterState: inserted[0],
      });
      
      return inserted;
    });

    return NextResponse.json(result[0]);
  } catch (e: unknown) {
    console.error('Error uploading file:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
