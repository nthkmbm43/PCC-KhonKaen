import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const settingsArray = await db.select().from(siteSettings).limit(1);
    const settings = settingsArray[0] || {};
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    
    // Check if settings exist
    const settingsArray = await db.select().from(siteSettings).limit(1);
    
    if (settingsArray.length === 0) {
      // Create
      const newSettings = await db.insert(siteSettings).values({ ...data }).returning();
      return NextResponse.json(newSettings[0]);
    } else {
      // Update
      const updatedSettings = await db
        .update(siteSettings)
        .set({ ...data, updatedAt: new Date() })
        .returning();
      return NextResponse.json(updatedSettings[0]);
    }
  } catch (error) {
    console.error("Error updating site settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
