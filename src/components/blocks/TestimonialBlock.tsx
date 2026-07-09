import { Star, Quote } from 'lucide-react';

type Testimonial = {
  name: string;
  role?: string;
  company?: string;
  message: string;
  rating?: number;
  avatarInitials?: string;
};

type TestimonialBlockProps = {
  data: {
    headline?: string;
    subheadline?: string;
    description?: string;
    testimonials?: Testimonial[];
  };
};

const defaultTestimonials: Testimonial[] = [
  {
    name: 'คุณสมชาย วงศ์ใหญ่',
    role: 'เจ้าของโครงการ',
    company: 'อาคารพาณิชย์ขอนแก่น',
    message: 'บริการดีมากครับ ทีมงานมืออาชีพ แผ่นพื้นสำเร็จรูปคุณภาพดี ส่งตรงเวลา ราคาคุ้มค่า ประทับใจมากครับ จะใช้บริการอีกแน่นอน',
    rating: 5,
    avatarInitials: 'สช',
  },
  {
    name: 'คุณนภาพร รักดี',
    role: 'วิศวกรโครงการ',
    company: 'บริษัทรับเหมาก่อสร้าง',
    message: 'ใช้บริการกำแพงกันดินตัว L มาหลายโครงการแล้ว คุณภาพงานได้มาตรฐาน มอก. จริงๆ ทีมวิศวกรให้คำปรึกษาได้ดีมาก แนะนำเลยครับ',
    rating: 5,
    avatarInitials: 'นภ',
  },
  {
    name: 'คุณเกษม ผลิตพล',
    role: 'เจ้าของที่ดิน',
    company: 'โครงการหมู่บ้านจัดสรร',
    message: 'สั่งรั้วสำเร็จรูปไปทำรั้วบ้านจัดสรร ทีมงานติดตั้งรวดเร็ว งานเรียบร้อย ลูกค้าของผมชื่นชอบมาก ราคาก็สมเหตุสมผลดีครับ',
    rating: 5,
    avatarInitials: 'กษ',
  },
];

export default function TestimonialBlock({ data }: TestimonialBlockProps) {
  const headline = data?.headline || 'ลูกค้าพูดถึงเรา';
  const subheadline = data?.subheadline || data?.description || 'ความไว้วางใจจากลูกค้าคือรางวัลสูงสุดที่เราภาคภูมิใจ';
  
  const customItems = Array.isArray((data as any)?.items) && (data as any).items.length > 0
    ? (data as any).items.filter((item: any) => item.isVisible !== false).map((item: any) => ({
        name: item.name || 'ลูกค้า',
        role: item.role,
        company: item.company,
        message: item.quote,
        rating: item.rating || 5,
        avatarInitials: item.avatarInitials,
      }))
    : null;

  const testimonials = customItems || data?.testimonials || defaultTestimonials;

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-50 rounded-full blur-[100px] opacity-70 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-50 rounded-full blur-[100px] opacity-70 translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            รีวิวจากลูกค้าจริง
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            {headline}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subheadline}</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t: any, i: number) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col gap-5 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-blue-100">
                <Quote size={40} fill="currentColor" />
              </div>

              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating ?? 5 }).map((_, si) => (
                  <Star key={si} size={18} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Message */}
              <p className="text-gray-700 text-sm leading-relaxed italic flex-grow relative z-10">
                &ldquo;{t.message}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.avatarInitials || t.name.slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  {(t.role || t.company) && (
                    <p className="text-gray-500 text-xs">
                      {t.role}{t.role && t.company ? ' · ' : ''}{t.company}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
