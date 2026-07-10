import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { requireBearerSecret } from '@/lib/auth/api';

export async function GET(request: NextRequest) {
  const secretResponse = requireBearerSecret(request, 'REVALIDATION_SECRET');
  if (secretResponse) return secretResponse;

  revalidatePath('/', 'layout');
  return NextResponse.json({ success: true, message: 'All caches purged.' });
}

export async function POST(request: NextRequest) {
  return GET(request);
}
