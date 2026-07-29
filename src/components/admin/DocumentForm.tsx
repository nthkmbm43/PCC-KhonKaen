'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileUp, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DownloadCategory, DownloadDocument } from '@/data/documents';
import type { EditableDownloadDocument } from '@/lib/repositories/document';

type FormState = DownloadDocument & { status: 'draft' | 'published' };
const today = new Date().toISOString().slice(0, 10);
const textAreaClass = 'flex min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

function emptyDocument(): FormState {
  return {
    slug: '',
    title: '',
    description: '',
    category: 'catalog',
    fileUrl: '',
    originalName: '',
    fileSize: 0,
    pageCount: undefined,
    relatedProduct: undefined,
    sourceLabel: '',
    note: '',
    sortOrder: 100,
    updatedAt: today,
    status: 'draft',
  };
}

export function DocumentForm({ initialData }: { initialData?: EditableDownloadDocument }) {
  const router = useRouter();
  const isNew = !initialData;
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<FormState>(() => initialData ? { ...initialData } : emptyDocument());

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));

  async function uploadPdf(file?: File) {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('กรุณาเลือกไฟล์ PDF');
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/documents/upload', { method: 'POST', body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'อัปโหลดไม่สำเร็จ');
      setForm((current) => ({ ...current, fileUrl: result.url, originalName: result.originalName, fileSize: result.size }));
      toast.success('อัปโหลด PDF เรียบร้อย');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'อัปโหลดไม่สำเร็จ');
    } finally {
      setUploading(false);
    }
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.fileUrl) return toast.error('กรุณาอัปโหลดหรือระบุ URL ของไฟล์ PDF');
    setSaving(true);
    const document: DownloadDocument = {
      slug: form.slug,
      title: form.title,
      description: form.description,
      category: form.category,
      fileUrl: form.fileUrl,
      originalName: form.originalName || `${form.slug}.pdf`,
      fileSize: Number(form.fileSize) || 0,
      pageCount: form.pageCount ? Number(form.pageCount) : undefined,
      relatedProduct: form.relatedProduct?.label && form.relatedProduct?.href ? form.relatedProduct : undefined,
      sourceLabel: form.sourceLabel?.trim() || undefined,
      note: form.note?.trim() || undefined,
      sortOrder: Number(form.sortOrder) || 0,
      updatedAt: today,
    };
    try {
      const response = await fetch(isNew ? '/api/documents' : `/api/documents/${encodeURIComponent(initialData.slug)}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: form.status, document }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'บันทึกเอกสารไม่สำเร็จ');
      toast.success('บันทึกเอกสารเรียบร้อย');
      router.push('/admin/documents');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'บันทึกเอกสารไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="mx-auto max-w-5xl space-y-6 pb-20">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3"><Link href="/admin/documents"><Button type="button" variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link><div><h1 className="text-2xl font-bold">{isNew ? 'เพิ่มเอกสารดาวน์โหลด' : 'แก้ไขเอกสารดาวน์โหลด'}</h1><p className="text-sm text-slate-500">PDF, ข้อมูล SEO และการเชื่อมกับหน้าสินค้า</p></div></div>
        <div className="flex gap-3"><select value={form.status} onChange={(event) => setField('status', event.target.value as FormState['status'])} className="rounded-xl border border-slate-200 bg-white px-4 text-sm"><option value="draft">ฉบับร่าง</option><option value="published">เผยแพร่</option></select><Button type="submit" disabled={saving || uploading} className="bg-blue-600 hover:bg-blue-700"><Save className="mr-2 h-4 w-4" />{saving ? 'กำลังบันทึก...' : 'บันทึก'}</Button></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="border-b pb-4 text-lg font-semibold">ข้อมูลเอกสาร</h2>
            <div className="space-y-2"><Label htmlFor="title">ชื่อเอกสาร</Label><Input id="title" required value={form.title} onChange={(event) => setField('title', event.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="slug">URL Slug</Label><Input id="slug" required disabled={!isNew} value={form.slug} onChange={(event) => setField('slug', event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} placeholder="precast-product-catalog" /></div>
            <div className="space-y-2"><Label htmlFor="description">คำอธิบาย</Label><textarea id="description" required value={form.description} onChange={(event) => setField('description', event.target.value)} className={textAreaClass} /></div>
            <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>หมวดหมู่</Label><select value={form.category} onChange={(event) => setField('category', event.target.value as DownloadCategory)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"><option value="catalog">แคตตาล็อกสินค้า</option><option value="specification">ข้อมูลทางเทคนิค</option><option value="certificate">ใบรับรองและมาตรฐาน</option><option value="company-profile">ข้อมูลบริษัท</option><option value="installation-guide">คู่มือการติดตั้ง</option></select></div><div className="space-y-2"><Label htmlFor="sourceLabel">แหล่งที่มา</Label><Input id="sourceLabel" value={form.sourceLabel || ''} onChange={(event) => setField('sourceLabel', event.target.value)} /></div></div>
            <div className="space-y-2"><Label htmlFor="note">หมายเหตุสำคัญ</Label><textarea id="note" value={form.note || ''} onChange={(event) => setField('note', event.target.value)} className={textAreaClass} /></div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="border-b pb-4 text-lg font-semibold">เชื่อมกับหน้าสินค้า</h2>
            <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>ข้อความลิงก์</Label><Input value={form.relatedProduct?.label || ''} onChange={(event) => setField('relatedProduct', { label: event.target.value, href: form.relatedProduct?.href || '' })} placeholder="รั้วสำเร็จรูป" /></div><div className="space-y-2"><Label>URL สินค้า</Label><Input value={form.relatedProduct?.href || ''} onChange={(event) => setField('relatedProduct', { label: form.relatedProduct?.label || '', href: event.target.value })} placeholder="/products/precast-fence-khon-kaen" /></div></div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold">ไฟล์ PDF</h2>
            <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 p-6 text-center text-blue-700 hover:border-blue-400"><FileUp className="h-8 w-8" /><span className="text-sm font-semibold">{uploading ? 'กำลังอัปโหลด...' : 'เลือกไฟล์ PDF ไม่เกิน 25 MB'}</span><input type="file" accept="application/pdf,.pdf" className="hidden" disabled={uploading} onChange={(event) => uploadPdf(event.target.files?.[0])} /></label>
            <div className="space-y-2"><Label>URL ไฟล์</Label><Input required value={form.fileUrl} onChange={(event) => setField('fileUrl', event.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>จำนวนหน้า</Label><Input type="number" min="1" value={form.pageCount || ''} onChange={(event) => setField('pageCount', event.target.value ? Number(event.target.value) : undefined)} /></div><div className="space-y-2"><Label>ลำดับ</Label><Input type="number" min="0" value={form.sortOrder} onChange={(event) => setField('sortOrder', Number(event.target.value))} /></div></div>
            {form.fileUrl && <a href={form.fileUrl} target="_blank" rel="noreferrer" className="block break-all text-xs text-blue-600 hover:underline">เปิดดูไฟล์ปัจจุบัน</a>}
          </section>
        </aside>
      </div>
    </form>
  );
}
