import { getSiteSettings } from "./src/lib/getSiteSettings";

async function main() {
  const settings = await getSiteSettings();
  console.log("customHeadCode in DB:", settings.rawSettings?.customHeadCode);
}
main();
