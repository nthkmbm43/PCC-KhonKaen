import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export type ProductSection = {
  id?: string;
  title: string;
  content: string;
  image?: string;
  bullets?: string[];
};

export type Product = {
  slug: string;
  shortTitle: string;
  title: string;
  description: string;
  metaDescription: string;
  image: string;
  keywords: string[];
  features: string[];
  sections: ProductSection[];
};

function mapProduct(doc: any): Product {
  return {
    slug: doc.slug,
    shortTitle: doc.shortTitle,
    title: doc.title,
    description: doc.description,
    metaDescription: doc.metaDescription,
    image: doc.image?.url || '',
    keywords: doc.keywords?.map((k: any) => k.keyword) || [],
    features: doc.features?.map((f: any) => f.feature) || [],
    sections: doc.sections?.map((s: any) => ({
      id: s.sectionId,
      title: s.title,
      content: s.content,
      image: s.image?.url || '',
      bullets: s.bullets?.map((b: any) => b.bullet) || [],
    })) || [],
  };
}

const fallbackProducts: Product[] = [
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

export async function getAllProducts(): Promise<Product[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'products',
      depth: 1,
      limit: 100,
    });
    if (result.docs.length > 0) {
      return result.docs.map(mapProduct);
    }
  } catch (error) {
    console.error('Error fetching products from Payload:', error instanceof Error ? error.message : String(error));
  }
  // Fallback data
  return fallbackProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'products',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 1,
      limit: 1,
    });
    if (result.docs.length > 0) {
      return mapProduct(result.docs[0]);
    }
  } catch (error) {
    console.error('Error fetching product by slug from Payload:', error instanceof Error ? error.message : String(error));
  }
  // Fallback
  return fallbackProducts.find(p => p.slug === slug);
}
