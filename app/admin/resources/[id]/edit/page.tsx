import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { updateResource } from '@/app/admin/resources/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import { ResourceCategorizationForm } from '@/components/admin/ResourceCategorizationForm'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Resource - TamilEduHub CMS',
}

export default async function EditResourcePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const supabase = await createClient()

  // Fetch the resource
  const { data: resource, error } = await (supabase.from('resources') as any).select('*').eq('id', id).single()
  if (error || !resource) {
    notFound()
  }

  // Fetch data for dropdowns
  const { data: segmentsData } = await (supabase.from('education_segments') as any).select('id, name').order('display_order')
  const { data: standards } = await supabase.from('standards').select('id, name').order('display_order')
  const { data: subjects } = await supabase.from('subjects').select('id, name').order('display_order')
  const { data: mediums } = await supabase.from('mediums').select('id, name')
  const { data: resourceTypes } = await supabase.from('resource_types').select('id, name')
  const { data: examTypes } = await (supabase.from('exam_types') as any).select('id, name')
  
  if (!segmentsData || segmentsData.length === 0) {
    throw new Error('Education segments not found. Please ensure migration 20260919000000_audience_expansion.sql has been executed.')
  }
  const displaySegments = segmentsData as any[]
  
  const displayStandards = (standards || []) as any[]
  const displaySubjects = (subjects || []) as any[]
  const displayMediums = (mediums || []) as any[]
  const displayResourceTypes = (resourceTypes || []) as any[]
  const displayExamTypes = (examTypes || []) as any[]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/resources">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Resource</h1>
            <p className="text-slate-500">Updating metadata and files.</p>
          </div>
        </div>
        <Button variant="outline" asChild className="gap-2">
          <Link href={`/resources/${resource.slug}`} target="_blank">
            <Eye className="h-4 w-4" /> Preview
          </Link>
        </Button>
      </div>

      <form action={updateResource}>
        <input type="hidden" name="id" value={resource.id} />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Resource Title *</Label>
                <Input id="title" name="title" defaultValue={resource.title} placeholder="e.g. 10th Science Study Guide 2026" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea 
                  id="description" 
                  name="description" 
                  defaultValue={resource.description || ''}
                  className="w-full rounded-md border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[100px]"
                  placeholder="Provide a short description of the resource contents..."
                ></textarea>
              </div>
            </CardContent>
          </Card>

          <ResourceCategorizationForm 
            segments={displaySegments}
            standards={displayStandards}
            subjects={displaySubjects}
            mediums={displayMediums}
            resourceTypes={displayResourceTypes}
            examTypes={displayExamTypes}
            defaultValues={resource}
          />

          <Card>
            <CardHeader>
              <CardTitle>Media & Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resource.file_url && (
                <div className="mb-4 p-4 border border-slate-200 rounded-lg bg-slate-50 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Current File</p>
                    <a href={resource.file_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                      View PDF
                    </a>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="file">Replace PDF File (Optional)</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
                  <Input id="file" name="file" type="file" accept=".pdf" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" asChild>
              <Link href="/admin/resources">Cancel</Link>
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
