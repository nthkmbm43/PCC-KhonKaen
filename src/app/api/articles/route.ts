import { auth } from "@/auth";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { requireApiPermission } from "@/lib/auth/api";
import { articlePayloadSchema } from "@/lib/validation/article";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { response } = await requireApiPermission(new URL(request.url).pathname);
  if (response) return response;

  const parsed = articlePayloadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "ข้อมูลบทความไม่ครบหรือรูปแบบไม่ถูกต้อง", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const { article, status } = parsed.data;
    const [created] = await db.insert(articles).values({
      slug: article.slug,
      title: article.title,
      category: article.category,
      workflowState: status,
      data: article,
    }).returning();

    revalidatePath("/articles");
    revalidatePath(`/articles/${article.slug}`);
    revalidatePath("/sitemap.xml");
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating article", error);
    const code = (error as { code?: string })?.code;
    return NextResponse.json(
      { error: code === "23505" ? "มีบทความที่ใช้ URL Slug นี้แล้ว" : "ไม่สามารถสร้างบทความได้ กรุณาตรวจสอบว่าได้รัน migration 0007 แล้ว" },
      { status: code === "23505" ? 409 : 500 },
    );
  }
}
