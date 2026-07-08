'use client';
import { useEffect, useRef, useState } from 'react';

type Stat = {
  value: number;
  suffix?: string;
  label: string;
  icon?: string;
};

type StatsBlockProps = {
  data: {
    headline?: string;
    stats?: Stat[];
  };
};

function CountUp({ target, suffix }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const defaultStats: Stat[] = [
  { value: 20, suffix: '+', label: 'ปีประสบการณ์' },
  { value: 500, suffix: '+', label: 'โครงการสำเร็จ' },
  { value: 1000, suffix: '+', label: 'ลูกค้าที่ไว้ใจ' },
  { value: 100, suffix: '%', label: 'มาตรฐาน มอก.' },
];

export default function StatsBlock({ data }: StatsBlockProps) {
  const headline = data?.headline || 'ตัวเลขที่บอกเล่าความสำเร็จของเรา';
  const stats = data?.stats || defaultStats;

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-[120px]" />
      </div>
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-blue-300 font-semibold tracking-widest uppercase text-sm mb-3">
          ความน่าเชื่อถือ
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-16 leading-tight">
          {headline}
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="relative group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 text-center hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-br from-white to-blue-200 bg-clip-text text-transparent mb-3 tabular-nums">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-blue-200 text-sm sm:text-base font-medium leading-snug">
                {stat.label}
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
