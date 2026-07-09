type Step = {
  number?: number;
  title: string;
  description: string;
};

type ProcessBlockProps = {
  data: {
    headline?: string;
    subheadline?: string;
    description?: string;
    steps?: Step[];
    theme?: 'light' | 'dark';
  };
};

const defaultSteps: Step[] = [
  {
    title: 'ปรึกษาและประเมินโครงการ',
    description: 'ติดต่อทีมวิศวกรของเรา เพื่อรับคำปรึกษาเบื้องต้น ประเมินพื้นที่ และกำหนดความต้องการของโครงการ ฟรี ไม่มีค่าใช้จ่าย',
  },
  {
    title: 'ออกแบบและเสนอราคา',
    description: 'ทีมวิศวกรเราจะออกแบบและคำนวณโครงสร้างที่เหมาะสม พร้อมจัดทำใบเสนอราคาที่ชัดเจน ไม่มีค่าใช้จ่ายซ่อนเร้น',
  },
  {
    title: 'ผลิตในโรงงานมาตรฐาน',
    description: 'ผลิตชิ้นส่วนคอนกรีตในโรงงานที่ผ่านการรับรองมาตรฐาน มอก. ควบคุมคุณภาพทุกขั้นตอน',
  },
  {
    title: 'จัดส่งและติดตั้ง',
    description: 'ทีมช่างผู้ชำนาญการดำเนินการจัดส่งและติดตั้งอย่างรวดเร็ว ปลอดภัย ตรงตามกำหนดเวลา',
  },
  {
    title: 'ตรวจสอบและส่งมอบ',
    description: 'ตรวจสอบคุณภาพงานก่อนส่งมอบ พร้อมให้การรับประกันงานและบริการหลังการขายที่เชื่อถือได้',
  },
];

export default function ProcessBlock({ data }: ProcessBlockProps) {
  const headline = data?.headline || 'ขั้นตอนการทำงานของเรา';
  const subheadline = data?.subheadline || data?.description || 'ขั้นตอนที่ชัดเจน โปร่งใส และได้มาตรฐาน ตั้งแต่เริ่มต้นจนส่งมอบงาน';
  const steps = data?.steps || defaultSteps;
  const isDark = data?.theme === 'dark';

  return (
    <section
      className={`py-20 sm:py-24 relative overflow-hidden ${
        isDark ? 'bg-slate-900' : 'bg-white'
      }`}
    >
      {isDark && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.08)_0%,_transparent_70%)] pointer-events-none" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className={`inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 ${
              isDark ? 'bg-blue-900/60 text-blue-300' : 'bg-blue-100 text-blue-700'
            }`}
          >
            ขั้นตอนการดำเนินงาน
          </span>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {headline}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            {subheadline}
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center group">
                {/* Mobile connector */}
                {i < steps.length - 1 && (
                  <div className="lg:hidden absolute top-[4.5rem] left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-blue-300 to-transparent" />
                )}

                {/* Number circle */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-200 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-2xl font-extrabold text-white">{step.number ?? i + 1}</span>
                  {/* Outer ring pulse */}
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
                </div>

                <h3
                  className={`font-bold text-base mb-3 group-hover:text-blue-600 transition-colors ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {step.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
