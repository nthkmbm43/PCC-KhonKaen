type GoogleMapEmbedProps = {
  src: string;
  title?: string;
  className?: string;
};

export default function GoogleMapEmbed({
  src,
  title = "PCC Post-Tension Khon Kaen Google Maps",
  className = "",
}: GoogleMapEmbedProps) {
  if (!src) return null;

  return (
    <div className={`overflow-hidden border border-slate-200 bg-slate-100 ${className}`}>
      <iframe
        src={src}
        title={title}
        className="h-full min-h-[260px] w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
