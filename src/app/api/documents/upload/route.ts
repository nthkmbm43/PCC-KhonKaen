import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { requireApiPermission } from '@/lib/auth/api';

export const runtime = 'nodejs';
const MAX_PDF_SIZE = 25 * 1024 * 1024;

function sanitizeFilename(filename: string) {
  return filename
    .replace(/\.pdf$/i, '')
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100) || 'document';
}

export async function POST(request: Request) {
  const { response } = await requireApiPermission(new URL(request.url).pathname);
  if (response) return response;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'ไม่พบไฟล์ PDF' }, { status: 400 });
    if (file.size <= 0 || file.size > MAX_PDF_SIZE) return NextResponse.json({ error: 'ไฟล์ PDF ต้องมีขนาดไม่เกิน 25 MB' }, { status: 400 });

    const bytes = new Uint8Array(await file.arrayBuffer());
    const signature = new TextDecoder('ascii').decode(bytes.slice(0, 5));
    if (signature !== '%PDF-') return NextResponse.json({ error: 'ไฟล์ไม่ใช่ PDF ที่ถูกต้อง' }, { status: 400 });

    const filename = `documents/${Date.now()}-${sanitizeFilename(file.name)}.pdf`;
    const blob = await put(filename, new Blob([bytes], { type: 'application/pdf' }), {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: false,
    });
    return NextResponse.json({ url: blob.url, originalName: file.name, size: file.size, mimeType: 'application/pdf' }, { status: 201 });
  } catch (error) {
    console.error('Document upload failed', error);
    return NextResponse.json({ error: 'อัปโหลดเอกสารไม่สำเร็จ' }, { status: 500 });
  }
}
