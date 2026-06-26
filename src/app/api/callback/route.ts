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
          <script>
            function receiveMessage(e) {
              window.opener.postMessage(
                'authorization:github:success:{"token":"${accessToken}","provider":"github"}',
                e.origin
              );
            }
            window.addEventListener("message", receiveMessage, false);
            window.opener.postMessage("authorizing:github", "*");
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
