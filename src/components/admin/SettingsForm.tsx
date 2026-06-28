"use client";

import { useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./ImageUpload";

const navLinkSchema = z.object({
  label: z.string().min(1, "Label is required"),
  url: z.string().min(1, "URL is required"),
});

const settingsSchema = z.object({
  logoUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  navbarLinks: z.array(navLinkSchema).optional(),
  footerData: z.object({
    description: z.string().optional(),
    copyright: z.string().optional(),
  }).optional(),
  mainPhone: z.string().optional(),
  lineUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  googleMapsUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  facebookUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      logoUrl: initialData?.logoUrl || "",
      navbarLinks: initialData?.navbarLinks || [],
      footerData: initialData?.footerData || { description: "", copyright: "" },
      mainPhone: initialData?.mainPhone || "",
      lineUrl: initialData?.lineUrl || "",
      googleMapsUrl: initialData?.googleMapsUrl || "",
      facebookUrl: initialData?.facebookUrl || "",
    },
  });

  const { fields: navFields, append: appendNav, remove: removeNav } = useFieldArray({
    control: form.control,
    name: "navbarLinks",
  });

  async function onSubmit(data: SettingsFormValues) {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        alert("Settings saved successfully!");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Site Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage global settings, logo, and social links.
            </p>
          </div>
          <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Upload or link your company logo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Logo URL</Label>
              <ImageUpload 
                value={form.watch("logoUrl") || ""} 
                onChange={(val) => form.setValue("logoUrl", val, { shouldDirty: true })} 
                disabled={isSaving} 
              />
              {form.formState.errors.logoUrl && (
                <p className="text-sm text-red-500">{form.formState.errors.logoUrl.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Navigation Menu</CardTitle>
            <CardDescription>Manage links in the top navigation bar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {navFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex-1 space-y-2">
                  <Label>Link Label</Label>
                  <Input placeholder="e.g. Promotions" {...form.register(`navbarLinks.${index}.label`)} />
                  {form.formState.errors.navbarLinks?.[index]?.label && (
                    <p className="text-sm text-red-500">{form.formState.errors.navbarLinks[index]?.label?.message}</p>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Label>URL / Path</Label>
                  <Input placeholder="e.g. /promotions" {...form.register(`navbarLinks.${index}.url`)} />
                  {form.formState.errors.navbarLinks?.[index]?.url && (
                    <p className="text-sm text-red-500">{form.formState.errors.navbarLinks[index]?.url?.message}</p>
                  )}
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="mt-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeNav(index)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={() => appendNav({ label: "", url: "" })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Link
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Footer Information</CardTitle>
            <CardDescription>Manage content displayed in the footer area.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Company Description</Label>
              <Input placeholder="Brief description of your company..." {...form.register("footerData.description")} />
            </div>
            <div className="space-y-2">
              <Label>Copyright Text</Label>
              <Input placeholder="© 2026 Company Name. All rights reserved." {...form.register("footerData.copyright")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact & Social</CardTitle>
            <CardDescription>Links and contact info displayed in headers and footers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Main Phone Number</Label>
              <Input placeholder="081-234-5678" {...form.register("mainPhone")} />
            </div>
            
            <div className="space-y-2">
              <Label>LINE URL</Label>
              <Input placeholder="https://line.me/ti/p/..." {...form.register("lineUrl")} />
              {form.formState.errors.lineUrl && (
                <p className="text-sm text-red-500">{form.formState.errors.lineUrl.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Facebook URL</Label>
              <Input placeholder="https://facebook.com/..." {...form.register("facebookUrl")} />
              {form.formState.errors.facebookUrl && (
                <p className="text-sm text-red-500">{form.formState.errors.facebookUrl.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Google Maps Embed URL</Label>
              <Input placeholder="https://maps.google.com/..." {...form.register("googleMapsUrl")} />
              {form.formState.errors.googleMapsUrl && (
                <p className="text-sm text-red-500">{form.formState.errors.googleMapsUrl.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

      </form>
    </FormProvider>
  );
}
