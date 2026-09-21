'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface PrimaryNavProps {
  dict: Record<string, string>
}

export function PrimaryNav({ dict }: PrimaryNavProps) {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/', label: dict.home },
    { href: '/students', label: dict.school },
    { href: '/teachers', label: dict.teachers },
    { href: '/competitive-exams', label: dict.competitiveExams },
    { href: '/search', label: dict.studyMaterials, pattern: '/search' },
    { href: '/collections', label: dict.collections, pattern: '/collections' }, 
  ]

  const isActive = (item: typeof navItems[0]) => {
    if (item.href === '/') return pathname === '/'
    if (item.pattern && pathname.startsWith(item.pattern)) return true
    if (item.href.startsWith('/search') && pathname === '/search') return true
    if (item.href !== '/' && !item.href.startsWith('/search') && pathname.startsWith(item.href)) return true
    return false
  }

  return (
    <nav className="flex items-center justify-center h-full gap-2 xl:gap-6">
      {navItems.map((item) => {
        const active = isActive(item)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex items-center justify-center h-full px-2 text-[14px] xl:text-[15px] font-medium transition-colors duration-200 group ${
              active ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            {/* Text wrapping control for 1024-1280px range */}
            <span className="relative z-10 text-center leading-[1.25] whitespace-nowrap lg:whitespace-normal xl:whitespace-nowrap max-w-[85px] xl:max-w-none">
              {item.label}
            </span>
            
            {/* Signature Brand Detail: Option A - Thin accent line */}
            {active && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-t-sm" aria-hidden="true" />
            )}
            {/* Hover state subtle underline effect */}
            {!active && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-200 rounded-t-sm scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" aria-hidden="true" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
