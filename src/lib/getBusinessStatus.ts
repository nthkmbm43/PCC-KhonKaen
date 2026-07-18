import { db } from '@/db';
import { businessHolidayClosures, siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
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
  const cleanUrl = (match ? match[1] : rawUrl).replace(/^\[|\]$/g, '').trim();
  return cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') ? cleanUrl : '';
}

// Cache only the slow cross-region database reads. Time-dependent open/closed
// calculation stays outside the cache so the displayed status remains accurate.
const getBusinessStatusSource = unstable_cache(
  async () => {
    const [settingsArr, holidays] = await Promise.all([
      db
        .select({
          workingHours: siteSettings.workingHours,
          googleMapsUrl: siteSettings.googleMapsUrl,
          companyAddress: siteSettings.companyAddress,
        })
        .from(siteSettings)
        .limit(1),
      db
        .select({
          id: businessHolidayClosures.id,
          title: businessHolidayClosures.title,
          startDate: businessHolidayClosures.startDate,
          endDate: businessHolidayClosures.endDate,
        })
        .from(businessHolidayClosures)
        .where(eq(businessHolidayClosures.isActive, true))
        .orderBy(businessHolidayClosures.startDate),
    ]);

    return {
      settings: settingsArr[0] ?? null,
      holidays,
    };
  },
  ['business-status-source'],
  { revalidate: 3600, tags: ['business-status'] }
);

export async function getBusinessStatus(): Promise<BusinessStatusData> {
  const { settings, holidays } = await getBusinessStatusSource();
  const nowBKK = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  const dayOfWeek = nowBKK.getDay();
  const currentMinutes = nowBKK.getHours() * 60 + nowBKK.getMinutes();
  const todayStr = nowBKK.toISOString().split('T')[0];

  const in60Days = new Date(nowBKK);
  in60Days.setDate(in60Days.getDate() + 60);
  const in60DaysStr = in60Days.toISOString().split('T')[0];

  const currentHoliday = holidays.find(
    (holiday) => holiday.startDate <= todayStr && holiday.endDate >= todayStr
  ) ?? null;
  const upcomingHolidays = holidays.filter(
    (holiday) => holiday.startDate >= todayStr && holiday.startDate <= in60DaysStr
  );

  const openMinutes = 8 * 60;
  const closeMinutes = 17 * 60;
  const isSunday = dayOfWeek === 0;
  const inTimeRange = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  let isOpen = false;
  let reason: string;

  if (currentHoliday) {
    reason = `ปิดทำการ: ${currentHoliday.title}`;
  } else if (isSunday) {
    reason = 'หยุดทำการ (วันอาทิตย์)';
  } else if (!inTimeRange) {
    reason = currentMinutes < openMinutes
      ? 'ยังไม่เปิดทำการ (เปิด 08:00 น.)'
      : 'ปิดทำการแล้ว (ปิด 17:00 น.)';
  } else {
    isOpen = true;
    reason = 'เปิดทำการอยู่';
  }

  const daysThai = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];

  return {
    isOpen,
    reason,
    workingHours: settings?.workingHours || 'จันทร์ – เสาร์: 08:00 – 17:00 น. (หยุดทุกวันอาทิตย์)',
    currentHoliday,
    upcomingHolidays,
    googleMapsEmbedUrl: formatGoogleMapsUrl(settings?.googleMapsUrl) || null,
    companyAddress: settings?.companyAddress || null,
    todayThai: daysThai[dayOfWeek],
  };
}
