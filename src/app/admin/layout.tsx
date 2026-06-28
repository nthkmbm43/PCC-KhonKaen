import "../globals.css";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export async function generateMetadata(): Promise<Metadata> {
  const settingsArray = await db.select().from(siteSettings).limit(1);
  const settings = settingsArray[0];

  return {
    title: "Admin Dashboard | PCC CMS",
    description: "Manage your website content",
    icons: {
      icon: settings?.faviconUrl || settings?.logoUrl || "/images/logo.png",
      shortcut: settings?.faviconUrl || settings?.logoUrl || "/images/logo.png",
      apple: settings?.faviconUrl || settings?.logoUrl || "/images/logo.png",
    },
  };
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="antialiased bg-slate-100 text-slate-900">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid #334155",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#22c55e", secondary: "#1e293b" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#1e293b" },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
