import fs from 'fs';
import path from 'path';

export type PortfolioItem = {
  title: string;
  category: "post-tension" | "concrete-product" | "fence" | "other";
  description: string;
  image: string;
  location?: string;
};

export async function getAllPortfolios(): Promise<PortfolioItem[]> {
  const dir = path.join(process.cwd(), 'src/content/portfolio');
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch (e) {
    return [];
  }
  const portfolios: PortfolioItem[] = [];
  for (const file of files) {
    if (file.endsWith('.json')) {
      const content = fs.readFileSync(path.join(dir, file), 'utf8');
      portfolios.push(JSON.parse(content));
    }
  }
  return portfolios;
}
