import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SocialShareButtons } from '@/components/ui/SocialShareButtons'
import { PdfViewer } from '@/components/ui/PdfViewer'
import { ViewTracker } from '@/components/ui/ViewTracker'
import { CommentsSection } from '@/components/ui/CommentsSection'
import { Download, FileText, Calendar, BookOpen, CheckCircle, ExternalLink } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase.from('question_papers').select('title, description').eq('slug', slug).single()
  const paper = data as any
  
  if (!paper) return { title: 'Question Paper Not Found' }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamil-edu-hub.vercel.app'
  
  const title = `${paper.title} - TamilEduHub`
  const description = paper.description || `Download ${paper.title}`
  const url = `${siteUrl}/question-papers/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  }
}

export default async function QuestionPaperDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('question_papers')
    .select(`
      *,
      standards(name),
      subjects(name),
      mediums(name)
    `)
    .eq('slug', slug)
    .single()

  if (error || !data) {
    notFound()
  }

  const paper = data as any

  // Fetch related QPs
  const { data: relatedData } = await supabase
    .from('question_papers')
    .select('id, title, slug, standards(name)')
    .or(`standard_id.eq.${paper.standard_id},subject_id.eq.${paper.subject_id}`)
    .neq('id', paper.id)
    .eq('status', 'published')
    .limit(4)

  const relatedPapers = relatedData || []

  // JSON-LD for Question Paper
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: paper.title,
    description: paper.description || `Question paper for ${paper.standards?.name || ''} ${paper.subjects?.name || ''}`,
    educationalAlignment: {
      '@type': 'AlignmentObject',
      alignmentType: 'educationalLevel',
      educationalFramework: 'Tamil Nadu State Board',
      targetName: paper.standards?.name
    },
    educationalUse: 'Exam Preparation',
    isAccessibleForFree: true
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ViewTracker id={paper.id} type="question_papers" />
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            {paper.standards?.name}
          </span>
          <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
            {paper.subjects?.name}
          </span>
          {paper.year && (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              {paper.year}
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {paper.title}
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Description</h3>
              <div className="prose max-w-none text-slate-600">
                {paper.description ? (
                  <p className="whitespace-pre-wrap">{paper.description}</p>
                ) : (
                  <p>No description provided for this question paper.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {paper.pdf_url && (
            <div className="mt-8">
              <PdfViewer url={paper.pdf_url} title={paper.title} />
            </div>
          )}

          <CommentsSection contentId={paper.id} contentType="question_paper" />
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Paper Details</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3 text-slate-600">
                  <FileText className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">Exam Type</p>
                    <p>{paper.exam_type || 'N/A'}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">Year</p>
                    <p>{paper.year || 'N/A'}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <BookOpen className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-900">Medium</p>
                    <p>{paper.mediums?.name || 'All'}</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {paper.pdf_url ? (
              <>
                <Button size="lg" className="w-full gap-2 text-base h-14 bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm" asChild>
                  <a href={`/api/download?qp_id=${paper.id}`} target="_blank" rel="noopener noreferrer">
                    <Download className="h-5 w-5" />
                    Download Question Paper
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="w-full gap-2 text-slate-700 hover:text-blue-600 font-medium h-10" asChild>
                  <a href={paper.pdf_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 text-slate-500" /> Open in Google Drive
                  </a>
                </Button>
              </>
            ) : (
              <Button size="lg" className="w-full gap-2 text-base h-14" disabled>
                File Not Available
              </Button>
            )}

            {paper.answer_key_url && (
              <Button size="lg" variant="outline" className="w-full gap-2 text-base h-14 border-green-200 text-green-700 hover:bg-green-50" asChild>
                <a href={paper.answer_key_url} target="_blank" rel="noopener noreferrer">
                  <CheckCircle className="h-5 w-5" />
                  Download Answer Key
                </a>
              </Button>
            )}

            <div className="pt-4 mt-4 border-t border-slate-100">
              <SocialShareButtons title={paper.title} description={paper.description} />
            </div>
          </div>
        </div>
      </div>

      {/* Related Question Papers */}
      {relatedPapers && relatedPapers.length > 0 && (
        <div className="mt-16 pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Question Papers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedPapers.map((res: any) => (
              <Link href={`/question-papers/${res.slug}`} key={res.id} className="group">
                <Card className="h-full hover:shadow-md transition-shadow border-slate-200">
                  <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden flex items-center justify-center border-b">
                    <FileText className="h-12 w-12 text-slate-300" />
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
