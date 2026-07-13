import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/db';
import { mediaFiles } from '@/db/schema';
import { logAudit } from '@/lib/audit';
import { requireApiPermission } from '@/lib/auth/api';

const MAX_IMAGE_DIMENSION = 3840;
const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;

function sanitizeFilename(filename: string) {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 120);
}

function mimeFromFormat(format?: string) {
  if (format === 'jpeg' || format === 'jpg') return 'image/jpeg';
  if (format === 'png') return 'image/png';
  if (format === 'webp') return 'image/webp';
  if (format === 'gif') return 'image/gif';
  return `image/${format}`;
}

async function optimizeImage(
  buffer: Buffer,
  format: string | undefined,
  width: number | undefined,
  height: number | undefined,
  hasAlpha: boolean | undefined
): Promise<{
  buffer: Buffer;
  mimeType: string;
  extension: string;
  width: number | undefined;
  height: number | undefined;
}> {
  if (format === 'gif') {
    return {
      buffer,
      mimeType: 'image/gif',
      extension: 'gif',
      width,
      height,
    };
  }

  const shouldResize =
    (width && width > MAX_IMAGE_DIMENSION) ||
    (height && height > MAX_IMAGE_DIMENSION);

  const { default: sharp } = await import('sharp');
  let pipeline = sharp(buffer, { failOn: 'none' }).rotate();

  if (shouldResize) {
    pipeline = pipeline.resize({
      width: MAX_IMAGE_DIMENSION,
      height: MAX_IMAGE_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    });
  }

  pipeline = pipeline.sharpen({
    sigma: 0.35,
    m1: 0.4,
    m2: 1.4,
  });

  const optimizedBuffer = hasAlpha
    ? await pipeline.webp({ lossless: true, effort: 6 }).toBuffer()
    : await pipeline
        .webp({ quality: 95, alphaQuality: 100, smartSubsample: true, effort: 6 })
        .toBuffer();
  const optimizedMeta = await sharp(optimizedBuffer).metadata();

  return {
    buffer: Buffer.from(optimizedBuffer),
    mimeType: 'image/webp',
    extension: 'webp',
    width: optimizedMeta.width,
    height: optimizedMeta.height,
  };
}

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user && process.env.NODE_ENV !== 'test') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (process.env.NODE_ENV !== 'test') {
    const { response } = await requireApiPermission(new URL(req.url).pathname);
    if (response) return response;
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
    let hasAlpha: boolean | undefined;

    try {
      const { default: sharp } = await import('sharp');
      const metadata = await sharp(buffer).metadata();
      width = metadata.width;
      height = metadata.height;
      format = metadata.format;
      hasAlpha = metadata.hasAlpha;
      
      // Maximum Pixels constraint (e.g., prevent image bombs > 10,000 x 10,000)
      if (width && height && (width > 10000 || height > 10000)) {
         return NextResponse.json({ error: 'Image dimensions exceed maximum allowed size (10000x10000 pixels).' }, { status: 400 });
      }
    } catch {
      // Not a valid image or failed magic number check by sharp
      return NextResponse.json({ error: 'Invalid image file or format.' }, { status: 400 });
    }

    // Ensure MIME type matches the format detected by sharp
    const detectedMime = mimeFromFormat(format);
    
    // Check if format is actually supported
    if (!SUPPORTED_MIME_TYPES.includes(detectedMime as typeof SUPPORTED_MIME_TYPES[number])) {
        return NextResponse.json({ error: 'Unsupported image format.' }, { status: 400 });
    }

    let processedBuffer: Buffer = Buffer.from(buffer);
    let finalMimeType = detectedMime;
    let finalExtension = detectedMime.split('/')[1] || 'jpg';
    let finalWidth: number | undefined = width;
    let finalHeight: number | undefined = height;

    try {
      const optimized = await optimizeImage(buffer, format, width, height, hasAlpha);
      processedBuffer = optimized.buffer;
      finalMimeType = optimized.mimeType;
      finalExtension = optimized.extension;
      finalWidth = optimized.width;
      finalHeight = optimized.height;
    } catch (e) {
      console.warn("Failed to process image with sharp, using original buffer", e);
    }

    const uniqueFilename = `${Date.now()}-${sanitizeFilename(file.name)}.${finalExtension}`;

    // Convert Buffer to a standard Blob to avoid "SharedArrayBuffer is not allowed" error in Fetch API
    const safeBuffer = Buffer.from(processedBuffer);
    const fileBlob = new Blob([safeBuffer], { type: finalMimeType });

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, fileBlob, {
      access: 'public',
      contentType: finalMimeType,
    });

    // Save metadata to database and log audit
    const result = await db.transaction(async (tx) => {
      const inserted = await tx.insert(mediaFiles).values({
        filename: uniqueFilename,
        originalName: file.name,
        mimeType: finalMimeType,
        size: processedBuffer.length,
        width: finalWidth,
        height: finalHeight,
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
  } catch (error: unknown) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
