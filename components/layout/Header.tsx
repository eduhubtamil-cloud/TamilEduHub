import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { BookOpen, Search as SearchIcon, User, Bookmark } from 'lucide-react'
import { CommunityLinksWrapper } from '@/components/ui/CommunityLinksWrapper'

import { getDictionary, getLanguage } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { MobileNav } from '@/components/layout/MobileNav'
import { PrimaryNav } from '@/components/layout/PrimaryNav'

import { signout } from '@/app/auth/actions'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const dict = await getDictionary()
  const currentLang = await getLanguage()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let profile: any = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto px-4 lg:px-6 xl:px-8 max-w-[1440px] h-16 flex items-center justify-between gap-4">
        
        {/* ZONE 1: BRAND */}
        <div className="flex items-center shrink-0 h-full">
          <Link href="/" className="flex items-center space-x-2.5 group h-full">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white group-hover:bg-blue-700 transition-colors">
              <BookOpen className="h-[22px] w-[22px] sm:h-6 sm:w-6" />
            </div>
            <span className="font-[650] text-[20px] sm:text-[21px] text-slate-900 tracking-tight">TamilEduHub</span>
          </Link>
        </div>

        {/* ZONE 2: PRIMARY NAVIGATION */}
        <div className="hidden lg:flex flex-1 justify-center h-full px-2 xl:px-4">
          <PrimaryNav dict={dict} />
        </div>

        {/* ZONE 3: UTILITIES & ACTIONS */}
        <div className="flex items-center justify-end gap-3 xl:gap-4 shrink-0">
          
          <LanguageSwitcher currentLang={currentLang as 'en'|'ta'} />
          
          <Link 
            href="/search" 
            className="hidden sm:flex items-center justify-center h-[38px] w-[38px] rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors focus:ring-2 focus:ring-blue-500/20 outline-none" 
            aria-label={dict.search}
          >
            <SearchIcon className="h-[18px] w-[18px]" />
          </Link>

          <div className="hidden md:block w-px h-5 bg-slate-200" aria-hidden="true"></div>

          <div className="hidden md:flex items-center shrink-0" aria-label="Community Links">
            <CommunityLinksWrapper location="header" variant="icon" />
          </div>

          <div className="hidden md:block w-px h-5 bg-slate-200" aria-hidden="true"></div>

          {user ? (
            <div className="hidden sm:flex items-center gap-4 shrink-0">
              <Link href="/account/bookmarks" className="text-slate-500 hover:text-blue-600 transition-colors" aria-label={dict.myBookmarks || 'My Bookmarks'}>
                <Bookmark className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 transition-colors rounded-full pl-1 pr-3 py-1">
                <Link href="/account/profile" className="flex h-7 w-7 rounded-full bg-slate-100 overflow-hidden items-center justify-center" aria-label={dict.myProfile}>
                  {profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-slate-500" />
                  )}
                </Link>
                <form action={signout} className="flex items-center">
                  <button type="submit" className="text-[13px] font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-colors" aria-label={dict.logout}>
                    {dict.logout}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="sm" className="h-[38px] px-3 font-medium text-slate-700" asChild>
                <Link href="/account/register">{dict.register}</Link>
              </Button>
              <Button size="sm" className="h-[38px] px-4 bg-blue-600 hover:bg-blue-700 font-medium rounded-full shadow-sm" asChild>
                <Link href="/account/login">{dict.login}</Link>
              </Button>
            </div>
          )}

          <MobileNav dict={dict} profile={profile} currentLang={currentLang as 'en'|'ta'}>
            <CommunityLinksWrapper location="mobile" variant="compact" />
          </MobileNav>
        </div>

      </div>
    </header>
  )
}
