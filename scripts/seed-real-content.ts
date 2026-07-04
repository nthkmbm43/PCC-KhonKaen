import { db } from "../src/db";
import { pages, seoMetadata } from "../src/db/schema";
import { eq, and } from "drizzle-orm";
import * as dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';

dotenv.config({ path: '.env.local' });

async function seedRealContent() {
  console.log('Seeding REAL CONTENT into CMS pages and SEO tables...');

  const pagesToSeed = [
    {
      slug: 'home',
      seoTitle: 'บริษัท พีซีซี โพสเทนชั่น จำกัด | รับเหมางานโพสเทนชั่น ขอนแก่น',
      seoDescription: 'บริการออกแบบ ผลิต และติดตั้งงานพื้นระบบโพสเทนชั่น กำแพงกันดิน รั้วสำเร็จรูป มั่นคง ปลอดภัย ด้วยมาตรฐานวิศวกรรมระดับสากล',
      content: [
        { 
          blockType: 'hero',
          heading: 'ผู้เชี่ยวชาญด้านงานคอนกรีตอัดแรงและโพสเทนชั่น',
          subheading: 'บริการออกแบบ ผลิต และติดตั้งงานพื้นระบบโพสเทนชั่น กำแพงกันดิน รั้วสำเร็จรูป มั่นคง ปลอดภัย ด้วยมาตรฐานวิศวกรรมระดับสากล',
          backgroundImage: { url: 'https://pcc-posttension.com/wp-content/uploads/2025/02/pcc-โรงงาน-copy.jpg' }
        },
        { blockType: 'trustBanner' },
        { blockType: 'servicesGrid' },
        { 
          blockType: 'callToAction',
          headline: 'ต้องการประเมินราคาโครงการฟรี?',
          theme: 'navy',
          buttons: [
            { label: 'แอดไลน์สอบถาม', url: 'https://line.me/ti/p/~@pccpost', style: 'primary' }
          ]
        }
      ]
    },
    {
      slug: 'about',
      seoTitle: 'เกี่ยวกับเรา | PCC Post-Tension',
      seoDescription: 'ประวัติความเป็นมา วิสัยทัศน์ และมาตรฐานวิศวกรรมระดับสากลของ พีซีซี โพสเทนชั่น',
      content: [
        { 
          blockType: 'aboutHero', 
          headline: 'มุ่งมั่นสร้างสรรค์งานโครงสร้างที่แข็งแกร่ง',
          description: 'บริษัท พีซีซี โพสเทนชั่น จำกัด ก่อตั้งขึ้นด้วยความมุ่งมั่นที่จะยกระดับมาตรฐานวงการก่อสร้างไทย ผ่านนวัตกรรมคอนกรีตอัดแรงที่แข็งแรง ปลอดภัย และตอบโจทย์ทุกโครงสร้าง',
          backgroundImage: 'https://pcc-posttension.com/wp-content/uploads/2025/02/pcc-โรงงาน-copy.jpg'
        },
        { 
          blockType: 'content',
          content: `
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold text-[#0a174f] mb-6">เกี่ยวกับ พีซีซี โพสเทนชั่น</h2>
              <p class="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                เราคือผู้เชี่ยวชาญด้านงานคอนกรีตอัดแรงและโพสเทนชั่นที่มีประสบการณ์ยาวนาน 
                ให้บริการครอบคลุมตั้งแต่การออกแบบ ผลิต และติดตั้ง โดยทีมวิศวกรผู้เชี่ยวชาญ 
                เรามีความมุ่งมั่นในการใช้วัสดุคุณภาพสูง ควบคุมการผลิตอย่างเข้มงวดทุกขั้นตอน 
                เพื่อส่งมอบผลงานที่แข็งแกร่ง ทนทาน และได้มาตรฐานวิศวกรรมระดับสากล
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div class="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm">
                <h3 class="text-xl font-bold text-[#0a174f] mb-4">วิสัยทัศน์ (Vision)</h3>
                <p class="text-gray-600">ก้าวสู่การเป็นผู้นำด้านผลิตภัณฑ์คอนกรีตอัดแรงและระบบโพสเทนชั่นที่ได้รับความไว้วางใจสูงสุดในภูมิภาค ด้วยนวัตกรรมและบริการที่เป็นเลิศ</p>
              </div>
              <div class="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm">
                <h3 class="text-xl font-bold text-[#0a174f] mb-4">พันธกิจ (Mission)</h3>
                <p class="text-gray-600">ส่งมอบผลิตภัณฑ์คุณภาพสูง บริการติดตั้งที่ได้มาตรฐาน ตรงต่อเวลา และให้คำปรึกษาด้านวิศวกรรมอย่างมืออาชีพ เพื่อความสำเร็จของลูกค้าทุกโครงการ</p>
              </div>
            </div>
          `
        },
        { 
          blockType: 'aboutFeatureGrid',
          headline: 'มาตรฐานระดับวิศวกรรม',
          description: 'ทุกชิ้นงานผ่านการคำนวณและควบคุมโดยทีมวิศวกรมืออาชีพ'
        }
      ]
    },
    {
      slug: 'products',
      seoTitle: 'สินค้าและบริการ | งานโพสเทนชั่นและแผ่นพื้นสำเร็จรูป',
      seoDescription: 'รวมแคตตาล็อกสินค้าและบริการจาก พีซีซี โพสเทนชั่น ตอบโจทย์ทุกงานก่อสร้าง',
      content: [
        { 
          blockType: 'hero',
          heading: 'ผลิตภัณฑ์และบริการของเรา',
          subheading: 'บริการออกแบบ ผลิต และติดตั้งงานพื้นระบบโพสเทนชั่น กำแพงกันดิน รั้วสำเร็จรูป มั่นคง ปลอดภัย ด้วยมาตรฐานวิศวกรรมระดับสากล',
          backgroundImage: { url: 'https://pcc-posttension.com/wp-content/uploads/2025/02/pcc-โรงงาน-copy.jpg', alt: 'PCC Factory' }
        },
        { blockType: 'servicesGrid' },
        { 
          blockType: 'callToAction',
          headline: 'สนใจขอรับแคตตาล็อกหรือแบบแปลน',
          theme: 'amber',
          buttons: [
            { label: 'ติดต่อฝ่ายขาย', url: '/contact', style: 'primary' }
          ]
        }
      ]
    },
    {
      slug: 'contact',
      seoTitle: 'ติดต่อสอบถาม | ขอใบเสนอราคา PCC Post-Tension',
      seoDescription: 'ช่องทางการติดต่อ พีซีซี โพสเทนชั่น ขอนแก่น เบอร์โทรศัพท์ แผนที่ และไลน์ออฟฟิเชียล',
      content: [
        { 
          blockType: 'hero',
          heading: 'ติดต่อเราเพื่อรับคำปรึกษาฟรี',
          subheading: 'ทีมวิศวกรของเราพร้อมให้คำปรึกษา ประเมินราคา และแนะนำโซลูชันที่เหมาะสมที่สุดสำหรับโครงการของคุณ',
          backgroundImage: { url: 'https://pcc-posttension.com/wp-content/uploads/2025/02/pcc-โรงงาน-copy.jpg' }
        },
        { 
          blockType: 'content',
          columns: [
            {
              size: 'half',
              content: `
                <div class="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 h-full">
                  <h3 class="text-3xl font-bold text-[#0a174f] mb-8">ข้อมูลการติดต่อ</h3>
                  <ul class="space-y-8">
                    <li class="flex items-start gap-5">
                      <div class="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      </div>
                      <div>
                        <p class="font-bold text-gray-900 text-xl">เบอร์โทรศัพท์</p>
                        <a href="tel:0634545656" class="text-brand-600 text-2xl font-bold hover:text-brand-700 transition-colors mt-2 block">063-454-5656</a>
                      </div>
                    </li>
                    <li class="flex items-start gap-5">
                      <div class="w-14 h-14 bg-green-50 text-[#00B900] rounded-2xl flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      </div>
                      <div>
                        <p class="font-bold text-gray-900 text-xl">LINE Official</p>
                        <a href="https://line.me/ti/p/~@pccpost" target="_blank" class="text-[#00B900] text-xl font-bold hover:text-green-700 transition-colors mt-2 block">@pccpost</a>
                      </div>
                    </li>
                    <li class="flex items-start gap-5">
                      <div class="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      </div>
                      <div>
                        <p class="font-bold text-gray-900 text-xl">เวลาทำการ</p>
                        <p class="text-gray-600 mt-2 text-lg">จันทร์ - เสาร์: 08:00 - 17:00 น.</p>
                      </div>
                    </li>
                    <li class="flex items-start gap-5">
                      <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </div>
                      <div>
                        <p class="font-bold text-gray-900 text-xl">ที่ตั้งโรงงาน</p>
                        <p class="text-gray-600 mt-2 text-lg">123 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมือง จ.ขอนแก่น 40000</p>
                      </div>
                    </li>
                  </ul>
                </div>
              `
            },
            {
              size: 'half',
              content: `
                <div class="h-full min-h-[500px] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.966953255153!2d102.83647347514336!3d16.42646698430635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31222a000c8227b7%3A0xb35fc0ab96105a!2z4Lie4Li14LiL4Li14LiL4Li1 IOC5guC4nuC4quC5g-C4l-C4meC4iuC4seC5iOC4mQ!5e0!3m2!1sth!2sth!4v1709623000000!5m2!1sth!2sth" width="100%" height="100%" style="border:0; min-height: 500px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
              `
            }
          ]
        }
      ]
    }
  ];

  for (const p of pagesToSeed) {
    const existingPage = await db.query.pages.findFirst({ where: eq(pages.slug, p.slug) });
    
    if (existingPage) {
      // 1. Update Content
      await db.update(pages).set({ content: p.content }).where(eq(pages.slug, p.slug));
      
      // 2. Upsert SEO
      const existingSeo = await db.query.seoMetadata.findFirst({
        where: and(
          eq(seoMetadata.resourceId, existingPage.id),
          eq(seoMetadata.resourceType, 'page')
        )
      });

      if (existingSeo) {
        await db.update(seoMetadata)
          .set({ title: p.seoTitle, description: p.seoDescription })
          .where(eq(seoMetadata.id, existingSeo.id));
      } else {
        await db.insert(seoMetadata).values({
          id: randomUUID(),
          resourceType: 'page',
          resourceId: existingPage.id,
          title: p.seoTitle,
          description: p.seoDescription
        });
      }

      console.log(`Updated real content & SEO for page: ${p.slug}`);
    } else {
      console.log(`Warning: Page ${p.slug} not found!`);
    }
  }

  console.log('Real Content Seeding complete.');
}

seedRealContent().catch(console.error);
