import { db } from '@/db';
import { businessHolidayClosures, siteSettings } from '@/db/schema';
import { sql, and, lte, gte, eq } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export type BusinessStatusData = {
  isOpen: boolean;
  reason: string;
  workingHours: string;
  currentHoliday: { title: string; startDate: string; endDate: string } | null;
  upcomingHolidays: { id: string; title: string; startDate: string; endDate: string }[];
  googleMapsEmbedUrl: string | null;
  companyAddress: string | null;
  todayThai: string;
};

function formatGoogleMapsUrl(url: string | null | undefined | unknown): string {
  if (typeof url !== 'string' || !url.trim()) return '';
  const rawUrl = url.trim();
  const match = rawUrl.match(/src="([^"]+)"/);
  let cleanUrl = match ? match[1] : rawUrl;
  cleanUrl = cleanUrl.replace(/^\[|\]$/g, '').trim();
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) return cleanUrl;
  return '';
}

export const getBusinessStatus = unstable_cache(
  async (): Promise<BusinessStatusData> => {
    const nowBKK = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })
    );
    const dayOfWeek = nowBKK.getDay();
    const hour = nowBKK.getHours();
    const minute = nowBKK.getMinutes();
    const currentMinutes = hour * 60 + minute;
    const todayStr = nowBKK.toISOString().split('T')[0];

    const settingsArr = await db.select().from(siteSettings).limit(1);
    const settings = settingsArr[0];
    const workingHours = settings?.workingHours || 'จันทร์ – เสาร์: 08:00 – 17:00 น. (หยุดทุกวันอาทิตย์)';

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

    const OPEN_MINUTES  = 8 * 60;
    const CLOSE_MINUTES = 17 * 60;
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

    const daysThai = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
    const todayThai = daysThai[dayOfWeek];

    return {
      isOpen,
      reason,
      workingHours,
      currentHoliday: isHoliday ? activeHolidays[0] : null,
      upcomingHolidays,
      googleMapsEmbedUrl: formatGoogleMapsUrl(settings?.googleMapsUrl) || null,
      companyAddress: settings?.companyAddress || null,
      todayThai,
    };
  },
  ['business-status-cache'],
  { revalidate: 60, tags: ['business-status'] }
);
