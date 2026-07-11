import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { db } from "../src/db";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), ".env.production"), override: true });

const facebookUrl = "https://www.facebook.com/profile.php?id=61591107462645";
const tiktokUrl = "https://www.tiktok.com/@pcc.sales.kk";

async function main() {
  const rows = await db.execute(sql`
    UPDATE "site_settings"
    SET
      "facebook_url" = ${facebookUrl},
      "tiktok_url" = ${tiktokUrl},
      "updated_at" = NOW()
    WHERE "id" = (
      SELECT "id"
      FROM "site_settings"
      ORDER BY "updated_at" DESC NULLS LAST
      LIMIT 1
    )
    RETURNING "facebook_url", "tiktok_url";
  `);

  console.log(JSON.stringify(rows, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
