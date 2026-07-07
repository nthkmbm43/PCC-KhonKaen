'use client';
import { useState, useEffect } from 'react';
import { Send, CheckCircle, Phone, MessageSquare, Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

type BusinessStatus = {
  isOpen: boolean;
  reason: string;
  workingHours: string;
  currentHoliday: { title: string; startDate: string; endDate: string } | null;
  upcomingHolidays: { id: string; title: string; startDate: string; endDate: string }[];
};

type ContactFormBlockProps = {
  data: {
    headline?: string;
    subheadline?: string;
    phone?: string;
    lineUrl?: string;
    workingHours?: string;
    holidayNotice?: string;
  };
};

function formatDateTH(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const MONTHS_TH = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${day} ${MONTHS_TH[month]} ${year + 543}`;
}

export default function ContactFormBlock({ data }: ContactFormBlockProps) {
  const headline    = data?.headline    || 'ส่งข้อความหาเรา';
  const subheadline = data?.subheadline || 'กรอกข้อมูลด้านล่าง ทีมงานของเราจะติดต่อกลับภายใน 24 ชั่วโมงในวันทำการ';
  const phone       = data?.phone       || '063-454-5656';
  const lineUrl     = data?.lineUrl     || '#';

  const [status, setStatus]       = useState<BusinessStatus | null>(null);
  const [form, setForm]           = useState({ name: '', phone: '', email: '', project: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Fetch live business status
  useEffect(() => {
    fetch('/api/business-status')
      .then(r => r.json())
      .then(setStatus)
      .catch(() => {/* silent — fallback to no badge */});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('sending');
    await new Promise(r => setTimeout(r, 1200));
    setSubmitStatus('success');
  };

  // Helper for reopening calculation
  const getReopenMessage = (endDateStr: string) => {
    if (!endDateStr) return '';
    const parts = endDateStr.split('-');
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    d.setDate(d.getDate() + 1); // next day
    if (d.getDay() === 0) d.setDate(d.getDate() + 1); // skip sunday
    
    const daysTH = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
    const monthsTH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${daysTH[d.getDay()]}ที่ ${d.getDate()} ${monthsTH[d.getMonth()]}`;
  };

  let activeOrSoonHoliday = status?.currentHoliday || null;
  if (!activeOrSoonHoliday && status?.upcomingHolidays?.length) {
    const nextH = status.upcomingHolidays[0];
    const diffTime = new Date(nextH.startDate).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) {
      activeOrSoonHoliday = nextH as any;
    }
  }

  return (
    <section className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">

          {/* ─── Left info panel ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                ติดต่อเรา
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">{headline}</h2>
              <p className="text-gray-600 leading-relaxed">{subheadline}</p>
            </div>

            {/* Quick contact buttons */}
            <div className="space-y-4">
              <a
                href={`tel:${phone.replace(/-/g, '')}`}
                className="flex items-center gap-4 bg-white border border-gray-200 hover:border-blue-300 rounded-xl p-4 group transition-all hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">โทรหาเรา</p>
                  <p className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{phone}</p>
                </div>
              </a>

              <a
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-[#00B900] hover:bg-[#009900] text-white rounded-xl p-4 transition-all hover:shadow-md hover:shadow-green-200"
              >
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <p className="text-xs text-white/70 mb-0.5">ทักหาเราผ่าน</p>
                  <p className="font-bold">LINE Official Account</p>
                </div>
              </a>
            </div>

            {/* ─── Business hours + Live status ─────────────────────────── */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-blue-500" />
                <h4 className="font-semibold text-gray-900 text-sm">เวลาทำการ</h4>
              </div>

              {/* Live open/closed badge */}
              <div className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl border text-sm font-bold shadow-sm ${
                !status
                  ? 'bg-slate-50 border-slate-100 text-slate-400'
                  : status.isOpen
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}>
                {!status ? (
                  <><div className="w-2.5 h-2.5 bg-slate-300 rounded-full animate-pulse" /> <span className="flex-1 text-base">กำลังโหลดสถานะ...</span></>
                ) : status.isOpen ? (
                  <><div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" /> <span className="flex-1 text-base">ตอนนี้เปิดทำการ</span></>
                ) : (
                  <><div className="w-2.5 h-2.5 bg-red-500 rounded-full" /> <span className="flex-1 text-base">ตอนนี้ปิดทำการ</span></>
                )}
              </div>

              {/* Smart Upcoming Holiday Notice */}
              {activeOrSoonHoliday && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
                  <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-900">⚠️ แจ้งวันหยุด: {activeOrSoonHoliday.title}</p>
                    <p className="text-sm text-amber-800 mt-1.5 leading-relaxed">
                      ปิดทำการช่วง {formatDateTH(activeOrSoonHoliday.startDate)}
                      {activeOrSoonHoliday.startDate !== activeOrSoonHoliday.endDate &&
                        ` - ${formatDateTH(activeOrSoonHoliday.endDate)}`
                      }
                      <br/>
                      จะเปิดให้บริการตามปกติใน<span className="font-bold underline underline-offset-2 ml-1">{getReopenMessage(activeOrSoonHoliday.endDate)}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Regular hours (Neutral Styling) */}
              <div className="space-y-2 text-sm text-gray-600 pt-2">
                <div className="flex justify-between items-center py-1">
                  <span>จันทร์ – เสาร์</span>
                  <span className="font-medium text-gray-900">08:00 – 17:00 น.</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>อาทิตย์</span>
                  <span className="text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded text-xs">ปิดทำการ</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right form ──────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 sm:p-10">
              {submitStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">ส่งข้อความสำเร็จ!</h3>
                  <p className="text-gray-600">ทีมงานของเราจะติดต่อกลับหาคุณโดยเร็วที่สุด ขอบคุณที่สนใจบริการของเราครับ</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-name">ชื่อ-นามสกุล *</label>
                      <input id="contact-name" name="name" required value={form.name} onChange={handleChange}
                        placeholder="คุณ..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-phone">เบอร์โทรศัพท์ *</label>
                      <input id="contact-phone" name="phone" type="tel" required value={form.phone} onChange={handleChange}
                        placeholder="0XX-XXX-XXXX"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-email">อีเมล</label>
                    <input id="contact-email" name="email" type="email" value={form.email} onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-project">ประเภทสินค้า/บริการ</label>
                    <select id="contact-project" name="project" value={form.project} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white">
                      <option value="">-- เลือกประเภทสินค้า/บริการ --</option>
                      <option>แผ่นพื้นสำเร็จรูป (Precast / Hollow Core Slab)</option>
                      <option>งานโพสเทนชั่น (Post-Tension)</option>
                      <option>กำแพงกันดินตัว L</option>
                      <option>รั้วสำเร็จรูป</option>
                      <option>เสารั้วลวดหนาม</option>
                      <option>เสาเข็มคอนกรีตอัดแรง</option>
                      <option>อื่นๆ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-message">รายละเอียดเพิ่มเติม</label>
                    <textarea id="contact-message" name="message" rows={4} value={form.message} onChange={handleChange}
                      placeholder="ขนาดพื้นที่, ช่วงพาด, จำนวนที่ต้องการ หรือรายละเอียดโครงการ..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white resize-none" />
                  </div>

                  <button
                    type="submit"
                    disabled={submitStatus === 'sending'}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 text-base"
                  >
                    {submitStatus === 'sending' ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        กำลังส่ง...
                      </>
                    ) : (
                      <><Send size={20} /> ส่งข้อความ</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
