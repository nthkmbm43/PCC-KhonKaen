import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new NextResponse('No code provided', { status: 400 });
  }

  const clientId = "Ov23liLlTNxep4Q3VdI9";
  const clientSecret = "6adc13956a9c5c183dab91377110c734f40cccb3";

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await response.json();
    const accessToken = data.access_token;

    if (!accessToken) {
      return new NextResponse('Failed to get access token from GitHub', { status: 400 });
    }

    // Return the postMessage script expected by Decap CMS
    const script = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>OAuth Callback</title>
        </head>
        <body>
          <p>เข้าสู่ระบบสำเร็จ! กำลังพากลับไปยังหน้าแอดมิน...</p>
          <p>ถ้าหน้านี้ไม่ปิดอัตโนมัติ ให้สลับแท็บกลับไปหน้าเว็บหลัก แล้วปิดหน้านี้ได้เลยครับ</p>
          <script>
            if (window.opener) {
              window.opener.postMessage(
                'authorization:github:success:{"token":"${accessToken}","provider":"github"}',
                "https://pcc-khon-kaen.vercel.app"
              );
              setTimeout(() => window.close(), 100);
            } else {
              // If opened in same tab (fallback)
              window.location.href = '/admin';
            }
          </script>
        </body>
      </html>
    `;

    return new NextResponse(script, {
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
