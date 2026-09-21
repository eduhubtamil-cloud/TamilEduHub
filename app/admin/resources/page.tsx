import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Filter, Edit, Trash2, Eye, Upload } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { ResourceRowActions } from '@/components/admin/ResourceRowActions'

export const metadata = {
  title: 'Manage Resources - TamilEduHub CMS',
}

export default async function AdminResourcesPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const searchParams = await props.searchParams
  const page = searchParams.page
  const q = searchParams.q
  const status = searchParams.status
  const standard = searchParams.standard
  const subject = searchParams.subject
  const segment = searchParams.segment
  const examType = searchParams.examType
  const medium = searchParams.medium
  const resourceType = searchParams.resourceType
  const publication = searchParams.publication
  const year = searchParams.year

  const currentPage = parseInt(page || '1', 10)
  const limit = 10
  const offset = (currentPage - 1) * limit

  const supabase = await createClient()
  
  let selectQuery = `
    id, title, status, published_at, slug, downloads_count,
    education_segments${segment ? '!inner' : ''}(id, name, slug),
    standards${standard ? '!inner' : ''}(id, name, slug),
    subjects${subject ? '!inner' : ''}(id, name, slug),
    exam_types${examType ? '!inner' : ''}(id, name, slug),
    mediums${medium ? '!inner' : ''}(id, name, slug),
    resource_types${resourceType ? '!inner' : ''}(id, name, slug),
    publications${publication ? '!inner' : ''}(id, name, slug)
  `

  let query = (supabase.from('resources') as any)
    .select(selectQuery, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (q) {
    query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%,description.ilike.%${q}%`)
  }
  
  if (status) {
    query = query.eq('status', status)
  } else {
    query = query.neq('status', 'deleted')
  }

  if (segment) {
    query = query.eq('education_segments.slug', segment)
  }
  if (standard) {
    query = query.eq('standards.slug', standard)
  }
  if (subject) {
    query = query.eq('subjects.slug', subject)
  }
  if (examType) {
    query = query.eq('exam_types.slug', examType)
  }
  if (medium) {
    query = query.eq('mediums.slug', medium)
  }
  if (resourceType) {
    query = query.eq('resource_types.slug', resourceType)
  }
  if (publication) {
    query = query.eq('publications.slug', publication)
  }
  if (year) {
    query = query.eq('year', parseInt(year))
  }

  const { data: resources, error, count } = await query

  if (error) {
    console.error("Admin Resources Fetch Error:", error)
  }

  const displayResources = (resources || []) as any[]
  const totalPages = count ? Math.ceil(count / limit) : 1

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

  const dbStandards = dbStandardsData as any[]
  const dbSubjects = dbSubjectsData as any[]
  const dbSegments = dbSegmentsData as any[]
  const dbExamTypes = dbExamTypesData as any[]
  const dbMediums = dbMediumsData as any[]
  const dbResourceTypes = dbResourceTypesData as any[]
  const dbPublications = dbPublicationsData as any[]

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Resources</h1>
          <p className="text-slate-500">Create, edit, and manage educational resources.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/admin/resources/bulk-edit">
              <Edit className="h-4 w-4" /> Bulk Edit
            </Link>
          </Button>
          <Button asChild variant="secondary" className="gap-2">
            <Link href="/admin/resources/bulk">
              <Upload className="h-4 w-4" /> Bulk Upload
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/admin/resources/create">
              <Plus className="h-4 w-4" /> Add Resource
            </Link>
          </Button>
        </div>
      </div>

      <Card className="bg-white shadow-sm border-slate-200">
        {/* Table Toolbar */}
        <form action="/admin/resources" method="GET" className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="flex-1 flex flex-wrap gap-2 w-full">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input 
                name="q" 
                defaultValue={q} 
                placeholder="Search resources..." 
                className="pl-9 bg-white border-slate-200" 
              />
            </div>
            <select 
              name="status"
              defaultValue={status}
              className="flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-[150px]"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
              <option value="deleted">Deleted</option>
            </select>
            <select 
              name="segment"
              defaultValue={segment}
              className="flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-[150px]"
            >
              <option value="">All Audiences</option>
              {dbSegments?.map(s => (
                <option key={s.id} value={s.slug}>{s.name}</option>
              ))}
            </select>
            <select 
              name="standard"
              defaultValue={standard}
              className="flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-[150px]"
            >
              <option value="">All Standards</option>
              {dbStandards?.map(s => (
                <option key={s.id} value={s.slug}>{s.name}</option>
              ))}
            </select>
            <select 
              name="examType"
              defaultValue={examType}
              className="flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-[150px]"
            >
              <option value="">All Exams</option>
              {dbExamTypes?.map(s => (
                <option key={s.id} value={s.slug}>{s.name}</option>
              ))}
            </select>
            <select 
              name="subject"
              defaultValue={subject}
              className="flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-[150px]"
            >
              <option value="">All Subjects</option>
              {dbSubjects?.map(s => (
                <option key={s.id} value={s.slug}>{s.name}</option>
              ))}
            </select>
            <select 
              name="medium"
              defaultValue={medium}
              className="flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-[150px]"
            >
              <option value="">All Mediums</option>
              {dbMediums?.map(s => (
                <option key={s.id} value={s.slug}>{s.name}</option>
              ))}
            </select>
            <select 
              name="resourceType"
              defaultValue={resourceType}
              className="flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-[150px]"
            >
              <option value="">All Types</option>
              {dbResourceTypes?.map(s => (
                <option key={s.id} value={s.slug}>{s.name}</option>
              ))}
            </select>
            <select 
              name="publication"
              defaultValue={publication}
              className="flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-[150px]"
            >
              <option value="">All Publications</option>
              {dbPublications?.map(s => (
                <option key={s.id} value={s.slug}>{s.name}</option>
              ))}
            </select>
            <Input 
              name="year" 
              type="number"
              defaultValue={year} 
              placeholder="Year (e.g. 2026)" 
              className="w-[150px] bg-white border-slate-200" 
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="secondary" className="gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            {(q || status || standard || subject || segment || examType || medium || resourceType || publication || year) && (
              <Button asChild variant="outline">
                <Link href="/admin/resources">Clear</Link>
              </Button>
            )}
          </div>
        </form>

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
                          <Link href={`/resources/${resource.slug}`} target="_blank" title="Preview Public Page">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <ResourceRowActions id={resource.id} status={resource.status} />
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
                {currentPage > 1 ? <Link href={`/admin/resources?page=${currentPage - 1}${q ? '&q='+q : ''}${status ? '&status='+status : ''}${standard ? '&standard='+standard : ''}${subject ? '&subject='+subject : ''}`}>Previous</Link> : <span>Previous</span>}
              </Button>
              <Button variant="outline" size="sm" disabled={currentPage >= totalPages} asChild={currentPage < totalPages}>
                {currentPage < totalPages ? <Link href={`/admin/resources?page=${currentPage + 1}${q ? '&q='+q : ''}${status ? '&status='+status : ''}${standard ? '&standard='+standard : ''}${subject ? '&subject='+subject : ''}`}>Next</Link> : <span>Next</span>}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
