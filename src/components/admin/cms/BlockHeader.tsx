import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Trash2, GripVertical, Copy, Eye, EyeOff } from "lucide-react";
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
import { AccordionTrigger } from "@/components/ui/accordion";

interface BlockHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  isEditMode: boolean;
  isVisible: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onToggleVisibility: (visible: boolean) => void;
}

export function BlockHeader({
  title,
  subtitle,
  icon,
  isEditMode,
  isVisible,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onRemove,
  onDuplicate,
  onToggleVisibility,
}: BlockHeaderProps) {
  const visible = isVisible !== false;

  return (
    <div className="flex flex-col gap-3 w-full px-3 py-3 sm:flex-row sm:items-center">
      <div className="hidden sm:flex p-2 cursor-move text-slate-400 hover:text-slate-600 transition-colors">
        <GripVertical className="w-5 h-5" />
      </div>

      <AccordionTrigger className="flex-1 hover:no-underline py-1">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${visible ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400"}`}>
            {icon}
          </div>
          <div className="text-left flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <p className={`font-semibold capitalize ${visible ? "text-slate-700" : "text-slate-400 line-through"}`}>{title}</p>
              {!visible && (
                <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Hidden</span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-slate-400 truncate max-w-[220px] sm:max-w-md">{subtitle}</p>
            )}
          </div>
        </div>
      </AccordionTrigger>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-2 shadow-sm sm:ml-auto">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(!visible);
          }}
          disabled={!isEditMode}
          className={`h-8 gap-1 rounded-lg px-2 transition-colors ${visible ? "text-slate-500 hover:text-slate-700 hover:bg-slate-100" : "text-orange-600 hover:bg-orange-50"}`}
          title={visible ? "ซ่อนบล็อก" : "แสดงบล็อก"}
          aria-label={visible ? "ซ่อนบล็อก" : "แสดงบล็อก"}
        >
          {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span className="hidden xl:inline">{visible ? "ซ่อน" : "แสดง"}</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          disabled={!isEditMode}
          className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 h-8 gap-1 rounded-lg px-2 transition-colors"
          title="คัดลอกบล็อก"
          aria-label="คัดลอกบล็อก"
        >
          <Copy className="w-4 h-4" />
          <span className="hidden xl:inline">คัดลอก</span>
        </Button>

        <div className="hidden sm:block w-px h-5 bg-slate-200 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          disabled={!isEditMode || !canMoveUp}
          className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 h-8 w-8 rounded-lg transition-colors"
          title="เลื่อนขึ้น"
          aria-label="เลื่อนบล็อกขึ้น"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          disabled={!isEditMode || !canMoveDown}
          className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 h-8 w-8 rounded-lg transition-colors"
          title="เลื่อนลง"
          aria-label="เลื่อนบล็อกลง"
        >
          <ArrowDown className="w-4 h-4" />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50 hover:border-red-300 h-8 gap-1 rounded-lg px-2 transition-colors"
                disabled={!isEditMode}
                onClick={(e) => e.stopPropagation()}
                title="ลบบล็อก"
                aria-label="ลบบล็อก"
              />
            }
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">ลบ</span>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ลบบล็อก {title} นี้?</AlertDialogTitle>
              <AlertDialogDescription>
                คุณแน่ใจหรือไม่ที่จะลบบล็อกนี้? ข้อมูล รูปภาพ และข้อความภายในบล็อกนี้จะถูกนำออกจากหน้าเมื่อบันทึก
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                ลบบล็อกนี้
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
