import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { ArrowLeft, MapPin, Phone } from 'lucide-react';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { LeadTrackingForm } from '@/components/admin/LeadTrackingForm';

export const dynamic = 'force-dynamic';

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  if (!lead) notFound();

  const siteDetails = [
    ['จังหวัด/อำเภอ', [lead.province, lead.district].filter(Boolean).join(' / ')],
    ['ความยาวแนวโดยประมาณ', lead.estimatedLength],
    ['ความต่างระดับโดยประมาณ', lead.levelDifference],
    ['น้ำ/การระบายน้ำ', lead.waterCondition],
    ['ทางเข้าหน้างาน', lead.accessCondition],
    ['สิ่งที่อยู่ใกล้แนว', lead.nearbyLoad],
  ].filter((item) => item[1]);

  return (
    <div className="space-y-6">
      <Link href="/admin/leads" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline"><ArrowLeft className="h-4 w-4" />กลับไปหน้าลูกค้า</Link>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div><p className="font-mono text-sm font-bold text-blue-700">{lead.leadCode || lead.id}</p><h1 className="mt-1 text-2xl font-bold text-slate-900">{lead.name}</h1><p className="mt-1 text-sm text-slate-500">{lead.project || 'ไม่ระบุสินค้า'}</p></div>
          <a href={`tel:${lead.phone.replace(/\D/g, '')}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white"><Phone className="h-4 w-4" />{lead.phone}</a>
        </div>
        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
          <div><p className="text-xs font-semibold text-slate-400">อีเมล</p><p className="mt-1 text-sm text-slate-700">{lead.email || '-'}</p></div>
          <div><p className="text-xs font-semibold text-slate-400">ทีม/เว็บไซต์</p><p className="mt-1 text-sm text-slate-700">{lead.teamCode} · {lead.sourceHost || '-'}</p></div>
          <div><p className="text-xs font-semibold text-slate-400">แหล่งที่มา</p><p className="mt-1 text-sm text-slate-700">{lead.utmSource || (lead.referrer ? 'referral' : 'direct')}</p></div>
        </div>
        {lead.message ? <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{lead.message}</div> : null}
      </div>
      {siteDetails.length > 0 ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6"><h2 className="flex items-center gap-2 font-bold text-blue-950"><MapPin className="h-5 w-5" />ข้อมูลหน้างานกำแพงกันดิน</h2><dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{siteDetails.map(([label, value]) => <div key={label}><dt className="text-xs font-semibold text-blue-600">{label}</dt><dd className="mt-1 text-sm font-medium text-blue-950">{value}</dd></div>)}</dl></div>
      ) : null}
      <LeadTrackingForm leadId={lead.id} initial={{ status: lead.status, handoffStatus: lead.handoffStatus, confirmedAreaSqm: lead.confirmedAreaSqm || '', saleValue: lead.saleValue || '', commissionRate: lead.commissionRate || '', commissionAmount: lead.commissionAmount || '', salesNotes: lead.salesNotes || '' }} />
    </div>
  );
}
