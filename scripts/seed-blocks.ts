import { db } from "../src/db";
import { pages } from "../src/db/schema";
import { eq } from "drizzle-orm";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seedBlocks() {
  console.log('Seeding beautifully designed CMS pages...');

  const pagesToSeed = [
    {
      slug: 'home',
      title: 'หน้าแรก',
      workflowState: 'published' as const,
      content: [
        { blockType: 'homeHero' },
        { blockType: 'trustBanner' },
        { blockType: 'servicesGrid' },
        { blockType: 'faqSection' },
        { blockType: 'ctaBanner' }
      ],
      seoTitle: 'บริษัท พีซีซี โพสเทนชั่น จำกัด | รับเหมาก่อสร้าง',
      seoDescription: 'รับเหมาก่อสร้าง โพสเทนชั่น กำแพงกันดิน'
    },
    {
      slug: 'about',
      title: 'เกี่ยวกับเรา',
      workflowState: 'published' as const,
      content: [
        { 
          blockType: 'aboutHero', 
          headline: 'ผู้นำด้านโครงสร้างคอนกรีตอัดแรง',
          description: 'บริษัท พีซีซี โพสเทนชั่น จำกัด ก่อตั้งขึ้นด้วยความมุ่งมั่นที่จะยกระดับมาตรฐานวงการก่อสร้างไทย ผ่านนวัตกรรมคอนกรีตอัดแรงที่แข็งแรง ปลอดภัย และตอบโจทย์ทุกโครงสร้าง',
          backgroundImage: 'https://pcc-posttension.com/wp-content/uploads/2025/02/pcc-โรงงาน-copy.jpg'
        },
        { blockType: 'aboutContent' },
        { 
          blockType: 'aboutFeatureGrid',
          headline: 'มาตรฐานระดับวิศวกรรม',
          description: 'ทุกชิ้นงานผ่านการคำนวณและควบคุมโดยทีมวิศวกรมืออาชีพ'
        },
        { blockType: 'ctaBanner' }
      ],
      seoTitle: 'เกี่ยวกับเรา | PCC Post-Tension',
      seoDescription: 'ประวัติและมาตรฐานการทำงานของ PCC Post-Tension'
    },
    {
      slug: 'contact',
      title: 'ติดต่อสอบถาม',
      workflowState: 'published' as const,
      content: [
        { blockType: 'contactInfo' },
        { blockType: 'contactSocial' },
        { blockType: 'ctaBanner' }
      ],
      seoTitle: 'ติดต่อเรา | PCC Post-Tension',
      seoDescription: 'ช่องทางการติดต่อ PCC Post-Tension'
    },
    {
      slug: 'products',
      title: 'สินค้าและบริการ',
      workflowState: 'published' as const,
      content: [
        { 
          blockType: 'hero',
          heading: 'สินค้าและบริการของเรา',
          subheading: 'บริการออกแบบ ผลิต และติดตั้งงานพื้นระบบโพสเทนชั่น กำแพงกันดิน รั้วสำเร็จรูป มั่นคง ปลอดภัย ด้วยมาตรฐานวิศวกรรมระดับสากล',
          backgroundImage: { url: 'https://pcc-posttension.com/wp-content/uploads/2025/02/pcc-โรงงาน-copy.jpg', alt: 'PCC Factory' }
        },
        { blockType: 'servicesGrid' },
        { blockType: 'ctaBanner' }
      ],
      seoTitle: 'สินค้าและบริการ | PCC Post-Tension',
      seoDescription: 'แคตตาล็อกสินค้าและบริการของ PCC Post-Tension'
    }
  ];

  for (const p of pagesToSeed) {
    const existing = await db.query.pages.findFirst({ where: eq(pages.slug, p.slug) });
    if (existing) {
      await db.update(pages).set(p).where(eq(pages.slug, p.slug));
      console.log(`Updated page: ${p.slug}`);
    } else {
      await db.insert(pages).values(p);
      console.log(`Created page: ${p.slug}`);
    }
  }

  console.log('CMS Seeding complete.');
}

seedBlocks().catch(console.error);
