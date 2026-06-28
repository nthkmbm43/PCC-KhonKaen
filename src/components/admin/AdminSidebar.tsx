"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, ExternalLink, Sparkles, Users } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-4.5 h-4.5" />, exact: true },
  { href: "/admin/pages", label: "จัดการเพจ", icon: <FileText className="w-4.5 h-4.5" /> },
  { href: "/admin/users", label: "ผู้ดูแลระบบ", icon: <Users className="w-4.5 h-4.5" /> },
  { href: "/admin/settings", label: "ตั้งค่าเว็บไซต์", icon: <Settings className="w-4.5 h-4.5" /> },
];

export function AdminSidebar({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname?.startsWith(item.href);
  };

  return (
    <aside className="w-full md:w-64 bg-slate-900 flex flex-col shrink-0 min-h-screen">
      {/* Logo Area */}
      <div className="px-5 py-6 border-b border-slate-700/60 flex items-center gap-3">
        <Link href="/admin" className="flex items-center gap-3 group w-full">
          {logoUrl ? (
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 ring-2 ring-slate-600 group-hover:ring-blue-500 transition-all">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain bg-white" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 ring-2 ring-blue-400/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-white leading-tight">Admin Panel</p>
            <p className="text-[11px] text-slate-400 leading-tight">Content Manager</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">เมนูหลัก</p>
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className={active ? "text-white" : "text-slate-500"}>{item.icon}</span>
              {item.label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-200" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-700/60 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
        >
          <ExternalLink className="w-4 h-4" />
          ดูหน้าเว็บไซต์
        </Link>
      </div>
    </aside>
  );
}
