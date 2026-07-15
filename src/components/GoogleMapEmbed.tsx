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

  if (src.includes("/maps/embed")) {
    return "https://www.google.com/maps/search/?api=1&query=PCC%20Post-Tension%20Khon%20Kaen";
  }

  return src;
}

export default function GoogleMapEmbed({
  src,
  title = "PCC Post-Tension Khon Kaen Google Maps",
  className = "",
}: GoogleMapEmbedProps) {
  if (!src) return null;

  const mapsHref = getGoogleMapsHref(src);

  return (
    <a
      href={mapsHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${title} in Google Maps`}
      className={`group block overflow-hidden border border-slate-200 bg-slate-950 text-white ${className}`}
    >
      <div className="flex h-full min-h-[260px] flex-col justify-between bg-[linear-gradient(135deg,#0f172a_0%,#172554_48%,#0f172a_100%)] p-6">
        <div className="relative flex-1 overflow-hidden rounded-xl border border-white/10 bg-slate-900">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:34px_34px]" />
          <div className="absolute left-1/2 top-0 h-full w-12 -translate-x-1/2 rotate-12 bg-yellow-300/70" />
          <div className="absolute bottom-1/3 left-0 h-10 w-full -rotate-12 bg-slate-100/80" />
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/25" />
          <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 shadow-lg ring-4 ring-white/80" />
          <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-sm">
            Google Maps
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
              Location
            </p>
            <p className="mt-1 text-lg font-bold leading-snug">{title}</p>
          </div>
          <span className="shrink-0 rounded-full border border-yellow-400/70 px-4 py-2 text-sm font-bold text-yellow-300 transition-colors group-hover:bg-yellow-400 group-hover:text-slate-950">
            Open Map
          </span>
        </div>
      </div>
    </a>
  );
}
