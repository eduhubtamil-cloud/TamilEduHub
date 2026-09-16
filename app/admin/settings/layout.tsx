import Link from 'next/link'
import { Settings, Layers, Book, Tags } from 'lucide-react'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-slate-500" /> Settings & Taxonomy
        </h1>
        <p className="text-slate-500">Manage standard classes, subjects, and blog categories.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="space-y-1">
            <Link href="/admin/settings/standards" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-50 text-slate-900">
              <Layers className="h-4 w-4 text-slate-500" />
              Standards (Classes)
            </Link>
            <Link href="/admin/settings/subjects" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-50 text-slate-900">
              <Book className="h-4 w-4 text-slate-500" />
              Subjects
            </Link>
            <Link href="/admin/settings/categories" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-50 text-slate-900">
              <Tags className="h-4 w-4 text-slate-500" />
              Blog Categories
            </Link>
            <Link href="/admin/settings/mediums" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-50 text-slate-900">
              <Settings className="h-4 w-4 text-slate-500" />
              Mediums
            </Link>
            <Link href="/admin/settings/exam-types" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-50 text-slate-900">
              <Settings className="h-4 w-4 text-slate-500" />
              Exam Types
            </Link>
            <Link href="/admin/settings/publications" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-50 text-slate-900">
              <Settings className="h-4 w-4 text-slate-500" />
              Publications
            </Link>
            <Link href="/admin/settings/resource-types" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-50 text-slate-900">
              <Settings className="h-4 w-4 text-slate-500" />
              Resource Types
            </Link>
            <Link href="/admin/settings/collections" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-50 text-slate-900">
              <Settings className="h-4 w-4 text-slate-500" />
              Collections
            </Link>
            <Link href="/admin/settings/ads" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-50 text-slate-900 mt-4 border-t border-slate-200 pt-4">
              <Settings className="h-4 w-4 text-slate-500" />
              Advertisements
            </Link>
            <Link href="/admin/settings/community-links" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-50 text-slate-900">
              <Settings className="h-4 w-4 text-slate-500" />
              Community Links
            </Link>
          </nav>
        </aside>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
