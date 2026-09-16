import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BookOpen, FileText, Download } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export async function generateMetadata({ params }: { params: Promise<{ slug: string, subject: string }> }) {
  const { slug, subject: subjectSlug } = await params
  const supabase = await createClient()
  
  const { data: stdData } = await (supabase.from('standards') as any).select('name').eq('slug', slug).single()
  const { data: subData } = await (supabase.from('subjects') as any).select('name').eq('slug', subjectSlug).single()
  
  if (!stdData || !subData) return { title: 'Not Found' }
  
  return {
    title: `${stdData.name} ${subData.name} Study Materials - TamilEduHub`,
    description: `Download free ${stdData.name} ${subData.name} study materials, guides, notes, and question papers in PDF format.`
  }
}

export default async function StandardSubjectCollectionPage({ params }: { params: Promise<{ slug: string, subject: string }> }) {
  const { slug, subject: subjectSlug } = await params
  const supabase = await createClient()

  // 1. Fetch Standard and Subject
  const { data: standard } = await (supabase.from('standards') as any).select('*').eq('slug', slug).single()
  const { data: subject } = await (supabase.from('subjects') as any).select('*').eq('slug', subjectSlug).single()

  if (!standard || !subject) notFound()

  // 2. Fetch Resources for this Standard + Subject
  const { data: resourcesData } = await (supabase.from('resources') as any)
    .select(`
      id, title, slug, file_size,
      mediums ( name ),
      resource_types ( name )
    `)
    .eq('standard_id', standard.id)
    .eq('subject_id', subject.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  const resources = (resourcesData || []) as any[]

  // Group by resource type if available, otherwise just show a list
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li><span className="mx-2">/</span></li>
          <li><Link href="/school" className="hover:text-blue-600">School</Link></li>
          <li><span className="mx-2">/</span></li>
          <li><Link href={`/school/${standard.slug}`} className="hover:text-blue-600">{standard.name}</Link></li>
          <li><span className="mx-2">/</span></li>
          <li className="text-slate-900 font-medium" aria-current="page">{subject.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-10 text-white shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {standard.name} {subject.name} Study Materials
        </h1>
        <p className="text-blue-100 max-w-2xl text-lg">
          Browse and download free PDF study materials, question papers, and guides for {standard.name} {subject.name}.
        </p>
      </div>

      {/* Resources List */}
      <div className="space-y-4">
        {resources.length > 0 ? (
          resources.map((res: any) => (
            <Card key={res.id} className="hover:border-blue-400 transition-colors">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600 shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-1">
                      <Link href={`/resources/${res.slug}`} className="hover:text-blue-600 before:absolute before:inset-0">
                        {res.title}
                      </Link>
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                      {res.mediums?.name && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">
                          {res.mediums.name}
                        </span>
                      )}
                      {res.resource_types?.name && (
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">
                          {res.resource_types.name}
                        </span>
                      )}
                      {res.file_size && <span>{res.file_size}</span>}
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="shrink-0 relative z-10 w-full sm:w-auto gap-2" asChild>
                  <Link href={`/resources/${res.slug}`}>
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No resources found</h3>
            <p className="text-slate-500">We are currently updating our materials for {standard.name} {subject.name}. Please check back later!</p>
          </div>
        )}
      </div>
    </div>
  )
}
