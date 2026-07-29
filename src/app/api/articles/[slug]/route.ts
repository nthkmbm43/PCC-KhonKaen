import { auth } from "@/auth";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { requireApiPermission } from "@/lib/auth/api";
import { articlePayloadSchema } from "@/lib/validation/article";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { response } = await requireApiPermission(new URL(request.url).pathname);
  if (response) return response;

  const { slug } = await params;
  const parsed = articlePayloadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "ข้อมูลบทความไม่ครบหรือรูปแบบไม่ถูกต้อง", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (parsed.data.article.slug !== slug) {
    return NextResponse.json({ error: "ไม่สามารถเปลี่ยน URL Slug ของบทความที่มีอยู่แล้ว" }, { status: 400 });
  }

  try {
    const { article, status } = parsed.data;
    const [saved] = await db.insert(articles).values({
      slug,
      title: article.title,
      category: article.category,
      workflowState: status,
      data: article,
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: articles.slug,
      set: {
        title: article.title,
        category: article.category,
        workflowState: status,
        data: article,
        updatedAt: new Date(),
      },
    }).returning();

    revalidatePath("/articles");
    revalidatePath(`/articles/${slug}`);
    revalidatePath("/sitemap.xml");
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Error updating article", error);
    return NextResponse.json(
      { error: "ไม่สามารถบันทึกบทความได้ กรุณาตรวจสอบว่าได้รัน migration 0007 แล้ว" },
      { status: 500 },
    );
  }
}
