import Link from 'next/link';
import { Download, Edit3, Eye, FilePlus2, FolderDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadCategoryLabels } from '@/data/documents';
import { requireAdminPagePermission } from '@/lib/auth/page';
import { getAdminDocuments } from '@/lib/repositories/document';

export const dynamic = 'force-dynamic';

export default async function DocumentsAdminPage() {
  await requireAdminPagePermission('/admin/documents');
  const documents = await getAdminDocuments();
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="flex items-center gap-3 text-2xl font-bold"><FolderDown className="h-6 w-6 text-blue-600" />ศูนย์เอกสารดาวน์โหลด</h1><p className="mt-1 text-sm text-slate-500">จัดการ PDF หมวดหมู่ สถานะ และการเชื่อมโยงกับสินค้า</p></div><Link href="/admin/documents/new"><Button className="bg-blue-600 hover:bg-blue-700"><FilePlus2 className="mr-2 h-4 w-4" />เพิ่มเอกสาร</Button></Link></div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-100">{documents.map((document) => <div key={document.slug} className="flex flex-col gap-4 p-5 hover:bg-slate-50 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${document.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{document.status === 'published' ? 'เผยแพร่' : 'ฉบับร่าง'}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600">{downloadCategoryLabels[document.category]}</span></div><h2 className="mt-2 truncate font-bold">{document.title}</h2><p className="mt-1 text-xs text-slate-500"><Download className="mr-1 inline h-3.5 w-3.5" />{document.downloadCount.toLocaleString('th-TH')} ครั้ง · {document.pageCount || '-'} หน้า</p></div><div className="flex gap-2"><a href={`/api/documents/${document.slug}/download`} target="_blank"><Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" />ดูไฟล์</Button></a><Link href={`/admin/documents/${document.slug}`}><Button size="sm" className="bg-blue-600 hover:bg-blue-700"><Edit3 className="mr-2 h-4 w-4" />แก้ไข</Button></Link></div></div>)}</div>
      </div>
    </div>
  );
}
