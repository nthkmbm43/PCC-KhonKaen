'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';

type LeadTrackingFormProps = {
  leadId: string;
  initial: {
    status: 'new' | 'contacted' | 'qualified' | 'closed' | 'spam';
    handoffStatus: string;
    confirmedAreaSqm: string;
    saleValue: string;
    commissionRate: string;
    commissionAmount: string;
    salesNotes: string;
  };
};

export function LeadTrackingForm({ leadId, initial }: LeadTrackingFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const update = (name: string, value: string) => setForm((current) => ({ ...current, [name]: value }));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('saving');
    const response = await fetch(`/api/admin/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      setState('error');
      return;
    }
    setState('saved');
    router.refresh();
  }

  const fieldClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100';

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">ติดตามการส่งต่อและค่าตอบแทน</h2>
        <p className="mt-1 text-xs text-slate-500">ข้อมูลส่วนนี้แสดงเฉพาะในหลังบ้าน ไม่แสดงต่อลูกค้า</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">สถานะลูกค้า
          <select value={form.status} onChange={(event) => update('status', event.target.value)} className={fieldClass}>
            <option value="new">ลูกค้าใหม่</option><option value="contacted">ติดต่อแล้ว</option><option value="qualified">มีโอกาสซื้อ</option><option value="closed">ปิดรายการ</option><option value="spam">สแปม</option>
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700">สถานะการส่งต่อ
          <select value={form.handoffStatus} onChange={(event) => update('handoffStatus', event.target.value)} className={fieldClass}>
            <option value="pending">ยังไม่ส่งต่อ</option><option value="handed_off">ส่งให้ผู้จัดการแล้ว</option><option value="quoted">เสนอราคาแล้ว</option><option value="won">ปิดการขายสำเร็จ</option><option value="lost">ไม่สำเร็จ</option>
          </select>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm font-medium text-slate-700">พื้นที่ยืนยัน (ตร.ม.)<input inputMode="decimal" value={form.confirmedAreaSqm} onChange={(event) => update('confirmedAreaSqm', event.target.value)} className={fieldClass} /></label>
        <label className="text-sm font-medium text-slate-700">มูลค่างาน (บาท)<input inputMode="decimal" value={form.saleValue} onChange={(event) => update('saleValue', event.target.value)} className={fieldClass} /></label>
        <label className="text-sm font-medium text-slate-700">อัตราค่าตอบแทน (%)<input inputMode="decimal" value={form.commissionRate} onChange={(event) => update('commissionRate', event.target.value)} placeholder="เช่น 3" className={fieldClass} /></label>
        <label className="text-sm font-medium text-slate-700">ค่าตอบแทน (บาท)<input inputMode="decimal" value={form.commissionAmount} onChange={(event) => update('commissionAmount', event.target.value)} className={fieldClass} /></label>
      </div>
      <label className="block text-sm font-medium text-slate-700">บันทึกการขาย/หลักฐานส่งต่อ
        <textarea rows={5} value={form.salesNotes} onChange={(event) => update('salesNotes', event.target.value)} placeholder="วันที่ส่งต่อ ชื่อผู้รับผิดชอบ เลขที่ใบเสนอราคา หรือรายละเอียดที่ใช้ยืนยันเจ้าของลีด" className={fieldClass} />
      </label>
      <div className="flex items-center gap-3">
        <button disabled={state === 'saving'} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"><Save className="h-4 w-4" />{state === 'saving' ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</button>
        {state === 'saved' ? <span className="text-sm font-semibold text-emerald-600">บันทึกแล้ว</span> : null}
        {state === 'error' ? <span className="text-sm font-semibold text-red-600">บันทึกไม่สำเร็จ กรุณาตรวจข้อมูล</span> : null}
      </div>
    </form>
  );
}
