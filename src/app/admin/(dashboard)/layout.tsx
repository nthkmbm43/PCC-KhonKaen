import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { auth } from "@/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const settingsArray = await db.select().from(siteSettings).limit(1);
  const settings = settingsArray[0];
  const session = await auth();
  const role = session?.user?.role;

  const displayName =
    (settings as { companyName?: string })?.companyName || "PCC Post-Tension";

  return (
    <div className="flex min-h-screen min-w-0 bg-slate-50">
      <AdminSidebar logoUrl={settings?.logoUrl || undefined} role={role} />

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center border-b border-slate-200 bg-white pl-16 pr-3 sm:pr-5 lg:px-6">
          {/* Breadcrumb / Page Title area — filled by children if needed */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className="hidden truncate text-xs text-slate-400 md:block">
              {displayName}
            </span>
          </div>

          {/* Right side — User info + sign out */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden flex-col items-end sm:flex">
              <p className="text-sm font-semibold text-slate-800 leading-none">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {role === "superuser" ? "Superuser" : "ผู้ดูแลระบบ"}
              </p>
            </div>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 ring-2 ring-blue-100 flex-shrink-0">
              {(session?.user?.name?.[0] || "A").toUpperCase()}
            </div>

            <SignOutButton />
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-main flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 lg:p-8">
          <div className="mx-auto w-full max-w-7xl min-w-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
