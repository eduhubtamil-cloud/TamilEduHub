import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Share2, FileText, Calendar, LayoutTemplate } from 'lucide-react'

// MVP Mock Data
const resource = {
  id: 'res-123',
  title: '10th Science Important Questions & Answers Guide 2026',
  description: 'Comprehensive guide covering physics, chemistry, and biology important questions for the 2026 board exams.',
  standard: '10th Standard',
  subject: 'Science',
  medium: 'English Medium',
  year: 2026,
  resourceType: 'Study Guide',
  fileSize: '2.4 MB',
  pageCount: 45,
  publishedAt: '2026-08-15',
  pdfUrl: '/placeholder.pdf', // In production, this would be a Supabase Storage URL
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-6">
        <ol className="flex space-x-2">
          <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li>/</li>
          <li><Link href="/resources" className="hover:text-blue-600">Resources</Link></li>
          <li>/</li>
          <li className="text-slate-900 truncate">{resource.title}</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content (PDF Viewer) */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{resource.title}</h1>
            <div className="flex gap-2 shrink-0">
              <BookmarkButton contentId={resource.id} contentType="resource" />
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <p className="text-slate-600 text-lg">{resource.description}</p>

          <div className="aspect-[1/1.4] md:aspect-[16/9] w-full bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative flex flex-col">
            <div className="bg-slate-800 text-white p-3 flex justify-between items-center text-sm">
              <span className="truncate">{resource.title}.pdf</span>
              <Button size="sm" variant="secondary" className="h-8">
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
            {/* MVP Fake PDF Viewer */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">PDF Viewer will be embedded here.</p>
                <p className="text-sm text-slate-400 mt-2">File size: {resource.fileSize} • {resource.pageCount} Pages</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <aside className="w-full lg:w-80 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <Button className="w-full h-12 text-lg gap-2">
                <Download className="h-5 w-5" /> Download PDF
              </Button>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><LayoutTemplate className="h-4 w-4"/> Standard</span>
                  <span className="font-medium text-slate-900">{resource.standard}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><FileText className="h-4 w-4"/> Subject</span>
                  <span className="font-medium text-slate-900">{resource.subject}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><FileText className="h-4 w-4"/> Medium</span>
                  <span className="font-medium text-slate-900">{resource.medium}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><Calendar className="h-4 w-4"/> Year</span>
                  <span className="font-medium text-slate-900">{resource.year}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2"><FileText className="h-4 w-4"/> Type</span>
                  <span className="font-medium text-slate-900">{resource.resourceType}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
