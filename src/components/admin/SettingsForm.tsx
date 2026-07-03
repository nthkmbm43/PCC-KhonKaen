"use client";

import { useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2, Lock, Unlock } from "lucide-react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./ImageUpload";
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

const navLinkSchema = z.object({
  label: z.string().min(1, "Label is required"),
  url: z.string().min(1, "URL is required"),
});

const settingsSchema = z.object({
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  navbarLinks: z.array(navLinkSchema).optional(),
  footerData: z.object({
    footerLogoUrl: z.string().optional(),
    description: z.string().optional(),
    copyright: z.string().optional(),
  }).optional(),
  mainPhone: z.string().optional(),
  lineUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  googleMapsUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  facebookUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  vercelDeployHookUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  customHeadCode: z.string().optional(),
  customBodyCode: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    mode: 'onChange',
    defaultValues: {
      logoUrl: initialData?.logoUrl || "",
      faviconUrl: initialData?.faviconUrl || "",
      navbarLinks: initialData?.navbarLinks || [],
      footerData: { 
        footerLogoUrl: initialData?.footerData?.footerLogoUrl || "",
        description: initialData?.footerData?.description || "", 
        copyright: initialData?.footerData?.copyright || "" 
      },
      mainPhone: initialData?.mainPhone || "",
      lineUrl: initialData?.lineUrl || "",
      googleMapsUrl: initialData?.googleMapsUrl || "",
      facebookUrl: initialData?.facebookUrl || "",
      vercelDeployHookUrl: initialData?.vercelDeployHookUrl || "",
      customHeadCode: initialData?.customHeadCode || "",
      customBodyCode: initialData?.customBodyCode || "",
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
        toast.success("บันทึกการตั้งค่าเรียบร้อยแล้ว!");
        setIsEditMode(false); // Lock again after save
        router.refresh();
      } else {
        toast.error("เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดที่ไม่คาดคิด");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <FormProvider {...form}>
      <form className="space-y-6 max-w-3xl">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">ตั้งค่าเว็บไซต์</h1>
            <p className="text-slate-500 text-sm mt-1">จัดการโลโก้ เมนูนำทาง และข้อมูลติดต่อของเว็บไซต์</p>
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
                  onClick={() => {
                    setIsEditMode(false);
                    form.reset(); // Revert changes
                  }}
                  className="rounded-xl"
                >
                  ยกเลิก
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger render={
                      <Button
                        type="button"
                        disabled={isSaving}
                        className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 rounded-xl px-5"
                      >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
                    </Button>
                  } />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>ยืนยันการบันทึกการตั้งค่า?</AlertDialogTitle>
                      <AlertDialogDescription>
                        คุณกำลังจะบันทึกการเปลี่ยนแปลงทั้งหมดของการตั้งค่าเว็บไซต์ การเปลี่ยนแปลงนี้จะแสดงผลในหน้าเว็บหลักทันที
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                      <AlertDialogAction onClick={form.handleSubmit(onSubmit, (errors) => {
                          console.log("Validation Errors:", errors);
                          toast.error("กรุณาตรวจสอบข้อมูลช่องที่มีสีแดง (ข้อมูลไม่ถูกต้อง)");
                        })} className="bg-blue-600 hover:bg-blue-700">
                        ยืนยันการบันทึก
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        {/* Edit Lock Wrapper */}
        <div className={`space-y-6 transition-all duration-300 ${!isEditMode ? "opacity-60 pointer-events-none grayscale-[0.2]" : ""}`}>
          {/* Section: Branding */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-sm">🎨</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">การสร้างแบรนด์</p>
                <p className="text-xs text-slate-400">โลโก้และไอคอนเว็บไซต์</p>
              </div>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">โลโก้หลัก (แสดงบน Navbar)</Label>
                <ImageUpload
                  value={form.watch("logoUrl") || ""}
                  onChange={(val) => form.setValue("logoUrl", val, { shouldDirty: true })}
                  disabled={isSaving || !isEditMode}
                />
                {form.formState.errors.logoUrl && (
                  <p className="text-sm text-red-500">{form.formState.errors.logoUrl.message}</p>
                )}
              </div>

              <div className="h-px bg-slate-100" />

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">ไอคอนเว็บ / Favicon (แสดงบนแท็บเบราว์เซอร์)</Label>
                <ImageUpload
                  value={form.watch("faviconUrl") || ""}
                  onChange={(val) => form.setValue("faviconUrl", val, { shouldDirty: true })}
                  disabled={isSaving || !isEditMode}
                />
                <p className="text-xs text-slate-400">แนะนำรูปสี่เหลี่ยมจัตุรัส ขนาด 512×512 px หรือ .ico</p>
                {form.formState.errors.faviconUrl && (
                  <p className="text-sm text-red-500">{form.formState.errors.faviconUrl.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Navigation Menu */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 text-sm">🔗</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">เมนูนำทาง</p>
                <p className="text-xs text-slate-400">จัดการลิงก์ใน Navbar ของเว็บไซต์</p>
              </div>
            </div>
            <div className="px-6 py-6 space-y-3">
              {navFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-start gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl"
                >
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ชื่อเมนู</Label>
                      <Input
                        placeholder="เช่น โปรโมชัน"
                        {...form.register(`navbarLinks.${index}.label`)}
                        className="bg-white"
                        readOnly={!isEditMode}
                      />
                      {form.formState.errors.navbarLinks?.[index]?.label && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.navbarLinks[index]?.label?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">URL / Path</Label>
                      <Input
                        placeholder="เช่น /promotions"
                        {...form.register(`navbarLinks.${index}.url`)}
                        className="bg-white"
                        readOnly={!isEditMode}
                      />
                      {form.formState.errors.navbarLinks?.[index]?.url && (
                        <p className="text-xs text-red-500">
                          {form.formState.errors.navbarLinks[index]?.url?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger render={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-6 shrink-0 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                        disabled={!isEditMode}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    } />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>ลบเมนูนี้?</AlertDialogTitle>
                        <AlertDialogDescription>
                          คุณแน่ใจหรือไม่ที่จะลบเมนูนี้ออกจากแถบนำทาง?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction onClick={() => removeNav(index)} className="bg-red-600 hover:bg-red-700">
                          ลบเลย
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 rounded-xl"
                onClick={() => appendNav({ label: "", url: "" })}
                disabled={!isEditMode}
              >
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มลิงก์เมนู
              </Button>
            </div>
          </div>

          {/* Section: Footer */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-600 text-sm">📄</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">ข้อมูล Footer</p>
                <p className="text-xs text-slate-400">เนื้อหาที่แสดงในส่วนท้ายของเว็บไซต์</p>
              </div>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">โลโก้ Footer (แสดงที่ส่วนล่างของเว็บ)</Label>
                <ImageUpload
                  value={form.watch("footerData.footerLogoUrl") || ""}
                  onChange={(val) => form.setValue("footerData.footerLogoUrl", val, { shouldDirty: true })}
                  disabled={isSaving || !isEditMode}
                />
                <p className="text-xs text-slate-400">หากไม่ใส่ จะใช้โลโก้หลักของ Navbar แทน</p>
                {form.formState.errors.footerData?.footerLogoUrl && (
                  <p className="text-sm text-red-500">{form.formState.errors.footerData.footerLogoUrl.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">คำอธิบายบริษัท</Label>
                <Input
                  placeholder="คำอธิบายสั้นๆ เกี่ยวกับบริษัทของคุณ..."
                  {...form.register("footerData.description")}
                  className="bg-white"
                  readOnly={!isEditMode}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">ข้อความ Copyright</Label>
                <Input
                  placeholder="© 2026 ชื่อบริษัท. สงวนลิขสิทธิ์ทุกอย่าง."
                  {...form.register("footerData.copyright")}
                  className="bg-white"
                  readOnly={!isEditMode}
                />
              </div>
            </div>
          </div>

          {/* Section: Contact & Social */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center">
                <span className="text-rose-600 text-sm">📞</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">ข้อมูลติดต่อและโซเชียล</p>
                <p className="text-xs text-slate-400">ลิงก์และข้อมูลที่แสดงในส่วน Header และ Footer</p>
              </div>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="mainPhone" className="text-sm font-semibold text-slate-700">เบอร์โทรศัพท์หลัก</Label>
                <Input id="mainPhone" placeholder="081-234-5678" {...form.register("mainPhone")} className="bg-white" readOnly={!isEditMode} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">LINE URL</Label>
                <Input
                  placeholder="https://line.me/ti/p/..."
                  {...form.register("lineUrl")}
                  className="bg-white"
                  readOnly={!isEditMode}
                />
                {form.formState.errors.lineUrl && (
                  <p className="text-sm text-red-500">{form.formState.errors.lineUrl.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">Facebook URL</Label>
                <Input
                  placeholder="https://facebook.com/..."
                  {...form.register("facebookUrl")}
                  className="bg-white"
                  readOnly={!isEditMode}
                />
                {form.formState.errors.facebookUrl && (
                  <p className="text-sm text-red-500">{form.formState.errors.facebookUrl.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">Google Maps Embed URL</Label>
                <Input
                  placeholder="https://maps.google.com/..."
                  {...form.register("googleMapsUrl")}
                  className="bg-white"
                  readOnly={!isEditMode}
                />
                {form.formState.errors.googleMapsUrl && (
                  <p className="text-sm text-red-500">{form.formState.errors.googleMapsUrl.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Advanced (Auto-Deploy & Custom Scripts) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600 text-sm">⚙️</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">การตั้งค่าขั้นสูง (Advanced)</p>
                <p className="text-xs text-slate-400">ระบบ Auto-Deploy และฝังโค้ด (Scripts)</p>
              </div>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">Vercel Deploy Hook URL</Label>
                <Input
                  placeholder="https://api.vercel.com/v1/integrations/deploy/..."
                  {...form.register("vercelDeployHookUrl")}
                  className="bg-white"
                  readOnly={!isEditMode}
                />
                <p className="text-xs text-slate-400">สำหรับทำระบบปุ่มกด Auto-Deploy ผ่านหน้าแอดมินโดยตรง</p>
                {form.formState.errors.vercelDeployHookUrl && (
                  <p className="text-sm text-red-500">{form.formState.errors.vercelDeployHookUrl.message}</p>
                )}
              </div>

              <div className="h-px bg-slate-100" />

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">Custom Head Code</Label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                  placeholder="<script>...</script>"
                  {...form.register("customHeadCode")}
                  readOnly={!isEditMode}
                />
                <p className="text-xs text-slate-400">โค้ดที่จะถูกฝังในแท็ก &lt;head&gt; ของทุกหน้า (เช่น Google Analytics)</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">Custom Body Code</Label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                  placeholder="<script>...</script>"
                  {...form.register("customBodyCode")}
                  readOnly={!isEditMode}
                />
                <p className="text-xs text-slate-400">โค้ดที่จะถูกฝังในตอนท้ายของแท็ก &lt;body&gt;</p>
              </div>
            </div>
          </div>

        </div>
      </form>
    </FormProvider>
  );
}
