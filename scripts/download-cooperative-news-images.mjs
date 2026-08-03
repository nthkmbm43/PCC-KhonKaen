import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const images = [
  {
    filename: "governor-kraisorn-visit-pcc.webp",
    source: "https://pcc-posttension.com/wp-content/uploads/2025/09/ผู้ว่า-copy.jpg",
  },
  {
    filename: "trin-siricharuwon-community-speaker.webp",
    source: "https://pcc-posttension.com/wp-content/uploads/2025/06/74132_0.jpg",
  },
  {
    filename: "deputy-governor-panthep-visit-pcc.webp",
    source: "https://pcc-posttension.com/wp-content/uploads/2025/06/IMG20250611173825-min-scaled.jpg",
  },
  {
    filename: "somchart-suparee-workforce-visit.webp",
    source: "https://pcc-posttension.com/wp-content/uploads/2025/06/482059080_122145440972565371_7521450820219815816_n.jpg",
  },
];

const outputDir = path.join(process.cwd(), "public", "images", "news");
await mkdir(outputDir, { recursive: true });

for (const image of images) {
  const response = await fetch(image.source);
  if (!response.ok) throw new Error(`Unable to download ${image.source}: ${response.status}`);
  const source = Buffer.from(await response.arrayBuffer());
  const optimized = await sharp(source)
    .rotate()
    .resize({ width: 1400, height: 900, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer();
  await writeFile(path.join(outputDir, image.filename), optimized);
  console.log(`${image.filename}: ${Math.round(optimized.length / 1024)} KB`);
}
