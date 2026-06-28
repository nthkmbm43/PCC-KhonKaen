"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";

const settingsSchema = z.object({
  logoUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
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
      mainPhone: initialData?.mainPhone || "",
      lineUrl: initialData?.lineUrl || "",
      googleMapsUrl: initialData?.googleMapsUrl || "",
      facebookUrl: initialData?.facebookUrl || "",
    },
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
              <Input placeholder="https://example.com/logo.png" {...form.register("logoUrl")} />
              {form.watch("logoUrl") && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50 flex items-center justify-center h-32 w-auto max-w-xs mx-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.watch("logoUrl")} alt="Logo Preview" className="max-h-full max-w-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
              {form.formState.errors.logoUrl && (
                <p className="text-sm text-red-500">{form.formState.errors.logoUrl.message}</p>
              )}
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
