export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new NextResponse('Error: ไม่ได้รับ Code', { status: 400 });
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID || "Ov23liLlTNxep4Q3VdI9",
        client_secret: process.env.GITHUB_CLIENT_SECRET || "6adc13956a9c5c183dab91377110c734f40cccb3",
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return new NextResponse(`Error: ${JSON.stringify(tokenData)}`, { status: 400 });
    }

    // โค้ดชุดนี้คือการทำ Handshake ให้ตรงสเปกของ Decap CMS v3 เป๊ะๆ (พร้อมแก้บั๊กของ AI เล็กน้อย)
    const html = `
      <!DOCTYPE html>
      <html>
      <head><title>Authenticating...</title></head>
      <body>
        <p>กำลังเชื่อมต่อระบบ กรุณารอสักครู่...</p>
        <script>
          const provider = 'github';
          const message = 'authorization:' + provider + ':success:{"token":"${accessToken}","provider":"' + provider + '"}';
          
          // ดักฟังข้อความจากหน้าต่างหลัก (Admin)
          window.addEventListener("message", (event) => {
            // ถ้าระบบหลักทักกลับมา ให้ส่ง Token กลับไปที่จุดกำเนิดนั้นทันที
            window.opener.postMessage(message, event.origin);
            // ส่งเสร็จแล้ว ปิดหน้าต่างตัวเองทันที
            window.close();
          }, false);

          // สิ่งที่ AI ของคุณตกหล่นไป: Popup ต้องเป็นฝ่ายเริ่มทักหน้าหลักไปก่อนว่า "authorizing:github"
          // ไม่งั้นหน้าหลักจะไม่มีวันตอบกลับมา และมันจะค้างครับ
          if (window.opener) {
            window.opener.postMessage("authorizing:" + provider, "*");
          }
        </script>
      </body>
      </html>
    `;

    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });

  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
