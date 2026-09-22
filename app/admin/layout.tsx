import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, FileText, FolderOpen, Users, Settings, LogOut, FileQuestion } from 'lucide-react'
import { signout } from '@/app/auth/actions'

export const metadata = {
  title: 'Admin Dashboard - TamilEduHub',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/account/login')
  }

  // TODO: Check if user has admin role from profiles table

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-white font-bold text-lg">TamilEduHub CMS</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          <Link href="/admin/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white">
            <LayoutDashboard className="mr-3 flex-shrink-0 h-5 w-5" /> Dashboard
          </Link>
          <Link href="/admin/articles" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white">
            <FileText className="mr-3 flex-shrink-0 h-5 w-5" /> Articles
          </Link>
          <Link href="/admin/question-papers" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white">
            <FileQuestion className="mr-3 flex-shrink-0 h-5 w-5" /> Question Papers
          </Link>
          <Link href="/admin/resources" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white">
            <FolderOpen className="mr-3 flex-shrink-0 h-5 w-5" /> Resources
          </Link>
          <Link href="/admin/users" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white">
            <Users className="mr-3 flex-shrink-0 h-5 w-5" /> Users
          </Link>
          <Link href="/admin/settings" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-white">
            <Settings className="mr-3 flex-shrink-0 h-5 w-5" /> Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <form action={signout}>
            <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800" type="submit">
              <LogOut className="mr-3 h-5 w-5" /> Log out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
