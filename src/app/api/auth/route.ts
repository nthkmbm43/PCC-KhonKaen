import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = "Ov23liLlTNxep4Q3VdI9";
  // Redirect to GitHub's OAuth authorization page (requesting repo and user scopes)
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user`;
  return NextResponse.redirect(redirectUrl);
}
