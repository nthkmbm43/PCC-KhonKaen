import { Quote, Star } from 'lucide-react';

type Testimonial = {
  name: string;
  role?: string;
  company?: string;
  message?: string;
  quote?: string;
  rating?: number;
  avatarInitials?: string;
  isVisible?: boolean;
};

type TestimonialBlockProps = {
  data: {
    headline?: string;
    subheadline?: string;
    description?: string;
    testimonials?: Testimonial[];
    items?: Testimonial[];
  };
};

export default function TestimonialBlock({ data }: TestimonialBlockProps) {
  const headline = data?.headline || 'เสียงจากลูกค้า';
  const subheadline = data?.subheadline || data?.description;
  const source = data?.items?.length ? data.items : data?.testimonials;
  const testimonials = (source || []).filter(
    (item) => item.isVisible !== false && item.name && (item.message || item.quote),
  );

  // Never publish invented placeholder reviews. The section appears only after
  // a verified testimonial is explicitly added in the CMS.
  if (testimonials.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-20 sm:py-24">
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-50 opacity-70 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-50 opacity-70 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-amber-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-700">
            รีวิวจากลูกค้า
          </span>
          <h2 className="mb-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {headline}
          </h2>
          {subheadline && <p className="mx-auto max-w-2xl text-lg text-gray-600">{subheadline}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((testimonial, index) => {
            const message = testimonial.message || testimonial.quote;
            const rating = typeof testimonial.rating === 'number'
              ? Math.min(5, Math.max(0, Math.round(testimonial.rating)))
              : 0;

            return (
              <article
                key={`${testimonial.name}-${index}`}
                className="relative flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute right-6 top-6 text-blue-100">
                  <Quote size={40} fill="currentColor" aria-hidden="true" />
                </div>

                {rating > 0 && (
                  <div className="flex gap-1" aria-label={`${rating} จาก 5 ดาว`}>
                    {Array.from({ length: rating }).map((_, starIndex) => (
                      <Star key={starIndex} size={18} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                    ))}
                  </div>
                )}

                <p className="relative z-10 flex-grow text-sm italic leading-relaxed text-gray-700">
                  &ldquo;{message}&rdquo;
                </p>

                <footer className="flex items-center gap-4 border-t border-gray-100 pt-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-sm font-bold text-white">
                    {testimonial.avatarInitials || testimonial.name.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                    {(testimonial.role || testimonial.company) && (
                      <p className="text-xs text-gray-500">
                        {testimonial.role}{testimonial.role && testimonial.company ? ' · ' : ''}{testimonial.company}
                      </p>
                    )}
                  </div>
                </footer>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
