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

function isGoogleMapsEmbedUrl(src: string) {
  try {
    const url = new URL(src);
    return url.hostname.endsWith("google.com") && url.pathname.startsWith("/maps/embed");
  } catch {
    return false;
  }
}

export default function GoogleMapEmbed({
  src,
  title = "PCC Post-Tension Google Maps",
  className = "",
}: GoogleMapEmbedProps) {
  if (!src) return null;

  const mapsHref = getGoogleMapsHref(src);
  const canEmbed = isGoogleMapsEmbedUrl(src);

  return (
    <div className={`group relative overflow-hidden border border-slate-200 bg-slate-950 ${className}`}>
      {canEmbed ? (
        <iframe
          src={src}
          title={title}
          className="h-full min-h-[260px] w-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <div className="flex h-full min-h-[260px] items-center justify-center bg-slate-900 p-6 text-center text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
              Google Maps
            </p>
            <p className="mt-2 text-lg font-bold">{title}</p>
          </div>
        </div>
      )}

      <a
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${title} in Google Maps`}
        className="absolute bottom-4 right-4 inline-flex min-h-11 items-center justify-center rounded-full border border-white/70 bg-white/95 px-4 py-2 text-sm font-bold text-slate-900 shadow-lg transition-colors hover:bg-yellow-300"
      >
        เปิดใน Google Maps
      </a>
    </div>
  );
}
