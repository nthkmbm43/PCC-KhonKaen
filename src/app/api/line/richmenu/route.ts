import { db } from "@/db";
import { lineRichMenus } from "@/db/schema";
import { NextResponse } from "next/server";
import sharp from "sharp";

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
        let uri = item.action.trim();
        if (uri.startsWith("/")) {
          const host = req.headers.get("host") || "pcc-khon-kaen.vercel.app";
          const protocol = host.includes("localhost") ? "http" : "https";
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
          uri = `${baseUrl}${uri}`;
        } else if (/^[0-9\- \+]+$/.test(uri) && uri.length >= 9) {
          // Auto-format phone numbers if user just typed the numbers
          uri = `tel:${uri.replace(/[\- ]/g, "")}`;
        } else if (!uri.startsWith("http") && !uri.startsWith("tel:") && !uri.startsWith("line:")) {
          // If it's missing https:// but looks like a link
          uri = `https://${uri}`;
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
      const detail = err.details ? err.details[0]?.message : err.message;
      return NextResponse.json({ error: `รูปแบบลิงก์ไม่ถูกต้อง: ${detail || 'กรุณาตรวจสอบลิงก์หรือเบอร์โทร'}` }, { status: 400 });
    }

    const { richMenuId } = await createRes.json();

    // 3. Download image from our Blob, compress it to < 1MB, and upload to LINE
    const contentType = "image/jpeg";
    
    const imageRes = await fetch(data.imageUrl);
    const arrayBuffer = await imageRes.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Compress with sharp to ensure it's under 1MB
    const compressedBuffer = await sharp(imageBuffer)
      .resize({ width: 2500, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Create a pure Web Uint8Array to avoid "SharedArrayBuffer is not allowed" in Next.js fetch
    const webArray = new Uint8Array(compressedBuffer.length);
    webArray.set(compressedBuffer);

    const uploadRes = await fetch(`https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": contentType
      },
      body: webArray
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

  } catch (error: unknown) {
    console.error("Error saving LINE rich menu settings:", error);
    const errObj = error as Error;
    return NextResponse.json({ error: `Internal Server Error: ${errObj?.message || String(error)}` }, { status: 500 });
  }
}
