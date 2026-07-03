import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settingsArray = await db.select().from(siteSettings).limit(1);
  const settings = settingsArray[0] || {};
  
  const mappedSettings = {
    ...settings,
    logoUrl: settings.logoUrl || undefined,
    faviconUrl: settings.faviconUrl || undefined,
    mainPhone: settings.mainPhone || undefined,
    lineUrl: settings.lineUrl || undefined,
    facebookUrl: settings.facebookUrl || undefined,
    navbarLinks: (settings.navbarLinks as any) || [],
    footerData: (settings.footerData as any) || {},
  };

  return <SettingsForm initialData={mappedSettings as any} />;
}
