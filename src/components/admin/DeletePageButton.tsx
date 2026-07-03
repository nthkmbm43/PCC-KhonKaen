"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Lock, AlertTriangle } from "lucide-react";
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

// System-critical pages that should NOT be deleted
const PROTECTED_SLUGS = ["home", "about", "contact", "products", "portfolio"];

interface DeletePageButtonProps {
  pageId: string;
  pageTitle: string;
  pageSlug: string;
}

export function DeletePageButton({ pageId, pageTitle, pageSlug }: DeletePageButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();

  const isProtected = PROTECTED_SLUGS.includes(pageSlug);

  // Protected pages — cannot be deleted
  if (isProtected) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-300 cursor-not-allowed rounded-lg"
        disabled
        title={`ไม่สามารถลบเพจระบบ "${pageTitle}" ได้ — เป็นเพจหลักของเว็บไซต์`}
      >
        <Lock className="w-4 h-4" />
      </Button>
    );
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/pages/${pageId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success(`ลบเพจ "${pageTitle}" สำเร็จแล้ว`);
        router.refresh();
      } else {
        toast.error("ไม่สามารถลบเพจได้ กรุณาลองใหม่อีกครั้ง");
      }
    } catch {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อระบบ");
    } finally {
      setIsDeleting(false);
      setConfirmText("");
    }
  }

  const isConfirmValid = confirmText === pageTitle;

  return (
    <AlertDialog onOpenChange={() => setConfirmText("")}>
      <AlertDialogTrigger render={
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
          disabled={isDeleting}
          title="ลบเพจนี้"
        >
          {isDeleting ? (
            <div className="w-4 h-4 rounded-full border-2 border-red-200 border-t-red-600 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      } />

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <AlertDialogTitle className="text-red-700">ยืนยันการลบเพจนี้?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 text-left">
            <p>
              คุณกำลังจะลบเพจ{" "}
              <span className="font-bold text-slate-800">"{pageTitle}"</span>{" "}
              แบบถาวร การกระทำนี้{" "}
              <span className="text-red-600 font-semibold">ไม่สามารถกู้คืนได้</span>
            </p>
            <p className="text-slate-500 text-sm">
              เพื่อยืนยัน กรุณาพิมพ์ชื่อเพจด้านล่าง:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <p className="text-xs text-slate-500 mb-1">ชื่อที่ต้องพิมพ์:</p>
              <p className="font-mono font-bold text-slate-800">{pageTitle}</p>
            </div>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`พิมพ์ "${pageTitle}" เพื่อยืนยัน`}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
              autoFocus
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isConfirmValid || isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isDeleting ? "กำลังลบ..." : "ยืนยันลบถาวร"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
