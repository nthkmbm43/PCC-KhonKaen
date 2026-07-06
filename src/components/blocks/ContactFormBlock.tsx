'use client';
import { useState } from 'react';
import { Send, CheckCircle, Phone, MessageSquare } from 'lucide-react';

type ContactFormBlockProps = {
  data: {
    headline?: string;
    subheadline?: string;
    phone?: string;
    lineUrl?: string;
  };
};

export default function ContactFormBlock({ data }: ContactFormBlockProps) {
  const headline = data?.headline || 'ส่งข้อความหาเรา';
  const subheadline = data?.subheadline || 'กรอกข้อมูลด้านล่าง ทีมงานของเราจะติดต่อกลับภายใน 24 ชั่วโมง';
  const phone = data?.phone || '063-454-5656';
  const lineUrl = data?.lineUrl || '#';

  const [form, setForm] = useState({ name: '', phone: '', email: '', project: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate form submission - in production connect to an API route
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('success');
  };

  return (
    <section className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* Left info panel */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                ติดต่อเรา
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {headline}
              </h2>
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
                className="flex items-center gap-4 bg-[#00B900] hover:bg-[#009900] text-white rounded-xl p-4 group transition-all hover:shadow-md hover:shadow-green-200"
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

            {/* Business hours */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">เวลาทำการ</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between"><span>จันทร์ – เสาร์</span><span className="font-medium text-gray-900">08:00 – 17:00 น.</span></div>
                <div className="flex justify-between"><span>อาทิตย์</span><span className="text-red-500">ปิดทำการ</span></div>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 sm:p-10">
              {status === 'success' ? (
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
                      <input
                        id="contact-name"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="คุณ..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-phone">เบอร์โทรศัพท์ *</label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="0XX-XXX-XXXX"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-email">อีเมล</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-project">ประเภทโครงการ</label>
                    <select
                      id="contact-project"
                      name="project"
                      value={form.project}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                    >
                      <option value="">-- เลือกประเภทสินค้า/บริการ --</option>
                      <option>กำแพงกันดินตัว L</option>
                      <option>รั้วสำเร็จรูป</option>
                      <option>แผ่นพื้นสำเร็จรูป (Hollow Core Slab)</option>
                      <option>เสารั้วลวดหนาม</option>
                      <option>งานโพสเทนชั่น</option>
                      <option>รั้วคาวบอย</option>
                      <option>อื่นๆ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="contact-message">รายละเอียดเพิ่มเติม</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="ขนาดพื้นที่, จำนวนที่ต้องการ, หรือรายละเอียดโครงการ..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 text-base"
                  >
                    {status === 'sending' ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        กำลังส่ง...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        ส่งข้อความ
                      </>
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
