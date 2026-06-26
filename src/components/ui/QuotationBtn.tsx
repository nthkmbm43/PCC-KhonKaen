import { MessageCircle } from "lucide-react";

interface QuotationBtnProps {
  productName?: string;
}

export default function QuotationBtn({ productName }: QuotationBtnProps) {
  // ลิงก์ LINE เดียวกันตามที่กำหนด
  const lineUrl = "https://lin.ee/uS8jBzx";

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 mb-8 bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center shadow-sm">
      <h3 className="text-2xl font-bold text-slate-800 mb-3">
        สนใจ{productName ? ` ${productName}` : "สินค้าของเรา"} ?
      </h3>
      <p className="text-slate-600 mb-6">
        สอบถามรายละเอียดเพิ่มเติม ประเมินหน้างาน หรือขอใบเสนอราคาได้ฟรี! ทีมวิศวกรของเราพร้อมให้คำปรึกษา
      </p>
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center space-x-2 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-lg px-8 py-4 rounded-full transition-all hover:scale-105 hover:shadow-lg"
      >
        <MessageCircle size={24} />
        <span>ขอใบเสนอราคาผ่าน LINE</span>
      </a>
    </div>
  );
}
