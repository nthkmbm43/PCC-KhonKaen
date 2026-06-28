import Link from "next/link";
import { LayoutDashboard, FileText, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Custom<span className="text-blue-600">CMS</span>
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin/pages"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-blue-700 bg-blue-50"
          >
            <FileText className="w-5 h-5" />
            Pages
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-blue-700 hover:bg-gray-50"
          >
            <Settings className="w-5 h-5" />
            Site Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            <LogOut className="w-5 h-5" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-gray-700">Admin</div>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
