import React from "react";
import { useFieldArray, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { ItemHeader } from "./ItemHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "../ImageUpload";

interface NestedItemsListProps {
  nestIndex: number;
  control: Control<any>;
  blockType: string;
  isEditMode: boolean;
  watch: any;
  setValue: any;
}

export function NestedItemsList({ nestIndex, control, blockType, isEditMode, watch, setValue }: NestedItemsListProps) {
  const { fields, remove, append, move, insert } = useFieldArray({
    control,
    name: `content.${nestIndex}.items`,
  });

  const getLabel = () => {
    switch (blockType) {
      case "featureGrid": return "เพิ่มสินค้า/คุณสมบัติ";
      case "process": return "เพิ่มขั้นตอน";
      case "whyUs": return "เพิ่มเหตุผล";
      case "stats": return "เพิ่มสถิติ";
      case "testimonial": return "เพิ่มรีวิว";
      default: return "เพิ่มรายการ";
    }
  };

  const handleAppend = () => {
    append({
      id: Math.random().toString(36).substring(7),
      isVisible: true,
      title: "",
      description: "",
      icon: "",
      image: "",
      href: "",
      badgeText: "",
      stepNumber: fields.length + 1,
      value: "",
      label: "",
      suffix: "",
      quote: "",
      name: "",
      role: "",
    });
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100 mt-6">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-700">รายการย่อย (Items)</h4>
        {isEditMode && (
          <Button type="button" variant="outline" size="sm" onClick={handleAppend} className="gap-1 h-8">
            <Plus className="w-3.5 h-3.5" /> {getLabel()}
          </Button>
        )}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-6 bg-slate-50 border border-dashed rounded-lg text-slate-400 text-sm">
          ไม่มีรายการย่อย (จะใช้ข้อมูลเริ่มต้นที่ถูก hardcode ไว้ในระบบแทน)
        </div>
      )}

      {fields.length > 0 && (
        <Accordion className="space-y-3">
          {fields.map((item, k) => {
            const itemTypeLabel = blockType === "stats" ? watch(`content.${nestIndex}.items.${k}.value`) : watch(`content.${nestIndex}.items.${k}.title`) || watch(`content.${nestIndex}.items.${k}.name`) || watch(`content.${nestIndex}.items.${k}.quote`) || "Item " + (k + 1);
            
            return (
              <AccordionItem key={item.id} value={item.id} className={`border rounded-lg shadow-sm bg-white overflow-hidden ${watch(`content.${nestIndex}.items.${k}.isVisible`) === false ? 'opacity-60' : ''}`}>
                <ItemHeader
                  title={itemTypeLabel}
                  subtitle={watch(`content.${nestIndex}.items.${k}.description`) || watch(`content.${nestIndex}.items.${k}.role`)}
                  isEditMode={isEditMode}
                  isVisible={watch(`content.${nestIndex}.items.${k}.isVisible`)}
                  canMoveUp={k > 0}
                  canMoveDown={k < fields.length - 1}
                  onMoveUp={() => move(k, k - 1)}
                  onMoveDown={() => move(k, k + 1)}
                  onRemove={() => remove(k)}
                  onDuplicate={() => {
                    const currentData = watch(`content.${nestIndex}.items.${k}`);
                    insert(k + 1, { ...currentData, id: Math.random().toString(36).substring(7) });
                  }}
                  onToggleVisibility={(visible) => setValue(`content.${nestIndex}.items.${k}.isVisible`, visible, { shouldDirty: true })}
                />
                <AccordionContent className="p-4 bg-slate-50/50 space-y-4 border-t">
                  
                  {/* Common Item Fields based on BlockType */}
                  {["featureGrid", "whyUs", "process"].includes(blockType) && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>หัวข้อ (Title)</Label>
                          <Input 
                            value={watch(`content.${nestIndex}.items.${k}.title`) || ''}
                            onChange={(e) => setValue(`content.${nestIndex}.items.${k}.title`, e.target.value)}
                            placeholder="หัวข้อ..." 
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ไอคอน (Lucide Icon Name)</Label>
                          <Input 
                            value={watch(`content.${nestIndex}.items.${k}.icon`) || ''}
                            onChange={(e) => setValue(`content.${nestIndex}.items.${k}.icon`, e.target.value)}
                            placeholder="เช่น lucide-zap, lucide-shield" 
                            className="bg-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>รายละเอียด (Description)</Label>
                        <textarea 
                          value={watch(`content.${nestIndex}.items.${k}.description`) || ''}
                          onChange={(e) => setValue(`content.${nestIndex}.items.${k}.description`, e.target.value)}
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>ลิงก์ (Link) [ถ้ามี]</Label>
                          <Input 
                            value={watch(`content.${nestIndex}.items.${k}.href`) || ''}
                            onChange={(e) => setValue(`content.${nestIndex}.items.${k}.href`, e.target.value)}
                            placeholder="/products/..." 
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ข้อความป้ายกำกับ (Badge)</Label>
                          <Input 
                            value={watch(`content.${nestIndex}.items.${k}.badgeText`) || ''}
                            onChange={(e) => setValue(`content.${nestIndex}.items.${k}.badgeText`, e.target.value)}
                            placeholder="Hot, New, ฯลฯ" 
                            className="bg-white"
                          />
                        </div>
                      </div>
                      {blockType === "featureGrid" && (
                        <div className="space-y-2">
                          <Label>รูปภาพ (Image) [ใช้แสดงใน Feature Grid]</Label>
                          <div className="bg-white p-2 rounded-lg border">
                            <ImageUpload 
                              value={watch(`content.${nestIndex}.items.${k}.image`) || ''}
                              onChange={(val) => setValue(`content.${nestIndex}.items.${k}.image`, val)}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {blockType === "stats" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ตัวเลข (Value)</Label>
                        <Input 
                          value={watch(`content.${nestIndex}.items.${k}.value`) || ''}
                          onChange={(e) => setValue(`content.${nestIndex}.items.${k}.value`, e.target.value)}
                          placeholder="เช่น 100, 50, 10" 
                          className="bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>คำต่อท้าย (Suffix)</Label>
                        <Input 
                          value={watch(`content.${nestIndex}.items.${k}.suffix`) || ''}
                          onChange={(e) => setValue(`content.${nestIndex}.items.${k}.suffix`, e.target.value)}
                          placeholder="เช่น +, %, ล้าน" 
                          className="bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>ข้อความใต้สถิติ (Label)</Label>
                        <Input 
                          value={watch(`content.${nestIndex}.items.${k}.label`) || ''}
                          onChange={(e) => setValue(`content.${nestIndex}.items.${k}.label`, e.target.value)}
                          placeholder="โครงการ, ปี" 
                          className="bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {blockType === "testimonial" && (
                    <>
                      <div className="space-y-2">
                        <Label>คำนิยม (Quote)</Label>
                        <textarea 
                          value={watch(`content.${nestIndex}.items.${k}.quote`) || ''}
                          onChange={(e) => setValue(`content.${nestIndex}.items.${k}.quote`, e.target.value)}
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>ชื่อลูกค้า (Name)</Label>
                          <Input 
                            value={watch(`content.${nestIndex}.items.${k}.name`) || ''}
                            onChange={(e) => setValue(`content.${nestIndex}.items.${k}.name`, e.target.value)}
                            placeholder="ชื่อลูกค้า" 
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ตำแหน่ง/บริษัท (Role)</Label>
                          <Input 
                            value={watch(`content.${nestIndex}.items.${k}.role`) || ''}
                            onChange={(e) => setValue(`content.${nestIndex}.items.${k}.role`, e.target.value)}
                            placeholder="เช่น เจ้าของโครงการ..." 
                            className="bg-white"
                          />
                        </div>
                      </div>
                    </>
                  )}

                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
