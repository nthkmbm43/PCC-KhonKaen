import { db } from "@/db";
import { pages, seoMetadata } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { logAudit } from "@/lib/audit";
import { requireApiPermission } from "@/lib/auth/api";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { response } = await requireApiPermission(new URL(req.url).pathname);
  if (response) return response;

  try {
    const data = await req.json();
    
    const result = await db.transaction(async (tx) => {
      const inserted = await tx.insert(pages).values(data).returning();
      
      // Dual-write SEO Metadata
      if (data.seoTitle || data.seoDescription || data.seoKeywords || data.ogImage) {
        await tx.insert(seoMetadata).values({
          resourceType: 'page',
          resourceId: inserted[0].id,
          title: data.seoTitle,
          description: data.seoDescription,
          keywords: data.seoKeywords,
          ogImage: data.ogImage,
        });
      }

      await logAudit({
        tx,
        session,
        action: 'CREATE',
        resource: 'page',
        resourceId: inserted[0].id,
        afterState: inserted[0],
      });
      
      return inserted;
    });

    revalidateTag('pages', { expire: 0 });
    revalidatePath(data.slug === 'home' ? '/' : `/${data.slug}`);
    revalidatePath('/sitemap.xml');
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
