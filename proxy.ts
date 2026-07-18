import NextAuth from 'next-auth';
import { authConfig } from './src/auth.config';
import { NextResponse, NextRequest } from 'next/server';

const authMiddleware = NextAuth(authConfig).auth;

export default async function proxy(req: NextRequest) {
  // Reuse proxy Request-ID if present, otherwise generate a new one
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();
  
  // Create a new headers object to pass to downstream requests
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-request-id', requestId);

  // Call the NextAuth middleware with the modified request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await (authMiddleware as any)(
    new NextRequest(req.url, {
      ...req,
      headers: requestHeaders,
    })
  );

  // If NextAuth returns a response (e.g., redirect), use it, otherwise call next()
  const response = res || NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });

  // Expose the Request ID to the client
  response.headers.set('x-request-id', requestId);
  
  return response;
}
 
export const config = {
  // Public pages do not need session parsing. Keep Proxy on protected/admin APIs only.
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
};
