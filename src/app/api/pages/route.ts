import { db } from "@/db";
import { pages } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { logAudit } from "@/lib/audit";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    
    const result = await db.transaction(async (tx) => {
      const inserted = await tx.insert(pages).values(data).returning();
      
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
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
