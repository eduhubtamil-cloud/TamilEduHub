import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'

export const metadata = {
  title: 'Create Resource - TamilEduHub CMS',
}

export default function CreateResourcePage() {
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

      <form action="/api/admin/resources" method="POST">
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
                  <option value="1">10th Standard</option>
                  <option value="2">12th Standard</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject_id">Subject *</Label>
                <select id="subject_id" name="subject_id" className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" required>
                  <option value="">Select Subject</option>
                  <option value="1">Tamil</option>
                  <option value="2">English</option>
                  <option value="3">Mathematics</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium_id">Medium</Label>
                <select id="medium_id" name="medium_id" className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <option value="">Select Medium</option>
                  <option value="1">Tamil Medium</option>
                  <option value="2">English Medium</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource_type_id">Resource Type</Label>
                <select id="resource_type_id" name="resource_type_id" className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <option value="">Select Type</option>
                  <option value="1">Study Guide</option>
                  <option value="2">Question Paper</option>
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
                <Label htmlFor="file">PDF File *</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
                  <Input id="file" name="file" type="file" accept=".pdf" className="hidden" />
                  <Label htmlFor="file" className="cursor-pointer flex flex-col items-center">
                    <span className="bg-slate-100 text-slate-700 p-3 rounded-full mb-2">Upload PDF</span>
                    <span className="text-sm text-slate-500">Drag and drop or click to browse</span>
                  </Label>
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
