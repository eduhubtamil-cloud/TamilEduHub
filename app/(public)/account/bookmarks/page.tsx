import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Bookmark, FileText, Newspaper, FileQuestion, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'My Bookmarks - TamilEduHub',
}

export default async function BookmarksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/account/login')
  }

  // Fetch all bookmarks for the user
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const displayBookmarks = (bookmarks || []) as any[]
  
  // Group IDs by content type
  const resourceIds = displayBookmarks.filter(b => b.content_type === 'resource').map(b => b.content_id)
  const articleIds = displayBookmarks.filter(b => b.content_type === 'article').map(b => b.content_id)
  const qpIds = displayBookmarks.filter(b => b.content_type === 'question_paper').map(b => b.content_id)

  // Fetch actual content
  const [
    { data: resources },
    { data: articles },
    { data: qps }
  ] = await Promise.all([
    resourceIds.length > 0 ? supabase.from('resources').select('id, title, slug, description').in('id', resourceIds) : Promise.resolve({ data: [] }),
    articleIds.length > 0 ? supabase.from('articles').select('id, title, slug, excerpt').in('id', articleIds) : Promise.resolve({ data: [] }),
    qpIds.length > 0 ? supabase.from('question_papers').select('id, title, slug, description').in('id', qpIds) : Promise.resolve({ data: [] })
  ])

  // Create lookup maps
  const resourceMap = new Map((resources || []).map((r: any) => [r.id, r]))
  const articleMap = new Map((articles || []).map((a: any) => [a.id, a]))
  const qpMap = new Map((qps || []).map((q: any) => [q.id, q]))

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          <Bookmark className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Bookmarks</h1>
          <p className="text-slate-500">Your saved study materials, question papers, and articles.</p>
        </div>
      </div>

      {displayBookmarks.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Bookmark className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-900 mb-2">No bookmarks yet</h3>
          <p className="text-slate-500">Save resources and articles to find them easily later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBookmarks.map((bookmark) => {
            let item: any = null
            let icon = null
            let href = ''
            let tag = ''

            if (bookmark.content_type === 'resource') {
              item = resourceMap.get(bookmark.content_id)
              icon = <FileText className="h-4 w-4 text-blue-600" />
              tag = 'Study Material'
              href = `/resources/${item?.slug}`
            } else if (bookmark.content_type === 'article') {
              item = articleMap.get(bookmark.content_id)
              icon = <Newspaper className="h-4 w-4 text-amber-600" />
              tag = 'Article'
              href = `/articles/${item?.slug}`
            } else if (bookmark.content_type === 'question_paper') {
              item = qpMap.get(bookmark.content_id)
              icon = <FileQuestion className="h-4 w-4 text-purple-600" />
              tag = 'Question Paper'
              href = `/question-papers/${item?.slug}`
            }

            if (!item) return null // If content was deleted

            return (
              <Card key={bookmark.id} className="flex flex-col h-full hover:shadow-md transition-shadow group">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700`}>
                      {icon}
                      {tag}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    <Link href={href} className="hover:text-blue-600 before:absolute before:inset-0">
                      {item.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-slate-500 text-sm line-clamp-3 flex-1">
                    {item.description || item.excerpt || 'No description available.'}
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    Read more <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
