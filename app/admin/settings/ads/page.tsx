import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createAd, updateAd, deleteAd } from './actions'

export const metadata = { title: 'Manage Advertisements - Admin' }

export default async function AdsSettingsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('advertisements').select('*').order('created_at', { ascending: false })
  const ads = (data || []) as any[]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Advertisements</h2>
        <p className="text-slate-500 text-sm">Manage ad slots (e.g. Google AdSense) across the website.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add New Advertisement</CardTitle>
          <CardDescription>Create a new ad snippet.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createAd as any} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name (Internal)</Label>
                <Input id="name" name="name" placeholder="e.g. Homepage Top Banner" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location ID</Label>
                <Input id="location" name="location" placeholder="e.g. homepage_top" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ad_code">HTML / JS Code</Label>
              <textarea 
                id="ad_code" 
                name="ad_code" 
                className="w-full min-h-[100px] border border-slate-200 rounded-md p-2 font-mono text-sm" 
                placeholder="Paste your <iframe> or <script> tags here" 
                required 
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_active" name="is_active" defaultChecked className="rounded border-slate-300" />
              <Label htmlFor="is_active">Active</Label>
            </div>
            <Button type="submit">Create Advertisement</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {ads.map((ad: any) => (
          <Card key={ad.id}>
            <CardContent className="p-6">
              <form action={updateAd as any} className="space-y-4">
                <input type="hidden" name="id" value={ad.id} />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input name="name" defaultValue={ad.name} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input name="location" defaultValue={ad.location} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>HTML / JS Code</Label>
                  <textarea 
                    name="ad_code" 
                    defaultValue={ad.ad_code} 
                    className="w-full min-h-[100px] border border-slate-200 rounded-md p-2 font-mono text-sm" 
                    required 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="is_active" defaultChecked={ad.is_active} className="rounded border-slate-300" />
                    <Label>Active</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="submit" variant="outline" size="sm">Update</Button>
                    <Button formAction={deleteAd as any} variant="destructive" size="sm">Delete</Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        ))}
        {ads.length === 0 && (
          <p className="text-slate-500 text-sm">No advertisements created yet.</p>
        )}
      </div>
    </div>
  )
}
