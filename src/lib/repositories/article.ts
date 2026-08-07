import { db } from "@/db";
import { articles as articleRecords } from "@/db/schema";
import { articles as starterArticles, type KnowledgeArticle } from "@/data/articles";
import { desc, eq } from "drizzle-orm";
import { articleDocumentSchema } from "@/lib/validation/article";
import { cache } from "react";

export type EditableArticle = KnowledgeArticle & {
  databaseId?: string;
  status: "draft" | "published";
  source: "starter" | "database";
};

export type AdminArticleListItem = {
  slug: string;
  title: string;
  category: string;
  updatedAt: string;
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

export async function getAdminArticles(): Promise<AdminArticleListItem[]> {
  const records = await db.select({
    slug: articleRecords.slug,
    title: articleRecords.title,
    category: articleRecords.category,
    workflowState: articleRecords.workflowState,
    updatedAt: articleRecords.updatedAt,
  }).from(articleRecords).orderBy(desc(articleRecords.updatedAt));
  const overriddenSlugs = new Set(records.map((record) => record.slug));
  const starter = starterArticles
    .filter((article) => !overriddenSlugs.has(article.slug))
    .map((article) => ({
      slug: article.slug,
      title: article.title,
      category: article.category,
      updatedAt: article.updatedAt,
      status: "published" as const,
      source: "starter" as const,
    }));
  const database = records.map((record) => ({
    slug: record.slug,
    title: record.title,
    category: record.category,
    updatedAt: record.updatedAt.toISOString().slice(0, 10),
    status: record.workflowState === "published" ? "published" as const : "draft" as const,
    source: "database" as const,
  }));

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

export const getPublishedArticle = cache(async (slug: string) => {
  try {
    const [record] = await db.select().from(articleRecords).where(eq(articleRecords.slug, slug)).limit(1);
    if (record) {
      if (record.workflowState !== "published") return undefined;
      return parseRecord(record) || undefined;
    }
  } catch (error) {
    console.error(`Unable to read article ${slug}; using starter content`, error);
  }
  return starterArticles.find((article) => article.slug === slug);
});

export const getEditableArticle = cache(async (slug: string) => {
  try {
    const [record] = await db.select().from(articleRecords).where(eq(articleRecords.slug, slug)).limit(1);
    if (record) return parseRecord(record) || undefined;
  } catch (error) {
    console.error(`Unable to read editable article ${slug}; using starter content`, error);
  }
  const starter = starterArticles.find((article) => article.slug === slug);
  return starter ? { ...starter, status: "published" as const, source: "starter" as const } : undefined;
});

export async function getRelatedPublishedArticles(article: KnowledgeArticle, limit = 3) {
  const articles = await getPublishedArticles();
  return articles
    .filter((candidate) => candidate.slug !== article.slug)
    .sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category))
    .slice(0, limit);
}
