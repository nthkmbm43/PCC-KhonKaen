import NextAuth from 'next-auth';
import { authConfig } from './src/auth.config';
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // Protect everything EXCEPT static files, images, favicon, public paths
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
