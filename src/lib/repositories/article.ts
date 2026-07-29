import { db } from "@/db";
import { articles as articleRecords } from "@/db/schema";
import { articles as starterArticles, type KnowledgeArticle } from "@/data/articles";
import { desc } from "drizzle-orm";
import { articleDocumentSchema } from "@/lib/validation/article";

export type EditableArticle = KnowledgeArticle & {
  databaseId?: string;
  status: "draft" | "published";
  source: "starter" | "database";
};

function parseRecord(record: typeof articleRecords.$inferSelect): EditableArticle | null {
  const parsed = articleDocumentSchema.safeParse(record.data);
  if (!parsed.success) {
    console.error(`Invalid article document stored for ${record.slug}`, parsed.error.flatten());
    return null;
  }

  return {
    ...parsed.data,
    databaseId: record.id,
    status: record.workflowState === "published" ? "published" : "draft",
    source: "database",
  };
}

async function getDatabaseArticles() {
  try {
    return await db.select().from(articleRecords).orderBy(desc(articleRecords.updatedAt));
  } catch (error) {
    // The starter content keeps the public site available during a rolling
    // deploy before migration 0007 has reached the database.
    console.error("Unable to read article overrides; using starter content", error);
    return [];
  }
}

export async function getAdminArticles(): Promise<EditableArticle[]> {
  const records = await getDatabaseArticles();
  const overrides = new Map(records.map((record) => [record.slug, parseRecord(record)]));
  const starter = starterArticles
    .filter((article) => !overrides.has(article.slug))
    .map((article) => ({ ...article, status: "published" as const, source: "starter" as const }));
  const database = records.map(parseRecord).filter((article): article is EditableArticle => Boolean(article));

  return [...database, ...starter].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getPublishedArticles(): Promise<KnowledgeArticle[]> {
  const records = await getDatabaseArticles();
  const overriddenSlugs = new Set(records.map((record) => record.slug));
  const starter = starterArticles.filter((article) => !overriddenSlugs.has(article.slug));
  const database = records
    .filter((record) => record.workflowState === "published")
    .map(parseRecord)
    .filter((article): article is EditableArticle => Boolean(article));

  return [...database, ...starter].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPublishedArticle(slug: string) {
  const articles = await getPublishedArticles();
  return articles.find((article) => article.slug === slug);
}

export async function getEditableArticle(slug: string) {
  const articles = await getAdminArticles();
  return articles.find((article) => article.slug === slug);
}

export async function getRelatedPublishedArticles(article: KnowledgeArticle, limit = 3) {
  const articles = await getPublishedArticles();
  return articles
    .filter((candidate) => candidate.slug !== article.slug)
    .sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category))
    .slice(0, limit);
}
