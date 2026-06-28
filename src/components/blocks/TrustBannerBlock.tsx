import { Factory } from "lucide-react";

export default function TrustBannerBlock() {
  return (
    <div className="bg-white border-b border-gray-100 py-8 relative z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 lg:gap-20 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-3 font-bold text-gray-800 text-lg sm:text-xl">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-blue-800 font-black text-xl">15+</span>
            </div>
            ปีแห่งความเชี่ยวชาญ
          </div>
          <div className="hidden md:block w-px h-10 bg-gray-300"></div>
          <div className="flex items-center gap-3 font-bold text-gray-800 text-lg sm:text-xl">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-red-700 font-black text-xl">มอก.</span>
            </div>
            มาตรฐานผลิตภัณฑ์อุตสาหกรรม
          </div>
          <div className="hidden lg:block w-px h-10 bg-gray-300"></div>
          <div className="flex items-center gap-3 font-bold text-gray-800 text-lg sm:text-xl">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
              <Factory size={24} className="text-gray-700" />
            </div>
            โรงงานผลิตโดยตรง ไม่ผ่านคนกลาง
          </div>
        </div>
      </div>
    </div>
  );
}
