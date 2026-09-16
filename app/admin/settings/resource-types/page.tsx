import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createResourceType, updateResourceType, deleteResourceType } from '../actions'

export const metadata = { title: 'Manage Resource Types - Admin' }

export default async function ResourceTypesSettingsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('resource_types').select('*').order('display_order', { ascending: true })
  const resourceTypes = (data || []) as any[]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Resource Types</h2>
        <p className="text-slate-500 text-sm">Manage types of materials like Study Guide, Question Paper, Notes.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Resource Type</CardTitle>
          <CardDescription>Create a new resource type.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createResourceType as any} className="flex items-end gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="e.g. Study Guide" required />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="slug">Slug (URL friendly)</Label>
              <Input id="slug" name="slug" placeholder="e.g. study-guide" required />
            </div>
            <div className="space-y-2 w-24">
              <Label htmlFor="display_order">Order</Label>
              <Input id="display_order" name="display_order" type="number" defaultValue="0" />
            </div>
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {resourceTypes.map((rt: any) => (
          <Card key={rt.id}>
            <CardContent className="p-4">
              <form action={updateResourceType as any} className="flex items-end gap-4">
                <input type="hidden" name="id" value={rt.id} />
                <div className="space-y-2 flex-1">
                  <Label>Name</Label>
                  <Input name="name" defaultValue={rt.name} required />
                </div>
                <div className="space-y-2 flex-1">
                  <Label>Slug</Label>
                  <Input name="slug" defaultValue={rt.slug} required />
                </div>
                <div className="space-y-2 w-24">
                  <Label>Order</Label>
                  <Input name="display_order" type="number" defaultValue={rt.display_order} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="outline">Update</Button>
                  <Button formAction={deleteResourceType as any} variant="destructive">Delete</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ))}
        {resourceTypes.length === 0 && (
          <p className="text-slate-500 text-sm">No resource types found.</p>
        )}
      </div>
    </div>
  )
}
