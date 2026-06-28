"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="ml-2 w-9 h-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      title="ออกจากระบบ"
    >
      <LogOut className="w-4 h-4" />
    </Button>
  );
}
