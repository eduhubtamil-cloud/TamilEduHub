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
import { Download, FileText, Calendar, LayoutTemplate } from 'lucide-react'
import { AdSlot } from '@/components/ui/AdSlot'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

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
  const { data: relatedData } = await supabase
    .from('resources')
    .select('id, title, slug, thumbnail_url, standards(name)')
    .or(`standard_id.eq.${resource.standard_id},subject_id.eq.${resource.subject_id}`)
    .neq('id', resource.id)
    .eq('status', 'published')
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ViewTracker id={resource.id} type="resources" />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        {/* Main Content (PDF Viewer) */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{resource.title}</h1>
            <div className="flex gap-2 shrink-0">
              <BookmarkButton contentId={resource.id} contentType="resource" />
            </div>
          </div>
          
          <p className="text-slate-600 text-lg whitespace-pre-wrap">{resource.description}</p>

          {resource.file_url ? (
            <PdfViewer url={resource.file_url} title={resource.title} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-slate-50 text-slate-500 rounded-lg border border-dashed border-slate-200">
              <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p>PDF file not available.</p>
            </div>
          )}

          <CommentsSection contentId={resource.id} contentType="resource" />
        </div>

        {/* Sidebar Info */}
        <aside className="w-full lg:w-80 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              {resource.file_url ? (
                <Button className="w-full h-12 text-lg gap-2" asChild>
                  <a href={`/api/download?resource_id=${resource.id}`} target="_blank" rel="noopener noreferrer">
                    <Download className="h-5 w-5" /> Download PDF
                  </a>
                </Button>
              ) : (
                <Button className="w-full h-12 text-lg gap-2" disabled>
                  File Not Available
                </Button>
              )}

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><LayoutTemplate className="h-4 w-4"/> Standard</span>
                  <span className="font-medium text-slate-900">{resource.standards?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><FileText className="h-4 w-4"/> Subject</span>
                  <span className="font-medium text-slate-900">{resource.subjects?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><FileText className="h-4 w-4"/> Medium</span>
                  <span className="font-medium text-slate-900">{resource.mediums?.name || 'All'}</span>
                </div>
                {resource.year && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2"><Calendar className="h-4 w-4"/> Year</span>
                    <span className="font-medium text-slate-900">{resource.year}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><FileText className="h-4 w-4"/> Type</span>
                  <span className="font-medium text-slate-900">{resource.resource_types?.name || 'Document'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><FileText className="h-4 w-4"/> Size</span>
                  <span className="font-medium text-slate-900">{fileSizeStr}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <SocialShareButtons title={resource.title} description={resource.description} />
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Related Resources */}
      {relatedResources && relatedResources.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Study Materials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedResources.map((res: any) => (
              <Link href={`/resources/${res.slug}`} key={res.id} className="group">
                <Card className="h-full hover:shadow-md transition-shadow border-slate-200">
                  <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden flex items-center justify-center border-b">
                    {res.thumbnail_url ? (
                      <img src={res.thumbnail_url} alt={res.title} className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="h-12 w-12 text-slate-300" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {res.standards?.name}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {res.title}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
