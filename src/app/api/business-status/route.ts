import { NextResponse } from 'next/server';
import { getBusinessStatus } from '@/lib/getBusinessStatus';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await getBusinessStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('business-status error:', error);
    return NextResponse.json({ isOpen: false, reason: 'ไม่สามารถตรวจสอบสถานะได้', error: String(error) }, { status: 500 });
  }
}
