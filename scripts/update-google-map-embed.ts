import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

config({ path: ".env.local" });
config({ path: ".env.production", override: true });

const googleMapsEmbed =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d61215.556237235556!2d102.774184!3d16.476942!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3122604e86f3ffff%3A0xf6a12f14d76e2489!2z4Lia4Lij4Li04Lip4Lix4LiXIOC4nuC4teC4i-C4teC4i-C4tSDguYLguJ7guKrguYDguJfguJnguIrguLHguYjguJkg4LiI4Liz4LiB4Lix4LiU!5e0!3m2!1sth!2sth!4v1783936614924!5m2!1sth!2sth";

async function main() {
  const rows = await db.select().from(siteSettings).limit(1);

  if (!rows[0]) {
    await db.insert(siteSettings).values({
      googleMapsUrl: googleMapsEmbed,
      updatedAt: new Date(),
    });
    console.log("Inserted site settings with Google Maps embed URL.");
    return;
  }

  await db
    .update(siteSettings)
    .set({
      googleMapsUrl: googleMapsEmbed,
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, rows[0].id));

  console.log("Updated Google Maps embed URL in site settings.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
