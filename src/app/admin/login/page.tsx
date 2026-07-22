import { LoginForm } from "@/components/admin/LoginForm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import Image from "next/image";

export default async function LoginPage() {
  const settingsArray = await db.select().from(siteSettings).limit(1);
  const settings = settingsArray[0];

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-100 p-3 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="p-5 sm:p-10">
          <div className="flex justify-center mb-8">
            {settings?.logoUrl ? (
              <Image 
                src={settings.logoUrl} 
                alt="Logo" 
                width={120} 
                height={40} 
                className="object-contain h-10" 
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                P
              </div>
            )}
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-sm">เข้าสู่ระบบเพื่อจัดการเนื้อหาเว็บไซต์ของคุณ</p>
          </div>

          <LoginForm />
          
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">
              ระบบรักษาความปลอดภัยโดย NextAuth.js
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
