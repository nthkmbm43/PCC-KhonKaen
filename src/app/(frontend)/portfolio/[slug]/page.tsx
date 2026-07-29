import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import { getAllPortfolios, getPortfolioBySlug, portfolioCategoryLabels } from '@/data/portfolio';
import { absoluteUrl, breadcrumbJsonLd, createSeoMetadata, JsonLd } from '@/lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getAllPortfolios()).map((portfolio) => ({ slug: portfolio.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);
  if (!portfolio) return {};
  return createSeoMetadata({
    title: `${portfolio.title} | ผลงานอ้างอิง PCC ขอนแก่น`,
    description: portfolio.description,
    path: `/portfolio/${portfolio.slug}`,
    image: portfolio.image,
  });
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);
  if (!portfolio) notFound();

  const categoryLabel = portfolioCategoryLabels[portfolio.category] || portfolio.category;
  const schema = [
    breadcrumbJsonLd([
      { name: 'หน้าแรก', url: '/' },
      { name: 'ผลงานของเรา', url: '/portfolio' },
      { name: portfolio.title, url: `/portfolio/${portfolio.slug}` },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': `${absoluteUrl(`/portfolio/${portfolio.slug}`)}#project`,
      name: portfolio.title,
      description: portfolio.description,
      image: absoluteUrl(portfolio.image),
      url: absoluteUrl(`/portfolio/${portfolio.slug}`),
      inLanguage: 'th-TH',
      locationCreated: portfolio.location,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-16 sm:py-24">
      <JsonLd data={schema} />
      <article className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link href="/portfolio" className="inline-flex items-center gap-2 font-bold text-brand-700 hover:text-brand-900">
          <ArrowLeft size={18} /> กลับไปผลงานทั้งหมด
        </Link>
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="relative aspect-[16/10] bg-slate-200">
            <Image src={portfolio.image} alt={portfolio.title} fill priority sizes="(max-width: 1200px) 100vw, 1200px" className="object-cover" />
          </div>
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="flex flex-wrap gap-3 text-sm font-bold">
              <span className="rounded-full bg-blue-50 px-4 py-2 text-blue-800">{categoryLabel}</span>
              {portfolio.location && <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-slate-700"><MapPin size={16} />{portfolio.location}</span>}
              {portfolio.referenceDate && <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-slate-700"><CalendarDays size={16} />ข้อมูลอ้างอิง {portfolio.referenceDate}</span>}
            </div>
            <h1 className="mt-6 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">{portfolio.title}</h1>
            <p className="mt-6 text-lg leading-9 text-slate-600">{portfolio.description}</p>
            <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
              โครงการนี้เป็นผลงานอ้างอิงจากประสบการณ์การดำเนินงานเดิมของบริษัท ทีมเว็บไซต์ทำหน้าที่รับข้อมูลลูกค้าและส่งต่อให้ทีมขายกับวิศวกรผู้รับผิดชอบประเมินงานใหม่
            </div>
            <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-8 sm:flex-row">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 py-3 font-bold text-white hover:bg-brand-800">ส่งรายละเอียดให้ทีมงาน <ArrowRight size={18} /></Link>
              <Link href="/products" className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-800 hover:bg-slate-100">ดูสินค้าและบริการ</Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
