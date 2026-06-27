import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export type PortfolioItem = {
  title: string;
  category: "post-tension" | "concrete-product" | "fence" | "other" | string;
  description: string;
  image: string;
  location?: string;
};

export async function getAllPortfolios(): Promise<PortfolioItem[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'portfolio',
      depth: 1,
      limit: 100,
    });
    
    return result.docs.map((doc: any) => ({
      title: doc.title,
      category: doc.category || 'other',
      description: doc.description,
      image: doc.image?.url || '',
      location: doc.location || '',
    }));
  } catch (error) {
    console.error('Error fetching portfolios from Payload:', error instanceof Error ? error.message : String(error));
    return [];
  }
}
