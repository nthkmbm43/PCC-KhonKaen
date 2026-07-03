import { db } from "./index";
import { pages, products, seoMetadata } from "./schema";
import { legacyProducts } from "../data/legacy-products";

async function runSeed() {
  console.log("Starting DB Seed for CMS-002...");

  // 1. Seed Pages
  const pagesToSeed = [
    {
      slug: "home",
      title: "หน้าแรก",
      template: "landing" as const,
      status: "published",
      workflowState: "published" as const,
      content: [
        { blockType: "homeHero" },
        { blockType: "trustBanner" },
        { blockType: "servicesGrid" },
        { blockType: "portfolioGrid" },
        { blockType: "faqSection" },
        { blockType: "ctaBanner" }
      ],
      seoTitle: "รับเหมาโพสเทนชั่น ขอนแก่น | กำแพงกันดิน รั้วสำเร็จรูป แผ่นพื้นสำเร็จรูป",
      seoDescription: "พีซีซี โพสเทนชั่น รับออกแบบ ผลิต และติดตั้งงานโพสเทนชั่น กำแพงกันดินตัว L รั้วสำเร็จรูป และแผ่นพื้นสำเร็จรูป ขอนแก่น ภาคอีสาน และเชียงใหม่"
    },
    {
      slug: "about",
      title: "เกี่ยวกับเรา",
      template: "about" as const,
      status: "published",
      workflowState: "published" as const,
      content: [
        { blockType: "aboutHero" }, 
        { blockType: "aboutContent" }, 
        { blockType: "aboutFeatureGrid" }
      ],
      seoTitle: "เกี่ยวกับเรา | PCC Post-Tension",
      seoDescription: "ข้อมูลบริษัท พีซีซี โพสเทนชั่น ผู้เชี่ยวชาญด้านงานพื้นอัดแรง กำแพงกันดิน รั้วสำเร็จรูป"
    },
    {
      slug: "contact",
      title: "ติดต่อเรา",
      template: "contact" as const,
      status: "published",
      workflowState: "published" as const,
      content: [
        { blockType: "contactInfo" }, 
        { blockType: "contactSocial" }
      ],
      seoTitle: "ติดต่อเรา | PCC Post-Tension",
      seoDescription: "ติดต่อสอบถามราคาและบริการ PCC Post-Tension"
    }
  ];

  console.log(`Seeding ${pagesToSeed.length} pages...`);
  for (const p of pagesToSeed) {
    const insertedPages = await db.insert(pages).values({
      slug: p.slug,
      title: p.title,
      template: p.template,
      status: p.status,
      workflowState: p.workflowState,
      content: p.content,
      publishedAt: new Date(),
    }).onConflictDoNothing().returning({ id: pages.id });

    if (insertedPages.length > 0) {
      await db.insert(seoMetadata).values({
        resourceId: insertedPages[0].id,
        resourceType: "page",
        title: p.seoTitle,
        description: p.seoDescription,
      }).onConflictDoNothing();
    }
  }

  // 2. Seed Products
  console.log(`Seeding ${legacyProducts.length} products...`);
  for (const prod of legacyProducts) {
    const insertedProds = await db.insert(products).values({
      slug: prod.slug,
      title: prod.title,
      shortTitle: prod.shortTitle || prod.title,
      description: prod.description || '',
      image: prod.image,
      category: prod.category || 'general',
      isFeatured: prod.isFeatured || false,
      status: "published",
      workflowState: "published" as const,
      content: prod.sections || prod.content || [],
      publishedAt: new Date(),
    }).onConflictDoNothing().returning({ id: products.id });

    if (insertedProds.length > 0) {
      await db.insert(seoMetadata).values({
        resourceId: insertedProds[0].id,
        resourceType: "product",
        title: prod.metaTitle || prod.title,
        description: prod.metaDescription || prod.description,
        keywords: Array.isArray(prod.keywords) ? prod.keywords.join(",") : (prod.keywords || ""),
        ogImage: prod.image,
      }).onConflictDoNothing();
    }
  }

  console.log("Seed complete!");
  process.exit(0);
}

runSeed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
