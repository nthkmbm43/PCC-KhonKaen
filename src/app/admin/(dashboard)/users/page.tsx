import { db } from "@/db";
import { admins } from "@/db/schema";
import { UsersClient } from "@/components/admin/UsersClient";
import { canAccessRoute } from "@/lib/auth/rbac";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/page";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

const getAdminUsers = unstable_cache(() => db.select({
  id: admins.id,
  name: admins.name,
  email: admins.email,
  role: admins.role,
  createdAt: admins.createdAt,
}).from(admins), ["admin-user-list"], { tags: ["admin-users"], revalidate: 3600 });

export default async function UsersPage() {
  const session = await getAdminSession();
  if (!session || !canAccessRoute(session.user?.role, "/admin/users")) {
    redirect("/admin"); // Defense in depth
  }

  const allUsers = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">ผู้ดูแลระบบ (Admins)</h1>
        <p className="text-sm text-slate-500 mt-1">
          จัดการสิทธิ์การเข้าถึง เพิ่ม/ลบ ทีมงานที่สามารถเข้ามาจัดการเว็บไซต์ได้
        </p>
      </div>

      <UsersClient initialUsers={allUsers} />
    </div>
  );
}
