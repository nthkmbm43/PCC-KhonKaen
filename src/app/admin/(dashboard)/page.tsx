import { db } from "@/db";
import { pages, siteSettings } from "@/db/schema";
import { sql } from "drizzle-orm";
import Link from "next/link";
import {
  FileText,
  Settings,
  Plus,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  TrendingUp,
  Globe,
} from "lucide-react";

export default async function AdminDashboard() {
  const pagesCountRes = await db.select({ count: sql<number>`count(*)` }).from(pages);
  const pagesCount = Number(pagesCountRes[0]?.count || 0);

  const settingsArray = await db.select().from(siteSettings).limit(1);
  const settings = settingsArray[0];

  const hasLogo = !!settings?.logoUrl;
  const hasFavicon = !!settings?.faviconUrl;
  const hasPhone = !!settings?.mainPhone;
  const hasNavbarLinks =
    settings?.navbarLinks && Array.isArray(settings.navbarLinks) && settings.navbarLinks.length > 0;

  const checks = [
    { label: "โลโก้หลัก (Navbar)", done: hasLogo },
    { label: "ไอคอนเว็บ (Favicon)", done: hasFavicon },
    { label: "เบอร์โทรติดต่อ", done: hasPhone },
    { label: "เมนูนำทาง (Navbar Links)", done: hasNavbarLinks },
  ];
  const setupScore = checks.filter((c) => c.done).length;
  const totalSetupSteps = checks.length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">ยินดีต้อนรับ — จัดการเนื้อหาเว็บไซต์ของคุณ</p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all"
        >
          <Globe className="w-4 h-4" />
          ดูหน้าเว็บไซต์
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Pages */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">จำนวนเพจทั้งหมด</p>
              <p className="text-4xl font-bold text-slate-900 mt-2">{pagesCount}</p>
              <p className="text-xs text-slate-400 mt-1">Published & Draft</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-slate-100">
            <Link
              href="/admin/pages/new"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-200 hover:shadow-md hover:shadow-blue-300"
            >
              <Plus className="w-4 h-4" />
              สร้างเพจใหม่
            </Link>
          </div>
        </div>

        {/* Setup Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ความครบถ้วนของระบบ</p>
              <p className="text-4xl font-bold text-slate-900 mt-2">
                {setupScore}
                <span className="text-2xl text-slate-400">/{totalSetupSteps}</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">การตั้งค่าพื้นฐาน</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700"
              style={{ width: `${(setupScore / totalSetupSteps) * 100}%` }}
            />
          </div>

          <div className="mt-4 space-y-2">
            {checks.map((check) => (
              <div key={check.label} className="flex items-center gap-2 text-sm">
                {check.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span className={check.done ? "text-slate-600" : "text-amber-600 font-medium"}>
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">ทางลัด</p>
          <div className="space-y-3">
            <Link
              href="/admin/pages"
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">จัดการเพจ</p>
                  <p className="text-xs text-slate-400">เพิ่ม / แก้ไข / ลบ</p>
                </div>
              </div>
              <span className="text-slate-300 group-hover:text-blue-400 transition-colors text-lg">→</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-violet-700 transition-colors">ตั้งค่าเว็บไซต์</p>
                  <p className="text-xs text-slate-400">โลโก้ / เมนู / ข้อมูลติดต่อ</p>
                </div>
              </div>
              <span className="text-slate-300 group-hover:text-violet-400 transition-colors text-lg">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {setupScore < totalSetupSteps && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">การตั้งค่ายังไม่ครบถ้วน</p>
            <p className="text-xs text-amber-600 mt-1">
              เหลืออีก {totalSetupSteps - setupScore} รายการ — ไปที่{" "}
              <Link href="/admin/settings" className="underline underline-offset-2 font-semibold">
                ตั้งค่าเว็บไซต์
              </Link>{" "}
              เพื่อดำเนินการต่อ
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
