export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

const errorPage = (title: string, detail: string) => `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8"/>
  <title>เกิดข้อผิดพลาด — PCC CMS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Noto+Sans+Thai:wght@400;600&display=swap" rel="stylesheet"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter','Noto Sans Thai',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#FEF2F2;padding:24px}
    .card{background:#fff;border:1px solid #FCA5A5;border-radius:16px;padding:40px;max-width:480px;width:100%;box-shadow:0 4px 24px rgba(239,68,68,.1);text-align:center}
    .icon{font-size:48px;margin-bottom:16px}
    h1{font-size:20px;font-weight:700;color:#991B1B;margin-bottom:8px}
    p{font-size:14px;color:#6B7280;line-height:1.6}
    pre{margin-top:16px;padding:12px 16px;background:#FEE2E2;border-radius:8px;font-size:12px;color:#B91C1C;text-align:left;overflow:auto;white-space:pre-wrap;word-break:break-all}
    .btn{display:inline-block;margin-top:24px;padding:10px 24px;background:#EF4444;color:#fff;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;border:none;text-decoration:none}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">❌</div>
    <h1>${title}</h1>
    <p>กรุณาตรวจสอบ GITHUB_CLIENT_SECRET ใน Vercel Environment Variables</p>
    <pre>${detail}</pre>
    <button class="btn" onclick="window.close()">ปิดหน้าต่างนี้</button>
  </div>
</body>
</html>`;

const successPage = (accessToken: string) => `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8"/>
  <title>เข้าสู่ระบบสำเร็จ — PCC CMS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Noto+Sans+Thai:wght@400;600;700&display=swap" rel="stylesheet"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter','Noto Sans Thai',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0A1628 0%,#0C2461 100%);padding:24px;overflow:hidden}
    .card{background:rgba(255,255,255,.07);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:44px 40px;max-width:400px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.4);text-align:center;animation:slideUp .4s cubic-bezier(.4,0,.2,1)}
    @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .logo{width:60px;height:60px;border-radius:16px;background:linear-gradient(135deg,#0057FF,#60A5FA);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:#fff;margin:0 auto 20px;box-shadow:0 8px 24px rgba(0,87,255,.5)}
    h1{font-size:20px;font-weight:700;color:#fff;margin-bottom:8px}
    .subtitle{font-size:13px;color:rgba(255,255,255,.5);margin-bottom:28px}
    .status{display:flex;align-items:center;justify-content:center;gap:10px;padding:14px 20px;border-radius:12px;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.25);margin-bottom:24px}
    .status-dot{width:8px;height:8px;border-radius:50%;background:#22C55E;animation:pulse 1.2s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(1.3)}}
    .status-text{font-size:14px;font-weight:600;color:#86EFAC}
    .progress-bar{height:3px;border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden;margin-bottom:20px}
    .progress-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,#0057FF,#60A5FA);animation:progress 1.5s ease-in-out forwards}
    @keyframes progress{from{width:0}to{width:100%}}
    .note{font-size:12px;color:rgba(255,255,255,.3);line-height:1.5}
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">P</div>
    <h1>PCC Post-Tension</h1>
    <p class="subtitle">Content Management System</p>
    <div class="status">
      <span class="status-dot"></span>
      <span class="status-text">ยืนยันตัวตนสำเร็จ กำลังเข้าสู่ระบบ...</span>
    </div>
    <div class="progress-bar"><div class="progress-fill"></div></div>
    <p class="note">หน้าต่างนี้จะปิดโดยอัตโนมัติ<br/>และพาคุณเข้าสู่หน้าแอดมินทันที</p>
  </div>
  <script>
    const provider = 'github';
    const token    = '${accessToken}';
    const message  = 'authorization:' + provider + ':success:{"token":"' + token + '","provider":"' + provider + '"}';

    // Handshake: รอหน้าหลักทักมาก่อน จากนั้นส่ง token กลับ
    window.addEventListener('message', function(event) {
      window.opener.postMessage(message, event.origin);
      setTimeout(() => window.close(), 300);
    }, false);

    // Popup เป็นฝ่ายเริ่มทักหน้าหลักก่อน
    if (window.opener) {
      window.opener.postMessage('authorizing:' + provider, '*');
    }
  </script>
</body>
</html>`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new NextResponse(
      errorPage('ไม่ได้รับ Code จาก GitHub', 'code parameter is missing from the callback URL'),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
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
      return new NextResponse(
        errorPage('ไม่สามารถดึง Access Token ได้', JSON.stringify(tokenData, null, 2)),
        { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    return new NextResponse(successPage(accessToken), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

  } catch (error: any) {
    return new NextResponse(
      errorPage('เกิดข้อผิดพลาดในระบบ', error.message),
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}
