export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID || "Ov23liLlTNxep4Q3VdI9";
  
  if (!clientId) {
    return new NextResponse('Error: ไม่พบ GITHUB_CLIENT_ID ใน Environment Variables', { status: 500 });
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user`;
  return NextResponse.redirect(githubAuthUrl);
}
