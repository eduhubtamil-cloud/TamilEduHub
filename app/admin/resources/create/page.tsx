import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createResource } from '@/app/admin/resources/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'

export const metadata = {
  title: 'Create Resource - TamilEduHub CMS',
}

export default async function CreateResourcePage() {
  const supabase = await createClient()

  // Fetch data for dropdowns
  const { data: standards } = await supabase.from('standards').select('id, name').order('display_order')
  const { data: subjects } = await supabase.from('subjects').select('id, name').order('display_order')
  const { data: mediums } = await supabase.from('mediums').select('id, name')
  const { data: resourceTypes } = await supabase.from('resource_types').select('id, name')
  const displayStandards = (standards || []) as any[]
  const displaySubjects = (subjects || []) as any[]
  const displayMediums = (mediums || []) as any[]
  const displayResourceTypes = (resourceTypes || []) as any[]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/resources">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Resource</h1>
          <p className="text-slate-500">Add a new educational resource to the platform.</p>
        </div>
      </div>

      <form action={createResource}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Resource Title *</Label>
                <Input id="title" name="title" placeholder="e.g. 10th Science Study Guide 2026" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea 
                  id="description" 
                  name="description" 
                  className="w-full rounded-md border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[100px]"
                  placeholder="Provide a short description of the resource contents..."
                ></textarea>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categorization</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="resource_type_id">Resource Type</Label>
                <select id="resource_type_id" name="resource_type_id" className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <option value="">Select Type</option>
                  {displayResourceTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" name="year" type="number" placeholder="2026" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media & Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">PDF File (Optional for now)</Label>
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
              <Save className="h-4 w-4" /> Save & Publish
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
