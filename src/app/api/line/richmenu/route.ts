import { db } from "@/db";
import { lineRichMenus } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const menus = await db.select().from(lineRichMenus).limit(1);
    let menu = menus[0];

    if (!menu) {
      const newMenu = await db.insert(lineRichMenus).values({
        imageUrl: "",
      }).returning();
      menu = newMenu[0];
    }

    return NextResponse.json(menu);
  } catch (error) {
    console.error("Error fetching LINE rich menu settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    
    if (!token) {
      return NextResponse.json({ error: "LINE_CHANNEL_ACCESS_TOKEN ไม่ได้ตั้งค่าไว้ในระบบ กรุณาตรวจสอบไฟล์ .env" }, { status: 400 });
    }

    // 1. Prepare bounds for 6 areas (2500x1686 total size)
    // Grid 3x2: width = 2500/3 = 833.33, height = 1686/2 = 843
    const width = 833;
    const height = 843;
    
    const areas = [];
    const mapping = [
      { action: data.actionA, x: 0, y: 0 },
      { action: data.actionB, x: 833, y: 0 },
      { action: data.actionC, x: 1666, y: 0, w: 834 },
      { action: data.actionD, x: 0, y: 843 },
      { action: data.actionE, x: 833, y: 843 },
      { action: data.actionF, x: 1666, y: 843, w: 834 },
    ];

    for (const item of mapping) {
      if (item.action && item.action !== "none") {
        // Ensure absolute URL if it's a relative path from our DB
        let uri = item.action;
        if (uri.startsWith("/")) {
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-website.com";
          uri = `${baseUrl}${uri}`;
        }
        
        areas.push({
          bounds: { x: item.x, y: item.y, width: item.w || width, height: height },
          action: { type: "uri", uri }
        });
      }
    }

    if (areas.length === 0) {
      return NextResponse.json({ error: "ต้องกำหนดลิงก์อย่างน้อย 1 ปุ่ม" }, { status: 400 });
    }

    // 2. Create Rich Menu Object
    const createRes = await fetch("https://api.line.me/v2/bot/richmenu", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        size: { width: 2500, height: 1686 },
        selected: true,
        name: "Main Rich Menu",
        chatBarText: "เมนูหลัก",
        areas: areas.length > 0 ? areas : undefined // LINE API requires areas array, but if empty it might fail. Better to send empty if allowed or at least 1.
      })
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      console.error("LINE Create Rich Menu Error:", err);
      return NextResponse.json({ error: "สร้าง Rich Menu ไม่สำเร็จ ตรวจสอบ API Token" }, { status: 400 });
    }

    const { richMenuId } = await createRes.json();

    // 3. Download image from our Blob and upload to LINE
    let contentType = "image/png";
    if (data.imageUrl.toLowerCase().endsWith('.jpg') || data.imageUrl.toLowerCase().endsWith('.jpeg')) {
      contentType = "image/jpeg";
    }

    const imageRes = await fetch(data.imageUrl);
    const imageBuffer = await imageRes.arrayBuffer();

    const uploadRes = await fetch(`https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": contentType
      },
      body: imageBuffer
    });

    if (!uploadRes.ok) {
      console.error("LINE Upload Image Error", await uploadRes.text());
      return NextResponse.json({ error: "อัปโหลดรูปภาพไปยัง LINE ไม่สำเร็จ รูปภาพต้องไม่เกิน 1MB" }, { status: 400 });
    }

    // 4. Set Default Rich Menu
    const setDefaultRes = await fetch(`https://api.line.me/v2/bot/user/all/richmenu/${richMenuId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!setDefaultRes.ok) {
      console.error("LINE Set Default Error", await setDefaultRes.text());
      return NextResponse.json({ error: "ตั้งค่า Default Menu ไม่สำเร็จ" }, { status: 400 });
    }

    // 5. Save settings to Database
    const existing = await db.select().from(lineRichMenus).limit(1);
    const payload = {
      imageUrl: data.imageUrl,
      actionA: data.actionA,
      actionB: data.actionB,
      actionC: data.actionC,
      actionD: data.actionD,
      actionE: data.actionE,
      actionF: data.actionF,
      richMenuId: richMenuId,
      updatedAt: new Date(),
    };

    if (existing.length === 0) {
      await db.insert(lineRichMenus).values(payload);
    } else {
      await db.update(lineRichMenus).set(payload);
    }

    return NextResponse.json({ success: true, richMenuId });

  } catch (error) {
    console.error("Error saving LINE rich menu settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
