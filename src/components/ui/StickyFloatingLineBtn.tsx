import { MessageCircle } from "lucide-react";

export default function StickyFloatingLineBtn({ lineUrl }: { lineUrl: string }) {
  return (
    <a
      href={lineUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#06C755] text-white shadow-[0_8px_30px_rgba(6,199,85,0.35)] transition-all hover:-translate-y-1 hover:bg-[#05b34c] hover:shadow-[0_10px_36px_rgba(6,199,85,0.45)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#06C755]/30 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16 group"
      aria-label="ติดต่อเราผ่าน LINE"
    >
      <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />

      <span className="pointer-events-none absolute right-full mr-4 hidden whitespace-nowrap rounded-lg border border-gray-100 bg-white px-4 py-2 text-sm font-bold text-gray-800 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
        สอบถามราคาฟรี
        <span className="absolute top-1/2 -right-1.5 h-3 w-3 -translate-y-1/2 rotate-[-45deg] border-b border-r border-gray-100 bg-white" />
      </span>
    </a>
  );
}
