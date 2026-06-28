"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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

export function DeletePageButton({ pageId, pageTitle }: { pageId: string, pageTitle: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(`ลบเพจ "${pageTitle}" สำเร็จแล้ว`);
        router.refresh();
      } else {
        toast.error("ไม่สามารถลบเพจได้ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อระบบ");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-600 hover:text-red-700 hover:bg-red-50 relative rounded-lg"
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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบเพจนี้?</AlertDialogTitle>
          <AlertDialogDescription>
            คุณกำลังจะลบเพจ <span className="font-bold text-slate-800">"{pageTitle}"</span> แบบถาวร 
            การกระทำนี้ไม่สามารถกู้คืนได้ แน่ใจหรือไม่?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
            ยืนยันการลบถาวร
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
