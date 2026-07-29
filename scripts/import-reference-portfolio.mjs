import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sitemapUrl = 'https://pcc-posttension.com/featured_item-sitemap.xml';
const outputDirectory = path.resolve('public/images/portfolio/reference');
const outputData = path.resolve('src/content/reference-portfolios.json');
const requestHeaders = { 'User-Agent': 'PCC-KhonKaen-Portfolio-Importer/1.0' };

function decodeEntities(value = '') {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMeta(html, property) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, 'i'),
  ];
  return decodeEntities(patterns.map((pattern) => html.match(pattern)?.[1]).find(Boolean) || '');
}

function stripSiteName(title) {
  return title
    .replace(/\s*[-–|]\s*พีซีซี.*$/i, '')
    .replace(/\s*[-–|]\s*PCC.*$/i, '')
    .trim();
}

function inferCategory(text) {
  if (/กำแพงกันดิน|รั้วสำเร็จรูป|retaining|fence/i.test(text)) return 'retaining-wall';
  if (/post[- ]?tension|โพสเทนชั่น/i.test(text)) return 'post-tension';
  if (/แผ่นพื้น|precast/i.test(text)) return 'precast';
  return 'building';
}

function inferLocation(text) {
  const locations = ['ขอนแก่น', 'อุดรธานี', 'เชียงใหม่', 'มุกดาหาร', 'ชุมแพ', 'น้ำพอง', 'บ้านฝาง', 'กังสดาล', 'บึงแก่นนคร'];
  return locations.filter((location) => text.includes(location)).slice(0, 2).join(', ') || 'ประเทศไทย';
}

async function fetchText(url) {
  const response = await fetch(url, { headers: requestHeaders });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

async function downloadImage(url, outputPath) {
  const response = await fetch(url, { headers: requestHeaders });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const input = Buffer.from(await response.arrayBuffer());
  await sharp(input)
    .rotate()
    .resize({ width: 1600, height: 1100, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(outputPath);
}

await fs.mkdir(outputDirectory, { recursive: true });
const sitemap = await fetchText(sitemapUrl);
const urlBlocks = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map((match) => match[1]);
const projects = [];

for (const block of urlBlocks) {
  const sourceUrl = decodeEntities(block.match(/<loc>([^<]+)<\/loc>/i)?.[1] || '');
  if (!sourceUrl || sourceUrl.endsWith('/featured_item/')) continue;

  const projectNumber = projects.length + 1;
  const slug = `reference-project-${String(projectNumber).padStart(2, '0')}`;
  const sitemapImages = [...new Set(
    [...block.matchAll(/<image:loc>([^<]+)<\/image:loc>/gi)].map((match) => decodeEntities(match[1])),
  )];
  const html = await fetchText(sourceUrl);
  const title = stripSiteName(extractMeta(html, 'og:title')) || `ผลงานอ้างอิงโครงการที่ ${projectNumber}`;
  const description = extractMeta(html, 'og:description') || 'ผลงานอ้างอิงจากประสบการณ์การดำเนินงานของบริษัท';
  const imageUrl = sitemapImages[1] || sitemapImages[0] || extractMeta(html, 'og:image');
  if (!imageUrl) throw new Error(`No project image: ${sourceUrl}`);

  const localImage = `/images/portfolio/reference/${slug}.webp`;
  await downloadImage(imageUrl, path.join(outputDirectory, `${slug}.webp`));
  const combinedText = `${title} ${description}`;
  projects.push({
    slug,
    title,
    category: inferCategory(combinedText),
    description,
    image: localImage,
    location: inferLocation(combinedText),
    referenceDate: block.match(/<lastmod>([^<]+)<\/lastmod>/i)?.[1]?.slice(0, 10) || null,
  });
  console.log(`[${projectNumber}] ${title}`);
}

await fs.writeFile(outputData, `${JSON.stringify(projects, null, 2)}\n`, 'utf8');
console.log(`Imported ${projects.length} projects to ${outputData}`);
