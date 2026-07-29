import Link from "next/link";
import { Edit3, Eye, Newspaper, Plus } from "lucide-react";
import { getAdminArticles } from "@/lib/repositories/article";
import { Button } from "@/components/ui/button";
import { requireAdminPagePermission } from "@/lib/auth/page";

export const dynamic = "force-dynamic";

export default async function ArticlesAdminPage() {
  await requireAdminPagePermission("/admin/articles");
  const articles = await getAdminArticles();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">จัดการบทความ</h1><p className="mt-1 text-sm text-slate-500">แก้ไขบทความ SEO ตั้งฉบับร่าง และเพิ่มบทความใหม่</p></div>
        <Link href="/admin/articles/new"><Button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 sm:w-auto"><Plus className="mr-2 h-4 w-4" />สร้างบทความใหม่</Button></Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {articles.length === 0 ? <div className="flex flex-col items-center gap-3 py-16 text-slate-400"><Newspaper className="h-10 w-10" /><p>ยังไม่มีบทความ</p></div> : (
          <div className="divide-y divide-slate-100">
            {articles.map((article) => (
              <div key={article.slug} className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${article.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{article.status === "published" ? "เผยแพร่" : "ฉบับร่าง"}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">{article.category}</span>{article.source === "starter" ? <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">ข้อมูลตั้งต้น</span> : null}</div><h2 className="mt-2 truncate font-bold text-slate-900">{article.title}</h2><p className="mt-1 truncate font-mono text-xs text-slate-400">/articles/{article.slug}</p></div>
                <div className="flex shrink-0 gap-2"><Link href={`/articles/${article.slug}`} target="_blank"><Button variant="outline" size="sm" className="rounded-lg"><Eye className="mr-2 h-4 w-4" />ดูหน้าเว็บ</Button></Link><Link href={`/admin/articles/${article.slug}`}><Button size="sm" className="rounded-lg bg-blue-600 hover:bg-blue-700"><Edit3 className="mr-2 h-4 w-4" />แก้ไข</Button></Link></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
