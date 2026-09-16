import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Previous Year Question Papers - TamilEduHub',
  description: 'Download previous year public exam and revision question papers for Tamil Nadu State Board.',
}

export default async function QuestionPapersPage({
  searchParams,
}: {
  searchParams: Promise<{ standard?: string; subject?: string; year?: string }>
}) {
  const { standard, subject, year } = await searchParams;
  const supabase = await createClient()

  // Fetch filters
  const { data: standards } = await supabase.from('standards').select('id, name').order('display_order')
  const { data: subjects } = await supabase.from('subjects').select('id, name').order('display_order')

  // Fetch papers
  let query = supabase
    .from('question_papers')
    .select(`
      id, title, slug, description, year, exam_type, pdf_url, answer_key_url,
      standards!inner(id, name),
      subjects!inner(id, name)
    `)
    .eq('status', 'published')
    .order('year', { ascending: false, nullsFirst: false })

  if (standard) {
    query = query.eq('standards.id', standard)
  }
  if (subject) {
    query = query.eq('subjects.id', subject)
  }
  if (year) {
    query = query.eq('year', parseInt(year))
  }

  const { data: papers, error } = await query

  const displayPapers = (papers || []) as any[]
  const displayStandards = (standards || []) as any[]
  const displaySubjects = (subjects || []) as any[]

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 sticky top-24">
          <h2 className="font-bold text-lg text-slate-900 mb-4">Filters</h2>
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Standard</label>
              <select name="standard" defaultValue={standard} className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white">
                <option value="">All Standards</option>
                {displayStandards.map(std => (
                  <option key={std.id} value={std.id}>{std.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Subject</label>
              <select name="subject" defaultValue={subject} className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white">
                <option value="">All Subjects</option>
                {displaySubjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Year</label>
              <select name="year" defaultValue={year} className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white">
                <option value="">All Years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
            </div>
            <Button type="submit" className="w-full">Apply Filters</Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Question Papers</h1>
          <p className="text-slate-600">Download previous year public exam and revision test papers.</p>
        </div>

        {displayPapers.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <h3 className="text-lg font-medium text-slate-900">No question papers found</h3>
            <p className="text-slate-500">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayPapers.map((paper: any) => (
              <Card key={paper.id} className="flex flex-col h-full hover:border-blue-400 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 mb-3">
                      {paper.exam_type || 'Exam'} {paper.year ? `(${paper.year})` : ''}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {paper.standards?.name} &bull; {paper.subjects?.name}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    <Link href={`/question-papers/${paper.slug}`} className="hover:text-blue-600 before:absolute before:inset-0">
                      {paper.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {paper.description || 'Download the PDF for complete details.'}
                  </p>
                </CardContent>
                <div className="p-6 pt-0 mt-auto relative z-10 flex flex-col gap-2">
                  {paper.pdf_url && (
                    <Button className="w-full gap-2" variant="default" asChild>
                      <a href={paper.pdf_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" /> Question Paper
                      </a>
                    </Button>
                  )}
                  {paper.answer_key_url && (
                    <Button className="w-full gap-2" variant="outline" asChild>
                      <a href={paper.answer_key_url} target="_blank" rel="noopener noreferrer">
                        <CheckCircle className="h-4 w-4 text-green-600" /> Answer Key
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
