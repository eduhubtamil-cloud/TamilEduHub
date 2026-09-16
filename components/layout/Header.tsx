import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Menu } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-blue-700">TamilEduHub</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-blue-600">Home</Link>
            <Link href="/school" className="transition-colors hover:text-blue-600">School</Link>
            <Link href="/resources" className="transition-colors hover:text-blue-600">Study Materials</Link>
            <Link href="/articles" className="transition-colors hover:text-blue-600">Articles</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <form className="hidden lg:flex relative" action="/search">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="search"
              name="q"
              placeholder="Search resources..."
              className="h-9 w-64 rounded-md border border-slate-300 bg-slate-50 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </form>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="/account/login">Log In</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
