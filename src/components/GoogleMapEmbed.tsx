import { ExternalLink, MapPinned } from "lucide-react";

type GoogleMapEmbedProps = {
  src: string;
  title?: string;
  className?: string;
};

function getGoogleMapsHref(src: string) {
  const coordMatch = src.match(/!2d([0-9.-]+)!3d([0-9.-]+)/);

  if (coordMatch) {
    const [, lng, lat] = coordMatch;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  return src;
}

export default function GoogleMapEmbed({
  src,
  title = "PCC Post-Tension Google Maps",
  className = "",
}: GoogleMapEmbedProps) {
  if (!src) return null;

  const mapsHref = getGoogleMapsHref(src);

  return (
    <div className={`group relative flex min-h-[260px] items-center justify-center overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 text-center text-white ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,#60a5fa_0,transparent_35%),radial-gradient(circle_at_80%_75%,#f59e0b_0,transparent_30%)]" />
      <div className="relative z-10 flex max-w-sm flex-col items-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-300/30 bg-blue-400/15 text-blue-200 shadow-lg">
          <MapPinned className="h-8 w-8" aria-hidden="true" />
        </span>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
          Google Maps
        </p>
        <p className="mt-2 text-lg font-bold">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          เปิดเส้นทางและดูพิกัดสำนักงานในแอป Google Maps
        </p>
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`เปิด ${title} ใน Google Maps`}
          className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/70 bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg transition-colors hover:bg-yellow-300 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
        >
          เปิดใน Google Maps
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
