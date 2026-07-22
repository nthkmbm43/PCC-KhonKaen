'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Pencil, X, Check, CalendarX, AlertCircle, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

type Holiday = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt?: string;
};

type FormData = {
  title: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

const EMPTY_FORM: FormData = { title: '', startDate: '', endDate: '', isActive: true };

function formatDateTH(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const MONTHS_TH = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const buddhistYear = year + 543;
  if (dateStr === dateStr) {
    return `${day} ${MONTHS_TH[month]} ${buddhistYear}`;
  }
  return dateStr;
}

function isHolidayActive(h: Holiday): boolean {
  if (!h.isActive) return false;
  // Check using Bangkok time
  const nowBKK = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  const today = nowBKK.toISOString().split('T')[0];
  return h.startDate <= today && h.endDate >= today;
}

function getHolidayStatus(h: Holiday): 'active-now' | 'upcoming' | 'expired' | 'disabled' {
  if (!h.isActive) return 'disabled';
  const nowBKK = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  const today = nowBKK.toISOString().split('T')[0];
  if (h.endDate < today) return 'expired';
  if (h.startDate <= today && h.endDate >= today) return 'active-now';
  return 'upcoming';
}

const STATUS_CONFIG = {
  'active-now': { label: 'กำลังหยุดอยู่', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500 animate-pulse' },
  'upcoming':   { label: 'กำหนดไว้ล่วงหน้า', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  'expired':    { label: 'ผ่านไปแล้ว', color: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400' },
  'disabled':   { label: 'ปิดใช้งาน', color: 'bg-yellow-50 text-yellow-600 border-yellow-200', dot: 'bg-yellow-400' },
};

export function HolidayManager() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showExpired, setShowExpired] = useState(false);

  const fetchHolidays = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/holidays');
      const data = await res.json();
      if (data.success) setHolidays(data.holidays || []);
    } catch {
      toast.error('โหลดข้อมูลไม่ได้');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    fetchHolidays();
  }, [fetchHolidays]);

  function openCreate() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(h: Holiday) {
    setEditId(h.id);
    setForm({ title: h.title, startDate: h.startDate, endDate: h.endDate, isActive: h.isActive });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSave() {
    if (!form.title.trim()) { toast.error('กรุณาใส่ชื่อวันหยุด'); return; }
    if (!form.startDate)    { toast.error('กรุณาเลือกวันที่เริ่ม'); return; }
    if (!form.endDate)      { toast.error('กรุณาเลือกวันที่สิ้นสุด'); return; }
    if (form.startDate > form.endDate) { toast.error('วันที่เริ่มต้องไม่มากกว่าวันที่สิ้นสุด'); return; }

    setSaving(true);
    try {
      const url = editId ? `/api/admin/holidays/${editId}` : '/api/admin/holidays';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editId ? 'แก้ไขวันหยุดแล้ว ✅' : 'เพิ่มวันหยุดแล้ว ✅');
        closeForm();
        await fetchHolidays();
      } else {
        toast.error(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch {
      toast.error('เกิดข้อผิดพลาด');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`ลบวันหยุด "${title}" ออก?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/holidays/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('ลบวันหยุดแล้ว');
        setHolidays(prev => prev.filter(h => h.id !== id));
      } else {
        toast.error('ลบไม่ได้');
      }
    } catch {
      toast.error('เกิดข้อผิดพลาด');
    } finally {
      setDeleting(null);
    }
  }

  async function handleToggleActive(h: Holiday) {
    try {
      const res = await fetch(`/api/admin/holidays/${h.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...h, isActive: !h.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(!h.isActive ? 'เปิดใช้งานแล้ว' : 'ปิดใช้งานแล้ว');
        setHolidays(prev => prev.map(x => x.id === h.id ? { ...x, isActive: !h.isActive } : x));
      }
    } catch {
      toast.error('เกิดข้อผิดพลาด');
    }
  }

  const visibleHolidays = showExpired
    ? holidays
    : holidays.filter(h => getHolidayStatus(h) !== 'expired');
  const expiredCount = holidays.filter(h => getHolidayStatus(h) === 'expired').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <CalendarX size={20} className="text-blue-600" />
          <h3 className="text-base font-bold text-slate-800">วันหยุดพิเศษ</h3>
          {holidays.filter(h => isHolidayActive(h)).length > 0 && (
            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full border border-red-200">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              กำลังหยุดอยู่
            </span>
          )}
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md"
        >
          <Plus size={16} />
          เพิ่มวันหยุด
        </button>
      </div>

      <p className="text-xs text-slate-500">
        กำหนดวันหยุดพิเศษล่วงหน้า เช่น สงกรานต์ ปีใหม่ เมื่อถึงวันที่กำหนด หน้าเว็บจะแสดง &quot;ปิดทำการ&quot; อัตโนมัติ
      </p>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-4">
          <div className="max-h-[calc(100dvh-1.5rem)] w-full max-w-md space-y-5 overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-lg">
                {editId ? 'แก้ไขวันหยุด' : 'เพิ่มวันหยุดพิเศษ'}
              </h4>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  ชื่อวันหยุด <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="เช่น หยุดสงกรานต์ 2569, หยุดปีใหม่, หยุดชดเชย"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    วันที่เริ่มหยุด <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    วันที่สิ้นสุด <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    min={form.startDate}
                    onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {form.startDate && form.endDate && form.startDate <= form.endDate && (
                <div className="bg-blue-50 rounded-xl px-4 py-3 text-sm text-blue-700">
                  📅 หยุด <strong>{formatDateTH(form.startDate)}</strong>{form.startDate !== form.endDate && <> ถึง <strong>{formatDateTH(form.endDate)}</strong></>}
                  {form.startDate === form.endDate ? ' (1 วัน)' : (() => {
                    const diff = Math.round((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    return ` (${diff} วัน)`;
                  })()}
                </div>
              )}

              <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">เปิดใช้งาน</p>
                  <p className="text-xs text-slate-500">ปิดการใช้งานเพื่อยกเว้นวันหยุดนี้ชั่วคราว</p>
                </div>
                <button
                  onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                  className="flex-shrink-0"
                >
                  {form.isActive
                    ? <ToggleRight size={32} className="text-blue-600" />
                    : <ToggleLeft size={32} className="text-slate-400" />
                  }
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={closeForm}
                className="flex-1 border border-slate-200 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                {saving ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : <Check size={16} />}
                {editId ? 'บันทึกการแก้ไข' : 'เพิ่มวันหยุด'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Holiday List */}
      {loading ? (
        <div className="space-y-2">
          {[1,2].map(i => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : visibleHolidays.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
          <CalendarX size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-500">ยังไม่มีวันหยุดพิเศษ</p>
          <p className="text-xs text-slate-400 mt-1">กดปุ่ม &quot;เพิ่มวันหยุด&quot; เพื่อกำหนดล่วงหน้า</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visibleHolidays.map(h => {
            const status = getHolidayStatus(h);
            const statusCfg = STATUS_CONFIG[status];
            return (
              <div
                key={h.id}
                className={`flex items-center gap-3 p-4 rounded-xl border bg-white transition-all hover:shadow-sm ${status === 'active-now' ? 'ring-1 ring-red-300 border-red-200' : 'border-slate-100'}`}
              >
                {/* Status dot */}
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusCfg.dot}`} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-semibold ${h.isActive ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                      {h.title}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatDateTH(h.startDate)}
                    {h.startDate !== h.endDate && <> – {formatDateTH(h.endDate)}</>}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleToggleActive(h)}
                    title={h.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    {h.isActive ? <ToggleRight size={18} className="text-blue-500" /> : <ToggleLeft size={18} />}
                  </button>
                  <button
                    onClick={() => openEdit(h)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
                    title="แก้ไข"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(h.id, h.title)}
                    disabled={deleting === h.id}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                    title="ลบ"
                  >
                    {deleting === h.id
                      ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      : <Trash2 size={15} />
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Show/hide expired */}
      {expiredCount > 0 && (
        <button
          onClick={() => setShowExpired(p => !p)}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 transition-colors w-full justify-center py-2"
        >
          {showExpired ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showExpired ? `ซ่อนวันหยุดที่ผ่านแล้ว (${expiredCount} รายการ)` : `แสดงวันหยุดที่ผ่านแล้ว (${expiredCount} รายการ)`}
        </button>
      )}

      {/* Info box */}
      <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <AlertCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-700 space-y-1">
          <p className="font-semibold">วิธีใช้งาน:</p>
          <p>1. กด &quot;เพิ่มวันหยุด&quot; → ใส่ชื่อและเลือกช่วงวันที่</p>
          <p>2. ระบบจะแสดง 🔴 &quot;ปิดทำการ&quot; บนหน้าเว็บโดยอัตโนมัติเมื่อถึงวันที่กำหนด</p>
          <p>3. กดปุ่ม Toggle เพื่อเปิด/ปิดใช้งานชั่วคราวได้</p>
        </div>
      </div>
    </div>
  );
}
