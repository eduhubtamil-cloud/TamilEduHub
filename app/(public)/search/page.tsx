import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search as SearchIcon, FileText, Download, Filter } from 'lucide-react'

export const metadata = {
  title: 'Search Results - TamilEduHub',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>
}) {
  const { q, sort } = await searchParams;
  const query = q || '';
  const sortParam = sort || 'newest';
  const supabase = await createClient()

  let results: any[] = []

  if (query) {
    let dbQuery = supabase
      .from('resources')
      .select(`
        id, title, slug, file_size, description, file_url,
        resource_types(name),
        standards(name),
        exam_types(name)
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      
    if (sortParam === 'popular') {
      dbQuery = dbQuery.order('views_count', { ascending: false, nullsFirst: false })
    } else {
      dbQuery = dbQuery.order('created_at', { ascending: false })
    }

    const { data } = await dbQuery.limit(50)
    results = data || []

    // Log zero results
    if (results.length === 0) {
      await (supabase.from('search_analytics') as any).insert({
        query_string: query,
        result_count: 0
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-6 text-center">Search Resources</h1>
        <form className="flex flex-col sm:flex-row gap-3" action="/search">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input 
              type="search" 
              name="q"
              defaultValue={query}
              placeholder="Search for resources (e.g. 10th Tamil Guide)"
              className="w-full h-12 pl-10 text-base shadow-sm border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <select name="sort" defaultValue={sortParam} className="h-12 px-4 rounded-md border border-slate-300 bg-white text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
          </select>
          <Button type="submit" className="h-12 px-8">Search</Button>
        </form>
      </div>

      {query ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <p className="text-slate-600">
              Found <span className="font-semibold text-slate-900">{results.length}</span> results for <span className="font-semibold text-slate-900">&quot;{query}&quot;</span>
            </p>
          </div>
          
          {results.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">No resources found</h3>
              <p className="text-slate-500 mb-4">Try adjusting your search term or browsing by category.</p>
              <Button asChild variant="outline">
                <Link href="/resources">Browse All Resources</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((resource: any) => (
                <Card key={resource.id} className="flex flex-col h-full hover:border-blue-400 hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        {resource.standards?.name}
                      </span>
                      {resource.exam_types?.name && (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                          {resource.exam_types?.name}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      <Link href={`/resources/${resource.slug}`} className="hover:text-blue-600 before:absolute before:inset-0">
                        {resource.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-slate-500 line-clamp-3">
                      {resource.description || 'No description available.'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <FileText className="h-16 w-16 text-slate-200 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-slate-700">Enter a search term above</h2>
          <p className="text-slate-500 mt-2">Try searching by standard, subject, or resource type.</p>
        </div>
      )}
    </div>
  )
}
