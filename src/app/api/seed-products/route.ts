import { db } from "@/db";
import { products, seoMetadata } from "@/db/schema";


export const dynamic = 'force-dynamic';

const PRODUCT_DATA = [
  {
    slug: 'retaining-wall',
    shortTitle: 'กำแพงกันดินตัว L',
    title: 'กำแพงกันดินตัว L ขอนแก่น | L Series สำเร็จรูป แข็งแรง พร้อมติดตั้ง',
    description: 'กำแพงกันดินตัว L ขอนแก่น ระบบ L Series สำเร็จรูปพร้อมฐานแผ่ แข็งแรง ทนทาน เหมาะกับพื้นที่ถมดิน พื้นที่ต่างระดับ ดินสไลด์ พร้อมบริการออกแบบ ผลิต จัดส่ง และติดตั้งโดยทีมวิศวกรมืออาชีพ',
    image: 'https://pcc-posttension.com/wp-content/uploads/2025/02/IMG20241112133904-min-copy-min-scaled.jpg',
    category: 'concrete',
    isFeatured: 'false',
    seoTitle: 'กำแพงกันดินตัว L ขอนแก่น | L Series คอนกรีตสำเร็จรูป มอก. | PCC',
    seoDescription: 'จำหน่ายและติดตั้งกำแพงกันดินตัว L คอนกรีตสำเร็จรูป L Series ขอนแก่นและภาคอีสาน แข็งแรง ทนทาน เหมาะกับงานถมดิน โรงงาน บ้านจัดสรร โทร 063-454-5656',
  },
  {
    slug: 'precast-fence',
    shortTitle: 'รั้วสำเร็จรูป',
    title: 'รั้วสำเร็จรูป ขอนแก่น | แข็งแรง ติดตั้งเร็ว พร้อมบริการติดตั้ง',
    description: 'รั้วสำเร็จรูป ขอนแก่น จาก พีซีซี โพสเทนชั่น แข็งแรง ทนทาน ติดตั้งรวดเร็ว เหมาะสำหรับบ้าน โครงการ โรงงาน และล้อมที่ดิน ไม่ต้องก่ออิฐฉาบปูน ประหยัดค่าแรง',
    image: 'https://pcc-posttension.com/wp-content/uploads/2025/02/IMG20241111110221-1-scaled.webp',
    category: 'concrete',
    isFeatured: 'false',
    seoTitle: 'รั้วสำเร็จรูป ขอนแก่น | คอนกรีตสำเร็จรูป ติดตั้งรวดเร็ว | PCC',
    seoDescription: 'จำหน่ายและติดตั้งรั้วสำเร็จรูปคอนกรีต ขอนแก่นและภาคอีสาน แข็งแรง ทนทาน ประกอบด้วยแผ่นรั้ว เสารั้ว คานทับหลัง ฐานราก โทร 063-454-5656',
  },
  {
    slug: 'precast-slab',
    shortTitle: 'แผ่นพื้นสำเร็จรูป (Precast)',
    title: 'แผ่นพื้นสำเร็จรูป ขอนแก่น | แผ่นพื้นอัดแรง มอก. 828-2546 พร้อมจัดส่ง',
    description: 'แผ่นพื้นสำเร็จรูปขอนแก่น แผ่นพื้นอัดแรงคุณภาพสูง มาตรฐาน มอก. 828-2546 ผลิตจากโรงงานมาตรฐาน ควบคุมโดยวิศวกร พร้อมบริการจัดส่งถึงหน้างาน ลดน้ำหนักโครงสร้าง 30-40%',
    image: 'https://pcc-posttension.com/wp-content/uploads/2025/03/1%E0%B9%81%E0%B8%9C%E0%B9%88%E0%B8%99%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99-min.webp',
    category: 'precast',
    isFeatured: 'true',
    seoTitle: 'แผ่นพื้นสำเร็จรูป พรีแคสท์ ขอนแก่น | มอก. 828-2546 | PCC',
    seoDescription: 'จำหน่ายและติดตั้งแผ่นพื้นสำเร็จรูป Precast พรีแคสท์ ขอนแก่นและภาคอีสาน มาตรฐาน มอก. 828-2546 ติดตั้งเร็ว ลดต้นทุน โทร 063-454-5656',
  },
  {
    slug: 'barbed-wire-post',
    shortTitle: 'เสารั้วลวดหนาม',
    title: 'เสารั้วลวดหนาม ขอนแก่น | เสารั้วอัดแรง แบบท้องปลิง สูง 2.10 เมตร',
    description: 'เสารั้วลวดหนาม ขอนแก่น เสารั้วอัดแรงแบบท้องปลิง สูง 2.10 เมตร แข็งแรง ทนทาน เหมาะสำหรับล้อมที่ดิน สวน ฟาร์ม พื้นที่เกษตร ปราศจากปัญหาปลวก พร้อมบริการจัดส่งถึงหน้างาน',
    image: 'https://pcc-posttension.com/wp-content/uploads/2025/02/%E0%B9%80%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%B1%E0%B9%89%E0%B8%A73-copy-min-scaled.jpg',
    category: 'concrete',
    isFeatured: 'false',
    seoTitle: 'เสารั้วลวดหนาม ขอนแก่น | เสารั้วอัดแรงแบบท้องปลิง | PCC',
    seoDescription: 'จำหน่ายเสารั้วลวดหนามคอนกรีตอัดแรง แบบท้องปลิง สูง 2.10 เมตร ขอนแก่น เหมาะกับงานล้อมที่ดิน สวน ฟาร์ม พื้นที่เกษตร โทร 063-454-5656',
  },
  {
    slug: 'post-tension',
    shortTitle: 'งานโพสเทนชั่น',
    title: 'โพสเทนชั่น ขอนแก่น | ออกแบบและติดตั้งพื้น Post-Tension โดยวิศวกร',
    description: 'โพสเทนชั่น ขอนแก่น บริการออกแบบ ติดตั้ง และให้คำปรึกษางานพื้น Post-Tension Slab สำหรับอาคารสูง โรงแรม คอนโด โรงงาน ช่วงพาดยาว 20+ เมตร ลดจำนวนเสาและคาน ประหยัดเวลาก่อสร้าง',
    image: 'https://pcc-posttension.com/wp-content/uploads/2025/02/%E0%B9%82%E0%B8%9E%E0%B8%AA.jpg',
    category: 'post-tension',
    isFeatured: 'true',
    seoTitle: 'งานโพสเทนชั่น ขอนแก่น | Post-Tension Slab วิศวกร ACI 318 | PCC',
    seoDescription: 'รับงานโพสเทนชั่น Post-Tension ขอนแก่นและภาคอีสาน ออกแบบและติดตั้งโดยวิศวกร ช่วงพาดสูงสุด 20+ เมตร เหมาะกับอาคารสูง คอนโด โรงแรม คลังสินค้า โทร 063-454-5656',
  },
  {
    slug: 'stake',
    shortTitle: 'เสาเข็มคอนกรีตอัดแรง',
    title: 'เสาเข็มคอนกรีตอัดแรง ขอนแก่น | เสาเข็มไอ และ เสาเข็มตัน แข็งแรงทนทาน',
    description: 'เสาเข็มคอนกรีตอัดแรง ขอนแก่น เสาเข็มไอ (I-Shape) และเสาเข็มสี่เหลี่ยมตัน ผลิตด้วยเทคโนโลยีที่ทันสมัย รับน้ำหนักโครงสร้างได้อย่างมั่นใจ หน้าตัดมาตรฐาน พร้อมบริการตอกเสาเข็ม',
    image: '/images/product-stake-real.png',
    category: 'concrete',
    isFeatured: 'false',
    seoTitle: 'เสาเข็มคอนกรีตอัดแรง ขอนแก่น | เสาเข็มไอ เสาเข็มตัน | PCC',
    seoDescription: 'เสาเข็มคอนกรีตอัดแรง ขอนแก่น เสาเข็มไอ (I-Shape) เสาเข็มสี่เหลี่ยมตัน แข็งแรง ทนทาน รับน้ำหนักได้มาตรฐาน เหมาะกับงานก่อสร้างทุกประเภท โทร 063-454-5656',
  },
];

export async function GET() {
  try {
    const results = [];
    for (const p of PRODUCT_DATA) {
      const { seoTitle, seoDescription, ...productFields } = p;

      // Upsert product
      const inserted = await db.insert(products).values({
        ...productFields,
        workflowState: 'published',
        status: 'published',
      }).onConflictDoUpdate({
        target: products.slug,
        set: {
          shortTitle: productFields.shortTitle,
          title: productFields.title,
          description: productFields.description,
          image: productFields.image,
          category: productFields.category,
          isFeatured: productFields.isFeatured,
        },
      }).returning();

      const productId = inserted[0].id;

      // Upsert SEO
      await db.insert(seoMetadata).values({
        resourceType: 'product',
        resourceId: productId,
        title: seoTitle,
        description: seoDescription,
      }).onConflictDoUpdate({
        target: [seoMetadata.resourceType, seoMetadata.resourceId],
        set: { title: seoTitle, description: seoDescription },
      });

      results.push({ slug: p.slug, id: productId });
    }

    return new Response(JSON.stringify({
      success: true,
      seeded: results.length,
      products: results,
      message: `✅ Seeded ${results.length} products with real images from pcc-posttension.com`,
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Seed products error:', error);
    return new Response(JSON.stringify({ success: false, error: String(error) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
