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
import { Plus, Trash2, ArrowLeft, GripVertical, Settings, FileText, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RichTextEditor } from "./RichTextEditor";

const pageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(["draft", "published"]),
  content: z.array(
    z.object({
      blockType: z.string(),
      headline: z.string().optional(),
      description: z.string().optional(),
      columns: z.array(
        z.object({
          size: z.string().optional(),
          content: z.string().optional(),
        })
      ).optional(),
    })
  ),
});

type PageFormValues = z.infer<typeof pageSchema>;

export function PageForm({ initialData, pageId }: { initialData?: any; pageId?: string }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      seoTitle: "",
      seoDescription: "",
      status: "published",
      content: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
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
        router.push("/admin/pages");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between sticky top-16 bg-gray-50 z-10 py-4 -my-4 border-b">
          <div className="flex items-center gap-4">
            <Link href="/admin/pages">
              <Button variant="outline" size="icon" type="button">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">
              {pageId ? "Edit Page" : "Create New Page"}
            </h1>
          </div>
          <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2 hidden sm:block" />
            {isSaving ? "Saving..." : "Save Page"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="Home" {...form.register("title")} />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input placeholder="home" {...form.register("slug")} />
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
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ blockType: "hero", headline: "", description: "" })}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Hero
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ blockType: "content", columns: [{ size: "full", content: "" }] })}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Content
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6 bg-slate-50/50">
                <Accordion className="w-full space-y-4" defaultValue={fields.map(f => f.id)}>
                  {fields.map((field, index) => {
                    const blockType = form.watch(`content.${index}.blockType`);
                    const blockTitle = blockType === "hero" ? form.watch(`content.${index}.headline`) || "Hero Block" : "Content Block";
                    
                    return (
                      <AccordionItem key={field.id} value={field.id} className="bg-white border rounded-lg shadow-sm px-2">
                        <div className="flex items-center">
                          <div className="p-3 cursor-move text-slate-400 hover:text-slate-600 transition-colors">
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <AccordionTrigger className="flex-1 hover:no-underline py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
                                {blockType === "hero" ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                              </div>
                              <div className="text-left">
                                <p className="font-semibold text-slate-700 capitalize">{blockType}</p>
                                <p className="text-sm text-slate-400 truncate max-w-[200px] sm:max-w-xs">{blockTitle}</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="mr-4 text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 rounded-full transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              if(confirm('Delete this block?')) remove(index);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <AccordionContent className="pt-2 pb-6 px-6 border-t bg-slate-50/30">
                          {blockType === "hero" && (
                            <div className="space-y-6 pt-4">
                              <div className="space-y-2">
                                <Label className="text-slate-600">Headline</Label>
                                <Input className="bg-white" {...form.register(`content.${index}.headline` as const)} />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-600">Description</Label>
                                <Textarea className="bg-white h-24" {...form.register(`content.${index}.description` as const)} />
                              </div>
                            </div>
                          )}

                          {blockType === "content" && (
                            <div className="space-y-6 pt-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between mb-2">
                                  <Label className="text-slate-600">Rich Text Content</Label>
                                </div>
                                <RichTextEditor 
                                  value={form.watch(`content.${index}.columns.0.content`) || ""} 
                                  onChange={(val) => {
                                    form.setValue(`content.${index}.columns.0.content`, val, { shouldDirty: true });
                                  }} 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-slate-600">Column Size</Label>
                                <Select 
                                  onValueChange={(val) => form.setValue(`content.${index}.columns.0.size`, val || "full")} 
                                  defaultValue={form.watch(`content.${index}.columns.0.size`) || "full"}
                                >
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select size" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="full">Full Width</SelectItem>
                                    <SelectItem value="half">Half (50%)</SelectItem>
                                    <SelectItem value="twoThirds">Two Thirds (66%)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
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
                  <Label>Meta Title</Label>
                  <Input {...form.register("seoTitle")} />
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea className="h-24" {...form.register("seoDescription")} />
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
