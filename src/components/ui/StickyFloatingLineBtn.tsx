import { MessageCircle } from "lucide-react";

export default function StickyFloatingLineBtn({ lineUrl }: { lineUrl: string }) {
  return (
    <a 
      href={lineUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="fixed bottom-6 right-6 z-50 bg-[#06C755] hover:bg-[#05b34c] text-white p-4 rounded-full shadow-[0_8px_30px_rgba(6,199,85,0.4)] flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 group animate-bounce"
      aria-label="ติดต่อเราผ่าน LINE"
    >
      <MessageCircle size={32} />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-white text-gray-800 px-4 py-2 rounded-xl shadow-lg text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-100">
        สอบถามราคาฟรี!
        {/* Tooltip Arrow */}
        <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-white border-r border-b border-gray-100 transform -translate-y-1/2 rotate-[-45deg]"></div>
      </span>
    </a>
  );
}
