import { db } from "@/db";
import { pages, seoMetadata, siteSettings } from "@/db/schema";
import { NextResponse } from "next/server";
import { requireBearerSecret } from "@/lib/auth/api";

export const dynamic = 'force-dynamic';

// ─── SHARED CONTENT BLOCKS ────────────────────────────────────────────────────
const WHY_US_ITEMS = [
  { icon: 'award', title: 'มาตรฐาน มอก. รับรอง', description: 'ทุกผลิตภัณฑ์ผ่านการรับรองมาตรฐาน มอก. ควบคุมคุณภาพโดยวิศวกรผู้เชี่ยวชาญทุกขั้นตอน' },
  { icon: 'clock', title: 'ประสบการณ์กว่า 20 ปี', description: 'ดำเนินธุรกิจในวงการก่อสร้างมากกว่า 20 ปี มีผลงานอ้างอิงทั่วภาคอีสานและทั่วประเทศ' },
  { icon: 'wrench', title: 'บริการครบวงจร OEM', description: 'ออกแบบ ผลิต จัดส่ง และติดตั้งโดยทีมของเราเอง ไม่ผ่านนายหน้า ประหยัดต้นทุน' },
  { icon: 'shield', title: 'โรงงานได้มาตรฐาน', description: 'โรงงานผลิตทันสมัย ผ่านการรับรอง ใช้วัตถุดิบคุณภาพสูงทุกชิ้น' },
  { icon: 'mapPin', title: 'ครอบคลุมภาคอีสาน', description: 'สาขาขอนแก่นและเชียงใหม่ พร้อมบริการจัดส่งและติดตั้งทั่วภาคอีสานและภาคเหนือ' },
  { icon: 'headphones', title: 'ปรึกษาวิศวกรฟรี', description: 'ทีมวิศวกรพร้อมให้คำปรึกษา ประเมินราคา และออกแบบเบื้องต้นฟรี ไม่มีค่าใช้จ่าย' },
];

const PROCESS_STEPS = [
  { title: 'ปรึกษาและประเมิน', description: 'ติดต่อทีมวิศวกรเพื่อรับคำปรึกษาและประเมินโครงการฟรี ไม่มีค่าใช้จ่าย' },
  { title: 'ออกแบบและเสนอราคา', description: 'จัดทำใบเสนอราคาชัดเจน ไม่มีค่าใช้จ่ายซ่อนเร้น ส่งให้ภายใน 24 ชั่วโมง' },
  { title: 'ผลิตในโรงงาน มอก.', description: 'ผลิตในโรงงานมาตรฐาน มอก. ควบคุมคุณภาพคอนกรีตและลวดอัดแรงทุกชุด' },
  { title: 'จัดส่งและติดตั้ง', description: 'ส่งมอบตรงเวลา ติดตั้งโดยทีมช่างผู้เชี่ยวชาญ พร้อมวิศวกรควบคุมหน้างาน' },
  { title: 'ส่งมอบและรับประกัน', description: 'ตรวจสอบคุณภาพก่อนส่งมอบ พร้อมบริการหลังการขายและการรับประกัน' },
];

const BRANCHES = [
  {
    name: 'สาขาขอนแก่น (สำนักงานใหญ่)',
    address: 'เลขที่ 100 หมู่ 11 ตำบลแดงใหญ่ อำเภอเมือง จังหวัดขอนแก่น 40000',
    phone: '063-454-5656',
    email: 'contact@pcc-posttension.com',
    hours: 'จันทร์ – อาทิตย์: 08:00 – 17:00 น.',
    mapUrl: 'https://maps.google.com/?q=16.4419,102.8359',
    isPrimary: true,
  },
  {
    name: 'สาขาเชียงใหม่',
    address: '292/1 ถนนเชียงใหม่-ลำปาง ตำบลป่าตัน อำเภอเมือง จังหวัดเชียงใหม่ 50300',
    phone: '091-553-2624',
    hours: 'จันทร์ – อาทิตย์: 08:00 – 17:00 น.',
    mapUrl: 'https://maps.google.com/?q=18.8156,99.0199',
  },
];

// ─── NAV LINKS ────────────────────────────────────────────────────────────────
const NAVBAR_LINKS = [
  { label: 'หน้าแรก', url: '/' },
  { label: 'สินค้าและบริการ', url: '/products' },
  { label: 'ผลงานของเรา', url: '/portfolio' },
  { label: 'เกี่ยวกับเรา', url: '/about' },
  { label: 'ติดต่อเรา', url: '/contact' },
];

export async function GET(req: Request) {
  const secretResponse = requireBearerSecret(req, "SEED_SECRET");
  if (secretResponse) return secretResponse;

  try {
    // ── 1. Upsert siteSettings ──────────────────────────────────────────────
    const existingSettings = await db.select().from(siteSettings).limit(1);
    const CORRECT_WORKING_HOURS = 'จันทร์ – เสาร์: 08:00 – 17:00 น. (หยุดทุกวันอาทิตย์)';
    if (existingSettings.length === 0) {
      await db.insert(siteSettings).values({
        navbarLinks: NAVBAR_LINKS,
        mainPhone: '063-454-5656',
        lineUrl: 'https://lin.ee/5O8rHvD',
        facebookUrl: 'https://www.facebook.com/profile.php?id=61591107462645',
        tiktokUrl: 'https://www.tiktok.com/@pcc.sales.kk',
        workingHours: CORRECT_WORKING_HOURS,
        companyAddress: 'เลขที่ 100 หมู่ 11 ตำบลแดงใหญ่ อำเภอเมือง จังหวัดขอนแก่น 40000',
      });
    } else {
      // Only update navbarLinks and workingHours — preserve logo/other settings
      await db.update(siteSettings).set({
        navbarLinks: NAVBAR_LINKS,
        lineUrl: existingSettings[0].lineUrl || 'https://lin.ee/5O8rHvD',
        facebookUrl: existingSettings[0].facebookUrl || 'https://www.facebook.com/profile.php?id=61591107462645',
        tiktokUrl: existingSettings[0].tiktokUrl || 'https://www.tiktok.com/@pcc.sales.kk',
        workingHours: CORRECT_WORKING_HOURS,
        mainPhone: existingSettings[0].mainPhone || '063-454-5656',
      });
    }

    // ── 2. Pages seed data ────────────────────────────────────────────────────
    const seedData = [
      // ============================
      // HOME PAGE
      // ============================
      {
        slug: 'home',
        title: 'หน้าหลัก',
        content: [
          {
            type: 'hero',
            heading: 'PCC Post-Tension สาขาขอนแก่น',
            subheading: 'ผู้ผลิตและติดตั้ง พรีแคสท์คอนกรีต แผ่นพื้นสำเร็จรูป กำแพงกันดิน รั้วสำเร็จรูป และงานโพสเทนชั่น ครบวงจร มาตรฐาน มอก. โดยวิศวกรผู้เชี่ยวชาญ',
            buttons: [
              { label: 'โทรหาเราเลย 063-454-5656', url: 'tel:0634545656', style: 'primary' },
              { label: 'ดูสินค้าทั้งหมด', url: '/products', style: 'secondary' },
            ],
          },
          {
            type: 'stats',
            headline: 'ตัวเลขที่สะท้อนความเชี่ยวชาญของเรา',
            stats: [
              { value: 20, suffix: '+', label: 'ปีประสบการณ์' },
              { value: 500, suffix: '+', label: 'โครงการสำเร็จ' },
              { value: 1000, suffix: '+', label: 'ลูกค้าที่ไว้ใจ' },
              { value: 100, suffix: '%', label: 'มาตรฐาน มอก.' },
            ],
          },
          // ── ไฮไลต์ 2 สินค้าเด่น: Precast + Post-tension ──────────────────
          {
            type: 'richText',
            content: `
<div style="background:linear-gradient(135deg,#1e3a8a 0%,#1e40af 100%);padding:3rem 1.5rem;text-align:center;color:white;">
  <p style="font-size:.85rem;letter-spacing:.15em;text-transform:uppercase;color:#93c5fd;margin-bottom:.75rem;font-weight:700;">สินค้าแนะนำ • Best Sellers</p>
  <h2 style="font-size:2rem;font-weight:800;margin-bottom:1rem;line-height:1.2;">พรีแคสท์ & โพสเทนชั่น<br/>สองเทคโนโลยีที่เปลี่ยนการก่อสร้างของคุณ</h2>
  <p style="font-size:1.1rem;color:#bfdbfe;max-width:700px;margin:0 auto 2.5rem;line-height:1.8;">
    ประหยัดเวลา ลดต้นทุน และได้โครงสร้างที่แข็งแกร่งกว่า — ด้วยวัสดุสำเร็จรูปจากโรงงานมาตรฐาน มอก. ที่คุณไว้ใจได้
  </p>
  <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
    <a href="/products/hollow-core-slab" style="display:inline-block;background:white;color:#1e40af;font-weight:700;padding:.9rem 2rem;border-radius:999px;text-decoration:none;font-size:1rem;">
      🏗️ แผ่นพื้นสำเร็จรูป (Precast)
    </a>
    <a href="/products/post-tension" style="display:inline-block;background:#00B900;color:white;font-weight:700;padding:.9rem 2rem;border-radius:999px;text-decoration:none;font-size:1rem;">
      ⚙️ งานโพสเทนชั่น (Post-Tension)
    </a>
  </div>
</div>`,
          },
          {
            type: 'featureGrid',
            headline: 'ผลิตภัณฑ์คอนกรีตสำเร็จรูปทั้งหมดของเรา',
            description: 'ครบทุกความต้องการก่อสร้าง ผลิตในโรงงานมาตรฐาน มอก. พร้อมบริการติดตั้งโดยวิศวกร',
          },
          {
            type: 'whyUs',
            headline: 'ทำไมต้องเลือก PCC Post-Tension?',
            subheadline: 'มากกว่า 20 ปีที่เราสร้างความเชื่อมั่นให้กับลูกค้าทั่วภาคอีสาน',
            items: WHY_US_ITEMS,
          },
          {
            type: 'process',
            headline: 'ขั้นตอนการสั่งซื้อ',
            subheadline: 'ง่าย สะดวก โปร่งใส ตั้งแต่ปรึกษาจนส่งมอบงาน',
            steps: PROCESS_STEPS,
          },
          {
            type: 'testimonial',
            headline: 'เสียงจากลูกค้าจริงของเรา',
            subheadline: 'ความไว้วางใจที่สะสมมากกว่า 20 ปี',
          },
          {
            type: 'cta',
            headline: 'พร้อมเริ่มโครงการของคุณ?',
            description: 'รับคำปรึกษาจากทีมวิศวกรของเราฟรี พร้อมใบเสนอราคาภายใน 24 ชั่วโมง ไม่มีค่าใช้จ่าย',
            buttonText: 'ติดต่อเราเลย',
            buttonUrl: '/contact',
          },
        ],
        seo: {
          title: 'กำแพงกันดิน รั้วสำเร็จรูป แผ่นพื้นพรีแคสท์ โพสเทนชั่น ขอนแก่น | PCC',
          description: 'PCC Post-Tension ขอนแก่น รับออกแบบ ผลิต ติดตั้ง แผ่นพื้นสำเร็จรูป Hollow Core Slab งานโพสเทนชั่น กำแพงกันดินตัว L รั้วสำเร็จรูป เสารั้วลวดหนาม มาตรฐาน มอก. โดยวิศวกร โทร 063-454-5656',
        },
      },

      // ============================
      // PORTFOLIO PAGE
      // ============================
      {
        slug: 'portfolio',
        title: 'ผลงานของเรา',
        content: [
          {
            type: 'hero',
            heading: 'ผลงานที่ผ่านมาของเรา',
            subheading: 'ความภูมิใจของ PCC Post-Tension ที่ได้รับความไว้วางใจจากโครงการชั้นนำ ทั้งในจังหวัดขอนแก่นและทั่วภาคอีสาน เรามุ่งมั่นส่งมอบโครงสร้างที่แข็งแกร่ง ปลอดภัย และได้มาตรฐาน',
            buttons: [
              { label: 'ปรึกษาโครงการของคุณฟรี', url: '/contact', style: 'primary' },
            ],
          },
          {
            type: 'richText',
            content: `
<div style="padding:4rem 1rem;background:#ffffff;">
  <div style="max-width:1200px;margin:0 auto;">
    
    <div style="margin-bottom:4rem;display:flex;flex-direction:column;gap:1.5rem;align-items:center;">
      <img src="https://pcc-posttension.com/wp-content/uploads/2025/03/%E0%B8%A3%E0%B8%B1%E0%B9%89%E0%B8%A7%E0%B8%AA%E0%B8%B3%E0%B9%80%E0%B8%A3%E0%B9%87%E0%B8%88%E0%B8%A3%E0%B8%B9%E0%B8%9B-min.webp" alt="โครงการหมู่บ้านจัดสรร" style="width:100%;max-width:800px;border-radius:1rem;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);" />
      <div style="text-align:center;">
        <span style="display:inline-block;padding:0.25rem 0.75rem;background:#dbeafe;color:#1e40af;font-size:0.875rem;font-weight:600;border-radius:999px;margin-bottom:0.5rem;">รั้วสำเร็จรูป</span>
        <h3 style="font-size:1.5rem;font-weight:700;color:#111827;">โครงการหมู่บ้านจัดสรร อ.เมือง จ.ขอนแก่น</h3>
        <p style="color:#6b7280;margin-top:0.5rem;">ผลิตและติดตั้งรั้วสำเร็จรูป ความยาวรวมกว่า 2 กิโลเมตร ส่งมอบงานตรงเวลา ได้แนวรั้วที่สวยงาม แข็งแรง และลดต้นทุนค่าแรงก่อสร้าง</p>
      </div>
    </div>

    <div style="margin-bottom:4rem;display:flex;flex-direction:column;gap:1.5rem;align-items:center;">
      <img src="https://pcc-posttension.com/wp-content/uploads/2025/03/%E0%B8%95%E0%B8%B1%E0%B8%A7L.webp" alt="โครงการโรงงาน" style="width:100%;max-width:800px;border-radius:1rem;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);" />
      <div style="text-align:center;">
        <span style="display:inline-block;padding:0.25rem 0.75rem;background:#fef3c7;color:#92400e;font-size:0.875rem;font-weight:600;border-radius:999px;margin-bottom:0.5rem;">กำแพงกันดินตัว L</span>
        <h3 style="font-size:1.5rem;font-weight:700;color:#111827;">โครงการโรงงาน อ.น้ำพอง จ.ขอนแก่น</h3>
        <p style="color:#6b7280;margin-top:0.5rem;">ติดตั้งกำแพงกันดินคอนกรีตสำเร็จรูป เพื่อรองรับพื้นที่ต่างระดับและป้องกันดินสไลด์สำหรับลานจอดรถบรรทุกของโรงงาน</p>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:1.5rem;align-items:center;">
      <img src="https://pcc-posttension.com/wp-content/uploads/2025/02/%E0%B9%82%E0%B8%9E%E0%B8%AA.jpg" alt="งานโพสเทนชั่น อาคารพาณิชย์" style="width:100%;max-width:800px;border-radius:1rem;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);" />
      <div style="text-align:center;">
        <span style="display:inline-block;padding:0.25rem 0.75rem;background:#d1fae5;color:#065f46;font-size:0.875rem;font-weight:600;border-radius:999px;margin-bottom:0.5rem;">งานโพสเทนชั่น</span>
        <h3 style="font-size:1.5rem;font-weight:700;color:#111827;">อาคารพาณิชย์ 4 ชั้น จ.อุดรธานี</h3>
        <p style="color:#6b7280;margin-top:0.5rem;">ออกแบบและติดตั้งระบบพื้น Post-Tension ช่วงพาดยาว ช่วยลดจำนวนเสา เพิ่มพื้นที่ใช้สอยภายในอาคารให้กว้างขวางขึ้น</p>
      </div>
    </div>

  </div>
</div>
            `
          },
          {
            type: 'cta',
            headline: 'ให้เราเป็นส่วนหนึ่งในความสำเร็จของโครงการคุณ',
            description: 'ยินดีให้คำปรึกษา แนะนำผลิตภัณฑ์ และประเมินราคาเบื้องต้นโดยทีมวิศวกรผู้เชี่ยวชาญ',
            buttonText: 'ติดต่อทีมงาน',
            buttonUrl: '/contact',
          }
        ],
        seo: {
          title: 'ผลงานของเรา | PCC Post-Tension ขอนแก่น',
          description: 'รวมผลงานผลิตภัณฑ์คอนกรีตสำเร็จรูป งานโพสเทนชั่น กำแพงกันดิน รั้วสำเร็จรูป โดย PCC Post-Tension ให้บริการในขอนแก่นและทั่วอีสาน',
        }
      },
      // ============================
      // ABOUT PAGE
      // ============================
      {
        slug: 'about',
        title: 'เกี่ยวกับเรา',
        content: [
          {
            type: 'hero',
            heading: 'บริษัท พีซีซี โพสเทนชั่น จำกัด',
            subheading: 'ผู้ผลิตและติดตั้งพรีแคสท์คอนกรีตและงานโพสเทนชั่นครบวงจรในภาคอีสาน ด้วยประสบการณ์กว่า 20 ปี',
            buttons: [
              { label: 'ดูสินค้าของเรา', url: '/products', style: 'primary' },
              { label: 'ติดต่อเรา', url: '/contact', style: 'secondary' },
            ],
          },
          {
            type: 'richText',
            content: `<div style="max-width:820px;margin:0 auto;padding:3.5rem 1.5rem;">
              <h2 style="font-size:1.8rem;font-weight:800;color:#1e3a8a;margin-bottom:1.25rem;">ผู้นำด้านพรีแคสท์คอนกรีตในภาคอีสาน</h2>
              <p style="font-size:1.1rem;color:#374151;line-height:1.9;margin-bottom:1.5rem;">
                <strong>บริษัท พีซีซี โพสเทนชั่น จำกัด (PCC Post-Tension)</strong> สาขาขอนแก่น คือหนึ่งในผู้แทนจำหน่ายและติดตั้งผลิตภัณฑ์คอนกรีตสำเร็จรูปและงานโพสเทนชั่นชั้นนำของภาคตะวันออกเฉียงเหนือ
                เชื่อมโยงกับ <strong>บริษัท พิบูลย์คอนกรีต จำกัด (PCC)</strong> ผู้ผลิตรายใหญ่ที่ได้รับการรับรองมาตรฐาน มอก.
              </p>
              <p style="font-size:1.1rem;color:#374151;line-height:1.9;margin-bottom:1.5rem;">
                เราเชี่ยวชาญในสองเทคโนโลยีหลัก ได้แก่ <strong>พรีแคสท์คอนกรีต (Precast Concrete)</strong> — ชิ้นส่วนโครงสร้างสำเร็จรูปที่ผลิตในโรงงานและนำมาประกอบในสถานที่ก่อสร้าง และ <strong>โพสเทนชั่น (Post-Tension)</strong> — ระบบคอนกรีตอัดแรงที่ทำให้โครงสร้างแข็งแกร่งขึ้น ช่วงพาดได้ยาวขึ้น และประหยัดวัสดุ
              </p>
              <div style="background:#f0f9ff;border-left:4px solid #1d4ed8;padding:1.25rem 1.5rem;border-radius:0 .75rem .75rem 0;margin-bottom:1.5rem;">
                <p style="font-size:1rem;color:#1e3a8a;font-weight:600;margin:0;">
                  🏆 ผู้แทนจำหน่ายและติดตั้งผลิตภัณฑ์ Hollow Core Slab จาก PCC (พิบูลย์คอนกรีต) มาตรฐาน มอก. 576-2546 และ มอก.828-2546
                </p>
              </div>
              <p style="font-size:1.1rem;color:#374151;line-height:1.9;">
                ด้วยทีมวิศวกรและช่างผู้เชี่ยวชาญ เราให้บริการครบวงจรตั้งแต่ออกแบบ ผลิต จัดส่ง จนถึงติดตั้งในสถานที่จริง ให้บริการลูกค้าในขอนแก่น ภาคอีสานทั้งหมด รวมถึงสาขาเชียงใหม่สำหรับภาคเหนือ
              </p>
            </div>`,
          },
          {
            type: 'stats',
            headline: 'ตัวเลขที่พิสูจน์ความเชี่ยวชาญ',
            stats: [
              { value: 20, suffix: '+', label: 'ปีในวงการ' },
              { value: 500, suffix: '+', label: 'โครงการเสร็จสิ้น' },
              { value: 2, label: 'สาขาทั่วประเทศ' },
              { value: 50, suffix: '+', label: 'ทีมวิศวกรและช่าง' },
            ],
          },
          {
            type: 'whyUs',
            headline: 'คุณค่าที่เราส่งมอบให้ลูกค้า',
            subheadline: 'หลักการทำงานที่ยึดถือมาตลอดกว่า 20 ปี',
            items: WHY_US_ITEMS,
          },
          {
            type: 'process',
            headline: 'กระบวนการทำงานของเรา',
            subheadline: 'ขั้นตอนที่ชัดเจน โปร่งใส ตรวจสอบได้ทุกขั้น',
            theme: 'dark',
            steps: PROCESS_STEPS,
          },
          {
            type: 'cta',
            headline: 'ร่วมสร้างโครงการคุณภาพไปกับเรา',
            description: 'ทีมวิศวกรของเราพร้อมรับฟังและนำเสนอโซลูชั่นที่เหมาะสมกับโครงการของคุณ ปรึกษาฟรีไม่มีค่าใช้จ่าย',
            buttonText: 'ปรึกษาวิศวกรฟรี',
            buttonUrl: '/contact',
          },
        ],
        seo: {
          title: 'เกี่ยวกับเรา | PCC Post-Tension ขอนแก่น ผู้ผลิตพรีแคสท์คอนกรีต โพสเทนชั่น',
          description: 'ทำความรู้จักกับ บริษัท พีซีซี โพสเทนชั่น จำกัด สาขาขอนแก่น ผู้เชี่ยวชาญด้านพรีแคสท์คอนกรีต แผ่นพื้นสำเร็จรูป งานโพสเทนชั่น และกำแพงกันดิน มาตรฐาน มอก. ประสบการณ์กว่า 20 ปี',
        },
      },

      // ============================
      // PRODUCTS OVERVIEW PAGE
      // ============================
      {
        slug: 'products',
        title: 'สินค้าและบริการ',
        content: [
          {
            type: 'hero',
            heading: 'สินค้าและบริการของเรา',
            subheading: 'พรีแคสท์คอนกรีตและงานโพสเทนชั่นคุณภาพสูง พร้อมผลิตภัณฑ์ครบครัน มาตรฐาน มอก. ออกแบบ ผลิต จัดส่ง และติดตั้งโดยวิศวกร',
            buttons: [
              { label: 'ขอใบเสนอราคาฟรี', url: '/contact', style: 'primary' },
            ],
          },
          // ── Featured: Precast + Post-tension ──────────────────────────────
          {
            type: 'richText',
            content: `
<div style="padding:3rem 1rem;background:#f8fafc;">
  <div style="max-width:1200px;margin:0 auto;">
    <p style="text-align:center;font-size:.8rem;letter-spacing:.15em;text-transform:uppercase;color:#1d4ed8;font-weight:700;margin-bottom:.5rem;">⭐ สินค้าแนะนำ — เน้นขาย</p>
    <h2 style="text-align:center;font-size:2rem;font-weight:800;color:#111827;margin-bottom:.75rem;">พรีแคสท์ & โพสเทนชั่น</h2>
    <p style="text-align:center;color:#6b7280;max-width:650px;margin:0 auto 2.5rem;">เทคโนโลยีที่ประหยัดเวลาก่อสร้าง ลดต้นทุน และให้โครงสร้างที่แข็งแกร่งกว่า เหมาะกับทุกโครงการตั้งแต่บ้านพักไปจนถึงโรงงานและคอนโด</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;">

      <div style="background:linear-gradient(135deg,#1e3a8a,#1e40af);border-radius:1.25rem;padding:2rem;color:white;">
        <div style="font-size:2.5rem;margin-bottom:1rem;">🏗️</div>
        <h3 style="font-size:1.4rem;font-weight:800;margin-bottom:.75rem;">แผ่นพื้นพรีแคสท์<br/>(Hollow Core Slab)</h3>
        <p style="color:#bfdbfe;line-height:1.8;margin-bottom:1.5rem;font-size:.95rem;">แผ่นพื้นกลวงสำเร็จรูปจากโรงงาน ความหนา 8–30 ซม. กว้าง 60/120 ซม. ช่วงพาดสูงสุด 12 เมตร มาตรฐาน มอก. 576-2546 ลดน้ำหนักโครงสร้าง 30–40% ติดตั้งเร็วกว่าเทในที่</p>
        <a href="/products/hollow-core-slab" style="display:inline-block;background:white;color:#1e40af;font-weight:700;padding:.75rem 1.5rem;border-radius:999px;text-decoration:none;font-size:.9rem;">ดูรายละเอียด →</a>
      </div>

      <div style="background:linear-gradient(135deg,#14532d,#15803d);border-radius:1.25rem;padding:2rem;color:white;">
        <div style="font-size:2.5rem;margin-bottom:1rem;">⚙️</div>
        <h3 style="font-size:1.4rem;font-weight:800;margin-bottom:.75rem;">งานโพสเทนชั่น<br/>(Post-Tension System)</h3>
        <p style="color:#bbf7d0;line-height:1.8;margin-bottom:1.5rem;font-size:.95rem;">ระบบคอนกรีตอัดแรงขั้นสูง เพิ่มความแข็งแกร่งโครงสร้าง ช่วงพาดได้ยาว 20+ เมตร ลดจำนวนเสาและคาน เหมาะกับอาคารสูง ศูนย์การค้า คลังสินค้า ตามมาตรฐาน ACI 318</p>
        <a href="/products/post-tension" style="display:inline-block;background:white;color:#15803d;font-weight:700;padding:.75rem 1.5rem;border-radius:999px;text-decoration:none;font-size:.9rem;">ดูรายละเอียด →</a>
      </div>

    </div>
  </div>
</div>`,
          },
          {
            type: 'featureGrid',
            headline: 'ผลิตภัณฑ์ทั้งหมดของเรา',
            description: 'ทุกผลิตภัณฑ์ผ่านการรับรองมาตรฐาน มอก. ผลิตในโรงงานมาตรฐาน พร้อมบริการครบวงจรตั้งแต่ออกแบบจนติดตั้ง',
          },
          {
            type: 'whyUs',
            headline: 'เหตุผลที่ลูกค้าเลือกเรา',
            subheadline: 'มากกว่าแค่ผู้ขาย เราคือพันธมิตรในการก่อสร้างที่คุณไว้ใจได้',
            items: WHY_US_ITEMS,
          },
          {
            type: 'testimonial',
            headline: 'ลูกค้าพูดถึงผลิตภัณฑ์ของเรา',
          },
          {
            type: 'cta',
            headline: 'ต้องการใบเสนอราคา?',
            description: 'แจ้งประเภทสินค้า ขนาด และปริมาณที่ต้องการ เราจะคำนวณและส่งใบเสนอราคาให้ฟรีภายใน 24 ชั่วโมง',
            buttonText: 'ติดต่อฝ่ายขาย',
            buttonUrl: '/contact',
          },
        ],
        seo: {
          title: 'สินค้าและบริการ | แผ่นพื้นพรีแคสท์ โพสเทนชั่น กำแพงกันดิน รั้ว ขอนแก่น | PCC',
          description: 'จำหน่ายและติดตั้งแผ่นพื้นสำเร็จรูป Hollow Core Slab งานโพสเทนชั่น Post-Tension กำแพงกันดินตัว L รั้วสำเร็จรูป เสารั้วลวดหนาม รั้วคาวบอย มาตรฐาน มอก. ขอนแก่น',
        },
      },

      // ============================
      // POST-TENSION PRODUCT PAGE
      // ============================
      {
        slug: 'post-tension',
        title: 'งานโพสเทนชั่น',
        content: [
          {
            type: 'hero',
            heading: 'งานโพสเทนชั่น (Post-Tension)',
            subheading: 'ระบบคอนกรีตอัดแรงขั้นสูงที่เพิ่มความแข็งแกร่ง ช่วงพาดได้ยาวขึ้น ลดจำนวนเสาและคาน ออกแบบและติดตั้งโดยวิศวกรผู้เชี่ยวชาญ',
            buttons: [
              { label: 'ขอใบเสนอราคา', url: '/contact', style: 'primary' },
              { label: 'ดูสินค้าอื่นๆ', url: '/products', style: 'secondary' },
            ],
          },
          {
            type: 'richText',
            content: `<div style="max-width:820px;margin:0 auto;padding:3rem 1.5rem;">
              <h2 style="font-size:1.75rem;font-weight:800;color:#1e3a8a;margin-bottom:1rem;">⚙️ Post-Tension คืออะไร?</h2>
              <p style="font-size:1.1rem;color:#374151;line-height:1.9;margin-bottom:1.5rem;">
                <strong>Post-Tension (โพสเทนชั่น)</strong> เป็นเทคโนโลยีการก่อสร้างที่ใช้ลวดอัดแรงดึงภายหลังจากเทและบ่มคอนกรีตแล้ว ทำให้คอนกรีตมีแรงอัดภายใน ลดการแอ่นตัว ลดรอยแตกร้าว และสามารถออกแบบช่วงพาดได้ยาวกว่าคอนกรีตเสริมเหล็กทั่วไป
              </p>
              <h3 style="font-size:1.3rem;font-weight:700;color:#1e3a8a;margin-bottom:.75rem;">เหมาะกับโครงการประเภทใด?</h3>
              <ul style="color:#374151;line-height:2.1;margin-left:1.5rem;margin-bottom:1.5rem;font-size:1rem;">
                <li>อาคารสูง คอนโดมิเนียม และโครงการที่อยู่อาศัย</li>
                <li>ศูนย์การค้า ห้างสรรพสินค้า และพื้นที่รีเทล</li>
                <li>อาคารโรงพยาบาล สถานศึกษา และอาคารสาธารณะ</li>
                <li>คลังสินค้า โรงงานอุตสาหกรรม และโกดังขนาดใหญ่</li>
                <li>ที่จอดรถยกสูง (Parking Structure)</li>
                <li>สะพาน และโครงสร้างพิเศษที่ต้องการช่วงพาดยาว</li>
              </ul>
              <div style="background:#dcfce7;border:1px solid #86efac;border-radius:1rem;padding:1.25rem 1.5rem;">
                <p style="color:#15803d;font-weight:700;font-size:1rem;margin:0;">
                  💡 ข้อได้เปรียบหลัก: ลดความหนาพื้น 20–30%, ช่วงพาดสูงสุด 20+ เมตร, ประหยัดแบบหล่อ, ลดน้ำหนักรวมโครงสร้าง
                </p>
              </div>
            </div>`,
          },
          {
            type: 'productSpec',
            headline: 'ข้อมูลทางเทคนิค งานโพสเทนชั่น',
            tables: [
              {
                title: 'สเปคระบบโพสเทนชั่น',
                rows: [
                  { label: 'ประเภทลวด', value: 'Monostrand / Multistrand' },
                  { label: 'กำลังดึงลวด', value: 'ASTM A416 Grade 270 (270 ksi)' },
                  { label: 'ระบบยึดปลาย', value: 'Wedge Anchor System (ระบบลิ่ม)' },
                  { label: 'มาตรฐานการออกแบบ', value: 'ACI 318 / วสท. (วิศวกรรมสถานแห่งประเทศไทย)' },
                  { label: 'การใช้งาน', value: 'พื้น, คาน, ผนัง, สะพาน' },
                  { label: 'ช่วงพาดสูงสุด', value: '20+ เมตร (ขึ้นอยู่กับการออกแบบ)' },
                ],
              },
            ],
            features: [
              'ลดจำนวนเสาและคาน เพิ่มพื้นที่ใช้สอยภายในอาคาร',
              'ลดความหนาพื้น 20–30% เมื่อเทียบกับคอนกรีตเสริมเหล็กทั่วไป',
              'ลดน้ำหนักโครงสร้างรวม ประหยัดงานฐานราก',
              'ควบคุมการแอ่นตัวและรอยร้าวได้ดีกว่ามาตรฐาน',
              'ระยะเวลาก่อสร้างสั้นกว่า เพราะไม่ต้องรอถอดแบบนาน',
              'คุ้มค่าในระยะยาว ลดค่าซ่อมบำรุง',
            ],
            standardNote: 'ออกแบบและติดตั้งโดยวิศวกรโยธาที่มีใบประกอบวิชาชีพ (กว.) ตามมาตรฐาน ACI 318 และมาตรฐานวิศวกรรมสถานแห่งประเทศไทย (วสท.)',
          },
          {
            type: 'process',
            headline: 'ขั้นตอนงานโพสเทนชั่น',
            subheadline: 'กระบวนการทำงานที่เป็นระบบและได้มาตรฐาน',
            steps: [
              { title: 'สำรวจและออกแบบ', description: 'วิศวกรสำรวจหน้างาน ออกแบบและคำนวณโครงสร้างตามมาตรฐาน ACI 318' },
              { title: 'ติดตั้งลวดอัดแรง', description: 'วางและยึดลวดโพสเทนชั่นในตำแหน่งที่ออกแบบไว้อย่างแม่นยำ' },
              { title: 'เทคอนกรีต', description: 'เทคอนกรีตตามมาตรฐาน บ่มจนได้กำลังที่กำหนด (ไม่น้อยกว่า 400 ksc)' },
              { title: 'ดึงลวดอัดแรง', description: 'ดึงลวดด้วยแรงตามที่ออกแบบ โดยใช้อุปกรณ์มาตรฐานและวัดแรงอย่างแม่นยำ' },
              { title: 'ตัดและอัดฉีดสี', description: 'ตัดลวดส่วนเกิน อัดฉีดวัสดุกันสนิม ตรวจสอบและส่งมอบงาน' },
            ],
          },
          {
            type: 'cta',
            headline: 'สนใจระบบโพสเทนชั่น?',
            description: 'ให้วิศวกรของเราประเมินความเหมาะสมและคำนวณความประหยัดที่คุณจะได้รับจากระบบโพสเทนชั่นฟรี ไม่มีข้อผูกมัด',
            buttonText: 'ปรึกษาวิศวกรฟรี',
            buttonUrl: '/contact',
          },
        ],
        seo: {
          title: 'งานโพสเทนชั่น ขอนแก่น | Post-Tension ระบบคอนกรีตอัดแรง | PCC',
          description: 'รับงานโพสเทนชั่น Post-Tension ขอนแก่นและภาคอีสาน ออกแบบ คำนวณ และติดตั้งโดยวิศวกรผู้เชี่ยวชาญ เหมาะสำหรับพื้น คาน สะพาน ช่วงพาดยาวสูงสุด 20+ เมตร ตามมาตรฐาน ACI 318',
        },
      },

      // ============================
      // HOLLOW CORE SLAB / PRECAST PAGE
      // ============================
      {
        slug: 'hollow-core-slab',
        title: 'แผ่นพื้นสำเร็จรูป Hollow Core Slab',
        content: [
          {
            type: 'hero',
            heading: 'แผ่นพื้นพรีแคสท์ Hollow Core Slab',
            subheading: 'แผ่นพื้นกลวงสำเร็จรูปคุณภาพสูง มาตรฐาน มอก. 576-2546 และ มอก.828-2546 ความหนา 8–30 ซม. ผลิตตามสั่ง ส่งถึงหน้างาน ติดตั้งโดยวิศวกร',
            buttons: [
              { label: 'ขอใบเสนอราคา', url: '/contact', style: 'primary' },
              { label: 'ดูสินค้าอื่นๆ', url: '/products', style: 'secondary' },
            ],
          },
          {
            type: 'richText',
            content: `<div style="max-width:820px;margin:0 auto;padding:3rem 1.5rem;">
              <h2 style="font-size:1.75rem;font-weight:800;color:#1e3a8a;margin-bottom:1rem;">🏗️ พรีแคสท์ Hollow Core Slab คืออะไร?</h2>
              <p style="font-size:1.1rem;color:#374151;line-height:1.9;margin-bottom:1.5rem;">
                <strong>Hollow Core Slab</strong> หรือ <strong>แผ่นพื้นกลวง</strong> คือแผ่นพื้นคอนกรีตอัดแรงสำเร็จรูปที่มีช่องกลวงตลอดความยาว ผลิตจากโรงงานภายใต้การควบคุมคุณภาพเข้มงวด ทำให้มีความแข็งแกร่งสูง น้ำหนักเบากว่าแผ่นพื้นทึบ 30–40% และสามารถติดตั้งได้รวดเร็วโดยไม่ต้องรอบ่มคอนกรีตในสถานที่
              </p>
              <p style="font-size:1.1rem;color:#374151;line-height:1.9;margin-bottom:1.5rem;">
                PCC Post-Tension ขอนแก่น เป็นตัวแทนจำหน่ายและติดตั้งแผ่นพื้น Hollow Core Slab จาก <strong>บริษัท พิบูลย์คอนกรีต จำกัด (PCC)</strong> ซึ่งผลิตตามมาตรฐาน <strong>มอก. 576-2546</strong> (แผ่นพื้นคอนกรีตอัดแรง) และ <strong>มอก.828-2546</strong> (แผ่นพื้นคอนกรีตอัดแรงชนิดกลวง) รับรองโดยสำนักงานมาตรฐานผลิตภัณฑ์อุตสาหกรรม
              </p>
              <h3 style="font-size:1.3rem;font-weight:700;color:#1e3a8a;margin-bottom:.75rem;">เหมาะกับงานประเภทใด?</h3>
              <ul style="color:#374151;line-height:2.1;margin-left:1.5rem;font-size:1rem;">
                <li>บ้านพักอาศัย อาคารพาณิชย์ ทาวน์เฮาส์</li>
                <li>คลังสินค้า โรงงาน โกดังขนาดใหญ่</li>
                <li>อาคารสำนักงาน โรงเรียน โรงพยาบาล</li>
                <li>ที่จอดรถ อาคารจอดรถยกสูง</li>
                <li>โครงการก่อสร้างที่ต้องการความเร็ว</li>
              </ul>
            </div>`,
          },
          {
            type: 'productSpec',
            headline: 'ข้อมูลทางเทคนิค Hollow Core Slab',
            subheadline: 'สเปคมาตรฐานและตัวเลือกขนาดที่มีให้เลือก',
            tables: [
              {
                title: 'ขนาดและสเปคมาตรฐาน',
                rows: [
                  { label: 'ความหนา', value: '8, 10, 12, 15, 20, 25, 30 ซม.' },
                  { label: 'ความกว้าง', value: '60 ซม. และ 120 ซม.' },
                  { label: 'ความยาว', value: 'ผลิตตามสั่ง สูงสุด 12 เมตร' },
                  { label: 'กำลังอัดคอนกรีต', value: 'ไม่น้อยกว่า 400 ksc (40 MPa)' },
                  { label: 'ประเภทลวดอัดแรง', value: 'ลวดเส้นเดี่ยวหรือลวดตีเกลียว' },
                  { label: 'มาตรฐาน', value: 'มอก. 576-2546 และ มอก. 828-2546' },
                ],
              },
              {
                title: 'ความสามารถรับน้ำหนัก (ตัวอย่าง)',
                rows: [
                  { label: 'หนา 12 ซม. ช่วง 4 ม.', value: '~400 ksc' },
                  { label: 'หนา 15 ซม. ช่วง 5 ม.', value: '~350 ksc' },
                  { label: 'หนา 20 ซม. ช่วง 7 ม.', value: '~320 ksc' },
                  { label: 'หนา 25 ซม. ช่วง 9 ม.', value: '~280 ksc' },
                  { label: 'หนา 30 ซม. ช่วง 12 ม.', value: '~250 ksc' },
                ],
              },
            ],
            features: [
              'ลดน้ำหนักโครงสร้าง 30–40% เมื่อเทียบกับแผ่นพื้นทึบ',
              'ช่วงพาดได้ไกลขึ้น ลดจำนวนคานและเสาค้ำยัน',
              'ติดตั้งรวดเร็ว ลดระยะเวลาก่อสร้าง 40–60%',
              'ผลิตในโรงงาน ควบคุมคุณภาพดีกว่าเทในสถานที่',
              'ช่องกลวงสามารถร้อยท่อไฟฟ้า ท่อน้ำ และสายเคเบิลได้',
              'ประหยัดแบบหล่อ ลดต้นทุนงานพื้นโดยรวม',
              'พื้นผิวด้านล่างเรียบ ไม่ต้องฉาบเพิ่มสำหรับงานบางประเภท',
            ],
            standardNote: 'ผลิตตามมาตรฐาน มอก. 576-2546 (แผ่นพื้นคอนกรีตอัดแรง) และ มอก. 828-2546 (แผ่นพื้นคอนกรีตอัดแรงชนิดกลวง) รับรองโดยสำนักงานมาตรฐานผลิตภัณฑ์อุตสาหกรรม (สมอ.)',
          },
          {
            type: 'testimonial',
            headline: 'ลูกค้าที่ใช้แผ่นพื้นพรีแคสท์ของเรา',
          },
          {
            type: 'cta',
            headline: 'สนใจแผ่นพื้น Hollow Core Slab?',
            description: 'แจ้งขนาด ช่วงพาด และจำนวนที่ต้องการ วิศวกรของเราจะเลือกสเปคที่เหมาะสมและส่งใบเสนอราคาให้ฟรีภายใน 24 ชั่วโมง',
            buttonText: 'ขอใบเสนอราคา',
            buttonUrl: '/contact',
          },
        ],
        seo: {
          title: 'แผ่นพื้นสำเร็จรูป Hollow Core Slab พรีแคสท์ ขอนแก่น | มอก. | PCC',
          description: 'จำหน่ายและติดตั้งแผ่นพื้นสำเร็จรูป Hollow Core Slab พรีแคสท์คอนกรีต ขอนแก่นและภาคอีสาน ความหนา 8–30 ซม. กว้าง 60/120 ซม. มาตรฐาน มอก. 576-2546 และ มอก.828-2546 โทร 063-454-5656',
        },
      },

      // ============================
      // CONTACT PAGE
      // ============================
      {
        slug: 'contact',
        title: 'ติดต่อเรา',
        content: [
          {
            type: 'hero',
            heading: 'ติดต่อ PCC Post-Tension',
            subheading: 'พร้อมให้คำปรึกษา ประเมินราคา และออกแบบเบื้องต้นฟรี ไม่มีข้อผูกมัด ตอบกลับภายใน 24 ชั่วโมงในวันทำการ',
            buttons: [
              { label: 'โทร 063-454-5656', url: 'tel:0634545656', style: 'primary' },
            ],
          },
          {
            type: 'contactForm',
            headline: 'ส่งข้อความหาเรา',
            subheadline: 'กรอกข้อมูลด้านล่าง ทีมงานของเราจะติดต่อกลับภายใน 24 ชั่วโมงในวันทำการ',
            phone: '063-454-5656',
          },
          {
            type: 'branchLocations',
            headline: 'ที่ตั้งสาขาของเรา',
            branches: BRANCHES,
          },
        ],
        seo: {
          title: 'ติดต่อเรา | PCC Post-Tension ขอนแก่น โทร 063-454-5656 | พรีแคสท์ โพสเทนชั่น',
          description: 'ติดต่อ PCC Post-Tension สาขาขอนแก่น โทร 063-454-5656 สาขาเชียงใหม่ โทร 091-553-2624 ขอใบเสนอราคา ปรึกษาวิศวกรฟรี แผ่นพื้นพรีแคสท์ โพสเทนชั่น กำแพงกันดิน รั้วสำเร็จรูป',
        },
      },

      // ============================
      // ABOUT (DETAILED PRODUCTS) / RETAINING WALL
      // ============================
      {
        slug: 'retaining-wall',
        title: 'กำแพงกันดินตัว L',
        content: [
          {
            type: 'hero',
            heading: 'กำแพงกันดินตัว L (L-Shape Retaining Wall)',
            subheading: 'กำแพงกันดินคอนกรีตสำเร็จรูปแบบตัว L แข็งแกร่ง ทนทาน ติดตั้งรวดเร็ว เหมาะสำหรับกันดินทุกประเภท มาตรฐาน มอก.',
            buttons: [
              { label: 'ขอใบเสนอราคา', url: '/contact', style: 'primary' },
              { label: 'ดูสินค้าอื่นๆ', url: '/products', style: 'secondary' },
            ],
          },
          {
            type: 'richText',
            content: `<div style="max-width:820px;margin:0 auto;padding:3rem 1.5rem;">
              <h2 style="font-size:1.75rem;font-weight:800;color:#1e3a8a;margin-bottom:1rem;">กำแพงกันดินตัว L คืออะไร?</h2>
              <p style="font-size:1.1rem;color:#374151;line-height:1.9;margin-bottom:1.5rem;">
                <strong>กำแพงกันดินรูปตัว L (L-Shape Retaining Wall)</strong> เป็นผลิตภัณฑ์คอนกรีตสำเร็จรูปที่มีหน้าตัดคล้ายตัว L ออกแบบมาเพื่อรับแรงดันดินและน้ำ ผลิตในโรงงานมาตรฐาน มอก. ทำให้แข็งแกร่ง สม่ำเสมอ และติดตั้งได้รวดเร็วกว่าการก่อสร้างแบบเทในที่
              </p>
              <h3 style="font-size:1.3rem;font-weight:700;color:#1e3a8a;margin-bottom:.75rem;">การใช้งาน</h3>
              <ul style="color:#374151;line-height:2.1;margin-left:1.5rem;font-size:1rem;">
                <li>กั้นดินสำหรับโครงการก่อสร้างและภูมิทัศน์</li>
                <li>ก่อสร้างคลองส่งน้ำและระบบระบายน้ำ</li>
                <li>งานปรับระดับพื้นที่และเนินดิน</li>
                <li>สร้างกำแพงกั้นเสียงและความเป็นส่วนตัว</li>
                <li>งานโครงสร้างถนนและทางเดิน</li>
              </ul>
            </div>`,
          },
          {
            type: 'cta',
            headline: 'สนใจกำแพงกันดินตัว L?',
            description: 'แจ้งขนาดและความสูงที่ต้องการ วิศวกรของเราจะออกแบบและส่งใบเสนอราคาให้ฟรีภายใน 24 ชั่วโมง',
            buttonText: 'ขอใบเสนอราคา',
            buttonUrl: '/contact',
          },
        ],
        seo: {
          title: 'กำแพงกันดินตัว L ขอนแก่น | L-Shape Retaining Wall คอนกรีตสำเร็จรูป | PCC',
          description: 'จำหน่ายและติดตั้งกำแพงกันดินตัว L คอนกรีตสำเร็จรูป มาตรฐาน มอก. ขอนแก่นและภาคอีสาน แข็งแกร่ง ทนทาน ติดตั้งรวดเร็ว โทร 063-454-5656',
        },
      },

      // ============================
      // PRIVACY POLICY
      // ============================
      {
        slug: 'privacy-policy',
        title: 'นโยบายความเป็นส่วนตัว',
        content: [
          {
            type: 'richText',
            content: `<div style="max-width:800px;margin:0 auto;padding:4rem 1.5rem;">
              <h1 style="font-size:2rem;font-weight:700;color:#111827;margin-bottom:0.5rem;">นโยบายความเป็นส่วนตัว</h1>
              <p style="color:#6b7280;margin-bottom:2.5rem;">อัปเดตล่าสุด: กรกฎาคม 2569 (2026)</p>
              <h2 style="font-size:1.35rem;font-weight:700;color:#1e3a8a;margin-bottom:0.75rem;margin-top:2rem;">1. ข้อมูลที่เราเก็บรวบรวม</h2>
              <p style="color:#374151;line-height:1.9;margin-bottom:1rem;">บริษัท พีซีซี โพสเทนชั่น จำกัด เก็บรวบรวมข้อมูลส่วนบุคคลที่คุณให้ไว้เมื่อติดต่อเรา ได้แก่ ชื่อ-นามสกุล หมายเลขโทรศัพท์ อีเมล และรายละเอียดโครงการ</p>
              <h2 style="font-size:1.35rem;font-weight:700;color:#1e3a8a;margin-bottom:0.75rem;margin-top:2rem;">2. วัตถุประสงค์ในการใช้ข้อมูล</h2>
              <p style="color:#374151;line-height:1.9;margin-bottom:1rem;">เราใช้ข้อมูลเพื่อ: ติดต่อกลับตามคำขอ จัดทำใบเสนอราคา ให้บริการหลังการขาย และปรับปรุงการให้บริการ</p>
              <h2 style="font-size:1.35rem;font-weight:700;color:#1e3a8a;margin-bottom:0.75rem;margin-top:2rem;">3. การเปิดเผยข้อมูล</h2>
              <p style="color:#374151;line-height:1.9;margin-bottom:1rem;">เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของคุณให้กับบุคคลภายนอก เว้นแต่ได้รับความยินยอม หรือเป็นการปฏิบัติตามกฎหมาย</p>
              <h2 style="font-size:1.35rem;font-weight:700;color:#1e3a8a;margin-bottom:0.75rem;margin-top:2rem;">4. สิทธิ์ของเจ้าของข้อมูล</h2>
              <p style="color:#374151;line-height:1.9;margin-bottom:1rem;">คุณมีสิทธิ์เข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลได้ตลอดเวลา โดยติดต่อที่ contact@pcc-posttension.com</p>
              <h2 style="font-size:1.35rem;font-weight:700;color:#1e3a8a;margin-bottom:0.75rem;margin-top:2rem;">5. ติดต่อเรา</h2>
              <p style="color:#374151;line-height:1.9;">
                <strong>บริษัท พีซีซี โพสเทนชั่น จำกัด</strong><br/>
                เลขที่ 100 หมู่ 11 ตำบลแดงใหญ่ อำเภอเมือง จังหวัดขอนแก่น 40000<br/>
                โทร: 063-454-5656 | อีเมล: contact@pcc-posttension.com<br/>
                เลขประจำตัวผู้เสียภาษี: 0505552001368
              </p>
            </div>`,
          },
        ],
        seo: {
          title: 'นโยบายความเป็นส่วนตัว | PCC Post-Tension ขอนแก่น',
          description: 'นโยบายความเป็นส่วนตัวของบริษัท พีซีซี โพสเทนชั่น จำกัด การเก็บและใช้ข้อมูลส่วนบุคคลของลูกค้า',
        },
      },
    ];

    // ── 3. Upsert all pages ───────────────────────────────────────────────────
    const results = [];
    for (const pageData of seedData) {
      const { slug, title, content, seo } = pageData;

      const insertedPages = await db.insert(pages).values({
        slug,
        title,
        content,
        workflowState: 'published',
        template: 'default',
      }).onConflictDoUpdate({
        target: pages.slug,
        set: { title, content, workflowState: 'published' },
      }).returning();

      const pageId = insertedPages[0].id;

      await db.insert(seoMetadata).values({
        resourceType: 'page',
        resourceId: pageId,
        title: seo?.title,
        description: seo?.description,
      }).onConflictDoUpdate({
        target: [seoMetadata.resourceType, seoMetadata.resourceId],
        set: { title: seo?.title, description: seo?.description },
      });

      results.push({ slug, id: pageId, status: 'seeded' });
    }

    return NextResponse.json({
      success: true,
      seededPages: results,
      totalPages: results.length,
      settingsUpdated: true,
      message: `✅ Successfully seeded ${results.length} pages + updated navbarLinks + workingHours.`,
    });

  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
