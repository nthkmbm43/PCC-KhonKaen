import "dotenv/config";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { pages } from "@/db/schema";

config({ path: ".env.local" });

const brokenFenceImage =
  "https://pcc-posttension.com/wp-content/uploads/2025/03/%E0%B8%A3%E0%B8%B1%E0%B9%89%E0%B8%A7%E0%B8%AA%E0%B8%B3%E0%B9%80%E0%B8%A3%E0%B9%87%E0%B8%88%E0%B8%A3%E0%B8%B9%E0%B8%9B-min.webp";

function fixString(value: string) {
  return value
    .replaceAll(
      "/products/hollow-core-slab",
      "/products/precast-concrete-slab-khon-kaen",
    )
    .replace(
      /\/products\/post-tension(?=[\"'#?<\s])/g,
      "/products/post-tension-slab-khon-kaen",
    )
    .replaceAll(brokenFenceImage, "/images/product-precast-fence.jpg");
}

function fixLinks(value: unknown): unknown {
  if (typeof value === "string") return fixString(value);
  if (Array.isArray(value)) return value.map(fixLinks);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, fixLinks(child)]),
    );
  }
  return value;
}

async function main() {
  const rows = await db.select().from(pages);
  const changedSlugs: string[] = [];

  for (const page of rows) {
    const nextContent = fixLinks(page.content);
    if (JSON.stringify(nextContent) === JSON.stringify(page.content)) continue;

    await db
      .update(pages)
      .set({ content: nextContent, updatedAt: new Date() })
      .where(eq(pages.id, page.id));
    changedSlugs.push(page.slug);
  }

  console.log(
    changedSlugs.length > 0
      ? `Updated link hygiene on: ${changedSlugs.join(", ")}`
      : "No database link changes were needed.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
