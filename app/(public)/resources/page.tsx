import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, FileText } from 'lucide-react'

export const metadata = {
  title: 'Study Materials & Resources - TamilEduHub',
  description: 'Download the latest study materials, guides, and PDF resources.',
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ standard?: string; subject?: string }>
}) {
  const supabase = await createClient()
  const { standard, subject } = await searchParams;

  // Fetch filters data
  const { data: standards } = await supabase.from('standards').select('id, name').order('display_order')
  const { data: subjects } = await supabase.from('subjects').select('id, name').order('display_order')

  // Build query for resources
  let query = supabase
    .from('resources')
    .select(`
      id, title, slug, file_size, resource_type_id, description, file_url,
      resource_types(name)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (standard) query = query.eq('standard_id', standard)
  if (subject) query = query.eq('subject_id', subject)

  const { data: resources } = await query

  const displayResources = (resources || []) as any[]
  const displayStandards = (standards || []) as any[]
  const displaySubjects = (subjects || []) as any[]

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 space-y-8 flex-shrink-0">
        <form>
          <h3 className="font-semibold text-slate-900 mb-4">Filters</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Standard</label>
              <select name="standard" defaultValue={standard} className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white">
                <option value="">All Standards</option>
                {displayStandards.map(std => (
                  <option key={std.id} value={std.id}>{std.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Subject</label>
              <select name="subject" defaultValue={subject} className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white">
                <option value="">All Subjects</option>
                {displaySubjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full mt-4">Apply Filters</Button>
          </div>
        </form>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-slate-900">All Resources</h1>
          <form action="/search" className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input name="q" type="search" placeholder="Search..." className="pl-9" />
          </form>
        </div>

        {displayResources.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">No resources found</h3>
            <p className="text-slate-500">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayResources.map((resource: any) => (
              <Card key={resource.id} className="flex flex-col h-full hover:border-blue-400 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 mb-3">
                      {resource.resource_types?.name || 'Document'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {resource.file_size ? `${(resource.file_size / (1024 * 1024)).toFixed(2)} MB` : 'PDF'}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    <Link href={`/resources/${resource.slug}`} className="hover:text-blue-600 before:absolute before:inset-0">
                      {resource.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-slate-500 line-clamp-3">
                    {resource.description || 'No description provided.'}
                  </p>
                </CardContent>
                <div className="p-6 pt-0 mt-auto relative z-10">
                  <Button className="w-full gap-2" variant={resource.file_url ? "default" : "secondary"} asChild>
                    {resource.file_url ? (
                      <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" /> Download PDF
                      </a>
                    ) : (
                      <Link href={`/resources/${resource.slug}`}>View Details</Link>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
