import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { SocialShareButtons } from '@/components/ui/SocialShareButtons'
import { PdfViewer } from '@/components/ui/PdfViewer'
import { ViewTracker } from '@/components/ui/ViewTracker'
import { CommentsSection } from '@/components/ui/CommentsSection'
import { Card, CardContent } from '@/components/ui/card'
import { Download, FileText, Calendar, LayoutTemplate, BookOpen } from 'lucide-react'
import { AdSlot } from '@/components/ui/AdSlot'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ResourceCard } from '@/components/ui/ResourceCard'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('resources').select('title, description, canonical_url, seo_title, seo_description').eq('slug', slug).single()
  const resource = data as any
  
  if (!resource) return { title: 'Resource Not Found' }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamileduhub.com'
  return {
    title: resource.seo_title || `${resource.title} - TamilEduHub`,
    description: resource.seo_description || resource.description || `Download ${resource.title}`,
    alternates: {
      canonical: resource.canonical_url || `${siteUrl}/resources/${slug}`
    }
  }
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('resources')
    .select(`
      *,
      standards(name),
      subjects(name),
      mediums(name),
      resource_types(name)
    `)
    .eq('slug', slug)
    .single()

  if (error || !data) {
    notFound()
  }

  const resource = data as any
  const fileSizeStr = resource.file_size ? `${(resource.file_size / (1024 * 1024)).toFixed(2)} MB` : 'PDF'
  
  // Fetch related resources (same standard or subject, excluding current)
  const { data: relatedData } = await (supabase.from('resources') as any)
    .select('id, title, slug, description, file_size, year, created_at, views_count, standards(name), subjects(name), resource_types(slug, name)')
    .or(`standard_id.eq.${resource.standard_id},subject_id.eq.${resource.subject_id}`)
    .neq('id', resource.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(4)

  const relatedResources = relatedData || []

  // Build Breadcrumbs
  const breadcrumbItems = [
    { label: resource.standards?.name || 'Standards', href: `/${resource.standards?.slug || 'standards'}` },
    { label: resource.subjects?.name || 'Subjects', href: `/${resource.standards?.slug}/${resource.subjects?.slug}` },
    { label: resource.title }
  ]

  // JSON-LD for Educational Resource
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalResource',
    name: resource.title,
    description: resource.description,
    educationalAlignment: {
      '@type': 'AlignmentObject',
      alignmentType: 'educationalLevel',
      educationalFramework: 'Tamil Nadu State Board',
      targetName: resource.standards?.name
    },
    educationalUse: resource.resource_types?.name,
    isAccessibleForFree: true
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="container mx-auto px-4 max-w-7xl">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <ViewTracker id={resource.id} type="resources" />
          <Breadcrumbs items={breadcrumbItems} />
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mt-6">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {resource.standards?.name && (
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {resource.standards.name}
                  </span>
                )}
                {resource.subjects?.name && (
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                    {resource.subjects.name}
                  </span>
                )}
                {resource.mediums?.name && (
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {resource.mediums.name}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">{resource.title}</h1>
            </div>
            
            <div className="flex gap-3 shrink-0 w-full lg:w-auto">
              <Button size="lg" className="flex-1 lg:flex-none h-12 gap-2 bg-blue-600 hover:bg-blue-700 font-semibold" asChild>
                <a href={`/api/download?resource_id=${resource.id}`} target="_blank" rel="noopener noreferrer">
                  <Download className="h-5 w-5" /> Download PDF
                </a>
              </Button>
              <BookmarkButton contentId={resource.id} contentType="resource" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content (PDF Viewer) */}
          <div className="flex-1 space-y-8 min-w-0">
            {resource.description && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-2">About this resource</h3>
                <p className="text-slate-600 text-base md:text-lg whitespace-pre-wrap leading-relaxed">{resource.description}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[700px]">
              <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                  <FileText className="h-4 w-4" /> PDF Document Preview
                </div>
              </div>
              <div className="flex-1 overflow-hidden relative bg-slate-200/50">
                {resource.file_url ? (
                  <PdfViewer url={resource.file_url} title={resource.title} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-slate-500 p-8 text-center">
                    <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-lg font-medium text-slate-700">PDF preview not available</p>
                    <p className="mt-1">This resource may not contain a viewable document.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <CommentsSection contentId={resource.id} contentType="resource" />
            </div>
          </div>

          {/* Sidebar Info */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
            <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Resource Information</h3>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                    <span className="text-slate-500 font-medium">Standard</span>
                    <span className="font-bold text-slate-900 text-right">{resource.standards?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                    <span className="text-slate-500 font-medium">Subject</span>
                    <span className="font-bold text-slate-900 text-right">{resource.subjects?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                    <span className="text-slate-500 font-medium">Medium</span>
                    <span className="font-bold text-slate-900 text-right">{resource.mediums?.name || 'All'}</span>
                  </div>
                  {resource.year && (
                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                      <span className="text-slate-500 font-medium">Academic Year</span>
                      <span className="font-bold text-slate-900 text-right">{resource.year}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                    <span className="text-slate-500 font-medium">Type</span>
                    <span className="font-bold text-slate-900 text-right">{resource.resource_types?.name || 'Document'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
                    <span className="text-slate-500 font-medium">File Size</span>
                    <span className="font-bold text-slate-900 text-right">{fileSizeStr}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Total Views</span>
                    <span className="font-bold text-slate-900 text-right">{resource.views_count || 0}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <SocialShareButtons title={resource.title} description={resource.description} />
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Related Resources */}
        {relatedResources && relatedResources.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BookOpen className="h-5 w-5" /></div>
              தொடர்புடைய கல்வி வளங்கள் (Related)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedResources.map((res: any) => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
