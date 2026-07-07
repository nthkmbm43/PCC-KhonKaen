import { db } from '@/db';
import { businessHolidayClosures, siteSettings } from '@/db/schema';
import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { and, lte, gte, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * Extracts src URL if given an iframe, or cleans up the URL.
 */
function formatGoogleMapsUrl(url: string | null | undefined | unknown): string {
  if (typeof url !== 'string' || !url.trim()) return '';
  const rawUrl = url.trim();
  const match = rawUrl.match(/src="([^"]+)"/);
  let cleanUrl = match ? match[1] : rawUrl;
  cleanUrl = cleanUrl.replace(/^\[|\]$/g, '').trim();
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) return cleanUrl;
  return '';
}

/**
 * Returns the current business open/closed status based on:
 * 1. Day of week (Sunday = closed always)
 * 2. Time of day (08:00–17:00 BKK = open on working days)
 * 3. Active holiday_closures that cover today's date
 */
export async function GET() {
  try {
    // ── Get current Bangkok time ─────────────────────────────────────────────
    const nowBKK = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })
    );
    const dayOfWeek = nowBKK.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const hour = nowBKK.getHours();
    const minute = nowBKK.getMinutes();
    const currentMinutes = hour * 60 + minute; // minutes since midnight

    // Today's date string in YYYY-MM-DD (Bangkok)
    const todayStr = nowBKK.toISOString().split('T')[0];

    // ── Fetch settings ────────────────────────────────────────────────────────
    const settingsArr = await db.select().from(siteSettings).limit(1);
    const settings = settingsArr[0];
    const workingHours = settings?.workingHours || 'จันทร์ – เสาร์: 08:00 – 17:00 น. (หยุดทุกวันอาทิตย์)';

    // ── Ensure holiday table exists (idempotent) ──────────────────────────────
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

    // ── Check for active holiday covering today ───────────────────────────────
    const activeHolidays = await db
      .select()
      .from(businessHolidayClosures)
      .where(
        and(
          eq(businessHolidayClosures.isActive, true),
          lte(businessHolidayClosures.startDate, todayStr),
          gte(businessHolidayClosures.endDate, todayStr)
        )
      );

    // ── Determine open/closed status ─────────────────────────────────────────
    // Working hours: Mon–Sat (1–6), 08:00–17:00
    const OPEN_MINUTES  = 8 * 60;   // 08:00
    const CLOSE_MINUTES = 17 * 60;  // 17:00

    const isSunday   = dayOfWeek === 0;
    const inTimeRange = currentMinutes >= OPEN_MINUTES && currentMinutes < CLOSE_MINUTES;
    const isHoliday  = activeHolidays.length > 0;

    let isOpen = false;
    let reason = '';

    if (isHoliday) {
      reason = `ปิดทำการ: ${activeHolidays[0].title}`;
    } else if (isSunday) {
      reason = 'หยุดทำการ (วันอาทิตย์)';
    } else if (!inTimeRange) {
      reason = currentMinutes < OPEN_MINUTES
        ? `ยังไม่เปิดทำการ (เปิด 08:00 น.)`
        : `ปิดทำการแล้ว (ปิด 17:00 น.)`;
    } else {
      isOpen = true;
      reason = 'เปิดทำการอยู่';
    }

    // ── Fetch upcoming closures (next 60 days) ────────────────────────────────
    const in60Days = new Date(nowBKK);
    in60Days.setDate(in60Days.getDate() + 60);
    const in60DaysStr = in60Days.toISOString().split('T')[0];

    const upcomingHolidays = await db
      .select()
      .from(businessHolidayClosures)
      .where(
        and(
          eq(businessHolidayClosures.isActive, true),
          gte(businessHolidayClosures.startDate, todayStr),
          lte(businessHolidayClosures.startDate, in60DaysStr)
        )
      )
      .orderBy(businessHolidayClosures.startDate);

    return NextResponse.json({
      isOpen,
      reason,
      workingHours,
      currentHoliday: isHoliday ? activeHolidays[0] : null,
      upcomingHolidays,
      googleMapsEmbedUrl: formatGoogleMapsUrl(settings?.googleMapsUrl) || null,
      companyAddress: settings?.companyAddress || null,
      debug: {
        bangkokTime: nowBKK.toISOString(),
        dayOfWeek,
        hour,
        todayStr,
      },
    });
  } catch (error) {
    console.error('business-status error:', error);
    return NextResponse.json({ isOpen: false, reason: 'ไม่สามารถตรวจสอบสถานะได้', error: String(error) }, { status: 500 });
  }
}
