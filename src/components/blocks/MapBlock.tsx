import React from "react";
import { MapPin } from "lucide-react";
import StaticMapPreview from "@/components/StaticMapPreview";
import { getSiteSettings } from "@/lib/getSiteSettings";

export default async function MapBlock({ data }: { data?: Record<string, unknown> }) {
  const settings = await getSiteSettings();
  const mapUrl = (data?.url as string) || settings.contact.googleMapsUrl;

  if (!mapUrl) return null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-brand-50 text-brand-600">
              <MapPin size={24} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
                Location
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                แผนที่สำนักงาน PCC Post-Tension ขอนแก่น
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                ดูตำแหน่งสำนักงานและกดเพื่อเปิดเส้นทางนำทางด้วย Google Maps ได้ทันที
              </p>
            </div>
          </div>
          <StaticMapPreview
            href={mapUrl}
            address={settings.contact.companyAddress}
            className="rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}
