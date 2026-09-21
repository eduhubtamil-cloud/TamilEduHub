import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateProfile, updatePassword } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Camera, KeyRound } from 'lucide-react'
import { AccountSidebar } from '@/components/layout/AccountSidebar'
import { getDictionary } from '@/lib/i18n'

export const metadata = {
  title: 'My Profile - TamilEduHub',
  robots: {
    index: false,
    follow: false,
  }
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  const dict = await getDictionary()

  if (error || !user) {
    redirect('/account/login')
  }

  // Fetch profile data
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
    
  const profile = data as any

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{dict.accountSettings || 'Account Settings'}</h1>
        <p className="text-slate-500">Manage your profile, avatar, and security preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <AccountSidebar profile={profile} user={user} dict={dict} />

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          
          {/* Profile Form */}
          <Card>
            <form action={updateProfile as any}>
              <CardHeader>
                <CardTitle>Public Profile</CardTitle>
                <CardDescription>This information will be displayed on your bookmarks and comments.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-2">
                  <Label htmlFor="full_name">Display Name</Label>
                  <Input 
                    id="full_name" 
                    name="full_name" 
                    defaultValue={profile?.full_name || ''} 
                    placeholder="Enter your full name" 
                    className="max-w-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <label htmlFor="avatar" className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50">
                      <Camera className="h-4 w-4 text-slate-500" />
                      Choose new image...
                      <input id="avatar" name="avatar" type="file" accept="image/*" className="sr-only" />
                    </label>
                    <span className="text-xs text-slate-500">JPG, GIF or PNG. Max size 2MB.</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Label>Email Address</Label>
                  <Input 
                    value={user.email} 
                    disabled 
                    className="max-w-md bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500">To change your email address, please contact support.</p>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t border-slate-100 py-4">
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>

          {/* Security Form */}
          <Card>
            <form action={updatePassword as any}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-slate-400" /> Security
                </CardTitle>
                <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input 
                    id="new_password" 
                    name="new_password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="max-w-md"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-slate-500">Must be at least 6 characters long.</p>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t border-slate-100 py-4">
                <Button variant="outline" type="submit">Update Password</Button>
              </CardFooter>
            </form>
          </Card>

        </div>
      </div>
    </div>
  )
}
