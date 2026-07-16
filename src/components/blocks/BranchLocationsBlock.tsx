"use client";

import { Clock, ExternalLink, MapPin, Phone } from "lucide-react";

type Branch = {
  name: string;
  address: string;
  phone: string;
  hours?: string;
  mapUrl?: string;
  isPrimary?: boolean;
};

type BusinessStatus = {
  isOpen: boolean;
  reason: string;
  companyAddress?: string;
  todayThai?: string;
};

type BranchLocationsBlockProps = {
  data: {
    headline?: string;
    branches?: Branch[];
  };
  initialStatus?: BusinessStatus | null;
};

const defaultBranches: Branch[] = [
  {
    name: "สำนักงานใหญ่เชียงใหม่",
    address: "292/1 ถนนเชียงใหม่-ลำปาง ตำบลป่าตัน อำเภอเมือง จังหวัดเชียงใหม่ 50300",
    phone: "091-553-2624",
    hours: "จันทร์ - เสาร์: 08:00 - 17:00 น.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=18.8156,99.0199",
    isPrimary: true,
  },
  {
    name: "สาขาขอนแก่น",
    address: "เลขที่ 100 หมู่ 11 ตำบลแดงใหญ่ อำเภอเมือง จังหวัดขอนแก่น 40000",
    phone: "063-454-5656",
    hours: "จันทร์ - เสาร์: 08:00 - 17:00 น.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=16.476942,102.774184",
  },
];

export default function BranchLocationsBlock({ data, initialStatus }: BranchLocationsBlockProps) {
  const headline = data?.headline || "สาขาของเรา";
  const branches = data?.branches || defaultBranches;
  const status = initialStatus || null;

  return (
    <section className="relative bg-white py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#eff6ff_0%,_transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-700">
            ที่ตั้งสาขา
          </span>
          <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{headline}</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {branches.map((branch, i) => (
            <div
              key={`${branch.name}-${i}`}
              className={`relative overflow-hidden rounded-2xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                branch.isPrimary
                  ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-md shadow-blue-100"
                  : "border-gray-100 bg-white shadow-sm"
              }`}
            >
              {branch.isPrimary && (
                <div className="absolute right-4 top-4 z-10 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                  สำนักงานใหญ่
                </div>
              )}

              <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-blue-800 p-6 text-center text-white">
                <div>
                  <MapPin className="mx-auto mb-4 h-10 w-10 text-brand-300" aria-hidden="true" />
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-200">
                    PCC Location
                  </p>
                  <p className="mt-2 text-xl font-bold">{branch.name}</p>
                </div>
              </div>

              <div className="space-y-4 p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900">{branch.name}</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-gray-600">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-blue-500" />
                    <span className="whitespace-pre-line text-sm leading-relaxed">
                      {branch.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone size={18} className="shrink-0 text-blue-500" />
                    <a
                      href={`tel:${branch.phone.replace(/-/g, "")}`}
                      className="min-h-11 py-3 text-sm font-medium transition-colors hover:text-blue-600"
                    >
                      {branch.phone}
                    </a>
                  </div>
                  {branch.isPrimary && status ? (
                    <div className="flex items-start gap-3">
                      <Clock
                        size={18}
                        className={status.isOpen ? "mt-0.5 shrink-0 text-green-500" : "mt-0.5 shrink-0 text-red-500"}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">
                          วันนี้{status.todayThai}:{" "}
                          <span className={status.isOpen ? "text-green-600" : "text-red-600"}>
                            {status.isOpen ? "เปิดทำการ" : "ปิดทำการ"}
                          </span>
                        </span>
                        <span className="mt-0.5 text-xs font-medium text-gray-500">
                          {status.isOpen ? "08:00 - 17:00 น." : status.reason}
                        </span>
                        {branch.hours && <span className="mt-1 text-xs text-gray-400">{branch.hours}</span>}
                      </div>
                    </div>
                  ) : branch.hours ? (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock size={18} className="shrink-0 text-blue-500" />
                      <span className="text-sm">{branch.hours}</span>
                    </div>
                  ) : null}
                </div>

                {branch.mapUrl && (
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
                  >
                    <ExternalLink size={16} />
                    เปิดใน Google Maps
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
