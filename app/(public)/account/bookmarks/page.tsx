import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signout } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bookmark, User } from 'lucide-react'

export const metadata = {
  title: 'My Bookmarks - TamilEduHub',
}

export default async function BookmarksPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/account/login')
  }

  // In a real app, we'd join with resources/articles
  // const { data: bookmarks } = await supabase.from('bookmarks').select('...').eq('user_id', user.id)
  const bookmarks: any[] = [] // placeholder for MVP

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2 text-slate-500" asChild>
            <Link href="/account/profile"><User className="h-4 w-4" /> Profile</Link>
          </Button>
          <Button variant="secondary" className="w-full justify-start gap-2">
            <Bookmark className="h-4 w-4" /> Bookmarks
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
              <CardTitle>Saved Resources & Articles</CardTitle>
            </CardHeader>
            <CardContent>
              {bookmarks.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900">No bookmarks yet</h3>
                  <p className="text-slate-500 mt-2">
                    When you find resources or articles you want to save for later, click the bookmark icon.
                  </p>
                  <Button className="mt-6" asChild>
                    <Link href="/resources">Browse Resources</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Map bookmarks here */}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
