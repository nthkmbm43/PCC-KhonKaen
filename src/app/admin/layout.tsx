import "../globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { getSiteSettings } from "@/lib/getSiteSettings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const icon = settings.contact.faviconUrl || settings.contact.logoUrl || "/images/logo.png";

  return {
    title: "Admin Dashboard | PCC CMS",
    description: "Manage your website content",
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    icons: {
      icon,
      shortcut: icon,
      apple: icon,
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
