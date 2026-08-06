'use client';
import { useState } from 'react';
import { Send, CheckCircle, Phone, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { readLeadAttribution, trackLeadEvent } from '@/lib/lead-attribution';

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
    description?: string;
    phone?: string;
    lineUrl?: string;
    workingHours?: string;
    holidayNotice?: string;
    defaultProject?: string;
  };
  initialStatus?: BusinessStatus | null;
};

function formatDateTH(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const MONTHS_TH = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${day} ${MONTHS_TH[month]} ${year + 543}`;
}

export default function ContactFormBlock({ data, initialStatus }: ContactFormBlockProps) {
  const headline    = data?.headline    || 'ส่งข้อความหาเรา';
  const subheadline = data?.subheadline || data?.description || 'กรอกข้อมูลด้านล่าง ทีมงานของเราจะติดต่อกลับภายใน 24 ชั่วโมงในวันทำการ';
  const phone       = data?.phone       || '063-454-5656';
  const lineUrl     = data?.lineUrl     || '#';

  const emptyForm = {
    name: '', phone: '', email: '', project: data?.defaultProject || '', message: '',
    province: '', district: '', estimatedLength: '', levelDifference: '',
    waterCondition: '', accessCondition: '', nearbyLoad: '',
  };
  const [form, setForm]           = useState(emptyForm);
  const [website, setWebsite] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [leadCode, setLeadCode] = useState('');
  const status = initialStatus || null;
  const isRetainingWall = form.project.includes('กำแพงกันดิน');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('sending');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website, attribution: readLeadAttribution() }),
      });

      if (!response.ok) throw new Error('Lead submission failed');
      const result = await response.json() as { leadCode?: string };

      trackLeadEvent('generate_lead', {
        form_name: 'contact_form',
        page_path: window.location.pathname,
        project_type: form.project || 'not_specified',
        lead_team: 'khon-kaen-new-team',
        source_site: window.location.hostname,
      });
      setLeadCode(result.leadCode || '');
      setSubmitStatus('success');
      setForm(emptyForm);
    } catch {
      setSubmitStatus('error');
    }
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
      activeOrSoonHoliday = nextH;
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
              {status && (
                <div className={`flex items-center gap-2.5 px-4 py-3.5 rounded-xl border text-sm font-bold shadow-sm ${
                  status.isOpen
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}>
                  {status.isOpen
                    ? <><div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" /> <span className="flex-1 text-base">ตอนนี้เปิดทำการ</span></>
                    : <><div className="w-2.5 h-2.5 bg-red-500 rounded-full" /> <span className="flex-1 text-base">ตอนนี้ปิดทำการ</span></>
                  }
                </div>
              )}

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

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-950">
              <p className="font-bold">ช่องทางประสานงานทีมขอนแก่น</p>
              <p className="mt-1 text-blue-900">
                ทีมนี้รับข้อมูลและส่งต่อให้ฝ่ายขายกับผู้รับผิดชอบโครงการของบริษัทดำเนินการประเมินราคา จัดทำข้อเสนอ ผลิต และติดตั้งตามขั้นตอนของบริษัท
              </p>
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
                  {leadCode ? (
                    <p className="mt-5 rounded-lg bg-slate-100 px-4 py-2 font-mono text-sm font-bold text-slate-800">
                      เลขอ้างอิง: {leadCode}
                    </p>
                  ) : null}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <label htmlFor="contact-website">Website</label>
                    <input
                      id="contact-website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(event) => setWebsite(event.target.value)}
                    />
                  </div>
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
                      <option>ผนัง Precast (ผนังคอนกรีตสำเร็จรูป)</option>
                      <option>แผ่นพื้นสำเร็จรูป (Precast / Hollow Core Slab)</option>
                      <option>งานโพสเทนชั่น (Post-Tension)</option>
                      <option>กำแพงกันดินตัว L</option>
                      <option>รั้วสำเร็จรูป</option>
                      <option>เสารั้วลวดหนาม</option>
                      <option>เสาเข็มคอนกรีตอัดแรง</option>
                      <option>อื่นๆ</option>
                    </select>
                  </div>

                  {isRetainingWall ? (
                    <fieldset className="space-y-4 rounded-xl border border-blue-200 bg-blue-50/60 p-5">
                      <legend className="px-2 text-sm font-bold text-blue-900">ข้อมูลเบื้องต้นสำหรับประเมินกำแพงกันดิน</legend>
                      <p className="text-xs leading-5 text-blue-800">กรอกเท่าที่ทราบได้ ทีมงานจะตรวจสอบรายละเอียดกับผู้รับผิดชอบโครงการอีกครั้ง</p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="contact-province">จังหวัดหน้างาน</label>
                          <input id="contact-province" name="province" value={form.province} onChange={handleChange} placeholder="เช่น ขอนแก่น" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="contact-district">อำเภอ/เขต</label>
                          <input id="contact-district" name="district" value={form.district} onChange={handleChange} placeholder="เช่น เมืองขอนแก่น" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="contact-length">ความยาวแนวโดยประมาณ</label>
                          <input id="contact-length" name="estimatedLength" value={form.estimatedLength} onChange={handleChange} placeholder="เช่น 40 เมตร" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="contact-level">ความต่างระดับโดยประมาณ</label>
                          <input id="contact-level" name="levelDifference" value={form.levelDifference} onChange={handleChange} placeholder="เช่น 1.5 เมตร" className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <label className="text-sm font-medium text-gray-700">น้ำ/การระบายน้ำ
                          <select name="waterCondition" value={form.waterCondition} onChange={handleChange} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm"><option value="">ไม่แน่ใจ</option><option>ไม่มีน้ำขังที่สังเกตได้</option><option>มีน้ำขังหรือทางน้ำ</option><option>อยู่ใกล้แหล่งน้ำ</option></select>
                        </label>
                        <label className="text-sm font-medium text-gray-700">ทางเข้าหน้างาน
                          <select name="accessCondition" value={form.accessCondition} onChange={handleChange} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm"><option value="">ไม่แน่ใจ</option><option>รถบรรทุกและรถยกเข้าถึงได้</option><option>ทางเข้าแคบหรือมีข้อจำกัด</option><option>ต้องสำรวจหน้างาน</option></select>
                        </label>
                        <label className="text-sm font-medium text-gray-700">สิ่งที่อยู่ใกล้แนว
                          <select name="nearbyLoad" value={form.nearbyLoad} onChange={handleChange} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm"><option value="">ไม่แน่ใจ</option><option>พื้นที่ว่าง</option><option>บ้านหรืออาคาร</option><option>ถนนหรือรถใช้งาน</option><option>รั้วหรือโครงสร้างอื่น</option></select>
                        </label>
                      </div>
                    </fieldset>
                  ) : null}

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
                  {submitStatus === 'error' ? (
                    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      ส่งข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง หรือโทร/ติดต่อผ่าน LINE ทางด้านซ้าย
                    </div>
                  ) : null}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
