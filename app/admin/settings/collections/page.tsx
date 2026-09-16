import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createCollection, deleteCollection } from '../actions'

export const metadata = { title: 'Manage Collections - Admin' }

export default async function CollectionsSettingsPage() {
  const supabase = await createClient()
  const { data: collections } = await supabase.from('collections').select('*').order('display_order', { ascending: true })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Resource Collections</h2>
        <p className="text-slate-500 text-sm">Create database-driven landing pages (e.g., "Quarterly Question Papers").</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCollection} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Collection Title</Label>
                <Input id="title" name="title" required placeholder="e.g. Quarterly Question Papers" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input id="display_order" name="display_order" type="number" defaultValue="0" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Optional description..." />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="query_rules">Query Rules (JSON)</Label>
                <Textarea id="query_rules" name="query_rules" required defaultValue='{"resource_type_slug": "question-paper", "exam_type_slug": "quarterly"}' />
                <p className="text-xs text-slate-500">Keys: resource_type_slug, exam_type_slug, subject_slug, standard_slug, etc.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 py-2">
              <input type="checkbox" id="is_featured" name="is_featured" className="rounded" />
              <Label htmlFor="is_featured">Feature on Homepage</Label>
            </div>
            <Button type="submit">Create Collection</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900">Existing Collections</h3>
        <div className="grid gap-4">
          {collections?.map((col: any) => (
            <div key={col.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
              <div>
                <p className="font-medium text-slate-900">{col.title} <span className="text-xs text-slate-500 font-normal">(/collections/{col.slug})</span></p>
                <pre className="text-xs text-slate-500 mt-1">{JSON.stringify(col.query_rules)}</pre>
              </div>
              <form action={deleteCollection}>
                <input type="hidden" name="id" value={col.id} />
                <Button variant="destructive" size="sm" type="submit">Delete</Button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
