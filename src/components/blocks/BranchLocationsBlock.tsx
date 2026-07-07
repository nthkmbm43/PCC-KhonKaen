'use client';
import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, ExternalLink, XCircle } from 'lucide-react';

type Branch = {
  name: string;
  address: string;
  phone: string;
  email?: string;
  hours?: string;
  mapUrl?: string;
  isPrimary?: boolean;
};

type BusinessStatus = {
  isOpen: boolean;
  reason: string;
  googleMapsEmbedUrl?: string;
  companyAddress?: string;
};

type BranchLocationsBlockProps = {
  data: {
    headline?: string;
    branches?: Branch[];
  };
};

const defaultBranches: Branch[] = [
  {
    name: 'สาขาขอนแก่น (สำนักงานใหญ่)',
    address: 'เลขที่ 100 หมู่ 11 ตำบลแดงใหญ่ อำเภอเมือง จังหวัดขอนแก่น 40000',
    phone: '063-454-5656',
    email: 'contact@pcc-posttension.com',
    hours: 'จันทร์ – เสาร์: 08:00 – 17:00 น.',
    mapUrl: 'https://maps.google.com/?q=16.4419,102.8359',
    isPrimary: true,
  },
  {
    name: 'สาขาเชียงใหม่',
    address: '292/1 ถนนเชียงใหม่-ลำปาง ตำบลป่าตัน อำเภอเมือง จังหวัดเชียงใหม่ 50300',
    phone: '091-553-2624',
    hours: 'จันทร์ – เสาร์: 08:00 – 17:00 น.',
    mapUrl: 'https://maps.google.com/?q=18.8156,99.0199',
  },
];

export default function BranchLocationsBlock({ data }: BranchLocationsBlockProps) {
  const headline = data?.headline || 'สาขาของเรา';
  const branches = data?.branches || defaultBranches;

  const [status, setStatus] = useState<BusinessStatus | null>(null);
  const [settingsData, setSettingsData] = useState<{ googleMapsEmbedUrl?: string; companyAddress?: string } | null>(null);

  useEffect(() => {
    fetch('/api/business-status')
      .then(r => r.json())
      .then((data) => {
        setStatus(data);
        if (data.googleMapsEmbedUrl || data.companyAddress) {
          setSettingsData({ googleMapsEmbedUrl: data.googleMapsEmbedUrl, companyAddress: data.companyAddress });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 sm:py-24 bg-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#eff6ff_0%,_transparent_60%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-14">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            ที่ตั้งสาขา
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">{headline}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {branches.map((branch, i) => (
            <div
              key={i}
              className={`relative rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                branch.isPrimary
                  ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-md shadow-blue-100'
                  : 'border-gray-100 bg-white shadow-sm'
              }`}
            >
              {branch.isPrimary && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  สำนักงานใหญ่
                </div>
              )}

              {/* Map embed placeholder */}
              <div className="h-52 bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
                <iframe
                  src={
                    branch.isPrimary && settingsData?.googleMapsEmbedUrl
                      ? settingsData.googleMapsEmbedUrl
                      : branch.isPrimary
                        ? 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3840.8!2d102.8359!3d16.4419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDI2JzMxLjYiTiAxMDLCsDUwJzA5LjIiRQ!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth'
                        : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3775.3!2d99.0199!3d18.8156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDQ4JzU2LjIiTiA5OcKwMDEnMTEuNiJF!5e0!3m2!1sth!2sth!4v1700000000001!5m2!1sth!2sth'
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`แผนที่ ${branch.name}`}
                  className="absolute inset-0"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-bold text-gray-900">{branch.name}</h3>
                  {branch.isPrimary && status && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${
                      status.isOpen 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      {status.isOpen ? (
                        <><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> เปิดทำการ</>
                      ) : (
                        <><XCircle size={12} className="text-red-500" /> ปิดทำการ</>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-gray-600">
                    <MapPin size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed whitespace-pre-line">
                      {branch.isPrimary && settingsData?.companyAddress ? settingsData.companyAddress : branch.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone size={18} className="text-blue-500 flex-shrink-0" />
                    <a href={`tel:${branch.phone.replace(/-/g, '')}`} className="text-sm font-medium hover:text-blue-600 transition-colors">
                      {branch.phone}
                    </a>
                  </div>
                  {branch.email && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail size={18} className="text-blue-500 flex-shrink-0" />
                      <a href={`mailto:${branch.email}`} className="text-sm hover:text-blue-600 transition-colors">
                        {branch.email}
                      </a>
                    </div>
                  )}
                  {branch.hours && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock size={18} className="text-blue-500 flex-shrink-0" />
                      <span className="text-sm">{branch.hours}</span>
                    </div>
                  )}
                </div>

                {branch.mapUrl && (
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors mt-2"
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
