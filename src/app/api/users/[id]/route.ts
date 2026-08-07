import { NextResponse } from "next/server";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireApiPermission } from "@/lib/auth/api";
import { revalidateTag } from "next/cache";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireApiPermission(new URL(req.url).pathname);
  if (response) return response;

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    await db.delete(admins).where(eq(admins.id, id));
    revalidateTag("admin-users", { expire: 0 });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
