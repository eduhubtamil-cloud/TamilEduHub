import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { BookOpen, Search as SearchIcon, Menu, User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { CommunityLinksWrapper } from '@/components/ui/CommunityLinksWrapper'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: any = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/" className="flex items-center space-x-2 group shrink-0">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white group-hover:bg-blue-500 transition-colors shadow-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">TamilEduHub</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="transition-colors text-slate-600 hover:text-blue-600">Home</Link>
            <Link href="/standards" className="transition-colors text-slate-600 hover:text-blue-600">பள்ளி வளங்கள்</Link>
            <Link href="/textbooks" className="transition-colors text-slate-600 hover:text-blue-600">பாடப்புத்தகங்கள்</Link>
            <Link href="/study-guides" className="transition-colors text-slate-600 hover:text-blue-600">Study Materials</Link>
            <Link href="/question-papers" className="transition-colors text-slate-600 hover:text-blue-600">Question Papers</Link>
            <Link href="/collections" className="transition-colors text-slate-600 hover:text-blue-600">Collections</Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3 md:gap-5">
          <form action="/search" method="GET" className="hidden sm:flex items-center relative flex-1 max-w-[280px]">
            <SearchIcon className="absolute left-3 h-4 w-4 text-slate-400" />
            <input 
              type="search" 
              name="q" 
              placeholder="Search resources..." 
              className="w-full h-10 pl-9 pr-4 rounded-full bg-slate-100 border-transparent text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            />
          </form>

          <div className="hidden md:block border-l border-slate-200 h-6 mx-1"></div>

          <CommunityLinksWrapper location="header" variant="icon" />

          <div className="hidden md:block border-l border-slate-200 h-6 mx-1"></div>

          {user ? (
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/account/profile" className="hidden sm:flex h-9 w-9 rounded-full bg-slate-100 overflow-hidden border border-slate-200 items-center justify-center hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 transition-all" title={profile?.full_name || 'My Profile'}>
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-slate-500" />
                )}
              </Link>
              <form action="/auth/signout" method="post">
                <Button variant="ghost" size="sm" type="submit" className="text-slate-600 hover:text-slate-900 font-medium">Log Out</Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center shrink-0">
              <Button variant="outline" size="sm" className="hidden sm:flex mr-2 font-medium" asChild>
                <Link href="/account/register">Register</Link>
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 font-medium shadow-sm" asChild>
                <Link href="/account/login">Log In</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="lg:hidden text-slate-600">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

      </div>
    </header>
  )
}
