import dotenv from "dotenv";
import { and, eq } from "drizzle-orm";
import { db } from "../src/db";
import { pages, products, seoMetadata } from "../src/db/schema";

dotenv.config({ path: ".env.local" });

function summarizeContent(content: unknown) {
  if (!Array.isArray(content)) return [];
  return content.map((block, index) => {
    const item = block && typeof block === "object" ? block as Record<string, unknown> : {};
    return {
      index,
      type: item.type || item.blockType || "unknown",
      id: item.id || null,
      headline: item.headline || item.title || null,
      itemCount: Array.isArray(item.items) ? item.items.length : null,
    };
  });
}

function findRiskPhrases(value: unknown, path = 'root'): Array<{ path: string; text: string }> {
  if (typeof value === 'string') {
    return ['100%', 'หมดปัญหา', 'รีวิวจากลูกค้าจริง', 'ผลงานจริง'].flatMap((phrase) => {
      const index = value.indexOf(phrase);
      return index >= 0
        ? [{ path, text: value.slice(Math.max(0, index - 180), index + phrase.length + 280) }]
        : [];
    });
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findRiskPhrases(item, `${path}[${index}]`));
  }
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value as Record<string, unknown>)
    .flatMap(([key, item]) => findRiskPhrases(item, `${path}.${key}`));
}

async function main() {
  const includeContent = process.env.AUDIT_FULL === "1";
  const requestedSlugs = new Set(
    (process.env.AUDIT_SLUGS || "")
      .split(",")
      .map((slug) => slug.trim())
      .filter(Boolean),
  );
  const pageRows = (await db.select().from(pages)).filter(
    (page) => requestedSlugs.size === 0 || requestedSlugs.has(page.slug),
  );
  const productRows = (await db.select().from(products)).filter(
    (product) => requestedSlugs.size === 0 || requestedSlugs.has(product.slug),
  );

  const pageOutput = [];
  for (const page of pageRows) {
    const [seo] = await db.select().from(seoMetadata).where(
      and(eq(seoMetadata.resourceType, "page"), eq(seoMetadata.resourceId, page.id)),
    ).limit(1);
    pageOutput.push({
      slug: page.slug,
      title: page.title,
      workflowState: page.workflowState,
      seo: seo ? {
        title: seo.title,
        titleLength: seo.title?.length || 0,
        description: seo.description,
        descriptionLength: seo.description?.length || 0,
        canonical: seo.canonical,
        ogImage: seo.ogImage,
      } : null,
      blocks: summarizeContent(page.content),
      riskPhrases: findRiskPhrases(page.content),
      ...(includeContent ? { content: page.content } : {}),
    });
  }

  const productOutput = [];
  for (const product of productRows) {
    const [seo] = await db.select().from(seoMetadata).where(
      and(eq(seoMetadata.resourceType, "product"), eq(seoMetadata.resourceId, product.id)),
    ).limit(1);
    productOutput.push({
      slug: product.slug,
      title: product.title,
      shortTitle: product.shortTitle,
      workflowState: product.workflowState,
      description: product.description,
      seo: seo ? {
        title: seo.title,
        titleLength: seo.title?.length || 0,
        description: seo.description,
        descriptionLength: seo.description?.length || 0,
        canonical: seo.canonical,
        ogImage: seo.ogImage,
      } : null,
      blocks: summarizeContent(product.content),
      riskPhrases: findRiskPhrases([product.description, product.content]),
      ...(includeContent ? { content: product.content } : {}),
    });
  }

  console.log(JSON.stringify({ pages: pageOutput, products: productOutput }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
