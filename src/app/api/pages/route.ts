import { db } from "@/db";
import { pages } from "@/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const result = await db.insert(pages).values(data).returning();
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
