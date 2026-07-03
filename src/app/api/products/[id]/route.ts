import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, seoMetadata, revisions } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const productData = await db.select().from(products).where(eq(products.id, id)).limit(1);
    
    if (productData.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(productData[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const data = await req.json();
    
    const updatedProduct = await db.transaction(async (tx) => {
      const beforeState = await tx.select().from(products).where(eq(products.id, id)).limit(1);
      if (beforeState.length === 0) {
        return null;
      }

      // Strip SEO-only fields that don't belong in the products table
      const { status, ...productData } = data;
      delete productData.seoTitle;
      delete productData.seoDescription;
      delete productData.seoKeywords;
      delete productData.ogImage;

      // Map form's 'status' field to DB's 'workflowState'
      if (status) {
        productData.workflowState = status;
      }

      // Invalidate preview token if publishing
      if (productData.workflowState === 'published') {
        productData.previewTokenHash = null;
        productData.previewExpiresAt = null;
      }

      const updated = await tx
        .update(products)
        .set({
          ...productData,
          isFeatured: data.isFeatured ? 'true' : 'false',
          updatedAt: new Date(),
        })
        .where(eq(products.id, id))
        .returning();

      // Dual-write SEO Metadata
      if ('seoTitle' in data || 'seoDescription' in data || 'seoKeywords' in data || 'ogImage' in data) {
        const existingSeo = await tx.select().from(seoMetadata).where(
          and(eq(seoMetadata.resourceType, 'product'), eq(seoMetadata.resourceId, id))
        ).limit(1);

        if (existingSeo.length > 0) {
          await tx.update(seoMetadata).set({
            title: data.seoTitle !== undefined ? data.seoTitle : existingSeo[0].title,
            description: data.seoDescription !== undefined ? data.seoDescription : existingSeo[0].description,
            keywords: data.seoKeywords !== undefined ? data.seoKeywords : existingSeo[0].keywords,
            ogImage: data.ogImage !== undefined ? data.ogImage : existingSeo[0].ogImage,
            updatedAt: new Date(),
          }).where(eq(seoMetadata.id, existingSeo[0].id));
        } else {
          await tx.insert(seoMetadata).values({
            resourceType: 'product',
            resourceId: id,
            title: data.seoTitle,
            description: data.seoDescription,
            keywords: data.seoKeywords,
            ogImage: data.ogImage,
          });
        }
      }

      // Create Revision Snapshot (Strip metadata)
      const latestRevision = await tx.select({ version: revisions.version })
        .from(revisions)
        .where(and(eq(revisions.resourceType, 'product'), eq(revisions.resourceId, id)))
        .orderBy(desc(revisions.version))
        .limit(1);
      
      const nextVersion = latestRevision.length > 0 ? latestRevision[0].version + 1 : 1;

      const businessData = { ...updated[0] } as Record<string, unknown>;
      delete businessData.id;
      delete businessData.createdAt;
      delete businessData.updatedAt;
      delete businessData.previewTokenHash;
      delete businessData.previewExpiresAt;

      await tx.insert(revisions).values({
        resourceType: 'product',
        resourceId: id,
        version: nextVersion,
        data: businessData,
        createdBy: session.user.id || 'system',
      });

      await logAudit({
        tx,
        session,
        action: 'UPDATE',
        resource: 'product',
        resourceId: id,
        beforeState: beforeState[0],
        afterState: updated[0],
      });

      return updated;
    });

    if (!updatedProduct || updatedProduct.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    revalidatePath('/', 'layout');

    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    
    const deletedProduct = await db.transaction(async (tx) => {
      const beforeState = await tx.select().from(products).where(eq(products.id, id)).limit(1);
      if (beforeState.length === 0) {
        return null;
      }

      const deleted = await tx.delete(products).where(eq(products.id, id)).returning();

      // Delete associated SEO metadata
      await tx.delete(seoMetadata).where(
        and(eq(seoMetadata.resourceType, 'product'), eq(seoMetadata.resourceId, id))
      );

      await logAudit({
        tx,
        session,
        action: 'DELETE',
        resource: 'product',
        resourceId: id,
        beforeState: beforeState[0],
      });

      return deleted;
    });

    if (!deletedProduct || deletedProduct.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
