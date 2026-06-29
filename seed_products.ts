import { db } from './src/db';
import { products } from './src/db/schema';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const fallbackProducts = [
  {
    slug: 'retaining-wall',
    shortTitle: 'กำแพงกันดินตัว L',
    title: 'กำแพงกันดินตัว L สำเร็จรูป แข็งแรง ทนทาน',
    description: 'ผลิตด้วยเทคโนโลยีทันสมัย รองรับแรงดันดินได้ดี เหมาะสำหรับงานกันดินทรุดรอบที่ดิน โครงการหมู่บ้าน และงานจัดสรร',
    metaDescription: 'กำแพงกันดินตัว L สำเร็จรูป แข็งแรง ทนทาน รองรับแรงดันดินได้ดีเยี่ยม ผลิตจากโรงงานมาตรฐาน',
    image: 'https://pcc-posttension.com/wp-content/uploads/2025/03/%E0%B8%95%E0%B8%B1%E0%B8%A7L.webp',
    keywords: ['กำแพงกันดิน', 'กำแพงกันดินตัว L', 'กำแพงสำเร็จรูป'],
    features: ['แข็งแรง ทนทาน', 'ติดตั้งรวดเร็ว', 'มาตรฐานโรงงาน'],
    sections: []
  },
  {
    slug: 'precast-fence',
    shortTitle: 'รั้วสำเร็จรูป',
    title: 'รั้วคอนกรีตสำเร็จรูป สวยงาม แข็งแรง',
    description: 'รั้วคอนกรีตสำเร็จรูปดีไซน์สวยงาม ติดตั้งง่ายและรวดเร็ว ช่วยประหยัดเวลาและค่าแรง เหมาะสำหรับบ้านและโครงการต่างๆ',
    metaDescription: 'รั้วคอนกรีตสำเร็จรูป ติดตั้งรวดเร็ว แข็งแรง สวยงาม เหมาะกับโครงการจัดสรรและบ้านพักอาศัย',
    image: 'https://pcc-posttension.com/wp-content/uploads/2025/03/%E0%B8%A3%E0%B8%B1%E0%B9%89%E0%B8%A7%E0%B8%AA%E0%B8%B3%E0%B9%80%E0%B8%A3%E0%B9%87%E0%B8%88-min.webp',
    keywords: ['รั้วสำเร็จรูป', 'รั้วคอนกรีต', 'แผ่นรั้วสำเร็จรูป'],
    features: ['รวดเร็ว ประหยัดค่าแรง', 'แข็งแกร่ง ทนทาน', 'ผิวเรียบเนียน'],
    sections: []
  },
  {
    slug: 'precast-slab',
    shortTitle: 'แผ่นพื้นสำเร็จรูป',
    title: 'แผ่นพื้นสำเร็จรูป มอก. แข็งแรง ได้มาตรฐาน',
    description: 'แผ่นพื้นสำเร็จรูปแบบท้องเรียบและลอน ผลิตด้วยลวดอัดแรงคุณภาพสูง สามารถรับน้ำหนักได้มากตามมาตรฐานวิศวกรรม',
    metaDescription: 'แผ่นพื้นคอนกรีตอัดแรงสำเร็จรูป แข็งแรง ได้มาตรฐาน มอก. ส่งไวทั่วภาคอีสาน',
    image: 'https://pcc-posttension.com/wp-content/uploads/2025/02/1แผ่นพื้น.jpg',
    keywords: ['แผ่นพื้น', 'แผ่นพื้นสำเร็จรูป', 'แผ่นพื้น มอก.'],
    features: ['มาตรฐาน มอก.', 'ติดตั้งง่าย', 'ลดต้นทุนก่อสร้าง'],
    sections: []
  },
  {
    slug: 'barbed-wire-post',
    shortTitle: 'เสารั้วลวดหนาม',
    title: 'เสารั้วลวดหนามอัดแรง',
    description: 'เสารั้วลวดหนามคอนกรีตอัดแรง ทนทานต่อสภาพอากาศ ไม่ผุกร่อน อายุการใช้งานยาวนาน เหมาะสำหรับล้อมสวน ล้อมไร่ ล้อมที่ดิน',
    metaDescription: 'เสารั้วลวดหนามอัดแรง แข็งแรง ทนทาน เหมาะสำหรับกั้นอาณาเขตที่ดิน ล้อมสวน ล้อมไร่',
    image: 'https://pcc-posttension.com/wp-content/uploads/2025/03/%E0%B9%80%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%B1%E0%B9%89%E0%B8%A7-min.webp',
    keywords: ['เสารั้ว', 'เสาลวดหนาม', 'เสารั้วลวดหนาม'],
    features: ['อายุการใช้งานยาวนาน', 'ทนทานแดดฝน', 'คอนกรีตอัดแรง'],
    sections: []
  },
  {
    slug: 'post-tension',
    shortTitle: 'งานพื้นระบบโพสเทนชั่น',
    title: 'บริการออกแบบและติดตั้งพื้นระบบโพสเทนชั่น (Post-Tension)',
    description: 'รับออกแบบและติดตั้งพื้นระบบโพสเทนชั่นสำหรับอาคารขนาดใหญ่ โรงแรม คอนโดมิเนียม โดยทีมวิศวกรและช่างผู้ชำนาญการ',
    metaDescription: 'รับติดตั้งพื้นโพสเทนชั่น (Post-Tension) สำหรับอาคารและโครงการขนาดใหญ่โดยทีมวิศวกรผู้เชี่ยวชาญ',
    image: 'https://pcc-posttension.com/wp-content/uploads/2025/02/โพส.jpg',
    keywords: ['โพสเทนชั่น', 'Post-Tension', 'พื้นไร้คาน', 'พื้นโพสเทนชั่น'],
    features: ['ควบคุมโดยวิศวกร', 'วัสดุคุณภาพสูง', 'โครงสร้างแข็งแรง'],
    sections: []
  }
];

async function seed() {
  try {
    console.log("Seeding products to database...");
    
    for (const prod of fallbackProducts) {
      await db.insert(products).values({
        slug: prod.slug,
        shortTitle: prod.shortTitle,
        title: prod.title,
        description: prod.description,
        seoDescription: prod.metaDescription,
        image: prod.image,
        seoKeywords: prod.keywords.join(', '),
        // we'll store features inside content for now or just wait, we don't have a specific `features` column in the new schema?
        // Wait, the new schema doesn't have `keywords` or `features` explicitly, they are supposed to be part of the product.
        // Actually, we can store features in a custom JSON block or just let the user re-add them.
        // In the new schema I didn't add features. Wait, I should probably store features in `content` as a specific block.
        content: JSON.stringify([{
            id: 'features-block',
            type: 'features',
            title: 'จุดเด่นของบริการ',
            bullets: prod.features
        }]),
        category: 'general',
        isFeatured: 'false',
        status: 'published',
      }).onConflictDoNothing();
      console.log(`Inserted: ${prod.slug}`);
    }
    
    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
