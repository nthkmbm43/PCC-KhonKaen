import { db } from "@/db";
import { pages, seoMetadata, revisions } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { logAudit } from "@/lib/audit";
import { revalidateTag, revalidatePath } from "next/cache";
import { requireApiPermission } from "@/lib/auth/api";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { response } = await requireApiPermission(new URL(req.url).pathname);
  if (response) return response;

  try {
    const { id } = await params;
    const data = await req.json();
    
    const result = await db.transaction(async (tx) => {
      const beforeState = await tx.select().from(pages).where(eq(pages.id, id)).limit(1);
      if (beforeState.length === 0) {
        return null;
      }

      // Strip SEO-only fields that don't belong in the pages table
      const { status, ...pageData } = data;
      delete pageData.seoTitle;
      delete pageData.seoDescription;
      delete pageData.seoKeywords;
      delete pageData.ogImage;

      // Map form's 'status' field to DB's 'workflowState'
      if (status) {
        pageData.workflowState = status;
      }

      // Invalidate preview token if publishing
      if (pageData.workflowState === 'published') {
        pageData.previewTokenHash = null;
        pageData.previewExpiresAt = null;
      }

      const updated = await tx
        .update(pages)
        .set({ ...pageData, updatedAt: new Date() })
        .where(eq(pages.id, id))
        .returning();

      // Dual-write SEO Metadata
      if ('seoTitle' in data || 'seoDescription' in data || 'seoKeywords' in data || 'ogImage' in data) {
        const existingSeo = await tx.select().from(seoMetadata).where(
          and(eq(seoMetadata.resourceType, 'page'), eq(seoMetadata.resourceId, id))
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
            resourceType: 'page',
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
        .where(and(eq(revisions.resourceType, 'page'), eq(revisions.resourceId, id)))
        .orderBy(desc(revisions.version))
        .limit(1);
      
      const nextVersion = latestRevision.length > 0 ? latestRevision[0].version + 1 : 1;

      const businessData: Record<string, unknown> = { ...updated[0] } as Record<string, unknown>;
      delete businessData.id;
      delete businessData.createdAt;
      delete businessData.updatedAt;
      delete businessData.previewTokenHash;
      delete businessData.previewExpiresAt;

      await tx.insert(revisions).values({
        resourceType: 'page',
        resourceId: id,
        version: nextVersion,
        data: businessData,
        createdBy: session.user.id || 'system',
      });

      await logAudit({
        tx,
        session,
        action: 'UPDATE',
        resource: 'page',
        resourceId: id,
        beforeState: beforeState[0],
        afterState: updated[0],
      });

      return updated;
    });

    if (!result) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Revalidate cache to ensure frontend gets fresh data immediately
    const updatedPage = result[0];
    if (updatedPage.slug) {
      revalidatePath(updatedPage.slug === 'home' ? '/' : `/${updatedPage.slug}`);
      revalidatePath('/sitemap.xml');
      revalidateTag('pages', { expire: 0 });
    }

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { response } = await requireApiPermission(new URL(req.url).pathname);
  if (response) return response;

  try {
    const { id } = await params;
    
    const result = await db.transaction(async (tx) => {
      const beforeState = await tx.select().from(pages).where(eq(pages.id, id)).limit(1);
      if (beforeState.length === 0) {
        return false;
      }

      await tx.delete(pages).where(eq(pages.id, id));
      
      // Delete associated SEO metadata
      await tx.delete(seoMetadata).where(
        and(eq(seoMetadata.resourceType, 'page'), eq(seoMetadata.resourceId, id))
      );

      await logAudit({
        tx,
        session,
        action: 'DELETE',
        resource: 'page',
        resourceId: id,
        beforeState: beforeState[0],
      });

      return true;
    });

    if (!result) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    revalidateTag('pages', { expire: 0 });
    revalidatePath('/sitemap.xml');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
