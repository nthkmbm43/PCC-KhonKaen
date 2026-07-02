import type { NextAuthConfig } from 'next-auth';
import { canAccessRoute } from '@/lib/auth/rbac';
 
export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      // If user is trying to access login page
      if (nextUrl.pathname === '/admin/login') {
        if (isLoggedIn) {
          return Response.redirect(new URL('/admin', nextUrl));
        }
        return true;
      }

      // If user is not logged in, but tries to access protected routes
      if (!isLoggedIn) {
        const isAdminRoute = nextUrl.pathname.startsWith('/admin');
        const isApiRoute = nextUrl.pathname.startsWith('/api/') && !nextUrl.pathname.startsWith('/api/auth');
        if (isAdminRoute || isApiRoute) {
          return false; // Redirect unauthenticated users to login page
        }
      }

      // Check route permission using RBAC Matrix
      const role = auth?.user?.role as string | undefined;
      const isAllowed = canAccessRoute(role, nextUrl.pathname);

      if (!isAllowed) {
        // If logged in but forbidden, could redirect to a 403 page or dashboard.
        // For middleware, returning false redirects to login. 
        // We'll redirect to dashboard for unauthorized admin routes to avoid login loops.
        if (nextUrl.pathname.startsWith('/admin') && nextUrl.pathname !== '/admin') {
           return Response.redirect(new URL('/admin', nextUrl));
        }
        return false;
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
  trustHost: true,
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
