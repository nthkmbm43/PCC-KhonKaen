export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new NextResponse('Error: ไม่ได้รับ Code จาก GitHub', { status: 400 });
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

    // ถ้าไม่ได้ Token ให้โชว์ Error ออกมาตรงๆ ห้ามปิดหน้าต่าง!
    if (!accessToken) {
      const errorHtml = `
        <div style="color: red; font-family: sans-serif; padding: 20px;">
          <h2>เกิดข้อผิดพลาดในการขอ Token!</h2>
          <p>กรุณาเช็ค GITHUB_CLIENT_SECRET ใน Vercel Environment Variables ว่าถูกต้องหรือไม่</p>
          <pre>${JSON.stringify(tokenData, null, 2)}</pre>
        </div>
      `;
      return new NextResponse(errorHtml, { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    // ถ้าสำเร็จ ส่งข้อความด้วย '*' เพื่อแก้ปัญหา Origin Mismatch
    const successHtml = `
      <!DOCTYPE html>
      <html>
      <head><title>Login Success</title></head>
      <body>
        <script>
          const message = 'authorization:github:success:{"token":"${accessToken}","provider":"github"}';
          if (window.opener) {
            window.opener.postMessage(message, '*');
          }
          window.close();
        </script>
      </body>
      </html>
    `;

    return new NextResponse(successHtml, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
