'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, LogOut, Bookmark, Settings } from 'lucide-react'
import { signout } from '@/app/auth/actions'

interface AccountSidebarProps {
  profile: any
  user: any
  dict: any
}

export function AccountSidebar({ profile, user, dict }: AccountSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/account/profile', label: dict.accountSettings || 'Account Settings', icon: <Settings className="h-4 w-4" /> },
    { href: '/account/bookmarks', label: dict.myBookmarks || 'My Bookmarks', icon: <Bookmark className="h-4 w-4" /> },
  ]

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-4">
      {/* Profile Card */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-6 text-center">
          <div className="mx-auto h-24 w-24 rounded-full bg-slate-200 mb-4 overflow-hidden border-4 border-white shadow-sm flex items-center justify-center">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-slate-400" />
            )}
          </div>
          <h3 className="font-semibold text-slate-900">{profile?.full_name || 'Student'}</h3>
          <p className="text-sm text-slate-500 truncate" title={user?.email}>{user?.email}</p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <nav className="flex flex-col space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <span className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}>
                {item.icon}
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="pt-2 border-t border-slate-100">
        <form action={signout}>
          <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50 gap-3 px-4 py-2.5 h-auto font-medium" type="submit">
            <LogOut className="h-4 w-4" /> {dict.logout}
          </Button>
        </form>
      </div>
    </aside>
  )
}
