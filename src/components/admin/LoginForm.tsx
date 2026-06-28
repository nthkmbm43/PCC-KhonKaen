"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";
import toast from "react-hot-toast";

export function LoginForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Username หรือ Password ไม่ถูกต้อง");
      } else {
        toast.success("เข้าสู่ระบบสำเร็จ");
        router.push("/admin");
        router.refresh();
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">ชื่อผู้ใช้ (Username)</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="username"
              type="text"
              required
              className="pl-10 h-11 bg-slate-50/50"
              placeholder="กรอกชื่อผู้ใช้ของคุณ"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">รหัสผ่าน (Password)</Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type="password"
              required
              className="pl-10 h-11 bg-slate-50/50"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200"
        disabled={isPending}
      >
        {isPending ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ (Sign In)"}
      </Button>
    </form>
  );
}
