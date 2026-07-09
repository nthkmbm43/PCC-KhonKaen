/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ArrowLeft, GripVertical, Settings, FileText, Image as ImageIcon, Unlock, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RichTextEditor } from "./RichTextEditor";
import { ImageUpload } from "./ImageUpload";
import { BlockHeader } from "./cms/BlockHeader";
import { NestedItemsList } from "./cms/NestedItemsList";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const pageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(["draft", "published"]),
  content: z.array(
    z.object({
      id: z.string().optional(),
      blockType: z.string(),
      isVisible: z.boolean().optional().default(true),
      headline: z.string().optional(),
      description: z.string().optional(),
      eyebrow: z.string().optional(),
      image: z.string().optional(),
      backgroundImage: z.string().optional(),
      ctaText: z.string().optional(),
      ctaHref: z.string().optional(),
      secondaryCtaText: z.string().optional(),
      secondaryCtaHref: z.string().optional(),
      layout: z.string().optional(),
      backgroundStyle: z.string().optional(),
      textAlign: z.string().optional(),
      paddingTop: z.string().optional(),
      paddingBottom: z.string().optional(),
      marginTop: z.string().optional(),
      marginBottom: z.string().optional(),
      animation: z.string().optional(),
      overlayOpacity: z.number().optional(),
      textColor: z.string().optional(),
      badgeText: z.string().optional(),
      customCss: z.string().optional(),
      items: z.array(z.any()).optional(),
      columns: z.array(
        z.object({
          size: z.string().optional(),
          content: z.string().optional(),
        })
      ).optional(),
    })
  ).superRefine((blocks, ctx) => {
    // Add validations for specific block types if needed
    blocks.forEach((block, index) => {
      if (block.blockType === "hero" && !block.headline) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Hero headline is required",
          path: [index, "headline"],
        });
      }
    });
  }),
});

type PageFormValues = z.infer<typeof pageSchema>;

export function PageForm({ initialData, pageId }: { initialData?: Partial<PageFormValues> & { workflowState?: string; status?: string }; pageId?: string }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema) as any,
    mode: "onChange",
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      seoTitle: initialData?.seoTitle ?? "",
      seoDescription: initialData?.seoDescription ?? "",
      status: (initialData?.workflowState ?? initialData?.status ?? "published") as "draft" | "published",
      content: Array.isArray(initialData?.content) ? initialData.content.map((b: any) => ({ ...b, id: b.id || Math.random().toString(36).substring(7), blockType: b.blockType || b.type, isVisible: b.isVisible !== false })) : [],
    },
  });

  const { fields, append, remove, move, insert } = useFieldArray({
    name: "content",
    control: form.control,
  });

  async function onSubmit(data: PageFormValues) {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/pages${pageId ? `/${pageId}` : ""}`, {
        method: pageId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Page saved successfully!");
        router.push("/admin/pages");
        router.refresh();
      } else {
        toast.error("Failed to save page.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <Link href="/admin/pages">
              <Button variant="outline" size="icon" type="button">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">
              {pageId ? "แก้ไขเพจ" : "สร้างเพจใหม่"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {!isEditMode ? (
              <Button
                type="button"
                onClick={() => setIsEditMode(true)}
                className="shrink-0 bg-slate-800 hover:bg-slate-700 text-white shadow-sm rounded-xl px-5"
              >
                <Unlock className="w-4 h-4 mr-2" />
                ปลดล็อคเพื่อแก้ไข
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditMode(false)}
                  className="rounded-xl"
                >
                  ยกเลิก
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger render={
                    <Button type="button" disabled={isSaving || !form.formState.isValid} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-5 shadow-sm shadow-blue-200">
                      <Save className="w-4 h-4 mr-2 hidden sm:block" />
                      {isSaving ? "กำลังบันทึก..." : "บันทึกเพจ"}
                    </Button>
                  } />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>ยืนยันการบันทึกเพจ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        ข้อมูลที่คุณแก้ไขทั้งหมดจะถูกบันทึกเข้าสู่ระบบ และอาจส่งผลต่อการแสดงผลบนหน้าเว็บไซต์
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                      <AlertDialogAction onClick={form.handleSubmit(onSubmit as any)} className="bg-blue-600 hover:bg-blue-700">
                        ยืนยันการบันทึก
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-300 ${!isEditMode ? "opacity-60 pointer-events-none grayscale-[0.2]" : ""}`}>
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Home" {...form.register("title")} />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" placeholder="home" {...form.register("slug")} />
                  {form.formState.errors.slug && (
                    <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle>Page Builder</CardTitle>
                  <CardDescription>Drag and drop blocks to build your page.</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isEditMode && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-slate-500 font-medium mr-2">เพิ่มบล็อก:</span>
                      <Button type="button" variant="outline" size="sm" onClick={() => append({ id: Math.random().toString(36).substring(7), blockType: 'hero', isVisible: true })}>
                        <ImageIcon className="w-3.5 h-3.5 mr-1" /> Hero
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => append({ id: Math.random().toString(36).substring(7), blockType: 'text', isVisible: true })}>
                        <FileText className="w-3.5 h-3.5 mr-1" /> Rich Text
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => append({ id: Math.random().toString(36).substring(7), blockType: 'image', isVisible: true })}>
                        <ImageIcon className="w-3.5 h-3.5 mr-1" /> Image
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => append({ id: Math.random().toString(36).substring(7), blockType: 'cta', isVisible: true })}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> CTA Banner
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => append({ id: Math.random().toString(36).substring(7), blockType: 'featureGrid', isVisible: true })}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Products
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => append({ id: Math.random().toString(36).substring(7), blockType: 'whyUs', isVisible: true })}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Why Us
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => append({ id: Math.random().toString(36).substring(7), blockType: 'process', isVisible: true })}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Process
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => append({ id: Math.random().toString(36).substring(7), blockType: 'testimonial', isVisible: true })}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Testimonial
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => append({ id: Math.random().toString(36).substring(7), blockType: 'stats', isVisible: true })}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Stats
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => append({ id: Math.random().toString(36).substring(7), blockType: 'contactForm', isVisible: true })}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Contact Form
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => append({ id: Math.random().toString(36).substring(7), blockType: 'customCode', isVisible: true })}>
                        <span className="font-mono font-bold text-[10px] mr-1">{"</>"}</span> HTML/CSS
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6 bg-slate-50/50">
                <Accordion className="w-full space-y-4" defaultValue={fields.map(f => f.id)}>
                  {fields.map((field, index) => {
                     
                    const blockType = form.watch(`content.${index}.blockType`);
                    const blockTitle = blockType === "hero" ? form.watch(`content.${index}.headline`) || "Hero Block" : "Content Block";
                    
                    return (
                      <AccordionItem key={field.id} value={field.id} className={`bg-white border rounded-lg shadow-sm px-2 ${form.watch(`content.${index}.isVisible`) === false ? 'opacity-70' : ''}`}>
                        <BlockHeader
                          title={blockType}
                          subtitle={blockTitle}
                          icon={blockType === "hero" || blockType === "image" ? <ImageIcon className="w-4 h-4" /> : blockType === "customCode" ? <span className="font-mono font-bold text-xs">{"</>"}</span> : <FileText className="w-4 h-4" />}
                          isEditMode={isEditMode}
                          isVisible={form.watch(`content.${index}.isVisible`)}
                          canMoveUp={index > 0}
                          canMoveDown={index < fields.length - 1}
                          onMoveUp={() => move(index, index - 1)}
                          onMoveDown={() => move(index, index + 1)}
                          onRemove={() => remove(index)}
                          onDuplicate={() => {
                            const currentData = form.getValues(`content.${index}`);
                            insert(index + 1, { ...currentData, id: Math.random().toString(36).substring(7) });
                          }}
                          onToggleVisibility={(visible) => form.setValue(`content.${index}.isVisible`, visible, { shouldDirty: true })}
                        />
                        <AccordionContent className="pt-2 pb-6 px-6 border-t bg-slate-50/30">
                          {!["text", "image", "customCode"].includes(blockType) && (
                            <div className="space-y-6 pt-4">
                              <div className="space-y-2">
                                <Label htmlFor={`content.${index}.headline`} className="text-slate-600">Headline (หัวข้อหลัก)</Label>
                                <Input id={`content.${index}.headline`} className="bg-white" {...form.register(`content.${index}.headline` as const)} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`content.${index}.description`} className="text-slate-600">Description (คำอธิบายเพิ่มเติม)</Label>
                                <Textarea id={`content.${index}.description`} className="bg-white h-24" {...form.register(`content.${index}.description` as const)} />
                              </div>
                            </div>
                          )}

                          {["image"].includes(blockType) && (
                            <div className="space-y-6 pt-4">
                              <div className="space-y-2">
                                <Label className="text-slate-600">Image</Label>
                                <ImageUpload 
                                  value={form.watch(`content.${index}.image`) || ""}
                                  onChange={(val) => form.setValue(`content.${index}.image`, val, { shouldDirty: true })}
                                />
                              </div>
                            </div>
                          )}

                          {["hero", "cta"].includes(blockType) && (
                            <div className="space-y-6 pt-4 border-t border-slate-200 mt-4">
                              <div className="space-y-2">
                                <Label className="text-slate-600">Background Image</Label>
                                <ImageUpload 
                                  value={form.watch(`content.${index}.backgroundImage`) || ""}
                                  onChange={(val) => form.setValue(`content.${index}.backgroundImage`, val, { shouldDirty: true })}
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`content.${index}.ctaText`} className="text-slate-600">CTA Text (ปุ่ม)</Label>
                                  <Input id={`content.${index}.ctaText`} placeholder="เช่น ติดต่อเรา" className="bg-white" {...form.register(`content.${index}.ctaText` as const)} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`content.${index}.ctaHref`} className="text-slate-600">CTA Link (ลิงก์)</Label>
                                  <Input id={`content.${index}.ctaHref`} placeholder="เช่น /contact หรือ https://..." className="bg-white" {...form.register(`content.${index}.ctaHref` as const)} />
                                </div>
                              </div>
                            </div>
                          )}

                          {blockType === "text" && (
                            <div className="space-y-6 pt-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between mb-2">
                                  <Label className="text-slate-600">Rich Text Content</Label>
                                </div>
                                <RichTextEditor 
                                  value={form.watch(`content.${index}.description`) || ""} 
                                  onChange={(val) => {
                                    form.setValue(`content.${index}.description`, val, { shouldDirty: true });
                                  }} 
                                />
                              </div>
                            </div>
                          )}

                          {blockType === "customCode" && (
                            <div className="space-y-6 pt-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between mb-2">
                                  <Label className="text-slate-600">Custom Code (HTML / CSS / JS)</Label>
                                </div>
                                <Textarea 
                                  className="bg-slate-900 text-green-400 font-mono text-sm h-64 p-4 border-slate-700 focus:ring-slate-500" 
                                  placeholder="<div class='custom-box'>...</div>"
                                  {...form.register(`content.${index}.description` as const)} 
                                />
                                <p className="text-xs text-slate-500">คุณสามารถเขียน HTML หรือ &lt;style&gt; และ &lt;script&gt; ได้ที่นี่</p>
                              </div>
                            </div>
                          )}

                          {/* Common Block Settings / Nested Items */}
                          {["featureGrid", "whyUs", "process", "stats", "testimonial"].includes(blockType) && (
                            <NestedItemsList 
                              nestIndex={index} 
                              control={form.control as any} 
                              blockType={blockType} 
                              watch={form.watch as any} 
                              setValue={form.setValue} 
                              isEditMode={isEditMode}
                            />
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
                {fields.length === 0 && (
                  <div className="text-center py-16 text-gray-500 border-2 border-dashed rounded-lg bg-white">
                    <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-lg font-medium text-gray-900">No blocks added yet</p>
                    <p className="text-sm">Click the buttons above to add content to this page.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-500" />
                  Publishing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    onValueChange={(val) => form.setValue("status", val as "draft" | "published")} 
                    defaultValue={form.getValues("status")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">Meta Title</Label>
                  <Input id="seoTitle" {...form.register("seoTitle")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seoDescription">Meta Description</Label>
                  <Textarea id="seoDescription" className="h-24" {...form.register("seoDescription")} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

// Dummy icon for save button
const Save = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);
