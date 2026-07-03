import { ArrowLeft, Construction } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ComingSoonPlaceholder({ title, description }: { title: string, description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
        <Construction className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-3">{title}</h1>
      <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
        {description || "This feature is currently under development and will be available in the upcoming Sprint 5 release."}
      </p>
      
      <Link href="/admin">
        <Button variant="outline" className="gap-2 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">
          <ArrowLeft className="w-4 h-4" />
          กลับ Dashboard
        </Button>
      </Link>
    </div>
  );
}
