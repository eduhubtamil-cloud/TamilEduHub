import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateCommunityLink } from './actions'

export const metadata = { title: 'Manage Community Links - Admin' }

export default async function CommunityLinksSettingsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('community_links').select('*').order('display_order', { ascending: true })
  const links = (data || []) as any[]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Community Acquisition Links</h2>
        <p className="text-slate-500 text-sm">Manage URLs and visibility for WhatsApp, Telegram, and Google Play buttons on the homepage.</p>
      </div>

      <div className="grid gap-6">
        {links.map((link: any) => (
          <Card key={link.id}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg uppercase tracking-wider text-slate-500 font-bold">{link.platform.replace('_', ' ')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={updateCommunityLink} className="space-y-4">
                <input type="hidden" name="id" value={link.id} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Destination URL</Label>
                    <Input name="url" defaultValue={link.url} placeholder="https://..." required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Button Label</Label>
                    <Input name="label" defaultValue={link.label} required />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description (Subtitle)</Label>
                    <Input name="description" defaultValue={link.description} placeholder="Optional short description..." />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label>QR Code Image URL</Label>
                    <Input name="qr_code_url" defaultValue={link.qr_code_url} placeholder="Optional URL to a QR code image..." />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`enable-${link.id}`} className="font-medium">Enable on Website</Label>
                      <input type="checkbox" id={`enable-${link.id}`} name="is_enabled" defaultChecked={link.is_enabled} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Display Order</Label>
                      <Input name="display_order" type="number" defaultValue={link.display_order} className="w-20 h-8" />
                    </div>
                  </div>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ))}
        {links.length === 0 && (
          <p className="text-slate-500 text-sm">Please run the community_acquisition.sql seed file to initialize these links.</p>
        )}
      </div>
    </div>
  )
}
