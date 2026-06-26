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

export async function getAllProducts(): Promise<Product[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'products',
      depth: 1,
      limit: 100,
    });
    return result.docs.map(mapProduct);
  } catch (error) {
    console.error('Error fetching products from Payload:', error);
    return [];
  }
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
    console.error('Error fetching product by slug from Payload:', error);
  }
  return undefined;
}
