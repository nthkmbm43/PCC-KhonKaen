import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');
      const isApiRoute = nextUrl.pathname.startsWith('/api/') && !nextUrl.pathname.startsWith('/api/auth');

      // If user is trying to access login page
      if (nextUrl.pathname === '/admin/login') {
        if (isLoggedIn) {
          return Response.redirect(new URL('/admin', nextUrl));
        }
        return true;
      }

      // Protect /admin and /api routes (except /api/auth)
      if (isAdminRoute || isApiRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      return true; // Allow public routes
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
