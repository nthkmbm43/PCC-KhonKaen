import { db } from "@/db";
import { pages, seoMetadata, admins } from "@/db/schema";
import { desc, eq, and, ilike, or } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileEdit, Plus, Search, Eye, Filter } from "lucide-react";
import { DeletePageButton } from "@/components/admin/DeletePageButton";

export const dynamic = 'force-dynamic';

export default async function PagesList({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = searchParams.q as string || '';
  const statusFilter = searchParams.status as string || 'all';
  const templateFilter = searchParams.template as string || 'all';

  // Build conditions
  const conditions = [];
  if (query) {
    conditions.push(
      or(
        ilike(pages.title, `%${query}%`),
        ilike(pages.slug, `%${query}%`)
      )
    );
  }
  
  if (statusFilter !== 'all') {
    conditions.push(eq(pages.workflowState, statusFilter as any));
  }
  
  if (templateFilter !== 'all') {
    conditions.push(eq(pages.template, templateFilter as any));
  }

  // Fetch data
  const allPages = await db
    .select({
      page: pages,
      seo: seoMetadata,
      updatedByAdmin: admins,
    })
    .from(pages)
    .leftJoin(seoMetadata, and(eq(seoMetadata.resourceId, pages.id), eq(seoMetadata.resourceType, 'page')))
    .leftJoin(admins, eq(pages.updatedBy, admins.id))
    .where(and(...conditions))
    .orderBy(desc(pages.updatedAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการเพจ (Pages)</h1>
          <p className="text-slate-500 text-sm mt-1">สร้าง แก้ไข เนื้อหาหน้าเว็บไซต์และจัดการ SEO</p>
        </div>
        <Link href="/admin/pages/new">
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-200">
            <Plus className="w-4 h-4 mr-2" />
            สร้างเพจใหม่
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form className="flex-1 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              name="q"
              defaultValue={query}
              type="text" 
              placeholder="ค้นหาชื่อเพจ หรือ Slug..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
            />
          </div>
          
          <div className="relative">
            <select 
              name="status"
              defaultValue={statusFilter}
              className="appearance-none pl-10 pr-8 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            >
              <option value="all">ทุกสถานะ (Workflow)</option>
              <option value="published">Published</option>
              <option value="review">Review</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>

          <div className="relative">
            <select 
              name="template"
              defaultValue={templateFilter}
              className="appearance-none pl-10 pr-8 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            >
              <option value="all">ทุกเทมเพลต (Template)</option>
              <option value="default">Default</option>
              <option value="landing">Landing</option>
              <option value="service">Service</option>
              <option value="product">Product</option>
              <option value="contact">Contact</option>
              <option value="about">About</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          
          <Button type="submit" variant="secondary" className="rounded-xl">
            ค้นหา
          </Button>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 border-b border-slate-200 whitespace-nowrap">
              <TableHead className="font-semibold text-slate-700">ชื่อเพจ / URL</TableHead>
              <TableHead className="font-semibold text-slate-700">Template</TableHead>
              <TableHead className="font-semibold text-slate-700">SEO Health</TableHead>
              <TableHead className="font-semibold text-slate-700">Workflow</TableHead>
              <TableHead className="font-semibold text-slate-700">Published</TableHead>
              <TableHead className="font-semibold text-slate-700">Updated By</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allPages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <FileEdit className="w-6 h-6 text-slate-300" />
                    </div>
                    <p>ไม่พบข้อมูลเพจ</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              allPages.map(({ page, seo, updatedByAdmin }) => {
                
                // SEO Health Calculation
                let missingFields = [];
                if (!seo) {
                  missingFields = ['Title', 'Description', 'OG Image', 'Canonical'];
                } else {
                  if (!seo.title) missingFields.push('Title');
                  if (!seo.description) missingFields.push('Description');
                  if (!seo.ogImage) missingFields.push('OG Image');
                  if (!seo.canonical) missingFields.push('Canonical');
                }
                
                let seoBadge = null;
                if (missingFields.length === 4) {
                  seoBadge = <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-rose-100 text-rose-700">🔴 Missing SEO</span>;
                } else if (missingFields.length === 0) {
                  seoBadge = <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-700">🟢 Complete</span>;
                } else {
                  const label = missingFields.length > 1 ? `${missingFields[0]} +${missingFields.length - 1}` : missingFields[0];
                  seoBadge = <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-700" title={`Missing: ${missingFields.join(', ')}`}>🟡 Missing {label}</span>;
                }

                // Workflow Badge
                let workflowBadge = null;
                switch (page.workflowState) {
                  case 'published':
                    workflowBadge = <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">🟢 Published</span>;
                    break;
                  case 'review':
                    workflowBadge = <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-700 border border-amber-200">🟡 Review</span>;
                    break;
                  case 'draft':
                    workflowBadge = <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">⚪ Draft</span>;
                    break;
                  case 'archived':
                    workflowBadge = <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-rose-100 text-rose-700 border border-rose-200">🔴 Archived</span>;
                    break;
                  default:
                    // Fallback to legacy status if workflow state is somehow invalid
                    workflowBadge = <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">⚪ {page.status}</span>;
                }

                return (
                  <TableRow key={page.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{page.title}</span>
                        <span className="text-slate-400 font-mono text-[11px]">/{page.slug}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize text-slate-600 text-xs font-medium bg-slate-100 px-2 py-1 rounded-md">
                        {page.template || 'Default'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {seoBadge}
                    </TableCell>
                    <TableCell>
                      {workflowBadge}
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      {page.publishedAt 
                        ? new Date(page.publishedAt).toLocaleDateString('th-TH') 
                        : <span className="text-slate-300">-</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-slate-700 text-xs font-medium">
                          {updatedByAdmin ? updatedByAdmin.name : <span className="text-slate-300">—</span>}
                        </span>
                        <span className="text-slate-400 text-[10px]">
                          {new Date(page.updatedAt || '').toLocaleDateString('th-TH')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/${page.slug}`} target="_blank" aria-label="ดูหน้าเว็บ">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/pages/${page.id}`} aria-label="แก้ไข">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
                            <FileEdit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <DeletePageButton pageId={page.id} pageTitle={page.title} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
