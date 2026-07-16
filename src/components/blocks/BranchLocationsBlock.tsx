import { Clock, MapPin, Phone } from "lucide-react";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";
import { siteConfig } from "@/data/site-config";
import { getSiteSettings } from "@/lib/getSiteSettings";

type Branch = {
  name: string;
  address: string;
  phone: string;
  hours?: string;
  mapUrl?: string;
  mapEmbedUrl?: string;
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
    mapUrl: "https://www.google.com/maps/search/?api=1&query=18.810046814758575,98.99280067708213",
    mapEmbedUrl: siteConfig.offices[0].mapEmbedUrl,
    isPrimary: true,
  },
  {
    name: "สาขาขอนแก่น",
    address: "เลขที่ 100 หมู่ 11 ตำบลแดงใหญ่ อำเภอเมือง จังหวัดขอนแก่น 40000",
    phone: "063-454-5656",
    hours: "จันทร์ - เสาร์: 08:00 - 17:00 น.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=16.476942,102.774184",
    mapEmbedUrl: siteConfig.googleMapsEmbed,
  },
];

function normalizeBranch(branch: Branch, khonKaenEmbedUrl: string): Branch {
  const headOffice = siteConfig.offices[0];
  const khonKaenBranch = siteConfig.offices[1];
  const isChiangMai =
    branch.name.includes("เชียงใหม่") ||
    branch.address.includes("เชียงใหม่") ||
    branch.mapUrl?.includes("18.8156") ||
    branch.mapUrl?.includes("99.0199");
  const isKhonKaen =
    branch.name.includes("ขอนแก่น") ||
    branch.address.includes("ขอนแก่น") ||
    branch.mapUrl?.includes("16.4419") ||
    branch.mapUrl?.includes("102.8359") ||
    branch.mapUrl?.includes("16.476942") ||
    branch.mapUrl?.includes("102.774184");
  const isOldHeadOffice =
    branch.isPrimary || branch.name.includes("สำนักงานใหญ่") || branch.name.includes("สาขาขอนแก่น (สำนักงานใหญ่)");

  if (isKhonKaen) {
    return {
      ...branch,
      name: khonKaenBranch.name,
      address: khonKaenBranch.address,
      phone: "063-454-5656",
      mapUrl: khonKaenBranch.mapUrl,
      mapEmbedUrl: khonKaenEmbedUrl,
      isPrimary: false,
    };
  }

  if (isChiangMai || isOldHeadOffice) {
    return {
      ...branch,
      name: headOffice.name,
      address: headOffice.address,
      phone: "091-553-2624",
      mapUrl: headOffice.mapUrl,
      mapEmbedUrl: headOffice.mapEmbedUrl,
      isPrimary: true,
    };
  }

  return branch;
}

export default async function BranchLocationsBlock({ data, initialStatus }: BranchLocationsBlockProps) {
  const settings = await getSiteSettings();
  const headline = data?.headline || "สาขาของเรา";
  const khonKaenEmbedUrl = settings.contact.googleMapsUrl || siteConfig.googleMapsEmbed;
  const branches = (data?.branches || defaultBranches)
    .map((branch) => normalizeBranch(branch, khonKaenEmbedUrl))
    .sort((a, b) => Number(Boolean(b.isPrimary)) - Number(Boolean(a.isPrimary)));
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

              <GoogleMapEmbed
                src={branch.mapEmbedUrl || branch.mapUrl || ""}
                title={`แผนที่ ${branch.name}`}
                className="h-60 rounded-none border-0"
              />

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

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
