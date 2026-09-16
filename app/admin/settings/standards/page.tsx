import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createStandard, deleteRecord } from '../actions'
import { Trash2 } from 'lucide-react'

export const metadata = { title: 'Manage Standards' }

export default async function StandardsPage() {
  const supabase = await createClient()
  const { data: standards } = await supabase.from('standards').select('*').order('display_order')
  const items = (standards || []) as any[]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Standards (Classes)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-md mb-8">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">Name</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Slug</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Order</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-4 text-center text-slate-500">No standards found</td></tr>
                )}
                {items.map(item => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="px-4 py-3 text-slate-500">{item.slug}</td>
                    <td className="px-4 py-3 text-slate-500">{item.display_order}</td>
                    <td className="px-4 py-3 text-right">
                      <form action={async () => {
                        'use server'
                        await deleteRecord('standards', item.id, '/admin/settings/standards')
                      }}>
                        <Button variant="ghost" size="icon" type="submit" className="text-red-500 h-8 w-8 hover:bg-red-50 hover:text-red-600" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form action={createStandard} className="space-y-4 max-w-sm border-t pt-6">
            <h3 className="font-semibold text-slate-900 mb-2">Add New Standard</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="e.g. 10th Standard" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input id="display_order" name="display_order" type="number" defaultValue="0" />
            </div>
            <Button type="submit">Add Standard</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
