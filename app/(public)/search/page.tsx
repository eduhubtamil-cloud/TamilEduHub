import Link from 'next/link'
import { getDictionary } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/server'
import { Compass, Search as SearchIcon } from 'lucide-react'
import { ResourceCard } from '@/components/ui/ResourceCard'
import { SearchFilters } from '@/components/ui/SearchFilters'
import { SearchTracker } from '@/components/ui/SearchTracker'

export const metadata = {
  title: 'Search Results - TamilEduHub',
  robots: {
    index: false,
    follow: true,
  }
}

export default async function SearchPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams
  const query = searchParams.q || ''
  const sortParam = searchParams.sort || 'latest'
  const segment = searchParams.segment || ''
  const standard = searchParams.standard || ''
  const subject = searchParams.subject || ''
  const medium = searchParams.medium || ''
  const resourceType = searchParams.resourceType || ''
  const examType = searchParams.examType || ''

  const supabase = await createClient();
  const dict = await getDictionary();

  // Fetch taxonomies for the filter dropdowns
  const [
    { data: dbStandardsData }, { data: dbSubjectsData }, { data: dbSegmentsData }, { data: dbExamTypesData },
    { data: dbMediumsData }, { data: dbResourceTypesData }, { data: dbPublicationsData }
  ] = await Promise.all([
    supabase.from('standards').select('id, name, slug').order('order_index'),
    supabase.from('subjects').select('id, name, slug').order('name'),
    (supabase.from('education_segments') as any).select('id, name, slug').order('display_order'),
    (supabase.from('exam_types') as any).select('id, name, slug'),
    supabase.from('mediums').select('id, name, slug'),
    supabase.from('resource_types').select('id, name, slug'),
    (supabase.from('publications') as any).select('id, name, slug')
  ])

  let results: any[] = []
  
  // We only search if there is a query OR any filter is applied
  const hasFilters = query || segment || standard || subject || medium || resourceType || examType

  if (hasFilters) {
    let selectString = `
      id, title, slug, description, file_size, year, created_at, views_count,
      education_segments${segment ? '!inner' : ''}(name, slug),
      standards${standard ? '!inner' : ''}(name, slug),
      subjects${subject ? '!inner' : ''}(name, slug),
      exam_types${examType ? '!inner' : ''}(name, slug),
      resource_types${resourceType ? '!inner' : ''}(name, slug),
      mediums${medium ? '!inner' : ''}(name, slug)
    `

    let dbQuery = (supabase.from('resources') as any)
      .select(selectString)
      .eq('status', 'published')
      
    if (query) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    }
    if (segment) dbQuery = dbQuery.eq('education_segments.slug', segment)
    if (standard && segment === 'school') dbQuery = dbQuery.eq('standards.slug', standard)
    if (examType && segment === 'competitive-exams') dbQuery = dbQuery.eq('exam_types.slug', examType)
    if (subject) dbQuery = dbQuery.eq('subjects.slug', subject)
    if (medium) dbQuery = dbQuery.eq('mediums.slug', medium)
    if (resourceType) dbQuery = dbQuery.eq('resource_types.slug', resourceType)
      
    if (sortParam === 'popular') {
      dbQuery = dbQuery.order('views_count', { ascending: false })
    } else {
      dbQuery = dbQuery.order('created_at', { ascending: false })
    }
      
    const { data } = await dbQuery.limit(48)
    results = data || []
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SearchTracker 
        query={query} 
        filters={{ segment, standard, subject, medium, resourceType, examType }} 
        resultCount={results.length} 
      />
      
      {/* Search Hero */}
      <div className="bg-white border-b border-slate-200 py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-6 text-center">{dict.whatAreYouLookingFor}</h1>
          <SearchFilters 
            segments={dbSegmentsData || []}
            standards={dbStandardsData || []}
            subjects={dbSubjectsData || []}
            mediums={dbMediumsData || []}
            resourceTypes={dbResourceTypesData || []}
            examTypes={dbExamTypesData || []}
            publications={dbPublicationsData || []}
            dict={dict}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {hasFilters ? (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-xl font-medium text-slate-700">
                {dict.showingResults} <span className="font-bold text-slate-900">{results.length}</span> {query && <span>( &quot;<span className="font-bold text-slate-900">{query}</span>&quot; )</span>}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">{dict.sortBy || "Sort by:"}</span>
                <div className="flex rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm">
                  <Link 
                    href={`/search?${new URLSearchParams(Object.entries(searchParams).filter(([_, v]) => v !== undefined).reduce((acc, [k, v]) => ({ ...acc, [k]: v }), { sort: 'latest' }) as Record<string, string>).toString()}`}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${sortParam === 'latest' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    Latest
                  </Link>
                  <Link 
                    href={`/search?${new URLSearchParams(Object.entries(searchParams).filter(([_, v]) => v !== undefined).reduce((acc, [k, v]) => ({ ...acc, [k]: v }), { sort: 'popular' }) as Record<string, string>).toString()}`}
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
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{dict.noResultsFound}</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">{dict.noResultsDesc || "Try adjusting your filters or search query."}</p>
                <Link href="/search" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
                  Clear Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.map((resource: any) => (
                  <ResourceCard key={resource.id} resource={resource} dict={dict} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm max-w-3xl mx-auto">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchIcon className="h-12 w-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{dict.searchOurResources}</h2>
            <p className="text-slate-500 max-w-md mx-auto text-lg">{dict.searchOurResourcesDesc}</p>
          </div>
        )}
      </div>
    </div>
  )
}
