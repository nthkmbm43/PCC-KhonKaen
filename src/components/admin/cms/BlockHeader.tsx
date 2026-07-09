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
  return (
    <div className="flex items-center w-full">
      <div className="p-3 cursor-move text-slate-400 hover:text-slate-600 transition-colors">
        <GripVertical className="w-5 h-5" />
      </div>
      
      <AccordionTrigger className="flex-1 hover:no-underline py-4">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${isVisible !== false ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
            {icon}
          </div>
          <div className="text-left flex flex-col">
            <div className="flex items-center gap-2">
              <p className={`font-semibold capitalize ${isVisible !== false ? 'text-slate-700' : 'text-slate-400 line-through'}`}>{title}</p>
              {isVisible === false && (
                <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Hidden</span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-slate-400 truncate max-w-[200px] sm:max-w-xs">{subtitle}</p>
            )}
          </div>
        </div>
      </AccordionTrigger>

      <div className="flex items-center pr-4 gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => { e.stopPropagation(); onToggleVisibility(isVisible === false ? true : false); }}
          disabled={!isEditMode}
          className={`h-8 w-8 rounded-full transition-colors ${isVisible !== false ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100' : 'text-orange-500 hover:bg-orange-50'}`}
          title={isVisible !== false ? "Hide Block" : "Show Block"}
        >
          {isVisible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          disabled={!isEditMode}
          className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 h-8 w-8 rounded-full transition-colors"
          title="Duplicate Block"
        >
          <Copy className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
          disabled={!isEditMode || !canMoveUp}
          className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 h-8 w-8 rounded-full transition-colors"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
          disabled={!isEditMode || !canMoveDown}
          className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 h-8 w-8 rounded-full transition-colors"
        >
          <ArrowDown className="w-4 h-4" />
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
                คุณแน่ใจหรือไม่ที่จะลบสิ่งนี้? ข้อมูลภายในจะสูญหาย
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
