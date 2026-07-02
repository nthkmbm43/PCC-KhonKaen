import { db } from "@/db";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { logAudit } from "@/lib/audit";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await req.json();
    
    const result = await db.transaction(async (tx) => {
      const beforeState = await tx.select().from(pages).where(eq(pages.id, id)).limit(1);
      if (beforeState.length === 0) {
        return null;
      }

      const updated = await tx
        .update(pages)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(pages.id, id))
        .returning();

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

    return NextResponse.json(result[0]);
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

  try {
    const { id } = await params;
    
    const result = await db.transaction(async (tx) => {
      const beforeState = await tx.select().from(pages).where(eq(pages.id, id)).limit(1);
      if (beforeState.length === 0) {
        return false;
      }

      await tx.delete(pages).where(eq(pages.id, id));

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
