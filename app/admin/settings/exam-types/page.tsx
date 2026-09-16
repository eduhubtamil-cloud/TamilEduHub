import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createExamType, deleteExamType } from '../actions'

export const metadata = { title: 'Manage exam_types - Admin' }

export default async function exam_typesSettingsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('exam_types').select('*').order('display_order', { ascending: true })
  const exam_types = (data || []) as any[]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Educational exam_types</h2>
        <p className="text-slate-500 text-sm">Manage teaching exam_types like Tamil exam_type or English exam_type.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New exam_type</CardTitle>
          <CardDescription>Create a new exam_type.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createExamType as any} className="flex items-end gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="e.g. Tamil exam_type" required />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="slug">Slug (URL friendly)</Label>
              <Input id="slug" name="slug" placeholder="e.g. tamil-exam_type" required />
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
        {exam_types.map((exam_type: any) => (
          <Card key={exam_type.id}>
            <CardContent className="p-4">
              <form action={createExamType as any} className="flex items-end gap-4">
                <input type="hidden" name="id" value={exam_type.id} />
                <div className="space-y-2 flex-1">
                  <Label>Name</Label>
                  <Input name="name" defaultValue={exam_type.name} required />
                </div>
                <div className="space-y-2 flex-1">
                  <Label>Slug</Label>
                  <Input name="slug" defaultValue={exam_type.slug} required />
                </div>
                <div className="space-y-2 w-24">
                  <Label>Order</Label>
                  <Input name="display_order" type="number" defaultValue={exam_type.display_order} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="outline">Update</Button>
                  <Button formAction={deleteExamType as any} variant="destructive">Delete</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ))}
        {exam_types.length === 0 && (
          <p className="text-slate-500 text-sm">No exam_types found.</p>
        )}
      </div>
    </div>
  )
}
