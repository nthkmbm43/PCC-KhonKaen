import { NextResponse } from 'next/server';
import { getAppMetadata } from '@/lib/health/metadata';

export async function GET() {
  const metadata = getAppMetadata();
  
  return NextResponse.json(
    {
      status: 'ok',
      ...metadata,
    },
    { status: 200 }
  );
}
