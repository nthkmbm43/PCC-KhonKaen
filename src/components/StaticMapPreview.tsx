import Image from "next/image";
import { ExternalLink, MapPin, Navigation } from "lucide-react";

type StaticMapPreviewProps = {
  href: string;
  title?: string;
  address?: string;
  variant?: "light" | "dark";
  className?: string;
};

export default function StaticMapPreview({
  href,
  title = "PCC Post-Tension Khon Kaen",
  address = "100 หมู่ 11 ตำบลแดงใหญ่ อำเภอเมือง จังหวัดขอนแก่น 40000",
  variant = "light",
  className = "",
}: StaticMapPreviewProps) {
  const isDark = variant === "dark";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`เปิดเส้นทางไป ${title} ใน Google Maps`}
      className={`group block overflow-hidden border transition-all hover:-translate-y-0.5 hover:shadow-xl ${
        isDark
          ? "border-white/15 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-950"
      } ${className}`}
    >
      <div
        className={`relative min-h-56 overflow-hidden ${
          isDark ? "bg-slate-950" : "bg-slate-100"
        }`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(37,99,235,0.14)_1px,transparent_1px),linear-gradient(0deg,rgba(37,99,235,0.12)_1px,transparent_1px)] bg-[size:34px_34px]" />
        <div className="absolute left-[-12%] top-[54%] h-8 w-[130%] -rotate-12 bg-white/70 shadow-sm" />
        <div className="absolute left-[16%] top-[-10%] h-[130%] w-7 rotate-[24deg] bg-white/60 shadow-sm" />
        <div className="absolute right-[-8%] top-[18%] h-8 w-[72%] rotate-[18deg] bg-brand-300/60 shadow-sm" />
        <div className="absolute left-[18%] top-[58%] h-2 w-[56%] -rotate-12 rounded-full bg-brand-500 shadow-[0_0_0_4px_rgba(37,99,235,0.12)]" />
        <div className="absolute left-[17%] top-[56%] h-5 w-5 rounded-full border-4 border-white bg-brand-500 shadow-lg" />
        <div className="absolute right-[22%] top-[38%] flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-xl ring-8 ring-red-500/15">
          <MapPin size={28} fill="currentColor" aria-hidden="true" />
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">
          Google Maps
        </div>
        <div className="absolute bottom-4 left-4 right-4 border border-white/60 bg-white/90 p-4 shadow-lg backdrop-blur">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50">
              <Image
                src="/images/social/google-map.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="font-bold leading-snug text-slate-950">{title}</p>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">
                {address}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex items-center justify-between gap-4 px-5 py-4 ${
          isDark ? "bg-slate-900" : "bg-white"
        }`}
      >
        <span className="inline-flex items-center gap-2 font-bold">
          <Navigation size={18} className="text-brand-500" aria-hidden="true" />
          เปิดเส้นทางใน Google Maps
        </span>
        <ExternalLink
          size={18}
          className="shrink-0 text-brand-500 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </a>
  );
}
