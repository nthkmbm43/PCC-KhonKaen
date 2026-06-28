import Link from "next/link";
import { LayoutDashboard, FileText, Settings, LogOut } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import "../globals.css";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

export const metadata = {
  title: "Admin Dashboard - Custom CMS",
  description: "Manage your website content",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const settingsArray = await db.select().from(siteSettings).limit(1);
  const settings = settingsArray[0];

  return (
    <html lang="en">
      <body className="antialiased text-gray-900 bg-gray-50">
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
          {/* Sidebar */}
          <AdminSidebar logoUrl={settings?.logoUrl || undefined} />

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0">
            {/* Topbar */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm sticky top-0 z-20 shrink-0">
              <div className="flex-1"></div>
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-gray-700">Admin User</div>
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-blue-100">
                  A
                </div>
              </div>
            </header>

            {/* Page Content */}
            <div className="flex-1 overflow-auto p-6 md:p-8">
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
