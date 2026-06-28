import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settingsArray = await db.select().from(siteSettings).limit(1);
  const settings = settingsArray[0] || {};

  return <SettingsForm initialData={settings} />;
}
