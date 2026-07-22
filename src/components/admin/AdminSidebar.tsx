"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  ExternalLink,
  Users,
  ShoppingBag,
  Image as ImageIcon,
  SearchCheck,
  MessageCircle,
  ChevronRight,
  Zap,
  UserRoundSearch,
  Menu,
  X,
} from "lucide-react";
import { DeployButton } from "./DeployButton";
import { canAccessRoute } from "@/lib/auth/rbac";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}

const websiteItems: NavItem[] = [
  { href: "/admin/pages", label: "จัดการเพจ", icon: <FileText className="w-4 h-4" /> },
  { href: "/admin/products", label: "จัดการสินค้า", icon: <ShoppingBag className="w-4 h-4" /> },
  { href: "/admin/media", label: "Media Library", icon: <ImageIcon className="w-4 h-4" /> },
];

const marketingItems: NavItem[] = [
  { href: "/admin/leads", label: "ลูกค้าใหม่ (Leads)", icon: <UserRoundSearch className="w-4 h-4" /> },
  { href: "/admin/seo", label: "SEO", icon: <SearchCheck className="w-4 h-4" /> },
  { href: "/admin/line-marketing", label: "LINE OA", icon: <MessageCircle className="w-4 h-4" /> },
];

const systemItems: NavItem[] = [
  { href: "/admin/settings", label: "ตั้งค่าเว็บไซต์", icon: <Settings className="w-4 h-4" /> },
  { href: "/admin/users", label: "ผู้ใช้งาน", icon: <Users className="w-4 h-4" /> },
];

export function AdminSidebar({ logoUrl, role }: { logoUrl?: string; role?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname?.startsWith(item.href);
  };

  const filteredWebsiteItems = websiteItems.filter((item) => canAccessRoute(role, item.href));
  const filteredMarketingItems = marketingItems.filter((item) => canAccessRoute(role, item.href));
  const filteredSystemItems = systemItems.filter((item) => canAccessRoute(role, item.href));

  const renderNavSection = (title: string, items: NavItem[]) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-5">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.12em] px-3 mb-2">
          {title}
        </p>
        <div className="space-y-0.5">
          {items.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                <span
                  className={`flex-shrink-0 transition-colors ${
                    active ? "text-blue-100" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {active && (
                  <ChevronRight className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  const isDashboard = pathname === "/admin";

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        aria-label={mobileOpen ? "ปิดเมนูผู้ดูแลระบบ" : "เปิดเมนูผู้ดูแลระบบ"}
        aria-expanded={mobileOpen}
        className="fixed left-3 top-3 z-[60] inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-100 lg:hidden"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <button
        type="button"
        aria-label="ปิดเมนู"
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-[2px] transition-opacity lg:hidden ${
          mobileOpen ? "visible pointer-events-auto opacity-100" : "invisible pointer-events-none opacity-0"
        }`}
      />

    <aside
      aria-label="เมนูผู้ดูแลระบบ"
      className={`fixed inset-y-0 left-0 z-40 flex h-dvh w-[min(84vw,280px)] shrink-0 flex-col border-r border-slate-800 bg-slate-900 shadow-2xl transition-transform duration-300 lg:visible lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-[260px] lg:min-w-[260px] lg:max-w-[260px] lg:translate-x-0 lg:shadow-none ${
        mobileOpen ? "visible translate-x-0" : "invisible -translate-x-full"
      }`}
    >
      {/* Logo / Brand */}
      <div className="border-b border-slate-800 py-5 pl-16 pr-4 lg:px-4">
        <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 group">
          <div className="flex-shrink-0">
            {logoUrl ? (
              <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-slate-700 group-hover:ring-blue-500 transition-all bg-white flex items-center justify-center">
                <Image src={logoUrl} alt="Logo" fill className="object-contain p-1" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center ring-2 ring-blue-400/20 shadow-lg shadow-blue-500/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white leading-tight truncate">PCC Admin</p>
            <p className="text-[11px] text-slate-400 leading-tight truncate mt-0.5">
              {role === "superuser" ? "⚡ Superuser" : "Content Manager"}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {/* Dashboard */}
        <div className="mb-5">
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isDashboard
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
            }`}
          >
            <LayoutDashboard
              className={`w-4 h-4 flex-shrink-0 transition-colors ${
                isDashboard ? "text-blue-100" : "text-slate-500 group-hover:text-slate-300"
              }`}
            />
            <span className="flex-1 truncate">Dashboard</span>
            {isDashboard && <ChevronRight className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />}
          </Link>
        </div>

        {renderNavSection("เว็บไซต์", filteredWebsiteItems)}
        {renderNavSection("การตลาด", filteredMarketingItems)}
        {renderNavSection("ระบบ", filteredSystemItems)}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-2">
        <DeployButton />
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all duration-200 group"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0 text-slate-500 group-hover:text-slate-300 transition-colors" />
          <span className="flex-1 truncate">ดูหน้าเว็บไซต์</span>
        </Link>
      </div>
    </aside>
    </>
  );
}
