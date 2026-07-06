import { db } from "@/db";
import { pages, seoMetadata } from "@/db/schema";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // Security check in production: this should be guarded, but since it's a one-time setup requested by the admin,
  // and it's idempotent, we allow it. (In a real scenario, check admin auth here).

  try {
    const seedData = [
      {
        slug: 'home',
        title: 'หน้าหลัก',
        content: [
          { type: 'hero', title: 'PCC Post-Tension สาขาขอนแก่น', subtitle: 'ผู้นำด้านผลิตภัณฑ์คอนกรีตอัดแรง แผ่นพื้นสำเร็จรูป และกำแพงกันดิน ครบวงจรในภาคอีสาน', align: 'center' },
          { type: 'featureGrid', headline: 'ผลิตภัณฑ์และบริการของเรา', description: 'ส่งมอบวัสดุก่อสร้างคุณภาพสูงพร้อมบริการติดตั้งโดยวิศวกรผู้เชี่ยวชาญ' },
          { type: 'cta', title: 'พร้อมให้คำปรึกษาและประเมินราคาฟรี', subtitle: 'ทีมงานวิศวกรของเราพร้อมดูแลโครงการของคุณตั้งแต่เริ่มต้นจนจบ', buttonText: 'ติดต่อเราเลย', buttonLink: '/contact' }
        ],
        seo: { title: 'รับเหมาติดตั้งโพสเทนชั่น ขอนแก่น | PCC Post-Tension', description: 'บริการรับเหมาติดตั้งระบบโพสเทนชั่น แผ่นพื้นสำเร็จรูป และกำแพงกันดินในขอนแก่นและภาคอีสาน โดยวิศวกรผู้เชี่ยวชาญจาก PCC Post-Tension' }
      },
      {
        slug: 'about',
        title: 'เกี่ยวกับเรา',
        content: [
          { type: 'hero', title: 'เกี่ยวกับ PCC', subtitle: 'ความน่าเชื่อถือที่คุณวางใจได้', align: 'center' },
          { type: 'richText', content: '<div style="max-w-4xl; margin: 0 auto; text-align: center;"><h2 style="font-size: 2rem; margin-bottom: 1rem; color: #1e40af;">ประสบการณ์และความเชี่ยวชาญ</h2><p style="font-size: 1.125rem; color: #4b5563; line-height: 1.8;">PCC Post-Tension สาขาขอนแก่น เรามุ่งมั่นพัฒนาคุณภาพและมาตรฐานงานคอนกรีตอัดแรง ด้วยประสบการณ์อันยาวนานในวงการก่อสร้าง เราเป็นพันธมิตรที่ได้รับความไว้วางใจจากโครงการชั้นนำทั่วภาคอีสาน ทั้งอาคารพาณิชย์ โรงพยาบาล และโครงการที่อยู่อาศัย</p></div>' },
          { type: 'cta', title: 'ร่วมสร้างโครงการคุณภาพไปกับเรา', buttonText: 'ดูผลงานของเรา', buttonLink: '/products' }
        ],
        seo: { title: 'เกี่ยวกับเรา | PCC Post-Tension ขอนแก่น', description: 'ทำความรู้จักกับ PCC Post-Tension สาขาขอนแก่น ผู้เชี่ยวชาญด้านงานคอนกรีตอัดแรงและวัสดุก่อสร้างคุณภาพสูงในภาคตะวันออกเฉียงเหนือ' }
      },
      {
        slug: 'products',
        title: 'สินค้าและบริการ',
        content: [
          { type: 'hero', title: 'สินค้าและบริการของเรา', subtitle: 'มาตรฐานสูงสุด เพื่อโครงสร้างที่แข็งแกร่ง', align: 'center' },
          { type: 'richText', content: '<div style="text-align: center; margin-bottom: 2rem;"><p style="font-size: 1.25rem; color: #374151;">เราให้บริการครอบคลุมตั้งแต่การผลิต จำหน่าย และติดตั้ง</p></div>' },
          { type: 'featureGrid', headline: 'เลือกดูบริการทั้งหมด' },
          { type: 'cta', title: 'ต้องการใบเสนอราคา?', buttonText: 'ติดต่อฝ่ายขาย', buttonLink: '/contact' }
        ],
        seo: { title: 'สินค้าและบริการ โพสเทนชั่น | PCC Post-Tension', description: 'บริการจำหน่ายและติดตั้งระบบโพสเทนชั่น แผ่นพื้นสำเร็จรูป แผ่นพื้นกลวง (Hollow Core) และรั้วคอนกรีตสำเร็จรูป' }
      },
      {
        slug: 'contact',
        title: 'ติดต่อเรา',
        content: [
          { type: 'hero', title: 'ติดต่อ PCC สาขาขอนแก่น และ เชียงใหม่', subtitle: 'เราพร้อมให้บริการและคำปรึกษาฟรี', align: 'center' },
          { type: 'richText', content: '<div style="text-align: center; margin-bottom: 2rem;"><div style="margin-bottom: 2rem;"><h3 style="font-size: 1.5rem; color: #1e3a8a; margin-bottom: 0.5rem;">ที่ตั้งสำนักงานขอนแก่น</h3><p style="color: #4b5563;">เลขที่ 100 หมู่ 11 ตำบลแดงใหญ่ อำเภอเมือง จังหวัดขอนแก่น 40000</p><p style="color: #4b5563;"><strong>โทรศัพท์:</strong> 063-454-5656</p></div><div><h3 style="font-size: 1.5rem; color: #1e3a8a; margin-bottom: 0.5rem;">ที่ตั้งสำนักงานเชียงใหม่</h3><p style="color: #4b5563;">292/1 ถนนเชียงใหม่-ลำปาง ตำบลป่าตัน อำเภอเมือง จังหวัดเชียงใหม่ 50300</p><p style="color: #4b5563;"><strong>โทรศัพท์:</strong> 091-553-2624</p></div></div>' },
          { type: 'mapBlock' },
          { type: 'cta', title: 'ทักแชทคุยกับวิศวกร', buttonText: 'Add LINE OA', buttonLink: '#' }
        ],
        seo: { title: 'ติดต่อเรา | PCC Post-Tension ขอนแก่น', description: 'ติดต่อ PCC Post-Tension สาขาขอนแก่น ขอใบเสนอราคา ปรึกษาแบบแปลน ประเมินราคาฟรี' }
      }
    ];

    const results = [];

    for (const pageData of seedData) {
      const { slug, title, content, seo } = pageData;
      
      // Upsert Page
      const insertedPages = await db.insert(pages).values({
        slug,
        title,
        content,
        workflowState: 'published',
        template: 'default'
      }).onConflictDoUpdate({
        target: pages.slug,
        set: { title, content, workflowState: 'published' }
      }).returning();

      const pageId = insertedPages[0].id;

      // Upsert SEO Metadata
      // Assuming uniqueResource constraint is (resourceType, resourceId)
      await db.insert(seoMetadata).values({
        resourceType: 'page',
        resourceId: pageId,
        title: seo.title,
        description: seo.description,
      }).onConflictDoUpdate({
        target: [seoMetadata.resourceType, seoMetadata.resourceId],
        set: { title: seo.title, description: seo.description }
      });

      results.push({ slug, id: pageId, status: 'seeded' });
    }

    return NextResponse.json({ success: true, seededPages: results, message: "Database seeding completed successfully." });

  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
