import React from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

function HeaderButton({
  children,
  label,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`h-9 w-9 shrink-0 rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40 ${className}`}
    >
      {children}
    </Button>
  );
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
    <div className="grid w-full grid-cols-1 gap-3 px-3 py-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-1 hidden cursor-move rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 sm:flex">
          <GripVertical className="h-5 w-5" />
        </div>

        <AccordionTrigger className="min-w-0 flex-1 py-1 text-left hover:no-underline">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                visible ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400"
              }`}
            >
              {icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <p
                  className={`text-base font-bold leading-6 ${
                    visible ? "text-slate-800" : "text-slate-400 line-through"
                  }`}
                >
                  {title}
                </p>
                <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  Content Builder
                </span>
                {!visible && (
                  <span className="rounded-full bg-slate-200 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Hidden
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="mt-1 max-w-full truncate text-sm leading-6 text-slate-500">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </AccordionTrigger>
      </div>

      <div className="flex max-w-full flex-wrap items-center justify-start gap-1.5 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:justify-end">
        <HeaderButton
          label={visible ? "ซ่อนบล็อก" : "แสดงบล็อก"}
          disabled={!isEditMode}
          className={visible ? "" : "text-orange-600 hover:bg-orange-50 hover:text-orange-700"}
          onClick={(event) => {
            event.stopPropagation();
            onToggleVisibility(!visible);
          }}
        >
          {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </HeaderButton>

        <HeaderButton
          label="คัดลอกบล็อก"
          disabled={!isEditMode}
          className="hover:bg-emerald-50 hover:text-emerald-600"
          onClick={(event) => {
            event.stopPropagation();
            onDuplicate();
          }}
        >
          <Copy className="h-4 w-4" />
        </HeaderButton>

        <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

        <HeaderButton
          label="เลื่อนบล็อกขึ้น"
          disabled={!isEditMode || !canMoveUp}
          className="hover:bg-blue-50 hover:text-blue-600"
          onClick={(event) => {
            event.stopPropagation();
            onMoveUp();
          }}
        >
          <ArrowUp className="h-4 w-4" />
        </HeaderButton>

        <HeaderButton
          label="เลื่อนบล็อกลง"
          disabled={!isEditMode || !canMoveDown}
          className="hover:bg-blue-50 hover:text-blue-600"
          onClick={(event) => {
            event.stopPropagation();
            onMoveDown();
          }}
        >
          <ArrowDown className="h-4 w-4" />
        </HeaderButton>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!isEditMode}
                onClick={(event) => event.stopPropagation()}
                title="ลบบล็อก"
                aria-label="ลบบล็อก"
                className="h-9 w-9 shrink-0 rounded-lg border-red-200 text-red-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ลบบล็อก {title} นี้?</AlertDialogTitle>
              <AlertDialogDescription>
                ข้อมูล รูปภาพ และข้อความภายในบล็อกนี้จะถูกนำออกจากหน้าเมื่อบันทึก
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
              <AlertDialogAction
                onClick={(event) => {
                  event.stopPropagation();
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
