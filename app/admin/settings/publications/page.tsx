import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createPublication, updatePublication, deletePublication } from '../actions'

export const metadata = { title: 'Manage Publications - Admin' }

export default async function PublicationsSettingsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('publications').select('*').order('display_order', { ascending: true })
  const publications = (data || []) as any[]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Educational Publications</h2>
        <p className="text-slate-500 text-sm">Manage book and guide publishers like Sura Publications, Konar Publications, Loyola, etc.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Publication</CardTitle>
          <CardDescription>Create a new publication or publisher.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createPublication as any} className="flex items-end gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="e.g. Sura Publications" required />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="slug">Slug (URL friendly)</Label>
              <Input id="slug" name="slug" placeholder="e.g. sura-publications" required />
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
        {publications.map((publication: any) => (
          <Card key={publication.id}>
            <CardContent className="p-4">
              <form action={updatePublication as any} className="flex items-end gap-4">
                <input type="hidden" name="id" value={publication.id} />
                <div className="space-y-2 flex-1">
                  <Label>Name</Label>
                  <Input name="name" defaultValue={publication.name} required />
                </div>
                <div className="space-y-2 flex-1">
                  <Label>Slug</Label>
                  <Input name="slug" defaultValue={publication.slug} required />
                </div>
                <div className="space-y-2 w-24">
                  <Label>Order</Label>
                  <Input name="display_order" type="number" defaultValue={publication.display_order} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="outline">Update</Button>
                  <Button formAction={deletePublication as any} variant="destructive">Delete</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ))}
        {publications.length === 0 && (
          <p className="text-slate-500 text-sm">No publications found.</p>
        )}
      </div>
    </div>
  )
}
