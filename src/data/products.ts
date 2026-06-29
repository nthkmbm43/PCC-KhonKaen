import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export type ProductSection = {
  id?: string;
  type?: string;
  title?: string;
  content?: string;
  image?: string;
  bullets?: string[];
};

export type Product = {
  id?: string;
  slug: string;
  shortTitle: string;
  title: string;
  description: string;
  metaDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  image: string;
  category?: string;
  isFeatured?: boolean;
  status?: string;
  keywords?: string[];
  features?: string[];
  content?: ProductSection[];
  sections?: ProductSection[]; // for backward compatibility
};

// Map DB row to Product type
function mapDbProduct(row: any): Product {
  let parsedContent: ProductSection[] = [];
  try {
    if (typeof row.content === 'string') {
      parsedContent = JSON.parse(row.content);
    } else if (Array.isArray(row.content)) {
      parsedContent = row.content;
    }
  } catch (e) {
    console.error("Error parsing product content:", e);
  }

  return {
    id: row.id,
    slug: row.slug,
    shortTitle: row.shortTitle,
    title: row.title,
    description: row.description || '',
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    seoKeywords: row.seoKeywords,
    ogImage: row.ogImage,
    image: row.image || '',
    category: row.category,
    isFeatured: row.isFeatured === 'true',
    status: row.status,
    content: parsedContent,
    sections: parsedContent, // Aliased for older code compatibility
  };
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const dbProducts = await db
      .select()
      .from(products)
      .where(eq(products.status, 'published'))
      .orderBy(products.createdAt);
      
    return dbProducts.map(mapDbProduct);
  } catch (error) {
    console.error("Failed to fetch products from DB:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const dbProducts = await db
      .select()
      .from(products)
      .where(and(eq(products.slug, slug), eq(products.status, 'published')))
      .limit(1);
      
    if (dbProducts.length > 0) {
      return mapDbProduct(dbProducts[0]);
    }
    return undefined;
  } catch (error) {
    console.error(`Failed to fetch product ${slug} from DB:`, error);
    return undefined;
  }
}
