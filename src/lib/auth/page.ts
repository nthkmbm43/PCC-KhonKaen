import "server-only";

import { auth } from "@/auth";
import { canAccessRoute } from "@/lib/auth/rbac";
import { redirect } from "next/navigation";
import { cache } from "react";

// Layouts and pages can ask for the same session during one navigation.
// Request-scoped memoization prevents decoding/validating it more than once.
export const getAdminSession = cache(() => auth());

export async function requireAdminPagePermission(pathname: string) {
  const session = await getAdminSession();
  if (!session?.user) redirect("/admin/login");
  if (!canAccessRoute(session.user.role, pathname)) redirect("/admin");
  return session;
}
