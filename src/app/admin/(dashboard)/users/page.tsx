import { db } from "@/db";
import { users } from "@/db/schema";
import { UsersClient } from "@/components/admin/UsersClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const allUsers = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    createdAt: users.createdAt,
  }).from(users);

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
