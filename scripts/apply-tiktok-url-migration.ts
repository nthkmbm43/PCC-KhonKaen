import { db } from "../src/db";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  await db.execute(sql`
    ALTER TABLE "site_settings"
    ADD COLUMN IF NOT EXISTS "tiktok_url" text;
  `);

  const result = await db.execute(sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'site_settings'
      AND column_name = 'tiktok_url';
  `);

  if (result.rows.length === 0) {
    throw new Error("tiktok_url column was not found after migration");
  }

  console.log("site_settings.tiktok_url is ready");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
