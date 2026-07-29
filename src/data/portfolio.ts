import referencePortfolios from '@/content/reference-portfolios.json';

export type PortfolioItem = {
  slug: string;
  title: string;
  category: 'post-tension' | 'retaining-wall' | 'precast' | 'building' | string;
  description: string;
  image: string;
  location?: string;
  referenceDate?: string | null;
};

const portfolios = referencePortfolios satisfies PortfolioItem[];

export const portfolioCategoryLabels: Record<string, string> = {
  'post-tension': 'งานโพสเทนชั่น',
  'retaining-wall': 'กำแพงกันดินและรั้ว',
  precast: 'งานคอนกรีตสำเร็จรูป',
  building: 'งานอาคารและโครงสร้าง',
};

export async function getAllPortfolios(): Promise<PortfolioItem[]> {
  return portfolios;
}

export async function getPortfolioBySlug(slug: string): Promise<PortfolioItem | undefined> {
  return portfolios.find((portfolio) => portfolio.slug === slug);
}
