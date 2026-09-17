import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Calendar, Download, Eye, FileText } from 'lucide-react'

export function ResourceCard({ resource, dict }: { resource: any, dict?: Record<string, string> }) {
  const isQuestionPaper = resource.resource_types?.slug === 'question-papers' || resource.exam_type_id;
  const badgeColor = isQuestionPaper ? 'text-emerald-700 bg-emerald-50' : 'text-blue-700 bg-blue-50';

  return (
    <Card className="hover:shadow-lg transition-shadow group h-full flex flex-col border-slate-200 hover:border-blue-300 overflow-hidden">
      <CardHeader className="pb-3 bg-slate-50/50">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {resource.standards?.name && (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
              {resource.standards.name}
            </span>
          )}
          {resource.subjects?.name && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 truncate">
              {resource.subjects.name}
            </span>
          )}
          {resource.year && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
              <Calendar className="h-3 w-3 mr-1" />
              {resource.year}
            </span>
          )}
        </div>
        <CardTitle className="text-base font-semibold leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
          <Link href={isQuestionPaper ? `/question-papers/${resource.slug}` : `/resources/${resource.slug}`} className="before:absolute before:inset-0">
            {resource.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-auto pb-4 pt-4 border-t border-slate-100 bg-white">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            {resource.file_size && (
              <span className="flex items-center gap-1.5 font-medium">
                <Download className="h-3.5 w-3.5" />
                {(resource.file_size / 1024 / 1024).toFixed(1)} MB
              </span>
            )}
            {(resource.views_count || 0) > 0 && (
              <span className="flex items-center gap-1.5 font-medium">
                <Eye className="h-3.5 w-3.5" />
                {resource.views_count}
              </span>
            )}
            {!resource.file_size && !resource.views_count && (
               <span className="flex items-center gap-1.5 font-medium">
                <FileText className="h-3.5 w-3.5" />
                {dict?.pdfDocument || "PDF Document"}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
