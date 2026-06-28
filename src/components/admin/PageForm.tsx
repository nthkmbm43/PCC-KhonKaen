"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ArrowLeft, GripVertical } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";

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
          width: z.string(),
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
        <div className="flex items-center justify-between">
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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Page Content (Blocks)</CardTitle>
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
                    onClick={() => append({ blockType: "content", columns: [{ width: "full", content: "" }] })}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Content
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="relative border rounded-lg p-4 bg-gray-50 group">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                      <h3 className="font-semibold text-gray-700 capitalize">{form.watch(`content.${index}.blockType`)} Block</h3>
                    </div>

                    {form.watch(`content.${index}.blockType`) === "hero" && (
                      <div className="space-y-4 pl-7">
                        <div className="space-y-2">
                          <Label>Headline</Label>
                          <Input {...form.register(`content.${index}.headline` as const)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea {...form.register(`content.${index}.description` as const)} />
                        </div>
                      </div>
                    )}

                    {form.watch(`content.${index}.blockType`) === "content" && (
                      <div className="space-y-4 pl-7">
                        <p className="text-sm text-gray-500">Content columns configuration goes here...</p>
                      </div>
                    )}
                  </div>
                ))}
                {fields.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                    No blocks added yet. Click the buttons above to add content.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
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
                  <Textarea {...form.register("seoDescription")} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
