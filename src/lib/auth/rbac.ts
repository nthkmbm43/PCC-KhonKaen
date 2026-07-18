export type Role = 'superuser' | 'admin' | string;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  superuser: ['*'], // Superuser has all permissions
  admin: ['products:*', 'pages:*', 'line-marketing:*', 'leads:*'],
};

export const ROUTE_PERMISSION: Record<string, string> = {
  '/admin/products': 'products:*',
  '/admin/pages': 'pages:*',
  '/admin/line-marketing': 'line-marketing:*',
  '/admin/leads': 'leads:*',
  '/admin/users': 'users:*',
  '/admin/settings': 'settings:*',
  '/admin/media': 'pages:*',
  '/admin/seo': 'pages:*',
  '/admin/audit': 'pages:*',
  '/api/products': 'products:*',
  '/api/pages': 'pages:*',
  '/api/users': 'users:*',
  '/api/settings': 'settings:*',
  '/api/media': 'pages:*',
  '/api/upload': 'pages:*',
  '/api/revalidate': 'pages:*',
  '/api/revalidate-all': 'pages:*',
  '/api/preview': 'pages:*',
  '/api/deploy': 'pages:*',
  '/api/admin/holidays': 'settings:*',
  '/api/line/richmenu': 'line-marketing:*',
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role | undefined | null, permission: string): boolean {
  if (!role) return false;
  if (role === 'superuser') return true;
  
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission) || permissions.includes('*');
}

/**
 * Check if a role can access a specific route
 */
export function canAccessRoute(role: Role | undefined | null, pathname: string): boolean {
  if (pathname === '/api/leads') return true;

  // Public routes or login
  if (!pathname.startsWith('/admin') && (!pathname.startsWith('/api/') || pathname.startsWith('/api/auth'))) {
    return true;
  }
  
  if (pathname === '/admin/login') return true;
  if (pathname === '/admin') return !!role; // Dashboard root is accessible to any logged in admin/superuser

  // Find required permission for the route
  // We sort by length descending to match the most specific route first
  const sortedRoutes = Object.keys(ROUTE_PERMISSION).sort((a, b) => b.length - a.length);
  const matchedRoute = sortedRoutes.find(route => pathname.startsWith(route));
  
  if (matchedRoute) {
    const requiredPermission = ROUTE_PERMISSION[matchedRoute];
    return hasPermission(role, requiredPermission);
  }

  // Fallback: if it's an admin route but no specific permission is mapped, allow any authenticated user
  if (pathname.startsWith('/admin')) {
    return !!role;
  }
  // Fallback: if it's an API route but no specific permission is mapped, restrict to superuser
  return role === 'superuser';
}
