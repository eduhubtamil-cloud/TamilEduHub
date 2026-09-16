import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Filter, Edit, Trash2, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Manage Resources - TamilEduHub CMS',
}

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const currentPage = parseInt(page || '1', 10)
  const limit = 10
  const offset = (currentPage - 1) * limit

  const supabase = await createClient()
  
  const { data: resources, error, count } = await supabase
    .from('resources')
    .select(`
      id, title, status, published_at, slug,
      standards(name),
      subjects(name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Admin Resources Fetch Error:", error)
  }

  const displayResources = (resources || []) as any[]
  const totalPages = count ? Math.ceil(count / limit) : 1

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

      <Card className="bg-white shadow-sm border-slate-200">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input placeholder="Search resources..." className="pl-9 bg-slate-50 border-slate-200" />
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
                <th scope="col" className="px-6 py-4 font-semibold">Title</th>
                <th scope="col" className="px-6 py-4 font-semibold">Standard / Subject</th>
                <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                <th scope="col" className="px-6 py-4 font-semibold">Downloads</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayResources.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No resources found. Create one to get started.
                  </td>
                </tr>
              ) : (
                displayResources.map((resource) => (
                  <tr key={resource.id} className="bg-white border-b hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap max-w-xs truncate">
                      {resource.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {resource.standards?.name} &bull; {resource.subjects?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        resource.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {resource.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {resource.downloads_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" asChild>
                          <Link href={`/resources/${resource.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={currentPage <= 1} asChild={currentPage > 1}>
                {currentPage > 1 ? <Link href={`/admin/resources?page=${currentPage - 1}`}>Previous</Link> : <span>Previous</span>}
              </Button>
              <Button variant="outline" size="sm" disabled={currentPage >= totalPages} asChild={currentPage < totalPages}>
                {currentPage < totalPages ? <Link href={`/admin/resources?page=${currentPage + 1}`}>Next</Link> : <span>Next</span>}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
