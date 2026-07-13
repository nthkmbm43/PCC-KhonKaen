import { config } from "dotenv";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { pages, seoMetadata } from "@/db/schema";

config({ path: ".env.local" });
config({ path: ".env.production", override: true });

const homeSeo = {
  title: "PCC Post-Tension ขอนแก่น | กำแพงกันดิน รั้ว มอก",
  description:
    "PCC Post-Tension ขอนแก่น รับออกแบบ ผลิต ติดตั้ง กำแพงกันดิน รั้วสำเร็จรูป พื้น Precast และงานโพสเทนชั่น มาตรฐาน มอก. โดยทีมวิศวกร",
  keywords:
    "PCC Post-Tension, ขอนแก่น, มอก, กำแพงกันดิน, รั้วสำเร็จรูป, พื้น Precast, โพสเทนชั่น, พีซีซี โพสเทนชั่น",
};

const keywordBlock = {
  blockType: "richText",
  type: "richText",
  id: "home-keyword-consistency",
  headline: "PCC Post-Tension ขอนแก่น มาตรฐาน มอก.",
  content: `
    <section class="mx-auto max-w-5xl px-4 py-10 text-center">
      <p class="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-brand-600">PCC Post-Tension Khon Kaen</p>
      <h2 class="text-2xl font-extrabold text-slate-900 sm:text-3xl">กำแพงกันดิน รั้วสำเร็จรูป พื้น Precast และงานโพสเทนชั่น ขอนแก่น</h2>
      <p class="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600">
        พีซีซี โพสเทนชั่น ขอนแก่น ให้บริการผลิตและติดตั้งงานคอนกรีตสำเร็จรูปมาตรฐาน มอก.
        ครอบคลุมกำแพงกันดิน รั้วสำเร็จรูป พื้น Precast และงานโพสเทนชั่นสำหรับบ้าน โครงการ โรงงาน
        พร้อมคำปรึกษาจากทีมวิศวกรและการตรวจสอบมาตรฐานก่อนส่งมอบทุกงาน
      </p>
    </section>
  `,
};

function normalizeLayout(content: unknown) {
  return Array.isArray(content) ? [...content] : [];
}

async function main() {
  const [home] = await db.select().from(pages).where(eq(pages.slug, "home")).limit(1);

  if (!home) {
    throw new Error("Home page not found");
  }

  const layout = normalizeLayout(home.content);
  const existingIndex = layout.findIndex((block) => {
    if (!block || typeof block !== "object") return false;
    const record = block as Record<string, unknown>;
    return record.id === keywordBlock.id || record.blockType === "homeKeywordConsistency";
  });

  if (existingIndex >= 0) {
    layout[existingIndex] = keywordBlock;
  } else {
    const insertAt = layout.findIndex((block) => {
      if (!block || typeof block !== "object") return false;
      const record = block as Record<string, unknown>;
      return record.blockType === "featuredLinks" || record.type === "featuredLinks";
    });
    layout.splice(insertAt >= 0 ? insertAt : 1, 0, keywordBlock);
  }

  await db
    .update(pages)
    .set({
      content: layout,
      seoTitle: homeSeo.title,
      seoDescription: homeSeo.description,
      seoKeywords: homeSeo.keywords,
      updatedAt: new Date(),
    })
    .where(eq(pages.id, home.id));

  const [existingSeo] = await db
    .select()
    .from(seoMetadata)
    .where(and(eq(seoMetadata.resourceType, "page"), eq(seoMetadata.resourceId, home.id)))
    .limit(1);

  if (existingSeo) {
    await db
      .update(seoMetadata)
      .set({
        title: homeSeo.title,
        description: homeSeo.description,
        keywords: homeSeo.keywords,
        updatedAt: new Date(),
      })
      .where(eq(seoMetadata.id, existingSeo.id));
  } else {
    await db.insert(seoMetadata).values({
      resourceType: "page",
      resourceId: home.id,
      title: homeSeo.title,
      description: homeSeo.description,
      keywords: homeSeo.keywords,
    });
  }

  console.log(`Updated home SEO title (${homeSeo.title.length} chars) and keyword consistency block.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
