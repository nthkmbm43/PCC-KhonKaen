type GoogleMapEmbedProps = {
  src: string;
  title?: string;
  className?: string;
};

function getGoogleMapsData(src: string) {
  const coordMatch = src.match(/!2d([0-9.-]+)!3d([0-9.-]+)/);

  if (coordMatch) {
    const [, lng, lat] = coordMatch;
    return {
      href: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      lat,
      lng,
    };
  }

  const queryMatch = src.match(/[?&](?:query|q)=([0-9.-]+),([0-9.-]+)/);

  if (queryMatch) {
    const [, lat, lng] = queryMatch;
    return {
      href: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      lat,
      lng,
    };
  }

  if (src.includes("/maps/embed")) {
    return {
      href: "https://www.google.com/maps/search/?api=1&query=PCC%20Post-Tension",
    };
  }

  return { href: src };
}

export default function GoogleMapEmbed({
  src,
  title = "PCC Post-Tension Google Maps",
  className = "",
}: GoogleMapEmbedProps) {
  if (!src) return null;

  const map = getGoogleMapsData(src);

  return (
    <a
      href={map.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${title} in Google Maps`}
      className={`group block overflow-hidden border border-slate-200 bg-slate-950 text-white ${className}`}
    >
      <div className="flex h-full min-h-[260px] flex-col justify-between bg-[linear-gradient(135deg,#0f172a_0%,#172554_48%,#0f172a_100%)] p-6">
        <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-900 p-5">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(96,165,250,0.12)_1px,transparent_1px),linear-gradient(rgba(96,165,250,0.12)_1px,transparent_1px)] bg-[size:34px_34px]" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-blue-300/20" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-blue-300/20" />
          <div className="relative w-full max-w-sm bg-white p-5 text-slate-900 shadow-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
              <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-red-600 ring-4 ring-red-100" />
              Google Maps Pin
            </div>
            <p className="text-lg font-bold leading-snug">{title}</p>
            {map.lat && map.lng ? (
              <p className="mt-3 text-sm font-semibold text-brand-700">
                พิกัดจริง: {map.lat}, {map.lng}
              </p>
            ) : (
              <p className="mt-3 text-sm font-semibold text-brand-700">
                เปิดตำแหน่งจริงใน Google Maps
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
              Verified Location
            </p>
            <p className="mt-1 text-lg font-bold leading-snug">{title}</p>
          </div>
          <span className="shrink-0 rounded-full border border-yellow-400/70 px-4 py-2 text-sm font-bold text-yellow-300 transition-colors group-hover:bg-yellow-400 group-hover:text-slate-950">
            เปิดพิกัดจริง
          </span>
        </div>
      </div>
    </a>
  );
}
