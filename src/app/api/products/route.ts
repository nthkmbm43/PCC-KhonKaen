import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, seoMetadata } from "@/db/schema";
import { auth } from "@/auth";
import { logAudit } from "@/lib/audit";
import crypto from "crypto";
import { requireApiPermission } from "@/lib/auth/api";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET(req: Request) {
  const { response } = await requireApiPermission(new URL(req.url).pathname);
  if (response) return response;

  try {
    const allProducts = await db.select().from(products).orderBy(products.createdAt);
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { response } = await requireApiPermission(new URL(req.url).pathname);
  if (response) return response;

  try {
    const data = await req.json();
    
    if (!data.title || !data.slug) {
      return NextResponse.json({ error: "Title and Slug are required" }, { status: 400 });
    }

    let generatedRawToken: string | null = null;

    const newProduct = await db.transaction(async (tx) => {
      generatedRawToken = crypto.randomBytes(16).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(generatedRawToken).digest('hex');

      const inserted = await tx.insert(products).values({
        ...data,
        isFeatured: data.isFeatured ? 'true' : 'false',
        previewTokenHash: tokenHash,
        previewExpiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
      }).returning();

      // Dual-write SEO Metadata
      if (data.seoTitle || data.seoDescription || data.seoKeywords || data.ogImage) {
        await tx.insert(seoMetadata).values({
          resourceType: 'product',
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
        resource: 'product',
        resourceId: inserted[0].id,
        afterState: inserted[0],
      });

      return inserted;
    });

    revalidateTag('products', { expire: 0 });
    revalidatePath('/', 'layout');
    revalidatePath('/sitemap.xml');

    return NextResponse.json({ ...newProduct[0], rawPreviewToken: generatedRawToken }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
