import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await req.json();
    
    const updatedProduct = await db.transaction(async (tx) => {
      const beforeState = await tx.select().from(products).where(eq(products.id, id)).limit(1);
      if (beforeState.length === 0) {
        return null;
      }

      const updated = await tx
        .update(products)
        .set({
          ...data,
          isFeatured: data.isFeatured ? 'true' : 'false',
          updatedAt: new Date(),
        })
        .where(eq(products.id, id))
        .returning();

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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    const deletedProduct = await db.transaction(async (tx) => {
      const beforeState = await tx.select().from(products).where(eq(products.id, id)).limit(1);
      if (beforeState.length === 0) {
        return null;
      }

      const deleted = await tx.delete(products).where(eq(products.id, id)).returning();

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
