import { db } from "@/db";
import { pages, seoMetadata } from "@/db/schema";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const seedData = [
      // ============================
      // 1. HOME PAGE
      // ============================
      {
        slug: 'home',
        title: 'หน้าหลัก',
        content: [
          {
            type: 'hero',
            heading: 'PCC Post-Tension สาขาขอนแก่น',
            subheading: 'ผู้ผลิตและติดตั้งผลิตภัณฑ์คอนกรีตอัดแรง กำแพงกันดิน รั้วสำเร็จรูป และแผ่นพื้นสำเร็จรูป มาตรฐาน มอก. ครบวงจรในภาคอีสาน',
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
          {
            type: 'featureGrid',
            headline: 'ผลิตภัณฑ์คอนกรีตสำเร็จรูปของเรา',
            description: 'ครบทุกความต้องการก่อสร้าง ผลิตในโรงงานมาตรฐาน พร้อมติดตั้งโดยทีมวิศวกรผู้เชี่ยวชาญ',
          },
          {
            type: 'whyUs',
            headline: 'ทำไมต้องเลือก PCC Post-Tension?',
            subheadline: 'มากกว่า 20 ปีที่เราสร้างความเชื่อมั่นให้กับลูกค้าทั่วภาคอีสาน',
            items: [
              { icon: 'award', title: 'มาตรฐาน มอก. รับรอง', description: 'ผลิตภัณฑ์ทุกชิ้นผ่านการรับรองมาตรฐาน มอก. 576-2546 และ มอก.828-2546 ควบคุมคุณภาพโดยวิศวกร' },
              { icon: 'clock', title: 'ประสบการณ์กว่า 20 ปี', description: 'ดำเนินธุรกิจในวงการก่อสร้างมากกว่า 20 ปี มีผลงานอ้างอิงทั่วภาคอีสานและทั่วประเทศ' },
              { icon: 'wrench', title: 'บริการครบวงจร', description: 'ออกแบบ ผลิต จัดส่ง และติดตั้งโดยทีมของเราเอง ไม่ผ่านนายหน้า ควบคุมคุณภาพได้ทุกขั้นตอน' },
              { icon: 'shield', title: 'โรงงานผลิตได้มาตรฐาน', description: 'โรงงานผลิตทันสมัย ผ่านการรับรอง ใช้วัตถุดิบคุณภาพสูงทุกชิ้น' },
              { icon: 'mapPin', title: 'ครอบคลุมภาคอีสาน', description: 'สาขาขอนแก่นและเชียงใหม่ พร้อมบริการจัดส่งและติดตั้งทั่วภาคอีสานและภาคเหนือ' },
              { icon: 'headphones', title: 'ปรึกษาวิศวกรฟรี', description: 'ทีมวิศวกรพร้อมให้คำปรึกษา ประเมินราคา และออกแบบเบื้องต้นฟรี ไม่มีค่าใช้จ่าย' },
            ],
          },
          {
            type: 'process',
            headline: 'ขั้นตอนการสั่งซื้อ',
            subheadline: 'ง่าย สะดวก รวดเร็ว โปร่งใส ตั้งแต่เริ่มต้นจนส่งมอบงาน',
            steps: [
              { title: 'ปรึกษาและประเมิน', description: 'ติดต่อทีมวิศวกรเพื่อรับคำปรึกษาและประเมินโครงการฟรี' },
              { title: 'ออกแบบและเสนอราคา', description: 'จัดทำใบเสนอราคาชัดเจน ไม่มีค่าใช้จ่ายซ่อนเร้น' },
              { title: 'ผลิตในโรงงาน', description: 'ผลิตในโรงงานมาตรฐาน มอก. ควบคุมคุณภาพทุกขั้นตอน' },
              { title: 'จัดส่งและติดตั้ง', description: 'ส่งมอบตรงเวลา ติดตั้งโดยทีมช่างผู้เชี่ยวชาญ' },
              { title: 'ส่งมอบงาน', description: 'ตรวจสอบคุณภาพก่อนส่งมอบ พร้อมบริการหลังการขาย' },
            ],
          },
          {
            type: 'testimonial',
            headline: 'เสียงจากลูกค้าจริงของเรา',
            subheadline: 'ความไว้วางใจที่สะสมมากว่า 20 ปี',
          },
          {
            type: 'cta',
            headline: 'พร้อมเริ่มโครงการของคุณ?',
            description: 'รับคำปรึกษาจากทีมวิศวกรของเราฟรี ไม่มีค่าใช้จ่าย พร้อมใบเสนอราคาภายใน 24 ชั่วโมง',
            buttonText: 'ติดต่อเราเลย',
            buttonUrl: '/contact',
          },
        ],
        seo: {
          title: 'กำแพงกันดิน รั้วสำเร็จรูป แผ่นพื้นสำเร็จรูป ขอนแก่น | PCC Post-Tension',
          description: 'PCC Post-Tension ขอนแก่น รับออกแบบ ผลิต ติดตั้ง กำแพงกันดินตัว L รั้วสำเร็จรูป แผ่นพื้นสำเร็จรูป เสารั้วลวดหนาม และงานโพสเทนชั่น มาตรฐาน มอก. โดยทีมวิศวกรผู้เชี่ยวชาญ',
        },
      },

      // ============================
      // 2. ABOUT PAGE
      // ============================
      {
        slug: 'about',
        title: 'เกี่ยวกับเรา',
        content: [
          {
            type: 'hero',
            heading: 'บริษัท พีซีซี โพสเทนชั่น จำกัด',
            subheading: 'ผู้นำด้านผลิตภัณฑ์คอนกรีตสำเร็จรูปและงานโพสเทนชั่นในภาคอีสาน มุ่งมั่นส่งมอบงานคุณภาพสูงกว่า 20 ปี',
            buttons: [
              { label: 'ดูสินค้าของเรา', url: '/products', style: 'primary' },
              { label: 'ติดต่อเรา', url: '/contact', style: 'secondary' },
            ],
          },
          {
            type: 'richText',
            content: `<div style="max-width:800px;margin:0 auto;padding:3rem 1.5rem;">
              <p style="font-size:1.15rem;color:#374151;line-height:1.9;margin-bottom:1.5rem;">
                <strong>บริษัท พีซีซี โพสเทนชั่น จำกัด</strong> ก่อตั้งขึ้นด้วยความมุ่งมั่นที่จะยกระดับมาตรฐานวัสดุก่อสร้างในภาคตะวันออกเฉียงเหนือของประเทศไทย
                ด้วยประสบการณ์กว่า 20 ปีในวงการก่อสร้าง เราเชี่ยวชาญในการผลิตและติดตั้งผลิตภัณฑ์คอนกรีตสำเร็จรูปที่หลากหลาย
              </p>
              <p style="font-size:1.15rem;color:#374151;line-height:1.9;margin-bottom:1.5rem;">
                สาขาขอนแก่นของเราตั้งอยู่ที่หัวใจของภาคอีสาน ทำให้เราสามารถให้บริการจัดส่งและติดตั้งได้อย่างรวดเร็วและทั่วถึงในพื้นที่ภาคตะวันออกเฉียงเหนือทั้งหมด
                นอกจากนี้เรายังมีสาขาเชียงใหม่ที่ให้บริการลูกค้าในภาคเหนือ
              </p>
              <p style="font-size:1.15rem;color:#374151;line-height:1.9;">
                ทุกผลิตภัณฑ์ของเราผ่านการผลิตในโรงงานมาตรฐาน <strong>มอก.</strong> และตรวจสอบคุณภาพโดยทีมวิศวกรผู้เชี่ยวชาญก่อนส่งมอบให้ลูกค้าทุกครั้ง
                เพราะเราเชื่อว่างานก่อสร้างที่ดีต้องเริ่มต้นจากวัสดุที่มีคุณภาพ
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
            headline: 'คุณค่าที่เราส่งมอบ',
            subheadline: 'หลักการทำงานที่ยึดถือมาตลอดกว่า 20 ปี',
          },
          {
            type: 'process',
            headline: 'กระบวนการทำงานของเรา',
            subheadline: 'ขั้นตอนที่ชัดเจน โปร่งใส ตรวจสอบได้ทุกขั้น',
            theme: 'dark',
          },
          {
            type: 'cta',
            headline: 'ร่วมสร้างโครงการคุณภาพไปกับเรา',
            description: 'ทีมวิศวกรของเราพร้อมรับฟังความต้องการและนำเสนอโซลูชั่นที่เหมาะสมกับโครงการของคุณ',
            buttonText: 'ปรึกษาวิศวกรฟรี',
            buttonUrl: '/contact',
          },
        ],
        seo: {
          title: 'เกี่ยวกับเรา | PCC Post-Tension ขอนแก่น ผู้ผลิตคอนกรีตสำเร็จรูป',
          description: 'ทำความรู้จักกับ บริษัท พีซีซี โพสเทนชั่น จำกัด สาขาขอนแก่น ผู้เชี่ยวชาญด้านงานคอนกรีตอัดแรง กำแพงกันดิน รั้วสำเร็จรูป แผ่นพื้นสำเร็จรูป และงานโพสเทนชั่น มากกว่า 20 ปี มาตรฐาน มอก.',
        },
      },

      // ============================
      // 3. PRODUCTS (OVERVIEW) PAGE
      // ============================
      {
        slug: 'products',
        title: 'สินค้าและบริการ',
        content: [
          {
            type: 'hero',
            heading: 'สินค้าและบริการของเรา',
            subheading: 'ครบวงจรด้านผลิตภัณฑ์คอนกรีตสำเร็จรูป มาตรฐาน มอก. ออกแบบ ผลิต จัดส่ง และติดตั้งโดยวิศวกรผู้เชี่ยวชาญ',
            buttons: [
              { label: 'ขอใบเสนอราคาฟรี', url: '/contact', style: 'primary' },
            ],
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
          title: 'สินค้าและบริการ | กำแพงกันดิน รั้ว แผ่นพื้น โพสเทนชั่น ขอนแก่น | PCC',
          description: 'จำหน่ายและติดตั้งกำแพงกันดินตัว L รั้วสำเร็จรูป แผ่นพื้นสำเร็จรูป Hollow Core Slab เสารั้วลวดหนาม รั้วคาวบอย และงานโพสเทนชั่น มาตรฐาน มอก. ขอนแก่น',
        },
      },

      // ============================
      // 4. POST-TENSION PRODUCT PAGE
      // ============================
      {
        slug: 'post-tension',
        title: 'งานโพสเทนชั่น',
        content: [
          {
            type: 'hero',
            heading: 'งานโพสเทนชั่น (Post-Tension)',
            subheading: 'ระบบคอนกรีตอัดแรงที่ช่วยเพิ่มความแข็งแกร่งให้โครงสร้าง ประหยัดวัสดุ และลดระยะเวลาก่อสร้าง โดยวิศวกรผู้เชี่ยวชาญ',
            buttons: [
              { label: 'ขอใบเสนอราคา', url: '/contact', style: 'primary' },
              { label: 'ดูสินค้าอื่นๆ', url: '/products', style: 'secondary' },
            ],
          },
          {
            type: 'richText',
            content: `<div style="max-width:800px;margin:0 auto;padding:3rem 1.5rem;">
              <h2 style="font-size:1.75rem;font-weight:700;color:#1e3a8a;margin-bottom:1rem;">ระบบโพสเทนชั่นคืออะไร?</h2>
              <p style="font-size:1.1rem;color:#374151;line-height:1.9;margin-bottom:1.5rem;">
                <strong>Post-Tension (โพสเทนชั่น)</strong> คือเทคโนโลยีการก่อสร้างที่ใช้ลวดอัดแรงดึงภายหลังจากเทคอนกรีตแล้ว
                ทำให้คอนกรีตมีความแข็งแกร่งสูงกว่าปกติ ลดการแอ่นตัวของโครงสร้าง และสามารถออกแบบช่วงพาดได้ยาวขึ้น
              </p>
              <h3 style="font-size:1.35rem;font-weight:700;color:#1e3a8a;margin-bottom:0.75rem;">ข้อดีของระบบโพสเทนชั่น</h3>
              <ul style="color:#374151;line-height:2;margin-left:1.5rem;margin-bottom:1.5rem;">
                <li>ช่วงพาดได้ยาวขึ้น ลดจำนวนเสาและคาน</li>
                <li>ลดความหนาของพื้นและคาน ประหยัดวัสดุ</li>
                <li>ลดการแอ่นตัวและรอยแตกร้าว</li>
                <li>เหมาะสำหรับอาคารสูง ศูนย์การค้า โกดัง และที่จอดรถ</li>
                <li>ลดน้ำหนักรวมของโครงสร้างอาคาร</li>
              </ul>
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
                  { label: 'กำลังดึงลวด', value: 'ASTM A416 Grade 270' },
                  { label: 'ระบบยึดปลาย', value: 'ระบบลิ่ม (Wedge Anchor System)' },
                  { label: 'การออกแบบ', value: 'ตามมาตรฐาน ACI 318 / วสท.' },
                  { label: 'การใช้งาน', value: 'พื้น, คาน, ผนัง, สะพาน' },
                  { label: 'ช่วงพาดสูงสุด', value: 'สูงสุดถึง 20+ เมตร (ขึ้นอยู่กับการออกแบบ)' },
                ],
              },
            ],
            features: [
              'ลดจำนวนเสาและคาน เพิ่มพื้นที่ใช้สอย',
              'ลดความหนาพื้น 20-30% เมื่อเทียบกับระบบทั่วไป',
              'ลดน้ำหนักโครงสร้างรวมลง ประหยัดงานฐานราก',
              'ควบคุมการแอ่นตัวและรอยร้าวได้ดีกว่า',
              'ระยะเวลาก่อสร้างสั้นกว่า เพราะไม่ต้องรอถอดแบบนาน',
              'คุ้มค่าในระยะยาว ลดค่าซ่อมบำรุง',
            ],
            standardNote: 'ออกแบบและติดตั้งโดยวิศวกรโยธาที่มีใบประกอบวิชาชีพ ตามมาตรฐาน ACI 318 และมาตรฐานวิศวกรรมสถานแห่งประเทศไทย (วสท.)',
          },
          {
            type: 'process',
            headline: 'ขั้นตอนงานโพสเทนชั่น',
            subheadline: 'กระบวนการทำงานที่เป็นระบบและได้มาตรฐาน',
            steps: [
              { title: 'สำรวจและออกแบบ', description: 'วิศวกรสำรวจหน้างาน ออกแบบและคำนวณโครงสร้างที่เหมาะสม' },
              { title: 'ติดตั้งลวดอัดแรง', description: 'วางและยึดลวดโพสเทนชั่นในตำแหน่งที่ออกแบบไว้' },
              { title: 'เทคอนกรีต', description: 'เทคอนกรีตตามมาตรฐาน บ่มจนถึงกำลังที่กำหนด' },
              { title: 'ดึงลวดอัดแรง', description: 'ดึงลวดด้วยแรงตามที่ออกแบบ ด้วยอุปกรณ์มาตรฐาน' },
              { title: 'ตัดและอัดฉีดสี', description: 'ตัดลวดส่วนเกิน อัดฉีดวัสดุกันสนิม ตรวจสอบและส่งมอบ' },
            ],
          },
          {
            type: 'cta',
            headline: 'สนใจระบบโพสเทนชั่น?',
            description: 'ให้วิศวกรของเราประเมินความเหมาะสมและคำนวณความประหยัดที่คุณจะได้รับจากระบบโพสเทนชั่นฟรี',
            buttonText: 'ปรึกษาวิศวกรฟรี',
            buttonUrl: '/contact',
          },
        ],
        seo: {
          title: 'งานโพสเทนชั่น ขอนแก่น | ระบบคอนกรีตอัดแรง | PCC Post-Tension',
          description: 'รับงานโพสเทนชั่น Post-Tension ขอนแก่นและภาคอีสาน ออกแบบและติดตั้งโดยวิศวกรผู้เชี่ยวชาญ เหมาะสำหรับพื้น คาน สะพาน และโครงสร้างช่วงพาดยาว ตามมาตรฐาน ACI 318',
        },
      },

      // ============================
      // 5. HOLLOW CORE SLAB PRODUCT PAGE
      // ============================
      {
        slug: 'hollow-core-slab',
        title: 'แผ่นพื้นสำเร็จรูป Hollow Core Slab',
        content: [
          {
            type: 'hero',
            heading: 'แผ่นพื้นสำเร็จรูป Hollow Core Slab',
            subheading: 'แผ่นพื้นกลวงคุณภาพสูง มาตรฐาน มอก. 576-2546 และ มอก.828-2546 ความหนา 8-30 ซม. ผลิตตามสั่ง ส่งถึงหน้างาน',
            buttons: [
              { label: 'ขอใบเสนอราคา', url: '/contact', style: 'primary' },
              { label: 'ดูสินค้าอื่นๆ', url: '/products', style: 'secondary' },
            ],
          },
          {
            type: 'richText',
            content: `<div style="max-width:800px;margin:0 auto;padding:3rem 1.5rem;">
              <h2 style="font-size:1.75rem;font-weight:700;color:#1e3a8a;margin-bottom:1rem;">แผ่นพื้น Hollow Core Slab คืออะไร?</h2>
              <p style="font-size:1.1rem;color:#374151;line-height:1.9;margin-bottom:1.5rem;">
                <strong>Hollow Core Slab</strong> หรือ <strong>แผ่นพื้นกลวง</strong> คือแผ่นพื้นคอนกรีตอัดแรงสำเร็จรูปที่มีช่องกลวงตลอดความยาว
                ผลิตในโรงงานภายใต้การควบคุมคุณภาพอย่างเข้มงวด ทำให้มีความแข็งแกร่งสูง น้ำหนักเบา และติดตั้งได้รวดเร็ว
              </p>
              <p style="font-size:1.1rem;color:#374151;line-height:1.9;margin-bottom:1.5rem;">
                PCC Post-Tension เป็นหนึ่งในผู้แทนจำหน่ายและติดตั้งแผ่นพื้น Hollow Core Slab จาก <strong>บริษัท พิบูลย์คอนกรีต จำกัด (PCC)</strong>
                ซึ่งผลิตตามมาตรฐาน มอก. 576-2546 (แผ่นพื้นคอนกรีตอัดแรง) และ มอก.828-2546 (แผ่นพื้นคอนกรีตอัดแรงชนิดกลวง)
              </p>
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
                  { label: 'หนา 12 ซม. ช่วง 4 ม.', value: 'รับน้ำหนัก ~400 ksc' },
                  { label: 'หนา 15 ซม. ช่วง 5 ม.', value: 'รับน้ำหนัก ~350 ksc' },
                  { label: 'หนา 20 ซม. ช่วง 7 ม.', value: 'รับน้ำหนัก ~320 ksc' },
                  { label: 'หนา 25 ซม. ช่วง 9 ม.', value: 'รับน้ำหนัก ~280 ksc' },
                  { label: 'หนา 30 ซม. ช่วง 12 ม.', value: 'รับน้ำหนัก ~250 ksc' },
                ],
              },
            ],
            features: [
              'ลดน้ำหนักโครงสร้างเมื่อเทียบกับแผ่นพื้นทึบ 30-40%',
              'ช่วงพาดได้ไกลขึ้น ลดจำนวนคานและเสา',
              'ติดตั้งรวดเร็ว ลดระยะเวลาก่อสร้างได้มาก',
              'ผลิตในโรงงาน ควบคุมคุณภาพดีกว่าเทในสถานที่',
              'ช่องกลวงสามารถใช้เดินท่อร้อยสายไฟได้',
              'ประหยัดแบบหล่อ ลดต้นทุนงานพื้น',
              'รับน้ำหนักได้ดี เหมาะกับคลังสินค้า โรงงาน อาคารพาณิชย์',
            ],
            standardNote: 'ผลิตตามมาตรฐาน มอก. 576-2546 (แผ่นพื้นคอนกรีตอัดแรง) และ มอก. 828-2546 (แผ่นพื้นคอนกรีตอัดแรงชนิดกลวง) โดยโรงงานที่ได้รับการรับรองจากสำนักงานมาตรฐานผลิตภัณฑ์อุตสาหกรรม',
          },
          {
            type: 'testimonial',
            headline: 'ลูกค้าที่ใช้แผ่นพื้นของเรา',
          },
          {
            type: 'cta',
            headline: 'สนใจแผ่นพื้น Hollow Core Slab?',
            description: 'แจ้งขนาดและช่วงพาดที่ต้องการ วิศวกรของเราจะเลือกสเปคที่เหมาะสมและส่งใบเสนอราคาให้ฟรี',
            buttonText: 'ขอใบเสนอราคา',
            buttonUrl: '/contact',
          },
        ],
        seo: {
          title: 'แผ่นพื้นสำเร็จรูป Hollow Core Slab ขอนแก่น | มอก. | PCC Post-Tension',
          description: 'จำหน่ายและติดตั้งแผ่นพื้นสำเร็จรูป Hollow Core Slab ขอนแก่นและภาคอีสาน ความหนา 8-30 ซม. กว้าง 60/120 ซม. ผลิตตามมาตรฐาน มอก. 576-2546 และ มอก.828-2546 ราคาโรงงาน',
        },
      },

      // ============================
      // 6. CONTACT PAGE
      // ============================
      {
        slug: 'contact',
        title: 'ติดต่อเรา',
        content: [
          {
            type: 'hero',
            heading: 'ติดต่อ PCC Post-Tension',
            subheading: 'พร้อมให้คำปรึกษา ประเมินราคา และออกแบบเบื้องต้นฟรี ไม่มีข้อผูกมัด',
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
            branches: [
              {
                name: 'สาขาขอนแก่น (สำนักงานใหญ่)',
                address: 'เลขที่ 100 หมู่ 11 ตำบลแดงใหญ่ อำเภอเมือง จังหวัดขอนแก่น 40000',
                phone: '063-454-5656',
                email: 'contact@pcc-posttension.com',
                hours: 'จันทร์ – เสาร์: 08:00 – 17:00 น.',
                mapUrl: 'https://maps.google.com/?q=16.4419,102.8359',
                isPrimary: true,
              },
              {
                name: 'สาขาเชียงใหม่',
                address: '292/1 ถนนเชียงใหม่-ลำปาง ตำบลป่าตัน อำเภอเมือง จังหวัดเชียงใหม่ 50300',
                phone: '091-553-2624',
                hours: 'จันทร์ – เสาร์: 08:00 – 17:00 น.',
                mapUrl: 'https://maps.google.com/?q=18.8156,99.0199',
              },
            ],
          },
        ],
        seo: {
          title: 'ติดต่อเรา | PCC Post-Tension ขอนแก่น โทร 063-454-5656',
          description: 'ติดต่อ PCC Post-Tension สาขาขอนแก่น โทร 063-454-5656 หรือสาขาเชียงใหม่ โทร 091-553-2624 ขอใบเสนอราคา ปรึกษาแบบ ประเมินราคาฟรี ไม่มีข้อผูกมัด',
        },
      },

      // ============================
      // 7. PRIVACY POLICY PAGE
      // ============================
      {
        slug: 'privacy-policy',
        title: 'นโยบายความเป็นส่วนตัว',
        content: [
          {
            type: 'richText',
            content: `<div style="max-width:800px;margin:0 auto;padding:4rem 1.5rem;">
              <h1 style="font-size:2rem;font-weight:700;color:#111827;margin-bottom:0.5rem;">นโยบายความเป็นส่วนตัว</h1>
              <p style="color:#6b7280;margin-bottom:2.5rem;">อัปเดตล่าสุด: มิถุนายน 2026</p>

              <h2 style="font-size:1.35rem;font-weight:700;color:#1e3a8a;margin-bottom:0.75rem;margin-top:2rem;">1. ข้อมูลที่เราเก็บรวบรวม</h2>
              <p style="color:#374151;line-height:1.9;margin-bottom:1rem;">
                บริษัท พีซีซี โพสเทนชั่น จำกัด ("บริษัทฯ") เก็บรวบรวมข้อมูลส่วนบุคคลที่คุณให้ไว้เมื่อติดต่อเรา ได้แก่ ชื่อ-นามสกุล หมายเลขโทรศัพท์ อีเมล และข้อมูลเกี่ยวกับโครงการของคุณ
              </p>

              <h2 style="font-size:1.35rem;font-weight:700;color:#1e3a8a;margin-bottom:0.75rem;margin-top:2rem;">2. วัตถุประสงค์ในการใช้ข้อมูล</h2>
              <p style="color:#374151;line-height:1.9;margin-bottom:1rem;">
                บริษัทฯ ใช้ข้อมูลส่วนบุคคลของคุณเพื่อ: ติดต่อกลับตามคำขอ จัดทำใบเสนอราคา ให้บริการหลังการขาย และปรับปรุงการให้บริการของเรา
              </p>

              <h2 style="font-size:1.35rem;font-weight:700;color:#1e3a8a;margin-bottom:0.75rem;margin-top:2rem;">3. การเปิดเผยข้อมูล</h2>
              <p style="color:#374151;line-height:1.9;margin-bottom:1rem;">
                บริษัทฯ จะไม่เปิดเผยข้อมูลส่วนบุคคลของคุณให้กับบุคคลภายนอก เว้นแต่จะได้รับความยินยอมจากคุณ หรือเป็นการปฏิบัติตามกฎหมาย
              </p>

              <h2 style="font-size:1.35rem;font-weight:700;color:#1e3a8a;margin-bottom:0.75rem;margin-top:2rem;">4. ความปลอดภัยของข้อมูล</h2>
              <p style="color:#374151;line-height:1.9;margin-bottom:1rem;">
                บริษัทฯ ดำเนินมาตรการที่เหมาะสมเพื่อปกป้องข้อมูลส่วนบุคคลของคุณจากการเข้าถึงโดยไม่ได้รับอนุญาต การเปิดเผย การแก้ไข หรือการทำลาย
              </p>

              <h2 style="font-size:1.35rem;font-weight:700;color:#1e3a8a;margin-bottom:0.75rem;margin-top:2rem;">5. สิทธิ์ของเจ้าของข้อมูล</h2>
              <p style="color:#374151;line-height:1.9;margin-bottom:1rem;">
                คุณมีสิทธิ์เข้าถึง แก้ไข ลบ หรือขอรับสำเนาข้อมูลส่วนบุคคลของคุณได้ตลอดเวลา โดยติดต่อเราที่ contact@pcc-posttension.com
              </p>

              <h2 style="font-size:1.35rem;font-weight:700;color:#1e3a8a;margin-bottom:0.75rem;margin-top:2rem;">6. คุกกี้</h2>
              <p style="color:#374151;line-height:1.9;margin-bottom:1rem;">
                เว็บไซต์ของเราอาจใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งาน คุณสามารถปิดการใช้งานคุกกี้ได้จากการตั้งค่าเบราว์เซอร์ของคุณ
              </p>

              <h2 style="font-size:1.35rem;font-weight:700;color:#1e3a8a;margin-bottom:0.75rem;margin-top:2rem;">7. ติดต่อเรา</h2>
              <p style="color:#374151;line-height:1.9;">
                หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ กรุณาติดต่อ:<br/>
                <strong>บริษัท พีซีซี โพสเทนชั่น จำกัด</strong><br/>
                เลขที่ 100 หมู่ 11 ตำบลแดงใหญ่ อำเภอเมือง จังหวัดขอนแก่น 40000<br/>
                โทร: 063-454-5656 | อีเมล: contact@pcc-posttension.com<br/>
                เลขประจำตัวผู้เสียภาษี: 0505552001368
              </p>
            </div>`,
          },
        ],
        seo: {
          title: 'นโยบายความเป็นส่วนตัว | PCC Post-Tension',
          description: 'นโยบายความเป็นส่วนตัวของบริษัท พีซีซี โพสเทนชั่น จำกัด ข้อมูลการเก็บรักษาและใช้ข้อมูลส่วนบุคคลของลูกค้า',
        },
      },
    ];

    const results = [];

    for (const pageData of seedData) {
      const { slug, title, content, seo } = pageData;

      // Upsert page (insert or update if slug already exists)
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

      // Upsert SEO metadata
      await db.insert(seoMetadata).values({
        resourceType: 'page',
        resourceId: pageId,
        title: seo.title,
        description: seo.description,
      }).onConflictDoUpdate({
        target: [seoMetadata.resourceType, seoMetadata.resourceId],
        set: { title: seo.title, description: seo.description },
      });

      results.push({ slug, id: pageId, status: 'seeded' });
    }

    return NextResponse.json({
      success: true,
      seededPages: results,
      totalPages: results.length,
      message: `✅ Successfully seeded ${results.length} pages.`,
    });

  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
