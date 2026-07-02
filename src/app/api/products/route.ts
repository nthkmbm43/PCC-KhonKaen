import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { auth } from "@/auth";
import { logAudit } from "@/lib/audit";

export async function GET() {
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

  try {
    const data = await req.json();
    
    if (!data.title || !data.slug) {
      return NextResponse.json({ error: "Title and Slug are required" }, { status: 400 });
    }

    const newProduct = await db.transaction(async (tx) => {
      const inserted = await tx.insert(products).values({
        ...data,
        isFeatured: data.isFeatured ? 'true' : 'false',
      }).returning();

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

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
