import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Upload } from 'lucide-react'
import { BulkEditGrid } from '@/components/admin/BulkEditGrid'

export const metadata = {
  title: 'Bulk Edit Resources - TamilEduHub CMS',
}

export default async function BulkEditPage(props: {
  searchParams: Promise<{ status?: string }>
}) {
  const searchParams = await props.searchParams
  const statusFilter = searchParams.status || 'draft'
  const supabase = await createClient()

  // Fetch taxonomies
  const [
    { data: standards }, 
    { data: subjects }, 
    { data: mediums }, 
    { data: resourceTypes }, 
    { data: segmentsData },
    { data: examTypes },
    { data: publications }
  ] = await Promise.all([
    supabase.from('standards').select('id, name').order('display_order'),
    supabase.from('subjects').select('id, name').order('display_order'),
    supabase.from('mediums').select('id, name'),
    supabase.from('resource_types').select('id, name'),
    (supabase.from('education_segments') as any).select('id, name').order('display_order'),
    (supabase.from('exam_types') as any).select('id, name').order('display_order'),
    (supabase.from('publications') as any).select('id, name').order('name')
  ])

  const segments = segmentsData || []

  // Fetch resources
  let query = (supabase.from('resources') as any).select(`
    id, title, status,
    standards(name),
    subjects(name),
    exam_types(name)
  `).neq('status', 'deleted').order('created_at', { ascending: false })

  if (statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }

  const { data: resources } = await query.limit(200)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/resources">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bulk Edit Resources</h1>
            <p className="text-slate-500">Quickly assign metadata to multiple resources simultaneously.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href={`/admin/resources/bulk-edit?status=${statusFilter === 'draft' ? 'published' : 'draft'}`}>
              View {statusFilter === 'draft' ? 'Published' : 'Drafts'}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/resources/bulk">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload New
            </Link>
          </Button>
        </div>
      </div>

      <BulkEditGrid 
        resources={resources || []} 
        standards={standards || []}
        subjects={subjects || []}
        mediums={mediums || []}
        resourceTypes={resourceTypes || []}
        segments={segments}
        examTypes={examTypes || []}
        publications={publications || []}
      />
    </div>
  )
}
