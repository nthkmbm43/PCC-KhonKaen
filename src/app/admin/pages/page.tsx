import { db } from "@/db";
import { pages } from "@/db/schema";
import { desc } from "drizzle-orm";
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
import { FileEdit, Plus } from "lucide-react";
import { DeletePageButton } from "@/components/admin/DeletePageButton";

export const dynamic = 'force-dynamic';

export default async function PagesList() {
  const allPages = await db.select().from(pages).orderBy(desc(pages.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">จัดการเพจ</h1>
          <p className="text-slate-500 text-sm mt-1">สร้าง แก้ไข หรือลบเพจเนื้อหาของเว็บไซต์</p>
        </div>
        <Link href="/admin/pages/new">
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-200">
            <Plus className="w-4 h-4 mr-2" />
            สร้างเพจใหม่
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 border-b border-slate-200">
              <TableHead className="font-semibold text-slate-700">ชื่อเพจ</TableHead>
              <TableHead className="font-semibold text-slate-700">Slug (URL)</TableHead>
              <TableHead className="font-semibold text-slate-700">สถานะ</TableHead>
              <TableHead className="font-semibold text-slate-700">อัปเดตล่าสุด</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allPages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <FileEdit className="w-6 h-6 text-slate-300" />
                    </div>
                    <p>ยังไม่มีเพจ กด &quot;สร้างเพจใหม่&quot; เพื่อเริ่มต้น</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              allPages.map((page) => (
                <TableRow key={page.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-semibold text-slate-800">{page.title}</TableCell>
                  <TableCell className="text-slate-400 font-mono text-xs">/{page.slug}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      page.status === 'published' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {page.status === 'published' ? '✓ เผยแพร่' : '✎ ร่าง'}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {new Date(page.updatedAt || '').toLocaleDateString('th-TH')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/pages/${page.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
                          <FileEdit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <DeletePageButton pageId={page.id} pageTitle={page.title} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
