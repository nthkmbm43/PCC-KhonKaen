import { Shield, Clock, Wrench, Award, MapPin, Headphones, CheckCircle } from 'lucide-react';

type WhyItem = {
  title: string;
  description: string;
  icon?: string;
};

type WhyUsBlockProps = {
  data: {
    headline?: string;
    subheadline?: string;
    items?: WhyItem[];
  };
};

const iconMap: Record<string, React.ReactNode> = {
  shield: <Shield size={28} />,
  clock: <Clock size={28} />,
  wrench: <Wrench size={28} />,
  award: <Award size={28} />,
  mapPin: <MapPin size={28} />,
  headphones: <Headphones size={28} />,
  check: <CheckCircle size={28} />,
};

const defaultItems: WhyItem[] = [
  {
    icon: 'award',
    title: 'มาตรฐาน มอก. รับรอง',
    description: 'ผลิตภัณฑ์ทุกชิ้นผ่านการรับรองมาตรฐาน มอก. 576-2546 และ มอก.828-2546 ควบคุมคุณภาพโดยวิศวกรผู้เชี่ยวชาญ',
  },
  {
    icon: 'clock',
    title: 'ประสบการณ์กว่า 20 ปี',
    description: 'ดำเนินธุรกิจในวงการก่อสร้างมากกว่า 20 ปี มีผลงานที่ผ่านมาให้ลูกค้าอ้างอิงได้ทั่วภาคอีสานและทั่วประเทศ',
  },
  {
    icon: 'wrench',
    title: 'บริการครบวงจร',
    description: 'ออกแบบ ผลิต จัดส่ง และติดตั้งโดยทีมงานของเราเอง ไม่ผ่านนายหน้า ประหยัดต้นทุน ควบคุมคุณภาพได้ทุกขั้นตอน',
  },
  {
    icon: 'shield',
    title: 'โรงงานผลิตได้มาตรฐาน',
    description: 'โรงงานผลิตที่ทันสมัย ผ่านการรับรองและตรวจสอบ ใช้วัตถุดิบคุณภาพสูงทุกชิ้น',
  },
  {
    icon: 'mapPin',
    title: 'ครอบคลุมพื้นที่ภาคอีสาน',
    description: 'มีสาขาในขอนแก่นและเชียงใหม่ พร้อมให้บริการจัดส่งและติดตั้งทั่วภาคอีสานและภาคเหนือ',
  },
  {
    icon: 'headphones',
    title: 'ทีมวิศวกรพร้อมปรึกษาฟรี',
    description: 'ทีมวิศวกรผู้เชี่ยวชาญของเราพร้อมให้คำปรึกษา ประเมินราคา และออกแบบเบื้องต้นฟรี ไม่มีค่าใช้จ่าย',
  },
];

export default function WhyUsBlock({ data }: WhyUsBlockProps) {
  const headline = data?.headline || 'ทำไมต้องเลือก PCC Post-Tension?';
  const subheadline = data?.subheadline || 'เราไม่ใช่แค่ผู้ขาย แต่เป็นพันธมิตรที่คุณไว้วางใจได้ตลอดโครงการ';
  const items = data?.items || defaultItems;

  return (
    <section className="py-20 sm:py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#e0f2fe_0%,_transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            จุดแข็งของเรา
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            {headline}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subheadline}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-500 hover:-translate-y-1 flex flex-col gap-4"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                {item.icon && iconMap[item.icon] ? iconMap[item.icon] : <CheckCircle size={28} />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
              {/* Bottom accent line */}
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="h-0.5 w-0 bg-gradient-to-r from-blue-500 to-blue-300 group-hover:w-full transition-all duration-500 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
