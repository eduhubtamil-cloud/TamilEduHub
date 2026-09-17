import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/lib/i18n'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ResourceCard } from '@/components/ui/ResourceCard'

// Helper to fetch entities by slug
async function fetchEntityBySlug(table: string, slug: string) {
  const supabase = await createClient();

  const { data } = await (supabase.from(table) as any).select('*').eq('slug', slug).single()
  return data
}

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await props.params
  
  // Resolve entities
  let standard = null
  let subject = null
  let resourceType = null
  let examType = null
  
  if (slug.length === 1) {
    standard = await fetchEntityBySlug('standards', slug[0])
    if (!standard) resourceType = await fetchEntityBySlug('resource_types', slug[0])
    if (!standard && !resourceType) examType = await fetchEntityBySlug('exam_types', slug[0])
  } else if (slug.length === 2) {
    standard = await fetchEntityBySlug('standards', slug[0])
    subject = await fetchEntityBySlug('subjects', slug[1])
    if (!subject) resourceType = await fetchEntityBySlug('resource_types', slug[1])
  }

  if (!standard && !resourceType && !examType) return { title: 'Not Found' }

  let title = 'Study Materials'
  let description = 'Download educational resources from TamilEduHub.'
  
  if (slug.length === 1 && standard) {
    title = standard.seo_title || `${standard.name} Study Materials & Question Papers`
    description = standard.seo_description || `Download standard ${standard.name} books, guides, and exam papers.`
  } else if (slug.length === 1 && resourceType) {
    title = `${resourceType.name} for All Standards - TamilEduHub`
    description = `Download ${resourceType.name.toLowerCase()} for Tamil Nadu state board students.`
  } else if (slug.length === 2 && standard && subject) {
    title = `${standard.name} ${subject.name} Study Materials`
    description = `Download ${standard.name} ${subject.name} guides, notes, and question papers.`
  } else if (slug.length === 2 && standard && resourceType) {
    title = `${standard.name} ${resourceType.name}`
    description = `Download ${standard.name} ${resourceType.name.toLowerCase()} for state board.`
  }

  const path = `/${slug.join('/')}`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamileduhub.com'

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}${path}`,
    }
  }
}

export default async function TaxonomyLandingPage(props: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await props.params
  const supabase = await createClient()
  const dict = await getDictionary()

  // 1. Resolve what the URL means
  let standard: any = null
  let subject: any = null
  let resourceType: any = null
  let examType: any = null

  if (slug.length === 1) {
    standard = await fetchEntityBySlug('standards', slug[0])
    if (!standard) resourceType = await fetchEntityBySlug('resource_types', slug[0])
    if (!standard && !resourceType) examType = await fetchEntityBySlug('exam_types', slug[0])
    
    if (!standard && !resourceType && !examType) notFound()
  } else if (slug.length === 2) {
    standard = await fetchEntityBySlug('standards', slug[0])
    if (!standard) notFound()
    
    subject = await fetchEntityBySlug('subjects', slug[1])
    if (!subject) resourceType = await fetchEntityBySlug('resource_types', slug[1])
    if (!subject && !resourceType) notFound()
  } else {
    notFound()
  }

  // 2. Build the Breadcrumbs
  const breadcrumbItems = []
  if (standard) breadcrumbItems.push({ label: standard.name, href: `/${standard.slug}` })
  if (subject) breadcrumbItems.push({ label: subject.name, href: `/${standard.slug}/${subject.slug}` })
  if (resourceType && slug.length === 1) breadcrumbItems.push({ label: resourceType.name, href: `/${resourceType.slug}` })
  if (resourceType && slug.length === 2) breadcrumbItems.push({ label: resourceType.name, href: `/${standard.slug}/${resourceType.slug}` })
  if (examType) breadcrumbItems.push({ label: examType.name, href: `/${examType.slug}` })

  // 3. Query Resources based on resolved context
  let query = (supabase.from('resources') as any).select(`
    id, title, slug, file_size, year, created_at, views_count,
    standards(name), subjects(name), resource_types(slug, name)
  `).eq('status', 'published')

  if (standard) query = query.eq('standard_id', standard.id)
  if (subject) query = query.eq('subject_id', subject.id)
  if (resourceType) query = query.eq('resource_type_id', resourceType.id)
  if (examType) query = query.eq('exam_type_id', examType.id)

  const { data: resources, error } = await query.order('created_at', { ascending: false }).limit(100)

  // 4. Generate JSON-LD CollectionPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: standard?.name || resourceType?.name || examType?.name,
    description: `Collection of educational resources for ${standard?.name || resourceType?.name || examType?.name}.`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamileduhub.com'}/${slug.join('/')}`
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 mb-10 border-b border-slate-200 pb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
          {standard && subject && `${standard.name} ${subject.name} Materials`}
          {standard && resourceType && `${standard.name} ${resourceType.name}`}
          {standard && !subject && !resourceType && `${standard.name} Study Materials`}
          {resourceType && !standard && `${resourceType.name} (All Standards)`}
          {examType && !standard && `${examType.name} Papers`}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Browse and download free educational resources, guides, and question papers.
        </p>
      </div>

      {(!resources || resources.length === 0) ? (
        <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No resources available yet</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">We are actively updating materials for this section. Please check back later or try a different category.</p>
          <div className="flex justify-center gap-4">
            <Link href="/" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
              Browse Categories
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {resources.map((resource: any) => (
            <ResourceCard key={resource.id} resource={resource} dict={typeof dict !== 'undefined' ? dict : undefined} />
          ))}
        </div>
      )}
    </div>
  )
}
