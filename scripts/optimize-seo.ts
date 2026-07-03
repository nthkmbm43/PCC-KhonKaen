import { db } from "../src/db";
import { pages, products, seoMetadata } from "../src/db/schema";
import { eq, and } from "drizzle-orm";

const pageSeoData: Record<string, { title: string, description: string, keywords: string }> = {
  home: {
    title: "รับเหมาโพสเทนชั่น ขอนแก่น | แผ่นพื้นสำเร็จรูป กำแพงกันดินตัว L | PCC Post-Tension",
    description: "บริษัท พีซีซี โพสเทนชั่น จำกัด ผู้เชี่ยวชาญงานพื้นอัดแรง (Post-Tension) แผ่นพื้นสำเร็จรูป พรีแคสท์ รั้วสำเร็จรูป และกำแพงกันดินตัว L ตั้งอยู่ที่ ต.แดงใหญ่ อ.เมืองขอนแก่น บริการทั่วภาคอีสาน",
    keywords: "รับเหมาโพสเทนชั่น, โพสเทนชั่น ขอนแก่น, แผ่นพื้นสำเร็จรูป, พรีแคสท์ ขอนแก่น, กำแพงกันดินตัว L, รั้วสำเร็จรูป ขอนแก่น, PCC Post-Tension, แดงใหญ่"
  },
  about: {
    title: "เกี่ยวกับเรา | บริษัท พีซีซี โพสเทนชั่น จำกัด ต.แดงใหญ่ ขอนแก่น",
    description: "ทำความรู้จัก บริษัท พีซีซี โพสเทนชั่น จำกัด ผู้เชี่ยวชาญด้านงานพื้นอัดแรงและชิ้นส่วนคอนกรีตสำเร็จรูป (พรีแคสท์) ประสบการณ์กว่า 30 ปี ตั้งอยู่ที่ ต.แดงใหญ่ อ.เมืองขอนแก่น ให้บริการทั้งภาคอีสาน",
    keywords: "ประวัติ พีซีซี โพสเทนชั่น, โรงงานพรีแคสท์ ขอนแก่น, แดงใหญ่ ขอนแก่น, ผู้เชี่ยวชาญโพสเทนชั่น อีสาน"
  },
  contact: {
    title: "ติดต่อเรา | PCC Post-Tension โรงงาน ต.แดงใหญ่ อ.เมือง ขอนแก่น",
    description: "ติดต่อสอบถามราคา สั่งผลิต หรือขอรับใบเสนอราคา แผ่นพื้นสำเร็จรูป รั้วสำเร็จรูป กำแพงกันดินตัว L และงานโพสเทนชั่น บริษัท พีซีซี โพสเทนชั่น จำกัด ตั้งอยู่ที่ ต.แดงใหญ่ อ.เมืองขอนแก่น จ.ขอนแก่น",
    keywords: "ติดต่อพีซีซี, แดงใหญ่ ขอนแก่น, สั่งผลิตพรีแคสท์, ราคาแผ่นพื้นสำเร็จรูป, โรงงานพรีแคสท์ ต.แดงใหญ่"
  },
  products: {
    title: "สินค้าและบริการ ชิ้นส่วนพรีแคสท์ คอนกรีตอัดแรง | PCC Post-Tension ขอนแก่น",
    description: "รวมสินค้าและบริการด้านคอนกรีตสำเร็จรูป (พรีแคสท์) จากโรงงาน ต.แดงใหญ่ ขอนแก่น ได้แก่ กำแพงกันดินตัว L รั้วสำเร็จรูป แผ่นพื้นสำเร็จรูป เสารั้วลวดหนาม และงานรับเหมาโพสเทนชั่น คุณภาพสูง",
    keywords: "สินค้าพรีแคสท์, คอนกรีตอัดแรง ขอนแก่น, กำแพงกันดินตัว L, รั้วสำเร็จรูป, แผ่นพื้นสำเร็จรูป"
  },
  portfolio: {
    title: "ผลงานการติดตั้ง งานพรีแคสท์และโพสเทนชั่น ทั่วภาคอีสาน | PCC Post-Tension",
    description: "ชมผลงานการติดตั้งจริง ทั้งงานแผ่นพื้นสำเร็จรูป รั้วสำเร็จรูป กำแพงกันดินตัว L และงานโพสเทนชั่น โดยทีมวิศวกรจาก บริษัท พีซีซี โพสเทนชั่น จำกัด ต.แดงใหญ่ อ.เมืองขอนแก่น บริการทั่วภาคอีสาน",
    keywords: "ผลงานโพสเทนชั่น, ผลงานพรีแคสท์, โครงการก่อสร้าง ขอนแก่น, แดงใหญ่"
  }
};

const productSeoData: Record<string, { title: string, description: string, keywords: string }> = {
  "retaining-wall": {
    title: "กำแพงกันดินตัว L สำเร็จรูป ป้องกันดินสไลด์ | PCC Post-Tension ขอนแก่น",
    description: "ผลิตและจำหน่ายกำแพงกันดินตัว L สำเร็จรูป คอนกรีตอัดแรง ป้องกันดินพัง ดินสไลด์ งานปรับระดับพื้นที่ โดยโรงงานที่ ต.แดงใหญ่ อ.เมืองขอนแก่น จัดส่งทั่วภาคอีสาน ราคาโรงงาน",
    keywords: "กำแพงกันดินตัว L, กำแพงกันดิน ขอนแก่น, กำแพงกันดินสำเร็จรูป, ป้องกันดินสไลด์, ตัว L พรีแคสท์, แดงใหญ่"
  },
  "precast-fence": {
    title: "รั้วสำเร็จรูป คอนกรีตพรีแคสท์ ขอนแก่น ติดตั้งรวดเร็ว | PCC Post-Tension",
    description: "รั้วคอนกรีตสำเร็จรูป พรีแคสท์ ผลิตจากโรงงานที่ ต.แดงใหญ่ อ.เมืองขอนแก่น ติดตั้งง่าย รวดเร็ว แข็งแรงทนทาน บริการจัดส่งและติดตั้งทั้งจังหวัดขอนแก่นและจังหวัดใกล้เคียง",
    keywords: "รั้วสำเร็จรูป, รั้วพรีแคสท์ ขอนแก่น, รั้วคอนกรีตสำเร็จรูป, ติดตั้งรั้วสำเร็จรูป, รั้ว ต.แดงใหญ่"
  },
  "precast-slab": {
    title: "แผ่นพื้นสำเร็จรูป ท้องเรียบ มาตรฐาน มอก. | PCC Post-Tension ขอนแก่น",
    description: "ผลิตและจำหน่ายแผ่นพื้นสำเร็จรูป แผ่นพื้นท้องเรียบ คุณภาพสูง มาตรฐาน มอก. 828-2546 รับน้ำหนักได้ดี สั่งผลิตตามขนาดที่ต้องการ จากโรงงานที่ ต.แดงใหญ่ อ.เมืองขอนแก่น จัดส่งทั่วอีสาน",
    keywords: "แผ่นพื้นสำเร็จรูป, แผ่นพื้นท้องเรียบ, แผ่นพื้น มอก., แผ่นพื้น ขอนแก่น, พรีแคสท์ แดงใหญ่"
  },
  "barbed-wire-post": {
    title: "เสารั้วลวดหนาม คอนกรีตอัดแรง ต.แดงใหญ่ ขอนแก่น | PCC Post-Tension",
    description: "เสารั้วลวดหนาม เสาคอกวัว คอนกรีตอัดแรง แข็งแรงทนทาน ไม่ผุกร่อน เหมาะสำหรับล้อมพื้นที่เกษตร สวน ไร่นา ฟาร์ม ผลิตจากโรงงาน ต.แดงใหญ่ อ.เมืองขอนแก่น ราคาโรงงาน",
    keywords: "เสารั้วลวดหนาม, เสาคอกวัว, เสารั้วคอนกรีต, เสารั้ว ขอนแก่น, เสาลวดหนาม แดงใหญ่"
  },
  "post-tension": {
    title: "รับเหมาโพสเทนชั่น (Post-Tension) ออกแบบติดตั้งพื้นอัดแรง | PCC ขอนแก่น",
    description: "บริการรับเหมางานโพสเทนชั่น (Post-Tension Slab) ออกแบบและติดตั้งพื้นอัดแรงภายหลัง (Unbonded) มาตรฐาน ACI โดยวิศวกรโยธาผู้มีใบอนุญาต (สย.) ประสบการณ์กว่า 30 ปี จาก บริษัท พีซีซี โพสเทนชั่น จำกัด ต.แดงใหญ่ อ.เมืองขอนแก่น",
    keywords: "รับเหมาโพสเทนชั่น, พื้นโพสเทนชั่น, Post-Tension ขอนแก่น, พื้นอัดแรงภายหลัง, โพสเทนชั่น แดงใหญ่"
  }
};

async function optimizeSeo() {
  console.log("Starting SEO Re-Optimization (CMS-003 — แดงใหญ่ Edition)...");

  // Optimize Pages
  const allPages = await db.select().from(pages);
  for (const page of allPages) {
    const seoInfo = pageSeoData[page.slug];
    if (seoInfo) {
      const existing = await db.select().from(seoMetadata).where(and(eq(seoMetadata.resourceType, 'page'), eq(seoMetadata.resourceId, page.id))).limit(1);
      
      if (existing.length > 0) {
        await db.update(seoMetadata)
          .set({ title: seoInfo.title, description: seoInfo.description, keywords: seoInfo.keywords, updatedAt: new Date() })
          .where(eq(seoMetadata.id, existing[0].id));
        console.log(`✅ Updated SEO for page: ${page.slug}`);
      } else {
        await db.insert(seoMetadata).values({
          resourceType: 'page',
          resourceId: page.id,
          title: seoInfo.title,
          description: seoInfo.description,
          keywords: seoInfo.keywords
        });
        console.log(`➕ Inserted SEO for page: ${page.slug}`);
      }
    } else {
      console.log(`⏭️  No SEO template for page: ${page.slug} (skipped)`);
    }
  }

  // Optimize Products
  const allProducts = await db.select().from(products);
  for (const product of allProducts) {
    const seoInfo = productSeoData[product.slug];
    if (seoInfo) {
      const existing = await db.select().from(seoMetadata).where(and(eq(seoMetadata.resourceType, 'product'), eq(seoMetadata.resourceId, product.id))).limit(1);
      
      if (existing.length > 0) {
        await db.update(seoMetadata)
          .set({ title: seoInfo.title, description: seoInfo.description, keywords: seoInfo.keywords, updatedAt: new Date() })
          .where(eq(seoMetadata.id, existing[0].id));
        console.log(`✅ Updated SEO for product: ${product.slug}`);
      } else {
        await db.insert(seoMetadata).values({
          resourceType: 'product',
          resourceId: product.id,
          title: seoInfo.title,
          description: seoInfo.description,
          keywords: seoInfo.keywords
        });
        console.log(`➕ Inserted SEO for product: ${product.slug}`);
      }
    } else {
      console.log(`⏭️  No SEO template for product: ${product.slug} (skipped)`);
    }
  }

  console.log("\n🎉 SEO Optimization complete! Location updated: ต.แดงใหญ่ อ.เมืองขอนแก่น");
  process.exit(0);
}

optimizeSeo().catch(console.error);
