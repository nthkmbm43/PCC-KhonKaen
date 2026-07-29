import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { getEditableArticle } from "@/lib/repositories/article";
import { requireAdminPagePermission } from "@/lib/auth/page";

export const dynamic = "force-dynamic";

export default async function ArticleEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdminPagePermission("/admin/articles");
  const { slug } = await params;
  if (slug === "new") return <ArticleForm />;

  const article = await getEditableArticle(slug);
  if (!article) notFound();
  return <ArticleForm initialData={article} />;
}
