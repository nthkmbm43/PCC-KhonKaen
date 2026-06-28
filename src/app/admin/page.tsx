import { db } from "@/db";
import { pages, siteSettings } from "@/db/schema";
import { sql } from "drizzle-orm";
import Link from "next/link";
import { FileText, Settings, Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  const pagesCountRes = await db.select({ count: sql<number>`count(*)` }).from(pages);
  const pagesCount = pagesCountRes[0]?.count || 0;

  const settingsArray = await db.select().from(siteSettings).limit(1);
  const settings = settingsArray[0];

  const hasLogo = !!settings?.logoUrl;
  const hasPhone = !!settings?.mainPhone;
  const hasNavbarLinks = settings?.navbarLinks && Array.isArray(settings.navbarLinks) && settings.navbarLinks.length > 0;
  
  const setupScore = [hasLogo, hasPhone, hasNavbarLinks].filter(Boolean).length;
  const totalSetupSteps = 3;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome to your custom Content Management System.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Pages Summary Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Pages</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{pagesCount}</div>
            <p className="text-xs text-gray-500 mt-1">Published and draft pages</p>
            <div className="mt-4">
              <Link href="/admin/pages/new">
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Page
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Site Health Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Site Setup</CardTitle>
            <Settings className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{setupScore}/{totalSetupSteps}</div>
            <p className="text-xs text-gray-500 mt-1">Basic configurations</p>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm">
                {hasLogo ? <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> : <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />}
                <span className={hasLogo ? "text-gray-700" : "text-amber-700 font-medium"}>Logo Configuration</span>
              </div>
              <div className="flex items-center text-sm">
                {hasPhone ? <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> : <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />}
                <span className={hasPhone ? "text-gray-700" : "text-amber-700 font-medium"}>Contact Phone</span>
              </div>
              <div className="flex items-center text-sm">
                {hasNavbarLinks ? <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> : <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />}
                <span className={hasNavbarLinks ? "text-gray-700" : "text-amber-700 font-medium"}>Navigation Menu</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links Card */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/pages" className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3 text-gray-700 font-medium group-hover:text-blue-700 transition-colors">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                  <FileText className="w-4 h-4" />
                </div>
                Manage Pages
              </div>
              <span className="text-gray-400 group-hover:text-blue-600">&rarr;</span>
            </Link>
            
            <Link href="/admin/settings" className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3 text-gray-700 font-medium group-hover:text-blue-700 transition-colors">
                <div className="p-2 bg-gray-100 text-gray-600 rounded-md">
                  <Settings className="w-4 h-4" />
                </div>
                Site Settings
              </div>
              <span className="text-gray-400 group-hover:text-blue-600">&rarr;</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
