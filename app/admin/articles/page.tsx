import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Filter, Edit, Trash2, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Manage Articles - TamilEduHub CMS',
}

// Mock Data for MVP
const mockArticles = [
  { id: 1, title: 'How to prepare for 10th Public Exams', category: 'Exam Tips', status: 'published', views: 3421, date: '2026-09-01' },
  { id: 2, title: 'Changes in 12th Syllabus 2026', category: 'Announcements', status: 'published', views: 8900, date: '2026-09-05' },
  { id: 3, title: 'Best study timetable for students', category: 'Study Guide', status: 'draft', views: 0, date: '2026-09-15' },
]

export default function AdminArticlesPage() {
  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Articles</h1>
          <p className="text-slate-500">Create, edit, and manage educational articles.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/articles/create">
            <Plus className="h-4 w-4" /> Write Article
          </Link>
        </Button>
      </div>

      <Card className="bg-white">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input placeholder="Search articles..." className="pl-9 bg-slate-50" />
          </div>
          <Button variant="outline" className="w-full sm:w-auto gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-4">Title</th>
                <th scope="col" className="px-6 py-4">Category</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Views</th>
                <th scope="col" className="px-6 py-4">Date</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockArticles.map((article) => (
                <tr key={article.id} className="bg-white border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap truncate max-w-xs">
                    {article.title}
                  </td>
                  <td className="px-6 py-4">
                    {article.category}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {article.views}
                  </td>
                  <td className="px-6 py-4">
                    {article.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
