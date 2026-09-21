import { createClient } from '@/lib/supabase/server'
import { ResourceCard } from '@/components/ui/ResourceCard'
import { TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Competitive Exam Materials - TamilEduHub',
  description: 'Download previous year question papers, study materials, and preparation resources for TNPSC, TRB, and other competitive exams.',
}

export default async function CompetitiveExamsPage() {
  const supabase = await createClient()

  // In the future, this should filter by education_segment_id
  const { data: resources } = await (supabase.from('resources') as any)
    .select(`
      id, title, slug, description, file_url, created_at, status, year,
      standards(name, slug),
      subjects(name, slug),
      exam_types(name, slug),
      education_segments!inner(slug)
    `)
    .eq('status', 'published')
    .eq('education_segments.slug', 'competitive-exams')
    .limit(20)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full mb-6">
            <TrendingUp className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Competitive Exam Materials</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Previous year papers, study materials, and preparation resources for TNPSC, TRB, SSC, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!resources || resources.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500">
              No competitive exam resources found yet.
            </div>
          ) : (
            resources.map((res: any) => (
              <ResourceCard key={res.id} resource={res} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
