import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search as SearchIcon, FileText, Compass, BookOpen } from 'lucide-react'
import { ResourceCard } from '@/components/ui/ResourceCard'

export const metadata = {
  title: 'Search Results - TamilEduHub',
}

export default async function SearchPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams
  const query = searchParams.q
  const sortParam = searchParams.sort || 'latest'
  const supabase = await createClient()

  let results: any[] = []
  
  if (query) {
    let dbQuery = (supabase.from('resources') as any)
      .select(`
        id, title, slug, description, file_size, year, created_at, views_count,
        standards(name), subjects(name), exam_types(name), resource_types(slug, name)
      `)
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      
    if (sortParam === 'popular') {
      dbQuery = dbQuery.order('views_count', { ascending: false })
    } else {
      dbQuery = dbQuery.order('created_at', { ascending: false })
    }
      
    const { data } = await dbQuery.limit(24)
    results = data || []
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Hero */}
      <div className="bg-white border-b border-slate-200 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-6 text-center">எதை தேடுகிறீர்கள்? (Search)</h1>
          <form className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <Input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search textbooks, notes, question papers..."
                className="pl-12 h-12 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-lg shadow-sm"
              />
            </div>
            <Button type="submit" className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-base font-semibold shadow-sm">
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {query ? (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-xl font-medium text-slate-700">
                Found <span className="font-bold text-slate-900">{results.length}</span> results for &quot;<span className="font-bold text-slate-900">{query}</span>&quot;
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">Sort by:</span>
                <div className="flex rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm">
                  <Link 
                    href={`/search?q=${query}&sort=latest`}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${sortParam === 'latest' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    Latest
                  </Link>
                  <Link 
                    href={`/search?q=${query}&sort=popular`}
                    className={`px-4 py-2 text-sm font-medium border-l border-slate-200 transition-colors ${sortParam === 'popular' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    Popular
                  </Link>
                </div>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Compass className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">இந்த தேடலுக்கு வளங்கள் கிடைக்கவில்லை</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">We couldn't find any resources matching your search. Try using different keywords or browsing our categories.</p>
                <Link href="/" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
                  முகப்பிற்கு செல்ல (Go Home)
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.map((resource: any) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchIcon className="h-12 w-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Search our resources</h2>
            <p className="text-slate-500 max-w-md mx-auto text-lg">Type a keyword above to find textbooks, guides, and question papers instantly.</p>
          </div>
        )}
      </div>
    </div>
  )
}
