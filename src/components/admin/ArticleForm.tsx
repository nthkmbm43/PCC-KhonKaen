"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { KnowledgeArticle } from "@/data/articles";
import type { EditableArticle } from "@/lib/repositories/article";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/ImageUpload";

type ArticleFormState = KnowledgeArticle & { status: "draft" | "published" };

const today = new Date().toISOString().slice(0, 10);

function createEmptyArticle(): ArticleFormState {
  return {
    slug: "",
    title: "",
    seoTitle: "",
    description: "",
    excerpt: "",
    category: "บทความก่อสร้าง",
    publishedAt: today,
    updatedAt: today,
    readTime: "6 นาที",
    image: "/images/about-factory-interior.png",
    imageAlt: "",
    product: { label: "ดูสินค้าและบริการที่เกี่ยวข้อง", href: "/products" },
    summary: [""],
    sections: [{ heading: "", paragraphs: [""], bullets: [], callout: "", images: [] }],
    checklist: [""],
    faq: [{ question: "", answer: "" }],
    status: "draft",
  };
}

const textAreaClass = "flex min-h-28 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

function lines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

export function ArticleForm({ initialData }: { initialData?: EditableArticle }) {
  const router = useRouter();
  const isNew = !initialData;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ArticleFormState>(() => initialData
    ? { ...initialData, status: initialData.status }
    : createEmptyArticle());

  const setField = <K extends keyof ArticleFormState>(key: K, value: ArticleFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateSection = (index: number, patch: Partial<ArticleFormState["sections"][number]>) => {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) => sectionIndex === index ? { ...section, ...patch } : section),
    }));
  };

  const updateFaq = (index: number, patch: Partial<ArticleFormState["faq"][number]>) => {
    setForm((current) => ({
      ...current,
      faq: current.faq.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item),
    }));
  };

  async function saveArticle(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const article: KnowledgeArticle = {
      ...form,
      updatedAt: today,
      summary: form.summary.filter(Boolean),
      checklist: form.checklist.filter(Boolean),
      sections: form.sections.map((section) => ({
        ...section,
        paragraphs: section.paragraphs.filter(Boolean),
        bullets: section.bullets?.filter(Boolean),
        callout: section.callout?.trim() || undefined,
        images: section.images
          ?.filter((image) => image.src.trim())
          .map((image) => ({
            src: image.src.trim(),
            alt: image.alt.trim(),
            caption: image.caption?.trim() || undefined,
          })),
      })),
      faq: form.faq.filter((item) => item.question.trim() || item.answer.trim()),
    };

    try {
      const response = await fetch(isNew ? "/api/articles" : `/api/articles/${encodeURIComponent(initialData.slug)}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: form.status, article }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "บันทึกบทความไม่สำเร็จ");

      toast.success(isNew ? "สร้างบทความเรียบร้อยแล้ว" : "บันทึกบทความเรียบร้อยแล้ว");
      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "บันทึกบทความไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={saveArticle} className="mx-auto max-w-5xl space-y-6 pb-20">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/articles"><Button type="button" variant="ghost" size="icon" className="rounded-xl"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{isNew ? "สร้างบทความใหม่" : "แก้ไขบทความ"}</h1>
            {!isNew && initialData.source === "starter" ? <p className="mt-1 text-xs text-amber-700">บทความตั้งต้น · การบันทึกครั้งแรกจะสร้างข้อมูลที่แก้ไขได้ในฐานข้อมูล</p> : null}
          </div>
        </div>
        <div className="flex gap-3">
          <select value={form.status} onChange={(event) => setField("status", event.target.value as ArticleFormState["status"])} className="rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium">
            <option value="draft">ฉบับร่าง</option>
            <option value="published">เผยแพร่</option>
          </select>
          <Button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-6 hover:bg-blue-700"><Save className="mr-2 h-4 w-4" />{saving ? "กำลังบันทึก..." : "บันทึก"}</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="border-b pb-4 text-lg font-semibold">ข้อมูลบทความ</h2>
            <div className="space-y-2"><Label htmlFor="title">ชื่อบทความ</Label><Input id="title" required value={form.title} onChange={(event) => setField("title", event.target.value)} className="h-12 text-base" /></div>
            <div className="space-y-2"><Label htmlFor="slug">URL Slug</Label><Input id="slug" required disabled={!isNew} value={form.slug} onChange={(event) => setField("slug", event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="post-tension-guide" /><p className="text-xs text-slate-400">ใช้ภาษาอังกฤษตัวเล็ก ตัวเลข และขีดกลาง</p></div>
            <div className="space-y-2"><Label htmlFor="description">คำอธิบายหลัก</Label><textarea id="description" required value={form.description} onChange={(event) => setField("description", event.target.value)} className={textAreaClass} /></div>
            <div className="space-y-2"><Label htmlFor="excerpt">ข้อความย่อบนหน้ารวม</Label><textarea id="excerpt" required value={form.excerpt} onChange={(event) => setField("excerpt", event.target.value)} className={textAreaClass} /></div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between border-b pb-4"><div><h2 className="text-lg font-semibold">เนื้อหาหลัก</h2><p className="mt-1 text-xs text-slate-500">หนึ่งบรรทัดต่อหนึ่งย่อหน้าหรือ bullet</p></div><Button type="button" variant="outline" size="sm" onClick={() => setField("sections", [...form.sections, { heading: "", paragraphs: [""], bullets: [], callout: "", images: [] }])}><Plus className="mr-1 h-4 w-4" />เพิ่มหัวข้อ</Button></div>
            {form.sections.map((section, index) => (
              <div key={index} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">{index + 1}</span><Input required value={section.heading} onChange={(event) => updateSection(index, { heading: event.target.value })} placeholder="หัวข้อย่อย" className="bg-white font-semibold" /><Button type="button" variant="ghost" size="icon" disabled={form.sections.length === 1} onClick={() => setField("sections", form.sections.filter((_, itemIndex) => itemIndex !== index))} className="text-rose-600"><Trash2 className="h-4 w-4" /></Button></div>
                <textarea required value={section.paragraphs.join("\n")} onChange={(event) => updateSection(index, { paragraphs: event.target.value.split("\n") })} className={textAreaClass} placeholder="เนื้อหาแต่ละย่อหน้า (ขึ้นบรรทัดใหม่เพื่อแยกย่อหน้า)" />
                <textarea value={(section.bullets || []).join("\n")} onChange={(event) => updateSection(index, { bullets: lines(event.target.value) })} className={textAreaClass} placeholder="รายการ bullet (ถ้ามี) หนึ่งรายการต่อบรรทัด" />
                <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <Label>ภาพประกอบหัวข้อนี้ (ไม่บังคับ)</Label>
                      <p className="mt-1 text-xs text-slate-500">เพิ่มได้หลายภาพ ภาพจะโหลดเมื่อเลื่อนมาถึงเพื่อไม่ให้หน้าเว็บช้า</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateSection(index, {
                        images: [...(section.images || []), { src: "", alt: "", caption: "" }],
                      })}
                    >
                      <Plus className="mr-1 h-4 w-4" />เพิ่มภาพ
                    </Button>
                  </div>
                  {(section.images || []).map((image, imageIndex) => (
                    <div key={imageIndex} className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-700">ภาพที่ {imageIndex + 1}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => updateSection(index, {
                            images: (section.images || []).filter((_, itemIndex) => itemIndex !== imageIndex),
                          })}
                          className="text-rose-600"
                          aria-label={`ลบภาพที่ ${imageIndex + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <ImageUpload
                        value={image.src}
                        onChange={(value) => updateSection(index, {
                          images: (section.images || []).map((item, itemIndex) => itemIndex === imageIndex ? { ...item, src: value } : item),
                        })}
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Alt Text สำหรับ SEO</Label>
                          <Input
                            required={Boolean(image.src)}
                            value={image.alt}
                            onChange={(event) => updateSection(index, {
                              images: (section.images || []).map((item, itemIndex) => itemIndex === imageIndex ? { ...item, alt: event.target.value } : item),
                            })}
                            placeholder="เช่น ทีมงานติดตั้งลวด Post-Tension"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>คำบรรยายใต้ภาพ (ไม่บังคับ)</Label>
                          <Input
                            value={image.caption || ""}
                            onChange={(event) => updateSection(index, {
                              images: (section.images || []).map((item, itemIndex) => itemIndex === imageIndex ? { ...item, caption: event.target.value } : item),
                            })}
                            placeholder="อธิบายสิ่งที่ลูกค้าเห็นในภาพ"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <textarea value={section.callout || ""} onChange={(event) => updateSection(index, { callout: event.target.value })} className={textAreaClass} placeholder="กล่องหมายเหตุสำคัญ (ถ้ามี)" />
              </div>
            ))}
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="border-b pb-4 text-lg font-semibold">สรุปและเช็กลิสต์</h2>
            <div className="space-y-2"><Label>สรุปก่อนเริ่ม (หนึ่งรายการต่อบรรทัด)</Label><textarea required value={form.summary.join("\n")} onChange={(event) => setField("summary", event.target.value.split("\n"))} className={textAreaClass} /></div>
            <div className="space-y-2"><Label>เช็กลิสต์ก่อนส่งประเมิน (หนึ่งรายการต่อบรรทัด)</Label><textarea required value={form.checklist.join("\n")} onChange={(event) => setField("checklist", event.target.value.split("\n"))} className={textAreaClass} /></div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between border-b pb-4"><h2 className="text-lg font-semibold">คำถามที่พบบ่อย (FAQ)</h2><Button type="button" variant="outline" size="sm" onClick={() => setField("faq", [...form.faq, { question: "", answer: "" }])}><Plus className="mr-1 h-4 w-4" />เพิ่ม FAQ</Button></div>
            {form.faq.map((item, index) => <div key={index} className="space-y-3 rounded-xl border border-slate-200 p-4"><div className="flex gap-2"><Input required value={item.question} onChange={(event) => updateFaq(index, { question: event.target.value })} placeholder="คำถาม" /><Button type="button" variant="ghost" size="icon" disabled={form.faq.length === 1} onClick={() => setField("faq", form.faq.filter((_, itemIndex) => itemIndex !== index))} className="text-rose-600"><Trash2 className="h-4 w-4" /></Button></div><textarea required value={item.answer} onChange={(event) => updateFaq(index, { answer: event.target.value })} className={textAreaClass} placeholder="คำตอบ" /></div>)}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="border-b pb-4 text-lg font-semibold">การแสดงผล</h2>
            <div className="space-y-2"><Label>หมวดหมู่</Label><Input required value={form.category} onChange={(event) => setField("category", event.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>วันที่เผยแพร่</Label><Input type="date" required value={form.publishedAt} onChange={(event) => setField("publishedAt", event.target.value)} /></div><div className="space-y-2"><Label>เวลาอ่าน</Label><Input required value={form.readTime} onChange={(event) => setField("readTime", event.target.value)} /></div></div>
            <div className="space-y-2"><Label>ภาพหน้าปก</Label><ImageUpload value={form.image} onChange={(value) => setField("image", value || "/images/about-factory-interior.png")} /><p className="text-xs text-slate-400">ยังไม่พร้อมใช้ภาพใหม่ได้ ภาพเดิมจะทำหน้าที่เป็น placeholder</p></div>
            <div className="space-y-2"><Label>Alt Text ของภาพ</Label><Input required value={form.imageAlt} onChange={(event) => setField("imageAlt", event.target.value)} /></div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="border-b pb-4 text-lg font-semibold">SEO</h2>
            <div className="space-y-2"><Label>SEO Title</Label><Input required value={form.seoTitle} onChange={(event) => setField("seoTitle", event.target.value)} /><p className="text-xs text-slate-400">แนะนำไม่เกินประมาณ 60 ตัวอักษร</p></div>
            <div className="space-y-2"><Label>Meta Description</Label><textarea required value={form.description} onChange={(event) => setField("description", event.target.value)} className={textAreaClass} /></div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="border-b pb-4 text-lg font-semibold">ลิงก์สินค้า</h2>
            <div className="space-y-2"><Label>ข้อความลิงก์</Label><Input required value={form.product.label} onChange={(event) => setField("product", { ...form.product, label: event.target.value })} /></div>
            <div className="space-y-2"><Label>URL</Label><Input required value={form.product.href} onChange={(event) => setField("product", { ...form.product, href: event.target.value })} /></div>
          </section>
        </aside>
      </div>
    </form>
  );
}
