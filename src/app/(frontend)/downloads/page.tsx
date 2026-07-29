import Link from 'next/link';
import { BookOpenCheck, FileText, FolderDown, Info, ShieldCheck } from 'lucide-react';
import { TrackedDownloadLink } from '@/components/documents/TrackedDownloadLink';
import { downloadCategoryLabels, type DownloadCategory } from '@/data/documents';
import { absoluteUrl, createSeoMetadata, JsonLd } from '@/lib/seo';
import { getPublishedDocuments } from '@/lib/repositories/document';

export const revalidate = 3600;

export const metadata = createSeoMetadata({
  title: 'ดาวน์โหลด Catalog และข้อมูลสินค้า Precast | PCC ขอนแก่น',
  description: 'ดาวน์โหลด Catalog กำแพงกันดิน รั้วสำเร็จรูป เสารั้วลวดหนาม แผ่นพื้น โครงสร้างสำเร็จรูป และระบบ Post-Tension จาก PCC ขอนแก่น',
  path: '/downloads',
});

function formatSize(bytes: number) {
  if (!bytes) return 'PDF';
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;
}

export default async function DownloadsPage() {
  const documents = await getPublishedDocuments();
  const categoryOrder: DownloadCategory[] = ['catalog', 'specification', 'certificate', 'company-profile', 'installation-guide'];
  const activeCategories = categoryOrder.filter((category) => documents.some((item) => item.category === category));

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl('/downloads')}#webpage`,
    name: 'ศูนย์ดาวน์โหลดเอกสาร PCC ขอนแก่น',
    url: absoluteUrl('/downloads'),
    inLanguage: 'th-TH',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: documents.length,
      itemListElement: documents.map((document, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'DigitalDocument',
          name: document.title,
          description: document.description,
          encodingFormat: 'application/pdf',
          contentUrl: absoluteUrl(document.fileUrl),
        },
      })),
    },
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd data={itemList} />
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-20 text-white sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,.22),transparent_38%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-blue-200"><Link href="/" className="hover:text-white">หน้าแรก</Link><span className="mx-2">/</span><span>ดาวน์โหลด</span></nav>
          <div className="max-w-3xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-bold text-blue-200"><FolderDown className="h-4 w-4" />ศูนย์เอกสาร PCC</div><h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">ดาวน์โหลด Catalog และข้อมูลทางเทคนิค</h1><p className="mt-6 text-lg leading-8 text-slate-300">รวมเอกสารสินค้า Precast กำแพงกันดิน รั้ว แผ่นพื้น โครงสร้างสำเร็จรูป และระบบ Post-Tension สำหรับศึกษาข้อมูลก่อนส่งรายละเอียดหน้างานให้ทีมขอนแก่น</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10 grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-blue-100 bg-blue-50 p-5"><BookOpenCheck className="h-6 w-6 text-blue-700" /><h2 className="mt-3 font-bold text-slate-900">เอกสารสินค้า</h2><p className="mt-1 text-sm leading-6 text-slate-600">รวมรายละเอียด ตาราง และข้อมูลประกอบการเลือกสินค้าไว้ในที่เดียว</p></div><div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5"><ShieldCheck className="h-6 w-6 text-emerald-700" /><h2 className="mt-3 font-bold text-slate-900">ตรวจสอบก่อนใช้งาน</h2><p className="mt-1 text-sm leading-6 text-slate-600">ยืนยันรุ่น ขนาด และเงื่อนไขกับทีมงานขอนแก่นก่อนสั่งซื้อทุกครั้ง</p></div><div className="rounded-2xl border border-amber-100 bg-amber-50 p-5"><Info className="h-6 w-6 text-amber-700" /><h2 className="mt-3 font-bold text-slate-900">ดาวน์โหลดจากเว็บนี้</h2><p className="mt-1 text-sm leading-6 text-slate-600">ปุ่มดาวน์โหลดเปิดไฟล์ PDF จากเว็บไซต์นี้โดยตรง ไม่มีการส่งต่อไปเว็บไซต์อื่น</p></div></div>

        <div className="space-y-14">
          {activeCategories.map((category) => (
            <section key={category} aria-labelledby={`category-${category}`}>
              <div className="mb-6 flex items-end justify-between gap-4 border-b border-slate-200 pb-4"><div><p className="text-xs font-black uppercase tracking-[.18em] text-blue-600">PDF Documents</p><h2 id={`category-${category}`} className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">{downloadCategoryLabels[category]}</h2></div><span className="text-sm text-slate-500">{documents.filter((item) => item.category === category).length} รายการ</span></div>
              <div className="grid gap-5 lg:grid-cols-2">
                {documents.filter((item) => item.category === category).map((document) => (
                  <article key={document.slug} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:p-7">
                    <div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"><FileText className="h-6 w-6" /></div><div className="min-w-0"><h3 className="text-xl font-bold leading-7 text-slate-900">{document.title}</h3><p className="mt-1 text-xs font-semibold text-slate-500">PDF · {formatSize(document.fileSize)}{document.pageCount ? ` · ${document.pageCount} หน้า` : ''}</p></div></div>
                    <p className="mt-5 flex-1 text-sm leading-7 text-slate-600">{document.description}</p>
                    <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><TrackedDownloadLink slug={document.slug} title={document.title} />{document.relatedProduct && <Link href={document.relatedProduct.href} className="text-center text-sm font-bold text-blue-700 hover:underline">ดู{document.relatedProduct.label} →</Link>}</div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-slate-900 px-6 py-10 text-center text-white sm:px-10"><h2 className="text-2xl font-black sm:text-3xl">ต้องการให้ช่วยเลือกสินค้าและประเมินหน้างาน?</h2><p className="mx-auto mt-3 max-w-2xl text-slate-300">ส่งรูปพื้นที่ ขนาดโดยประมาณ และจังหวัดให้ทีมขอนแก่นช่วยตรวจข้อมูลเบื้องต้นได้</p><Link href="/contact" className="mt-6 inline-flex rounded-xl bg-blue-500 px-6 py-3 font-bold text-white hover:bg-blue-400">ติดต่อทีมขอนแก่น</Link></div>
      </section>
    </main>
  );
}
