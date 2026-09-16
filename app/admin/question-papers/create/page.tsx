import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createQuestionPaper } from '@/app/admin/question-papers/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'

export const metadata = {
  title: 'Add Question Paper - TamilEduHub CMS',
}

export default async function CreateQuestionPaperPage() {
  const supabase = await createClient()

  // Fetch data for dropdowns
  const { data: standards } = await supabase.from('standards').select('id, name').order('display_order')
  const { data: subjects } = await supabase.from('subjects').select('id, name').order('display_order')
  const { data: mediums } = await supabase.from('mediums').select('id, name')
  const displayStandards = (standards || []) as any[]
  const displaySubjects = (subjects || []) as any[]
  const displayMediums = (mediums || []) as any[]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/question-papers">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add Question Paper</h1>
          <p className="text-slate-500">Upload a past exam paper and optional answer key.</p>
        </div>
      </div>

      <form action={createQuestionPaper}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" placeholder="e.g. 10th Public Exam Math Paper 2023" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea 
                  id="description" 
                  name="description" 
                  className="w-full min-h-[100px] rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Any additional notes or instructions..."
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="standard_id">Standard *</Label>
                  <select id="standard_id" name="standard_id" className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" required>
                    <option value="">Select Standard</option>
                    {displayStandards.map(std => (
                      <option key={std.id} value={std.id}>{std.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject_id">Subject *</Label>
                  <select id="subject_id" name="subject_id" className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" required>
                    <option value="">Select Subject</option>
                    {displaySubjects.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medium_id">Medium</Label>
                  <select id="medium_id" name="medium_id" className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <option value="">Select Medium</option>
                    {displayMediums.map(med => (
                      <option key={med.id} value={med.id}>{med.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" name="year" type="number" placeholder="e.g. 2023" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="exam_type">Exam Type</Label>
                  <select id="exam_type" name="exam_type" className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <option value="">Select Exam Type</option>
                    <option value="Public Exam">Public Exam</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Revision Test">Revision Test</option>
                    <option value="Unit Test">Unit Test</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file">Question Paper PDF *</Label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span></p>
                      <p className="text-xs text-slate-500">PDF (Max 50MB)</p>
                    </div>
                    <input id="file" name="file" type="file" accept=".pdf" className="hidden" required />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer_key">Answer Key PDF (Optional)</Label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="answer_key" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload Answer Key</span></p>
                      <p className="text-xs text-slate-500">PDF (Max 50MB)</p>
                    </div>
                    <input id="answer_key" name="answer_key" type="file" accept=".pdf" className="hidden" />
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4 border-t border-slate-200 p-6">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/question-papers">Cancel</Link>
              </Button>
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" /> Save & Publish
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
