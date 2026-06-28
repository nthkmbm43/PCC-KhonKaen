"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, LogOut } from "lucide-react";

export function AdminSidebar({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(path);
  };

  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm shrink-0">
      <div className="p-6 border-b border-gray-200 flex items-center justify-center min-h-[88px]">
        {logoUrl ? (
          <Link href="/admin">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="Logo" className="max-h-12 w-auto object-contain hover:opacity-80 transition-opacity" />
          </Link>
        ) : (
          <Link href="/admin">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight hover:opacity-80 transition-opacity">
              Custom<span className="text-blue-600">CMS</span>
            </h2>
          </Link>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
            isActive("/admin") && !pathname.startsWith("/admin/pages") && !pathname.startsWith("/admin/settings")
              ? "text-blue-700 bg-blue-50"
              : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>
        <Link
          href="/admin/pages"
          className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
            isActive("/admin/pages")
              ? "text-blue-700 bg-blue-50"
              : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
          }`}
        >
          <FileText className="w-5 h-5" />
          Pages
        </Link>
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
            isActive("/admin/settings")
              ? "text-blue-700 bg-blue-50"
              : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
          }`}
        >
          <Settings className="w-5 h-5" />
          Site Settings
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
