import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settingsArray = await db.select().from(siteSettings).limit(1);
  const settings = settingsArray[0] || {};
  
  const mappedSettings = {
    ...settings,
    logoUrl: settings.logoUrl ?? undefined,
    faviconUrl: settings.faviconUrl ?? undefined,
    mainPhone: settings.mainPhone ?? undefined,
    lineUrl: settings.lineUrl ?? undefined,
    facebookUrl: settings.facebookUrl ?? undefined,
    tiktokUrl: settings.tiktokUrl ?? undefined,
    googleMapsUrl: settings.googleMapsUrl ?? undefined,
    vercelDeployHookUrl: settings.vercelDeployHookUrl ?? undefined,
    workingHours: settings.workingHours ?? undefined,
    holidayNotice: settings.holidayNotice ?? undefined,
    companyAddress: settings.companyAddress ?? undefined,
    customHeadCode: settings.customHeadCode ?? undefined,
    customBodyCode: settings.customBodyCode ?? undefined,
    navbarLinks: (settings.navbarLinks as { label: string; url: string }[]) ?? [],
    footerData: (settings.footerData as { footerLogoUrl?: string; description?: string; copyright?: string }) ?? {},
  };

  return <SettingsForm initialData={mappedSettings} />;
}
