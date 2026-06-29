"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import toast from "react-hot-toast";

export function DeployButton() {
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    setIsDeploying(true);
    const loadingToast = toast.loading("กำลังสั่ง Deploy เว็บไซต์...");
    try {
      const res = await fetch("/api/deploy", { method: "POST" });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("สั่ง Deploy ไปยัง Vercel เรียบร้อยแล้ว!", { id: loadingToast });
      } else {
        toast.error(data.error || "เกิดข้อผิดพลาดในการ Deploy", { id: loadingToast });
      }
    } catch (error) {
      toast.error("เครือข่ายขัดข้อง", { id: loadingToast });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Button 
      onClick={handleDeploy} 
      disabled={isDeploying}
      className="w-full justify-start gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 border-none transition-all py-5 rounded-xl"
    >
      <Rocket className={`w-4.5 h-4.5 ${isDeploying ? 'animate-bounce' : ''}`} />
      <span className="font-semibold text-[13px]">{isDeploying ? "กำลัง Deploy..." : "Publish & Deploy"}</span>
    </Button>
  );
}
