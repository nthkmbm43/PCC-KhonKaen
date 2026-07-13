import Link from "next/link";
import { ArrowUpRight, Hammer, Sparkles } from "lucide-react";

type FeaturedLinkItem = {
  id?: string;
  title?: string;
  description?: string;
  href?: string;
  icon?: string;
  variant?: string;
  isVisible?: boolean;
};

const defaultItems: FeaturedLinkItem[] = [
  {
    title: "พื้น Precast",
    href: "/products/precast-wall-khon-kaen",
    icon: "hammer",
    variant: "light",
  },
  {
    title: "งานโพสเทนชั่น (Post-Tension)",
    href: "/products/post-tension-slab-khon-kaen",
    icon: "sparkles",
    variant: "green",
  },
];

function itemIcon(name?: string) {
  if (name === "sparkles") return <Sparkles className="h-5 w-5" aria-hidden="true" />;
  return <Hammer className="h-5 w-5" aria-hidden="true" />;
}

function itemClass(variant?: string) {
  if (variant === "green") {
    return "bg-[#00B900] text-white border-[#00B900] hover:bg-[#00a800] hover:border-[#00a800]";
  }

  return "bg-white text-blue-800 border-white hover:bg-blue-50";
}

export default function FeaturedLinksBlock({ data }: { data?: Record<string, unknown> }) {
  const headline = (data?.headline as string) || "พรีแคสท์ & โพสเทนชั่น";
  const description =
    (data?.description as string) ||
    "สองกลุ่มงานหลักสำหรับโครงการก่อสร้างที่ต้องการคุณภาพและความรวดเร็ว";
  const eyebrow = (data?.eyebrow as string) || "สินค้าแนะนำ • Best Sellers";
  const items = Array.isArray(data?.items)
    ? (data.items as FeaturedLinkItem[]).filter((item) => item.isVisible !== false)
    : defaultItems;

  return (
    <section className="w-full py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="bg-blue-900 px-5 py-12 text-center text-white shadow-sm sm:px-10 sm:py-14 lg:px-16">
          {eyebrow && (
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.18em] text-blue-200">
              {eyebrow}
            </p>
          )}
          <h2 className="mx-auto max-w-3xl text-2xl font-extrabold leading-tight text-white sm:text-4xl">
            {headline}
          </h2>
          {description && (
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-blue-100 sm:mt-6 sm:text-lg sm:leading-8">
              {description}
            </p>
          )}

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            {items.map((item, index) => {
              const href = item.href || "/";
              return (
                <Link
                  key={item.id || `${item.title}-${index}`}
                  href={href}
                  className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-bold leading-snug transition sm:min-h-14 sm:w-auto sm:min-w-72 sm:gap-3 sm:px-7 sm:py-4 sm:text-base ${itemClass(item.variant || (index === 1 ? "green" : "light"))}`}
                >
                  {itemIcon(item.icon)}
                  <span>{item.title || "รายการสินค้า"}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
