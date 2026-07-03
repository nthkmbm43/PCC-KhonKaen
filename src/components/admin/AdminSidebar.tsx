"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, ExternalLink, Sparkles, Users, ShoppingBag } from "lucide-react";
import { DeployButton } from "./DeployButton";
import { canAccessRoute } from "@/lib/auth/rbac";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}

const websiteItems: NavItem[] = [
  { href: "/admin/pages", label: "Pages", icon: <FileText className="w-4.5 h-4.5" /> },
  { href: "/admin/products", label: "Products", icon: <ShoppingBag className="w-4.5 h-4.5" /> },
  { href: "/admin/media", label: "Media Library", icon: <Sparkles className="w-4.5 h-4.5" /> },
];

const marketingItems: NavItem[] = [
  { href: "/admin/seo", label: "SEO", icon: <LayoutDashboard className="w-4.5 h-4.5" /> },
  { href: "/admin/line-marketing", label: "LINE OA", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg> },
];

const systemItems: NavItem[] = [
  { href: "/admin/settings", label: "Settings", icon: <Settings className="w-4.5 h-4.5" /> },
  { href: "/admin/users", label: "Users", icon: <Users className="w-4.5 h-4.5" /> },
];

export function AdminSidebar({ logoUrl, role }: { logoUrl?: string; role?: string }) {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname?.startsWith(item.href);
  };

  const filteredWebsiteItems = websiteItems.filter(item => canAccessRoute(role, item.href));
  const filteredMarketingItems = marketingItems.filter(item => canAccessRoute(role, item.href));
  const filteredSystemItems = systemItems.filter(item => canAccessRoute(role, item.href));

  const renderNavSection = (title: string, items: NavItem[]) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-6">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">{title}</p>
        <div className="space-y-1">
          {items.map((item) => {
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
        </div>
      </div>
    );
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
            <p className="text-[11px] text-slate-400 leading-tight">{role === 'superuser' ? 'Superuser' : 'Content Manager'}</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-5 flex-1 overflow-y-auto">
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-3 py-2.5 mb-6 rounded-xl text-sm font-medium transition-all duration-200 ${
            pathname === "/admin"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <span className={pathname === "/admin" ? "text-white" : "text-slate-500"}><LayoutDashboard className="w-4.5 h-4.5" /></span>
          Dashboard
        </Link>

        {renderNavSection("เว็บไซต์", filteredWebsiteItems)}
        {renderNavSection("Marketing", filteredMarketingItems)}
        {renderNavSection("System", filteredSystemItems)}
      </nav>

      <div className="px-3 py-4 border-t border-slate-700/60 space-y-3">
        <DeployButton />
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
