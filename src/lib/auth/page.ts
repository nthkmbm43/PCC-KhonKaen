import "server-only";

import { auth } from "@/auth";
import { canAccessRoute } from "@/lib/auth/rbac";
import { redirect } from "next/navigation";

export async function requireAdminPagePermission(pathname: string) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canAccessRoute(session.user.role, pathname)) redirect("/admin");
  return session;
}
