import "dotenv/config";
import { config } from "dotenv";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { pages, seoMetadata } from "@/db/schema";

config({ path: ".env.local" });
config({ path: ".env.production", override: true });

const featuredLinksBlock = {
  id: "home-featured-links",
  blockType: "featuredLinks",
  isVisible: true,
  eyebrow: "สินค้าแนะนำ • Best Sellers",
  headline: "พื้น Precast & งานโพสเทนชั่น",
  description:
    "ประหยัดเวลา ลดต้นทุน และได้โครงสร้างที่แข็งแรงกว่า ด้วยวัสดุสำเร็จรูปจากโรงงานมาตรฐาน มอก. ที่คุณไว้ใจได้",
  items: [
    {
      id: "precast-floor",
      title: "พื้น Precast",
      description: "จัดการลิงก์และข้อความได้จากหลังบ้าน",
      href: "/products/precast-wall-khon-kaen",
      icon: "hammer",
      variant: "light",
      isVisible: true,
    },
    {
      id: "post-tension",
      title: "งานโพสเทนชั่น (Post-Tension)",
      description: "จัดการลิงก์และข้อความได้จากหลังบ้าน",
      href: "/products/post-tension-slab-khon-kaen",
      icon: "sparkles",
      variant: "green",
      isVisible: true,
    },
  ],
};

function isOldFeaturedHtmlBlock(block: Record<string, unknown>) {
  const type = block.blockType || block.type;
  const body = `${block.description || ""}${block.content || ""}${block.html || ""}`;
  return (
    (type === "text" || type === "richText" || type === "content") &&
    typeof body === "string" &&
    body.includes("/products/hollow-core-slab") &&
    body.includes("Best Sellers")
  );
}

async function main() {
  const homeRows = await db.select().from(pages).where(eq(pages.slug, "home")).limit(1);
  const home = homeRows[0];

  if (!home) {
    throw new Error("Home page not found.");
  }

  const content = Array.isArray(home.content) ? home.content : [];
  let replaced = false;

  const nextContent = content.map((block) => {
    if (!replaced && isOldFeaturedHtmlBlock(block as Record<string, unknown>)) {
      replaced = true;
      return featuredLinksBlock;
    }

    return block;
  });

  if (!replaced) {
    const existingIndex = nextContent.findIndex((block) => {
      const record = block as Record<string, unknown>;
      return record.blockType === "featuredLinks" || record.type === "featuredLinks";
    });

    if (existingIndex >= 0) {
      nextContent[existingIndex] = {
        ...(nextContent[existingIndex] as Record<string, unknown>),
        ...featuredLinksBlock,
      };
      replaced = true;
    } else {
      nextContent.splice(Math.min(2, nextContent.length), 0, featuredLinksBlock);
    }
  }

  await db
    .update(pages)
    .set({
      content: nextContent,
      seoTitle: "กำแพงกันดิน รั้วสำเร็จรูป พื้น Precast โพสเทนชั่น ขอนแก่น | PCC",
      seoDescription:
        "PCC Post-Tension ขอนแก่น รับออกแบบ ผลิต ติดตั้ง พื้น Precast งานโพสเทนชั่น กำแพงกันดินตัว L รั้วสำเร็จรูป เสารั้วลวดหนาม มาตรฐาน มอก. โดยวิศวกร โทร 063-454-5656",
      updatedAt: new Date(),
    })
    .where(eq(pages.id, home.id));

  const existingSeo = await db
    .select()
    .from(seoMetadata)
    .where(and(eq(seoMetadata.resourceType, "page"), eq(seoMetadata.resourceId, home.id)))
    .limit(1);

  const seoValues = {
    title: "กำแพงกันดิน รั้วสำเร็จรูป พื้น Precast โพสเทนชั่น ขอนแก่น | PCC",
    description:
      "PCC Post-Tension ขอนแก่น รับออกแบบ ผลิต ติดตั้ง พื้น Precast งานโพสเทนชั่น กำแพงกันดินตัว L รั้วสำเร็จรูป เสารั้วลวดหนาม มาตรฐาน มอก. โดยวิศวกร โทร 063-454-5656",
    updatedAt: new Date(),
  };

  if (existingSeo.length > 0) {
    await db.update(seoMetadata).set(seoValues).where(eq(seoMetadata.id, existingSeo[0].id));
  } else {
    await db.insert(seoMetadata).values({
      resourceType: "page",
      resourceId: home.id,
      ...seoValues,
    });
  }

  console.log(
    replaced
      ? "Updated existing home featured links block."
      : "Inserted home featured links block."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
