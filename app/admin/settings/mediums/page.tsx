import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createMedium, updateMedium, deleteMedium } from '../actions'

export const metadata = { title: 'Manage Mediums - Admin' }

export default async function MediumsSettingsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('mediums').select('*').order('display_order', { ascending: true })
  const mediums = (data || []) as any[]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Educational Mediums</h2>
        <p className="text-slate-500 text-sm">Manage teaching mediums like Tamil Medium or English Medium.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Medium</CardTitle>
          <CardDescription>Create a new medium.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createMedium as any} className="flex items-end gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="e.g. Tamil Medium" required />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="slug">Slug (URL friendly)</Label>
              <Input id="slug" name="slug" placeholder="e.g. tamil-medium" required />
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
        {mediums.map((medium: any) => (
          <Card key={medium.id}>
            <CardContent className="p-4">
              <form action={updateMedium as any} className="flex items-end gap-4">
                <input type="hidden" name="id" value={medium.id} />
                <div className="space-y-2 flex-1">
                  <Label>Name</Label>
                  <Input name="name" defaultValue={medium.name} required />
                </div>
                <div className="space-y-2 flex-1">
                  <Label>Slug</Label>
                  <Input name="slug" defaultValue={medium.slug} required />
                </div>
                <div className="space-y-2 w-24">
                  <Label>Order</Label>
                  <Input name="display_order" type="number" defaultValue={medium.display_order} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="outline">Update</Button>
                  <Button formAction={deleteMedium as any} variant="destructive">Delete</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ))}
        {mediums.length === 0 && (
          <p className="text-slate-500 text-sm">No mediums found.</p>
        )}
      </div>
    </div>
  )
}
