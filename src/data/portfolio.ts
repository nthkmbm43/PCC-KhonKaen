export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  location?: string;
};

export const portfolios: PortfolioItem[] = [
  {
    id: "p1",
    title: "โครงการบ้านอัมพวัน",
    description: "งานติดตั้งกำแพงกันดินตัว L และรั้วสำเร็จรูป โครงการบ้านอัมพวัน เพื่อเสริมระดับพื้นที่และเพิ่มความมั่นคงแข็งแรง",
    image: "https://pcc-posttension.com/wp-content/uploads/2025/07/LINE_ALBUM_%E0%B8%A3%E0%B8%B1%E0%B9%89%E0%B8%A7%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%81%E0%B8%B3%E0%B9%81%E0%B8%9E%E0%B8%87%E0%B8%81%E0%B8%B1%E0%B8%99%E0%B8%94%E0%B8%B4%E0%B8%99-L-Wall-%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%AD%E0%B8%B1%E0%B8%A1%E0%B8%9E%E0%B8%A7%E0%B8%B1%E0%B8%99_250707_44-1067x800.jpg",
    category: "กำแพงกันดิน"
  },
  {
    id: "p2",
    title: "โครงการกำแพงกันดินและรั้ว จังหวัดอุดรธานี",
    description: "งานติดตั้งกำแพงกันดินตัว L ร่วมกับรั้วสำเร็จรูป ผลิตและติดตั้งโดยทีมงานมืออาชีพ",
    image: "https://pcc-posttension.com/wp-content/uploads/2025/02/LINE_ALBUM_%E0%B9%82%E0%B8%84%E0%B8%A3%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%81%E0%B8%B3%E0%B9%81%E0%B8%9E%E0%B8%87%E0%B8%81%E0%B8%B1%E0%B8%99%E0%B8%94%E0%B8%B4%E0%B8%99%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A3%E0%B8%B1%E0%B9%89%E0%B8%A7-GURU-%E0%B8%88-min.jpg",
    category: "รั้วสำเร็จรูป"
  },
  {
    id: "p3",
    title: "งานโพสเทนชั่น The Astra Sky River",
    description: "ผลงานระบบพื้น Post-Tension สำหรับโครงการ The Astra Sky River จังหวัดเชียงใหม่ เน้นความมั่นคงแข็งแรง",
    image: "https://pcc-posttension.com/wp-content/uploads/2025/07/The-ASTRA-Sky-River-1.jpg",
    category: "โพสเทนชั่น"
  },
  {
    id: "p4",
    title: "พื้นโพสเทนชั่น THE BASE Height",
    description: "งานติดตั้งพื้นคอนกรีตอัดแรงระบบ Post-Tension สำหรับโครงการคอนโดมิเนียม THE BASE Height จังหวัดเชียงใหม่",
    image: "https://pcc-posttension.com/wp-content/uploads/2025/07/the-base-height-chiangmai-condo-gallery-08-1.webp",
    category: "โพสเทนชั่น"
  },
  {
    id: "p5",
    title: "พื้นโพสเทนชั่น MAYA Lifestyle Shopping Center",
    description: "ผลงานระบบพื้น Post-Tension สำหรับห้างสรรพสินค้า MAYA Lifestyle Shopping Center ศูนย์การค้าขนาดใหญ่",
    image: "https://pcc-posttension.com/wp-content/uploads/2025/07/2b459-screenshot.jpg",
    category: "โพสเทนชั่น"
  }
];
