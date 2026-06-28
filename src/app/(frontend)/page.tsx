import { db } from "@/db";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { faqs as homeFAQ } from "@/data/faq";
import { createSeoMetadata, faqJsonLd, JsonLd } from "@/lib/seo";
import RenderBlocks from "@/components/blocks/RenderBlocks";
import { getSiteSettings } from "@/lib/getSiteSettings";

export const metadata = createSeoMetadata({
  title:
    "รับเหมาโพสเทนชั่น ขอนแก่น | กำแพงกันดิน รั้วสำเร็จรูป แผ่นพื้นสำเร็จรูป",
  description:
    "พีซีซี โพสเทนชั่น รับออกแบบ ผลิต และติดตั้งงานโพสเทนชั่น กำแพงกันดินตัว L รั้วสำเร็จรูป และแผ่นพื้นสำเร็จรูป ขอนแก่น ภาคอีสาน และเชียงใหม่",
  path: "/",
});

export default async function Home() {
  // Fetch home page from DB
  let docs: any[] = [];
  try {
    docs = await db.select().from(pages).where(eq(pages.slug, "home")).limit(1);
  } catch (error) {
    console.error("Error fetching home page from DB:", error);
  }

  const page = docs[0];
  let layout = page?.content;

  // Solid Failsafe Logic: If page doesn't exist or has no blocks, use the default structure
  if (!Array.isArray(layout) || layout.length === 0) {
    layout = [
      { blockType: "homeHero" },
      { blockType: "trustBanner" },
      { blockType: "servicesGrid" },
      { blockType: "portfolioGrid" },
      { blockType: "faqSection" },
      { blockType: "ctaBanner" },
    ];
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-x-clip">
      <JsonLd data={faqJsonLd(homeFAQ)} />
      <RenderBlocks layout={layout} />
    </div>
  );
}
