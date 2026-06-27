import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export type PortfolioItem = {
  title: string;
  category: "post-tension" | "concrete-product" | "fence" | "other" | string;
  description: string;
  image: string;
  location?: string;
};

const fallbackPortfolios: PortfolioItem[] = [
  {
    title: 'โครงการหมู่บ้านจัดสรร ขอนแก่น',
    category: 'fence',
    description: 'งานติดตั้งรั้วสำเร็จรูปรอบโครงการหมู่บ้านจัดสรร ความยาวกว่า 2 กิโลเมตร ดำเนินงานรวดเร็วและได้มาตรฐาน',
    image: 'https://pcc-posttension.com/wp-content/uploads/2025/03/%E0%B8%A3%E0%B8%B1%E0%B9%89%E0%B8%A7%E0%B8%AA%E0%B8%B3%E0%B9%80%E0%B8%A3%E0%B9%87%E0%B8%88-min.webp',
    location: 'อ.เมือง จ.ขอนแก่น'
  },
  {
    title: 'กำแพงกันดินตัว L โครงการโรงงาน',
    category: 'concrete-product',
    description: 'งานกำแพงกันดินตัว L ป้องกันดินสไลด์สำหรับโรงงานอุตสาหกรรม รองรับน้ำหนักและแรงดันดินได้สูง',
    image: 'https://pcc-posttension.com/wp-content/uploads/2025/03/%E0%B8%95%E0%B8%B1%E0%B8%A7L.webp',
    location: 'อ.น้ำพอง จ.ขอนแก่น'
  },
  {
    title: 'งานพื้นระบบโพสเทนชั่น อาคารพาณิชย์',
    category: 'post-tension',
    description: 'ออกแบบและติดตั้งระบบพื้นโพสเทนชั่นสำหรับอาคารพาณิชย์ 4 ชั้น ช่วยลดจำนวนเสา เพิ่มพื้นที่ใช้สอย',
    image: 'https://pcc-posttension.com/wp-content/uploads/2025/02/โพส.jpg',
    location: 'จ.อุดรธานี'
  }
];

export async function getAllPortfolios(): Promise<PortfolioItem[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'portfolio',
      depth: 1,
      limit: 100,
    });
    
    if (result.docs.length > 0) {
      return result.docs.map((doc: any) => ({
        title: doc.title,
        category: doc.category || 'other',
        description: doc.description,
        image: doc.image?.url || '',
        location: doc.location || '',
      }));
    }
  } catch (error) {
    console.error('Error fetching portfolios from Payload:', error instanceof Error ? error.message : String(error));
  }
  return fallbackPortfolios;
}
