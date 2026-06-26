import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID || "Ov23liLlTNxep4Q3VdI9";
  
  if (!clientId) {
    return new NextResponse('Missing GITHUB_CLIENT_ID', { status: 500 });
  }

  // ส่งผู้ใช้ไปล็อกอินที่ GitHub
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user`;
  
  return NextResponse.redirect(githubAuthUrl);
}
