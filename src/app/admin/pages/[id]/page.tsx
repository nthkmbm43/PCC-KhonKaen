import { db } from "@/db";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageForm } from "@/components/admin/PageForm";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pageArray = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
  const page = pageArray[0];

  if (!page) {
    notFound();
  }

  return <PageForm initialData={page} pageId={page.id} />;
}
