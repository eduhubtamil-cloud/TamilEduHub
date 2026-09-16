import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Manage Resources - TamilEduHub CMS',
}

// Mock Data for MVP
const mockResources = [
  { id: 1, title: '10th Tamil Guide 2026', standard: '10th', subject: 'Tamil', status: 'published', downloads: 1240, date: '2026-09-10' },
  { id: 2, title: '12th Physics Important Questions', standard: '12th', subject: 'Physics', status: 'published', downloads: 856, date: '2026-09-12' },
  { id: 3, title: '8th Maths Worksheet PDF', standard: '8th', subject: 'Maths', status: 'draft', downloads: 0, date: '2026-09-15' },
]

export default function AdminResourcesPage() {
  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Resources</h1>
          <p className="text-slate-500">Create, edit, and manage educational resources.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/resources/create">
            <Plus className="h-4 w-4" /> Add Resource
          </Link>
        </Button>
      </div>

      <Card className="bg-white">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input placeholder="Search resources..." className="pl-9 bg-slate-50" />
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
                <th scope="col" className="px-6 py-4">Standard / Subject</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Downloads</th>
                <th scope="col" className="px-6 py-4">Date</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockResources.map((resource) => (
                <tr key={resource.id} className="bg-white border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap truncate max-w-xs">
                    {resource.title}
                  </td>
                  <td className="px-6 py-4">
                    {resource.standard} • {resource.subject}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      resource.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {resource.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {resource.downloads}
                  </td>
                  <td className="px-6 py-4">
                    {resource.date}
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

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
          <span>Showing 1 to 3 of 3 entries</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
