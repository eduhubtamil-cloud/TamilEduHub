import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signout } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from 'lucide-react'

export const metadata = {
  title: 'My Profile - TamilEduHub',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/account/login')
  }

  // Fetch profile data
  const { data: rawProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
    
  const profile = rawProfile as any;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-2">
            <User className="h-4 w-4" /> Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-slate-500">
             Bookmarks
          </Button>
          <form action={signout} className="pt-4">
            <Button variant="destructive" className="w-full" type="submit">
              Log out
            </Button>
          </form>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-slate-500 block">Email Address</span>
                <span className="text-base text-slate-900">{user.email}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-500 block">Full Name</span>
                <span className="text-base text-slate-900">{profile?.full_name || 'Not provided'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
