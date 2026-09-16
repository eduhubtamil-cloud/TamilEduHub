import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Filter, Edit, Trash2, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'

export const metadata = {
  title: 'Manage Articles - TamilEduHub CMS',
}

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const currentPage = parseInt(page || '1', 10)
  const limit = 10
  const offset = (currentPage - 1) * limit

  const supabase = await createClient()
  
  const { data: articles, error, count } = await supabase
    .from('articles')
    .select(`
      id, title, status, published_at, slug,
      categories(name),
      profiles(full_name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Admin Articles Fetch Error:", error)
  }

  const displayArticles = (articles || []) as any[]
  const totalPages = count ? Math.ceil(count / limit) : 1

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Articles</h1>
          <p className="text-slate-500">Publish and edit news, updates, and educational blog posts.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/articles/create">
            <Plus className="h-4 w-4" /> Write Article
          </Link>
        </Button>
      </div>

      <Card className="bg-white shadow-sm border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input placeholder="Search articles..." className="pl-9 bg-slate-50 border-slate-200" />
          </div>
          <Button variant="outline" className="w-full sm:w-auto gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Title</th>
                <th scope="col" className="px-6 py-4 font-semibold">Category</th>
                <th scope="col" className="px-6 py-4 font-semibold">Author</th>
                <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No articles found. Write your first post to get started!
                  </td>
                </tr>
              ) : (
                displayArticles.map((article) => (
                  <tr key={article.id} className="bg-white border-b hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap max-w-xs truncate">
                      {article.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {article.categories?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {article.profiles?.full_name || 'Admin'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" asChild>
                          <Link href={`/articles/${article.slug}`} target="_blank">
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
                {currentPage > 1 ? <Link href={`/admin/articles?page=${currentPage - 1}`}>Previous</Link> : <span>Previous</span>}
              </Button>
              <Button variant="outline" size="sm" disabled={currentPage >= totalPages} asChild={currentPage < totalPages}>
                {currentPage < totalPages ? <Link href={`/admin/articles?page=${currentPage + 1}`}>Next</Link> : <span>Next</span>}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
