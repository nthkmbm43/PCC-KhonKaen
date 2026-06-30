"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const lineSchema = z.object({
  imageUrl: z.string().min(1, "กรุณาอัปโหลดรูปภาพ Rich Menu"),
  actionA: z.string().optional(),
  actionB: z.string().optional(),
  actionC: z.string().optional(),
  actionD: z.string().optional(),
  actionE: z.string().optional(),
  actionF: z.string().optional(),
});

type LineFormValues = z.infer<typeof lineSchema>;

export function LineMarketingForm({ linkOptions }: { linkOptions: { label: string, value: string }[] }) {
  const [isSaving, setIsSaving] = useState(false);
  const [customFields, setCustomFields] = useState<Record<string, boolean>>({});
  
  const form = useForm<LineFormValues>({
    resolver: zodResolver(lineSchema),
    defaultValues: {
      imageUrl: "",
      actionA: "",
      actionB: "",
      actionC: "",
      actionD: "",
      actionE: "",
      actionF: "",
    },
  });

  // Fetch initial data
  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/line/richmenu');
        if (res.ok) {
          const data = await res.json();
          if (data && data.imageUrl) {
            const checkCustom = (val: string) => !!(val && val !== "none" && !val.startsWith("/"));
            setCustomFields({
              actionA: checkCustom(data.actionA),
              actionB: checkCustom(data.actionB),
              actionC: checkCustom(data.actionC),
              actionD: checkCustom(data.actionD),
              actionE: checkCustom(data.actionE),
              actionF: checkCustom(data.actionF),
            });
            form.reset({
              imageUrl: data.imageUrl || "",
              actionA: data.actionA || "",
              actionB: data.actionB || "",
              actionC: data.actionC || "",
              actionD: data.actionD || "",
              actionE: data.actionE || "",
              actionF: data.actionF || "",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load rich menu settings", err);
      }
    }
    fetchMenu();
  }, [form]);

  async function onSubmit(data: LineFormValues) {
    setIsSaving(true);
    const loadingToast = toast.loading("กำลังอัปโหลดและตั้งค่า LINE Rich Menu...");
    try {
      const res = await fetch(`/api/line/richmenu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Sync & Publish ไปยัง LINE สำเร็จแล้ว!", { id: loadingToast });
      } else {
        const error = await res.json();
        toast.error(error.error || "เกิดข้อผิดพลาดในการ Sync ไปยัง LINE", { id: loadingToast });
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดที่ไม่คาดคิด", { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  }

  const renderDropdown = (fieldName: keyof LineFormValues, label: string) => {
    const isCustom = customFields[fieldName];
    const toggleCustom = () => {
      setCustomFields(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
      form.setValue(fieldName, "none");
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{label}</Label>
          <button type="button" onClick={toggleCustom} className="text-[10.5px] font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
            {isCustom ? "เลือกหน้าในระบบ" : "+ ใส่ลิงก์เอง (แผนที่/โทรด่วน)"}
          </button>
        </div>
        
        {isCustom ? (
          <Input 
            placeholder="tel:0812345678 หรือ https://goo.gl/..."
            value={form.watch(fieldName) || ""}
            onChange={(e) => form.setValue(fieldName, e.target.value)}
            className="w-full bg-slate-50 border-slate-200"
          />
        ) : (
          <Select 
            onValueChange={(val) => form.setValue(fieldName, val || "")} 
            value={form.watch(fieldName) || ""}
          >
            <SelectTrigger className="w-full bg-slate-50 border-slate-200">
              <SelectValue placeholder="เลือกหน้า..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">-- ไม่เลือก (ปิดปุ่ม) --</SelectItem>
              {linkOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
        toast.error("กรุณาอัปโหลดรูปภาพก่อนการบันทึก");
      })} className="space-y-6 max-w-5xl mx-auto pb-20">
        
        {/* Header Actions */}
        <div className="flex items-center justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-[#00B900] hover:bg-[#009900] text-white shadow-sm rounded-xl px-6"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? "กำลัง Sync..." : "Sync & Publish to LINE"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Image Upload Column */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">ภาพพื้นหลัง (Rich Menu Image)</h2>
              <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-lg mb-6 border border-emerald-100 flex items-start gap-2">
                <span className="text-lg leading-none">💡</span>
                <div>
                  <p><strong>ขนาดที่แนะนำ:</strong> 2500 x 1686 px (ขนาดไฟล์ห้ามเกิน 1 MB)</p>
                  <p className="mt-0.5">ภาพที่อัปโหลดจะถูกนำไปใช้อัปเดตเป็นเมนูหลักใน LINE OA ทันที</p>
                </div>
              </div>
              
              <ImageUpload
                value={form.watch("imageUrl") || ""}
                onChange={(val) => form.setValue("imageUrl", val, { shouldValidate: true })}
              />
              {form.formState.errors.imageUrl && (
                <p className="text-sm text-red-500 mt-2">{form.formState.errors.imageUrl.message}</p>
              )}
            </div>
          </div>

          {/* Action Mappings Column */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-5">กำหนดลิงก์ให้ปุ่ม (6 พื้นที่)</h2>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                {renderDropdown("actionA", "ปุ่ม A (ซ้ายบน)")}
                {renderDropdown("actionB", "ปุ่ม B (กลางบน)")}
                {renderDropdown("actionC", "ปุ่ม C (ขวาบน)")}
                {renderDropdown("actionD", "ปุ่ม D (ซ้ายล่าง)")}
                {renderDropdown("actionE", "ปุ่ม E (กลางล่าง)")}
                {renderDropdown("actionF", "ปุ่ม F (ขวาล่าง)")}
              </div>
              
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 leading-relaxed">
                  <strong>ข้อกำหนด:</strong> หากสร้างลิงก์หรือข้อความที่เกี่ยวกับสินค้าสำเร็จรูป ให้รักษามาตรฐานคำว่า <strong className="text-slate-700">"พรีแคสท์" (Precast)</strong> เสมอ เพื่อความสม่ำเสมอของข้อมูลแบรนด์
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </form>
    </FormProvider>
  );
}
