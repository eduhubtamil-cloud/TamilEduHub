import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await (supabase.from('collections') as any).select('title, description').eq('slug', slug).single()
  const collection = data as any
  
  if (!collection) return { title: 'Not Found' }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamil-edu-hub.vercel.app'
  
  return {
    title: `${collection.title} - TamilEduHub`,
    description: collection.description || `Browse ${collection.title} on TamilEduHub`,
    alternates: {
      canonical: `${siteUrl}/collections/${slug}`
    }
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await (supabase.from('collections') as any).select('*').eq('slug', slug).single()
  const collection = data as any
  
  if (!collection) notFound()

  // Build the dynamic query based on rules
  const rules = collection.query_rules || {}
  
  let selectString = 'id, title, slug, description, year'
  
  if (rules.education_segment_slug) selectString += ', education_segments!inner(name, slug)'
  else selectString += ', education_segments(name, slug)'

  if (rules.standard_slug) selectString += ', standards!inner(name, slug)'
  else selectString += ', standards(name, slug)'

  if (rules.subject_slug) selectString += ', subjects!inner(name, slug)'
  else selectString += ', subjects(name, slug)'
  
  if (rules.resource_type_slug) selectString += ', resource_types!inner(name, slug)'
  if (rules.exam_type_slug) selectString += ', exam_types!inner(name, slug)'

  let query = supabase.from('resources').select(selectString).eq('status', 'published')
  
  if (rules.education_segment_slug) {
    query = (query as any).eq('education_segments.slug', rules.education_segment_slug)
  }
  if (rules.resource_type_slug) {
    query = (query as any).eq('resource_types.slug', rules.resource_type_slug)
  }
  if (rules.exam_type_slug) {
    query = (query as any).eq('exam_types.slug', rules.exam_type_slug)
  }
  if (rules.subject_slug) {
    query = (query as any).eq('subjects.slug', rules.subject_slug)
  }
  if (rules.standard_slug) {
    query = (query as any).eq('standards.slug', rules.standard_slug)
  }

  const { data: resources } = await query.order('created_at', { ascending: false }).limit(100)

  // JSON-LD Collection Page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.title,
    description: collection.description || `Browse ${collection.title}`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamil-edu-hub.vercel.app'}/collections/${slug}`
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mb-6">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{collection.title as string}</h1>
          {collection.description && <p className="text-lg text-slate-600 max-w-2xl mx-auto">{collection.description as string}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!resources || resources.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500">
              No resources found for this collection yet.
            </div>
          ) : (
            resources.map((res: any) => (
              <Card key={res.id} className="hover:shadow-md transition-shadow flex flex-col bg-white">
                <CardHeader>
                  <div className="flex gap-2 flex-wrap mb-3">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      {res.standards?.name}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {res.subjects?.name}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">
                    <Link href={`/resources/${res.slug}`} className="hover:text-blue-600 before:absolute before:inset-0">
                      {res.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-slate-500 line-clamp-2">{res.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
