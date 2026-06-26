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

    const html = `<!DOCTYPE html>
<html>
  <head><title>Login Success</title></head>
  <body>
    <script>
      const message = 'authorization:github:success:{"token":"${accessToken}","provider":"github"}';
      if (window.opener) {
        window.opener.postMessage(message, window.location.origin);
      }
      window.close();
    </script>
  </body>
</html>`;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

  } catch (error) {
    return new NextResponse('Authentication error', { status: 500 });
  }
}
