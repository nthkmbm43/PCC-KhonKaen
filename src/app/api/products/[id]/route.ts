import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

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
    
    const updatedProduct = await db
      .update(products)
      .set({
        ...data,
        isFeatured: data.isFeatured ? 'true' : 'false',
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    if (updatedProduct.length === 0) {
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
    const deletedProduct = await db.delete(products).where(eq(products.id, id)).returning();

    if (deletedProduct.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
