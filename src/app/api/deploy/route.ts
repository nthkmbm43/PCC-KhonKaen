import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { NextResponse } from "next/server";
import { requireApiPermission } from "@/lib/auth/api";

export async function POST(req: Request) {
  const { response } = await requireApiPermission(new URL(req.url).pathname);
  if (response) return response;

  try {
    const settingsArray = await db.select().from(siteSettings).limit(1);
    const settings = settingsArray[0];

    if (!settings || !settings.vercelDeployHookUrl) {
      return NextResponse.json({ error: "Vercel Deploy Hook URL is not configured." }, { status: 400 });
    }

    const res = await fetch(settings.vercelDeployHookUrl, {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error(`Deploy hook failed with status ${res.status}`);
    }

    return NextResponse.json({ success: true, message: "Deployment triggered successfully" });
  } catch (error) {
    console.error("Error triggering deployment:", error);
    return NextResponse.json({ error: "Failed to trigger deployment." }, { status: 500 });
  }
}
