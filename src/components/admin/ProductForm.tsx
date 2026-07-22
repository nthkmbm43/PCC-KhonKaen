/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, ArrowLeft, Plus, Trash2, GripVertical, Image as ImageIcon, ArrowUp, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./ImageUpload";
import toast from "react-hot-toast";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { BlockHeader } from "./cms/BlockHeader";
import { FileText } from "lucide-react";

// Schema for a rich text / modular block
const blockSchema = z.object({
  id: z.string(),
  type: z.string(),
  isVisible: z.boolean().optional().default(true),
  title: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  items: z.array(z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
  })).optional(),
  autoplay: z.boolean().optional(),
  delay: z.coerce.number().optional(),
  bullets: z.array(z.string()).optional(),
  layout: z.string().optional(),
  backgroundStyle: z.string().optional(),
});

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortTitle: z.string().min(1, "Short title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  category: z.string().optional(),
  badge: z.string().optional(),
  sortOrder: z.coerce.number().optional(),
  isFeatured: z.boolean(),
  status: z.enum(['draft', 'published']),
  
  // Layout & Styling
  imageLayout: z.enum(['normal', 'full-width']),
  highlights: z.array(z.string()),
  
  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  ogImage: z.string().optional(),
  
  // Content blocks
  content: z.array(blockSchema),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm({ initialData, productId }: { initialData?: Omit<Partial<ProductFormValues>, 'isFeatured' | 'content'> & { isFeatured?: string | boolean; workflowState?: string; status?: string; content?: unknown; imageLayout?: string; highlights?: unknown; badge?: string | null; sortOrder?: number | null }; productId: string }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const isNew = productId === "new";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    mode: 'onChange',
    defaultValues: {
      title: initialData?.title || "",
      shortTitle: initialData?.shortTitle || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      image: initialData?.image || "",
      category: initialData?.category || "general",
      badge: initialData?.badge || "",
      sortOrder: initialData?.sortOrder ?? 0,
      isFeatured: initialData?.isFeatured === true || initialData?.isFeatured === 'true',
      status: (initialData?.workflowState ?? initialData?.status ?? "published") as "draft" | "published",
      
      seoTitle: initialData?.seoTitle || "",
      seoDescription: initialData?.seoDescription || "",
      seoKeywords: initialData?.seoKeywords || "",
      ogImage: initialData?.ogImage || "",
      
      imageLayout: (initialData?.imageLayout as 'normal' | 'full-width') || "normal",
      highlights: (Array.isArray(initialData?.highlights) ? initialData.highlights : 
                  (typeof initialData?.highlights === 'string' ? JSON.parse(initialData.highlights) : [])) as string[],

      content: initialData?.content ? (typeof initialData.content === 'string' ? JSON.parse(initialData.content) : initialData.content).map((b: any) => ({ ...b, id: b.id || Math.random().toString(36).substring(7), isVisible: b.isVisible !== false })) : [],
    },
  });

  const { fields: contentBlocks, append: appendBlock, remove: removeBlock, move: moveBlock, insert: insertBlock } = useFieldArray({
    control: form.control,
    name: "content",
  });

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
    control: form.control,
    name: "highlights" as never, // cast due to zod string array
  });

  async function onSubmit(data: ProductFormValues) {
    setIsSaving(true);
    try {
      const url = isNew ? `/api/products` : `/api/products/${productId}`;
      const method = isNew ? "POST" : "PUT";
      
      const payload: Record<string, unknown> = {
        ...data,
        content: data.content,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(isNew ? "สร้างสินค้าเรียบร้อยแล้ว" : "บันทึกการแก้ไขเรียบร้อยแล้ว");
        router.push("/admin/products");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดที่ไม่คาดคิด");
    } finally {
      setIsSaving(false);
    }
  }

  const addBlock = (type: string) => {
    appendBlock({
      id: Math.random().toString(36).substring(7),
      type,
      isVisible: true,
      title: type === "gallery" ? "ผลงานชิ้นนี้" : "",
      content: type === "gallery" ? "รวมภาพผลงานจริง ตั้งแต่ผลงานสำเร็จ การขนส่ง และการติดตั้งหน้างาน" : "",
      image: "",
      items: type === "gallery" ? [
        { title: "ผลงานชิ้นนี้", description: "ภาพผลงานหลังติดตั้งเสร็จ แสดงภาพรวมของสินค้าในพื้นที่จริง", image: "" },
        { title: "ขนส่ง", description: "ขั้นตอนการขนส่งสินค้าไปยังหน้างานอย่างเป็นระบบ", image: "" },
        { title: "ติดตั้ง", description: "ขั้นตอนการติดตั้งโดยทีมงานหน้างาน พร้อมควบคุมคุณภาพ", image: "" },
      ] : [],
      autoplay: type === "gallery",
      delay: 4500,
      bullets: []
    });
  };

  const handlePreview = async () => {
    // Force status to draft for preview if it's new (or we can just save current state)
    // Actually, we can just save it. The backend will generate a preview token if needed, or we just save the form and redirect to preview.
    setIsSaving(true);
    try {
      const data = form.getValues();
      const url = isNew ? `/api/products` : `/api/products/${productId}`;
      const method = isNew ? "POST" : "PUT";
      
      const payload: Record<string, unknown> = {
        ...data,
        content: data.content,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        const slug = saved.slug || data.slug;
        const token = saved.rawPreviewToken;
        toast.success("บันทึกฉบับร่างและกำลังเปิด Preview");
        
        let previewUrl = `/api/preview?slug=${slug}&type=product`;
        if (token) {
          previewUrl += `&token=${token}`;
        }
        
        window.open(previewUrl, "_blank");
        if (isNew) {
          router.push(`/admin/products/${saved.id}`);
        }
      } else {
        toast.error("เกิดข้อผิดพลาดในการบันทึก Preview");
      }
    } catch (_err) {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6 max-w-4xl mx-auto pb-20">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button type="button" variant="ghost" size="icon" className="rounded-xl">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{isNew ? "สร้างสินค้าใหม่" : "แก้ไขสินค้า"}</h1>
            </div>
          </div>
          
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:justify-end">
            <div className="mr-auto flex items-center gap-2 sm:mr-4">
              <Label htmlFor="status" className="text-sm font-medium text-slate-600">เผยแพร่</Label>
              <Switch 
                id="status" 
                checked={form.watch("status") === "published"}
                onCheckedChange={(checked) => form.setValue("status", checked ? "published" : "draft")}
              />
            </div>
            
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={handlePreview}
              className="min-w-0 flex-1 rounded-xl px-4 sm:flex-none sm:px-6"
            >
              Preview
            </Button>

            <Button
              type="submit"
              disabled={isSaving}
              className="min-w-0 flex-1 rounded-xl bg-blue-600 px-4 text-white shadow-sm shadow-blue-200 hover:bg-blue-700 sm:flex-none sm:px-6"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info */}
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-slate-800 border-b pb-4">ข้อมูลทั่วไป</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">ชื่อสินค้าเต็ม (Full Title)</Label>
                  <Input id="title" {...form.register("title")} placeholder="เช่น แผ่นพื้นสำเร็จรูป มอก. แข็งแรง ได้มาตรฐาน" className="text-lg py-6" />
                  {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>}
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="shortTitle">ชื่อย่อ (Short Title) - แสดงใน Navbar</Label>
                    <Input id="shortTitle" {...form.register("shortTitle")} placeholder="เช่น แผ่นพื้นสำเร็จรูป" />
                    {form.formState.errors.shortTitle && <p className="text-sm text-red-500">{form.formState.errors.shortTitle.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input id="slug" {...form.register("slug")} placeholder="เช่น precast-slab" />
                    {form.formState.errors.slug && <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">รายละเอียดแบบย่อ (Description)</Label>
                  <textarea id="description"
                    {...form.register("description")} 
                    className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="คำอธิบายสรุปจุดเด่นของสินค้า"
                  />
                </div>

                {/* Highlights Array */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <Label>จุดเด่นของบริการ (Service Highlights)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendHighlight("จุดเด่นใหม่")} className="gap-1 h-8">
                      <Plus className="w-3.5 h-3.5" /> เพิ่มจุดเด่น
                    </Button>
                  </div>
                  {highlightFields.length === 0 && (
                    <p className="text-sm text-slate-400 italic">ยังไม่มีจุดเด่นบริการ</p>
                  )}
                  <div className="space-y-2">
                    {highlightFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <Input
                          {...form.register(`highlights.${index}` as const)}
                          placeholder="เช่น แข็งแรง ทนทาน"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeHighlight(index)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Page Builder / Blocks */}
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 border-b pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold text-slate-800">รายละเอียดเนื้อหา (Content Builder)</h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => addBlock('text')} className="gap-1 bg-white">
                        <Plus className="w-3.5 h-3.5" /> Text
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => addBlock('image')} className="gap-1 bg-white">
                        <ImageIcon className="w-3.5 h-3.5" /> Image
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => addBlock('gallery')} className="gap-1 bg-white">
                        <ImageIcon className="w-3.5 h-3.5" /> Gallery
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => addBlock('html')} className="gap-1 bg-white">
                        <Plus className="w-3.5 h-3.5" /> HTML
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">สร้างเนื้อหาของสินค้านี้แบบเป็นบล็อค</p>
                </div>
              </div>

              <div className="space-y-4">
                {contentBlocks.length === 0 && (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-500 text-sm">ยังไม่มีเนื้อหา เพิ่มบล็อคเนื้อหาจากปุ่มด้านบน</p>
                  </div>
                )}
                
                {contentBlocks.length > 0 && (
                  <Accordion className="space-y-4">
                    {contentBlocks.map((field, index) => {
                      const blockType = form.watch(`content.${index}.type`);
                      const blockLabels: Record<string, { title: string; subtitle: string }> = {
                        text: {
                          title: "Text Content",
                          subtitle: "บล็อกข้อความ / รายละเอียดสินค้า",
                        },
                        image: {
                          title: "Image Block",
                          subtitle: "บล็อกรูปภาพเดี่ยว พร้อมคำอธิบายภาพ",
                        },
                        gallery: {
                          title: "Gallery Block",
                          subtitle: "บล็อกแกลเลอรีรูปภาพหลายรูป",
                        },
                        html: {
                          title: "HTML Embed",
                          subtitle: "บล็อก HTML / โค้ดฝังพิเศษ",
                        },
                      };
                      const customTitle = form.watch(`content.${index}.title`);
                      const blockLabel = blockLabels[blockType] || {
                        title: "Content Block",
                        subtitle: "บล็อกเนื้อหา",
                      };
                      const blockTitle = customTitle
                        ? `${blockLabel.subtitle} - ${customTitle}`
                        : blockLabel.subtitle;

                      return (
                        <AccordionItem key={field.id} value={field.id} className={`overflow-hidden bg-slate-50 border rounded-xl shadow-sm ${form.watch(`content.${index}.isVisible`) === false ? 'opacity-70' : ''}`}>
                          <BlockHeader
                            title={blockLabel.title}
                            subtitle={blockTitle}
                            icon={blockType === "image" || blockType === "gallery" ? <ImageIcon className="w-4 h-4" /> : blockType === "html" ? <span className="font-mono font-bold text-[10px]">{"</>"}</span> : <FileText className="w-4 h-4" />}
                            isEditMode={true}
                            isVisible={form.watch(`content.${index}.isVisible`)}
                            canMoveUp={index > 0}
                            canMoveDown={index < contentBlocks.length - 1}
                            onMoveUp={() => moveBlock(index, index - 1)}
                            onMoveDown={() => moveBlock(index, index + 1)}
                            onRemove={() => removeBlock(index)}
                            onDuplicate={() => {
                              const currentData = form.getValues(`content.${index}`);
                              const newIndex = index + 1;
                              insertBlock(newIndex, { ...currentData, id: Math.random().toString(36).substring(7) });
                            }}
                            onToggleVisibility={(visible) => form.setValue(`content.${index}.isVisible`, visible, { shouldDirty: true })}
                          />

                          <AccordionContent className="border-t bg-slate-50/30 px-3 pb-5 pt-2 sm:px-6 sm:pb-6">
                            {blockType === 'text' && (
                              <div className="space-y-3 pt-4">
                                <Input {...form.register(`content.${index}.title`)} placeholder="หัวข้อ (ถ้ามี)" className="bg-white font-medium" />
                                <textarea 
                                  {...form.register(`content.${index}.content`)} 
                                  className="flex min-h-[120px] w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  placeholder="พิมพ์เนื้อหาที่นี่..."
                                />
                              </div>
                            )}

                            {blockType === 'image' && (
                              <div className="space-y-3 pt-4">
                                <ImageUpload 
                                  value={form.watch(`content.${index}.image`) || ""} 
                                  onChange={(val) => form.setValue(`content.${index}.image`, val)} 
                                />
                                <Input {...form.register(`content.${index}.title`)} placeholder="คำอธิบายรูปภาพ (Alt Text)" className="bg-white" />
                              </div>
                            )}

                            {blockType === 'gallery' && (
                              <div className="space-y-5 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <Label>หัวข้อแกลเลอรี</Label>
                                    <Input {...form.register(`content.${index}.title`)} placeholder="เช่น ผลงานชิ้นนี้" className="bg-white font-medium" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>หน่วงเวลาเลื่อนอัตโนมัติ (ms)</Label>
                                    <Input
                                      type="number"
                                      min={1500}
                                      step={500}
                                      {...form.register(`content.${index}.delay`, { valueAsNumber: true })}
                                      placeholder="4500"
                                      className="bg-white"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>คำอธิบายแกลเลอรี</Label>
                                  <textarea
                                    {...form.register(`content.${index}.content`)}
                                    className="flex min-h-[80px] w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="อธิบายภาพรวมของชุดภาพนี้"
                                  />
                                </div>

                                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                                  <div>
                                    <Label className="font-semibold text-slate-700">เลื่อนอัตโนมัติ</Label>
                                    <p className="text-xs text-slate-500">เปิด/ปิดการเลื่อนภาพเองบนหน้าเว็บ</p>
                                  </div>
                                  <Switch
                                    checked={form.watch(`content.${index}.autoplay`) !== false}
                                    onCheckedChange={(checked) => form.setValue(`content.${index}.autoplay`, checked, { shouldDirty: true })}
                                  />
                                </div>

                                {[0, 1, 2].map((itemIndex) => (
                                  <div key={itemIndex} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                      <Label className="font-bold text-slate-800">
                                        {itemIndex === 0 ? "ภาพที่ 1: ผลงานชิ้นนี้" : itemIndex === 1 ? "ภาพที่ 2: ขนส่ง" : "ภาพที่ 3: ติดตั้ง"}
                                      </Label>
                                      <span className="text-xs text-slate-400">แสดงเป็นสไลด์ {itemIndex + 1}</span>
                                    </div>
                                    <ImageUpload
                                      value={form.watch(`content.${index}.items.${itemIndex}.image`) || ""}
                                      onChange={(val) => form.setValue(`content.${index}.items.${itemIndex}.image`, val, { shouldDirty: true })}
                                    />
                                    <Input
                                      {...form.register(`content.${index}.items.${itemIndex}.title`)}
                                      placeholder={itemIndex === 0 ? "ผลงานชิ้นนี้" : itemIndex === 1 ? "ขนส่ง" : "ติดตั้ง"}
                                      className="bg-white"
                                    />
                                    <textarea
                                      {...form.register(`content.${index}.items.${itemIndex}.description`)}
                                      className="flex min-h-[70px] w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                      placeholder="อธิบายว่าภาพนี้คืออะไร"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {blockType === 'html' && (
                              <div className="space-y-3 pt-4">
                                <textarea 
                                  {...form.register(`content.${index}.content`)} 
                                  className="flex min-h-[150px] w-full rounded-lg border border-input bg-slate-900 text-green-400 font-mono px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                  placeholder="<div>Your Raw HTML Code</div>"
                                />
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* Meta & Display */}
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-slate-800 border-b pb-4">การแสดงผล</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageLayout">รูปแบบการแสดงผลรูปภาพ (Image Display Layout)</Label>
                  <select id="imageLayout"
                    {...form.register("imageLayout")} 
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="normal">ปกติ (Normal - จัดให้อยู่ในกรอบ)</option>
                    <option value="full-width">กว้างเต็มจอ (Full-Width - ภาพขนาดใหญ่ด้านบนสุด)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">หมวดหมู่ (Category)</Label>
                  <select id="category"
                    {...form.register("category")} 
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="general">ทั่วไป (General)</option>
                    <option value="precast">พรีแคสท์ (Precast)</option>
                    <option value="service">บริการ (Service)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="badge">ป้ายกำกับ (Badge)</Label>
                  <select id="badge"
                    {...form.register("badge")} 
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">ไม่มี (None)</option>
                    <option value="มาแรง">มาแรง (Hot)</option>
                    <option value="ใหม่">ใหม่ (New)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortOrder">ลำดับการแสดงผล (ยิ่งน้อยยิ่งขึ้นก่อน)</Label>
                  <Input 
                    id="sortOrder" 
                    type="number" 
                    {...form.register("sortOrder", { valueAsNumber: true })} 
                    placeholder="เช่น 1, 2, 3" 
                  />
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="space-y-0.5">
                    <Label className="font-semibold text-slate-700">สินค้าแนะนำ</Label>
                    <p className="text-xs text-slate-500">แสดงเด่นในหน้าแรก</p>
                  </div>
                  <Switch 
                    checked={form.watch("isFeatured")} 
                    onCheckedChange={(checked) => form.setValue("isFeatured", checked)} 
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <Label>รูปภาพหน้าปก (Featured Image)</Label>
                  <ImageUpload
                    value={form.watch("image") || ""}
                    onChange={(val) => form.setValue("image", val, { shouldDirty: true })}
                  />
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex items-center gap-2 border-b pb-4">
                <span className="text-xl">🔍</span>
                <h2 className="text-lg font-semibold text-slate-800">ตั้งค่า SEO</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input id="seoTitle" {...form.register("seoTitle")} placeholder="ไตเติลสำหรับ Google Search" />
                  <p className="text-xs text-slate-400">ถ้าเว้นว่างไว้ จะใช้ชื่อสินค้าแทน</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <textarea id="seoDescription"
                    {...form.register("seoDescription")} 
                    className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="รายละเอียดสั้นๆ ที่จะโชว์บน Google"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoKeywords">Keywords (คั่นด้วยลูกน้ำ)</Label>
                  <Input id="seoKeywords" {...form.register("seoKeywords")} placeholder="สินค้า, แผ่นพื้น, รับเหมา..." />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <Label>Social Share Image (OG Image)</Label>
                  <ImageUpload
                    value={form.watch("ogImage") || ""}
                    onChange={(val) => form.setValue("ogImage", val, { shouldDirty: true })}
                  />
                  <p className="text-xs text-slate-400">รูปภาพที่จะโชว์เวลาแชร์ลิงก์ลง Facebook หรือ LINE</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>
    </FormProvider>
  );
}
