import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, FolderOpen, Download, Users, FileQuestion, Newspaper } from 'lucide-react'

export const metadata = {
  title: 'Admin Dashboard - TamilEduHub',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Set up date for today's downloads
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Fetch real counts from the database
  const [
    { count: resourcesCount },
    { count: questionPapersCount },
    { count: articlesCount },
    { count: usersCount },
    { count: todayDownloads },
    { count: allTimeDownloads }
  ] = await Promise.all([
    supabase.from('resources').select('*', { count: 'exact', head: true }),
    supabase.from('question_papers').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('downloads').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
    supabase.from('downloads').select('*', { count: 'exact', head: true })
  ])

  // Get recently added resources for the activity feed
  const { data: recentResources } = await supabase
    .from('resources')
    .select('id, title, created_at, status')
    .order('created_at', { ascending: false })
    .limit(5)

  // Get top downloaded resources
  const { data: topResources } = await supabase
    .from('resources')
    .select('id, title, downloads')
    .order('downloads', { ascending: false })
    .limit(5)

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Welcome to the TamilEduHub content management system.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Today's Downloads</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-2">{todayDownloads || 0}</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Total Downloads</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{allTimeDownloads || 0}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Total Resources</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{resourcesCount || 0}</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Question Papers</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{questionPapersCount || 0}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Articles</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{articlesCount || 0}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Registered Users</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{usersCount || 0}</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Most Downloaded */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top Downloaded (All Time)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topResources && topResources.length > 0 ? (
                  topResources.map((res: any) => (
                    <div key={res.id} className="flex flex-col border-b pb-3 last:border-0 last:pb-0">
                      <span className="font-medium text-sm text-slate-900 line-clamp-2">{res.title}</span>
                      <span className="text-xs text-emerald-600 mt-1">{res.downloads || 0} downloads</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-8 text-sm">No downloads yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recently Added Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentResources && recentResources.length > 0 ? (
                  recentResources.map((res: any) => (
                    <div key={res.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div>
                        <p className="font-medium text-slate-900 text-sm line-clamp-1">{res.title}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(res.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-8 text-sm">No resources uploaded yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a href="/admin/resources/create" className="flex items-center p-3 text-slate-700 hover:bg-slate-50 rounded-md border border-slate-200 transition-colors text-sm font-medium">
                <FolderOpen className="h-4 w-4 mr-3 text-blue-600" />
                Upload Resource
              </a>
              <a href="/admin/question-papers/create" className="flex items-center p-3 text-slate-700 hover:bg-slate-50 rounded-md border border-slate-200 transition-colors text-sm font-medium">
                <FileQuestion className="h-4 w-4 mr-3 text-purple-600" />
                Add Question Paper
              </a>
              <a href="/admin/articles/create" className="flex items-center p-3 text-slate-700 hover:bg-slate-50 rounded-md border border-slate-200 transition-colors text-sm font-medium">
                <Newspaper className="h-4 w-4 mr-3 text-amber-600" />
                Write Article
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
