import Link from 'next/link';

type SpecRow = {
  label: string;
  value: string;
};

type SpecTable = {
  title: string;
  rows: SpecRow[];
};

type ProductSpecBlockProps = {
  data: {
    headline?: string;
    subheadline?: string;
    tables?: SpecTable[];
    features?: string[];
    standardNote?: string;
  };
};

const defaultData: ProductSpecBlockProps['data'] = {
  headline: 'ข้อมูลทางเทคนิคและสเปค',
  subheadline: 'รายละเอียดข้อมูลจำเพาะผลิตภัณฑ์มาตรฐาน มอก.',
  tables: [
    {
      title: 'สเปคแผ่นพื้น Hollow Core Slab',
      rows: [
        { label: 'ความหนา', value: '8, 10, 12, 15, 20, 25, 30 ซม.' },
        { label: 'ความกว้าง', value: '60 ซม. และ 120 ซม.' },
        { label: 'ความยาว', value: 'ผลิตตามสั่ง (สูงสุด 12 เมตร)' },
        { label: 'กำลังอัดคอนกรีต', value: 'ไม่น้อยกว่า 400 ksc' },
        { label: 'มาตรฐาน', value: 'มอก. 576-2546 และ มอก. 828-2546' },
        { label: 'การรับน้ำหนัก', value: 'ขึ้นอยู่กับความหนาและช่วงพาด' },
      ],
    },
  ],
  features: [
    'ลดน้ำหนักโครงสร้างเมื่อเทียบกับแผ่นพื้นทึบ',
    'ติดตั้งรวดเร็ว ลดระยะเวลาก่อสร้าง',
    'ผลิตในโรงงาน ควบคุมคุณภาพได้ดีกว่าเทในสถานที่',
    'ช่องกลวงสามารถใช้เดินท่อร้อยสายไฟได้',
    'ประหยัดแบบหล่อ ลดต้นทุนการก่อสร้าง',
  ],
  standardNote: 'ผลิตตามมาตรฐาน มอก. 576-2546 (แผ่นพื้นคอนกรีตอัดแรง) และ มอก. 828-2546 (แผ่นพื้นคอนกรีตอัดแรงชนิดกลวง) โดยโรงงานที่ได้รับการรับรองจากสำนักงานมาตรฐานผลิตภัณฑ์อุตสาหกรรม',
};

export default function ProductSpecBlock({ data }: ProductSpecBlockProps) {
  const merged = { ...defaultData, ...data };
  const { headline, subheadline, tables, features, standardNote } = merged;

  return (
    <section className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            ข้อมูลทางเทคนิค
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">{headline}</h2>
          {subheadline && <p className="text-gray-600 max-w-2xl mx-auto">{subheadline}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Spec tables */}
          <div className="space-y-6">
            {tables?.map((table, ti) => (
              <div key={ti} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4">
                  <h3 className="text-white font-bold text-base">{table.title}</h3>
                </div>
                <table className="w-full">
                  <tbody>
                    {table.rows.map((row, ri) => (
                      <tr
                        key={ri}
                        className={`border-b border-gray-50 last:border-0 ${ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                      >
                        <td className="px-6 py-3.5 text-sm font-medium text-gray-700 w-2/5">{row.label}</td>
                        <td className="px-6 py-3.5 text-sm text-gray-900">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* Features + note */}
          <div className="space-y-6">
            {features && features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 text-lg mb-5">ข้อดีและจุดเด่น</h3>
                <ul className="space-y-3">
                  {features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {standardNote && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-1">มาตรฐานการผลิต</p>
                    <p className="text-sm text-blue-700 leading-relaxed">{standardNote}</p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA card */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">ต้องการใบเสนอราคา?</h3>
              <p className="text-blue-200 text-sm mb-5">แจ้งขนาดและปริมาณที่ต้องการ เราจะคำนวณราคาให้ฟรีภายใน 24 ชั่วโมง</p>
              <Link
                href="/contact"
                className="inline-block bg-white text-blue-700 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors"
              >
                ขอใบเสนอราคาฟรี →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
