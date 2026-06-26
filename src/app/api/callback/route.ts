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

    // ถ้าสำเร็จ จะแสดงปุ่มให้กดด้วยมือ เพื่อทะลวงระบบบล็อกอัตโนมัติของเบราว์เซอร์
    const successHtml = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <title>Login Success</title>
        <style>
          body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f9fafb; margin: 0; }
          button { background-color: #24292e; color: white; border: none; padding: 15px 30px; font-size: 18px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          button:hover { background-color: #0366d6; }
        </style>
      </head>
      <body>
        <h2 style="color: #28a745;">✅ ดึงข้อมูลจาก GitHub สำเร็จแล้ว!</h2>
        <p style="color: #6c757d; margin-bottom: 25px;">(ระบบหยุดการปิดหน้าต่างอัตโนมัติ เพื่อป้องกันเบราว์เซอร์บล็อกการทำงาน)</p>
        <button id="loginBtn">คลิกปุ่มนี้เพื่อเข้าสู่ระบบ CMS</button>
        
        <script>
          document.getElementById('loginBtn').addEventListener('click', function() {
            const message = 'authorization:github:success:{"token":"${accessToken}","provider":"github"}';
            
            if (window.opener) {
              window.opener.postMessage(message, '*');
              window.close();
            } else {
              alert('❌ เกิดข้อผิดพลาด: ไม่สามารถสื่อสารกับหน้าต่างหลักได้ (window.opener ถูกบล็อก)\\nกรุณาลองเข้าใช้งานผ่านหน้าต่างปกติ (ไม่ใช่โหมดไม่ระบุตัวตน) หรือเช็คการตั้งค่าเบราว์เซอร์');
            }
          });
        </script>
      </body>
      </html>
    `;

    return new NextResponse(successHtml, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });

  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
