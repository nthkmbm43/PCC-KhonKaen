import { config } from "dotenv";
config({ path: ".env.local" });
import { db } from "./src/db";
import { pages } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function seed() {
  const existingHome = await db.select().from(pages).where(eq(pages.slug, "home"));
  if (existingHome.length === 0) {
    await db.insert(pages).values([
      {
        title: "หน้าแรก (Home)",
        slug: "home",
        status: "published",
        content: [
          { blockType: "homeHero" },
          { blockType: "trustBanner" },
          { blockType: "servicesGrid" },
          { blockType: "portfolioGrid" },
          { blockType: "faqSection" },
          { blockType: "ctaBanner" },
        ]
      },
      {
        title: "เกี่ยวกับเรา (About)",
        slug: "about",
        status: "published",
        content: []
      },
      {
        title: "ติดต่อเรา (Contact)",
        slug: "contact",
        status: "published",
        content: []
      }
    ]);
    console.log("Seeded pages!");
  } else {
    console.log("Pages already exist.");
  }
}

seed().catch(console.error);
