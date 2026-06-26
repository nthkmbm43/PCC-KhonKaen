import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = "Ov23liLlTNxep4Q3VdI9";
  // Redirect to GitHub's OAuth authorization page
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`;
  return NextResponse.redirect(redirectUrl);
}
