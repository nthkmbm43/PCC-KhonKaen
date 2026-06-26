import fs from 'fs';
import path from 'path';

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

export async function getAllProducts(): Promise<Product[]> {
  const dir = path.join(process.cwd(), 'src/content/products');
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch (e) {
    return [];
  }
  const products: Product[] = [];
  for (const file of files) {
    if (file.endsWith('.json')) {
      const content = fs.readFileSync(path.join(dir, file), 'utf8');
      products.push(JSON.parse(content));
    }
  }
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find(p => p.slug === slug);
}
