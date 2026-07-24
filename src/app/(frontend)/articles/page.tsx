import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, MessageCircle } from "lucide-react";
import { articles } from "@/data/articles";
import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "บทความก่อสร้างและคู่มือเลือกสินค้า Precast | PCC ขอนแก่น",
  description:
    "รวมคู่มือเตรียมหน้างานและข้อมูลก่อนขอราคา ผนัง Precast รั้วสำเร็จรูป กำแพงกันดิน แผ่นพื้น Post-Tension เสาเข็ม และเสารั้วลวดหนาม",
  path: "/articles",
  keywords: [
    "บทความก่อสร้าง",
    "คู่มือ Precast",
    "ผนัง Precast ขอนแก่น",
    "รั้วสำเร็จรูป ขอนแก่น",
    "กำแพงกันดิน ขอนแก่น",
  ],
});

export default function ArticlesPage() {
  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white sm:px-6 lg:py-28">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.14) 1px,transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-500/25 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-300">
            <Link href="/" className="hover:text-white">
              หน้าแรก
            </Link>
            <span className="mx-2 text-slate-600">/</span>
            <span aria-current="page">บทความและคู่มือ</span>
          </nav>

          <div className="grid items-end gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <span className="inline-flex items-center gap-2 border border-brand-400/40 bg-brand-400/10 px-4 py-2 text-sm font-bold text-brand-300">
                <BookOpen size={17} />
                PCC KNOWLEDGE
              </span>
              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                เตรียมข้อมูลให้พร้อม
                <span className="block text-brand-400">ก่อนคุยราคาและเริ่มหน้างาน</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                คู่มือจากมุมมองงานจริงสำหรับเจ้าของบ้าน เจ้าของที่ดิน ผู้รับเหมา
                และฝ่ายจัดซื้อ ช่วยให้ส่งข้อมูลได้ครบ ประเมินได้เร็ว และลดปัญหาที่มักพบระหว่างดำเนินงาน
              </p>
            </div>

            <div className="border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-brand-300">เริ่มต้นง่าย ๆ</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                {[
                  "เลือกคู่มือตามสินค้าที่สนใจ",
                  "เตรียมแบบ รูป และขนาดตามเช็กลิสต์",
                  "ส่งข้อมูลให้ทีมช่วยประเมินเบื้องต้น",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 size={18} className="mt-1 shrink-0 text-brand-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-3 border-l-4 border-brand-500 pl-5">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-700">Buyer guides</p>
            <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">คู่มือครบทุกกลุ่มสินค้า</h2>
            <p className="max-w-3xl leading-7 text-slate-600">
              เนื้อหาแต่ละชิ้นเขียนเพื่อช่วยเตรียมข้อมูลก่อนประเมิน ไม่ใช้แทนแบบก่อสร้าง
              การคำนวณ หรือคำแนะนำจากวิศวกรประจำโครงการ
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article, index) => (
              <article
                key={article.slug}
                className={`group flex flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl ${
                  index === 0 ? "md:col-span-2 xl:col-span-2 xl:grid xl:grid-cols-2" : ""
                }`}
              >
                <Link
                  href={`/articles/${article.slug}`}
                  className={`relative block overflow-hidden bg-slate-200 ${
                    index === 0 ? "min-h-72 xl:min-h-full" : "aspect-[16/10]"
                  }`}
                >
                  <Image
                    src={article.image}
                    alt={article.imageAlt}
                    fill
                    quality={78}
                    sizes={index === 0 ? "(max-width: 1280px) 100vw, 42vw" : "(max-width: 768px) 100vw, 33vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
                  <span className="absolute left-4 top-4 bg-brand-500 px-3 py-1.5 text-xs font-black text-slate-950">
                    {article.category}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-6 lg:p-8">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Clock3 size={15} />
                    อ่านประมาณ {article.readTime}
                  </div>
                  <h2 className="mt-4 text-2xl font-black leading-snug text-slate-950">
                    <Link href={`/articles/${article.slug}`} className="transition-colors hover:text-brand-700">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="mt-4 line-clamp-3 leading-7 text-slate-600">{article.excerpt}</p>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="mt-7 inline-flex min-h-11 items-center gap-2 self-start font-bold text-brand-700 transition-colors hover:text-brand-900"
                  >
                    อ่านคู่มือ <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 bg-slate-950 p-8 text-white sm:p-10 lg:flex-row lg:items-center">
          <div>
            <p className="font-bold text-brand-400">มีแบบหรือรูปหน้างานแล้ว?</p>
            <h2 className="mt-2 text-3xl font-black">ส่งข้อมูลให้ทีมขอนแก่นช่วยประเมินเบื้องต้น</h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-300">
              แจ้งประเภทงาน ขนาดโดยประมาณ พิกัด และช่วงเวลาที่ต้องการ ทีมงานจะติดต่อกลับเพื่อสอบถามรายละเอียดเพิ่มเติม
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 bg-[#06C755] px-6 py-3 font-black text-white transition-transform hover:-translate-y-1"
          >
            <MessageCircle size={20} />
            ส่งข้อมูลประเมิน
          </Link>
        </div>
      </section>
    </div>
  );
}
