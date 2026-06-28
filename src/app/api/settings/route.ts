import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const settingsArray = await db.select().from(siteSettings).limit(1);
    let settings = settingsArray[0];

    // Failsafe: if no settings exist, create a default row
    if (!settings) {
      const newSettings = await db.insert(siteSettings).values({
        logoUrl: "",
        navbarLinks: [],
        footerData: {},
      }).returning();
      settings = newSettings[0];
    }

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
      
      revalidatePath('/', 'layout');
      
      return NextResponse.json(updatedSettings[0]);
    }
  } catch (error) {
    console.error("Error updating site settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
