'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, BookOpen, Search, FileText, Download, TrendingUp, LogIn, User, LogOut, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { signout } from '@/app/auth/actions'

interface MobileNavProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any
  currentLang: 'en' | 'ta'
  children: React.ReactNode // For CommunityLinksWrapper
}

export function MobileNav({ dict, profile, currentLang, children }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden text-slate-600"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Drawer */}
          <div 
            className="relative flex w-full max-w-[300px] flex-col bg-white shadow-xl h-full animate-in slide-in-from-left duration-300"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="font-bold text-xl text-slate-900">TamilEduHub</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-500 rounded-full hover:bg-slate-100" aria-label="Close navigation menu">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="flex flex-col space-y-1 px-3">
                <MobileNavLink href="/" onClick={() => setIsOpen(false)} icon={<BookOpen className="h-4 w-4" />}>{dict.home}</MobileNavLink>
                <MobileNavLink href="/students" onClick={() => setIsOpen(false)} icon={<BookOpen className="h-4 w-4" />}>{dict.school}</MobileNavLink>
                <MobileNavLink href="/teachers" onClick={() => setIsOpen(false)} icon={<FileText className="h-4 w-4" />}>{dict.teachers}</MobileNavLink>
                <MobileNavLink href="/competitive-exams" onClick={() => setIsOpen(false)} icon={<TrendingUp className="h-4 w-4" />}>{dict.competitiveExams}</MobileNavLink>
                <MobileNavLink href="/search" onClick={() => setIsOpen(false)} icon={<Download className="h-4 w-4" />}>{dict.studyMaterials}</MobileNavLink>
                <MobileNavLink href="/collections" onClick={() => setIsOpen(false)} icon={<Search className="h-4 w-4" />}>{dict.collections}</MobileNavLink>
              </nav>

              <div className="my-4 border-t border-slate-100 mx-4" />

              <div className="px-5 mb-4">
                <LanguageSwitcher currentLang={currentLang} />
              </div>

              <div className="my-4 border-t border-slate-100 mx-4" />

              {/* Community Links */}
              <div className="px-5 py-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Community</h4>
                <div onClick={() => setIsOpen(false)}>
                  {children}
                </div>
              </div>
            </div>

            {/* Footer / Account */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
              {profile ? (
                <div className="flex flex-col gap-3">
                  <Link href="/account/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2 hover:bg-slate-200/50 rounded-lg transition-colors">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {profile.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium text-slate-900 truncate">{profile.full_name}</span>
                      <span className="text-xs text-slate-500">{dict.accountSettings || 'Account Settings'}</span>
                    </div>
                  </Link>
                  <Button variant="outline" className="w-full justify-start text-slate-700 font-medium bg-white" asChild>
                    <Link href="/account/bookmarks" onClick={() => setIsOpen(false)}>
                      <Bookmark className="h-4 w-4 mr-2 text-slate-400" />
                      {dict.myBookmarks || 'My Bookmarks'}
                    </Link>
                  </Button>
                  <form action={signout} className="w-full">
                    <Button variant="ghost" type="submit" className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50 font-medium">
                      <LogOut className="h-4 w-4 mr-2" />
                      {dict.logout}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm" asChild>
                    <Link href="/account/login" onClick={() => setIsOpen(false)}>
                      <LogIn className="h-4 w-4 mr-2" />
                      {dict.login}
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full font-medium" asChild>
                    <Link href="/account/register" onClick={() => setIsOpen(false)}>
                      {dict.register}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MobileNavLink({ href, onClick, icon, children }: any) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
    >
      <div className="text-slate-400 group-hover:text-blue-600 transition-colors">{icon}</div>
      {children}
    </Link>
  )
}
