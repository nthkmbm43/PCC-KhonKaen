type Stat = {
  value: number;
  suffix?: string;
  label: string;
  icon?: string;
  isVisible?: boolean;
};

type StatsBlockProps = {
  data: {
    headline?: string;
    description?: string;
    stats?: Stat[];
    items?: Stat[];
  };
};

const defaultStats: Stat[] = [];

export default function StatsBlock({ data }: StatsBlockProps) {
  const headline = data?.headline || 'ข้อมูลของเรา';
  const subheadline = data?.description || 'ตัวเลขจากข้อมูลที่เผยแพร่';
  const source = data?.items?.length ? data.items : data?.stats;
  const stats = (source || defaultStats).filter((item) => item.isVisible !== false);

  if (stats.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 py-20">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-400 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-indigo-400 blur-[120px]" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-blue-300">
          {subheadline}
        </p>
        <h2 className="mb-16 text-center text-3xl font-bold leading-tight text-white sm:text-4xl">
          {headline}
        </h2>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={`${stat.label}-${index}`}
              className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 sm:p-8"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="mb-3 bg-gradient-to-br from-white to-blue-200 bg-clip-text text-4xl font-extrabold tabular-nums text-transparent sm:text-5xl lg:text-6xl">
                <span>{Number(stat.value).toLocaleString('th-TH')}{stat.suffix}</span>
              </div>
              <div className="text-sm font-medium leading-snug text-blue-200 sm:text-base">
                {stat.label}
              </div>
              <div className="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
