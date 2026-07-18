"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ProductGalleryItem = {
  title?: string;
  description?: string;
  image?: string;
};

type ProductGalleryCarouselProps = {
  title?: string;
  description?: string;
  items: ProductGalleryItem[];
  autoplay?: boolean;
  delay?: number;
};

export function ProductGalleryCarousel({
  title = "ภาพผลงานและขั้นตอนบริการ",
  description,
  items,
  autoplay = true,
  delay = 4500,
}: ProductGalleryCarouselProps) {
  const slides = useMemo(
    () => items.filter((item) => item.image && item.image.trim().length > 0),
    [items]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);

  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, Math.max(delay, 1500));

    return () => window.clearInterval(timer);
  }, [delay, isPlaying, slides.length]);

  if (slides.length === 0) return null;

  const activeSlide = slides[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] overflow-hidden">
      <div className="p-5 sm:p-6 lg:p-8 border-b border-slate-100">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-brand-600 tracking-wide">PROJECT GALLERY</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{title}</h2>
            {description && (
              <p className="text-slate-600 mt-2 leading-relaxed max-w-2xl">{description}</p>
            )}
          </div>
          <div className="text-sm font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-4 py-2 w-max">
            {activeIndex + 1} / {slides.length}
          </div>
        </div>
      </div>

      <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-slate-100">
        <Image
          src={activeSlide.image || "/images/placeholder.jpg"}
          alt={activeSlide.title || title}
          fill
          quality={75}
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

        {slides.length > 1 && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="ดูภาพก่อนหน้า"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow-lg"
              onClick={goToPrevious}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="ดูภาพถัดไป"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow-lg"
              onClick={goToNext}
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </>
        )}

        <div className="absolute left-0 right-0 bottom-0 p-5 sm:p-6 lg:p-8 text-white">
          <div className="max-w-3xl">
            <p className="text-sm font-bold text-white/70 mb-2">
              ภาพที่ {activeIndex + 1} จาก {slides.length}
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold drop-shadow-md">
              {activeSlide.title || title}
            </h3>
            {activeSlide.description && (
              <p className="mt-2 text-white/90 leading-relaxed text-base sm:text-lg drop-shadow-md">
                {activeSlide.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 bg-slate-50 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={`${slide.image}-${index}`}
                type="button"
                aria-label={`เปิดภาพที่ ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  activeIndex === index ? "w-8 bg-brand-600" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          {slides.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full gap-2 bg-white"
              onClick={() => setIsPlaying((current) => !current)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? "หยุดเลื่อน" : "เลื่อนอัตโนมัติ"}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {slides.map((slide, index) => (
            <button
              key={`thumb-${slide.image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all ${
                activeIndex === index ? "border-brand-500 shadow-md" : "border-white hover:border-brand-200"
              }`}
            >
              <Image
                src={slide.image || "/images/placeholder.jpg"}
                alt={slide.title || `ภาพที่ ${index + 1}`}
                fill
                quality={90}
                sizes="180px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
