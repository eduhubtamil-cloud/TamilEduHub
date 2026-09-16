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
  searchParams: Promise<{ standard?: string; subject?: string; medium?: string; type?: string; exam?: string }>
}) {
  const supabase = await createClient()
  const { standard, subject, medium, type, exam } = await searchParams;

  // Fetch filters data
  const { data: standards } = await supabase.from('standards').select('id, name').order('display_order')
  const { data: subjects } = await supabase.from('subjects').select('id, name').order('display_order')
  const { data: mediums } = await supabase.from('mediums').select('id, name').order('display_order')
  const { data: resourceTypes } = await supabase.from('resource_types').select('id, name').order('display_order')
  const { data: examTypes } = await (supabase.from('exam_types') as any).select('id, name').order('name')

  // Build query for resources
  let query = supabase
    .from('resources')
    .select(`
      id, title, slug, file_size, description, file_url,
      resource_types(name),
      mediums(name),
      standards(name),
      subjects(name),
      exam_types(name)
    `)

  if (standard) query = query.eq('standard_id', standard)
  if (subject) query = query.eq('subject_id', subject)
  if (medium) query = query.eq('medium_id', medium)
  if (type) query = query.eq('resource_type_id', type)
  if (exam) query = (query as any).eq('exam_type_id', exam)

  const { data: resources } = await query
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(100)

  const displayStandards = (standards || []) as any[]
  const displaySubjects = (subjects || []) as any[]
  const displayMediums = (mediums || []) as any[]
  const displayTypes = (resourceTypes || []) as any[]
  const displayExams = (examTypes || []) as any[]
  const displayResources = (resources || []) as any[]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <form className="bg-slate-50 p-6 rounded-lg border border-slate-200 sticky top-24">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Search className="h-4 w-4" /> Filters
            </h3>
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Medium</label>
                <select name="medium" defaultValue={medium} className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white">
                  <option value="">All Mediums</option>
                  {displayMediums.map(med => (
                    <option key={med.id} value={med.id}>{med.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Type</label>
                <select name="type" defaultValue={type} className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white">
                  <option value="">All Types</option>
                  {displayTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Exam Type</label>
                <select name="exam" defaultValue={exam} className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white">
                  <option value="">All Exams</option>
                  {displayExams.map((ex: any) => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full">Apply Filters</Button>
            </div>
          </form>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900">Study Materials</h1>
            <p className="text-sm text-slate-500">{displayResources.length} results</p>
          </div>

          {displayResources.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">No resources found</h3>
              <p className="text-slate-500">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayResources.map(resource => (
                <Card key={resource.id} className="flex flex-col h-full hover:border-blue-400 transition-colors">
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {resource.resource_types?.name && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {resource.resource_types.name}
                        </span>
                      )}
                      {resource.mediums?.name && (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                          {resource.mediums.name}
                        </span>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2 text-lg">
                      <Link href={`/resources/${resource.slug}`} className="hover:text-blue-600 before:absolute before:inset-0">
                        {resource.title}
                      </Link>
                    </CardTitle>
                    <div className="text-xs text-slate-500 mt-2">
                      {resource.standards?.name} • {resource.subjects?.name}
                    </div>
                  </CardHeader>
                  <div className="p-6 pt-0 mt-auto relative z-10">
                    <Button variant="outline" className="w-full gap-2" asChild>
                      <Link href={`/resources/${resource.slug}`}>
                         View Details
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
