import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Menu, User, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CommunityLinksWrapper } from '@/components/ui/CommunityLinksWrapper'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null as any

  if (user) {
    const { data } = await supabase.from('profiles').select('avatar_url, full_name').eq('id', user.id).single()
    profile = data as any
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white group-hover:bg-blue-700 transition-colors">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl text-slate-900 group-hover:text-blue-700 transition-colors">TamilEduHub</span>
          </Link>
          
          <nav className="hidden xl:flex gap-6 text-sm font-medium">
            <Link href="/" className="transition-colors text-slate-600 hover:text-blue-600">Home</Link>
            <Link href="/standards" className="transition-colors text-slate-600 hover:text-blue-600">????? ???????</Link>
            <Link href="/textbooks" className="transition-colors text-slate-600 hover:text-blue-600">????????????????</Link>
            <Link href="/study-guides" className="transition-colors text-slate-600 hover:text-blue-600">Study Materials</Link>
            <Link href="/question-papers" className="transition-colors text-slate-600 hover:text-blue-600">Question Papers</Link>
            <Link href="/collections" className="transition-colors text-slate-600 hover:text-blue-600">Collections</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <form className="hidden lg:flex relative" action="/search">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="search"
              name="q"
              placeholder="Search resources..."
              className="h-9 w-56 rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:w-72"
            />
          </form>

          <div className="hidden md:flex items-center border-l border-slate-200 pl-4 ml-2">
            <CommunityLinksWrapper location="header" variant="icon" />
          </div>
          
          {user ? (
            <div className="flex items-center gap-3 ml-2">
              <Link href="/account/profile" className="hidden sm:flex h-9 w-9 rounded-full bg-slate-100 overflow-hidden border border-slate-200 items-center justify-center hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 transition-all" title={profile?.full_name || 'My Profile'}>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-4 w-4 text-slate-500" />
                )}
              </Link>
              <Button variant="outline" size="sm" className="hidden sm:inline-flex rounded-full border-slate-200" asChild>
                <Link href="/admin/dashboard">Admin</Link>
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex gap-2 ml-2">
              <Button variant="outline" size="sm" className="rounded-full border-slate-200" asChild>
                <Link href="/account/login">Log In</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="xl:hidden ml-1 text-slate-600">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
