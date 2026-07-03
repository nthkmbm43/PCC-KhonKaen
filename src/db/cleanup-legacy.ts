import { db } from "./index";
import { pages, seoMetadata } from "./schema";
import { ilike, inArray } from "drizzle-orm";

async function cleanup() {
  console.log("Finding legacy pages...");
  const legacyPages = await db.select({ id: pages.id }).from(pages).where(ilike(pages.title, 'Legacy Page %'));
  
  if (legacyPages.length === 0) {
    console.log("No legacy pages found.");
    process.exit(0);
  }

  const legacyPageIds = legacyPages.map(p => p.id);
  console.log(`Found ${legacyPageIds.length} legacy pages.`);

  console.log("Deleting associated SEO metadata...");
  await db.delete(seoMetadata).where(inArray(seoMetadata.resourceId, legacyPageIds));

  console.log("Deleting legacy pages...");
  await db.delete(pages).where(inArray(pages.id, legacyPageIds));

  console.log("Cleanup complete!");
  process.exit(0);
}

cleanup().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});
