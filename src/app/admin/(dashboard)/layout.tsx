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
    (settings as any)?.companyName || "PCC Post-Tension";

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar — Fixed 260px, never changes */}
      <AdminSidebar logoUrl={settings?.logoUrl || undefined} role={role} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 sticky top-0 z-20 shrink-0">
          {/* Breadcrumb / Page Title area — filled by children if needed */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className="text-xs text-slate-400 hidden sm:block truncate">
              {displayName}
            </span>
          </div>

          {/* Right side — User info + sign out */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:flex flex-col items-end">
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
        <div className="flex-1 overflow-auto p-5 md:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
