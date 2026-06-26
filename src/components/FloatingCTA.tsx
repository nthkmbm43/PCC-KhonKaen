import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/site-config";

export default function FloatingCTA() {
  const lineUrl = siteConfig.social.line.url;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Tooltip / Prompt */}
      <div className="bg-white px-4 py-2 rounded-2xl shadow-xl border border-gray-100 animate-bounce pointer-events-auto origin-bottom-right hidden sm:block">
        <div className="text-sm font-bold text-gray-900">ปรึกษาวิศวกรฟรี! 👇</div>
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
      </div>

      {/* Main Button */}
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-16 h-16 bg-[#06C755] text-white rounded-full shadow-[0_10px_40px_rgba(6,199,85,0.4)] hover:shadow-[0_10px_50px_rgba(6,199,85,0.6)] hover:-translate-y-1 transition-all duration-300 pointer-events-auto"
        aria-label="Contact us on LINE"
      >
        <div className="absolute inset-0 w-full h-full rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
        <MessageCircle size={32} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
        
        {/* Pulse Effect */}
        <div className="absolute inset-0 rounded-full border-2 border-[#06C755] animate-ping opacity-20"></div>
      </a>
    </div>
  );
}
