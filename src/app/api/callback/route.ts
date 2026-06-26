import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new NextResponse('No code provided', { status: 400 });
  }

  try {
    // 1. เอา Code ไปแลกเป็น Access Token จาก GitHub
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
      return new NextResponse('Failed to get access token', { status: 400 });
    }

    // 2. สร้าง HTML ที่มี Script ส่ง Token กลับไปให้ Decap CMS อย่างถูกต้อง
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head><title>Login Success</title></head>
      <body>
        <p>กำลังเข้าสู่ระบบ กรุณารอสักครู่...</p>
        <script>
          (function() {
            // นี่คือ Format ที่ Decap CMS ต้องการเป๊ะๆ
            const message = 'authorization:github:success:{"token":"${accessToken}","provider":"github"}';
            
            if (window.opener) {
              // ส่งข้อความกลับไปยังหน้าต่างหลัก (Admin)
              window.opener.postMessage(message, new URL(window.location.origin).origin);
              // ปิดหน้าต่าง Popup
              window.close();
            } else {
              document.body.innerHTML = "เกิดข้อผิดพลาด: ไม่สามารถสื่อสารกับหน้าต่างหลักได้";
            }
          })();
        </script>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

  } catch (error) {
    return new NextResponse('Authentication error', { status: 500 });
  }
}
