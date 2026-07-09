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

interface ItemHeaderProps {
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

export function ItemHeader({
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
}: ItemHeaderProps) {
  return (
    <div className="flex items-center w-full bg-slate-50 border-b rounded-t-lg">
      <div className="p-2 cursor-move text-slate-400 hover:text-slate-600 transition-colors">
        <GripVertical className="w-4 h-4" />
      </div>
      
      <AccordionTrigger className="flex-1 hover:no-underline py-3 text-sm">
        <div className="flex items-center gap-2">
          {icon && (
            <div className={`w-6 h-6 rounded flex items-center justify-center ${isVisible !== false ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
              {icon}
            </div>
          )}
          <div className="text-left flex flex-col">
            <div className="flex items-center gap-2">
              <p className={`font-medium ${isVisible !== false ? 'text-slate-700' : 'text-slate-400 line-through'}`}>{title}</p>
              {isVisible === false && (
                <span className="text-[9px] bg-slate-200 text-slate-500 px-1 py-0.5 rounded uppercase font-bold tracking-wider">Hidden</span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-400 truncate max-w-[150px] sm:max-w-xs">{subtitle}</p>
            )}
          </div>
        </div>
      </AccordionTrigger>

      <div className="flex items-center pr-2 gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => { e.stopPropagation(); onToggleVisibility(isVisible === false ? true : false); }}
          disabled={!isEditMode}
          className={`h-7 w-7 rounded-md transition-colors ${isVisible !== false ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-200' : 'text-orange-500 hover:bg-orange-50'}`}
          title={isVisible !== false ? "Hide Item" : "Show Item"}
        >
          {isVisible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          disabled={!isEditMode}
          className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 h-7 w-7 rounded-md transition-colors"
          title="Duplicate Item"
        >
          <Copy className="w-3.5 h-3.5" />
        </Button>
        <div className="w-px h-3 bg-slate-200 mx-0.5" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
          disabled={!isEditMode || !canMoveUp}
          className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 h-7 w-7 rounded-md transition-colors"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
          disabled={!isEditMode || !canMoveDown}
          className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 h-7 w-7 rounded-md transition-colors"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 rounded-full transition-colors ml-1"
                disabled={!isEditMode}
                onClick={(e) => e.stopPropagation()}
              />
            }
          >
            <Trash2 className="w-4 h-4" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ลบ {title} นี้?</AlertDialogTitle>
              <AlertDialogDescription>
                คุณแน่ใจหรือไม่ที่จะลบรายการนี้? ข้อมูลภายในจะสูญหาย
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
              <AlertDialogAction onClick={(e) => { e.stopPropagation(); onRemove(); }} className="bg-red-600 hover:bg-red-700">
                ลบเลย
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
