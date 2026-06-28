import { AdminSidebar } from "@/components/admin/AdminSidebar";
import "../globals.css";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Bell } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settingsArray = await db.select().from(siteSettings).limit(1);
  const settings = settingsArray[0];

  return {
    title: "Admin Dashboard | PCC CMS",
    description: "Manage your website content",
    icons: {
      icon: settings?.faviconUrl || settings?.logoUrl || "/images/logo.png",
      shortcut: settings?.faviconUrl || settings?.logoUrl || "/images/logo.png",
      apple: settings?.faviconUrl || settings?.logoUrl || "/images/logo.png",
    },
  };
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const settingsArray = await db.select().from(siteSettings).limit(1);
  const settings = settingsArray[0];

  return (
    <html lang="th">
      <body className="antialiased bg-slate-100 text-slate-900">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid #334155",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#22c55e", secondary: "#1e293b" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#1e293b" },
            },
          }}
        />

        <div className="min-h-screen flex flex-col md:flex-row">
          {/* Sidebar */}
          <AdminSidebar logoUrl={settings?.logoUrl || undefined} />

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0">
            {/* Topbar */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 sticky top-0 z-20 shrink-0 shadow-sm">
              <div className="flex-1" />
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <button className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all">
                  <Bell className="w-4 h-4" />
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-200" />

                {/* User */}
                <div className="flex items-center gap-2.5">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-slate-800 leading-none">Admin</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">ผู้ดูแลระบบ</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/30 ring-2 ring-blue-100">
                    A
                  </div>
                </div>
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
      </body>
    </html>
  );
}
