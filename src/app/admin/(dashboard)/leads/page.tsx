import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { ArrowRight, Phone, UserRoundSearch } from 'lucide-react';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { unstable_cache } from 'next/cache';

export const dynamic = 'force-dynamic';

const getAdminLeadList = unstable_cache(() => db.select({
  id: leads.id,
  leadCode: leads.leadCode,
  createdAt: leads.createdAt,
  name: leads.name,
  phone: leads.phone,
  email: leads.email,
  project: leads.project,
  message: leads.message,
  teamCode: leads.teamCode,
  sourceHost: leads.sourceHost,
  utmSource: leads.utmSource,
  referrer: leads.referrer,
  utmCampaign: leads.utmCampaign,
  landingPage: leads.landingPage,
  handoffStatus: leads.handoffStatus,
}).from(leads).orderBy(desc(leads.createdAt)).limit(100), ["admin-lead-list"], {
  tags: ["leads"],
  revalidate: 3600,
});

const handoffLabels: Record<string, { label: string; className: string }> = {
  pending: { label: 'ยังไม่ส่งต่อ', className: 'bg-amber-50 text-amber-700' },
  handed_off: { label: 'ส่งผู้จัดการแล้ว', className: 'bg-blue-50 text-blue-700' },
  quoted: { label: 'เสนอราคาแล้ว', className: 'bg-violet-50 text-violet-700' },
  won: { label: 'ปิดการขายสำเร็จ', className: 'bg-emerald-50 text-emerald-700' },
  lost: { label: 'ไม่สำเร็จ', className: 'bg-slate-100 text-slate-600' },
};

export default async function LeadsPage() {
  const rows = (await getAdminLeadList()).map((lead) => ({
    ...lead,
    createdAt: new Date(lead.createdAt),
  }));

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
          <UserRoundSearch className="h-6 w-6 text-blue-600" />
          ลูกค้าใหม่จากเว็บไซต์
        </h1>
        <p className="mt-1 text-sm text-slate-500">ข้อมูลจากแบบฟอร์ม พร้อมแหล่งที่มาและแคมเปญที่พาลูกค้าเข้ามา</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center text-slate-500">ยังไม่มีลูกค้าส่งแบบฟอร์ม</div>
        ) : (
          <div className="overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">วันที่</th>
                  <th className="px-5 py-3">ลูกค้า</th>
                  <th className="px-5 py-3">สินค้า/รายละเอียด</th>
                  <th className="px-5 py-3">แหล่งที่มา</th>
                  <th className="px-5 py-3">หน้าแรกที่เข้า</th>
                  <th className="px-5 py-3">ติดตาม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((lead) => (
                  <tr key={lead.id} className="align-top hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Bangkok' }).format(lead.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/leads/${lead.id}`} className="font-mono text-xs font-bold text-blue-700 hover:underline">
                        {lead.leadCode || lead.id.slice(0, 8)}
                      </Link>
                      <p className="font-semibold text-slate-900">{lead.name}</p>
                      <a href={`tel:${lead.phone.replace(/\D/g, '')}`} className="mt-1 inline-flex items-center gap-1 text-blue-600 hover:underline">
                        <Phone className="h-3.5 w-3.5" /> {lead.phone}
                      </a>
                      {lead.email ? <p className="mt-1 text-xs text-slate-500">{lead.email}</p> : null}
                    </td>
                    <td className="max-w-sm px-5 py-4 text-slate-600">
                      <p className="font-medium text-slate-800">{lead.project || 'ไม่ระบุ'}</p>
                      {lead.message ? <p className="mt-1 line-clamp-3 text-xs">{lead.message}</p> : null}
                    </td>
                    <td className="px-5 py-4">
                      <p className="mb-2 text-[11px] font-semibold text-slate-500">
                        ทีม: {lead.teamCode} · {lead.sourceHost || 'ไม่ทราบโดเมน'}
                      </p>
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {lead.utmSource || (lead.referrer ? 'referral' : 'direct')}
                      </span>
                      {lead.utmCampaign ? <p className="mt-2 text-xs text-slate-500">{lead.utmCampaign}</p> : null}
                    </td>
                    <td className="max-w-xs break-all px-5 py-4 text-xs text-slate-500">{lead.landingPage || '/'}</td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${(handoffLabels[lead.handoffStatus] || handoffLabels.pending).className}`}>
                        {(handoffLabels[lead.handoffStatus] || handoffLabels.pending).label}
                      </span>
                      <Link href={`/admin/leads/${lead.id}`} className="mt-3 flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline">เปิดรายละเอียด<ArrowRight className="h-3.5 w-3.5" /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
