import React from 'react';
import { getSiteSettings } from "@/lib/getSiteSettings";

export default async function MapBlock({ data }: { data?: Record<string, unknown> }) {
  const settings = await getSiteSettings();
  const mapUrl = (data?.url as string) || settings.contact.googleMapsUrl;

  if (!mapUrl) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 h-[500px] w-full">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0, borderRadius: "1.5rem" }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
          title="Google Maps Location"
        ></iframe>
      </div>
    </div>
  );
}
