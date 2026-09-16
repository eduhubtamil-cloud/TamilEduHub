import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, User } from 'lucide-react'
import Image from 'next/image'

export const metadata = {
  title: 'Blog & Educational News - TamilEduHub',
  description: 'Read the latest educational updates, exam news, and study tips.',
}

export default async function ArticlesPage() {
  const supabase = await createClient()

  // Fetch articles
  const { data: articles, error } = await supabase
    .from('articles')
    .select(`
      id, title, slug, excerpt, featured_image, published_at,
      categories(name),
      profiles(full_name)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error("Fetch Error:", error)
  }

  const displayArticles = (articles || []) as any[]

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Educational Blog & News</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Stay updated with the latest exam announcements, study techniques, and educational news for Tamil Nadu state board students.
        </p>
      </div>

      {displayArticles.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <h3 className="text-xl font-medium text-slate-900 mb-2">No articles published yet</h3>
          <p className="text-slate-500">Check back later for exciting updates and study tips.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayArticles.map((article: any) => (
            <Card key={article.id} className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow group border-slate-200">
              <Link href={`/articles/${article.slug}`} className="contents">
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  {article.featured_image ? (
                    <img 
                      src={article.featured_image} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                      <span className="font-bold text-4xl opacity-20">TamilEduHub</span>
                    </div>
                  )}
                  {article.categories?.name && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-700 shadow-sm">
                      {article.categories.name}
                    </div>
                  )}
                </div>
                <CardContent className="flex-1 p-6 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 mb-6 line-clamp-3 flex-1 text-sm">
                    {article.excerpt || 'Read the full article for more details...'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>{article.profiles?.full_name || 'Admin'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(article.published_at || new Date()).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
