import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  MessageCircle,
  Phone,
  ShieldAlert,
} from "lucide-react";
import { articles, getArticle, getRelatedArticles } from "@/data/articles";
import { absoluteUrl, createSeoMetadata, JsonLd } from "@/lib/seo";
import { getSiteSettings } from "@/lib/getSiteSettings";

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return createSeoMetadata({
      title: "ไม่พบบทความ | PCC Post-Tension ขอนแก่น",
      description: "ไม่พบบทความหรือคู่มือที่คุณกำลังค้นหา",
      path: `/articles/${slug}`,
    });
  }

  return createSeoMetadata({
    title: article.seoTitle,
    description: article.description,
    path: `/articles/${article.slug}`,
    image: article.image,
    keywords: [article.category, `${article.category} ขอนแก่น`, "คู่มือก่อสร้าง", "ขอราคางานก่อสร้าง"],
  });
}

function formatThaiDate(value: string) {
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00+07:00`));
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) notFound();

  const [settings, relatedArticles] = await Promise.all([
    getSiteSettings(),
    Promise.resolve(getRelatedArticles(article)),
  ]);
  const articleUrl = absoluteUrl(`/articles/${article.slug}`);
  const phone = settings.contact.mainPhone;
  const phoneHref = phone.replace(/\D/g, "");

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${articleUrl}#article`,
      headline: article.title,
      description: article.description,
      image: [absoluteUrl(article.image)],
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      inLanguage: "th-TH",
      mainEntityOfPage: articleUrl,
      author: {
        "@type": "Organization",
        name: "ทีม PCC Post-Tension สาขาขอนแก่น",
        url: absoluteUrl("/about"),
      },
      publisher: {
        "@id": `${absoluteUrl("/")}#organization`,
      },
      about: {
        "@type": "Thing",
        name: article.category,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "หน้าแรก",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "บทความและคู่มือ",
          item: absoluteUrl("/articles"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title,
          item: articleUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: article.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <div className="bg-white">
      <JsonLd data={structuredData} />

      <header className="border-b border-slate-200 bg-slate-950 px-4 pb-16 pt-12 text-white sm:px-6 lg:pb-24 lg:pt-16">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-9 flex flex-wrap items-center gap-2 text-sm text-slate-300">
            <Link href="/" className="hover:text-white">
              หน้าแรก
            </Link>
            <span className="text-slate-600">/</span>
            <Link href="/articles" className="hover:text-white">
              บทความ
            </Link>
            <span className="text-slate-600">/</span>
            <span aria-current="page" className="text-brand-300">
              {article.category}
            </span>
          </nav>

          <div className="grid items-end gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-300">
                <span className="bg-brand-500 px-3 py-1.5 font-black text-slate-950">{article.category}</span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={17} />
                  {formatThaiDate(article.updatedAt)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 size={17} />
                  {article.readTime}
                </span>
              </div>
              <h1 className="mt-7 max-w-5xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                {article.title}
              </h1>
              <p className="mt-7 max-w-4xl text-lg leading-8 text-slate-300">{article.description}</p>
            </div>

            <div className="hidden border-l border-white/20 pl-8 lg:block">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-300">จัดทำโดย</p>
              <p className="mt-3 text-xl font-black">ทีม PCC Post-Tension</p>
              <p className="mt-2 leading-7 text-slate-400">สาขาขอนแก่น · ฝ่ายขายและทีมเทคนิค</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-10 sm:px-6 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
          <article>
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 shadow-xl">
              <Image
                src={article.image}
                alt={article.imageAlt}
                fill
                preload
                quality={82}
                sizes="(max-width: 1024px) 100vw, 850px"
                className="object-cover"
              />
            </div>

            <section className="mt-10 border-l-4 border-brand-500 bg-brand-50 p-6 sm:p-8">
              <div className="flex items-center gap-3 text-brand-800">
                <FileCheck2 size={25} />
                <h2 className="text-xl font-black">สรุปก่อนเริ่ม</h2>
              </div>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {article.summary.map((item) => (
                  <li key={item} className="flex gap-3 leading-7 text-slate-800">
                    <CheckCircle2 size={19} className="mt-1 shrink-0 text-brand-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-12 space-y-14">
              {article.sections.map((section, index) => (
                <section key={section.heading} id={`section-${index + 1}`} className="scroll-mt-32">
                  <div className="mb-5 flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-slate-950 font-black text-brand-400">
                      {index + 1}
                    </span>
                    <h2 className="pt-1 text-2xl font-black leading-snug text-slate-950 sm:text-3xl">
                      {section.heading}
                    </h2>
                  </div>
                  <div className="space-y-5 text-[17px] leading-8 text-slate-700">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.bullets ? (
                    <ul className="mt-6 grid gap-3 border border-slate-200 bg-slate-50 p-6 sm:grid-cols-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 leading-7 text-slate-800">
                          <CheckCircle2 size={18} className="mt-1 shrink-0 text-brand-600" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {section.callout ? (
                    <div className="mt-6 flex gap-4 border-l-4 border-accent-500 bg-blue-50 p-5 leading-7 text-slate-800">
                      <ShieldAlert size={23} className="mt-0.5 shrink-0 text-accent-600" />
                      <p>{section.callout}</p>
                    </div>
                  ) : null}
                </section>
              ))}
            </div>

            <section className="mt-14 bg-slate-950 p-7 text-white sm:p-9">
              <div className="flex items-center gap-3">
                <FileCheck2 size={27} className="text-brand-400" />
                <h2 className="text-2xl font-black">เช็กลิสต์ก่อนส่งให้ทีมประเมิน</h2>
              </div>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {article.checklist.map((item) => (
                  <li key={item} className="flex gap-3 border border-white/10 bg-white/5 p-4 leading-7 text-slate-200">
                    <CheckCircle2 size={19} className="mt-1 shrink-0 text-brand-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-14">
              <div className="border-l-4 border-brand-500 pl-5">
                <p className="text-sm font-bold uppercase tracking-widest text-brand-700">FAQ</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">คำถามที่พบบ่อย</h2>
              </div>
              <div className="mt-7 divide-y divide-slate-200 border-y border-slate-200">
                {article.faq.map((item) => (
                  <details key={item.question} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-black text-slate-950">
                      {item.question}
                      <span className="text-2xl text-brand-600 transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="max-w-3xl pt-4 leading-8 text-slate-600">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="mt-14 border border-amber-200 bg-amber-50 p-6 text-sm leading-7 text-amber-950">
              <strong>หมายเหตุด้านวิศวกรรม:</strong>{" "}
              เนื้อหานี้เป็นแนวทางเตรียมข้อมูลเบื้องต้น ไม่ใช่แบบก่อสร้างหรือรายการคำนวณ
              การเลือกผลิตภัณฑ์ ขนาด และวิธีติดตั้งต้องพิจารณาจากหน้างานและแบบที่ได้รับการตรวจสอบโดยผู้รับผิดชอบโครงการ
            </section>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            <div className="border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center gap-2 text-sm font-black text-brand-700">
                <BookOpen size={18} />
                สารบัญ
              </div>
              <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                {article.sections.map((section, index) => (
                  <li key={section.heading}>
                    <a href={`#section-${index + 1}`} className="flex gap-3 hover:text-brand-700">
                      <span className="font-black text-brand-600">{String(index + 1).padStart(2, "0")}</span>
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-slate-950 p-6 text-white">
              <p className="text-sm font-black uppercase tracking-widest text-brand-400">ขอประเมินเบื้องต้น</p>
              <h2 className="mt-3 text-2xl font-black">ส่งแบบหรือรูปหน้างานให้ทีมขอนแก่น</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                เตรียมข้อมูลตามเช็กลิสต์แล้วติดต่อทีมงาน เพื่อสอบถามรายละเอียดและแนวทางดำเนินงาน
              </p>
              <div className="mt-6 space-y-3">
                <Link
                  href="/contact"
                  className="flex min-h-12 items-center justify-center gap-2 bg-[#06C755] px-4 py-3 font-black text-white hover:bg-[#05b34c]"
                >
                  <MessageCircle size={19} />
                  ส่งข้อมูลประเมิน
                </Link>
                <a
                  href={`tel:${phoneHref}`}
                  className="flex min-h-12 items-center justify-center gap-2 border border-white/20 px-4 py-3 font-black text-white hover:border-brand-400 hover:text-brand-300"
                >
                  <Phone size={19} />
                  {phone}
                </a>
              </div>
            </div>

            <Link
              href={article.product.href}
              className="group block border border-brand-200 bg-brand-50 p-6 transition-colors hover:border-brand-400"
            >
              <p className="text-xs font-black uppercase tracking-widest text-brand-700">หน้าสินค้าที่เกี่ยวข้อง</p>
              <p className="mt-3 font-black leading-7 text-slate-950">{article.product.label}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-700">
                ดูรายละเอียด <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </aside>
        </div>
      </main>

      <section className="border-t border-slate-200 bg-slate-50 px-4 py-14 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-brand-700">อ่านต่อ</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">คู่มือที่เกี่ยวข้อง</h2>
            </div>
            <Link href="/articles" className="hidden items-center gap-2 font-bold text-brand-700 sm:inline-flex">
              ดูทั้งหมด <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {relatedArticles.map((related) => (
              <article key={related.slug} className="group overflow-hidden border border-slate-200 bg-white">
                <Link href={`/articles/${related.slug}`} className="relative block aspect-[16/10] overflow-hidden">
                  <Image
                    src={related.image}
                    alt={related.imageAlt}
                    fill
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <div className="p-5">
                  <p className="text-xs font-black text-brand-700">{related.category}</p>
                  <h3 className="mt-2 text-lg font-black leading-7 text-slate-950">
                    <Link href={`/articles/${related.slug}`} className="hover:text-brand-700">
                      {related.title}
                    </Link>
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
