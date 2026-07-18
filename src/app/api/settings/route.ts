import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireApiPermission } from "@/lib/auth/api";

export async function GET(req: Request) {
  const { response } = await requireApiPermission(new URL(req.url).pathname);
  if (response) return response;

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
  const { response } = await requireApiPermission(new URL(req.url).pathname);
  if (response) return response;

  try {
    const data = await req.json();
    
    // Check if settings exist
    const settingsArray = await db.select().from(siteSettings).limit(1);
    
    if (settingsArray.length === 0) {
      // Create
      const newSettings = await db.insert(siteSettings).values({ ...data }).returning();
      revalidateTag('site-settings', { expire: 0 });
      revalidateTag('business-status', { expire: 0 });
      return NextResponse.json(newSettings[0]);
    } else {
      // Clean undefined fields for a true partial update
      const updateData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      );

      // Update
      const updatedSettings = await db
        .update(siteSettings)
        .set({ ...updateData, updatedAt: new Date() })
        .returning();
      
      revalidatePath('/', 'layout');
      revalidateTag('site-settings', { expire: 0 });
      revalidateTag('business-status', { expire: 0 });
      
      return NextResponse.json(updatedSettings[0]);
    }
  } catch (error) {
    console.error("Error updating site settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
