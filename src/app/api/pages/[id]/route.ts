import { db } from "@/db";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const result = await db
      .update(pages)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(pages.id, id))
      .returning();
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(pages).where(eq(pages.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
